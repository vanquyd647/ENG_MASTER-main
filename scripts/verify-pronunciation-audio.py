"""Verify actual packed MP3 decoding, hashes, cue bounds and silence separation."""
import json,hashlib,subprocess
from pathlib import Path
import numpy as np
root=Path.cwd();manifest=json.loads((root/'src/data/pronunciationAudioManifest.json').read_text());render=json.loads((root/'output/verification/pronunciation-render.json').read_text());checks=[]
for pack,proof in zip(manifest['packs'],render['packs'],strict=True):
 file=root/'public/learning/pronunciation-v1'/pack['file'];raw=file.read_bytes()
 assert hashlib.sha256(raw).hexdigest()==proof['sha256']
 pcm=np.frombuffer(subprocess.check_output(['/opt/homebrew/bin/ffmpeg','-v','error','-i',str(file),'-f','f32le','-ac','1','-ar','24000','-']),dtype=np.float32)
 assert np.isfinite(pcm).all() and abs(len(pcm)/24000-proof['duration'])<.15
 previous=0
 for text,start,end,voice in pack['entries']:
  assert start>=previous and end>start and end<=len(pcm)/24000
  segment=pcm[round(start*24000):round(end*24000)]
  assert len(segment)>2400 and np.max(np.abs(segment))>.001
  if previous:assert start-previous>=.64
  previous=end
 checks.append({'file':pack['file'],'sha256':proof['sha256'],'entries':len(pack['entries']),'decoded':True,'duration':len(pcm)/24000})
report={'checkedAt':__import__('datetime').datetime.now(__import__('datetime').timezone.utc).isoformat(),'passed':len(checks)==len(render['packs']) and sum(c['entries'] for c in checks)==1592,'utterances':sum(c['entries'] for c in checks),'files':len(checks),'totalBytes':sum(c['bytes'] for c in render['packs']),'checks':checks,'scope':'Actual decode, signal, hashes and cue boundaries; not human certification of every word pronunciation'}
assert report['passed'];(root/'output/verification/pronunciation-audio-verification.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k!='checks'}))
