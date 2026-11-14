import updates from './data/exam-content-updates.json';
import type { ExamSession } from './types';
/** Correct saved questions without losing question order, selected answers or the clock. */
export function upgradeExamContent(session:ExamSession|null):ExamSession|null {
  if(!session||session.contentVersion===2)return session;
  const answers={...session.answers};
  const questions=session.questions.map((q,i)=>{
    const update=updates.find(({before})=>before.kind===q.kind&&before.question===q.question&&before.prompt===q.prompt&&(before.audio||'')===(q.audio||''));
    if(!update)return q;
    const translate=(value:string)=>{const at=update.before.options.indexOf(value);return at<0?value:update.after.options[at]};
    if(answers[i]!==undefined)answers[i]=translate(answers[i]);
    return {...update.after,id:q.id,options:q.options.map(translate)};
  });
  return {...session,questions,answers,contentVersion:2};
}
