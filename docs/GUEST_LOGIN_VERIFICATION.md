# Đăng nhập và đồng bộ từ chế độ Khách

Ngày 14/10/2026; release `2026.10.14-upgrade.2`.

Nút “Đăng nhập để đồng bộ” hiển thị ở đầu các màn hình Khách trên mobile/desktop, kể cả Cài đặt. Đăng nhập Google thành công mở bước “Gộp dữ liệu Khách vào tài khoản”; người dùng chọn gộp hoặc giữ riêng. Từ trùng giữ tiến độ tài khoản; bản Khách vẫn còn trên thiết bị.

- Node 22.23.3: typecheck/lint, 74 unit tests, 4 native API runtime checks và production build đạt; catalog 1.575 mục không đổi. 7 Emulator tests không chạy lại cho thay đổi giao diện/auth popup này, đã đạt ở release trước.
- Browser local và production: nút hiện ở 360/390/768/1280 px và Cài đặt. Popup Google thật mở/đóng được; hủy giữ profile/progress và resume draft.
- Cloud qua browser trên local và production: hai từ Khách được gộp vào tài khoản thử; tiến độ từ trùng giữ repetitions=3 của tài khoản, từ mới giữ repetitions=1, bản Khách được giữ. QA đã dọn. Provider authentication được thay bằng custom-token fixture; chưa nghiệm thu consent Google bằng tài khoản người dùng.
- Báo cáo: `output/verification/browser-guest-login.json`, `browser-guest-merge.json` và `guest-login-release.json`.

Thay đổi này không nghiệm thu lại độ ổn định Gemini hoặc các Google Workspace API; các giới hạn release trước vẫn giữ.

Đã phát hành tại https://eng-master-main2.vercel.app, deployment `dpl_91LU7ikA2e8N5aSr25MpNFY6DK5h`. Domain chính đã kiểm tra đúng entry script và nhãn release; static/worker/manifest đạt, POST API thiếu token trả 401.
