import { useEffect,useRef,useState } from 'react';
import { EXAM_LISTENING_AUDIO } from '../../data/listeningAudio';
import { Button } from '../../components/ui';

// Wall-clock deadline remains authoritative after pause, reload or autoplay blocking.
export function ExamAudio({startedAt}:{startedAt:number}){
 const ref=useRef<HTMLAudioElement>(null),[playing,setPlaying]=useState(false),[error,setError]=useState('');
 const play=async()=>{const audio=ref.current;if(!audio)return;const elapsed=Math.max(0,Math.min(EXAM_LISTENING_AUDIO.seconds,(Date.now()-startedAt)/1000));audio.currentTime=elapsed;try{await audio.play();setError('');}catch{setError('Bấm Bật âm thanh để tiếp tục tại thời điểm hiện tại.');}};
 useEffect(()=>{const audio=ref.current;void play();return()=>{audio?.pause();};},[startedAt]);
 return <section aria-label="Audio đề 200 câu" className="space-y-3 rounded-xl border border-indigo-400/30 bg-indigo-500/5 p-4">
  <h3 className="font-semibold text-indigo-200">Bài nghe cố định · 45 phút</h3>
  <audio ref={ref} src={EXAM_LISTENING_AUDIO.src} preload="auto" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>setError('Chưa tải được bài nghe. Kết nối mạng để tải gói offline rồi tiếp tục; đồng hồ vẫn chạy.')} onTimeUpdate={()=>{const audio=ref.current;if(audio&&!audio.paused&&Math.abs(audio.currentTime-(Date.now()-startedAt)/1000)>2)audio.currentTime=Math.max(0,Math.min(EXAM_LISTENING_AUDIO.seconds,(Date.now()-startedAt)/1000));}}/>
  <div className="flex flex-wrap gap-3"><Button onClick={()=>void play()} disabled={playing}>Bật âm thanh</Button><Button variant="outline" disabled={!playing} onClick={()=>ref.current?.pause()}>Tạm tắt âm thanh</Button></div>
  <p role="status" className="text-sm text-zinc-300">{playing?'Đang phát theo thời gian làm bài.':'Âm thanh đang tắt; đồng hồ vẫn chạy.'}</p>
  <p className="text-xs text-zinc-400">Giọng tổng hợp đã đóng gói, phát một lượt theo cùng lịch. Bật lại hoặc tải lại trang sẽ tiếp tục tại thời điểm hiện tại, không phát lại phần đã qua.</p>
  {error&&<p role="alert" className="text-sm text-amber-200">{error}</p>}
 </section>;
}
