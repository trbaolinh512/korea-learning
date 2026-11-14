import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {correctAlphabet,correctExam} from './content-corrections.mjs';
const read=name=>JSON.parse(fs.readFileSync(`src/data/${name}.json`,'utf8'));
const finals=['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const batchim=word=>finals[(word.at(-1).codePointAt(0)-0xac00)%28];
test('batchim claims use the last syllable, including the original student error',()=>{
  for(const [word,last] of [['학생','ㅇ'],['동생','ㅇ'],['책','ㄱ'],['한국어',''],['고양이',''],['민수',''],['의사',''],['먹','ㄱ'],['열','ㄹ'],['읽','ㄺ'],['연필','ㄹ'],['없','ㅄ'],['명','ㅇ']])assert.equal(batchim(word),last,word);
  const grammar=read('study-grammar');
  const explanation=grammar[0].examples[0].explanation;
  assert.match(explanation,/생, có 받침 ㅇ/);assert.doesNotMatch(explanation,/학생 có phụ âm cuối ㄱ/);
  assert.match(grammar[15].formula,/살다 → 사세요/);
  assert.match(grammar[15].note,/도우세요/);
});
test('reviewed alphabet cards and quiz agree and use script grouping rather than wrong phonetic labels',()=>{
  const alphabet=read('hangeul'),quiz=read('alphabet-quiz');
  for(const q of quiz){const group=q.categoryGroup==='vowel'?alphabet.vowels:q.categoryGroup==='consonant'?alphabet.consonants:alphabet.batchim;const c=group.find(c=>c.char===q.char);assert.equal(q.desc,c.desc);assert.equal(q.viet,c.viet);assert.equal(q.speechText,c.speechText)}
  assert.equal(alphabet.vowels.filter(c=>c.category==='Cơ bản').length,10);
  assert.equal(alphabet.vowels.filter(c=>c.category==='Mở rộng').length,11);
  assert.equal(alphabet.consonants.filter(c=>c.category==='Bật hơi').length,4);
  assert.equal(alphabet.consonants.find(c=>c.char==='ㅎ').category,'Cơ bản');
  assert.ok(alphabet.batchim.every(c=>c.speechText));
});
test('reviewed exam contains no copied particle errors and the schedule question has one true option',()=>{
  const bank=read('exam');assert.doesNotMatch(JSON.stringify(bank),/동생를|동생가/);
  assert.match(bank[18].explain,/cùng em/);assert.match(bank[22].explain,/sinh nhật em/);
  assert.deepEqual(bank[38].options,['월요일에도 엽니다.','화요일에는 쉽니다.','일요일에는 문을 닫습니다.','토요일에는 쉽니다.']);
  assert.equal(bank[38].answer,'일요일에는 문을 닫습니다.');
  for(const q of bank.slice(44,46)){assert.match(q.prompt,/앞으로 살 계획/);assert.equal(q.answer,'살 거예요')}
});
test('regenerating corrections is idempotent',()=>{
  const alphabet=read('hangeul'),quiz=read('alphabet-quiz'),bank=read('exam');
  const expected=JSON.stringify({alphabet,quiz,bank});correctAlphabet(alphabet,quiz);correctExam(bank);
  assert.equal(JSON.stringify({alphabet,quiz,bank}),expected);
});
