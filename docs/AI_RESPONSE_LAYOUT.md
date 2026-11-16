# Bố cục phản hồi AI

> Đây là bằng chứng giao diện của learning.4. Từ learning.5, Thư viện dùng hộp thoại riêng thay cho lời giải inline; xem [LIBRARY_AI_DIALOG.md](LIBRARY_AI_DIALOG.md).

Ngày 15/10/2026, release 2026.10.15-learning.4. Đã phát hành tại https://eng-master-main2.vercel.app, deployment `dpl_2ut12FjLSgZ3zb7ZvnWGZKYQrbFY`.

## Thay đổi

Thay các lớp prose chưa có stylesheet bằng AiResponse dùng chung: tiêu đề có cấp bậc, đoạn văn giãn dòng, danh sách có marker, trích dẫn có nền và đường viền, inline code khác code block, link có gạch chân. Bảng màu phù hợp nền tối; mỗi khối vẫn có nhãn chữ và đường viền, không truyền đạt ý nghĩa chỉ bằng màu.

| Nội dung | Màu |
|---|---|
| Nghĩa/đáp án đúng | Xanh lá |
| Câu đã chọn sai | Hồng |
| Giải thích lỗi | Tím |
| Ví dụ song ngữ | Xanh dương |
| Bài ôn, mẹo ghi nhớ | Vàng |

Bộ trình bày tách các nhãn quen thuộc ở đầu dòng, kể cả phản hồi cũ có nhiều nhãn trong một paragraph. Giữ Markdown và nội dung, không suy đoán tính đúng/sai của đoạn văn không có nhãn. Code fence không bị nhận nhầm là câu trả lời. Không cho raw HTML chạy trong nội dung AI.

Hai khối nghĩa đúng/câu đã chọn có thể đặt cạnh nhau trên desktop và xếp dọc trên mobile. Ví dụ, giải thích, bài ôn và đáp án bài ôn chiếm đủ chiều rộng. Kết quả quiz rộng tối đa 768 px để đọc lời giải dài. Lỗi gọi AI được hiển thị bằng alert riêng, không đưa vào phần nội dung giải thích; thử lại thành công xóa alert.

Dùng chung trong: AI phân tích lỗi ở kết quả quiz, giải thích trong thư viện, hộp thoại từ đang học và giải thích từng câu quiz. Không thay prompt/model, nội dung catalog, chấm điểm, schema đồng bộ, rules, billing hay PWA update handler. Avatar/native TTL tiếp tục tạm hoãn.

## Kiểm chứng

139 unit/UI/repository/HTTP tests đạt, gồm sáu ca mới về Markdown cũ, nhãn plain/bold, danh sách lồng nhau, fallback, HTML/link và lỗi/retry. Typecheck/lint/catalog/build và bốn native API imports đạt. Catalog 1.575 mục và ngân hàng gốc 60 câu có hash không đổi.

Browser runner scripts/browser-ai-layout.mjs dùng một Firebase QA identity tạm và intercept HTTP phản hồi AI bằng Markdown fixture để nghiệm thu bố cục có thể lặp lại. Không gọi Gemini và không coi nội dung fixture là kết quả kiểm tra chất lượng mô hình. Runner xóa tài khoản và toàn bộ dữ liệu QA sau kiểm tra. Các bề mặt: kết quả quiz/lỗi/thử lại, 360/390/768/1280 px, thư viện inline và hộp thoại học.

Local và production đều đạt năm nhóm ca browser, gồm lỗi/retry, năm màu khác nhau, layout ở bốn chiều rộng, thư viện và modal. Auth/data QA đã được xóa. Đây là kiểm tra trình bày qua fixture; không chạy lại kiểm tra chất lượng mô hình hoặc Emulator vì prompt/backend/rules không đổi.

Local initial referenced gzip 395.679 byte; production 396.135 byte, dưới ngân sách 420.000. Offline pack 42 assets, revision 097929a0ba53800a. Public scan không thấy server secrets đã cấu hình; nhãn phiên bản đúng, missing JS 404 và AI thiếu token 401.

Bằng chứng: output/verification/ai-layout-release.json, ai-layout-unit.log, ai-layout-browser-local.json, ai-layout-browser-production.json, ai-layout-build-metrics.json và ai-layout-public-build.json. Ảnh: output/playwright/ai-review-desktop.png, ai-review-mobile.png, ai-inline-explanation.png và ai-explanation-modal-mobile.png. Git chưa commit/push.
