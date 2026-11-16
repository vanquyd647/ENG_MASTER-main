import fs from 'node:fs';
import { beforeEach, expect, it, vi } from 'vitest';
vi.mock('../lib/firebase', () => ({ auth: { currentUser: null }, db: {} }));
import { LISTENING_QUESTIONS, LISTENING_STIMULI } from '../data/listeningPractice';
import { LISTENING_PRACTICE_INDEX } from '../data/listeningPracticeIndex';
import { ALL_PRACTICE_QUESTIONS } from '../data/learningContent';
import { parseExtendedPracticeRecords, type ExtendedPracticeRecord } from './extendedPracticeRecords';
import { collectPracticeMistakes, selectPracticeQuestions } from './practiceLearning';
import { createPracticeDraft, savePracticeDraft, readPracticeDraft, savePracticeRecord, readLearningRecords } from '../repositories/practiceStore';
import { setActiveOwner } from '../repositories/ownerStorage';
import { createBackup, normalizeBackup } from '../lib/backup';
import { restoreBackupPreferences } from '../lib/productPreferences';

beforeEach(() => { localStorage.clear(); setActiveOwner('guest'); });

it('has matched local images/transcripts, unique IDs, and the compact record contract for all 18 pilot questions', () => {
  expect(LISTENING_QUESTIONS).toHaveLength(18);
  expect(ALL_PRACTICE_QUESTIONS).toHaveLength(311);
  expect(new Set(ALL_PRACTICE_QUESTIONS.map(q => q.id)).size).toBe(311);
  expect(Object.keys(LISTENING_PRACTICE_INDEX).sort()).toEqual(LISTENING_QUESTIONS.map(q => q.id).sort());
  for (const stimulus of LISTENING_STIMULI) {
    const questions = LISTENING_QUESTIONS.filter(q => q.listeningId === stimulus.id);
    expect(questions).toHaveLength(stimulus.kind === 'part1' ? 1 : 3);
    if (stimulus.image) {
      expect(fs.statSync('public' + stimulus.image.src).size).toBeGreaterThan(10000);
      expect(stimulus.image).toMatchObject({ license: 'CC0-1.0' });
      expect(stimulus.image.author).toBeTruthy();
    } else {
      expect(stimulus.lines.length).toBeGreaterThan(0);
      expect(stimulus.lines.every(row => row.text && row.translation && row.speaker)).toBe(true);
    }
    for (const q of questions) {
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBeTruthy();
      expect(q.explanation.length).toBeGreaterThan(50);
      expect(LISTENING_PRACTICE_INDEX[q.id]).toEqual([q.kind, 4]);
    }
  }
});

it('keeps conversation and talk order/group boundaries, while exact mistakes can select a subset', () => {
  for (const kind of ['part3', 'part4'] as const) {
    const questions = selectPracticeQuestions([], { kind, count: 5, random: () => 0 });
    expect(questions).toHaveLength(3);
    expect(new Set(questions.map(q => q.listeningId)).size).toBe(1);
    expect(questions.map(q => q.id.slice(-2))).toEqual(['q1', 'q2', 'q3']);
    expect(selectPracticeQuestions([], { kind, count: 1 })).toHaveLength(3);
    expect(selectPracticeQuestions([], { kind, count: 60 }).filter(q=>q.id.includes('-listening-v1-'))).toHaveLength(6);
    expect(selectPracticeQuestions([], { kind, count: 0 })).toHaveLength(0);
  }
});

it('saves/restores new part records through backup v4, isolates owners and preserves blanks and exact mistakes', async () => {
  for (const kind of ['part1', 'part3', 'part4'] as const) {
    const q = LISTENING_QUESTIONS.find(q => q.kind === kind)!;
    const draft = createPracticeDraft(kind, [q.id], true);
    savePracticeDraft({ ...draft, answers: { [q.id]: 2 } }, true);
    expect(readPracticeDraft()?.answers).toEqual({ [q.id]: 2 });
    expect(draft.deadline! - Date.parse(draft.startedAt)).toBe(30000);
    const record: ExtendedPracticeRecord = { id: kind, bankVersion: 2, kind, startedAt: draft.startedAt, finishedAt: draft.startedAt, durationSeconds: 0, answers: [{ questionId: q.id, selectedIndex: null }] };
    await savePracticeRecord(record);
    expect(() => parseExtendedPracticeRecords([{ ...record, kind: 'part5' }])).toThrow();
    expect(() => parseExtendedPracticeRecords([{ ...record, answers: [{ questionId: q.id, selectedIndex: 4 }] }])).toThrow();
  }
  const backup = normalizeBackup(JSON.parse(JSON.stringify(createBackup(null, {}))));
  expect(backup.version).toBe(4);
  if (backup.version === 2) throw Error('Expected backup v4');
  expect(collectPracticeMistakes(readLearningRecords())).toHaveLength(3);
  expect(selectPracticeQuestions(readLearningRecords(), { kind: 'part3', scope: 'mistakes' })).toHaveLength(1);
  localStorage.clear(); restoreBackupPreferences(backup);
  expect(readLearningRecords()).toHaveLength(3);
  setActiveOwner('other'); expect(readLearningRecords()).toEqual([]); expect(readPracticeDraft()).toBeNull();
});
