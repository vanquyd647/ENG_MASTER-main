import { expect,it } from 'vitest';
import { VOCABULARY } from './vocabulary';
import { ALL_WORKPLACE_LESSONS } from './learningContent';
import { bundledSpeechFor, DIALOGUE_SPEECH_VOICES } from '../services/bundledSpeech';
it('covers every bundled vocabulary word and every authored workplace speaker line',()=>{
  expect(VOCABULARY).toHaveLength(1575);
  for(const word of VOCABULARY) expect(bundledSpeechFor(word.word),word.id).toMatchObject({voice:'am_michael'});
  for(const lesson of ALL_WORKPLACE_LESSONS){const speakers=[...new Set(lesson.lines.map(line=>line.speaker))];for(const line of lesson.lines){const voice=DIALOGUE_SPEECH_VOICES[speakers.indexOf(line.speaker)%3];expect(bundledSpeechFor(line.text,voice),lesson.id).toMatchObject({voice});}}
});
