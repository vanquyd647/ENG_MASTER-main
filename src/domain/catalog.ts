import { VOCABULARY } from "../data/vocabulary";
import type { Word } from "../data/vocabularyTypes";
import { getActiveOwner, readOwnerItem, subscribeOwner } from "../repositories/ownerStorage";
export type { Word } from "../data/vocabularyTypes";

export const BUNDLED_CATALOG: readonly Word[] = Object.freeze(VOCABULARY.map(word => Object.freeze({ ...word, ...(word.translations ? { translations: Object.freeze({ ...word.translations }) } : {}), ...(word.source ? {source:Object.freeze({...word.source})} : {}) })));
let cachedKey = "";
let cachedWords: readonly Word[] = BUNDLED_CATALOG;
let cachedIndex = new Map(BUNDLED_CATALOG.map((word) => [word.id, word]));
let version = 0;
const listeners = new Set<() => void>();
export const getVocabulary = (): readonly Word[] => {
  const raw = readOwnerItem("eng_master_custom_words_v1") || "[]";
  const key = `${getActiveOwner()}:${raw}`;
  if (key !== cachedKey) {
    let custom: Word[] = [];
    try {
      const value: unknown = JSON.parse(raw);
      if (Array.isArray(value)) custom = value.filter((word) => word && typeof word.id === "string" && word.id.startsWith("custom-") && ["word","meaning","topic","phonetic","pos","example","exampleTranslation"].every(field => typeof word[field] === "string" && word[field].length <= 2000));
    } catch { /* Preserve corrupt storage for migration/recovery; never alter bundled content. */ }
    const bundledIds = new Set(BUNDLED_CATALOG.map((word) => word.id));
    const seen = new Set<string>();
    cachedWords = Object.freeze([...BUNDLED_CATALOG, ...custom.filter((word) => !bundledIds.has(word.id) && !seen.has(word.id) && Boolean(seen.add(word.id)))]);
    cachedIndex = new Map(cachedWords.map((word) => [word.id, word]));
    cachedKey = key;
  }
  return cachedWords;
};
export const getWordById = (id: string) => { getVocabulary(); return cachedIndex.get(id); };
export const getCatalogVersion = () => version;
export const subscribeCatalog = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export const notifyCatalog = () => { cachedKey = ""; version++; listeners.forEach((listener) => listener()); };
subscribeOwner(notifyCatalog);
