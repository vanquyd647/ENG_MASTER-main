# Phát hành ENG_MASTER

Ngày: 15/10/2026. Learning.7 đã live trên eng-master-main2.vercel.app, deployment dpl_EXuHgSHHuJrWgAA4F8nZmdCnaXDR. Xem AI_LEARNING_MODULE.md, QUALITY_TARGET_95.md và output/verification/quality95-release.json. Prompt/schema v4 đọc được v3; backup v4 và rules không đổi. Bản này hoàn tất các sửa lỗi/khảo sát nêu trong hồ sơ, chưa hoàn tất mục tiêu 95% toàn hệ thống. Rollback ổn định: dpl_52TyUZfxB5cxsMrsQTDFSpNHNSSE (learning.6), giữ dữ liệu/rules.

Ưu tiên cập nhật 15/10/2026: người dùng tạm hoãn Avatar AI và native TTL, giữ tắt cả hai và giữ nguyên billing để ưu tiên tính năng học tập. Hướng dẫn bật các dịch vụ này bên dưới chỉ dành cho tương lai, khi người dùng thay đổi ưu tiên; không phải bước bắt buộc để phát hành tính năng học tập.

## Cấu hình

Dùng Node 22.x và `npm ci`. `.env.local` được gitignore, chỉ đặt trên máy local; môi trường deploy đặt qua dashboard/secret manager. `.env.example` là danh sách biến, không chứa bí mật. `VITE_FIREBASE_*` là cấu hình client, không thay thế service account.

Model text mặc định `gemini-3.5-flash-lite`, chọn bằng `GEMINI_TEXT_MODELS`. `GEMINI_TIMEOUT_MS` 45.000 ms (client 55 giây, Vercel function 60 giây); `AI_DAILY_REQUEST_LIMIT` 100 yêu cầu/người/ngày UTC. Giới hạn phút riêng theo endpoint. Quota giới hạn số request. Project hiện tắt billing; đợt phát hành này giữ cấu hình đó. Cache giải thích tối đa 256 entries/server instance và 40/owner trên browser, TTL 24h, version key `toeic-vi-v4` (vẫn đọc response v3). Cache bao gồm action và từ so sánh; từ cá nhân có owner trong khóa server, câu hỏi nhanh không cache. Chỉ new/vocabulary-reviewed.json được cho phép upload từ thư mục new/ để lookup ở backend; không upload PDF hoặc tài liệu còn lại. Native API check bao gồm JSON import.

Để lấy JSON: Firebase Console → đúng project → Cài đặt dự án → Tài khoản dịch vụ → Tạo khóa riêng mới. Lưu ngoài repo hoặc trong `.secrets/` đã ignore, rồi chạy `node scripts/configure-firebase-admin.mjs /đường/dẫn/service-account.json`. Script kiểm tra PEM và project, giữ Gemini key, ghi `.env.local` quyền 0600 và không in bí mật. Tài liệu chính thức: https://firebase.google.com/docs/admin/setup.

Cần Firebase Admin (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) hoặc Application Default Credentials có quyền Firestore để quota chạy. Không dùng API key client làm private key. Firebase Auth bật Google và whitelist hostname local/staging/production. Bật Tasks API, Calendar API và Drive API trong Google Cloud; cấu hình OAuth consent theo audience thực tế. Scope được hỏi ở từng action.

Avatar tắt mặc định `AI_AVATAR_ENABLED=false`. Chỉ bật sau khi có Storage bucket, billing/quota Imagen và nghiệm thu Storage. Dữ liệu ảnh nằm ở `avatars/{uid}/{uuid}.jpg`; profile chỉ lưu HTTPS URL. Server upload, client không được ghi arbitrary objects. Download token tạo URL chia sẻ: ai có URL có thể xem ảnh. Lập lifecycle/xóa ảnh cũ theo chính sách sản phẩm trước khi bật rộng.

## Gates

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run test:api-runtime
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run test:emulator
npm run build
node scripts/verify-release-build.mjs
npm audit --audit-level=high
```

CI `.github/workflows/check.yml` dùng Node 22/Java 21 và demo project. Không truyền credentials thật vào Emulator. Browser QA versioned trong `scripts/browser-acceptance.mjs`, chạy qua Playwright CLI theo hướng dẫn trong file.

Chạy `scripts/browser-pwa-update.mjs` với cùng `PLAYWRIGHT_CLI` để nghiệm thu confirm/update/draft/offline trên origin local riêng. Fixture chỉ thay cache revision của worker, không thay build hoặc dữ liệu tài khoản.

## Deploy staging

Firebase Admin và API text đã nghiệm thu local có xác thực; xem `output/verification/firebase-gemini-api-live.json`. Tài khoản QA/quota của phép thử đã được xóa. Google OAuth và Calendar/Tasks/Drive create/read/delete thật đã đạt; bằng chứng từng service và cleanup ở output/verification/google-workspace-real.json.

Frontend và API dùng Vercel; `api/gemini` và Express dùng chung handler. Không coi `firebase.json` là Hosting đủ backend AI. Deploy rules/indexes/storage trước frontend bằng Firebase CLI vào **project staging đã xác nhận**:

```sh
firebase deploy --project STAGING_PROJECT --only firestore:rules,firestore:indexes,storage
```

Quota quyết định theo window ID, không phụ thuộc việc xóa document hết hạn. Không cần tạo native TTL để dùng bản phát hành hiện tại. Query events hiện chỉ cần single-field index `occurredAt` mặc định. Tắt analytics trong môi trường QA dữ liệu giả (`VITE_FIREBASE_MEASUREMENT_ID` rỗng).

Cấu hình hiện tại không bật billing nên native TTL không enabled. Backend `quotaMaintenance.ts` dùng lease toàn cục một giờ, dọn tối đa 100 quota có `expiresAt <= now` khi có yêu cầu AI đã xác thực; lỗi cleanup không chặn AI. Giữ single-field ASCENDING index trên `expiresAt`; không xóa index này theo hướng dẫn TTL-only cũ. Không có cleanup theo lịch khi hệ thống không có AI traffic. Nếu muốn chuyển sang native TTL, kiểm tra billing/quyền index và giữ index cho fallback trước khi bật; không tự bật billing.

Kiểm tra cloud manual được version hóa: `node --import tsx scripts/check-cloud-release.mjs` tạo hai tài khoản QA disposable, kiểm tra client rules và cleanup; `node --import tsx scripts/check-hosted-ai.mjs URL /path/to/vercel/dist/index.js` kiểm tra Explain/Quiz/Mistake/quota/flag trên đúng ENG_MASTER deployment. Các script này dùng `.env.local` và không chạy CI có credentials thật.

Vercel đã link đúng `quys-projects-d07a5005/eng-master-main2`, repo `vanquyd647/ENG_MASTER-main`. Build `npm run build`, output `dist`, Node 22, function 60 giây. Server credentials đã được cấu hình dạng Sensitive cho Preview/Production theo sự cho phép của người dùng. `.vercelignore` loại `.env.local`, service-account JSON, dữ liệu QA và server build local khỏi gói upload. Phát hành bằng CLI từ workspace; chưa commit/push các thay đổi lên Git.

Khi phát hành bản tiếp theo, đặt `APP_URL` theo hostname production, `RELEASE_VERSION` và `VITE_RELEASE_VERSION` cùng release label. Gemini/Admin là biến server, client config dùng `VITE_FIREBASE_*`. Kiểm tra env presence mà không in giá trị; lưu private key dạng escaped newlines. Tạo preview, chạy API/PWA nghiệm thu rồi mới promote. Kiểm tra `.vercelignore` loại tài liệu dữ liệu QA và credentials khỏi gói upload nếu dùng CLI.

Browser Cloud đã đạt trên production: học offline → reload → reconnect, chuyển A/B ngay trong phiên, không lẫn từ cá nhân và quay lại A khôi phục catalog. Runner `scripts/browser-cloud-acceptance.mjs` dùng hai identity custom-token tạm và dọn toàn bộ dữ liệu QA; không thay thế popup Google/Workspace consent.

## Nghiệm thu tài khoản thật

1. Hai tài khoản đăng nhập/đăng xuất không lẫn preferences/catalog/progress; Khách có preview merge.
2. Học Cloud mất mạng, reload và reconnect; một event/operation, không mất pending.
3. Hai thiết bị chấm cùng từ, kiểm tra revision/events và quy tắc thứ tự transaction.
4. Gọi explain/quiz/mistake-review qua `/api/gemini` với Firebase ID token; ID/schema/tiếng Việt đúng, quota 429 và timeout rõ.
5. Calendar giờ/lịch được chọn, retry không tạo event trùng. Tasks/Drive quyền đúng action, kiểm tra retry/pagination và các trường hợp cạnh tranh.
6. Backup/restore staging bằng file synthetic, thử lỗi sau batch rồi rollback. Dataset pending lock và generation guard bảo vệ máy khác; stale outbox được export/archive trước adopt.
7. Production worker tải offline pack, offline reload mở màn chưa từng mở; API không cache; update giữ draft, missing chunk không nhận HTML.

## Canary và rollback

Avatar dùng server flag, mặc định tắt. AI text có thể tắt bằng bỏ khóa riêng trong staging hoặc giới hạn quota; học offline vẫn dùng được. Tạo preview trước, nghiệm thu rồi mới promote production theo domain người dùng xác nhận. Giữ release trước và checksum catalog.

Rollback frontend chỉ bằng upgrade.3 hoặc mới hơn, giữ rules tương thích đọc dữ liệu cũ và fields optional. Không hạ version/xóa IndexedDB tự động. Xuất backup trước khi restore/reset; nếu journal chưa hoàn tất dùng recovery trên đúng owner/thiết bị. Dataset rollback luôn sao chép sang UUID mới. Nếu phát hiện lệch schema hoặc mất dữ liệu, ngừng canary, giữ snapshot, không xóa outbox để che lỗi. Chính sách cạnh tranh/giới hạn còn lại: [SYNC_POLICY.md](SYNC_POLICY.md).

Upgrade.3 deployment `dpl_GP3bnjcqJjL8GFu1SYp7PneVdtBJ` là bản tương thích protocol tối thiểu. Upgrade.2/upgrade.1 và rules legacy-only không được dùng sau activation generation. Rules active/checksum và bản trước luôn ở output/verification/firebase-dataset-rules.json; snapshot private ở .secrets/firestore-release-*.json. Không tự xóa dữ liệu người dùng.

Bản mới dùng settings/learning riêng cho roadmap/kết quả, không để client cũ xóa chúng qua snapshot preferences. PDF.js 6.4.299 dùng worker đóng gói trong offline pack; Node build >=22.13.0. Các file tài liệu/audio trong new/ không upload. Browser QA mới: scripts/browser-dataset-acceptance.mjs và scripts/browser-upgrade-features.mjs, xem hướng dẫn trong từng script.

Workspace API phải bật trong project sở hữu OAuth client. Lỗi thật trả consumer project number 541667927343; dùng số này khi mở Cloud Console để tránh bật nhầm project. Calendar/Tasks chỉ đạt sau API activation; Drive đã tạo/đọc/xóa thành công. Không đổi billing hoặc cấu hình avatar.
