// @vitest-environment node
import { expect,it,vi } from 'vitest';
import type { Firestore } from 'firebase-admin/firestore';
import { pruneExpiredQuota } from './quotaMaintenance';

it('cleanup failure is nonfatal and does not expose raw credential-bearing errors',async()=>{
  const warn=vi.spyOn(console,'warn').mockImplementation(()=>{});
  const db={collection:()=>({doc:()=>({})}),runTransaction:async()=>{throw {code:'permission-denied',message:'private credential',token:'private credential'};}} as unknown as Firestore;
  expect(await pruneExpiredQuota(db)).toMatchObject({deleted:0,error:true});
  expect(JSON.stringify(warn.mock.calls)).not.toContain('private credential');
  expect(JSON.stringify(warn.mock.calls)).toContain('permission-denied');warn.mockRestore();
});
