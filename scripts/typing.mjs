import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync('src/data/typing.json','utf8'));
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),original=await browser.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));original.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5173/#hangul');await page.getByRole('button',{name:'Luyện gõ tiếng Hàn',exact:true}).click();
  await page.clock.install();await page.clock.pauseAt(new Date());
  const target=await page.locator('.typing-sentence').getAttribute('aria-label'),index=data.sentences.findIndex(s=>s.ko===target);
  const raw=fs.readFileSync('references/korean-typing-v6.html','utf8').replace(/<head>[\s\S]*?<\/head>/,'<head><meta charset="UTF-8"></head>');
  await original.setContent(raw);await original.clock.install();await original.clock.pauseAt(new Date());
  await original.evaluate(`currentSentenceIndex=${index}; document.getElementById('typing-input').value=''; renderTargetDisplay('');`);
  assert.equal(await page.getByRole('button',{name:'Gợi ý: Tắt',exact:true}).count(),1);
  assert.equal(await page.locator('.typing-key').count(),26);
  await page.getByRole('button',{name:'Gợi ý: Tắt',exact:true}).click();await original.locator('#btn-toggle-hint').click();
  const compare=async value=>{
    for(const p of [page,original])await p.locator('#typing-input').fill(value);
    assert.deepEqual(await page.locator('.typing-sentence>span').evaluateAll(es=>es.map(e=>[e.textContent,e.className])),await original.locator('#target-sentence-display>span').evaluateAll(es=>es.map(e=>[e.textContent,e.className])));
    assert.equal(await page.locator('.typing-key-hint').innerText(),await original.locator('#target-key-hint').innerText());
    // v6 omits .key-btn on Space, leaving an obsolete highlight after moving past it.
    // Keep its hint calculation, but clear that stale visual marker in the React UI.
    const spaceHint=(await original.locator('#target-key-hint').innerText()).includes('[Khoảng trắng]');
    const originalKeys=await original.locator('.key-target').evaluateAll(es=>es.map(e=>e.id.replace('key-','')));
    assert.deepEqual(await page.locator('.key-target').evaluateAll(es=>es.map(e=>e.dataset.key)),originalKeys.filter(k=>k!=='space'||spaceHint));
  };
  for(const value of ['', 'ㄱ','가',target.slice(0,1),target.slice(0,3),target+'x','abc',target])await compare(value);
  assert.equal(await page.locator('#typing-input').inputValue(),target);
  await page.clock.runFor(299);assert.equal(await page.locator('.typing-sentence').getAttribute('aria-label'),target);
  await page.clock.runFor(1);assert.notEqual(await page.locator('.typing-sentence').getAttribute('aria-label'),target);assert.equal(await page.locator('#typing-input').inputValue(),'');
  await page.clock.runFor(50);await page.locator('#typing-input').press('a');assert.equal(await page.locator('#typing-input').inputValue(),'a','v6 input handler leaves QWERTY unchanged');
  await page.locator('#typing-input').dispatchEvent('keydown',{key:'a',code:'KeyA'});assert.equal(await page.locator('[data-key="a"]').evaluate(e=>e.classList.contains('key-active')),true);
  await page.locator('#typing-input').dispatchEvent('keyup',{key:'a',code:'KeyA'});assert.equal(await page.locator('.key-active').count(),0);
  await page.getByRole('button',{name:'Ẩn bàn phím',exact:true}).click();assert.equal(await page.locator('.typing-keyboard').count(),0);
  await page.getByRole('button',{name:'Hiện bàn phím',exact:true}).click();
  await page.getByRole('button',{name:'Gợi ý: Bật',exact:true}).click();assert.equal(await page.locator('.key-target').count(),0);
  for(const width of [1440,390,320]){await page.setViewportSize({width,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`test-results/typing-${width}.png`,fullPage:true})}
  const before=await page.locator('.typing-sentence').getAttribute('aria-label');await page.getByRole('button',{name:'Đổi câu khác',exact:true}).click();assert.notEqual(await page.locator('.typing-sentence').getAttribute('aria-label'),before);
  await page.getByRole('button',{name:'Trắc nghiệm',exact:true}).click();assert.equal(await page.locator('.korean-typing').count(),0);assert.deepEqual(errors,[]);
  console.log('PASS: v6 parity for correct/incorrect/partial input and hints, 300ms auto-next, unchanged raw QWERTY input, physical-key feedback, toggles, nonrepeating next sentence and desktop/mobile dark layouts.');
}finally{await browser.close()}
