import { useSyncExternalStore } from "react";
import { getVocabulary, getCatalogVersion, subscribeCatalog } from "./catalog";
export const useCatalog = () => { useSyncExternalStore(subscribeCatalog, getCatalogVersion, getCatalogVersion); return getVocabulary(); };
