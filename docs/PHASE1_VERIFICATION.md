# Đợt 1 — Lưu dữ liệu và sao lưu

Ngày: 13/10/2026. Phạm vi: U01–U06 của [PROJECT_PLAN.md](../PROJECT_PLAN.md).
Trạng thái: implementation và kiểm tra local hoàn tất; chưa triển khai lên Firebase/Vercel production.

## Thay đổi đã thực hiện

- Lịch sử học dùng bộ kiểm tra/serializer chung: không ghi các trường `undefined`, kiểm tra ngày/điểm/ID và dùng UUID của phiên để tránh ghi lặp khi thử lại. Khách và Cloud cùng áp dụng quy tắc.
- Progress/profile của một lần chấm được ghi cùng một Firestore batch. Giao diện cập nhật tiến độ sau khi lưu thành công; lỗi lưu giữ lại thẻ/câu hỏi để thử lại.
- Review, Practice và Quiz có khóa thao tác trong lúc lưu/chuyển câu; callback lưu và kết thúc phiên được `await`. Operation ID ổn định được lưu cùng progress, session ID được kiểm tra trùng trong lịch sử đang giữ.
- Hồ sơ, mục tiêu ngày và avatar chỉ báo thành công sau callback lưu xong; lỗi giữ trạng thái để thử lại.
- Backup **v3** chứa profile/history, progress, định nghĩa từ cá nhân, favorites, cài đặt học và dailyActivity. V2 và dạng legacy vẫn nhập được; tập ID được lấy lúc kiểm tra, không còn chụp từ khi import module.
- JSON/CSV được kiểm tra trước khi ghi, giới hạn 5 MB và tối đa 10.000 progress rows. CSV có kiểm tra tiêu đề, số cột, dòng lỗi, ID trùng/lạ, số SRS và ngày. CSV chỉ chứa tiến độ; dùng JSON v3 để chuyển từ cá nhân sang trình duyệt khác.
- Có preview, số lượng dữ liệu, lựa chọn gộp/thay thế và nút xác nhận riêng. Chọn gộp giữ settings/profile đang dùng, thêm dữ liệu mới và dùng progress trong file khi trùng ID. ID từ cá nhân xung đột nội dung bị từ chối.
- Restore khách chuẩn bị toàn bộ giá trị trước khi ghi và khôi phục các khóa cũ nếu một lần ghi lỗi. Restore Cloud chụp dữ liệu **từ server**, giữ journal local trước thao tác xóa, rollback khi lỗi; nếu rollback chưa được, giữ journal và chặn tiếp tục học để phục hồi khi kết nối lại.

## Tương thích và cách triển khai

`ProgressItem.lastOperationId` là trường tùy chọn mới; rules và blueprint đã cập nhật để chấp nhận nó. **Triển khai rules mới trước frontend mới** trên staging/production để các lần chấm thẻ không bị rules cũ từ chối. Dữ liệu progress cũ không cần đổi ID hay bổ sung trường này.

File JSON v2/CSV không có dailyActivity hoặc settings nên giữ các dữ liệu đó. JSON v3 khi chọn thay thế phục hồi dữ liệu có trong file, bao gồm custom vocabulary; history/streak thiếu trong một file v3 được đặt rỗng/0 để không trộn lịch sử của dataset cũ. UID/email của tài khoản hiện tại luôn được giữ.

Journal Cloud nằm trong localStorage theo UID trên **trình duyệt thực hiện restore**. Sau lỗi hoặc reload, ứng dụng cố phục hồi snapshot trước khi tải dữ liệu học. Cơ chế này chưa khóa cập nhật từ các thiết bị khác và chưa thay thế thiết kế dataset-version/server journal dự kiến trong đợt 3. Không xóa dữ liệu trình duyệt khi cần phục hồi journal. LocalStorage rollback cũng chưa phải transaction IndexedDB; migration lưu bền vững vẫn thuộc đợt 3.

Idempotency hiện tại bảo vệ thao tác của phiên đang chạy và history đang giữ 50 mục. Session draft, event log dài hạn và chính sách xung đột giữa nhiều thiết bị thuộc đợt 3–4.

## Kiểm tra đã chạy

| Kiểm tra | Kết quả |
|---|---|
| Unit/UI + Firestore Emulator cùng lượt | 55 test đạt / 14 file |
| TypeScript | Đạt |
| Vocabulary gate | 1.575 mục đạt, không cảnh báo |
| Production build | Đạt |
| Hash dữ liệu từ vựng | Hai source catalog và JSON review trùng hash lưu trước đợt sửa |
| Firebase Web SDK + rules thật trên Emulator | Lưu review không undefined; session chỉ ghi một lần; quyền tài khoản khác bị từ chối |
| Restore Cloud bị lỗi ở chunk thứ hai | Đã ghi 400 từ nhập rồi ngắt; rollback trả lại progress/profile cũ |
| Journal rollback chưa được | Unit test giữ snapshot, chặn restore mới và phục hồi ở lần sau |
| Lỗi localStorage ở lần ghi thứ hai | Profile/progress khách trở về dữ liệu trước restore |
| Nhấn chấm thẻ liên tiếp/lỗi lưu | Unit UI test chỉ gọi một lần; thẻ vẫn giữ để thử lại |
| Cài đặt lưu lỗi | Không có toast thành công trước kết quả; nút khóa trong lúc lưu |
| Trình duyệt: phiên học 5 thẻ | Lưu 5 progress, 1 history, streak và hoạt động ngày |
| Trình duyệt: CSV lỗi/preview/hủy | Tiến độ giữ nguyên trước khi xác nhận |
| Trình duyệt: gộp và backup round-trip | 5 progress cũ + 1 custom; định nghĩa/favorites/settings/history phục hồi trên storage sạch và còn sau reload |
| Preview trên điện thoại | Hộp thoại nằm trong viewport 390×844 |

Ảnh kiểm tra: [preview mobile](../output/playwright/phase1-import-mobile.png), [từ cá nhân sau phục hồi](../output/playwright/phase1-custom-word-restored.png), [phiên review](../output/playwright/phase1-review-completed.png).
Dữ liệu kiểm thử là guest/demo tổng hợp; không dùng progress người dùng thật.

## Chạy lại kiểm tra

```bash
npm run typecheck
npm test
npm run validate:vocab
npm run build
```

`npm test` mặc định bỏ qua 3 test Emulator; chạy với Emulator để có đủ 55 test:

```bash
# Terminal 1: Firebase CLI đã cài và Java runtime phù hợp.
JAVA_TOOL_OPTIONS="-Duser.language=en -Duser.country=US" firebase emulators:start --only firestore --project demo-eng-master

# Terminal 2
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run test:emulator
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm test
```

Trong lượt kiểm tra này, Java portable 21 và Firestore Emulator 1.22.0 được tải từ nguồn chính thức, xác minh SHA256 và chạy trong `/private/tmp`; không cài Java toàn hệ thống. Locale JVM cần `en_US` để tránh lỗi resource `JValidationMessages_messages` khi host dùng `vi_VN`. Emulator chỉ dùng dự án `demo-eng-master` và địa chỉ localhost; các test từ chối remote host.

Node local là 26.5.0; gate Node 22 và kiểm tra Google/Gemini/Firebase production vẫn thuộc đợt phát hành. Không thay đổi nội dung 1.575 từ, không deploy rules/app trong đợt này.
