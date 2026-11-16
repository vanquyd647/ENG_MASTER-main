import manifest from '../data/pronunciationAudioManifest.json';

export const DEFAULT_SPEECH_VOICE = 'am_michael';
export const DIALOGUE_SPEECH_VOICES = ['am_michael', 'af_heart', 'bf_emma'] as const;
export const SPEECH_VOICE_LABELS: Record<string, string> = { am_michael: 'Michael · Anh Mỹ', af_heart: 'Heart · Anh Mỹ', bf_emma: 'Emma · Anh Anh' };
export interface SpeechClip { src: string; start: number; end: number; voice: string; }
export const normalizeSpeechText = (text: string) => text.normalize('NFKC').replace(/[’‘]/g, "'").trim().replace(/\s+/g, ' ').toLowerCase();
const index = new Map<string, SpeechClip>();
for (const pack of (manifest as { packs: { file: string; entries: (string | number)[][] }[] }).packs) for (const row of pack.entries) {
  const [text, start, end, voice] = row as [string, number, number, string];
  index.set(voice + '|' + normalizeSpeechText(text), { src: '/learning/pronunciation-v1/' + pack.file, start, end, voice });
}
export const bundledSpeechFor = (text: string, voice = DEFAULT_SPEECH_VOICE) => index.get(voice + '|' + normalizeSpeechText(text));
let currentAudio: HTMLAudioElement | null = null;
let activeFrame: number | undefined;
let serial = 0;
let onStopped: (() => void) | undefined;
export const stopBundledSpeech = () => {
  serial++;
  if (activeFrame !== undefined) cancelAnimationFrame(activeFrame);
  activeFrame = undefined;
  if (currentAudio) {
    currentAudio.onloadedmetadata = currentAudio.ontimeupdate = currentAudio.onended = currentAudio.onerror = currentAudio.onplay = null;
    currentAudio.pause();
    currentAudio.removeAttribute('src');
    currentAudio.load();
  }
  currentAudio = null;
  const callback = onStopped; onStopped = undefined; callback?.();
};
export const playBundledSpeech = (clips: readonly SpeechClip[], rate: number, callbacks: {
  onLine?: (index: number) => void; onEnd?: () => void; onError?: () => void;
} = {}) => {
  stopBundledSpeech();
  if (!clips.length) return false;
  const token = serial;
  const audio = new Audio(); currentAudio = audio;
  const speed = Math.max(0.5, Math.min(1.5, rate));
  audio.preload = 'auto'; audio.preservesPitch = true; audio.defaultPlaybackRate = speed; audio.playbackRate = speed;
  onStopped = callbacks.onEnd;
  let cursor = 0;
  let lineSerial = 0;
  const valid = () => token === serial && currentAudio === audio;
  const finish = () => { if (valid()) stopBundledSpeech(); };
  const fail = () => { if (valid()) { stopBundledSpeech(); callbacks.onError?.(); } };
  const next = () => {
    if (!valid()) return;
    if (activeFrame !== undefined) cancelAnimationFrame(activeFrame);
    activeFrame = undefined;
    if (cursor >= clips.length) { finish(); return; }
    const clip = clips[cursor];
    const line = ++lineSerial;
    let advancing = false;
    const end = () => { if (valid() && line === lineSerial && !advancing) { advancing = true; audio.pause(); cursor++; next(); } };
    const tick = () => {
      if (!valid() || line !== lineSerial) return;
      // Clips have a silence gap; never let a slow timeupdate play the next vocabulary word.
      if (audio.currentTime >= clip.end) { end(); return; }
      activeFrame = requestAnimationFrame(tick);
    };
    audio.onloadedmetadata = () => { if (valid() && line === lineSerial) { audio.currentTime = clip.start; audio.playbackRate = speed; } };
    audio.ontimeupdate = () => { if (audio.currentTime >= clip.end) end(); };
    audio.onended = end;
    audio.onerror = fail;
    audio.onplay = () => { if (valid() && line === lineSerial) callbacks.onLine?.(cursor); };
    const src = new URL(clip.src, window.location.href).href;
    if (audio.src !== src) audio.src = clip.src;
    audio.playbackRate = speed;
    audio.currentTime = clip.start;
    // Call play in the originating user gesture, including before metadata arrives (Safari).
    void audio.play().catch(error => { if (valid() && line === lineSerial && error?.name !== 'AbortError') fail(); });
    activeFrame = requestAnimationFrame(tick);
  };
  next();
  return true;
};
