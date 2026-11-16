// Fixed English audio for bundled vocabulary and authored workplace conversations.
import fs from 'node:fs';
import {VOCABULARY} from '../src/data/vocabulary.ts';
import {ALL_WORKPLACE_LESSONS} from '../src/data/learningContent.ts';
const normalize=text=>text.normalize('NFKC').replace(/[’‘]/g,"'").trim().replace(/\s+/g,' ').toLowerCase();
const rows=new Map();
const add=(text,voice)=>{const key=voice+'|'+normalize(text);if(!rows.has(key))rows.set(key,{text,voice});};
for(const word of VOCABULARY)add(word.word,'am_michael');
for(const lesson of ALL_WORKPLACE_LESSONS){const speakers=[...new Set(lesson.lines.map(l=>l.speaker))];for(const line of lesson.lines)add(line.text,['am_michael','af_heart','bf_emma'][speakers.indexOf(line.speaker)%3]);}
fs.mkdirSync('output/verification',{recursive:true});
fs.writeFileSync('output/verification/pronunciation-input.json',JSON.stringify({version:1,model:'hexgrad/Kokoro-82M',speed:0.95,sampleRate:24000,rows:[...rows.values()]},null,2)+'\n');
console.log({vocabulary:VOCABULARY.length,utterances:rows.size,lessons:ALL_WORKPLACE_LESSONS.length});
