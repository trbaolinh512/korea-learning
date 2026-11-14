import fs from 'node:fs';
const path='scripts/build-study-grammar.mjs';let source=fs.readFileSync(path,'utf8');
const changes=[
 ['N có 받침 + 은 / 이에요; N không có 받침 + 는 / 예요.','Trong N1은/는 N2이에요/예요: xét N1 để chọn 은/는; xét N2 để chọn 이에요/예요. Âm tiết cuối của từng danh từ quyết định có 받침 hay không.'],
 ['저 (tôi) + 는 nêu chủ đề; Âm tiết cuối','저 (tôi) + 는 nêu chủ đề; âm tiết cuối'],
 ['Địa điểm tồn tại dùng 에, không dùng 에서. Khi hỏi về một đối tượng mới, 이/가 thường là lựa chọn tự nhiên.','Trong mẫu cơ bản chỉ nơi tồn tại, dùng 에: 집에 있어요. 에서 thường chỉ nơi diễn ra hành động; không hiểu đây là quy tắc cấm 에서 trong mọi câu có 있다.'],
 ['Có rút gọn và bất quy tắc: 가다 → 가요, 오다 → 와요, 마시다 → 마셔요. Không chỉ lấy chữ cuối rồi nối máy móc.','Các dạng 가다 → 가요, 오다 → 와요, 마시다 → 마셔요 là rút gọn, không phải ba ví dụ bất quy tắc. Ngoài ra còn có biến đổi riêng như 듣다 → 들어요, 돕다 → 도와요; cần học theo từng động từ.'],
 ['와요 rút gọn từ 오아요.','오 + 아요 rút gọn thành 와요.'],
 ['아홉 시 là giờ thuần Hàn; 에 gắn sau 시 để chỉ thời điểm; 수업이 있어요 nghĩa là có buổi học.','오전 là trước 12 giờ trưa; 아홉 là số thuần Hàn chỉ chín, 시 là đơn vị giờ. 에 gắn sau cụm 아홉 시; 수업이 있어요 nghĩa là có buổi học.'],
 ['Dùng khi muốn làm nhưng không có khả năng, điều kiện hoặc cơ hội thực hiện. Thường đi với động từ hành động.','Nói việc không thực hiện được vì khả năng hoặc hoàn cảnh; không nhất thiết khẳng định người nói đang muốn làm. Thường đi với động từ hành động.'],
 ['Muốn nói người thứ ba mong gì thường dùng 고 싶어해요.','Khi nói mong muốn của người thứ ba thường dùng 고 싶어 해요.'],
 ['Gốc có 받침 + 으세요, không có 받침 + 세요; V아/어 + 주세요.','Gốc có 받침 khác ㄹ + 으세요; không có 받침 + 세요; gốc có ㄹ bỏ ㄹ rồi + 세요 (살다 → 사세요). V아/어 + 주세요 dùng để nhờ giúp.'],
 ['주세요 đứng sau dạng 아/어 của động từ. Ví dụ 도와주다 thành 도와주세요; không ghép 돕으세요 một cách máy móc vì 돕다 bất quy tắc.','Động từ bất quy tắc phải đổi gốc phù hợp: 돕다 → 도우세요; 듣다 → 들으세요. Với 아/어 주세요: 돕다 → 도와주세요, 말하다 → 말해 주세요. Không dùng 돕으세요.'],
 ['A는 B보다 더 A/V; phạm vi + 에서 제일/가장 + tính từ.','N1은/는 N2보다 (더) + V/A; phạm vi + 에서/중에서 제일/가장 + V/A. N2 là mốc so sánh.'],
 ['Không gắn máy móc với mọi tính từ. Một số động từ mặc/mang có sắc thái trạng thái kéo dài; bài này chỉ tập trung hành động đang làm.','Mẫu tiếp diễn này dùng với động từ hành động. Với 입다, 신다, 쓰다 (đội), dạng 고 있다 còn có thể diễn tả trạng thái đang mặc/mang sau khi hành động hoàn tất; không phải mọi 고 있다 đều là đang thực hiện động tác.'],
];
let count=0;for(const [before,after] of changes){if(source.includes(before)){source=source.replace(before,after);count++}else if(!source.includes(after))throw Error('Missing expected content: '+before)}
fs.writeFileSync(path,source);console.log('Grammar explanations clarified:',count);
