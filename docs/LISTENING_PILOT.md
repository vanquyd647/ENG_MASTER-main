# Gói thử nghe Part 1/3/4

Ngày 16/10/2026. Bản nâng cấp local, chưa triển khai production. Production vẫn là learning.7 theo hồ sơ phát hành trước.

## Nội dung và cách học

- 18 câu mới: sáu câu ảnh Part 1; hai hội thoại Part 3 và hai bài nói Part 4, mỗi bài ba câu. Tổng ngân hàng từ 166 lên 184 câu; catalog giữ 1.575 từ.
- Mở Tổng quan → **Bài học · Ngữ pháp · Part 1–7** → Part 1/3/4. Gói có nhãn thử nghiệm, do ENG_MASTER biên soạn. Dùng giọng tổng hợp tiếng Anh cục bộ; cần giọng hệ thống để bắt đầu. Một giọng vẫn dùng được, nhiều giọng được gán nhất quán theo người nói. Chưa phải audio thi chuẩn hóa hoặc đề chính thức ETS.
- Part 1 hiện ảnh và nút A/B/C/D; bốn lời mô tả chỉ được đọc bằng âm thanh khi làm bài. Part 3/4 hiện câu hỏi/lựa chọn, không hiện lời thoại trước khi nộp. Sau nộp có transcript, bản dịch cho hội thoại/bài nói và giải thích tiếng Việt cho mọi câu.
- Khi chọn bài thường, Part 3/4 giữ nhóm ba câu và thứ tự, tương tự nhóm bài đọc. Ôn lỗi sai có thể chọn riêng đúng câu cần luyện, với nguyên bài nghe đi kèm. Không buộc người học trả lời lại cả nhóm chỉ để sửa một câu.
- Kết quả, câu bỏ trống, thống kê, sổ lỗi và backup dùng luồng hiện có. Bản nháp lưu tại thiết bị; kết quả hoàn tất tiếp tục dùng bank 2/backup v4/namespace Cloud hiện có. Thêm ID và kind hợp lệ, không đổi nghĩa/đáp án ID cũ, rules hay cấu trúc lưu trữ. Client cũ chưa biết các ID mới nên cần cập nhật trước khi đọc lịch sử có câu mới.
- Mục **Học liệu** có liên kết mẫu IIBC Part 1/3/4 và bài VOA Budget Cuts. Audio VOA gốc đóng gói trong app, phát bằng trình phát audio của trình duyệt, không cần giọng hệ thống; transcript mở ở trang VOA, cần mạng. Bài bổ sung này không tự ghi điểm hoặc được gọi là bài Part 3 chuẩn.

## Học liệu và offline

Sáu ảnh đã được xem trực tiếp trước khi biên soạn đáp án; nguồn, tác giả và giấy phép nằm trong metadata bài và [ATTRIBUTION.md](../public/learning/listening-v1/ATTRIBUTION.md). Ảnh được giảm kích thước và nén lại; audio VOA giữ nguyên. Chỉ nhập ảnh CC0 và audio gốc VOA đã đối chiếu chính sách, không sao chép câu/audio IIBC.

Offline pack bổ sung JPG/MP3. Worker phục vụ byte range cho MP3 để phát/tua khi offline; giữ nguyên đường API không cache. Giọng hệ thống vẫn phụ thuộc thiết bị. Hook dùng chung chờ giọng tải trễ tối đa khoảng 10 giây và nghe sự kiện voiceschanged, tránh khóa nhầm nút khi Chrome ban đầu trả danh sách rỗng.

Cụm cài đặt/đăng xuất mobile chuyển vào luồng trang ở phía trên, tránh che nút Tạm dừng khi cuộn. Điều hướng dưới cùng giữ cơ chế hiện có.

## Bằng chứng và giới hạn

- `output/verification/listening-v1-assets.json`: nguồn, URL tải, số byte và SHA-256 của sáu ảnh.
- `output/verification/listening-v1-voa.json`: nguồn/chính sách, số byte và SHA-256 audio VOA.
- `output/verification/listening-v1-unit.log`, `listening-v1-typecheck.log`, `listening-v1-lint.log`, `listening-v1-build.log`: kiểm tra kỹ thuật.
- `scripts/browser-listening-pilot.mjs` và `output/verification/listening-v1-browser.json`: kiểm tra UI cục bộ. Trạng thái native speech và fixture UI được ghi riêng; không dùng fixture làm bằng chứng chất lượng giọng thật.

Kết quả cuối: 191 tests đạt, 14 Emulator tests chưa chạy lại vì không đổi rules/namespace Cloud; typecheck/lint/catalog/build và bốn native API imports đạt. Chín nhóm UI đạt, gồm native speech bắt đầu phát sau reload, sáu ảnh offline, audio VOA phát/tua offline, giữ đáp án/deadline, ôn lỗi đúng câu và backup v4 không nhân đôi. Đã xem ảnh chụp mobile, bổ sung ca hit-test nút Tạm dừng khi đang cuộn. Gói offline có 50 assets. Tám file nguồn AI đối chiếu với bản learning.7 không đổi; chưa gọi lại AI thật vì phần này không thay đổi.

Báo cáo tổng hợp: `output/verification/listening-v1-verification.json`. Đánh giá nội dung do cùng tác giả thực hiện ghi riêng ở `listening-v1-content-review.json`; không phải nghiệm thu độc lập. Bằng chứng trước các lần sửa QA được giữ ở các file `listening-v1-browser-before-*.json`.

Các câu được Codex viết và tự rà soát với ảnh/kịch bản; chưa có giáo viên độc lập nghiệm thu. Không gọi đây là mốc 95% toàn hệ thống hoặc chứng minh hiệu quả tăng điểm. Chưa có đề tích hợp 200 câu; khảo sát 20 câu hiện có vẫn chỉ đánh giá Part 2/5/6/7. Không sử dụng 48 audio chưa khớp bộ gốc, không thay billing/model/Avatar/native TTL.
