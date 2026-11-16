import { RETIRED_PRACTICE_IDS } from '../../data/practiceRevisions';
import { ALL_READING_PASSAGES as READING_PASSAGES } from '../../data/readingContent';
import { ListeningMaterial } from './ListeningMaterial';
import { practiceKindLabel } from '../../data/learningContent';
import { useEffect, useMemo, useState } from 'react';
import { Button, Card } from '../../components/ui';
import { collectMistakes, type MistakeRecord } from '../../domain/mistakes';
import { collectPracticeMistakes } from '../../domain/practiceLearning';
import { getWordById } from '../../domain/catalog';
import { usePracticeRecords } from '../../repositories/practiceStore';
import type { PracticeSelection } from './WorkplaceView';
import type { StudyEvent } from '../../types';

export default function MistakesView({ events, onBack, onPractice, onExactPractice, onPracticeQuestions }: {
  events: StudyEvent[]; onBack: () => void; onPractice: (ids: string[]) => void;
  onExactPractice?: (row: MistakeRecord) => void; onPracticeQuestions?: (selection: PracticeSelection) => void;
}) {
  const [status, setStatus] = useState('open'), [category, setCategory] = useState('all'), [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const { records: practiceRecords, error } = usePracticeRecords();
  useEffect(() => setPage(0), [status, category, search]);
  const records = useMemo(() => collectMistakes(events), [events]);
  const matches = (resolved: boolean, kind: string, text: string) => (status === 'all' || resolved === (status === 'resolved'))
    && (category === 'all' || kind === category) && text.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase());
  const vocabulary = records.filter(row => matches(row.resolved, row.category, row.attempt.word + ' ' + row.attempt.meaning + ' ' + row.attempt.questionText));
  const practice = collectPracticeMistakes(practiceRecords).filter(row => matches(row.resolved, row.question.kind, row.question.prompt + ' ' + row.question.topic));
  const ids = [...new Set(vocabulary.filter(row => !row.resolved && getWordById(row.wordId)).map(row => row.wordId))];
  const combined = [...vocabulary.map(row => ({ type: 'vocabulary' as const, row })), ...practice.map(row => ({ type: 'practice' as const, row }))]
    .sort((a, b) => Date.parse(b.row.lastAttemptAt) - Date.parse(a.row.lastAttemptAt));
  const pageCount = Math.max(1, Math.ceil(combined.length / 50)), currentPage = Math.min(page, pageCount - 1);
  return <div className="space-y-6 break-words">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-3xl font-bold text-white">Sổ lỗi sai</h1><p className="mt-2 text-sm text-zinc-400">Lỗi từ vựng, Part 1–7, ngữ pháp và ngữ cảnh từ câu trả lời thật. Trả lời đúng lại được ghi là đã ôn đúng, chưa đồng nghĩa đã thành thạo.</p></div><Button variant="outline" onClick={onBack}>Về tổng quan</Button></div>
    {error && <p role="alert" className="text-amber-300">{error}</p>}
    <Card className="space-y-4"><div className="flex flex-wrap items-end gap-4">
      <label className="min-w-0 flex-1 text-sm">Tìm câu, từ hoặc chủ điểm<input aria-label="Tìm lỗi sai" value={search} onChange={event => setSearch(event.target.value)} className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3" /></label>
      <label className="text-sm">Trạng thái<select aria-label="Trạng thái lỗi sai" value={status} onChange={event => setStatus(event.target.value)} className="mt-2 block rounded-xl border border-zinc-700 bg-zinc-950 p-3"><option value="open">Cần ôn lại</option><option value="resolved">Đã ôn đúng</option><option value="all">Tất cả</option></select></label>
      <label className="text-sm">Dạng bài<select aria-label="Dạng lỗi sai" value={category} onChange={event => setCategory(event.target.value)} className="mt-2 block rounded-xl border border-zinc-700 bg-zinc-950 p-3"><option value="all">Tất cả</option><option value="meaning">Chọn nghĩa / ngữ cảnh từ</option><option value="spelling">Điền từ</option><option value="listening">Nghe – gõ</option><option value="part1">Part 1</option><option value="part3">Part 3</option><option value="part4">Part 4</option><option value="part5">Part 5</option><option value="part2">Part 2</option><option value="part6">Part 6</option><option value="part7">Part 7</option><option value="grammar">Ngữ pháp</option><option value="context">Hội thoại công việc</option></select></label>
    </div><div className="flex flex-wrap gap-3"><Button disabled={!ids.length} onClick={() => onPractice(ids)}>Quiz mới theo các từ đang sai ({ids.length})</Button>
      {(['part1', 'part2', 'part3', 'part4', 'part5', 'part6', 'part7', 'grammar', 'context'] as const).map(kind => { const questions = practice.filter(row => !row.resolved && !RETIRED_PRACTICE_IDS.has(row.question.id) && row.question.kind === kind).map(row => row.question.id); return <Button key={kind} variant="outline" disabled={!questions.length || !onPracticeQuestions} onClick={() => onPracticeQuestions?.({ kind, questionIds: questions })}>Ôn {practiceKindLabel(kind)} ({questions.length})</Button>; })}
    </div></Card>
    <p className="text-xs text-zinc-400">Lỗi bài luyện dựa trên tối đa 100 bài cũ và 100 bài mở rộng còn được lưu. Câu bỏ trống được đếm riêng. Tiến độ cũ thiếu câu trả lời không được dựng thành lỗi giả.</p>
    {!combined.length && <Card><p className="text-zinc-400">Chưa có câu cần ôn phù hợp với bộ lọc.</p></Card>}
    {combined.slice(currentPage * 50, (currentPage + 1) * 50).map(item => {
      if (item.type === 'practice') { const row = item.row, question = row.question; return <Card key={question.id} className="space-y-3"><div className="flex flex-wrap justify-between gap-2"><h2 className="text-xl font-bold">{practiceKindLabel(question.kind)} · {question.topic}</h2><span className={row.resolved ? 'text-emerald-400' : 'text-amber-300'}>{row.resolved ? 'Đã ôn đúng' : 'Cần ôn lại'}</span></div><p>{question.prompt}</p>{question.listeningId&&<ListeningMaterial question={question} review />}{question.passageId&&<details><summary>Xem bài đọc: {READING_PASSAGES.find(p=>p.id===question.passageId)?.title}</summary><p className="mt-2 whitespace-pre-wrap">{READING_PASSAGES.find(p=>p.id===question.passageId)?.text}</p></details>}<p className="text-sm text-zinc-400">{row.wrongAttempts} lần sai · {row.unansweredAttempts} lần bỏ trống</p><p>Bạn trả lời gần nhất: {row.selectedIndex === null ? '(bỏ trống)' : question.options[row.selectedIndex]}</p><p className="text-emerald-300">Đáp án: {question.options[question.correctIndex]}</p><p className="text-sm text-zinc-400">{question.explanation}</p><Button variant="outline" disabled={!onPracticeQuestions||RETIRED_PRACTICE_IDS.has(question.id)} onClick={() => onPracticeQuestions?.({ kind: question.kind, questionIds: [question.id] })}>Làm lại câu này</Button>{RETIRED_PRACTICE_IDS.has(question.id)&&<p className="text-sm text-amber-300">Câu đã được thay thế do lựa chọn dễ gây tranh luận; chỉ giữ lịch sử.</p>}<p className="text-xs text-zinc-500">Lần làm gần nhất: {new Date(row.lastAttemptAt).toLocaleString('vi-VN')}</p></Card>; }
      const row = item.row;
      return <Card key={row.key} className="space-y-3"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl font-bold text-white">{row.attempt.word}</h2><span className={row.resolved ? 'text-emerald-400' : 'text-amber-300'}>{row.resolved ? 'Đã ôn đúng' : 'Cần ôn lại'} · {row.wrongAttempts} lần sai</span></div><p className="text-sm text-zinc-400">{row.attempt.meaning}</p><p>{row.attempt.questionText}</p><div className="rounded-xl bg-zinc-950 p-3 text-sm"><p>Bạn trả lời gần nhất: {row.attempt.userAnswer || '(trống)'}</p><p className="mt-1">Đáp án: <strong className="text-emerald-300">{row.attempt.correctAnswer}</strong></p></div>{row.attempt.explanation && <p className="whitespace-pre-wrap text-sm text-zinc-400">{row.attempt.explanation}</p>}<p className="text-xs text-zinc-500">Lần làm gần nhất: {new Date(row.lastAttemptAt).toLocaleString('vi-VN')}</p>{getWordById(row.wordId) ? <Button variant="outline" disabled={!onExactPractice} onClick={() => onExactPractice?.(row)}>Làm lại câu này</Button> : <p className="text-xs text-amber-300">Từ đã được xóa khỏi thư viện; câu trả lời vẫn được giữ trong lịch sử.</p>}</Card>;
    })}
    {pageCount > 1 && <div className="flex items-center gap-3"><Button variant="outline" disabled={!currentPage} onClick={() => setPage(currentPage - 1)}>Trang trước</Button><span>Trang {currentPage + 1}/{pageCount}</span><Button variant="outline" disabled={currentPage + 1 >= pageCount} onClick={() => setPage(currentPage + 1)}>Trang sau</Button></div>}
  </div>;
}
