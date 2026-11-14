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
- TOPIK I: 60 ngày / 30 chủ đề; 10 từ/ngày, tổng 600 lượt từ (504 từ khác nhau, có ôn lại theo chủ đề). Ngữ pháp học theo 4 giai đoạn, mỗi ngày có nội dung riêng; ngày 15/30/45/60 ôn tập. Có 104 ví dụ câu kèm bản dịch và phân tích, thêm các ví dụ biến đổi từ ở ngày 56–59. Từ vựng và ngữ pháp không kèm quiz; không có tab Kết quả. Có nút ẩn/hiện lộ trình và lưu lựa chọn này. Luyện viết dùng canvas + nhận diện AI khi bấm Kiểm tra, đúng cả từ mới tự chuyển. Nghe/đọc chạy vô hạn theo từ của ngày, xáo hết bộ rồi tạo vòng mới; Đọc ngẫu nhiên Hàn→Việt hoặc Việt→Hàn; đáp án 2×2; đúng/sai/hết giờ tự chuyển 1 giây, có cài đặt thời gian và bật nút Câu tiếp.
- Thi thử: 10/35/70 câu, đồng hồ 20/50/100 phút, chọn lại đáp án, chuyển câu, đánh dấu câu cần xem lại, tự nộp khi hết giờ, xác nhận nộp sớm, chấm điểm và giải thích từng câu.
- Lưu tiến độ và bài thi vào localStorage, tiếp tục khi tải lại trang, xuất/nhập JSON, giao diện mặc định tối (giữ lựa chọn sáng/tối đã lưu) và hỗ trợ màn hình nhỏ.

## Dữ liệu và giới hạn

`index.html` gốc chứa **Hangul (chữ Hàn)**, không có dữ liệu **Hanja (chữ Hán)**, nên mục đầu được đặt tên “Luyện chữ Hàn”. Muốn có Hanja cần bổ sung bộ chữ, âm Hán Hàn và nghĩa tương ứng.

Toàn bộ dữ liệu học được tách thành JSON trong `src/data`. Chạy `node scripts/extract-data.mjs` để tách lại từ bản gốc. Không chạy script hay chèn HTML của file gốc vào ứng dụng; các màn hình là component React.

Lộ trình đang hiển thị dùng `study-curriculum.json` (từ vựng) và `grammar-roadmap.json` (ngữ pháp theo ngày), tham khảo tài liệu sơ cấp và từ vựng TOPIK I trong `documents/`. Nguồn ngữ pháp mới là lộ trình Markdown do bạn cung cấp; nội dung được hiệu chỉnh và bổ sung phân tích. Nguồn từ vựng vẫn lấy từ tài liệu TOPIK I trong documents/. Dữ liệu ngữ pháp 30 chủ điểm trước đây được giữ để đối chiếu.

Để tái tạo dữ liệu từ vựng và bộ ngữ pháp cũ: chạy `scripts/read-sources.py` với Python có `pypdf` và `pdfplumber`, rồi `node scripts/enrich-meanings.mjs`, `node scripts/build-study-grammar.mjs`, `node scripts/build-study.mjs`. Bản trích xuất tạm nằm trong `tmp/sources/`; giữ nguyên tài liệu gốc. Các từ ôn lại có thể có nghĩa khác theo ngữ cảnh (ví dụ 배); bộ kiểm tra xác nhận các trường hợp này.

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
node scripts/grammar-roadmap.mjs
```

Ảnh kiểm tra lưu trong `test-results/` (không đưa vào Git).





## Rà soát nội dung

Xem CONTENT_REVIEW.md để biết phạm vi rà soát, lỗi đã sửa, nguồn đối chiếu và giới hạn kiểm tra. Script extract-data.mjs áp dụng content-corrections.mjs sau khi đọc bản gốc; không ghi đè mất các hiệu chỉnh thẻ/quiz/thi thử.


## Lộ trình ngữ pháp 60 ngày mới

Nguồn được lưu nguyên văn tại `references/grammar-roadmap-60-days.md`. Chạy `node scripts/build-grammar-roadmap.mjs` để tái tạo `src/data/grammar-roadmap.json` cùng các hiệu chỉnh kiến thức. Dữ liệu ngữ pháp 30 chủ điểm cũ chỉ còn để đối chiếu; UI chọn bài mới trực tiếp theo số ngày, độc lập với chủ đề từ vựng.

Chạy `node scripts/export-grammar-content.mjs` để xuất toàn bộ nội dung mới thành `TOAN_BO_NOI_DUNG_NGU_PHAP.md`. Chi tiết thay đổi: `THAY_DOI_LO_TRINH_NGU_PHAP.md`.

## Luyện gõ tiếng Hàn

Mở Chữ Hàn → Luyện gõ tiếng Hàn. Mục mới được viết bằng React/TypeScript, dùng 20 câu và bảng phím 2-Set từ references/korean-typing-v6.html. Giữ cách chọn câu ngẫu nhiên tránh lặp liền trước, màu đúng/sai/đang ghép, gợi ý mặc định tắt, ẩn/hiện bàn phím và tự đổi sau 300 ms khi nhập đúng toàn bộ câu. Theme dùng chung với web.

Lưu ý về bản gốc: convertQwertyToHangul được khai báo nhưng handleTypingInput không gọi hàm đó. Bản tích hợp giữ nguyên hành vi này, cần nhập bằng bàn phím/IME tiếng Hàn; không quảng cáo tự chuyển QWERTY khi chức năng đó chưa được nối vào luồng nhập. Hàm chuyển đổi vẫn được giữ nguyên để đối chiếu.

Tái nhập dữ liệu và thuật toán: node scripts/import-typing.mjs. Kiểm tra đối chiếu hành vi với HTML gốc: node scripts/typing.mjs. Các bộ thử trong npm test kiểm tra dữ liệu và thuật toán chuyển/giải mã so với bản gốc.
Hiệu chỉnh hiển thị nhỏ: bản HTML thiếu class key-btn trên Space nên có thể giữ màu gợi ý cũ. Bản React xóa màu khi Space không còn là phím cần gõ; cách tính phím gợi ý giữ nguyên.

## Responsive cho điện thoại

Mốc thiết kế/kiểm thử: iPhone 17 Pro Max, khung 440 × 956 CSS px, DPR 3; đây là cấu hình mô phỏng, không khóa chiều rộng trang. Thông số phần cứng tham khảo: [Apple](https://support.apple.com/en-us/125091) (1320 × 2868 pixel; chia DPR 3 để chọn khung CSS). Các mốc bổ sung: 390, 375, 320 px, ngang 956 × 440, tablet 768 và desktop 1440 px.

Quy tắc trong src/responsive.css: điều hướng đáy màn hình cho điện thoại; safe-area cho tai thỏ/home indicator; chữ nội dung lớn hơn; nút chính tối thiểu cao 44 px; ô nhập tối thiểu 16 px để tránh tự zoom trên iOS; thẻ hai cột; đáp án quiz 2×2; tab dễ chạm; bảng chọn ngày/câu hỏi cuộn trong vùng riêng; dialog dùng chiều cao động dvh. Luyện viết giữ touch-action:none để vẽ mà không kéo trang. Trang vẫn cho phép người dùng phóng to.

Chạy npm run test:responsive khi Vite đang phục vụ tại 127.0.0.1:5173. Kiểm tra 17–18 trạng thái cho từng kích thước, tràn ngang, vị trí các nút, điều hướng, lưới đáp án, dialog và thao tác vẽ cảm ứng. Ảnh iPhone nằm trong test-results/responsive/. Có thể chạy một cấu hình riêng: node scripts/responsive.mjs iphone-17-pro-max.

Phạm vi xác minh: Chromium/Chrome với viewport và cảm ứng mô phỏng. Môi trường hiện tại không có WebKit; chưa kiểm tra trực tiếp Safari hoặc bàn phím ảo trên iPhone thật.
