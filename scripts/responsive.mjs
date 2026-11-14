import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
fs.mkdirSync('test-results/responsive',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const profiles=[{name:'iphone-17-pro-max',width:440,height:956},{name:'iphone-17-pro-max-landscape',width:956,height:440},{name:'390',width:390,height:844},{name:'375',width:375,height:812},{name:'320',width:320,height:740},{name:'tablet',width:768,height:1024},{name:'desktop',width:1440,height:1000}];
try{
  for(const profile of profiles.filter(p=>!process.argv[2]||process.argv.slice(2).includes(p.name))){
    const mobile=profile.width<=440;
    const context=await browser.newContext({viewport:{width:profile.width,height:profile.height},deviceScaleFactor:mobile?3:1,isMobile:mobile,hasTouch:mobile});
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(()=>{Object.defineProperty(window,'SpeechSynthesisUtterance',{value:class{constructor(text){this.text=text}}});Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},getVoices(){return [{lang:'ko-KR'}]},speak(){}}})});
    async function check(label){
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${profile.name}/${label}: document overflow`);
      const issues=await page.locator('main button,main input,main select,main canvas').evaluateAll(els=>els.filter(el=>{const r=el.getBoundingClientRect();return r.width&&r.height&&getComputedStyle(el).visibility!=='hidden'&&(r.right>innerWidth+1||r.left< -1)}).map(el=>({tag:el.tagName,text:(el.textContent||el.ariaLabel||'').slice(0,60)})));
      assert.deepEqual(issues,[],`${profile.name}/${label}: controls outside viewport`);
      if(mobile){
        const nav=await page.locator('.site-header nav').boundingBox();assert.ok(nav.y+nav.height<=profile.height+1&&nav.y>profile.height-120,'mobile navigation is bottom aligned');
        const sizes=await page.locator('.site-header nav button').evaluateAll(es=>es.map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})));
        assert.ok(sizes.every(s=>s.w>=44&&s.h>=44));
      }
      if(profile.name==='iphone-17-pro-max')await page.screenshot({path:`test-results/responsive/${label}.png`,fullPage:true,animations:'disabled',scale:'css'});
    }
    const grid=async()=>{const r=await page.locator('.options .option').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y,h:b.height}}));assert.equal(r.length,4);assert.equal(r[0].y,r[1].y);assert.equal(r[2].y,r[3].y);assert.ok(r[2].y>r[0].y&&r[0].x<r[1].x)};
    const tab=async name=>page.getByRole('button',{name,exact:true}).click();
    await page.goto('http://127.0.0.1:5173/');await page.locator('main h1').waitFor();await check('home');
    await page.goto('http://127.0.0.1:5173/#hangul');await page.locator('.flashcard').first().waitFor();await check('alphabet');
    await page.locator('.card-face').first().click();await check('alphabet-revealed');
    await tab('Trắc nghiệm');await check('alphabet-quiz');await grid();
    await tab('Cài đặt luyện tập');await page.getByRole('dialog').waitFor();await check('quiz-settings');
    if(mobile)assert.ok(await page.getByRole('spinbutton').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=16),'avoid iOS input zoom');
    await tab('Xong');await tab('Luyện viết');await page.locator('canvas').waitFor();await check('alphabet-writing');
    assert.equal(await page.locator('canvas').evaluate(e=>getComputedStyle(e).touchAction),'none');
    if(profile.name==='iphone-17-pro-max'){
      const client=await context.newCDPSession(page);await page.locator('canvas').scrollIntoViewIfNeeded();const b=await page.locator('canvas').boundingBox(),before=await page.evaluate(()=>scrollY);
      await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:b.x+30,y:b.y+30}]});
      await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:b.x+100,y:b.y+90}]});
      await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      assert.equal(await page.evaluate(()=>scrollY),before,'drawing does not scroll the page');
      assert.ok(await page.locator('canvas').evaluate(c=>c.getContext('2d').getImageData(0,0,c.width,c.height).data.some((v,i)=>i%4===3&&v>0)),'touch stroke creates ink');
    }
    await tab('Luyện gõ tiếng Hàn');await page.locator('#typing-input').waitFor();await check('typing');
    if(mobile){await page.locator('#typing-input').fill('가');await check('typing-input')}
    await page.goto('http://127.0.0.1:5173/#study');await page.locator('.flashcard').first().waitFor();await check('study-words');
    await tab('Ngữ pháp');await check('study-grammar');
    await page.getByRole('button',{name:'Ngày 60',exact:true}).click();await tab('Ngữ pháp');await check('study-review');
    await tab('Luyện viết');await check('study-writing');
    await tab('Nghe');await check('study-listening');await grid();
    await tab('Đọc');await check('study-reading');await grid();
    await page.goto('http://127.0.0.1:5173/#exam');await page.locator('.mode-card').first().waitFor();await check('exam-modes');
    await page.getByRole('button',{name:/Toàn bộ/}).click();await tab('Bắt đầu làm bài');await check('exam-running');
    await tab('Nộp bài');await page.getByRole('dialog').waitFor();await check('exam-submit');await tab('Nộp và xem kết quả');await check('exam-result');
    assert.deepEqual(errors,[],profile.name);await context.close();
    console.log(`PASS ${profile.name} ${profile.width}x${profile.height}: ${mobile?18:17} screen states, 2x2 quizzes, controls in bounds${mobile?', bottom navigation and touch targets':''}.`);
  }
}finally{await browser.close()}
