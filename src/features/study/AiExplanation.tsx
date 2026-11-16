import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AiResponse } from '../../components/AiResponse';
import { AiLessonResponse, AiSourceCard } from '../../components/AiStructuredResponse';
import { Button } from '../../components/ui';
import { getVocabulary } from '../../domain/catalog';
import type { AiExplanationData } from '../../domain/aiContent';
import type { FollowupOptions } from '../../services/ai';
interface Props {
  content:string;isLoading:boolean;meaning?:string;error?:string|null;onRetry?:()=>void;explanation?:AiExplanationData;
  followup?:AiExplanationData|null;isFollowingUp?:boolean;followupError?:string|null;followupNumber?:number;
  onFollowup?:(options:FollowupOptions)=>Promise<void>;onRetryFollowup?:()=>void;word?:string;
}
export default function AiExplanation({content,isLoading,meaning,error,onRetry,explanation,followup,isFollowingUp,followupError,followupNumber,onFollowup,onRetryFollowup,word}:Props) {
  const comparisonId=useId(),followupRef=useRef<HTMLElement|null>(null);
  useEffect(()=>{if(followupNumber)followupRef.current?.scrollIntoView?.({block:'start'});},[followupNumber]);
  const [compareOpen,setCompareOpen]=useState(false),[query,setQuery]=useState(''),[selectedId,setSelectedId]=useState('');
  const candidates=useMemo(()=>getVocabulary().filter(w=>w.word.toLowerCase()!==(word||explanation?.source.word||'').toLowerCase()&&(w.word+' '+w.meaning).toLowerCase().includes(query.toLowerCase())).slice(0,20),[query,word,explanation?.source.word]);
  return <div className="space-y-5">
    {meaning && <div className="rounded-xl border border-indigo-400/15 bg-indigo-500/5 px-4 py-3"><p className="mb-1 text-xs font-semibold text-indigo-300">Nghĩa đang học</p><p className="text-sm font-medium leading-relaxed text-slate-200">{meaning}</p></div>}
    {isLoading ? <p role="status" className="py-5 text-sm text-indigo-300 animate-pulse">AI đang giải thích...</p> : error ? <div className="space-y-3"><p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-500/5 p-4 text-sm leading-relaxed text-rose-200">{error}</p>{onRetry && <Button onClick={onRetry} variant="outline">Thử lại</Button>}</div> : <>
      {explanation&&<AiSourceCard source={explanation.source}/>}
      <p className="text-xs font-semibold text-indigo-300">{explanation?.quality?.mode==='reviewed'?'Ghi chú và ví dụ ENG_MASTER':explanation?.quality?.mode==='source-only'?'Nghĩa và ví dụ từ nguồn':explanation?.quality?.mode==='anchored'?'Ghi chú ENG_MASTER · Ví dụ AI bổ sung':'AI bổ sung · Giải thích và luyện tập'}</p>
      {explanation?.quality?.mode==='source-only'&&<p role="status" className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-3 text-sm text-amber-200">Đang đối chiếu bằng nghĩa và ví dụ gốc; phần diễn giải AI chưa đạt kiểm tra.</p>}
      {explanation?<AiLessonResponse data={explanation}/>:<AiResponse content={content}/>}
      {onFollowup&&content&&<section className="space-y-4 border-t border-zinc-800 pt-5" aria-label="Hỏi tiếp về từ đang học">
        <h3 className="text-sm font-semibold text-white">Hỏi tiếp về “{word||explanation?.source.word}”</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" disabled={isFollowingUp} onClick={()=>{setCompareOpen(false);void onFollowup({action:'simplify'});}}>Giải thích đơn giản hơn</Button>
          <Button variant="outline" disabled={isFollowingUp} onClick={()=>{setCompareOpen(false);void onFollowup({action:'examples'});}}>Thêm ví dụ</Button>
          <Button variant="outline" disabled={isFollowingUp} onClick={()=>setCompareOpen(value=>!value)}>So sánh hai từ</Button>
          <Button variant="outline" disabled={isFollowingUp} onClick={()=>{setCompareOpen(false);void onFollowup({action:'practice'});}}>Kiểm tra tôi</Button>
        </div>
        {compareOpen&&<form onSubmit={event=>{event.preventDefault();const selected=candidates.find(w=>w.id===selectedId);if(selected){setCompareOpen(false);void onFollowup({action:'compare',comparison:{wordId:selected.id,word:selected.word,meaning:selected.meaning}});}}} className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
          <label className="block text-sm text-zinc-300">Từ muốn so sánh<input value={query} disabled={isFollowingUp} onChange={event=>{setQuery(event.target.value);setSelectedId('');}} placeholder="Tìm từ trong thư viện..." className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 p-2.5 text-sm text-white"/></label>
          <div><label htmlFor={comparisonId} className="block text-sm text-zinc-300">Chọn từ và nghĩa</label><select id={comparisonId} value={selectedId} disabled={isFollowingUp} onChange={event=>setSelectedId(event.target.value)} className="mt-2 w-full min-w-0 rounded-lg border border-zinc-700 bg-zinc-900 p-2.5 text-sm text-white"><option value="">Chọn một mục phù hợp</option>{candidates.map(w=><option value={w.id} key={w.id}>{w.word} — {w.meaning}</option>)}</select></div>
          {!candidates.length&&<p className="text-sm text-zinc-400">Chưa tìm thấy từ phù hợp.</p>}
          <Button type="submit" disabled={!selectedId||isFollowingUp}>So sánh</Button>
        </form>}
        <div aria-live="polite" aria-busy={!!isFollowingUp} className="space-y-4">
          {isFollowingUp&&<p role="status" className="text-sm text-indigo-300 animate-pulse">AI đang trả lời câu hỏi tiếp theo...</p>}
          {followupError&&<div className="space-y-2"><p role="alert" className="text-sm text-rose-200">{followupError}</p><Button variant="outline" onClick={onRetryFollowup} disabled={isFollowingUp}>Thử lại câu hỏi</Button></div>}
          {followup&&<section ref={followupRef} className="space-y-4"><h3 className="text-sm font-semibold text-indigo-200">Câu trả lời tiếp theo</h3>{followup.comparison&&<AiSourceCard source={followup.comparison}/>}{followup.quality?.mode==='reviewed'&&<p className="text-xs text-emerald-300">Nội dung và ví dụ từ ghi chú ENG_MASTER đã biên soạn.</p>}{followup.quality?.mode==='anchored'&&<p className="text-xs text-emerald-300">Nghĩa/cách dùng từ ghi chú ENG_MASTER; ví dụ AI bổ sung.</p>}{followup.quality?.mode==='source-only'&&<p role="status" className="text-sm text-amber-200">Đang đối chiếu bằng nghĩa và ví dụ gốc; phần diễn giải AI chưa đạt kiểm tra.</p>}<AiLessonResponse key={followupNumber} data={followup}/></section>}
        </div>
      </section>}
      <p className="border-t border-zinc-800 pt-4 text-xs leading-relaxed text-zinc-400">Phần AI bổ sung có thể có sai sót; đối chiếu với nghĩa và ví dụ gốc. Hỏi tiếp dùng từ và nghĩa đang mở.</p>
    </>}
  </div>;
}
