import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const lessons=JSON.parse(fs.readFileSync('src/data/grammar-roadmap.json','utf8'));
const exported=fs.readFileSync('TOAN_BO_NOI_DUNG_NGU_PHAP.md','utf8');
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{window.spoken=[];Object.defineProperty(window,'SpeechSynthesisUtterance',{value:class{constructor(text){this.text=text}}});Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},getVoices(){return [{lang:'ko-KR'}]},speak(u){window.spoken.push(u.text)}}})});
  await page.goto('http://127.0.0.1:5173/#study');
  for(const lesson of lessons){
    await page.getByRole('button',{name:`Ngày ${lesson.day}`,exact:true}).click();
    await page.getByRole('button',{name:'Ngữ pháp',exact:true}).click();
    const card=page.locator('.grammar-card'),visible=await card.innerText();
    assert.equal(await card.locator('h2').innerText(),lesson.title);
    assert.equal(await card.locator('.explained-example').count(),lesson.examples.length);
    for(const text of [lesson.note,lesson.goal,...lesson.sections.flatMap(s=>s.lines),...lesson.examples.flatMap(e=>[e.ko,e.vi,e.explanation])]){
      assert.ok(visible.includes(text),`Missing UI text day ${lesson.day}: ${text}`);
      assert.ok(exported.includes(text),`Missing export text day ${lesson.day}: ${text}`);
    }
    assert.doesNotMatch(visible,/Ngày làm quen|Ngày vận dụng|Chủ điểm \d+\/30/);
  }
  for(const width of [1440,390,320]){
    await page.setViewportSize({width,height:1000});
    for(const day of [1,15,25,41,56,57,59,60]){
      await page.getByRole('button',{name:`Ngày ${day}`,exact:true}).click();await page.getByRole('button',{name:'Ngữ pháp',exact:true}).click();
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow day ${day}, width ${width}`);
    }
    await page.screenshot({path:`test-results/grammar-roadmap-${width}.png`,fullPage:true});
  }
  await page.getByRole('button',{name:'Ngày 41',exact:true}).click();await page.getByRole('button',{name:'Ngữ pháp',exact:true}).click();
  await page.locator('.explained-example').first().getByRole('button').click();
  assert.equal(await page.evaluate(()=>window.spoken.at(-1)),lessons[40].examples[0].ko);
  await page.reload();await page.getByRole('button',{name:'Ngữ pháp',exact:true}).click();assert.equal(await page.locator('.grammar-card h2').innerText(),lessons[40].title);
  assert.deepEqual(errors,[]);
  console.log('PASS: all 60 grammar days and export contain every lesson section/example; four review days, corrected day 41 speech, persisted day, desktop and 390/320px layouts.');
}finally{await browser.close()}
