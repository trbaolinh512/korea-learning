# Cập nhật luyện ngữ pháp đa dạng

## Phạm vi áp dụng tài liệu

Đã đọc và lưu nguyên văn tài liệu người dùng tại `references/grammar-practice-method.md`. Áp dụng thiết kế nhiều dạng bài, tạo câu bằng khung có kiểm soát và ôn lại câu sai có khoảng cách.

Phần tài liệu nói ứng dụng lấy hai mẫu mỗi ngày từ 120 ngữ pháp là mô tả của phiên bản cũ. Ứng dụng hiện có bài ngữ pháp riêng cho 60 ngày. Lần cập nhật này giữ lịch bài học hiện tại, không thay bằng lịch 120 mẫu hoặc đưa thêm cấu trúc trung cấp.

Không nhập nguyên ví dụ có nhiều cách giải đúng vào trắc nghiệm một đáp án. Dạng điền câu có nghĩa tiếng Việt hoặc ngữ cảnh hội thoại làm căn cứ; dạng hình thái yêu cầu đúng cấu trúc đang học. Các phương án nhiễu được tách riêng khỏi câu mẫu đúng.

## Ngân hàng câu

- Trước: hầu hết ngày chỉ có hai câu ví dụ dùng lại trong vòng luyện.
- Hiện tại: **1.160 câu tiếng Hàn khác nhau**, mỗi ngày học **12–28 câu**.
- Câu ví dụ trong phần Bài học được giữ riêng; ngân hàng luyện tập mới nằm tại `src/data/grammar-drills.json`.
- Các câu được tạo từ khung và cặp từ/ngữ cảnh xác định trước. Không ghép tùy ý mọi danh từ và động từ trong danh sách từ của ngày, vì có thể tạo câu không tự nhiên hoặc sai vai trò ngữ pháp.
- Các dạng chia quan trọng được khai báo rõ, gồm đọc/nghe, lược ㄹ, ㅡ, nhóm ㅂ/ㄷ/르 và từ chia thường. Bộ kiểm tra có đối chiếu các trường hợp 보려고, 들으려고, 만드는 để tránh suy diễn máy móc từ dạng tương lai.

Ngày ôn tập dùng lại ngân hàng của giai đoạn:

| Ngày ôn | Phạm vi | Số câu |
| --- | --- | --- |
| 15 | Ngày 1–14 | 340 |
| 30 | Ngày 16–29 | 300 |
| 45 | Ngày 31–44 | 276 |
| 60 | Các bài ngày 1–59 | 1.160 |

## Các chế độ

Người học chọn **Tổng hợp**, **Trắc nghiệm**, **Ghép câu**, **Gõ dạng chia**, hoặc **Gõ cả câu**. Đổi chế độ bắt đầu lượt mới; cài đặt thời gian tự chuyển vẫn được giữ.

Các dạng câu hỏi trong phần tổng hợp:

1. Hàn → chọn nghĩa Việt.
2. Chọn dạng từ/tiểu từ đúng.
3. Điền vào câu hoặc hội thoại ngắn theo nghĩa/ngữ cảnh đã cho.
4. Phân biệt chức năng cấu trúc trong câu cụ thể.
5. Bấm thẻ để ghép lại câu mẫu.
6. Gõ phần còn thiếu bằng dạng chia đúng.

Gõ cả câu vẫn có thể chọn riêng, không bị loại bỏ.

Phân bổ lượt mới theo mỗi chu kỳ 10 câu, áp dụng bảng tỷ lệ bài tập trong tài liệu:

| Ngày | Trắc nghiệm | Ghép/chia từ |
| --- | --- | --- |
| 1–15 | 80% | 20% |
| 16–35 | 60% | 40% |
| 36–50 | 70% | 30% |
| 51–60 | 100% | 0% |

Đây là tỷ lệ khi chọn Tổng hợp; chế độ riêng có thể luyện ghép/gõ ở bất kỳ ngày nào. Các câu ôn sai được ưu tiên riêng và có thể làm tỷ lệ quan sát được khác tỷ lệ lượt mới.

Ngày 51–59 vẫn luyện chủ điểm đang học theo lộ trình hiện tại. Ngày 60 mới lấy toàn bộ ngân hàng để tổng ôn; không biến các ngày còn học cấu trúc mới thành lượt ôn ngẫu nhiên không còn trọng tâm.

## Vòng luyện và ôn sai

- Xáo bộ câu của ngày, dùng câu mới trước khi tạo vòng tiếp theo. Tránh các câu vừa xuất hiện khi bắt đầu vòng mới.
- Một câu có thể được dùng dưới nhiều dạng bài trong các vòng khác nhau. Việc đổi dạng không được tính thành một câu tiếng Hàn mới trong thống kê 1.160 câu.
- Câu làm sai hoặc bấm xem đáp án được đưa vào hàng chờ.
- Sau bốn câu xen kẽ, câu đó trở lại để ôn; giữ dạng bài đã sai, đảo lại lựa chọn hoặc mảnh ghép.
- Trả lời đúng câu ôn thì bỏ khỏi hàng chờ; sai tiếp thì lên lịch lại.
- Hàng chờ và thống kê thuộc lượt luyện đang mở, chưa đồng bộ giữa thiết bị.
- Đúng/sai/xem đáp án đều tự chuyển theo số giây đã cài. Đặt 0 để chuyển thủ công. Nút Câu tiếp mặc định vẫn ẩn.

## Cách chấm

Trắc nghiệm có bốn phương án theo bố cục 2 × 2. Ghép/gõ đối chiếu với câu mẫu, chuẩn hóa Unicode, bỏ khác biệt dấu câu và khoảng trắng thừa; vẫn giữ khoảng cách giữa các từ. Enter đang ghép chữ bằng IME không bị tính là nộp đáp án.

Tiếng Hàn có thể có nhiều thứ tự từ hoặc cách dịch đúng. Bài ghép/gõ hiện chấm theo mẫu được yêu cầu và ghi “Chưa khớp đáp án mẫu”, không khẳng định mọi cách diễn đạt khác đều sai ngữ pháp.

Đây là bài tự luyện sơ cấp, không phải ngân hàng đề thi chính thức. Kiểm tra dữ liệu/phần mềm không thay thế việc biên tập ngôn ngữ cho mọi cách diễn đạt có thể có.

## Mã nguồn và kiểm tra

| Tệp | Vai trò |
| --- | --- |
| `scripts/build-grammar-drills.mjs` | Khung câu, từ và dạng chia; tạo ngân hàng |
| `src/data/grammar-drills.json` | Dữ liệu bài tập đang dùng |
| `src/grammarPractice.ts` | Phân bổ dạng câu, xáo bộ và lịch ôn sai |
| `src/GrammarTypingQuiz.tsx` | Chọn đáp án, ghép thẻ, nhập chữ, phản hồi |
| `src/GrammarLesson.tsx` | Mở bài luyện khi cần; phần luyện được tải riêng |
| `scripts/grammar-diversity.mjs` | Kiểm tra luồng đa dạng, ôn sai và mobile |

Chạy lại:

```sh
npm run data:grammar-practice
npm test
npm run build
```

Với Vite tại `127.0.0.1:5173`:

```sh
npm run test:grammar
npm run test:practice
```

Đã kiểm tra 23 mục dữ liệu/thuật toán; các luồng tổng hợp theo giai đoạn, trắc nghiệm/ghép/chia/gõ, câu sai trở lại sau bốn câu, đảo lựa chọn và bố cục 440/320 px. Luồng luyện viết vẫn giữ bảng cố định theo yêu cầu trước, không có lại chức năng phóng to/thu nhỏ.
