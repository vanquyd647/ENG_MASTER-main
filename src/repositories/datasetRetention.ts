import { collection, doc, getDocsFromServer, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { readActiveDataset } from './cloudDataset';
const preserved=(state:Awaited<ReturnType<typeof readActiveDataset>>)=>new Set([state.active,state.pending,'previous' in state?state.previous:null,'legacy']);
// Only an explicit Settings action invokes cleanup. Active and the immediately
// previous generation are protected again by security rules for every batch.
export const removeUnusedDatasets=async(uid:string)=>{
  let state=await readActiveDataset(uid);if(state.pending)throw Error('Chờ lần khôi phục đang chạy hoàn tất trước khi dọn.');
  const manifests=await getDocsFromServer(collection(db,`users/${uid}/datasets`));let removed=0;
  for(const manifest of manifests.docs){state=await readActiveDataset(uid);if(state.pending)throw Error('Có lần khôi phục mới; đã dừng dọn dữ liệu.');if(preserved(state).has(manifest.id))continue;
    for(const name of ['progress','dailyActivity','events','sessions','settings','snapshots']){const documents=await getDocsFromServer(collection(db,`users/${uid}/datasets/${manifest.id}/${name}`));for(let i=0;i<documents.size;i+=400){const batch=writeBatch(db);documents.docs.slice(i,i+400).forEach(row=>batch.delete(row.ref));await batch.commit();}}
    const batch=writeBatch(db);batch.delete(doc(db,`users/${uid}/datasets`,manifest.id));await batch.commit();removed++;
  }
  return removed;
};
