import { auth } from "./firebase";

export class AiApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "AiApiError";
  }
}

export const callAiApi = async <T>(
  endpoint: "explain" | "quiz" | "mistake-review" | "generate-avatar",
  body: unknown,
): Promise<T> => {
  const user = auth.currentUser;
  if (!user) {
    throw new AiApiError(
      "Vui lòng đăng nhập Google để sử dụng tính năng AI.",
      401,
      "auth_required",
    );
  }

  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const token = await user.getIdToken(attempt > 0);
      const response = await fetch(`/api/gemini/${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const payload = await response.json().catch(() => ({}));
      if (response.ok) return payload as T;

      const error = new AiApiError(
        payload?.error || `${response.status} ${response.statusText}`,
        response.status,
        payload?.code,
      );
      if (attempt === 0 && [502, 503, 504].includes(response.status)) {
        lastError = error;
        await new Promise((resolve) => window.setTimeout(resolve, 300));
        continue;
      }
      throw error;
    } catch (error) {
      if (error instanceof AiApiError || attempt > 0) throw error;
      lastError = error;
      await new Promise((resolve) => window.setTimeout(resolve, 300));
    }
  }

  throw lastError;
};
