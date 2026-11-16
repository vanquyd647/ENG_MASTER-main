import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
vi.mock('../../services/ai', () => ({ explainVocabulary: vi.fn() }));
vi.mock('../../services/telemetry', () => ({ reportError: vi.fn() }));
vi.mock('../../domain/catalog', () => ({ getVocabulary: () => [{ id: 'one', word: 'opening', meaning: 'vị trí trống' }, { id: 'two', word: 'opening', meaning: 'lễ khai trương' }] }));
import { explainVocabulary } from '../../services/ai';
import { setActiveOwner } from '../../repositories/ownerStorage';
import { useAiExplanation } from './useAiExplanation';
beforeEach(() => { setActiveOwner('guest'); vi.mocked(explainVocabulary).mockReset(); });
afterEach(() => { cleanup(); setActiveOwner('guest'); });
it('opens immediately and passes the selected ID and meaning to the shared cache service', async () => {
  let resolve!: (value: { text: string; cached: boolean }) => void;
  vi.mocked(explainVocabulary).mockImplementationOnce(() => new Promise(done => { resolve = done; }));
  const { result } = renderHook(useAiExplanation); let request!: Promise<void>;
  act(() => { request = result.current.handleLearnMore('opening', 'vị trí trống', 'selected-exact-id'); });
  expect(result.current.explainingWord).toMatchObject({ wordId: 'selected-exact-id', meaning: 'vị trí trống', content: '' });
  expect(result.current.isExplaining).toBe(true);
  expect(explainVocabulary).toHaveBeenCalledWith('selected-exact-id', 'opening', 'vị trí trống', expect.any(AbortSignal));
  await act(async () => { resolve({ text: 'Giải thích đã lưu.', cached: false }); await request; });
  expect(result.current.explainingWord?.content).toBe('Giải thích đã lưu.'); expect(result.current.isExplaining).toBe(false);
});
it('keeps a failed word open and retries the same word, ID and meaning', async () => {
  vi.mocked(explainVocabulary).mockRejectedValueOnce(Error('AI chưa sẵn sàng.')).mockResolvedValueOnce({ text: 'Thử lại thành công.', cached: false });
  const { result } = renderHook(useAiExplanation);
  await act(async () => { await result.current.handleLearnMore('opening', 'lễ khai trương'); });
  expect(result.current.explanationError).toBe('AI chưa sẵn sàng.'); expect(result.current.explainingWord?.wordId).toBe('two');
  await act(async () => { result.current.retryExplanation(); });
  expect(explainVocabulary).toHaveBeenLastCalledWith('two', 'opening', 'lễ khai trương', expect.any(AbortSignal));
  expect(result.current.explanationError).toBeNull(); expect(result.current.explainingWord?.content).toBe('Thử lại thành công.');
});
it('aborts on close and ignores a late response instead of reopening the dialog', async () => {
  let resolve!: (value: { text: string; cached: boolean }) => void;
  vi.mocked(explainVocabulary).mockImplementationOnce(() => new Promise(done => { resolve = done; }));
  const { result } = renderHook(useAiExplanation); let request!: Promise<void>;
  act(() => { request = result.current.handleLearnMore('opening', 'vị trí trống', 'one'); });
  const signal = vi.mocked(explainVocabulary).mock.calls[0][3]!;
  act(() => result.current.cancelExplanation()); expect(signal.aborted).toBe(true);
  await act(async () => { resolve({ text: 'Old reply', cached: false }); await request; });
  expect(result.current.explainingWord).toBeNull(); expect(result.current.isExplaining).toBe(false);
});
it('does not let an earlier request replace another word or clear its loading state', async () => {
  const resolves: ((value: { text: string; cached: boolean }) => void)[] = [];
  vi.mocked(explainVocabulary).mockImplementation(() => new Promise(done => { resolves.push(done); }));
  const { result } = renderHook(useAiExplanation); let first!: Promise<void>, second!: Promise<void>;
  act(() => { first = result.current.handleLearnMore('opening', 'vị trí trống', 'one'); second = result.current.handleLearnMore('opening', 'lễ khai trương', 'two'); });
  await act(async () => { resolves[0]({ text: 'Wrong old content', cached: false }); await first; });
  expect(result.current.explainingWord?.wordId).toBe('two'); expect(result.current.isExplaining).toBe(true);
  await act(async () => { resolves[1]({ text: 'Correct new content', cached: false }); await second; });
  expect(result.current.explainingWord?.content).toBe('Correct new content');
});
it('closes and aborts when the account changes', async () => {
  vi.mocked(explainVocabulary).mockImplementation(() => new Promise(() => {}));
  const { result } = renderHook(useAiExplanation);
  act(() => { void result.current.handleLearnMore('opening', 'vị trí trống', 'one'); });
  const signal = vi.mocked(explainVocabulary).mock.calls[0][3]!;
  act(() => setActiveOwner('different-user'));
  expect(signal.aborted).toBe(true); expect(result.current.explainingWord).toBeNull();
});

it('keeps the base explanation after a failed follow-up and retries the same second word and selected meaning',async()=>{
  const options={action:'compare' as const,comparison:{wordId:'second',word:'applicant',meaning:'ứng viên'}};
  const answer={version:'toeic-vi-v3' as const,action:'compare' as const,source:{kind:'user' as const,wordId:'one',word:'opening',meaning:'vị trí trống',pos:'',topic:'',example:'',exampleTranslation:''},
    comparison:{kind:'user' as const,wordId:'second',word:'applicant',meaning:'ứng viên',pos:'',topic:'',example:'',exampleTranslation:''},
    lesson:{summary:'Khác nghĩa.',usage:'Cách dùng.',collocations:[{phrase:'job opening',meaning:'vị trí đang tuyển'}],examples:[{english:'We have an opening.',vietnamese:'Chúng tôi đang tuyển.'}],caution:'Không thay thế nhau.',questions:[]}};
  vi.mocked(explainVocabulary).mockResolvedValueOnce({text:'Lời giải gốc.',cached:false}).mockRejectedValueOnce(Error('Hết hạn mức.')).mockResolvedValueOnce({text:'So sánh.',cached:false,explanation:answer});
  const {result}=renderHook(useAiExplanation);
  await act(async()=>{await result.current.handleLearnMore('opening','vị trí trống','one');});
  await act(async()=>{await result.current.followUpExplanation(options);});
  expect(result.current.explainingWord?.content).toBe('Lời giải gốc.');expect(result.current.followupError).toBe('Hết hạn mức.');
  await act(async()=>{result.current.retryFollowup();});
  expect(explainVocabulary).toHaveBeenLastCalledWith('one','opening','vị trí trống',expect.any(AbortSignal),options);
  expect(result.current.followup?.comparison?.meaning).toBe('ứng viên');expect(result.current.followupError).toBeNull();
});
it('aborts a follow-up on account change and ignores its late result',async()=>{
  vi.mocked(explainVocabulary).mockResolvedValueOnce({text:'Lời giải gốc.',cached:false});
  const {result}=renderHook(useAiExplanation);
  await act(async()=>{await result.current.handleLearnMore('opening','vị trí trống','one');});
  let resolve!:(value:{text:string;cached:boolean})=>void;
  vi.mocked(explainVocabulary).mockImplementationOnce(()=>new Promise(done=>{resolve=done;}));
  let pending!:Promise<void>;act(()=>{pending=result.current.followUpExplanation({action:'simplify'});});
  const signal=vi.mocked(explainVocabulary).mock.calls[1][3]!;
  act(()=>setActiveOwner('another-user'));
  expect(signal.aborted).toBe(true);
  await act(async()=>{resolve({text:'Câu trả lời muộn.',cached:false});await pending;});
  expect(result.current.explainingWord).toBeNull();expect(result.current.followup).toBeNull();expect(result.current.isFollowingUp).toBe(false);
});
