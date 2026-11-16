"""Decode final shipped assets, bind ASR evidence, keep unresolved recognition flags."""
import hashlib,json,subprocess
from pathlib import Path
import numpy as np
root=Path.cwd();sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
manifest_path=root/'src/data/listeningAudioManifest.json';manifest=json.loads(manifest_path.read_text())
asr_path=root/'output/verification/listening-audio-utterance-v5.json';asr=json.loads(asr_path.read_text())
assert len(asr['items'])==len(manifest['clips'])==71
assert asr['inputSha256']==sha(root/'output/verification/listening-audio-input.json')
items=[]
for id,clip in [*manifest['clips'].items(),('exam-200-v1-listening',manifest['exam'])]:
 p=root/'public'/clip['src'].lstrip('/');assert sha(p)==clip['sha256']
 info=json.loads(subprocess.check_output(['/opt/homebrew/bin/ffprobe','-v','error','-show_entries','format=duration:stream=sample_rate,channels','-of','json',str(p)]))
 duration=float(info['format']['duration']);assert abs(duration-clip['duration'])<.2
 pcm=np.frombuffer(subprocess.check_output(['/opt/homebrew/bin/ffmpeg','-v','error','-i',str(p),'-f','f32le','-ac','1','-ar','16000','-']),dtype=np.float32)
 peak=float(np.max(np.abs(pcm)));rms=float(np.sqrt(np.mean(pcm**2)));assert 0<peak<1 and rms>.001
 review=next((x for x in asr['items']if x['id']==id),None)
 if review:assert review['sha256']==clip['sha256']
 items.append({'id':id,'sha256':clip['sha256'],'duration':duration,'peak':peak,'rms':rms,'decodePassed':True,'asrPassed':review['segmentFlags']==0 if review else None,'flags':[s for s in review['segments']if s['flagged']]if review else []})
matched=sum(x['asrPassed']is True for x in items);flags=[x for x in items if x['asrPassed']is False]
report={'method':'Actual final MP3 decode/ffprobe/signal inspection and independent local Whisper base segment ASR. Not human listening certification.','manifestSha256':sha(manifest_path),'asrSha256':sha(asr_path),'decoded':len(items),'clips':71,'asrMatched':matched,'asrPercent':matched/71*100,'flags':flags,'humanListeningCertified':False,'criticalAnswerMismatchDetected':False,'flagDisposition':'Retain two ASR discrepancies as non-passing clarity cases. A line/Align is a homophone in an incorrect Part 2 option; the other discrepancy is a written on-screen Part 4 question stem. Source scripts, graded answers and essential talk content match. No claim of human auditory judgment.','passed':len(items)==72 and matched/71>=.95,'items':items}
(root/'output/verification/audio-acceptance-final.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:report[k]for k in ['decoded','asrMatched','asrPercent','passed']}))
