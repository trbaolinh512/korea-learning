/** Reviewed corrections applied after extracting the unchanged reference HTML files. */
export function correctAlphabet(data,quiz){
  const descriptions={
    'ㅓ':'eo [ʌ]; không tròn môi. Gợi âm tiếng Việt chỉ gần đúng, không đọc thành o [o].',
    'ㅕ':'yeo [jʌ]; âm y kết hợp với ㅓ, không phải yo [jo].',
    'ㅐ':'ae [ɛ], gần e tiếng Việt; nhiều người nói hiện nay phát âm gần ㅔ.',
    'ㅔ':'e [e], gần ê tiếng Việt; cách phát âm có thể gần ㅐ trong lời nói hiện nay.',
    'ㅙ':'wae; chữ ghép ㅗ + ㅐ, thường nghe gần [wɛ]/[we], không đọc thành oai.',
    'ㅚ':'oe; theo chuẩn là nguyên âm đơn [ø], cũng được phép đọc [we]. Không đọc thành ôi [oj].',
    'ㅟ':'wi; theo chuẩn là nguyên âm đơn [y], cũng được phép đọc [wi].',
    'ㅢ':'ui [ɰi] khi đọc riêng; 의 có thể đổi âm theo vị trí và chức năng trong từ/câu.',
    'ㄱ':'Phụ âm tắc không bật hơi mạnh; có thể gần k/g tùy vị trí và ngữ cảnh. Ở cuối âm tiết đọc chặn [k̚] trong trường hợp cơ bản.',
    'ㄷ':'Phụ âm tắc không bật hơi mạnh; có thể gần t/d tùy vị trí và ngữ cảnh. Ở cuối âm tiết đọc chặn [t̚] trong trường hợp cơ bản.',
    'ㅂ':'Phụ âm tắc không bật hơi mạnh; có thể gần p/b tùy vị trí và ngữ cảnh. Ở cuối âm tiết đọc chặn [p̚] trong trường hợp cơ bản.',
    'ㄹ':'Thường là âm vỗ [ɾ] giữa các nguyên âm và âm [l] ở cuối; còn thay đổi khi nối với phụ âm khác.',
    'ㅅ':'Âm xát [s]; trước ㅣ hoặc âm y thường gần [ɕ]. Không phải mọi vị trí đều giống s tiếng Việt.',
    'ㅇ':'Ở đầu âm tiết là ký hiệu không có phụ âm phát ra; ở cuối âm tiết đọc [ŋ] (ng). Âm mẫu 으 dùng thêm ㅡ để luyện, không phải âm riêng của ㅇ.',
    'ㅍ':'Âm tắc bật hơi [pʰ]: bật môi và thổi hơi. Không đọc như ph [f] tiếng Việt.',
    'ㅎ':'Phụ âm xát [h], gần h tiếng Việt; không thuộc nhóm bốn phụ âm tắc/tắc-xát bật hơi ㅋ, ㅌ, ㅍ, ㅊ.',
  };
  const labels={'ㅓ':'EO / Ơ (gần đúng)','ㅕ':'YEO / YƠ (gần đúng)','ㅙ':'WAE','ㅚ':'OE','ㅞ':'WE','ㅟ':'WI','ㅢ':'ƯI','ㅍ':'P (bật hơi)'};
  const basic=new Set(['ㅏ','ㅑ','ㅓ','ㅕ','ㅗ','ㅛ','ㅜ','ㅠ','ㅡ','ㅣ']);
  for(const c of [...data.vowels,...data.consonants]){
    if(descriptions[c.char])c.desc=descriptions[c.char];if(labels[c.char])c.viet=labels[c.char];
    if(data.vowels.includes(c))c.category=basic.has(c.char)?'Cơ bản':'Mở rộng';
    if(c.char==='ㅎ')c.category='Cơ bản';
  }
  const examples=[['악 부엌 밖','Cuối từ khi đọc riêng: 악 [악], 부엌 [부억], 밖 [박]. Chặn âm cuối [k̚], không thêm ư.'],['안 눈','Ví dụ đọc riêng: 안 [안], 눈 [눈], âm cuối [n].'],['옷 낮 끝','Khi đọc riêng: 옷 [옫], 낮 [낟], 끝 [끋], âm cuối [t̚]. ㅎ còn có quy tắc riêng khi nối âm.'],['달 물','Ví dụ đọc riêng: 달 [달], 물 [물], âm cuối [l].'],['암 힘','Ví dụ đọc riêng: 암 [암], 힘 [힘], âm cuối [m].'],['입 잎','Khi đọc riêng: 입 [입], 잎 [입], âm cuối [p̚], không bật hơi.'],['강 방','Ví dụ đọc riêng: 강 [강], 방 [방], âm cuối [ŋ].']];
  data.batchim.forEach((c,i)=>{c.speechText=examples[i][0];c.desc=examples[i][1]});
  for(const item of quiz){
    if(item.categoryGroup==='vowel'){
      item.subCategory=basic.has(item.char)?'Nguyên âm cơ bản':'Nguyên âm mở rộng';
      item.prompt=basic.has(item.char)?'Đây là chữ nguyên âm cơ bản gì?':'Đây là chữ nguyên âm mở rộng gì?';
    }
    if(item.categoryGroup==='consonant'&&item.char==='ㅎ'){item.subCategory='Phụ âm cơ bản';item.prompt='Đây là phụ âm cơ bản gì?'}
    const group=item.categoryGroup==='vowel'?data.vowels:item.categoryGroup==='consonant'?data.consonants:data.batchim;
    const card=group.find(c=>c.char===item.char);if(!card)throw Error('Missing card '+item.char);
    item.viet=card.viet;item.desc=card.desc;if(card.speechText)item.speechText=card.speechText;
  }
}
export function correctExam(bank){
  for(const q of bank){for(const field of ['prompt','audio','answer','explain'])q[field]=q[field].replaceAll('동생를','동생을').replaceAll('동생가','동생이');q.options=q.options.map(o=>o.replaceAll('동생를','동생을').replaceAll('동생가','동생이'))}
  bank[18].explain='Cuối tuần người nói dự định đi công viên cùng em (동생하고), không phải cùng bạn.';
  bank[22].explain='오늘은 동생 생일이에요: hôm nay là sinh nhật em. Người nói định mua bánh để chúc mừng sinh nhật em.';
  bank[35].explain='민수 씨는 동생하고 저녁을 먹었습니다: Minsu đã ăn tối cùng em. 동생 có 받침 ㅇ nên khi làm tân ngữ dùng 동생을.';
  bank[38].prompt='우리 도서관은 화요일부터 토요일까지 엽니다. 일요일과 월요일에는 쉽니다.';
  bank[38].options=['월요일에도 엽니다.','화요일에는 쉽니다.','일요일에는 문을 닫습니다.','토요일에는 쉽니다.'];
  bank[38].explain='Thư viện mở từ thứ ba đến thứ bảy, nghỉ chủ nhật và thứ hai. Chỉ câu “đóng cửa vào chủ nhật” khớp thông báo.';
  for(const i of [44,45]){
    const person=i===44?'친구':'동생';
    bank[i].question='괄호 안의 뜻에 맞는 말을 고르십시오.';
    bank[i].prompt=`(앞으로 살 계획) 내일은 ${person} 생일입니다. 저는 오늘 오후에 ${person}에게 줄 선물을 (     ).`;
    bank[i].explain=`Yêu cầu trong ngoặc là “kế hoạch sẽ mua”. Vì thế chọn 살 거예요 (sẽ mua), không phải 샀어요 (đã mua). Quà dành cho ${i===44?'bạn':'em'}.`;
  }
  return bank;
}
