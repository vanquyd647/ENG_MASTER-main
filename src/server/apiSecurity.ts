import { getAdminAuth, getAdminFirestore } from "./firebaseAdmin.js";
import { maybePruneExpiredQuota } from "./quotaMaintenance.js";

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
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/default credentials|credential implementation|private key|service account|metadata server/i.test(message)) throw new ApiSecurityError(503, "admin_not_configured", "Máy chủ chưa cấu hình Firebase Admin.");
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
  const db = getAdminFirestore();
  const dailyStart = Math.floor(now / 86_400_000) * 86_400_000;
  const dailyLimit = Math.max(1, Math.min(10_000, Number(process.env.AI_DAILY_REQUEST_LIMIT) || 100));
  const dailyRef = db.collection("_systemRateLimits").doc(`${uid}_daily_${dailyStart}`);
  const ref = db
    .collection("_systemRateLimits")
    .doc(`${uid}_${endpoint}_${windowStart}`);

  await db.runTransaction(async (transaction) => {
    const [snapshot, daily] = await Promise.all([transaction.get(ref), transaction.get(dailyRef)]);
    const dailyCount = daily.exists ? Number(daily.data()?.count || 0) : 0;
    if (dailyCount >= dailyLimit) throw new ApiSecurityError(429, "daily_quota", "Đã đạt hạn mức AI hôm nay.", Math.ceil((dailyStart + 86_400_000 - now) / 1000));
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
        expiresAt: new Date(resetAt + 86_400_000),
      },
      { merge: true },
    );
    transaction.set(dailyRef, { uid, count: dailyCount + 1, windowStart: dailyStart, resetAt: dailyStart + 86_400_000, expiresAt: new Date(dailyStart + 2 * 86_400_000) }, { merge: true });
  });

  await maybePruneExpiredQuota(db,now);
  return { uid };
};
