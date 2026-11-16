import { toast } from 'react-hot-toast';
import { stopDialogue } from './dialogueSpeech';
import { bundledSpeechFor, playBundledSpeech } from './bundledSpeech';
import { readOwnerItem, subscribeOwner } from '../repositories/ownerStorage';

let activeUtterance: SpeechSynthesisUtterance | null = null;
let pendingTimer: ReturnType<typeof setTimeout> | undefined;
let cancelWaiting: (() => void) | undefined;
let sessionVoice: string | undefined;
let lastSelection: string | null | undefined;

const cancelPendingSpeech = () => {
  if (pendingTimer) { clearTimeout(pendingTimer); pendingTimer = undefined; }
  cancelWaiting?.(); cancelWaiting = undefined;
  activeUtterance = null;
};
export const stopSpeech = () => { cancelPendingSpeech(); stopDialogue(); };
subscribeOwner(reason => { if (reason === 'owner') { stopSpeech(); sessionVoice = undefined; lastSelection = undefined; } });
if (typeof document !== 'undefined') {
  window.addEventListener('eng-master-stop-speech', cancelPendingSpeech);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopSpeech(); });
  window.addEventListener('pagehide', stopSpeech);
}

// Device speech is reserved for custom text without packaged audio. Never silently change voice.
const pickCustomVoice = (): SpeechSynthesisVoice | undefined => {
  const voices = window.speechSynthesis.getVoices().filter(voice => /^en(?:[-_]|$)/i.test(voice.lang));
  const selected = readOwnerItem('speech_voice');
  if (selected !== lastSelection) { sessionVoice = undefined; lastSelection = selected; }
  if (selected) return voices.find(voice => voice.name === selected);
  if (sessionVoice) return voices.find(voice => voice.name === sessionVoice);
  const score = (voice: SpeechSynthesisVoice) => (/^en[-_]US$/i.test(voice.lang) ? 0 : 4) + (voice.localService ? 0 : 2);
  const voice = voices.sort((a, b) => score(a) - score(b) || a.name.localeCompare(b.name))[0];
  if (voice) sessionVoice = voice.name;
  return voice;
};

export const speakEnglish = (text: string | undefined, automatic = false) => {
  if (!text || (automatic && localStorage.getItem('app_sound') === 'false')) return;
  const busy = 'speechSynthesis' in window && (window.speechSynthesis.speaking || window.speechSynthesis.pending);
  stopSpeech();
  const rate = Math.max(0.5, Math.min(1.5, Number(readOwnerItem('speech_rate')) || 0.9));
  const clip = bundledSpeechFor(text);
  if (clip) {
    playBundledSpeech([clip], rate, { onError: () => {
      if (!automatic) toast.error('Chưa tải được audio từ vựng. Kết nối mạng để tải gói offline rồi thử lại.');
    } });
    return;
  }
  if (!('speechSynthesis' in window)) { if (!automatic) toast.error('Từ cá nhân chưa có audio đóng gói và thiết bị chưa hỗ trợ giọng tiếng Anh.'); return; }
  const synth = window.speechSynthesis;
  const play = () => {
    pendingTimer = undefined;
    const voice = pickCustomVoice();
    if (!voice) return false;
    cancelWaiting?.(); cancelWaiting = undefined;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice; utterance.lang = voice.lang; utterance.rate = rate;
    utterance.onend = () => { if (activeUtterance === utterance) activeUtterance = null; };
    utterance.onerror = event => {
      if (activeUtterance !== utterance) return;
      activeUtterance = null;
      if (!automatic && !['interrupted', 'canceled'].includes(event.error)) toast.error('Chưa phát được giọng tiếng Anh đã chọn. Hãy thử lại.');
    };
    activeUtterance = utterance;
    if (synth.paused) synth.resume();
    synth.speak(utterance);
    return true;
  };
  const start = () => {
    if (play()) return;
    // Voice lists can arrive late. Do not queue an utterance with a null/device-default voice.
    const changed = () => { play(); };
    const timeout = setTimeout(() => {
      cancelWaiting?.(); cancelWaiting = undefined;
      if (!automatic) toast.error('Giọng tiếng Anh đã chọn chưa sẵn sàng. Chọn lại giọng cho từ cá nhân trong Cài đặt.');
    }, 3000);
    cancelWaiting = () => { clearTimeout(timeout); synth.removeEventListener('voiceschanged', changed); };
    synth.addEventListener('voiceschanged', changed);
    changed();
  };
  // Chrome/Safari may drop a new system utterance in the same tick as cancel().
  if (busy) pendingTimer = setTimeout(start, 80); else start();
};
