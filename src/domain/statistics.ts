import { getLocalDateKey } from "../lib/learning";
import type { StudyEvent } from "../types";
export const summarizeEvents = (events: readonly StudyEvent[], periodDays: number, now = new Date()) => {
  const cutoff = now.getTime() - periodDays * 86_400_000;
  const records = events.filter((event) => Date.parse(event.occurredAt) >= cutoff && Date.parse(event.occurredAt) <= now.getTime());
  const days = new Map<string, { count: number; ef: number; seconds: number; ids: Set<string> }>();
  for (const event of records) {
    const day = getLocalDateKey(new Date(event.occurredAt), event.timeZone);
    const row = days.get(day) || { count: 0, ef: 0, seconds: 0, ids: new Set<string>() };
    row.count++; row.ef += event.after.easiness; row.seconds += event.durationSeconds; row.ids.add(event.wordId); days.set(day, row);
  }
  const quizzes = records.filter((event) => typeof event.correct === "boolean");
  return { attempts: records.length, uniqueWords: new Set(records.map((event) => event.wordId)).size,
    activeMinutes: Math.round(records.reduce((sum, event) => sum + event.durationSeconds, 0) / 60 * 10) / 10,
    accuracy: quizzes.length ? Math.round(quizzes.filter((event) => event.correct).length / quizzes.length * 100) : null,
    days: [...days.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, row]) => ({ date, "Độ dễ (EF)": Math.round(row.ef / row.count * 100) / 100, attempts: row.count, words: row.ids.size, minutes: Math.round(row.seconds / 60 * 10) / 10 })),
  };
};
