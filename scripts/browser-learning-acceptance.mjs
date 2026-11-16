// CLI-first acceptance with an isolated guest profile; no real account or credentials.
// Usage: PLAYWRIGHT_CLI=/path/to/playwright-cli node --import tsx scripts/browser-learning-acceptance.mjs http://localhost:3110
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { ALL_PRACTICE_QUESTIONS as PRACTICE_BANK } from '../src/data/learningContent.ts';
const base = process.argv[2] || 'http://localhost:3110';
if (!['localhost', '127.0.0.1', 'eng-master-main2.vercel.app'].includes(new URL(base).hostname)) throw Error('Unapproved QA origin');
const cli = process.env.PLAYWRIGHT_CLI || 'playwright-cli';
const session = 'learning-acceptance-' + Date.now();
const report = { checkedAt: new Date().toISOString(), origin: base, passed: false, checks: [] };
const call = (...args) => {
  const result = spawnSync(cli, ['-s=' + session, ...args], { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
  if (result.status || result.stdout.includes('### Error')) throw Error(result.stdout + result.stderr);
  return result.stdout;
};
const step = (name, code) => {
  call('snapshot');
  const output = call('run-code', `async page=>{try{return await (${code})(page);}catch(error){await page.screenshot({path:'output/playwright/learning-failure.png',fullPage:true});throw error;}}`);
  const match = output.match(/### Result\s*\n([\s\S]*?)(?:\n###|$)/);
  if (!match) throw Error('Missing completion result for ' + name + ': ' + output);
  report.checks.push({ name, result: JSON.parse(match[1]) });
};
const bank = JSON.stringify(PRACTICE_BANK);
try {
  call('open', base, '--headed');
  step('guest + offline pack', `async page => {
    await page.addInitScript(()=>{window.confirm=()=>true;});
    await page.evaluate(()=>{window.confirm=()=>true;});
    await page.getByRole('button',{name:'Tiếp tục với tư cách Khách'}).click();
    await page.getByRole('button',{name:'Bắt đầu',exact:true}).click();
    await page.waitForFunction(()=>document.documentElement.dataset.offlineReady==='true');
    await page.evaluate(()=>localStorage.setItem('app_sound','false'));
    return {offlineReady:true};
  }`);
  step('practice filter and draft reload', `async page => {
    const bank=${bank};
    await page.getByRole('button',{name:'Bài học · Ngữ pháp · Part 1–7'}).click();
    await page.getByRole('button',{name:'Part 5',exact:true}).click();
    await page.getByLabel('Chủ điểm bài luyện').selectOption('Giới từ');
    await page.getByLabel('Số câu bài luyện').selectOption('5');
    await page.getByRole('button',{name:'Luyện không giới hạn thời gian'}).click();
    const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_workplace_draft_v2')));
    if(!before.questionIds.length||before.questionIds.some(id=>bank.find(q=>q.id===id)?.topic!=='Giới từ'))throw Error('Topic filter failed');
    await page.getByRole('button',{name:/^A\\. /}).click();
    await page.evaluate(()=>document.documentElement.dataset.reloadApproved='true');await page.reload();
    const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_workplace_draft_v2')));
    if(JSON.stringify(before.questionIds)!==JSON.stringify(after.questionIds)||after.answers[after.questionIds[0]]!==0)throw Error('Draft changed');
    const q=bank.find(q=>q.id===after.questionIds[0]);
    await page.getByRole('button',{name:String.fromCharCode(65+(q.correctIndex+1)%4)+'. '+q.options[(q.correctIndex+1)%4],exact:true}).click();
    await page.getByRole('button',{name:'Nộp bài',exact:true}).click();
    await page.getByRole('heading',{name:/Kết quả:/}).waitFor();
    return {topic:'Giới từ',questions:after.questionIds.length,answerAndOrderRestored:true};
  }`);
  step('shared notebook exact retry and resolution', `async page => {
    const bank=${bank};
    const record=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_extended_practice_v1'))[0]);
    const q=bank.find(q=>q.id===record.answers[0].questionId);
    await page.getByRole('button',{name:'Về tổng quan',exact:true}).click();
    await page.getByRole('button',{name:'Sổ lỗi sai · ôn câu đã làm'}).click();
    await page.getByLabel('Dạng lỗi sai').selectOption('part5');
    await page.getByLabel('Tìm lỗi sai').fill(q.prompt);
    await page.getByRole('button',{name:'Làm lại câu này',exact:true}).click();
    await page.getByRole('button',{name:'Bắt đầu bài đã chọn'}).click();
    const draft=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_workplace_draft_v2')));
    if(JSON.stringify(draft.questionIds)!==JSON.stringify([q.id]))throw Error('Exact retry changed question');
    await page.getByRole('button',{name:String.fromCharCode(65+q.correctIndex)+'. '+q.options[q.correctIndex],exact:true}).click();
    await page.getByRole('button',{name:'Nộp bài',exact:true}).click();
    await page.getByRole('button',{name:'Về tổng quan',exact:true}).click();
    await page.getByRole('button',{name:'Sổ lỗi sai · ôn câu đã làm'}).click();
    await page.getByLabel('Trạng thái lỗi sai').selectOption('resolved');
    await page.getByLabel('Tìm lỗi sai').fill(q.prompt);
    await page.getByRole('button',{name:'Làm lại câu này',exact:true}).waitFor();
    return {questionId:q.id,resolved:true};
  }`);
  step('exact vocabulary retry preserves the original mistake identity', `async page => {
    await page.getByRole('button',{name:'Kiểm tra',exact:true}).first().click();
    await page.getByLabel('Số câu',{exact:true}).selectOption('5');
    await page.getByRole('button',{name:'Bắt đầu điền từ trong câu'}).click();
    for(let i=0;i<5;i++){
      await page.waitForFunction(()=>{const input=document.getElementById('quiz-answer');return input&&!input.disabled;});
      const answer=await page.evaluate(async()=>{
        const db=await new Promise(resolve=>{const r=indexedDB.open('eng-master-local-v1');r.onsuccess=()=>resolve(r.result);});
        const draft=await new Promise(resolve=>{const r=db.transaction('drafts').objectStore('drafts').get('guest:quiz');r.onsuccess=()=>resolve(r.result.draft);});db.close();return draft.questions[draft.cursor].answer;
      });
      await page.locator('#quiz-answer').fill(i>1?' '+answer+' ':'qa-wrong-answer');
      await page.getByRole('button',{name:'Kiểm tra đáp án',exact:true}).click();
      await page.getByRole('button',{name:i===4?'Xem kết quả':'Câu tiếp theo',exact:true}).click();
    }
    await page.getByRole('heading',{name:'Kết quả bài thi'}).waitFor();
    const original=await page.evaluate(async()=>{
      const db=await new Promise(resolve=>{const r=indexedDB.open('eng-master-local-v1');r.onsuccess=()=>resolve(r.result);});
      const events=await new Promise(resolve=>{const r=db.transaction('events').objectStore('events').index('owner').getAll('guest');r.onsuccess=()=>resolve(r.result);});db.close();return events.map(e=>e.event).find(e=>e.correct===false);
    });
    await page.getByRole('button',{name:'Về tổng quan',exact:true}).click();
    await page.getByRole('button',{name:'Sổ lỗi sai · ôn câu đã làm'}).click();
    await page.getByLabel('Dạng lỗi sai').selectOption('spelling');
    await page.getByLabel('Tìm lỗi sai').fill(original.attempt.word);
    await page.getByRole('button',{name:'Làm lại câu này',exact:true}).click();
    await page.getByRole('button',{name:'Bắt đầu làm lại câu',exact:true}).click();
    await page.getByText(original.attempt.questionText,{exact:true}).waitFor();
    await page.locator('#quiz-answer').fill(original.attempt.correctAnswer);
    await page.getByRole('button',{name:'Kiểm tra đáp án',exact:true}).click();
    await page.getByRole('button',{name:'Xem kết quả',exact:true}).click();
    const checked=await page.evaluate(async original=>{
      const db=await new Promise(resolve=>{const r=indexedDB.open('eng-master-local-v1');r.onsuccess=()=>resolve(r.result);});
      const rows=await new Promise(resolve=>{const r=db.transaction('events').objectStore('events').index('owner').getAll('guest');r.onsuccess=()=>resolve(r.result);});db.close();
      return rows.map(r=>r.event).filter(e=>e.attempt?.questionId===original.attempt.questionId&&e.wordId===original.wordId&&e.mode===original.mode).map(e=>e.correct);
    },original);
    if(checked.length!==2||!checked.includes(true)||!checked.includes(false))throw Error('Original question was not resolved by retry');
    await page.getByRole('button',{name:'Về tổng quan',exact:true}).click();
    await page.getByRole('button',{name:'Sổ lỗi sai · ôn câu đã làm'}).click();
    return {sameQuestionId:true,wrongAndCorrectAttempts:checked.length};
  }`);
  step('today flow resumes without repeating a rated card', `async page => {
    await page.getByRole('button',{name:'Về tổng quan',exact:true}).click();
    await page.getByRole('button',{name:'Mở Học hôm nay'}).click();
    await page.getByRole('button',{name:'Lập phiên Học hôm nay'}).click();
    const plannedSteps=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_today_learning_v1')).steps);
    const firstCount=plannedSteps[0].wordIds.length;
    await page.getByRole('button',{name:/Tiếp tục: (Học|Ôn)/}).click();
    await page.getByRole('button',{name:'Mặt trước thẻ từ. Nhấn để xem nghĩa'}).click();
    await page.getByRole('button',{name:'Tốt',exact:true}).click();
    await page.getByRole('button',{name:'Mặt trước thẻ từ. Nhấn để xem nghĩa'}).waitFor();
    const word=await page.getByRole('button',{name:'Mặt trước thẻ từ. Nhấn để xem nghĩa'}).locator('h1').textContent();
    await page.evaluate(()=>document.documentElement.dataset.reloadApproved='true');await page.reload();
    await page.getByRole('button',{name:/Tiếp tục: (Học|Ôn)/}).click();
    await page.getByRole('button',{name:'Mặt trước thẻ từ. Nhấn để xem nghĩa'}).waitFor();
    if(await page.getByRole('button',{name:'Mặt trước thẻ từ. Nhấn để xem nghĩa'}).locator('h1').textContent()!==word)throw Error('Wrong resumed card');
    for(let i=0;i<firstCount-1;i++){
      await page.getByRole('button',{name:'Mặt trước thẻ từ. Nhấn để xem nghĩa'}).click();
      await page.getByRole('button',{name:'Tốt',exact:true}).click();
      if(i<firstCount-2)await page.getByRole('button',{name:'Mặt trước thẻ từ. Nhấn để xem nghĩa'}).waitFor();
    }
    for(const step of plannedSteps.slice(1)){
      if(step.kind==='practice')continue;
      if(step.kind==='mistake'){
        await page.getByRole('button',{name:/Tiếp tục: Làm lại/}).click();
        await page.getByRole('button',{name:'Bắt đầu làm lại câu',exact:true}).click();
        await page.locator('#quiz-answer').fill(step.mistake.attempt.correctAnswer);
        await page.getByRole('button',{name:'Kiểm tra đáp án',exact:true}).click();
        await page.getByRole('button',{name:'Xem kết quả',exact:true}).click();
        continue;
      }
      await page.getByRole('button',{name:/Tiếp tục: (Học|Ôn)/}).click();
      for(let i=0;i<step.wordIds.length;i++){
        await page.getByRole('button',{name:'Mặt trước thẻ từ. Nhấn để xem nghĩa'}).click();
        await page.getByRole('button',{name:'Tốt',exact:true}).click();
        if(i<step.wordIds.length-1)await page.getByRole('button',{name:'Mặt trước thẻ từ. Nhấn để xem nghĩa'}).waitFor();
      }
    }
    await page.getByRole('button',{name:/Tiếp tục: Luyện/}).waitFor();
    const plan=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_today_learning_v1')));
    if(!plan.steps.find(s=>s.kind==='new')?.done)throw Error('Step not completed');
    return {resumedWord:word,reviewStepComplete:true};
  }`);
  step('today practice complete + topic statistics', `async page => {
    const bank=${bank};
    await page.getByRole('button',{name:/Tiếp tục: Luyện/}).click();
    await page.getByRole('button',{name:'Bắt đầu bài đã chọn'}).click();
    const draft=await page.evaluate(()=>JSON.parse(localStorage.getItem('eng_master_workplace_draft_v2')));
    for(let i=0;i<draft.questionIds.length;i++){
      const q=bank.find(q=>q.id===draft.questionIds[i]);
      await page.getByRole('button',{name:String.fromCharCode(65+q.correctIndex)+'. '+q.options[q.correctIndex],exact:true}).click();
      if(i<draft.questionIds.length-1)await page.getByRole('button',{name:'Câu tiếp',exact:true}).click();
    }
    await page.getByRole('button',{name:'Nộp bài',exact:true}).click();
    await page.getByText('Đã hoàn thành phiên Học hôm nay.',{exact:true}).waitFor();
    await page.getByRole('button',{name:'Thống kê',exact:true}).click();
    await page.getByRole('heading',{name:/Bài luyện theo chủ điểm/}).waitFor();
    return {todayComplete:true,topicStatsVisible:true};
  }`);
  step('offline first-visit routes + mobile overflow', `async page => {
    await page.context().setOffline(true);
    for(const route of ['#mistakes','#workplace','#today','#stats']){
      await page.evaluate(route=>location.hash=route,route);
      await page.waitForTimeout(400);
      for(const width of [360,390,768,1280]){
        await page.setViewportSize({width,height:900});
        if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Overflow '+route+' '+width);
      }
    }
    await page.evaluate(()=>location.hash='#workplace');await page.getByRole('button',{name:'Nghe hội thoại',exact:true}).first().click();
    await page.getByRole('button',{name:'Hiện transcript và bản dịch'}).click();
    await page.getByRole('button',{name:'Nghe câu 1',exact:true}).waitFor();
    await page.setViewportSize({width:390,height:900});
    await page.screenshot({path:'output/playwright/learning-dialogue-mobile.png',fullPage:true});
    await page.context().setOffline(false);
    return {offlineRoutes:4,widths:[360,390,768,1280],overflow:false};
  }`);
  step('actual offline sentence playback, repeat and stop', `async page => {
    await page.context().setOffline(true);
    await page.evaluate(()=>location.hash='#workplace');
    await page.getByRole('button',{name:'Nghe hội thoại',exact:true}).first().click();
    const show=page.getByRole('button',{name:'Hiện transcript và bản dịch'});
    if(await show.count())await show.click();
    await page.waitForFunction(()=>speechSynthesis.getVoices().some(v=>v.localService&&/^en[-_]/i.test(v.lang)));
    await page.evaluate(()=>{
      window.__learningAudio=[];
      const original=speechSynthesis.speak.bind(speechSynthesis);
      speechSynthesis.speak=utterance=>{
        const row={local:utterance.voice?.localService===true,started:false,ended:false};window.__learningAudio.push(row);
        utterance.addEventListener('start',()=>row.started=true);utterance.addEventListener('end',()=>row.ended=true);
        return original(utterance);
      };
    });
    await page.getByLabel('Tốc độ hội thoại').selectOption('1.1');
    await page.getByLabel('Số lần lặp').selectOption('3');
    await page.getByRole('button',{name:'Nghe câu 1',exact:true}).click();
    await page.waitForFunction(()=>window.__learningAudio.length===3&&window.__learningAudio.every(row=>row.local&&row.started&&row.ended),undefined,{timeout:60000});
    await page.getByText('Chưa phát hoặc đã dừng.',{exact:true}).waitFor();
    await page.getByRole('button',{name:'Nghe câu 2',exact:true}).click();
    await page.getByRole('button',{name:'Dừng âm thanh',exact:true}).click();
    await page.getByText('Chưa phát hoặc đã dừng.',{exact:true}).waitFor();
    await page.context().setOffline(false);
    return {localVoice:true,sentenceRepeated:3,startedAndEnded:true,stop:true};
  }`);
  report.passed = true;
} finally {
  fs.mkdirSync('output/verification', { recursive: true });
  fs.writeFileSync('output/verification/browser-learning-acceptance.json', JSON.stringify(report, null, 2));
  try { call('close'); } catch {}
}
console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,origin:base}));
