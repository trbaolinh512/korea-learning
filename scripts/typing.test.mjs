import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source=fs.readFileSync('references/korean-typing-v6.html','utf8');
const script=source.match(/<!-- App Logic JavaScript -->\s*<script>([\s\S]*?)<\/script>/)[1];
const original=vm.createContext({window:{addEventListener(){}}});vm.runInContext(script,original);
const compiled=ts.transpileModule(fs.readFileSync('src/typing.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
const exports={};const port=vm.createContext({exports,require:()=>JSON.parse(fs.readFileSync('src/data/typing.json','utf8'))});vm.runInContext(compiled,port);
test('typing dataset and maps retain all original v6 values',()=>{
  const data=JSON.parse(fs.readFileSync('src/data/typing.json','utf8'));
  for(const name of ['sentences','keyboardRows','qwertyJamoMap','jamoKeyMap'])assert.equal(JSON.stringify(data[name]),vm.runInContext(`JSON.stringify(${name})`,original));
  assert.equal(data.sentences.length,20);
});
test('composition and decomposition match v6 including its existing edge behavior',()=>{
  for(const value of ['','안녕하세요','읽어요','괜찮아요','각 값 밖','dkssudgktpdy','rhk','rkqt','Rk','A','hello world?','ㄱㅏ','ㅘ','!']){
    assert.equal(exports.convertQwertyToHangul(value),original.convertQwertyToHangul(value));
    assert.equal(JSON.stringify(exports.decomposeSentenceToJamos(value)),JSON.stringify(original.decomposeSentenceToJamos(value)));
  }
});
