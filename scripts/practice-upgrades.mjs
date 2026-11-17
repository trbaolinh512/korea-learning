import {chromium} from '@playwright/test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const drills=JSON.parse(fs.readFileSync('src/data/grammar-drills.json','utf8'));
const curriculum=JSON.parse(fs.readFileSync('src/data/study-curriculum.json','utf8'));
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{Object.defineProperty(window,'SpeechSynthesisUtterance',{value:class{constructor(text){this.text=text}}});Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},getVoices(){return [{lang:'ko-KR'}]},speak(){}}})});
  const button=name=>page.getByRole('button',{name,exact:true}).click();
  const noOverflow=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.goto('http://127.0.0.1:5173/#study');await page.locator('.flashcard').first().waitFor();
  await page.clock.install();await page.clock.pauseAt(new Date());
  await page.locator('.card-face').first().click();assert.equal(await page.locator('.card-romaja').first().innerText(),'/jeo/');
  const link=new URL(await page.getByRole('link',{name:'Tra 저 trên Papago',exact:true}).getAttribute('href'));assert.equal(link.searchParams.get('st'),'저');
  await button('Ngữ pháp');await button('Luyện tập ngữ pháp');await page.getByRole('combobox',{name:'Chế độ luyện ngữ pháp'}).selectOption('typing');
  const input=page.getByLabel('Câu trả lời tiếng Hàn');
  const questionId=await page.locator('.grammar-typing-quiz').getAttribute('data-question-id'),answer=drills.find(e=>e.id===questionId).ko;
  assert.equal(await page.locator('.grammar-typing-quiz .feedback').count(),0);
  await input.fill(answer);await input.dispatchEvent('compositionstart');await input.press('Enter');assert.equal(await page.locator('.grammar-typing-quiz .feedback').count(),0);
  await input.dispatchEvent('compositionend');await input.press('Enter');await page.getByRole('status').filter({hasText:'Chính xác!'}).waitFor();
  await page.clock.runFor(999);assert.match(await page.locator('.grammar-typing-quiz .badge').innerText(),/Câu 1/);await page.clock.runFor(1);assert.match(await page.locator('.grammar-typing-quiz .badge').innerText(),/Câu 2/);
  await input.fill('틀린 문장');await button('Kiểm tra câu');await page.getByRole('status').filter({hasText:'Chưa khớp đáp án mẫu'}).waitFor();await page.clock.runFor(1000);assert.match(await page.locator('.grammar-typing-quiz .badge').innerText(),/Câu 3/);
  await button('Cài đặt luyện tập');await page.getByRole('spinbutton',{name:'Thời gian tự chuyển câu'}).fill('0');await button('Xong');assert.equal(await page.getByRole('button',{name:'Câu tiếp',exact:true}).count(),1);
  await button('Xem câu mẫu');await page.clock.runFor(5000);assert.match(await page.locator('.grammar-typing-quiz .badge').innerText(),/Câu 3/);await button('Câu tiếp');
  await page.getByRole('button',{name:'Ngày 56',exact:true}).click();await button('Ngữ pháp');await button('Luyện tập ngữ pháp');
  const irregularVi=await page.locator('.grammar-quiz-meaning').innerText();assert.ok(drills.some(e=>e.lessonDay===56&&e.vi===irregularVi));
  await button('Luyện viết');for(const name of ['Phóng to bảng vẽ','Thu nhỏ bảng vẽ','Mở rộng bảng viết','Di chuyển bảng'])assert.equal(await page.getByRole('button',{name,exact:true}).count(),0);await button('Cài đặt luyện tập');await page.getByRole('spinbutton',{name:'Thời gian tự chuyển chữ'}).fill('0');await button('Xong');
  const draw=async(x1,y1,x2,y2)=>{await page.locator('canvas').scrollIntoViewIfNeeded();const r=await page.locator('canvas').boundingBox();await page.mouse.move(r.x+x1*r.width,r.y+y1*r.height);await page.mouse.down();await page.mouse.move(r.x+x2*r.width,r.y+y2*r.height,{steps:5});await page.mouse.up()};
  await draw(.1,.2,.3,.6);await draw(.6,.2,.8,.6);assert.equal(await page.locator('.ink-count').innerText(),'2 nét');
  await button('Tẩy nét');await draw(.18,.3,.21,.4);assert.equal(await page.locator('.ink-count').innerText(),'1 nét');await button('Hoàn tác');assert.equal(await page.locator('.ink-count').innerText(),'2 nét');
  const requests=[];let mode='correct',retry=0,pending;
  await page.route('https://inputtools.google.com/**',async route=>{
    requests.push(route.request().postDataJSON());
    if(mode==='pending'){pending=route;return}
    const meaning=await page.locator('.writing-prompt h2').innerText(),word=curriculum.days[55].words.find(w=>w.viet===meaning).char;
    const value=mode==='retry'&&retry++===0?'???':word;
    await route.fulfill({json:['SUCCESS',[['ko',[value]]]]});
  });
  await button('Kiểm tra');await page.getByRole('status').filter({hasText:'Chính xác'}).waitFor();
  await button('Xóa bảng');assert.equal(await page.locator('.ink-count').innerText(),'0 nét');await button('Hoàn tác');assert.equal(await page.locator('.ink-count').innerText(),'2 nét');
  mode='retry';retry=0;const before=requests.length;await button('Kiểm tra');await page.getByRole('status').filter({hasText:'Chính xác'}).waitFor();assert.equal(requests.length,before+2);assert.notDeepEqual(requests.at(-1).requests[0].ink,requests.at(-2).requests[0].ink,'fallback uses normalized ink');
  mode='pending';await button('Kiểm tra');await page.waitForFunction(()=>document.querySelector('.spin'));for(let n=0;n<30&&!pending;n++)await new Promise(r=>setTimeout(r,10));assert.ok(pending);await button('Xóa bảng');try{await pending.fulfill({json:['SUCCESS',[['ko',['한국어']]]]})}catch{}
  assert.equal(await page.getByRole('status').filter({hasText:'Chính xác'}).count(),0,'editing cancels stale results');
  for(const width of [440,320]){
    await page.setViewportSize({width,height:956});await noOverflow();await button('Bút');await draw(.1,.2,.3,.6);await page.screenshot({path:`test-results/upgrade-writing-${width}.png`,fullPage:true,scale:'css'});
    await button('Ngữ pháp');await button('Luyện tập ngữ pháp');await noOverflow();await page.screenshot({path:`test-results/upgrade-grammar-${width}.png`,fullPage:true,scale:'css'});await button('Luyện viết');
  }
  mode='correct';await button('Cài đặt luyện tập');await page.getByRole('spinbutton',{name:'Thời gian tự chuyển chữ'}).fill('1');await button('Xong');await button('Bút');await draw(.1,.2,.3,.6);
  const oldNumber=await page.locator('.alphabet-writing .badge').innerText();await button('Kiểm tra');await page.getByRole('status').filter({hasText:'Chính xác'}).waitFor();await page.clock.runFor(1000);assert.notEqual(await page.locator('.alphabet-writing .badge').innerText(),oldNumber,'auto-next works on the fixed board');
  const mobile=await browser.newPage({viewport:{width:440,height:956},deviceScaleFactor:3,isMobile:true,hasTouch:true});
  await mobile.goto('http://127.0.0.1:5173/#hangul');await mobile.getByRole('button',{name:'Luyện viết',exact:true}).click();await mobile.locator('canvas').scrollIntoViewIfNeeded();
  const touch=await mobile.context().newCDPSession(mobile),rect=await mobile.locator('canvas').boundingBox();
  await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:rect.x+30,y:rect.y+30}]});await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:rect.x+90,y:rect.y+80}]});await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.equal(await mobile.locator('.ink-count').innerText(),'1 nét');assert.equal(await mobile.locator('canvas').evaluate(c=>c.width),768);
  await mobile.getByRole('button',{name:'Tẩy nét',exact:true}).click();const r=await mobile.locator('canvas').boundingBox();await mobile.touchscreen.tap(r.x+50,r.y+46);assert.equal(await mobile.locator('.ink-count').innerText(),'0 nét');
  await mobile.getByRole('button',{name:'Hoàn tác',exact:true}).click();assert.equal(await mobile.locator('.ink-count').innerText(),'1 nét');await mobile.close();
  assert.deepEqual(errors,[]);console.log('PASS: RR beside meanings, Papago lookup, grammar IME submission, correct/wrong auto-next and manual settings, irregular practice, stroke eraser/undo/clear, fixed board, normalized retry, stale cancellation, 440/320px layouts. Recognition responses mocked.');
}finally{await browser.close()}
