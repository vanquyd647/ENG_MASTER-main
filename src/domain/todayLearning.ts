import type { Word } from '../data/vocabularyTypes';
import type { StudyEvent, UserProgress } from '../types';
import { collectMistakes, parseQuizAttempt, type MistakeRecord } from './mistakes';
import { buildRoadmapDay, type Roadmap } from './roadmap';
import { collectPracticeMistakes, selectPracticeQuestions } from './practiceLearning';
import type { LearningRecord as PracticeRecord } from './extendedPracticeRecords';
import { ALL_PRACTICE_QUESTIONS as PRACTICE_BANK } from '../data/learningContent';

export type TodayStep = { id: string; sessionId: string; done: boolean } & (
  { kind: 'review'; wordIds: string[] } |
  { kind: 'new'; wordIds: string[] } |
  { kind: 'mistake'; mistake: MistakeRecord } |
  { kind: 'practice'; practiceKind: 'part5' | 'part2'; questionIds: string[] }
);
export interface TodayLearning { version: 1; date: string; minutes: number; dataset: string; steps: TodayStep[]; }
export const buildTodayLearning = ({ words, progress, events, records, date, dataset, roadmap, canListen, now = Date.now() }: {
  words: readonly Word[]; progress: UserProgress; events: StudyEvent[]; records: PracticeRecord[];
  date: string; dataset: string; roadmap?: Roadmap | null; canListen: boolean; now?: number;
}): TodayLearning => {
  const minutes = roadmap?.minutesPerDay || 15;
  const plan = roadmap ? buildRoadmapDay(roadmap, words, progress, date, 25, now) : null;
  const steps: TodayStep[] = [];
  const base = () => ({ id: crypto.randomUUID(), sessionId: crypto.randomUUID(), done: false });
  // Short sessions reserve time for correcting mistakes and applying knowledge.
  const due = (plan?.reviewIds || words.filter(word => progress[word.id] && Date.parse(progress[word.id].nextReviewDate) <= now)
    .sort((a, b) => Date.parse(progress[a.id].nextReviewDate) - Date.parse(progress[b.id].nextReviewDate)).map(word => word.id)).slice(0, minutes < 10 ? 2 : 5);
  if (due.length) steps.push({ ...base(), kind: 'review', wordIds: due });
  const mistake = collectMistakes(events).find(row => !row.resolved && words.some(word => word.id === row.wordId) && (row.mode !== 'listening' || canListen));
  if (mistake) steps.push({ ...base(), kind: 'mistake', mistake });
  const newIds = (plan?.newIds || words.filter(word => !progress[word.id]).map(word => word.id)).slice(0, minutes < 10 ? (due.length || mistake ? 0 : 2) : 3);
  if (newIds.length) steps.push({ ...base(), kind: 'new', wordIds: newIds });
  const mistakes = collectPracticeMistakes(records).filter(row => !row.resolved && (row.question.kind === 'part5' || row.question.kind === 'part2') && (canListen || row.question.kind !== 'part2'));
  const kind = mistakes[0]?.question.kind === 'part2' ? 'part2' : 'part5';
  const count = minutes < 10 ? 2 : 5;
  let questions = mistakes.filter(row => row.question.kind === kind).slice(0, count).map(row => row.question.id);
  if (!questions.length) questions = selectPracticeQuestions(records, { kind, scope: 'unseen', count }).map(row => row.id);
  if (!questions.length) questions = selectPracticeQuestions(records, { kind, count }).map(row => row.id);
  if (questions.length) steps.push({ ...base(), kind: 'practice', practiceKind: kind, questionIds: questions });
  return { version: 1, date, dataset, minutes, steps };
};

export const parseTodayLearning = (input: unknown): TodayLearning => {
  const plan = input as TodayLearning;
  if (!plan || plan.version !== 1 || !/^\d{4}-\d{2}-\d{2}$/.test(plan.date) || typeof plan.dataset !== 'string' || !Number.isInteger(plan.minutes) || plan.minutes < 5 || plan.minutes > 180 || !Array.isArray(plan.steps) || !plan.steps.length || plan.steps.length > 4) throw Error('Phiên Học hôm nay không hợp lệ.');
  const ids = new Set<string>();
  for (const step of plan.steps) {
    if (!step || typeof step.id !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(step.id) || ids.has(step.id) || typeof step.sessionId !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(step.sessionId) || typeof step.done !== 'boolean') throw Error('Bước học không hợp lệ.');
    ids.add(step.id);
    if (step.kind === 'review' || step.kind === 'new') {
      if (!Array.isArray(step.wordIds) || !step.wordIds.length || step.wordIds.length > 5 || new Set(step.wordIds).size !== step.wordIds.length || step.wordIds.some(id => typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(id))) throw Error('Danh sách từ của phiên học không hợp lệ.');
    } else if (step.kind === 'practice') {
      if (!['part5', 'part2'].includes(step.practiceKind) || !Array.isArray(step.questionIds) || !step.questionIds.length || step.questionIds.length > 5 || new Set(step.questionIds).size !== step.questionIds.length || step.questionIds.some(id => !PRACTICE_BANK.some(q => q.id === id && q.kind === step.practiceKind))) throw Error('Bài luyện hôm nay không hợp lệ.');
    } else if (step.kind === 'mistake') {
      const row = step.mistake;
      if (!row || typeof row.wordId !== 'string' || !['quiz', 'cloze', 'listening'].includes(row.mode) || typeof row.key !== 'string') throw Error('Câu ôn lỗi không hợp lệ.');
      parseQuizAttempt(row.attempt);
    } else throw Error('Dạng học không hợp lệ.');
  }
  return plan;
};
