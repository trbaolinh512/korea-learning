import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import dataset from './data/alphabet-quiz.json';
import { shuffle, useStored } from './lib';
import { newCycle } from './practice';
import { speakKorean } from './speech';
import PracticeSettings, { SettingsButton } from './PracticeSettings';
type Item=typeof dataset[number] & {id:string;speechText?:string};
const items:Item[]=dataset.map((item,i)=>({...item,id:`alphabet-${i}`}));
function questionFor(target:Item) {
  let others=items.filter(i=>i.subCategory===target.subCategory&&i.char!==target.char);
  if(others.length<3)others=items.filter(i=>i.categoryGroup===target.categoryGroup&&i.char!==target.char);
  return {target,options:shuffle([target,...shuffle(others).slice(0,3)])};
}
export default function AlphabetQuiz({onComplete}:{onComplete:(c:number,t:number,label:string)=>void}) {
  const [options,setOptions]=useStored('alphabet-quiz-settings',{seconds:0,showNext:false});
  const [settings,setSettings]=useState(false),[deck,setDeck]=useState(()=>newCycle(items,[])),[position,setPosition]=useState(0),[number,setNumber]=useState(1);
  const [question,setQuestion]=useState(()=>questionFor(deck[0])),[answer,setAnswer]=useState<string|null>(null),[streak,setStreak]=useState(0),[correct,setCorrect]=useState(0),[answered,setAnswered]=useState(0),[remaining,setRemaining]=useState(options.seconds);
  const recent=useRef<string[]>([]), locked=useRef(false);
  const next=()=>{
    let upcoming=deck,index=position+1;
    recent.current=[...recent.current,question.target.id].slice(-10);
    if(index>=upcoming.length){upcoming=newCycle(items,recent.current);index=0;setDeck(upcoming)}
    setPosition(index);setQuestion(questionFor(upcoming[index]));setNumber(n=>n+1);setAnswer(null);locked.current=false;setRemaining(options.seconds);
  };
  useEffect(()=>{
    if(settings||answer!==null||!options.seconds)return;
    const end=Date.now()+options.seconds*1000;
    setRemaining(options.seconds);
    const timer=setInterval(()=>{
      const left=Math.max(0,Math.ceil((end-Date.now())/1000));setRemaining(left);
      if(!left&&!locked.current){locked.current=true;setAnswer('timeout');setStreak(0);setAnswered(n=>n+1);onComplete(0,1,'Chữ Hàn · Trắc nghiệm');clearInterval(timer)}
    },100);
    return()=>clearInterval(timer);
  },[number,options.seconds,settings,answer]);
  useEffect(()=>{if(settings||answer===null)return;const timer=setTimeout(next,1000);return()=>clearTimeout(timer)},[number,answer,settings]);
  const pick=(item:Item)=>{
    if(locked.current)return;locked.current=true;
    const right=item.id===question.target.id;
    setAnswer(item.id);setStreak(n=>right?n+1:0);setCorrect(n=>n+(right?1:0));setAnswered(n=>n+1);
    speakKorean(question.target.speechText||question.target.char);onComplete(right?1:0,1,'Chữ Hàn · Trắc nghiệm');
  };

  const right=answer===question.target.id;
  return <section className="quiz-panel alphabet-quiz"><div className="quiz-heading"><span className="badge">Trắc nghiệm · Câu {number} · Vô hạn</span><div className="actions">{options.seconds>0&&<b className="timer">{remaining}s</b>}<SettingsButton onClick={()=>setSettings(true)}/></div></div>{options.seconds>0&&<div className="progress"><span style={{width:`${remaining/options.seconds*100}%`}}/></div>}<h2>{question.target.prompt}</h2><div className="alphabet-quiz-char" lang="ko">{question.target.char}</div><div className="options">{question.options.map((item,i)=><button key={item.id} disabled={answer!==null} className={`option ${answer!==null&&item.id===question.target.id?'correct':''} ${answer===item.id&&!right?'incorrect':''}`} onClick={()=>pick(item)}><span className="option-letter">{String.fromCharCode(65+i)}</span><span>{item.viet}</span><small className="muted">/{item.romaja}/</small></button>)}</div>{answer!==null&&<div className={`feedback ${right?'good':'bad'}`} role="status"><strong>{right?'✓ Chính xác! Tự chuyển sau 1 giây.':answer==='timeout'?'Hết thời gian! Tự chuyển sau 1 giây.':'Chưa đúng. Đáp án xanh là chính xác. Tự chuyển sau 1 giây.'}</strong><p>[{question.target.char}] {question.target.viet} (/{question.target.romaja}/) · {question.target.desc}</p></div>}<div className="quiz-footer"><span>Đúng {correct}/{answered} · Chuỗi đúng: <b>{streak}</b></span>{options.showNext&&<button className="primary" onClick={next}>Câu tiếp<ArrowRight size={17}/></button>}</div>{settings&&<PracticeSettings kind="quiz" options={options} onChange={setOptions} onClose={()=>setSettings(false)}/>}</section>;
}


