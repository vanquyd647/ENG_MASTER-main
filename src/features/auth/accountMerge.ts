import { loadLocalState, getCachedEvents } from '../../repositories/localRepository';
import { loadGuestSession } from '../../lib/guestPersistence';
import { normalizeBackup, mergeBackup } from '../../lib/backup';
import type { BackupV3 } from '../../types';
export const readGuestBackup = async (): Promise<BackupV3 | null> => {
  const local = await loadLocalState('guest'); const legacy=loadGuestSession();
  const state=local || legacy;
  const words=JSON.parse(localStorage.getItem('eng_master_custom_words_v1') || '[]');
  const favorites=JSON.parse(localStorage.getItem('eng_master_favorites_v1') || '[]');const decks=JSON.parse(localStorage.getItem('eng_master_decks_v1') || '[]');
  const extendedPracticeRecords=JSON.parse(localStorage.getItem('eng_master_extended_practice_v1') || '[]');
  const practiceRecords=JSON.parse(localStorage.getItem('eng_master_practice_records_v1') || '[]');
  const roadmap=JSON.parse(localStorage.getItem('eng_master_roadmap_v1') || 'null');
  if (!extendedPracticeRecords.length && !practiceRecords.length && !roadmap && !Object.keys(state.progress).length && !words.length && !favorites.length && !decks.length) return null;
  const guestProfile=state.profile || {uid:'guest_legacy_preferences',email:'guest@local',displayName:'Dữ liệu trên thiết bị',totalWordsLearned:0,studyTimeMinutes:0,streak:0};
  return normalizeBackup({version:localStorage.getItem('eng_master_extended_practice_v1')!==null?4:3,...(localStorage.getItem('eng_master_extended_practice_v1')!==null?{extendedPracticeRecords}:{}),catalogVersion:'toeic-1575-v1',exportedAt:new Date().toISOString(),profile:guestProfile,progress:state.progress,practiceRecords,roadmap:JSON.parse(localStorage.getItem('eng_master_roadmap_v1') || 'null'),customWords:words,favorites,decks,dailyActivity:state.activities,events:getCachedEvents('guest'),preferences:{sound:localStorage.getItem('app_sound')!=='false',notifications:localStorage.getItem('app_notifications')==='true',studySessionSize:[5,10,15,20].includes(Number(localStorage.getItem('eng_master_study_size_v1')))?Number(localStorage.getItem('eng_master_study_size_v1')):15,reminderHour: Number(localStorage.getItem('eng_master_reminder_hour_v1') ?? 20)}}) as BackupV3;
};
export const mergeGuestIntoAccount = (account: BackupV3, guest: BackupV3): BackupV3 => {
  const merged=mergeBackup(account,guest);
  return normalizeBackup({...merged,roadmap:account.roadmap || guest.roadmap || null,progress:{...guest.progress,...account.progress},profile:{...account.profile,history:[...new Map([...(account.profile?.history||[]),...(guest.profile?.history||[])].map(item=>[item.id,item])).values()].sort((a,b)=>Date.parse(b.date)-Date.parse(a.date)).slice(0,50)}}) as BackupV3;
};
