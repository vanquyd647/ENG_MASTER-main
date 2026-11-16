import fs from "node:fs";
import { BASE_VOCABULARY } from "../src/data/vocabulary";
import { TOEIC_PDF_VOCABULARY } from "../src/data/toeic-pdf";
import { applyReviewedWord, REVIEWED_VOCABULARY } from "./reviewed-vocabulary";

const all = [...BASE_VOCABULARY, ...TOEIC_PDF_VOCABULARY];
if (all.length !== 1575 || Object.keys(REVIEWED_VOCABULARY).length !== all.length) {
  throw new Error("The linguistic review must cover all 1575 bundled entries.");
}
const base = BASE_VOCABULARY.map(applyReviewedWord);
const pdf = TOEIC_PDF_VOCABULARY.map(applyReviewedWord);
fs.writeFileSync(new URL("../src/data/vocabulary.ts", import.meta.url),
  `import type { Word } from "./vocabularyTypes";\nimport { TOEIC_PDF_VOCABULARY } from "./toeic-pdf";\nexport type { Word } from "./vocabularyTypes";\n\nexport const BASE_VOCABULARY: Word[] = ${JSON.stringify(base, null, 2)};\n\nexport const VOCABULARY: Word[] = [...BASE_VOCABULARY, ...TOEIC_PDF_VOCABULARY];\n`);
fs.writeFileSync(new URL("../src/data/toeic-pdf.ts", import.meta.url),
  `// PDF headwords with reviewed IPA, POS, meanings and authored bilingual examples.\nimport type { Word } from "./vocabularyTypes";\n\nexport const TOEIC_PDF_VOCABULARY: Word[] = ${JSON.stringify(pdf, null, 2)};\n`);
console.log(`[vocabulary] Applied linguistic review to ${base.length} legacy and ${pdf.length} PDF entries.`);
