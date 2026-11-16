"""Local inference only. Reuses installed Kokoro; writes only workspace/tmp assets."""
import hashlib, json, os, subprocess
from pathlib import Path
os.environ.setdefault('HF_HUB_OFFLINE','1')
os.environ.setdefault('HF_HOME','/private/tmp/eng-master-kokoro/hf')
import numpy as np
import soundfile as sf
import torch
from kokoro import KModel,KPipeline

root=Path.cwd(); cache=Path('/private/tmp/eng-master-kokoro/segments');cache.mkdir(parents=True,exist_ok=True)
assets=Path('/Users/macm5/Quy_code/TTS-text_to_speech/data/models/kokoro')
device='mps' if torch.backends.mps.is_available() else 'cpu'
model=KModel(config=str(assets/'config.json'),model='/private/tmp/eng-master-kokoro/kokoro-v1_0.pth').to(device).eval()
torch.set_num_threads(4)
pipelines={lang:KPipeline(lang_code=lang,model=model) for lang in ['a','b']}
voices={name:torch.load(assets/'voices'/f'{name}.pt',weights_only=True,map_location='cpu') for name in ['am_michael','af_heart','bf_emma']}
data=json.loads((root/'output/verification/listening-audio-input.json').read_text());rate=data['sampleRate']
out=root/'public/learning/audio-v1';out.mkdir(parents=True,exist_ok=True)
manifest={'version':1,'model':data['model'],'license':'Apache-2.0','generatedLocally':True,'sampleRate':rate,'clips':{},'exam':None}
clips={}
def render(text,voice):
 key=hashlib.sha256((voice+'|'+str(data['speed'])+'|'+text).encode()).hexdigest();file=cache/(key+'.wav')
 if file.exists():return sf.read(file,dtype='float32')[0]
 chunks=[r.audio.detach().cpu().numpy() for r in pipelines['b' if voice.startswith('b') else 'a'](text,voice=voices[voice],speed=data['speed']) if r.audio is not None]
 if not chunks:raise RuntimeError('Empty audio '+text)
 audio=np.concatenate(chunks);sf.write(file,audio,rate,subtype='PCM_16');return audio
def mp3(audio,name):
 file=cache/(name+'.wav');sf.write(file,audio,rate,subtype='PCM_16');target=out/(name+'.mp3')
 subprocess.run(['/opt/homebrew/bin/ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(file),'-af','loudnorm=I=-18:TP=-1.5:LRA=7','-ar',str(rate),'-ac','1','-b:a','64k',str(target)],check=True)
 return {'src':'/learning/audio-v1/'+target.name,'duration':len(audio)/rate,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'bytes':target.stat().st_size}
for row in data['rows']:
 pieces=[]
 for seg in row['segments']:pieces.extend([render(seg['text'],seg['voice']),np.zeros(round(seg['pause']*rate),dtype=np.float32)])
 audio=np.concatenate(pieces);clips[row['id']]=audio
 manifest['clips'][row['id']]={**mp3(audio,row['id']),'sourceSha256':hashlib.sha256(json.dumps(row,ensure_ascii=False,sort_keys=True).encode()).hexdigest(),'questionIds':row['questionIds']}
 print('rendered',row['id'],round(len(audio)/rate,2),flush=True)
 (root/'output/verification/listening-audio-progress.json').write_text(json.dumps(manifest,indent=2)+'\n')
intro=render('This is an ENG MASTER practice test, using synthetic English voices. Listen to each recording and select the best answer. The listening section lasts forty five minutes. The recording continues while you answer. Begin with Part one.','am_michael')
announcements={};number=1
for id in data['examIds']:
 count=len(manifest['clips'][id]['questionIds'])
 text=f'Question {number}.' if count==1 else f'Questions {number} through {number+count-1}.'
 announcements[id]=(text,render(text,'am_michael'));number+=count
duration=sum(len(clips[id])+len(announcements[id][1]) for id in data['examIds'])+len(intro)
remaining=data['examSeconds']*rate-duration
if remaining<0:raise RuntimeError('Audio exceeds 45 minutes')
# Fixed pauses proportional to question count, without changing voice speed or truncating speech.
pieces=[intro];cues=[];cursor=len(intro);weights=sum(len(manifest['clips'][id]['questionIds']) for id in data['examIds'])
for i,id in enumerate(data['examIds']):
 text,label=announcements[id];audio=np.concatenate([label,clips[id]])
 pause=round(remaining*len(manifest['clips'][id]['questionIds'])/weights) if i<len(data['examIds'])-1 else data['examSeconds']*rate-cursor-len(audio)
 cues.append({'id':id,'start':cursor/rate,'end':(cursor+len(audio)+pause)/rate,'questionIds':manifest['clips'][id]['questionIds'],'announcement':text})
 pieces.extend([audio,np.zeros(pause,dtype=np.float32)]);cursor+=len(audio)+pause
exam=np.concatenate(pieces)
assert len(exam)==data['examSeconds']*rate
manifest['exam']={**mp3(exam,'exam-200-v1-listening'),'cues':cues,'seconds':data['examSeconds'],'questionIds':[q for c in cues for q in c['questionIds']]}
(root/'output/verification/listening-audio-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
(root/'src/data/listeningAudioManifest.json').write_text(json.dumps(manifest,ensure_ascii=False,separators=(',',':'))+'\n')
(out/'NOTICE.txt').write_text('ENG_MASTER original learning scripts. Synthetic English voices generated locally with hexgrad/Kokoro-82M (Apache-2.0). Voices am_michael, af_heart and bf_emma. Not official ETS recordings. https://huggingface.co/hexgrad/Kokoro-82M\n')
print('complete',len(manifest['clips']),len(exam)/rate,flush=True)
