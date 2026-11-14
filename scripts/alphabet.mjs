import {chromium} from '@playwright/test';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const letters=JSON.parse(readFileSync('src/data/hangeul.json','utf8'));
const bank=JSON.parse(readFileSync('src/data/alphabet-quiz.json','utf8'));
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{
  window.spoken=[];
  Object.defineProperty(window,'SpeechSynthesisUtterance',{value:class {constructor(text){this.text=text}}});
  Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},getVoices(){return [{lang:'ko-KR'}]},speak(u){window.spoken.push(u.text)}}});
});
const draw=async()=>{const box=await page.locator('canvas').boundingBox();await page.mouse.move(box.x+60,box.y+30);await page.mouse.down();await page.mouse.move(box.x+60,box.y+170,{steps:4});await page.mouse.up()};
try {
  await page.goto('http://127.0.0.1:5173/#hangul');await page.clock.install({time:new Date('2026-11-14T12:00:00Z')});await page.clock.pauseAt(new Date('2026-11-14T12:00:01Z'));
  await page.getByRole('button',{name:'Lật thẻ ㅏ',exact:true}).click();assert.equal(await page.evaluate(()=>window.spoken.at(-1)),'ㅏ');
  await page.getByRole('button',{name:'Luyện TOPIK',exact:true}).click();await page.getByRole('button',{name:'Lật thẻ 저',exact:true}).click();assert.equal(await page.evaluate(()=>window.spoken.at(-1)),'저');
  await page.getByRole('button',{name:'Chữ Hàn',exact:true}).click();await page.getByRole('button',{name:'Trắc nghiệm',exact:true}).click();
  assert.equal(await page.getByRole('button',{name:'Câu tiếp',exact:true}).count(),0);
  const seen=new Set();
  for(let i=1;i<=48;i++){
    const char=await page.locator('.alphabet-quiz-char').innerText(),prompt=await page.locator('.alphabet-quiz h2').innerText();
    const target=bank.find(q=>q.char===char&&q.prompt===prompt),id=target.categoryGroup+':'+char;
    if(i<=47){assert.ok(!seen.has(id),'no repeat before complete cycle');seen.add(id)}
    const choices=await page.locator('.option > span:nth-child(2)').allTextContents();await page.locator('.option').nth(choices.indexOf(target.viet)).click();
    await page.clock.runFor(999);assert.match(await page.locator('.alphabet-quiz .badge').innerText(),new RegExp(`Câu ${i} ·`));
    await page.clock.runFor(1);assert.match(await page.locator('.alphabet-quiz .badge').innerText(),new RegExp(`Câu ${i+1} ·`));
  }
  const char=await page.locator('.alphabet-quiz-char').innerText(),prompt=await page.locator('.alphabet-quiz h2').innerText();
  const target=bank.find(q=>q.char===char&&q.prompt===prompt),choices=await page.locator('.option > span:nth-child(2)').allTextContents();
  await page.locator('.option').nth(choices.findIndex(choice=>choice!==target.viet)).click();
  assert.equal(await page.getByRole('button',{name:'Thử lại câu này',exact:true}).count(),0);
  await page.clock.runFor(999);assert.match(await page.locator('.alphabet-quiz .badge').innerText(),/Câu 49 ·/);
  await page.clock.runFor(1);assert.match(await page.locator('.alphabet-quiz .badge').innerText(),/Câu 50 ·/);
  await page.getByRole('button',{name:'Cài đặt luyện tập'}).click();await page.getByRole('checkbox',{name:'Hiện nút Câu tiếp'}).check();await page.getByRole('spinbutton',{name:'Thời gian mỗi câu'}).fill('20');await page.getByRole('button',{name:'Xong',exact:true}).click();await page.getByRole('button',{name:'Câu tiếp',exact:true}).click();assert.equal(await page.locator('.timer').innerText(),'20s');
  await page.getByRole('button',{name:'Luyện viết',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Câu tiếp',exact:true}).count(),0);assert.equal(await page.getByRole('button',{name:'Hướng dẫn nét',exact:true}).count(),0);
  let requests=[],reply='correct';
  await page.route('https://inputtools.google.com/**',async route=>{
    requests.push(route.request().postDataJSON());
    const viet=await page.locator('.writing-prompt h2').innerText(),roman=await page.locator('.writing-prompt .roman').innerText();
    const target=[...letters.vowels,...letters.consonants].find(c=>c.viet===viet&&`/${c.romaja}/`===roman);
    if(reply==='error'){await route.abort('failed');return}
    await route.fulfill({json:['SUCCESS',[['ko-t-i0-handwrit',[reply==='correct'?target.char:'???']]]]});
  });
  await page.getByRole('button',{name:'Kiểm tra',exact:true}).click();await page.getByRole('status').filter({hasText:'Hãy viết chữ'}).waitFor();assert.equal(requests.length,0);
  await draw();await page.clock.runFor(5000);assert.equal(requests.length,0);assert.equal(await page.getByRole('button',{name:'Hoàn tác',exact:true}).count(),0);await page.getByRole('button',{name:'Kiểm tra',exact:true}).click();await page.getByRole('status').filter({hasText:'Chính xác'}).waitFor();
  assert.equal(requests.length,1);assert.equal(requests[0].requests[0].language,'ko');assert.deepEqual(requests[0].requests[0].writing_guide,{width:256,height:256});assert.ok(requests[0].requests[0].ink[0][0].length>1);
  await page.clock.runFor(999);assert.match(await page.locator('.alphabet-writing .badge').innerText(),/Chữ 1 ·/);await page.clock.runFor(1);assert.match(await page.locator('.alphabet-writing .badge').innerText(),/Chữ 2 ·/);
  assert.ok(await page.locator('canvas').evaluate(c=>c.getContext('2d').getImageData(0,0,256,256).data.every(v=>v===0)));
  for(const [filter,pool] of [['Nguyên âm',letters.vowels],['Phụ âm',letters.consonants],['Tất cả',[...letters.vowels,...letters.consonants]]]){
    await page.getByRole('button',{name:filter,exact:true}).click();const viet=await page.locator('.writing-prompt h2').innerText();assert.ok(pool.some(c=>c.viet===viet));
  }
  reply='wrong';await draw();await page.getByRole('button',{name:'Kiểm tra',exact:true}).click();await page.getByRole('status').filter({hasText:'Chưa chính xác'}).waitFor();await page.clock.runFor(2000);assert.match(await page.locator('.alphabet-writing .badge').innerText(),/Chữ 1 ·/);
  await page.getByRole('button',{name:'Xóa bảng',exact:true}).click();reply='error';await draw();await page.getByRole('button',{name:'Kiểm tra',exact:true}).click();await page.getByRole('status').filter({hasText:'kết nối'}).waitFor();
  reply='correct';await page.getByRole('button',{name:'Kiểm tra',exact:true}).click();await page.getByRole('status').filter({hasText:'Chính xác'}).waitFor();
  await page.getByRole('button',{name:'Xóa bảng',exact:true}).click();await page.clock.runFor(2000);assert.match(await page.locator('.alphabet-writing .badge').innerText(),/Chữ 1 ·/);
  const previous=requests.length;await draw();await page.getByRole('button',{name:'Học bảng chữ cái',exact:true}).click();await page.clock.runFor(2000);assert.equal(requests.length,previous);
  await page.getByRole('button',{name:'Luyện viết',exact:true}).click();await page.getByRole('button',{name:'Cài đặt luyện tập'}).click();await page.getByRole('checkbox',{name:'Hiện nút Câu tiếp'}).check();await page.getByRole('spinbutton',{name:'Thời gian tự chuyển chữ'}).fill('2');await page.getByRole('button',{name:'Xong',exact:true}).click();await page.getByRole('button',{name:'Câu tiếp',exact:true}).click();assert.match(await page.locator('.alphabet-writing .badge').innerText(),/Chữ 2 ·/);
  await page.reload();await page.getByRole('button',{name:'Luyện viết',exact:true}).click();await page.getByRole('button',{name:'Cài đặt luyện tập'}).click();assert.equal(await page.getByRole('spinbutton',{name:'Thời gian tự chuyển chữ'}).inputValue(),'2');assert.ok(await page.getByRole('checkbox',{name:'Hiện nút Câu tiếp'}).isChecked());await page.getByRole('button',{name:'Xong',exact:true}).click();
  await page.screenshot({path:'test-results/writing-mobile.png',fullPage:true,animations:'disabled'});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.deepEqual(errors,[]);console.log('PASS: card speech in both modules, 48 endless quiz questions, 1-second auto-next, no repetition within cycle, hidden/manual next and persisted settings, handwriting only on Check, no undo, feedback/auto-next, filters, wrong/network failures, clearing and navigation cancel pending work. Recognition responses are mocked for deterministic tests.');
} finally {await browser.close()}




