import type { Firestore } from 'firebase-admin/firestore';

const INTERVAL_MS=60*60_000;
const BATCH_LIMIT=100;
let nextCheckAt=0;

export const pruneExpiredQuota = async (db: Firestore, now=Date.now()) => {
  try {
    const collection=db.collection('_systemRateLimits');
    const marker=collection.doc('_maintenance');
    const acquired=await db.runTransaction(async transaction=>{
      const previous=await transaction.get(marker);
      if(Number(previous.data()?.nextRunAt || 0)>now)return false;
      transaction.set(marker,{nextRunAt:now+INTERVAL_MS,lastAttemptAt:now});
      return true;
    });
    if(!acquired)return {deleted:0,skipped:true};
    const expired=await collection.where('expiresAt','<=',new Date(now)).orderBy('expiresAt','asc').limit(BATCH_LIMIT).get();
    if(expired.size){const batch=db.batch();expired.docs.forEach(document=>batch.delete(document.ref));await batch.commit();}
    return {deleted:expired.size,skipped:false};
  } catch(error) {
    const candidate=error && typeof error==='object' && 'code' in error ? String(error.code) : 'unknown';
    const code=/^[a-zA-Z0-9/_-]{1,128}$/.test(candidate)?candidate:'unknown';
    console.warn(JSON.stringify({service:'quota-maintenance',code,release:process.env.RELEASE_VERSION || 'local'}));
    return {deleted:0,skipped:false,error:true};
  }
};

// Hourly global lease bounds cleanup work across serverless instances. Await it
// because Vercel may freeze work after returning a response; failure is nonfatal.
export const maybePruneExpiredQuota = async (db: Firestore, now=Date.now()) => {
  if(now<nextCheckAt)return;
  nextCheckAt=now+INTERVAL_MS;
  await pruneExpiredQuota(db,now);
};
