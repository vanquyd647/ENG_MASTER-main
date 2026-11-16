# Nâng cấp học tập — đợt 1

> Đây là bằng chứng lịch sử của learning.1. Đợt learning.2 mở rộng ngân hàng, ngữ pháp và đọc hiểu được ghi riêng tại [LEARNING_CONTENT_UPGRADE.md](LEARNING_CONTENT_UPGRADE.md).

Ngày 15/10/2026. Release `2026.10.15-learning.1`; deployment `dpl_eiEnSVDHWyX5kYgf7k9QZq85norr`. Đã promote lên https://eng-master-main2.vercel.app và đạt kiểm tra lại trên domain chính.

## Hành vi mới

- Sổ lỗi chung gồm từ vựng, Part 2, Part 5 và câu hiểu ngữ cảnh. Câu sai và câu bỏ trống được đếm riêng; lần trả lời đúng sau đó ghi là đã ôn đúng, không suy diễn thành thạo.
- Làm lại đúng câu từ vựng đã sai từ snapshot và question ID gốc, kể cả câu AI. Không cần gọi AI lại. Quiz mới theo từ vẫn là lựa chọn riêng.
- Làm lại một câu hoặc nhóm câu Part 2/5/ngữ cảnh đang cần ôn. Lưu câu hỏi/đáp án bằng ID bank gốc, kết quả mới cập nhật trạng thái cùng câu trong sổ.
- Luyện Part 2/5 chọn chủ điểm, phạm vi tất cả/chưa làm/cần ôn lại và số câu. Trộn câu, giữ thứ tự đáp án; dùng số câu thực tế nếu bộ lọc ít câu. Bài có thời gian dành 30 giây/câu, là chế độ luyện nội bộ.
- **Học hôm nay** ở Tổng quan: phiên ngắn gồm ôn đến hạn → một câu từ vựng đang sai → từ mới → câu Part 2/5 cần ôn hoặc chưa làm. Bỏ bước rỗng, lấy ngân sách/lượng từ từ lộ trình nếu có, không thêm từ mới vào/sau ngày thi. Lượng bài giới hạn cho phiên ngắn, không cam kết phút thực tế hoặc điểm thi.
- Phiên Học hôm nay có bản nháp trên thiết bị, tiếp tục thẻ đang dở sau reload; kết quả từng bước vẫn dùng repository/events/backup hiện có. Chỉ ghi hoàn thành sau khi lưu được; kết thúc sớm giữ các từ còn lại trong bước.
- Nghe hội thoại chọn giọng local theo người nói, nghe từng câu, lặp 1/3/5 lần, tô sáng dòng đang phát và dừng. Tab nghe bắt đầu với transcript ẩn. Thiếu giọng vẫn đọc được transcript và có hướng dẫn, không tự chuyển sang dịch vụ online.
- Thống kê bài luyện theo chủ điểm trong 7/30/90 ngày, có đúng/tổng lượt/bỏ trống và tỷ lệ đúng. Đếm attempts thực, tách khỏi SRS từ vựng và điểm TOEIC.

## Lưu dữ liệu và giới hạn

Không đổi schema Cloud, rules hoặc bank version. Catalog vẫn 1.575 mục, ngân hàng gốc vẫn 60 câu/6 ngữ cảnh; IDs và nội dung đã chốt không đổi. Kết quả Part 2/5/ngữ cảnh tiếp tục nằm trong learning settings/backup; sổ lỗi và thống kê chỉ phản ánh tối đa 100 bài gần nhất còn lưu. Chưa có tổng hợp dài hạn ngoài giới hạn này.

Bản nháp Học hôm nay và bài luyện là dữ liệu trên từng thiết bị, không đồng bộ giữa các thiết bị và không thuộc backup thông thường. Khi thay/reset dataset, chỉ bản nháp của owner đó bị vô hiệu hóa; khi archive trước adopt Cloud, giữ raw device drafts trong archive và file xuất để đối chiếu, không tự replay vào dataset mới. Lịch sử malformed không bị coi như rỗng để ghi đè; giao diện báo lỗi và giữ bản nháp khi chưa lưu kết quả được.

Đợt này chưa thêm bài ngữ pháp riêng, chép chính tả cả câu, họ từ, ngân hàng lớn hơn, bài đầu vào hoặc Part 6/7. Đây là các đợt nội dung tiếp theo. Avatar AI và native TTL vẫn tắt/tạm hoãn, billing không đổi; giữ cleanup quota backend hiện có.

## Kiểm chứng

- Node 22.23.3: typecheck/lint/catalog/build đạt; 106 unit/UI/repository/HTTP tests, 13 Emulator tests, 4 native API imports đạt. Audit hiện có 0 vulnerabilities.
- Browser local và production: 8 nhóm ca đạt, gồm lọc bài/draft reload, sổ lỗi chung, question ID gốc khi retry, phiên Học hôm nay đủ bước + resume, thống kê và offline/mobile. Bốn route ở các chiều rộng 360/390/768/1280 px không tràn ngang.
- Âm thanh thật khi offline: nghe một câu lặp ba lần, cả ba local utterances đều start/end; điều khiển dừng đạt. Không dùng dữ liệu tài khoản thật.
- Local initial referenced gzip 393.142 byte, dưới 420.000; offline pack 42 assets gồm PDF worker; scan server secrets không phát hiện trong public build. Production đo 393.556 byte, 42 assets, offline revision `2de527728e6cb8b6`; remote/local có thể khác CSS/env.

Bằng chứng: `output/verification/learning-unit.log`, `learning-audit.json`, `learning-build-metrics.json`, `browser-learning-acceptance-local.json`; ảnh `output/playwright/learning-dialogue-mobile.png`. Script: `scripts/browser-learning-acceptance.mjs`, chạy bằng Playwright CLI với guest context riêng. Candidate cuối đạt 6 ca AI/API, gồm Avatar tắt và quota 429; tài khoản/quota QA đã dọn. Production đạt HTTP/PWA/scan toàn bộ assets, nhãn release đúng, missing JS 404 và AI thiếu token 401. Bằng chứng bổ sung: `learning-hosted-ai-candidate.json`, `browser-learning-acceptance-production.json`, `learning-public-build.json`, `learning-emulator.log`.

Git chưa commit/push. Rollback frontend tối thiểu upgrade.3 theo DATASET_PROTOCOL.md; có thể quay về upgrade.4. Kết quả bài luyện vẫn đọc được ở upgrade.4, bản nháp Học hôm nay chỉ dùng ở bản mới.

Firebase thật: 5 nhóm kiểm tra client SDK đạt bằng hai tài khoản QA tạm, gồm Part 2/5 records không rỗng lưu/đọc nguyên vẹn, retry sửa đúng cùng câu, đếm bỏ trống và chặn tài khoản khác đọc learning settings. Auth/data QA đã xóa; bằng chứng `output/verification/learning-cloud-client.json`.
