import type { Progress } from './types';
export function AttemptList({progress}:{progress:Progress}) {return progress.attempts.length?<div className="attempts">{progress.attempts.slice(0,15).map((a,i)=><div key={i}><span><strong>{a.label}</strong><small>{new Date(a.date).toLocaleString('vi-VN')}</small></span><b>{a.score!==undefined?`${a.score}/200`:`${a.correct}/${a.total}`}</b></div>)}</div>:<div className="empty">Kết quả sẽ xuất hiện sau khi bạn hoàn thành một lượt quiz hoặc thi thử.</div>}

