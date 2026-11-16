import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { ApiResult, AiContext } from "./gemini.js";
import {
  ApiSecurityError,
  authorizeAiRequest,
  type AiEndpoint,
} from "./apiSecurity.js";

type VercelRequest = IncomingMessage & {
  body?: unknown;
  socket?: IncomingMessage["socket"];
};

type GeminiAction = (body: unknown, context?: AiContext) => Promise<ApiResult>;
type AuthorizeRequest = (
  authorization: string | undefined,
  endpoint: AiEndpoint,
) => Promise<{ uid: string }>;

const MAX_BODY_BYTES = 64 * 1024;

class PayloadTooLargeError extends Error {}

const sendJson = (
  res: ServerResponse,
  status: number,
  body: unknown,
  headers: Record<string, string> = {},
) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    ...headers,
  });
  res.end(JSON.stringify(body));
};

const parseBodyValue = (body: unknown): unknown => {
  if (typeof body === "string") {
    return body.trim() ? JSON.parse(body) : {};
  }
  if (Buffer.isBuffer(body)) {
    const raw = body.toString("utf8");
    return raw.trim() ? JSON.parse(raw) : {};
  }
  return body ?? {};
};

const readBody = async (req: VercelRequest): Promise<unknown> => {
  if (req.body !== undefined) {
    const bytes = Buffer.byteLength(
      typeof req.body === "string"
        ? req.body
        : Buffer.isBuffer(req.body)
          ? req.body
          : JSON.stringify(req.body),
    );
    if (bytes > MAX_BODY_BYTES) throw new PayloadTooLargeError();
    return parseBodyValue(req.body);
  }

  const chunks: Buffer[] = [];
  let totalBytes = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buffer.byteLength;
    if (totalBytes > MAX_BODY_BYTES) throw new PayloadTooLargeError();
    chunks.push(buffer);
  }

  return parseBodyValue(Buffer.concat(chunks));
};

export async function handleGeminiApi(
  req: VercelRequest,
  res: ServerResponse,
  action: GeminiAction,
  endpoint: AiEndpoint,
  authorize: AuthorizeRequest = authorizeAiRequest,
) {
  try {
    if (req.method !== "POST") {
      sendJson(
        res,
        405,
        { error: "Method not allowed", code: "method_not_allowed" },
        { Allow: "POST" },
      );
      return;
    }

    const authorization = Array.isArray(req.headers.authorization)
      ? req.headers.authorization[0]
      : req.headers.authorization;
    const actor = await authorize(authorization, endpoint);
    const requestId = randomUUID();

    let body: unknown;
    try {
      body = await readBody(req);
    } catch (error) {
      if (error instanceof PayloadTooLargeError) {
        sendJson(res, 413, {
          error: "Request body exceeds the 64 KB limit.",
          code: "payload_too_large",
        });
        return;
      }
      console.warn(JSON.stringify({ service: "api", code: "invalid_json", requestId }));
      sendJson(res, 400, { error: "Request body must be valid JSON.", code: "invalid_json" });
      return;
    }

    const result = await action(body, { uid: actor.uid, requestId });
    sendJson(res, result.status, result.body);
  } catch (error) {
    if (error instanceof ApiSecurityError) {
      sendJson(
        res,
        error.status,
        { error: error.message, code: error.code },
        error.retryAfterSeconds
          ? { "Retry-After": String(error.retryAfterSeconds) }
          : {},
      );
      return;
    }
    if (error instanceof Error && /default credentials|credential implementation|private key|service account|metadata server/i.test(error.message)) {sendJson(res,503,{error:"Máy chủ chưa cấu hình Firebase Admin để kiểm tra hạn mức AI.",code:"admin_not_configured"});return;}
    console.error(JSON.stringify({ service: "api", code: "api_handler_failed" }));
    sendJson(res, 500, { error: "AI endpoint failed before completing the request.", code: "api_handler_failed" });
  }
}
