import { toast } from "react-hot-toast";
import { stopDialogue } from './dialogueSpeech';
import { readOwnerItem } from "../repositories/ownerStorage";

// Keep a reference so Chrome does not garbage-collect the utterance mid-speech (onend/onerror would never fire).
let activeUtterance: SpeechSynthesisUtterance | null = null;
let pendingTimer: ReturnType<typeof setTimeout> | undefined;

const pickEnglishVoice = (): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  const selected = readOwnerItem("speech_voice");
  const chosen = selected ? voices.find((voice) => voice.name === selected) : undefined;
  if (chosen) return chosen;
  // Never fall back to the device default: on Vietnamese devices it reads English words with a Vietnamese voice.
  const english = voices.filter((voice) => /^en(?:[-_]|$)/i.test(voice.lang));
  const score = (voice: SpeechSynthesisVoice) =>
    (/^en[-_]US$/i.test(voice.lang) ? 0 : 2) + (voice.localService ? 0 : 1) + (/Samantha|Alex|Google US English|Microsoft (Aria|Jenny|Guy|Zira|David)/i.test(voice.name) ? -1 : 0);
  return english.sort((a, b) => score(a) - score(b))[0] || null;
};

export const speakEnglish = (text: string | undefined, automatic = false) => {
  if (!text || (automatic && localStorage.getItem("app_sound") === "false")) return;
  if (!("speechSynthesis" in window)) { if (!automatic) toast.error("Trình duyệt chưa hỗ trợ phát âm. Chọn chế độ điền từ hoặc thẻ học."); return; }
  const synth = window.speechSynthesis;
  const busy = synth.speaking || synth.pending;
  stopDialogue();
  if (pendingTimer) { clearTimeout(pendingTimer); pendingTimer = undefined; }
  const play = () => {
    pendingTimer = undefined;
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickEnglishVoice();
    utterance.voice = voice;
    utterance.lang = voice?.lang || "en-US";
    utterance.rate = Math.max(0.5, Math.min(1.5, Number(readOwnerItem("speech_rate")) || 0.9));
    utterance.onend = () => { if (activeUtterance === utterance) activeUtterance = null; };
    utterance.onerror = (event) => {
      if (activeUtterance === utterance) activeUtterance = null;
      // Interruptions come from the user pressing play again or leaving the screen, not real failures.
      if (automatic || event.error === "interrupted" || event.error === "canceled") return;
      toast.error("Chưa phát được giọng tiếng Anh. Kiểm tra giọng đọc trên thiết bị rồi thử lại.");
    };
    activeUtterance = utterance;
    if (synth.paused) synth.resume();
    synth.speak(utterance);
  };
  // Speaking in the same tick as cancel() is dropped by Chrome/Safari, so wait briefly only when something was playing.
  // Otherwise speak synchronously to keep the user gesture (required by iOS Safari).
  if (busy) pendingTimer = setTimeout(play, 80); else play();
};

export const stopSpeech = () => {
  if (pendingTimer) { clearTimeout(pendingTimer); pendingTimer = undefined; }
  activeUtterance = null;
  stopDialogue();
};
