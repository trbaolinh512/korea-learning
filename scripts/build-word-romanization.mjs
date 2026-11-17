import fs from 'node:fs';
import assert from 'node:assert/strict';
import {romanize} from 'koroman';
const curriculum=JSON.parse(fs.readFileSync('src/data/study-curriculum.json','utf8'));
// Lexical boundaries cannot always be inferred by a generic character converter.
// These fixed forms are editorial corrections, not claimed Papago extractions.
const corrections={
  '월요일':'woryoil','목요일':'mogyoil','일요일':'iryoil',
  '백화점':'baekhwajeom','맛없다':'madeopda',
  '따뜻하다':'ttatteutada','깨끗하다':'kkaekkeutada'
};
const words=[...new Set(curriculum.days.flatMap(d=>d.words.map(w=>w.char)))];
const entries=Object.fromEntries(words.map(word=>[word,corrections[word]||romanize(word,{usePronunciationRules:true,useCustomDictionary:false,casingOption:'lowercase'})]));
for(const [word,value] of Object.entries(entries))assert.match(value,/^[a-z -]+$/,word);
const result={scheme:'Revised Romanization (RR)',source:'https://www.korean.go.kr/front_eng/roman/roman_01.do',generator:'koroman@1.0.16',verifiedWithPapago:false,editorialCorrections:corrections,entries};
fs.writeFileSync('src/data/word-romanization.json',JSON.stringify(result,null,2)+'\n');
console.log(`Generated RR for ${words.length} words with ${Object.keys(corrections).length} editorial corrections; not verified with Papago.`);
