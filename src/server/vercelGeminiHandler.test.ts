// @vitest-environment node

import type { IncomingMessage, ServerResponse } from "node:http";
import { Readable } from "node:stream";
import { describe, expect, it, vi } from "vitest";
import { ApiSecurityError } from "./apiSecurity";
import { handleGeminiApi } from "./vercelGeminiHandler";

const createResponse = () => {
  const result = {
    status: 0,
    headers: {} as Record<string, string>,
    body: "",
  };
  const response = {
    writeHead(status: number, headers: Record<string, string>) {
      result.status = status;
      result.headers = headers;
      return response;
    },
    end(body: string) {
      result.body = body;
      return response;
    },
  } as unknown as ServerResponse;
  return { response, result };
};

const createRequest = (
  method: string,
  body: unknown,
  authorization = "Bearer token",
) =>
  ({
    method,
    body,
    headers: { authorization },
  }) as IncomingMessage & { body?: unknown };

describe("Gemini HTTP handler", () => {
  it("returns 405 before authentication for unsupported methods", async () => {
    const { response, result } = createResponse();
    const authorize = vi.fn();
    await handleGeminiApi(
      createRequest("GET", undefined),
      response,
      async () => ({ status: 200, body: {} }),
      "explain",
      authorize,
    );
    expect(result.status).toBe(405);
    expect(result.headers.Allow).toBe("POST");
    expect(authorize).not.toHaveBeenCalled();
  });

  it("returns normalized authentication and rate-limit errors", async () => {
    const unauthorized = createResponse();
    await handleGeminiApi(
      createRequest("POST", {}),
      unauthorized.response,
      async () => ({ status: 200, body: {} }),
      "quiz",
      async () => {
        throw new ApiSecurityError(401, "invalid_token", "Invalid token.");
      },
    );
    expect(unauthorized.result.status).toBe(401);

    const limited = createResponse();
    await handleGeminiApi(
      createRequest("POST", {}),
      limited.response,
      async () => ({ status: 200, body: {} }),
      "quiz",
      async () => {
        throw new ApiSecurityError(429, "rate_limited", "Slow down.", 42);
      },
    );
    expect(limited.result.status).toBe(429);
    expect(limited.result.headers["Retry-After"]).toBe("42");
  });

  it("rejects parsed request bodies larger than 64 KB", async () => {
    const { response, result } = createResponse();
    await handleGeminiApi(
      createRequest("POST", { prompt: "x".repeat(70 * 1024) }),
      response,
      async () => ({ status: 200, body: {} }),
      "generate-avatar",
      async () => ({ uid: "user" }),
    );
    expect(result.status).toBe(413);
  });
});

describe("parsed Vercel body and Express stream parity", () => {
  const authorize = async () => ({ uid: "test-user" });
  const streamRequest = (body: string) => Object.assign(Readable.from([Buffer.from(body)]), {
    method: "POST", headers: { authorization: "Bearer test" },
  }) as unknown as IncomingMessage;
  it("parses the same JSON and passes the verified actor to the action", async () => {
    for (const request of [createRequest("POST", { word: "invoice" }), streamRequest('{"word":"invoice"}')]) {
      const { response, result } = createResponse();
      const action = vi.fn(async () => ({ status: 200, body: { text: "verified" } }));
      await handleGeminiApi(request, response, action, "explain", authorize);
      expect(result.status).toBe(200);
      expect(action).toHaveBeenCalledWith({ word: "invoice" }, expect.objectContaining({ uid: "test-user", requestId: expect.any(String) }));
    }
  });
  it("rejects malformed and excessive raw bodies before calling AI", async () => {
    for (const [body, expectedStatus] of [["{", 400], [JSON.stringify({ word: "x".repeat(70 * 1024) }), 413]] as const) {
      const { response, result } = createResponse(); const action = vi.fn();
      await handleGeminiApi(streamRequest(body), response, action, "explain", authorize);
      expect(result.status).toBe(expectedStatus); expect(action).not.toHaveBeenCalled();
    }
  });
});
