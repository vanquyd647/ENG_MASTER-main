import type { LearningQuestion } from './extendedPractice';

// Keep released questions available for historical grades; only new attempts use revisions.
export const RETIRED_PRACTICE_IDS = new Set(['p5-v1-16']);
export const PRACTICE_REVISIONS: LearningQuestion[] = [{
 id:'p5-reviewed-v1-route',kind:'part5',topic:'Từ loại',difficulty:1,
 prompt:'This is the _____ of the three available routes to the airport.',
 options:['fastly','fastest','faster','fast'],correctIndex:1,
 explanation:'The fastest of the three routes: so sánh nhất trong ba tuyến đường. Fast không đứng một mình ở vị trí này; faster dùng khi so sánh hai đối tượng.',
}];
export const PRACTICE_REPLACEMENTS = new Map([['p5-v1-16',PRACTICE_REVISIONS[0]]]);
