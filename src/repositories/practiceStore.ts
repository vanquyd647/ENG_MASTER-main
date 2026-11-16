import { withLearningWriteLock } from './learningWriteLock';
import { getCachedGeneration } from './cloudDataset';
import { writeLocalChanges } from '../lib/localTransaction';
import { useSyncExternalStore } from 'react';
import { ALL_PRACTICE_QUESTIONS } from '../data/learningContent';
import type { LearningQuestion as PracticeQuestion } from '../data/extendedPractice';
import { parseExtendedPracticeRecords, type LearningRecord } from '../domain/extendedPracticeRecords';
import { parsePracticeRecords, type PracticeRecord } from '../domain/practiceRecords';
import { parseAccountPreferences } from '../domain/schemas';
import { preferencePayload } from './localRepository';
import { getActiveOwner, ownerKey, notifyOwnerStorage, readOwnerItem, subscribeOwner, writeOwnerItem } from './ownerStorage';

export const PRACTICE_RECORDS_KEY = 'eng_master_practice_records_v1';
export const EXTENDED_RECORDS_KEY = 'eng_master_extended_practice_v1';
export const readLearningRecords=():LearningRecord[]=>[...readPracticeRecords(),...parseExtendedPracticeRecords(JSON.parse(readOwnerItem(EXTENDED_RECORDS_KEY)||'[]'))].sort((a,b)=>Date.parse(b.finishedAt)-Date.parse(a.finishedAt)||b.id.localeCompare(a.id));
export const PRACTICE_DRAFT_KEY = 'eng_master_workplace_draft_v2';
const LEGACY_DRAFT_KEY='eng_master_workplace_draft_v1';
const draftDataset=()=>getCachedGeneration(getActiveOwner())+':'+(readOwnerItem('eng_master_local_dataset_revision_v1')||'legacy');
export const readPracticeRecords = (): PracticeRecord[] => parsePracticeRecords(JSON.parse(readOwnerItem(PRACTICE_RECORDS_KEY) || '[]'));
export const usePracticeRecords = () => {
  const raw = useSyncExternalStore(subscribeOwner, () => getActiveOwner() + ':' + (readOwnerItem(PRACTICE_RECORDS_KEY) || '[]') + ':' + (readOwnerItem(EXTENDED_RECORDS_KEY) || '[]'));
  // The scalar snapshot stays stable while unrelated owner storage changes.
  void raw;
  try { return { records: readLearningRecords(), error: null }; }
  catch { return { records: [] as LearningRecord[], error: 'Chưa đọc được kết quả bài luyện. Hãy tải bản sao dữ liệu thiết bị trong Cài đặt để kiểm tra trước khi lưu bài mới.' }; }
};
export const savePracticeRecord = (record: LearningRecord) => withLearningWriteLock(() => {
  const key=record.bankVersion===2?EXTENDED_RECORDS_KEY:PRACTICE_RECORDS_KEY;
  const parse=record.bankVersion===2?parseExtendedPracticeRecords:parsePracticeRecords;
  // Validate both histories first; do not hide corruption in the other namespace.
  readLearningRecords();
  const next = parse([record, ...JSON.parse(readOwnerItem(key)||'[]').filter((row:LearningRecord)=>row.id!==record.id)].slice(0,100));
  parseAccountPreferences({ ...preferencePayload(), [key]: JSON.stringify(next) });
  writeOwnerItem(key, JSON.stringify(next));
  return next;
});

export interface PracticeDraft {
  dataset?:string; bankVersion?:1|2; id: string; kind: PracticeQuestion['kind']; questionIds: string[]; answers: Record<string, number>;
  cursor: number; startedAt: string; deadline: number | null;
}
export const parsePracticeDraft = (input: unknown): PracticeDraft => {
  const value = input as PracticeDraft;
  if (!value || !Array.isArray(value.questionIds) || !value.answers || typeof value.answers !== 'object' || Array.isArray(value.answers)
    || !Number.isInteger(value.cursor) || value.cursor < 0 || value.cursor >= value.questionIds.length
    || Object.entries(value.answers).some(([id, selected]) => !value.questionIds.includes(id) || !Number.isInteger(selected))
    || (value.deadline !== null && (!Number.isFinite(value.deadline) || value.deadline < Date.parse(value.startedAt) || value.deadline > Date.parse(value.startedAt) + 86400000))) throw Error('Phiên bài luyện đang dở không hợp lệ.');
  const parse=value.bankVersion===2?parseExtendedPracticeRecords:parsePracticeRecords;
  if(value.dataset!==undefined&&(typeof value.dataset!=='string'||value.dataset.length>300))throw Error('Dataset bài luyện không hợp lệ.');
  if(value.bankVersion!==undefined&&value.bankVersion!==1&&value.bankVersion!==2)throw Error('Phiên bản bài luyện không hợp lệ.');
  parse([{ ...value, bankVersion: value.bankVersion || 1, finishedAt: new Date(Math.max(Date.now(), Date.parse(value.startedAt))).toISOString(), durationSeconds: 0,
    answers: value.questionIds.map(questionId => ({ questionId, selectedIndex: value.answers[questionId] ?? null })) }]);
  return value;
};
export const readPracticeDraft = (): PracticeDraft | null => {
  const raw = JSON.parse(readOwnerItem(PRACTICE_DRAFT_KEY) || 'null') || JSON.parse(readOwnerItem(LEGACY_DRAFT_KEY)||'null');
  if(raw===null)return null;
  const draft=parsePracticeDraft(raw);
  return draft.dataset&&draft.dataset!==draftDataset()?null:draft;
};
export const savePracticeDraft = (draft: PracticeDraft | null, replaceExisting=false) => {
  const valid=draft&&parsePracticeDraft(draft);
  const raw=readOwnerItem(PRACTICE_DRAFT_KEY);
  const activeKey=raw&&raw!=='null'?PRACTICE_DRAFT_KEY:LEGACY_DRAFT_KEY;
  const key=valid?.bankVersion===2?PRACTICE_DRAFT_KEY:LEGACY_DRAFT_KEY;
  writeLocalChanges({...(replaceExisting?{[ownerKey(PRACTICE_DRAFT_KEY)]:null,[ownerKey(LEGACY_DRAFT_KEY)]:null}:{}),[ownerKey(valid?key:activeKey)]:valid?JSON.stringify(valid):null});
  notifyOwnerStorage('local');
};
export const createPracticeDraft = (kind: PracticeQuestion['kind'], ids: string[], timed = false): PracticeDraft => {
  if (!ids.every(id => ALL_PRACTICE_QUESTIONS.some(question => question.id === id && question.kind === kind))) throw Error('Danh sách câu hỏi không hợp lệ.');
  const now = Date.now();
  return parsePracticeDraft({ dataset:draftDataset(), bankVersion:2, id: crypto.randomUUID(), kind, questionIds: ids, answers: {}, cursor: 0, startedAt: new Date(now).toISOString(),
    deadline: timed ? now + ids.length * (kind==='part6'||kind==='part7'?90:30) * 1000 : null });
};
