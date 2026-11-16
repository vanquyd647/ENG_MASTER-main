import { canLockLearningWrites } from '../../repositories/learningWriteLock';
import { useEffect, useRef, useState } from 'react';
import { Button, Card } from '../../components/ui';
import { questionById, practiceKindLabel } from '../../data/learningContent';
import { readingById } from '../../data/readingContent';
import { EXAM_FORM, EXAM_PARTS, EXAM_PART_COUNTS, advanceExam, answerExamQuestion, moveExamCursor, examPhase, examDeadline, collectExamResults,type ExamPart } from '../../domain/fullExam';
import type { LearningRecord } from '../../domain/extendedPracticeRecords';
import { useExamDraft, startExam, editExam, discardExam, finishExam } from '../../repositories/examStore';
import { EXAM_LISTENING_AUDIO } from '../../data/listeningAudio';
import { ExamAudio } from './ExamAudio';
import { stopDialogue } from '../../services/dialogueSpeech';
import { ListeningMaterial } from './ListeningMaterial';

export function FullExamView({records,onLeave,onActiveChange}:{records:LearningRecord[];onLeave:()=>void;onActiveChange:(active:boolean)=>void}) {
 const {draft,error:readError}=useExamDraft();
 const [now,setNow]=useState(Date.now),[error,setError]=useState(''),[resultId,setResultId]=useState(''),[saving,setSaving]=useState(false),[reviewId,setReviewId]=useState('');
 const [reviewPart,setReviewPart]=useState<ExamPart>('part1'),[reviewPage,setReviewPage]=useState(0);
 const lock=useRef(false);
 const phase=draft?examPhase(draft,now):null;
 useEffect(()=>{if(!draft)return;const timer=setInterval(()=>setNow(Date.now()),1000);return()=>{clearInterval(timer);stopDialogue();};},[draft?.id]);
 useEffect(()=>{onActiveChange(!!draft);return()=>onActiveChange(false);},[draft?.id,onActiveChange]);
 const finish=async()=>{
  if(!draft||lock.current)return;lock.current=true;setSaving(true);
  try{const result=await finishExam(draft);setResultId(result.id);setError('');stopDialogue();}catch(e){setError((e as Error).message);}finally{lock.current=false;setSaving(false);}
 };
 const finishRef=useRef(finish);finishRef.current=finish;
 useEffect(()=>{
  if(!draft||error)return;
  if(phase==='finished'){finishRef.current();return;}
  if(phase==='reading'&&draft.cursor<100&&!lock.current){void editExam(draft,d=>advanceExam(d)).then(()=>stopDialogue()).catch(e=>setError((e as Error).message));}
 },[draft,phase,error]);
 const act=async(change:Parameters<typeof editExam>[1])=>{if(!draft||lock.current)return;lock.current=true;setSaving(true);try{await editExam(draft,change);setError('');setNow(Date.now());}catch(e){setError((e as Error).message);}finally{lock.current=false;setSaving(false);}};
 const results=collectExamResults(records),result=results.find(row=>row.id===resultId);
 const reviewAnswers=result?.records.find(r=>r.kind===reviewPart)?.answers||[];
 const reviewPageCount=Math.max(1,Math.ceil(reviewAnswers.length/10)),currentReviewPage=Math.min(reviewPage,reviewPageCount-1);
 if(draft){
  const cursor=phase!=='listening'&&draft.cursor<100?100:draft.cursor;
  const id=EXAM_FORM.questionIds[cursor],question=questionById.get(id)!;
  const passage=question.passageId?readingById.get(question.passageId):null;
  const seconds=Math.max(0,Math.ceil((examDeadline(draft,now)-now)/1000));
  const first=phase==='listening'?0:100,last=phase==='listening'?99:199;
  return <div className="space-y-4">
   <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">Đề luyện 200 câu · {phase==='listening'?'Nghe':phase==='reading'?'Đọc':'Đã hết giờ'}</h2><span role="timer" className="rounded-xl border border-indigo-400/30 px-3 py-2 font-mono text-indigo-200">{Math.floor(seconds/60)}:{String(seconds%60).padStart(2,'0')}</span></div>
   <p className="text-sm text-amber-200">Đề luyện biên soạn, không quy đổi điểm TOEIC. Bài nghe cố định phát theo thời gian làm bài; đồng hồ tiếp tục chạy khi rời trang.</p>
   {phase==='listening'&&<ExamAudio startedAt={draft.startedAt}/>}
   {error&&<div role="alert" className="space-y-2 text-amber-200"><p>Chưa lưu/nộp được: {error} Bản đã lưu vẫn được giữ.</p><Button variant="outline" onClick={()=>{setError('');if(phase==='finished')finish();}}>Thử lại</Button></div>}
   <div className="flex flex-wrap items-center gap-3"><Button variant="outline" onClick={()=>{stopDialogue();onLeave();}}>Tạm rời màn hình</Button><Button variant="outline" disabled={saving} onClick={async()=>{if(!window.confirm('Bỏ bản nháp đề này? Các kết quả đã nộp trước đó vẫn được giữ.'))return;try{await discardExam(draft);stopDialogue();setError('');}catch(e){setError((e as Error).message);}}}>Bỏ đề đang dở</Button><span className="text-sm text-zinc-400">Đã trả lời {Object.keys(draft.answers).length}/200</span></div>
   <label className="block text-sm">Đi tới câu trong phần đang mở<select aria-label="Đi tới câu đề 200" value={cursor} disabled={phase==='finished'||saving} onChange={e=>{const position=Number(e.target.value);stopDialogue();void act(d=>moveExamCursor(d,position));}} className="mt-2 block w-full rounded-xl bg-zinc-900 p-3">{EXAM_FORM.questionIds.slice(first,last+1).map((qid,i)=><option key={qid} value={first+i}>Câu {first+i+1} · {practiceKindLabel(questionById.get(qid)!.kind)}{draft.answers[qid]!==undefined?' · đã chọn':''}</option>)}</select></label>
   <Card className="space-y-4"><h3 className="text-lg font-bold">Câu {cursor+1}/200 · {practiceKindLabel(question.kind)}</h3>
    {passage&&<section aria-label="Bài đọc đề 200" className="space-y-3 rounded-xl border border-indigo-500/30 p-4"><h4 className="font-semibold">{passage.title}</h4><p className="whitespace-pre-wrap leading-relaxed">{passage.text}</p></section>}
    {question.listeningId&&phase==='listening'&&<ListeningMaterial key={id} question={question} examMode/>}
    {question.kind==='part2'?<p className="text-sm text-zinc-300">Nghe câu hỏi và ba câu trả lời từ track chung rồi chọn A, B hoặc C. Transcript hiện sau khi nộp toàn bộ đề.</p>:<p className="text-lg">{question.prompt}</p>}
    <div className="space-y-3">{question.options.map((option,index)=><button key={index} disabled={phase==='finished'} aria-pressed={draft.answers[id]===index} onClick={()=>act(d=>answerExamQuestion(d,id,index))} className={'block w-full rounded-xl border p-4 text-left focus-visible:ring-2 focus-visible:ring-indigo-400 '+(draft.answers[id]===index?'border-indigo-400 bg-indigo-500/20':'border-zinc-700 bg-zinc-950')}>{String.fromCharCode(65+index)}{question.kind==='part1'||question.kind==='part2'?'':'. '+option}</button>)}</div>
    <div className="flex flex-wrap gap-3"><Button variant="outline" disabled={cursor<=first||phase==='finished'||saving} onClick={()=>{stopDialogue();act(d=>moveExamCursor(d,cursor-1));}}>Câu trước</Button><Button disabled={cursor>=last||phase==='finished'||saving} onClick={()=>{stopDialogue();act(d=>moveExamCursor(d,cursor+1));}}>Câu tiếp</Button><Button variant="outline" disabled={saving} onClick={()=>{if(window.confirm('Nộp toàn bộ đề 200 câu ngay? Mọi câu chưa trả lời sẽ được ghi là bỏ trống.'))finish();}}>Nộp toàn bộ đề</Button></div>
    {phase==='listening'&&cursor===99&&<p className="text-sm text-indigo-200">Phần Đọc mở khi hết 45 phút Nghe. Bạn có thể xem lại câu trong phần Nghe trong thời gian còn lại.</p>}
   </Card>
  </div>;
 }
 return <div className="space-y-5">
  {readError&&<Card><p role="alert" className="text-amber-200">{readError} Hãy xuất dữ liệu thiết bị trong Cài đặt trước khi xử lý bản nháp.</p></Card>}
  {error&&<p role="alert" className="text-amber-200">{error}</p>}
  <Card className="space-y-4"><h2 className="text-xl font-bold">Đề luyện 200 câu · Biên soạn</h2><p className="text-sm text-zinc-300">100 câu Nghe trong 45 phút, tiếp theo 100 câu Đọc trong 75 phút. Giữ nhóm hội thoại/bài đọc và thứ tự câu. Hết giờ Nghe sẽ khóa phần Nghe; hết giờ Đọc tự nộp toàn bộ đề.</p>
   <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">{EXAM_PARTS.map(kind=><p key={kind} className="rounded-lg border border-zinc-800 p-3">{practiceKindLabel(kind)} · {EXAM_PART_COUNTS[kind]} câu</p>)}</div>
   <p className="text-sm text-amber-200">Đáp án, văn bản và ảnh đã rà soát; dùng track giọng tổng hợp cố định 45 phút. Có thể nghe lại từng bài trong chế độ luyện riêng. Kết quả là số câu đúng, chưa quy đổi điểm TOEIC hay CEFR.</p>
   <p className="text-xs text-zinc-400">Bài đang làm lưu trên thiết bị theo tài khoản; rời màn hình không dừng giờ. Khi nộp, kết quả bảy Part dùng lịch sử, backup và đồng bộ hiện có. Giữ tối đa 100 bài mở rộng gần nhất; đề cũ có thể thiếu một số Part khi lịch sử đã hết giới hạn.</p>
   <Button disabled={!!readError||!EXAM_LISTENING_AUDIO||saving||!canLockLearningWrites()} onClick={async()=>{if(lock.current)return;lock.current=true;setSaving(true);try{await startExam();setResultId('');setError('');setNow(Date.now());}catch(e){setError((e as Error).message);}finally{lock.current=false;setSaving(false);}}}>Bắt đầu đề 200 câu</Button>
   {!canLockLearningWrites()&&<p role="alert" className="text-sm text-amber-200">Trình duyệt chưa hỗ trợ lưu đề dài an toàn. Hãy mở bằng trình duyệt mới trong kết nối bảo mật.</p>}
  </Card>
  {result&&<Card className="space-y-4"><h2 className="text-xl font-bold">Kết quả đề: {result.correct}/200 câu đúng</h2><p>{result.unanswered} câu bỏ trống · {200-result.correct-result.unanswered} câu sai · {result.durationSeconds} giây tính cả khi rời trang</p><div className="grid gap-2 sm:grid-cols-2">{result.parts.map(part=><p key={part.kind}>{practiceKindLabel(part.kind)}: {part.correct}/{part.total} đúng · {part.unanswered} bỏ trống</p>)}</div>
   <label className="block text-sm">Xem lại theo phần<select aria-label="Phần xem lại đề" value={reviewPart} onChange={e=>{setReviewPart(e.target.value as ExamPart);setReviewPage(0);setReviewId('');stopDialogue();}} className="mt-2 block w-full rounded-xl bg-zinc-950 p-3">{EXAM_PARTS.map(part=><option key={part} value={part}>{practiceKindLabel(part)}</option>)}</select></label>
   <p className="text-sm text-zinc-400">Câu {currentReviewPage*10+1}–{Math.min((currentReviewPage+1)*10,reviewAnswers.length)} / {reviewAnswers.length} trong phần này</p>
   {reviewAnswers.slice(currentReviewPage*10,(currentReviewPage+1)*10).map(answer=>{const q=questionById.get(answer.questionId)!;const reading=q.passageId?readingById.get(q.passageId):null;return <details key={q.id} open={reviewId===q.id} onToggle={e=>{const open=e.currentTarget.open;setReviewId(current=>open?q.id:current===q.id?'':current);}} className="rounded-xl border border-zinc-800 p-3"><summary>{practiceKindLabel(q.kind)} · {answer.selectedIndex===q.correctIndex?'Đúng':answer.selectedIndex===null?'Bỏ trống':'Sai'} · {q.prompt}</summary>{reviewId===q.id&&<>{q.listeningId&&<ListeningMaterial question={q} review/>}{reading&&<div className="my-3 whitespace-pre-wrap text-sm"><p>{reading.text}</p><details><summary>Bản dịch tham khảo</summary><p>{reading.translation}</p></details></div>}<p className="mt-3">Bạn chọn: {answer.selectedIndex===null?'Bỏ trống':q.options[answer.selectedIndex]}</p><p className="mt-2 text-emerald-200">Đáp án: {q.options[q.correctIndex]}</p><p className="mt-2 text-sm text-zinc-300">{q.explanation}</p>{q.evidence&&<blockquote className="mt-2 border-l-2 border-indigo-400 pl-3 text-sm text-indigo-200">{q.evidence}</blockquote>}</>}</details>;})}
   {reviewPageCount>1&&<div className="flex flex-wrap items-center gap-3"><Button variant="outline" disabled={!currentReviewPage} onClick={()=>{setReviewPage(currentReviewPage-1);setReviewId('');stopDialogue();}}>Trang câu trước</Button><span>{currentReviewPage+1}/{reviewPageCount}</span><Button variant="outline" disabled={currentReviewPage+1>=reviewPageCount} onClick={()=>{setReviewPage(currentReviewPage+1);setReviewId('');stopDialogue();}}>Trang câu tiếp</Button></div>}
  </Card>}
  <Card className="space-y-3"><h2 className="text-lg font-bold">Đề đã nộp</h2>{!results.length&&<p className="text-sm text-zinc-400">Chưa có kết quả đề 200 câu.</p>}{results.map(row=><div key={row.id} className="rounded-xl border border-zinc-800 p-3">{row.complete?<button className="text-left text-indigo-200 underline" onClick={()=>{setResultId(row.id);setReviewPart('part1');setReviewPage(0);setReviewId('');stopDialogue();}}>{row.correct}/200 đúng · {new Date(row.finishedAt).toLocaleString('vi-VN')}</button>:<p className="text-sm text-amber-200">Đề cũ chỉ còn một phần kết quả trong lịch sử giới hạn. Không tính thành điểm đề đủ 200 câu.</p>}</div>)}</Card>
 </div>;
}
