# Khôi phục và đồng bộ theo phiên bản dữ liệu

Ngày 14/10/2026. Protocol bắt đầu trong `2026.10.14-upgrade.3`; catalog 1.575 mục không đổi.

Tài khoản chưa khôi phục/reset tiếp tục dùng `users/{uid}/progress` và các collection legacy. Không tự di chuyển dữ liệu người dùng khi triển khai rules.

Restore/reset ghi vào `users/{uid}/datasets/{generation}/…`. Header `users/{uid}/system/dataset` giữ active/pending/previous. Trong lúc preparing, rules chặn ghi dữ liệu đang dùng; các thao tác mới vẫn được giữ local. Sau khi toàn bộ batch và snapshots đã ghi, một transaction kích hoạt header và hồ sơ. Nếu lỗi giữa các batch, header cũ vẫn active; reload trên thiết bị khởi tạo bỏ job dở. Có thao tác dừng job dở khi thiết bị khởi tạo không còn sẵn có.

Mọi outbox operation gắn generation tại lúc ghi IndexedDB. Transaction Cloud đọc header và từ chối generation cũ. Khi thiết bị nhận thay đổi với outbox cũ, UI yêu cầu tải bản sao/chọn tiếp nhận Cloud. Quá trình tiếp nhận dừng sender, lưu namespace cũ gồm tiến độ/events/drafts/outbox thành archive, rồi mới tải dữ liệu mới. Retry thất bại không được tạo lại operation đã archive/ACK. Archives tải được ở Cài đặt.

Rollback dữ liệu sao chép bản trước vào generation mới; không tái kích hoạt ID cũ vì có thể làm outbox của máy offline hợp lệ trở lại. Dữ liệu legacy và generations cũ hiện được giữ. Cleanup/bounded retention cho nhiều lần khôi phục thuộc N10.

SDK Firestore chỉ dùng memory cache. Subscriber bỏ qua snapshot từ cache/chưa được xác nhận, để cache rỗng của SDK không xóa IndexedDB khi reload offline. Reconnect tải header trước khi gửi outbox. Session transaction giữ session document và cộng duration theo giây, chống tính trùng khi lịch sử hồ sơ 50 phiên đã loại phiên cũ.

**Rollback triển khai:** sau khi một tài khoản có generation mới, frontend phải hiểu protocol này. Không đưa production về `upgrade.2` hoặc rules chỉ có legacy; dùng bản từ `upgrade.3` trở lên hoặc sửa tiếp. Rollback dữ liệu trong ứng dụng đã kiểm tra riêng. Không xóa IndexedDB để che lỗi đồng bộ.

Bằng chứng: `output/verification/browser-dataset-acceptance.json` dùng hai browser với QA identity, kiểm tra offline reload, máy cũ, archive, ngắt sau 400 staged writes và rollback. Unit/repository và 10 Emulator tests đạt; QA đã dọn.

## Tương thích lịch sử bài luyện mở rộng

Learning.2 thêm settings/extendedLearning trong từng dataset generation, dùng cùng owner/generation guards. Replace/rollback hiện tại sao chép cả ba document settings. Backup v4 giữ lịch sử bank 2; backup cũ thiếu trường mới giữ nguyên dữ liệu mở rộng khi merge. Client cũ ghi hai document cũ không sửa extendedLearning, nhưng không hiểu backup v4 hoặc các thao tác destructive với schema mới. Dùng bản hiện tại cho reset/restore/export đầy đủ. Rollback frontend phải giữ rules cho extendedLearning; không quay rules về phiên bản chặn document này.
