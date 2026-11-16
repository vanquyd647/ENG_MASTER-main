# Rà soát ngôn ngữ bộ từ vựng ENG_MASTER

Ngày rà soát: **13/10/2026**. Phạm vi: **1.575 mục**, gồm 905 từ cũ và 670 từ bổ sung từ PDF.

| Nội dung thay đổi so với bản trước rà soát | Số mục |
| --- | ---: |
| Phiên âm | 1546 |
| Nhãn loại từ (chuẩn hóa và chỉnh theo nghĩa đang học) | 342 |
| Nghĩa tiếng Việt | 177 |
| Ví dụ tiếng Anh | 1575 |
| Bản dịch ví dụ | 1575 |

Giữ nguyên toàn bộ **ID, từ tiếng Anh, thứ tự, chủ đề và số trang/số mục PDF**. Tiến độ cũ vẫn liên kết bằng ID cũ. Cả 1.575 mục có phiên âm, loại từ, nghĩa, câu ví dụ và bản dịch. `translations.vi` đồng nhất với nghĩa đang học.

## Cách rà soát

- Đối chiếu loại từ và các nghĩa từ vựng với **Princeton WordNet 3.1**. Chọn loại từ chính phù hợp với nghĩa/câu ví dụ; không gắn nghĩa của động từ vào mục được học như danh từ. Các phân từ tính từ và từ hạn định dùng nhãn ngữ pháp thực tế, ví dụ `mounting`, `several`.
- Thống nhất phiên âm **tiếng Anh Mỹ dạng âm vị rộng** dựa trên **CMUdict**, bổ sung bản rà soát cho cụm từ, từ thiếu và từ đổi phát âm theo loại từ. Giữ trọng âm chính; bỏ trọng âm phụ, dấu chia âm tiết và dấu độ dài tùy chọn trong cách ghi âm vị này. Vì thế cách trình bày có thể khác IPA Anh-Anh trong PDF; ví dụ `refusal` dùng `/rɪˈfjuzəl/`, giữ đúng âm `/z/`.
- Đối chiếu thêm các trường hợp đã phát hiện với Cambridge/Oxford, gồm `compensate`, `elegant`, `coordination`, `refusal`, `coordinate`, `several`.
- Biên soạn lại ví dụ song ngữ. Động từ có bổ ngữ/giới từ cụ thể: `compensate customers for`, `consist of`, `adhere to`, `specialize in`, `apply for`. Trạng từ có ngữ cảnh riêng. Danh từ và tính từ chọn ngữ cảnh theo nghĩa dùng, xử lý riêng các từ đa nghĩa như `position`, `reservation`, `tip`, `adapter`, `browser`, `specialty`.
- Ví dụ mới là nội dung biên soạn cho ứng dụng, **không phải ví dụ trích từ PDF**. Các câu có thể ngắn hoặc dùng cấu trúc giống nhau, nhưng không dùng bốn mẫu ghép từ cũ bị sai.
- Các nghĩa tiếng Việt được rà theo nghĩa/cách dùng hiện tại, sửa nhầm loại từ, nghĩa quá rộng và nghĩa không khớp ví dụ. Bản dịch Pháp/Tây Ban Nha của `meet` được sửa để bao gồm nghĩa đáp ứng yêu cầu.

## Một số lỗi đã sửa

| Từ | Bản sửa |
| --- | --- |
| compensate | Động từ; có tân ngữ và `for` |
| elegant | Tính từ; ví dụ `an elegant lobby` |
| coordination | Danh từ; sự phối hợp |
| concentrate | Động từ; `concentrate on` |
| necessarily | Trạng từ; `does not necessarily mean` |
| accessible, aware, costly | Tính từ |
| customs | Danh từ, nghĩa hải quan |
| refusal | Âm `/z/` thay cho `/s/` |
| specialty | Âm `/ɛ/`, nghĩa chuyên môn/món đặc trưng |
| separate | Chọn nghĩa tính từ “riêng, tách biệt” |
| solution, reservation, position | Ví dụ theo nghĩa giải pháp, đặt chỗ, vị trí công việc |

## Dữ liệu và cách chạy lại

- `new/vocabulary-review-baseline.json`: snapshot trước rà soát, chỉ dùng đối chiếu lịch sử.
- `new/vocabulary-lexical-evidence.json`: phần tham chiếu WordNet/CMUdict cho đủ 1.575 từ. WordNet không bao phủ mọi cụm từ/phân từ; các trường hợp thiếu được xử lý riêng trong nội dung biên soạn.
- `scripts/vocabulary_language_content.py`: ngữ cảnh song ngữ, bổ ngữ động từ và trường hợp đặc biệt.
- `scripts/build-vocabulary-review.py`: dựng bản rà soát từ snapshot, tham chiếu và nội dung biên soạn; dùng Python 3, không cần thư viện bổ sung hoặc mạng.
- `new/vocabulary-reviewed.json`: bản rà soát được áp dụng cho từng ID.
- `new/vocabulary-language-review-report.json`: danh sách thay đổi theo từng ID và phương pháp đối chiếu.
- `scripts/reviewed-vocabulary.ts`: giữ bản rà soát khi chạy lại nhập PDF/chuẩn hóa.

```bash
python3 scripts/build-vocabulary-review.py
npm run review:vocab
npm run validate:vocab
npm run typecheck
npm test
npm run build
```

`import:vocab:pdf` và `normalize:vocab` đều áp dụng lại nội dung đã rà soát. Từ mới chưa được rà sẽ gây lỗi thay vì tự động nhận ví dụ ghép từ. Validator yêu cầu ví dụ song ngữ đầy đủ, loại từ thống nhất, ví dụ có từ đang học và nội dung khớp bản rà soát.

## Kiểm chứng

- Kiểm tra dữ liệu: đủ 1.575 mục, không ID/từ trùng, không trường bắt buộc trống.
- TypeScript và build: đạt.
- **31 tests trong 8 files**: đạt, gồm đối chiếu POS với tham chiếu, hồi quy các lỗi đã nêu, bảo toàn ID và sao lưu cả bộ 1.575 từ.
- Chạy lại nhập PDF/chuẩn hóa: bảo toàn toàn bộ nội dung rà soát.
- Kiểm tra trình duyệt ở chế độ khách với cấu hình Firebase mẫu; không dùng tài khoản Google/AI/Firestore thật.
- Đã kiểm tra thẻ `compensate`, `elegant`, `coordination`, `refusal`, `specialty`, `consist`, `severely`, `ability`: phiên âm, nghĩa, ví dụ và bản dịch khớp bản rà soát. Ảnh nằm trong `output/playwright/reviewed-compensate.png`, `reviewed-refusal.png`, `reviewed-ability.png`.

Kiểm tra tự động bảo vệ cấu trúc và các quy tắc/hồi quy cụ thể; chúng không thay thế việc duyệt ngôn ngữ. Bản này không được mô tả là có chứng nhận từ một biên tập viên bên ngoài.

## Nguồn

- [Princeton WordNet](https://wordnet.princeton.edu/), dữ liệu 3.1; [giấy phép lưu tại dự án](WORDNET_LICENSE.txt).
- [CMUdict của CMU Sphinx](https://github.com/cmusphinx/cmudict), các phoneme phát âm Mỹ; [giấy phép](CMUDICT_LICENSE.txt).
- [Cambridge: refusal](https://dictionary.cambridge.org/pronunciation/english/refusal), [coordinate](https://dictionary.cambridge.org/pronunciation/english/coordinate), [several](https://dictionary.cambridge.org/us/dictionary/english/several).
- [Oxford: elegant](https://www.oxfordlearnersdictionaries.com/definition/english/elegant), [coordinate](https://www.oxfordlearnersdictionaries.com/definition/english/coordinate_1).
- Tham khảo đối chiếu Anh–Việt: [vi-en-dictionary](https://github.com/chuongmep/vi-en-dictionary). Không phân phối toàn bộ nguồn này trong ứng dụng.
