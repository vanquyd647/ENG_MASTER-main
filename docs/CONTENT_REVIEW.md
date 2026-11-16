# Rà soát nội dung — bản 311 câu

Ngày 16/10/2026, Codex chịu trách nhiệm theo chỉ định người dùng. Ngân hàng hiện tại có 311 câu: bản 277 đã kiểm tra chéo mù bằng Gemini; thêm 6 câu đọc đơn, hai tiểu dạng nghe và 28 bản đọc dài mang ID mới. Codex đọc lại 64 câu thuộc 17 bài đọc sau mở rộng, đối chiếu từng lựa chọn, đoạn nguồn và bản dịch theo luồng riêng. Không gọi đây là 311 câu đều đã được một giáo viên hoặc một model khác nghiệm thu.

Các văn bản đã phát hành giữ nguyên ID/nội dung để đọc lịch sử. Bản dài có ID calibrated-v1 và cùng đáp án đã đối chiếu; đề mới chọn các bản này. Bốn bài Part 6 dài 144–158 từ; bài đơn Part 7 dài 130–165 từ; bộ đôi/ba văn bản dài 210–280 từ. Đây là rubric nội dung của dự án, không phải yêu cầu số từ chính thức của ETS.

Hồ sơ hiện tại: output/verification/bank-review-adjudicated.json (311 hash), bank-review-calibration-v1.json (64 câu), exam-content-profile.json và audio-acceptance-final.json. Audio tổng hợp được đối chiếu source/hash, giải mã cả 72 file, kiểm tra ASR từng phát ngôn: 69/71 clip không bị đánh dấu (97,18%). Giữ hai bất đồng nhận dạng, không tuyên bố đã nghe bằng người hoặc đã hiệu chuẩn độ khó/điểm thi.

## Hồ sơ các mốc trước (giữ để đối chiếu)

Codex chịu trách nhiệm theo chỉ định người dùng. Đã đối chiếu đáp án, lựa chọn, giải thích, bản dịch/kịch bản/bài đọc và xem sáu ảnh của ngân hàng **277 câu đang dùng**. Gemini `gemini-3.5-flash-lite` giải mù theo một luồng kiểm tra riêng, không thấy đáp án/giải thích biên soạn. Không có chứng nhận giáo viên độc lập; chưa nghiệm thu audio toàn đề, chuẩn hóa độ khó/tiểu dạng hoặc công bố đạt 95% toàn hệ thống.

Bằng chứng chi tiết: `output/verification/bank-review-adjudicated.json`, có ID, hash đầu vào, nguồn kiểm tra và quyết định từng câu. Tạo lại bằng `node --import tsx scripts/finalize-bank-review.mjs`; script từ chối nguồn thay đổi, thiếu câu hoặc phát hiện bất đồng chưa có giải trình.

## Những vấn đề đã xử lý

- Câu cũ `p5-v1-16`: “This is the _____ route to the airport.” có thể điền fast hoặc fastest. Thay bằng `p5-reviewed-v1-route`: “This is the _____ of the three available routes to the airport.”, đáp án fastest. Giữ nguyên nội dung/đáp án/ID cũ để đọc lịch sử và backup; không chọn câu cũ cho bài mới hoặc luyện lại. Tổng số câu đang dùng vẫn là 277.
- Hội thoại đi công tác: đổi phòng được giữ từ tối nay thành từ tối hôm trước để nhận sớm hợp lý. Chưa phát hành nên giữ ID của kịch bản mới.
- Tin nhắn nhận sách: ghi rõ giữ hàng đến giờ đóng cửa lúc năm giờ thứ Bảy, tránh nói mơ hồ tới buổi tối.

## Kiểm tra chéo và giải quyết bất đồng

Lần đầu `bank-review-v1` nhận 170/277 kết quả; 11 batch lỗi 429. Câu ngữ cảnh thiếu nguồn trong request nên không dùng lượt đó làm bằng chứng nghiệm thu. Giữ nguyên báo cáo lỗi.

Lượt sửa `bank-review-v2` gửi đủ hội thoại nguồn, tăng batch lên 20 câu và gọi tuần tự có khoảng cách. Nhận đủ 277/277, không batch lỗi; 269 chỉ số trùng đáp án và tám bất đồng. **Tỷ lệ trùng chỉ số không phải tỷ lệ đúng của nội dung hoặc độ sẵn sàng hệ thống.** Codex đọc lại tám trường hợp, đối chiếu lựa chọn thực tế và giữ đáp án biên soạn:

| Câu | Kết luận từ nguồn/ngữ pháp |
| --- | --- |
| p6-v2-training-3 | Không cần cài phần mềm nhưng cần kiểm tra Wi-Fi: However; Otherwise không thể hiện quan hệ này. |
| p6-v2-membership-3 | Update them: them thay cho contact details; their cần danh từ theo sau. |
| p3-listening-v1-delivery-q1 | Đặt 12, nhận 10, còn thiếu 2; nguồn nói thêm the other two. |
| p3-exam-v1-restaurant-q1 | Đổi đặt bàn thành bốn người; không lấy hai người hủy làm số khách dự. |
| p3-exam-v1-catering-q2 | 40 suất thêm 5 thành 45, đúng với lời xác nhận. |
| p7-exam-v1-appointment-q1 | 10:20 trừ 15 phút là 10:05. |
| p7-exam-v1-venue-q1 | Cedar đủ 32 khách, rẻ hơn Oak; Elm chỉ chứa 20. |
| p7-exam-v1-shipment-q5 | 8×90 + 2×150 = 1.020 đô. |

Câu thay thế được kiểm tra riêng trong `bank-review-route-v1`: chỉ số và nguyên văn lựa chọn đều khớp. Lượt v2 vẫn giữ câu cũ trong bản chụp; hồ sơ cuối đối chiếu hash của 276 câu không đổi và kết quả riêng của câu mới. Không sửa kết quả cũ thành đạt hoặc thử lại tám bất đồng cho đến khi model đồng ý.

Script kiểm tra tiếp theo yêu cầu cả chỉ số lẫn nguyên văn đáp án, kiểm tra hai giá trị khớp để phát hiện model chỉ ra bằng chứng đúng nhưng trả sai chỉ số. Mặc định script chỉ tạo bản chụp local; gọi dịch vụ cần `--allow-external`. Người dùng đã cho phép gửi ngân hàng câu hỏi/ảnh/nguồn sang Gemini; không gửi thông tin tài khoản hoặc tiến độ học.

Đây là nghiệm thu **đáp án/văn bản/ảnh** có phạm vi rõ. Chất lượng giọng nghe, tính tương đương đề thi, bộ ít nhất 200 đầu ra AI giảng giải và nghiệm thu cả sáu nhóm vẫn còn trong [mốc 95%](QUALITY_TARGET_95.md).
