import { withLearningWriteLock, learningScope, canLockLearningWrites } from './learningWriteLock';
import { useSyncExternalStore } from 'react';
import { createExamDraft, parseExamDraft, examRecords, collectExamResults, type ExamDraft } from '../domain/fullExam';
import { parseExtendedPracticeRecords } from '../domain/extendedPracticeRecords';
import { parseAccountPreferences } from '../domain/schemas';
import { preferencePayload } from './localRepository';
import { readLearningRecords, EXTENDED_RECORDS_KEY } from './practiceStore';
import { ownerKey, readOwnerItem, subscribeOwner, notifyOwnerStorage } from './ownerStorage';
import { writeLocalChanges } from '../lib/localTransaction';
export const EXAM_DRAFT_KEY='eng_master_full_exam_draft_v1';
const scope=learningScope;
const locked=<T,>(action:()=>T)=>{if(!canLockLearningWrites())return Promise.reject(new Error('Trình duyệt chưa hỗ trợ lưu đề dài an toàn. Hãy dùng trình duyệt mới với kết nối bảo mật.'));return withLearningWriteLock(action);};
export const readExamDraft = () => {
 const raw=readOwnerItem(EXAM_DRAFT_KEY);if(!raw)return null;
 const draft=parseExamDraft(JSON.parse(raw));return draft.scope===scope()?draft:null;
};
export const useExamDraft = () => {
 useSyncExternalStore(subscribeOwner,()=>scope()+':'+(readOwnerItem(EXAM_DRAFT_KEY)||''));
 try{return {draft:readExamDraft(),error:''};}catch(error){return {draft:null,error:(error as Error).message};}
};
export const startExam = (now=Date.now()) => locked(() => {
 if(readExamDraft())throw Error('Đang có đề chưa nộp. Tiếp tục hoặc bỏ bản nháp trước khi bắt đầu đề mới.');
 readLearningRecords();const draft=createExamDraft(scope(),now);
 writeLocalChanges({[ownerKey(EXAM_DRAFT_KEY)]:JSON.stringify(draft)});notifyOwnerStorage('local');return draft;
});
const assertCurrent = (draft:ExamDraft) => {
 if(draft.scope!==scope())throw Error('Tài khoản hoặc bộ dữ liệu đã đổi. Không ghi câu trả lời của phiên cũ.');
 const current=readExamDraft();if(!current||current.id!==draft.id||current.revision!==draft.revision)throw Error('Đề đã thay đổi ở tab khác. Tải lại để dùng bản mới nhất.');
 return current;
};
export const editExam = (draft:ExamDraft, change:(current:ExamDraft)=>ExamDraft) => locked(() => {
 const current=assertCurrent(draft),next=parseExamDraft(change(current));
 if(next.id!==current.id||next.scope!==current.scope||next.formId!==current.formId||next.startedAt!==current.startedAt||next.updatedAt<current.updatedAt)throw Error('Không được thay danh tính hoặc mốc bắt đầu đề.');
 next.revision=current.revision+1;writeLocalChanges({[ownerKey(EXAM_DRAFT_KEY)]:JSON.stringify(next)});notifyOwnerStorage('local');return next;
});
export const discardExam = (draft:ExamDraft) => locked(() => {
 assertCurrent(draft);writeLocalChanges({[ownerKey(EXAM_DRAFT_KEY)]:null});notifyOwnerStorage('local');
});
export const finishExam = (draft:ExamDraft, now=Date.now()) => locked(() => {
 if(draft.scope!==scope())throw Error('Bộ dữ liệu đã đổi. Không nộp phiên cũ vào tài khoản khác.');
 const existing=collectExamResults(readLearningRecords()).find(row=>row.id===draft.id);
 if(!readExamDraft()&&existing?.complete)return existing;
 const current=assertCurrent(draft),rows=examRecords(current,now);
 const ids=new Set(rows.map(row=>row.id));
 const prior=parseExtendedPracticeRecords(JSON.parse(readOwnerItem(EXTENDED_RECORDS_KEY)||'[]'));
 const next=parseExtendedPracticeRecords([...rows,...prior.filter(row=>!ids.has(row.id))].slice(0,100));
 parseAccountPreferences({...preferencePayload(),[EXTENDED_RECORDS_KEY]:JSON.stringify(next)});
 // Commit all seven parts and remove the draft together, with rollback on quota failure.
 writeLocalChanges({[ownerKey(EXTENDED_RECORDS_KEY)]:JSON.stringify(next),[ownerKey(EXAM_DRAFT_KEY)]:null});
 notifyOwnerStorage('local');return collectExamResults(next).find(row=>row.id===draft.id)!;
});
