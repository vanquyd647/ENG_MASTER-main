import { useEffect, useState } from 'react';
import { Button } from '../../components/ui';
import { listeningById } from '../../data/listeningPractice';
import type { LearningQuestion } from '../../data/extendedPractice';
import { speakDialogue, stopDialogue } from '../../services/dialogueSpeech';
import { useLocalEnglishVoices } from '../../hooks/useLocalEnglishVoices';
import { listeningAudioFor } from '../../data/listeningAudio';
import { BundledAudioPlayer } from './BundledAudioPlayer';

export function ListeningMaterial({ question, review = false,examMode=false }: { question: LearningQuestion; review?: boolean;examMode?:boolean }) {
  const stimulus = question.listeningId ? listeningById.get(question.listeningId) : undefined;
  const voices = useLocalEnglishVoices();
  const audio=listeningAudioFor(question);
  const [rate, setRate] = useState(0.9);
  const [playing, setPlaying] = useState(false);
  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    return () => stopDialogue();
  }, []);
  if (!stimulus) return null;
  const stop = () => { stopDialogue(); setPlaying(false); };
  const play = () => {
    const speakers = [...new Set(stimulus.lines.map(row => row.speaker))];
    const lines = stimulus.kind === 'part1'
      ? question.options.map((text, i) => String.fromCharCode(65 + i) + '. ' + text)
      : stimulus.lines.map(row => row.text);
    setPlaying(speakDialogue(lines, rate, {
      voiceNames: stimulus.kind === 'part1' ? lines.map(() => voices[0]?.name || '')
        : stimulus.lines.map(row => voices[speakers.indexOf(row.speaker) % Math.max(1, voices.length)]?.name || ''),
      onEnd: () => setPlaying(false),
    }));
  };
  return <section aria-label="Học liệu nghe" className="space-y-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4">
    <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold text-indigo-200">{stimulus.title}</h2><span className="text-xs text-zinc-400">ENG_MASTER biên soạn</span></div>
    {stimulus.image && <figure className="space-y-2">
      <img src={stimulus.image.src} alt="Ảnh dùng cho câu hỏi mô tả bằng âm thanh" onError={() => setImageError(true)} className="mx-auto max-h-[420px] w-full rounded-lg object-contain" />
      <figcaption className="text-xs text-zinc-400">Ảnh: {stimulus.image.author} · {stimulus.image.license} · <a className="underline underline-offset-2" href={stimulus.image.source} target="_blank" rel="noopener noreferrer">Nguồn ảnh</a></figcaption>
    </figure>}
    {imageError && <p role="alert" className="text-amber-200">Chưa tải được ảnh. Hãy tạm dừng rồi tải lại bài trước khi trả lời.</p>}
    {stimulus.graphic&&<section aria-label="Bảng thông tin bài nghe" className="overflow-x-auto rounded-lg border border-zinc-700 p-3"><h3 className="mb-2 text-sm font-semibold">{stimulus.graphic.title}</h3><table className="w-full text-left text-sm"><thead><tr>{stimulus.graphic.columns.map(label=><th key={label} scope="col" className="p-2">{label}</th>)}</tr></thead><tbody>{stimulus.graphic.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j} className="border-t border-zinc-800 p-2">{cell}</td>)}</tr>)}</tbody></table></section>}
    {!examMode&&(audio?<BundledAudioPlayer key={audio.src} src={audio.src} label={stimulus.kind==='part1'?'Nghe 4 lời mô tả':'Nghe toàn bộ bài'}/>:<><div className="flex flex-wrap items-center gap-3">
      <Button disabled={!voices.length || imageError} onClick={play}>{stimulus.kind === 'part1' ? 'Nghe 4 lời mô tả' : 'Nghe toàn bộ bài'}</Button>
      <Button variant="outline" onClick={stop}>Dừng âm thanh</Button>
      <label className="text-sm">Tốc độ<select aria-label="Tốc độ bài nghe" className="ml-2 rounded-lg bg-zinc-950 p-2" value={rate} onChange={event => { stop(); setRate(Number(event.target.value)); }}><option value={0.7}>Chậm</option><option value={0.9}>Bình thường</option><option value={1.1}>Nhanh</option></select></label>
    </div>
    <p role="status" className="text-sm text-indigo-200">{playing ? 'Đang phát bài nghe.' : 'Bấm nghe để bắt đầu hoặc nghe lại.'}</p>
    {!voices.length && <p role="alert" className="text-amber-200">Thiết bị chưa có giọng tiếng Anh offline. Cài giọng hệ thống, rồi tải lại bài để tiếp tục phần nghe.</p>}</>)}
    <p className="text-xs leading-relaxed text-zinc-400">{examMode?'Âm thanh phát từ track chung của đề.':audio?'Audio giọng tổng hợp đã đóng gói, có thể nghe lại và tua khi luyện.':'Giọng tổng hợp cục bộ, tùy thiết bị.'} {review ? 'Transcript và bản dịch bên dưới.' : 'Transcript và giải thích hiện sau khi nộp bài.'}</p>
    {review && <details><summary className="cursor-pointer text-sm font-semibold text-indigo-200">Transcript và bản dịch</summary><div className="mt-3 space-y-3">
      {stimulus.kind === 'part1' ? question.options.map((option, i) => <p key={option}>{String.fromCharCode(65 + i)}. {option}</p>)
        : stimulus.lines.map((line, i) => <div key={i} className="space-y-1"><p><strong>{line.speaker}:</strong> {line.text}</p><p className="text-sm text-zinc-400">{line.translation}</p></div>)}
    </div></details>}
  </section>;
}
