import { beforeEach, expect, it, vi } from 'vitest';
import { PRACTICE_BANK } from '../data/workplacePractice';
import { VOCABULARY } from '../data/vocabulary';
import { collectPracticeMistakes, selectPracticeQuestions, summarizePracticeTopics } from './practiceLearning';
import { buildTodayLearning, parseTodayLearning } from './todayLearning';
import type { PracticeRecord } from './practiceRecords';
import { createPracticeDraft, parsePracticeDraft, readPracticeRecords, savePracticeRecord } from '../repositories/practiceStore';
import { readOwnerItem, setActiveOwner, writeOwnerItem } from '../repositories/ownerStorage';
vi.mock('../lib/firebase', () => ({ auth: { currentUser: null }, db: {} }));
const q = PRACTICE_BANK[0], q2 = PRACTICE_BANK[1];
const record = (id: string, selectedIndex: number | null, time = '2026-10-15T10:00:00Z'): PracticeRecord => ({ id, bankVersion: 1, kind: 'part5', startedAt: '2026-10-15T09:00:00Z', finishedAt: time, durationSeconds: 60, answers: [{ questionId: q.id, selectedIndex }] });
beforeEach(() => { localStorage.clear(); setActiveOwner('guest'); });
it('separates wrong and unanswered attempts, resolves correct retries, then reopens a repeated error', () => {
  const wrong = record('wrong', (q.correctIndex + 1) % q.options.length);
  const blank = record('blank', null, '2026-10-15T11:00:00Z');
  const correct = record('correct', q.correctIndex, '2026-10-15T12:00:00Z');
  expect(collectPracticeMistakes([correct, blank, wrong])).toMatchObject([{ wrongAttempts: 1, unansweredAttempts: 1, resolved: true, selectedIndex: q.correctIndex }]);
  expect(collectPracticeMistakes([record('later', null, '2026-10-15T13:00:00Z'), correct, blank, wrong])[0]).toMatchObject({ resolved: false, wrongAttempts: 1, unansweredAttempts: 2 });
  expect(collectPracticeMistakes([correct])).toEqual([]);
});
it('filters unseen/incorrect by kind and topic without mutating bank IDs/options', () => {
  const records = [record('wrong', null)];
  const unseen = selectPracticeQuestions(records, { kind: 'part5', scope: 'unseen', count: 60, random: () => 0 });
  expect(unseen).toHaveLength(47); expect(unseen.some(row => row.id === q.id)).toBe(false);
  expect(selectPracticeQuestions(records, { kind: 'part5', scope: 'mistakes', count: 10 }).map(row=>row.id)).toEqual([q.id]);
  expect(selectPracticeQuestions(records, { kind: 'part2', scope: 'mistakes' })).toEqual([]);
  expect(selectPracticeQuestions([], { kind: 'part5', topic: q2.topic, count: 60 }).every(row => row.topic === q2.topic)).toBe(true);
  expect(PRACTICE_BANK[0]).toBe(q);
});
it('reports actual topic denominators including blanks and excludes future/out-of-period records', () => {
  const rows = summarizePracticeTopics([record('correct', q.correctIndex), record('blank', null), record('future', q.correctIndex, '2027-01-01T00:00:00Z')], Date.parse('2026-10-15T00:00:00Z'), Date.parse('2026-10-16T00:00:00Z'));
  expect(rows).toEqual([{ kind: 'part5', topic: q.topic, correct: 1, total: 2, unanswered: 1 }]);
});
it('keeps record writes idempotent, scoped and refuses to overwrite malformed previous history', async () => {
  const value = record('same', q.correctIndex); await savePracticeRecord(value); await savePracticeRecord(value);
  expect(readPracticeRecords()).toHaveLength(1);
  setActiveOwner('another'); expect(readPracticeRecords()).toEqual([]);
  writeOwnerItem('eng_master_practice_records_v1', 'broken');
  await expect(savePracticeRecord(value)).rejects.toThrow(); expect(readOwnerItem('eng_master_practice_records_v1')).toBe('broken');
});
it('validates resumable practice drafts and scales the timed deadline to the actual question count', () => {
  const draft = createPracticeDraft('part5', [q.id], true);
  expect(draft.deadline! - Date.parse(draft.startedAt)).toBe(30_000);
  expect(parsePracticeDraft({ ...draft, answers: { [q.id]: q.correctIndex } })).toBeTruthy();
  expect(() => parsePracticeDraft({ ...draft, answers: { unknown: 0 } })).toThrow();
  expect(() => parsePracticeDraft({ ...draft, answers: { [q.id]: 0.5 } })).toThrow();
  expect(() => createPracticeDraft('part2', [q.id])).toThrow();
  expect(() => createPracticeDraft('part5', [q.id, q.id])).toThrow();
});
it('builds a small daily flow from actual due words and mistakes, respects exam day and missing audio', () => {
  const roadmap = { version: 1 as const, examDate: '2026-10-15', targetScore: 650, minutesPerDay: 5, targetWords: 20 };
  const word = VOCABULARY[0];
  const plan = buildTodayLearning({ words: VOCABULARY, progress: { [word.id]: { easiness: 2.5, repetitions: 1, interval: 1, nextReviewDate: '2026-10-15T08:00:00Z' } }, events: [], records: [record('blank', null)], date: '2026-10-15', dataset: 'qa', roadmap, canListen: false, now: Date.parse('2026-10-15T10:00:00Z') });
  expect(parseTodayLearning(JSON.parse(JSON.stringify(plan)))).toEqual(plan);
  expect(plan.steps.map(row => row.kind)).toEqual(['review', 'practice']);
  expect(plan.steps[0]).toMatchObject({ wordIds: [word.id] });
  expect(plan.steps[1]).toMatchObject({ practiceKind: 'part5', questionIds: [q.id] });
  expect(() => parseTodayLearning({ ...plan, steps: [{ ...plan.steps[1], questionIds: ['unknown'] }] })).toThrow();
});
