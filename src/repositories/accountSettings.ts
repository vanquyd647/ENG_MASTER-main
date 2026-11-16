import { doc, getDocFromServer } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { parseAccountPreferences } from '../domain/schemas';
import { datasetCollectionPath } from './cloudDataset';
export const learningKeys=new Set(['eng_master_roadmap_v1','eng_master_practice_records_v1']);
export const splitAccountSettings=(values:Record<string,string|null>)=>({preferences:Object.fromEntries(Object.entries(values).filter(([key])=>!learningKeys.has(key)&&key!=='eng_master_extended_practice_v1')),learning:Object.fromEntries(Object.entries(values).filter(([key])=>learningKeys.has(key))),...(values.eng_master_extended_practice_v1!=null?{extendedLearning:{eng_master_extended_practice_v1:values.eng_master_extended_practice_v1}}:{})});
export const readAccountSettings=async(uid:string,generation:string)=>{
  const snapshots=await Promise.all(['preferences','learning','extendedLearning'].map(id=>getDocFromServer(doc(db,datasetCollectionPath(uid,'settings',generation),id))));
  return parseAccountPreferences(Object.assign({},...snapshots.filter(snapshot=>snapshot.exists()).map(snapshot=>snapshot.data().values)));
};
