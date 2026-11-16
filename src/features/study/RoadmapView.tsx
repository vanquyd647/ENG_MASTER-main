import { parseAccountPreferences } from '../../domain/schemas';
import { preferencePayload } from '../../repositories/localRepository';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button, Card } from '../../components/ui';
import { buildRoadmapDay, parseRoadmap, type Roadmap } from '../../domain/roadmap';
import { useCatalog } from '../../domain/useCatalog';
import { getLocalDateKey } from '../../lib/learning';
import { readOwnerItem, writeOwnerItem } from '../../repositories/ownerStorage';
import type { StudyEvent, UserProgress } from '../../types';

const savedRoadmap=()=>{try{const raw=readOwnerItem('eng_master_roadmap_v1');return raw?parseRoadmap(JSON.parse(raw)):null;}catch{return null;}};
export default function RoadmapView({progress,events,onBack,onStudy}:{progress:UserProgress;events:StudyEvent[];onBack:()=>void;onStudy:(ids:string[])=>void}) {
  const words=useCatalog();
  const [saved,setSaved]=useState<Roadmap|null>(savedRoadmap);
  const [date,setDate]=useState(saved?.examDate || getLocalDateKey(new Date(Date.now()+30*86400000)));
  const [score,setScore]=useState(String(saved?.targetScore || 650));
  const [minutes,setMinutes]=useState(String(saved?.minutesPerDay || 20));
  const [target,setTarget]=useState(String(saved?.targetWords || Math.min(10000,words.length)));
  const recent=events.filter(event=>event.quality!==undefined&&event.durationSeconds>0).sort((a,b)=>Date.parse(b.occurredAt)-Date.parse(a.occurredAt)).slice(0,100);
  const seconds=recent.length?recent.reduce((sum,event)=>sum+event.durationSeconds,0)/recent.length:25;
  const plan=saved?buildRoadmapDay(saved,words,progress,getLocalDateKey(),seconds):null;
  const save=()=>{try{const value=parseRoadmap({version:1,examDate:date,targetScore:Number(score),minutesPerDay:Number(minutes),targetWords:Number(target)});parseAccountPreferences({...preferencePayload(),eng_master_roadmap_v1:JSON.stringify(value)});writeOwnerItem('eng_master_roadmap_v1',JSON.stringify(value));setSaved(value);toast.success('Đã lưu lộ trình.');}catch(error){toast.error((error as Error).message);}};
  return <div className="space-y-6"><div className="flex flex-wrap justify-between gap-3"><div><h1 className="text-3xl font-bold text-white">Lộ trình theo ngày thi</h1><p className="mt-2 text-sm text-zinc-400">Kế hoạch tự điều chỉnh theo số từ còn lại, ngày thi và thời gian mỗi ngày.</p></div><Button variant="outline" onClick={onBack}>Về tổng quan</Button></div>
    <Card className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><label>Ngày thi<input aria-label="Ngày thi" type="date" value={date} onChange={event=>setDate(event.target.value)} className="mt-2 block w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3" /></label><label>Mục tiêu điểm<input aria-label="Mục tiêu điểm" type="number" min={10} max={990} step={5} value={score} onChange={event=>setScore(event.target.value)} className="mt-2 block w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3" /></label><label>Phút học mỗi ngày<input aria-label="Phút học mỗi ngày" type="number" min={5} max={180} value={minutes} onChange={event=>setMinutes(event.target.value)} className="mt-2 block w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3" /></label><label>Số từ muốn bắt đầu học<input aria-label="Số từ muốn bắt đầu học" type="number" min={1} max={10000} value={target} onChange={event=>setTarget(event.target.value)} className="mt-2 block w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3" /></label></div><p className="text-xs text-zinc-400">Mục tiêu điểm được ghi nhận để định hướng. Số từ đã học không được quy đổi thành điểm TOEIC.</p><Button onClick={save}>Lưu lộ trình</Button></Card>
    {plan&&<><div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{[['Ngày còn lại',plan.daysLeft],['Đã bắt đầu học',plan.started],['Từ còn lại',plan.remaining],['Phút mỗi ngày',saved!.minutesPerDay]].map(([label,value])=><Card key={label} className="text-center"><p className="text-3xl font-bold text-indigo-400">{value}</p><p className="mt-2 text-xs text-zinc-400">{label}</p></Card>)}</div><Card className="space-y-4"><h2 className="text-xl font-bold text-white">Gợi ý hôm nay</h2><p>Ôn {plan.reviewCount} từ đến hạn và bắt đầu {plan.newCount} từ mới.</p>{plan.daysLeft===0?<p className="text-amber-300">Ngày thi đã qua. Cập nhật ngày để lập kế hoạch mới.</p>:plan.daysLeft===1?<p className="text-amber-300">Hôm nay là ngày thi. Ưu tiên ôn lại kiến thức đã học.</p>:!plan.feasible?<p className="text-amber-300">Cần khoảng {plan.neededPerDay} từ mới/ngày để hoàn thành phạm vi đã chọn. Thời gian hiện tại có thể chưa đủ; tăng thời gian hoặc giảm số từ mục tiêu.</p>:<p className="text-zinc-400">Gợi ý dựa trên thời gian làm thẻ gần đây; bạn có thể học thành nhiều phiên ngắn.</p>}<div className="flex flex-wrap gap-3"><Button disabled={!plan.reviewIds.length} onClick={()=>onStudy(plan.reviewIds)}>Ôn theo lộ trình</Button><Button variant="outline" disabled={!plan.newIds.length} onClick={()=>onStudy(plan.newIds)}>Học từ mới theo lộ trình</Button></div></Card></>}
  </div>;
}
