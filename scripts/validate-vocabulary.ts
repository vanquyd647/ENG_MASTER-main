import fs from "node:fs";
import { BASE_VOCABULARY, VOCABULARY, type Word } from "../src/data/vocabulary.ts";
import { TOEIC_PDF_VOCABULARY } from "../src/data/toeic-pdf.ts";
import { lookupIpa } from "./ipa-dictionary.ts";
import { REVIEWED_VOCABULARY } from "./reviewed-vocabulary.ts";

const requiredFields: Array<keyof Word> = [
  "id",
  "topic",
  "word",
  "phonetic",
  "pos",
  "meaning",
  "example",
  "exampleTranslation",
];

const errors: string[] = [];
const ids = new Set<string>();
const headwords = new Set<string>();
const mojibake =
  /(?:Ã©|Ã¨|Ãª|Ã´|Ã¡|Ã³|Ãº|Ã­|Ã½|â€|á»|áº|�)/u;
const ligature = /[ﬁﬂﬀﬃﬄ]/u;
const abnormalOcr = /(?:\/A\d{3,}|\p{L}\d+\p{L}|\s+[,.!?])/u;
const validPos = new Set(["noun", "verb", "adjective", "adverb", "preposition", "determiner"]);
const unsafeLegacyExample = /^(?:The team discussed the .+ during the meeting\.|The team plans to .+ before the deadline\.|The manager described the proposal as .+\.|The team completed the task .+\.)$/;

const report = JSON.parse(fs.readFileSync(new URL("../new/toeic-pdf-import-report.json", import.meta.url), "utf8"));
const importedIds = new Set(TOEIC_PDF_VOCABULARY.map((entry) => entry.id));
if (BASE_VOCABULARY.length !== report.counts.original ||
    TOEIC_PDF_VOCABULARY.length !== report.counts.added ||
    VOCABULARY.length !== report.counts.total) {
  errors.push(`Catalog counts do not match the reviewed import report (${report.counts.total} total).`);
}

VOCABULARY.forEach((entry, index) => {
  const row = `Row ${index + 1} (${entry.id || "missing id"})`;
  for (const field of requiredFields) {
    const value = entry[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      errors.push(`${row}: missing ${field}`);
    }
  }

  if (ids.has(entry.id)) errors.push(`Duplicate id: ${entry.id}`);
  ids.add(entry.id);

  const normalizedHeadword = entry.word.trim().toLowerCase();
  if (headwords.has(normalizedHeadword)) {
    errors.push(`Duplicate headword: ${entry.word}`);
  }
  headwords.add(normalizedHeadword);
  if (!validPos.has(entry.pos)) errors.push(`${row}: invalid or ambiguous part of speech`);
  const reviewed = REVIEWED_VOCABULARY[entry.id];
  if (!reviewed || Object.entries(reviewed).some(([field, value]) => entry[field as keyof Word] !== value)) {
    errors.push(`${row}: differs from the approved linguistic review`);
  }
  if (entry.translations?.vi !== entry.meaning) errors.push(`${row}: inconsistent Vietnamese definition`);
  if (unsafeLegacyExample.test(entry.example)) errors.push(`${row}: legacy slot-filled example reintroduced`);

  const isPdfEntry = importedIds.has(entry.id);
  if (isPdfEntry && (!entry.source || entry.source.document !== report.source.document ||
      !Number.isInteger(entry.source.page) || entry.source.page < 1 || entry.source.page > report.source.pages ||
      !Number.isInteger(entry.source.entry) || entry.source.entry < 1 || entry.source.entry > report.counts.extractedRows)) {
    errors.push(`${row}: missing or invalid PDF provenance`);
  }
  if (!lookupIpa(normalizedHeadword) && !isPdfEntry) {
    errors.push(`${row}: headword is absent from the IPA reference data`);
  }
  if (!/^\/[^/]+\/$/u.test(entry.phonetic.trim())) {
    errors.push(`${row}: invalid phonetic format`);
  }

  const searchableText = JSON.stringify(entry);
  if (mojibake.test(searchableText)) errors.push(`${row}: mojibake detected`);
  if (ligature.test(searchableText)) errors.push(`${row}: ligature detected`);
  if (abnormalOcr.test(searchableText)) {
    errors.push(`${row}: suspicious OCR pattern detected`);
  }

  if (typeof entry.example !== "string" || typeof entry.exampleTranslation !== "string") {
    errors.push(`${row}: example fields must be strings`);
    return;
  }
  if (!entry.example.trim() || !entry.exampleTranslation.trim()) {
    errors.push(`${row}: incomplete example pair`);
  }
  const example = entry.example.trim();
  if (!example.toLowerCase().includes(normalizedHeadword)) errors.push(`${row}: example does not contain the headword`);
  const words = example.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) || [];
  if (words.length < 4 || !/[.!?]["']?$/.test(example)) {
    errors.push(`${row}: example is incomplete or not a sentence`);
  }
  const uppercaseLetters = (example.match(/[A-Z]/g) || []).length;
  const lowercaseLetters = (example.match(/[a-z]/g) || []).length;
  if (
    uppercaseLetters > 10 &&
    uppercaseLetters > lowercaseLetters * 1.5
  ) {
    errors.push(`${row}: example appears to be uncleaned uppercase OCR`);
  }
});
if (Object.keys(REVIEWED_VOCABULARY).length !== VOCABULARY.length) {
  errors.push("Linguistic review coverage does not match the catalog.");
}

const firestoreRules = fs.readFileSync(new URL("../firestore.rules", import.meta.url), "utf8");
const dailyActivityLimit = Number(firestoreRules.match(/data\.wordIds\.size\(\) <= (\d+)/)?.[1]);
if (!dailyActivityLimit || dailyActivityLimit < VOCABULARY.length) {
  errors.push("Firestore daily activity limit is smaller than the bundled vocabulary.");
}

if (errors.length > 0) {
  console.error(`[vocabulary] ${errors.length} quality-gate errors found.`);
  for (const error of errors.slice(0, 100)) console.error(`- ${error}`);
  if (errors.length > 100) {
    console.error(`- ...and ${errors.length - 100} more`);
  }
  process.exit(1);
}

console.log(
  `[vocabulary] ${VOCABULARY.length} entries passed with no warnings.`,
);
