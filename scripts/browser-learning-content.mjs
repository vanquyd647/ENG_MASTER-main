// Isolated guest browser QA; no real account or credentials.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { ALL_PRACTICE_QUESTIONS } from '../src/data/learningContent.ts';
const origin=process.argv[2]||'http://localhost:3110';
if(!['localhost','127.0.0.1','eng-master-main2.vercel.app'].includes(new URL(origin).hostname))throw Error('Unapproved QA origin');
const cli=process.env.PLAYWRIGHT_CLI||'playwright-cli',sessions=['content-'+Date.now(),'content-restore-'+Date.now()];
let active=0;const opened=[];const report={checkedAt:new Date().toISOString(),origin,checks:[],passed:false};
const call=(...args)=>{const r=spawnSync(cli,['-s='+sessions[active],...args],{encoding:'utf8',maxBuffer:4e6});if(r.status||r.stdout.includes('### Error'))throw Error(r.stdout+r.stderr);return r.stdout;};
const step=(name,code)=>{call('snapshot');const out=call('run-code',`async page=>{try{return await (${code})(page);}catch(error){await page.screenshot({path:'output/playwright/content-failure.png',fullPage:true});throw error;}}`);const match=out.match(/### Result\s*\n([\s\S]*?)(?:\n###|$)/);if(!match)throw Error('Step did not return a result: '+name);report.checks.push({name,result:JSON.parse(match[1])});};
const bank=JSON.stringify(ALL_PRACTICE_QUESTIONS);
const guest=`async page=>{
 await page.addInitScript(()=>window.confirm=()=>true);await page.evaluate(()=>window.confirm=()=>true);
 await page.getByRole('button',{name:'Tiếp tục với tư cách Khách'}).click();
 await page.getByRole('button',{name:'Bắt đầu',exact:true}).click();
 await page.waitForFunction(()=>document.documentElement.dataset.offlineReady==='true',null,{timeout:120000});
 await page.evaluate(()=>localStorage.setItem('app_sound','false'));return {guest:true,offlineReady:true};
}`;
try{
 call('open',origin,'--headed');opened.push(0);step('guest and complete offline pack',guest);
 step('grammar lesson, actual applications and independent storage',`async page=>{
  await page.getByRole('button',{name:'Bài học · Ngữ pháp · Part 1–7'}).click();
  await page.getByText(/311 câu gồm Part 1–7/).waitFor();
  await page.getByRole('button',{name:'Ngữ pháp',exact:true}).click();
  await page.getByLabel('Chuyên đề ngữ pháp').selectOption('grammar-v2-passive');
  await page.getByText(/Khi chủ ngữ nhận tác động/).waitFor();
  await page.getByRole('button',{name:'Luyện chuyên đề này'}).click();
  await page.getByRole('heading',{name:'Ngữ pháp · 1/3',exact:true}).waitFor();
  const draft=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_workplace_draft_v2')));
  const bank=${bank},q=bank.find(q=>q.id===draft.questionIds[0]);
  await page.getByRole('button',{name:String.fromCharCode(65+q.correctIndex)+'. '+q.options[q.correctIndex],exact:true}).click();
  await page.getByRole('button',{name:'Nộp bài',exact:true}).click();
  await page.getByRole('heading',{name:/Kết quả: 1\\/3/}).waitFor();
  const values=await page.evaluate(()=>({legacy:localStorage.getItem('eng_master_practice_records_v1'),extended:JSON.parse(localStorage.getItem('eng_master_extended_practice_v1'))}));
  if(values.legacy!==null||values.extended.length!==1||values.extended[0].kind!=='grammar')throw Error('Storage separation failed');
  return {lessonApplications:3,correct:1,blanks:2,legacyHistoryUntouched:true};
 }`);
 step('practice-only backup v4 accepted, previewed and merged once',`async page=>{
  await page.getByRole('button',{name:'Mở cài đặt'}).click();
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'Xuất JSON',exact:true}).click();
  await(await download).saveAs('output/playwright/content-practice-only.json');
  await page.locator('input[accept="application/json,.json"]').setInputFiles('output/playwright/content-practice-only.json');
  await page.getByRole('dialog',{name:'Kiểm tra dữ liệu trước khi nhập'}).waitFor();
  await page.getByText(/1 kết quả bài luyện trong file/).waitFor();
  await page.getByRole('button',{name:'Xác nhận nhập dữ liệu',exact:true}).click();
  await page.getByText('Đã nhập dữ liệu học tập!',{exact:true}).waitFor();
  const count=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_extended_practice_v1')).length);
  if(count!==1)throw Error('Duplicate import');return {practiceOnlyAccepted:true,mergeDeduplicated:true};
 }`);
 step('Part 6 complete passage group, deadline and reload',`async page=>{
  await page.getByRole('button',{name:'Tổng quan',exact:true}).click();
  await page.getByRole('button',{name:'Bài học · Ngữ pháp · Part 1–7'}).click();
  await page.getByRole('button',{name:'Part 6',exact:true}).click();
  await page.getByLabel('Chọn bài đọc').selectOption('p6-v2-delivery');
  await page.getByLabel('Số câu bài luyện').selectOption('5');
  await page.getByRole('button',{name:'Bài có thời gian',exact:true}).click();
  const draft=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_workplace_draft_v2')));
  if(draft.questionIds.length!==4||draft.deadline-Date.parse(draft.startedAt)!==360000)throw Error('Reading group/deadline failed');
  const bank=${bank};
  for(let i=0;i<4;i++){
    if(i===1){await page.evaluate(()=>document.documentElement.dataset.reloadApproved='true');await page.reload();}
    await page.getByRole('region',{name:'Bài đọc'}).getByText(/Subject: Updated delivery time/).waitFor();
    const q=bank.find(q=>q.id===draft.questionIds[i]);
    if(!q.id.endsWith('-'+(i+1)))throw Error('Passage question order changed');
    await page.getByRole('button',{name:String.fromCharCode(65+q.correctIndex)+'. '+q.options[q.correctIndex],exact:true}).click();
    if(i<3)await page.getByRole('button',{name:'Câu tiếp',exact:true}).click();
  }
  await page.getByRole('button',{name:'Nộp bài',exact:true}).click();
  await page.getByRole('heading',{name:'Kết quả: 4/4 câu đúng',exact:true}).waitFor();
  return {passageQuestions:4,correct:4,deadlineSeconds:360,reload:true};
 }`);
 step('Part 7 multi-document comprehension and notebook exact retry',`async page=>{
  const bank=${bank};
  await page.getByRole('button',{name:'Part 7',exact:true}).click();
  await page.getByLabel('Chọn bài đọc').selectOption('p7-v2-workshop');
  await page.getByRole('button',{name:'Luyện không giới hạn thời gian',exact:true}).click();
  await page.getByRole('region',{name:'Bài đọc'}).getByText(/FRIDAY SCHEDULE/).waitFor();
  const draft=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_workplace_draft_v2')));
  const q=bank.find(q=>q.id===draft.questionIds[0]);
  await page.getByRole('button',{name:String.fromCharCode(65+(q.correctIndex+1)%4)+'. '+q.options[(q.correctIndex+1)%4],exact:true}).click();
  await page.getByRole('button',{name:'Nộp bài',exact:true}).click();
  await page.getByRole('button',{name:'Về tổng quan',exact:true}).click();
  await page.getByRole('button',{name:'Sổ lỗi sai · ôn câu đã làm'}).click();
  await page.getByLabel('Dạng lỗi sai').selectOption('part7');await page.getByLabel('Tìm lỗi sai').fill(q.prompt);
  await page.getByText('1 lần sai · 0 lần bỏ trống',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Làm lại câu này',exact:true}).click();
  await page.getByRole('button',{name:'Bắt đầu bài đã chọn'}).click();
  const retry=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_workplace_draft_v2')));
  if(JSON.stringify(retry.questionIds)!==JSON.stringify([q.id]))throw Error('Exact Part7 retry changed');
  await page.getByRole('button',{name:String.fromCharCode(65+q.correctIndex)+'. '+q.options[q.correctIndex],exact:true}).click();
  await page.getByRole('button',{name:'Nộp bài',exact:true}).click();
  await page.getByRole('button',{name:'Về tổng quan',exact:true}).click();
  await page.getByRole('button',{name:'Sổ lỗi sai · ôn câu đã làm'}).click();
  await page.getByLabel('Trạng thái lỗi sai').selectOption('resolved');await page.getByLabel('Tìm lỗi sai').fill(q.prompt);
  await page.getByRole('button',{name:'Làm lại câu này',exact:true}).waitFor();
  return {multipleDocuments:true,exactQuestionResolved:true};
 }`);
 step('topic recommendations open a matching reading practice',`async page=>{
  await page.getByRole('button',{name:'Thống kê',exact:true}).click();
  const row=page.getByRole('row').filter({hasText:'Part 7 · Hội thảo'});
  await row.getByRole('button',{name:'Ôn chủ điểm'}).click();
  await page.getByRole('button',{name:'Bắt đầu bài đã chọn'}).click();
  await page.getByRole('heading',{name:'Part 7 · 1/3',exact:true}).waitFor();
  const draft=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_workplace_draft_v2')));
  if(!draft.questionIds.every(id=>id.startsWith('p7-v2-workshop-')))throw Error('Wrong recommendation topic');
  return {topicRecommendation:true,kind:'part7'};
 }`);
 step('new passage reload offline and mobile layout',`async page=>{
  await page.context().setOffline(true);
  await page.evaluate(()=>document.documentElement.dataset.reloadApproved='true');await page.reload();
  await page.getByRole('region',{name:'Bài đọc'}).getByText(/FRIDAY SCHEDULE/).waitFor();
  for(const width of [360,390,768,1280]){await page.setViewportSize({width,height:900});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Overflow '+width);}
  await page.setViewportSize({width:390,height:900});await page.screenshot({path:'output/playwright/content-reading-mobile.png',fullPage:true});
  await page.context().setOffline(false);
  await page.getByRole('button',{name:'Tạm dừng',exact:true}).click();
  await page.getByRole('button',{name:'Mở cài đặt'}).click();
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'Xuất JSON',exact:true}).click();await(await download).saveAs('output/playwright/content-full-backup.json');
  return {offlineReading:true,widths:[360,390,768,1280],noOverflow:true};
 }`);
 active=1;call('open',origin,'--headed');opened.push(1);step('clean browser guest',guest);
 step('restore v4 into a clean browser without fabricating vocabulary progress',`async page=>{
  await page.getByRole('button',{name:'Mở cài đặt'}).click();
  await page.locator('input[accept="application/json,.json"]').setInputFiles('output/playwright/content-full-backup.json');
  await page.getByRole('radio',{name:/Thay thế tiến độ hiện tại/}).check();
  await page.getByRole('button',{name:'Xác nhận nhập dữ liệu',exact:true}).click();
  await page.getByText('Đã nhập dữ liệu học tập!',{exact:true}).waitFor();
  const records=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_extended_practice_v1')));
  if(records.length!==4||!['grammar','part6','part7'].every(kind=>records.some(r=>r.kind===kind)))throw Error('Extended results lost on clean restore');
  await page.getByRole('button',{name:'Tổng quan',exact:true}).click();
  await page.getByRole('button',{name:'Sổ lỗi sai · ôn câu đã làm'}).click();
  await page.getByLabel('Dạng lỗi sai').selectOption('grammar');await page.getByRole('button',{name:'Làm lại câu này',exact:true}).first().waitFor();
  return {restoredResults:4,mistakesRestored:true};
 }`);
 const backup=JSON.parse(fs.readFileSync('output/playwright/content-full-backup.json','utf8'));
 if(backup.version!==4||Object.keys(backup.progress).length||backup.extendedPracticeRecords.length!==4)throw Error('Invalid extended-only exported backup');
 report.passed=true;
}finally{
 for(const index of opened){active=index;try{call('close');}catch{}}
 fs.mkdirSync('output/verification',{recursive:true});fs.writeFileSync('output/verification/browser-learning-content.json',JSON.stringify(report,null,2)+'\n');
}
console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,origin}));
