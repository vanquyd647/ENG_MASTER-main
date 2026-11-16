import { useEffect, useState } from 'react';
import { Button } from '../../components/ui';
import type { WorkplaceLesson } from '../../data/workplacePractice';
import { speakDialogue, stopDialogue } from '../../services/dialogueSpeech';
import { useLocalEnglishVoices } from '../../hooks/useLocalEnglishVoices';

export function DialoguePlayer({ lesson, showByDefault = false }: { lesson: WorkplaceLesson; showByDefault?: boolean }) {
  const voices = useLocalEnglishVoices();
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [rate, setRate] = useState(0.9);
  const [repeat, setRepeat] = useState(1);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [transcript, setTranscript] = useState(showByDefault);
  useEffect(() => {
    return () => stopDialogue();
  }, []);
  const stop = () => { stopDialogue(); setActiveLine(null); };
  const play = (only?: number) => {
    const indices = Array.from({ length: repeat }, () => only === undefined ? lesson.lines.map((_, i) => i) : [only]).flat();
    speakDialogue(indices.map(i => lesson.lines[i].text), rate, {
      voiceNames: indices.map(i => choices[lesson.lines[i].speaker] || voices[[...new Set(lesson.lines.map(line => line.speaker))].indexOf(lesson.lines[i].speaker) % Math.max(1, voices.length)]?.name || ''),
      onLine: index => setActiveLine(indices[index]), onEnd: () => setActiveLine(null),
    });
  };
  return <div className="space-y-4">
    <div className="flex flex-wrap items-end gap-3"><Button disabled={!voices.length} onClick={() => play()}>Nghe hội thoại</Button><Button variant="outline" onClick={stop}>Dừng âm thanh</Button>
      <label>Tốc độ<select aria-label="Tốc độ hội thoại" value={rate} onChange={event => { stop(); setRate(Number(event.target.value)); }} className="ml-2 rounded-lg bg-zinc-950 p-2"><option value={0.7}>Chậm</option><option value={0.9}>Bình thường</option><option value={1.1}>Nhanh</option></select></label>
      <label>Lặp<select aria-label="Số lần lặp" value={repeat} onChange={event => { stop(); setRepeat(Number(event.target.value)); }} className="ml-2 rounded-lg bg-zinc-950 p-2">{[1, 3, 5].map(n => <option key={n} value={n}>{n} lần</option>)}</select></label>
    </div>
    {!!voices.length && <div className="grid gap-3 sm:grid-cols-2">{[...new Set(lesson.lines.map(line => line.speaker))].map((speaker, i) => <label key={speaker} className="min-w-0 text-sm">Giọng {speaker}<select aria-label={'Giọng ' + speaker} value={choices[speaker] || voices[i % voices.length]?.name} onChange={event => { stop(); setChoices({ ...choices, [speaker]: event.target.value }); }} className="mt-2 block w-full rounded-lg bg-zinc-950 p-2">{voices.map(voice => <option key={voice.voiceURI || voice.name} value={voice.name}>{voice.name} · {voice.lang}</option>)}</select></label>)}</div>}
    {!voices.length && <p className="text-amber-300">Thiết bị chưa có giọng tiếng Anh offline. Cài giọng đọc hệ thống để nghe; transcript vẫn dùng được.</p>}
    <p className="text-xs text-zinc-400">Giọng tổng hợp chạy cục bộ, tùy thiết bị. Dừng trước khi đổi tốc độ, giọng hoặc số lần lặp. Nội dung dùng offline sau khi tải bộ offline.</p>
    <Button variant="outline" onClick={() => setTranscript(!transcript)}>{transcript ? 'Ẩn transcript' : 'Hiện transcript và bản dịch'}</Button>
    <p role="status" className="text-sm text-indigo-300">{activeLine === null ? 'Chưa phát hoặc đã dừng.' : `Đang nghe câu ${activeLine + 1}/${lesson.lines.length}`}</p>
    {transcript && lesson.lines.map((line, index) => <div key={index} aria-current={activeLine === index ? 'true' : undefined} className={'space-y-2 rounded-xl border p-4 ' + (activeLine === index ? 'border-indigo-400 bg-indigo-500/10' : 'border-zinc-800 bg-zinc-950')}><p><strong>{line.speaker}:</strong> {line.text}</p><p className="text-sm text-zinc-400">{line.translation}</p><Button variant="outline" disabled={!voices.length} onClick={() => play(index)}>Nghe câu {index + 1}</Button></div>)}
  </div>;
}
