import fs from 'node:fs';
import assert from 'node:assert/strict';

const lessons=JSON.parse(fs.readFileSync('src/data/study-grammar.json','utf8'));
const curriculum=JSON.parse(fs.readFileSync('src/data/study-curriculum.json','utf8'));
const chunks=[];
const add=(...paragraphs)=>chunks.push(...paragraphs,'');
const sourceSuffix='Phần hướng dẫn và phân tích được biên soạn lại để dễ học.';
const firstDayAdvice='Đọc công thức, nghe từng câu và đối chiếu phần phân tích. Ngày tiếp theo sẽ giữ chủ điểm này để bạn áp dụng với nhóm từ mới.';
const secondDayAdvice='Thay danh từ hoặc động từ trong hai ví dụ bằng từ của ngày hôm nay, rồi tự giải thích ý nghĩa của câu mới. Chỉ thay khi loại từ và ngữ cảnh phù hợp.';

add('# Toàn bộ nội dung hiển thị trong phần Ngữ pháp','');
add('Bản nội dung đầy đủ theo lộ trình 60 ngày, gồm 30 chủ điểm. Mỗi ngày được trình bày riêng với toàn bộ chữ đang hiển thị trong bài ngữ pháp, kể cả những ngày dùng lại cùng chủ điểm.','');
add('## Mục lục chủ điểm','');
for(const lesson of lessons){
  const days=curriculum.days.filter(day=>day.grammarId===lesson.id);
  add(`- **Chủ điểm ${String(lesson.id).padStart(2,'0')}: ${lesson.title}** — [Ngày ${days[0].day}](#ngay-${days[0].day}) · [Ngày ${days[1].day}](#ngay-${days[1].day})`);
}
add('---','');

for(const day of curriculum.days){
  const lesson=lessons.find(item=>item.id===day.grammarId);
  assert.ok(lesson,`Missing grammar for day ${day.day}`);
  add(`<a id="ngay-${day.day}"></a>`,'',`## Ngày ${String(day.day).padStart(2,'0')} — ${day.title}`,'');
  add(`**NGÀY ${day.day} · ${day.phase.toUpperCase()}**`,'');
  add(`${day.words.length} từ vựng · ${lesson.title}`,'');
  add(`**Chủ điểm ${lesson.id}/30 · ${day.part?'Ngày vận dụng':'Ngày làm quen'}**`,'');
  add(`### ${lesson.title}`,'',lesson.meaning,'');
  add('#### Công thức','',lesson.formula,'');
  add('#### Cách dùng','',lesson.usage,'');
  add('#### Lưu ý để dùng đúng','',lesson.note,'');
  add('#### Ví dụ và phân tích','');
  lesson.examples.forEach((example,index)=>{
    add(`##### Ví dụ ${index+1}`,'');
    add(`**${example.ko}**`,'',example.vi,'');
    add('**Vì sao dùng cấu trúc này?**','',example.explanation,'');
  });
  add(`#### ${day.part?'Vận dụng với nhóm từ mới':'Gợi ý tự học'}`,'',day.part?secondDayAdvice:firstDayAdvice,'');
  add('#### Tài liệu ngữ pháp tham khảo','',`${lesson.source} · Trang ${lesson.pages.join(', ')}. ${sourceSuffix}`,'');
  add('---','');
}

const content=chunks.join('\n').replace(/\n{3,}/g,'\n\n').trimEnd()+'\n';
assert.equal((content.match(/^## Ngày \d{2} — /gm)||[]).length,60);
assert.equal((content.match(/^##### Ví dụ [12]$/gm)||[]).length,120);
for(const lesson of lessons){
  for(const text of [lesson.title,lesson.meaning,lesson.formula,lesson.usage,lesson.note,...lesson.examples.flatMap(example=>[example.ko,example.vi,example.explanation])]){
    assert.ok(content.includes(text),`Missing visible text: ${text}`);
  }
}
assert.equal((content.match(/^#### Công thức$/gm)||[]).length,60);
assert.equal((content.match(/^#### Cách dùng$/gm)||[]).length,60);
assert.equal((content.match(/^#### Lưu ý để dùng đúng$/gm)||[]).length,60);
assert.equal((content.match(/^\*\*Vì sao dùng cấu trúc này\?\*\*$/gm)||[]).length,120);
assert.equal((content.match(/^#### Tài liệu ngữ pháp tham khảo$/gm)||[]).length,60);
const output='TOAN_BO_NOI_DUNG_NGU_PHAP.md';
fs.writeFileSync(output,content,'utf8');
console.log(JSON.stringify({output,days:60,grammarUnits:30,exampleAppearances:120,uniqueExamples:60,bytes:Buffer.byteLength(content),verified:'All current grammar content included verbatim for both days of every unit.'},null,2));
