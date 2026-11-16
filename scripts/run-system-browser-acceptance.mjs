// Sequential browser suites: separate sessions, synthetic accounts, immutable run folder.
import fs from'node:fs';import{spawnSync}from'node:child_process';import{createHash}from'node:crypto';
import{releaseFingerprint}from'./lib/releaseFingerprint.mjs';
const origin=process.argv[2]||'http://localhost:3121',folder=process.argv[3];if(!folder||fs.existsSync(folder))throw Error('Specify fresh evidence directory');
fs.mkdirSync(folder,{recursive:true});const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const plan='scripts/fixtures/system-acceptance-v1.json',pack=JSON.parse(fs.readFileSync('dist/offline-pack.json','utf8'));
const report={startedAt:new Date().toISOString(),origin,planSha256:hash(plan),offlineRevision:pack.revision,serverBundleSha256:hash('build/server.cjs'),releaseInputsSha256:releaseFingerprint(),checks:[],passed:false};
fs.copyFileSync(plan,folder+'/plan.json');
const suites=[['scripts/browser-full-exam.mjs','exam200-browser.json'],['scripts/browser-listening-pilot.mjs','listening-v1-browser.json'],['scripts/browser-learning-content.mjs','browser-learning-content.json'],['scripts/browser-ai-layout.mjs','browser-ai-layout.json'],['scripts/browser-cloud-acceptance.mjs','browser-cloud-acceptance.json'],['scripts/browser-guest-merge.mjs','browser-guest-merge.json'],['scripts/browser-dataset-acceptance.mjs','browser-dataset-acceptance.json'],['scripts/browser-pwa-update.mjs','browser-pwa-update.json']];
for(const [script,file]of suites){
 const result=spawnSync(process.execPath,['--import','tsx',script,...(script.includes('pwa-update')?[]:[origin])],{encoding:'utf8',maxBuffer:8e6});
 fs.writeFileSync(folder+'/'+file+'.log',result.stdout+result.stderr);
 const p='output/verification/'+file;let evidence;try{evidence=JSON.parse(fs.readFileSync(p));fs.copyFileSync(p,folder+'/'+file);}catch{}
 const row={script,scriptSha256:hash(script),file,exitCode:result.status,passed:result.status===0&&evidence?.passed===true,checks:evidence?.checks?.length||0,artifactSha256:evidence?hash(p):null};report.checks.push(row);fs.writeFileSync(folder+'/run.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(row));
 if(!row.passed){process.exitCode=1;break;}
}
report.finishedAt=new Date().toISOString();report.passed=report.checks.length===suites.length&&report.checks.every(x=>x.passed)&&pack.revision===JSON.parse(fs.readFileSync('dist/offline-pack.json','utf8')).revision&&report.serverBundleSha256===hash('build/server.cjs');fs.writeFileSync(folder+'/run.json',JSON.stringify(report,null,2)+'\n');
