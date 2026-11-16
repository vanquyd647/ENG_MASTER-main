import fs from "node:fs";
import type { Word } from "../src/data/vocabularyTypes";

export type ReviewedFields = Pick<Word,
  "word" | "phonetic" | "pos" | "meaning" | "example" | "exampleTranslation">;
export const REVIEWED_VOCABULARY: Record<string, ReviewedFields> = JSON.parse(
  fs.readFileSync(new URL("../new/vocabulary-reviewed.json", import.meta.url), "utf8"),
);

export const applyReviewedWord = (entry: Word): Word => {
  const reviewed = REVIEWED_VOCABULARY[entry.id];
  if (!reviewed || reviewed.word !== entry.word) {
    throw new Error(`Missing linguistic review for ${entry.id} (${entry.word}).`);
  }
  return { ...entry, ...reviewed, translations: {
    ...entry.translations,
    ...(entry.word === "meet" ? {
      fr: "répondre aux exigences; rencontrer",
      es: "cumplir los requisitos; reunirse",
    } : {}),
    vi: reviewed.meaning,
  } };
};
