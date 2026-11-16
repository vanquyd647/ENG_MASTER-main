import { ALL_PRACTICE_QUESTIONS, questionById } from '../data/learningContent';
import type { ExtendedPracticeRecord, LearningRecord } from './extendedPracticeRecords';

export const EXAM_PART_COUNTS = {part1:6,part2:25,part3:39,part4:30,part5:30,part6:16,part7:54} as const;
export type ExamPart = keyof typeof EXAM_PART_COUNTS;
export const EXAM_PARTS = Object.keys(EXAM_PART_COUNTS) as ExamPart[];
export const LISTENING_MS = 45 * 60 * 1000;
export const READING_MS = 75 * 60 * 1000;
export const EXAM_MULTI_PASSAGES=new Set(['venue','shipment','volunteer','conference','supplier'].map(id=>'p7-exam-v1-'+id));
const excludedExamPassages=new Set(['p7-v2-workshop','p7-v2-feedback',...['store','invoice','recruitment','train'].map(id=>'p7-v2-'+id)]);
const formQuestions=(kind:ExamPart)=>{
 const qs=ALL_PRACTICE_QUESTIONS.filter(q=>q.kind===kind);
 if(kind==='part6')return qs.filter(q=>q.passageId?.startsWith('p6-calibrated-v1-'));
 return kind==='part7'?qs.filter(q=>!excludedExamPassages.has(q.passageId||'')).sort((a,b)=>Number(EXAM_MULTI_PASSAGES.has(a.passageId||''))-Number(EXAM_MULTI_PASSAGES.has(b.passageId||''))):qs;
};
export const EXAM_FORM = {
 id:'eng-master-200-v1',
 questionIds:EXAM_PARTS.flatMap(kind=>formQuestions(kind).slice(0,EXAM_PART_COUNTS[kind]).map(q=>q.id)),
 independentlyAccepted:false,
 normalizedAudio:true,
};
export interface ExamDraft {
 version:1;formId:typeof EXAM_FORM.id;id:string;scope:string;revision:number;
 startedAt:number;updatedAt:number;cursor:number;answers:Record<string,number>;partMilliseconds:Record<ExamPart,number>;
}
export const examPhase = (draft:Pick<ExamDraft,'startedAt'>, now=Date.now()):'listening'|'reading'|'finished' => now>=draft.startedAt+LISTENING_MS+READING_MS?'finished':now>=draft.startedAt+LISTENING_MS?'reading':'listening';
export const examDeadline = (draft:Pick<ExamDraft,'startedAt'>, now=Date.now()) => draft.startedAt+LISTENING_MS+(examPhase(draft,now)==='listening'?0:READING_MS);
export const validateExamForm = () => {
 const ids=EXAM_FORM.questionIds;
 if(ids.length!==200||new Set(ids).size!==200)throw Error('Bộ đề chưa đủ 200 câu duy nhất.');
 for(const kind of EXAM_PARTS)if(ids.filter(id=>questionById.get(id)?.kind===kind).length!==EXAM_PART_COUNTS[kind])throw Error('Bộ đề chưa đủ câu cho '+kind);
 const reading=ids.filter(id=>questionById.get(id)?.kind==='part7');
 if(reading.slice(0,29).some(id=>EXAM_MULTI_PASSAGES.has(questionById.get(id)!.passageId||''))||reading.slice(29).some(id=>!EXAM_MULTI_PASSAGES.has(questionById.get(id)!.passageId||'')))throw Error('Part 7 cần 29 câu văn bản đơn và 25 câu đa văn bản.');
 const closed=new Set<string>();let previous='';
 for(const id of ids){const q=questionById.get(id)!;const group=q.passageId||q.listeningId||q.id;if(group!==previous){if(closed.has(group))throw Error('Nhóm câu bị tách trong bộ đề.');if(previous)closed.add(previous);previous=group;}}
 return ids;
};
export const parseExamDraft = (input:unknown):ExamDraft => {
 const d=input as ExamDraft;
 if(!d||typeof d!=='object'||Array.isArray(d)||d.version!==1||d.formId!==EXAM_FORM.id||typeof d.id!=='string'||!/^exam1_[a-f0-9]{32}$/.test(d.id)||typeof d.scope!=='string'||!d.scope.length||d.scope.length>500||!Number.isSafeInteger(d.revision)||d.revision<0||![d.startedAt,d.updatedAt].every(x=>Number.isSafeInteger(x)&&x>0)||d.updatedAt<d.startedAt||d.updatedAt>d.startedAt+LISTENING_MS+READING_MS||!Number.isInteger(d.cursor)||d.cursor<0||d.cursor>=200||!d.answers||typeof d.answers!=='object'||Array.isArray(d.answers)||!d.partMilliseconds||typeof d.partMilliseconds!=='object'||Array.isArray(d.partMilliseconds))throw Error('Bản nháp đề 200 câu không hợp lệ.');
 validateExamForm();
 if(Object.entries(d.answers).some(([id,index])=>!EXAM_FORM.questionIds.includes(id)||!Number.isInteger(index)||index<0||index>=questionById.get(id)!.options.length))throw Error('Đáp án trong bản nháp không hợp lệ.');
 if(Object.keys(d.partMilliseconds).length!==7||EXAM_PARTS.some(kind=>!Number.isSafeInteger(d.partMilliseconds[kind])||d.partMilliseconds[kind]<0)||Object.values(d.partMilliseconds).reduce((sum,n)=>sum+n,0)!==d.updatedAt-d.startedAt)throw Error('Thời gian đề đang dở không hợp lệ.');
 if(d.cursor>=100&&d.updatedAt<d.startedAt+LISTENING_MS)throw Error('Phần Đọc chưa mở.');
 if(EXAM_PARTS.slice(0,4).reduce((sum,kind)=>sum+d.partMilliseconds[kind],0)!==Math.min(d.updatedAt-d.startedAt,LISTENING_MS))throw Error('Thời gian phần Nghe không hợp lệ.');
 return {version:1,formId:d.formId,id:d.id,scope:d.scope,revision:d.revision,startedAt:d.startedAt,updatedAt:d.updatedAt,cursor:d.cursor,answers:{...d.answers},partMilliseconds:{...d.partMilliseconds}};
};
export const createExamDraft = (scope:string, now=Date.now()):ExamDraft => parseExamDraft({version:1,formId:EXAM_FORM.id,id:'exam1_'+crypto.randomUUID().replaceAll('-',''),scope,revision:0,startedAt:now,updatedAt:now,cursor:0,answers:{},partMilliseconds:Object.fromEntries(EXAM_PARTS.map(kind=>[kind,0]))});

// Absolute deadlines keep running outside the app. Time is attributed to the displayed part;
// time after an unattended listening deadline is attributed to the first reading part.
export const advanceExam = (input:ExamDraft, now=Date.now()):ExamDraft => {
 const d=parseExamDraft(input);
 if(!Number.isSafeInteger(now)||now<d.updatedAt)throw Error('Đồng hồ thiết bị đang lùi. Kiểm tra ngày giờ rồi tải lại bài.');
 const end=Math.min(now,d.startedAt+LISTENING_MS+READING_MS),boundary=d.startedAt+LISTENING_MS;
 const current=questionById.get(EXAM_FORM.questionIds[d.cursor])!.kind as ExamPart;
 const listening=Math.max(0,Math.min(end,boundary)-d.updatedAt);
 const reading=Math.max(0,end-Math.max(d.updatedAt,boundary));
 d.partMilliseconds[d.cursor<100?current:'part1']+=listening;
 d.partMilliseconds[d.cursor>=100?current:'part5']+=reading;
 d.updatedAt=end;
 if(examPhase(d,now)!=='listening'&&d.cursor<100)d.cursor=100;
 return parseExamDraft(d);
};
export const answerExamQuestion = (draft:ExamDraft, id:string, index:number, now=Date.now()) => {
 const d=advanceExam(draft,now),position=EXAM_FORM.questionIds.indexOf(id),phase=examPhase(d,now);
 if(phase==='finished'||position<0||(phase==='listening'&&position>=100)||(phase==='reading'&&position<100))throw Error('Phần này đã khóa hoặc chưa đến giờ làm.');
 if(!Number.isInteger(index)||index<0||index>=questionById.get(id)!.options.length)throw Error('Lựa chọn không hợp lệ.');
 d.answers[id]=index;return d;
};
export const moveExamCursor = (draft:ExamDraft, position:number, now=Date.now()) => {
 const d=advanceExam(draft,now),phase=examPhase(d,now);
 if(!Number.isInteger(position)||phase==='finished'||position<0||position>=200||(phase==='listening'&&position>=100)||(phase==='reading'&&position<100))throw Error('Không thể chuyển tới câu ở phần đã khóa hoặc chưa mở.');
 d.cursor=position;return d;
};
export const examRecords = (draft:ExamDraft, now=Date.now()):ExtendedPracticeRecord[] => {
 const d=advanceExam(draft,now),finishedAt=new Date(d.updatedAt).toISOString();
 const seconds=Object.fromEntries(EXAM_PARTS.map(kind=>[kind,Math.floor(d.partMilliseconds[kind]/1000)])) as Record<ExamPart,number>;
 let remaining=Math.floor((d.updatedAt-d.startedAt)/1000)-Object.values(seconds).reduce((sum,n)=>sum+n,0);
 for(const kind of EXAM_PARTS)if(remaining&&d.partMilliseconds[kind]%1000){seconds[kind]++;remaining--;}
 return EXAM_PARTS.map(kind=>({id:d.id+'_'+kind,bankVersion:2,kind,startedAt:new Date(d.startedAt).toISOString(),finishedAt,durationSeconds:seconds[kind],answers:EXAM_FORM.questionIds.filter(id=>questionById.get(id)!.kind===kind).map(questionId=>({questionId,selectedIndex:d.answers[questionId]??null}))}));
};
export const collectExamResults = (records:readonly LearningRecord[]) => {
 const rounds=new Map<string,LearningRecord[]>();
 for(const record of records){const match=/^(exam1_[a-f0-9]{32})_(part[1-7])$/.exec(record.id);if(!match||record.bankVersion!==2||record.kind!==match[2])continue;rounds.set(match[1],[...(rounds.get(match[1])||[]),record]);}
 return [...rounds].map(([id,rows])=>{
  const parts=EXAM_PARTS.map(kind=>{const row=rows.find(row=>row.kind===kind),expected=EXAM_FORM.questionIds.filter(id=>questionById.get(id)!.kind===kind);const complete=!!row&&row.answers.length===expected.length&&expected.every(id=>row.answers.some(a=>a.questionId===id));return {kind,complete,total:expected.length,correct:row?.answers.filter(a=>a.selectedIndex===questionById.get(a.questionId)?.correctIndex).length||0,unanswered:row?.answers.filter(a=>a.selectedIndex===null).length??expected.length};});
  return {id,records:EXAM_PARTS.flatMap(kind=>rows.filter(row=>row.kind===kind)),parts,complete:parts.every(p=>p.complete),correct:parts.reduce((n,p)=>n+p.correct,0),unanswered:parts.reduce((n,p)=>n+p.unanswered,0),finishedAt:rows[0].finishedAt,durationSeconds:rows.reduce((n,p)=>n+p.durationSeconds,0)};
 }).sort((a,b)=>Date.parse(b.finishedAt)-Date.parse(a.finishedAt)||b.id.localeCompare(a.id));
};
