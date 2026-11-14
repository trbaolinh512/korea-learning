import { useMemo, useState } from 'react';
import { BookOpen, Keyboard, Layers, PenLine, Sparkles } from 'lucide-react';
import data from './data/hangeul.json';
import { Flashcards } from './components';
import AlphabetQuiz from './AlphabetQuiz';
import AlphabetWriting from './AlphabetWriting';
import KoreanTyping from './KoreanTyping';
import type { Card } from './types';
export default function Hangul({learned,onLearn,onComplete}: {learned:string[];onLearn:(id:string)=>void;onComplete:(correct:number,total:number,label:string)=>void}) {
  const [category,setCategory]=useState<keyof typeof data>('vowels'),[tab,setTab]=useState('cards');
  const cards:Card[]=useMemo(()=>data[category].map((c,i)=>({...c,id:`hangul-${category}-${i}`})),[category]);
  return <><div className="page-heading"><div><span className="eyebrow">BẮT ĐẦU TỪ NỀN TẢNG</span><h1>Bảng chữ cái tiếng Hàn <span className="heading-korean">한글</span></h1><p>Nhớ mặt chữ, nghe cách đọc, luyện viết và luyện gõ tiếng Hàn.</p></div></div><div className="tabs alphabet-tabs">{([['cards','Học bảng chữ cái',Layers],['quiz','Trắc nghiệm',Sparkles],['write','Luyện viết',PenLine],['typing','Luyện gõ tiếng Hàn',Keyboard]] as const).map(([key,label,Icon])=><button key={key} className={tab===key?'active':''} onClick={()=>setTab(key)}><Icon size={17}/>{label}</button>)}</div>
  {tab==='cards'&&<><div className="subtabs">{([['vowels','Nguyên âm',21],['consonants','Phụ âm',19],['batchim','Âm đuôi (Batchim)',7]] as const).map(([key,label,count])=><button key={key} className={category===key?'active':''} onClick={()=>setCategory(key)}>{label} <small>{count}</small></button>)}</div><div className="info-box"><BookOpen size={21}/><div><strong>{category==='vowels'?'21 chữ nguyên âm · 10 cơ bản & 11 mở rộng':category==='consonants'?'19 phụ âm · Cơ bản, bật hơi & căng':'7 nhóm âm đuôi thường gặp'}</strong><p>{category==='vowels'?'Cơ bản/mở rộng là cách nhóm chữ để học, không phải phân loại nguyên âm đơn/đôi theo âm học. Gợi âm tiếng Việt chỉ gần đúng.':category==='batchim'?'Bảy nhóm âm cuối cơ bản khi đọc riêng. Khi nối âm tiết có thể có nối âm, đồng hóa hoặc bật hơi; nhấn thẻ nghe từ ví dụ.':'Âm mẫu ghép phụ âm với ㅡ (ư) để luyện theo thiết lập của bạn; đây không phải tên chữ hoặc cách đọc batchim.'}</p></div></div><Flashcards key={category} cards={cards} learned={learned} onLearn={onLearn}/></>}
  {tab==='quiz'&&<AlphabetQuiz onComplete={onComplete}/>}{tab==='write'&&<AlphabetWriting onComplete={onComplete}/>} {tab==='typing'&&<KoreanTyping/>}</>;
}



