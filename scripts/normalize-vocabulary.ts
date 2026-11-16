import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { BASE_VOCABULARY, type Word } from "../src/data/vocabulary.ts";
import { lookupIpa } from "./ipa-dictionary.ts";
import { EXISTING_MEANING_CORRECTIONS } from "./vocabulary-corrections.ts";
import { applyReviewedWord } from "./reviewed-vocabulary.ts";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const vocabularyPath = path.join(projectRoot, "src", "data", "vocabulary.ts");

const HEADWORD_CORRECTIONS: Record<string, string> = {
  reluctanly: "reluctantly",
  headquaters: "headquarters",
  promplty: "promptly",
  accidentially: "accidentally",
  ctiv: "reflective",
  absense: "absence",
  adveristy: "adversity",
  installmant: "installment",
  automovie: "automotive",
  regettably: "regrettably",
};

const HEADWORD_CORRECTIONS_BY_ID: Record<string, string> = {
  "sho-03": "experienced",
};

const normalizeText = (value: string) =>
  value
    .normalize("NFKC")
    .replace(/\p{Cf}/gu, "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;!?])/g, "$1")
    .trim();

const createExample = (word: string, pos: string, meaning: string) => {
  const normalizedPos = pos.toLowerCase();
  if (normalizedPos.startsWith("noun")) {
    return {
      example: `The team discussed the ${word} during the meeting.`,
      exampleTranslation: `Nhóm đã thảo luận về "${meaning}" trong cuộc họp.`,
    };
  }
  if (normalizedPos.startsWith("verb")) {
    return {
      example: `The team plans to ${word} before the deadline.`,
      exampleTranslation: `Nhóm dự định thực hiện hành động "${meaning}" trước thời hạn.`,
    };
  }
  if (normalizedPos.startsWith("adj")) {
    return {
      example: `The manager described the proposal as ${word}.`,
      exampleTranslation: `Người quản lý mô tả đề xuất là "${meaning}".`,
    };
  }
  if (normalizedPos.startsWith("adv")) {
    return {
      example: `The team completed the task ${word}.`,
      exampleTranslation: `Nhóm đã hoàn thành công việc theo cách "${meaning}".`,
    };
  }
  return {
    example: `The word "${word}" appeared in the business report.`,
    exampleTranslation: `Từ "${word}" xuất hiện trong báo cáo kinh doanh.`,
  };
};

const loadVocabularyFromHead = () => {
  const source = execFileSync(
    "git",
    ["show", "HEAD:src/data/vocabulary.ts"],
    { cwd: projectRoot, encoding: "utf8" },
  );
  const marker = source.includes("export const BASE_VOCABULARY")
    ? "export const BASE_VOCABULARY"
    : "export const VOCABULARY";
  const start = source.indexOf("[", source.indexOf(" = ", source.indexOf(marker)));
  const end = source.indexOf("\n];", start) + 1;
  if (start < 0 || end < 0) {
    throw new Error("Could not read VOCABULARY from the Git HEAD version.");
  }
  return Function(`"use strict"; return (${source.slice(start, end + 1)});`)() as Word[];
};

const sourceVocabulary = process.argv.includes("--from-head")
  ? loadVocabularyFromHead()
  : BASE_VOCABULARY;

const looksCorrupted = (entry: Word) => {
  const example = normalizeText(entry.example);
  const uppercase = (example.match(/[A-Z]/g) || []).length;
  const lowercase = (example.match(/[a-z]/g) || []).length;
  return (
    entry.phonetic.trim().length === 0 ||
    /[ﬁﬂﬀﬃﬄ]|\p{L}\d+\p{L}|\/A\d{3,}/u.test(JSON.stringify(entry)) ||
    !/[.!?]["']?$/.test(example) ||
    (uppercase > 10 && uppercase > lowercase * 1.5)
  );
};

const normalized = sourceVocabulary.map((entry): Word => {
  const word =
    HEADWORD_CORRECTIONS_BY_ID[entry.id] ||
    HEADWORD_CORRECTIONS[entry.word.trim().toLowerCase()] ||
    entry.word.trim().toLowerCase();
  const phonetic = lookupIpa(word);
  if (!phonetic) {
    throw new Error(`No IPA pronunciation found for ${entry.id} (${word})`);
  }

  const meaning = normalizeText(EXISTING_MEANING_CORRECTIONS[word] || entry.meaning)
    .replace(/([,;])(?=\S)/g, "$1 ")
    .replace(/[,;]\s*$/, "");
  const wasOcrImported = looksCorrupted(entry);
  const generatedExample = createExample(word, entry.pos, meaning);

  return {
    ...entry,
    word,
    phonetic,
    pos: normalizeText(entry.pos).toLowerCase(),
    meaning,
    example: wasOcrImported
      ? generatedExample.example
      : normalizeText(entry.example),
    exampleTranslation: wasOcrImported
      ? generatedExample.exampleTranslation
      : normalizeText(entry.exampleTranslation),
    translations: {
      ...entry.translations,
      vi: meaning,
    },
  };
}).map(applyReviewedWord);

const source = `import type { Word } from "./vocabularyTypes";
import { TOEIC_PDF_VOCABULARY } from "./toeic-pdf";
export type { Word } from "./vocabularyTypes";

export const BASE_VOCABULARY: Word[] = ${JSON.stringify(normalized, null, 2)};

export const VOCABULARY: Word[] = [...BASE_VOCABULARY, ...TOEIC_PDF_VOCABULARY];
`;

fs.writeFileSync(vocabularyPath, source, "utf8");
console.log(`[vocabulary] Normalized ${normalized.length} base entries; PDF additions are retained separately.`);
