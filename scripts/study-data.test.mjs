import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const curriculum=JSON.parse(fs.readFileSync('src/data/study-curriculum.json','utf8'));
const grammar=JSON.parse(fs.readFileSync('src/data/study-grammar.json','utf8'));
test('new roadmap has 60 valid days, 10 daily words and 30 explained grammar units',()=>{
  assert.equal(curriculum.days.length,60);assert.equal(grammar.length,30);
  for(const day of curriculum.days){assert.equal(day.words.length,10);assert.equal(new Set(day.words.map(w=>w.id)).size,10);assert.ok(grammar.some(g=>g.id===day.grammarId));for(const word of day.words){assert.ok(word.viet);assert.ok(word.source);assert.ok(!/[▶\u4e00-\u9fff]/u.test(word.viet),word.char+' has unreviewed source formatting');assert.ok(new Set(day.words.filter(w=>w.viet!==word.viet).map(w=>w.viet)).size>=3)}}
  for(const g of grammar){assert.ok(g.formula);assert.ok(g.usage);assert.ok(g.note);assert.equal(g.examples.length,2);assert.ok(g.pages.length);for(const e of g.examples){assert.ok(e.ko);assert.ok(e.vi);assert.ok(e.explanation.length>35)}}
});
test('ambiguous vocabulary is translated for the topic',()=>{
  const sense=(topic,char)=>curriculum.themes[topic].words.find(w=>w.char===char).viet;
  assert.equal(sense(9,'배'),'quả lê');assert.equal(sense(14,'배'),'thuyền');assert.equal(sense(17,'배'),'bụng');assert.equal(sense(13,'눈'),'tuyết');assert.equal(sense(17,'눈'),'mắt');assert.equal(sense(18,'약'),'thuốc');assert.equal(sense(23,'일'),'công việc');
});
