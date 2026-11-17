# 🎯 Đề Xuất Lộ Trình & Thiết Kế Hệ Thống Luyện Ngữ Pháp TOPIK I

Để phần luyện tập ngữ pháp trong ứng dụng **TOPIK I 60 ngày** đạt hiệu quả ghi nhớ sâu, bám sát đề thi thật và duy trì hứng thú luyện tập vô hạn, chúng ta không nên chỉ dừng lại ở dạng bài *dịch câu đơn thuần* (chọn nghĩa Việt - Hàn).

Dưới đây là đề xuất lộ trình nâng cấp theo **4 cấp độ tư duy** và cấu trúc bài tập chuẩn sư phạm.

---

## 1. Nên chọn "Trắc nghiệm chọn đáp án" hay "Hoàn thiện câu"?

Câu trả lời tối ưu nhất là **kết hợp cả hai theo tỷ lệ 70% Trắc nghiệm phân hóa - 30% Hoàn thiện/Sắp xếp câu**. Mỗi dạng bài giải quyết một mục tiêu khác nhau trong kỳ thi TOPIK I:

### A. Dạng 1: Trắc nghiệm chọn đáp án (Multiple Choice - 70%)
* **Mục tiêu:** Rèn phản xạ nhanh, phân biệt sắc thái ngữ pháp dễ nhầm lẫn và quy tắc chia đuôi câu (biến âm, bất quy tắc, có/không có *받침*).
* **Cách thiết kế chuẩn (Thay vì chỉ dịch nghĩa):**
  * **Kiểu 1 - Điền khuyết ngữ cảnh (Bám sát câu 31–33 đề Đọc TOPIK I):** Cho một đoạn hội thoại ngắn (A - B) hoặc câu có ngữ cảnh rõ ràng, đục lỗ ở vị trí ngữ pháp.
    * *Ví dụ:* `가: 주말에 뭐 할 거예요?` / `나: 친구를 (      ) 영화를 볼 거예요.`
    * *Đáp án:* ① 만나고 (Đúng) | ② 만나지만 | ③ 만나서 | ④ 만나거나
  * **Kiểu 2 - Bẫy chia hình thái (Morphology Trap):** Kiểm tra khả năng gắn đuôi từ (ví dụ: phân biệt `은/는`, `이/가`, `을/를`, hoặc `-(으)면` vs `-면`).
    * *Ví dụ:* `시간이 (      ) 같이 밥을 먹어요.` (Gốc: 있다)
    * *Đáp án:* ① 있으면 (Đúng) | ② 있면 | ③ 있어면 | ④ 있는면

### B. Dạng 2: Hoàn thiện & Ghép câu (Sentence Completion - 30%)
* **Mục tiêu:** Ép não bộ chuyển từ *nhận diện thụ động* sang *sản xuất chủ động*, giúp nhớ mặt chữ và trật tự từ tiếng Hàn (S - O - V).
* **Cách thiết kế chuẩn trên Web App (Thân thiện với cả điện thoại lẫn máy tính):**
  * **Kiểu 1 - Sắp xếp thẻ từ (Word Ordering / Tap-to-build):** Thay vì bắt người dùng gõ bàn phím tiếng Hàn (dễ gây nản nếu chưa quen bộ gõ hoặc sai lỗi chính tả nhỏ), hãy cung cấp 4–5 mảnh ghép từ xáo trộn để người học bấm chọn theo đúng thứ tự.
    * *Đề bài:* "Vì trời mưa nên tôi ở nhà."
    * *Các thẻ từ:* `[ 집에 ]` `[ 비가 ]` `[ 있어요 ]` `[ 와서 ]`
    * *Kết quả ghép:* `비가` $\rightarrow$ `와서` $\rightarrow$ `집에` $\rightarrow$ `있어요.`
  * **Kiểu 2 - Biến đổi động/tính từ (Conjugation Drill):** Cho từ nguyên thể trong ngoặc và yêu cầu gõ/chọn dạng chia đúng với ngữ pháp của ngày hôm đó.
    * *Ví dụ:* `어제 도서관에서 책을 (읽다 + -았/었어요) $\rightarrow$ [          ]` (Đáp án: `읽었어요`).

---

## 2. Lộ Trình Phân Bổ 60 Ngày Hợp Lý (Tái cấu trúc 120 mẫu ngữ pháp)

Trong file code hiện tại, hệ thống đang cắt tuần tự 2 mẫu/ngày từ danh sách 120 ngữ pháp, dẫn đến tình trạng **một số mẫu trung cấp (như `-(으)ㄹ 지경이다`, `-다가는`) xuất hiện lẫn lộn hoặc quá sớm** so với trình độ TOPIK I (Cấp 1–2).

Nên chia lại lộ trình 60 ngày thành **4 Giai đoạn vàng**:

| Giai đoạn | Thời gian | Trọng tâm ngữ pháp | Tỷ lệ dạng bài tập |
| :--- | :--- | :--- | :--- |
| **1. Nền tảng cốt lõi** | Ngày 1 – 15 | Tiểu từ cơ bản (`은/는`, `이/가`, `을/를`, `에`, `에서`), chia thì (Hiện tại, Quá khứ, Tương lai), câu phủ định (`안`, `-지 않다`). | 80% Trắc nghiệm hình thái<br>20% Ghép thẻ từ ngắn |
| **2. Liên kết & Biểu đạt** | Ngày 16 – 35 | Nguyên nhân (`-아/어서`, `-(으)니까`), đối lập (`-지만`, `-(으)ㄴ데`), điều kiện (`-(으)면`), mong muốn (`-고 싶다`), khả năng (`-(으)ㄹ 수 있다`). | 60% Trắc nghiệm ngữ cảnh<br>40% Ghép câu hoàn chỉnh |
| **3. Mở rộng TOPIK I** | Ngày 36 – 50 | Trình tự thời gian (`-기 전에`, `-(으)ㄴ 후에`), trải nghiệm (`-아/어 보다`, `-(으)ㄴ 적이 있다`), cấm đoán/cho phép (`-(으)면 안 되다`, `-아/어도 되다`), phỏng đoán (`-(으)ㄹ 것 같다`). | 70% Trắc nghiệm dạng đề TOPIK<br>30% Điền từ chia đuôi |
| **4. Tổng ôn & Phản xạ** | Ngày 51 – 60 | Trộn ngẫu nhiên toàn bộ các cặp ngữ pháp dễ nhầm lẫn (Ví dụ: `-아/어서` vs `-(으)니까`; `-(으)ㄹ 거예요` vs `-(으)려고 해요`). | 100% Trắc nghiệm tổng hợp tốc độ cao |

---

## 3. Cơ Chế "Luyện Tập Vô Hạn" Thông Minh (Smart Infinite Loop)

Để chế độ luyện tập vô hạn thực sự giúp người học tiến bộ mà không bị nhàm chán do lặp lại câu cũ, thuật toán sinh câu hỏi trong code nên tuân theo 3 nguyên tắc:

1. **Sinh câu động bằng biến số (Template-based Generation):**
   * Thay vì cố định 1 câu ví dụ cho 1 ngữ pháp, hãy tạo khung câu kết hợp với kho từ vựng của ngày hôm đó.
   * *Công thức:* `[Chủ ngữ] + [Thời gian] + [Địa điểm] + [Tân ngữ] + [Động từ + Ngữ pháp]`.
   * *Kết quả:* Từ 1 mẫu ngữ pháp `V-고 싶어요`, hệ thống có thể tự động sinh ra hàng trăm câu khác nhau (`저는 영화를 보고 싶어요`, `친구는 밥을 먹고 싶어요`, `동생은 한국에 가고 싶어요`...).
2. **Ưu tiên lặp lại ngắt quãng (Spaced Repetition cho câu sai):**
   * Nếu người dùng trả lời sai câu hỏi nào, đẩy câu đó vào hàng đợi ưu tiên để xuất hiện lại sau **3–5 câu tiếp theo** dưới một thứ tự đáp án khác.
3. **Đa dạng hóa loại câu hỏi trong mỗi lượt 5 câu:**
   * **Câu 1:** Nhận diện ý nghĩa (Hàn $\rightarrow$ Việt).
   * **Câu 2:** Chọn quy tắc chia đúng (Phân biệt *받침* / nguyên âm).
   * **Câu 3:** Điền khuyết vào hội thoại ngắn (Ngữ cảnh giao tiếp).
   * **Câu 4:** Sắp xếp các mảnh ghép thành câu hoàn chỉnh.
   * **Câu 5:** Phân biệt với ngữ pháp dễ nhầm lẫn (Câu nâng cao chốt lượt).