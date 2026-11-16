# Nâng cấp học tập — đợt 2

> Bằng chứng nội dung của learning.2 được giữ nguyên. Bản vá PWA hiện tại là learning.3; xem [PWA_UPDATE_FIX.md](PWA_UPDATE_FIX.md).

Ngày 15/10/2026. Release **2026.10.15-learning.2**; đã phát hành và nghiệm thu tại https://eng-master-main2.vercel.app, deployment `dpl_13mQPZCec98JxX4emQ2x5hPi6Uxv`.

## Nội dung và hành vi

Ngân hàng tăng từ 60 lên **166 câu**, gồm 42 Part 2, 48 Part 5, 24 câu hiểu ngữ cảnh, 18 câu ngữ pháp, 16 Part 6 và 18 Part 7. Giữ nguyên 60 câu cũ và catalog 1.575 từ. Nội dung thêm do ENG_MASTER biên soạn; không phải đề ETS và không quy đổi kết quả sang điểm TOEIC.

- Sáu chuyên đề ngữ pháp: từ loại, hòa hợp chủ vị, thì động từ, giới từ thời gian, liên từ và bị động. Mỗi chuyên đề có quy tắc, hai ví dụ/dịch, lỗi dễ nhầm và ba câu áp dụng.
- Bốn bài Part 6: email đổi lịch giao hàng, thông báo đào tạo, sửa sảnh và gia hạn hội viên. Mỗi bài có bốn chỗ trống/câu hỏi, gồm từ vựng, ngữ pháp và liên kết đoạn.
- Sáu bài Part 7: hội thảo (email + lịch), nhận hàng tại cửa hàng, hóa đơn, tuyển dụng, thông báo tàu và phản hồi khách (hai thư). Mỗi bài có ba câu, giải thích tiếng Việt và bản dịch trong kết quả.
- Thêm hai hội thoại xác nhận đơn với nhà cung cấp và hướng dẫn nhân viên mới, nâng tổng lên tám ngữ cảnh. Dùng trình phát giọng local hiện có.
- Lọc độ khó cơ bản/vận dụng/nâng cao cho các bài luyện; đây là nhãn biên soạn, chưa được chuẩn hóa theo điểm thi. Part 6/7 giữ nhóm và thứ tự câu trong từng bài đọc. Thời gian luyện nội bộ: 30 giây/câu Part 2/5, 90 giây/câu Part 6/7.
- Lỗi ngữ pháp/Part 6/7 có trong sổ lỗi chung, làm lại đúng ID câu và tra lại văn bản. Thống kê chủ điểm có nút ôn tương ứng, dựa trên attempts thực. Học hôm nay tiếp tục dùng lỗi/chưa gặp Part 2/5, bao gồm câu mới.
- Dashboard nêu rõ Ngữ pháp và Part 2/5/6/7; reload một phiên bài đọc giữ đúng phần đang luyện.

## Tương thích và lưu dữ liệu

Giữ nguyên eng_master_practice_records_v1 (bank 1). Các bài bắt đầu từ bản mới dùng bank 2 và khóa eng_master_extended_practice_v1, lưu qua document settings/extendedLearning tách khỏi hai document cũ. Tối đa 100 bài cũ và 100 bài mở rộng; sổ lỗi/thống kê phản ánh lịch sử còn giữ, chưa có tổng hợp dài hạn.

Client cũ tiếp tục dùng ngân hàng/lịch sử cũ. Ghi preferences hoặc learning không ghi đè extendedLearning. Payload chưa có dữ liệu mở rộng bỏ qua document đó, không gửi null để xóa. Nếu cập nhật Cloud đến lúc còn outbox cục bộ, ứng dụng đọc lại server sau khi gửi xong; kiểm tra owner/generation và giá trị cục bộ trước khi áp dụng. Năm ca kiểm thử riêng bao phủ pending, đổi tài khoản, thay đổi cục bộ và retry lỗi mạng. Rules bổ sung kiểm tra owner, vị trí key và giới hạn chuỗi; không đổi luật dataset generation, quota, TTL hay billing.

Backup dùng **v4 khi có namespace mở rộng**, đọc lại được ở bản này. V2/V3/legacy vẫn nhập được; file cũ thiếu trường mở rộng giữ dữ liệu mở rộng hiện có. Merge chống lặp theo record ID; replace/rollback hiện tại sao chép đủ ba document settings. V4 được phiên cũ từ chối thay vì âm thầm bỏ kết quả mới. Khôi phục, reset hoặc xuất bản sao đầy đủ của dữ liệu mới phải dùng ứng dụng hiện tại; bản cũ không có các luồng học/schema mới.

Nhập backup chỉ có kết quả bài luyện nay được chấp nhận, có preview và không tạo tiến độ từ vựng giả. Bản nháp bank 2 nằm ở khóa thiết bị v2, có dấu dataset, đọc được draft v1 cũ khi phù hợp và không replay draft v2 sang generation khác. Archive giữ raw drafts; reset/adopt vô hiệu hóa đúng owner. Bản nháp vẫn không thuộc backup thông thường hoặc đồng bộ giữa thiết bị.

Avatar và native TTL vẫn tắt/tạm hoãn; billing và model Gemini giữ nguyên.

## Kiểm chứng

- Node 22: 123 unit/UI/repository/HTTP tests, 14 Emulator tests, 4 native API imports; typecheck/lint/catalog/build đạt; audit 0 vulnerabilities.
- 9 nhóm browser nội dung local và production: ngữ pháp, lưu độc lập, backup chỉ có bài luyện, merge chống lặp, Part 6 đủ nhóm/timer/reload, Part 7 hai tài liệu/retry, đề xuất chủ điểm, offline/mobile và restore trên browser sạch.
- 8 nhóm hồi quy local và production của learning.1 đạt, gồm Học hôm nay/resume, câu từ vựng gốc và phát âm thanh offline thật.
- 4 nhóm browser Cloud local đạt: đăng nhập bằng identity QA, học offline/reload/reconnect, chuyển hai tài khoản không lẫn từ và quay lại khôi phục catalog; Auth/data QA đã xóa.
- 6 nhóm client SDK Firebase thật đạt; thêm kết quả đọc hiểu mới, ghi kiểu client cũ vẫn giữ document mới, từ chối sai kiểu/sai document/cross-account; tài khoản và dữ liệu QA đã xóa.
- Catalog 1.575 mục và ba hash baseline không đổi; file ngân hàng 60 câu cũ có SHA-256 e389a541dcdaca6ce75ab4889162f630e7dfb126d06a94848a36ad2dd2eb3bb0, được kiểm tra thêm trong gate build. Registry nhỏ dùng cho validation khớp cả 106 ID mới, không tải toàn bộ văn bản trong bundle ban đầu.

Bằng chứng: output/verification/learning2-unit.log, learning2-emulator.log, learning2-cloud-client.json, learning2-firestore-rules.json, learning2-audit.json, learning2-browser-cloud-local.json, browser-learning-content-local.json, learning2-browser-regression-local.json. Ảnh: output/playwright/content-reading-mobile.png. Script mới: scripts/browser-learning-content.mjs.

Candidate cuối đạt 6 ca AI/API (Explain/Quiz/Mistake 200, invalid 400, Avatar tắt 503, quota 429), Auth/quota QA đã dọn. Production đạt 9 nhóm nội dung + 8 nhóm hồi quy, nhãn release, 42 assets/offline PDF worker, missing JS 404 và thiếu token 401. Initial referenced gzip local 394.411 byte; production 394.866 byte, dưới ngân sách 420.000. Không phát hiện server secrets trong public build.

Bằng chứng release: output/verification/learning2-release.json, learning2-hosted-ai-candidate.json, learning2-public-build.json, browser-learning-content-production.json và learning2-browser-regression-production.json. Bản trước learning.1: dpl_eiEnSVDHWyX5kYgf7k9QZq85norr. Git chưa commit/push. Khi rollback frontend, giữ rules bổ sung và dùng bản mới để khôi phục backup v4; không quay rules về phiên bản chặn extendedLearning.
