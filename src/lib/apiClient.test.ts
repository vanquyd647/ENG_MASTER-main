import { beforeEach, describe, expect, it, vi } from "vitest";

const mocked = vi.hoisted(() => ({
  currentUser: null as null | { getIdToken: ReturnType<typeof vi.fn> },
}));

vi.mock("./firebase", () => ({
  auth: {
    get currentUser() {
      return mocked.currentUser;
    },
  },
}));

import { AiApiError, callAiApi } from "./apiClient";

beforeEach(() => {
  mocked.currentUser = null;
  vi.restoreAllMocks();
});

describe("AI API client", () => {
  it("requires login before making an AI request", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    await expect(callAiApi("explain", { word: "audit" })).rejects.toMatchObject({
      status: 401,
      code: "auth_required",
    } satisfies Partial<AiApiError>);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("sends the Firebase token and returns JSON", async () => {
    mocked.currentUser = { getIdToken: vi.fn().mockResolvedValue("id-token") };
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ text: "ok" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(callAiApi<{ text: string }>("explain", { word: "audit" }))
      .resolves.toEqual({ text: "ok" });
    expect(fetch).toHaveBeenCalledWith(
      "/api/gemini/explain",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer id-token",
        }),
      }),
    );
  });
});
