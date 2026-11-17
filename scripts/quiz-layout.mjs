import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const words=JSON.parse(fs.readFileSync('src/data/study-curriculum.json','utf8')).days[0].words;
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
  for(const viewport of [{width:1440,height:720},{width:1024,height:768},{width:440,height:956}]){
    const page=await browser.newPage({viewport});
    await page.addInitScript(()=>{window.spoken=[];Object.defineProperty(window,'SpeechSynthesisUtterance',{value:class{constructor(text){this.text=text}}});Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},getVoices(){return [{lang:'ko-KR'}]},speak(u){window.spoken.push(u.text)}}})});
    await page.goto('http://127.0.0.1:5173/#study');await page.locator('.flashcard').first().waitFor();
    await page.clock.install();await page.clock.pauseAt(new Date());
    const measure=()=>page.evaluate(()=>{const box=s=>{const r=document.querySelector(s).getBoundingClientRect();return {y:r.y,h:r.height}};return {sidebar:box('.day-sidebar'),quiz:box('.word-quiz'),feedback:box('.word-quiz .feedback'),scroll:scrollY}});
    for(const mode of ['Nghe','Đọc']){
      await page.getByRole('button',{name:mode,exact:true}).click();
      for(let question=0;question<10;question++){
        await page.clock.runFor(150);await page.locator('.word-quiz .option').first().scrollIntoViewIfNeeded();await page.clock.runFor(300);
        let answer;
        if(mode==='Nghe'){const ko=await page.evaluate(()=>window.spoken.at(-1));answer=words.find(w=>w.char===ko).viet}
        else{const prompt=page.locator('.word-quiz-prompt'),text=await prompt.innerText(),ko=await prompt.getAttribute('lang')==='ko';const word=words.find(w=>ko?w.char===text:w.viet===text);answer=ko?word.viet:word.char}
        const options=await page.locator('.word-quiz .option>span:nth-child(2)').allTextContents();
        const choice=page.locator('.word-quiz .option').nth(question%2?options.indexOf(answer):options.findIndex(o=>o!==answer));
        await choice.evaluate(e=>e.scrollIntoView({block:'center'}));await page.clock.runFor(300);const before=await measure();await choice.click();
        const during=await measure();
        for(const key of ['sidebar','quiz','feedback'])assert.ok(Math.abs(before[key].h-during[key].h)<1,`${mode}: ${key} height changed`);
        assert.ok(Math.abs(before.sidebar.y-during.sidebar.y)<1,`${mode}: sidebar moved on answer`);
        assert.equal(during.scroll,before.scroll);
        await page.clock.runFor(1000);const after=await measure();
        assert.ok(Math.abs(before.sidebar.y-after.sidebar.y)<1,`${mode}: sidebar moved on next question`);
        assert.equal(after.scroll,before.scroll);
      }
    }
    console.log(`PASS ${viewport.width}x${viewport.height}: 20 listening/reading answers and auto-next transitions keep sidebar and scroll position stable.`);
    await page.close();
  }
}finally{await browser.close()}
