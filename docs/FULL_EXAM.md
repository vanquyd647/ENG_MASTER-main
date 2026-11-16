# Đề luyện tích hợp 200 câu

Bản phát hành learning.8 có 311 câu trong ngân hàng; một đề cố định gồm Part 1–7 theo số lượng 6/25/39/30/30/16/54. Đây là nội dung ENG_MASTER tự biên soạn, không phải đề ETS. Kết quả là số câu đúng, không quy đổi điểm TOEIC/CEFR hoặc cam kết mức tăng điểm.

## Học liệu và cấu trúc

Listening gồm 100 câu và một track giọng tổng hợp cố định đủ 45 phút. Có 71 clip luyện riêng cho toàn bộ 117 câu nghe trong ngân hàng. Đề dùng 54 nhóm theo đúng thứ tự 100 câu, có đánh số câu, khoảng trả lời, hội thoại ba người và câu dùng bảng thông tin. Part 1 có sáu ảnh CC0 đã xem/đối chiếu; transcript và bản dịch chỉ mở sau khi nộp.

Reading gồm 100 câu trong 75 phút. Part 6 có bốn bài, mỗi bài bốn chỗ trống, dài 144–158 từ. Part 7 có 29 câu văn bản đơn, 25 câu đa văn bản: hai bộ đôi và ba bộ ba, mỗi bộ năm câu. Bài đơn dài 130–165 từ; bộ nhiều văn bản dài 210–280 từ. Đây là rubric luyện đọc của dự án; chưa có dữ liệu hiệu chuẩn độ khó hoặc tương đương điểm thi.

28 bản câu hỏi đọc dài có ID calibrated-v1; văn bản/câu đã phát hành giữ nguyên cho lịch sử và backup. Các phần mở rộng chưa phát hành được thêm ngữ cảnh và đối chiếu lại 64 câu/17 bài. Báo cáo nguồn hiện tại gắn hash đủ 311 câu.

## Làm bài, âm thanh và lưu phiên

- Đồng hồ tuyệt đối 45/75 phút vẫn chạy khi rời trang. Nghe khóa khi sang Đọc; hết giờ tự nộp.
- Track nghe chạy theo thời gian làm bài. Tạm tắt âm thanh không dừng đồng hồ; bật lại/reload tiếp tục đúng thời điểm. Nếu trình duyệt chặn autoplay, nút Bật âm thanh cho phép tiếp tục.
- Audio MP3 và ảnh có trong offline pack; hỗ trợ Range để seek offline. Chế độ luyện riêng cho phép phát lại và đổi tốc độ.
- Lưu đáp án/thời hạn theo owner/dataset; Web Locks phối hợp nhiều tab và bài luyện thông thường. Kiểm tra revision trước nộp, giữ nháp khi ghi thất bại và không ghi trùng khi thử lại.
- Kết quả là bảy records bank 2, dùng Cloud/backup v4 hiện có. Xem theo Part, tối đa 10 câu/trang. Không tạo namespace Cloud mới.
- Lịch sử tối đa 100 records có thể chỉ giữ một phần đề cũ; UI ghi rõ. Bản nháp trên thiết bị không nằm trong backup thông thường.

## Nghiệm thu và giới hạn

Codex chịu trách nhiệm, có kiểm tra chéo mù bằng Gemini cho ngân hàng ban đầu, đọc riêng phần bổ sung và giải trình tám bất đồng. Không gán danh nghĩa giáo viên độc lập. Audio được giải mã/kiểm tra thông số và ASR trên file MP3 thật: 69/71 clip không bị đánh dấu; giữ hai bất đồng ở một phương án nhiễu đồng âm và một câu hỏi đã hiển thị bằng chữ. Không có chứng nhận nghe bằng người.

Bằng chứng: output/verification/bank-review-adjudicated.json, exam-content-profile.json, audio-acceptance-final.json và system-acceptance-final.json. Bộ browser kiểm tra playback thật, offline/seek, 45/75 phút, hai tab, backup và bảy kết quả. Bước nhảy đồng hồ dùng Playwright clock, không giả là đã chạy hai giờ ngoài đời. Trạng thái phát hành/95% lấy từ [ACCEPTANCE_95.md](ACCEPTANCE_95.md), không từ một cờ trong định nghĩa form.
