import { readOwnerItem } from '../repositories/ownerStorage';
import { toast } from 'react-hot-toast';
import { bundledSpeechFor, playBundledSpeech, stopBundledSpeech, DEFAULT_SPEECH_VOICE } from './bundledSpeech';
let playback = 0;
export const localEnglishVoices = () => typeof window !== 'undefined' && 'speechSynthesis' in window
  ? window.speechSynthesis.getVoices().filter(voice => /^en(?:-|_)/i.test(voice.lang) && voice.localService).sort((a, b) => {
    const score = (voice: SpeechSynthesisVoice) => voice.name === readOwnerItem('speech_voice') ? 0 : (/^en[-_]US$/i.test(voice.lang) ? 1 : 3) + (/Samantha|Alex|Daniel|Karen|Microsoft/i.test(voice.name) ? 0 : 1);
    return score(a) - score(b) || a.lang.localeCompare(b.lang) || a.name.localeCompare(b.name);
  }) : [];
export const stopDialogue = () => { playback++; window.dispatchEvent(new Event('eng-master-stop-speech')); stopBundledSpeech(); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
export const speakDialogue = (lines: string[], rate = 0.9, options: {
  voiceNames?: string[]; voiceIds?: string[]; onLine?: (index: number) => void; onEnd?: () => void;
} = {}) => {
  const clips = lines.map((text, index) => bundledSpeechFor(text, options.voiceIds?.[index] || DEFAULT_SPEECH_VOICE));
  if (clips.length && clips.every(clip => !!clip)) {
    stopDialogue();
    return playBundledSpeech(clips, rate, { onLine: options.onLine, onEnd: options.onEnd,
      onError: () => toast.error('Chưa tải được audio hội thoại. Kết nối mạng để tải gói offline rồi thử lại.') });
  }
  const voices = localEnglishVoices();
  if (!voices.length) { toast.error('Chưa có giọng tiếng Anh offline trên thiết bị. Cài giọng đọc hệ thống, hoặc học qua transcript.'); return false; }
  stopDialogue(); const current = playback;
  lines.forEach((text, index) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices.find(voice => voice.name === options.voiceNames?.[index]) || voices[0];
    utterance.lang = utterance.voice.lang; utterance.rate = Math.max(0.5, Math.min(1.5, Number.isFinite(rate) ? rate : 0.9));
    utterance.onstart = () => { if (current === playback) options.onLine?.(index); };
    utterance.onend = () => { if (current === playback && index === lines.length - 1) options.onEnd?.(); };
    utterance.onerror = event => {
      if (current !== playback || event.error === 'canceled' || event.error === 'interrupted') return;
      stopDialogue(); options.onEnd?.(); toast.error('Chưa phát được âm thanh. Kiểm tra giọng đọc hệ thống.');
    };
    window.speechSynthesis.speak(utterance);
  });
  return true;
};
