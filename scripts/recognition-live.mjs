import {chromium} from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
  const page=await browser.newPage();
  page.on('requestfailed',request=>console.log('Request:',request.failure()?.errorText));
  await page.goto('http://127.0.0.1:5173/#hangul');
  console.log(JSON.stringify(await page.evaluate(async()=>{
    try {
      const response=await fetch('https://inputtools.google.com/request?itc=ko-t-i0-handwrit&app=mobilesearch',{
        method:'POST',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(15000),
        body:JSON.stringify({options:'enable_homework_spellcheck',requests:[{writing_guide:{width:256,height:256},ink:[[[128,128,128],[40,128,210]],[[128,170,210],[128,128,128]]],language:'ko'}]})
      });
      return {status:response.status,result:await response.json()};
    } catch(error) {return {error:error.message}}
  })));
} finally {await browser.close()}

