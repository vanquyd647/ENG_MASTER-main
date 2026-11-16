# Học liệu thay thế cho phần nghe còn thiếu

Rà soát ngày 16/10/2026 theo yêu cầu tìm nguồn khác thay cho audio chưa xác định được bộ đề. Đây là kết quả tìm nguồn và kiểm tra khả năng truy cập, chưa nhập ngân hàng câu hỏi hoặc phát hành thay đổi ứng dụng.

## Nguồn đã chọn

| Nguồn | Nội dung có thể dùng | Cách dùng phù hợp với ENG_MASTER |
| --- | --- | --- |
| IIBC/ETS: [Part 1](https://www.iibc-global.org/toeic/test/lr/about/format/sample01.html), [Part 3](https://www.iibc-global.org/toeic/test/lr/about/format/sample03.html), [Part 4](https://www.iibc-global.org/toeic/test/lr/about/format/sample04.html) | Mẫu chính thức có audio, câu hỏi và đáp án; ảnh/đồ họa ở những câu cần hình. Part 1 có hai câu; Part 3 và Part 4 mỗi phần có bốn nhóm, 12 câu. | Dẫn người học tới trang gốc và dùng đối chiếu dạng bài. Không nhập lại đề/audio vào ngân hàng công khai khi chưa có quyền phù hợp. |
| [VOA Learning English — Budget Cuts](https://learningenglish.voanews.com/a/lets-learn-english-level-2-lesson1/3960391.html) | Hội thoại về công việc, transcript, audio tải được và giáo án có quiz. | Ứng viên cho bài nghe bổ sung, chú trọng hiểu hội thoại/từ vựng công việc. Không tự gắn thành đề Part 3 chính thức. |
| [Wikimedia Commons — Heftruck in actie](https://commons.wikimedia.org/wiki/File:Heftruck_in_actie.JPG) | Ảnh chụp xe nâng; trang file ghi tác giả Glasman5 và giấy phép CC0 1.0. | Nguồn ảnh ứng viên cho Part 1 tự biên soạn. Cần xem ảnh thực tế, viết bốn lời mô tả, tạo audio và rà soát một đáp án đúng trước khi chấm bài. |
| [ELLLO](https://www.elllo.org/about/) | Học liệu nghe nhiều trình độ, người nói và chủ đề. | Nguồn học bổ sung qua liên kết. Chính sách về dùng trong lớp/LMS không được mặc định thành quyền phát hành lại trên ứng dụng công khai. |

## Điều kiện sử dụng đã đối chiếu

- IIBC ghi rõ bản quyền mẫu thuộc ETS. [Chính sách cấp phép ETS](https://www.ets.org/legal/permissions/licensing.html) không phải giấy phép mở cho việc sao chép ngân hàng câu hỏi. Miễn phí truy cập không đồng nghĩa được đóng gói lại; ưu tiên liên kết đến trang chính thức.
- [Chính sách VOA](https://learningenglish.voanews.com/p/6861.html) cho phép tái sử dụng học liệu gốc với ghi nguồn; nội dung AP, Reuters, AFP và tài sản bên thứ ba phải loại trừ hoặc xử lý theo quyền riêng. Kiểm tra từng tài sản trước khi nhập, kể cả ảnh trong giáo án.
- [Hướng dẫn Commons](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia) yêu cầu đọc giấy phép từng file. Nhãn CC0 của metadata không chứng minh ảnh cũng có CC0. Ảnh xe nâng ở trên được xác nhận từ phần giấy phép của chính file; nên vẫn lưu tên tác giả và URL nguồn.

## Kiểm tra kỹ thuật và giới hạn

Bằng chứng: [alternative-learning-sources-2026-10-16.json](../output/verification/alternative-learning-sources-2026-10-16.json).

- Ba trang IIBC và trang VOA Budget Cuts trả HTTP 200. File audio câu đầu Part 1, nhóm đầu Part 3/4 và audio Budget Cuts đều trả HTTP 206 cho yêu cầu 64 byte, có MIME audio và đầu file ID3.
- Đây là kiểm tra khả năng truy cập một file đại diện mỗi trang, chưa nghe trọn audio hoặc xác minh mọi media. Không lưu nguyên bộ audio IIBC vào dự án.
- [Giáo án Budget Cuts](https://docs.voanews.eu/en-US-LEARN/2021/05/10/f475e360-0ee2-44bf-84f5-1e76c724c5de.pdf) có transcript, trích dẫn làm căn cứ nghe và bốn câu quiz. Chưa xác nhận một bảng đáp án riêng; không coi việc có quiz là đã đủ nghiệm thu đáp án. Audio còn có phần giảng của Professor Bot, cần thiết kế bài học tương ứng.
- Bài VOA cũ “Let's Do Business” có trang truy cập được nhưng bộ kiểm tra chưa tìm được URL MP3 trực tiếp; chưa chọn làm học liệu audio đầu vào.
- Trong các nguồn đã kiểm tra, chưa xác nhận bộ 200 câu đủ media, đáp án và giấy phép mở để nhập thẳng vào ứng dụng.

## Hướng triển khai đề xuất

1. Tách hai mục: bài mẫu chính thức mở ở trang nguồn và ngân hàng ENG_MASTER tự biên soạn có thể học trong ứng dụng.
2. Làm gói thử nhỏ: sáu câu ảnh Part 1 từ ảnh có quyền rõ ràng; hai nhóm hội thoại và hai nhóm độc thoại do dự án biên soạn, mỗi nhóm ba câu. Đây là khối lượng đề xuất, chưa phải dữ liệu đã tạo. VOA bổ sung luyện nghe theo chủ đề; không buộc sửa một bài dài thành đề thi.
3. Mỗi bài lưu nguồn, tác giả/giấy phép, media, transcript hoặc lời đọc, đáp án và căn cứ giải thích. Tạo audio từ kịch bản đã chốt; kiểm tra phát âm, tên riêng, chữ số và khớp nội dung. Không tự động gửi tài sản tới dịch vụ mới hoặc phát sinh chi phí trong bước tìm nguồn.
4. Rà soát nội dung độc lập rồi kiểm tra chấm/lưu/khôi phục/mobile/offline trước khi mở rộng thành đề tích hợp 200 câu. Không dùng các mẫu IIBC thay cho chứng nhận chất lượng của ngân hàng tự biên soạn.

Khuyến nghị: dùng VOA và ảnh Commons có giấy phép phù hợp làm học liệu đầu vào; dùng IIBC/ETS đối chiếu và dẫn nguồn; tự xây ngân hàng theo cấu trúc TOEIC. Hướng này cho phép tiếp tục mà không cần khôi phục bộ gốc của 48 audio hiện có. Mục tiêu 95% toàn hệ thống vẫn chưa đạt chỉ nhờ tìm được nguồn.

Sau khi người dùng đồng ý, đã thực hiện [gói thử local](LISTENING_PILOT.md): sáu ảnh Commons, 18 câu tự biên soạn và audio VOA bổ sung. Phần mô tả tìm nguồn ở trên là kết quả trước khi nhập; trạng thái triển khai và giới hạn của gói mới được ghi riêng, chưa phát hành production.
