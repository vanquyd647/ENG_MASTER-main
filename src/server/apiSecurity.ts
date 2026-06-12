import { getAdminAuth, getAdminFirestore } from "./firebaseAdmin";

export type AiEndpoint =
  | "explain"
  | "quiz"
  | "mistake-review"
  | "generate-avatar";

type RatePolicy = {
  max: number;
  windowMs: number;
};

const RATE_POLICIES: Record<AiEndpoint, RatePolicy> = {
  explain: { max: 20, windowMs: 60_000 },
  quiz: { max: 10, windowMs: 60_000 },
  "mistake-review": { max: 10, windowMs: 60_000 },
  "generate-avatar": { max: 3, windowMs: 3_600_000 },
};

export class ApiSecurityError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "ApiSecurityError";
  }
}

const readBearerToken = (authorization: string | undefined) => {
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  if (!match?.[1]) {
    throw new ApiSecurityError(
      401,
      "auth_required",
      "Authentication is required for AI features.",
    );
  }
  return match[1];
};

export const authorizeAiRequest = async (
  authorization: string | undefined,
  endpoint: AiEndpoint,
) => {
  const token = readBearerToken(authorization);
  let uid: string;
  try {
    uid = (await getAdminAuth().verifyIdToken(token)).uid;
  } catch {
    throw new ApiSecurityError(
      401,
      "invalid_token",
      "The authentication token is invalid or expired.",
    );
  }

  const policy = RATE_POLICIES[endpoint];
  const now = Date.now();
  const windowStart = Math.floor(now / policy.windowMs) * policy.windowMs;
  const resetAt = windowStart + policy.windowMs;
  const ref = getAdminFirestore()
    .collection("_systemRateLimits")
    .doc(`${uid}_${endpoint}_${windowStart}`);

  await getAdminFirestore().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const count = snapshot.exists ? Number(snapshot.data()?.count || 0) : 0;
    if (count >= policy.max) {
      throw new ApiSecurityError(
        429,
        "rate_limited",
        "Too many AI requests. Please try again later.",
        Math.max(1, Math.ceil((resetAt - now) / 1000)),
      );
    }
    transaction.set(
      ref,
      {
        uid,
        endpoint,
        count: count + 1,
        windowStart,
        resetAt,
      },
      { merge: true },
    );
  });

  return { uid };
};
