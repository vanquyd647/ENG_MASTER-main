import { parseExtendedPracticeRecords } from './extendedPracticeRecords';
import { parsePracticeRecords } from './practiceRecords';
import { parseRoadmap } from './roadmap';
import type { UserProfile, SessionDraft, BackupPreferences } from '../types';
import type { Word } from '../data/vocabularyTypes';
import { isRecord, isIsoDate, parseSessionLog } from '../lib/dataValidation';
export interface Deck { id: string; name: string; wordIds: string[]; }
export const parseCustomWords = (value: unknown): Word[] => {
  if (!Array.isArray(value) || value.length > 10_000) throw new Error('Danh sách từ cá nhân không hợp lệ.');
  const seen = new Set<string>();
  return value.map(item => {
    if (!isRecord(item) || typeof item.id !== 'string' || !/^custom-[a-zA-Z0-9_-]{1,120}$/.test(item.id) || seen.has(item.id)) throw new Error('ID từ cá nhân không hợp lệ hoặc bị trùng.');
    seen.add(item.id); const result: Record<string, unknown> = {id:item.id};
    for (const field of ['word','meaning','topic','phonetic','pos','example','exampleTranslation'] as const) {
      const max = field === 'word' ? 80 : field === 'meaning' ? 300 : 2000;
      if (typeof item[field] !== 'string' || item[field].length > max || (['word','meaning','topic','pos'].includes(field) && !item[field].trim())) throw new Error(`Trường ${field} không hợp lệ.`);
      result[field] = item[field];
    }
    if (item.translations !== undefined) { if (!isRecord(item.translations) || Object.keys(item.translations).length > 20 || Object.values(item.translations).some(v => typeof v !== 'string' || v.length > 2000)) throw new Error('Bản dịch không hợp lệ.'); result.translations=item.translations; }
    if (item.source !== undefined) { const s=item.source; if (!isRecord(s) || typeof s.document !== 'string' || s.document.length>200 || !Number.isSafeInteger(s.page) || Number(s.page)<1 || !Number.isSafeInteger(s.entry) || Number(s.entry)<1) throw new Error('Nguồn từ không hợp lệ.');result.source=s; }
    return result as unknown as Word;
  });
};
export const parsePreferences = (value: unknown): BackupPreferences => {
  if (!isRecord(value) || typeof value.sound !== 'boolean' || typeof value.notifications !== 'boolean' || ![5,10,15,20].includes(Number(value.studySessionSize)) || typeof value.studySessionSize !== 'number' || typeof value.reminderHour !== 'number' || !Number.isInteger(value.reminderHour) || value.reminderHour < 0 || value.reminderHour > 23) throw new Error('Cài đặt học không hợp lệ.');
  return { sound:value.sound,notifications:value.notifications,studySessionSize:value.studySessionSize,reminderHour:value.reminderHour };
};
export const parseProfile = (value: unknown): UserProfile => {
  if (!isRecord(value) || typeof value.uid !== 'string' || !value.uid || value.uid.length>128 || typeof value.email !== 'string' || value.email.length>=256 || typeof value.displayName !== 'string' || value.displayName.length>120) throw new Error('Hồ sơ không hợp lệ.');
  for (const key of ['totalWordsLearned','studyTimeMinutes','streak'] as const) if (!Number.isSafeInteger(value[key]) || Number(value[key])<0) throw new Error(`Hồ sơ ${key} không hợp lệ.`);
  if (value.dailyGoal !== undefined && (typeof value.dailyGoal !== 'number' || !Number.isInteger(value.dailyGoal) || value.dailyGoal<5 || value.dailyGoal>50)) throw new Error('Mục tiêu phải từ 5 đến 50.');
  if (value.photoURL !== undefined && (typeof value.photoURL !== 'string' || value.photoURL.length>900_000 || !/^(https:\/\/|data:image\/(jpeg|png|webp);base64,)/.test(value.photoURL))) throw new Error('Ảnh hồ sơ không hợp lệ.');
  if (value.lastStudyDate !== undefined && (typeof value.lastStudyDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value.lastStudyDate))) throw new Error('Ngày học không hợp lệ.');
  if (value.history !== undefined && (!Array.isArray(value.history) || value.history.length>50)) throw new Error('Lịch sử hồ sơ không hợp lệ.');
  if (value.datasetGeneration !== undefined && (typeof value.datasetGeneration !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(value.datasetGeneration))) throw new Error('Phiên bản dữ liệu không hợp lệ.');
  if(value.studyTimeSeconds!==undefined && (!Number.isSafeInteger(value.studyTimeSeconds) || Number(value.studyTimeSeconds)<0))throw new Error('Thời lượng học không hợp lệ.');
  return {uid:value.uid,...(value.studyTimeSeconds!==undefined?{studyTimeSeconds:Number(value.studyTimeSeconds)}:{}),...(value.datasetGeneration?{datasetGeneration:String(value.datasetGeneration)}:{}),email:value.email,displayName:value.displayName,totalWordsLearned:Number(value.totalWordsLearned),studyTimeMinutes:Number(value.studyTimeMinutes),streak:Number(value.streak),...(value.dailyGoal!==undefined?{dailyGoal:Number(value.dailyGoal)}:{}),...(value.photoURL?{photoURL:String(value.photoURL)}:{}),...(value.lastStudyDate?{lastStudyDate:String(value.lastStudyDate)}:{}),...(Array.isArray(value.history)?{history:value.history.map(item=>parseSessionLog(item))}:{})};
};
export const parseDecks = (value: unknown): Deck[] => {
  if (!Array.isArray(value) || value.length>100) throw new Error('Tối đa 100 bộ từ cá nhân.');
  const seen=new Set<string>();
  return value.map(item=>{if (!isRecord(item) || typeof item.id!=='string' || !/^deck-[a-zA-Z0-9_-]{1,120}$/.test(item.id) || seen.has(item.id) || typeof item.name!=='string' || !item.name.trim() || item.name.length>80 || !Array.isArray(item.wordIds) || item.wordIds.length>10_000 || item.wordIds.some(v=>typeof v!=='string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(v))) throw new Error('Bộ từ không hợp lệ.');seen.add(item.id);return {id:item.id,name:item.name,wordIds:[...new Set(item.wordIds as string[])]};});
};
export const parseSessionDraft = (value: unknown): SessionDraft => {
  if (!isRecord(value) || typeof value.id!=='string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(value.id) || !['review-new','review-review','practice','quiz'].includes(String(value.kind)) || !isIsoDate(value.updatedAt) || !Array.isArray(value.wordIds) || !value.wordIds.length || value.wordIds.length>20 || new Set(value.wordIds).size!==value.wordIds.length || value.wordIds.some(v=>typeof v!=='string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(v)) || !Number.isInteger(value.cursor) || Number(value.cursor)<0 || Number(value.cursor)>=value.wordIds.length || !Array.isArray(value.completedIds) || value.completedIds.some(v=>!(value.wordIds as unknown[]).includes(v))) throw new Error('Phiên dở không hợp lệ.');
  if (value.questions!==undefined && (!Array.isArray(value.questions) || value.questions.length!==value.wordIds.length || value.questions.some(q=>!isRecord(q) || typeof q.wordId!=='string' || !(value.wordIds as unknown[]).includes(q.wordId) || !['fill','mcq'].includes(String(q.type)) || typeof q.questionText!=='string' || q.questionText.length>2000 || typeof q.answer!=='string' || !q.answer || q.answer.length>2000 || !Array.isArray(q.options) || q.options.length>4 || q.options.some(v=>typeof v!=='string' || v.length>2000)))) throw new Error('Câu hỏi trong phiên dở không hợp lệ.');
  if (value.answers!==undefined && (!isRecord(value.answers) || Object.entries(value.answers).some(([id,v])=>!(value.wordIds as unknown[]).includes(id) || typeof v!=='string' || v.length>2000))) throw new Error('Câu trả lời trong phiên dở không hợp lệ.');
  return value as unknown as SessionDraft;
};

export const parseAccountPreferences = (value: unknown): Record<string,string | null> => {
  const keys=['eng_master_custom_words_v1','eng_master_favorites_v1','eng_master_decks_v1','eng_master_study_size_v1','eng_master_reminder_hour_v1','eng_master_roadmap_v1','eng_master_practice_records_v1','eng_master_extended_practice_v1'];
  if(!isRecord(value) || Object.keys(value).some(key=>!keys.includes(key)) || Object.values(value).some(raw=>raw!==null && (typeof raw!=='string')))throw new Error('Cài đặt tài khoản không hợp lệ.');
  const result=value as Record<string,string | null>;
  if(Object.values(result).some(raw=>raw!==null&&raw.length>800_000))throw new Error('Dữ liệu cá nhân quá lớn để đồng bộ; giảm số từ hoặc độ dài ví dụ.');
  if(result.eng_master_custom_words_v1)parseCustomWords(JSON.parse(result.eng_master_custom_words_v1));
  if(result.eng_master_decks_v1)parseDecks(JSON.parse(result.eng_master_decks_v1));
  if(result.eng_master_favorites_v1){const ids:unknown=JSON.parse(result.eng_master_favorites_v1);if(!Array.isArray(ids)||ids.length>10_000||ids.some(id=>typeof id!=='string'||!/^[a-zA-Z0-9_-]{1,128}$/.test(id)))throw new Error('Yêu thích không hợp lệ.');}
  if(result.eng_master_study_size_v1!==undefined&&result.eng_master_study_size_v1!==null&&![5,10,15,20].includes(Number(result.eng_master_study_size_v1)))throw new Error('Cỡ phiên không hợp lệ.');
  if(result.eng_master_reminder_hour_v1!==undefined&&result.eng_master_reminder_hour_v1!==null&&(!/^\d{1,2}$/.test(result.eng_master_reminder_hour_v1)||Number(result.eng_master_reminder_hour_v1)>23))throw new Error('Giờ nhắc không hợp lệ.');
  if(result.eng_master_extended_practice_v1)parseExtendedPracticeRecords(JSON.parse(result.eng_master_extended_practice_v1));
  if(result.eng_master_practice_records_v1)parsePracticeRecords(JSON.parse(result.eng_master_practice_records_v1));
  if(result.eng_master_roadmap_v1)parseRoadmap(JSON.parse(result.eng_master_roadmap_v1));
  if(new TextEncoder().encode(JSON.stringify(result)).length>900_000)throw new Error('Cài đặt tài khoản quá lớn để đồng bộ. Hãy giảm nội dung từ cá nhân.');
  return result;
};
