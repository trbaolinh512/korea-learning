import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base='http://127.0.0.1:5173';
const noOverflow=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile overflow');
try {
  await page.goto(`${base}/#hangul`);await page.getByRole('button',{name:'Trắc nghiệm',exact:true}).click();
  await page.clock.install({time:new Date('2026-11-18T12:00:00Z')});await page.clock.pauseAt(new Date('2026-11-18T12:00:01Z'));await page.getByRole('button',{name:'Cài đặt luyện tập'}).click();
  await page.getByRole('spinbutton',{name:'Thời gian mỗi câu'}).fill('10');await page.getByRole('button',{name:'Xong',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.alphabet-quiz .timer')?.textContent==='10s');assert.equal(await page.locator('.feedback').count(),0);
  await page.clock.runFor(10000);await page.getByRole('status').filter({hasText:'Hết thời gian'}).waitFor();
  await page.clock.runFor(1000);await page.waitForFunction(()=>document.querySelector('.alphabet-quiz .badge')?.textContent.includes('Câu 2'));
  await page.waitForFunction(()=>document.querySelector('.alphabet-quiz .timer')?.textContent==='10s');assert.equal(await page.locator('.feedback').count(),0);
  await page.clock.resume();
  await page.getByRole('button',{name:'Luyện TOPIK',exact:true}).click();
  for(const tab of ['Ngữ pháp','Luyện viết','Nghe','Đọc']){await page.getByRole('button',{name:tab,exact:true}).click();await noOverflow()}
  await page.getByRole('button',{name:'Thi thử',exact:true}).click();
  await page.getByRole('button',{name:/Toàn bộ/}).click();await page.getByRole('button',{name:'Bắt đầu làm bài',exact:true}).click();
  const counts=await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('korea-exam-v1'));return [s.questions.filter(q=>q.kind==='listen').length,s.questions.filter(q=>q.kind==='read').length]});assert.deepEqual(counts,[30,40]);
  // Seed an expired session with correct listening answers and no reading answers.
  await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('korea-exam-v1'));s.endAt=Date.now()-1000;s.questions.forEach((q,i)=>{if(q.kind==='listen')s.answers[i]=q.answer});localStorage.setItem('korea-exam-v1',JSON.stringify(s))});
  await page.reload();await page.getByRole('heading',{name:'Kết quả bài thi'}).waitFor();assert.match(await page.locator('.exam-results').innerText(),/100\/200/);await noOverflow();
  const history=await page.evaluate(()=>JSON.parse(localStorage.getItem('korea-progress-v1')).attempts.filter(a=>a.score!==undefined));assert.equal(history.length,1);assert.equal(history[0].score,100);
  await page.reload();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('korea-progress-v1')).attempts.filter(a=>a.score!==undefined).length),1);
  // Validate file import failure, then valid restoration.
  const upload=page.locator('input[type=file]');
  await upload.setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"version":1,"progress":{"day":99}}')});await page.getByRole('status').filter({hasText:'không hợp lệ'}).waitFor();
  const progress={day:22,completed:[1,2],learned:['word-저'],attempts:[],writing:{'22:0':'안녕'}};
  await upload.setInputFiles({name:'valid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:1,progress}))});await page.getByRole('status').filter({hasText:'Đã khôi phục'}).waitFor();
  await page.getByRole('button',{name:'Luyện TOPIK',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Ngày 22',exact:true}).getAttribute('aria-current'),'step');
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'Xuất tiến độ',exact:true}).click();assert.equal((await download).suggestedFilename(),'hangeul-tien-do.json');
  await page.setViewportSize({width:320,height:740});await noOverflow();
  for(const route of ['home','hangul','exam']){await page.goto(`${base}/#${route}`);await page.locator('main h1').waitFor();await noOverflow()}
  assert.deepEqual(errors,[]);console.log('PASS: timed quiz expiration/reset, all mobile study tabs, 70-question split, expired-exam auto-submit and scoring, no duplicate history, import rejection/restoration, export, 320px layouts.');
} finally {await browser.close()}



