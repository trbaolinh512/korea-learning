import {chromium} from '@playwright/test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const changes=JSON.parse(fs.readFileSync('src/data/exam-content-updates.json','utf8'));
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
  const page=await browser.newPage();
  await page.addInitScript(()=>{window.spoken=[];Object.defineProperty(window,'SpeechSynthesisUtterance',{value:class{constructor(text){this.text=text}}});Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},getVoices(){return [{lang:'ko-KR'}]},speak(u){window.spoken.push(u.text)}}})});
  await page.goto('http://127.0.0.1:5173/#study');await page.getByRole('button',{name:'Ngữ pháp',exact:true}).click();
  await page.getByRole('button',{name:'Ngày 2',exact:true}).click();await page.getByRole('button',{name:'Ngữ pháp',exact:true}).click();
  assert.match(await page.locator('.example-analysis').first().innerText(),/có âm cuối ㅇ/);
  await page.getByRole('button',{name:'Ngày 20',exact:true}).click();await page.getByRole('button',{name:'Ngữ pháp',exact:true}).click();assert.match(await page.locator('.grammar-caution').innerText(),/살다 → 사세요/);
  await page.getByRole('button',{name:'Chữ Hàn',exact:true}).click();assert.match(await page.locator('.info-box').innerText(),/10 cơ bản/);assert.doesNotMatch(await page.locator('.info-box').innerText(),/10 đơn/);
  await page.getByRole('button',{name:'Âm đuôi (Batchim) 7',exact:true}).click();await page.getByRole('button',{name:'Lật thẻ ㄴ',exact:true}).click();assert.equal(await page.evaluate(()=>window.spoken.at(-1)),'안 눈');
  const endAt=Date.now()+100000;
  const old={questions:changes.map(({before},i)=>({...before,id:`legacy-${i}`,options:[before.options[2],before.options[0],before.options[3],before.options[1]]})),answers:Object.fromEntries(changes.map(({before},i)=>[i,before.answer])),index:2,endAt,submitted:false,mode:'Khởi động'};
  await page.evaluate(s=>{localStorage.setItem('korea-exam-v1',JSON.stringify(s))},old);await page.goto('http://127.0.0.1:5173/#exam');await page.reload();
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('korea-exam-v1'))?.contentVersion===2);
  const upgraded=await page.evaluate(()=>JSON.parse(localStorage.getItem('korea-exam-v1')));
  assert.equal(upgraded.endAt,endAt);assert.equal(upgraded.index,2);assert.equal(upgraded.questions.length,changes.length);
  for(let i=0;i<changes.length;i++){assert.equal(upgraded.questions[i].prompt,changes[i].after.prompt);assert.equal(upgraded.questions[i].id,`legacy-${i}`);assert.equal(upgraded.questions[i].options[0],changes[i].after.options[2]);assert.equal(upgraded.answers[i],changes[i].after.answer)}
  assert.doesNotMatch(JSON.stringify(upgraded),/동생를|동생가/);
  console.log('PASS: corrected grammar shown, vowel grouping, batchim example speech, and legacy exam content upgraded while retaining shuffled order, answers and timer.');
}finally{await browser.close()}
