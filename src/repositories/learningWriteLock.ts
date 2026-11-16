import { getActiveOwner, readOwnerItem } from './ownerStorage';
import { getCachedGeneration } from './cloudDataset';
const queued = new Map<string, Promise<unknown>>();
export const learningScope = () => JSON.stringify([getActiveOwner(), getCachedGeneration(getActiveOwner()), readOwnerItem('eng_master_local_dataset_revision_v1') || 'legacy']);
export const canLockLearningWrites = () => typeof navigator !== 'undefined' && !!navigator.locks;
export function withLearningWriteLock<T>(action:()=>T):Promise<T> {
 const owner=getActiveOwner(),expectedScope=learningScope();
 const run=()=>{if(learningScope()!==expectedScope)throw Error('Tài khoản hoặc bộ dữ liệu đã thay đổi trong khi chờ lưu.');return action();};
 // Same lock as dataset/sync operations; read and write occur inside the lock.
 if(canLockLearningWrites())return navigator.locks.request('eng-master-sync-'+owner,run);
 const next=(queued.get(owner)||Promise.resolve()).catch(()=>undefined).then(run);
 queued.set(owner,next);
 void next.finally(()=>{if(queued.get(owner)===next)queued.delete(owner);}).catch(()=>undefined);
 return next;
}
