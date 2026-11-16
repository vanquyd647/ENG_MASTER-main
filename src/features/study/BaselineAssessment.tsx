import {BASELINE_SECTIONS,baselineRound,baselineWeakTopics,type BaselineKind} from '../../domain/baselineAssessment';
import type {LearningRecord} from '../../domain/extendedPracticeRecords';
import {Button,Card} from '../../components/ui';
export function BaselineAssessment({records,onStart,onPractice,canListen}:{records:LearningRecord[];onStart:(kind:BaselineKind,ids:string[],round:string)=>void;onPractice:(kind:BaselineKind,ids:string[])=>void;canListen:boolean}) {
  const latest=baselineRound(records),weak=baselineWeakTopics(records);
  const start=(newRound=false)=>{
    const next=!newRound&&latest?.next || BASELINE_SECTIONS[0];
    const round=!newRound&&latest&&!latest.complete?latest.round:crypto.randomUUID().replaceAll('-','');
    onStart(next.kind,next.ids,round);
  };
  return <div className="space-y-5">
    <Card className="space-y-4"><h2 className="text-xl font-bold">Khảo sát nền tảng · 20 câu</h2>
      <p className="text-sm leading-relaxed text-zinc-300">Bốn bước từ câu hỏi có sẵn: nghe phản hồi, ngữ pháp, hoàn thành văn bản và đọc hiểu. Mỗi bước lưu kết quả khi nộp; có thể tạm dừng và tiếp tục.</p>
      <p className="text-sm text-amber-200">Khảo sát này chưa đánh giá Part 1/3/4, không quy đổi sang điểm TOEIC hoặc trình độ CEFR. Giọng nghe dùng giọng tiếng Anh trên thiết bị.</p>
      <div className="grid gap-3 sm:grid-cols-2">{BASELINE_SECTIONS.map(section=>{const score=latest?.sections.find(row=>row.kind===section.kind);return <div key={section.kind} className="rounded-xl border border-zinc-800 p-3"><h3 className="font-semibold">{section.kind.replace('part','Part ')} · {section.label}</h3><p className="mt-2 text-sm text-zinc-400">{score?.complete?score.correct+'/'+section.ids.length+' đúng · '+score.unanswered+' bỏ trống':section.ids.length+' câu · chưa hoàn thành'}</p></div>;})}</div>
      {latest&&<p role="status" className="text-sm text-indigo-200">{latest.complete?'Đã hoàn thành khảo sát':'Đã nộp '+latest.completed+'/4 bước'} · {latest.correct}/{latest.answeredTotal} câu đúng đã nộp</p>}
      <div className="flex flex-wrap gap-3">{(!latest||!latest.complete)&&<Button disabled={(!latest||latest.next?.kind==='part2')&&!canListen} onClick={()=>start()}>{latest?'Tiếp tục khảo sát: '+latest.next?.kind.replace('part','Part '):'Bắt đầu khảo sát nền tảng'}</Button>}{latest&&<Button variant="outline" disabled={!canListen} onClick={()=>start(true)}>Khảo sát lại từ đầu</Button>}</div>
      {!canListen&&<p className="text-sm text-zinc-400">Cần giọng tiếng Anh trên thiết bị để làm bước nghe. Bạn vẫn có thể luyện từng phần đọc và ngữ pháp ở các tab bên cạnh.</p>}
    </Card>
    {!!weak.length&&<Card className="space-y-3"><h2 className="text-lg font-semibold">Ưu tiên ôn theo câu vừa làm</h2>{weak.map(row=><div key={row.kind+row.topic} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 p-3"><p className="text-sm">{row.kind.replace('part','Part ')} · {row.topic} · {row.ids.length} câu sai/bỏ trống</p><Button variant="outline" onClick={()=>onPractice(row.kind,row.ids)}>Ôn chủ điểm này</Button></div>)}</Card>}
    <Card className="space-y-3"><h2 className="text-lg font-semibold">Tài liệu chuẩn bị TOEIC chính thức</h2><p className="text-sm text-zinc-400">Tham khảo cấu trúc bài thi, hướng dẫn và bài mẫu từ ETS. Tài liệu mở trên website ETS, cần kết nối mạng.</p><a href="https://www.ets.org/toeic/test-takers/prepare.html" target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-semibold text-indigo-300 underline underline-offset-4">Mở tài liệu chuẩn bị của ETS</a></Card>
  </div>;
}
