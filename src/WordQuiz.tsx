import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Card } from './types';
import { shuffle, useStored } from './lib';
import { newCycle } from './practice';
import { speakKorean } from './speech';
import { Speaker } from './components';
import PracticeSettings, { SettingsButton } from './PracticeSettings';
function makeQuestion(target:Card,cards:Card[],listening:boolean){
  const reverse=!listening&&Math.random()<.5;
  const answer=reverse?target.char:target.viet;
  const wrong=[...new Set(cards.filter(c=>c.id!==target.id&&c.viet!==target.viet).map(c=>reverse?c.char:c.viet))].filter(text=>text!==answer);
  return {target,reverse,answer,choices:shuffle([answer,...shuffle(wrong).slice(0,3)])};
}
export default function WordQuiz({cards,mode,day,onComplete}:{cards:Card[];mode:'listen'|'read';day:number;onComplete:(c:number,t:number,label:string)=>void}){
  const listening=mode==='listen';
  const [options,setOptions]=useStored(`topik-${mode}-settings`,{seconds:0,showNext:false});
  const [settings,setSettings]=useState(false),[deck,setDeck]=useState(()=>newCycle(cards,[])),[index,setIndex]=useState(0),[number,setNumber]=useState(1);
  const [question,setQuestion]=useState(()=>makeQuestion(deck[0],cards,listening)),[answer,setAnswer]=useState<string|null>(null),[correct,setCorrect]=useState(0),[answered,setAnswered]=useState(0),[remaining,setRemaining]=useState(options.seconds);
  const locked=useRef(false),recent=useRef<string[]>([]);
  const next=()=>{let upcoming=deck,position=index+1;recent.current=[...recent.current,question.target.id].slice(-Math.min(10,cards.length-1));if(position>=deck.length){upcoming=newCycle(cards,recent.current);setDeck(upcoming);position=0}setIndex(position);setQuestion(makeQuestion(upcoming[position],cards,listening));setNumber(n=>n+1);setAnswer(null);locked.current=false;setRemaining(options.seconds)};
  useEffect(()=>{if(settings||answer!==null||!options.seconds)return;const end=Date.now()+options.seconds*1000;setRemaining(options.seconds);const timer=setInterval(()=>{const left=Math.max(0,Math.ceil((end-Date.now())/1000));setRemaining(left);if(!left&&!locked.current){locked.current=true;setAnswer('timeout');setAnswered(n=>n+1);onComplete(0,1,`Ngày ${day} · ${listening?'Nghe':'Đọc'}`);clearInterval(timer)}},100);return()=>clearInterval(timer)},[number,options.seconds,settings,answer]);
  useEffect(()=>{if(settings||answer===null)return;const timer=setTimeout(next,1000);return()=>clearTimeout(timer)},[number,answer,settings]);
  // Automatic listening starts after the tab's click; the speaker remains available for replay.
  useEffect(()=>{if(!listening||settings)return;const timer=setTimeout(()=>speakKorean(question.target.char),100);return()=>{clearTimeout(timer);window.speechSynthesis?.cancel()}},[number,listening,settings]);
  const pick=(choice:string)=>{if(locked.current)return;locked.current=true;const right=choice===question.answer;setAnswer(choice);setCorrect(n=>n+(right?1:0));setAnswered(n=>n+1);if(!listening)speakKorean(question.target.char);onComplete(right?1:0,1,`Ngày ${day} · ${listening?'Nghe':'Đọc'}`)};
  return <section className="quiz-panel word-quiz"><div className="quiz-heading"><span className="badge">{listening?'Nghe':'Đọc'} · Câu {number} · Vô hạn</span><div className="actions">{options.seconds>0&&<b className="timer">{remaining}s</b>}<SettingsButton onClick={()=>setSettings(true)}/></div></div><h2>{listening?'Nghe từ tiếng Hàn, chọn nghĩa đúng':question.reverse?'Chọn từ tiếng Hàn đúng với nghĩa':'Chọn nghĩa tiếng Việt phù hợp'}</h2>{listening?<div className="listen-prompt"><Speaker text={question.target.char}/><span>Nghe và chọn đáp án · Nhấn loa để nghe lại</span></div>:<p className="word-quiz-prompt" lang={question.reverse?'vi':'ko'}>{question.reverse?question.target.viet:question.target.char}</p>}<div className="options">{question.choices.map((choice,i)=><button key={choice} className={`option ${answer!==null&&choice===question.answer?'correct':''} ${answer===choice&&choice!==question.answer?'incorrect':''}`} disabled={answer!==null} onClick={()=>pick(choice)}><span className="option-letter">{String.fromCharCode(65+i)}</span><span>{choice}</span></button>)}</div>{answer!==null&&<div className={`feedback ${answer===question.answer?'good':'bad'}`} role="status"><strong>{answer===question.answer?'✓ Chính xác!':answer==='timeout'?'Hết thời gian.':'Chưa chính xác.'} Tự chuyển sau 1 giây.</strong><p>{question.target.char} → {question.target.viet}</p></div>}<div className="quiz-footer"><span>Đúng {correct}/{answered} · {cards.length} từ trong ngày</span>{options.showNext&&<button className="primary" onClick={next}>Câu tiếp<ArrowRight size={16}/></button>}</div>{settings&&<PracticeSettings kind="quiz" options={options} onChange={setOptions} onClose={()=>setSettings(false)}/>}</section>;
}
