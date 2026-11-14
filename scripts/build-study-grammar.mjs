import fs from 'node:fs';
const basic='42 CẤU TRÚC NGỮ PHÁP TIẾNG HÀN CƠ BẢN.pdf',intro='NGU PHAP TIENG HAN SO CAP.pdf';
const lessons=[];
function g(title,meaning,formula,usage,note,examples,pages,source=basic){lessons.push({id:lessons.length+1,title,meaning,formula,usage,note,examples:examples.map(([ko,vi,explanation])=>({ko,vi,explanation})),source,pages})}
g('N은/는 N이에요/예요','Giới thiệu chủ đề và nói “là”.','Trong N1은/는 N2이에요/예요: xét N1 để chọn 은/는; xét N2 để chọn 이에요/예요. Âm tiết cuối của từng danh từ quyết định có 받침 hay không.',
'은/는 đánh dấu điều đang nói tới. 이에요/예요 gắn trực tiếp sau danh từ để xác định người, vật hoặc nghề nghiệp; đây là cách nói lịch sự trong hội thoại.',
'Không thêm 이/가 giữa danh từ và 이에요/예요. Dạng phủ định là N이/가 아니에요.',
[['저는 학생이에요.','Tôi là học sinh.','저 (tôi) + 는 nêu chủ đề; âm tiết cuối của 학생 là 생, có 받침 ㅇ nên dùng 이에요.'],['민수는 의사예요.','Minsu là bác sĩ.','민수 không có 받침 nên đi với 는; 의사 kết thúc bằng nguyên âm nên thêm 예요.']],[1,2]);
g('N이/가 있어요 / 없어요','Nói có, không có hoặc tồn tại ở đâu.','N có 받침 + 이; N không có 받침 + 가; sau đó dùng 있어요 / 없어요.',
'이/가 xác định đối tượng tồn tại. 있어요 diễn tả có hoặc ở một nơi; 없어요 diễn tả không có. Người sở hữu thường là chủ đề với 은/는.',
'Trong mẫu cơ bản chỉ nơi tồn tại, dùng 에: 집에 있어요. 에서 thường chỉ nơi diễn ra hành động; không hiểu đây là quy tắc cấm 에서 trong mọi câu có 있다.',
[['동생이 있어요.','Tôi có em.','동생 có 받침 ㅇ nên dùng 이; 있어요 diễn tả có người em.'],['집에 고양이가 없어요.','Ở nhà không có mèo.','집에 nêu nơi tồn tại; 고양이 không có 받침 ở âm tiết cuối nên thêm 가; 없어요 phủ định sự có mặt.']],[1,3]);
g('이/그/저 + N','Chỉ người hoặc vật này, đó, kia.','이 + N: gần người nói; 그 + N: gần người nghe/đã nhắc; 저 + N: xa cả hai.',
'Các từ chỉ định đứng trước danh từ và viết cách danh từ. 이것/그것/저것 là dạng thay cho cả cụm “vật này/đó/kia”.',
'Phân biệt 저 (tôi, khiêm nhường) với 저 đứng trước danh từ mang nghĩa “kia”; dựa vào vị trí trong câu.',
[['이 책은 한국어 책이에요.','Quyển sách này là sách tiếng Hàn.','이 bổ nghĩa cho 책. 은 nêu chủ đề; 책 có 받침 nên cuối câu dùng 이에요.'],['저 사람은 선생님이에요.','Người kia là giáo viên.','저 chỉ người ở xa cả người nói và người nghe; 사람은 là chủ đề, 선생님이에요 xác định nghề nghiệp.']],[3]);
g('N을/를','Đánh dấu tân ngữ của hành động.','N có 받침 + 을; N không có 받침 + 를.',
'Gắn sau danh từ chịu tác động trực tiếp của động từ, thường trả lời câu hỏi làm gì, ăn gì, đọc gì. Trật tự cơ bản: chủ đề + tân ngữ + động từ.',
'Không dùng 을/를 với 있다/없다 để chỉ vật đang có. Khi đó dùng 이/가.',
[['책을 읽어요.','Tôi đọc sách.','책 là vật được đọc và có 받침 ㄱ nên thêm 을; 읽어요 là hành động đọc.'],['한국어를 공부해요.','Tôi học tiếng Hàn.','한국어 không có 받침 nên dùng 를; 공부하다 được chia lịch sự thành 공부해요.']],[7]);
g('V/A아/어요','Nói hành động hoặc trạng thái ở thể lịch sự thông dụng.','Bỏ 다; gốc có nguyên âm cuối ㅏ/ㅗ → 아요; phần lớn còn lại → 어요; 하다 → 해요.',
'Dùng trong hội thoại hằng ngày với người chưa thân. Cùng dạng câu này có thể dùng để hỏi bằng cách lên giọng hoặc thêm dấu hỏi.',
'Các dạng 가다 → 가요, 오다 → 와요, 마시다 → 마셔요 là rút gọn, không phải ba ví dụ bất quy tắc. Ngoài ra còn có biến đổi riêng như 듣다 → 들어요, 돕다 → 도와요; cần học theo từng động từ.',
[['아침에 밥을 먹어요.','Buổi sáng tôi ăn cơm.','먹다 bỏ 다 còn 먹; nguyên âm ㅓ chọn 어요 → 먹어요. 밥을 là tân ngữ.'],['매일 한국어를 공부해요.','Tôi học tiếng Hàn mỗi ngày.','공부하다 thuộc nhóm 하다 → 해요; 매일 bổ sung tần suất “mỗi ngày”.']],[3,4,5]);
g('N에 가요 / 와요','Nêu đích đến khi di chuyển.','Địa điểm + 에 + 가다/오다/다니다.',
'에 gắn vào nơi hướng tới. 가다 là đi, 오다 là đến; cả hai đều có thể kết hợp với 에 để nêu đích.',
'에 chỉ đích đến hoặc nơi tồn tại; 에서 chỉ nơi thực hiện hành động. 학교에 가요 nhưng 학교에서 공부해요.',
[['학교에 가요.','Tôi đi đến trường.','학교 là đích đến; 에 đánh dấu đích, 가요 là dạng lịch sự của 가다.'],['친구가 집에 와요.','Bạn đến nhà.','친구가 là người di chuyển; 집에 là đích; 오 + 아요 rút gọn thành 와요.']],[3]);
g('N에서 V','Nói hành động xảy ra tại đâu.','Địa điểm + 에서 + động từ hành động.',
'에서 đánh dấu bối cảnh thực hiện hành động như ăn, học, làm việc. Cũng có nghĩa “từ” khi nói nơi xuất phát; phân biệt qua động từ.',
'Không dùng 에서 thay 에 trong câu đơn thuần chỉ vị trí: 집에 있어요. Với hành động: 집에서 쉬어요.',
[['도서관에서 책을 읽어요.','Tôi đọc sách ở thư viện.','도서관에서 nêu nơi hành động đọc diễn ra; 책을 là đối tượng được đọc.'],['식당에서 점심을 먹어요.','Tôi ăn trưa ở nhà hàng.','식당에서 chỉ nơi ăn; 점심을 là bữa trưa; 먹어요 là động từ chính.']],[6]);
g('Thời gian + 에','Nêu thời điểm xảy ra hành động.','Thứ/ngày/tháng/giờ + 에 + hành động.',
'에 tương đương “vào, lúc” khi gắn sau thời gian xác định. Có thể nêu cả thứ và giờ để hẹn lịch.',
'오늘, 어제, 내일, 지금 và 매일 thường không thêm 에. So sánh 내일 가요 với 월요일에 가요.',
[['월요일에 친구를 만나요.','Tôi gặp bạn vào thứ hai.','월요일에 đánh dấu ngày gặp; 친구를 là người được gặp.'],['오전 아홉 시에 수업이 있어요.','Có lớp học lúc chín giờ sáng.','오전 là trước 12 giờ trưa; 아홉 là số thuần Hàn chỉ chín, 시 là đơn vị giờ. 에 gắn sau cụm 아홉 시; 수업이 있어요 nghĩa là có buổi học.']],[8]);
g('Số đếm + đơn vị','Đếm người, đồ vật và số lượng.','N + số thuần Hàn + 개/명/권/잔; 하나→한, 둘→두, 셋→세, 넷→네 trước đơn vị.',
'Chọn đơn vị theo vật: 개 cho đồ vật, 명 cho người, 권 cho sách, 잔 cho cốc/ly. Danh từ đứng trước số lượng trong cách nói thông dụng.',
'Giá tiền, ngày tháng, phút thường dùng số Hán Hàn. Đếm giờ dùng số thuần Hàn; đếm phút dùng số Hán Hàn.',
[['사과 두 개를 사요.','Tôi mua hai quả táo.','둘 đổi thành 두 trước 개; 를 gắn sau cả cụm số lượng để đánh dấu tân ngữ.'],['학생 세 명이 있어요.','Có ba học sinh.','셋 đổi thành 세 trước 명; 이 theo sau 명 vì 명 có 받침, toàn cụm là đối tượng tồn tại.']],[8,9]);
g('N하고 / N와/과','Nối danh từ và diễn tả cùng ai.','N + 하고 + N; N có 받침 + 과, không có 받침 + 와.',
'하고 và 와/과 dùng để nối hai danh từ với nghĩa “và”. Khi đi cùng hành động, cụm này có thể có nghĩa “với”; 같이/함께 làm rõ việc cùng nhau.',
'Không dùng 하고 để nối trực tiếp hai động từ; muốn nói ăn rồi học dùng 먹고 공부해요.',
[['빵하고 우유를 사요.','Tôi mua bánh mì và sữa.','하고 nối 빵 với 우유; 를 đánh dấu cụm đồ được mua.'],['친구와 같이 영화를 봐요.','Tôi xem phim cùng bạn.','친구 không có 받침 nên dùng 와; 같이 nhấn mạnh cùng nhau; 영화를 là tân ngữ.']],[4],intro);
g('N도','Bổ sung với nghĩa “cũng”.','N + 도 + vị ngữ.',
'도 cho biết một đối tượng hoặc hành động bổ sung vào điều vừa nói. Thường thay 은/는, 이/가 hoặc 을/를 ngay sau danh từ.',
'Không viết 저는도 hoặc 사과를도 trong cách dùng cơ bản. Có thể ghép với trợ từ nơi chốn: 학교에서도.',
[['저도 커피를 좋아해요.','Tôi cũng thích cà phê.','도 thay 는 sau 저, thêm tôi vào nhóm người thích cà phê. 커피를 là đối tượng được thích.'],['물도 주세요.','Cho tôi cả nước nữa.','도 thay trợ từ tân ngữ, thêm nước vào những món đang yêu cầu; 주세요 là lời nhờ lịch sự.']],[5]);
g('안 V/A · V/A지 않아요','Phủ định hành động hoặc trạng thái.','안 + vị ngữ; hoặc gốc V/A + 지 않아요.',
'Dùng khi nói không làm hoặc không ở trạng thái nào đó. Với danh từ + 하다 như 공부하다, 안 thường đứng trước 하다: 공부 안 해요.',
'Phủ định “là” dùng 아니에요; phủ định “có” dùng 없어요. Phân biệt không làm (안) với không thể làm (못).',
[['오늘은 학교에 안 가요.','Hôm nay tôi không đi học.','안 đứng ngay trước 가요 để phủ định hành động đi; 오늘은 nêu chủ đề thời gian.'],['이 옷은 비싸지 않아요.','Bộ quần áo này không đắt.','비싸다 bỏ 다 còn 비싸, nối 지 않아요 để phủ định tính chất đắt.']],[6]);
g('못 V · V지 못해요','Không thể làm do khả năng hoặc hoàn cảnh.','못 + động từ; hoặc gốc V + 지 못해요.',
'Nói việc không thực hiện được vì khả năng hoặc hoàn cảnh; không nhất thiết khẳng định người nói đang muốn làm. Thường đi với động từ hành động.',
'못 đứng cách động từ trong mẫu cơ bản: 못 가요. Tránh dùng để phủ định tính từ như 예쁘다; khi đó dùng 안 hoặc 지 않아요.',
[['오늘은 바빠서 못 가요.','Hôm nay bận nên tôi không đi được.','바빠서 nêu lý do; 못 가요 cho biết hoàn cảnh ngăn việc đi.'],['저는 수영을 하지 못해요.','Tôi không bơi được.','수영을 하다 là bơi; 하지 못해요 phủ định khả năng thực hiện hành động.']],[6]);
g('V/A았/었어요','Nói việc hoặc trạng thái đã xảy ra.','Gốc có ㅏ/ㅗ + 았어요; phần lớn khác + 었어요; 하다 → 했어요.',
'Dùng để nói quá khứ. Các từ 어제, 지난주, 작년 thường đi kèm để xác định khi nào việc đã diễn ra.',
'Một số dạng rút gọn: 가다→갔어요, 오다→왔어요, 보다→봤어요. Không dùng dạng hiện tại chỉ vì động từ được tra ở dạng từ điển.',
[['어제 친구를 만났어요.','Hôm qua tôi đã gặp bạn.','만나다 có gốc 만나; 만나 + 았어요 rút gọn thành 만났어요. 어제 xác định quá khứ.'],['지난주에 한국어를 공부했어요.','Tuần trước tôi đã học tiếng Hàn.','공부하다 → 공부했어요; 지난주에 nêu tuần đã qua, 를 đánh dấu nội dung học.']],[7]);
g('V고 싶어요','Diễn tả mong muốn làm một việc.','Gốc động từ + 고 싶어요.',
'Dùng để nói mong muốn của mình hoặc hỏi mong muốn người nghe. 고 gắn sau gốc động từ; phần 싶다 được chia theo thì và mức lịch sự.',
'Dùng với động từ hành động, không nối trực tiếp sau danh từ. Khi nói mong muốn của người thứ ba thường dùng 고 싶어 해요.',
[['한국에 가고 싶어요.','Tôi muốn đi Hàn Quốc.','가다 bỏ 다, thêm 고 싶어요; 한국에 là nơi muốn tới.'],['무엇을 먹고 싶어요?','Bạn muốn ăn gì?','무엇을 hỏi đối tượng được ăn; 먹고 싶어요 hỏi mong muốn của người nghe.']],[7,8]);
g('V(으)세요 · V아/어 주세요','Yêu cầu, hướng dẫn và nhờ giúp đỡ lịch sự.','Gốc có 받침 khác ㄹ + 으세요; không có 받침 + 세요; gốc có ㄹ bỏ ㄹ rồi + 세요 (살다 → 사세요). V아/어 + 주세요 dùng để nhờ giúp.',
'(으)세요 dùng khi hướng dẫn hoặc đề nghị người nghe thực hiện. 아/어 주세요 nhấn mạnh nhờ người khác làm điều gì cho mình.',
'Động từ bất quy tắc phải đổi gốc phù hợp: 돕다 → 도우세요; 듣다 → 들으세요. Với 아/어 주세요: 돕다 → 도와주세요, 말하다 → 말해 주세요. Không dùng 돕으세요.',
[['여기에 앉으세요.','Mời bạn ngồi ở đây.','앉다 có 받침 nên nối 으세요; 여기에 chỉ nơi ngồi.'],['천천히 말해 주세요.','Xin hãy nói chậm giúp tôi.','말하다→말해, sau đó thêm 주세요 thành lời nhờ; 천천히 chỉ cách nói.']],[6,8,18]);
g('V(으)ㄹ까요?','Rủ cùng làm hoặc hỏi ý kiến.','Gốc có 받침 + 을까요?; không có 받침 + ㄹ까요?; gốc ㄹ + 까요?',
'Dùng để đề xuất cùng làm việc gì, hoặc hỏi xem mình nên làm gì cho người nghe. Động từ và ngữ cảnh quyết định hai sắc thái này.',
'Khi rủ cùng làm có thể thêm 같이. Phân biệt với 거예요 là thông báo dự định; ㄹ까요? là câu hỏi xin ý kiến.',
[['같이 점심을 먹을까요?','Chúng ta cùng ăn trưa nhé?','먹 có 받침 ㄱ nên dùng 을까요; 같이 cho biết lời rủ làm cùng.'],['창문을 열까요?','Tôi mở cửa sổ nhé?','열 đã kết thúc bằng ㄹ nên không thêm 을; 열 + 까요 là hỏi có nên mở cửa giúp hay không.']],[16,17]);
g('V(으)ㅂ시다','Đề nghị cùng thực hiện một hành động.','Gốc không có 받침 + ㅂ시다; có 받침 + 읍시다; gốc ㄹ bỏ ㄹ rồi + ㅂ시다.',
'Dùng trong lời đề nghị cùng làm của nhóm, thường trang trọng hơn 아/어요 trong hội thoại. Người nói cũng tham gia hành động.',
'Với người lớn tuổi hoặc cần rất lịch sự, lời rủ bằng (으)ㄹ까요? thường mềm hơn. Không dùng mẫu này để yêu cầu chỉ người khác làm.',
[['같이 갑시다.','Chúng ta cùng đi nào.','가 không có 받침, thêm ㅂ시다 thành 갑시다. 같이 nhấn mạnh cùng nhau.'],['여기에서 책을 읽읍시다.','Chúng ta đọc sách ở đây nhé.','읽 có 받침 nên dùng 읍시다; 여기에서 nêu nơi thực hiện hành động đọc.']],[17]);
g('V(으)ㄹ 거예요','Nói kế hoạch hoặc dự định tương lai.','Gốc có 받침 + 을 거예요; không có 받침 + ㄹ 거예요; gốc ㄹ + 거예요.',
'Dùng để nói việc dự định sẽ làm. Cùng mẫu này còn có thể diễn tả phỏng đoán; ở bài này tập trung vào kế hoạch.',
'Viết cách trước 거예요. Phân biệt 갈 거예요 (dự định) với 갈게요 (cam kết hoặc quyết định có liên quan người nghe).',
[['내일 여행을 갈 거예요.','Ngày mai tôi sẽ đi du lịch.','가 + ㄹ 거예요 → 갈 거예요; 내일 xác định thời điểm tương lai.'],['주말에 집에서 쉴 거예요.','Cuối tuần tôi sẽ nghỉ ở nhà.','쉬다 có gốc 쉬, thêm ㄹ 거예요; 집에서 nêu nơi nghỉ.']],[11]);
g('V/A고','Nối hai hành động hoặc hai đặc điểm.','Gốc V/A + 고 + mệnh đề tiếp theo.',
'Dùng để liệt kê hai tính chất hoặc nối các việc. Khi nối hành động, có thể hiểu là thực hiện việc thứ nhất rồi tới việc thứ hai theo ngữ cảnh.',
'Đừng hiểu mọi 고 là quan hệ nguyên nhân. Khi cần nói “vì…nên…” dùng cấu trúc nguyên nhân phù hợp.',
[['음악을 듣고 책을 읽어요.','Tôi nghe nhạc và đọc sách.','듣다 bỏ 다 rồi nối 고 thành 듣고; mệnh đề sau kết thúc bằng đọc sách.'],['이 방은 크고 깨끗해요.','Phòng này rộng và sạch.','크다→크고 nối đặc điểm rộng với 깨끗해요 là sạch; 은 nêu căn phòng làm chủ đề.']],[25],intro);
g('V/A지만','Nối hai ý trái ngược với nghĩa “nhưng”.','Gốc V/A + 지만 + ý đối lập.',
'Dùng khi điều được nói ở vế sau trái với mong đợi từ vế trước. Cả động từ và tính từ đều có thể kết hợp.',
'Thì quá khứ có thể đứng trước 지만: 갔지만. Không chia vế đầu thành dạng 요 rồi thêm 지만.',
[['한국어는 어렵지만 재미있어요.','Tiếng Hàn khó nhưng thú vị.','어렵다 bỏ 다 rồi nối 지만; 재미있어요 nêu đánh giá trái với việc khó.'],['이 옷은 예쁘지만 비싸요.','Bộ quần áo này đẹp nhưng đắt.','예쁘지만 thừa nhận đẹp; 비싸요 đưa ra nhược điểm khiến người mua cân nhắc.']],[28],intro);
g('V/A아/어서','Nêu nguyên nhân hoặc nối hành động liên quan.','Gốc V/A + 아/어서; 하다 → 해서.',
'Trong nghĩa nguyên nhân, vế đầu giải thích vì sao xảy ra vế sau. Cấu trúc còn nối hai việc theo trình tự khi việc trước tạo điều kiện cho việc sau.',
'Ở cách dùng nguyên nhân cơ bản, tránh nối với mệnh lệnh/rủ rê ở vế sau; thường dùng (으)니까 cho kiểu câu đó.',
[['배가 아파서 병원에 가요.','Vì đau bụng nên tôi đi bệnh viện.','아프다→아파서 theo quy tắc rơi ㅡ; vế sau là kết quả đi bệnh viện.'],['친구를 만나서 같이 밥을 먹었어요.','Tôi gặp bạn rồi cùng ăn cơm.','만나서 nối việc gặp với hành động cùng ăn; quá khứ được thể hiện ở 먹었어요 cuối câu.']],[25,26],intro);
g('V/A(으)니까','Nêu lý do làm cơ sở đề nghị hoặc kết luận.','Gốc có 받침 + 으니까; không có 받침 + 니까; gốc ㄹ bỏ ㄹ rồi + 니까.',
'Dùng khi người nói lấy một lý do làm căn cứ cho lời khuyên, đề nghị hoặc quyết định. Vế sau có thể là mệnh lệnh hoặc lời rủ.',
'So với 아/어서, mẫu này phù hợp hơn với lời hướng dẫn. Một số động từ có bất quy tắc khi nối như 춥다→추우니까.',
[['비가 오니까 우산을 가져가세요.','Vì trời mưa nên hãy mang ô theo.','오다→오니까 nêu lý do; 가져가세요 là lời khuyên được xây trên lý do đó.'],['시간이 없으니까 빨리 갑시다.','Vì không có thời gian nên chúng ta đi nhanh nào.','없 có 받침 nên thêm 으니까; 갑시다 là lời rủ cả nhóm đi.']],[26],intro);
g('N(으)로','Nói phương tiện, công cụ hoặc hướng đi.','N có 받침 + 으로; N không có 받침 hoặc kết thúc ㄹ + 로.',
'Dùng với phương tiện đi lại, công cụ thực hiện hành động, nguyên liệu hoặc hướng. Xác định nghĩa qua danh từ và động từ đi cùng.',
'ㄹ là ngoại lệ quan trọng: 지하철로, không phải 지하철으로. Đi bộ thường nói 걸어서.',
[['버스로 회사에 가요.','Tôi đi làm bằng xe buýt.','버스 không có 받침 nên dùng 로 để chỉ phương tiện; 회사에 là đích đến.'],['연필로 이름을 써요.','Tôi viết tên bằng bút chì.','연필 kết thúc ㄹ nên dùng 로; 이름을 là nội dung được viết, 써요 là dạng chia của 쓰다.']],[7],intro);
g('V고 있어요','Diễn tả hành động đang diễn ra.','Gốc động từ + 고 있어요.',
'Dùng để nói một hành động đang tiếp diễn tại thời điểm nói. Trợ từ nơi thực hiện hành động vẫn là 에서.',
'Mẫu tiếp diễn này dùng với động từ hành động. Với 입다, 신다, 쓰다 (đội), dạng 고 있다 còn có thể diễn tả trạng thái đang mặc/mang sau khi hành động hoàn tất; không phải mọi 고 있다 đều là đang thực hiện động tác.',
[['지금 한국어를 공부하고 있어요.','Bây giờ tôi đang học tiếng Hàn.','공부하 + 고 있어요 cho biết việc học đang diễn ra; 지금 nhấn mạnh hiện tại.'],['친구가 도서관에서 책을 읽고 있어요.','Bạn đang đọc sách ở thư viện.','친구가 là chủ ngữ; 도서관에서 là nơi đọc; 읽고 있어요 diễn tả hành động đang tiếp diễn.']],[48],intro);
g('N보다 · 더 · 제일/가장','So sánh hơn và nói mức cao nhất.','N1은/는 N2보다 (더) + V/A; phạm vi + 에서/중에서 제일/가장 + V/A. N2 là mốc so sánh.',
'보다 gắn sau đối tượng làm mốc so sánh. 더 nhấn mạnh “hơn”. 제일 và 가장 diễn tả mức cao nhất trong một phạm vi.',
'Trợ từ 보다 khác động từ 보다 (xem). Nói rõ mốc hoặc phạm vi để người nghe biết đang so sánh với ai/cái gì.',
[['이 가방은 저 가방보다 더 커요.','Cặp này lớn hơn cặp kia.','저 가방보다 là mốc; 더 커요 là mức độ lớn hơn; 이 가방은 là vật đang đánh giá.'],['저는 과일 중에서 사과를 제일 좋아해요.','Trong các loại trái cây, tôi thích táo nhất.','과일 중에서 giới hạn phạm vi; 제일 bổ nghĩa cho 좋아해요 để nói mức yêu thích cao nhất.']],[10,11]);
g('V아/어 봐요','Làm thử để trải nghiệm.','Gốc V + 아/어 보다; 하다 → 해 보다.',
'Dùng khi thử làm một việc để biết kết quả hoặc có trải nghiệm. 보다 trong mẫu này là động từ bổ trợ, không mang nghĩa nhìn/xem thông thường.',
'Có thể chia quá khứ để nói đã thử: 먹어 봤어요. Với lời mời thử có thể dùng 아/어 보세요.',
[['이 음식을 먹어 보세요.','Bạn hãy thử món này.','먹다→먹어 rồi thêm 보세요, thành lời mời lịch sự thử ăn.'],['한국어로 편지를 써 봤어요.','Tôi đã thử viết thư bằng tiếng Hàn.','쓰다→써, 보다 chia quá khứ thành 봤어요; 한국어로 nêu ngôn ngữ dùng để viết.']],[10]);
g('N부터 N까지 · N에서 N까지','Nêu điểm bắt đầu và kết thúc.','Thời gian + 부터 … 까지; địa điểm xuất phát + 에서 … 까지.',
'부터 thường đi với thời gian bắt đầu, 까지 chỉ giới hạn cuối. Với hành trình, 에서 đánh dấu nơi đi từ và 까지 đánh dấu nơi tới.',
'Phân biệt 에 là một thời điểm với 부터…까지 là khoảng thời gian. Có thể dùng riêng 까지 khi chỉ cần nói hạn cuối.',
[['아홉 시부터 여섯 시까지 일해요.','Tôi làm việc từ chín giờ đến sáu giờ.','부터 gắn với giờ bắt đầu; 까지 gắn với giờ kết thúc; 일해요 là công việc trong khoảng đó.'],['집에서 학교까지 걸어요.','Tôi đi bộ từ nhà đến trường.','집에서 là điểm xuất phát, 학교까지 là điểm đến; 걷다 bất quy tắc ㄷ nên chia thành 걸어요.']],[11,12]);
g('V(으)ㄹ 수 있어요 / 없어요','Nói có thể hoặc không thể làm.','Gốc có 받침 + 을 수; không có 받침 + ㄹ 수; gốc ㄹ + 수; sau đó 있다/없다.',
'Dùng cho năng lực hoặc khả năng do hoàn cảnh. 수 viết cách cả phần trước và phần sau. 없다 phủ định khả năng.',
'Không dùng để xin phép một cách máy móc. Khả năng làm khác với được phép làm; xin phép thường dùng 아/어도 돼요?',
[['한국어를 읽을 수 있어요.','Tôi có thể đọc tiếng Hàn.','읽 có 받침 nên dùng 을 수 있어요; 한국어를 là đối tượng đọc.'],['오늘은 갈 수 없어요.','Hôm nay tôi không thể đi được.','가 + ㄹ 수 없어요 cho biết không thể đi; chưa xác định là thiếu năng lực hay do hoàn cảnh nếu không có ngữ cảnh thêm.']],[53],intro);
g('V(으)러 가요 · V(으)려고 해요','Nói mục đích đi và ý định làm.','V có 받침 + 으러/으려고; không có 받침 + 러/려고; gốc ㄹ + 러/려고.',
'(으)러 đi với động từ di chuyển như 가다/오다 để nói đi đâu làm gì. (으)려고 하다 nói dự định thực hiện một hành động.',
'Không dùng (으)러 với mọi động từ cuối câu; nó cần bối cảnh di chuyển. So sánh 먹으러 가요 (đi ăn) và 먹으려고 해요 (định ăn).',
[['친구를 만나러 가요.','Tôi đi gặp bạn.','만나다 không có 받침 nên thêm 러; 가요 biểu thị di chuyển với mục đích gặp bạn.'],['주말에 한국어를 복습하려고 해요.','Cuối tuần tôi định ôn tiếng Hàn.','복습하다 có gốc 복습하, thêm 려고 해요 để nói ý định; 주말에 chỉ thời điểm dự định thực hiện.']],[27,28],intro);
// Page numbers refer to the actual PDF page, verified against the extracted source.
const correctedPages={16:[6,8,19],19:[12],26:[12],27:[11],28:[13],30:[27]};
for(const lesson of lessons)if(correctedPages[lesson.id])lesson.pages=correctedPages[lesson.id];
fs.writeFileSync('src/data/study-grammar.json',JSON.stringify(lessons,null,2));
console.log('Created',lessons.length,'grammar lessons with',lessons.reduce((n,g)=>n+g.examples.length,0),'explained examples.');

