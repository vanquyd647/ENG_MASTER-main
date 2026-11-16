import type { IncomingMessage, ServerResponse } from "node:http";
import { generateMistakeReview } from "../../src/server/gemini.js";
import { handleGeminiApi } from "../../src/server/vercelGeminiHandler.js";

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  await handleGeminiApi(req, res, generateMistakeReview, "mistake-review");
}
