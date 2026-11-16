"""Render fixed voice audio locally. No learner/custom data leaves the machine."""
import os,json,hashlib,subprocess
from pathlib import Path
os.environ['HF_HUB_OFFLINE']='1'
os.environ['HF_HOME']='/private/tmp/eng-master-voice/hf'
import torch,numpy as np,soundfile as sf
from kokoro import KModel,KPipeline
root=Path.cwd();assets=Path('/Users/macm5/Quy_code/TTS-text_to_speech/data/models/kokoro')
cache=Path('/private/tmp/eng-master-voice/segments');cache.mkdir(parents=True,exist_ok=True)
out=root/'public/learning/pronunciation-v1';out.mkdir(parents=True,exist_ok=True)
weights=Path('/private/tmp/eng-master-voice/kokoro-v1_0.pth')
assert hashlib.sha256(weights.read_bytes()).hexdigest()=='496dba118d1a58f5f3db2efc88dbdc216e0483fc89fe6e47ee1f2c53f18ad1e4'
data=json.loads((root/'output/verification/pronunciation-input.json').read_text());sr=data['sampleRate']
torch.set_num_threads(4);device='mps' if torch.backends.mps.is_available() else 'cpu';print('device',device,flush=True)
model=KModel(config=str(assets/'config.json'),model=str(weights)).to(device).eval()
pipe=KPipeline(lang_code='a',model=model);voices={name:torch.load(assets/'voices'/f'{name}.pt',weights_only=True,map_location='cpu') for name in ['am_michael','af_heart','bf_emma']}
manifest={'version':1,'model':data['model'],'defaultVoice':'am_michael','baseSpeed':data['speed'],'packs':[]};evidence=[]
for packidx,offset in enumerate(range(0,len(data['rows']),40)):
 pieces=[np.zeros(round(.15*sr),dtype=np.float32)];cursor=len(pieces[0]);entries=[]
 for row in data['rows'][offset:offset+40]:
  key=hashlib.sha256((row['voice']+'|'+str(data['speed'])+'|'+row['text']).encode()).hexdigest();wav=cache/(key+'.wav')
  if wav.exists():audio=sf.read(wav,dtype='float32')[0]
  else:
   chunks=[r.audio.detach().cpu().numpy() for r in pipe(row['text'],voice=voices[row['voice']],speed=data['speed']) if r.audio is not None]
   if not chunks:raise RuntimeError('Empty audio '+row['text'])
   audio=np.concatenate(chunks);sf.write(wav,audio,sr,subtype='PCM_16')
  if len(audio)<sr*.1 or not np.isfinite(audio).all() or np.max(np.abs(audio))<.001:raise RuntimeError('Invalid audio '+row['text'])
  start=cursor/sr;pieces.extend([audio,np.zeros(round(.65*sr),dtype=np.float32)]);cursor+=len(audio)+round(.65*sr)
  entries.append([row['text'],round(start,5),round(start+len(audio)/sr,5),row['voice']])
 wav=cache/f'pack-{packidx:02}.wav';sf.write(wav,np.concatenate(pieces),sr,subtype='PCM_16');target=out/f'pack-{packidx:02}.mp3'
 subprocess.run(['/opt/homebrew/bin/ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-af','loudnorm=I=-18:TP=-1.5:LRA=7','-ar',str(sr),'-ac','1','-b:a','64k',str(target)],check=True)
 manifest['packs'].append({'file':target.name,'entries':entries})
 evidence.append({'file':target.name,'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'duration':cursor/sr,'entries':len(entries)})
 print('pack',packidx,'utterances',offset+len(entries),'/',len(data['rows']),flush=True)
(root/'src/data/pronunciationAudioManifest.json').write_text(json.dumps(manifest,ensure_ascii=False,separators=(',',':'))+'\n')
(root/'src/data/pronunciationAudioIntegrity.json').write_text(json.dumps({'model':data['model'],'manifestSha256':hashlib.sha256((root/'src/data/pronunciationAudioManifest.json').read_bytes()).hexdigest(),'utterances':len(data['rows']),'packs':evidence},indent=2)+'\n')
(root/'output/verification/pronunciation-render.json').write_text(json.dumps({'model':data['model'],'device':device,'inputSha256':hashlib.sha256((root/'output/verification/pronunciation-input.json').read_bytes()).hexdigest(),'utterances':len(data['rows']),'packs':evidence},indent=2)+'\n')
(out/'NOTICE.txt').write_text('Original ENG_MASTER vocabulary/workplace content. Synthetic English audio generated locally with hexgrad/Kokoro-82M (Apache-2.0), voices am_michael, af_heart, bf_emma. https://huggingface.co/hexgrad/Kokoro-82M\n')
print('complete',len(data['rows']),flush=True)
