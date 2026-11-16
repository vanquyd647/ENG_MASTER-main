// Reject stale/truncated audio before publishing. No inference or network is used.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {ALL_PRACTICE_QUESTIONS,questionById} from '../src/data/learningContent.ts';
import {listeningById} from '../src/data/listeningPractice.ts';
import {EXAM_FORM} from '../src/domain/fullExam.ts';
const digest=value=>createHash('sha256').update(value).digest('hex');
const canonical=value=>Array.isArray(value)?'['+value.map(canonical).join(', ')+']':value&&typeof value==='object'?'{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+': '+canonical(value[k])).join(', ')+'}':JSON.stringify(value);
const manifest=JSON.parse(fs.readFileSync('src/data/listeningAudioManifest.json','utf8'));
const input=JSON.parse(fs.readFileSync('output/verification/listening-audio-input.json','utf8'));
const questions=ALL_PRACTICE_QUESTIONS.filter(q=>['part1','part2','part3','part4'].includes(q.kind));
assert.equal(input.rows.length,71);assert.equal(Object.keys(manifest.clips).length,71);
for(const row of input.rows){
 const mapped=questions.filter(q=>(q.listeningId||q.id)===row.id),q=mapped[0];assert.ok(q,'Unknown audio source '+row.id);
 assert.deepEqual(row.questionIds,mapped.map(q=>q.id));
 const options=values=>values.flatMap((text,i)=>['Option '+String.fromCharCode(65+i)+'.',text]);
 const texts=q.kind==='part1'?options(q.options):q.kind==='part2'?[q.prompt,...options(q.options)]:[...listeningById.get(row.id).lines.map(l=>l.text),...mapped.map(q=>q.prompt)];
 assert.deepEqual(row.segments.map(s=>s.text),texts,'Source changed: '+row.id);
 assert.equal(manifest.clips[row.id].sourceSha256,digest(canonical(row)),'Re-render changed source: '+row.id);
 assert.deepEqual(manifest.clips[row.id].questionIds,row.questionIds);
}
for(const q of questions)assert.ok(manifest.clips[q.listeningId||q.id]?.questionIds.includes(q.id));
const expectedGroups=[...new Set(EXAM_FORM.questionIds.slice(0,100).map(id=>{const q=questionById.get(id);return q.listeningId||q.id;}))];
assert.deepEqual(input.examIds,expectedGroups);assert.deepEqual(manifest.exam.cues.map(c=>c.id),expectedGroups);
assert.deepEqual(manifest.exam.cues.flatMap(c=>c.questionIds),EXAM_FORM.questionIds.slice(0,100));
assert.equal(manifest.exam.seconds,2700);assert.equal(manifest.exam.duration,2700);
let last=0;for(const cue of manifest.exam.cues){assert.ok(cue.start>=last&&cue.end>cue.start);last=cue.end;}assert.equal(last,2700);
const assets=[...Object.values(manifest.clips),manifest.exam];
for(const asset of assets){const bytes=fs.readFileSync('public'+asset.src);assert.equal(bytes.length,asset.bytes,asset.src);assert.equal(digest(bytes),asset.sha256,asset.src);assert.ok(asset.duration>0);}
const report={checkedAt:new Date().toISOString(),passed:true,clips:71,questions:questions.length,examQuestions:100,examSeconds:2700,assets:assets.length,bytes:assets.reduce((n,a)=>n+a.bytes,0),manifestSha256:digest(fs.readFileSync('src/data/listeningAudioManifest.json')),inputSha256:digest(fs.readFileSync('output/verification/listening-audio-input.json')),checks:['every active listening question mapped','current source text and options','source hashes','asset bytes and SHA256','100-question cue order','45-minute PCM duration']};
fs.mkdirSync('output/verification',{recursive:true});fs.writeFileSync('output/verification/listening-asset-verification.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
