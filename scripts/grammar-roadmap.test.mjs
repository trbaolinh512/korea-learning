import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const lessons=JSON.parse(fs.readFileSync('src/data/grammar-roadmap.json','utf8'));
test('each of the 60 days has its own grammar lesson or scheduled review',()=>{
  assert.equal(lessons.length,60);
  assert.deepEqual(lessons.filter(l=>l.review).map(l=>l.day),[15,30,45,60]);
  lessons.forEach((l,i)=>{
    assert.equal(l.day,i+1);assert.equal(l.phase.match(/GIAI ĐOẠN (\d)/)[1],String(Math.floor(i/15)+1));
    assert.ok(l.title&&l.goal&&l.note&&l.source);assert.ok(l.sections.length);
    if(!l.review&&l.day<56)assert.equal(l.examples.length,2,`Day ${l.day}`);
    if(l.review)assert.ok(l.sections.some(s=>s.title.startsWith('Nhiệm vụ')));
    l.examples.forEach(e=>{assert.match(e.ko,/[가-힣]/);assert.ok(e.vi&&e.explanation.length>35)});
    assert.doesNotMatch(JSON.stringify(l),/\*\*|###|수업을 끝난|toàn bộ 59 chủ điểm/);
  });
});
test('editorial fixes distinguish particles, batchim and irregular exceptions',()=>{
  assert.match(lessons[0].note,/생, có âm cuối ㅇ/);
  assert.equal(lessons[40].examples[0].ko,'수업이 끝난 후에 집에 가요.');
  assert.match(lessons[36].examples[1].vi,/chậm nhất lúc 9 giờ/);
  assert.match(lessons[56].note,/도우면/);
  assert.match(lessons[58].note,/치르다 → 치러요/);
  assert.match(lessons[58].note,/푸르다 → 푸르러요/);
  assert.doesNotMatch(JSON.stringify(lessons[59]),/Câu 31–33|Câu 34–39|Câu 40–70/);
});
