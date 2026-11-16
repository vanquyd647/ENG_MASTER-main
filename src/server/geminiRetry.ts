export const providerStatus = (error: unknown): number | undefined => {
  if (!error || typeof error !== 'object') return undefined;
  for (const field of ['status', 'code']) {
    const value = (error as Record<string, unknown>)[field];
    if (typeof value === 'number' && Number.isInteger(value) && value >= 400 && value <= 599) return value;
  }
  return undefined;
};

// One fast retry, only for transient server errors. Every model/attempt shares
// the same deadline; a slow request must not start another 45-second request.
export async function withGeminiRetry<T>(request: (remainingMs: number, attempt: number) => Promise<T>, deadline: number, now = Date.now, pause = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    const remaining = deadline - now();
    if (remaining < 1000) break;
    try { return await request(remaining, attempt + 1); }
    catch (error) {
      lastError = error;
      if (attempt || ![500, 502, 503].includes(providerStatus(error) || 0) || deadline - now() < 2000) throw error;
      await pause(300 + Math.floor(Math.random() * 200));
    }
  }
  throw lastError || new Error('AI request deadline exceeded');
}
