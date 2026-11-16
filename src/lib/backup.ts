import { parseExtendedPracticeRecords } from '../domain/extendedPracticeRecords';
import { parsePracticeRecords } from '../domain/practiceRecords';
import { parseRoadmap } from '../domain/roadmap';
import { readOwnerItem } from '../repositories/ownerStorage';
import { parseCustomWords, parsePreferences, parseDecks } from "../domain/schemas";
import { BASE_VOCABULARY } from "../data/vocabulary";
import { TOEIC_PDF_VOCABULARY } from "../data/toeic-pdf";

import type { BackupV3, DailyActivity, StudyBackup, UserProfile, UserProgress } from "../types";
import { currentVocabularyIds, isIsoDate, isRecord, MAX_WORDS, parseProgressItem, parseSessionLog, parseStudyEvent } from "./dataValidation";
import { getCachedEvents } from "../repositories/localRepository";
import { getCustomWords, getDecks, getFavoriteWordIds, getReminderHour, getStudySessionSize } from "./productPreferences";

export const MAX_BACKUP_BYTES = 20 * 1024 * 1024;
const bundledIds = () => new Set([...BASE_VOCABULARY, ...TOEIC_PDF_VOCABULARY].map((word) => word.id));
const isDateKey = (value: unknown): value is string => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;

const sanitizeProfile = (value: unknown, ids: Set<string>): Partial<UserProfile> | null => {
  if (value === null || value === undefined) return null;
  if (!isRecord(value)) throw new Error("Profile must be an object.");
  const profile: Partial<UserProfile> = {};
  if (typeof value.displayName === "string") profile.displayName = value.displayName.slice(0, 120);
  if (typeof value.photoURL === "string" && value.photoURL.length <= 900_000) profile.photoURL = value.photoURL;
  for (const key of ["studyTimeMinutes", "studyTimeSeconds", "streak"] as const) {
    if (value[key] !== undefined) {
      if (typeof value[key] !== "number" || !Number.isSafeInteger(value[key]) || value[key] < 0) throw new Error(`Invalid profile ${key}.`);
      profile[key] = value[key];
    }
  }
  if (value.dailyGoal !== undefined) {
    if (typeof value.dailyGoal !== "number" || !Number.isInteger(value.dailyGoal) || value.dailyGoal < 5 || value.dailyGoal > 50) throw new Error("Invalid daily goal.");
    profile.dailyGoal = value.dailyGoal;
  }
  if (value.lastStudyDate !== undefined) {
    if (!isDateKey(value.lastStudyDate)) throw new Error("Invalid last study date.");
    profile.lastStudyDate = value.lastStudyDate;
  }
  if (value.history !== undefined) {
    if (!Array.isArray(value.history)) throw new Error("History must be an array.");
    profile.history = value.history.slice(0, 50).map((log) => parseSessionLog(log, ids));
  }
  return profile;
};

export const parseDailyActivities = (value: unknown, ids: Set<string>): Record<string, DailyActivity> => {
  if (!isRecord(value) || Object.keys(value).length > 10_000) throw new Error("Invalid daily activity.");
  const result: Record<string, DailyActivity> = {};
  for (const [dateKey, activity] of Object.entries(value)) {
    if (!isDateKey(dateKey) || !isRecord(activity) || activity.dateKey !== dateKey || typeof activity.timeZone !== "string" || activity.timeZone.length > 100 || !isIsoDate(activity.updatedAt) || !Array.isArray(activity.wordIds) || activity.wordIds.length > MAX_WORDS || activity.wordIds.some((id) => typeof id !== "string" || (!ids.has(id) && !/^custom-[a-zA-Z0-9_-]{1,120}$/.test(id)))) throw new Error(`Invalid daily activity: ${dateKey}`);
    try { new Intl.DateTimeFormat("en", { timeZone: activity.timeZone }); } catch { throw new Error(`Invalid time zone: ${dateKey}`); }
    result[dateKey] = { dateKey, timeZone: activity.timeZone, updatedAt: activity.updatedAt, wordIds: [...new Set(activity.wordIds as string[])] };
  }
  return result;
};

export const normalizeBackup = (input: unknown): StudyBackup => {
  if (!isRecord(input)) throw new Error("Backup must be an object.");
  if (input.version !== undefined && input.version !== 2 && input.version !== 3 && input.version !== 4) throw new Error("Unsupported backup version.");
  if (!isRecord(input.progress)) throw new Error("Backup progress is missing.");
  const modern = input.version === 3 || input.version === 4;
  if (input.extendedPracticeRecords !== undefined && input.version !== 4) throw Error('Bài luyện mở rộng cần backup v4.');
  const customWords = modern ? parseCustomWords(input.customWords) : [];
  const ids = modern ? new Set([...bundledIds(), ...customWords.map((word) => word.id)]) : currentVocabularyIds();
  const entries = Object.entries(input.progress);
  if (entries.length > MAX_WORDS) throw new Error("Backup contains too many progress items.");
  const progress: UserProgress = {};
  for (const [wordId, item] of entries) {
    if (!ids.has(wordId)) throw new Error(`Unknown vocabulary id: ${wordId}`);
    progress[wordId] = parseProgressItem(item);
  }
  const common = { exportedAt: isIsoDate(input.exportedAt) ? input.exportedAt : new Date().toISOString(), profile: sanitizeProfile(input.profile, ids), progress };
  if (!modern) return { version: 2, ...common };
  if (input.catalogVersion !== "toeic-1575-v1") throw new Error("Unsupported catalog version.");
  if (!Array.isArray(input.favorites) || input.favorites.length > MAX_WORDS || input.favorites.some((id) => typeof id !== "string" || !ids.has(id))) throw new Error("Invalid favorite word ids.");
  const preferences = input.preferences;
  if (input.events !== undefined && (!Array.isArray(input.events) || input.events.length > 50_000)) throw new Error("Lịch sử học quá lớn hoặc không hợp lệ.");
  if (!isRecord(preferences) || typeof preferences.sound !== "boolean" || typeof preferences.notifications !== "boolean" || ![5, 10, 15, 20].includes(preferences.studySessionSize as number) || typeof preferences.reminderHour !== "number" || !Number.isInteger(preferences.reminderHour) || preferences.reminderHour < 0 || preferences.reminderHour > 23) throw new Error("Invalid backup preferences.");
  return { version: input.version===4?4:3, ...(input.extendedPracticeRecords!==undefined?{extendedPracticeRecords:parseExtendedPracticeRecords(input.extendedPracticeRecords)}:{}), catalogVersion: "toeic-1575-v1", ...common, ...(input.practiceRecords!==undefined?{practiceRecords:parsePracticeRecords(input.practiceRecords)}:{}), ...(input.roadmap!==undefined?{roadmap:input.roadmap===null?null:parseRoadmap(input.roadmap)}:{}), customWords, favorites: [...new Set(input.favorites as string[])], preferences: parsePreferences(preferences), ...(input.decks !== undefined ? { decks: parseDecks(input.decks) } : {}), dailyActivity: parseDailyActivities(input.dailyActivity, ids), events: Array.isArray(input.events) ? input.events.map(parseStudyEvent) : [] };
};

export const createBackup = (profile: UserProfile | null, progress: UserProgress, dailyActivity: Record<string, DailyActivity> = {}): BackupV3 => normalizeBackup({
  version: readOwnerItem('eng_master_extended_practice_v1')!==null?4:3,
  ...(readOwnerItem('eng_master_extended_practice_v1')!==null?{extendedPracticeRecords:JSON.parse(readOwnerItem('eng_master_extended_practice_v1') || '[]')}:{}), catalogVersion: "toeic-1575-v1", exportedAt: new Date().toISOString(), profile, progress, customWords: getCustomWords(), decks: getDecks(), favorites: [...getFavoriteWordIds()], dailyActivity, events: getCachedEvents(),
  practiceRecords:JSON.parse(readOwnerItem("eng_master_practice_records_v1") || "[]"),
  roadmap: JSON.parse(readOwnerItem("eng_master_roadmap_v1") || "null"),
  preferences: { sound: localStorage.getItem("app_sound") !== "false", notifications: localStorage.getItem("app_notifications") === "true", studySessionSize: getStudySessionSize(), reminderHour: getReminderHour() },
}) as BackupV3;

export const parseBackupText = (text: string) => {
  if (new Blob([text]).size > MAX_BACKUP_BYTES) throw new Error("File vượt quá giới hạn 20 MB.");
  try { return normalizeBackup(JSON.parse(text)); } catch (error) { throw new Error(error instanceof SyntaxError ? "File JSON không hợp lệ." : (error as Error).message); }
};

export const parseProgressCsv = (text: string): StudyBackup => {
  if (new Blob([text]).size > MAX_BACKUP_BYTES) throw new Error("File vượt quá giới hạn 20 MB.");
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/);
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  if (lines.length < 2 || lines.length > MAX_WORDS + 1) throw new Error("CSV phải có tiêu đề và 1–10.000 dòng dữ liệu.");
  const parseRow = (line: string, number: number) => {
    const cells: string[] = [];
    let cursor = 0;
    while (cursor <= line.length) {
      let cell = "";
      if (line[cursor] === '"') {
        cursor++;
        let closed = false;
        while (cursor < line.length) {
          if (line[cursor] === '"') {
            if (line[cursor + 1] === '"') { cell += '"'; cursor += 2; }
            else { cursor++; closed = true; break; }
          } else cell += line[cursor++];
        }
        if (!closed || (cursor < line.length && line[cursor] !== ',')) throw new Error(`Dòng ${number}: dấu ngoặc kép CSV không hợp lệ.`);
      } else {
        while (cursor < line.length && line[cursor] !== ',') cell += line[cursor++];
        if (cell.includes('"')) throw new Error(`Dòng ${number}: dấu ngoặc kép CSV không hợp lệ.`);
      }
      cells.push(cell);
      if (cursor >= line.length) break;
      cursor++;
      if (cursor === line.length) { cells.push(""); break; }
    }
    return cells;
  };
  const headers = parseRow(lines[0], 1);
  const expected = ["wordId", "easiness", "interval", "repetitions", "nextReviewDate", "lastReviewDate", "wrongCount"];
  if (headers.length !== expected.length || headers.some((header, index) => header !== expected[index])) throw new Error("Tiêu đề CSV không đúng định dạng tiến độ học.");
  const ids = currentVocabularyIds();
  const progress: UserProgress = {};
  for (let index = 1; index < lines.length; index++) {
    try {
      const cells = parseRow(lines[index], index + 1);
      if (cells.length !== headers.length) throw new Error("số cột không đúng");
      const [wordId, easiness, interval, repetitions, nextReviewDate, lastReviewDate, wrongCount] = cells;
      if (!ids.has(wordId)) throw new Error(`không tìm thấy từ ${wordId}`);
      if (progress[wordId]) throw new Error(`ID trùng ${wordId}`);
      if ([easiness, interval, repetitions].some((value) => !value.trim())) throw new Error("giá trị SRS bị trống");
      progress[wordId] = parseProgressItem({ easiness: Number(easiness), interval: Number(interval), repetitions: Number(repetitions), nextReviewDate, ...(lastReviewDate ? { lastReviewDate } : {}), ...(wrongCount ? { wrongCount: Number(wrongCount) } : {}) });
    } catch (error) { throw new Error(`Dòng ${index + 1}: ${(error as Error).message}`); }
  }
  return normalizeBackup({ version: 2, progress, profile: null });
};

export const mergeBackup = (current: BackupV3, incoming: StudyBackup): BackupV3 => {
  const customWords = new Map(current.customWords.map((word) => [word.id, word]));
  if (incoming.version !== 2) for (const word of incoming.customWords) {
    const existing = customWords.get(word.id);
    if (existing && JSON.stringify(existing) !== JSON.stringify(word)) throw new Error(`Từ cá nhân xung đột ID: ${word.word}`);
    customWords.set(word.id, word);
  }
  const dailyActivity = { ...current.dailyActivity };
  if (incoming.version !== 2) for (const [day, activity] of Object.entries(incoming.dailyActivity)) dailyActivity[day] = { ...activity, wordIds: [...new Set([...(dailyActivity[day]?.wordIds || []), ...activity.wordIds])] };
  return normalizeBackup({ ...current, version:current.version===4||incoming.version===4?4:3, ...((current.extendedPracticeRecords!==undefined||(incoming.version!==2&&incoming.extendedPracticeRecords!==undefined))?{extendedPracticeRecords:[...new Map([...(incoming.version!==2?incoming.extendedPracticeRecords || []:[]),...(current.extendedPracticeRecords || [])].map(row=>[row.id,row])).values()].sort((a,b)=>Date.parse(b.finishedAt)-Date.parse(a.finishedAt)).slice(0,100)}:{}), practiceRecords:[...new Map([...(incoming.version!==2?incoming.practiceRecords || []:[]),...(current.practiceRecords || [])].map(row=>[row.id,row])).values()].sort((a,b)=>Date.parse(b.finishedAt)-Date.parse(a.finishedAt)).slice(0,100), decks: [...new Map([...(current.decks || []), ...(incoming.version !== 2 ? incoming.decks || [] : [])].map(deck => [deck.id,deck])).values()], customWords: [...customWords.values()], progress: { ...current.progress, ...incoming.progress }, dailyActivity, events: [...new Map([...(current.events || []), ...(incoming.version !== 2 ? incoming.events || [] : [])].map((event) => [event.id, event])).values()], favorites: [...new Set([...current.favorites, ...(incoming.version !== 2 ? incoming.favorites : [])])] }) as BackupV3;
};
