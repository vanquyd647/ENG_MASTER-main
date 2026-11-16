import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { explainWord, generateAvatar, generateMistakeReview, generateQuiz } from "./src/server/gemini";
import { handleGeminiApi } from "./src/server/vercelGeminiHandler";

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({quiet:true});

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);
  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.env.npm_lifecycle_event === "start";

  // Shared handler parses the bounded stream after auth in Express and Vercel.

  app.all("/api/gemini/explain", (req, res) =>
    handleGeminiApi(req, res, explainWord, "explain"),
  );
  app.all("/api/gemini/generate-avatar", (req, res) =>
    handleGeminiApi(req, res, generateAvatar, "generate-avatar"),
  );
  app.all("/api/gemini/quiz", (req, res) =>
    handleGeminiApi(req, res, generateQuiz, "quiz"),
  );
  app.all("/api/gemini/mistake-review", (req, res) =>
    handleGeminiApi(req, res, generateMistakeReview, "mistake-review"),
  );
  app.use("/api/gemini", (_req, res) => {
    res.status(404).json({ error: "AI endpoint not found.", code: "not_found" });
  });
  app.use((error: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (
      typeof error === "object" &&
      error !== null &&
      "type" in error &&
      error.type === "entity.too.large"
    ) {
      res.status(413).json({
        error: "Request body exceeds the 64 KB limit.",
        code: "payload_too_large",
      });
      return;
    }
    if(error instanceof SyntaxError && "body" in error) {res.status(400).json({error:"Request body must be valid JSON.",code:"invalid_json"});return;}
    next(error);
  });

  // Vite middleware for development
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.get("/sw.js", (_req,res)=>{res.set("Cache-Control","no-cache");res.sendFile(path.join(distPath,"sw.js"));});
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (path.extname(req.path) || !req.accepts('html')) {res.status(404).end();return;}
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
