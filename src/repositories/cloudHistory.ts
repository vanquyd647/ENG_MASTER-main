import { collection, getDocsFromServer, limit, orderBy, query, startAfter, type QueryDocumentSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { parseStudyEvent } from '../lib/dataValidation';
import { datasetCollectionPath, readActiveDataset, DatasetChangedError, DatasetBusyError } from './cloudDataset';
import type { StudyEvent } from '../types';
// A stable active generation is required at both ends. Keep local unsent events
// in the caller's merge; a Cloud export must never erase offline work.
export const getCompleteCloudEvents=async(uid:string,expectedGeneration:string)=>{
  const state=await readActiveDataset(uid);if(state.active!==expectedGeneration)throw new DatasetChangedError(state.active);if(state.pending)throw new DatasetBusyError();
  const result:StudyEvent[]=[];let cursor:QueryDocumentSnapshot<DocumentData>|undefined;
  for(;;){const ref=collection(db,datasetCollectionPath(uid,'events',state.active));const page=await getDocsFromServer(query(ref,orderBy('__name__'),...(cursor?[startAfter(cursor)]:[]),limit(500)));result.push(...page.docs.map(row=>parseStudyEvent(row.data())));if(result.length>50000)throw Error('Lịch sử vượt 50.000 lượt. Cần xuất theo giai đoạn trước khi tạo backup toàn bộ.');if(page.size<500)break;cursor=page.docs.at(-1);}
  const after=await readActiveDataset(uid);if(after.active!==state.active)throw new DatasetChangedError(after.active);if(after.pending)throw new DatasetBusyError();return result;
};
