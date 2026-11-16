import { readOwnerItem } from '../repositories/ownerStorage';
import { toast } from 'react-hot-toast';
let playback = 0;
export const localEnglishVoices = () => typeof window !== 'undefined' && 'speechSynthesis' in window
  ? window.speechSynthesis.getVoices().filter(voice => /^en(?:-|_)/i.test(voice.lang) && voice.localService).sort((a, b) => {
    const score = (voice: SpeechSynthesisVoice) => voice.name === readOwnerItem('speech_voice') ? 0 : /Samantha|Alex|Daniel|Karen|Microsoft/i.test(voice.name) ? 1 : 2;
    return score(a) - score(b);
  }) : [];
export const stopDialogue = () => { playback++; if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
export const speakDialogue = (lines: string[], rate = 0.9, options: {
  voiceNames?: string[]; onLine?: (index: number) => void; onEnd?: () => void;
} = {}) => {
  const voices = localEnglishVoices();
  if (!voices.length) { toast.error('Chưa có giọng tiếng Anh offline trên thiết bị. Cài giọng đọc hệ thống, hoặc học qua transcript.'); return false; }
  stopDialogue(); const current = playback;
  lines.forEach((text, index) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices.find(voice => voice.name === options.voiceNames?.[index]) || voices[index % voices.length];
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
