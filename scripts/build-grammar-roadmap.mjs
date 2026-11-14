import fs from 'node:fs';
import assert from 'node:assert/strict';

// The user's source stays verbatim in references; editorial fixes are reproducible here.
const source='references/grammar-roadmap-60-days.md';
const raw=fs.readFileSync(source,'utf8').replace(/\r\n/g,'\n');
const plain=s=>s.replace(/\*\*|`/g,'').replace(/\*/g,'').replace(/받침|patchim|batchim/giu,'âm cuối').replace(/âm cuối \(phụ âm cuối\)/g,'âm cuối').trim();
const notes={
  1:'Xét âm tiết cuối của danh từ đứng ngay trước đuôi câu: 사람 kết thúc bằng 람, có 받침 ㅁ → 사람이에요; 사과 không có 받침 → 사과예요. 학생 kết thúc bằng 생, có 받침 ㅇ → 학생이에요.',
  2:'Chủ đề không nhất thiết là chủ ngữ. 은/는 nêu điều đang nói tới hoặc tạo đối chiếu; 이/가 đánh dấu chủ ngữ. So sánh 저는 학생이에요 (về tôi) và 제가 학생이에요 (tôi là người được xác định).',
  3:'Các dạng thường gặp: 저 + 가 → 제가; 나 + 가 → 내가; 너 + 가 → 네가; 누구 + 가 → 누가. Chọn 이/가 theo danh từ đứng ngay trước tiểu từ.',
  4:'Trật tự cơ bản là chủ đề/chủ ngữ + tân ngữ + động từ. Tiểu từ có thể được lược trong hội thoại khi ngữ cảnh rõ; hãy học dạng đầy đủ trước.',
  5:'Với gốc ㄹ, bỏ ㄹ trước ㅂ니다/ㅂ니까: 살다 → 삽니다/삽니까? Đây là mức độ trang trọng lịch sự; kính ngữ tôn chủ thể với (으)시 là vấn đề riêng.',
  6:'가다 → 가요, 보다 → 봐요 là dạng rút gọn. Động từ bất quy tắc cần học riêng: 듣다 → 들어요, 돕다 → 도와요. 자다 → 자요, không tách 자요 thành hai từ.',
  7:'Viết 아니에요, không viết 아니예요. 의사 không có 받침 → 의사가 아니에요; 도서관 có 받침 ㄴ → 도서관이 아니에요.',
  8:'Trong mẫu diễn tả sở hữu, người sở hữu thường là chủ đề: 저는 시간이 있어요. Đối tượng đang có là 시간이, không dùng 시간을 trong mẫu này.',
  9:'에 đánh dấu vị trí trong mẫu tồn tại cơ bản; ở mẫu hành động thường dùng 에서. Có thể nói 여기에 있어요 hoặc 여기 있어요; lược 에 không có nghĩa là cấm dùng 에.',
  10:'가다 là đi, 오다 là đến theo điểm nhìn của người nói. 에 chỉ đích đến; (으)로 có thể chỉ hướng. Không suy ra rằng mọi câu với 가다 đều cấm 을/를.',
  11:'Trong cách nói thời điểm cơ bản, 오늘, 어제, 내일, 지금, 언제 thường đứng trực tiếp trước vị ngữ: 내일 가요, 언제 만나요? Không mở rộng thành lệnh cấm 에 cho mọi ngữ cảnh.',
  12:'식당에서 먹어요 nêu nơi ăn; 식당에 있어요 nêu nơi tồn tại. 에서 còn có thể chỉ điểm xuất phát khi kết hợp động từ di chuyển.',
  13:'하고, 와/과 có thể mang nghĩa “và” hoặc “với” tùy câu. 같이/함께 làm rõ việc cùng nhau. Không dùng 하고 thay 고 để nối hai động từ.',
  14:'안 phủ định hành động hoặc trạng thái, không phải lúc nào cũng nói người đó cố ý không làm. 공부 안 해요 là cách thông dụng với 공부하다; không áp dụng máy móc cho mọi từ kết thúc bằng 하다.',
  15:'Tự đặt câu trước khi xem gợi ý. Chủ đề 은/는 và chủ ngữ 이/가 không thể thay cho nhau trong mọi ngữ cảnh; xét điều đang được hỏi hoặc đối chiếu.',
  16:'았/었 diễn tả quá khứ; không nhất thiết mọi trạng thái được nhắc tới đã chấm dứt ở hiện tại. 춥다 thuộc nhóm ㅂ: 추우 + 었어요 → 추웠어요.',
  17:'Gốc không có 받침 thêm ㄹ: 보다 → 볼 거예요. Gốc ㄹ giữ một ㄹ: 살다 → 살 거예요; gốc có 받침 khác thêm 을: 먹다 → 먹을 거예요. Viết cách trước 거예요.',
  18:'Trong hội thoại cơ bản, 고 싶어요 nói mong muốn của người nói hoặc hỏi người nghe. Khi tường thuật mong muốn người thứ ba thường dùng 고 싶어 해요. Đây là hướng dẫn theo điểm nhìn, không phải lệnh cấm tuyệt đối theo ngôi.',
  19:'Ngoại lệ ㄹ: 서울로, không phải 서울으로. 오른쪽 có 받침 ㄱ → 오른쪽으로. 버스로 chỉ phương tiện, 학교에 chỉ đích đến.',
  20:'Gốc ㄹ bỏ ㄹ: 살다 → 사세요, 만들다 → 만드세요. Gốc 듣- bất quy tắc: 들으세요; 돕- → 도우세요. (으)세요 cũng xuất hiện trong câu kính ngữ, không chỉ mệnh lệnh.',
  21:'지 마세요 gắn sau gốc động từ: 찍다 → 찍지 마세요. Dạng khẳng định 찍으세요 và dạng cấm 찍지 마세요 có ý nghĩa đối lập.',
  22:'못 nói không thực hiện được do khả năng/điều kiện; không khẳng định người nói nhất thiết muốn làm. 안 là phủ định chung, cũng dùng với trạng thái: 안 추워요. Trong 수영을 못 해요, 못 và 해요 viết cách.',
  23:'Gốc có 받침 khác ㄹ thêm 을까요; không 받침 thêm ㄹ까요; gốc ㄹ giữ ㄹ: 만들다 → 만들까요? Ngoài lời rủ, mẫu này còn dùng để hỏi phỏng đoán theo ngữ cảnh.',
  24:'Đây là lời đề nghị cùng làm, không phải mức lịch sự phù hợp với mọi quan hệ. Với người cần kính trọng, nên cân nhắc 같이 …(으)실까요? thay vì áp dụng máy móc theo tuổi.',
  25:'듣고 있어요 giữ nguyên gốc 듣- vì 고 bắt đầu bằng phụ âm. 고 있다 còn diễn tả trạng thái được duy trì như 알고 있어요; không giới hạn ở hành động đang cử động.',
  26:'열다 → 열어 주세요 là nhờ mở giúp. Với người được giúp cần kính trọng, có thể dùng 드리다: 선생님을 도와드려요. Học dạng viết cách 아/어 주다 trước.',
  27:'에게 dùng rộng trong văn viết và cả lời nói; 한테 thiên về hội thoại; 께 tôn kính người tiếp nhận. Không hiểu 에게 là chỉ được dùng khi viết.',
  28:'에게서/한테서 thường chỉ nguồn là người hoặc động vật; 에서 thường chỉ nguồn là địa điểm/tổ chức. 전화를 받다 nghĩa là nhận cuộc gọi.',
  29:'Đây là hai mẫu cơ bản nên học trước, không phải ranh giới tuyệt đối giữa không gian và thời gian. 부터 cũng có thể đánh dấu điểm đầu của phạm vi hoặc thứ tự tùy ngữ cảnh.',
  30:'Giải thích lý do chọn cấu trúc trong câu cụ thể. Không dùng mẹo “안 luôn chủ quan, 못 luôn khách quan” thay cho việc hiểu nghĩa câu.',
  31:'고 có nghĩa liệt kê hoặc trình tự tùy ngữ cảnh. Có thể gặp quá khứ trước 고 khi cần diễn tả thời điểm riêng: 어제는 쉬었고 오늘은 일해요. Không cấm 았/었고 một cách tuyệt đối.',
  32:'지만 nối hai nội dung tương phản; có thể gắn sau dấu quá khứ: 어려웠지만 재미있었어요. Sự tương phản phụ thuộc ngữ cảnh, không chỉ cặp từ trái nghĩa.',
  33:'Trong mẫu nguyên nhân sơ cấp, thường để dấu thì ở cuối câu và tránh câu yêu cầu/rủ rê ở vế sau; dùng (으)니까 khi cần nêu lý do cho lời đề nghị. Không áp dụng giới hạn này máy móc cho nghĩa nối tiếp của 아/어서.',
  34:'Gốc ㄹ bỏ ㄹ trước 니까: 살다 → 사니까. 춥다 thuộc nhóm ㅂ → 추우니까; không phải 춥으니까. (으)니까 có thể nêu căn cứ khách quan, không chỉ lý do chủ quan.',
  35:'Gốc ㄹ giữ ㄹ trước 러: 살다 → 살러 가요. Mẫu này nêu mục đích đi/đến, không kết hợp tùy ý với mọi vị ngữ ở vế sau.',
  36:'(으)려고 하다 nhấn mạnh ý định; (으)ㄹ 거예요 có thể nói kế hoạch hoặc phỏng đoán. Không xếp hai mẫu lên một thang chắc chắn cố định. 먹다 → 먹으려고 해요; 만들다 → 만들려고 해요.',
  37:'돼요 là dạng rút gọn của 되어요, không viết 되요. 9시까지 là chậm nhất đến 9 giờ, không nhất thiết phải trước 9 giờ. 가야 해요 diễn tả điều cần thực hiện.',
  38:'Gốc ㄹ giữ ㄹ trước 수: 만들 수 있어요. Gốc khác có 받침 thêm 을: 먹을 수 있어요; không 받침 thêm ㄹ: 갈 수 있어요. Phân biệt “có thể” với “được phép” 아/어도 되다.',
  39:'신다 → 신어 보다: thử xỏ/mang giày. 보다 (xem) cũng có thể kết hợp với trợ động từ 보다: 봐 보세요 là cách nói hợp lệ. Không cấm cấu trúc chỉ vì lặp cùng một từ.',
  40:'기 전에 gắn sau gốc động từ: 자다 → 자기 전에. Danh từ + 전에: 수업 전에. Trong cách diễn đạt cơ bản, không thêm dấu quá khứ trước 기 전에.',
  41:'끝나다 là nội động từ: 수업이 끝난 후에. Nếu dùng tân ngữ 수업을, đổi sang ngoại động từ 끝내다: 수업을 끝낸 후에. Hai cách đều diễn tả sau khi kết thúc tiết học.',
  42:'듣다 là ㄷ bất quy tắc trước nguyên âm: 듣 + 으면서 → 들으면서. Mẫu đồng thời cơ bản dùng cùng chủ thể; không thay bằng 고 nếu muốn nhấn mạnh hai hành động cùng lúc.',
  43:'Gốc ㄹ giữ ㄹ: 살 때; không 받침 thêm ㄹ: 피곤할 때; có 받침 khác thêm 을: 먹을 때. Đã xảy ra có thể dùng 았/었을 때: 어렸을 때.',
  44:'Gốc ㄹ giữ ㄹ trước 면: 살다 → 살면; gốc 받침 khác thêm 으면: 먹으면. Động từ bất quy tắc vẫn cần biến đổi: 듣다 → 들으면, 춥다 → 추우면.',
  45:'Khi so sánh 아/어서 và (으)니까, xét quan hệ nguyên nhân hay nối tiếp và kiểu câu phía sau. Không chỉ học bản dịch tiếng Việt “vì… nên…”.',
  46:'아/어도 돼요 diễn tả được phép, không phải có kỹ năng. 앉아도 돼요? là xin phép ngồi; 앉을 수 있어요 có thể nói khả năng hoặc điều kiện ngồi.',
  47:'으면 안 돼요 cấm thực hiện hành động; 지 않아도 돼요 là không bắt buộc làm. Hai cấu trúc không đồng nghĩa: 가면 안 돼요 (không được đi) khác 가지 않아도 돼요 (không cần đi).',
  48:'네요 thể hiện nhận ra hoặc phản ứng với thông tin/tình huống; không nhất thiết lần đầu trong đời thấy điều đó. Gốc ㄹ bỏ ㄹ trước ㄴ: 멀다 → 머네요.',
  49:'겠 có thể diễn tả phỏng đoán hoặc ý chí theo ngữ cảnh; không dịch mọi câu thành tương lai. 맛있겠어요 là phỏng đoán; 공부하겠어요 là ý chí của người nói trong ví dụ.',
  50:'보다 đánh dấu chuẩn so sánh; 더 thường làm rõ mức độ nhưng có thể lược. Câu thứ hai so sánh mức độ thích hai mùa, không nói mùa hè có phẩm chất hơn mùa đông.',
  51:'도/만 thường thay tiểu từ chủ đề, chủ ngữ hoặc tân ngữ ở mức cơ bản; có thể theo sau tiểu từ nơi chốn: 학교에서도, 집에서만. Không hiểu rằng chúng luôn loại bỏ mọi tiểu từ khác.',
  52:'는 것 và 기 cùng danh từ hóa nhưng không thay nhau tự do trong mọi cụm cố định. 것 là danh từ phụ thuộc nên viết cách: 보는 것. 영화 보기 là tên một hoạt động.',
  53:'예쁘다 → 예쁜; 좋다 → 좋은; 멀다 (xa) → 먼 (bỏ ㄹ). Các từ 재미있다/맛있다 dùng 는: 재미있는 영화, 맛있는 음식. ㅂ bất quy tắc: 춥다 → 추운 날.',
  54:'Hiện tại: 읽는 책; quá khứ/hoàn thành: 읽은 책. Gốc ㄹ bỏ ㄹ trước 는: 살다 → 사는 사람. Gốc ㄹ bỏ ㄹ rồi thêm ㄴ ở dạng hoàn thành: 만들다 → 만든 음식.',
  55:'Không 받침 thêm ㄹ: 만나다 → 만날; 받침 khác thêm 을: 입다 → 입을; gốc ㄹ giữ ㄹ: 만들다 → 만들 음식. Đây là định ngữ bổ nghĩa danh từ, không tự nó tạo câu hoàn chỉnh.',
  56:'ㅡ: không có âm tiết trước để xét thì chọn 어 (쓰다 → 써요); không phải mọi nguyên âm ㅡ ở bất kỳ vị trí nào cũng bị xóa. ㄹ: 살다 → 사는/삽니다/사세요 nhưng 살고/살아요; đây thường được phân tích là hiện tượng lược âm có quy tắc.',
  57:'Chỉ một nhóm từ ㅂ biến đổi; 입다 → 입어요, 잡다 → 잡아요 vẫn giữ ㅂ. 돕다/곱다 có 도와/고와 trước 아, nhưng trước (으)면 là 도우면/고우면, không phải 도오면.',
  58:'묻다 nghĩa “hỏi” → 물어요; 묻다 nghĩa “chôn” → 묻어요. Phải học cùng nghĩa của từ. 듣고 vẫn giữ ㄷ vì 고 bắt đầu bằng phụ âm.',
  59:'Không phải mọi từ 르 trừ 따르다 đều theo mẫu này: 따르다 → 따라요, 치르다 → 치러요; 푸르다 → 푸르러요 thuộc kiểu 러. Học nhóm 모르다/빠르다/부르다 trước, rồi ghi nhớ ngoại lệ.',
  60:'Ôn các ngày 1–59, trong đó ngày 15, 30, 45 là ôn tập, không phải 59 chủ điểm mới. Khi luyện đề, đọc hướng dẫn và dạng câu thực tế; không mặc định từng khoảng số câu luôn kiểm tra một nhóm ngữ pháp cố định.'
};
const replacements={
  2:[['chỉ ra chủ thể chính của câu','nêu chủ đề đang được nói tới']],
  5:[['Đuôi câu thể hiện sự tôn kính cao','Đuôi câu trang trọng lịch sự']],
  11:[['Không dùng với','Trong cách nói thời điểm cơ bản, thường không thêm 에 sau']],
  14:[['Với động từ dạng N+하다 thì đặt 안 trước 하다','Với nhiều động từ dạng N+하다, thường đặt 안 trước 하다']],
  16:[['đã xảy ra và kết thúc trong quá khứ','xảy ra hoặc tồn tại trong quá khứ']],
  18:[['(Ngôi thứ 3 dùng **고 싶어해요**)','(khi tường thuật mong muốn của người thứ ba, thường dùng **고 싶어 해요**)']],
  22:[['(khác với `안` là do chủ ý không muốn làm)','(안 là phủ định chung, không nhất thiết chỉ ý muốn)']],
  24:[['(không dùng với người lớn tuổi hơn)','(cần cân nhắc quan hệ và mức độ kính trọng khi đề nghị)']],
  27:[['**에게** (văn viết)','**에게** (thường gặp trong văn viết; cũng dùng trong lời nói)']],
  28:[['**에게서** (văn viết)','**에게서** (thường gặp trong văn viết; cũng dùng trong lời nói)']],
  30:[['`안` (chủ quan) và `못` (khách quan/khả năng)','`안` (phủ định chung) và `못` (không thực hiện được do khả năng/điều kiện)']],
  33:[['*Lưu ý: Không chia thì quá khứ/tương lai ở trước 아서/어서 và vế sau không dùng câu mệnh lệnh/rủ rê.*','*Ở mẫu nguyên nhân sơ cấp, thường đặt thì ở cuối câu và dùng (으)니까 khi vế sau là lời yêu cầu/rủ rê. Phân biệt với nghĩa nối tiếp bên dưới.*']],
  34:[['Chỉ nguyên nhân, lý do mang tính chủ quan của người nói.','Nêu nguyên nhân hoặc căn cứ cho nhận định, lời khuyên, lời đề nghị của người nói.']],
  36:[['nhưng chưa chắc chắn bằng `(으)ㄹ 거예요`','; không phân biệt với `(으)ㄹ 거예요` chỉ bằng mức độ chắc chắn']],
  37:[['Tôi phải đến công ty trước 9 giờ.','Tôi phải đến công ty chậm nhất lúc 9 giờ.']],
  41:[['수업을 끝난','수업이 끝난']],
  48:[['khi lần đầu chứng kiến hoặc trải nghiệm một sự việc nào đó','khi nhận ra hoặc phản ứng trước một thông tin, sự việc']],
  56:[['Bất quy tắc của \'ㅡ\' và \'ㄹ\'','Lược ㅡ và ㄹ khi chia từ'],['Bất quy tắc \'ㅡ\'','Lược ㅡ'],['Bất quy tắc \'ㄹ\'','Lược ㄹ'],['khi gặp các phụ âm `ㄴ, ㅂ, ㅅ` thì `ㄹ` bị lược bỏ','lược `ㄹ` trước các đuôi như `는`, `ㅂ니다`, `(으)세요` (사는, 삽니다, 사세요)']],
  57:[['(riêng `돕다`, `곱다` biến thành `오`)','(riêng `돕다`, `곱다` cho dạng `도와`, `고와` khi kết hợp với `아`)'],['도오 + 아요','돕 + 아요']],
  59:[['Gốc động/tính từ kết thúc bằng `르` (trừ 따르다)','Một nhóm động/tính từ kết thúc bằng `르` (như 모르다, 빠르다, 부르다)']],
  60:[['Rà soát lại toàn bộ 59 chủ điểm ngữ pháp đã học.','Rà soát nội dung ngày 1–59, gồm các bài học và ba buổi ôn tập.'],['* **Mẹo thi TOPIK 1 (Phần Đọc - 읽기):**','* **Chiến thuật luyện đọc TOPIK I (không gắn cứng với số câu):**'],['Câu 31–33:','Với câu chọn tiểu từ/liên từ:'],['Câu 34–39:','Với câu hỏi về nghĩa:'],['Câu 40–70:','Với đoạn đọc:']]
};
const analyses={
1:['사람 kết thúc bằng 람, có 받침 ㅁ nên thêm 이에요; 저는 nêu chủ đề “tôi”.','사과 không có 받침 nên thêm 예요; 이거는 nghĩa là “cái này thì”.'],
2:['저 không có 받침 nên thêm 는 để nêu chủ đề; 학생 có 받침 ㅇ nên dùng 이에요.','는 sau 사과 và 바나나 tạo đối chiếu giữa hai loại quả; 하지만 nối hai nhận xét trái nhau.'],
3:['날씨 không có 받침 → 가; 좋아요 là vị ngữ đánh giá thời tiết.','책상 kết thúc bằng 상 có 받침 ㅇ → 이; 커요 mô tả kích thước bàn.'],
4:['밥 có 받침 ㅂ → 을; 밥 là thứ được 먹어요 (ăn).','영화 không có 받침 → 를; 친구가 là người thực hiện việc xem.'],
5:['가다 bỏ 다, gốc 가 không có 받침 nên thêm ㅂ니다 → 갑니다; 학교에 là đích đến.','먹다 có gốc 먹 với 받침 ㄱ → 먹습니까? 무엇을 hỏi vật được ăn.'],
6:['공부하다 → 공부해요; 매일 cho biết việc học diễn ra mỗi ngày.','자다 → 자요; 집에서 chỉ nơi hành động ngủ diễn ra, 동생이 là chủ ngữ.'],
7:['의사 không có 받침 → 가; 아니에요 phủ định danh tính bác sĩ.','도서관 có 받침 ㄴ → 이; 아닙니다 là phủ định trang trọng lịch sự.'],
8:['시간 có 받침 ㄴ → 이; 있어요 nói có thời gian, 저는 là người sở hữu được nêu làm chủ đề.','교실에 nêu nơi tồn tại; 선생님이 là người vắng mặt, 없어요 nghĩa là không có ở đó.'],
9:['책상 위 là “trên bàn”; 에 gắn sau cả cụm để chỉ vị trí quyển sách.','집에 là “ở nhà”; 없어요 nói chị không có mặt tại nơi này vào lúc nói.'],
10:['백화점에 chỉ đích đến; 내일 xác định thời gian tương lai trong câu này.','우리 집에 chỉ nhà là đích đến; 오다 → 와요 nghĩa là đến theo điểm nhìn của người nói.'],
11:['아침 7시 là 7 giờ sáng; 에 đặt sau cụm giờ để đánh dấu thời điểm thức dậy.','주말에 nêu thời điểm gặp; 친구를 là đối tượng của 만나요.'],
12:['식당에서 là nơi ăn; 점심을 là bữa trưa được ăn.','도서관에서 nêu nơi đọc; 책을 là đối tượng được đọc.'],
13:['하고 nối 책 và 공책; 가방 안에 chỉ nơi có sách và vở.','친구 không có 받침 nên dùng 와; 같이 làm rõ nghĩa cùng bạn xem phim.'],
14:['안 đứng trước 가요 để phủ định việc đi; 오늘은 giới hạn câu chuyện vào hôm nay.','예쁘다 bỏ 다 rồi thêm 지 않아요 → 예쁘지 않아요, phủ định tính chất đẹp.'],
16:['만나다 → 만나 + 았어요 → 만났어요; 어제 xác định ngày đã qua.','춥다 → 추우 + 었어요 → 추웠어요; 지난주에 nêu tuần được nói tới.'],
17:['보다 → 볼 거예요 là dự định xem; 내일 là ngày thực hiện.','쉬다 → 쉴 거예요; 집에서 chỉ nơi nghỉ ngơi, 주말에 là cuối tuần.'],
18:['가다 bỏ 다 rồi thêm 고 싶어요 để nói mong muốn đi; 한국에 là đích.','먹다 giữ gốc 먹 trước 고 싶어요; 비빔밥을 là món muốn ăn.'],
19:['버스 không có 받침 → 로 để chỉ phương tiện; 학교에 là đích đến.','오른쪽 có 받침 ㄱ → 으로; 가세요 là lời hướng dẫn đi về phía bên phải.'],
20:['앉다 có 받침 ㄵ → 앉으세요; 여기에 nêu chỗ được mời ngồi.','조용히 là trạng từ “yên lặng”; 하다 → 하세요 trong lời yêu cầu lịch sự.'],
21:['떠들다 bỏ 다 rồi thêm 지 마세요; 교실에서 là nơi không được làm ồn.','찍다 bỏ 다 rồi thêm 지 마세요 để yêu cầu không chụp ảnh.'],
22:['수영을 하다 là bơi; 못 đặt trước 해요 cho biết không thể/không biết bơi theo ngữ cảnh.','가다 → 가지 못했어요 là phủ định ở quá khứ; 아파서 cho biết lý do sức khỏe.'],
23:['마시다 không có 받침 → 마실까요? 우리 같이 cho thấy đây là lời rủ cùng uống.','만나다 → 만날까요? 몇 시에 hỏi thời điểm hai bên sẽ gặp nhau.'],
24:['먹다 có 받침 ㄱ → 먹읍시다, đề nghị cùng ăn trưa.','공부하다 không có 받침 ở gốc 하 → 공부합시다; 도서관에서 là nơi học.'],
25:['듣다 giữ 듣 trước 고 → 듣고 있어요; 지금 xác định hành động đang diễn ra.','요리를 하다 là nấu ăn; 하고 계세요 dùng 계시다 để kính trọng người mẹ.'],
26:['열다 → 열어 주세요, nhờ mở cửa sổ giúp; 좀 làm lời nhờ nhẹ hơn.','돕다 → 도와주었어요; 친구가 là người giúp, 숙제를 là việc được giúp làm.'],
27:['동생에게 là người nhận; 선물을 là quà được tặng, 주었어요 chỉ việc đã cho.','선생님께 dùng 께 để kính trọng thầy cô là người tiếp nhận câu hỏi.'],
28:['친구한테서 chỉ người gửi/nguồn nhận thư; 편지를 받았어요 là đã nhận thư.','부모님에게서 chỉ người gọi; 전화를 받았어요 nghĩa là đã nhận cuộc gọi.'],
29:['집에서 là điểm xuất phát, 회사까지 là điểm cuối; 30분 걸려요 cho biết thời gian di chuyển.','9시부터 và 5시까지 xác định đầu/cuối khoảng thời gian làm việc.'],
31:['싸다 + 고 → 싸고; rẻ và đẹp là hai tính chất được liệt kê cho cùng chiếc cặp.','먹고 nối ăn tối với xem tivi theo thứ tự được hiểu trong ngữ cảnh.'],
32:['어렵다 + 지만 → 어렵지만; 재미있어요 tạo ý tương phản với việc khó.','작지만 nối đặc điểm thấp với khả năng chơi bóng rổ giỏi; chủ thể được lược theo ngữ cảnh.'],
33:['아프다 → 아파서 theo lược ㅡ; đau bụng là lý do đi bệnh viện, thì quá khứ ở 갔어요.','만나다 → 만나서; gặp bạn là hành động dẫn tới cùng ăn cơm, đây là nghĩa nối tiếp.'],
34:['춥다 → 추우니까 theo ㅂ bất quy tắc; 입으세요 là lời khuyên mặc áo ấm.','없다 → 없으니까; 탑시다 là đề nghị đi taxi dựa trên việc thiếu thời gian.'],
35:['빌리다 không có 받침 → 빌리러; mượn sách là mục đích đến thư viện.','배우다 → 배우러; 왔어요 chỉ việc đã đến Hàn Quốc để học tiếng Hàn.'],
36:['만나다 → 만나려고 해요 để nêu ý định gặp bạn; 내일 là ngày dự kiến.','가다 → 가려고 해요; 이번 방학에 xác định kỳ nghỉ dự định đi du lịch.'],
37:['공부하다 → 공부해야 돼요 là nghĩa vụ học; 시험이 있어서 nêu lý do có bài kiểm tra.','가다 → 가야 해요; 9시까지 là hạn chót đến công ty, bao gồm thời điểm 9 giờ.'],
38:['운전하다 → 운전을 할 수 있어요; có thể lái xe là khả năng của người nói.','가다 → 갈 수 없어요; 바빠서 nêu điều kiện ngăn việc đến dự tiệc.'],
39:['신다 → 신어 보세요 là lời mời thử mang giày; 한번 nghĩa là thử một lần.','가다 → 가 봤어요 nói đã có trải nghiệm đến Jeju; không chỉ một kế hoạch tương lai.'],
40:['먹다 + 기 전에 → 먹기 전에; việc rửa tay xảy ra trước việc ăn.','자다 + 기 전에 → 자기 전에; viết nhật ký diễn ra trước khi ngủ.'],
41:['수업이 là chủ ngữ của 끝나다; 끝나다 → 끝난 후에 chỉ sau khi tiết học kết thúc.','먹다 có 받침 ㄱ → 먹은 후에; uống cà phê diễn ra sau bữa trưa.'],
42:['듣다 đổi ㄷ thành ㄹ trước 으 → 들으면서; nghe nhạc và học cùng diễn ra ở một người.','먹다 + 으면서 → 먹으면서; hai hành động ăn và trò chuyện xảy ra đồng thời.'],
43:['있다 có 받침 ㅆ → 있을 때; đọc sách diễn ra khi có thời gian.','피곤하다 → 피곤할 때; trạng thái mệt là mốc tình huống cho việc đi ngủ sớm.'],
44:['오다 không có 받침 → 오면; mưa là điều kiện để chọn ở nhà.','벌다 có 받침 ㄹ → 벌면; kiếm nhiều tiền là điều kiện gắn với mong muốn du lịch.'],
46:['앉다 → 앉아도 돼요? hỏi xin phép ngồi ở đây, không hỏi kỹ năng ngồi.','들어가다 → 들어가도 돼요; đây là lời cho phép đi vào đáp lại yêu cầu.'],
47:['찍다 có 받침 ㄱ → 찍으면 안 돼요, diễn tả cấm chụp ảnh ở bảo tàng trong ví dụ.','자다 không có 받침 → 자면 안 돼요; 수업 시간에 giới hạn lệnh cấm vào giờ học.'],
48:['잘하시네요 có 시 để kính trọng người được khen; 네요 thể hiện nhận ra khả năng nói giỏi.','춥다 giữ ㅂ trước phụ âm ㄴ của 네요 → 춥네요; đây là phản ứng trước thời tiết.'],
49:['맛있다 + 겠어요 diễn tả phỏng đoán món ăn ngon từ tình huống, không phải ý chí của món ăn.','공부하다 + 겠어요 thể hiện ý chí sẽ học chăm chỉ của người nói.'],
50:['기차보다 là chuẩn so sánh; 비행기가 là đối tượng được nhận xét nhanh hơn. 더 có thể lược.','겨울보다 đặt mùa đông làm chuẩn; 여름을 là mùa được thích hơn.'],
51:['만 theo sau 물 giới hạn thứ đã uống là nước; 마셨어요 là quá khứ của 마시다.','도 theo sau 저 thêm người nói vào nhóm học sinh; 학생 kết thúc bằng 생 có 받침 ㅇ → 이에요.'],
52:['보다 → 보는 것 biến hành động xem phim thành cụm danh từ; 이에요 gắn sau 것.','부르다 + 기 → 부르기 là danh từ hóa; 를 đánh dấu cụm hoạt động được 좋아해요.'],
53:['예쁘다 → 예쁜 để bổ nghĩa 꽃; 샀어요 là đã mua.','재미있다 dùng 는 → 재미있는 để bổ nghĩa 영화; 어제 cho biết thời điểm xem.'],
54:['공부하다 + 는 → 공부하는 bổ nghĩa 사람 ở hiện tại; người này được xác định là em.','읽다 có 받침 ㄺ → 읽은; mệnh đề 어제 읽은 xác định quyển sách đã đọc hôm qua.'],
55:['만나다 → 만날 bổ nghĩa 친구; 내일 cho biết cuộc gặp chưa xảy ra lúc nói.','입다 có 받침 ㅂ → 입을 (không thuộc nhóm ㅂ bất quy tắc); cụm này chỉ quần áo để mặc cuối tuần.']
};

let phase='',goal='';
const lessons=[];
for(const block of raw.split(/(?=^## GIAI ĐOẠN |^### Ngày )/m)){
  if(block.startsWith('## GIAI ĐOẠN')){
    phase=block.split('\n')[0].replace(/^## /,'');
    goal=plain(block.match(/^\*Mục tiêu: (.+)$/m)?.[1]||'');
    continue;
  }
  const heading=block.match(/^### Ngày (\d+): (.+)/);
  if(!heading)continue;
  const day=Number(heading[1]);let text=block;
  for(const [before,after] of replacements[day]||[]){assert.ok(text.includes(before),`Missing correction ${day}: ${before}`);text=text.replaceAll(before,after)}
  const title=plain(text.split('\n')[0].replace(/^### Ngày \d+: /,''));
  const sections=[];const examples=[];let section;
  for(const line of text.split('\n').slice(1)){
    if(!line.trim()||line.trim()==='---')continue;
    const label=line.match(/^\* \*\*(.+?):\*\*(.*)$/);
    if(label){section={title:plain(label[1]),lines:[]};sections.push(section);if(label[2].trim())section.lines.push(plain(label[2]));continue}
    assert.ok(section,`Unparsed line ${day}: ${line}`);
    const body=plain(line.replace(/^\s*(?:\*|\d+\.)\s+/,''));
    const example=body.match(/^(.+?[.!?])\s+\((.+)\)\.?$/);
    if(section.title==='Ví dụ'&&example&&/[가-힣]/.test(example[1]))examples.push({ko:example[1],vi:example[2],explanation:plain(analyses[day]?.[examples.length]||'')});
    else section.lines.push(body);
  }
  lessons.push({day,title,phase,goal,review:[15,30,45,60].includes(day),sections:sections.filter(s=>s.lines.length),examples,note:plain(notes[day]),source});
}
assert.equal(lessons.length,60);
for(const [i,l] of lessons.entries()){
  assert.equal(l.day,i+1);assert.ok(l.note&&l.phase&&l.goal);assert.ok(l.sections.length);
  for(const e of l.examples)assert.ok(e.explanation,`Missing explanation ${l.day}: ${e.ko}`);
}
fs.writeFileSync('src/data/grammar-roadmap.json',JSON.stringify(lessons,null,2)+'\n');
console.log(`Built ${lessons.length} grammar days, ${lessons.filter(l=>l.review).length} review days, ${lessons.reduce((n,l)=>n+l.examples.length,0)} explained sentence examples.`);
