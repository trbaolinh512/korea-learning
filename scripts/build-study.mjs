import fs from 'node:fs';
const dir='tmp/sources/';
const lookup=new Map();
const add=(ko,vi,source,location)=>{
  ko=ko.trim().normalize('NFC');vi=vi.replace(/[·]/g,' ').replace(/^[\s:|=–—\-]+/,'').replace(/\s+/g,' ').trim();
  if(!/^[가-힣 ]+$/.test(ko)||!vi||vi.length>140||/[가-힣]/.test(vi)||lookup.has(ko))return;
  lookup.set(ko,{char:ko,viet:vi,source,location});
};
// Vietnamese pairs in the TOPIK I source; keep the actual PDF page for traceability.
for(const page of JSON.parse(fs.readFileSync(dir+'TOPIK I - 1000 TU VUNG.json','utf8'))){
  for(const raw of page.text.split('\n')){
    const line=raw.trim();
    const m=line.match(/^\s*\d+\.\s*([가-힣 ]+?)\s*[|=]\s*(.+)$/);
    if(m)add(m[1],m[2].split('=')[0],'TOPIK I - 1000 TU VUNG.pdf',`trang ${page.page}`);
  }
}
for(const filename of ['TỪ VỰNG THEO CHỦ ĐỀ','TỪ VỰNG NHÀ HÀNG']){
  const lines=fs.readFileSync(dir+filename+'.txt','utf8').split('\n');
  lines.forEach((raw,i)=>{const line=raw.trim();
    const m=line.match(/^\s*(?:\d+[. :\-]*)?\s*([가-힣 ]+?)\s*[:：]\s*(.+)$/)||line.match(/^\s*\d+[. ]+([가-힣 ]+?)\s+([^가-힣\d].+)$/);
    if(m)add(m[1],m[2],filename+'.docx',`đoạn ${i+1}`);
  });
}
const corrections=JSON.parse(fs.readFileSync('scripts/study-meanings.json','utf8'));
const topics=JSON.parse(fs.readFileSync('scripts/study-topics.json','utf8'));
const sourceTexts=['TỪ VỰNG TOPIK I KOREAN','TỪ VỰNG TOPIK I ENGLISH','TỪ VỰNG THEO CHỦ ĐỀ'].map(name=>({name:name+'.docx',text:fs.readFileSync(dir+name+'.txt','utf8')}));
const senses={7:{'열':'mười','네':'bốn (trước đơn vị đếm)'},9:{'배':'quả lê'},13:{'눈':'tuyết','해':'mặt trời'},14:{'배':'thuyền'},16:{'안':'bên trong'},17:{'눈':'mắt','배':'bụng'},18:{'열':'sốt','배':'bụng'},19:{'부르다':'hát; gọi'},23:{'일':'công việc'},29:{'네':'vâng'}};
const missing=[];
const themes=topics.map(([title,wordString],topicIndex)=>({title,words:wordString.split(' ').map(char=>{
  const origin=lookup.get(char);
  const viet=senses[topicIndex]?.[char]||corrections[char]||origin?.viet;
  if(!viet)missing.push(char);
  const supporting=sourceTexts.find(s=>s.text.includes(char));
  return {id:`word-${char}`,char,viet,source:origin?.source||supporting?.name||'Từ bổ sung theo chủ đề',location:origin?.location||'danh sách từ cơ bản',editorial:!!corrections[char]||!origin};
})}));
if(missing.length)throw new Error(`Missing reviewed meanings: ${[...new Set(missing)].join(' ')}`);
const lessons=JSON.parse(fs.readFileSync('src/data/study-grammar.json','utf8'));
const days=themes.flatMap((theme,i)=>[0,1].map(part=>({day:i*2+part+1,title:theme.title+(part?' · Vận dụng':' · Làm quen'),theme:i,grammarId:lessons[i].id,part,phase:i<10?'Nền tảng':i<20?'Mở rộng':'Vận dụng',words:theme.words.slice(part*10,part*10+10)})));
fs.writeFileSync('src/data/study-curriculum.json',JSON.stringify({version:2,themes,days},null,2));
console.log(`Built ${days.length} days, ${themes.length} topics, ${new Set(themes.flatMap(t=>t.words.map(w=>w.char))).size} unique words. ${themes.flatMap(t=>t.words).filter(w=>w.editorial).length} entries have editorial translations.`);

