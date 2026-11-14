import fs from 'node:fs';
import assert from 'node:assert/strict';
const lessons=JSON.parse(fs.readFileSync('src/data/grammar-roadmap.json','utf8'));
const curriculum=JSON.parse(fs.readFileSync('src/data/study-curriculum.json','utf8'));
const chunks=['# Toàn bộ nội dung ngữ pháp đang hiển thị','60 ngày · 4 giai đoạn · 56 ngày học và 4 ngày ôn tập. Nội dung đã được biên tập từ tài liệu lộ trình do người dùng cung cấp.'];
for(const lesson of lessons){
  chunks.push(`## Ngày ${lesson.day}: ${lesson.title}`,lesson.phase,`Mục tiêu giai đoạn: ${lesson.goal}`,`${curriculum.days[lesson.day-1].words.length} từ vựng · ${lesson.review?'Ôn tập':'Bài học ngữ pháp'}`);
  for(const section of lesson.sections)chunks.push(`### ${section.title}`,...section.lines);
  chunks.push('### Lưu ý để dùng đúng',lesson.note);
  if(lesson.examples.length)chunks.push('### Ví dụ và phân tích');
  lesson.examples.forEach((e,i)=>chunks.push(`#### Ví dụ ${i+1}`,e.ko,e.vi,'**Vì sao dùng cấu trúc này?**',e.explanation));
  chunks.push('### Tài liệu ngữ pháp tham khảo','Lộ trình 60 ngày học ngữ pháp TOPIK I do bạn cung cấp. Nội dung được biên tập lại, sửa lỗi và bổ sung phân tích ví dụ; các ngày ôn tập giữ nhiệm vụ tự học.','Ngữ pháp N: danh từ · V: động từ · A: tính từ · Âm cuối: phụ âm ở cuối âm tiết. Không dùng phiên âm Latin thay cho cách viết và phát âm tiếng Hàn.','---');
}
const content=chunks.join('\n\n')+'\n';
assert.equal((content.match(/^## Ngày /gm)||[]).length,60);
fs.writeFileSync('TOAN_BO_NOI_DUNG_NGU_PHAP.md',content);
console.log(`Exported 60 days and ${lessons.reduce((n,l)=>n+l.examples.length,0)} explained examples.`);
