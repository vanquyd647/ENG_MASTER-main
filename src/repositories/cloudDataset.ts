import { doc, getDocFromServer, runTransaction, type Transaction } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ownerKeyFor } from './ownerStorage';

export const LEGACY_DATASET = 'legacy';
export class DatasetChangedError extends Error {
  readonly code = 'dataset-changed';
  constructor(public readonly generation: string) {
    super('Dữ liệu tài khoản đã được khôi phục hoặc reset trên thiết bị khác. Các thao tác cũ được giữ trên thiết bị và chưa gửi lên Cloud.');
  }
}
export class DatasetBusyError extends Error {
  readonly code = 'dataset-busy';
  constructor() { super('Tài khoản đang khôi phục dữ liệu trên một thiết bị. Tiến độ hiện tại vẫn được giữ; đồng bộ sẽ thử lại sau.'); }
}
export const getCachedGeneration = (uid: string) => localStorage.getItem(ownerKeyFor('dataset_generation', uid)) || LEGACY_DATASET;
export const cacheGeneration = (uid: string, generation: string) => localStorage.setItem(ownerKeyFor('dataset_generation', uid), generation);
export const datasetMetaRef = (uid: string) => doc(db, `users/${uid}/system`, 'dataset');
export const datasetCollectionPath = (uid: string, name: string, generation = getCachedGeneration(uid)) => generation === LEGACY_DATASET ? `users/${uid}/${name}` : `users/${uid}/datasets/${generation}/${name}`;
export const parseDataset = (value: unknown) => {
  if (value === undefined) return { active: LEGACY_DATASET, pending: null as string | null };
  const data = value as Record<string, unknown>;
  const valid = (generation: unknown): generation is string => typeof generation === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(generation);
  if (!data || !valid(data.active) || (data.pending !== null && !valid(data.pending))) throw new Error('Thông tin phiên bản dữ liệu không hợp lệ.');
  if(data.previous!==undefined && !valid(data.previous))throw new Error('Phiên bản phục hồi không hợp lệ.');
  return { active: data.active, pending: data.pending as string | null, ...(data.previous?{previous:data.previous as string}:{}) };
};
export const readActiveDataset = async (uid: string) => {
  const snapshot = await getDocFromServer(datasetMetaRef(uid));
  return parseDataset(snapshot.exists() ? snapshot.data() : undefined);
};
export const assertDatasetTransaction = async (transaction: Transaction, uid: string, generation: string) => {
  const snapshot = await transaction.get(datasetMetaRef(uid));
  const state = parseDataset(snapshot.exists() ? snapshot.data() : undefined);
  if (state.active !== generation) throw new DatasetChangedError(state.active);
  if (state.pending) throw new DatasetBusyError();
  return state;
};

type Replacement = { previous: string; generation: string };
const journalKey = (uid: string) => ownerKeyFor('dataset_replacement_v1', uid);
export const beginDatasetReplacement = async (uid: string): Promise<Replacement> => {
  if (localStorage.getItem(journalKey(uid))) throw new DatasetBusyError();
  const replacement = { previous: getCachedGeneration(uid), generation: crypto.randomUUID() };
  // If storage is unavailable, stop before acquiring a remote lock.
  localStorage.setItem(journalKey(uid), JSON.stringify(replacement));
  try {
    await runTransaction(db, async transaction => {
      const current=await assertDatasetTransaction(transaction, uid, replacement.previous);
      transaction.set(datasetMetaRef(uid), { active: replacement.previous, pending: replacement.generation, ...('previous' in current?{previous:current.previous}:{}), updatedAt: new Date().toISOString() });
      transaction.set(doc(db, `users/${uid}/datasets`, replacement.generation), { status: 'preparing', createdAt: new Date().toISOString() });
    });
    return replacement;
  } catch (error) {
    try { if((await readActiveDataset(uid)).pending!==replacement.generation)localStorage.removeItem(journalKey(uid)); }
    catch { /* Keep the journal when a network failure leaves the commit uncertain. */ }
    throw error;
  }
};
export const abortDatasetReplacement = async (uid: string, replacement: Replacement) => {
  const activated=await runTransaction(db, async transaction => {
    const snapshot = await transaction.get(datasetMetaRef(uid));
    const state = parseDataset(snapshot.exists() ? snapshot.data() : undefined);
    if (state.active === replacement.generation && !state.pending) return true;
    if (state.active === replacement.previous && !state.pending) return false;
    if (state.active !== replacement.previous || state.pending !== replacement.generation) throw new DatasetChangedError(state.active);
    transaction.set(datasetMetaRef(uid), { active: replacement.previous, pending: null, ...('previous' in state?{previous:state.previous}:{}), updatedAt: new Date().toISOString() });
    return false;
  });
  if(activated)cacheGeneration(uid,replacement.generation);
  localStorage.removeItem(journalKey(uid));
  return activated;
};
export const cancelPendingDataset = async (uid: string) => {
  const state=await readActiveDataset(uid);
  if(state.pending)await abortDatasetReplacement(uid,{previous:state.active,generation:state.pending});
};
export const finishDatasetReplacement = async (uid: string, replacement: Replacement, profile: Record<string, unknown>) => {
  await runTransaction(db, async transaction => {
    const [snapshot, manifest] = await Promise.all([transaction.get(datasetMetaRef(uid)), transaction.get(doc(db, `users/${uid}/datasets`, replacement.generation))]);
    const state = parseDataset(snapshot.exists() ? snapshot.data() : undefined);
    if (state.active !== replacement.previous || state.pending !== replacement.generation || manifest.data()?.status !== 'ready') throw new DatasetBusyError();
    transaction.set(doc(db, 'users', uid), { ...profile, datasetGeneration: replacement.generation });
    transaction.set(datasetMetaRef(uid), { active: replacement.generation, pending: null, previous: replacement.previous, updatedAt: new Date().toISOString() });
  });
  cacheGeneration(uid, replacement.generation);
  localStorage.removeItem(journalKey(uid));
};
export const recoverDatasetReplacement = async (uid: string) => {
  const raw = localStorage.getItem(journalKey(uid));
  if (!raw) return false;
  const replacement = JSON.parse(raw) as Replacement;
  if (!replacement || !/^[a-zA-Z0-9_-]{1,128}$/.test(replacement.generation) || !/^[a-zA-Z0-9_-]{1,128}$/.test(replacement.previous)) throw new DatasetBusyError();
  const state = await readActiveDataset(uid);
  if (state.active === replacement.generation && !state.pending) {
    cacheGeneration(uid, state.active); localStorage.removeItem(journalKey(uid)); return true;
  }
  if(state.active!==replacement.previous){localStorage.removeItem(journalKey(uid));throw new DatasetChangedError(state.active);}
  await abortDatasetReplacement(uid, replacement); return true;
};
