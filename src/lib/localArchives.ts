import { normalizeBackup } from './backup';
import { getCachedEvents, getPendingOperations, loadLocalState, type LocalArchive } from '../repositories/localRepository';

export const downloadLocalArchive = async (archive: LocalArchive) => {
  await loadLocalState(archive.owner);
  const preferences=archive.preferences;
  const backup=normalizeBackup({
    version:preferences.eng_master_extended_practice_v1!=null?4:3,...(preferences.eng_master_extended_practice_v1!=null?{extendedPracticeRecords:JSON.parse(preferences.eng_master_extended_practice_v1)}:{}),catalogVersion:'toeic-1575-v1',exportedAt:new Date().toISOString(),profile:archive.profile,progress:archive.progress,dailyActivity:archive.activities,events:getCachedEvents(archive.owner),
    roadmap:JSON.parse(preferences.eng_master_roadmap_v1 || "null"),practiceRecords:JSON.parse(preferences.eng_master_practice_records_v1 || "[]"),
    customWords:JSON.parse(preferences.eng_master_custom_words_v1 || '[]'),favorites:JSON.parse(preferences.eng_master_favorites_v1 || '[]'),decks:JSON.parse(preferences.eng_master_decks_v1 || '[]'),
    preferences:{sound:localStorage.getItem('app_sound')!=='false',notifications:localStorage.getItem('app_notifications')==='true',studySessionSize:Number(preferences.eng_master_study_size_v1 || 15),reminderHour:Number(preferences.eng_master_reminder_hour_v1 || 20)},
  });
  const operations=await getPendingOperations(archive.owner);
  const url=URL.createObjectURL(new Blob([JSON.stringify({...backup,unsentOperations:operations,deviceDrafts:archive.deviceDrafts || {},archiveCreatedAt:archive.archivedAt},null,2)],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download='eng-master-before-restore-'+archive.archivedAt.slice(0,10)+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
