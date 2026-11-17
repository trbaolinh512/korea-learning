import {useEffect,useRef,useState} from 'react';
import type {PointerEvent} from 'react';
import {ArrowRight,Check,Eraser,LoaderCircle,PenLine,Trash2,Undo2} from 'lucide-react';
import data from './data/hangeul.json';
import {normalize,useStored} from './lib';
import type {Card} from './types';
import {newCycle,recognizeHandwriting} from './practice';
import {eraseInk,prepareInk} from './ink';
import type {InkPoint} from './ink';
import PracticeSettings,{SettingsButton} from './PracticeSettings';
import {speakKorean} from './speech';

type Filter='all'|'vowels'|'consonants';
type Tool='pen'|'eraser';
type Feedback={kind:'good'|'bad'|'loading'|'error';text:string};
const all=[...data.vowels,...data.consonants].map(item=>({...item,id:item.char}));
export default function AlphabetWriting({onComplete,vocabulary,scope='alphabet',label='Chữ Hàn'}:{onComplete:(c:number,t:number,label:string)=>void;vocabulary?:Card[];scope?:string;label?:string}){
  const pool:Card[]=vocabulary||all;
  const [filter,setFilter]=useState<Filter>('all'),[deck,setDeck]=useState(()=>newCycle(pool,[])),[index,setIndex]=useState(0),[number,setNumber]=useState(1),[feedback,setFeedback]=useState<Feedback|null>(null),[settings,setSettings]=useState(false);
  const [options,setOptions]=useStored(`${scope}-writing-settings`,{seconds:1,showNext:false});
  const [tool,setTool]=useState<Tool>('pen'),[inkCount,setInkCount]=useState(0),[canUndo,setCanUndo]=useState(false);
  const [pixelRatio]=useState(()=>Math.min(3,window.devicePixelRatio||1));
  const canvas=useRef<HTMLCanvasElement>(null),paths=useRef<InkPoint[][]>([]),history=useRef<InkPoint[][][]>([]),drawing=useRef(false),erased=useRef(false),lastPoint=useRef<InkPoint|null>(null),recent=useRef<string[]>([]),controller=useRef<AbortController|null>(null),requestVersion=useRef(0),recorded=useRef(false);
  const target=deck[index],boardWidth=vocabulary?Math.min(900,Math.max(384,target.char.length*90)):256;
  const invalidate=()=>{requestVersion.current++;controller.current?.abort();controller.current=null};
  const redraw=()=>{
    const ctx=canvas.current?.getContext('2d');if(!ctx)return;
    ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);ctx.clearRect(0,0,boardWidth,256);ctx.strokeStyle=document.documentElement.dataset.theme==='dark'?'#f1f5f9':'#1e293b';ctx.lineWidth=5;ctx.lineCap='round';ctx.lineJoin='round';
    for(const path of paths.current){if(!path.length)continue;ctx.beginPath();ctx.moveTo(path[0].x,path[0].y);for(const p of path.slice(1))ctx.lineTo(p.x,p.y);if(path.length===1)ctx.lineTo(path[0].x+.1,path[0].y+.1);ctx.stroke()}
  };
  const refresh=()=>{setInkCount(paths.current.length);setCanUndo(history.current.length>0);redraw()};
  const remember=()=>{history.current=[...history.current.slice(-49),paths.current.map(s=>s.map(p=>({...p})))];setCanUndo(true)};
  const clear=(keepHistory=true)=>{invalidate();drawing.current=false;if(keepHistory&&paths.current.length)remember();paths.current=[];if(!keepHistory)history.current=[];refresh();setFeedback(null)};
  const undo=()=>{if(!history.current.length)return;invalidate();drawing.current=false;paths.current=history.current.pop()!;setFeedback(null);refresh()};
  const next=()=>{
    clear(false);recorded.current=false;recent.current=[...recent.current,target.id].slice(-10);
    if(index+1>=deck.length){const candidates=filter==='all'?pool:pool.filter(c=>data[filter].some(d=>d.char===c.char));setDeck(newCycle(candidates,recent.current));setIndex(0)}else setIndex(index+1);
    setNumber(n=>n+1);
  };
  const changeFilter=(value:Filter)=>{clear(false);recent.current=[];recorded.current=false;const candidates=value==='all'?pool:pool.filter(c=>data[value].some(d=>d.char===c.char));setFilter(value);setDeck(newCycle(candidates,[]));setIndex(0);setNumber(1)};
  const matches=(guess:string)=>vocabulary?normalize(guess)===normalize(target.char):guess.normalize('NFKC').trim()===target.char.normalize('NFKC');
  const check=async()=>{
    invalidate();drawing.current=false;if(!paths.current.length){setFeedback({kind:'error',text:'Hãy viết chữ vào bảng trước khi kiểm tra.'});return}
    const version=requestVersion.current,abort=new AbortController();controller.current=abort;
    const strokes=paths.current.map(s=>s.map(p=>({...p}))),guide={width:boardWidth,height:256};
    setFeedback({kind:'loading',text:'Đang nhận diện chữ…'});const timeout=setTimeout(()=>abort.abort(),15000);
    try{
      let guesses=await recognizeHandwriting(strokes,abort.signal,guide);
      if(requestVersion.current!==version)return;
      if(!guesses.some(matches)){
        // Retry the same ink centered and scaled, without supplying the expected answer.
        try{const retry=await recognizeHandwriting(prepareInk(strokes,guide),abort.signal,guide);guesses=[...new Set([...guesses,...retry])]}catch(error){if(abort.signal.aborted)throw error}
      }
      if(requestVersion.current!==version)return;
      if(guesses.some(matches)){
        setFeedback({kind:'good',text:`✓ Chính xác! Bạn viết đúng chữ “${target.char}”.`});speakKorean(target.char);
        if(!recorded.current){recorded.current=true;onComplete(1,1,`${label} · Luyện viết`)}
      }else setFeedback({kind:'bad',text:`Chưa chính xác! Đáp án là “${target.char}”. Máy nhận diện: “${guesses.slice(0,5).join(' · ')||'?'}”. Hãy viết lại và thử tiếp.`});
    }catch(error){if(requestVersion.current===version)setFeedback({kind:'error',text:abort.signal.aborted?'Nhận diện mất quá lâu. Hãy kiểm tra kết nối và nhấn Kiểm tra để thử lại.':error instanceof Error?error.message:'Lỗi kết nối nhận diện. Hãy thử lại.'})}
    finally{clearTimeout(timeout);if(controller.current===abort)controller.current=null}
  };
  useEffect(()=>()=>{requestVersion.current++;controller.current?.abort()},[]);
  useEffect(()=>{redraw();const observer=new MutationObserver(redraw);observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});return()=>observer.disconnect()},[boardWidth,pixelRatio]);
  useEffect(()=>{if(!feedback||feedback.kind!=='good'||!options.seconds||settings)return;const timer=setTimeout(next,options.seconds*1000);return()=>clearTimeout(timer)},[feedback,options.seconds,settings]);
  const point=(e:{clientX:number;clientY:number}):InkPoint=>{const r=canvas.current!.getBoundingClientRect();return {x:Math.max(0,Math.min(boardWidth,(e.clientX-r.left)*boardWidth/r.width)),y:Math.max(0,Math.min(256,(e.clientY-r.top)*256/r.height))}};
  const erase=(from:InkPoint,to:InkPoint)=>{
    const r=canvas.current!.getBoundingClientRect(),remaining=eraseInk(paths.current,from,to,14*boardWidth/r.width);
    if(remaining.length!==paths.current.length){if(!erased.current){remember();erased.current=true}paths.current=remaining;refresh()}
  };
  const start=(e:PointerEvent<HTMLCanvasElement>)=>{
    if(e.button!==0||drawing.current)return;invalidate();setFeedback(null);e.currentTarget.setPointerCapture(e.pointerId);drawing.current=true;const p=point(e);lastPoint.current=p;
    if(tool==='pen'){remember();paths.current.push([p]);refresh()}else{erased.current=false;erase(p,p)}
  };
  const move=(e:PointerEvent<HTMLCanvasElement>)=>{
    if(!drawing.current)return;const p=point(e);
    if(tool==='eraser')erase(lastPoint.current||p,p);else{paths.current.at(-1)?.push(p);redraw()}
    lastPoint.current=p;
  };
  const end=()=>{drawing.current=false;lastPoint.current=null;refresh()};
  return <section className={`quiz-panel alphabet-writing ${vocabulary?'word-writing':''}`}>
    <div className="quiz-heading"><span className="badge">Luyện viết · {vocabulary?'Từ':'Chữ'} {number} · Vô hạn</span><SettingsButton onClick={()=>{invalidate();setFeedback(null);setSettings(true)}}/></div>
    {!vocabulary&&<div className="segmented writing-filter" aria-label="Nhóm chữ luyện viết">{([['all','Tất cả'],['vowels','Nguyên âm'],['consonants','Phụ âm']] as const).map(([key,name])=><button key={key} aria-pressed={filter===key} className={filter===key?'active':''} onClick={()=>changeFilter(key)}>{name}</button>)}</div>}
    <div className="writing-prompt"><span className="eyebrow">{vocabulary?'HÃY VIẾT TỪ TIẾNG HÀN CÓ NGHĨA':'HÃY VIẾT CHỮ CÓ CÁCH ĐỌC'}</span><h2>{target.viet}</h2>{target.romaja&&<span className="roman">/{target.romaja}/</span>}</div>
    <div className="writing-editor">
      <div className="writing-editor-heading"><strong>Bảng luyện viết</strong><span className="small muted ink-count">{inkCount} nét</span></div>
      <div className="writing-tools"><div className="segmented" aria-label="Công cụ vẽ">{([['pen','Bút',PenLine],['eraser','Tẩy nét',Eraser]] as const).map(([key,name,Icon])=><button key={key} aria-pressed={tool===key} className={tool===key?'active':''} onClick={()=>{drawing.current=false;setTool(key)}}><Icon size={16}/>{name}</button>)}</div></div>
      <div className="canvas-wrap" style={{aspectRatio:`${boardWidth}/256`}}><canvas ref={canvas} width={boardWidth*pixelRatio} height={256*pixelRatio} aria-label={vocabulary?'Bảng luyện viết từ vựng':'Bảng luyện viết chữ Hàn'} style={{touchAction:'none',cursor:tool==='eraser'?'cell':'crosshair'}} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={()=>{drawing.current=false;invalidate();refresh()}} onLostPointerCapture={end}/></div>
      <div className="actions centered"><button onClick={undo} disabled={!canUndo}><Undo2 size={16}/>Hoàn tác</button><button onClick={()=>clear()}><Trash2 size={16}/>Xóa bảng</button><button className="primary" disabled={feedback?.kind==='loading'} onClick={()=>void check()}>{feedback?.kind==='loading'?<LoaderCircle size={16} className="spin"/>:<Check size={16}/>}Kiểm tra</button></div>
      <p className="small muted">Tẩy nét xóa nét chạm vào. Dùng Hoàn tác để khôi phục nét vừa xóa.</p>
    </div>
    {feedback&&<div role="status" className={`feedback ${feedback.kind==='good'?'good':feedback.kind==='bad'?'bad':''}`}><span>{feedback.text}</span>{feedback.kind==='good'&&options.seconds>0&&<p>Tự chuyển sau {options.seconds} giây.</p>}</div>}
    <div className="quiz-footer"><span>Bấm Kiểm tra để nhận diện chữ</span>{options.showNext&&<button className="primary" onClick={next}>Câu tiếp<ArrowRight size={17}/></button>}</div><p className="hint">Nét viết được gửi tới Google Input Tools để nhận diện. Cần kết nối Internet.</p>
    {settings&&<PracticeSettings kind="writing" options={options} onChange={value=>setOptions({...value,showNext:value.seconds===0?true:value.showNext})} onClose={()=>setSettings(false)}/>}
  </section>;
}
