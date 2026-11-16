import {expect,it} from 'vitest';
import {BASELINE_SECTIONS,baselineRecordId,baselineRound,baselineWeakTopics} from './baselineAssessment';
import {parseExtendedPracticeRecords} from './extendedPracticeRecords';
import {questionById} from '../data/learningContent';
const round='a'.repeat(32);
const records=()=>BASELINE_SECTIONS.map((section,index)=>({
 id:baselineRecordId(round,section.kind),bankVersion:2 as const,kind:section.kind,startedAt:'2026-10-15T12:00:00Z',finishedAt:'2026-10-15T12:0'+index+':30Z',durationSeconds:30,
 answers:section.ids.map(questionId=>({questionId,selectedIndex:questionById.get(questionId)!.correctIndex})),
}));
it('uses exactly 20 existing questions, keeping complete Part 6/7 groups and the normal record schema',()=>{
  const all=BASELINE_SECTIONS.flatMap(row=>row.ids);
  expect(all).toHaveLength(20);expect(new Set(all).size).toBe(20);
  expect(all.every(id=>questionById.has(id))).toBe(true);
  expect(parseExtendedPracticeRecords(records())).toHaveLength(4);
  expect(baselineRound(records())).toMatchObject({complete:true,correct:20,total:20,completed:4});
});
it('resumes the same round without blending older completed assessments',()=>{
  const previous=records(),newRound='b'.repeat(32),first={...previous[0],id:baselineRecordId(newRound,'part2'),finishedAt:'2026-10-16T12:01:00Z'};
  const assessment=baselineRound([...previous,first])!;
  expect(assessment.round).toBe(newRound);expect(assessment.completed).toBe(1);expect(assessment.next?.kind).toBe('part5');
  expect(assessment.correct).toBe(5);
});
it('does not call a partial/replayed subsection complete and recommends exact missed IDs',()=>{
  const history=records();history[0].answers[0].selectedIndex=(history[0].answers[0].selectedIndex+1)%3;
  history[2].answers=history[2].answers.slice(0,1);
  expect(baselineRound(history)?.complete).toBe(false);
  expect(baselineRound(history)?.next?.kind).toBe('part6');
  expect(baselineWeakTopics(history).flatMap(row=>row.ids)).toEqual([history[0].answers[0].questionId]);
});
it('does not treat unrelated practice history as a diagnostic or accept an invalid round ID',()=>{
  expect(baselineRound([{...records()[0],id:'normal-practice'}])).toBeNull();
  expect(()=>baselineRecordId('invalid','part2')).toThrow();
});
