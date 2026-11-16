import fs from'node:fs';import assert from'node:assert/strict';import{createHash}from'node:crypto';
import{EXAM_FORM,EXAM_PART_COUNTS,EXAM_MULTI_PASSAGES,validateExamForm}from'../src/domain/fullExam.ts';
import{ALL_PRACTICE_QUESTIONS,questionById}from'../src/data/learningContent.ts';
import{readingById}from'../src/data/readingContent.ts';import{listeningById}from'../src/data/listeningPractice.ts';
validateExamForm();const words=t=>(t.match(/\b[A-Za-z]+(?:['’-][A-Za-z]+)*\b/g)||[]).length;
const profiles=[];
for(const id of [...new Set(EXAM_FORM.questionIds.map(id=>{const q=questionById.get(id);return q.passageId||q.listeningId;}).filter(Boolean))]){
 const qs=EXAM_FORM.questionIds.map(id=>questionById.get(id)).filter(q=>(q.passageId||q.listeningId)===id),s=readingById.get(id)||listeningById.get(id);
 const text=s.text||s.lines.map(l=>l.text).join(' '),count=words(text),documents=s.text?(s.text.match(/DOCUMENT \d+ —/g)||[]).length||1:0;
 if(qs[0].kind==='part6'){assert.equal(qs.length,4);for(let i=1;i<=4;i++)assert.ok(s.text.includes('('+i+') _____'));assert.ok(count>=130&&count<=220);}
 if(qs[0].kind==='part7')assert.ok(count>=(EXAM_MULTI_PASSAGES.has(id)?200:120)&&count<=600);
 if(['part3','part4'].includes(qs[0].kind))assert.equal(qs.length,3);
 profiles.push({id,kind:qs[0].kind,questions:qs.length,words:count,documents,speakers:s.lines?[...new Set(s.lines.map(l=>l.speaker))].length:null,graphic:!!s.graphic,sourceSha256:createHash('sha256').update(JSON.stringify(s)).digest('hex')});
}
assert.equal(profiles.filter(p=>p.kind==='part7'&&p.documents===2).length,2);assert.equal(profiles.filter(p=>p.kind==='part7'&&p.documents===3).length,3);
assert.ok(profiles.some(p=>p.kind==='part3'&&p.speakers===3));assert.ok(profiles.some(p=>p.graphic));
assert.ok(ALL_PRACTICE_QUESTIONS.every(q=>[1,2,3].includes(q.difficulty)));
const report={checkedAt:new Date().toISOString(),passed:true,formId:EXAM_FORM.id,blueprint:EXAM_PART_COUNTS,questions:200,part7Split:{single:29,multiple:25,doubleGroups:2,tripleGroups:3},difficulty:{scale:'Author relative levels 1–3; not calibrated TOEIC/CEFR scores',empiricalCalibration:false},readingLengthRubric:{part6:[130,220],part7Single:[120,600],part7Multiple:[200,600],purpose:'Original practice reading of sufficient context; not an official ETS word-count requirement'},listeningLengthNote:'Short original conversations/talks. Synthetic voices and a fixed 45-minute schedule; no claim of empirical test difficulty equivalence.',profiles};
fs.writeFileSync('output/verification/exam-content-profile.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:true,groups:profiles.length,readingWords:profiles.filter(x=>['part6','part7'].includes(x.kind)).reduce((n,x)=>n+x.words,0)}));
