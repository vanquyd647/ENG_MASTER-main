import { VOCABULARY, type Word } from "../data/vocabulary";

const FAVORITES_KEY = "eng_master_favorites_v1";
const CUSTOM_WORDS_KEY = "eng_master_custom_words_v1";
const ONBOARDING_KEY = "eng_master_onboarding_complete_v1";
const STUDY_SIZE_KEY = "eng_master_study_size_v1";
const REMINDER_HOUR_KEY = "eng_master_reminder_hour_v1";

const readJson = <T>(key: string, fallback: T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
};

export const getFavoriteWordIds = () => new Set(readJson<string[]>(FAVORITES_KEY, []));
export const saveFavoriteWordIds = (ids: Set<string>) =>
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...ids]));

export const getCustomWords = () => readJson<Word[]>(CUSTOM_WORDS_KEY, []);

export const hydrateCustomVocabulary = () => {
  const existing = new Set(VOCABULARY.map((word) => word.id));
  getCustomWords().forEach((word) => {
    if (!existing.has(word.id)) VOCABULARY.push(word);
  });
};

export const addCustomWord = (input: Omit<Word, "id" | "topic"> & { topic?: string }) => {
  const word: Word = {
    ...input,
    id: `custom-${crypto.randomUUID()}`,
    topic: input.topic?.trim() || "Từ cá nhân",
  };
  const customWords = [...getCustomWords(), word];
  localStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(customWords));
  VOCABULARY.push(word);
  return word;
};

export const deleteCustomWord = (wordId: string) => {
  localStorage.setItem(
    CUSTOM_WORDS_KEY,
    JSON.stringify(getCustomWords().filter((word) => word.id !== wordId)),
  );
  const index = VOCABULARY.findIndex((word) => word.id === wordId);
  if (index >= 0) VOCABULARY.splice(index, 1);
};

export const isOnboardingComplete = () => localStorage.getItem(ONBOARDING_KEY) === "true";
export const completeOnboarding = () => localStorage.setItem(ONBOARDING_KEY, "true");

export const getStudySessionSize = () => {
  const value = Number(localStorage.getItem(STUDY_SIZE_KEY));
  return [5, 10, 15, 20].includes(value) ? value : 15;
};
export const setStudySessionSize = (value: number) =>
  localStorage.setItem(STUDY_SIZE_KEY, String(value));

export const getReminderHour = () => {
  const storedValue = localStorage.getItem(REMINDER_HOUR_KEY);
  if (storedValue === null) return 20;
  const value = Number(storedValue);
  return Number.isInteger(value) && value >= 0 && value <= 23 ? value : 20;
};
export const setReminderHour = (value: number) =>
  localStorage.setItem(REMINDER_HOUR_KEY, String(value));
