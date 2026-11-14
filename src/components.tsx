import { useEffect, useState } from 'react';
import { ArrowRight, Check, CheckCheck, Eye, EyeOff, RotateCcw, Shuffle, Volume2 } from 'lucide-react';
import { clockText, shuffle } from './lib';
import type { Card, Question } from './types';
import { speakKorean } from './speech';

export function Speaker({text}: {text: string}) {
  const [notice, setNotice] = useState('');
  const speak = () => setNotice(speakKorean(text));
  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);
  return <span className="speaker-wrap"><button type="button" className="icon-button speaker" title={`Nghe ${text}`} aria-label={`Nghe ${text}`} onClick={speak}><Volume2 size={18}/></button>{notice && <span role="status" className="voice-notice">{notice}</span>}</span>;
}

export function Flashcards({cards, learned, onLearn}: {cards: Card[]; learned: string[]; onLearn: (id:string) => void}) {
  const [items,setItems] = useState(cards), [revealed,setRevealed] = useState<string[]>([]), [all,setAll] = useState(false), [filter,setFilter] = useState('all'), [notice,setNotice] = useState('');
  const shown = filter === 'new' ? items.filter(c => !learned.includes(c.id)) : items;
  return <><div className="toolbar"><div className="segmented"><button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>Tất cả <small>{cards.length}</small></button><button className={filter==='new'?'active':''} onClick={()=>setFilter('new')}>Chưa thuộc</button></div><div className="actions"><button onClick={()=>{setItems(shuffle(items));setRevealed([])}}><Shuffle size={16}/> Xáo trộn</button><button onClick={()=>setAll(!all)}>{all?<EyeOff size={16}/>:<Eye size={16}/>} {all?'Ẩn tất cả':'Hiện tất cả'}</button><button className="icon-button" title="Đặt lại thẻ" onClick={()=>{setItems(cards);setRevealed([]);setAll(false);setFilter('all')}}><RotateCcw size={16}/></button></div></div>
  <div className="card-grid">{shown.map((c,i)=>{const open=all||revealed.includes(c.id),known=learned.includes(c.id);return <article className={`flashcard ${open?'revealed':''}`} key={c.id}><div className="flash-top"><span className="badge">{c.category||'Từ vựng'}</span><Speaker text={c.speechText||c.char}/></div><button className="card-face" aria-label={`${open?'Ẩn':'Lật'} thẻ ${c.char}`} aria-expanded={open} onClick={()=>{setNotice(speakKorean(c.speechText||c.char));setRevealed(open?revealed.filter(id=>id!==c.id):[...revealed,c.id])}}><span className={`character ${c.char.length>4?'long':''}`} lang="ko">{c.char}</span>{open?<><strong>{c.viet}</strong>{c.romaja&&<span className="roman">/{c.romaja}/</span>}<span className="card-desc">{c.desc||'Nhấn để ẩn nghĩa'}</span></>:<span className="flip-hint"><Eye size={14}/> Nhấn để lật thẻ</span>}</button><div className="flash-bottom"><span>{String(i+1).padStart(2,'0')}</span><button className={known?'known':''} aria-pressed={known} onClick={()=>onLearn(c.id)}>{known?<CheckCheck size={15}/>:<Check size={15}/>} {known?'Đã thuộc':'Đánh dấu thuộc'}</button></div></article>})}</div>{!shown.length&&<div className="empty">Bạn đã thuộc tất cả thẻ trong nhóm này! 🎉</div>}<p className="hint" role={notice?"status":undefined}>{notice && <>{notice}<br/></>}💡 Nhấn thẻ để nghe và xem đáp án · Đánh dấu những thẻ bạn đã thuộc</p></>;
}

export function Quiz({pool, label, onComplete}: {pool: Question[]; label:string; onComplete:(correct:number,total:number)=>void}) {
  const [round,setRound]=useState(()=>shuffle(pool).slice(0,5).map(q=>({...q,options:shuffle(q.options)}))), [index,setIndex]=useState(0), [answer,setAnswer]=useState<string|null>(null), [correct,setCorrect]=useState(0), [done,setDone]=useState(false), [seconds,setSeconds]=useState(0), [remaining,setRemaining]=useState(0);
  const locked = answer !== null;
  useEffect(()=>{setRemaining(seconds)},[index,seconds]);
  useEffect(()=>{if(!seconds||locked||done)return;const id=setInterval(()=>setRemaining(s=>{if(s<=1)setAnswer('⏱ Hết giờ');return Math.max(0,s-1)}),1000);return()=>clearInterval(id)},[seconds,locked,done,index]);
  const next=()=>{if(index===round.length-1){setDone(true);onComplete(correct,round.length)}else{setIndex(index+1);setAnswer(null)}};
  const restart=()=>{const unused=pool.filter(q=>!round.some(r=>r.id===q.id));setRound(shuffle(unused.length>=5?unused:pool).slice(0,5).map(q=>({...q,options:shuffle(q.options)})));setIndex(0);setAnswer(null);setCorrect(0);setDone(false);setRemaining(seconds)};
  if(!round.length)return <div className="empty">Chưa có câu hỏi.</div>;
  if(done)return <div className="quiz-panel result"><span className="result-icon">✦</span><span className="eyebrow">HOÀN THÀNH {label.toUpperCase()}</span><h2>Làm tốt lắm!</h2><div className="big-score">{correct}<small>/{round.length}</small></div><p>Bạn trả lời đúng {Math.round(correct/round.length*100)}% số câu hỏi.</p><button className="primary" onClick={restart}><Shuffle size={17}/> Luyện lượt mới</button></div>;
  const q=round[index];
  return <div className="quiz-panel"><div className="quiz-heading"><span className="badge">{label} · Câu {index+1}/{round.length}</span><label className="inline-label">Thời gian <select aria-label="Thời gian mỗi câu" value={seconds} onChange={e=>setSeconds(Number(e.target.value))}><option value={0}>Không giới hạn</option><option value={10}>10 giây / câu</option><option value={20}>20 giây / câu</option><option value={30}>30 giây / câu</option></select></label>{seconds>0&&<b className="timer">{clockText(remaining)}</b>}</div><div className="progress"><span style={{width:`${index/round.length*100}%`}}/></div><h2>{q.question}</h2>{q.audio&&<div className="listen-prompt"><Speaker text={q.audio}/><span>Nhấn loa để nghe câu hỏi</span></div>}{q.prompt&&<p className="quiz-prompt" lang="ko">{q.prompt}</p>}<div className="options">{q.options.map((o,i)=><button key={o} disabled={locked} className={`option ${locked&&o===q.answer?'correct':''} ${answer===o&&o!==q.answer?'incorrect':''}`} onClick={()=>{setAnswer(o);if(o===q.answer)setCorrect(correct+1)}}><span className="option-letter">{String.fromCharCode(65+i)}</span><span>{o}</span>{locked&&o===q.answer&&<Check size={20}/>}</button>)}</div>{locked&&<div className={`feedback ${answer===q.answer?'good':'bad'}`} role="status"><strong>{answer===q.answer?'✓ Chính xác!':answer==='⏱ Hết giờ'?'⏱ Đã hết thời gian.':'Chưa đúng. Hãy ghi nhớ đáp án.'}</strong><p>{q.explain}</p></div>}<div className="quiz-footer"><span>Đúng: <b>{correct}</b> · Lượt {round.length} câu</span><button className="primary" disabled={!locked} onClick={next}>{index===round.length-1?'Xem kết quả':'Câu tiếp theo'}<ArrowRight size={17}/></button></div></div>;
}



