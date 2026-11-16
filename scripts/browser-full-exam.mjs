import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {EXAM_FORM} from '../src/domain/fullExam.ts';
import {ALL_PRACTICE_QUESTIONS} from '../src/data/learningContent.ts';
const origin=process.argv[2]||'http://localhost:3119';if(!['localhost','127.0.0.1','eng-master-main2.vercel.app'].includes(new URL(origin).hostname))throw Error('Unapproved QA origin');
const cli=process.env.PLAYWRIGHT_CLI||'playwright-cli',session='exam200-'+Date.now();
const report={checkedAt:new Date().toISOString(),origin,passed:false,checks:[],timeMethod:'Playwright clock fast-forward, not a two-hour wall-clock test'};
const call=(...args)=>{const r=spawnSync(cli,['-s='+session,...args],{encoding:'utf8',maxBuffer:6e6});if(r.status||r.stdout.includes('### Error'))throw Error(r.stdout+r.stderr);return r.stdout;};
const step=(name,code)=>{call('snapshot');const out=call('run-code',`async page=>{try{return await (${code})(page);}catch(error){await page.screenshot({path:'output/playwright/exam200-failure.png',fullPage:true});throw error;}}`);const match=out.match(/### Result\s*\n([\s\S]*?)(?:\n###|$)/);if(!match)throw Error('Missing result '+name);report.checks.push({name,result:JSON.parse(match[1])});console.log('PASS '+name);};
const ids=JSON.stringify(EXAM_FORM.questionIds),bank=JSON.stringify(ALL_PRACTICE_QUESTIONS);
try{
 call('open',origin,'--headed');
 step('guest, full offline pack, exam disclosure and exact blueprint',`async page=>{
  await page.clock.install({time:Date.now()});await page.reload();
  await page.addInitScript(()=>window.confirm=()=>true);await page.evaluate(()=>window.confirm=()=>true);
  await page.getByRole('button',{name:'Tiếp tục với tư cách Khách'}).click();await page.getByRole('button',{name:'Bắt đầu',exact:true}).click();await page.waitForFunction(()=>document.documentElement.dataset.offlineReady==='true',null,{timeout:120000});
  await page.getByRole('button',{name:'Bài học · Ngữ pháp · Part 1–7'}).click();await page.getByText(/311 câu gồm Part 1–7/).waitFor();await page.getByRole('button',{name:'Đề 200 câu',exact:true}).click();
  await page.getByRole('heading',{name:'Đề luyện 200 câu · Biên soạn',exact:true}).waitFor();await page.getByText(/Đáp án, văn bản và ảnh đã rà soát;/).waitFor();
  await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(b=>b.textContent==='Bắt đầu đề 200 câu'&&!b.disabled));
  return {questions:311,formQuestions:200,offlineReady:true,writeLock:await page.evaluate(()=>!!navigator.locks)};
 }`);
 step('listening answer, hidden text and leave/resume without resetting time',`async page=>{
  const ids=${ids},bank=${bank},q=bank.find(q=>q.id===ids[0]);await page.getByRole('button',{name:'Bắt đầu đề 200 câu'}).click();await page.getByRole('heading',{name:'Câu 1/200 · Part 1',exact:true}).waitFor();
  const audio=page.getByRole('region',{name:'Audio đề 200 câu'}).locator('audio');
  await audio.waitFor({state:'attached'});if(await page.getByRole('button',{name:'Bật âm thanh',exact:true}).isEnabled())await page.getByRole('button',{name:'Bật âm thanh',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('[aria-label="Audio đề 200 câu"] audio')?.currentTime>0.1);
  const duration=await audio.evaluate(a=>a.duration);if(Math.abs(duration-2700)>0.2)throw Error('Not the 45-minute recording');
  await page.getByRole('button',{name:'Tạm tắt âm thanh',exact:true}).click();await page.clock.fastForward(5000);await page.getByRole('button',{name:'Bật âm thanh',exact:true}).click();
  const resumed=await audio.evaluate(a=>a.currentTime);if(resumed<5)throw Error('Audio restarted after mute');
  await page.getByRole('region',{name:'Học liệu nghe'}).getByRole('img').evaluate(img=>img.decode());if(await page.getByText(q.options[q.correctIndex],{exact:true}).count())throw Error('Photo answer leaked');
  if(await page.getByText('Transcript và bản dịch',{exact:true}).count())throw Error('Transcript leaked');
  await page.getByRole('button',{name:String.fromCharCode(65+q.correctIndex),exact:true}).click();await page.waitForFunction(()=>JSON.parse(localStorage.getItem('eng_master_full_exam_draft_v1')).revision===1);
  const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_full_exam_draft_v1')));if(await page.getByLabel('Đi tới câu đề 200').locator('option').count()!==100)throw Error('Reading unlocked early');
  await page.getByRole('button',{name:'Tạm rời màn hình'}).click();await page.getByRole('button',{name:'Đề 200 câu',exact:true}).click();
  const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_full_exam_draft_v1')));if(after.startedAt!==before.startedAt||after.answers[ids[0]]!==q.correctIndex)throw Error('Resume reset');return {answerRetained:true,startRetained:true,readingLocked:true,actualAudioPlayback:true,duration,audioResumedAtWallClock:resumed};
 }`);
 step('new conversation source, shared group and mobile/keyboard access',`async page=>{
  const ids=${ids},bank=${bank};const position=ids.findIndex(id=>id==='p3-exam-v1-registration-q1');await page.getByLabel('Đi tới câu đề 200').selectOption(String(position));
  const q=bank.find(q=>q.id===ids[position]);await page.getByRole('heading',{name:'Câu '+(position+1)+'/200 · Part 3',exact:true}).waitFor();if(await page.getByText(/Hello. I registered for the sales workshop/).count())throw Error('Conversation leaked');
  await page.getByRole('button',{name:String.fromCharCode(65+q.correctIndex)+'. '+q.options[q.correctIndex],exact:true}).click();await page.waitForFunction(id=>JSON.parse(localStorage.getItem('eng_master_full_exam_draft_v1')).answers[id]!==undefined,q.id);
  await page.getByRole('button',{name:'Câu tiếp',exact:true}).click();await page.getByRole('heading',{name:'Câu '+(position+2)+'/200 · Part 3',exact:true}).waitFor();
  for(const width of [360,390,768,1280]){await page.setViewportSize({width,height:900});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Overflow '+width);}
  await page.setViewportSize({width:390,height:900});await page.getByRole('button',{name:'Câu tiếp',exact:true}).focus();await page.keyboard.press('Enter');await page.getByRole('heading',{name:'Câu '+(position+3)+'/200 · Part 3',exact:true}).waitFor();await page.screenshot({path:'output/playwright/exam200-listening-mobile.png',fullPage:true});return {groupQuestions:3,transcriptHidden:true,widths:[360,390,768,1280],keyboard:true};
 }`);
 step('same-owner second tab receives current answers and cursor',`async page=>{
  const tab=await page.context().newPage();try{await tab.goto(page.url());await tab.getByRole('heading',{name:/Đề luyện 200 câu · Nghe/}).waitFor();
   await tab.getByLabel('Đi tới câu đề 200').selectOption('0');await page.getByRole('heading',{name:'Câu 1/200 · Part 1',exact:true}).waitFor();if(await tab.getByRole('button',{name:'B',exact:true}).getAttribute('aria-pressed')!=='true')throw Error('Answer missing in second tab');return {sameDraft:true,remoteCursorUpdate:true};
  }finally{await tab.close();}
 }`);
 step('offline reload restores draft, picture and original deadline',`async page=>{
  const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_full_exam_draft_v1')));await page.context().setOffline(true);await page.evaluate(()=>document.documentElement.dataset.reloadApproved='true');await page.reload();
  await page.getByRole('heading',{name:'Câu 1/200 · Part 1',exact:true}).waitFor();await page.getByRole('region',{name:'Học liệu nghe'}).getByRole('img').evaluate(img=>img.decode());
  const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_full_exam_draft_v1')));if(after.startedAt!==before.startedAt||JSON.stringify(after.answers)!==JSON.stringify(before.answers))throw Error('Offline state lost');
  const range=await page.evaluate(async()=>{const r=await fetch('/learning/audio-v1/exam-200-v1-listening.mp3',{headers:{Range:'bytes=1000-1127'}});return {status:r.status,bytes:(await r.arrayBuffer()).byteLength};});if(range.status!==206||range.bytes!==128)throw Error('Offline exam audio range failed');
  if(await page.getByRole('button',{name:'Bật âm thanh',exact:true}).isEnabled())await page.getByRole('button',{name:'Bật âm thanh',exact:true}).click();await page.waitForFunction(()=>document.querySelector('[aria-label="Audio đề 200 câu"] audio')?.paused===false);
  await page.context().setOffline(false);return {offline:true,answersRetained:true,deadlineRetained:true,examAudioCachedRange:true,offlinePlayback:true};
 }`);
 step('45-minute boundary locks Listening and opens 100 Reading questions',`async page=>{
  await page.clock.fastForward(45*60*1000);
  await page.getByRole('heading',{name:'Đề luyện 200 câu · Đọc',exact:true}).waitFor();await page.getByRole('heading',{name:'Câu 101/200 · Part 5',exact:true}).waitFor();
  const options=await page.getByLabel('Đi tới câu đề 200').locator('option').evaluateAll(rows=>rows.map(row=>Number(row.value)));if(options.length!==100||Math.min(...options)!==100||Math.max(...options)!==199)throw Error('Wrong section bounds');
  if(!await page.getByRole('button',{name:'Câu trước',exact:true}).isDisabled())throw Error('Listening previous still enabled');
  const ids=${ids},bank=${bank},q=bank.find(q=>q.id===ids[100]);await page.getByRole('button',{name:String.fromCharCode(65+q.correctIndex)+'. '+q.options[q.correctIndex],exact:true}).click();return {listeningLocked:true,readingOpened:true,readingOptions:100};
 }`);
 step('multi-document final question and 75-minute auto-submit',`async page=>{
  const ids=${ids},bank=${bank};await page.getByLabel('Đi tới câu đề 200').selectOption('199');await page.getByRole('region',{name:'Bài đọc đề 200'}).getByText(/DOCUMENT 3/).waitFor();const q=bank.find(q=>q.id===ids[199]);await page.getByRole('button',{name:String.fromCharCode(65+q.correctIndex)+'. '+q.options[q.correctIndex],exact:true}).click();await page.waitForFunction(id=>JSON.parse(localStorage.getItem('eng_master_full_exam_draft_v1')).answers[id]!==undefined,q.id);
  const answers=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_full_exam_draft_v1')).answers);const correct=Object.entries(answers).filter(([id,index])=>bank.find(q=>q.id===id).correctIndex===index).length;
  await page.clock.fastForward(75*60*1000);await page.getByRole('heading',{name:'Kết quả đề: '+correct+'/200 câu đúng',exact:true}).waitFor();
  const rows=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_extended_practice_v1')));if(rows.length!==7||rows.reduce((n,r)=>n+r.answers.length,0)!==200||rows.reduce((n,r)=>n+r.durationSeconds,0)!==7200||await page.evaluate(()=>localStorage.getItem('eng_master_full_exam_draft_v1'))!==null)throw Error('Finalization invalid');
  await page.getByLabel('Phần xem lại đề').selectOption('part7');if(await page.locator('summary').count()!==10)throw Error('Review page exceeds ten questions');await page.getByRole('button',{name:'Trang câu tiếp',exact:true}).click();await page.getByText('Câu 11–20 / 54 trong phần này',{exact:true}).waitFor();await page.getByLabel('Phần xem lại đề').selectOption('part1');
  await page.locator('summary').filter({hasText:'Part 1 · Đúng'}).first().click();await page.getByText('Transcript và bản dịch',{exact:true}).first().click();await page.getByRole('heading',{name:'Kết quả đề: '+correct+'/200 câu đúng',exact:true}).scrollIntoViewIfNeeded();await page.screenshot({path:'output/playwright/exam200-result-mobile.png',fullPage:false});return {correct,blank:200-Object.keys(answers).length,total:200,partRecords:7,durationSeconds:7200,reviewByPart:true,maxReviewQuestionsPerPage:10};
 }`);
 step('backup v4 merge and ordinary practice writer after exam',`async originalPage=>{
  const context=await originalPage.context().browser().newContext({storageState:await originalPage.context().storageState({indexedDB:true})});
  const page=await context.newPage();try{await page.goto('${origin}');await page.setViewportSize({width:1280,height:900});await page.evaluate(()=>window.confirm=()=>true);
  await page.getByRole('button',{name:'Mở cài đặt'}).click();const download=page.waitForEvent('download');await page.getByRole('button',{name:'Xuất JSON',exact:true}).click();await(await download).saveAs('output/playwright/exam200-backup.json');await page.locator('input[accept="application/json,.json"]').setInputFiles('output/playwright/exam200-backup.json');await page.getByRole('dialog',{name:'Kiểm tra dữ liệu trước khi nhập'}).waitFor();await page.getByRole('button',{name:'Xác nhận nhập dữ liệu',exact:true}).click();await page.getByText('Đã nhập dữ liệu học tập!',{exact:true}).waitFor();await page.getByRole('dialog',{name:'Kiểm tra dữ liệu trước khi nhập'}).waitFor({state:'hidden'});
  const count=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_extended_practice_v1')).length);if(count!==7)throw Error('Backup duplicate');
  await page.getByRole('button',{name:'Tổng quan',exact:true}).click();await page.clock.runFor(1000);await page.getByRole('heading',{name:'Đề luyện 200 câu · Biên soạn',exact:true}).waitFor({state:'hidden'});await page.getByRole('button',{name:'Bài học · Ngữ pháp · Part 1–7'}).click();await page.clock.runFor(1000);await page.getByText(/311 câu gồm Part 1–7/).waitFor();await page.getByRole('button',{name:'Ngữ pháp',exact:true}).click();await page.getByRole('button',{name:'Luyện chuyên đề này'}).click();await page.getByRole('button',{name:'Nộp bài',exact:true}).click();await page.getByRole('heading',{name:'Kết quả: 0/3 câu đúng',exact:true}).waitFor();
  const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_extended_practice_v1')).length);if(after!==8)throw Error('Practice writer lost exam records');return {backupV4:true,mergeDeduplicated:true,ordinaryPracticeSaved:true,records:after,clock:'fresh real-clock browser context restored from completed exam state'};
  }catch(error){await page.screenshot({path:'output/playwright/exam200-backup-failure.png',fullPage:true});throw error;}finally{await context.close();}
 }`);
 report.passed=true;
}catch(error){report.error=error.message;console.error(error.message);process.exitCode=1;}
finally{try{call('close');}catch{}fs.writeFileSync('output/verification/exam200-browser.json',JSON.stringify(report,null,2)+'\n');}
