import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=name=>JSON.parse(readFileSync(`src/data/${name}.json`,'utf8'));
test('60-day curriculum keeps valid theme and grammar references',()=>{
  const {days,themes}=read('curriculum'), grammar=read('grammar');
  assert.equal(days.length,60);assert.equal(grammar.length,120);
  days.forEach((day,i)=>{assert.equal(day.day,i+1);assert.ok(themes[day.theme]);assert.ok(grammar[i*2+1]);assert.ok(day.example);assert.ok(day.translation);assert.ok(themes[day.theme].words.length>=4)});
});
test('all source flashcards are retained',()=>{
  const data=read('hangeul');assert.equal(data.vowels.length,21);assert.equal(data.consonants.length,19);assert.equal(data.batchim.length,7);
  Object.values(data).flat().forEach(c=>{assert.ok(c.char);assert.ok(c.viet)});
});
test('exam options contain exactly one matching answer',()=>{
  const bank=read('exam');assert.equal(bank.length,49);
  for(const q of bank){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.options.filter(o=>o===q.answer).length,1);assert.ok(q.explain);assert.ok(['read','listen'].includes(q.kind));if(q.kind==='listen')assert.ok(q.audio)}
});
