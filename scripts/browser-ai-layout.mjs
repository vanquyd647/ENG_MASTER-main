// Layout acceptance only: real temporary Firebase identity, deterministic AI HTTP
// fixtures. Does not call Gemini or treat fixture prose as a model/content check.
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import { parse } from 'dotenv';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { initializeApp as initializeAdmin, deleteApp as deleteAdmin, cert } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import reviewed from '../new/vocabulary-reviewed.json' with {type:'json'};
const origin=process.argv[2]||'http://localhost:3110';
if(!['localhost','127.0.0.1','eng-master-main2.vercel.app'].includes(new URL(origin).hostname))throw Error('Unapproved QA origin');
const env=parse(fs.readFileSync('.env.local','utf8'));if(env.FIREBASE_PROJECT_ID!=='engai-2c7fe')throw Error('Wrong project');
const admin=initializeAdmin({credential:cert({projectId:env.FIREBASE_PROJECT_ID,clientEmail:env.FIREBASE_CLIENT_EMAIL,privateKey:env.FIREBASE_PRIVATE_KEY.replaceAll('\\n','\n')}),projectId:env.FIREBASE_PROJECT_ID},'ai-layout-admin');
const adminAuth=getAdminAuth(admin),db=getFirestore(admin);
const client=initializeApp({apiKey:env.VITE_FIREBASE_API_KEY,projectId:env.VITE_FIREBASE_PROJECT_ID,authDomain:env.VITE_FIREBASE_AUTH_DOMAIN},'ai-layout-client');
const uid='qa_ai_layout_'+randomUUID().replaceAll('-',''),nonce=randomUUID(),session='ai-layout-'+Date.now(),fixture=path.resolve('.secrets/ai-layout-'+nonce+'.json');
const cli=process.env.PLAYWRIGHT_CLI||'playwright-cli';
const report={checkedAt:new Date().toISOString(),origin,fixture:'deterministic legacy Markdown and structured HTTP responses; real temporary Firebase identity; no Gemini requests',checks:[],passed:false,cleanup:false};
const call=(...args)=>{const r=spawnSync(cli,['-s='+session,...args],{encoding:'utf8',maxBuffer:3e6});if(r.status||r.stdout.includes('### Error'))throw Error(r.stdout+r.stderr);return r.stdout;};
const step=(name,source)=>{call('snapshot');const output=call('run-code',`async page=>{try{return await (${source})(page);}catch(error){await page.screenshot({path:'output/playwright/ai-layout-failure.png',fullPage:true});throw error;}}`);const m=output.match(/### Result\s*\n([\s\S]*?)(?:\n###|$)/);if(!m){fs.writeFileSync('output/verification/ai-layout-step-output.log',output);throw Error('No browser result');}report.checks.push({name,result:JSON.parse(m[1])});};
const review=`Cùng phân tích từng từ để hiểu lỗi đã làm và chọn bài ôn phù hợp.

### 1. calculation
**Nghĩa đúng:** sự tính toán, phép tính
**Đáp án của em:** thư từ, quan hệ thư từ (nhầm với từ *correspondence*).
**Giải thích:** **Calculation** xuất phát từ động từ *calculate* (tính toán), không liên quan đến việc viết thư hay liên lạc.
**Câu đúng (Song ngữ):**
*The financial **calculation** was checked twice before submission.*
Phép tính tài chính đã được kiểm tra hai lần trước khi nộp.
**Bài ôn ngắn:**
*Question:* The accountant made a small error in her __________.
A. calculation
B. correspondence
**Đáp án:** A (calculation)

---

### 2. dependence
**Nghĩa đúng:** sự phụ thuộc
**Đáp án của em:** sự độc lập
**Giải thích:** Phân biệt **dependence** và **independence**. Tiền tố *in-* làm thay đổi nghĩa của từ này.
**Ví dụ song ngữ:**
The company reduced its dependence on a single supplier.
Công ty đã giảm sự phụ thuộc vào một nhà cung cấp duy nhất.
**Mẹo ghi nhớ:** Học cả cụm **dependence on** và đối chiếu từ trái nghĩa.`;
const explanation=`## Hiểu nghĩa trong công việc

**Giải thích:** Calculation là danh từ chỉ sự tính toán hoặc kết quả của một phép tính.

### Cụm từ thường gặp

- **accurate calculation** — phép tính chính xác
- **cost calculation** — tính toán chi phí
- **make a calculation** — thực hiện một phép tính

**Ví dụ công việc:**
The calculation includes shipping costs.
Phép tính đã bao gồm chi phí vận chuyển.

**Mẹo tránh nhầm:** Phân biệt danh từ **calculation** với động từ *calculate*.

> Đọc cả cụm từ để chọn đúng nghĩa trong ngữ cảnh.`;
const longExplanation=explanation+'\n\n'+Array.from({length:6},(_,i)=>'### Ôn tập '+(i+1)+'\n\nĐọc lại câu ví dụ, xác định từ loại và đối chiếu nghĩa đang học. Nội dung dài này dùng để kiểm tra vùng cuộn của hộp thoại trên điện thoại.').join('\n\n');
let server,created=false,opened=false;
try{
 await adminAuth.createUser({uid,displayName:'QA AI Layout',email:uid+'@example.invalid'});created=true;
 await db.doc('users/'+uid).create({uid,displayName:'QA AI Layout',email:uid+'@example.invalid',totalWordsLearned:0,studyTimeMinutes:0,streak:0,dailyGoal:15});
 const identity=(await signInWithCustomToken(getAuth(client),await adminAuth.createCustomToken(uid))).user.toJSON();identity.appName='[DEFAULT]';
 fs.mkdirSync('.secrets',{recursive:true,mode:0o700});fs.writeFileSync(fixture,JSON.stringify(identity),{mode:0o600});
 server=spawn(process.execPath,['-e',`const http=require('node:http'),fs=require('node:fs');http.createServer((req,res)=>{if(req.url!==process.env.AI_QA_PATH){res.writeHead(404);res.end();return;}res.setHeader('Content-Type','application/json');res.end(fs.readFileSync(process.env.AI_QA_FILE));}).listen(0,'127.0.0.1',function(){process.send({port:this.address().port});});`],{env:{...process.env,AI_QA_FILE:fixture,AI_QA_PATH:'/'+nonce},stdio:['ignore','ignore','pipe','ipc']});
 const [ready]=await once(server,'message');const fixtureUrl='http://127.0.0.1:'+ready.port+'/'+nonce;
 call('open',origin,'--headed');opened=true;
 step('temporary authenticated browser and intercepted AI fixtures',`async page=>{
  await page.addInitScript(()=>window.confirm=()=>true);await page.evaluate(()=>window.confirm=()=>true);await page.setViewportSize({width:1280,height:1000});
  const user=await(await page.request.get(${JSON.stringify(fixtureUrl)})).json();
  await page.evaluate(async user=>{const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('firebaseLocalStorageDb',1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('firebaseLocalStorage'))r.result.createObjectStore('firebaseLocalStorage',{keyPath:'fbase_key'});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});await new Promise((resolve,reject)=>{const tx=db.transaction('firebaseLocalStorage','readwrite');tx.objectStore('firebaseLocalStorage').put({fbase_key:'firebase:authUser:'+user.apiKey+':[DEFAULT]',value:user});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});db.close();},user);
  let attempts=0;await page.route('**/api/gemini/mistake-review',route=>route.fulfill({status:++attempts===1?503:200,contentType:'application/json',body:JSON.stringify(attempts===1?{error:'QA: AI tạm thời chưa sẵn sàng.',code:'ai_failed'}:{text:${JSON.stringify(review)}})}));
  let explainAttempts=0;await page.route('**/api/gemini/explain',async route=>{const attempt=++explainAttempts;await page.evaluate(()=>document.documentElement.dataset.explanationRequests=String((Number(document.documentElement.dataset.explanationRequests)||0)+1));await new Promise(resolve=>setTimeout(resolve,3000));try{await route.fulfill({status:attempt===1?503:200,contentType:'application/json',body:JSON.stringify(attempt===1?{error:'QA: Chưa tải được giải thích.',code:'ai_failed'}:{text:${JSON.stringify(longExplanation)}})});}catch{/* A closing dialog aborts the intercepted request. */}});
  await page.reload();await page.getByText('QA AI Layout',{exact:true}).waitFor();await page.getByRole('button',{name:'Bắt đầu',exact:true}).click();await page.waitForFunction(()=>document.documentElement.dataset.offlineReady==='true',null,{timeout:120000});await page.evaluate(()=>localStorage.setItem('app_sound','false'));return {auth:true,geminiCalls:0};
 }`);
 step('actual quiz result and separate AI failure/retry feedback',`async page=>{
  await page.getByRole('button',{name:'Kiểm tra',exact:true}).first().click();await page.getByRole('button',{name:'Bắt đầu điền từ trong câu',exact:true}).click();await page.locator('#quiz-answer').fill('qa-wrong');await page.getByRole('button',{name:'Kiểm tra đáp án',exact:true}).click();await page.getByRole('button',{name:'Kết thúc sớm',exact:true}).click();await page.getByRole('heading',{name:'Kết quả bài thi'}).waitFor();
  await page.getByRole('button',{name:'AI giải thích lỗi sai',exact:true}).click();await page.getByRole('alert').filter({hasText:'QA: AI tạm thời'}).waitFor();
  await page.getByRole('button',{name:'AI giải thích lỗi sai',exact:true}).click();await page.getByRole('article',{name:'Phản hồi AI'}).waitFor();if(await page.getByRole('alert').filter({hasText:'QA: AI tạm thời'}).count())throw Error('Stale AI error remained');
  const tones=await page.locator('.ai-response [data-ai-tone]').evaluateAll(nodes=>[...new Set(nodes.map(node=>node.dataset.aiTone))]);if(tones.length!==5)throw Error('Missing semantic colors');
  await page.getByRole('article',{name:'Phản hồi AI'}).screenshot({path:'output/playwright/ai-review-desktop.png'});return {tones,errorSeparate:true,retry:true};
 }`);
 step('review typography, distinct colors and responsive layout',`async page=>{
  const colors=await page.locator('.ai-response [data-ai-tone]').evaluateAll(nodes=>Object.fromEntries(nodes.map(node=>[node.dataset.aiTone,getComputedStyle(node.querySelector('strong')).color])));if(new Set(Object.values(colors)).size!==5)throw Error('Colors are not distinct');
  for(const width of [360,390,768,1280]){await page.setViewportSize({width,height:1000});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Horizontal overflow at '+width);}
  await page.setViewportSize({width:390,height:900});await page.getByRole('article',{name:'Phản hồi AI'}).screenshot({path:'output/playwright/ai-review-mobile.png'});return {widths:[360,390,768,1280],noOverflow:true,colors};
 }`);
 step('library opens a separate dialog; loading, error and retry keep card dimensions',`async page=>{
  await page.setViewportSize({width:1280,height:1000});await page.getByRole('button',{name:'Thư viện',exact:true}).click();await page.getByPlaceholder('Tìm theo từ, nghĩa hoặc chủ đề...').fill('calculation');const button=page.getByRole('button',{name:'Giải thích bằng AI',exact:true}).first();await button.scrollIntoViewIfNeeded();const before=await button.evaluate(el=>({height:el.parentElement.getBoundingClientRect().height,scrollY}));await page.evaluate(value=>document.documentElement.dataset.libraryBefore=JSON.stringify(value),before);await button.click();const dialog=page.getByRole('dialog',{name:'Tìm hiểu thêm: calculation'});await dialog.getByRole('status').waitFor();await dialog.getByRole('alert').waitFor();await dialog.getByRole('button',{name:'Thử lại',exact:true}).click();await dialog.getByRole('article',{name:'Phản hồi AI'}).waitFor();await dialog.getByRole('heading',{name:'Cụm từ thường gặp',exact:true}).waitFor();
  if(await page.locator('article').count()!==await dialog.locator('article').count())throw Error('Explanation still rendered in word card');if(Math.abs((await button.evaluate(el=>el.parentElement.getBoundingClientRect().height))-before.height)>1)throw Error('Library card resized');await dialog.getByRole('button',{name:'Đóng hộp thoại'}).click();await dialog.waitFor({state:'hidden'});if(Math.abs((await page.evaluate(()=>scrollY))-before.scrollY)>1)throw Error('Library scroll position changed');await button.click();await dialog.getByRole('article',{name:'Phản hồi AI'}).waitFor();await dialog.screenshot({path:'output/playwright/library-ai-dialog-desktop.png'});return {separateDialog:true,loading:true,errorRetry:true,cardUnchanged:true,scrollPreserved:true};
 }`);
 step('mobile body scroll keeps close visible; closing preserves filters, focus and cache',`async page=>{
  const dialog=page.getByRole('dialog');await page.setViewportSize({width:390,height:900});const close=dialog.getByRole('button',{name:'Đóng hộp thoại'}),body=dialog.locator(':scope > div').nth(1),before=(await close.boundingBox()).y;
  const scroll=await body.evaluate(el=>{el.scrollTop=el.scrollHeight;return {scrollTop:el.scrollTop,height:el.clientHeight,total:el.scrollHeight};});if(scroll.scrollTop<=0)throw Error('Dialog body did not scroll');if(Math.abs((await close.boundingBox()).y-before)>1)throw Error('Close button scrolled out');if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Dialog overflow');await dialog.screenshot({path:'output/playwright/library-ai-dialog-mobile.png'});
  await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});if(await page.getByPlaceholder('Tìm theo từ, nghĩa hoặc chủ đề...').inputValue()!=='calculation')throw Error('Filter lost');const button=page.getByRole('button',{name:'Giải thích bằng AI',exact:true}).first();if(!await button.evaluate(el=>document.activeElement===el))throw Error('Focus not restored');const requests=await page.evaluate(()=>Number(document.documentElement.dataset.explanationRequests));await button.click();await dialog.getByRole('article',{name:'Phản hồi AI'}).waitFor();if(await page.evaluate(()=>Number(document.documentElement.dataset.explanationRequests))!==requests)throw Error('Cached reopen called AI again');await close.click();await dialog.waitFor({state:'hidden'});return {mobileScroll:true,closeAlwaysVisible:true,filterPreserved:true,focusRestored:true,cachedReopen:true};
 }`);
 step('closing during loading cancels the dialog and ignores late completion',`async page=>{
  await page.getByPlaceholder('Tìm theo từ, nghĩa hoặc chủ đề...').fill('applicant');await page.getByRole('button',{name:'Giải thích bằng AI',exact:true}).first().click();const dialog=page.getByRole('dialog',{name:'Tìm hiểu thêm: applicant'});await dialog.getByRole('status').waitFor();await dialog.getByRole('button',{name:'Đóng hộp thoại'}).click();await dialog.waitFor({state:'hidden'});await page.waitForTimeout(900);if(await page.getByRole('dialog').count())throw Error('Late response reopened dialog');return {closedWhileLoading:true,noLateReopen:true};
 }`);
 step('shared rendering in study modal, mobile scroll and focus',`async page=>{
  await page.getByRole('button',{name:'Tổng quan',exact:true}).click();await page.getByRole('button',{name:/Học từ mới/}).click();await page.getByRole('button',{name:'Mặt trước thẻ từ. Nhấn để xem nghĩa'}).click();await page.getByRole('button',{name:'Giải thích bằng AI',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.getByRole('article',{name:'Phản hồi AI'}).waitFor();await page.setViewportSize({width:390,height:900});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Modal overflow');await dialog.screenshot({path:'output/playwright/ai-explanation-modal-mobile.png'});await page.getByRole('button',{name:'Đóng hộp thoại'}).click();return {modal:true,noOverflow:true};
 }`);

 const qaSource=word=>{const [wordId,w]=Object.entries(reviewed).find(([,w])=>w.word===word);return {kind:'catalog',wordId,word:w.word,meaning:w.meaning,pos:w.pos,topic:word==='applicant'?'Recruitment':'TOEIC bổ sung (PDF)',example:w.example,exampleTranslation:w.exampleTranslation};};
 const sourceById=Object.fromEntries(['calculation','applicant'].map(word=>{const source=qaSource(word);return [source.wordId,source];}));
 step('structured explanation, approved source and follow-up error/retry preserve the base',`async page=>{
  await page.unroute('**/api/gemini/explain');let simplifyAttempts=0;
  const sources=${JSON.stringify(sourceById)};
  await page.route('**/api/gemini/explain',async route=>{
   const request=route.request().postDataJSON(),action=request.action||'explain',source=sources[request.wordId];
   await page.evaluate(action=>document.documentElement.dataset.lastAiAction=action,action);
   if(action==='simplify' && ++simplifyAttempts===1){await route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'QA: Hỏi tiếp đang bận.',code:'ai_unavailable'})});return;}
   const lesson={summary:action==='simplify'?'Hiểu đơn giản: calculation là một phép tính.':'Calculation chỉ việc tính toán hoặc một phép tính.',usage:'Dùng calculation khi nói đến việc xử lý các con số.',collocations:[{phrase:'cost calculation',meaning:'tính toán chi phí'}],examples:[{english:'The calculation includes shipping costs.',vietnamese:'Phép tính bao gồm chi phí vận chuyển.'}],caution:'Phân biệt danh từ calculation với động từ calculate.',questions:[]};
   if(action==='examples')lesson.examples=[{english:'The second calculation is accurate.',vietnamese:'Phép tính thứ hai là chính xác.'},{english:'Please check this calculation.',vietnamese:'Vui lòng kiểm tra phép tính này.'},{english:'Her calculation saved time.',vietnamese:'Phép tính của cô ấy đã tiết kiệm thời gian.'}];
   if(action==='compare'){lesson.summary='Theo nghĩa đang học: calculation chỉ phép tính; applicant chỉ người ứng tuyển.';lesson.collocations=[];}
   if(action==='practice')lesson.questions=[{wordId:source.wordId,type:'fill',questionText:'Please check the cost _____.',options:[],answer:'calculation',hint:'Một phép tính chi phí.',translation:'Vui lòng kiểm tra phép tính chi phí.',explanation:'Trong câu này, dùng danh từ calculation.'}];
   const explanation={version:'toeic-vi-v4',action,source,lesson,quality:{mode:action==='compare'?'source-only':'ai'},...(request.comparison?{comparison:sources[request.comparison.wordId]}:{})};
   await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({text:'Lời giải QA theo cấu trúc.',explanation})});
  });
  await page.evaluate(()=>Object.keys(localStorage).filter(key=>key.includes('eng_master_ai_explanations_v3')).forEach(key=>localStorage.removeItem(key)));
  await page.getByRole('button',{name:'Thư viện',exact:true}).click();await page.getByPlaceholder('Tìm theo từ, nghĩa hoặc chủ đề...').fill('calculation');await page.getByRole('button',{name:'Giải thích bằng AI',exact:true}).first().click();const dialog=page.getByRole('dialog');
  await dialog.getByText('Từ bộ dữ liệu đã rà soát',{exact:true}).waitFor();await dialog.getByText('AI bổ sung · Giải thích và luyện tập',{exact:true}).waitFor();await dialog.getByRole('heading',{name:'Hiểu nghĩa',exact:true}).waitFor();
  await dialog.getByRole('button',{name:'Giải thích đơn giản hơn',exact:true}).click();await dialog.getByRole('alert').filter({hasText:'QA: Hỏi tiếp đang bận.'}).waitFor();if(await dialog.getByRole('heading',{name:'Hiểu nghĩa',exact:true}).count()!==1)throw Error('Failed follow-up removed the base');
  await dialog.getByRole('button',{name:'Thử lại câu hỏi',exact:true}).click();await dialog.getByText('Hiểu đơn giản: calculation là một phép tính.',{exact:true}).waitFor();return {structured:true,provenance:true,basePreserved:true,followupRetry:true};
 }`);
 step('more examples and comparison retain the selected word and approved second meaning',`async page=>{
  const dialog=page.getByRole('dialog');await dialog.getByRole('button',{name:'Thêm ví dụ',exact:true}).click();await dialog.getByText('The second calculation is accurate.',{exact:true}).waitFor();await dialog.getByText('Her calculation saved time.',{exact:true}).waitFor();
  await dialog.getByRole('button',{name:'So sánh hai từ',exact:true}).click();await dialog.getByLabel('Từ muốn so sánh',{exact:true}).fill('applicant');await dialog.getByLabel('Chọn từ và nghĩa',{exact:true}).selectOption(${JSON.stringify(qaSource('applicant').wordId)});await dialog.getByRole('button',{name:'So sánh',exact:true}).click();await dialog.getByRole('heading',{name:'Phân biệt hai từ',exact:true}).waitFor();
  if(await dialog.getByText(${JSON.stringify(qaSource('applicant').meaning)},{exact:true}).count()!==1)throw Error('Second meaning lost');
  for(const width of [360,390,768,1280]){await page.setViewportSize({width,height:900});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Structured dialog overflow at '+width);}
  await dialog.screenshot({path:'output/playwright/ai-structured-comparison.png'});return {threeExamples:true,comparison:true,selectedMeaningsPreserved:true,noOverflow:true};
 }`);
 step('quick check hides feedback until submission and grades inside the shared dialog',`async page=>{
  const dialog=page.getByRole('dialog');await dialog.getByRole('button',{name:'Kiểm tra tôi',exact:true}).click();await dialog.getByText('Please check the cost _____.',{exact:true}).waitFor();if(await dialog.getByText('Trong câu này, dùng danh từ calculation.',{exact:true}).count())throw Error('Answer explanation leaked');if(await dialog.getByText('Vui lòng kiểm tra phép tính chi phí.',{exact:true}).count())throw Error('Translation leaked');
  await dialog.getByLabel('Điền từ tiếng Anh',{exact:true}).fill('calculation');await dialog.getByRole('button',{name:'Chấm câu này',exact:true}).click();await dialog.getByRole('status').filter({hasText:'Chính xác!'}).waitFor();await dialog.getByText('Trong câu này, dùng danh từ calculation.',{exact:true}).waitFor();await dialog.getByRole('status').filter({hasText:'Chính xác!'}).scrollIntoViewIfNeeded();
  await page.setViewportSize({width:390,height:900});await dialog.getByRole('status').filter({hasText:'Chính xác!'}).scrollIntoViewIfNeeded();await dialog.screenshot({path:'output/playwright/ai-structured-quick-check.png'});await dialog.getByRole('button',{name:'Đóng hộp thoại'}).click();return {hiddenUntilSubmitted:true,graded:true,closed:true};
 }`);


 step('baseline assessment starts and saves its first fixed section',`async page=>{
  await page.getByRole('button',{name:'Tổng quan',exact:true}).click();await page.getByRole('button',{name:'Bài học · Ngữ pháp · Part 1–7',exact:true}).click();await page.getByRole('button',{name:'Khảo sát nền tảng',exact:true}).click();await page.getByRole('heading',{name:'Khảo sát nền tảng · 20 câu',exact:true}).waitFor();
  await page.evaluate(()=>{Object.defineProperty(window.speechSynthesis,'getVoices',{configurable:true,value:()=>[{name:'QA English',lang:'en-US',voiceURI:'qa',localService:true,default:true}]});window.speechSynthesis.dispatchEvent(new Event('voiceschanged'));});
  await page.getByRole('button',{name:'Bắt đầu khảo sát nền tảng',exact:true}).click();await page.getByRole('heading',{name:'Part 2 · 1/5',exact:true}).waitFor();
  for(let i=0;i<5;i++){await page.getByRole('button',{name:'A',exact:true}).click();if(i<4)await page.getByRole('button',{name:'Câu tiếp',exact:true}).click();}
  await page.getByRole('button',{name:'Nộp bài',exact:true}).click();await page.getByRole('status').filter({hasText:'Đã nộp 1/4 bước'}).waitFor();return {fixedFirstSection:true,savedAfterSubmit:true,voiceFixtureOnly:true};
 }`);
 const reloadWithConfirmation=()=>{const out=call('reload');if(out.includes('beforeunload'))call('dialog-accept');};
 reloadWithConfirmation();
 step('baseline progress survives reload and starts the next assessed part',`async page=>{
  await page.getByRole('button',{name:'Khảo sát nền tảng',exact:true}).click();await page.getByRole('status').filter({hasText:'Đã nộp 1/4 bước'}).waitFor();await page.getByRole('button',{name:'Tiếp tục khảo sát: Part 5',exact:true}).click();await page.getByRole('heading',{name:'Part 5 · 1/5',exact:true}).waitFor();return {progressSurvivesReload:true,nextSection:true};
 }`);
 reloadWithConfirmation();
 step('baseline draft resumes after an accepted native reload',`async page=>{
  await page.getByRole('heading',{name:'Part 5 · 1/5',exact:true}).waitFor();await page.setViewportSize({width:390,height:900});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Assessment overflow');const pause=await page.getByRole('button',{name:'Tạm dừng',exact:true}).boundingBox(),settings=await page.getByRole('button',{name:'Mở cài đặt',exact:true}).last().boundingBox();if(!pause||!settings||pause.x<settings.x+settings.width&&pause.x+pause.width>settings.x&&pause.y<settings.y+settings.height&&pause.y+pause.height>settings.y)throw Error('Mobile account controls overlap pause');await page.screenshot({path:'output/playwright/baseline-resume-mobile.png',fullPage:true});return {draftResumes:true,noOverflow:true,pauseNotCovered:true};
 }`);
 report.passed=true;
}finally{
 try{if(opened)call('close');}finally{if(server)server.kill();if(fs.existsSync(fixture))fs.unlinkSync(fixture);if(created){await db.recursiveDelete(db.doc('users/'+uid));await adminAuth.deleteUser(uid);}await deleteApp(client);await deleteAdmin(admin);report.cleanup=true;fs.mkdirSync('output/verification',{recursive:true});fs.writeFileSync('output/verification/browser-ai-layout.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:report.passed,origin,checks:report.checks.length,cleanup:report.cleanup}));}
}
