import { act, cleanup, fireEvent, render, screen, within, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { useState } from 'react';
vi.mock('../lib/firebase', () => ({ auth: { currentUser: null }, db: {} }));
vi.mock('../services/ai', () => ({ explainVocabulary: vi.fn() }));
vi.mock('../services/telemetry', () => ({ reportError: vi.fn() }));
import { explainVocabulary } from '../services/ai';
import { Browse } from './Browse';
import { Modal } from './ui';
import AiExplanation from '../features/study/AiExplanation';
import { useAiExplanation } from '../features/study/useAiExplanation';
import { setActiveOwner } from '../repositories/ownerStorage';
function Library() {
  const ai = useAiExplanation();
  return <><Browse progress={{}} onLearnMore={ai.handleLearnMore} onSyncTask={vi.fn()} onResetWord={vi.fn()} onDelayWord={vi.fn()} onStudySelected={vi.fn()} /><Modal isOpen={!!ai.explainingWord} title={'Tìm hiểu thêm: '+ai.explainingWord?.word} onClose={ai.cancelExplanation} scrollBody className="max-w-3xl"><AiExplanation content={ai.explainingWord?.content || ''} meaning={ai.explainingWord?.meaning} isLoading={ai.isExplaining} error={ai.explanationError} onRetry={ai.retryExplanation} /></Modal></>;
}
beforeEach(() => { localStorage.clear(); setActiveOwner('guest'); location.hash = '#browse?q=opening'; vi.mocked(explainVocabulary).mockReset(); });
afterEach(() => { cleanup(); document.body.style.overflow = ''; });
it('opens a separate library dialog, keeps request errors inside it and retains the library filter', async () => {
  vi.mocked(explainVocabulary).mockRejectedValueOnce(Error('Chưa kết nối được AI.')).mockResolvedValueOnce({ text: '**Giải thích:** Lời giải thành công.', cached: false });
  render(<Library />); const button = screen.getAllByRole('button', { name: 'Giải thích bằng AI' })[0];
  button.focus(); fireEvent.click(button);
  const dialog = await screen.findByRole('dialog'); await waitFor(() => expect(within(dialog).getByText('Nghĩa đang học')).toBeVisible());
  expect(await within(dialog).findByRole('alert')).toHaveTextContent('Chưa kết nối được AI.');
  expect(document.querySelectorAll('article')).toHaveLength(0);
  fireEvent.click(within(dialog).getByRole('button', { name: 'Thử lại' }));
  expect(await within(dialog).findByRole('article', { name: 'Phản hồi AI' })).toHaveTextContent('Lời giải thành công.');
  expect(document.querySelectorAll('article')).toHaveLength(1);
  expect(screen.getByPlaceholderText('Tìm theo từ, nghĩa hoặc chủ đề...')).toHaveValue('opening');
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(document.body.style.overflow).toBe(''); expect(button).toHaveFocus();
});
it('locks background scrolling only while the scrollable dialog is open and traps keyboard focus', async () => {
  function TestModal() { const [open, setOpen] = useState(false); return <><button onClick={() => setOpen(true)}>Mở</button><Modal isOpen={open} onClose={() => setOpen(false)} title="Giải thích" scrollBody><button>Nút cuối</button></Modal></>; }
  document.body.style.overflow = 'auto'; render(<TestModal />);
  const trigger = screen.getByRole('button', { name: 'Mở' }); trigger.focus(); fireEvent.click(trigger);
  expect(document.body.style.overflow).toBe('hidden');
  const close = screen.getByRole('button', { name: 'Đóng hộp thoại' }), last = screen.getByRole('button', { name: 'Nút cuối' });
  expect(close).toHaveFocus(); fireEvent.keyDown(document, { key: 'Tab', shiftKey: true }); expect(last).toHaveFocus();
  fireEvent.keyDown(document, { key: 'Tab' }); expect(close).toHaveFocus();
  await act(async () => fireEvent.click(close));
  expect(document.body.style.overflow).toBe('auto'); expect(trigger).toHaveFocus();
});
