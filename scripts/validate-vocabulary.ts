import { VOCABULARY, type Word } from "../src/data/vocabulary.ts";
import { lookupIpa } from "./ipa-dictionary.ts";

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

if (VOCABULARY.length !== 905) {
  errors.push(`Expected 905 entries, received ${VOCABULARY.length}`);
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

  if (!lookupIpa(normalizedHeadword)) {
    errors.push(`${row}: headword is absent from the IPA reference data`);
  }
  if (!/^\/.+\/$/.test(entry.phonetic.trim())) {
    errors.push(`${row}: invalid phonetic format`);
  }

  const searchableText = JSON.stringify(entry);
  if (mojibake.test(searchableText)) errors.push(`${row}: mojibake detected`);
  if (ligature.test(searchableText)) errors.push(`${row}: ligature detected`);
  if (abnormalOcr.test(searchableText)) {
    errors.push(`${row}: suspicious OCR pattern detected`);
  }

  const example = entry.example.trim();
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
