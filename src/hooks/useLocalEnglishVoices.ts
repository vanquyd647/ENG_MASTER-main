import { useEffect, useState } from 'react';
import { localEnglishVoices } from '../services/dialogueSpeech';

// Some browsers return [] on the first call, or deliver voiceschanged before React subscribes.
export function useLocalEnglishVoices() {
  const [voices, setVoices] = useState(localEnglishVoices);
  useEffect(() => {
    let attempts = 0;
    const refresh = () => {
      const next = localEnglishVoices();
      setVoices(previous => previous.length === next.length && previous.every((voice, i) => voice.name === next[i].name && voice.lang === next[i].lang) ? previous : next);
      if (next.length || ++attempts >= 20) clearInterval(timer);
    };
    window.speechSynthesis?.addEventListener('voiceschanged', refresh);
    const timer = setInterval(refresh, 500);
    refresh();
    return () => { clearInterval(timer); window.speechSynthesis?.removeEventListener('voiceschanged', refresh); };
  }, []);
  return voices;
}
