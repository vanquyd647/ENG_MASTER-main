import type { IncomingMessage, ServerResponse } from "node:http";
import type { ApiResult } from "./gemini";
import {
  ApiSecurityError,
  authorizeAiRequest,
  type AiEndpoint,
} from "./apiSecurity";

type VercelRequest = IncomingMessage & {
  body?: unknown;
  socket?: IncomingMessage["socket"];
};

type GeminiAction = (body: unknown) => Promise<ApiResult>;
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
    await authorize(authorization, endpoint);

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
      console.warn("Invalid Gemini API request body:", error instanceof Error ? error.message : String(error));
      sendJson(res, 400, { error: "Request body must be valid JSON.", code: "invalid_json" });
      return;
    }

    const result = await action(body);
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
    console.error("Gemini API handler error:", error);
    sendJson(res, 500, { error: "AI endpoint failed before completing the request.", code: "api_handler_failed" });
  }
}
