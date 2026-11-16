import { lazy, Suspense, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button, Card } from '../../components/ui';
import { useCatalog } from '../../domain/useCatalog';
import { getWordById } from '../../domain/catalog';
import { buildTodayLearning, parseTodayLearning, type TodayLearning, type TodayStep } from '../../domain/todayLearning';
import { parseRoadmap } from '../../domain/roadmap';
import { getLocalDateKey } from '../../lib/learning';
import { getDraft } from '../../repositories/localRepository';
import { readOwnerItem, writeOwnerItem } from '../../repositories/ownerStorage';
import { readLearningRecords, usePracticeRecords } from '../../repositories/practiceStore';
import { localEnglishVoices } from '../../services/dialogueSpeech';
import type { StudyEvent } from '../../types';
import type { ReviewSession } from '../../components/ReviewSession';
import type { QuizSession } from '../../components/QuizSession';
const Review = lazy(() => import('../../components/ReviewSession').then(module => ({ default: module.ReviewSession })));
const Quiz = lazy(() => import('../../components/QuizSession').then(module => ({ default: module.QuizSession })));
const Workplace = lazy(() => import('./WorkplaceView'));
const KEY = 'eng_master_today_learning_v1';
const label = (step: TodayStep) => step.kind === 'review' ? `Ôn ${step.wordIds.length} từ đến hạn` : step.kind === 'new' ? `Học ${step.wordIds.length} từ mới` : step.kind === 'mistake' ? 'Làm lại một câu từ vựng đã sai' : `Luyện ${step.questionIds.length} câu ${step.practiceKind === 'part5' ? 'Part 5' : 'Part 2'}`;
const readSaved = (dataset: string) => {
  try { const raw = JSON.parse(readOwnerItem(KEY) || 'null'); if (!raw) return { plan: null, error: '' }; const plan = parseTodayLearning(raw); return { plan: plan.dataset === dataset ? plan : null, error: '' }; }
  catch { return { plan: null, error: 'Bản nháp Học hôm nay không đọc được. Bạn có thể bỏ riêng bản nháp này để lập phiên mới; tiến độ và kết quả đã lưu vẫn được giữ.' }; }
};
type Props = Pick<React.ComponentProps<typeof ReviewSession>, 'progress' | 'onSaveProgress' | 'onLearnMore'> & {
  events: StudyEvent[]; datasetGeneration: string; onBack: () => void;
  onReviewFinish: React.ComponentProps<typeof ReviewSession>['onFinish'];
  onQuizFinish: NonNullable<React.ComponentProps<typeof QuizSession>['onFinish']>;
  onWordResult: NonNullable<React.ComponentProps<typeof QuizSession>['onWordResult']>;
};
export default function TodayLearningView(props: Props) {
  const words = useCatalog();
  const dataset = props.datasetGeneration + ':' + (readOwnerItem('eng_master_local_dataset_revision_v1') || 'legacy');
  const [initial] = useState(() => readSaved(dataset));
  const [plan, setPlan] = useState<TodayLearning | null>(initial.plan);
  const [error, setError] = useState(initial.error);
  const [running, setRunning] = useState(false);
  const [busy, setBusy] = useState(false);
  const { error: recordsError } = usePracticeRecords();
  const step = plan?.steps.find(row => !row.done);
  const save = (next: TodayLearning) => { writeOwnerItem(KEY, JSON.stringify(parseTodayLearning(next))); setPlan(next); };
  const create = () => {
    try {
      if (plan && !window.confirm('Lập phiên mới? Các lượt đã chấm vẫn được giữ, bản nháp Học hôm nay sẽ được thay.')) return;
      const raw = readOwnerItem('eng_master_roadmap_v1'); const roadmap = raw ? parseRoadmap(JSON.parse(raw)) : null;
      save(buildTodayLearning({ words, progress: props.progress, events: props.events, records: readLearningRecords(), date: getLocalDateKey(), dataset, roadmap, canListen: !!localEnglishVoices().length }));
      setRunning(false);
    } catch (error) { toast.error((error as Error).message); }
  };
  const finish = () => {
    if (!plan || !step) return;
    save({ ...plan, steps: plan.steps.map(row => row.id === step.id ? { ...row, done: true } : row) }); setRunning(false);
  };
  const begin = async () => {
    if (!step || busy) return;
    setBusy(true);
    try {
      if (step.kind === 'review' || step.kind === 'new') {
        if (step.wordIds.some(id => !getWordById(id))) throw Error('Một từ trong phiên đã bị xóa. Lập phiên mới để cập nhật thư viện.');
        const draft = await getDraft(step.kind === 'new' ? 'review-new' : 'review-review');
        if (draft && draft.id !== step.sessionId && !window.confirm('Thay phiên thẻ đang dở để học theo Học hôm nay? Tiến độ đã chấm vẫn được giữ.')) return;
      } else if (step.kind === 'mistake') {
        if (!getWordById(step.mistake.wordId)) throw Error('Từ của câu ôn đã bị xóa. Lập phiên mới để cập nhật.');
      }
      setRunning(true);
    } catch (error) { toast.error((error as Error).message); }
    finally { setBusy(false); }
  };
  if (running && step && plan) return <div className="space-y-5"><p className="text-sm text-indigo-300">Học hôm nay · {label(step)}</p><Suspense fallback={<p>Đang tải bài học...</p>}>
    {(step.kind === 'review' || step.kind === 'new') && <Review key={step.id} progress={props.progress} selectedWordIds={step.wordIds} resumeSessionId={step.sessionId} mode={step.kind === 'new' ? 'new' : 'review'} onLearnMore={props.onLearnMore} onSaveProgress={props.onSaveProgress} onCancel={() => setRunning(false)} onFinish={async (progress, ids, sessionId) => {
      await props.onReviewFinish(progress, ids, sessionId);
      const remaining = step.wordIds.filter(id => !ids.includes(id));
      save({ ...plan, steps: plan.steps.map(row => row.id === step.id ? remaining.length ? { ...step, wordIds: remaining, sessionId: crypto.randomUUID() } : { ...row, done: true } : row) }); setRunning(false);
    }} />}
    {step.kind === 'mistake' && <Quiz key={step.id} progress={props.progress} initialWordIds={[step.mistake.wordId]} initialMistake={step.mistake} resumeSessionId={step.sessionId} onCancel={() => setRunning(false)} onWordResult={props.onWordResult} onFinish={async (...args) => { await props.onQuizFinish(...args); finish(); }} />}
    {step.kind === 'practice' && <Workplace key={step.id} selection={{ kind: step.practiceKind, questionIds: step.questionIds }} onBack={() => setRunning(false)} onComplete={record => {
      if (JSON.stringify(record.answers.map(answer => answer.questionId).sort()) === JSON.stringify([...step.questionIds].sort())) finish();
      else toast.success('Đã lưu bài đang dở trước đó. Bước Học hôm nay vẫn chờ hoàn thành.');
    }} />}
  </Suspense></div>;
  return <div className="space-y-5"><div className="flex flex-wrap justify-between gap-3"><h1 className="text-3xl font-bold">Học hôm nay</h1><Button variant="outline" onClick={props.onBack}>Về tổng quan</Button></div>
    <p className="text-zinc-400">Một phiên ngắn nối ôn đến hạn, chữa lỗi, từ mới và bài áp dụng. Khối lượng gợi ý theo lộ trình; thời gian thực tế tùy nhịp học. Bản nháp phiên này lưu riêng trên thiết bị, kết quả học dùng cơ chế backup/đồng bộ hiện có.</p>
    {(error || recordsError) && <Card><p role="alert">{error || recordsError}</p>{error && <Button variant="outline" onClick={() => { if (window.confirm('Bỏ riêng bản nháp Học hôm nay bị lỗi?')) { try { writeOwnerItem(KEY, 'null'); setError(''); } catch (error) { toast.error((error as Error).message); } } }}>Bỏ bản nháp lỗi</Button>}</Card>}
    {!error && !recordsError && (!plan ? <Button onClick={create}>Lập phiên Học hôm nay</Button> : <>
      <p>Phiên ngày {plan.date} · ngân sách {plan.minutes} phút/ngày · {plan.steps.filter(row => row.done).length}/{plan.steps.length} bước đã hoàn thành</p>
      {plan.date !== getLocalDateKey() && <p className="text-amber-300">Đây là phiên ngày trước. Bạn có thể tiếp tục hoặc lập phiên mới theo hạn ôn hiện tại.</p>}
      <ol className="space-y-3">{plan.steps.map((row, i) => <li key={row.id} className="rounded-xl border border-zinc-800 p-4">{i + 1}. {label(row)} · {row.done ? 'Đã hoàn thành' : 'Chưa hoàn thành'}</li>)}</ol>
      {step ? <Button disabled={busy} onClick={() => void begin()}>Tiếp tục: {label(step)}</Button> : <p role="status" className="text-emerald-300">Đã hoàn thành phiên Học hôm nay.</p>}
      <Button variant="outline" onClick={create}>Lập phiên mới</Button>
    </>)}
  </div>;
}
