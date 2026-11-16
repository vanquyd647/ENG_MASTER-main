// Verify the built artifact without printing credentials.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { parse } from 'dotenv';

const baseline = {
  'src/data/workplacePractice.ts': 'e389a541dcdaca6ce75ab4889162f630e7dfb126d06a94848a36ad2dd2eb3bb0',
  'src/data/vocabulary.ts': 'a3d6a89214fa682552664dfedb6644ef984de9aed5c215bb8b072c7127f80598',
  'src/data/toeic-pdf.ts': 'f3f6db312ce9fdcc1bc52e887a30ab76df51a3bbd8adcc303e46f9efa314bb2b',
  'new/vocabulary-reviewed.json': '32a0060b1c67c8b85db3f0c2e6af02c1e71a794c860167764102897950e6afac',
};
const hashes = Object.fromEntries(Object.keys(baseline).map(file => [file, crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')]));
if (Object.entries(baseline).some(([file, hash]) => hashes[file] !== hash)) throw Error('Reviewed catalog changed');
const html = fs.readFileSync('dist/index.html', 'utf8');
if (fs.readdirSync('dist').some(file => file.startsWith('server.'))) throw Error('Server bundle is in the public output directory');
const urls = [...new Set([...html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)].map(match => match[1]))];
const files = urls.map(url => { const data=fs.readFileSync(path.join('dist', url)); return { url, bytes:data.length, gzip:zlib.gzipSync(data).length }; });
const initialReferencedGzip = files.reduce((sum, file) => sum + file.gzip, 0);
if (initialReferencedGzip >= 420_000) throw Error('Initial referenced gzip exceeds release budget');
const chartsReferenced = urls.some(url=>/StatsView|charts/i.test(url));
if (chartsReferenced) throw Error('Stats chunk is eagerly referenced');
const offlinePack=JSON.parse(fs.readFileSync('dist/offline-pack.json','utf8'));
if (offlinePack.files.some(file=>file.startsWith('/api/') || file.startsWith('/server.'))) throw Error('Server resources included in offline pack');
for(const file of offlinePack.files) if(!fs.existsSync(path.join('dist',file))) throw Error('Offline pack references a missing asset');
const audioManifest=JSON.parse(fs.readFileSync('src/data/listeningAudioManifest.json','utf8'));
const bundledAudio=[...Object.values(audioManifest.clips),audioManifest.exam];
for(const audio of bundledAudio){
  const bytes=fs.readFileSync(path.join('dist',audio.src));
  if(bytes.length!==audio.bytes||crypto.createHash('sha256').update(bytes).digest('hex')!==audio.sha256)throw Error('Stale or incomplete bundled audio: '+audio.src);
  if(!offlinePack.files.includes(audio.src))throw Error('Bundled audio omitted from offline pack: '+audio.src);
}
const environment = { ...(fs.existsSync('.env.local') ? parse(fs.readFileSync('.env.local')) : {}), ...process.env };
const secretParts = [environment.GEMINI_API_KEY, environment.VERCEL_OIDC_TOKEN, ...(environment.FIREBASE_PRIVATE_KEY || '').replaceAll('\\n','\n').split('\n').filter(line=>line.length>60)].filter(Boolean);
const assets = fs.readdirSync('dist/assets').filter(file=>/\.(js|css)$/.test(file)).map(file=>fs.readFileSync('dist/assets/'+file,'utf8'));
if(secretParts.some(secret=>assets.some(asset=>asset.includes(secret)))) throw Error('Server credential found in frontend');
const report={checkedAt:new Date().toISOString(),initialReferencedGzip,chartsReferenced,serverSecretsAbsent:true,secretCheck:secretParts.length?'local configured credentials':'no configured credentials available',catalogUnchanged:true,hashes,files,offlinePack,bundledAudioVerified:bundledAudio.length};
fs.mkdirSync('output/verification',{recursive:true});
fs.writeFileSync('output/verification/build-metrics.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({initialReferencedGzip,catalogUnchanged:true,offlineAssets:offlinePack.files.length,serverSecretsAbsent:true}));
