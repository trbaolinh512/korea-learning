# Thẻ ghi nhớ, luyện ngữ pháp và bảng viết

Ngày cập nhật: 17/11/2026.

## 1. Phiên âm Latin trên thẻ

Đã thêm phiên âm bên cạnh nghĩa khi lật thẻ từ vựng của lộ trình 60 ngày. Bộ dữ liệu gồm 504 từ khác nhau, xuất hiện thành 600 lượt từ theo ngày. Thẻ có liên kết mở Papago với từ cần tra.

Theo lựa chọn bổ sung của người dùng, bản này dùng Revised Romanization (RR) trước. Không gắn nhãn dữ liệu Papago: trang Papago tải được HTML nhưng nhiều tệp JavaScript trả lỗi kết nối trong môi trường nghiên cứu, nên chưa thu được kết quả để đối chiếu toàn bộ từ.

Phiên âm tạo bằng `koroman@1.0.16`, áp dụng các quy tắc phát âm của thư viện, chữ thường để hỗ trợ đọc. Nguyên tắc tham khảo là [quy tắc Romanization của Viện Quốc ngữ Hàn Quốc](https://www.korean.go.kr/front_eng/roman/roman_01.do). Các quy tắc có ngoại lệ và phụ thuộc ranh giới từ; đầu ra thư viện không được coi là kết quả tra từ điển đã xác minh.

Đã hiệu chỉnh bảy trường hợp trong bộ hiện tại: 월요일, 목요일, 일요일, 백화점, 맛없다, 따뜻하다, 깨끗하다. Đối chiếu thêm cặp 맛있다/맛없다 trong [bài học của KBS](https://world.kbs.co.kr/service/mobile/learn_korean/learn_korean_detail.htm?lang=e&no=6). Phiên âm RR không biểu diễn mọi chi tiết âm học; vẫn giữ nút nghe tiếng Hàn.

- Dữ liệu: `src/data/word-romanization.json`, có `verifiedWithPapago: false`.
- Tạo lại: `npm run data:romanization`.
- Khi thay đổi hoặc bổ sung từ vựng, chạy lại lệnh này trước khi build.
- Thư viện chỉ dùng để tạo dữ liệu; ứng dụng đọc JSON, không gọi API dịch trong lúc lật thẻ.

## 2. Luyện ngữ pháp đa dạng

Vào **Luyện TOPIK → Ngữ pháp → Luyện tập ngữ pháp**.

- Hiển thị nghĩa tiếng Việt và cấu trúc gợi ý; người học nhập câu tiếng Hàn rồi nhấn Enter hoặc Kiểm tra câu.
- Câu mẫu được ẩn trong chế độ luyện tập cho tới khi kiểm tra hoặc bấm xem mẫu.
- Dùng ngân hàng mới 1.160 câu; mỗi ngày học có 12–28 câu. Có Tổng hợp, Trắc nghiệm, Ghép câu, Gõ dạng chia và Gõ cả câu. Chi tiết cập nhật: CAP_NHAT_LUYEN_NGU_PHAP_DA_DANG.md.
- Ngày 15 ôn ngày 1–14; ngày 30 ôn 16–29; ngày 45 ôn 31–44; ngày 60 ôn các câu đã học, gồm ví dụ mới của ngày 56–59.
- Lặp vô hạn, xáo hết bộ rồi tạo vòng tiếp theo; câu sai được ưu tiên ôn sau bốn câu xen kẽ và đảo lựa chọn.
- Mặc định tự chuyển sau 1 giây khi đúng, sai hoặc xem câu mẫu. Răng cưa cho chỉnh thời gian; đặt 0 để chuyển thủ công. Nút Câu tiếp mặc định ẩn.
- Bỏ qua dấu câu, chuẩn hóa Unicode và khoảng trắng thừa; không xóa hết khoảng cách giữa các từ.
- Không nộp đáp án trong lúc IME đang ghép âm tiết, tránh Enter kết thúc ghép chữ bị tính thành nộp câu.

**Giới hạn chấm:** đây là đối chiếu với câu mẫu, không phải AI đánh giá mọi cách dịch đúng. Khi không khớp, giao diện ghi “Chưa khớp câu mẫu”. Các cách dịch khác có thể đúng ngữ pháp nhưng chưa nằm trong danh sách chấp nhận. Thống kê đúng/tổng hiện thuộc lượt luyện đang mở.

Các phần chính: `src/GrammarTypingQuiz.tsx`, `src/grammarPractice.ts`, `src/data/grammar-drills.json`.

## 3. Bảng luyện viết dùng chung

Áp dụng cho cả chữ Hàn và từ vựng TOPIK. Theo yêu cầu cập nhật, đã bỏ phóng to/thu nhỏ, mở rộng và di chuyển bảng; khôi phục kích thước hiển thị theo bố cục cũ.

| Tính năng | Hoạt động |
| --- | --- |
| Bút | Vẽ bằng chuột, ngón tay hoặc bút cảm ứng. |
| Tẩy nét | Xóa trọn nét bị chạm; kéo tẩy có thể xóa nhiều nét trong một thao tác. Không phải tẩy từng pixel trên ảnh. |
| Hoàn tác | Khôi phục thao tác vẽ, tẩy hoặc xóa bảng gần nhất; giữ tối đa 50 bước. |
| Xóa bảng | Xóa tất cả nét; có thể hoàn tác. |
| Canvas sắc nét | Dùng mật độ điểm ảnh thiết bị, tối đa DPR 3; tọa độ nhận diện vẫn dùng hệ tọa độ gốc. |

Chỉ gọi nhận diện khi bấm **Kiểm tra**. Khi viết đúng, tiếp tục tự chuyển theo thời gian đã cài, với bảng hiển thị cố định như trước. Khi đổi câu, lịch sử nét của câu cũ được xóa.

## 4. Nghiên cứu và cải thiện nhận diện

Hệ thống hiện dùng Google Input Tools, xử lý các nét vẽ và trả về danh sách ứng viên. Cách dùng cơ bản của dịch vụ là viết rồi chọn ứng viên; ứng dụng dùng các ứng viên để đối chiếu với bài tập. [Tài liệu Google Input Tools](https://www.google.com/inputtools/services/features/handwriting.html)

Đã triển khai:

1. Gửi nét gốc trước để giữ thông tin người học viết.
2. Nếu các ứng viên chưa khớp, thử lại với cùng nét được đưa vào giữa và co giãn đồng đều trong vùng nhận diện, có khoảng đệm; không bóp méo tỷ lệ.
3. Không gửi đáp án cần học vào dịch vụ để gợi sẵn kết quả.
4. Đối chiếu đầy đủ từ; chữ cái dùng chuẩn hóa Unicode để nhận được các dạng jamo tương đương. Bỏ phép kiểm tra chỉ cần đáp án là một chuỗi con của ứng viên đối với chữ cái.
5. Hiển thị tối đa năm ứng viên khi chưa đúng để người học biết máy đang đọc gì.
6. Hủy yêu cầu và bỏ phản hồi cũ khi người học vẽ, tẩy, hoàn tác, xóa hoặc chuyển bài.
7. Hai lượt nhận diện dùng chung giới hạn chờ 15 giây; chỉ thành công mới tự chuyển.

**Không khẳng định mức tăng độ chính xác.** Chuẩn hóa đầu vào và kiểm tra chặt hơn giúp xử lý một số tình huống, nhưng không thay đổi mô hình của nhà cung cấp. Đã thử trực tiếp nét mẫu tổng hợp của ㅏ: dịch vụ trả HTTP 200 và danh sách có ㅏ. Đây là kiểm tra kết nối và một trường hợp hoạt động, không phải bộ đánh giá chất lượng trên nhiều người viết.

Một hướng thay thế là ML Kit Digital Ink Recognition: nhận chuỗi nét và có thể chạy trên thiết bị Android/iOS. Tài liệu hiện nêu hai nền tảng này; không thể thay trực tiếp bằng một SDK JavaScript tương đương trong web hiện tại. Nếu phát triển bản ứng dụng di động, có thể nghiên cứu hướng này riêng và đo trên cùng bộ mẫu. [Tài liệu Google ML Kit](https://developers.google.com/ml-kit/vision/digital-ink-recognition)

Để chọn mô hình tốt hơn, cần bộ nét thực tế có đáp án chuẩn, bao gồm chữ cái, âm tiết, từ dài, chữ viết nhỏ/lệch và nhiều người viết. Đo cả tỷ lệ nhận đúng lẫn tỷ lệ nhận nhầm là đúng; không chỉ nhìn một vài kết quả đẹp.

## 5. Kiểm tra

- `npm test`: 23 kiểm tra dữ liệu/thuật toán.
- `npm run test:practice`: giao diện phiên âm, IME, đúng/sai và cài đặt chuyển câu, bài bất quy tắc; tẩy/hoàn tác/xóa; thử lại với nét chuẩn hóa; loại phản hồi cũ.
- Kiểm tra chuột và cảm ứng mô phỏng DPR 3; giao diện 440/320 px.
- Luồng học hiện có: `node scripts/study.mjs` và `node scripts/alphabet.mjs`.
- Responsive: `node scripts/responsive.mjs iphone-17-pro-max desktop`.
- Nhận diện trực tiếp một mẫu: `node scripts/recognition-live.mjs`.
- `npm run build`: TypeScript và bản triển khai Vite.

Các kiểm tra giao diện dùng phản hồi nhận diện giả lập để kiểm tra luồng một cách ổn định. Kết quả nhận diện trực tiếp được phân biệt riêng ở trên. Chưa kiểm tra trên iPhone/Safari thật.

Khi triển khai, cập nhật nội dung `dist` sau khi build. Không cần đưa `documents` lên hosting.
