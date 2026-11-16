import { act, renderHook } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
const state = vi.hoisted(() => ({ voices: [] as SpeechSynthesisVoice[] }));
vi.mock('../services/dialogueSpeech', () => ({ localEnglishVoices: () => state.voices }));
import { useLocalEnglishVoices } from './useLocalEnglishVoices';
afterEach(() => vi.useRealTimers());

it('recovers delayed voices without a voiceschanged event and stops polling after success or a bounded wait', () => {
  vi.useFakeTimers(); state.voices = [];
  const hook = renderHook(useLocalEnglishVoices);
  expect(hook.result.current).toEqual([]);
  state.voices = [{ name: 'English test voice', lang: 'en-US' } as SpeechSynthesisVoice];
  act(() => vi.advanceTimersByTime(500));
  expect(hook.result.current).toEqual(state.voices);
  expect(vi.getTimerCount()).toBe(0); hook.unmount();
  state.voices = []; const empty = renderHook(useLocalEnglishVoices);
  act(() => vi.advanceTimersByTime(10000));
  expect(empty.result.current).toEqual([]);
  expect(vi.getTimerCount()).toBe(0); empty.unmount();
});
