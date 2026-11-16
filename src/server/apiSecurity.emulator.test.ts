// @vitest-environment node
import { initializeApp, deleteApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
const runtime=vi.hoisted(()=>({ db:null as ReturnType<typeof getFirestore> | null, uid:'quota-test' }));
vi.mock('./firebaseAdmin',()=>({getAdminAuth:()=>({verifyIdToken:async()=>({uid:runtime.uid})}),getAdminFirestore:()=>runtime.db}));
import { authorizeAiRequest } from './apiSecurity';
import { pruneExpiredQuota } from './quotaMaintenance';
describe.skipIf(!process.env.FIRESTORE_EMULATOR_HOST)('server quota: actual Firestore transaction',()=>{
  let app: ReturnType<typeof initializeApp>;
  beforeAll(()=>{
    if (!/^127\.0\.0\.1:\d+$/.test(process.env.FIRESTORE_EMULATOR_HOST || ''))throw Error('Requires demo localhost emulator');
    app=initializeApp({projectId:'demo-eng-master'},'quota-'+crypto.randomUUID());runtime.db=getFirestore(app);
  });
  afterAll(async()=>{vi.unstubAllEnvs();if(runtime.db)await runtime.db.terminate();if(app)await deleteApp(app);});
  it('enforces a daily limit under concurrent calls and stores a timestamp TTL',async()=>{
    vi.stubEnv('AI_DAILY_REQUEST_LIMIT','2');runtime.uid='quota-'+crypto.randomUUID();
    const responses=await Promise.allSettled(Array.from({length:3},()=>authorizeAiRequest('Bearer demo','explain')));
    expect(responses.filter(item=>item.status==='fulfilled')).toHaveLength(2);const rejected=responses.find(item=>item.status==='rejected') as PromiseRejectedResult;expect(rejected.reason).toMatchObject({status:429,code:'daily_quota'});
    const docs=await runtime.db!.collection('_systemRateLimits').where('uid','==',runtime.uid).get();expect(docs.size).toBe(2);for(const doc of docs.docs){expect(doc.data().count).toBe(2);expect(doc.data().expiresAt.toDate()).toBeInstanceOf(Date);}
  },30_000);
  it('cleans only expired quota and respects the global hourly lease without native TTL',async()=>{
    const db=runtime.db!,now=Date.now(),id=crypto.randomUUID();
    const collection=db.collection('_systemRateLimits');
    await collection.doc('_maintenance').set({nextRunAt:0});
    const expired=collection.doc('expired-'+id),future=collection.doc('future-'+id);
    await expired.set({expiresAt:new Date(0)});await future.set({expiresAt:new Date(now+3_600_000)});
    expect((await pruneExpiredQuota(db,now)).deleted).toBeGreaterThanOrEqual(1);
    expect((await expired.get()).exists).toBe(false);expect((await future.get()).exists).toBe(true);
    await expired.set({expiresAt:new Date(0)});
    expect(await pruneExpiredQuota(db,now+1)).toMatchObject({skipped:true,deleted:0});
    expect((await expired.get()).exists).toBe(true);
  },30_000);
});
