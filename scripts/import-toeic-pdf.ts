import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { BASE_VOCABULARY, type Word } from "../src/data/vocabulary.ts";
import { lookupIpa } from "./ipa-dictionary.ts";
import { EXISTING_MEANING_CORRECTIONS, PDF_CORRECTIONS } from "./vocabulary-corrections.ts";
import { applyReviewedWord } from "./reviewed-vocabulary.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rawPath = path.join(root, "new/toeic-pdf-extracted.json");
const reportPath = path.join(root, "new/toeic-pdf-import-report.json");
const pdfPath = path.join(root, "new/1250 từ vựng TOEIC.pdf");
const expectedSha256 = "d1c6cfa45f1c6459321c9cca5620b726268d45c281b0706ace2445acf3bd6bd4";
const sourceDocument = "mochimochi-toeic-1000";

type ExtractedRow = {
  number: number;
  page: number;
  word: string;
  pos: string;
  phonetic: string;
  meaning: string;
  meaningContinuations?: string[];
  alternativePhonetics?: string[];
};

const rows: ExtractedRow[] = JSON.parse(fs.readFileSync(rawPath, "utf8"));
if (rows.length !== 1000 || rows.some((row, index) => row.number !== index + 1)) {
  throw new Error("PDF extraction must contain every numbered row from 1 to 1000.");
}
if (crypto.createHash("sha256").update(fs.readFileSync(pdfPath)).digest("hex") !== expectedSha256) {
  throw new Error("PDF has changed; re-extract and review the source before importing.");
}

const clean = (text: string) => text.normalize("NFC").replace(/\s+/g, " ").trim();
const cleanMeaning = (text: string) => clean(text)
  .replace(/\s+([,.;!?])/g, "$1")
  .replace(/([,;])(?=\S)/g, "$1 ")
  .replace(/[,;]\s*$/, "");

const existingCorrections: Array<{ id: string; word: string; before: string; after: string }> = [];
const correctedBase = BASE_VOCABULARY.map((entry): Word => {
  const meaning = cleanMeaning(EXISTING_MEANING_CORRECTIONS[entry.word] || entry.meaning);
  if (meaning === entry.meaning) return entry;
  existingCorrections.push({ id: entry.id, word: entry.word, before: entry.meaning, after: meaning });
  return {
    ...entry,
    meaning,
    // Some legacy examples quote the Vietnamese definition directly.
    exampleTranslation: entry.exampleTranslation.replaceAll(entry.meaning, meaning),
    translations: { ...entry.translations, vi: meaning },
  };
}).map(applyReviewedWord);

const known = new Map(correctedBase.map((entry) => [entry.word.toLowerCase(), entry.id]));
const imported: Word[] = [];
const overlaps: Array<{ entry: number; word: string; existingId: string }> = [];
const duplicates: Array<{ entry: number; word: string; firstEntry: number }> = [];
const reviewedCorrections: Array<{ entry: number; word: string; changes: typeof PDF_CORRECTIONS[string] }> = [];
const firstEntries = new Map<string, number>();
const posNames: Record<string, string> = {
  n: "noun", v: "verb", adj: "adjective", adv: "adverb", prep: "preposition",
  det: "determiner", pron: "pronoun", conj: "conjunction",
};
// These continuations are complete extra senses; the others are wrapped text.
const extraSenses = new Set([27, 238, 244, 247, 269, 272, 273, 276, 277, 285, 290, 295, 331, 334, 369, 408, 422, 449, 460, 484, 528, 531, 538, 610]);

for (const row of rows) {
  const correction = PDF_CORRECTIONS[row.word] || {};
  const word = clean(correction.word || row.word).toLowerCase();
  if (Object.keys(correction).length) reviewedCorrections.push({ entry: row.number, word: row.word, changes: correction });
  const first = firstEntries.get(word);
  if (first !== undefined) {
    duplicates.push({ entry: row.number, word, firstEntry: first });
    continue;
  }
  firstEntries.set(word, row.number);
  const existingId = known.get(word);
  if (existingId) {
    overlaps.push({ entry: row.number, word, existingId });
    continue;
  }
  const pos = (correction.pos || row.pos).split(",").map((token) => {
    const result = posNames[token.trim()];
    if (!result) throw new Error(`Unknown part of speech for ${word}: ${token}`);
    return result;
  }).join(", ");
  const meaning = cleanMeaning(correction.meaning || [row.meaning, ...(row.meaningContinuations || [])].join(extraSenses.has(row.number) ? "; " : " "));
  const phonetic = correction.phonetic || lookupIpa(word) || clean(row.phonetic);
  if (!/^\/[^/]+\/$/u.test(phonetic)) throw new Error(`Invalid IPA for ${word}: ${phonetic}`);
  const entry: Word = {
    id: `pdf-toeic-${String(row.number).padStart(4, "0")}`,
    topic: "TOEIC bổ sung (PDF)",
    word, phonetic, pos, meaning,
    example: "", exampleTranslation: "",
    translations: { vi: meaning },
    source: { document: sourceDocument, page: row.page, entry: row.number },
  };
  imported.push(applyReviewedWord(entry));
  known.set(word, entry.id);
}

if (correctedBase.length !== 905 || imported.length !== 670 || overlaps.length !== 329 || duplicates.length !== 1) {
  throw new Error("Unexpected merge counts. Review differences before updating the catalog.");
}

const vocabularyPath = path.join(root, "src/data/vocabulary.ts");
const source = fs.readFileSync(vocabularyPath, "utf8");
const start = source.indexOf("[", source.indexOf(" = ", source.indexOf("export const BASE_VOCABULARY")));
const end = source.indexOf("\n];", start) + 2;
if (start < 0 || end < 2) throw new Error("Could not locate the base vocabulary array.");
fs.writeFileSync(vocabularyPath, source.slice(0, start) + JSON.stringify(correctedBase, null, 2) + ";" + source.slice(end + 1));
fs.writeFileSync(path.join(root, "src/data/toeic-pdf.ts"),
  `// PDF headwords with reviewed IPA, POS, meanings and authored bilingual examples.\nimport type { Word } from "./vocabularyTypes";\n\nexport const TOEIC_PDF_VOCABULARY: Word[] = ${JSON.stringify(imported, null, 2)};\n`);

const correctionAuditPath = path.join(root, "new/vocabulary-existing-corrections.json");
const priorAudit = fs.existsSync(correctionAuditPath) ? JSON.parse(fs.readFileSync(correctionAuditPath, "utf8")) as typeof existingCorrections : [];
const correctionAudit = new Map(priorAudit.map((entry) => [entry.id, entry]));
for (const entry of existingCorrections) {
  const previous = correctionAudit.get(entry.id);
  correctionAudit.set(entry.id, { ...entry, before: previous?.before || entry.before });
}
fs.writeFileSync(correctionAuditPath, JSON.stringify([...correctionAudit.values()], null, 2) + "\n");
fs.writeFileSync(reportPath, JSON.stringify({
  source: { file: "new/1250 từ vựng TOEIC.pdf", title: "1000 từ vựng TOEIC thông dụng nhất", publisher: "MochiMochi", document: sourceDocument, sha256: expectedSha256, pages: 23 },
  counts: { original: correctedBase.length, extractedRows: rows.length, uniquePdfHeadwords: firstEntries.size, overlappingHeadwords: overlaps.length, duplicatePdfRows: duplicates.length, added: imported.length, total: correctedBase.length + imported.length, correctedExistingMeanings: correctionAudit.size },
  examples: "The PDF supplies no examples. Every entry now has an authored bilingual example from the full linguistic review.",
  pronunciation: "Broad American IPA from CMUdict with reviewed phrase and homograph overrides; primary stress retained, secondary stress omitted.",
  overlaps, duplicates, reviewedCorrections,
}, null, 2) + "\n");
console.log(`[vocabulary] ${rows.length} PDF rows: ${overlaps.length} existing, ${duplicates.length} duplicate, ${imported.length} added. Total ${correctedBase.length + imported.length}. Corrected ${correctionAudit.size} existing definitions.`);
