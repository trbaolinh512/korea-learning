import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, Headphones, Layers, PanelLeftClose, PanelLeftOpen, PenLine, Puzzle } from 'lucide-react';
import curriculum from './data/study-curriculum.json';
import grammar from './data/grammar-roadmap.json';
import GrammarLesson from './GrammarLesson';
import romanization from './data/word-romanization.json';
import { Flashcards } from './components';
import AlphabetWriting from './AlphabetWriting';
import WordQuiz from './WordQuiz';
import { useStored } from './lib';
import type { Progress } from './types';

type Props={progress:Progress;setProgress:(update:(p:Progress)=>Progress)=>void;onLearn:(id:string)=>void;onComplete:(c:number,t:number,label:string)=>void};
export default function Study({progress,setProgress,onLearn,onComplete}:Props) {
  const day=curriculum.days[progress.day-1],theme=curriculum.themes[day.theme],lesson=grammar[progress.day-1];
  const [tab,setTab]=useState('words'),[hidden,setHidden]=useStored('topik-roadmap-hidden',false);
  const romanized:Record<string,string>=romanization.entries;
  const cards=day.words.map(w=>({...w,category:theme.title,romaja:romanized[w.char],romanizationSource:'RR' as const}));
  const changeDay=(value:number)=>{setProgress(p=>({...p,day:Math.max(1,Math.min(60,value))}));setTab('words')};
  return <><div className="page-heading"><div><span className="eyebrow">MỖI NGÀY MỘT BƯỚC TIẾN</span><h1>Luyện thi TOPIK I <span className="heading-korean">토픽</span></h1><p>60 ngày · 4 giai đoạn ngữ pháp · 30 chủ đề từ vựng.</p></div><span className="badge green">{progress.completed.length}/60 ngày hoàn thành</span></div><div className="roadmap-toolbar"><button aria-expanded={!hidden} aria-controls="study-roadmap" onClick={()=>setHidden(!hidden)}>{hidden?<PanelLeftOpen size={17}/>:<PanelLeftClose size={17}/>} {hidden?'Hiện lộ trình':'Ẩn lộ trình'}</button><span className="muted small">Ngày {progress.day} · {lesson.review?'Ôn tập ngữ pháp':'Học cấu trúc ngữ pháp mới'}</span></div><div className={`study-layout ${hidden?'roadmap-hidden':''}`}>{!hidden&&<aside id="study-roadmap" className="panel day-sidebar"><div className="section-label"><BookOpen size={18}/><h3>Lộ trình của bạn</h3></div><div className="progress"><span style={{width:`${progress.completed.length/60*100}%`}}/></div><p className="muted small">Ngữ pháp theo từng ngày · 10 từ mỗi ngày</p><div className="day-grid">{curriculum.days.map(d=><button key={d.day} title={`Ngày ${d.day}: ${grammar[d.day-1].title}`} aria-label={`Ngày ${d.day}`} aria-current={progress.day===d.day?'step':undefined} className={`${progress.day===d.day?'active':''} ${progress.completed.includes(d.day)?'done':''}`} onClick={()=>changeDay(d.day)}>{progress.completed.includes(d.day)?<Check size={12}/>:d.day}</button>)}</div><div className="day-legend"><i/> Đã hoàn thành <i className="current"/> Đang học</div><div className="sidebar-note"><span>✦</span><p>56 ngày học · 4 ngày ôn tập.<br/>Từ vựng theo 30 chủ đề riêng.</p></div></aside>}<div className="study-content"><div className="day-heading"><div><span className="eyebrow">NGÀY {progress.day} · {lesson.phase.split(':')[0]}</span><h2>{day.title}</h2><p className="muted">{cards.length} từ vựng · {lesson.title}</p></div><button className={progress.completed.includes(progress.day)?'success':'primary'} onClick={()=>setProgress(p=>({...p,completed:p.completed.includes(p.day)?p.completed.filter(d=>d!==p.day):[...p.completed,p.day]}))}><Check size={16}/>{progress.completed.includes(progress.day)?'Đã hoàn thành':'Hoàn thành ngày'}</button></div><div className="tabs study-tabs">{([['words','Từ vựng',Layers],['grammar','Ngữ pháp',Puzzle],['write','Luyện viết',PenLine],['listen','Nghe',Headphones],['read','Đọc',BookOpen]] as const).map(([key,label,Icon])=><button key={key} className={tab===key?'active':''} onClick={()=>setTab(key)}><Icon size={16}/>{label}</button>)}</div>
  {tab==='words'&&<><div className="info-box"><Layers size={20}/><p>10 từ theo chủ đề mỗi ngày. Nhấn thẻ để nghe, xem nghĩa và đánh dấu từ đã thuộc.</p></div><Flashcards key={progress.day} cards={cards} learned={progress.learned} onLearn={onLearn}/><details className="source-note"><summary>Tài liệu từ vựng tham khảo</summary><ul>{[...new Set(day.words.map(w=>w.source))].map(source=><li key={source}>{source}</li>)}</ul><p>Nghĩa tiếng Việt được biên tập gọn và chọn theo ngữ cảnh của chủ đề. Phiên âm Latin theo RR được tạo theo quy tắc và hiệu chỉnh một số trường hợp; chưa đối chiếu từng từ với Papago. Nhấn loa để nghe hoặc Tra Papago để đối chiếu.</p></details></>}
  {tab==='grammar'&&<GrammarLesson day={progress.day}/>}
  {tab==='write'&&<AlphabetWriting key={`write-${progress.day}`} vocabulary={cards} scope="topik" label={`Ngày ${progress.day}`} onComplete={onComplete}/>}
  {(tab==='listen'||tab==='read')&&<WordQuiz key={`${tab}-${progress.day}`} cards={cards} day={progress.day} mode={tab} onComplete={onComplete}/>}
  <div className="day-navigation"><button disabled={progress.day===1} onClick={()=>changeDay(progress.day-1)}><ArrowLeft size={16}/> Ngày trước</button><span>Ngày {progress.day} / 60</span><button disabled={progress.day===60} onClick={()=>changeDay(progress.day+1)}>Ngày tiếp<ArrowRight size={16}/></button></div></div></div></>;
}


