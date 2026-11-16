# Sửa nút cập nhật bị kẹt

Ngày 15/10/2026, release 2026.10.15-learning.3. Đã phát hành trên https://eng-master-main2.vercel.app, deployment `dpl_GDsELjHYofnWQK4c8rKXsMukbQGC`.

## Nguyên nhân và cách sửa

Banner giữ một ServiceWorkerRegistration trong React. Sau khi worker được kích hoạt (chẳng hạn bởi một tab khác), registration.waiting trở thành null nhưng banner vẫn còn. Handler cũ đăng ký controllerchange rồi chỉ gửi SKIP_WAITING bằng optional chaining. Nếu sự kiện đã xảy ra và waiting không còn, bấm OK không làm gì.

Sau xác nhận, handler mới tải lại ngay nếu không còn worker chờ; nếu còn thì đợi controllerchange hoặc activated rồi tải lại đúng một lần. Nút hiện Đang cập nhật… và chặn bấm lặp. Sau 12 giây chưa kích hoạt được, giao diện báo lỗi và cho thử lại. Chỉ đặt cờ cho phép unload ngay trước khi tải lại, không bỏ bảo vệ phiên khi cập nhật bị kẹt. Cài offline lần đầu không hiện nhầm banner cập nhật.

Không xóa storage, IndexedDB, tiến độ hoặc bản nháp. Không thay schema, rules, dữ liệu học, billing hay model. Avatar/native TTL tiếp tục tạm hoãn.

Đối chiếu API: [waiting](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/waiting) và [worker state](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker/state). Chưa có quyền truy cập trình duyệt của người dùng; nguyên nhân được xác nhận bằng tái hiện tương ứng trên browser QA.

## Bằng chứng

- Build cũ: cập nhật bình thường đạt nhưng trường hợp banner còn sau activated không reload; browser regression thất bại đúng bước đó. Báo cáo pwa-before-fix.json và pwa-before-fix.log.
- Build sửa: 133 unit/UI/repository/HTTP tests đạt, gồm 10 ca mới cho worker biến mất, kích hoạt, thông báo trùng, timeout/retry, lỗi gửi lệnh, worker bị thay, cài lần đầu, busy/cancel và để sau. Typecheck/lint/catalog/build và 4 native API imports đạt.
- Browser QA local: bốn nhóm đạt — cài lần đầu; cập nhật bình thường và offline reload; hủy/để sau; worker đã activated nhưng bấm OK vẫn reload, hết banner và tiếp tục đúng thẻ applicant. IndexedDB vẫn có một lần chấm, cursor 1 và một completed ID.
- Catalog 1.575 mục và ngân hàng gốc 60 câu có hash không đổi. Local initial referenced gzip 394.781 byte, offline pack 42 assets; public build không chứa server credentials đã cấu hình.

Các bằng chứng nằm tại output/verification/pwa-fix-unit.log, pwa-fix-browser.json, pwa-fix-build-metrics.json. Script browser-pwa-update.mjs dùng worker fixture trên origin local riêng, không thay service worker hoặc dữ liệu tài khoản production.

Production đã xác minh trên browser Khách riêng: dùng registration thật với waiting null, phát sự kiện để hiện banner stale, bấm xác nhận gốc của trình duyệt; trang tải lại, hết banner và tiếp tục đúng applicant. IndexedDB giữ repetitions 1, cursor 1, completed IDs 1; offline reload đạt. Đây là fixture banner trên app production, không giả rằng có deployment tiếp theo.

Một phép thử tab đang mở learning.2 đã timeout khi chờ entry đổi; không tính ca đó là đạt. Bằng chứng giữ ở pwa-production-transition-first-attempt.json. Mã cũ trên tab người dùng chỉ được thay sau khi reload; tải lại một lần nhận handler mới, không cần xóa dữ liệu.

Public build learning.3 đạt: 42 assets, initial referenced gzip 395.226 byte, nhãn đúng, missing JS 404 và AI thiếu token 401. Bằng chứng: output/verification/pwa-fix-release.json, pwa-fix-production-browser.json và pwa-fix-public-build.json. Ảnh: output/playwright/pwa-production-updated.png. Rules/backend không thay nên không chạy lại Emulator hoặc AI có token cho bản vá này. Git chưa commit/push. Người dùng còn mở trang với JavaScript cũ cần tải lại trang một lần để nhận handler mới; không cần xóa dữ liệu website.
