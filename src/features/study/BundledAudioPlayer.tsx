import { useEffect,useRef,useState } from 'react';
import { Button } from '../../components/ui';
export function BundledAudioPlayer({src,label}:{src:string;label:string}){
 const ref=useRef<HTMLAudioElement>(null),[playing,setPlaying]=useState(false),[position,setPosition]=useState(0),[duration,setDuration]=useState(0),[rate,setRate]=useState(1),[error,setError]=useState('');
 useEffect(()=>{const audio=ref.current;return()=>audio?.pause();},[src]);
 const stop=()=>{const audio=ref.current;if(audio){audio.pause();audio.currentTime=0;setPosition(0);}};
 return <div className="space-y-3">
  <audio ref={ref} src={src} aria-label={label} preload="metadata" onLoadedMetadata={()=>setDuration(ref.current?.duration||0)} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} onTimeUpdate={()=>setPosition(ref.current?.currentTime||0)} onError={()=>setError('Chưa tải được audio. Kết nối mạng để tải gói học offline rồi thử lại.')}/>
  <div className="flex flex-wrap items-center gap-3"><Button onClick={async()=>{try{await ref.current?.play();setError('');}catch{setError('Chưa phát được audio. Bấm nghe để thử lại.');}}}>{label}</Button><Button variant="outline" onClick={stop}>Dừng âm thanh</Button><label className="text-sm">Tốc độ<select aria-label="Tốc độ bài nghe" value={rate} className="ml-2 rounded-lg bg-zinc-950 p-2" onChange={e=>{const value=Number(e.target.value);setRate(value);if(ref.current)ref.current.playbackRate=value;}}><option value={0.75}>Chậm</option><option value={1}>Bình thường</option><option value={1.25}>Nhanh</option></select></label></div>
  <label className="block text-xs text-zinc-400">Vị trí bài nghe<input type="range" aria-label="Vị trí bài nghe" min={0} max={duration||1} step={0.1} value={Math.min(position,duration||1)} className="mt-2 block w-full" onChange={e=>{if(ref.current)ref.current.currentTime=Number(e.target.value);}}/></label>
  <p role="status" className="text-sm text-indigo-200">{playing?'Đang phát bài nghe.':'Bấm nghe để bắt đầu hoặc nghe lại.'} {Math.floor(position)}/{Math.round(duration)} giây</p>
  {error&&<p role="alert" className="text-sm text-amber-200">{error}</p>}
 </div>;
}
