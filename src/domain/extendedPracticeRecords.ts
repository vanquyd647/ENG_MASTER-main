import { EXTENDED_PRACTICE_INDEX } from '../data/extendedPracticeIndex';
import { LISTENING_PRACTICE_INDEX } from '../data/listeningPracticeIndex';
import { EXAM_EXPANSION_INDEX } from '../data/examExpansionIndex';
import { PRACTICE_REVISIONS_INDEX } from '../data/practiceRevisionsIndex';
import { EXAM_SUPPLEMENT_INDEX } from '../data/examSupplementIndex';
import {CALIBRATED_READING_INDEX} from '../data/readingCalibrationIndex';
import { PRACTICE_BANK } from '../data/workplacePractice';
import type { ExtendedKind } from '../data/extendedPractice';
import type { PracticeRecord } from './practiceRecords';
export interface ExtendedPracticeRecord { id:string;bankVersion:2;kind:ExtendedKind;startedAt:string;finishedAt:string;durationSeconds:number;answers:{questionId:string;selectedIndex:number|null}[]; }
export type LearningRecord=PracticeRecord|ExtendedPracticeRecord;
const registry=new Map<string,readonly [string,number]>([...PRACTICE_BANK.map(q=>[q.id,[q.kind,q.options.length]] as [string,readonly [string,number]]),...Object.entries(EXTENDED_PRACTICE_INDEX),...Object.entries(LISTENING_PRACTICE_INDEX),...Object.entries(EXAM_EXPANSION_INDEX),...Object.entries(PRACTICE_REVISIONS_INDEX),...Object.entries(EXAM_SUPPLEMENT_INDEX),...Object.entries(CALIBRATED_READING_INDEX)]);
export const parseExtendedPracticeRecords=(input:unknown):ExtendedPracticeRecord[]=>{
  if(!Array.isArray(input)||input.length>100)throw Error('Lịch sử mở rộng chỉ giữ tối đa 100 bài gần nhất.');
  const ids=new Set<string>();
  return input.map(value=>{
    const data=value as ExtendedPracticeRecord;
    if(!data||typeof data!=='object'||Array.isArray(data)||data.bankVersion!==2||typeof data.id!=='string'||!/^[a-zA-Z0-9_-]{1,128}$/.test(data.id)||ids.has(data.id)||!['part1','part2','part3','part4','part5','part6','part7','grammar','context'].includes(data.kind)||typeof data.startedAt!=='string'||typeof data.finishedAt!=='string'||!Number.isFinite(Date.parse(data.startedAt))||!Number.isFinite(Date.parse(data.finishedAt))||Date.parse(data.finishedAt)<Date.parse(data.startedAt)||!Number.isSafeInteger(data.durationSeconds)||data.durationSeconds<0||data.durationSeconds>86400||!Array.isArray(data.answers)||!data.answers.length||data.answers.length>60)throw Error('Kết quả bài mở rộng không hợp lệ.');
    ids.add(data.id);const seen=new Set<string>();
    const answers=data.answers.map(answer=>{const spec=registry.get(answer?.questionId);if(!spec||spec[0]!==data.kind||seen.has(answer.questionId)||(answer.selectedIndex!==null&&(!Number.isInteger(answer.selectedIndex)||answer.selectedIndex<0||answer.selectedIndex>=spec[1])))throw Error('Câu trả lời mở rộng không hợp lệ.');seen.add(answer.questionId);return{questionId:answer.questionId,selectedIndex:answer.selectedIndex};});
    return{id:data.id,bankVersion:2,kind:data.kind,startedAt:data.startedAt,finishedAt:data.finishedAt,durationSeconds:data.durationSeconds,answers};
  });
};
