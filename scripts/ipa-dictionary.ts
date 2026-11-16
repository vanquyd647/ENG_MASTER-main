import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { REVIEWED_VOCABULARY } from "./reviewed-vocabulary.ts";

const require = createRequire(import.meta.url);
const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

type IpaDictionary = Map<string, string[]>;

const loadDictionary = (fileName: string) =>
  require(
    path.join(projectRoot, "node_modules", "ipa-dict", "lib", fileName),
  ) as IpaDictionary;

export const AMERICAN_IPA = loadDictionary("en_US.js");
export const BRITISH_IPA = loadDictionary("en_UK.js");

export const lookupIpa = (word: string) => {
  const key = word.trim().toLowerCase();
  const reviewed = Object.values(REVIEWED_VOCABULARY).find((entry) => entry.word === key);
  if (reviewed) return reviewed.phonetic;
  const pronunciations = BRITISH_IPA.get(key) || AMERICAN_IPA.get(key);
  return pronunciations?.[0]?.replace(/\p{Cf}/gu, "").trim() || null;
};
