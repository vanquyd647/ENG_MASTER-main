# Changelog

## 2026-10-16 — learning.8, đạt nghiệm thu ≥95% và phát hành

- Ngân hàng 311 câu, đề 200 câu đúng 29/25 Part 7; 28 bản đọc dài có ID mới giữ lịch sử cũ. Thêm hội thoại ba người và câu dùng bảng thông tin.
- Đóng gói 71 clip nghe/117 câu và track 45 phút; playback theo đồng hồ bài thi, seek/range offline, transcript sau nộp. Giọng tổng hợp Kokoro local, không coi là audio ETS.
- AI v7: kiểm tra phát biểu/dấu tiếng Việt cả cache; hint và giải thích bài điền theo nghĩa nguồn, nguồn thay thế có nhãn. Giữ 200 đầu ra live cùng các lỗi; replay handler hiện tại tách khỏi tỷ lệ model 178/186.
- Khóa nguồn Tailwind, dùng từng biến Firebase tĩnh để loại ảnh hưởng tệp QA/metadata Vercel lên build. Quét 122 public assets và SHA audio trước phát hành.
- Sáu nhóm đều đạt ngưỡng, mức thấp nhất 95,70%, mọi gate bắt buộc đạt. Production: 12 API, bảy bộ browser trên domain thật cùng một fixture cập nhật PWA, 122 public assets/72 SHA audio đạt; QA đã dọn. 211 tests thường, 15 Emulator và replay 200 đầu ra đạt riêng. Phát hành dpl_Afst1V1YfZ66H3HSCFEKFSvXQSvQ; xem docs/ACCEPTANCE_95.md.

## 2026-10-16 — Đề 200 câu và rà soát ngân hàng (local, chưa phát hành)

- Thêm 93 câu Part 3/4/7 với nguồn song ngữ và đoạn bằng chứng, tổng ngân hàng đang dùng 277. Form 200 câu theo số lượng 6/25/39/30/30/16/54; thời gian tuyệt đối 45/75 phút, khóa phần, tự nộp, resume offline, lưu bảy kết quả bằng bank 2/backup v4 hiện có. Giọng thiết bị có phát lại; chưa gọi là đề thi chuẩn hóa.
- Phối hợp ghi nhiều tab/bài thường bằng Web Locks, kiểm tra owner/dataset và phiên nháp; retry không tạo kết quả trùng, lỗi lưu có rollback. Sửa điều hướng câu bị giữ giá trị cũ trong callback async. Mỗi route có key riêng; điều hướng không chờ hiệu ứng thoát màn hình cũ. Xem lại đề theo Part, 10 câu/trang.
- Codex chịu trách nhiệm nội dung; kiểm tra chéo mù bằng Gemini theo phép người dùng. Rà soát đáp án/văn bản/sáu ảnh cho 277 câu, giải trình tám bất đồng; thay câu route mơ hồ bằng ID mới và giữ dữ liệu lịch sử. Sửa hai chi tiết thời gian trong kịch bản chưa phát hành. Chi tiết docs/CONTENT_REVIEW.md.
- 204 tests, 15 ca Firestore Emulator, tám nhóm UI đề đầy đủ, chín nhóm UI nghe, typecheck/lint/1.575 từ/build và bốn native API imports đạt. Catalog và tám hash AI giữ nguyên; public build không chứa bí mật server. Chưa commit/push/deploy. Mốc ≥95% toàn hệ thống còn mở: audio, chuẩn hóa đề, benchmark ≥200 phản hồi AI và nghiệm thu sáu nhóm/production.

## 2026-10-16 — Gói thử học liệu nghe (local, chưa phát hành)

- Thêm 18 câu Part 1/3/4 cùng sáu ảnh có nguồn CC0; giữ nhóm hội thoại/bài nói, transcript sau nộp và giải thích tiếng Việt. Tổng ngân hàng 184 câu; catalog 1.575 từ giữ nguyên.
- Bổ sung mục Học liệu, mẫu chính thức mở ở IIBC, audio VOA gốc phát/tua offline, không cần giọng hệ thống. Gói tự biên soạn dùng giọng thiết bị, không đóng gói giọng hệ thống.
- Chờ giọng tiếng Anh tải trễ sau reload; mở rộng sổ lỗi, validator bank 2 và backup v4 cho ID/kind mới. Chưa nghiệm thu độc lập, chưa có đề 200 câu hoặc đạt 95% toàn hệ thống. Chi tiết docs/LISTENING_PILOT.md.
- 191 tests, typecheck/lint/catalog/build, bốn native API imports và chín nhóm UI local đạt. Sửa cụm nút tài khoản mobile che Tạm dừng khi cuộn; xác nhận phát/tua audio VOA offline. 14 Emulator tests chưa chạy lại; chưa deploy.

## 2026-10-15 — Nghiệm thu chất lượng và khảo sát nền tảng (`2026.10.15-learning.7`)

- Khảo sát 20 câu/4 bước từ Part 2/5/6/7, tiếp tục theo vòng, lưu bằng record bank 2 và ôn đúng câu sai/bỏ trống. Không quy đổi TOEIC/CEFR.
- Nhận xét lỗi gõ từ câu trả lời thật; bài AI dùng nhớ từ theo nghĩa thay vì chấm distractor chưa duyệt. Ghi chú/ví dụ biên soạn có nhãn nguồn riêng. Sửa khoảng cách nút Tạm dừng trên mobile.
- 184 unit, bốn native API imports, 13 nhóm UI local + production, 12 ca API candidate cuối và public scan đạt; QA đã dọn. Deployment dpl_EXuHgSHHuJrWgAA4F8nZmdCnaXDR.
- Pilot nguồn hỗn hợp 45 mục đạt kiểm tra tự động và đọc bởi Codex; chưa đạt mục tiêu 95% toàn hệ thống. Còn Part 1/3/4, đề 200 câu và nghiệm thu nội dung đầy đủ. Giữ catalog/model/rules/billing/Avatar/native TTL. Chi tiết QUALITY_TARGET_95.md.

## 2026-10-15 — AI học tập có cấu trúc (`2026.10.15-learning.6`)

- JSON đã kiểm tra cho lời giải/review, khối màu cố định và đọc lại Markdown cũ. Server lookup nghĩa/chủ đề/ví dụ từ 1.575 mục; tách AI bổ sung với dữ liệu gốc và từ cá nhân chưa rà soát.
- Bốn tác vụ hỏi tiếp cùng từ/nghĩa, chọn từ so sánh; bài kiểm tra nhanh ẩn đáp án đến khi nộp, không ghi tiến độ. Review có câu hỏi gốc, chia lượt tối đa 5 lỗi và giữ lỗi còn lại để xem tiếp.
- 165 unit, bốn native API imports, 12 AI/API thật local + candidate, 10 nhóm UI local + production và public scan đạt; QA đã dọn. Production gzip 399061 byte, 42 assets. Deployment dpl_52TyUZfxB5cxsMrsQTDFSpNHNSSE.
- Không coi schema là bảo đảm ngữ nghĩa: các diễn giải/distractor còn hạn chế ở mẫu AI thật được ghi trong AI_LEARNING_MODULE.md và ai-content-manual-content-review.json. Giữ model, catalog, rules, billing và hai flag tạm hoãn.

## 2026-10-15 — Hộp thoại AI trong Thư viện (`2026.10.15-learning.5`)

- Nút giải thích mở dialog riêng, không kéo dài thẻ; rộng tối đa 768 px, giữ từ/nghĩa, tiêu đề và nút đóng khi cuộn nội dung.
- Dùng chung cache/request với màn học, hiển thị lỗi/thử lại trong dialog, hủy khi đóng hoặc đổi owner; bỏ phản hồi trễ và giữ filter/scroll/focus của Thư viện.
- 146 unit (bảy ca mới), bảy nhóm browser local + bảy production, bốn native API imports và public-build checks đạt; QA đã dọn. Deployment dpl_5Jbj8PBoqngsL2YiXdyBaNfwCJjx. Chi tiết LIBRARY_AI_DIALOG.md.

## 2026-10-15 — Bố cục phản hồi AI (`2026.10.15-learning.4`)

- Dùng chung Markdown typography ở phân tích lỗi, thư viện, modal và giải thích từng câu; rõ tiêu đề, đoạn, danh sách, ví dụ và code.
- Khối có nhãn: xanh lá cho đáp án đúng, hồng cho câu sai, tím cho giải thích, xanh dương cho ví dụ và vàng cho bài ôn/mẹo. So sánh đúng/sai nằm cạnh nhau desktop và xếp dọc mobile; đọc được phản hồi cũ.
- Lỗi yêu cầu AI hiển thị bằng alert riêng, hỗ trợ thử lại. Không thay prompt/model hoặc chấm điểm.
- 139 unit, năm nhóm browser local + năm production, bốn native API imports và public-build checks đạt; QA đã dọn. Deployment dpl_2ut12FjLSgZ3zb7ZvnWGZKYQrbFY. Xem AI_RESPONSE_LAYOUT.md.

## 2026-10-15 — Sửa cập nhật PWA (`2026.10.15-learning.3`)

- Sửa bấm OK nhưng không reload khi worker chờ đã kích hoạt/mất khỏi registration.waiting; không hiện cập nhật giả khi cài lần đầu.
- Hiện trạng thái đang cập nhật, chặn bấm lặp, timeout có lỗi và thử lại; giữ unload guard khi activation chưa thành công.
- 133 unit (10 ca mới), 4 nhóm browser local và fixture stale banner trên production đạt; dữ liệu và offline reload được giữ. Tab còn mã cũ cần reload một lần, không xóa site data.
- Deployment dpl_GDsELjHYofnWQK4c8rKXsMukbQGC; giữ nguyên catalog, ngân hàng 166 câu, rules/backend và billing. Chi tiết PWA_UPDATE_FIX.md.

## 2026-10-15 — Ngữ pháp và đọc hiểu (`2026.10.15-learning.2`)

- Ngân hàng 166 câu: thêm 106 câu, 6 chuyên đề ngữ pháp, 4 bài Part 6, 6 bài Part 7 và 2 hội thoại; giữ catalog 1.575 từ và 60 câu gốc.
- Lọc độ khó, ôn theo chủ điểm, sổ lỗi và retry đúng câu có văn bản đọc; giữ nhóm câu trong bài đọc và tiếp tục bản nháp đúng phần.
- Lịch sử bank 2/document riêng, backup v4, nhập backup chỉ có bài luyện; bảo vệ dữ liệu cũ và đọc lại Cloud khi outbox gửi xong.
- 123 unit, 14 Emulator, 17 nhóm UI production, 6 client SDK, 4 browser Cloud và 6 candidate API đạt; QA đã dọn. Deployment dpl_13mQPZCec98JxX4emQ2x5hPi6Uxv. Avatar/native TTL vẫn tạm hoãn, billing không đổi.

## 2026-10-14 — Bảo vệ dữ liệu và mở rộng học tập (`2026.10.14-upgrade.4`)

- Atomic dataset activation, stale outbox archive/adopt và rollback sang UUID mới; 5 ca production hai browser đạt, ngắt sau 400 writes không mất dữ liệu active.
- Sổ lỗi sai từ attempts thật, lộ trình ngày thi theo thời gian học, đồng bộ/backup theo owner.
- 6 bài ngữ cảnh và 60 câu luyện riêng, transcript/dịch và local voice, Part 2/5 có timer/draft/kết quả.
- PDF/CSV/TSV/TXT import preview vào thư viện cá nhân; đọc đúng đủ 1.000 dòng PDF nguồn trên 23 trang, worker offline.
- Backup 20 MB, export Cloud history theo trang 500, dọn generations cũ qua xác nhận; settings/learning riêng để client cũ không xóa trường mới.
- Bounded Gemini retry; candidate AI 6 checks đạt; giữ model 3.5 Flash-Lite, avatar tắt và billing không đổi.
- Deployment dpl_HGYFgrQkjJWt3GbUfmUnQAfaGt8o đã promote; 11 ca feature production, 93 unit, 13 Emulator và public-asset security checks đạt.
- Ngày 15/10: Google OAuth và Calendar/Tasks/Drive create/read/delete tài khoản thật đều đạt; mục QA đã dọn.

## 2026-10-14 — Đăng nhập trực tiếp từ chế độ Khách (`2026.10.14-upgrade.2`)

- Thêm nút “Đăng nhập để đồng bộ” ở đầu mọi màn hình Khách trên điện thoại/máy tính, kể cả Cài đặt.
- Giữ profile/progress và phiên Khách trong khi mở Google; chỉ chuyển owner sau xác thực thành công. Hủy popup không mất dữ liệu; có hướng dẫn khi popup bị chặn hoặc mất mạng.
- Sau đăng nhập dùng bước “Gộp dữ liệu” hiện có, giữ tiến độ tài khoản cho từ trùng và giữ bản Khách riêng. Có xác nhận tạm dừng khi đăng nhập trong phiên học.
- Đã phát hành deployment `dpl_91LU7ikA2e8N5aSr25MpNFY6DK5h` lên `eng-master-main2.vercel.app`.
- Bốn regression cho popup/state; browser responsive và mở/đóng popup Google đạt. Báo cáo release: `output/verification/guest-login-release.json`.

## 2026-10-13 — Phát hành production `2026.10.13-upgrade.1`

- Đối chiếu repo và deployments, nối workspace với `quys-projects-d07a5005/eng-master-main2`; production domain `eng-master-main2.vercel.app`.
- Cấu hình Node 22 và model/release/quota không chứa khóa; snapshot rules Firebase cũ và activate ruleset mới sau khi kiểm tra.
- Sửa lỗi `ERR_MODULE_NOT_FOUND` do thiếu đuôi `.js` trong các import ESM server; thêm kiểm tra native Node cho 4 API vào CI.
- Người dùng đã cho phép chuyển server credentials lên Preview/Production dạng Sensitive; preview AI thật đã đạt và rules đã activate/kiểm tra hai tài khoản QA.
- Firebase native TTL bị chặn do billing/permission; thêm cleanup backend với hourly lease, xóa tối đa 100 quota hết hạn, giữ quota còn hiệu lực, lỗi cleanup không chặn AI. Emulator và cleanup thật đạt; không đổi billing.
- Candidate AI đạt Explain/Quiz/Mistake, invalid IDs, quota và avatar flag trước promote. Deployment `dpl_9B7x4Z4AQhRdzcZ6ca7nA8YBZGTv` đã phục vụ domain chính; HTTP/PWA và browser Cloud offline/reconnect/account switch đạt.
- Sau phát hành, phép thử AI ghi nhận lỗi 502/504 từ provider; gọi Gemini trực tiếp cũng gặp deadline. Giữ nguyên model 3.5 Flash-Lite, chưa coi AI ổn định.
- Express bundle nằm ngoài static `dist`; nâng timeout server lên 45 giây/client 55 giây; thêm override jose có phạm vi cho lỗi Firebase Admin trên Vercel.

## 2026-10-13 — Nâng cấp nền tảng, phiên học, thống kê và AI

- Tách AppShell/auth/router/repositories; thêm URL/history, Error Boundary và bảo vệ phiên dở.
- Lưu IndexedDB theo owner, transaction event/progress/outbox, retry/backoff, Cloud transaction và subscription; merge Khách có preview.
- Catalog bất biến, custom words/favorites/decks theo tài khoản; library có thêm/sửa/xóa, filter URL và học danh sách chọn. Giữ nguyên 1.575 mục bundled cùng ID/nội dung.
- Thẻ/rating/speech dùng chung; resume/partial Review, Practice và Quiz; planner due/weak/new, cloze và nghe–gõ.
- Thống kê 7/30/90 ngày và EF từ events thật, cảnh báo thiếu lịch sử legacy.
- Gemini `gemini-3.5-flash-lite`: API có Firebase auth, schema/ID, cache, timeout/cancel, quota ngày và log đã lọc bí mật; avatar Storage URL có flag tắt.
- Worker/offline pack sinh từ production build, PWA update giữ draft, self-host font/icons; giảm tài nguyên HTML tham chiếu xuống dưới 420 kB gzip.
- Google scope theo action, Calendar chọn giờ/lịch và retry; Settings mô tả đúng giới hạn reminder.
- Strict TypeScript, ESLint, CI Node 22, Emulator regressions, browser runner và release runbook; audit dependency hiện 0 lỗ hổng.
- Firebase Admin/Gemini đã gọi thật bằng tài khoản QA và dọn sạch. Đã phát hành theo mục trên; còn nghiệm thu Google/Workspace thật.
- Bằng chứng, phiên bản và giới hạn: [UPGRADE_VERIFICATION.md](docs/UPGRADE_VERIFICATION.md), [SYNC_POLICY.md](docs/SYNC_POLICY.md).

## 2026-10-13 — Đợt 1: lưu dữ liệu và sao lưu

- Sửa lịch sử flashcard chứa undefined, chống ghi phiên/thao tác lặp và đợi lưu trước chuyển thẻ/câu.
- Backup v3 phục hồi từ cá nhân, favorites, settings và hoạt động ngày; vẫn đọc legacy/v2.
- Nhập JSON/CSV có validation, preview, gộp/thay thế và xác nhận; dữ liệu lỗi không được ghi.
- Restore Cloud có snapshot/journal và rollback; dữ liệu khách có rollback khi lỗi ghi local.
- Thông báo lưu hồ sơ/mục tiêu/avatar theo kết quả ghi thực tế.
- Thêm unit/UI/Emulator regressions và kiểm tra browser. Xem [bằng chứng nghiệm thu](docs/PHASE1_VERIFICATION.md).
- Rules thêm trường progress tùy chọn `lastOperationId`; cần deploy rules trước frontend mới. Rules đã triển khai trong bản phát hành ở mục trên.
