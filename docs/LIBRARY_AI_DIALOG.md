# Hộp thoại giải thích AI trong Thư viện

Ngày 15/10/2026, release 2026.10.15-learning.5. Đã phát hành tại https://eng-master-main2.vercel.app, deployment `dpl_5Jbj8PBoqngsL2YiXdyBaNfwCJjx`.

Nút Giải thích bằng AI trong thẻ từ mở hộp thoại dùng chung với màn học. Không chèn lời giải vào lưới từ. Hộp thoại rộng tối đa 768 px trên desktop, có từ và nghĩa đang học, phần Markdown có màu; nội dung cuộn riêng, tiêu đề và nút đóng luôn nhìn thấy. Trong lúc mở, nền Thư viện không cuộn; đóng bằng nút X, Escape hoặc nền ngoài hộp thoại trả focus về nút đã mở.

Giữ loading và lỗi ngay trong hộp thoại; lỗi có nút Thử lại cho đúng từ, nghĩa và ID. Dùng lại cache theo owner, trình độ và từ của explainVocabulary; mở lại từ đã có cache không gọi AI lần nữa. Đóng trong lúc chờ hủy AbortController; phản hồi cũ không mở lại hộp thoại hoặc ghi đè từ vừa chọn. Đổi tài khoản đóng/hủy lời giải.

Browse chuyển sang callback onLearnMore đã có của AppShell; bỏ state/request/render giải thích inline. Trạng thái request được tách vào useAiExplanation để dùng chung, có kiểm tra request hiện tại và owner. Modal chỉ bật vùng body cuộn/khóa nền cho giao diện AI; các modal khác giữ chế độ mặc định.

Không đổi prompt/model, chấm điểm, catalog, ngân hàng 166 câu, schema/rules hoặc billing. Avatar/native TTL tiếp tục tạm hoãn. Không thay logic cập nhật PWA.

## Kiểm chứng

Bảy ca mới: truyền đúng ID/nghĩa, lỗi và thử lại, hủy/late response, hai request cạnh tranh, đổi owner, Thư viện mở dialog đúng/giữ filter và focus, khóa cuộn/trap bàn phím. Tổng 146 unit/UI/repository/HTTP đạt; typecheck/lint/catalog/build và bốn native API imports đạt. Browser local và production đều đạt bảy nhóm ca, gồm cả hồi quy quiz/Markdown màu. Auth/data QA đã dọn.

Browser runner scripts/browser-ai-layout.mjs dùng identity Firebase tạm và HTTP fixtures cho AI. Bao gồm hồi quy màu/quiz, dialog Thư viện, loading/lỗi/thử lại, kích thước thẻ không đổi, vị trí cuộn/filter/focus, body cuộn riêng trên mobile, cache và đóng trong khi chờ; nghiệm thu lại dialog trong lúc học. Không coi Markdown fixture là kết quả kiểm tra chất lượng Gemini. Tài khoản và dữ liệu QA được dọn sau kiểm tra.

Bằng chứng: output/verification/library-dialog-release.json, library-dialog-unit.log, library-dialog-browser-local.json, library-dialog-browser-production.json, library-dialog-build-metrics.json và library-dialog-public-build.json. Ảnh: output/playwright/library-ai-dialog-desktop.png và library-ai-dialog-mobile.png.

Local initial referenced gzip 396.076 byte; production 396.475 byte, dưới ngân sách 420.000. Offline pack 42 assets, revision 9c22753631c6998c; không thấy server secrets trong public build, nhãn release đúng, missing JS 404 và AI thiếu token 401. Catalog 1.575 mục và ngân hàng gốc 60 câu có hash không đổi. Không chạy lại Emulator/Gemini có token vì không đổi rules/backend/prompt. Git chưa commit/push.
