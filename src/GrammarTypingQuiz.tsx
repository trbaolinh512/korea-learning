import {useEffect,useMemo,useRef,useState} from 'react';
import {ArrowRight,Check,Eye,RotateCcw} from 'lucide-react';
import {grammarQuestions,grammarPlan,GrammarPracticeSession,isChoice,kindLabels,normalizePracticeMode} from './grammarPractice';
import type {PracticeMode} from './grammarPractice';
import {normalizeKoreanAnswer} from './ink';
import {Speaker} from './components';
import {useStored} from './lib';
import PracticeSettings,{SettingsButton} from './PracticeSettings';

export default function GrammarTypingQuiz({day}:{day:number}){
  const pool=useMemo(()=>grammarQuestions(day),[day]);
  const [savedMode,setMode]=useStored<unknown>('grammar-practice-mode','mixed');
  const mode=normalizePracticeMode(savedMode);
  const start=(value:PracticeMode)=>{const engine=new GrammarPracticeSession(pool,day,value);return {engine,question:engine.next()}};
  const [round,setRound]=useState(()=>start(mode)),[answer,setAnswer]=useState(''),[selected,setSelected]=useState<number[]>([]),[feedback,setFeedback]=useState<'correct'|'wrong'|'revealed'|null>(null),[settings,setSettings]=useState(false),[stats,setStats]=useState({correct:0,total:0});
  const [options,setOptions]=useStored('grammar-typing-settings',{seconds:1,showNext:false});
  const input=useRef<HTMLInputElement>(null),composing=useRef(false),locked=useRef(false);
  const target=round.question;
  const next=()=>{const question=round.engine.next();setRound({engine:round.engine,question});setAnswer('');setSelected([]);setFeedback(null);locked.current=false;composing.current=false};
  const changeMode=(value:PracticeMode)=>{setMode(value);setRound(start(value));setAnswer('');setSelected([]);setFeedback(null);setStats({correct:0,total:0});locked.current=false;composing.current=false};
  useEffect(()=>{if(!feedback||!options.seconds||settings)return;const timer=setTimeout(next,options.seconds*1000);return()=>clearTimeout(timer)},[feedback,target.number,options.seconds,settings]);
  const finish=(result:'correct'|'wrong'|'revealed')=>{
    if(locked.current)return;locked.current=true;round.engine.submit(target,result==='correct');setFeedback(result);setStats(s=>({correct:s.correct+Number(result==='correct'),total:s.total+1}));
  };
  const pick=(value:string)=>{if(locked.current)return;setAnswer(value);finish(value===target.answer?'correct':'wrong')};
  const check=()=>{
    if(composing.current||locked.current)return;
    const value=target.kind==='order'?selected.map(i=>target.tokens[i]).join(' '):answer;
    if(!value.trim())return;
    finish(normalizeKoreanAnswer(value)===normalizeKoreanAnswer(target.answer)?'correct':'wrong');
  };
  const percentage=grammarPlan(day).filter(isChoice).length*10;
  return <section className="grammar-typing-quiz" aria-label="Luyện tập ngữ pháp" data-question-id={target.id} data-question-kind={target.kind}>
    <div className="quiz-heading"><h3>Luyện tập ngữ pháp đa dạng</h3><SettingsButton onClick={()=>setSettings(true)}/></div>
    <div className="grammar-practice-controls"><label>Chế độ luyện ngữ pháp<select aria-label="Chế độ luyện ngữ pháp" value={mode} onChange={e=>changeMode(e.target.value as PracticeMode)}><option value="mixed">Tổng hợp</option><option value="choice">Trắc nghiệm</option><option value="order">Ghép câu</option><option value="conjugate">Gõ dạng chia</option><option value="typing">Gõ cả câu</option></select></label><span className="small muted">{pool.length} câu khác nhau · Đổi chế độ bắt đầu lượt mới.</span></div>
    <p className="muted small">{mode==='mixed'?`Lượt mới: ${percentage}% trắc nghiệm, ${100-percentage}% ghép/chia từ. `:''}Câu sai được ôn lại sau 4 câu xen kẽ. Cần gõ tiếng Hàn chỉ ở các bài nhập chữ.</p>
    <div className="quiz-heading"><span className="badge">Câu {target.number} · Vô hạn</span><span className="small muted">Đúng {stats.correct}/{stats.total} · Chờ ôn {round.engine.pendingReviews}</span></div>
    <p className="grammar-question-kind">{kindLabels[target.kind]}{target.review&&<span className="badge">Ôn lại câu sai</span>}</p>
    <p className="small muted">{target.title} · Ngày {target.lessonDay}</p>
    {target.kind==='meaning'?<><h4>Chọn nghĩa tiếng Việt đúng với câu sau.</h4><p className="grammar-practice-prompt" lang="ko">{target.prompt}</p></>:target.kind==='contrast'?<><h4>Chọn cách dùng đúng trong câu cụ thể.</h4><p className="grammar-practice-prompt">{target.prompt}</p><p className="small muted">Nghĩa câu: {target.vi}</p></>:target.kind==='typing'||target.kind==='order'?<><h4>{target.kind==='order'?'Bấm các thẻ theo thứ tự câu mẫu.':'Viết lại câu theo nghĩa và cấu trúc gợi ý.'}</h4><p className="grammar-quiz-meaning">{target.vi}</p></>:<><h4>{target.kind==='form'?'Chọn hình thái phù hợp với nghĩa đã cho.':target.kind==='conjugate'?'Gõ phần còn thiếu, dùng đúng dạng chia.':'Hoàn thiện câu theo ngữ cảnh tiếng Việt.'}</h4><p className="grammar-quiz-meaning">{target.vi}</p><p className="grammar-practice-prompt" lang="ko">{target.kind==='context'?target.prompt:target.blank}</p>{target.base&&<p className="small muted">Từ gợi ý: <span lang="ko">{target.base}</span></p>}</>}
    {isChoice(target.kind)?<div className="options grammar-choice-options">{target.choices.map((choice,i)=><button key={choice} className={`option ${feedback&&choice===target.answer?'correct':''} ${feedback&&answer===choice&&choice!==target.answer?'incorrect':''}`} disabled={!!feedback} onClick={()=>pick(choice)}><span className="option-letter">{String.fromCharCode(65+i)}</span><span lang={target.kind==='form'||target.kind==='context'?'ko':'vi'}>{choice}</span></button>)}</div>:<form onSubmit={e=>{e.preventDefault();check()}}>
      {target.kind==='order'?<><div className="grammar-selected-tokens" aria-label="Câu đã ghép">{selected.length?selected.map((index,i)=><button type="button" lang="ko" key={index} disabled={!!feedback} aria-label={`Bỏ mảnh ${i+1}: ${target.tokens[index]}`} onClick={()=>setSelected(items=>items.filter((_,n)=>n!==i))}>{target.tokens[index]}</button>):<span className="muted small">Bấm thẻ bên dưới để ghép câu; bấm thẻ đã ghép để bỏ.</span>}</div><div className="grammar-token-bank" aria-label="Các mảnh ghép">{target.tokens.map((token,i)=><button key={i} type="button" lang="ko" disabled={!!feedback||selected.includes(i)} onClick={()=>setSelected(items=>[...items,i])}>{token}</button>)}</div></>:<><label className="eyebrow" htmlFor={`grammar-answer-${day}`}>{target.kind==='typing'?'Câu trả lời tiếng Hàn':'Phần còn thiếu'}</label><input id={`grammar-answer-${day}`} ref={input} lang="ko" autoComplete="off" autoCapitalize="none" spellCheck={false} value={answer} readOnly={!!feedback} onChange={e=>setAnswer(e.target.value)} onCompositionStart={()=>{composing.current=true}} onCompositionEnd={()=>{composing.current=false}} onKeyDown={e=>{if(e.key==='Enter'&&(e.nativeEvent.isComposing||composing.current||e.keyCode===229))e.preventDefault()}} placeholder={target.kind==='typing'?'Nhập câu tiếng Hàn…':'Nhập dạng còn thiếu…'}/></>}
      <div className="actions"><button className="primary" type="submit" disabled={!!feedback||(target.kind==='order'?selected.length!==target.tokens.length:!answer.trim())}><Check size={16}/>Kiểm tra câu</button>{target.kind==='order'&&<button type="button" disabled={!!feedback||!selected.length} onClick={()=>setSelected([])}><RotateCcw size={16}/>Xóa phần ghép</button>}</div>
    </form>}
    <div className="grammar-answer-feedback">{feedback&&<div className={`feedback ${feedback==='correct'?'good':'bad'}`} role="status"><strong>{feedback==='correct'?'Chính xác!':feedback==='wrong'?'Chưa khớp đáp án mẫu.':'Đáp án tham khảo'}</strong><p>Đáp án: {target.answer}</p><p lang="ko">{target.ko}<Speaker text={target.ko}/></p><p>{target.explanation}</p>{feedback!=='correct'&&<p>Câu này sẽ trở lại sau 4 câu khác.</p>}{options.seconds>0&&<p>Tự chuyển sau {options.seconds} giây.</p>}</div>}</div>
    <div className="quiz-footer"><button disabled={!!feedback} onClick={()=>finish('revealed')}><Eye size={16}/>Xem câu mẫu</button>{(options.showNext||options.seconds===0)&&<button className="primary" onClick={next}>Câu tiếp<ArrowRight size={16}/></button>}</div>
    <p className="small muted">Bài tự luyện theo mẫu, không phải câu hỏi chính thức của kỳ thi. Bài ghép/gõ chấm theo câu mẫu, bỏ qua dấu câu và khoảng trắng thừa; các cách diễn đạt khác cần được đối chiếu riêng.</p>
    {settings&&<PracticeSettings kind="grammar" options={options} onChange={setOptions} onClose={()=>setSettings(false)}/>}
  </section>;
}
