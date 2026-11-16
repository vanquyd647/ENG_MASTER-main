# Nghiệm thu đợt nâng cấp 14/10/2026

Đây là bằng chứng lịch sử của upgrade.4. Bản hiện tại learning.1 được nghiệm thu riêng ở [LEARNING_UPGRADE.md](LEARNING_UPGRADE.md).

Release `2026.10.14-upgrade.4` đã phát hành tại https://eng-master-main2.vercel.app, deployment `dpl_HGYFgrQkjJWt3GbUfmUnQAfaGt8o`. Production đã qua 11 ca features, 5 ca dataset, HTTP/PWA và scan toàn bộ public assets; QA đã dọn.

## Đã đạt

- Gemini giữ `gemini-3.5-flash-lite`; bounded retry lỗi nhanh 500/502/503 trong deadline chung. Sáu ca API thật của upgrade.3 đạt, tài khoản/quota QA đã dọn.
- Restore/reset stage generation rồi atomic activation; thiết bị offline cũ bị chặn, có backup/archive/adopt; rollback bằng UUID mới. Browser hai contexts cùng QA identity đạt ngắt sau 400 staged writes và rollback trên production.
- Sổ lỗi sai lưu câu hỏi/đáp án/giải thích thật, hash câu hỏi để không gộp hai câu AI khác nhau, có lọc/phân trang và bài ôn từ đã chọn.
- Roadmap theo ngày thi, mục tiêu ghi nhận, ngân sách thời gian và số từ muốn bắt đầu; không suy đoán điểm thi. Backup/Cloud/owner riêng và giữ được khi đọc backup cũ.
- 6 bài công việc, 18 câu hiểu ngữ cảnh, 24 câu Part 5, 18 câu Part 2 do ENG_MASTER biên soạn. Có giải thích, transcript/dịch, giọng offline theo thiết bị, kết quả riêng, draft/reload và timer tự nộp.
- PDF/CSV/TSV/TXT đọc trên thiết bị, sửa/preview, chỉ nhập mục hợp lệ vào personal library/deck. Trùng/lỗi liệt kê rõ; không sửa catalog chung. PDF nguồn đọc đủ 1.000 dòng trên 23 trang, cả khi offline. Tách nghĩa xuống hàng theo tọa độ để không ghép sang từ trước.
- Backup nâng 20 MB; lịch sử Cloud xuất phân trang 500, có regression 501 records. Import kiểm tra dung lượng preferences trước khi ghi. Dọn generation cũ chỉ qua xác nhận, giữ active/previous.
- 11 bước browser features đạt: roadmap validation/reload; quiz sai/notebook/reload; Part 5 score/unanswered/history; timer; CSV/deck; PDF; offline worker/transcript; 360/390/768/1280 px; backup mới.
- Người dùng hoàn tất Google OAuth thật trên domain chính; provider Google xác nhận trong browser, không đưa token/email vào report. Calendar/Tasks/Drive scope và API tạo–đọc–xóa tài khoản thật đều đạt; các mục QA đã dọn. Calendar/Tasks phải bật ở consumer project 541667927343 theo Google API error.

## Bằng chứng

`output/verification/browser-upgrade-features.json`, `browser-dataset-acceptance.json`, `google-oauth-real.json`, `cloud-release-client-sdk.json`, `firebase-dataset-rules.json`, `build-metrics.json`, `public-build-release.json`, `google-workspace-real.json`, `browser-dialogue-audio.json`, `hosted-ai-production-candidate.json`.

Ảnh UI/backup ở `output/playwright/upgrade-*`. QA tạo dữ liệu giả ở browser riêng; tài khoản Cloud QA được xóa sau phép thử. `.vercelignore` loại output/new/credentials khỏi upload.

Giới hạn: voice tùy thiết bị, PDF scan chưa OCR, bank luyện là bộ khởi đầu và không quy điểm ETS; avatar tắt, billing không đổi, native TTL chưa dùng; Tasks/Drive cạnh tranh hai thiết bị chưa unique tuyệt đối; chưa commit/push Git. Chính sách cụ thể ở [SYNC_POLICY.md](SYNC_POLICY.md).

Gates: 93 unit/UI/repository/HTTP, 13 Emulator, 4 native API imports; npm audit 0 vulnerabilities. Public initial referenced gzip 392.153 byte, 39 assets/offline revision dfb402e42c95a5a4. Không có server secrets trong assets public.

Ngày 15/10: N11 đạt trong phạm vi Google OAuth + 3 dịch vụ Workspace thật. Ảnh crop card QA: output/playwright/google-workspace-real.png. Người dùng đã yêu cầu tạm hoãn Avatar và native TTL, giữ cả hai tắt, billing giữ nguyên; ưu tiên tiếp theo là tính năng học tập theo NEXT_UPGRADE_PLAN.md. Việc tạm hoãn không thay đổi kết quả nghiệm thu ở trên.

Nghe offline đã kiểm tra bằng Chrome Khách riêng trên production: ngắt mạng, hai utterances dùng local voices Daniel/Karen đều có start/end, không lỗi. Báo cáo browser-dialogue-audio.json; không dùng tài khoản người dùng hoặc sửa dữ liệu học.
