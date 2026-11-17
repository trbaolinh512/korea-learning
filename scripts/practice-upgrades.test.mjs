import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const json=name=>JSON.parse(fs.readFileSync(`src/data/${name}.json`,'utf8'));
function moduleAt(path){const exports={};const compiled=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText;vm.runInNewContext(compiled,{exports,require:name=>json(name.split('/').at(-1).replace('.json',''))});return exports}
const {eraseInk,prepareInk,normalizeKoreanAnswer}=moduleAt('src/ink.ts');
test('eraser removes sparse intersecting strokes while preserving others',()=>{
  const ink=[[{x:0,y:0},{x:100,y:0}],[{x:0,y:50},{x:100,y:50}],[{x:150,y:150}]];
  let result=eraseInk(ink,{x:50,y:-10},{x:50,y:10},3);assert.equal(result.length,2);assert.equal(result[0],ink[1]);
  result=eraseInk(ink,{x:140,y:150},{x:160,y:150},4);assert.equal(result.length,2);assert.equal(ink.length,3);
});
test('recognition preparation preserves stroke shape and leaves a safe margin',()=>{
  const ink=[[{x:200,y:100},{x:210,y:110}],[{x:NaN,y:20}]],guide={width:256,height:256};
  const normalized=prepareInk(ink,guide);assert.equal(normalized.length,1);assert.equal(normalized[0][1].x-normalized[0][0].x,normalized[0][1].y-normalized[0][0].y);
  assert.ok(normalized.flat().every(p=>p.x>=20&&p.x<=236&&p.y>=20&&p.y<=236));assert.equal(ink[0][0].x,200);
});
test('grammar answers accept punctuation and Unicode composition, but preserve words and spacing',()=>{
  const expected='저는 학생이에요.';
  assert.equal(normalizeKoreanAnswer(expected),normalizeKoreanAnswer('  저는   학생이에요! '));
  assert.equal(normalizeKoreanAnswer(expected),normalizeKoreanAnswer(expected.normalize('NFD')));
  assert.notEqual(normalizeKoreanAnswer(expected),normalizeKoreanAnswer('저는학생이에요'));
  assert.notEqual(normalizeKoreanAnswer(expected),normalizeKoreanAnswer('저는 의사예요.'));
});
test('every grammar day has a contextual exercise, with cumulative reviews and irregular examples',()=>{
  const {grammarQuestions}=moduleAt('src/grammarPractice.ts');
  for(let day=1;day<=60;day++){const questions=grammarQuestions(day);assert.ok(questions.length>=12,`Day ${day}`);assert.equal(new Set(questions.map(q=>q.ko)).size,questions.length);for(const q of questions){assert.ok(q.vi&&q.ko&&q.explanation);assert.match(q.ko,/[가-힣]/);if(![15,30,45,60].includes(day))assert.equal(q.lessonDay,day)}}
  assert.ok(grammarQuestions(60).some(q=>q.lessonDay===59));
  assert.ok(grammarQuestions(30).every(q=>q.lessonDay>=16&&q.lessonDay<30));
});
test('grammar templates restore the source sentence and keep four distinct morphology choices',()=>{
  const bank=json('grammar-drills');assert.ok(bank.length>=1000);
  for(const q of bank){assert.equal(q.blank.replace('(      )',q.focus),q.ko,q.id);assert.equal(new Set([q.focus,...q.distractors]).size,4,q.id)}
  const intentions=bank.filter(q=>q.lessonDay===36);
  assert.ok(intentions.some(q=>q.ko.includes('보려고 해요')));
  assert.ok(intentions.some(q=>q.ko.includes('만들려고 해요')));
  assert.ok(intentions.some(q=>q.ko.includes('들으려고 해요')));
  assert.doesNotMatch(JSON.stringify(intentions),/볼려고|마실려고|살려고/);
  assert.doesNotMatch(bank.map(q=>q.ko).join('\n'),/만들는/);
  assert.ok(bank.some(q=>q.lessonDay===54&&q.ko.includes('만드는 사람')));
});
test('grammar practice distributes question types by phase and avoids repeats until the deck is exhausted',()=>{
  const {grammarQuestions,grammarPlan,GrammarPracticeSession,isChoice}=moduleAt('src/grammarPractice.ts');
  for(const [day,percentage] of [[1,8],[16,6],[36,7],[51,10]])assert.equal(grammarPlan(day).filter(isChoice).length,percentage);
  const pool=grammarQuestions(1),engine=new GrammarPracticeSession(pool,1,'mixed',()=>.3),seen=[];
  for(let n=0;n<pool.length;n++){const q=engine.next();assert.ok(!seen.includes(q.id));seen.push(q.id);engine.submit(q,true);if(isChoice(q.kind)){assert.equal(new Set(q.choices).size,4);assert.equal(q.choices.filter(c=>c===q.answer).length,1)}}
  assert.ok(!seen.slice(-8).includes(engine.next().id));
});
test('wrong grammar questions return after four intervening questions with reordered answers',()=>{
  const {grammarQuestions,GrammarPracticeSession}=moduleAt('src/grammarPractice.ts');
  const engine=new GrammarPracticeSession(grammarQuestions(1),1,'choice',()=>.1),first=engine.next();engine.submit(first,false);engine.submit(first,false);assert.equal(engine.pendingReviews,1);
  for(let n=0;n<4;n++){const q=engine.next();assert.notEqual(q.id,first.id);assert.equal(q.review,false);engine.submit(q,true)}
  const review=engine.next();assert.equal(review.id,first.id);assert.equal(review.review,true);assert.equal(review.kind,first.kind);assert.notEqual(review.choices.join('|'),first.choices.join('|'));engine.submit(review,true);assert.equal(engine.pendingReviews,0);
});
test('context questions use short dialogues and order reviews reshuffle their pieces',()=>{
  const {grammarQuestions,GrammarPracticeSession}=moduleAt('src/grammarPractice.ts');
  const dialog=new GrammarPracticeSession(grammarQuestions(18),18,'choice');dialog.next();dialog.next();const context=dialog.next();assert.match(context.prompt,/가: 뭘 하고 싶어요\?/);assert.match(context.prompt,/나: .*\(      \)/);
  const order=new GrammarPracticeSession(grammarQuestions(1),1,'order',()=>.2),first=order.next();order.submit(first,false);for(let i=0;i<4;i++){const q=order.next();order.submit(q,true)}const review=order.next();assert.equal(review.id,first.id);assert.notEqual(review.tokens.join('|'),first.tokens.join('|'));
});
test('unsupported saved practice modes fall back to a usable mixed session',()=>{
  const {normalizePracticeMode,grammarQuestions,GrammarPracticeSession}=moduleAt('src/grammarPractice.ts');
  for(const value of ['old-mode',null,12,{},false]){const mode=normalizePracticeMode(value);assert.equal(mode,'mixed');const q=new GrammarPracticeSession(grammarQuestions(1),1,mode).next();assert.equal(q.kind,'meaning');assert.equal(q.choices.length,4)}
  for(const value of ['mixed','choice','order','conjugate','typing'])assert.equal(normalizePracticeMode(value),value);
});
test('all 504 vocabulary words have Latin RR with truthful source metadata',()=>{
  const data=json('word-romanization'),words=[...new Set(json('study-curriculum').days.flatMap(d=>d.words.map(w=>w.char)))];assert.equal(words.length,504);
  assert.equal(data.verifiedWithPapago,false);assert.equal(Object.keys(data.entries).length,words.length);for(const word of words)assert.match(data.entries[word],/^[a-z -]+$/);
  for(const [ko,rr] of Object.entries({'학교':'hakgyo','한국어':'hangugeo','학생':'haksaeng','월요일':'woryoil','목요일':'mogyoil','일요일':'iryoil','맛없다':'madeopda','백화점':'baekhwajeom'}))assert.equal(data.entries[ko],rr);
});
