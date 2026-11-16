"""Resolve grouped-ASR early stops by transcribing each known utterance from actual MP3."""
import hashlib,json,os,subprocess
from pathlib import Path
os.environ['HF_HOME']='/private/tmp/eng-master-asr';os.environ['HF_HUB_OFFLINE']='1'
import numpy as np,soundfile as sf,torch
from transformers import pipeline
from transformers.models.whisper.english_normalizer import EnglishTextNormalizer
from difflib import SequenceMatcher
torch.set_num_threads(4)
root=Path.cwd();data=json.loads((root/'output/verification/listening-audio-input.json').read_text());manifest=json.loads((root/'output/verification/listening-audio-manifest.json').read_text());grouped=json.loads((root/'output/verification/listening-audio-asr.json').read_text())
all_segments=os.environ.get('AUDIO_REVIEW_ALL')=='1'
asr=pipeline('automatic-speech-recognition',model='openai/whisper-base.en' if all_segments else 'openai/whisper-tiny.en',device='mps' if torch.backends.mps.is_available() else -1);normalizer=EnglishTextNormalizer({})
def norm(text):
 text=normalizer(text.replace('’',"'"))
 return text.replace('option be','option b').replace('option bee','option b').replace('option see','option c').replace('option sea','option c')
output=root/os.environ.get('AUDIO_REVIEW_OUTPUT','output/verification/listening-audio-utterance-v3.json' if all_segments else 'output/verification/listening-audio-segment-review.json')
report={'method':'Segment-wise ASR of actual MP3 using source-mapped utterance timing; preserves grouped ASR disagreements','prior':'output/verification/listening-audio-asr.json','inputSha256':hashlib.sha256((root/'output/verification/listening-audio-input.json').read_bytes()).hexdigest(),'items':[],'passed':False}
for old in grouped['items']:
 if not all_segments and not old['flagged']:report['items'].append({**old,'disposition':'grouped-ASR-matched'});continue
 row=next(x for x in data['rows'] if x['id']==old['id']);file=root/('public'+manifest['clips'][row['id']]['src']);offset=0;segments=[]
 for seg in row['segments']:
  key=hashlib.sha256((seg['voice']+'|'+str(data['speed'])+'|'+seg['text']).encode()).hexdigest();duration=sf.info('/private/tmp/eng-master-kokoro/segments/'+key+'.wav').duration
  pcm=np.frombuffer(subprocess.check_output(['/opt/homebrew/bin/ffmpeg','-v','error','-ss',str(offset),'-t',str(duration+.06),'-i',str(file),'-f','f32le','-ac','1','-ar','16000','-']),dtype=np.float32).copy()
  transcript=asr({'array':pcm,'sampling_rate':16000})['text'];a,b=norm(seg['text']),norm(transcript)
  similarity=SequenceMatcher(None,a.split(),b.split()).ratio();segments.append({'source':seg['text'],'transcript':transcript,'similarity':similarity,'flagged':similarity<.85});offset+=duration+seg['pause']
 item={**old,'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'expected':' '.join(s['text'] for s in row['segments']),'transcript':' '.join(s['transcript'] for s in segments),'duration':manifest['clips'][row['id']]['duration'],'disposition':'segment-ASR-reviewed','segments':segments,'segmentFlags':sum(s['flagged'] for s in segments)};report['items'].append(item)
 print(row['id'],item['segmentFlags'],flush=True)
 output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
report['flagged']=[x['id'] for x in report['items'] if x.get('segmentFlags',0)];report['humanListeningCertified']=False;report['reviewRequired']=True
output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
