import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const bank=JSON.parse(fs.readFileSync('src/data/grammar-drills.json','utf8'));
const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/grammarPractice.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:()=>bank});
const {grammarPlan,GrammarPracticeSession,isChoice}=exports;
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{Object.defineProperty(window,'SpeechSynthesisUtterance',{value:class{constructor(text){this.text=text}}});Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},getVoices(){return [{lang:'ko-KR'}]},speak(){}}})});
  await page.goto('http://127.0.0.1:5173/#study');await page.getByRole('button',{name:'Ngữ pháp',exact:true}).click();await page.getByRole('button',{name:'Luyện tập ngữ pháp',exact:true}).click();await page.getByRole('combobox',{name:'Chế độ luyện ngữ pháp'}).waitFor();
  await page.clock.install();await page.clock.pauseAt(new Date());
  const tab=name=>page.getByRole('button',{name,exact:true}).click(),mode=value=>page.getByRole('combobox',{name:'Chế độ luyện ngữ pháp'}).selectOption(value);
  await mode('choice');await page.locator('.grammar-choice-options .option').first().click();await page.clock.runFor(999);assert.match(await page.locator('.grammar-typing-quiz .badge').first().innerText(),/Câu 1/);await page.clock.runFor(1);assert.match(await page.locator('.grammar-typing-quiz .badge').first().innerText(),/Câu 2/);
  await tab('Cài đặt luyện tập');await page.getByRole('spinbutton',{name:'Thời gian tự chuyển câu'}).fill('0');await tab('Xong');
  async function current(){const root=page.locator('.grammar-typing-quiz'),id=await root.getAttribute('data-question-id'),kind=await root.getAttribute('data-question-kind');return {row:bank.find(q=>q.id===id),kind,id}}
  async function solve(wrong=false){
    const {row,kind}=await current();
    if(isChoice(kind)){
      let answer=kind==='meaning'?row.vi:row.focus;
      if(kind==='contrast'){const engine=new GrammarPracticeSession([row],row.lessonDay,'choice');engine.next();engine.next();engine.next();answer=engine.next().answer}
      const options=await page.locator('.grammar-choice-options .option>span:nth-child(2)').allTextContents();const index=wrong?options.findIndex(o=>o!==answer):options.indexOf(answer);assert.ok(index>=0);
      await page.locator('.grammar-choice-options .option').nth(index).click();
    }else if(kind==='order'){
      const words=row.ko.replace(/[.!?]$/,'').split(' '),buttons=page.locator('.grammar-token-bank button'),tokens=await buttons.allTextContents(),used=new Set();
      for(const word of words){const i=tokens.findIndex((t,n)=>t===word&&!used.has(n));assert.ok(i>=0);used.add(i);await buttons.nth(i).click()}
      await tab('Kiểm tra câu');
    }else{await page.locator('.grammar-typing-quiz input').fill(wrong?'틀린 답':kind==='typing'?row.ko:row.focus);await tab('Kiểm tra câu')}
    await page.getByRole('status').filter({hasText:wrong?'Chưa khớp đáp án mẫu':'Chính xác!'}).waitFor();
  }
  for(const day of [1,16,36,51]){
    await page.getByRole('button',{name:`Ngày ${day}`,exact:true}).click();await tab('Ngữ pháp');await tab('Luyện tập ngữ pháp');await mode('mixed');
    const ids=new Set();
    for(let n=0;n<10;n++){const q=await current();assert.equal(q.kind,grammarPlan(day)[n]);assert.ok(!ids.has(q.id));ids.add(q.id);await solve();await tab('Câu tiếp')}
  }
  await page.getByRole('button',{name:'Ngày 1',exact:true}).click();await tab('Ngữ pháp');await tab('Luyện tập ngữ pháp');await mode('choice');
  const first=await current(),firstOptions=await page.locator('.grammar-choice-options .option').allTextContents();await solve(true);await tab('Câu tiếp');
  for(let n=0;n<4;n++){assert.notEqual((await current()).id,first.id);await solve();await tab('Câu tiếp')}
  assert.equal((await current()).id,first.id);assert.ok(await page.getByText('Ôn lại câu sai',{exact:true}).isVisible());assert.notDeepEqual(await page.locator('.grammar-choice-options .option').allTextContents(),firstOptions);await solve();
  for(const width of [440,320]){
    await page.setViewportSize({width,height:956});
    for(const value of ['choice','order','conjugate','typing']){
      await mode(value);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      if(value==='choice'){const r=await page.locator('.grammar-choice-options .option').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y}}));assert.equal(r[0].y,r[1].y);assert.equal(r[2].y,r[3].y)}
      await solve();await page.screenshot({path:`test-results/grammar-${value}-${width}.png`,fullPage:true,scale:'css'});
    }
  }
  assert.deepEqual(errors,[]);console.log('PASS: phase-specific ten-question mixes, unique sentence decks, choices/order/conjugation/typing, four-question delayed error review, reshuffled options, auto-next, 2x2 choices and 440/320px layouts.');
}finally{await browser.close()}
