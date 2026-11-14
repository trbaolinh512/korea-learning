# Hangeul · Học tiếng Hàn & TOPIK I

Frontend **React 19 + TypeScript + Vite**, phát triển từ `index.html` và `TOPIK_I_60_ngay_v5.html`. Hai bản gốc được giữ trong `references/`; file TOPIK ở thư mục gốc cũng được giữ nguyên.

## Chạy ứng dụng

Yêu cầu Node.js 22 trở lên.

```sh
npm install
npm run dev
```

Mở địa chỉ Vite hiển thị, mặc định http://localhost:5173. Build triển khai tĩnh:

```sh
npm run build
npm run preview
```

Đưa thư mục `dist/` lên dịch vụ static hosting. Điều hướng dùng hash (`/#hangul`, `/#study`, `/#exam`), không cần cấu hình rewrite route.

## Chức năng

- Trang đầu chọn ba mục: luyện chữ Hàn, luyện thi TOPIK I, thi thử TOPIK I.
- Bảng chữ cái: 21 nguyên âm, 19 phụ âm, 7 nhóm batchim; lật thẻ, hiện/ẩn tất cả, xáo trộn, nghe, đánh dấu thuộc, lọc chưa thuộc, bấm thẻ để đọc ngay; quiz vô hạn theo bộ câu hỏi gốc, đúng/sai/hết giờ đều tự chuyển sau 1 giây. Luyện viết chọn tất cả/nguyên âm/phụ âm, chỉ nhận diện khi bấm Kiểm tra và chuyển sau 1 giây khi đúng. Cài đặt thời gian và bật/tắt Câu tiếp (mặc định ẩn).
- TOPIK I: 60 ngày / 30 chủ đề; 10 từ/ngày, tổng 600 lượt từ (504 từ khác nhau, có ôn lại theo chủ đề). Mỗi chủ điểm ngữ pháp học trong 2 ngày với công thức, cách dùng, lưu ý, 2 ví dụ có bản dịch và phân tích. Từ vựng và ngữ pháp không kèm quiz; không có tab Kết quả. Có nút ẩn/hiện lộ trình và lưu lựa chọn này. Luyện viết dùng canvas + nhận diện AI khi bấm Kiểm tra, đúng cả từ mới tự chuyển. Nghe/đọc chạy vô hạn theo từ của ngày, xáo hết bộ rồi tạo vòng mới; Đọc ngẫu nhiên Hàn→Việt hoặc Việt→Hàn; đáp án 2×2; đúng/sai/hết giờ tự chuyển 1 giây, có cài đặt thời gian và bật nút Câu tiếp.
- Thi thử: 10/35/70 câu, đồng hồ 20/50/100 phút, chọn lại đáp án, chuyển câu, đánh dấu câu cần xem lại, tự nộp khi hết giờ, xác nhận nộp sớm, chấm điểm và giải thích từng câu.
- Lưu tiến độ và bài thi vào localStorage, tiếp tục khi tải lại trang, xuất/nhập JSON, giao diện sáng/tối và hỗ trợ màn hình nhỏ.

## Dữ liệu và giới hạn

`index.html` gốc chứa **Hangul (chữ Hàn)**, không có dữ liệu **Hanja (chữ Hán)**, nên mục đầu được đặt tên “Luyện chữ Hàn”. Muốn có Hanja cần bổ sung bộ chữ, âm Hán Hàn và nghĩa tương ứng.

Toàn bộ dữ liệu học được tách thành JSON trong `src/data`. Chạy `node scripts/extract-data.mjs` để tách lại từ bản gốc. Không chạy script hay chèn HTML của file gốc vào ứng dụng; các màn hình là component React.

Lộ trình đang hiển thị dùng `study-curriculum.json` và `study-grammar.json`, tham khảo tài liệu sơ cấp và từ vựng TOPIK I trong `documents/`. Nguồn ngữ pháp chính là “42 CẤU TRÚC NGỮ PHÁP TIẾNG HÀN CƠ BẢN” và “NGU PHAP TIENG HAN SO CAP”; nguồn từ vựng gồm “TOPIK I - 1000 TU VUNG”, hai danh sách TOPIK I KOREAN/ENGLISH và “TỪ VỰNG THEO CHỦ ĐỀ”. Nghĩa Việt được biên tập lại, sửa lỗi đánh máy và chọn nghĩa theo chủ đề; ví dụ và phần phân tích ngữ pháp được biên soạn để giải thích cách dùng. Không đưa toàn bộ tài liệu TOPIK II/chuyên ngành vào lộ trình sơ cấp.

Để tái tạo dữ liệu: chạy `scripts/read-sources.py` với Python có `pypdf` và `pdfplumber`, rồi `node scripts/enrich-meanings.mjs`, `node scripts/build-study-grammar.mjs`, `node scripts/build-study.mjs`. Bản trích xuất tạm nằm trong `tmp/sources/`; giữ nguyên tài liệu gốc. Các từ ôn lại có thể có nghĩa khác theo ngữ cảnh (ví dụ 배); bộ kiểm tra xác nhận các trường hợp này.

Ngân hàng gốc có 49 câu thi tự soạn. Câu thông báo thư viện từng có hai lựa chọn cùng đúng đã được viết lại, và toàn bộ 49 câu hiện được dùng để luyện. Bài 70 câu có tái sử dụng câu nguồn; đây là mô phỏng luyện tập, không phải đề chính thức. Điểm nghe và đọc được quy đổi đều về 100 mỗi phần, không dùng trọng số của đề thi thật. Lộ trình học mới chọn nội dung sơ cấp từ tài liệu trong documents/; bộ ngữ pháp HTML cũ được giữ để đối chiếu nhưng không còn là lộ trình đang hiển thị.

Phát âm dùng Web Speech API, cần giọng Korean của trình duyệt/hệ điều hành. Không có audio thi thật. Font web dùng Google Fonts và có font hệ thống dự phòng. Nhận diện luyện viết dùng Google Input Tools qua endpoint như HTML gốc: tọa độ nét được gửi chỉ khi nhấn Kiểm tra; cần Internet. Đây là nhận diện chữ theo các ứng viên dịch vụ trả về, không phải chấm thứ tự nét. Mục hướng dẫn nét đã được bỏ. Không có backend hay đồng bộ tài khoản; dữ liệu nằm trên trình duyệt, có thể sao lưu bằng tệp JSON.

## Cấu trúc chính

```text
src/App.tsx          Trang chủ, điều hướng, theme, sao lưu tiến độ
src/Hangul.tsx       Ba mục học bảng chữ cái, trắc nghiệm, luyện viết
src/Study.tsx        Lộ trình TOPIK 60 ngày
src/Exam.tsx         Thi thử, đồng hồ, chấm và xem lại
src/components.tsx   Flashcards và Speaker dùng chung
src/WordQuiz.tsx     Nghe/đọc vô hạn theo từ của ngày
src/AlphabetWriting.tsx  Bảng viết và nhận diện dùng chung cho chữ/từ
src/lib.ts           Shuffle, tạo câu hỏi, lưu trữ, tính điểm
src/data/            Dữ liệu chuyển từ hai HTML gốc
src/styles.css       Giao diện responsive, sáng/tối
```

## Kiểm tra

```sh
npm test
npm run build
```

Kiểm tra luồng bằng Playwright, dùng Chrome đã cài và Vite đang chạy tại `127.0.0.1:5173`:

```sh
node scripts/smoke.mjs
node scripts/edge-cases.mjs
node scripts/alphabet.mjs
node scripts/study.mjs
node scripts/content.mjs
```

Ảnh kiểm tra lưu trong `test-results/` (không đưa vào Git).





## Rà soát nội dung

Xem CONTENT_REVIEW.md để biết phạm vi rà soát, lỗi đã sửa, nguồn đối chiếu và giới hạn kiểm tra. Script extract-data.mjs áp dụng content-corrections.mjs sau khi đọc bản gốc; không ghi đè mất các hiệu chỉnh thẻ/quiz/thi thử.

