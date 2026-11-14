import {useEffect, useRef, useState} from 'react';
import type {FormEvent} from 'react';
import {Eye, EyeOff, Keyboard, Lightbulb, Shuffle} from 'lucide-react';
import data from './data/typing.json';
import {decomposeKoreanChar, decomposeSentenceToJamos} from './typing';

const keyMap:Record<string,string>=data.jamoKeyMap;

export default function KoreanTyping(){
  const [index,setIndex]=useState(0),[typed,setTyped]=useState(''),[hint,setHint]=useState(false),[keyboard,setKeyboard]=useState(true),[active,setActive]=useState<Set<string>>(new Set());
  const input=useRef<HTMLInputElement>(null),current=useRef(0),changing=useRef(false),timers=useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const sentence=data.sentences[index];
  function later(action:()=>void,delay:number){const timer=setTimeout(()=>{timers.current.delete(timer);action()},delay);timers.current.add(timer)}
  function nextSentence(){
    let next=Math.floor(Math.random()*data.sentences.length);
    if(data.sentences.length>1&&next===current.current)next=(next+1)%data.sentences.length;
    current.current=next;input.current?.blur();if(input.current)input.current.value='';setTyped('');setIndex(next);
    later(()=>input.current?.focus(),50);
  }
  useEffect(()=>{
    nextSentence();
    return ()=>{timers.current.forEach(clearTimeout);timers.current.clear()};
    // Initialize exactly once per mount; event handlers read the current sentence ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  function handleInput(event:FormEvent<HTMLInputElement>){
    if(changing.current)return;
    const value=event.currentTarget.value;setTyped(value);
    if(value===data.sentences[current.current].ko){changing.current=true;later(()=>{nextSentence();changing.current=false},300)}
  }
  let activeIndex=typed.length;
  for(let i=0;i<typed.length;i++)if(typed[i]!==sentence.ko[i]){activeIndex=i;break}
  const nextJamo=decomposeSentenceToJamos(sentence.ko)[decomposeSentenceToJamos(typed).length];
  const targetKey=hint?(nextJamo===' '?'space':keyMap[nextJamo]?.toLowerCase()):undefined;
  const hintText=!hint?'':!nextJamo?'Hoàn thành!':nextJamo===' '?'Ký tự tiếp theo: [Khoảng trắng]':keyMap[nextJamo]?`Nét tiếp theo: ${nextJamo} (${keyMap[nextJamo].toUpperCase()})`:`Nét tiếp theo: ${nextJamo}`;
  function characterClass(char:string,i:number){
    if(i<typed.length){
      if(typed[i]===char)return 'char-correct';
      if(i===activeIndex){
        const target=decomposeKoreanChar(char),entered=decomposeKoreanChar(typed[i]);
        const partial=target.length>=entered.length&&entered.every((j,n)=>j===target[n]);
        return partial?'char-current':'char-incorrect char-current';
      }
      return 'char-incorrect';
    }
    return i===activeIndex?'char-current':'';
  }
  return <section className="korean-typing" aria-label="Luyện gõ tiếng Hàn" onClick={event=>{if(!(event.target as HTMLElement).closest('button,input'))input.current?.focus()}}>
    <div className="typing-toolbar"><div><h2><Keyboard size={22}/> Luyện gõ tiếng Hàn</h2><p className="muted">Gõ ngẫu nhiên câu tiếng Hàn · Bàn phím ảo 2-Set</p></div><div className="actions">
      <button aria-pressed={hint} className={hint?'typing-hint-on':''} onClick={()=>setHint(!hint)}><Lightbulb size={16}/>Gợi ý: {hint?'Bật':'Tắt'}</button>
      <button aria-expanded={keyboard} aria-controls="typing-keyboard" onClick={()=>setKeyboard(!keyboard)}>{keyboard?<Eye size={16}/>:<EyeOff size={16}/>} {keyboard?'Ẩn bàn phím':'Hiện bàn phím'}</button>
    </div></div>
    <div className="panel typing-target"><div className="typing-target-toolbar"><span className="eyebrow">Mẫu câu luyện gõ</span><button onClick={nextSentence}><Shuffle size={15}/>Đổi câu khác</button></div>
      <div className="typing-sentence" lang="ko" aria-label={sentence.ko}>{Array.from(sentence.ko).map((char,i)=><span key={i} className={characterClass(char,i)}>{char===' '?'\u00a0':char}</span>)}</div>
      <p className="muted typing-translation">“{sentence.vi}”</p>
    </div>
    <div className="typing-input-wrap"><label htmlFor="typing-input" className="eyebrow">Nhập câu tiếng Hàn</label><input id="typing-input" ref={input} lang="ko" type="text" autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} placeholder="Gõ câu tiếng Hàn ở đây…" onInput={handleInput} onCompositionUpdate={handleInput} onCompositionEnd={handleInput}
      onKeyDown={event=>{const key=event.code==='Space'?'space':event.key.toLowerCase();setActive(keys=>new Set(keys).add(key))}}
      onKeyUp={event=>{const key=event.code==='Space'?'space':event.key.toLowerCase();setActive(keys=>{const next=new Set(keys);next.delete(key);return next})}}/>
      <p className="muted small">Bật bàn phím/IME tiếng Hàn để nhập. Gõ đúng toàn bộ câu, kể cả dấu câu và khoảng trắng, để tự chuyển sau 300 ms.</p>
    </div>
    {keyboard&&<div id="typing-keyboard" className="panel typing-keyboard"><div className="typing-keyboard-heading"><strong>Bàn phím ảo tiếng Hàn (2-Set)</strong><span className="typing-key-hint" role="status">{hintText}</span></div>
      {data.keyboardRows.map((row,i)=><div className="typing-key-row" key={i}>{row.map(key=><div key={key.q} data-key={key.q} className={`typing-key ${targetKey===key.q?'key-target':''} ${active.has(key.q)?'key-active':''}`}>
        <div className="typing-key-top"><span>{key.q.toUpperCase()}</span>{key.shiftKo!==key.ko&&<span lang="ko">{key.shiftKo}</span>}</div><span className="typing-key-ko" lang="ko">{key.ko}</span>
      </div>)}</div>)}
      <div className="typing-key-row"><div data-key="space" className={`typing-space ${targetKey==='space'?'key-target':''} ${active.has('space')?'key-active':''}`}>Space</div></div>
    </div>}
  </section>;
}
