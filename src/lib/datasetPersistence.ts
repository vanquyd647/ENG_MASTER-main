import { readAccountSettings, splitAccountSettings } from '../repositories/accountSettings';
import { collection, doc, getDocFromServer, getDocsFromServer, setDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { chunkItems } from './chunks';
import { normalizeBackup } from './backup';
import { parseProgressItem } from './dataValidation';
import { parseProfile, parseAccountPreferences } from '../domain/schemas';
import { ownerKey } from '../repositories/ownerStorage';
import { preferencePayload } from '../repositories/localRepository';
import { abortDatasetReplacement, beginDatasetReplacement, datasetCollectionPath, finishDatasetReplacement, getCachedGeneration, LEGACY_DATASET, readActiveDataset, recoverDatasetReplacement } from '../repositories/cloudDataset';
import { getBackupPreferenceChanges, refreshCustomVocabulary } from './productPreferences';
import { writeLocalChanges } from './localTransaction';
import { recoverRestore, RestoreRecoveryError } from './restoreJournal';
import type { StudyBackup, UserProfile, DailyActivity } from '../types';

const readCollection = async (uid: string, name: string, generation = getCachedGeneration(uid)) => {
  const snapshot = await getDocsFromServer(collection(db, datasetCollectionPath(uid, name, generation)));
  return Object.fromEntries(snapshot.docs.map(item => [item.id, item.data()]));
};
export const getCloudActivities = async (uid: string) => await readCollection(uid, 'dailyActivity') as Record<string, DailyActivity>;
const writeCollection = async (uid: string, generation: string, name: string, values: Record<string, unknown>) => {
  for (const chunk of chunkItems(Object.entries(values))) {
    const batch = writeBatch(db);
    for (const [id, value] of chunk) batch.set(doc(db, datasetCollectionPath(uid, name, generation), id), value);
    await batch.commit();
  }
};

export async function replaceCloudProgress(currentProfile: UserProfile, input: StudyBackup) {
  const backup = normalizeBackup(input), uid = currentProfile.uid;
  const replacement = await beginDatasetReplacement(uid);
  let nextProfile: UserProfile;
  try {
    const previous = replacement.previous, generation = replacement.generation;
    const stored = await getDocFromServer(doc(db, 'users', uid));
    const previousProfile = stored.exists() ? parseProfile(stored.data()) : currentProfile;
    nextProfile = parseProfile({ ...previousProfile, ...(backup.profile || {}), uid, email: currentProfile.email, datasetGeneration: generation, totalWordsLearned: Object.keys(backup.progress).length });
    if (backup.version !== 2) {
      nextProfile.history = backup.profile?.history || [];
      nextProfile.streak = backup.profile?.streak || 0;
      if (!backup.profile?.lastStudyDate) delete nextProfile.lastStudyDate;
    }
    const progress = Object.fromEntries(Object.entries(backup.progress).map(([wordId, item]) => [wordId, { ...parseProgressItem(item), userId: uid, wordId }]));
    const [activities, events, sessions, preferences] = backup.version !== 2 ? [
      backup.dailyActivity,
      Object.fromEntries((backup.events || []).map(event => [event.id, event])),
      Object.fromEntries((backup.profile?.history || []).map(log => [log.id, log])),
      { values: parseAccountPreferences({
        ...await readAccountSettings(uid,previous),
        ...(backup.extendedPracticeRecords!==undefined?{eng_master_extended_practice_v1:JSON.stringify(backup.extendedPracticeRecords)}:{}),
        ...(backup.practiceRecords!==undefined?{eng_master_practice_records_v1:JSON.stringify(backup.practiceRecords)}:{}),
        ...(backup.roadmap!==undefined?{eng_master_roadmap_v1:backup.roadmap===null?null:JSON.stringify(backup.roadmap)}:{}),
        eng_master_custom_words_v1: JSON.stringify(backup.customWords), eng_master_favorites_v1: JSON.stringify(backup.favorites), eng_master_decks_v1: JSON.stringify(backup.decks || []),
        eng_master_study_size_v1: String(backup.preferences.studySessionSize), eng_master_reminder_hour_v1: String(backup.preferences.reminderHour),
      }), updatedAt: new Date().toISOString() },
    ] : await Promise.all([
      readCollection(uid, 'dailyActivity', previous), readCollection(uid, 'events', previous), readCollection(uid, 'sessions', previous),
      readAccountSettings(uid,previous).then(values=>({values:Object.keys(values).length?values:parseAccountPreferences(preferencePayload()),updatedAt:new Date().toISOString()})),
    ]);
    await writeCollection(uid, generation, 'progress', progress);
    await writeCollection(uid, generation, 'dailyActivity', activities);
    await writeCollection(uid, generation, 'events', events);
    await writeCollection(uid, generation, 'sessions', sessions);
    await writeCollection(uid,generation,'settings',Object.fromEntries(Object.entries(splitAccountSettings(parseAccountPreferences(preferences.values))).map(([id,values])=>[id,{values,updatedAt:new Date().toISOString()}])));
    await writeCollection(uid, generation, 'snapshots', { profile: nextProfile, previousProfile });
    await setDoc(doc(db, `users/${uid}/datasets`, generation), { status: 'ready', createdAt: new Date().toISOString(), progressCount: Object.keys(progress).length });
    // The old collections/profile are untouched until this small transaction.
    await finishDatasetReplacement(uid, replacement, { ...nextProfile });
  } catch (error) {
    let activated=false;
    try { activated=await abortDatasetReplacement(uid, replacement); }
    catch { throw new RestoreRecoveryError(); }
    if(activated)nextProfile=parseProfile((await getDocFromServer(doc(db,'users',uid))).data());
    else throw new Error(`Nhập dữ liệu thất bại; dữ liệu cũ đã được giữ nguyên. ${error instanceof Error ? error.message : ''}`);
  }
  if (backup.version !== 2) {
    writeLocalChanges(getBackupPreferenceChanges(backup)); refreshCustomVocabulary();
  }
  return nextProfile;
}

export const resetCloudProgress = (profile: UserProfile) => {
  const nextProfile={...profile,totalWordsLearned:0,streak:0,history:[]};delete nextProfile.lastStudyDate;
  return replaceCloudProgress(profile, normalizeBackup({
  version: 3, exportedAt: new Date().toISOString(), catalogVersion: 'toeic-1575-v1', profile: nextProfile, progress: {}, events: [], dailyActivity: {},
  customWords: JSON.parse(preferencePayload().eng_master_custom_words_v1 || '[]'), favorites: JSON.parse(preferencePayload().eng_master_favorites_v1 || '[]'), decks: JSON.parse(preferencePayload().eng_master_decks_v1 || '[]'),
  preferences: { sound: localStorage.getItem('app_sound') !== 'false', notifications: localStorage.getItem('app_notifications') === 'true', studySessionSize: Number(preferencePayload().eng_master_study_size_v1 || 15), reminderHour: Number(preferencePayload().eng_master_reminder_hour_v1 || 20) },
}));
};

// Rollback copies the previous snapshot into another fresh generation. Reusing
// an old generation would allow an old offline outbox to become writable again.
export const rollbackCloudDataset = async (profile: UserProfile) => {
  const uid=profile.uid,state=await readActiveDataset(uid);
  if(!('previous' in state) || !state.previous || state.pending)throw new Error('Chưa có bản dữ liệu trước để phục hồi.');
  const snapshot=await getDocFromServer(doc(db,datasetCollectionPath(uid,'snapshots',state.active),'previousProfile'));
  if(!snapshot.exists())throw new Error('Không tìm thấy bản hồ sơ trước.');
  const [progress,activities,events,preferences]=await Promise.all([
    readCollection(uid,'progress',state.previous),readCollection(uid,'dailyActivity',state.previous),readCollection(uid,'events',state.previous),readAccountSettings(uid,state.previous),
  ]);
  const values=Object.keys(preferences).length?preferences:preferencePayload();
  return replaceCloudProgress(profile,normalizeBackup({
    version:4,extendedPracticeRecords:JSON.parse(values.eng_master_extended_practice_v1 || '[]'),catalogVersion:'toeic-1575-v1',exportedAt:new Date().toISOString(),profile:parseProfile(snapshot.data()),progress,dailyActivity:activities,events:Object.values(events),
    practiceRecords:JSON.parse(values.eng_master_practice_records_v1 || "[]"),
    roadmap:JSON.parse(values.eng_master_roadmap_v1 || "null"),
    customWords:JSON.parse(values.eng_master_custom_words_v1 || '[]'),favorites:JSON.parse(values.eng_master_favorites_v1 || '[]'),decks:JSON.parse(values.eng_master_decks_v1 || '[]'),
    preferences:{sound:localStorage.getItem('app_sound')!=='false',notifications:localStorage.getItem('app_notifications')==='true',studySessionSize:Number(values.eng_master_study_size_v1 || 15),reminderHour:Number(values.eng_master_reminder_hour_v1 || 20)},
  }));
};

// Migrate a journal created by the previous release into a new generation;
// never replay its destructive writes against the active dataset.
export const recoverCloudRestore = async (uid: string) => {
  const recovered = await recoverDatasetReplacement(uid);
  const legacy = await recoverRestore<{ profile: UserProfile; progress: Record<string, unknown>; activities: Record<string, DailyActivity>; events?: Record<string, unknown>; preferences: Record<string, string | null> }>(uid, async state => {
    if (state.profile.uid !== uid || (await readActiveDataset(uid)).active !== LEGACY_DATASET) throw new RestoreRecoveryError();
    const get = (key: string, fallback: string) => state.preferences[ownerKey(key)] || fallback;
    await replaceCloudProgress(state.profile, normalizeBackup({
      version: 3, exportedAt: new Date().toISOString(), catalogVersion: 'toeic-1575-v1', profile: state.profile, progress: state.progress, dailyActivity: state.activities, events: Object.values(state.events || {}),
      customWords: JSON.parse(get('eng_master_custom_words_v1','[]')), favorites: JSON.parse(get('eng_master_favorites_v1','[]')), decks: JSON.parse(get('eng_master_decks_v1','[]')),
      preferences: { sound: get('app_sound','true') !== 'false', notifications: get('app_notifications','false') === 'true', studySessionSize: Number(get('eng_master_study_size_v1','15')), reminderHour: Number(get('eng_master_reminder_hour_v1','20')) },
    }));
  });
  return recovered || legacy;
};
