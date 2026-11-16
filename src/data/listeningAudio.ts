import raw from './listeningAudioManifest.json';
import type { LearningQuestion } from './extendedPractice';
export interface ListeningAudioClip {src:string;duration:number;sha256:string;bytes:number;questionIds:string[];}
interface AudioManifest {version:number;clips:Record<string,ListeningAudioClip>;exam:ListeningAudioClip&{seconds:number;cues:{id:string;start:number;end:number;questionIds:string[]}[]};}
export const LISTENING_AUDIO=raw as AudioManifest;
export const EXAM_LISTENING_AUDIO=LISTENING_AUDIO.exam;
export const listeningAudioFor=(q:LearningQuestion)=>LISTENING_AUDIO.clips[q.listeningId||q.id];
