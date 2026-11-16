import { useEffect, useState } from 'react';
import { clearDraft, getAllDrafts, subscribeRepository } from '../repositories/localRepository';
import { getActiveOwner } from '../repositories/ownerStorage';
import type { SessionDraft } from '../types';
export function DraftNotice({onResume}:{onResume:(draft:SessionDraft)=>void}) {
  const [drafts,setDrafts]=useState<SessionDraft[]>([]);
  useEffect(()=>{let active=true;const refresh=()=>{void getAllDrafts().then(value=>{if(active)setDrafts(value);}).catch(()=>{});};refresh();const stop=subscribeRepository(refresh);return()=>{active=false;stop();};},[getActiveOwner()]);
  if(!drafts.length)return null;
  const names={'review-new':'Học từ mới','review-review':'Ôn tập',practice:'Luyện tập',quiz:'Kiểm tra'};
  return <section aria-label="Phiên học đang dở" className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-3"><h2 className="font-bold">Tiếp tục phiên đang dở</h2>{drafts.map(draft=><div key={draft.kind} className="flex flex-wrap gap-3 text-sm items-center"><span>{names[draft.kind]} · đã làm {draft.completedIds.length}/{draft.wordIds.length} từ</span><button className="underline text-indigo-300" onClick={()=>onResume(draft)}>Tiếp tục</button><button className="underline text-zinc-400" onClick={()=>{if(window.confirm('Bỏ phiên dở? Các câu đã chấm và tiến độ vẫn được giữ.'))void clearDraft(draft.kind);}}>Bỏ phiên</button></div>)}</section>;
}
