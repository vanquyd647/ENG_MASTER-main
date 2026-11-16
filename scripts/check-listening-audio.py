"""Local ASR and signal checks; ASR disagreement is reviewed, never hidden."""
import hashlib,json,os,re,subprocess
from pathlib import Path
os.environ['HF_HOME']='/private/tmp/eng-master-asr'
os.environ['HF_HUB_OFFLINE']='1'
import numpy as np
import torch
from transformers import pipeline
from transformers.models.whisper.english_normalizer import EnglishTextNormalizer
torch.set_num_threads(4)
root=Path.cwd();data=json.loads((root/'output/verification/listening-audio-input.json').read_text());manifest=json.loads((root/'output/verification/listening-audio-manifest.json').read_text())
asr=pipeline('automatic-speech-recognition',model='openai/whisper-tiny.en',device='mps' if torch.backends.mps.is_available() else -1)
normalize=EnglishTextNormalizer({})
def words(text):return normalize(text).split()
def distance(a,b):
 row=list(range(len(b)+1))
 for i,x in enumerate(a,1):
  prev=row;row=[i]+[0]*len(b)
  for j,y in enumerate(b,1):row[j]=min(row[j-1]+1,prev[j]+1,prev[j-1]+(x!=y))
 return row[-1]
report={'model':'openai/whisper-tiny.en','method':'Local ASR comparison plus ffmpeg signal inspection; not a human listening certificate','denominator':len(data['rows']),'items':[],'passed':False}
target=root/'output/verification/listening-audio-asr.json'
for row in data['rows']:
 file=root/('public'+manifest['clips'][row['id']]['src'])
 expected=' '.join(s['text'] for s in row['segments'])
 decoded=asr(str(file),chunk_length_s=25)['text']
 a,b=words(expected),words(decoded);wer=distance(a,b)/max(1,len(a))
 probe=json.loads(subprocess.check_output(['/opt/homebrew/bin/ffprobe','-v','error','-show_entries','format=duration:stream=sample_rate,channels','-of','json',str(file)]))
 pcm=np.frombuffer(subprocess.check_output(['/opt/homebrew/bin/ffmpeg','-v','error','-i',str(file),'-f','f32le','-ac','1','-ar','16000','-']),dtype=np.float32)
 item={'id':row['id'],'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'expected':expected,'transcript':decoded,'wordErrorRate':wer,'expectedWords':len(a),'sampleRate':probe['streams'][0]['sample_rate'],'channels':probe['streams'][0]['channels'],'duration':float(probe['format']['duration']),'peak':float(np.max(np.abs(pcm))),'rms':float(np.sqrt(np.mean(pcm**2))),'flagged':bool(wer>.12 or np.max(np.abs(pcm))>=.99 or np.sqrt(np.mean(pcm**2))<.005)}
 report['items'].append(item);target.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(row['id'],round(wer,3),item['flagged'],flush=True)
report['flagged']=[i['id'] for i in report['items'] if i['flagged']];report['reviewRequired']=True;target.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
