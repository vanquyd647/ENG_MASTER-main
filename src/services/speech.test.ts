import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { toast } from 'react-hot-toast';
import { setActiveOwner } from '../repositories/ownerStorage';
import { speakEnglish, stopSpeech } from './speech';
import { bundledSpeechFor } from './bundledSpeech';
vi.mock('react-hot-toast', () => ({ toast: { error: vi.fn() } }));
let audios: FakeAudio[];
let speak: ReturnType<typeof vi.fn>;
class FakeAudio {
  src = ''; currentTime = 0; playbackRate = 1; preload = '';
  onloadedmetadata: (() => void) | null = null; ontimeupdate: (() => void) | null = null;
  onended: (() => void) | null = null; onerror: (() => void) | null = null; onplay: (() => void) | null = null;
  paused = true;
  constructor() { audios.push(this); }
  play = vi.fn(() => { this.paused = false; this.onplay?.(); return Promise.resolve(); });
  pause = vi.fn(() => { this.paused = true; });
  removeAttribute() { this.src = ''; }
  load() {}
}
beforeEach(() => {
  audios = []; speak = vi.fn(); localStorage.clear(); setActiveOwner('speech-test'); setActiveOwner('guest');
  vi.stubGlobal('Audio', FakeAudio);
  vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  vi.stubGlobal('SpeechSynthesisUtterance', class { constructor(public text: string) {} });
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { getVoices: () => [], speak, cancel: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn() } });
});
afterEach(() => { stopSpeech(); vi.unstubAllGlobals(); vi.useRealTimers(); vi.clearAllMocks(); });
it('uses the exact packaged voice even without native voices and respects the speed setting', () => {
  localStorage.setItem('speech_voice', 'A different device voice'); localStorage.setItem('speech_rate', '1.25');
  speakEnglish('  QUALIFIED  ');
  expect(audios).toHaveLength(1); expect(audios[0].src).toBe(bundledSpeechFor('qualified')!.src);
  expect(audios[0].currentTime).toBe(bundledSpeechFor('qualified')!.start);
  expect(audios[0].playbackRate).toBe(1.25); expect(speak).not.toHaveBeenCalled();
});
it('stops at the word boundary and never advances into the next word in the shared pack', () => {
  speakEnglish('qualified'); const audio = audios[0];
  audio.currentTime = bundledSpeechFor('qualified')!.end; audio.ontimeupdate?.();
  expect(audio.paused).toBe(true); expect(audio.src).toBe(''); expect(audios).toHaveLength(1);
});
it('cancels prior audio on repeated play, screen cleanup and owner change', () => {
  speakEnglish('qualified'); const first = audios[0]; const staleError = first.onerror;
  speakEnglish('opening'); expect(first.paused).toBe(true);
  staleError?.(); expect(toast.error).not.toHaveBeenCalled();
  setActiveOwner('another-owner'); expect(audios[1].paused).toBe(true);
  speakEnglish('candidate'); stopSpeech(); expect(audios[2].paused).toBe(true); setActiveOwner('guest');
});
it('reports unavailable packaged audio without silently switching to a device voice', () => {
  speakEnglish('qualified'); audios[0].onerror?.();
  expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Chưa tải được audio'));
  expect(speak).not.toHaveBeenCalled();
});
it('waits for custom-word English voices rather than speaking with a device default', () => {
  vi.useFakeTimers(); const listeners = new Map<string, () => void>();
  window.speechSynthesis.addEventListener = vi.fn((event, listener) => { listeners.set(event, listener as () => void); });
  window.speechSynthesis.removeEventListener = vi.fn((event) => { listeners.delete(event); });
  speakEnglish('my custom technical term'); expect(speak).not.toHaveBeenCalled();
  const voice = { name: 'English', lang: 'en-US', localService: true } as SpeechSynthesisVoice;
  window.speechSynthesis.getVoices = () => [voice]; listeners.get('voiceschanged')?.();
  expect(speak).toHaveBeenCalledTimes(1); expect(speak.mock.calls[0][0].voice).toBe(voice);
  vi.advanceTimersByTime(3000); expect(toast.error).not.toHaveBeenCalled();
});
it('does not silently replace a selected custom-word voice if it is missing', () => {
  vi.useFakeTimers(); localStorage.setItem('speech_voice', 'Unavailable voice');
  window.speechSynthesis.getVoices = () => [{ name: 'Other English', lang: 'en-US' } as SpeechSynthesisVoice];
  speakEnglish('another custom term'); vi.advanceTimersByTime(3000);
  expect(speak).not.toHaveBeenCalled(); expect(toast.error).toHaveBeenCalled();
});

it('uses fixed speaker clips for full dialogue, single-line replay and repetitions without native voices', async () => {
  const { speakDialogue } = await import('./dialogueSpeech');
  const { ALL_WORKPLACE_LESSONS } = await import('../data/learningContent');
  const { DIALOGUE_SPEECH_VOICES } = await import('./bundledSpeech');
  const lesson = ALL_WORKPLACE_LESSONS[0], speakers = [...new Set(lesson.lines.map(line => line.speaker))];
  const voiceIds = lesson.lines.map(line => DIALOGUE_SPEECH_VOICES[speakers.indexOf(line.speaker) % 3]);
  const onLine = vi.fn(), onEnd = vi.fn();
  expect(speakDialogue(lesson.lines.map(line => line.text), .9, { voiceIds, onLine, onEnd })).toBe(true);
  const audio = audios[0]; expect(onLine).toHaveBeenCalledWith(0);
  for (let i = 0; i < lesson.lines.length; i++) {
    const clip = bundledSpeechFor(lesson.lines[i].text, voiceIds[i])!;
    expect(audio.src).toBe(clip.src); expect(audio.currentTime).toBe(clip.start);
    audio.currentTime = clip.end; audio.ontimeupdate?.();
  }
  expect(onEnd).toHaveBeenCalledTimes(1); expect(speak).not.toHaveBeenCalled();
  const last = lesson.lines.length - 1;
  expect(speakDialogue([lesson.lines[last].text], .9, { voiceIds: [voiceIds[last]] })).toBe(true);
  expect(audios[1].currentTime).toBe(bundledSpeechFor(lesson.lines[last].text, voiceIds[last])!.start);
});
it('starting packaged dialogue cancels a custom-word request waiting for delayed voices', async () => {
  vi.useFakeTimers();const listeners = new Map<string, () => void>();
  window.speechSynthesis.addEventListener = vi.fn((event, listener) => { listeners.set(event, listener as () => void); });
  window.speechSynthesis.removeEventListener = vi.fn(event => { listeners.delete(event); });
  speakEnglish('my custom technical term');
  const { speakDialogue } = await import('./dialogueSpeech'); speakDialogue(['opening']);
  window.speechSynthesis.getVoices = () => [{name:'English',lang:'en-US'} as SpeechSynthesisVoice];
  listeners.get('voiceschanged')?.();vi.advanceTimersByTime(3000);
  expect(speak).not.toHaveBeenCalled();expect(toast.error).not.toHaveBeenCalled();
});
it('pins the custom-word voice even if a new preferred device voice appears later', () => {
  const beta = {name:'Beta',lang:'en-US',localService:true} as SpeechSynthesisVoice;
  const alpha = {name:'Alpha',lang:'en-US',localService:true} as SpeechSynthesisVoice;
  window.speechSynthesis.getVoices = () => [beta]; speakEnglish('my first custom term');
  window.speechSynthesis.getVoices = () => [alpha,beta]; speakEnglish('my second custom term');
  expect(speak.mock.calls.map(call=>call[0].voice.name)).toEqual(['Beta','Beta']);
});
