import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';
import { correctAlphabet, correctExam } from './content-corrections.mjs';
const original = readFileSync('references/hangeul-original.html', 'utf8');
const topik = readFileSync('references/topik-original.html', 'utf8');
function literal(source, name) {
  const start = source.indexOf(`const ${name}`);
  const equals = source.indexOf('=', start);
  let quote = '', escaped = false, depth = 0, end = equals + 1;
  for (; end < source.length; end++) {
    const c = source[end];
    if (quote) { if (escaped) escaped = false; else if (c === '\\') escaped = true; else if (c === quote) quote = ''; continue; }
    if (c === '"' || c === "'") quote = c;
    else if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') { depth--; if (!depth) { end++; break; } }
  }
  return vm.runInNewContext(`(${source.slice(equals + 1, end)})`, Object.create(null), { timeout: 1000 });
}
const alphabet=literal(original,'hangeulData'),alphabetQuiz=literal(original,'hangeulQuizDataset');
correctAlphabet(alphabet,alphabetQuiz);
writeFileSync('src/data/hangeul.json',JSON.stringify(alphabet,null,2));
writeFileSync('src/data/alphabet-quiz.json',JSON.stringify(alphabetQuiz,null,2));
for (const [file, source, name] of [['curriculum',topik,'DATA'],['grammar',topik,'GRAMMAR_120'],['exam',topik,'EXAM_STYLE_BANK'],['strokes',original,'strokeGuideImages']]) {
  const data = literal(source,name);
  if(file==='exam'){
    const before=JSON.parse(JSON.stringify(data));correctExam(data);
    const updates=data.flatMap((after,i)=>JSON.stringify(before[i])===JSON.stringify(after)?[]:[{before:before[i],after}]);
    writeFileSync('src/data/exam-content-updates.json',JSON.stringify(updates,null,2));
  }
  writeFileSync(`src/data/${file}.json`, JSON.stringify(data,null,2));
  console.log(file, Array.isArray(data) ? data.length : Object.keys(data));
}
