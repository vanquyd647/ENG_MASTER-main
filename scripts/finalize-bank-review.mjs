// Codex's explicit adjudications for the frozen 16 October content review.
// This records answer/text/photo review, never overall readiness or audio acceptance.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {ALL_PRACTICE_QUESTIONS,ALL_WORKPLACE_LESSONS} from '../src/data/learningContent.ts';
import {listeningById,LISTENING_STIMULI} from '../src/data/listeningPractice.ts';
import {readingById} from '../src/data/readingContent.ts';
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const base='output/verification/bank-review-v2',revision='output/verification/bank-review-route-v1';
const adjudications={
 'p6-v2-training-3':'However nối sự tương phản: không cần cài phần mềm nhưng vẫn cần kiểm tra Wi-Fi. Otherwise không diễn tả quan hệ đó trong đoạn này. Giữ index 1.',
 'p6-v2-membership-3':'Update cần tân ngữ them thay cho contact details. Their là từ hạn định cần danh từ phía sau, không đứng một mình ở đây. Giữ index 2.',
 'p3-listening-v1-delivery-q1':'Đặt 12, nhận 10: thiếu 2. Nguồn còn nói the other two. Two ở index 1, không phải One index 0.',
 'p3-exam-v1-restaurant-q1':'Nguồn chốt change it to four people. Four ở index 0; index 1 là Two. Không lấy số khách hủy làm số khách dự.',
 'p3-exam-v1-catering-q2':'Nguồn nói prepare forty-five lunches, 40+5=45. Forty-five ở index 3; index 2 là Fifty.',
 'p7-exam-v1-appointment-q1':'10:20 trừ 15 phút =10:05. 10:05 ở index 1; index 0 là 9:20.',
 'p7-exam-v1-venue-q1':'32 người: Elm tối đa20 không đủ; Cedar40 giá260 rẻ hơn Oak80 giá420. Cedar ở index 3, không phải Oak index 1.',
 'p7-exam-v1-shipment-q5':'8×90+2×150=720+300=1020. $1,020 ở index 2; index 0 là $870. Chính issue của checker cũng xác nhận index 2.',
};
const runs=['output/verification/bank-review-calibration-v1','output/verification/bank-review-delta-v1',base,revision].map(prefix=>({prefix,report:read(prefix+'.json'),snapshot:read(prefix+'-snapshot.json')}));
for(const run of runs)if(hash(run.snapshot)!==run.report.sourceSha256||run.report.summary.failedBatches||run.report.items.length!==run.snapshot.length)throw Error('Incomplete or stale review '+run.prefix);
const flagged=runs.find(r=>r.prefix===base).report.items.filter(x=>!x.answerMatches||x.ambiguous||x.issue||x.translationIssue).map(x=>x.id).sort();
if(JSON.stringify(flagged)!==JSON.stringify(Object.keys(adjudications).sort()))throw Error('Unadjudicated issue');
const items=ALL_PRACTICE_QUESTIONS.map(question=>{
 const source={question,listening:question.listeningId?listeningById.get(question.listeningId):null,reading:question.passageId?readingById.get(question.passageId):null,context:question.lessonId?ALL_WORKPLACE_LESSONS.find(l=>l.id===question.lessonId):null};
 const run=runs.find(r=>r.snapshot.some(s=>s.question.id===question.id));
 const frozen=run?.snapshot.find(s=>s.question.id===question.id),check=run?.report.items.find(x=>x.id===question.id);
 if(!frozen||hash(source)!==hash(frozen)||!check||(!check.answerMatches&&!adjudications[question.id])||check.ambiguous||((check.issue||check.translationIssue)&&!adjudications[question.id]))throw Error('Changed or unresolved question '+question.id);
 return {id:question.id,sourceSha256:hash(source),reviewRun:run.prefix+'.json',reviewerIndex:check.chosenIndex,reviewer:run.report.reviewer||'Gemini answer-blind checker',authoredIndex:question.correctIndex,answerKeyDisposition:'retain',adjudication:adjudications[question.id]||'Codex đối chiếu câu hỏi, các lựa chọn và nguồn/ngữ pháp; giữ đáp án hiện tại.',translationReview:'Đã đối chiếu bản dịch có sẵn; chưa chứng nhận audio.'};
});
const images=LISTENING_STIMULI.filter(s=>s.image).map(s=>({id:s.id,path:s.image.src,sha256:createHash('sha256').update(fs.readFileSync('public'+s.image.src)).digest('hex'),reviewer:'Codex',method:'Viewed all six local photographs and compared visible scene to options; no motion inferred from static photo.'}));
const report={checkedAt:new Date().toISOString(),owner:'Codex, assigned by user',method:'Codex source/text/photo review plus Gemini answer-blind checking with explicit disagreement adjudication',bankSha256:hash(items.map(x=>[x.id,x.sourceSha256])),denominator:ALL_PRACTICE_QUESTIONS.length,reviewed:items.length,answerKeysRetainedAfterReview:items.length,reviewerDisagreements:Object.keys(adjudications).length,teacherCertified:false,overall95Accepted:false,audioAccepted:false,retired:[{id:'p5-v1-16',replacement:'p5-reviewed-v1-route',reason:'The fast route and the fastest route can both fit the old prompt. New prompt requires the fastest of the three routes. Released content/history remain immutable.'}],sourceCorrections:['p3-exam-v1-travel: rooms reserved since last night, not tonight','p4-exam-v1-order: collection ends at Saturday closing time, five'],priorRun:'output/verification/bank-review-v1.json',priorRunLimitations:['11 batches failed with 429; no items dropped from denominator','Context source absent for old context questions; that run is not acceptance evidence','Checker disagreement and literal none markers retained in raw report'],remaining:['Audio delivery/listening quality across target devices','Exam subformat, difficulty and length calibration','Separate benchmark of at least 200 AI teaching outputs','All six area acceptance and production verification'],images,items};
if(items.length!==ALL_PRACTICE_QUESTIONS.length)throw Error('Unexpected denominator');
fs.writeFileSync('output/verification/bank-review-adjudicated.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({reviewed:items.length,disagreements:report.reviewerDisagreements,retired:report.retired.length,overall95Accepted:false,audioAccepted:false}));
