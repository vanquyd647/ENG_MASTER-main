import { useId, useState, type ReactNode } from 'react';
import type { AiExplanationData, AiReviewData, AiSource } from '../domain/aiContent';
import type { AiQuizQuestion } from '../domain/aiQuiz';
import { normalizeAnswer } from '../domain/random';
import { Button } from './ui';
export function AiField({title,tone='explanation',children}:{title:string;tone?:string;children:ReactNode}) {
  return <section className="ai-response-field" data-ai-tone={tone}><h4 className="ai-section-title"><strong>{title}</strong></h4><div className="space-y-2">{children}</div></section>;
}
export function AiSourceCard({source}:{source:AiSource}) {
  return <div className="rounded-xl border border-emerald-400/15 bg-emerald-500/5 p-4 text-sm leading-relaxed">
    <p className="text-xs font-semibold text-emerald-300">{source.kind==='catalog'?'Từ bộ dữ liệu đã rà soát':'Từ thư viện cá nhân · chưa rà soát'}</p>
    <p className="mt-2 font-semibold text-slate-100">{source.word}<span className="ml-2 text-xs font-normal text-zinc-400">{[source.pos,source.topic].filter(Boolean).join(' · ')}</span></p>
    <p className="mt-1 text-slate-200">{source.meaning}</p>
    {source.example&&<><p className="mt-3 text-sky-200" lang="en">{source.example}</p><p className="mt-1 text-zinc-400">{source.exampleTranslation}</p></>}
  </div>;
}
function AiQuickCheck({question,meaning}:{question:AiQuizQuestion;meaning:string}) {
  const id=useId(),[answer,setAnswer]=useState(''),[submitted,setSubmitted]=useState(false);
  const correct=normalizeAnswer(answer)===normalizeAnswer(question.answer);
  return <div className="space-y-4">
    <p className="text-sm text-zinc-300">Điền đúng từ đang ôn có nghĩa: <strong>{meaning}</strong></p>
    <p lang="en" className="font-medium text-slate-100">{question.questionText}</p>
    <form onSubmit={event=>{event.preventDefault();if(answer.trim())setSubmitted(true);}} className="space-y-3">
      {question.type==='mcq'?<fieldset disabled={submitted} className="space-y-2"><legend className="mb-2 text-sm text-zinc-400">Chọn một đáp án</legend>{question.options.map(option=><label key={option} className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-700 px-3 py-2 text-sm"><input type="radio" name={id} value={option} checked={answer===option} onChange={()=>setAnswer(option)} className="mt-1 accent-indigo-400"/><span lang="en">{option}</span></label>)}</fieldset>:<div><label htmlFor={id} className="mb-2 block text-sm text-zinc-300">Điền từ tiếng Anh</label><input id={id} value={answer} disabled={submitted} onChange={event=>setAnswer(event.target.value)} autoComplete="off" spellCheck={false} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm text-white"/></div>}
      {!submitted&&<Button type="submit" disabled={!answer.trim()}>Chấm câu này</Button>}
    </form>
    {!submitted&&<details className="text-sm text-zinc-400"><summary className="cursor-pointer text-amber-200">Xem gợi ý</summary><p className="mt-2">{question.hint}</p></details>}
    {submitted&&<div role="status" className={'rounded-xl border p-4 text-sm '+(correct?'border-emerald-400/20 bg-emerald-500/5 text-emerald-200':'border-rose-400/20 bg-rose-500/5 text-rose-200')}>
      <p className="font-semibold">{correct?'Chính xác!':question.type==='fill'?'Chưa khớp từ đang ôn.':'Chưa đúng.'} Đáp án: <span lang="en">{question.answer}</span></p>
      <p className="mt-2 text-slate-200">{question.explanation}</p><p className="mt-2 text-zinc-400">{question.translation}</p>
    </div>}
    <p className="text-xs text-zinc-500">Bài kiểm tra nhanh này không thay đổi tiến độ học.</p>
  </div>;
}
export function AiLessonResponse({data}:{data:AiExplanationData}) {
  const {lesson,action}=data;
  return <article aria-label="Phản hồi AI" className="ai-response ai-structured">
    {action==='practice'?<AiField title="Kiểm tra tôi" tone="practice"><AiQuickCheck question={lesson.questions[0]} meaning={data.source.meaning}/></AiField>:<>
      <AiField title={action==='compare'?'Phân biệt hai từ':'Hiểu nghĩa'}><p>{lesson.summary}</p></AiField>
      <AiField title="Cách dùng"><p>{lesson.usage}</p></AiField>
      {lesson.collocations.length>0&&<AiField title="Cụm từ thường gặp"><ul>{lesson.collocations.map((c,i)=><li key={i}><span className="font-semibold text-indigo-200" lang="en">{c.phrase}</span><span> — {c.meaning}</span></li>)}</ul></AiField>}
      <AiField title="Ví dụ song ngữ" tone="example">{lesson.examples.map((e,i)=><div key={i} className={i?'border-t border-sky-400/10 pt-3':''}><p lang="en" className="text-sky-100">{e.english}</p><p className="mt-1 text-zinc-400">{e.vietnamese}</p></div>)}</AiField>
      <AiField title="Mẹo tránh nhầm" tone="practice"><p>{lesson.caution}</p></AiField>
    </>}
  </article>;
}
export function AiReviewResponse({data}:{data:AiReviewData}) {
  return <article aria-label="Phản hồi AI" className="space-y-7">
    {data.items.map((row,i)=><section key={i} className="space-y-3">
      <h4 className="text-lg font-bold text-white">{i+1}. {row.source.word}</h4>
      <p className="text-xs text-zinc-400">{row.source.kind==='catalog'?'Nghĩa từ bộ dữ liệu đã rà soát':'Nghĩa cá nhân · chưa rà soát'} · {row.teachingSource==='ENG_MASTER'?'Đối chiếu tự động · Cách dùng/ví dụ từ ghi chú ENG_MASTER · Câu ôn AI':'Đối chiếu đáp án tự động · Ví dụ và cách dùng có AI hỗ trợ'}</p>
      <div className="ai-response ai-structured">
        <AiField title="Nghĩa đang học" tone="correct"><p>{row.source.meaning}</p></AiField>
        <AiField title="Bạn đã chọn" tone="mistake"><p>{row.userAnswer||'Bỏ trống'}</p></AiField>
        <AiField title="Đáp án đúng" tone="correct"><p>{row.correctAnswer}</p></AiField>
        <AiField title="Giải thích"><p>{row.feedback.explanation}</p></AiField>
        <AiField title="Ví dụ song ngữ" tone="example"><p lang="en">{row.feedback.english}</p><p className="text-zinc-400">{row.feedback.vietnamese}</p></AiField>
        <AiField title="Bài ôn ngắn" tone="practice"><p lang="en">{row.feedback.question}</p><details><summary className="cursor-pointer font-medium text-amber-200">Xem đáp án bài ôn</summary><p className="mt-2" lang="en">{row.feedback.answer}</p></details></AiField>
      </div>
    </section>)}
  </article>;
}
