# Chính sách lưu và đồng bộ

Cập nhật 14/10/2026. Catalog `toeic-1575-v1`: 1.575 mục giữ nguyên ID/nội dung đã duyệt.

- IndexedDB `eng-master-local-v1` giữ dữ liệu bền vững. Khách và mỗi UID có namespace riêng; phiên bản database không bị hạ/xóa khi cập nhật app.
- Study event, progress và outbox ghi cùng transaction trước khi đổi thẻ. Event ID chống chấm lặp; ACK chỉ thay progress nếu chưa có thao tác mới hơn. Session ID chống cộng thời gian lặp kể cả sau khi log rời history 50 mục của profile.
- Cloud tính SM-2 trên trạng thái mới nhất trong transaction, tăng revision, giữ thời gian lịch không đi lùi. Quiz từ vựng chỉ cập nhật đúng/sai và wrongCount, giữ lịch tự đánh giá. Sổ lỗi sai dựa trên snapshot câu trả lời mới, không dựng đáp án cho dữ liệu cũ.
- Outbox có thứ tự `queuedAt` và dataset generation được chụp lúc tạo. Web Locks điều phối các tab cùng trình duyệt; pause sync đợi sender đang chạy trước khi archive. Retry thất bại không dựng lại outbox đã được ACK/archive.
- Firestore client dùng memory cache; chỉ snapshot server đã commit được phép thay dữ liệu IndexedDB. Snapshot rỗng từ cache khi reload offline không xóa tiến độ đã lưu.

## Restore, reset và rollback

Metadata `users/{uid}/system/dataset` gồm active, pending, previous. Job tạo generation UUID mới, stage các collections và snapshot, đánh dấu ready rồi kích hoạt bằng một transaction nhỏ. Legacy data đọc ở đường cũ cho tới lần thay dữ liệu đầu tiên; không tự di chuyển tài khoản khi phát hành.

Rules chặn ghi bình thường khi pending và chặn generation cũ sau activation. Nếu job bị ngắt, dữ liệu active cũ vẫn nguyên vẹn. Reload xử lý journal của đúng owner; UI cho dừng job bị bỏ dở. Hai thiết bị không cùng sở hữu pending job.

Thiết bị có outbox thuộc generation cũ phải giải quyết trước khi gửi tiếp: tải backup gồm thao tác chưa gửi, rồi nhận Cloud mới và giữ namespace archive. Các archive được tải trong Cài đặt. Không tự phát lại thao tác cũ vào dữ liệu mới.

Rollback sao chép bản trước vào một UUID mới; không tái kích hoạt UUID cũ, tránh cho outbox cũ trở lại hợp lệ. Dọn các lần khôi phục xa hơn chỉ khi người dùng xác nhận trong Cài đặt. Rules bảo vệ active, pending và previous; legacy data vẫn được giữ. Không tự xóa archive của thiết bị.

Frontend/rules rollback tối thiểu phải hiểu giao thức generation: release `2026.10.14-upgrade.3` hoặc bản mới hơn. Không promote lại upgrade.2/upgrade.1 hoặc rules legacy-only sau khi một tài khoản đã dùng generation.

## Cài đặt, thư viện cá nhân và bài luyện

Preferences thuộc UID, gồm custom words, favorites, decks, cỡ phiên và giờ nhắc. Roadmap và kết quả bài luyện ở settings/learning riêng, để client cũ ghi settings/preferences không xóa các trường mới. Snapshot mới nhất theo thời điểm gửi thắng; chưa có CRDT hay merge từng trường cho hai thiết bị sửa cùng lúc.

Payload tài khoản được kiểm tra trước khi lưu: tối đa 800.000 ký tự mỗi chuỗi và 900.000 byte JSON tổng. Import hàng loạt chuẩn bị/kiểm tra tất cả mục rồi ghi từ và bộ từ bằng một local transaction có rollback. Không tăng không giới hạn số từ cá nhân trong một document; cần thiết kế collection từng từ trước khi mở phạm vi lớn hơn.

Bài ngữ cảnh/Part 2/Part 5 có bank ID riêng và kết quả riêng, không giả mạo word ID hoặc chấm SRS. Giữ 100 kết quả gần nhất; UI hướng dẫn xuất backup trước khi vượt ngưỡng. Phiên bài luyện đang dở lưu riêng trên thiết bị; deadline của bài có thời gian tiếp tục khi đóng trang. Kết quả hoàn thành đồng bộ theo tài khoản.

Âm thanh hội thoại chỉ dùng voice tiếng Anh có localService=true; không yêu cầu dịch vụ TTS online. Thiết bị thiếu voice được thông báo và vẫn đọc transcript. PDF được đọc cục bộ bằng PDF.js; chỉ tự nhận cột ở layout bảng đã nhận diện, layout khác cần sửa và điền nghĩa. Không có OCR cho bản scan. Các tài liệu/audio cá nhân trong new/ không được đưa lên hosting.

## Lịch sử và backup

UI Cloud theo dõi tối đa 10.000 events trong 90 ngày; IndexedDB giữ events đã có. Sổ lỗi sai phân trang 50 mục. Xuất JSON khi online đọc toàn bộ Cloud events theo trang 500 và gộp events local chưa gửi, kiểm tra generation ở đầu/cuối. Đây là bản sao tiến độ đang có trên thiết bị cộng lịch sử Cloud; không phải snapshot transaction toàn database trong lúc máy khác tiếp tục học.

Backup v3 có events/attempts, custom words, decks, daily activity, optional roadmap/practiceRecords và giây học. File tối đa 20 MB, 50.000 events; vẫn đọc legacy/v2/v3 cũ, thiếu trường mới không tự xóa chúng. Backup lớn hơn giới hạn bị từ chối rõ ràng trước restore; chưa có xuất/khôi phục lịch sử vô hạn theo nhiều file.

Merge Khách có preview, giữ progress/profile tài khoản khi trùng, gộp dữ liệu riêng và giữ bản Khách. Roadmap tài khoản được ưu tiên; nếu tài khoản chưa có thì nhận roadmap Khách. Không tự chuyển sang Khách khi Cloud mất mạng.

Google scope theo action, token giữ trong bộ nhớ và chỉ hỏi lại khi hết hạn hoặc thiếu scope. Calendar dùng ID xác định; Tasks/Drive kiểm tra trước khi tạo. Tasks/Drive chưa bảo đảm unique tuyệt đối nếu hai thiết bị tạo đồng thời hoặc Google nhận POST nhưng phản hồi bị mất. Kiểm tra kết nối tạo/đọc/xóa mục QA riêng, không thay nội dung cá nhân đã có.

## Bài luyện mở rộng (learning.2)

Lịch sử bank 2 dùng eng_master_extended_practice_v1 ở settings/extendedLearning, tách khỏi hai document settings cũ. Payload thiếu namespace này bỏ qua document; không coi thiếu dữ liệu là yêu cầu xóa. Cập nhật server đến khi outbox còn pending được đọc lại sau khi hàng đợi gửi xong, kiểm tra owner/generation và local version trước khi áp dụng. Giới hạn 100 bài mỗi namespace; bản nháp v2 chỉ nằm trên thiết bị. Backup có namespace mới dùng v4; xem LEARNING_CONTENT_UPGRADE.md.
