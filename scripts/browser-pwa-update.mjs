// Exercise the production PWA update UI on an isolated local origin.
// The fixture changes the worker cache revision; frontend files remain the built release.
// PLAYWRIGHT_CLI=/path/to/playwright-cli node scripts/browser-pwa-update.mjs
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs';
import path from 'node:path';

const fixture = `
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=process.env.PWA_FIXTURE_ROOT;let version=1;
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png'};
process.on('message',message=>{if(message==='next'){version++;process.send({version});}});
http.createServer((req,res)=>{const pathname=new URL(req.url,'http://localhost').pathname;const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}let body=fs.readFileSync(file);if(pathname==='/sw.js')body=Buffer.from(body.toString().replace(/const CACHE_NAME=([^;]+);/,'const CACHE_NAME=$1+"-qa-'+version+'";'));res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.setHeader('Cache-Control','no-cache');res.end(body);}).listen(0,'127.0.0.1',function(){process.send({port:this.address().port});});
`;
const server=spawn(process.execPath,['-e',fixture],{env:{...process.env,PWA_FIXTURE_ROOT:path.resolve('dist')},stdio:['ignore','ignore','pipe','ipc']});
const cli=process.env.PLAYWRIGHT_CLI || 'playwright-cli';
const session='pwa-update-'+Date.now();
const call=(...args)=>{const result=spawnSync(cli,['-s='+session,...args],{encoding:'utf8',maxBuffer:2e6});if(result.status!==0 || result.stdout.includes('### Error'))throw Error(result.stdout+result.stderr);return result.stdout;};
let opened=false;
const report={checkedAt:new Date().toISOString(),fixture:'production assets with controlled worker revision update on isolated localhost origin',checks:[],passed:false};
try {
  const [ready]=await once(server,'message');
  call('open',`http://127.0.0.1:${ready.port}`);opened=true;
  call('run-code',`async(page)=>{page.on('dialog',dialog=>dialog.accept().catch(()=>{}));await page.getByRole('button',{name:'Tiếp tục với tư cách Khách'}).click();await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'Bắt đầu',exact:true}).click();await page.waitForFunction(()=>document.documentElement.dataset.offlineReady==='true');await page.evaluate(()=>localStorage.setItem('app_sound','false'));await page.getByRole('button',{name:'Học từ mới (15)'}).click();await page.getByRole('button',{name:'Mặt trước thẻ từ. Nhấn để xem nghĩa'}).click();await page.getByRole('button',{name:'Tốt',exact:true}).click();await page.getByRole('heading',{name:'applicant',exact:true}).waitFor();return {draftBefore:'applicant'};}`);
  call('run-code',`async page=>{await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));if(await page.getByRole('button',{name:'Cập nhật',exact:true}).count())throw Error('Initial install advertised a false update');return {initialInstall:true};}`);
  report.checks.push('initial installation does not advertise a false update');
  const changed=once(server,'message');server.send('next');await changed;
  call('run-code',`async(page)=>{await page.evaluate(async()=>{const registration=await navigator.serviceWorker.getRegistration();await registration.update();});await page.getByRole('button',{name:'Cập nhật',exact:true}).waitFor();await page.screenshot({path:'output/playwright/acceptance-pwa-update-notice.png',fullPage:true});await page.getByRole('button',{name:'Cập nhật',exact:true}).click();}`);
  call('snapshot');
  const output=call('run-code',`async(page)=>{await page.waitForFunction(()=>document.documentElement.dataset.reloadApproved!=='true');await page.getByRole('heading',{name:'applicant',exact:true}).waitFor();await page.waitForFunction(()=>document.documentElement.dataset.offlineReady==='true');const evidence=await page.evaluate(async()=>{const db=await new Promise(resolve=>{const request=indexedDB.open('eng-master-local-v1');request.onsuccess=()=>resolve(request.result);});const read=store=>new Promise(resolve=>{const request=db.transaction(store).objectStore(store).get(store==='states'?'guest':'guest:review-new');request.onsuccess=()=>resolve(request.result);});const [state,record]=await Promise.all([read('states'),read('drafts')]);db.close();return {repetitions:state.progress['rec-01']?.repetitions,cursor:record?.draft.cursor,completed:record?.draft.completedIds.length};});if(evidence.repetitions!==1||evidence.cursor!==1||evidence.completed!==1)throw Error('Update lost draft/progress');await page.screenshot({path:'output/playwright/acceptance-pwa-update-preserved.png',fullPage:true});await page.context().setOffline(true);await page.evaluate(()=>document.documentElement.dataset.reloadApproved='true');await page.reload();await page.getByRole('heading',{name:'applicant',exact:true}).waitFor();return {updateConfirmed:true,draftPreserved:true,offlineAfterUpdate:true,...evidence};}`);
  const result=output.match(/### Result\n([\s\S]*?)\n###/);
  if(!result)throw Error('Missing PWA verification result');
  Object.assign(report,JSON.parse(result[1]));report.checks.push('confirmed update preserves saved study draft, progress and offline reload');
  call('run-code',`async page=>{await page.context().setOffline(false);return {online:true};}`);
  const next=once(server,'message');server.send('next');await next;
  const staleOutput=call('run-code',`async page=>{
    await page.evaluate(async()=>{await (await navigator.serviceWorker.getRegistration()).update();});
    await page.getByRole('button',{name:'Cập nhật',exact:true}).waitFor();
    page.removeAllListeners('dialog');page.on('dialog',dialog=>dialog.dismiss().catch(()=>{}));
    await page.evaluate(()=>document.documentElement.dataset.pwaProbe='before-cancel');
    await page.getByRole('button',{name:'Cập nhật',exact:true}).click();
    if(await page.evaluate(()=>document.documentElement.dataset.pwaProbe!=='before-cancel'||document.documentElement.dataset.reloadApproved==='true'))throw Error('Cancel approved a reload');
    await page.getByRole('button',{name:'Để sau',exact:true}).click();
    if(await page.getByRole('button',{name:'Cập nhật',exact:true}).count())throw Error('Deferral did not hide notice');
    await page.evaluate(async()=>window.dispatchEvent(new CustomEvent('eng-master-update',{detail:await navigator.serviceWorker.getRegistration()})));
    await page.getByRole('button',{name:'Cập nhật',exact:true}).waitFor();
    await page.evaluate(async()=>{const registration=await navigator.serviceWorker.getRegistration(),worker=registration.waiting;if(!worker)throw Error('Missing waiting worker for fixture');await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('Fixture activation timed out')),10000);worker.addEventListener('statechange',()=>{if(worker.state==='activated'){clearTimeout(timeout);resolve();}});worker.postMessage({type:'SKIP_WAITING'});});});
    const stale=await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();return {waiting:r.waiting===null,active:r.active?.state,controller:navigator.serviceWorker.controller?.state};});
    if(!stale.waiting||stale.active!=='activated')throw Error('Failed to create stale update notice');
    await page.screenshot({path:'output/playwright/pwa-stale-update-notice.png',fullPage:true});
    page.removeAllListeners('dialog');page.on('dialog',dialog=>dialog.accept().catch(()=>{}));
    await page.getByRole('button',{name:'Cập nhật',exact:true}).click();return stale;
  }`);
  const staleResult=staleOutput.match(/### Result\s*\n([\s\S]*?)(?:\n###|$)/);if(!staleResult)throw Error('Missing stale-worker evidence');report.staleWorker=JSON.parse(staleResult[1]);
  report.checks.push('cancel and defer keep the current study session');
  call('run-code',`async page=>{await page.waitForFunction(()=>document.documentElement.dataset.pwaProbe!=='before-cancel',null,{timeout:8000});await page.getByRole('heading',{name:'applicant',exact:true}).waitFor();await page.waitForFunction(()=>document.documentElement.dataset.offlineReady==='true');if(await page.getByRole('button',{name:'Cập nhật',exact:true}).count())throw Error('Stale notice remained after reload');await page.screenshot({path:'output/playwright/pwa-stale-update-fixed.png',fullPage:true});return {staleNoticeReloaded:true,draftPreserved:true};}`);
  report.checks.push('already activated worker: OK still reloads once, removes notice and resumes draft');report.passed=true;
  console.log(JSON.stringify(report));
} finally {
  try{if(opened)call('close');}finally{server.kill();fs.mkdirSync('output/verification',{recursive:true});fs.writeFileSync('output/verification/browser-pwa-update.json',JSON.stringify(report,null,2)+'\n');}
}
