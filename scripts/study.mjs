import {chromium} from '@playwright/test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const curriculum=JSON.parse(fs.readFileSync('src/data/study-curriculum.json','utf8'));
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{window.spoken=[];Object.defineProperty(window,'SpeechSynthesisUtterance',{value:class{constructor(text){this.text=text}}});Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},getVoices(){return [{lang:'ko-KR'}]},speak(u){window.spoken.push(u.text)}}})});
const clickTab=name=>page.getByRole('button',{name,exact:true}).click();
const noOverflow=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow');
const grid=async()=>{const boxes=await page.locator('.word-quiz .option').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y}}));assert.equal(boxes.length,4);assert.equal(boxes[0].y,boxes[1].y);assert.equal(boxes[2].y,boxes[3].y);assert.ok(boxes[0].x<boxes[1].x)};
const draw=async()=>{const r=await page.locator('canvas').boundingBox();await page.mouse.move(r.x+20,r.y+25);await page.mouse.down();await page.mouse.move(r.x+80,r.y+60,{steps:4});await page.mouse.up()};
try{
  await page.goto('http://127.0.0.1:5173/#study');await page.locator('.flashcard').first().waitFor();
  await page.clock.install({time:new Date('2026-11-14T12:00:00Z')});await page.clock.pauseAt(new Date('2026-11-14T12:00:01Z'));
  assert.equal(await page.locator('.day-grid button').count(),60);assert.equal(await page.locator('.flashcard').count(),10);assert.equal(await page.getByRole('button',{name:'Kết quả',exact:true}).count(),0);assert.equal(await page.locator('.quiz-panel').count(),0);
  await page.getByRole('button',{name:'Lật thẻ 저',exact:true}).click();assert.equal(await page.evaluate(()=>window.spoken.at(-1)),'저');
  await clickTab('Ẩn lộ trình');assert.equal(await page.locator('.day-sidebar').count(),0);await page.reload();await page.getByRole('button',{name:'Hiện lộ trình',exact:true}).waitFor();await clickTab('Hiện lộ trình');
  await clickTab('Ngữ pháp');assert.equal(await page.locator('.explained-example').count(),2);assert.equal(await page.locator('.example-analysis').count(),2);assert.equal(await page.locator('.options').count(),0);await page.screenshot({path:'test-results/grammar-new-desktop.png',fullPage:true,animations:'disabled'});
  await clickTab('Luyện viết');assert.equal(await page.getByRole('button',{name:'Hoàn tác',exact:true}).count(),0);assert.equal(await page.getByRole('button',{name:'Câu tiếp',exact:true}).count(),0);
  const words=curriculum.days[0].words;let requests=[],responseMode='wrong';
  await page.route('https://inputtools.google.com/**',async route=>{requests.push(route.request().postDataJSON());const meaning=await page.locator('.writing-prompt h2').innerText(),target=words.find(w=>w.viet===meaning);await route.fulfill({json:['SUCCESS',[['ko',[responseMode==='correct'?target.char:responseMode==='partial'?target.char.slice(0,-1):'???']]]]})});
  await draw();await page.clock.runFor(5000);assert.equal(requests.length,0);await clickTab('Kiểm tra');await page.getByRole('status').filter({hasText:'Chưa chính xác'}).waitFor();assert.equal(requests.length,1);assert.ok(requests[0].requests[0].writing_guide.width>=384);await page.clock.runFor(2000);assert.match(await page.locator('.alphabet-writing .badge').innerText(),/Từ 1 ·/);
  responseMode='correct';await clickTab('Kiểm tra');await page.getByRole('status').filter({hasText:'Chính xác'}).waitFor();await page.clock.runFor(999);assert.match(await page.locator('.alphabet-writing .badge').innerText(),/Từ 1 ·/);await page.clock.runFor(1);assert.match(await page.locator('.alphabet-writing .badge').innerText(),/Từ 2 ·/);
  await clickTab('Cài đặt luyện tập');await page.getByRole('checkbox',{name:'Hiện nút Câu tiếp'}).check();await page.getByRole('spinbutton',{name:'Thời gian tự chuyển chữ'}).fill('2');await clickTab('Xong');await clickTab('Câu tiếp');assert.match(await page.locator('.alphabet-writing .badge').innerText(),/Từ 3 ·/);
  for(let i=0;i<10;i++){const meaning=await page.locator('.writing-prompt h2').innerText();if(words.find(w=>w.viet===meaning)?.char.length>1)break;await clickTab('Câu tiếp')}
  const beforePartial=await page.locator('.alphabet-writing .badge').innerText();responseMode='partial';await draw();await clickTab('Kiểm tra');await page.getByRole('status').filter({hasText:'Chưa chính xác'}).waitFor();await page.clock.runFor(3000);assert.equal(await page.locator('.alphabet-writing .badge').innerText(),beforePartial,'a partial word must not pass');
  await clickTab('Nghe');await grid();const seen=new Set();
  for(let i=1;i<=12;i++){
    await page.clock.runFor(100);const ko=await page.evaluate(()=>window.spoken.at(-1));const target=words.find(w=>w.char===ko);assert.ok(target,'listening plays only a word from today');if(i<=10){assert.ok(!seen.has(ko),'no repeats inside a listening cycle');seen.add(ko)}
    const choices=await page.locator('.option > span:nth-child(2)').allTextContents();await page.locator('.option').nth(i===1?choices.findIndex(x=>x!==target.viet):choices.indexOf(target.viet)).click();await page.clock.runFor(1000);assert.match(await page.locator('.word-quiz .badge').innerText(),new RegExp(`Câu ${i+1} ·`));
  }
  await clickTab('Đọc');await grid();const directions=new Set();
  for(let i=0;i<20;i++){
    const prompt=await page.locator('.word-quiz-prompt').innerText(),lang=await page.locator('.word-quiz-prompt').getAttribute('lang');directions.add(lang);const target=words.find(w=>lang==='ko'?w.char===prompt:w.viet===prompt);assert.ok(target);const choices=await page.locator('.option > span:nth-child(2)').allTextContents();await page.locator('.option').nth(choices.indexOf(lang==='ko'?target.viet:target.char)).click();await page.clock.runFor(1000);
  }assert.deepEqual([...directions].sort(),['ko','vi']);
  await clickTab('Cài đặt luyện tập');await page.getByRole('spinbutton',{name:'Thời gian mỗi câu'}).fill('10');await page.getByRole('checkbox',{name:'Hiện nút Câu tiếp'}).check();await clickTab('Xong');await page.clock.runFor(10000);await page.getByRole('status').filter({hasText:'Hết thời gian'}).waitFor();await page.clock.runFor(1000);await clickTab('Câu tiếp');
  for(const width of [390,320]){await page.setViewportSize({width,height:844});for(const tab of ['Từ vựng','Ngữ pháp','Luyện viết','Nghe','Đọc']){await clickTab(tab);await noOverflow();if(tab==='Nghe'||tab==='Đọc')await grid()}await page.screenshot({path:`test-results/study-new-${width}.png`,fullPage:true,animations:'disabled'})}
  await page.getByRole('button',{name:'Ngày 60',exact:true}).click();assert.equal(await page.locator('.flashcard').count(),10);await clickTab('Ngữ pháp');assert.match(await page.locator('.grammar-card').innerText(),/Ngày 60\/60/);await noOverflow();
  assert.deepEqual(errors,[]);console.log('PASS: 60-day source-based roadmap, 10 cards/day, explained grammar, no embedded practice/results tab, persisted sidebar toggle, handwriting only on Check and correct auto-next, settings, 12 listening and 20 mixed-direction reading questions, wrong/timeout auto-next, 2x2 options and mobile layouts.');
}finally{await browser.close()}
