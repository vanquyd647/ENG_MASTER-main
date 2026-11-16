// Guest UI/popup cancellation QA on local or the approved production domain.
// Uses an isolated browser; does not authenticate a real Google account.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const base = process.argv[2] || 'http://localhost:3110';
if (!['localhost', '127.0.0.1', 'eng-master-main2.vercel.app'].includes(new URL(base).hostname)) throw Error('Unapproved guest QA origin');
const session = 'guest-login-' + Date.now();
const cli = process.env.PLAYWRIGHT_CLI || 'playwright-cli';
const call = (...args) => {
  const result = spawnSync(cli, ['-s=' + session, ...args], { encoding: 'utf8', maxBuffer: 3e6 });
  if (result.status !== 0 || result.stdout.includes('### Error')) throw Error(result.stdout + result.stderr);
  return result.stdout;
};
const report = { checkedAt: new Date().toISOString(), origin: base, checks: [], googleAccountAuthenticated: false };
let opened = false;
try {
  call('open', base); opened = true; call('snapshot');
  call('run-code', `async(page)=>{await page.getByRole('button',{name:'Tiếp tục với tư cách Khách'}).click();await page.getByRole('button',{name:'Bắt đầu',exact:true}).click();await page.getByRole('button',{name:'Đăng nhập để đồng bộ',exact:true}).waitFor();await page.evaluate(()=>localStorage.setItem('app_sound','false'));return {guestLoginVisible:true};}`);
  report.checks.push('direct login CTA visible after entering guest');
  call('snapshot');
  call('run-code', `async(page)=>{for(const width of [360,390,768,1280]){await page.setViewportSize({width,height:900});await page.getByRole('button',{name:'Đăng nhập để đồng bộ',exact:true}).scrollIntoViewIfNeeded();if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('horizontal overflow '+width);await page.screenshot({path:'output/playwright/guest-login-'+width+'.png',fullPage:true});}await page.getByRole('button',{name:'Mở cài đặt'}).click();await page.getByRole('button',{name:'Đăng nhập để đồng bộ',exact:true}).waitFor();return {responsiveWidths:[360,390,768,1280],visibleInSettings:true};}`);
  report.checks.push('CTA visible in Settings and no horizontal overflow at 360/390/768/1280px');
  call('snapshot');
  call('run-code', `async(page)=>{await page.getByRole('button',{name:'Tổng quan',exact:true}).click();await page.getByRole('button',{name:'Học từ mới (15)'}).click();await page.getByRole('button',{name:'Mặt trước thẻ từ. Nhấn để xem nghĩa'}).click();await page.getByRole('button',{name:'Tốt',exact:true}).click();await page.getByRole('heading',{name:'applicant',exact:true}).waitFor();page.once('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'Tổng quan',exact:true}).click();return {guestGraded:true};}`);
  call('snapshot');
  call('run-code', `async(page)=>{const before=await page.evaluate(()=>({profile:localStorage.getItem('guest_profile'),progress:localStorage.getItem('guest_progress')}));const popupReady=page.waitForEvent('popup');await page.getByRole('button',{name:'Đăng nhập để đồng bộ',exact:true}).click();const popup=await popupReady;await page.getByText('Hoàn tất đăng nhập trong cửa sổ Google. Dữ liệu trên thiết bị đang được giữ nguyên.').waitFor();await popup.close();await page.getByRole('button',{name:'Đăng nhập để đồng bộ',exact:true}).waitFor();await page.waitForFunction(()=>!document.querySelector('[role="status"]')?.textContent?.includes('Hoàn tất đăng nhập'));const after=await page.evaluate(()=>({profile:localStorage.getItem('guest_profile'),progress:localStorage.getItem('guest_progress'),active:localStorage.getItem('guest_session_active')}));if(after.active!=='true'||before.profile!==after.profile||before.progress!==after.progress)throw Error('Popup cancellation changed guest data');await page.getByRole('button',{name:'Tiếp tục',exact:true}).click();await page.getByRole('heading',{name:'applicant',exact:true}).waitFor();return {popupOpenedAndCancelled:true,guestDataUnchanged:true,draftResumed:true};}`);
  report.checks.push('Google popup opens; closing it preserves guest profile/progress and resumable draft');
  report.passed = true;
} finally {
  if (opened) call('close');
  fs.mkdirSync('output/verification', { recursive: true });
  fs.writeFileSync('output/verification/browser-guest-login.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
}
