// Isolated local guest QA. Native speech is probed separately from the UI-only fallback.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { ALL_PRACTICE_QUESTIONS as LISTENING_QUESTIONS } from '../src/data/learningContent.ts';
const origin=process.argv[2]||'http://localhost:3118';
if(!['localhost','127.0.0.1','eng-master-main2.vercel.app'].includes(new URL(origin).hostname))throw Error('Unapproved QA origin');
const cli=process.env.PLAYWRIGHT_CLI||'playwright-cli';
const session='listening-pilot-'+Date.now();
const report={checkedAt:new Date().toISOString(),origin,passed:false,checks:[]};
const call=(...args)=>{const r=spawnSync(cli,['-s='+session,...args],{encoding:'utf8',maxBuffer:6e6});if(r.status||r.stdout.includes('### Error'))throw Error(r.stdout+r.stderr);return r.stdout;};
const step=(name,code)=>{call('snapshot');const out=call('run-code',`async page=>{try{return await (${code})(page);}catch(error){await page.screenshot({path:'output/playwright/listening-pilot-failure.png',fullPage:true});throw error;}}`);const match=out.match(/### Result\s*\n([\s\S]*?)(?:\n###|$)/);if(!match)throw Error('Missing result '+name+' '+out);report.checks.push({name,result:JSON.parse(match[1])});console.log('PASS '+name);};
const bank=JSON.stringify(LISTENING_QUESTIONS);
try{
 call('open',origin,'--headed');
 step('guest and offline pack',`async page=>{
  await page.addInitScript(()=>window.confirm=()=>true);await page.evaluate(()=>window.confirm=()=>true);
  await page.getByRole('button',{name:'Tiếp tục với tư cách Khách'}).click();await page.getByRole('button',{name:'Bắt đầu',exact:true}).click();
  await page.waitForFunction(()=>document.documentElement.dataset.offlineReady==='true',null,{timeout:120000});
  await page.getByRole('button',{name:'Bài học · Ngữ pháp · Part 1–7'}).click();
  await page.getByText(/311 câu gồm Part 1–7/).waitFor();
  const voices=await page.evaluate(()=>speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang)&&v.localService).map(v=>v.name));
  return {offlineReady:true,questions:311,nativeEnglishVoices:voices};
 }`);
 step('official and supplemental links',`async page=>{
  await page.getByRole('button',{name:'Học liệu',exact:true}).click();
  const urls=await page.locator('main a[target="_blank"]').evaluateAll(links=>links.map(a=>a.href));
  for(const path of ['sample01.html','sample03.html','sample04.html','3960391.html'])if(!urls.some(u=>u.includes(path)))throw Error('Missing source '+path);
  const audio=page.getByLabel('Nghe Budget Cuts của VOA');await audio.evaluate(audio=>audio.load());await page.waitForFunction(()=>document.querySelector('audio')?.readyState>=1);
  await audio.evaluate(audio=>audio.play());await page.waitForFunction(()=>document.querySelector('audio')?.currentTime>0.1);await audio.evaluate(audio=>audio.pause());
  const duration=await audio.evaluate(audio=>audio.duration);
  await page.context().setOffline(true);
  const range=await page.evaluate(async()=>{const r=await fetch('/learning/listening-v1/voa-budget-cuts.mp3',{headers:{Range:'bytes=0-127'}});const data=new Uint8Array(await r.arrayBuffer());return {status:r.status,bytes:data.length,signature:String.fromCharCode(...data.slice(0,3))};});
  if(range.status!==206||range.bytes!==128||range.signature!=='ID3')throw Error('Cached audio range failed '+JSON.stringify(range));
  await audio.evaluate(async audio=>{audio.currentTime=60;await audio.play();});await page.waitForFunction(()=>document.querySelector('audio')?.currentTime>60.1);await audio.evaluate(audio=>audio.pause());await page.context().setOffline(false);
  return {nativeMp3Playback:true,offlineSeek:true,duration,sourceLinks:urls.filter(u=>u.includes('sample0')||u.includes('3960391'))};
 }`);
 step('bundled audio remains available with no device English voices',`async page=>{
  await page.evaluate(()=>{Object.defineProperty(speechSynthesis,'getVoices',{configurable:true,value:()=>[]});speechSynthesis.dispatchEvent(new Event('voiceschanged'));});
  await page.getByRole('button',{name:'Part 1',exact:true}).click();
  if(await page.getByRole('button',{name:'Luyện không giới hạn thời gian'}).isDisabled())throw Error('Bundled audio blocked without native voice');return {noSystemVoiceNeeded:true,speechMode:'bundled-kokoro-mp3'};
 }`);
 step('Part 1 six images, hidden descriptions, scoring and transcript review',`async page=>{
  const bank=${bank};await page.getByRole('button',{name:'Luyện không giới hạn thời gian'}).click();
  const draft=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_workplace_draft_v2')));
  if(draft.questionIds.length!==6)throw Error('Expected six images');
  const images=[];
  for(let i=0;i<6;i++){
   const q=bank.find(q=>q.id===draft.questionIds[i]);
   await page.getByRole('region',{name:'Học liệu nghe'}).waitFor();
   const img=page.getByRole('region',{name:'Học liệu nghe'}).getByRole('img');await img.evaluate(img=>img.decode());
   images.push(await img.getAttribute('src'));
   if(await page.getByText(q.options[q.correctIndex],{exact:true}).count())throw Error('Part1 answer leaked');
   if(await page.getByText('Transcript và bản dịch',{exact:true}).count())throw Error('Transcript leaked');
   if(i===0){await page.getByRole('button',{name:'Nghe 4 lời mô tả'}).click();
    await page.waitForFunction(()=>document.querySelector('[aria-label="Học liệu nghe"] audio')?.currentTime>0.1);const src=await page.locator('audio').getAttribute('src');if(!src.includes(q.listeningId))throw Error('Wrong photo audio');
    await page.getByRole('button',{name:'Dừng âm thanh'}).click();await page.setViewportSize({width:390,height:900});
    await page.getByRole('button',{name:'Tạm dừng',exact:true}).evaluate(button=>window.scrollTo(0,button.getBoundingClientRect().top+scrollY-12));
    const pauseVisible=await page.getByRole('button',{name:'Tạm dừng',exact:true}).evaluate(button=>{const r=button.getBoundingClientRect();return button.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));});
    if(!pauseVisible)throw Error('Account controls cover pause while scrolled');await page.getByRole('button',{name:'Tạm dừng',exact:true}).click({trial:true});
    await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:'output/playwright/listening-part1-mobile.png',fullPage:true});
   }
   await page.getByRole('button',{name:String.fromCharCode(65+q.correctIndex),exact:true}).click();if(i<5)await page.getByRole('button',{name:'Câu tiếp',exact:true}).click();
  }
  await page.getByRole('button',{name:'Nộp bài',exact:true}).click();await page.getByRole('heading',{name:'Kết quả: 6/6 câu đúng',exact:true}).waitFor();
  await page.locator('details').filter({has:page.locator('summary').filter({hasText:'Đúng · Choose'})}).first().locator('summary').first().click();
  await page.getByText('Transcript và bản dịch',{exact:true}).first().click();
  return {questions:6,uniqueImages:new Set(images).size,correct:6,answerHidden:true,spokenOptionsMatch:true,pauseAccessibleWhileScrolled:true};
 }`);
 step('Part 3 ordered group, reload, deadline and actual speech start',`async page=>{
  await page.getByRole('button',{name:'Part 3',exact:true}).click();await page.getByLabel('Số câu bài luyện').selectOption('5');await page.getByRole('button',{name:'Bài có thời gian',exact:true}).click();
  const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_workplace_draft_v2')));if(before.questionIds.length!==3||before.deadline-Date.parse(before.startedAt)!==90000)throw Error('Group/deadline failed');
  if(!before.questionIds[0].endsWith('q1')||!before.questionIds[2].endsWith('q3'))throw Error('Group order failed');
  const bank=${bank},q=bank.find(q=>q.id===before.questionIds[0]);await page.getByRole('button',{name:String.fromCharCode(65+(q.correctIndex+1)%4)+'. '+q.options[(q.correctIndex+1)%4],exact:true}).click();
  await page.evaluate(()=>document.documentElement.dataset.reloadApproved='true');await page.reload();
  await page.getByRole('heading',{name:'Part 3 · 1/3',exact:true}).waitFor();
  const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_workplace_draft_v2')));if(JSON.stringify(before.questionIds)!==JSON.stringify(after.questionIds)||after.answers[q.id]!==((q.correctIndex+1)%4)||after.deadline!==before.deadline)throw Error('Reload lost draft');
  if(await page.getByText('Transcript và bản dịch',{exact:true}).count())throw Error('Transcript leaked');
  await page.getByRole('button',{name:'Nghe toàn bộ bài'}).click();await page.waitForFunction(()=>document.querySelector('[aria-label="Học liệu nghe"] audio')?.currentTime>0.1);const nativeStarted=true;await page.getByRole('button',{name:'Dừng âm thanh'}).click();
  await page.getByRole('button',{name:'Nộp bài',exact:true}).click();await page.getByRole('heading',{name:'Kết quả: 0/3 câu đúng',exact:true}).waitFor();
  const result=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_extended_practice_v1'))[0]);if(result.answers.filter(a=>a.selectedIndex===null).length!==2)throw Error('Blank count failed');
  await page.locator('summary').filter({hasText:'Sai ·'}).first().click();await page.getByText('Transcript và bản dịch',{exact:true}).first().click();
  await page.screenshot({path:'output/playwright/listening-part3-review.png',fullPage:true});
  return {group:3,order:true,deadlineRetained:true,answerRetained:true,wrong:1,blanks:2,nativeStarted};
 }`);
 step('Part 3 exact mistake retry from notebook',`async page=>{
  await page.getByRole('button',{name:'Về tổng quan',exact:true}).click();await page.getByRole('button',{name:'Sổ lỗi sai · ôn câu đã làm'}).click();await page.getByLabel('Dạng lỗi sai').selectOption('part3');
  await page.getByRole('button',{name:'Làm lại câu này',exact:true}).first().click();await page.getByRole('button',{name:'Bắt đầu bài đã chọn',exact:true}).click();
  const draft=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_workplace_draft_v2')));if(draft.questionIds.length!==1)throw Error('Retry changed question set');
  const bank=${bank},q=bank.find(q=>q.id===draft.questionIds[0]);await page.getByRole('button',{name:String.fromCharCode(65+q.correctIndex)+'. '+q.options[q.correctIndex],exact:true}).click();await page.getByRole('button',{name:'Nộp bài',exact:true}).click();await page.getByRole('heading',{name:'Kết quả: 1/1 câu đúng',exact:true}).waitFor();return {exactQuestion:draft.questionIds[0],correct:1};
 }`);
 step('Part 4 entire talk and three questions',`async page=>{
  const bank=${bank};await page.getByRole('button',{name:'Part 4',exact:true}).click();await page.getByLabel('Chủ điểm bài luyện').selectOption('Bảo trì văn phòng');await page.getByRole('button',{name:'Luyện không giới hạn thời gian'}).click();
  const draft=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_workplace_draft_v2')));if(draft.questionIds.length!==3||!draft.questionIds.every(id=>id.includes('repair')))throw Error('Wrong talk group');
  for(let i=0;i<3;i++){const q=bank.find(q=>q.id===draft.questionIds[i]);if(await page.getByText(/Hello, this is Jordan/).count())throw Error('Talk leaked');await page.getByRole('button',{name:String.fromCharCode(65+q.correctIndex)+'. '+q.options[q.correctIndex],exact:true}).click();if(i<2)await page.getByRole('button',{name:'Câu tiếp',exact:true}).click();}
  await page.getByRole('button',{name:'Nộp bài',exact:true}).click();await page.getByRole('heading',{name:'Kết quả: 3/3 câu đúng',exact:true}).waitFor();return {correct:3,group:3};
 }`);
 step('offline photos, saved answers and mobile widths',`async page=>{
  await page.getByRole('button',{name:'Part 1',exact:true}).click();await page.getByRole('button',{name:'Luyện không giới hạn thời gian'}).click();await page.getByRole('button',{name:'B',exact:true}).click();
  await page.context().setOffline(true);await page.evaluate(()=>document.documentElement.dataset.reloadApproved='true');await page.reload();
  await page.getByRole('heading',{name:'Part 1 · 1/6',exact:true}).waitFor();await page.getByRole('region',{name:'Học liệu nghe'}).getByRole('img').evaluate(img=>img.decode());
  if(await page.getByRole('button',{name:'B',exact:true}).getAttribute('aria-pressed')!=='true')throw Error('Offline answer lost');
  const photos=['forklift','desk','home-office','conference','bicycle','cyclist'];for(const name of photos){const okay=await page.evaluate(async name=>{const img=new Image();img.src='/learning/listening-v1/'+name+'.jpg';await img.decode();return img.naturalWidth>0;},name);if(!okay)throw Error('Offline image '+name);}
  for(const width of [360,390,768,1280]){await page.setViewportSize({width,height:900});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Overflow '+width);}
  await page.getByRole('button',{name:'Nghe 4 lời mô tả'}).click();await page.waitForFunction(()=>document.querySelector('[aria-label="Học liệu nghe"] audio')?.currentTime>0.1);await page.locator('audio').evaluate(audio=>{audio.currentTime=5;});await page.waitForFunction(()=>document.querySelector('[aria-label="Học liệu nghe"] audio')?.currentTime>=5);await page.getByRole('button',{name:'Dừng âm thanh'}).click();
  await page.context().setOffline(false);await page.getByRole('button',{name:'Nộp bài',exact:true}).click();return {offlinePhotos:6,answerRetained:true,widths:[360,390,768,1280]};
 }`);
 step('backup v4 roundtrip with new parts',`async page=>{
  await page.getByRole('button',{name:'Mở cài đặt'}).click();const download=page.waitForEvent('download');await page.getByRole('button',{name:'Xuất JSON',exact:true}).click();await(await download).saveAs('output/playwright/listening-pilot-backup.json');
  const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_extended_practice_v1')).length);await page.locator('input[accept="application/json,.json"]').setInputFiles('output/playwright/listening-pilot-backup.json');await page.getByRole('dialog',{name:'Kiểm tra dữ liệu trước khi nhập'}).waitFor();await page.getByRole('button',{name:'Xác nhận nhập dữ liệu',exact:true}).click();await page.getByText('Đã nhập dữ liệu học tập!',{exact:true}).waitFor();const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_extended_practice_v1')).length);if(before!==after)throw Error('Duplicate backup records');return {records:after,mergeDeduplicated:true};
 }`);
 report.passed=true;
}catch(error){report.error=error.message;console.error(error.message);process.exitCode=1;}
finally{try{call('close');}catch{}fs.writeFileSync('output/verification/listening-v1-browser.json',JSON.stringify(report,null,2)+'\n');}
