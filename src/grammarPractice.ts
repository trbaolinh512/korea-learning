import bank from './data/grammar-drills.json';

export type PracticeMode='mixed'|'choice'|'order'|'conjugate'|'typing';
export type QuestionKind='meaning'|'form'|'context'|'contrast'|'order'|'conjugate'|'typing';
export function normalizePracticeMode(value:unknown):PracticeMode {
  return typeof value==='string'&&['mixed','choice','order','conjugate','typing'].includes(value)?value as PracticeMode:'mixed';
}
export type GrammarSentence=typeof bank[number];
export interface GrammarQuestion extends GrammarSentence {
  number:number;kind:QuestionKind;prompt:string;answer:string;choices:string[];tokens:string[];review:boolean;
}
export const kindLabels:Record<QuestionKind,string>={meaning:'Nhận diện nghĩa',form:'Chia đúng hình thái',context:'Điền theo ngữ cảnh',contrast:'Phân biệt cách dùng',order:'Ghép thẻ thành câu',conjugate:'Gõ dạng chia đúng',typing:'Gõ cả câu tiếng Hàn'};

export function grammarQuestions(day:number):GrammarSentence[]{
  const start=day===30?16:day===45?31:1;
  const review=[15,30,45,60].includes(day);
  return bank.filter(q=>review?q.lessonDay>=start&&q.lessonDay<day:q.lessonDay===day);
}
export function grammarPlan(day:number):QuestionKind[]{
  if(day<=15)return ['meaning','form','context','order','contrast','form','meaning','order','context','contrast'];
  if(day<=35)return ['meaning','form','order','conjugate','context','order','contrast','form','order','context'];
  if(day<=50)return ['meaning','form','context','order','contrast','conjugate','meaning','form','conjugate','context'];
  return ['meaning','form','context','contrast','meaning','form','context','contrast','meaning','form'];
}
function shuffled<T>(values:T[],random:()=>number){
  const copy=[...values];for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy;
}
export function isChoice(kind:QuestionKind){return ['meaning','form','context','contrast'].includes(kind)}
const meanings:Record<number,string>={1:'Xác định người/vật là gì',2:'Nêu chủ đề đang nói tới',3:'Đánh dấu chủ ngữ',4:'Đánh dấu tân ngữ',5:'Nói ở thể trang trọng lịch sự',6:'Nói ở thể lịch sự thông dụng',7:'Phủ định danh tính: không phải là',8:'Nêu sự có hoặc không có',9:'Nêu vị trí tồn tại',10:'Nêu đích đến khi di chuyển',11:'Nêu thời điểm hành động',12:'Nêu nơi hành động diễn ra',13:'Nối danh từ với nghĩa và/với',14:'Phủ định hành động hoặc trạng thái',16:'Diễn tả quá khứ',17:'Diễn tả dự định hoặc tương lai',18:'Diễn tả mong muốn',19:'Nêu phương tiện di chuyển',20:'Yêu cầu lịch sự',21:'Yêu cầu đừng thực hiện hành động',22:'Nói không thực hiện được',23:'Hỏi ý kiến, đề nghị cùng làm',24:'Rủ cùng thực hiện hành động',25:'Nói hành động đang diễn ra',26:'Nhờ làm giúp',27:'Chỉ người nhận hành động',28:'Chỉ người là nguồn nhận được',29:'Nêu điểm đầu hoặc cuối phạm vi',31:'Nối hành động theo trình tự',32:'Nối hai nội dung tương phản',33:'Nêu nguyên nhân hoặc sự nối tiếp',34:'Nêu lý do cho lời khuyên/đề nghị',35:'Nêu mục đích đi đến đâu đó',36:'Nêu ý định thực hiện',37:'Nói điều bắt buộc/cần thực hiện',38:'Nêu khả năng hoặc điều kiện thực hiện',39:'Mời thử trải nghiệm hành động',40:'Nêu việc xảy ra trước hành động',41:'Nêu việc xảy ra sau hành động',42:'Nêu hai hành động đồng thời',43:'Nêu lúc/thời điểm diễn ra',44:'Nêu điều kiện nếu… thì…',46:'Hỏi xin phép thực hiện',47:'Nêu điều không được phép thực hiện',48:'Bày tỏ sự nhận ra/cảm thán',49:'Phỏng đoán từ tình huống',50:'Nêu đối tượng làm chuẩn so sánh',51:'Giới hạn hoặc bổ sung đối tượng',52:'Danh từ hóa hành động',53:'Tính từ bổ nghĩa danh từ',54:'Động từ bổ nghĩa danh từ',55:'Định ngữ chỉ việc chưa diễn ra',56:'Lược ㅡ/ㄹ khi chia từ',57:'Biến đổi ㅂ khi chia từ',58:'Phân biệt nhóm ㄷ bất quy tắc và từ chia thường',59:'Biến đổi 르 và phân biệt ngoại lệ'};

export class GrammarPracticeSession {
  private deck:GrammarSentence[]=[];
  private number=0;
  private recent:string[]=[];
  private submitted=new Set<number>();
  private retries:{sentence:GrammarSentence;kind:QuestionKind;due:number;choices:string[];tokens:string[]}[]=[];
  constructor(private pool:GrammarSentence[],private day:number,private mode:PracticeMode='mixed',private random:()=>number=Math.random){
    if(!pool.length)throw new Error('Không có câu luyện tập cho ngày này.');
  }
  get pendingReviews(){return this.retries.length}
  private fresh(){
    if(!this.deck.length){this.deck=shuffled(this.pool,this.random);const safe=this.deck.findIndex(q=>!this.recent.includes(q.id));if(safe>0)[this.deck[0],this.deck[safe]]=[this.deck[safe],this.deck[0]]}
    // Queue entries are kept out of normal practice until their scheduled review.
    const available=this.deck.findIndex(q=>!this.retries.some(r=>r.sentence.id===q.id));
    if(available>=0)return this.deck.splice(available,1)[0];
    const fallback=shuffled(this.pool.filter(q=>!this.retries.some(r=>r.sentence.id===q.id)),this.random)[0];
    return fallback||this.deck.shift()!;
  }
  next():GrammarQuestion {
    this.number++;
    const due=this.retries.findIndex(r=>r.due<=this.number);
    const retry=due>=0?this.retries.splice(due,1)[0]:undefined;
    const row=retry?.sentence||this.fresh();
    let kind:QuestionKind;
    if(retry)kind=retry.kind;
    else if(this.mode==='mixed')kind=grammarPlan(this.day)[(this.number-1)%10];
    else if(this.mode==='choice')kind=(['meaning','form','context','contrast'] as QuestionKind[])[(this.number-1)%4];
    else kind=this.mode;
    let answer=row.focus,choices:string[]=[],prompt=row.blank;
    if(kind==='meaning'){
      answer=row.vi;prompt=row.ko;
      const wrong=[...new Set(shuffled(this.pool.filter(q=>q.vi!==row.vi),this.random).map(q=>q.vi))].slice(0,3);
      choices=shuffled([answer,...wrong],this.random);
    }else if(kind==='contrast'){
      answer=row.lessonDay===51?(row.focus==='만'?'Giới hạn đối tượng: chỉ':'Bổ sung đối tượng: cũng'):meanings[row.lessonDay];prompt=`Trong câu “${row.ko}”, phần “${row.focus}” được dùng để làm gì?`;
      // Avoid near-synonyms and overlapping functions (e.g. two causal endings).
      const distinctions:[string,number[]][]=[['Diễn tả hành động đã qua',[16,54,58]],['Nêu việc dự định trong tương lai',[17,36,55]],['Diễn tả mong muốn của người nói',[18]],['Nêu điều cấm thực hiện',[21,47]],['Xin phép thực hiện một hành động',[46]],['Diễn tả khả năng làm được',[22,38]],['Nêu nghĩa vụ phải thực hiện',[37]],['So sánh mức độ giữa hai đối tượng',[50]],['Nêu nguyên nhân dẫn tới kết quả',[33,34]],['Nêu vị trí hoặc địa điểm',[9,10,12,19,35]],['Rủ hoặc nhờ người nghe thực hiện',[20,23,24,26,39]]];
      const wrong=shuffled(distinctions.filter(([,excluded])=>!excluded.includes(row.lessonDay)).map(([text])=>text).filter(text=>text!==answer),this.random).slice(0,3);
      choices=shuffled([answer,...wrong],this.random);
    }else if(kind==='form'||kind==='context'){
      choices=shuffled([answer,...row.distractors],this.random);
      if(kind==='context'){
        const questions:Record<number,string>={17:'무슨 계획이 있어요?',18:'뭘 하고 싶어요?',20:'어떻게 하면 돼요?',22:'할 수 있어요?',24:'같이 뭘 할까요?',26:'도와드릴까요?',27:'누구에게 줘요?',28:'누구에게서 받았어요?',36:'무슨 계획이 있어요?',37:'뭘 해야 해요?',38:'할 수 있어요?',39:'어떻게 할까요?',47:'해도 돼요?',49:'어떨 것 같아요?'};
        if(questions[row.lessonDay])prompt=`가: ${questions[row.lessonDay]}\n나: ${row.blank}`;
        if(row.lessonDay===46)prompt=`가: ${row.blank}\n나: 네, 괜찮아요.`;
        if(row.lessonDay===29&&row.ko.includes('걸려요'))prompt=`가: 얼마나 걸려요?\n나: ${row.blank}`;
        if(row.lessonDay===41)prompt=`가: ${row.ko.includes('일기를')?'언제 일기를 써요?':'언제 쉬어요?'}\n나: ${row.blank}`;
      }
    }
    else if(kind==='order'||kind==='typing'){answer=row.ko;prompt=row.vi}
    if(retry&&choices.length&&choices.join('|')===retry.choices.join('|'))choices=[...choices.slice(1),choices[0]];
    const words=row.ko.replace(/[.!?]$/,'').split(' '),tokens=shuffled(words,this.random);
    if(tokens.join(' ')===words.join(' ')&&tokens.length>1)tokens.push(tokens.shift()!);
    if(retry&&tokens.length>1&&tokens.join(' ')===retry.tokens.join(' '))tokens.push(tokens.shift()!);
    this.recent=[...this.recent,row.id].slice(-8);
    return {...row,number:this.number,kind,prompt,answer,choices,tokens,review:!!retry};
  }
  submit(question:GrammarQuestion,correct:boolean){
    if(this.submitted.has(question.number))return;
    this.submitted.add(question.number);
    this.retries=this.retries.filter(r=>r.sentence.id!==question.id);
    if(!correct)this.retries.push({sentence:question,kind:question.kind,due:question.number+5,choices:[...question.choices],tokens:[...question.tokens]});
  }
}
