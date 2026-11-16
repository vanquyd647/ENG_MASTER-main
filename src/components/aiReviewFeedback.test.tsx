import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
vi.mock('../lib/firebase', () => ({ auth: { currentUser: null }, db: {} }));
vi.mock('../lib/apiClient', () => ({ callAiApi: vi.fn() }));
vi.mock('react-hot-toast', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
import { callAiApi } from '../lib/apiClient';
import { QuizSession } from './QuizSession';
import { VOCABULARY } from '../data/vocabulary';
import type { MistakeRecord } from '../domain/mistakes';
afterEach(() => { cleanup(); vi.resetAllMocks(); localStorage.clear(); });
it('shows an AI request failure as an alert and renders the colored review only after a successful retry', async () => {
  const word = VOCABULARY[0];
  const mistake: MistakeRecord = { key: 'ai-layout', wordId: word.id, mode: 'cloze', lastAttemptAt: '2026-10-15T10:00:00Z', wrongAttempts: 1, resolved: false, category: 'spelling', attempt: {
    questionId: 'ai-layout-example', questionType: 'fill', questionText: 'The saved question _____ here.', userAnswer: 'wrong', correctAnswer: word.word, options: [], explanation: 'Ví dụ đã lưu.', word: word.word, meaning: word.meaning,
  } };
  render(<QuizSession initialMistake={mistake} initialWordIds={[word.id]} progress={{}} onCancel={vi.fn()} onWordResult={vi.fn().mockResolvedValue(undefined)} />);
  fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu làm lại câu' }));
  await screen.findByText(mistake.attempt.questionText);
  fireEvent.change(document.getElementById('quiz-answer')!, { target: { value: 'qa-wrong' } });
  fireEvent.click(screen.getByRole('button', { name: 'Kiểm tra đáp án' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Xem kết quả' }));
  const button = await screen.findByRole('button', { name: 'AI giải thích lỗi sai' });
  vi.mocked(callAiApi).mockRejectedValueOnce(Error('AI tạm thời chưa sẵn sàng.'));
  fireEvent.click(button);
  expect(await screen.findByRole('alert')).toHaveTextContent('AI tạm thời chưa sẵn sàng.');
  expect(screen.queryByRole('article', { name: 'Phản hồi AI' })).not.toBeInTheDocument();
  vi.mocked(callAiApi).mockResolvedValueOnce({ text: '**Nghĩa đúng:** ' + word.meaning + '\n**Đáp án của em:** qa-wrong' });
  fireEvent.click(button);
  expect(await screen.findByRole('article', { name: 'Phản hồi AI' })).toBeVisible();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(document.querySelector('[data-ai-tone="mistake"]')).toHaveTextContent('qa-wrong');
});

it('reviews a six-error quiz in two explicit batches and preserves the original questions and answers',async()=>{
  const words=VOCABULARY.slice(0,6);
  render(<QuizSession initialWordIds={words.map(w=>w.id)} progress={{}} onCancel={vi.fn()} onWordResult={vi.fn().mockResolvedValue(undefined)}/>);
  fireEvent.click(screen.getByRole('button',{name:'Bắt đầu điền từ trong câu'}));
  for(let i=0;i<6;i++){
    await waitFor(()=>expect(screen.getByRole('textbox')).toBeEnabled());
    const input=screen.getByRole('textbox');
    fireEvent.change(input,{target:{value:'qa-wrong'}});
    fireEvent.click(screen.getByRole('button',{name:'Kiểm tra đáp án'}));
    const next=await screen.findByRole('button',{name:i===5?'Xem kết quả':'Câu tiếp theo'});await waitFor(()=>expect(next).toBeEnabled());fireEvent.click(next);
  }
  await screen.findByRole('heading',{name:'Kết quả bài thi'});
  vi.mocked(callAiApi).mockImplementation(async(_endpoint,body)=>{
    const mistakes=(body as {mistakes:{wordId:string;word:string;meaning:string;userAnswer:string;correctAnswer:string;questionText:string}[]}).mistakes;
    return {text:'Nhận xét có cấu trúc.',review:{version:'toeic-vi-v3',items:mistakes.map((m,index)=>{
      const w=VOCABULARY.find(w=>w.id===m.wordId)!;
      return {source:{kind:'catalog',wordId:w.id,word:w.word,meaning:w.meaning,pos:w.pos,topic:w.topic,example:w.example,exampleTranslation:w.exampleTranslation},
        userAnswer:m.userAnswer,correctAnswer:m.correctAnswer,feedback:{index,explanation:'Đáp án đã chọn chưa đúng nghĩa.',english:w.example,vietnamese:w.exampleTranslation,question:'Please review the _____ today.',answer:w.word}};
    })}};
  });
  fireEvent.click(screen.getByRole('button',{name:'AI giải thích lỗi sai'}));
  await screen.findByText('Đã phân tích 5/6 lỗi · Tối đa 5 lỗi mỗi lượt');
  expect(callAiApi).toHaveBeenCalledTimes(1);
  const request=vi.mocked(callAiApi).mock.calls[0][1] as {mistakes:{questionText:string;userAnswer:string}[]};
  expect(request.mistakes).toHaveLength(5);expect(request.mistakes.every(m=>m.questionText.includes('_____')&&m.userAnswer==='qa-wrong')).toBe(true);
  fireEvent.click(screen.getByRole('button',{name:'Phân tích lỗi tiếp theo'}));
  await screen.findByText('Đã phân tích 6/6 lỗi · Tối đa 5 lỗi mỗi lượt');
  expect(callAiApi).toHaveBeenCalledTimes(2);expect(screen.queryByRole('button',{name:'Phân tích lỗi tiếp theo'})).not.toBeInTheDocument();
  expect(screen.getByRole('article',{name:'Phản hồi AI'}).querySelectorAll('h4.text-lg')).toHaveLength(6);
});
