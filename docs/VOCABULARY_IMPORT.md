# Bổ sung từ vựng TOEIC từ PDF

**Cập nhật mới nhất:** bộ dữ liệu đã được rà soát ngôn ngữ toàn bộ sau bước nhập ban đầu. Xem [báo cáo rà soát](VOCABULARY_REVIEW.md). Cả 1.575 mục hiện có ví dụ song ngữ; IPA, loại từ và nghĩa dùng bản rà soát thay vì dữ liệu ở bước nhập ban đầu. Những số liệu và mô tả dưới đây ghi lại lịch sử nhập PDF.

Nguồn: `new/1250 từ vựng TOEIC.pdf`. Nội dung thực tế là **1000 từ vựng TOEIC thông dụng nhất** của MochiMochi, 23 trang. Tên file không phản ánh số mục trong tài liệu.

| Kết quả đối chiếu | Số lượng |
| --- | ---: |
| Bộ từ ban đầu | 905 |
| Dòng được trích từ PDF | 1000 |
| Từ/cụm từ duy nhất trong PDF | 999 |
| Từ đã có trong bộ cũ | 329 |
| Dòng lặp trong PDF (`package`, mục 652) | 1 |
| Từ mới bổ sung | 670 |
| Tổng bộ từ sau nhập | 1575 |
| Mục cũ được sửa nghĩa/chữ tiếng Việt | 274 |

Giữ nguyên ID, thứ tự, chủ đề, từ tiếng Anh và phiên âm của 905 mục cũ. Sửa lỗi tách chữ, dấu câu và các nghĩa bị gán nhầm xác định được, ví dụ `elegant`, `compensate`, `coordination`, `dedication`, `congestion`, `reject`. Đồng bộ nghĩa tiếng Việt trong `translations.vi`; cập nhật phần dịch ví dụ nếu phần đó trích nguyên văn nghĩa cũ. Tiến độ SRS vẫn dùng ID cũ.

670 mục mới nằm trong `src/data/toeic-pdf.ts`, thuộc nhóm **TOEIC bổ sung (PDF)**. ID dạng `pdf-toeic-XXXX` lấy từ số thứ tự gốc, kèm số trang để truy xuất nguồn. Phiên âm ưu tiên từ điển IPA Anh-Anh, rồi Anh-Mỹ; dùng phiên âm PDF đã rà soát cho những cụm từ hoặc từ không có trong từ điển. Sửa nhãn loại từ và những nghĩa sai rõ ràng trong PDF, như `stapler`, `streamline`, `unfortunately`, `vacant`, `wealth`.

PDF không có câu ví dụ hoặc bản dịch câu. Hai trường này để trống ở mục mới; giao diện ẩn khối ví dụ trống. Không gán câu tự tạo cho nguồn PDF. Từ mới vẫn dùng được với flashcard, luyện tập, quiz từ/nghĩa, thống kê và sao lưu.

## Dữ liệu và đối chiếu

- `new/toeic-pdf-extracted.json`: 1000 dòng trích từ tài liệu, giữ riêng các dòng nghĩa xuống hàng và phiên âm phụ.
- `new/toeic-pdf-import-report.json`: SHA-256 của PDF, số lượng, ID từ trùng, dòng lặp và các chỉnh sửa PDF.
- `new/vocabulary-existing-corrections.json`: nghĩa trước/sau của 274 mục cũ.
- `scripts/vocabulary-corrections.ts`: danh sách chỉnh sửa được rà soát.
- `scripts/import-toeic-pdf.ts`: tái tạo bộ bổ sung từ dữ liệu trích đã rà soát; kiểm tra đầy đủ 1000 dòng và hash tài liệu. Không cần công cụ PDF để chạy lại bước nhập.

Trích xuất ban đầu dùng `pypdf` ở chế độ layout, đối chiếu đủ số thứ tự 1–1000. Các lỗi phiên âm thiếu dấu `/` tại mục 233, 700, 766, 808 được phát hiện; những từ mới dùng phiên âm từ điển. Dòng nghĩa `(thuộc) đạo đức, phẩm hạnh` đặt trên mục `moral` được xử lý riêng, không gắn vào `monument`.

Có thể tái trích xuất bằng `python scripts/extract-toeic-pdf.py` trong môi trường Python có `pypdf` (phiên bản dùng ban đầu: 6.20.1). Rà soát thay đổi dữ liệu trích trước khi chạy lại bước nhập.

## Chạy lại và kiểm tra

```bash
npm run import:vocab:pdf
npm run validate:vocab
npm run typecheck
npm test
npm run build
```

`normalize:vocab` chỉ chuẩn hóa bộ cũ và giữ bộ PDF riêng. Kiểm tra dữ liệu yêu cầu ví dụ đầy đủ cho bộ cũ, xác thực nguồn cho bộ PDF, cấm ID/từ trùng và phát hiện lỗi định dạng. Các kiểm tra tự động không chứng minh mọi nghĩa hoặc bản dịch cũ đều hoàn hảo.

Giới hạn danh sách từ trong hoạt động ngày của Firestore đã tăng từ 905 lên 10000 để đủ cho bộ mở rộng và từ cá nhân. Thay đổi rules cần được triển khai vào Firebase khi đưa bản cập nhật lên môi trường dùng thật; bước nhập dữ liệu không tự triển khai rules.

## Kết quả kiểm chứng ngày 13/10/2026

- `typecheck`, `validate:vocab`, `build`: đạt; build tách riêng phần dữ liệu PDF.
- 28 tests trong 8 files: đạt, gồm đối chiếu toàn bộ 1000 dòng nguồn và sao lưu toàn bộ 1575 ID.
- Chạy lại bước nhập và chuẩn hóa: nội dung dữ liệu không đổi.
- Đối chiếu snapshot trước nhập: giữ nguyên cả 905 ID, từ tiếng Anh, thứ tự, chủ đề, loại từ, phiên âm và ví dụ tiếng Anh cũ.
- Playwright trong chế độ khách với cấu hình Firebase mẫu: tìm `stapler` trong nhóm PDF, hoàn tất quiz 5/5, hoàn tất 5 flashcard PDF, lưu lịch SRS với interval 1 ngày và xác nhận tiến độ còn sau tải lại.
- Ảnh kiểm chứng nằm trong `output/playwright/`: `pdf-vocabulary-search.png`, `pdf-quiz-result.png`, `pdf-flashcard.png`.

Kiểm thử trình duyệt dùng dữ liệu mẫu trong phiên riêng. Chưa kiểm thử đăng nhập Google, AI trực tuyến hoặc ghi Firestore thật; chưa triển khai ứng dụng hay rules.
