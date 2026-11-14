import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync} from 'node:fs';
const alphabet=JSON.parse(readFileSync('src/data/alphabet-quiz.json','utf8'));
mkdirSync('test-results',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1100}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base='http://127.0.0.1:5173';
try {
  await page.goto(base);await page.getByRole('heading',{name:'Tiếng Hàn, gần hơn mỗi ngày.'}).waitFor();
  await page.screenshot({path:'test-results/home-desktop.png',fullPage:true,animations:"disabled"});
  await page.getByRole('button',{name:/NỀN TẢNG Luyện chữ Hàn/}).click();
  assert.equal(await page.locator('.flashcard').count(),21);
  await page.getByRole('button',{name:'Lật thẻ ㅏ',exact:true}).click();assert.match(await page.locator('.flashcard').first().innerText(),/Đọc giống/);
  await page.getByRole('button',{name:'Đánh dấu thuộc',exact:true}).first().click();
  await page.reload();assert.equal(await page.getByRole('button',{name:'Đã thuộc',exact:true}).count(),1);
  await page.getByRole('button',{name:'Phụ âm 19'}).click();assert.equal(await page.locator('.flashcard').count(),19);
  await page.getByRole('button',{name:'Trắc nghiệm',exact:true}).click();
  for(let i=0;i<6;i++) {
    const char=await page.locator('.alphabet-quiz-char').innerText(),prompt=await page.locator('.alphabet-quiz h2').innerText();
    const item=alphabet.find(x=>x.char===char&&x.prompt===prompt);
    const choices=await page.locator('.option > span:nth-child(2)').allTextContents();await page.locator('.option').nth(choices.indexOf(item.viet)).click();
    await page.waitForFunction(n=>document.querySelector('.alphabet-quiz .badge')?.textContent.includes(`Câu ${n}`),i+2);
  }
  assert.equal(await page.getByRole('heading',{name:'Làm tốt lắm!'}).count(),0);
  await page.getByRole('button',{name:'Luyện viết',exact:true}).click();
  const box=await page.locator('canvas').boundingBox();await page.mouse.move(box.x+30,box.y+40);await page.mouse.down();await page.mouse.move(box.x+130,box.y+140,{steps:10});await page.mouse.up();
  assert.ok(await page.locator('canvas').evaluate(c=>Array.from(c.getContext('2d').getImageData(0,0,480,480).data).some(x=>x!==0)));
  await page.getByRole('button',{name:'Luyện TOPIK',exact:true}).click();
  assert.equal(await page.locator('.day-grid button').count(),60);assert.equal(await page.locator('.flashcard').count(),10);
  await page.getByRole('button',{name:'Hoàn thành ngày',exact:true}).click();await page.getByRole('button',{name:'Ngày 60',exact:true}).click();
  await page.getByRole('button',{name:'Ngữ pháp',exact:true}).click();assert.equal(await page.locator('.grammar-card').count(),1);assert.match(await page.locator('.grammar-card').first().innerText(),/Ngày 60\/60/);
  await page.getByRole('button',{name:'Ngày 1',exact:true}).click();await page.getByRole('button',{name:'Luyện viết',exact:true}).click();
  await page.locator('canvas').waitFor();
  await page.getByRole('button',{name:'Nghe',exact:true}).click();assert.equal(await page.locator('.word-quiz-prompt').count(),0);await page.locator('.listen-prompt').waitFor();
  await page.getByRole('button',{name:'Đọc',exact:true}).click();await page.locator('.word-quiz-prompt').waitFor();
  await page.screenshot({path:'test-results/study-desktop.png',fullPage:true,animations:"disabled"});
  await page.getByRole('button',{name:'Thi thử',exact:true}).click();await page.getByRole('button',{name:'Bắt đầu làm bài',exact:true}).click();assert.equal(await page.locator('.question-grid button').count(),10);
  await page.locator('.option').first().click();await page.getByRole('button',{name:'Câu tiếp',exact:true}).click();await page.reload();assert.match(await page.locator('.quiz-heading').innerText(),/Câu 2\/10/);
  await page.getByRole('button',{name:'Nộp bài',exact:true}).click();await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'Nộp và xem kết quả',exact:true}).click();await page.getByRole('heading',{name:'Kết quả bài thi'}).waitFor();assert.equal(await page.locator('.feedback').count(),1);
  await page.screenshot({path:'test-results/exam-desktop.png',fullPage:true,animations:"disabled"});
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark','first visit defaults to dark');
  await page.getByRole('button',{name:'Chuyển chế độ sáng',exact:true}).click();assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
  await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'light','saved light preference persists');
  await page.getByRole('button',{name:'Chuyển chế độ tối',exact:true}).click();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  await page.getByRole('button',{name:'Trang chủ',exact:true}).first().click();await page.screenshot({path:'test-results/home-dark.png',fullPage:true,animations:"disabled"});
  await page.getByRole('button',{name:'Chuyển chế độ sáng',exact:true}).click();
  await page.setViewportSize({width:390,height:844});
  for(const route of ['home','hangul','study','exam']){
    await page.goto(`${base}/#${route}`);await page.locator('main h1').waitFor();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`${route} mobile overflow`);
    await page.screenshot({path:`test-results/${route}-mobile.png`,fullPage:true,animations:"disabled"});
  }
  assert.deepEqual(errors,[]);console.log('PASS: home, 47 cards, reveal/learn persistence, quiz, canvas, 60 days, grammar, writing, listening/reading, exam resume/submit/review, theme, and four mobile routes.');
} finally {await browser.close()}





