import { parseCustomWords, parseDecks, parseAccountPreferences } from "../domain/schemas";
import { getVocabulary, notifyCatalog, type Word } from "../domain/catalog";
import { ownerKey, readOwnerItem, writeOwnerItem, notifyOwnerStorage } from "../repositories/ownerStorage";
import { writeLocalChanges } from "./localTransaction";
import type { BackupV3 } from "../types";

const preferenceKeys=['eng_master_custom_words_v1','eng_master_favorites_v1','eng_master_decks_v1','eng_master_study_size_v1','eng_master_reminder_hour_v1','eng_master_roadmap_v1','eng_master_practice_records_v1','eng_master_extended_practice_v1'];
const checkedPreference=(key:string,value:string)=>{parseAccountPreferences({...Object.fromEntries(preferenceKeys.map(name=>[name,readOwnerItem(name)])),[key]:value});writeOwnerItem(key,value);};
const FAVORITES_KEY = "eng_master_favorites_v1";
const CUSTOM_WORDS_KEY = "eng_master_custom_words_v1";
const ONBOARDING_KEY = "eng_master_onboarding_complete_v1";
const STUDY_SIZE_KEY = "eng_master_study_size_v1";
const REMINDER_HOUR_KEY = "eng_master_reminder_hour_v1";

const readJson = <T>(key: string, fallback: T): T => {
  try {
    return JSON.parse(readOwnerItem(key) || "") as T;
  } catch {
    return fallback;
  }
};

export const getFavoriteWordIds = () => new Set(readJson<string[]>(FAVORITES_KEY, []));
export const saveFavoriteWordIds = (ids: Set<string>) =>
  checkedPreference(FAVORITES_KEY, JSON.stringify([...ids]));

export const getCustomWords = () => parseCustomWords(readJson<Word[]>(CUSTOM_WORDS_KEY, []));

export const hydrateCustomVocabulary = () => notifyCatalog();

export const addCustomWord = (input: Omit<Word, "id" | "topic"> & { topic?: string }) => {
  if (!input.word.trim() || !input.meaning.trim() || getVocabulary().some((word) => word.word.toLowerCase() === input.word.trim().toLowerCase())) throw new Error("Từ này đã tồn tại hoặc thiếu từ/nghĩa.");
  const word: Word = {
    ...input,
    id: `custom-${crypto.randomUUID()}`,
    topic: input.topic?.trim() || "Từ cá nhân",
  };
  const customWords = parseCustomWords([...getCustomWords(), word]);
  checkedPreference(CUSTOM_WORDS_KEY, JSON.stringify(customWords));
  notifyCatalog();
  return word;
};

export const deleteCustomWord = (wordId: string) => {
  checkedPreference(CUSTOM_WORDS_KEY, JSON.stringify(getCustomWords().filter((word) => word.id !== wordId)));
  const favorites = getFavoriteWordIds(); favorites.delete(wordId); saveFavoriteWordIds(favorites);
  notifyCatalog();
};
export const updateCustomWord = (wordId: string, input: Omit<Word, "id">) => {
  if (!wordId.startsWith("custom-") || !getCustomWords().some((word) => word.id === wordId)) throw new Error("Không tìm thấy từ cá nhân.");
  if (!input.word.trim() || !input.meaning.trim()) throw new Error("Từ và nghĩa không được trống.");
  if (getVocabulary().some(word => word.id !== wordId && word.word.toLowerCase() === input.word.trim().toLowerCase())) throw new Error("Từ này đã tồn tại.");
  const word = parseCustomWords([{ ...input, id: wordId }])[0];
  checkedPreference(CUSTOM_WORDS_KEY, JSON.stringify(getCustomWords().map((item) => item.id === wordId ? word : item)));
  notifyCatalog(); return word;
};

export const isOnboardingComplete = () => localStorage.getItem(ONBOARDING_KEY) === "true";
export const completeOnboarding = () => localStorage.setItem(ONBOARDING_KEY, "true");

export const getStudySessionSize = () => {
  const value = Number(readOwnerItem(STUDY_SIZE_KEY));
  return [5, 10, 15, 20].includes(value) ? value : 15;
};
export const setStudySessionSize = (value: number) =>
  checkedPreference(STUDY_SIZE_KEY, String(value));

export const getReminderHour = () => {
  const storedValue = readOwnerItem(REMINDER_HOUR_KEY);
  if (storedValue === null) return 20;
  const value = Number(storedValue);
  return Number.isInteger(value) && value >= 0 && value <= 23 ? value : 20;
};
export const setReminderHour = (value: number) =>
  checkedPreference(REMINDER_HOUR_KEY, String(value));

export const getBackupPreferenceChanges = (backup: BackupV3) => ({
  [ownerKey(CUSTOM_WORDS_KEY)]: JSON.stringify(backup.customWords),
  [ownerKey(FAVORITES_KEY)]: JSON.stringify(backup.favorites),
  [ownerKey(STUDY_SIZE_KEY)]: String(backup.preferences.studySessionSize),
  [ownerKey(REMINDER_HOUR_KEY)]: String(backup.preferences.reminderHour),
  [ownerKey("eng_master_decks_v1")]: JSON.stringify(backup.decks || []),
  ...(backup.extendedPracticeRecords!==undefined?{[ownerKey("eng_master_extended_practice_v1")]:JSON.stringify(backup.extendedPracticeRecords)}:{}),
  ...(backup.practiceRecords!==undefined?{[ownerKey("eng_master_practice_records_v1")]:JSON.stringify(backup.practiceRecords)}:{}),
  ...(backup.roadmap!==undefined?{[ownerKey("eng_master_roadmap_v1")]:backup.roadmap===null?null:JSON.stringify(backup.roadmap)}:{}),
  app_sound: String(backup.preferences.sound),
  app_notifications: String(backup.preferences.notifications),
});

export const refreshCustomVocabulary = () => notifyCatalog();

export const restoreBackupPreferences = (backup: BackupV3) => {
  writeLocalChanges(getBackupPreferenceChanges(backup));
  refreshCustomVocabulary();
};

export const getDecks = () => parseDecks(readJson("eng_master_decks_v1", []));
export const saveDecks = (decks: import("../domain/schemas").Deck[]) => checkedPreference("eng_master_decks_v1", JSON.stringify(parseDecks(decks)));

export const importCustomWords=(rows:import('../domain/documentImport').ImportRow[],deckName='')=>{
  const known=new Set(getVocabulary().map(word=>word.word.normalize('NFC').trim().toLowerCase()));
  const entries=rows.map(row=>{const key=row.word.normalize('NFC').trim().toLowerCase();if(known.has(key))throw Error('Thư viện đã thay đổi hoặc có từ trùng. Xem trước lại dữ liệu.');known.add(key);return{...row,id:'custom-'+crypto.randomUUID()};});
  const words=parseCustomWords([...getCustomWords(),...entries]);
  const decks=deckName?parseDecks([...getDecks(),{id:'deck-'+crypto.randomUUID(),name:deckName,wordIds:entries.map(row=>row.id)}]):getDecks();
  const values=parseAccountPreferences({...Object.fromEntries(preferenceKeys.map(key=>[key,readOwnerItem(key)])),eng_master_custom_words_v1:JSON.stringify(words),eng_master_decks_v1:JSON.stringify(decks)});
  writeLocalChanges({[ownerKey(CUSTOM_WORDS_KEY)]:values.eng_master_custom_words_v1,[ownerKey('eng_master_decks_v1')]:values.eng_master_decks_v1});
  notifyCatalog();notifyOwnerStorage('local');return entries.length;
};
