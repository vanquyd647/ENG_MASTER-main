// @vitest-environment node
import { expect, it } from 'vitest';
import { answerObservation,asTargetRecall,COMPARISON_SCOPE_NOTE,comparisonFromSources,hasUnsupportedComparison } from './aiQuality';
import {AI_CONTENT_VERSION,parseAiExplanation,type AiSource} from './aiContent';
import {normalizeAnswer} from './random';
const source:AiSource={kind:'catalog',wordId:'invoice',word:'invoice',meaning:'hóa đơn',pos:'noun',topic:'Trading',example:'Please check the invoice.',exampleTranslation:'Hãy kiểm tra hóa đơn.'};
it('locates the actual internal invoice transposition instead of guessing which letters are last',()=>{
  expect(answerObservation('invioce','invoice')).toBe('Hai ký tự ở vị trí 4 và 5 bị đảo thứ tự. Bạn nhập “invioce”; đáp án là “invoice”.');
  expect(answerObservation('invioce','invoice')).not.toContain('cuối');
  expect(answerObservation('reciept','receipt')).toContain('vị trí 4 và 5');
});
it('does not classify a word-form, meaning or missing answer as a letter swap',()=>{
  expect(answerObservation('qualify','qualified')).not.toContain('đảo thứ tự');
  expect(answerObservation('sự độc lập','dependence')).not.toContain('đảo thứ tự');
  expect(answerObservation('','invoice')).toContain('chưa nhập');
  expect(answerObservation(' INVOICE ','invoice')).toContain('đã khớp');
});
it('normalizes spacing and unicode consistently before grading multiword recall',()=>{
  expect(normalizeAnswer('  In   charge\tof  ')).toBe('in charge of');
  expect(normalizeAnswer('ＣＯＳＴ')).toBe('cost');
  expect(answerObservation(' In   charge of ','in charge of')).toContain('đã khớp');
});
it('keeps the target and sentence, removes unreviewed distractors and grounds hints/explanations in the selected meaning',()=>{
  const question={wordId:'agreement',type:'mcq' as const,questionText:'Read the _____ before signing.',options:['agreement','report','memo','letter'],answer:'agreement',hint:'Một văn bản thỏa thuận.',translation:'Đọc thỏa thuận trước khi ký.',explanation:'Từ đang ôn là agreement.'};
  const recall=asTargetRecall({...question,explanation:'Please là trợ động từ.'},{word:'agreement',meaning:'thỏa thuận'});
  expect(recall.answer).toBe('agreement');expect(recall.questionText).toBe(question.questionText);expect(recall.options).toEqual([]);
  expect(recall.hint).toBe('Nghĩa đang ôn: thỏa thuận');expect(recall.explanation).toContain('agreement — thỏa thuận');expect(recall.explanation).not.toContain('trợ động từ');
  expect(question.options).toHaveLength(4);
});
it('uses scoped source examples when an AI comparison overgeneralizes and never labels personal data as reviewed',()=>{
  const other={...source,wordId:'receipt',word:'receipt',meaning:'biên lai',example:'Please keep your receipt.',exampleTranslation:'Hãy giữ biên lai.'};
  const lesson=comparisonFromSources(source,other)!;
  expect(hasUnsupportedComparison({...lesson,usage:'Không thể thay thế trong bất kỳ trường hợp nào.'})).toBe(true);
  expect(hasUnsupportedComparison(lesson)).toBe(false);expect(lesson.caution).toBe(COMPARISON_SCOPE_NOTE);
  expect(parseAiExplanation({version:AI_CONTENT_VERSION,action:'compare',source,comparison:other,lesson,quality:{mode:'source-only',reason:'comparison_scope'}}).lesson.examples[1].english).toBe(other.example);
  expect(comparisonFromSources({...source,kind:'user'},other)).toBeNull();
});
