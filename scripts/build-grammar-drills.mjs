import fs from 'node:fs';
import assert from 'node:assert/strict';
const lessons=JSON.parse(fs.readFileSync('src/data/grammar-roadmap.json','utf8'));
const rows=[];
const final=s=>(s.at(-1).codePointAt(0)-0xac00)%28;
const particle=(s,a,b)=>final(s)?a:b;
const topic=s=>s+particle(s,'은','는'),subject=s=>s+particle(s,'이','가'),object=s=>s+particle(s,'을','를');
const cap=s=>s[0].toUpperCase()+s.slice(1);
function add(day,ko,vi,focus,base='',wrong=[],explanation=''){
  assert.ok(ko.includes(focus),`${day}: missing ${focus}`);
  const stem=base.endsWith('다')?base.slice(0,-1):base;
  const traps=[...new Set([...wrong,`${stem}다요`,`${stem}는요`,`${stem}하요`,`${stem}어요요`])].filter(s=>s&&s!==focus).slice(0,3);
  const offset=ko.lastIndexOf(focus);
  rows.push({id:`g${day}-${rows.filter(r=>r.lessonDay===day).length+1}`,lessonDay:day,title:lessons[day-1].title,ko,vi,focus,base,blank:ko.slice(0,offset)+'(      )'+ko.slice(offset+focus.length),distractors:traps,explanation:explanation||`${base?`${base} → ${focus}. `:''}Dùng ${focus} trong mẫu ${lessons[day-1].title}. Đối chiếu nghĩa: “${vi}” và công thức của bài học.`});
}
const people=[['학생','học sinh'],['선생님','giáo viên'],['의사','bác sĩ'],['간호사','y tá'],['회사원','nhân viên công ty'],['요리사','đầu bếp'],['가수','ca sĩ'],['배우','diễn viên'],['경찰','cảnh sát'],['대학생','sinh viên'],['한국 사람','người Hàn Quốc'],['베트남 사람','người Việt Nam']];
for(const [n,vi] of people)for(const [s,v] of [['저는','Tôi'],['제 친구는','Bạn tôi']]){
  const ending=particle(n,'이에요','예요'),f=n+ending;
  add(1,`${s} ${f}.`,`${v} là ${vi}.`,f,n,[n+particle(n,'예요','이에요'),n+'이예요',n+'에요'],`Âm tiết cuối của ${n} ${final(n)?'có':'không có'} âm cuối nên dùng ${ending}. ${s} nêu chủ đề.`);
  const neg=subject(n)+' 아니에요';add(7,`${s} ${neg}.`,`${v} không phải là ${vi}.`,neg,n,[n+'을 아니에요',n+'는 아니예요',n+'가 아니예요']);
}
const topics=[['학생','공부해요','học sinh','học bài'],['선생님','가르쳐요','giáo viên','giảng dạy'],['친구','운동해요','bạn','tập thể dục'],['동생','학교에 가요','em tôi','đi học'],['아버지','일해요','bố','làm việc'],['어머니','요리해요','mẹ','nấu ăn'],['책','재미있어요','quyển sách','thú vị'],['가방','커요','cái cặp','to'],['방','깨끗해요','căn phòng','sạch'],['날씨','좋아요','thời tiết','đẹp'],['사과','맛있어요','táo','ngon'],['커피','뜨거워요','cà phê','nóng']];
for(const [n,p,vi,pv] of topics){
  for(const [prefix,pvPrefix] of [['',''],['오늘은 ','Hôm nay, ']]){
    add(2,`${prefix}${topic(n)} ${p}.`,cap(`${pvPrefix}${vi} thì ${pv}.`),particle(n,'은','는'),n,['이','가',particle(n,'는','은')],`${n} ${final(n)?'có':'không có'} âm cuối → ${particle(n,'은','는')}. 은/는 nêu chủ đề đang nói tới, không đồng nhất với chủ ngữ.`);
    add(3,`${prefix}${subject(n)} ${p}.`,cap(`${pvPrefix}${vi} ${pv}.`),particle(n,'이','가'),n,['을','를',particle(n,'가','이')],`${n} là chủ ngữ; chọn ${particle(n,'이','가')} theo âm cuối của danh từ.`);
  }
}
// Explicit forms avoid pretending one mechanical rule handles all Korean conjugations.
const verbs=[
 ['먹다','밥을','ăn cơm','먹어요','먹었어요','먹습니다','먹을','먹은','먹으세요','먹읍시다','먹으면','먹으면서','먹으러','식당'],
 ['마시다','물을','uống nước','마셔요','마셨어요','마십니다','마실','마신','마시세요','마십시다','마시면','마시면서','마시러','카페'],
 ['읽다','책을','đọc sách','읽어요','읽었어요','읽습니다','읽을','읽은','읽으세요','읽읍시다','읽으면','읽으면서','읽으러','도서관'],
 ['보다','영화를','xem phim','봐요','봤어요','봅니다','볼','본','보세요','봅시다','보면','보면서','보러','극장'],
 ['공부하다','한국어를','học tiếng Hàn','공부해요','공부했어요','공부합니다','공부할','공부한','공부하세요','공부합시다','공부하면','공부하면서','공부하러','교실'],
 ['사다','사과를','mua táo','사요','샀어요','삽니다','살','산','사세요','삽시다','사면','사면서','사러','시장'],
 ['만나다','친구를','gặp bạn','만나요','만났어요','만납니다','만날','만난','만나세요','만납시다','만나면','만나면서','만나러','공원'],
 ['만들다','음식을','làm món ăn','만들어요','만들었어요','만듭니다','만들','만든','만드세요','만듭시다','만들면','만들면서','만들러','부엌'],
 ['듣다','음악을','nghe nhạc','들어요','들었어요','듣습니다','들을','들은','들으세요','들읍시다','들으면','들으면서','들으러','음악실'],
 ['쓰다','편지를','viết thư','써요','썼어요','씁니다','쓸','쓴','쓰세요','씁시다','쓰면','쓰면서','쓰러','방'],
 ['운동하다','','tập thể dục','운동해요','운동했어요','운동합니다','운동할','운동한','운동하세요','운동합시다','운동하면','운동하면서','운동하러','운동장'],
 ['요리하다','','nấu ăn','요리해요','요리했어요','요리합니다','요리할','요리한','요리하세요','요리합시다','요리하면','요리하면서','요리하러','부엌']
];
for(const [base,obj,vi,present,past,formal,future,done,request,proposal,condition,whileForm,purpose,place] of verbs){
  const stem=base.slice(0,-1),eo=present.slice(0,-1),phrase=form=>[obj,form].filter(Boolean).join(' ');
  const modifier=(final(stem)===8?stem.slice(0,-1)+String.fromCharCode(stem.at(-1).charCodeAt(0)-8):stem)+'는';
  if(obj){const n=obj.slice(0,-1);for(const [s,sv] of [['저는','Tôi'],['동생은','Em tôi']])add(4,`${s} ${phrase(present)}.`,`${sv} ${vi}.`,obj,n,[n+particle(n,'를','을'),n+'에',n+'에서'],`${n} là tân ngữ, chọn ${particle(n,'을','를')} theo âm cuối.`)}
  for(const [s,sv] of [['저는','Tôi'],['동생은','Em tôi']]){
    add(5,`${s} ${phrase(formal)}.`,`${sv} ${vi} (trang trọng).`,formal,base,[stem+'ㅂ니다',stem+'습니까요',base+'습니다']);
    add(6,`${s} 매일 ${phrase(present)}.`,`${sv} ${vi} mỗi ngày.`,present,base);
    add(14,`${s} ${phrase(stem+'지 않아요')}.`,`${sv} không ${vi}.`,stem+'지 않아요',base,[base+'지 않아요',stem+'지 안아요',stem+'안지 않아요']);
    add(16,`${s} 어제 ${phrase(past)}.`,`Hôm qua ${sv.toLowerCase()} đã ${vi}.`,past,base,[base+'었어요',stem+'는었어요',stem+'고었어요']);
    add(25,`${s} 지금 ${phrase(stem+'고 있어요')}.`,`${sv} đang ${vi}.`,stem+'고 있어요',base,[base+'고 있어요',stem+'는 있어요',stem+'고 있어다']);
    add(38,`${s} ${phrase(future+' 수 있어요')}.`,`${sv} có thể ${vi}.`,future+' 수 있어요',base,[base+' 수 있어요',stem+'는 수 있어요',stem+'고 수 있어요']);
    add(52,`${s} ${phrase(modifier+' 것을 좋아해요')}.`,`${sv} thích việc ${vi}.`,modifier+' 것을',base,[modifier+'것을',base+' 것을',stem+'고 것을']);
  }
  for(const [time,tv] of [['내일','ngày mai'],['주말에','vào cuối tuần']]){
    add(17,`저는 ${time} ${phrase(future+' 거예요')}.`,`Tôi sẽ ${vi} ${tv}.`,future+' 거예요',base,[base+' 거예요',stem+'는을 거예요',stem+'고 거예요']);
    add(18,`저는 ${time} ${phrase(stem+'고 싶어요')}.`,`Tôi muốn ${vi} ${tv}.`,stem+'고 싶어요',base,[base+'고 싶어요',stem+'는 싶어요',stem+'고 싶다요']);
    const intent=(!final(stem)||final(stem)===8?stem:future.slice(0,-1)+'으')+'려고 해요';
    add(36,`저는 ${time} ${phrase(intent)}.`,`Tôi định ${vi} ${tv}.`,intent,base);
    add(37,`저는 ${time} ${phrase(eo+'야 해요')}.`,`Tôi phải ${vi} ${tv}.`,eo+'야 해요',base,[base+'야 해요',stem+'고야 해요',stem+'는야 해요']);
  }
  for(const [prefix,pv] of [['',''],['오늘은 ','hôm nay ']]){
    add(20,`${prefix}${phrase(request)}.`,cap(`Vui lòng ${pv}${vi}.`),request,base,[base+'세요',stem+'고세요',stem+'는세요']);
    add(21,`${prefix}${phrase(stem+'지 마세요')}.`,cap(`Đừng ${pv}${vi}.`),stem+'지 마세요',base,[base+'지 마세요',stem+'고 마세요',stem+'는 마세요']);
    add(22,`${prefix}저는 ${phrase(stem+'지 못해요')}.`,cap(`${pv}tôi không thể ${vi}.`),stem+'지 못해요',base,[base+'지 못해요',stem+'고 못해요',stem+'는 못해요']);
    add(23,`${prefix}같이 ${phrase(future+'까요?')}`,cap(`${pv}chúng ta cùng ${vi} nhé?`),future+'까요',base,[base+'까요',stem+'고까요',stem+'는까요']);
    add(24,`${prefix}같이 ${phrase(proposal)}.`,cap(`${pv}chúng ta hãy cùng ${vi}.`),proposal,base,[base+'ㅂ시다',stem+'어읍시다',stem+'는읍시다']);
    add(39,`${prefix}${phrase(eo+' 보세요')}.`,cap(`Hãy thử ${pv}${vi}.`),eo+' 보세요',base,[base+' 보세요',stem+'는 보세요',stem+'어고 보세요']);
    add(44,`${prefix}${phrase(condition)} 기분이 좋아져요.`,cap(`Nếu ${pv}${vi} thì tâm trạng tốt lên.`),condition,base,[base+'면',stem+'고면',stem+'는면']);
    add(46,`${prefix}${phrase(eo+'도 돼요?')}`,cap(`${pv}tôi ${vi} có được không?`),eo+'도 돼요',base,[base+'도 돼요',stem+'고도 돼요',stem+'는도 돼요']);
    add(47,`${prefix}${phrase(condition+' 안 돼요')}.`,cap(`${pv}không được ${vi}.`),condition+' 안 돼요',base,[base+'면 안 돼요',stem+'고면 안 돼요',stem+'는면 안 돼요']);
  }
  add(31,`저는 ${phrase(stem+'고')} 집에 가요.`,`Tôi ${vi} rồi về nhà.`,stem+'고',base,[base+'고',stem+'는고',stem+'어요고']);
  add(31,`동생은 ${phrase(stem+'고')} 쉬어요.`,`Em tôi ${vi} rồi nghỉ ngơi.`,stem+'고',base,[base+'고',stem+'는고',stem+'어요고']);
  add(35,`저는 ${phrase(purpose)} ${place}에 가요.`,`Tôi đi đến ${({'식당':'nhà hàng','카페':'quán cà phê','도서관':'thư viện','극장':'rạp phim','교실':'phòng học','시장':'chợ','공원':'công viên','부엌':'bếp','음악실':'phòng âm nhạc','방':'phòng','운동장':'sân tập'})[place]} để ${vi}.`,purpose,base,[base+'러',stem+'고러',stem+'는러']);
  add(35,`동생은 ${phrase(purpose)} ${place}에 가요.`,`Em tôi đi đến ${({'식당':'nhà hàng','카페':'quán cà phê','도서관':'thư viện','극장':'rạp phim','교실':'phòng học','시장':'chợ','공원':'công viên','부엌':'bếp','음악실':'phòng âm nhạc','방':'phòng','운동장':'sân tập'})[place]} để ${vi}.`,purpose,base);
  add(40,`${phrase(stem+'기 전에')} 손을 씻어요.`,`Trước khi ${vi}, tôi rửa tay.`,stem+'기 전에',base,[base+'기 전에',stem+'고 전에',stem+'는 전에']);
  add(40,`${phrase(stem+'기 전에')} 시간을 확인해요.`,`Trước khi ${vi}, tôi kiểm tra giờ.`,stem+'기 전에',base);
  add(41,`${phrase(done+' 후에')} 쉬어요.`,`Sau khi ${vi}, tôi nghỉ ngơi.`,done+' 후에',base,[base+' 후에',stem+'고 후에',stem+'기 후에']);
  add(41,`${phrase(done+' 후에')} 일기를 써요.`,`Sau khi ${vi}, tôi viết nhật ký.`,done+' 후에',base);
  add(54,`${phrase(modifier)} 사람이 제 친구예요.`,`Người đang ${vi} là bạn tôi.`,modifier,base,[base+'는',stem+'고는',stem+'다는']);
  add(54,`어제 ${phrase(done)} 사람이 제 친구예요.`,`Người đã ${vi} hôm qua là bạn tôi.`,done,base,[base+'은',stem+'고은',stem+'는은']);
  add(55,`오늘은 ${phrase(future)} 시간이 있어요.`,`Hôm nay tôi có thời gian để ${vi}.`,future,base,[base+'을',stem+'고을',stem+'는을']);
  add(55,`내일은 ${phrase(future)} 시간이 없어요.`,`Ngày mai tôi không có thời gian để ${vi}.`,future,base);
}
// Complete the object-particle day with meaningful objects, not arbitrary noun substitutions.
for(const [n,v,vi] of [['빵','사요','mua bánh mì'],['우유','마셔요','uống sữa'],['사진','찍어요','chụp ảnh'],['문','열어요','mở cửa']])for(const [s,sv] of [['저는','Tôi'],['동생은','Em tôi']])add(4,`${s} ${object(n)} ${v}.`,`${sv} ${vi}.`,object(n),n,[n+particle(n,'를','을'),n+'에',n+'에서']);
const things=[['시간','thời gian'],['돈','tiền'],['친구','bạn'],['가방','cặp'],['책','sách'],['연필','bút chì'],['공책','vở'],['우산','ô'],['시계','đồng hồ'],['약속','cuộc hẹn'],['질문','câu hỏi'],['숙제','bài tập']];
for(const [n,v] of things)for(const yes of [true,false]){const f=subject(n);add(8,`저는 ${f} ${yes?'있어요':'없어요'}.`,`Tôi ${yes?'có':'không có'} ${v}.`,f,n,[n+particle(n,'가','이'),n+'을',n+'를']);}
const places=[['학교','trường'],['집','nhà'],['도서관','thư viện'],['공원','công viên'],['회사','công ty'],['은행','ngân hàng'],['병원','bệnh viện'],['식당','nhà hàng'],['카페','quán cà phê'],['시장','chợ'],['교실','phòng học'],['역','nhà ga']];
for(const [p,v] of places){
  for(const [s,sv] of [['저는','Tôi'],['친구는','Bạn tôi']]){
    add(9,`${s} ${p}에 있어요.`,`${sv} đang ở ${v}.`,'에',p,['에서','을','를']);
    add(10,`${s} ${p}에 가요.`,`${sv} đi đến ${v}.`,'에',p,['에서','이','가']);
  }
}
const times=[['아침 일곱 시','bảy giờ sáng'],['오전 아홉 시','chín giờ sáng'],['오후 두 시','hai giờ chiều'],['저녁 여섯 시','sáu giờ tối'],['월요일','thứ Hai'],['화요일','thứ Ba'],['수요일','thứ Tư'],['목요일','thứ Năm'],['금요일','thứ Sáu'],['토요일','thứ Bảy'],['일요일','Chủ nhật'],['주말','cuối tuần']];
for(const [t,v] of times){add(11,`${t}에 친구를 만나요.`,`Tôi gặp bạn vào ${v}.`,'에',t,['에서','을','를']);add(11,`${t}에 운동해요.`,`Tôi tập thể dục vào ${v}.`,'에',t,['에서','을','를']);}
const locationActions=[['도서관','책을 읽어요','thư viện','đọc sách'],['식당','밥을 먹어요','nhà hàng','ăn cơm'],['학교','공부해요','trường','học bài'],['집','쉬어요','nhà','nghỉ ngơi'],['공원','운동해요','công viên','tập thể dục'],['카페','커피를 마셔요','quán cà phê','uống cà phê'],['시장','과일을 사요','chợ','mua trái cây'],['부엌','요리해요','bếp','nấu ăn'],['회사','일해요','công ty','làm việc'],['교실','한국어를 배워요','phòng học','học tiếng Hàn'],['극장','영화를 봐요','rạp phim','xem phim'],['운동장','축구를 해요','sân tập','chơi bóng đá']];
for(const [p,action,pv,av] of locationActions)for(const [s,sv] of [['저는','Tôi'],['친구는','Bạn tôi']])add(12,`${s} ${p}에서 ${action}.`,`${sv} ${av} ở ${pv}.`,'에서',p,['에','을','를']);
const pairs=[['빵','우유','bánh mì','sữa'],['책','공책','sách','vở'],['사과','바나나','táo','chuối'],['연필','볼펜','bút chì','bút bi'],['물','커피','nước','cà phê'],['가방','시계','cặp','đồng hồ'],['우산','모자','ô','mũ'],['바지','셔츠','quần','áo sơ mi'],['우유','계란','sữa','trứng'],['빵','과일','bánh mì','trái cây'],['공책','지우개','vở','cục tẩy'],['꽃','선물','hoa','quà']];
for(const [a,b,av,bv] of pairs)for(const conjunction of ['하고',particle(a,'과','와')])add(13,`저는 ${a}${conjunction} ${object(b)} 사요.`,`Tôi mua ${av} và ${bv}.`,conjunction,a,conjunction==='하고'?['에서','에','에게']:[particle(a,'와','과'),'에서','에']);
for(const [n,v] of [['버스','xe buýt'],['택시','taxi'],['기차','tàu hỏa'],['지하철','tàu điện ngầm'],['자동차','ô tô'],['자전거','xe đạp']])for(const [dest,dv] of [['학교','trường'],['회사','công ty']]){const p=!final(n)||final(n)===8?'로':'으로';add(19,`${n}${p} ${dest}에 가요.`,`Tôi đi đến ${dv} bằng ${v}.`,p,n,[p==='로'?'으로':'로','에서','에게']);}
const help=[['창문을','열다','열어 주세요','mở cửa sổ giúp tôi'],['문을','닫다','닫아 주세요','đóng cửa giúp tôi'],['사진을','찍다','찍어 주세요','chụp ảnh giúp tôi'],['이름을','쓰다','써 주세요','viết tên giúp tôi'],['책을','읽다','읽어 주세요','đọc sách giúp tôi'],['숙제를','돕다','도와주세요','giúp tôi làm bài tập'],['천천히','말하다','말해 주세요','nói chậm giúp tôi'],['다시','설명하다','설명해 주세요','giải thích lại giúp tôi'],['책을','빌리다','빌려주세요','cho tôi mượn sách'],['짐을','들다','들어 주세요','cầm hành lý giúp tôi'],['물을','주다','주세요','cho tôi nước'],['길을','알리다','알려 주세요','chỉ đường giúp tôi']];
for(const [o,b,f,v] of help)for(const pref of ['', '좀 '])add(26,`${o} ${pref}${f}.`,`Vui lòng ${v}${pref?' một chút':''}.`,f,b);
for(const [n,v] of [['동생','em tôi'],['친구','bạn'],['언니','chị gái'],['오빠','anh trai (cách gọi của nữ)'],['형','anh trai (cách gọi của nam)'],['누나','chị gái (cách gọi của nam)']])for(const [item,iv] of [['선물','quà'],['책','sách']]){
  add(27,`${n}에게 ${object(item)} 줘요.`,`Tôi cho ${v} ${iv}.`,'에게',n,['에서','을','를']);
  add(28,`${n}에게서 ${object(item)} 받았어요.`,`Tôi đã nhận ${iv} từ ${v}.`,'에게서',n,['까지','으로','께서']);
}
for(const [start,sv,end,ev] of [['집','nhà','학교','trường'],['학교','trường','도서관','thư viện'],['회사','công ty','역','nhà ga'],['공원','công viên','집','nhà'],['역','nhà ga','병원','bệnh viện'],['은행','ngân hàng','회사','công ty']])for(const [time,tv] of [['십 분','mười phút'],['이십 분','hai mươi phút']])add(29,`${start}에서 ${end}까지 ${time} 걸려요.`,`Từ ${sv} đến ${ev} mất ${tv}.`,'까지',end,['에게','으로','의']);
for(const [from,fv,to,tv] of [['오전 아홉 시','chín giờ sáng','오후 다섯 시','năm giờ chiều'],['오전 열 시','mười giờ sáng','오후 네 시','bốn giờ chiều'],['오후 한 시','một giờ chiều','오후 세 시','ba giờ chiều'],['월요일','thứ Hai','금요일','thứ Sáu'],['아침','buổi sáng','저녁','buổi tối'],['토요일','thứ Bảy','일요일','Chủ nhật']])for(const [v,vv] of [['일해요','làm việc'],['공부해요','học bài']])add(29,`${from}부터 ${to}까지 ${v}.`,`Tôi ${vv} từ ${fv} đến ${tv}.`,'부터',from,['에게','의','를']);
const reasons=[['바쁘다','바빠','bận'],['아프다','아파','bị ốm'],['피곤하다','피곤해','mệt'],['시간이 없다','시간이 없어','không có thời gian'],['비가 오다','비가 와','trời mưa'],['눈이 오다','눈이 와','tuyết rơi']];
for(const [base,eo,vi] of reasons)for(const [tail,tv] of [['집에 있어요','tôi ở nhà'],['오늘 못 가요','hôm nay tôi không đi được']])add(33,`${eo}서 ${tail}.`,`Vì ${vi} nên ${tv}.`,eo+'서',base,[base+'서',eo+'는서',eo+'고서요']);
const contrast=[['비싸다','비싸','đắt','좋아요','tốt'],['싸다','싸','rẻ','좋아요','tốt'],['어렵다','어렵','khó','재미있어요','thú vị'],['멀다','멀','xa','자주 가요','tôi thường đi'],['작다','작','nhỏ','편해요','tiện'],['바쁘다','바쁘','bận','운동해요','tôi vẫn tập thể dục']];
for(const [base,stem,vi,tail,tv] of contrast)for(const pref of ['', '조금 '])add(32,`${pref}${stem}지만 ${tail}.`,`Tuy ${pref?'hơi ':''}${vi} nhưng ${tv}.`,stem+'지만',base,[base+'지만',stem+'는지만',stem+'어지만']);
const advice=[['춥다','추우니까','trời lạnh','따뜻한 옷을 입으세요','hãy mặc áo ấm'],['비가 오다','비가 오니까','trời mưa','우산을 가져가세요','hãy mang ô'],['시간이 없다','시간이 없으니까','không có thời gian','택시를 탑시다','hãy cùng đi taxi'],['아프다','아프니까','bị ốm','쉬세요','hãy nghỉ ngơi'],['늦다','늦으니까','muộn','빨리 가세요','hãy đi nhanh'],['위험하다','위험하니까','nguy hiểm','조심하세요','hãy cẩn thận']];
for(const [base,f,vi,tail,tv] of advice)for(const prefix of ['', '오늘은 '])add(34,`${prefix}${f} ${tail}.`,`Vì ${prefix?'hôm nay ':''}${vi} nên ${tv}.`,f,base,[base+'니까',f+'요',f+'는']);
const simultaneous=[['음악을 듣다','음악을 들으면서','공부해요','nghe nhạc','học bài'],['밥을 먹다','밥을 먹으면서','이야기해요','ăn cơm','trò chuyện'],['커피를 마시다','커피를 마시면서','책을 읽어요','uống cà phê','đọc sách'],['걷다','걸으면서','이야기해요','đi bộ','trò chuyện'],['요리하다','요리하면서','노래해요','nấu ăn','hát'],['노래를 듣다','노래를 들으면서','쉬어요','nghe bài hát','nghỉ ngơi']];
for(const [base,f,tail,av,bv] of simultaneous)for(const [s,sv] of [['저는','Tôi'],['동생은','Em tôi']])add(42,`${s} ${f} ${tail}.`,`${sv} vừa ${av} vừa ${bv}.`,f,base,[base+'면서',f+'요',base+'고면서']);
const moments=[['시간이 있다','시간이 있을 때','책을 읽어요','có thời gian','tôi đọc sách'],['피곤하다','피곤할 때','쉬어요','mệt','tôi nghỉ ngơi'],['아프다','아플 때','병원에 가요','bị ốm','tôi đi bệnh viện'],['배가 고프다','배가 고플 때','밥을 먹어요','đói','tôi ăn cơm'],['날씨가 좋다','날씨가 좋을 때','산책해요','thời tiết đẹp','tôi đi dạo'],['심심하다','심심할 때','영화를 봐요','buồn chán','tôi xem phim']];
for(const [base,f,tail,av,bv] of moments)for(const p of ['', '보통 '])add(43,`${p}${f} ${tail}.`,`${p?'Thông thường, khi':'Khi'} ${av}, ${bv}.`,f,base,[base+'때',base+'는 때',f+'는']);
const adjectives=[['날씨가','춥다','추워요','춥네요','trời lạnh'],['날씨가','덥다','더워요','덥네요','trời nóng'],['방이','크다','커요','크네요','căn phòng to'],['가방이','작다','작아요','작네요','cái cặp nhỏ'],['음식이','맵다','매워요','맵네요','món ăn cay'],['책이','재미있다','재미있어요','재미있네요','quyển sách thú vị'],['한국어가','어렵다','어려워요','어렵네요','tiếng Hàn khó'],['길이','멀다','멀어요','머네요','đường xa'],['꽃이','예쁘다','예뻐요','예쁘네요','hoa đẹp'],['방이','깨끗하다','깨끗해요','깨끗하네요','căn phòng sạch'],['음식이','맛있다','맛있어요','맛있네요','món ăn ngon'],['짐이','무겁다','무거워요','무겁네요','hành lý nặng']];
for(const [n,b,p,f,v] of adjectives){add(48,`${n} ${f}!`,`${cap(v)} thật đấy!`,f,b,[b+'네요',b.slice(0,-1)+'는네요',b.slice(0,-1)+'어네요']);add(49,`${n} ${b.slice(0,-1)}겠어요.`,`Chắc là ${v}.`,b.slice(0,-1)+'겠어요',b,[b+'겠어요',b.slice(0,-1)+'는겠어요',p+'겠어요']);}
const comparisons=[['비행기가 기차보다 빨라요.','Máy bay nhanh hơn tàu hỏa.'],['겨울이 봄보다 추워요.','Mùa đông lạnh hơn mùa xuân.'],['여름이 가을보다 더워요.','Mùa hè nóng hơn mùa thu.'],['이 가방이 저 가방보다 커요.','Cái cặp này to hơn cái cặp kia.'],['이 책이 저 책보다 싸요.','Quyển sách này rẻ hơn quyển sách kia.'],['집이 학교보다 가까워요.','Nhà gần hơn trường.'],['저는 커피보다 차를 좋아해요.','Tôi thích trà hơn cà phê.'],['저는 겨울보다 여름을 좋아해요.','Tôi thích mùa hè hơn mùa đông.'],['저는 고기보다 생선을 좋아해요.','Tôi thích cá hơn thịt.'],['저는 빵보다 밥을 좋아해요.','Tôi thích cơm hơn bánh mì.'],['저는 택시보다 지하철을 좋아해요.','Tôi thích tàu điện ngầm hơn taxi.'],['저는 사과보다 바나나를 좋아해요.','Tôi thích chuối hơn táo.']];
for(const [ko,vi] of comparisons)add(50,ko,vi,'보다','',['까지','에게','에서']);
for(const [n,p,vi] of [['물','마셔요','uống nước'],['커피','마셔요','uống cà phê'],['책','읽어요','đọc sách'],['빵','먹어요','ăn bánh mì'],['사과','사요','mua táo'],['우유','마셔요','uống sữa']])for(const [s,sv] of [['저는','Tôi'],['동생은','Em tôi']]){add(51,`${s} ${n}만 ${p}.`,`${sv} chỉ ${vi}.`,'만',n,['도','까지','에게']);add(51,`${s==='저는'?'저도':'동생도'} ${object(n)} ${p}.`,`${sv} cũng ${vi}.`,'도',n,['만','까지','에게']);}
for(const [form,n,p,vi] of [['예쁜','꽃','사요','mua hoa đẹp'],['좋은','책','읽어요','đọc sách hay'],['큰','가방','사요','mua cặp to'],['작은','방','좋아해요','thích căn phòng nhỏ'],['맛있는','음식','먹어요','ăn món ngon'],['재미있는','영화','봐요','xem phim thú vị'],['따뜻한','물','마셔요','uống nước ấm'],['새로운','노래','들어요','nghe bài hát mới'],['어려운','문제','풀어요','giải bài toán khó'],['쉬운','책','읽어요','đọc sách dễ'],['긴','편지','써요','viết thư dài'],['짧은','치마','사요','mua váy ngắn']]){const base={'예쁜':'예쁘다','좋은':'좋다','큰':'크다','작은':'작다','맛있는':'맛있다','재미있는':'재미있다','따뜻한':'따뜻하다','새로운':'새롭다','어려운':'어렵다','쉬운':'쉽다','긴':'길다','짧은':'짧다'}[form];add(53,`저는 ${form} ${object(n)} ${p}.`,`Tôi ${vi}.`,form,base,[base,base+'은',base+'는은']);}
const deletion=[['서울에','살다','삽니다','Tôi sống ở Seoul.'],['그 사실을','알다','압니다','Tôi biết sự thật đó.'],['문을','열다','엽니다','Tôi mở cửa.'],['음식을','만들다','만듭니다','Tôi làm món ăn.'],['이 길은','길다','깁니다','Con đường này dài.'],['학교는','멀다','멉니다','Trường ở xa.'],['오늘은','바쁘다','바빠요','Hôm nay tôi bận.'],['꽃이','예쁘다','예뻐요','Hoa đẹp.'],['방이','크다','커요','Căn phòng to.'],['편지를','쓰다','써요','Tôi viết thư.'],['배가','아프다','아파요','Tôi đau bụng.'],['오늘은','기쁘다','기뻐요','Hôm nay tôi vui.']];
for(const [n,b,f,v] of deletion)add(56,`${n} ${f}.`,v,f,b);
const bieup=[['날씨가','춥다','추워요','Trời lạnh.'],['날씨가','덥다','더워요','Trời nóng.'],['문제가','어렵다','어려워요','Bài toán khó.'],['문제가','쉽다','쉬워요','Bài toán dễ.'],['가방이','무겁다','무거워요','Cái cặp nặng.'],['가방이','가볍다','가벼워요','Cái cặp nhẹ.'],['정말','고맙다','고마워요','Tôi thật sự biết ơn.'],['꽃이','아름답다','아름다워요','Hoa đẹp.'],['친구를','돕다','도와요','Tôi giúp bạn.'],['고기를','굽다','구워요','Tôi nướng thịt.'],['침대에','눕다','누워요','Tôi nằm lên giường.'],['쓰레기를','줍다','주워요','Tôi nhặt rác.']];
for(const [n,b,f,v] of bieup)add(57,`${n} ${f}.`,v,f,b,[b.slice(0,-1)+'어요',b+'어요',b.slice(0,-1)+'아요']);
for(const [n,b,f,p,v] of [['음악을','듣다','들어요','들었어요','nghe nhạc'],['학교까지','걷다','걸어요','걸었어요','đi bộ đến trường'],['길을','묻다','물어요','물었어요','hỏi đường'],['짐을','싣다','실어요','실었어요','chất hành lý lên xe'],['문을','닫다','닫아요','닫았어요','đóng cửa'],['선물을','받다','받아요','받았어요','nhận quà'],['친구를','믿다','믿어요','믿었어요','tin bạn']]){add(58,`저는 보통 ${n} ${f}.`,`Tôi thường ${v}.`,f,b);add(58,`어제 ${n} ${p}.`,`Hôm qua tôi đã ${v}.`,p,b);}
const reu=[['그 노래를','모르다','몰라요','Tôi không biết bài hát đó.'],['버스가','빠르다','빨라요','Xe buýt nhanh.'],['노래를','부르다','불러요','Tôi hát.'],['옷을','고르다','골라요','Tôi chọn quần áo.'],['두 사람이','다르다','달라요','Hai người khác nhau.'],['개를','기르다','길러요','Tôi nuôi chó.'],['가격이','오르다','올라요','Giá tăng.'],['물이','흐르다','흘러요','Nước chảy.'],['옷이','마르다','말라요','Quần áo khô.'],['버튼을','누르다','눌러요','Tôi nhấn nút.'],['종이를','자르다','잘라요','Tôi cắt giấy.'],['너무','서두르다','서둘러요','Tôi vội quá.'],['물을','따르다','따라요','Tôi rót nước.'],['시험을','치르다','치러요','Tôi thi.']];
for(const [n,b,f,v] of reu)add(59,`${n} ${f}.`,v,f,b);
// Deduplicate canonical sentences before assigning IDs. Avoid inflated counts from question variants.
const unique=rows.filter((r,i)=>rows.findIndex(s=>s.lessonDay===r.lessonDay&&s.ko===r.ko)===i);
for(const lesson of lessons){if(lesson.review)continue;const daily=unique.filter(r=>r.lessonDay===lesson.day);assert.ok(daily.length>=12,`Day ${lesson.day}: only ${daily.length} sentences`)}
for(const r of unique){assert.equal(new Set([r.focus,...r.distractors]).size,4,r.id);assert.equal(r.ko.replace(r.focus,'(      )').includes('(      )'),true);assert.ok(r.vi&&r.explanation)}
fs.writeFileSync('src/data/grammar-drills.json',JSON.stringify(unique,null,2)+'\n');
console.log(`Built ${unique.length} unique sentences; minimum ${Math.min(...lessons.filter(l=>!l.review).map(l=>unique.filter(r=>r.lessonDay===l.day).length))} per teaching day.`);
