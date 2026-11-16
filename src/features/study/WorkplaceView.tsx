import { listeningAudioFor } from '../../data/listeningAudio';
import { BundledAudioPlayer } from './BundledAudioPlayer';
import { RETIRED_PRACTICE_IDS } from '../../data/practiceRevisions';
import { readExamDraft } from '../../repositories/examStore';
import { FullExamView } from './FullExamView';
import { ALL_READING_PASSAGES as READING_PASSAGES } from '../../data/readingContent';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button, Card } from '../../components/ui';
import { ALL_PRACTICE_QUESTIONS as PRACTICE_BANK, ALL_WORKPLACE_LESSONS as WORKPLACE_LESSONS, practiceKindLabel as kindLabel,questionById } from '../../data/learningContent';
import { GRAMMAR_LESSONS, type LearningQuestion as PracticeQuestion } from '../../data/extendedPractice';
import type { LearningRecord as PracticeRecord } from '../../domain/extendedPracticeRecords';
import { learningPracticeResult as practiceResult } from '../../domain/practiceLearning';
import { selectPracticeQuestions, type PracticeScope } from '../../domain/practiceLearning';
import { createPracticeDraft, readPracticeDraft, savePracticeDraft, savePracticeRecord, usePracticeRecords, type PracticeDraft } from '../../repositories/practiceStore';
import { speakDialogue } from '../../services/dialogueSpeech';
import { useLocalEnglishVoices } from '../../hooks/useLocalEnglishVoices';
import {BaselineAssessment} from './BaselineAssessment';
import {baselineRecordId} from '../../domain/baselineAssessment';
import { stopSpeech } from '../../services/speech';
import { ListeningMaterial } from './ListeningMaterial';
import { LearningSources } from './LearningSources';
import { isListeningKind } from '../../data/listeningPractice';
import { DialoguePlayer } from './DialoguePlayer';

export interface PracticeSelection { kind: PracticeQuestion['kind']; questionIds: string[]; }
const initialExamSection=()=>{try{return readExamDraft()?'exam':'context';}catch{return 'exam';}};
const readInitial = () => { try { return { draft: readPracticeDraft(), error: '' }; } catch (error) { return { draft: null, error: (error as Error).message }; } };

export default function WorkplaceView({ onBack, selection, onComplete }: {
  onBack: () => void; selection?: PracticeSelection; onComplete?: (record: PracticeRecord) => void;
}) {
  const [initial] = useState(readInitial);
  const [section, setSection] = useState<PracticeQuestion['kind'] | 'listening' | 'history' | 'assessment' | 'sources' | 'exam'>(()=>selection?.kind || initial.draft?.kind || initialExamSection());
  const [lessonId, setLessonId] = useState(WORKPLACE_LESSONS[0].id);
  const [draft, setDraft] = useState<PracticeDraft | null>(initial.draft);
  const [draftError, setDraftError] = useState(initial.error);
  const [request, setRequest] = useState(selection);
  const [result, setResult] = useState<PracticeRecord | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [examActive,setExamActive]=useState(false);
  const voices = useLocalEnglishVoices().length;
  const canListenTo=(kind:string)=>!!voices||PRACTICE_BANK.filter(q=>q.kind===kind).every(q=>!!listeningAudioFor(q));
  const [count, setCount] = useState(10);
  const [topic, setTopic] = useState('');
  const [difficulty,setDifficulty]=useState(0);
  const [passageId,setPassageId]=useState('');
  const [grammarId,setGrammarId]=useState(GRAMMAR_LESSONS[0].id);
  const [scope, setScope] = useState<PracticeScope>('all');
  const { records, error } = usePracticeRecords();
  const draftRef = useRef(draft); draftRef.current = draft;
  const saveLock = useRef(false);
  const autoSubmitFailed = useRef(false);
  const [submissionError, setSubmissionError] = useState('');
  const lesson = WORKPLACE_LESSONS.find(row => row.id === lessonId)!;
  const question = draft ? questionById.get(draft.questionIds[draft.cursor]) : null;
  const update = (next: PracticeDraft, replaceExisting=false) => { try { savePracticeDraft(next,replaceExisting); setDraft(next); draftRef.current = next; return true; } catch (error) { toast.error((error as Error).message); return false; } };
  useEffect(() => {
    return () => stopSpeech();
  }, []);
  useEffect(() => {
    document.documentElement.dataset.studyActive = String(!!draft||examActive);
    const unload = (event: BeforeUnloadEvent) => { if ((draft||examActive) && document.documentElement.dataset.reloadApproved !== 'true') { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', unload);
    return () => { document.documentElement.dataset.studyActive = 'false'; window.removeEventListener('beforeunload', unload); };
  }, [draft,examActive]);
  const finish = async () => {
    const current = draftRef.current;
    if (!current || saveLock.current) return;
    saveLock.current = true; setSaving(true);
    try {
      const record = { id: current.id, bankVersion: current.bankVersion || 1, kind: current.kind, startedAt: current.startedAt,
        finishedAt: new Date(Math.max(Date.now(), Date.parse(current.startedAt))).toISOString(), durationSeconds: Math.min(86400, Math.max(0, Math.floor((Date.now() - Date.parse(current.startedAt)) / 1000))),
        answers: current.questionIds.map(questionId => ({ questionId, selectedIndex: current.answers[questionId] ?? null })) } as PracticeRecord;
      await savePracticeRecord(record);
      // A failed draft cleanup can be retried with the same record ID without duplicating results.
      savePracticeDraft(null); setDraft(null); draftRef.current = null; setResult(record); setRequest(undefined); stopSpeech();
      onComplete?.(record);
    } catch (error) { autoSubmitFailed.current = true; setSubmissionError((error as Error).message); toast.error((error as Error).message); }
    finally { saveLock.current = false; setSaving(false); }
  };
  const finishRef = useRef(finish); finishRef.current = finish;
  useEffect(() => {
    if (!draft?.deadline) { setRemaining(null); return; }
    const tick = () => { const seconds = Math.max(0, Math.ceil((draft.deadline! - Date.now()) / 1000)); setRemaining(seconds); if (!seconds && !autoSubmitFailed.current) finishRef.current(); };
    tick(); const interval = window.setInterval(tick, 1000); return () => clearInterval(interval);
  }, [draft?.deadline]);
  const startIds = (kind: PracticeQuestion['kind'], ids: string[], timed = false, assessmentId?:string) => {
    if (error || draftError) { toast.error(error || draftError); return; }
    if (isListeningKind(kind) && !voices && ids.some(id=>!listeningAudioFor(questionById.get(id)!))) { toast.error('Cần giọng tiếng Anh offline để luyện phần nghe.'); return; }
    if (!ids.length) { toast.error('Không có câu phù hợp với bộ lọc.'); return; }
    try {
      if (readPracticeDraft() && !window.confirm('Thay bài luyện đang dở? Câu trả lời chưa nộp của bài đó sẽ không được ghi thành kết quả.')) return;
      const nextDraft=createPracticeDraft(kind, ids, timed);if(assessmentId)nextDraft.id=assessmentId;
      if (update(nextDraft,true)) { autoSubmitFailed.current = false; setSubmissionError(''); setResult(null); setRequest(undefined); }
    } catch (error) { toast.error((error as Error).message); }
  };
  const start = (kind: PracticeQuestion['kind'], timed = false) => startIds(kind, selectPracticeQuestions(records, {
    kind, topic: kind === 'context' ? '' : kind==='grammar'?GRAMMAR_LESSONS.find(row=>row.id===grammarId)!.topic:topic, difficulty, passageId:kind==='part6'||kind==='part7'?passageId:undefined, scope: kind === 'context' || kind === 'grammar' ? 'all' : scope,
    count: kind === 'context' ? 3 : count, lessonId: kind === 'context' ? lessonId : undefined,
  }).map(row => row.id), timed);
  const changeSection = (next: typeof section) => { stopSpeech(); setSection(next); setTopic(''); setPassageId(''); setDifficulty(0); setResult(null); };
  const answered = result ? practiceResult(result) : null;
  const retryIds=result?result.answers.filter(a=>!RETIRED_PRACTICE_IDS.has(a.questionId)&&a.selectedIndex!==questionById.get(a.questionId)?.correctIndex).map(a=>a.questionId):[];
  const reading = question?.passageId?READING_PASSAGES.find(row=>row.id===question.passageId):null;
  const passage = question?.lessonId ? WORKPLACE_LESSONS.find(row => row.id === question.lessonId) : null;

  if (draft && question && !request) return <div className="space-y-5">
    <div className="flex flex-wrap justify-between gap-3"><h1 className="text-2xl font-bold">{kindLabel(draft.kind)} · {draft.cursor + 1}/{draft.questionIds.length}</h1>
      {remaining !== null && <span role="timer">Còn {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</span>}<Button variant="outline" onClick={onBack}>Tạm dừng</Button></div>
    {submissionError && <p role="alert" className="text-amber-300">Chưa lưu được bài: {submissionError} Câu trả lời còn trong bản nháp; thử nộp lại sau khi xử lý lỗi.</p>}
    <Card className="space-y-5">
      {reading&&<section aria-label="Bài đọc" className="space-y-3 rounded-xl border border-indigo-500/30 p-4"><h2 className="text-xl font-bold">{reading.title}</h2><p className="whitespace-pre-wrap leading-relaxed">{reading.text}</p></section>}
      {passage && <details><summary>Đọc lại hội thoại: {passage.title}</summary>{passage.lines.map((line, i) => <p key={i} className="mt-2"><strong>{line.speaker}:</strong> {line.text}</p>)}</details>}
      {question.listeningId && <ListeningMaterial key={question.id} question={question} />}
      {draft.kind === 'part2' ? <>{listeningAudioFor(question)?<BundledAudioPlayer key={question.id} src={listeningAudioFor(question).src} label="Nghe câu hỏi và 3 câu trả lời"/>:<><Button disabled={!voices} onClick={() => speakDialogue([question.prompt, ...question.options.map((text, i) => String.fromCharCode(65 + i) + '. ' + text)])}>Nghe câu hỏi và 3 câu trả lời</Button><Button variant="outline" onClick={stopSpeech}>Dừng âm thanh</Button><p className="text-sm text-zinc-400">Chọn A, B hoặc C sau khi nghe. Transcript và giải thích hiện trong kết quả.</p>{!voices && <p role="status">Thiết bị chưa có giọng tiếng Anh offline. Cài giọng hệ thống hoặc tạm dừng bài để tiếp tục trên thiết bị có giọng.</p>}</>}</> : <p className="text-xl">{question.prompt}</p>}
      <div className="space-y-3">{question.options.map((option, index) => <button key={option} aria-pressed={draft.answers[question.id] === index} disabled={saving} onClick={() => update({ ...draft, answers: { ...draft.answers, [question.id]: index } })} className={'block w-full rounded-xl border p-4 text-left focus-visible:ring-2 focus-visible:ring-indigo-400 ' + (draft.answers[question.id] === index ? 'border-indigo-400 bg-indigo-500/20' : 'border-zinc-700 bg-zinc-900')}>{String.fromCharCode(65 + index)}{(draft.kind === 'part2' || draft.kind === 'part1') ? '' : '. ' + option}</button>)}</div>
      <div className="flex flex-wrap gap-3"><Button variant="outline" disabled={saving || draft.cursor === 0} onClick={() => { stopSpeech(); update({ ...draft, cursor: draft.cursor - 1 }); }}>Câu trước</Button><Button disabled={saving || draft.cursor === draft.questionIds.length - 1} onClick={() => { stopSpeech(); update({ ...draft, cursor: draft.cursor + 1 }); }}>Câu tiếp</Button><Button disabled={saving} variant="outline" onClick={() => { if (window.confirm('Nộp bài? Câu chưa trả lời được ghi riêng là bỏ trống.')) finish(); }}>Nộp bài</Button></div>
    </Card><p className="text-xs text-zinc-400">Câu trả lời tự lưu trên thiết bị. Đồng hồ bài có thời gian vẫn chạy khi đóng trang. Kết quả lưu riêng, không chấm SRS từ vựng.</p>
  </div>;

  return <div className="space-y-6">
    <div className="flex flex-wrap justify-between gap-3"><h1 className="text-3xl font-bold">Bài học và luyện TOEIC</h1><Button variant="outline" onClick={onBack}>Về tổng quan</Button></div>
    <p className="text-sm text-zinc-400">{WORKPLACE_LESSONS.length} ngữ cảnh công việc, {PRACTICE_BANK.length} câu gồm Part 1–7 và ngữ pháp do ENG_MASTER biên soạn. Kết quả là số câu đúng, không phải điểm TOEIC chính thức.</p>
    {error && <p role="alert" className="text-amber-300">{error}</p>}
    {draftError && <Card><p role="alert">{draftError} Kết quả đã nộp vẫn được giữ.</p><Button variant="outline" onClick={() => { if (window.confirm('Bỏ riêng bản nháp bài luyện bị lỗi?')) { try { savePracticeDraft(null); setDraftError(''); } catch (error) { toast.error((error as Error).message); } } }}>Bỏ bản nháp lỗi</Button></Card>}
    {request && <Card className="space-y-3"><h2 className="text-xl font-bold">Bài ôn đã chọn · {kindLabel(request.kind)}</h2><p>{request.questionIds.length} câu giữ nguyên nội dung và đáp án để luyện lại.</p><Button onClick={() => startIds(request.kind, request.questionIds)}>Bắt đầu bài đã chọn</Button>{draft && <Button variant="outline" onClick={() => setRequest(undefined)}>Tiếp tục bài đang dở</Button>}</Card>}
    <div className="flex flex-wrap gap-2">{([['assessment','Khảo sát nền tảng'], ['context', 'Ngữ cảnh'], ['listening', 'Nghe hội thoại'], ['part1', 'Part 1'], ['part2', 'Part 2'], ['part3', 'Part 3'], ['part4', 'Part 4'], ['part5', 'Part 5'], ['grammar','Ngữ pháp'], ['part6','Part 6'], ['part7','Part 7'], ['exam','Đề 200 câu'], ['sources', 'Học liệu'], ['history', 'Kết quả']] as const).map(([id, label]) => <Button key={id} variant={section === id ? 'primary' : 'outline'} onClick={() => changeSection(id)}>{label}</Button>)}</div>
    {result && answered && <Card className="space-y-4"><h2 className="text-xl font-bold">Kết quả: {answered.correct}/{answered.total} câu đúng</h2><p>{answered.unanswered} câu bỏ trống · {answered.total - answered.correct - answered.unanswered} câu sai · {result.durationSeconds} giây làm bài</p>
      <Button variant="outline" disabled={!retryIds.length} onClick={() => startIds(result.kind,retryIds)}>Luyện lại câu sai và bỏ trống</Button>
      {result.answers.map(answer => { const row = questionById.get(answer.questionId)!; return <details key={row.id} className="rounded-xl border border-zinc-800 p-3"><summary>{answer.selectedIndex === row.correctIndex ? 'Đúng' : answer.selectedIndex === null ? 'Bỏ trống' : 'Sai'} · {row.prompt}</summary>{row.listeningId&&<div className="mt-3"><ListeningMaterial question={row} review /></div>}{row.passageId&&<section className="mt-3"><h3 className="font-bold">{READING_PASSAGES.find(p=>p.id===row.passageId)?.title}</h3><p className="mt-2 whitespace-pre-wrap">{READING_PASSAGES.find(p=>p.id===row.passageId)?.text}</p><details><summary>Bản dịch tham khảo</summary><p>{READING_PASSAGES.find(p=>p.id===row.passageId)?.translation}</p></details></section>}<p className="mt-3">Bạn chọn: {answer.selectedIndex === null ? 'Chưa trả lời' : row.options[answer.selectedIndex]}</p><p className="text-emerald-300">Đáp án: {row.options[row.correctIndex]}</p><p className="mt-2 text-sm text-zinc-400">{row.explanation}</p>{RETIRED_PRACTICE_IDS.has(row.id)&&<p className="mt-2 text-sm text-amber-300">Câu cũ có lựa chọn dễ gây tranh luận và đã được thay bằng phiên bản mới. Giữ kết quả lịch sử, không dùng để luyện lại.</p>}</details>; })}</Card>}
    {(section === 'context' || section === 'listening') && <><label className="block">Chọn bài học<select aria-label="Chọn bài học" value={lessonId} onChange={event => { stopSpeech(); setLessonId(event.target.value); }} className="ml-3 max-w-full rounded-xl bg-zinc-900 p-3">{WORKPLACE_LESSONS.map(row => <option key={row.id} value={row.id}>{row.title}</option>)}</select></label><Card className="space-y-4"><h2 className="text-xl font-bold">{lesson.title}</h2><DialoguePlayer key={lesson.id + section} lesson={lesson} showByDefault={section === 'context'} /><p className="text-sm text-indigo-300">{lesson.note}</p><Button onClick={() => start('context')}>Làm 3 câu hiểu ngữ cảnh</Button></Card></>}
    {section==='grammar'&&<Card className="space-y-4"><label>Chuyên đề ngữ pháp<select aria-label="Chuyên đề ngữ pháp" value={grammarId} onChange={event=>setGrammarId(event.target.value)} className="mt-2 block w-full rounded-xl bg-zinc-950 p-3">{GRAMMAR_LESSONS.map(row=><option key={row.id} value={row.id}>{row.title}</option>)}</select></label>{GRAMMAR_LESSONS.filter(row=>row.id===grammarId).map(row=><div key={row.id} className="space-y-3"><h2 className="text-xl font-bold">{row.title}</h2><p>{row.rule}</p>{row.examples.map(example=><div key={example.text} className="rounded-xl bg-zinc-950 p-3"><p>{example.text}</p><p className="mt-2 text-sm text-zinc-400">{example.translation}</p></div>)}<p className="text-amber-300">Dễ nhầm: {row.pitfall}</p><Button onClick={()=>start('grammar')}>Luyện chuyên đề này</Button></div>)}</Card>}
    {(section === 'part1' || section === 'part3' || section === 'part4' || section === 'part5' || section === 'part2'||section==='part6'||section==='part7') && <Card className="space-y-4"><h2 className="text-xl font-bold">Luyện {kindLabel(section)}</h2><p className="text-sm text-indigo-200">{['part1','part3','part4'].includes(section) ? 'Gói thử biên soạn · Giọng tiếng Anh cục bộ. Transcript hiện khi nộp. Chưa nghiệm thu nội dung độc lập.' : 'Chọn bộ lọc để bắt đầu.'}</p><div className="grid gap-3 sm:grid-cols-3">
      {(section==='part6'||section==='part7')&&<label className="sm:col-span-3">Bài đọc<select aria-label="Chọn bài đọc" value={passageId} onChange={event=>setPassageId(event.target.value)} className="mt-2 block w-full rounded-xl bg-zinc-950 p-3"><option value="">Tất cả bài phù hợp</option>{READING_PASSAGES.filter(row=>row.kind===section).map(row=><option key={row.id} value={row.id}>{row.title}</option>)}</select></label>}
      <label>Độ khó<select aria-label="Độ khó bài luyện" value={difficulty} onChange={event=>setDifficulty(Number(event.target.value))} className="mt-2 block w-full rounded-xl bg-zinc-950 p-3"><option value={0}>Tất cả</option><option value={1}>Cơ bản</option><option value={2}>Vận dụng</option><option value={3}>Nâng cao</option></select></label>
      <label>Chủ điểm<select aria-label="Chủ điểm bài luyện" value={topic} onChange={event => setTopic(event.target.value)} className="mt-2 block w-full rounded-xl bg-zinc-950 p-3"><option value="">Tất cả</option>{[...new Set(PRACTICE_BANK.filter(row => row.kind === section).map(row => row.topic))].map(value => <option key={value}>{value}</option>)}</select></label>
      <label>Phạm vi<select aria-label="Phạm vi bài luyện" value={scope} onChange={event => setScope(event.target.value as PracticeScope)} className="mt-2 block w-full rounded-xl bg-zinc-950 p-3"><option value="all">Tất cả câu</option><option value="unseen">Chưa làm</option><option value="mistakes">Cần ôn lại</option></select></label>
      <label>Số câu gợi ý<select aria-label="Số câu bài luyện" value={count} onChange={event => setCount(Number(event.target.value))} className="mt-2 block w-full rounded-xl bg-zinc-950 p-3">{[5, 10, 20, 60].map(value => <option key={value} value={value}>{value === 60 ? 'Tất cả phù hợp' : value}</option>)}</select></label>
    </div><p className="text-sm text-zinc-400">Trộn câu hỏi, giữ thứ tự đáp án. Part 3/4/6/7 giữ nhóm và thứ tự câu trong từng bài; số câu thực tế có thể khác mức chọn để giữ nguyên nhóm. Bộ lọc ít câu hơn sẽ dùng số câu thực tế. Bài có thời gian: 30 giây/câu Part 1–5, 90 giây/câu Part 6/7. Độ khó do ứng dụng biên soạn, chưa được chuẩn hóa theo điểm thi.</p><div className="flex flex-wrap gap-3"><Button disabled={!!error || (isListeningKind(section) && !canListenTo(section))} onClick={() => start(section)}>Luyện không giới hạn thời gian</Button><Button variant="outline" disabled={!!error || (isListeningKind(section) && !canListenTo(section))} onClick={() => start(section, true)}>Bài có thời gian</Button></div>{isListeningKind(section) && !canListenTo(section) && <p className="text-amber-300">Cài giọng tiếng Anh offline trên thiết bị để mở bài nghe.</p>}</Card>}
    {section==='exam'&&<FullExamView records={records} onLeave={()=>changeSection('context')} onActiveChange={setExamActive}/>}
    {section==='sources'&&<LearningSources/>}
    {section==='assessment'&&<BaselineAssessment records={records} canListen={canListenTo('part2')} onStart={(kind,ids,round)=>startIds(kind,ids,false,baselineRecordId(round,kind))} onPractice={(kind,ids)=>startIds(kind,ids)}/>}
    {section === 'history' && <Card className="space-y-3"><p className="text-sm text-zinc-400">Giữ riêng tối đa 100 bài cũ và 100 bài mở rộng theo tài khoản, gồm backup và đồng bộ. Sổ lỗi/thống kê dùng lịch sử còn lưu. Tải backup để giữ chi tiết cũ.</p>{!records.length && !error && <p>Chưa có kết quả bài luyện.</p>}{records.map(record => { const score = practiceResult(record); return <button key={record.bankVersion+':'+record.id} onClick={() => setResult(record)} className="block w-full rounded-xl border border-zinc-800 p-4 text-left">{kindLabel(record.kind)} · {score.correct}/{score.total} · {new Date(record.finishedAt).toLocaleString('vi-VN')}</button>; })}</Card>}
  </div>;
}
