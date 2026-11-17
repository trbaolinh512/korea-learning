import { Speaker } from './components';
import {lazy,Suspense,useState} from 'react';
const GrammarTypingQuiz=lazy(()=>import('./GrammarTypingQuiz'));
import lessons from './data/grammar-roadmap.json';

export default function GrammarLesson({day}:{day:number}) {
  const lesson=lessons[day-1];
  const [practice,setPractice]=useState(false);
  return <article className="panel grammar-card">
    <div className="tabs grammar-mode"><button className={!practice?'active':''} aria-pressed={!practice} onClick={()=>setPractice(false)}>Bài học</button><button className={practice?'active':''} aria-pressed={practice} onClick={()=>setPractice(true)}>Luyện tập ngữ pháp</button></div>
    {practice?<Suspense fallback={<p>Đang mở bài luyện…</p>}><GrammarTypingQuiz key={day} day={day}/></Suspense>:<>
    <span className="badge">Ngày {day}/60 · {lesson.review?'Ôn tập':'Bài học ngữ pháp'}</span>
    <h2>{lesson.title}</h2>
    <p className="grammar-meaning">{lesson.phase}</p>
    <p className="muted">Mục tiêu giai đoạn: {lesson.goal}</p>
    {lesson.sections.map((section,index)=><section key={index} className={section.title==='Cấu trúc'?'grammar-formula':section.title.startsWith('Nhiệm vụ')?'grammar-apply':'grammar-section'}>
      <h3>{section.title}</h3>
      {section.lines.map((line,i)=><p key={i}>{line}</p>)}
    </section>)}
    <div className="grammar-caution"><strong>Lưu ý để dùng đúng</strong><p>{lesson.note}</p></div>
    {lesson.examples.length>0&&<><h3 className="section-title">Ví dụ và phân tích</h3>{lesson.examples.map((example,i)=><div className="example explained-example" key={i}>
      <span className="badge">Ví dụ {i+1}</span>
      <div lang="ko">{example.ko}<Speaker text={example.ko}/></div>
      <p className="example-translation">{example.vi}</p>
      <div className="example-analysis"><strong>Vì sao dùng cấu trúc này?</strong><p>{example.explanation}</p></div>
    </div>)}</>}
    <details className="source-note"><summary>Tài liệu ngữ pháp tham khảo</summary><p>Lộ trình 60 ngày học ngữ pháp TOPIK I do bạn cung cấp. Nội dung được biên tập lại, sửa lỗi và bổ sung phân tích ví dụ; các ngày ôn tập giữ nhiệm vụ tự học.</p><p>Ngữ pháp N: danh từ · V: động từ · A: tính từ · Âm cuối: phụ âm ở cuối âm tiết. Không dùng phiên âm Latin thay cho cách viết và phát âm tiếng Hàn.</p></details>
    </>}
  </article>;
}
