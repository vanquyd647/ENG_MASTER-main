import 'fake-indexeddb/auto';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
vi.mock('../../lib/firebase', () => ({ auth: { currentUser: null }, db: {} }));
vi.mock('react-hot-toast', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
import WorkplaceView from './WorkplaceView';
import MistakesView from './MistakesView';
import { QuizSession } from '../../components/QuizSession';
import { PRACTICE_BANK } from '../../data/workplacePractice';
import { readLearningRecords } from '../../repositories/practiceStore';
import { collectPracticeMistakes } from '../../domain/practiceLearning';
import { getDraft, clearDraft } from '../../repositories/localRepository';
import { setActiveOwner, writeOwnerItem } from '../../repositories/ownerStorage';
import { VOCABULARY } from '../../data/vocabulary';
import type { MistakeRecord } from '../../domain/mistakes';
const q = PRACTICE_BANK[0];
beforeEach(async () => { localStorage.clear(); setActiveOwner('guest'); await clearDraft('quiz'); vi.spyOn(window, 'confirm').mockReturnValue(true); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it('submits a blank practice answer, surfaces it in the shared notebook and resolves the same question on retry', async () => {
  let view = render(<WorkplaceView selection={{ kind: 'part5', questionIds: [q.id] }} onBack={vi.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu bài đã chọn' }));
  fireEvent.click(screen.getByRole('button', { name: 'Nộp bài' }));
  await waitFor(()=>expect(readLearningRecords()).toHaveLength(1)); expect(collectPracticeMistakes(readLearningRecords())[0]).toMatchObject({ unansweredAttempts: 1, wrongAttempts: 0, resolved: false });
  view.unmount(); const select = vi.fn();
  view = render(<MistakesView events={[]} onBack={vi.fn()} onPractice={vi.fn()} onPracticeQuestions={select} />);
  expect(screen.getByText('0 lần sai · 1 lần bỏ trống')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Làm lại câu này' })); expect(select).toHaveBeenCalledWith({ kind: 'part5', questionIds: [q.id] }); view.unmount();
  view = render(<WorkplaceView selection={select.mock.calls[0][0]} onBack={vi.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu bài đã chọn' }));
  fireEvent.click(screen.getByRole('button', { name: String.fromCharCode(65 + q.correctIndex) + '. ' + q.options[q.correctIndex] }));
  fireEvent.click(screen.getByRole('button', { name: 'Nộp bài' }));
  await waitFor(()=>expect(collectPracticeMistakes(readLearningRecords())[0].resolved).toBe(true));
  expect(readLearningRecords()).toHaveLength(2);
});
it('restores the actual selected answer/cursor after unmount and refuses unconfirmed replacement', () => {
  let view = render(<WorkplaceView selection={{ kind: 'part5', questionIds: [q.id, PRACTICE_BANK[1].id] }} onBack={vi.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu bài đã chọn' }));
  fireEvent.click(screen.getByRole('button', { name: 'A. ' + q.options[0] }));
  fireEvent.click(screen.getByRole('button', { name: 'Câu tiếp' })); view.unmount();
  view = render(<WorkplaceView onBack={vi.fn()} />); expect(screen.getByRole('heading', { name: 'Part 5 · 2/2' })).toBeVisible(); view.unmount();
  vi.mocked(window.confirm).mockReturnValue(false);
  render(<WorkplaceView selection={{ kind: 'part5', questionIds: [q.id] }} onBack={vi.fn()} />);
  const before = localStorage.getItem('eng_master_workplace_draft_v2');
  fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu bài đã chọn' }));
  expect(localStorage.getItem('eng_master_workplace_draft_v2')).toBe(before);
});
it('blocks false completion and retains the draft when history cannot be saved', async () => {
  const done = vi.fn(); render(<WorkplaceView selection={{ kind: 'part5', questionIds: [q.id] }} onBack={vi.fn()} onComplete={done} />);
  fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu bài đã chọn' }));
  act(() => writeOwnerItem('eng_master_practice_records_v1', 'broken'));
  fireEvent.click(screen.getByRole('button', { name: 'Nộp bài' }));
  await screen.findByRole('alert');expect(done).not.toHaveBeenCalled(); expect(screen.getByRole('heading', { name: 'Part 5 · 1/1' })).toBeVisible();
});
it('replays an exact vocabulary question and writes the original question ID/mode rather than a fresh generated quiz', async () => {
  const word = VOCABULARY[0];
  const mistake: MistakeRecord = { key: 'original', wordId: word.id, mode: 'cloze', lastAttemptAt: '2026-10-15T10:00:00Z', wrongAttempts: 1, resolved: false, category: 'spelling', attempt: {
    questionId: 'original-ai-question', questionType: 'fill', questionText: 'The exact saved prompt _____ here.', userAnswer: 'wrong', correctAnswer: word.word, options: [], explanation: 'Original explanation.', word: word.word, meaning: word.meaning,
  } };
  const save = vi.fn().mockResolvedValue(undefined);
  render(<QuizSession progress={{}} initialWordIds={[word.id]} initialMistake={mistake} onCancel={vi.fn()} onWordResult={save} />);
  fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu làm lại câu' }));
  await screen.findByText(mistake.attempt.questionText);
  fireEvent.change(document.getElementById('quiz-answer')!, { target: { value: word.word } });
  fireEvent.click(screen.getByRole('button', { name: 'Kiểm tra đáp án' }));
  await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
  expect(save.mock.calls[0][3]).toMatchObject({ mode: 'cloze', correct: true, attempt: { questionId: mistake.attempt.questionId, questionText: mistake.attempt.questionText } });
  expect((await getDraft('quiz'))?.questions?.[0]).toMatchObject({ sourceQuestionId: mistake.attempt.questionId });
});
it('starts the listening tab with its transcript hidden even after viewing the context transcript', () => {
  render(<WorkplaceView onBack={vi.fn()} />);
  expect(screen.getByRole('button', { name: 'Ẩn transcript' })).toBeVisible();
  fireEvent.click(screen.getAllByRole('button', { name: 'Nghe hội thoại' })[0]);
  expect(screen.getByRole('button', { name: 'Hiện transcript và bản dịch' })).toBeVisible();
});
it('teaches a grammar lesson and stores the application result in the extended history only', async () => {
  render(<WorkplaceView onBack={vi.fn()} />);
  fireEvent.click(screen.getByRole('button',{name:'Ngữ pháp'}));
  expect(screen.getByText(/Xác định vị trí trống/)).toBeVisible();
  fireEvent.click(screen.getByRole('button',{name:'Luyện chuyên đề này'}));
  expect(screen.getByRole('heading',{name:'Ngữ pháp · 1/3'})).toBeVisible();
  fireEvent.click(screen.getByRole('button',{name:'Nộp bài'}));
  await waitFor(()=>expect(readLearningRecords()).toHaveLength(1));
  expect(readLearningRecords()[0]).toMatchObject({bankVersion:2,kind:'grammar'});
  expect(localStorage.getItem('eng_master_practice_records_v1')).toBeNull();
});
it('shows the source passage while answering Part 6 and restores the reading draft', async () => {
  let view=render(<WorkplaceView selection={{kind:'part6',questionIds:['p6-v2-delivery-1']}} onBack={vi.fn()} />);
  fireEvent.click(screen.getByRole('button',{name:'Bắt đầu bài đã chọn'}));
  expect(screen.getByRole('region',{name:'Bài đọc'})).toHaveTextContent('Subject: Updated delivery time');
  fireEvent.click(screen.getByRole('button',{name:'A. deliver'}));view.unmount();
  view=render(<WorkplaceView onBack={vi.fn()} />);
  expect(screen.getByRole('button',{name:'A. deliver'})).toHaveAttribute('aria-pressed','true');
  fireEvent.click(screen.getByRole('button',{name:'Nộp bài'}));
  await waitFor(()=>expect(readLearningRecords()[0]).toMatchObject({kind:'part6',answers:[{questionId:'p6-v2-delivery-1',selectedIndex:0}]}));
});
it('does not let a filter from Part 5 silently prevent a grammar lesson from starting',()=>{
 render(<WorkplaceView onBack={vi.fn()} />);
 fireEvent.click(screen.getByRole('button',{name:'Part 5'}));
 fireEvent.change(screen.getByLabelText('Phạm vi bài luyện'),{target:{value:'mistakes'}});
 fireEvent.click(screen.getByRole('button',{name:'Ngữ pháp'}));
 fireEvent.click(screen.getByRole('button',{name:'Luyện chuyên đề này'}));
 expect(screen.getByRole('heading',{name:'Ngữ pháp · 1/3'})).toBeVisible();
});
