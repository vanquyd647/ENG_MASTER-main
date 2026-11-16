# Nghiệm thu bản nâng cấp ENG_MASTER

Cập nhật 14/10/2026: release hiện tại `2026.10.14-upgrade.2`, deployment `dpl_91LU7ikA2e8N5aSr25MpNFY6DK5h`, đã thêm đăng nhập trực tiếp từ Khách và bảo toàn dữ liệu khi hủy popup. 74 unit tests trên Node 22 đạt; kiểm tra browser/gộp Cloud trong [GUEST_LOGIN_VERIFICATION.md](GUEST_LOGIN_VERIFICATION.md). Bằng chứng nền tảng ngày 13/10 bên dưới được giữ làm baseline.

Ngày 13/10/2026. **Release `2026.10.13-upgrade.1` đã phát hành tại https://eng-master-main2.vercel.app**, deployment `dpl_9B7x4Z4AQhRdzcZ6ca7nA8YBZGTv`. Candidate AI đạt trước promote; phép thử sau phát hành ghi nhận lỗi provider 502/504. Core/PWA/Cloud đã đạt các kiểm tra dưới đây; Google OAuth/Workspace và avatar còn giới hạn nghiệm thu.

## Kết quả đã kiểm tra

| Kiểm tra | Kết quả | Bằng chứng |
|---|---|---|
| TypeScript strict, ESLint, vocabulary gate, production build | Đạt trên Node 22.23.3 | Các lệnh trong release runbook |
| Unit/UI/repository/HTTP | 70 test đạt; 7 test Emulator được chạy riêng | `npm test` |
| API native Node ESM | 4 endpoint import được và trả 401 khi thiếu Firebase token | `npm run test:api-runtime`, CI |
| Firestore Emulator | 7 test đạt: ownership, bounds, custom/history, rollback, concurrent transactions và quota | `npm run test:emulator`, Java 21, demo project |
| Browser production | 9 bước đạt: guest, chấm bằng keyboard, offline reload/Stats, partial review/practice, cloze 5/5, custom/deck/filter URL, backup, invalid CSV và responsive | `output/verification/browser-acceptance.json`, `output/playwright/acceptance-*.png` |
| PWA đổi release | Worker mới được xác nhận; thẻ applicant và draft còn sau reload | `output/playwright/upgrade-update-notice.png`, `upgrade-draft-after-update.png` |
| PWA update tự động | Confirm update, progress/draft không đổi và reload offline sau update đạt | `scripts/browser-pwa-update.mjs`, `output/verification/browser-pwa-update.json` |
| Firebase Admin thật | Đọc Auth và Firestore thành công trên `engai-2c7fe` | Probe chỉ đọc; không đổi tiến độ người dùng |
| Gemini qua API có xác thực | Explain 200, quiz 200 với 2 ID hợp lệ; duplicate IDs bị từ chối 400; quota có Timestamp TTL | `output/verification/firebase-gemini-api-live.json` |
| Browser Cloud trên production | Offline grade/reload/reconnect giữ đúng một từ; chuyển A/B trong phiên không lẫn custom words, quay lại A khôi phục catalog | `output/verification/browser-cloud-acceptance.json` |
| Rules thật qua Firebase client SDK | Ownership, bounds và immutable events đạt với hai identity tạm; ruleset mới đang active | `output/verification/firebase-rules-deployed.json`, `cloud-release-client-sdk.json` |
| AI candidate trước promote | Explain/Quiz/Mistake 200, invalid IDs 400, quota 429, avatar-disabled 503; QA đã dọn | `output/verification/hosted-ai-history/production-candidate-verified-pass.json` |
| AI sau phát hành | Chưa ổn định: có 502/504; gọi trực tiếp provider cũng có deadline; SDK 2 Interactions timeout 45 giây | `output/verification/hosted-ai-production.json`, `gemini-provider-error.json`, `gemini-interactions-probe.json` |
| Quota cleanup thật | Xóa quota hết hạn; native TTL không bật vì billing/permission, dùng backend fallback | `output/verification/quota-cleanup-live.json` |
| Dọn dữ liệu QA | Tài khoản custom-token và các quota document của phép thử đã xóa | Trường `cleanup` trong report API |
| Google provider/domain | Google đã bật; cả hai hostname ENG_MASTER được cho phép | `output/verification/firebase-auth-config-readonly.json` |
| Dependency audit | 0 lỗ hổng tại thời điểm kiểm tra | `npm audit`, dùng lockfile hiện tại |
| Catalog | 1.575 mục; 3 hash baseline giữ nguyên | `output/verification/build-metrics.json` |
| Frontend credentials | Gemini key và các đoạn private key đang cấu hình không có trong JS/CSS client | `node scripts/verify-release-build.mjs` |

Model text đang cấu hình và đã gọi thật: `gemini-3.5-flash-lite`. Phép thử dùng tài khoản QA được tạo bằng Firebase custom token; **chưa kiểm tra popup đăng nhập Google thật**. Admin SDK bỏ qua Firestore rules; kiểm tra rules dùng Firebase client SDK riêng đã đạt với hai tài khoản QA. Rules mới đã active; xem report rules deployment.

## Thay đổi đã có trong source

- AppShell/router/auth controller/repositories tách khỏi App; route có URL/Back và bảo vệ phiên dở; Error Boundary và lazy loading.
- Catalog bundled bất biến; custom words, favorites, decks theo owner; tìm kiếm/filter giữ URL, thêm/sửa/xóa có validation và chính sách giữ lịch sử.
- IndexedDB lưu tiến độ, event, draft, outbox; chấm thẻ lưu transaction trước chuyển thẻ; retry/backoff/operation IDs, ACK và Cloud transaction giữ thao tác mới đang chờ. Realtime subscription có kiểm tra owner khi đổi tài khoản.
- Preview merge Khách, backup v3 có events/decks và vẫn đọc legacy/v2. Snapshot/journal bảo vệ restore; không thực hiện destructive job khi còn pending trên thiết bị.
- Review/Practice dùng chung thẻ/rating 1/3/4/5, phím tắt, speech; phiên dở và kết thúc sớm giữ số từ thực. Quiz/cloze/listening ghi evidence, không đổi lịch SM-2 tự đánh giá.
- Planner đến hạn/từ yếu/từ mới; thống kê 7/30/90 ngày và EF dựa trên events thật; cảnh báo lịch sử legacy thiếu chi tiết.
- AI giải thích theo trình độ, quiz dùng ID và schema chung, sửa lỗi theo attempts; cache/version/timeout/cancel, auth/quota server và log đã lọc bí mật. Avatar chuyển sang Storage URL trong source nhưng flag tắt.
- Production worker sinh từ hash build, precache screens/font/icons; API không cache, JS thiếu không nhận HTML. PWA update có xác nhận và giữ draft.
- Google scope theo tác vụ, token reuse/retry, Calendar ID xác định, Tasks/Drive kiểm tra bản ghi trước tạo; giờ/lịch được chọn. Reminder nói đúng giới hạn khi trang đang mở.
- CI Node 22, Emulator và runbook staging/canary/rollback. `.env.local` và service-account JSON được ignore, quyền file 0600.
- Express bundle/sourcemap nằm trong `build/`, tách khỏi `dist/` được public trên Vercel và local static server; gói upload loại service-account/env/QA artifacts.

## Hiệu năng và phiên bản thực

Tài nguyên JS/CSS mà HTML tham chiếu giảm từ 509.055 xuống **378.108 byte gzip**, dưới mục tiêu 420.000; số này không gồm font hoặc background precache. Stats/chart không nằm trong dependency/preload ban đầu; worker vẫn tải chúng trong offline pack để mở Stats offline lần đầu. Firebase vendor còn trên 500 kB minified nên build vẫn có cảnh báo kích thước.

Đo Chrome local production trong `output/verification/browser-performance.json` ghi navigation/paint và thời gian mở Stats lần đầu/mở lại đến khi heading xuất hiện. Đây là phép đo local, không thay thế benchmark mạng di động hoặc chỉ số production.

Phép đo fresh guest gần nhất: FCP 1.840 ms, Stats lần đầu 1.873 ms, mở lại 31 ms. Background offline precache có thể chạy cùng lúc; không dùng số này làm cam kết SLA.

| Công cụ/thư viện | Phiên bản trong môi trường đã kiểm tra |
|---|---|
| Node | 22.23.3 |
| Vite / TypeScript | 6.4.3 / 5.8.3 |
| React / ReactDOM | 19.2.6 |
| Firebase / Firebase Admin | 12.13.0 / 14.2.0 |
| Google GenAI runtime | 1.52.0 |
| Vitest / ESLint / typescript-eslint | 4.1.11 / 10.12.0 / 8.71.2 |
| Firebase CLI trong CI | 15.33.0 |
| Vercel CLI dùng đối chiếu project | 63.1.2 |

Firebase Admin có override jose 4.15.9 riêng cho jwks-rsa để sửa lỗi CommonJS/ESM đã tái hiện trên Vercel; xem [DEPENDENCY_NOTES.md](DEPENDENCY_NOTES.md).

TypeScript bật strict toàn dự án. ESLint kiểm tra unused và các quy tắc recommended; `no-explicit-any` và `no-empty-object-type` còn tắt cho code legacy/test, không tuyên bố đã loại hết `any`. Catalog fixture không lint nhưng vẫn qua TypeScript và vocabulary gate.

## Trạng thái phát hành và giới hạn còn lại

1. Đã đăng nhập và đối chiếu Vercel: project `eng-master-main2` liên kết `vanquyd647/ENG_MASTER-main`, deployment cũ mới nhất `dpl_7dJrAHi9M38Cygf8FLJAVCoKoMqh`, cùng commit 70f2d7d với main. Domain production `eng-master-main2.vercel.app` đã được Firebase cho phép. Workspace đã link đúng project, Node 22 và nhãn release `2026.10.13-upgrade.1`. Xem `output/verification/vercel-projects-readonly.json`, `vercel-release-config.json` và `vercel-preview.json`.
2. Người dùng đã cho phép rõ việc cấu hình Sensitive server credentials cho Preview/Production và phát hành. Đã cấu hình 15 biến từ local trên đúng project, giữ Node 22/model/quota/release configs. Preview AI có Firebase token thật đạt Explain/Quiz/Mistake 200, invalid IDs 400, quota 429 và avatar flag 503; tài khoản/quota QA đã dọn. Rules mới đã activate và qua kiểm tra client SDK bằng hai tài khoản tạm, ownership/bounds/immutable events đạt. Native TTL không khả dụng do project tắt billing và service account thiếu quyền index; đã triển khai fallback backend dọn tối đa 100 quota hết hạn mỗi giờ khi có AI activity, global lease, lỗi dọn không chặn AI. Cleanup thật đã đạt, không đổi billing. Candidate đã đạt và được promote; public HTTP/root/worker/manifest, missing JS 404 và API thiếu token 401 đã xác nhận. Sau phát hành AI có lỗi provider; chưa kết luận ổn định.
3. Browser Cloud hai identity custom-token đã đạt học offline/reload/reconnect và chuyển A/B ngay trong phiên. Popup Google và consent/Tasks/Calendar/Drive vẫn cần nghiệm thu tài khoản Google thật. Probe Service Usage chỉ đọc trả 403 nên chưa xác định được trạng thái các Workspace API; không suy ra chúng đã bật hoặc tắt.
4. Avatar giữ tắt đến khi kiểm tra bucket/rules/Imagen thật. Nhắc khi đóng app cần push/backend riêng, ngoài reminder hiện tại.

Runner PWA riêng dùng các assets production với fixture đổi cache revision của worker trên origin local độc lập; xác nhận một câu đã chấm, cursor 1, draft applicant vẫn còn và reload offline được. Đây là regression cho UI/worker/draft, không phải promote một deployment Vercel.

Các giới hạn kỹ thuật vẫn tồn tại được ghi trong [SYNC_POLICY.md](SYNC_POLICY.md): journal local chưa có backend dataset epoch/lease để bảo vệ restore/reset khi máy khác ghi; preferences là snapshot một document; lịch sử Cloud có giới hạn 10.000 events trong 90 ngày; Tasks/Drive check-before-create chưa bảo đảm unique giữa hai thiết bị. Không dùng checkbox implementation để suy ra các tình huống này đã được nghiệm thu.

Browser không phát hiện overflow ở 360/390/768/1280 px. Hai cảnh báo kích thước Recharts tạm thời từng xuất hiện khi chuyển màn; chưa thực hiện audit WCAG độc lập. AI đã qua schema và review mẫu tiếng Việt; chưa có benchmark đảm bảo mọi distractor/giải thích đúng về ngữ nghĩa.

## Chạy lại

Theo [RELEASE_RUNBOOK.md](RELEASE_RUNBOOK.md), chạy gates trên Node 22 và Emulator demo. Sau build chạy `node scripts/verify-release-build.mjs`. Runner guest chỉ nhận localhost/127.0.0.1 và dùng session Khách synthetic riêng. Runner Cloud riêng chỉ nhận local hoặc domain ENG_MASTER đã xác nhận, tạo hai tài khoản tạm và dọn dữ liệu trong finally; lần gần nhất chạy trên production đã đạt.

SDK 2.29.0 được cài riêng trong thư mục tạm để chẩn đoán Interactions API với `store=false`, giữ model 3.5 Flash-Lite. Phép thử vẫn timeout 45 giây; không đổi dependency/API production chỉ dựa vào phép thử thất bại này. Các báo cáo AI được giữ theo thời điểm trong `output/verification/hosted-ai-history/`. Bản core đã phát hành không đồng nghĩa dịch vụ AI luôn khả dụng.
