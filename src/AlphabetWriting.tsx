import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Eraser, LoaderCircle } from 'lucide-react';
import data from './data/hangeul.json';
import { normalize, useStored } from './lib';
import type { Card } from './types';
import { newCycle, recognizeHandwriting } from './practice';
import type { InkPoint } from './practice';
import PracticeSettings, { SettingsButton } from './PracticeSettings';
import { speakKorean } from './speech';
type Filter='all'|'vowels'|'consonants';
const all=[...data.vowels,...data.consonants].map(item=>({...item,id:item.char}));
type Feedback={kind:'good'|'bad'|'loading'|'error';text:string};
export default function AlphabetWriting({onComplete,vocabulary,scope='alphabet',label='Chữ Hàn'}:{onComplete:(c:number,t:number,label:string)=>void;vocabulary?:Card[];scope?:string;label?:string}) {
  const pool:Card[]=vocabulary||all;
  const [filter,setFilter]=useState<Filter>('all'),[deck,setDeck]=useState(()=>newCycle(pool,[])),[index,setIndex]=useState(0),[number,setNumber]=useState(1),[feedback,setFeedback]=useState<Feedback|null>(null),[settings,setSettings]=useState(false);
  const [options,setOptions]=useStored(`${scope}-writing-settings`,{seconds:1,showNext:false});
  const canvas=useRef<HTMLCanvasElement>(null),paths=useRef<InkPoint[][]>([]),drawing=useRef(false),recent=useRef<string[]>([]),controller=useRef<AbortController|null>(null),requestVersion=useRef(0),recorded=useRef(false);
  const target=deck[index];
  const boardWidth=vocabulary?Math.min(900,Math.max(384,target.char.length*90)):256;
  const invalidate=()=>{requestVersion.current++;controller.current?.abort();controller.current=null};
  const redraw=()=>{
    const ctx=canvas.current?.getContext('2d');if(!ctx)return;
    ctx.clearRect(0,0,boardWidth,256);ctx.strokeStyle=document.documentElement.dataset.theme==='dark'?'#f1f5f9':'#1e293b';ctx.lineWidth=8;ctx.lineCap='round';ctx.lineJoin='round';
    for(const path of paths.current){if(!path.length)continue;ctx.beginPath();ctx.moveTo(path[0].x,path[0].y);for(const p of path.slice(1))ctx.lineTo(p.x,p.y);if(path.length===1)ctx.lineTo(path[0].x+.1,path[0].y+.1);ctx.stroke()}
  };
  const clear=()=>{invalidate();drawing.current=false;paths.current=[];redraw();setFeedback(null)};
  const next=()=>{
    clear();recorded.current=false;
    recent.current=[...recent.current,target.id].slice(-10);
    let upcoming=deck,position=index+1;
    if(position>=deck.length){const candidates=filter==='all'?pool:pool.filter(c=>data[filter].some(d=>d.char===c.char));upcoming=newCycle(candidates,recent.current);setDeck(upcoming);position=0}
    setIndex(position);setNumber(n=>n+1);
  };
  const changeFilter=(value:Filter)=>{
    clear();recent.current=[];recorded.current=false;
    const candidates=value==='all'?pool:pool.filter(c=>data[value].some(d=>d.char===c.char));
    setFilter(value);setDeck(newCycle(candidates,[]));setIndex(0);setNumber(1);
  };
  const check=async()=>{
    invalidate();if(!paths.current.length){setFeedback({kind:'error',text:'Hãy viết chữ vào bảng trước khi kiểm tra.'});return}
    const version=requestVersion.current,abort=new AbortController();controller.current=abort;
    const strokes=paths.current.map(path=>path.map(point=>({...point})));
    setFeedback({kind:'loading',text:'Đang nhận diện chữ…'});
    const timeout=setTimeout(()=>abort.abort(),15000);
    try{
      const guesses=await recognizeHandwriting(strokes,abort.signal,{width:boardWidth,height:256});
      if(requestVersion.current!==version)return;
      // Preserve the source recognizer's candidate matching, including composite predictions.
      const matched=guesses.some(guess=>vocabulary?normalize(guess)===normalize(target.char):guess.trim()===target.char||guess.includes(target.char));
      if(matched){setFeedback({kind:'good',text:`✓ Chính xác! Bạn viết đúng chữ “${target.char}”.`});speakKorean(target.char);if(!recorded.current){recorded.current=true;onComplete(1,1,`${label} · Luyện viết`)}}
      else setFeedback({kind:'bad',text:`Chưa chính xác! Đáp án là “${target.char}”. Máy nhận diện: “${guesses[0]||'?'}”. Hãy viết lại và thử tiếp.`});
    }catch(error){if(requestVersion.current===version)setFeedback({kind:'error',text:abort.signal.aborted?'Nhận diện mất quá lâu. Hãy kiểm tra kết nối và nhấn Kiểm tra để thử lại.':error instanceof Error?error.message:'Lỗi kết nối nhận diện. Hãy thử lại.'})}
    finally{clearTimeout(timeout);if(controller.current===abort)controller.current=null}
  };

  useEffect(()=>()=>{requestVersion.current++;controller.current?.abort()},[]);
  useEffect(()=>{
    if(feedback?.kind!=='good'||!options.seconds||settings)return;
    const timer=setTimeout(next,options.seconds*1000);return()=>clearTimeout(timer);
  },[feedback,options.seconds,settings]);
  const point=(e:React.PointerEvent<HTMLCanvasElement>):InkPoint=>{const r=e.currentTarget.getBoundingClientRect();return {x:(e.clientX-r.left)*boardWidth/r.width,y:(e.clientY-r.top)*256/r.height}};
  const end=()=>{if(!drawing.current)return;drawing.current=false;redraw()};
  return <section className={`quiz-panel alphabet-writing ${vocabulary?'word-writing':''}`}><div className="quiz-heading"><span className="badge">Luyện viết · {vocabulary?'Từ':'Chữ'} {number} · Vô hạn</span><SettingsButton onClick={()=>{invalidate();setFeedback(null);setSettings(true)}}/></div>{!vocabulary&&<div className="segmented writing-filter" aria-label="Nhóm chữ luyện viết">{([['all','Tất cả'],['vowels','Nguyên âm'],['consonants','Phụ âm']] as const).map(([key,label])=><button key={key} aria-pressed={filter===key} className={filter===key?'active':''} onClick={()=>changeFilter(key)}>{label}</button>)}</div>}<div className="writing-prompt"><span className="eyebrow">{vocabulary?'HÃY VIẾT TỪ TIẾNG HÀN CÓ NGHĨA':'HÃY VIẾT CHỮ CÓ CÁCH ĐỌC'}</span><h2>{target.viet}</h2>{target.romaja&&<span className="roman">/{target.romaja}/</span>}</div><div className="writing-board"><div className="canvas-wrap" style={{aspectRatio:`${boardWidth}/256`}}><canvas ref={canvas} width={boardWidth} height={256} aria-label={vocabulary?'Bảng luyện viết từ vựng':'Bảng luyện viết chữ Hàn'} onPointerDown={e=>{if(e.button!==0||drawing.current)return;invalidate();setFeedback(null);e.currentTarget.setPointerCapture(e.pointerId);drawing.current=true;paths.current.push([point(e)]);redraw()}} onPointerMove={e=>{if(!drawing.current)return;paths.current.at(-1)?.push(point(e));redraw()}} onPointerUp={end} onPointerCancel={()=>{drawing.current=false;invalidate()}} onLostPointerCapture={end}/></div><div className="actions centered"><button onClick={clear}><Eraser size={15}/> Xóa bảng</button><button className="primary" disabled={feedback?.kind==='loading'} onClick={()=>void check()}>{feedback?.kind==='loading'?<LoaderCircle size={16} className="spin"/>:<Check size={16}/>} Kiểm tra</button></div></div>{feedback&&<div role="status" className={`feedback ${feedback.kind==='good'?'good':feedback.kind==='bad'?'bad':''}`}><span>{feedback.text}</span>{feedback.kind==='good'&&options.seconds>0&&<p>Tự chuyển sau {options.seconds} giây.</p>}</div>}<div className="quiz-footer"><span>Bấm Kiểm tra để nhận diện chữ</span>{options.showNext&&<button className="primary" onClick={next}>Câu tiếp<ArrowRight size={17}/></button>}</div><p className="hint">Nét viết được gửi tới Google Input Tools để nhận diện. Cần kết nối Internet.</p>{settings&&<PracticeSettings kind="writing" options={options} onChange={value=>setOptions({...value,showNext:value.seconds===0?true:value.showNext})} onClose={()=>setSettings(false)}/>}</section>;
}



