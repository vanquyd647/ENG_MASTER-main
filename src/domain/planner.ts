import { getVocabulary } from "./catalog";
import type { UserProgress } from "../types";
export const buildDailyPlan = (progress: UserProgress, goal: number, now = new Date()) => {
  const due = getVocabulary().filter((word) => progress[word.id] && Date.parse(progress[word.id].nextReviewDate) <= now.getTime())
    .sort((a, b) => Date.parse(progress[a.id].nextReviewDate) - Date.parse(progress[b.id].nextReviewDate) || (progress[b.id].wrongCount || 0) - (progress[a.id].wrongCount || 0));
  const weak = getVocabulary().filter((word) => (progress[word.id]?.wrongCount || 0) > 0 && !due.some((item) => item.id === word.id))
    .sort((a, b) => (progress[b.id].wrongCount || 0) - (progress[a.id].wrongCount || 0));
  const fresh = getVocabulary().filter((word) => !progress[word.id]);
  return [...due, ...weak, ...fresh].slice(0, Math.max(0, goal));
};
