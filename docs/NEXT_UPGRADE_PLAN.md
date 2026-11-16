# Đợt nâng cấp tiếp theo

Ngày bắt đầu: 14/10/2026. Người dùng đã yêu cầu tiến hành sau khi xem các phần còn thiếu và đề xuất tính năng. Giữ catalog 1.575 mục cùng ID/nội dung đã chốt; bổ sung nội dung học ở nguồn riêng.

## Ưu tiên cập nhật ngày 15/10/2026

Theo yêu cầu người dùng, tạm hoãn Avatar AI và native TTL; giữ cả hai tắt và không thay đổi billing. Đây không phải điều kiện chặn các đợt nâng cấp học tập. Giữ cơ chế cleanup quota backend hiện có.

Backlog học tập theo thứ tự ưu tiên; trạng thái cập nhật cho đợt `2026.10.15-learning.2`:

- [x] L01: Rà soát luồng ôn hằng ngày → sổ lỗi sai → bài ôn lại; làm rõ lượng bài cần học và khả năng tiếp tục phiên trên mobile/offline.
- [x] L02: Mở rộng ngân hàng Part 2/Part 5 và ngữ cảnh công việc từ bộ 60 câu hiện có; rà soát đáp án, giải thích, transcript/dịch, gắn chủ điểm và độ khó.
- [x] L03: Cải thiện luyện nghe với giọng sẵn có trên thiết bị, điều khiển phát lại/tốc độ và trải nghiệm khi thiếu giọng; nghiệm thu mobile/offline.
- [x] L04: Cải thiện phản hồi tiến bộ và đề xuất bài ôn từ attempts thực, kết nối với lộ trình; không suy diễn điểm TOEIC chính thức từ số từ hoặc điểm luyện tập.

L01–L04 đã phát hành qua learning.1 và learning.2. Ngân hàng hiện có 166 câu, 8 ngữ cảnh, 6 chuyên đề ngữ pháp, 4 bài Part 6 và 6 bài Part 7. Thống kê chủ điểm cho phép mở bài ôn tương ứng; Học hôm nay dùng attempts thực. Learning.2 đạt 9 nhóm nội dung + 8 nhóm hồi quy production, 123 unit và 14 Emulator tests. Chi tiết: [LEARNING_CONTENT_UPGRADE.md](LEARNING_CONTENT_UPGRADE.md); bằng chứng learning.1 giữ ở [LEARNING_UPGRADE.md](LEARNING_UPGRADE.md).

Learning.7 đã bổ sung khảo sát nền tảng 20 câu/4 bước (Part 2/5/6/7), không phải đánh giá đủ bảy Part. Ghi chú/collocations mới chỉ có phạm vi 20 mục, chưa phải hệ thống họ từ đầy đủ. Xem [mục tiêu 95%](QUALITY_TARGET_95.md). Các hướng mở rộng tiếp theo: Part 1/3/4 có media/đáp án khớp, đề 200 câu, chép chính tả cả câu, họ từ/collocation đầy đủ và tổng hợp thống kê dài hạn ngoài giới hạn 100 bài mỗi namespace. Đây là backlog, không thuộc phạm vi hoàn tất của learning.2.

Mỗi hạng mục cần rà soát code và hành vi hiện tại trước khi sửa, giữ dữ liệu người học/catalog đã chốt, có kiểm tra và bằng chứng nghiệm thu phù hợp. Chỉ xem lại Avatar/native TTL khi người dùng thay đổi ưu tiên.

## Đợt đã hoàn thành

- [x] N01: Kiểm tra Gemini thật; retry có giới hạn thời gian cho lỗi dịch vụ tạm thời, giữ model 3.5 Flash-Lite và fallback học offline.
- [x] N02: Restore/reset tạo dataset mới rồi kích hoạt nguyên tử; chặn outbox thuộc dataset cũ, giữ bản phục hồi và xử lý rõ trên UI.
- [x] N03: Kiểm thử restore bị ngắt, hai thiết bị/máy offline và rollback trên Emulator/browser.
- [x] N04: Sổ lỗi sai từ attempts thật, có bộ lọc và bài ôn riêng.
- [x] N05: Lộ trình theo mục tiêu/ngày thi/thời gian học; không suy diễn điểm TOEIC từ số từ đã thuộc.
- [x] N06: Bài học ngữ cảnh công việc có nội dung được rà soát, câu hỏi và giải thích.
- [x] N07: Nghe câu/hội thoại có transcript, phát lại và phương án offline rõ ràng.
- [x] N08: Luyện Part 5 và Part 2 có ngân hàng câu hỏi riêng, thời gian và kết quả; không tự quy đổi sang điểm thi chính thức.
- [x] N09: Nhập tài liệu trong app với preview/sửa dữ liệu và thư viện cá nhân; không ghi đè catalog.
- [x] N10: Mở rộng dữ liệu lớn/lịch sử/backup, kiểm tra mobile và khả năng tiếp cận.
- [x] N11: Nghiệm thu Google OAuth/Workspace thật nếu phiên tài khoản người dùng sẵn có; giữ avatar tắt nếu chưa có cấu hình dịch vụ đã kiểm tra.
- [x] N12: Gates, cập nhật docs, preview/candidate và phát hành các phần đã đạt trên đúng project hiện tại.

Trạng thái phải dựa trên bằng chứng thực. Không bật billing hoặc đổi model/provider để vượt lỗi dịch vụ khi chưa được yêu cầu. Chưa commit/push Git các thay đổi của các đợt trước.

N01–N03: Gemini production đạt lại ngày 14/10, retry có 3 unit regressions; unit tổng 80, Emulator 10, browser 5 ca dataset thật bằng hai context cùng QA identity. Ngắt sau 400 staged writes, archive/outbox và rollback mới đều đạt; QA đã dọn. Bản `2026.10.14-upgrade.3` đã được promote và kiểm tra lại 5 ca dataset trên domain chính; QA đã dọn.

N04–N10: implementation đã qua unit và browser 11 bước local; 1.000 dòng PDF trên 23 trang và worker offline đạt. Google OAuth và cả Calendar/Tasks/Drive tạo–đọc–xóa tài khoản thật đã đạt, cleanup hoàn tất. Bản upgrade.4 đã promote và qua 11 ca feature + 5 ca dataset trên production, cleanup QA đạt. Xem NEXT_UPGRADE_VERIFICATION.md và SYNC_POLICY.md cho phạm vi/giới hạn.

## AI học tập ngày 15/10 — learning.6

- [x] Chuẩn hóa explain/review thành JSON đã kiểm tra và UI cố định; vẫn đọc Markdown cũ.
- [x] Lookup 1.575 từ phía server, tách nguồn gốc với AI bổ sung; từ cá nhân có nhãn chưa rà soát, ID/nghĩa giả bị từ chối.
- [x] Bốn tác vụ hỏi tiếp cùng từ/nghĩa: đơn giản hơn, ví dụ, so sánh và kiểm tra nhanh có chấm/ẩn đáp án.
- [x] Review lỗi theo câu gốc, chia lượt tối đa 5; QA AI thật, UI và phát hành cùng runbook.

Chi tiết và bằng chứng ở [AI_LEARNING_MODULE.md](AI_LEARNING_MODULE.md). Chưa coi nội dung AI luôn đúng: mẫu đọc tay còn diễn giải vị trí chữ chưa đúng, cách nói tuyệt đối và distractor có thể mơ hồ. Hiệu chỉnh/nghiệm thu ngữ nghĩa rộng hơn là backlog tiếp, khác với kiểm tra schema. Các đề xuất word family/collocation có bài học riêng, nghe–chép câu, khảo sát đầu vào và thống kê dài hạn chưa triển khai trong đợt ba mục này.
