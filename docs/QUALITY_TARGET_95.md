# Mục tiêu chất lượng tối thiểu 95% — toàn bộ hệ thống

Phạm vi người dùng chốt ngày 15/10/2026: học từ vựng/ôn hằng ngày và luyện TOEIC Listening & Reading đủ các phần. Mốc 80–85% trong trao đổi trước là ước lượng, không phải số đo; không dùng làm baseline định lượng.

**Trạng thái: learning.8 đã phát hành và đạt nghiệm thu sáu nhóm; mức thấp nhất 95,70%, mọi gate bắt buộc đã đạt.** Tỷ lệ unit tests, API thành công hay một bộ AI hẹp không thay thế mức sẵn sàng này. Báo cáo máy đọc được: output/verification/quality95-readiness.json, tạo bằng scripts/audit-learning-readiness.mjs.

Vòng hiện tại: 311 câu; 311 đáp án/nguồn có hash; 72 file audio với track 45 phút; 200 đầu ra AI được giữ nguyên mẫu số. AI ứng dụng 193/200 (96,5%); model sinh 178/186 (95,70%), không tăng tỷ lệ bằng nguồn thay thế. Kế hoạch ca cụ thể: scripts/fixtures/system-acceptance-v1.json; hồ sơ [ACCEPTANCE_95.md](ACCEPTANCE_95.md). Những số 277/45 bên dưới là các mốc trước.

## Mốc nghiệm thu bắt buộc

Người dùng tái xác nhận ngày 16/10/2026: **ít nhất 95% cho toàn hệ thống học tập**. Gói thử, bản local hoặc một đợt phát hành là bước trung gian; không đóng mục tiêu tổng khi chỉ hoàn thành một bước. Avatar và native TTL tiếp tục tạm hoãn theo quyết định trước; giữ nguyên billing.

Mốc đạt khi **từng nhóm dưới đây đạt ít nhất 95%, toàn bộ điều kiện bắt buộc bên dưới đã đạt và không còn lỗi nghiêm trọng**. Không lấy trung bình các nhóm để bù cho nhóm chưa đạt. Bộ ca đã cố định và bằng chứng hiện tại đã đủ cho sáu nhóm: [ACCEPTANCE_95.md](ACCEPTANCE_95.md). Các ghi chú lịch sử phía dưới giữ nguyên kết quả của các đợt trước, không dùng làm trạng thái hiện tại.

| Nhóm nghiệm thu | Ngưỡng và bằng chứng cần có |
| --- | --- |
| Nội dung học và đề | Ít nhất 95% hạng mục rubric nội dung đạt sau rà soát độc lập; tất cả đáp án dùng để chấm phải đúng, duy nhất và khớp học liệu. Có đủ Part 1–7 và đề tích hợp 200 câu. |
| AI hỗ trợ học | Ít nhất 95% mẫu ngữ nghĩa đạt trong bộ ít nhất 200 đầu ra được chốt trước đợt nghiệm thu, bao phủ các tác vụ và trường hợp lỗi. Tách kết quả nội dung biên soạn, AI sinh và fallback; riêng mẫu AI sinh cũng phải đạt ngưỡng, không dùng fallback để nâng tỷ lệ đó. |
| Lưu dữ liệu và đồng bộ | Ít nhất 95% ca đã chốt đạt; tất cả ca mất/lẫn dữ liệu, đổi tài khoản, gộp Khách, khôi phục và ghi trùng phải đạt. Có bằng chứng local và Cloud thực. |
| Offline và tiếp tục phiên | Ít nhất 95% ca đã chốt đạt; lưu đáp án, phục hồi phiên, giữ thời hạn bài thi và học liệu thiết yếu là điều kiện bắt buộc. Ghi rõ giới hạn giọng đọc trên thiết bị. |
| Giao diện và khả năng thao tác | Ít nhất 95% ca đã chốt đạt trên 360/390/768/1280 px và bàn phím; mọi hành động học/chấm/nộp/khôi phục cốt lõi đều thao tác được. |
| Bảo mật và phát hành | Ít nhất 95% ca đã chốt đạt; auth, quyền sở hữu, quota, không lộ bí mật, smoke test production và đường rollback là điều kiện bắt buộc. |

Trước nghiệm thu phải cố định danh sách ca, rubric, mẫu số và phiên bản code/dữ liệu. Lưu mọi lần lỗi; chạy lại sau sửa có báo cáo mới gắn phiên bản/hash, không xóa mẫu lỗi hoặc giảm mẫu số. Ca chưa chạy hoặc chưa có bằng chứng không được ghi đạt. Bộ đo chưa chốt thì ghi chờ nghiệm thu; số unit tests không phải mẫu số chất lượng toàn hệ thống. Ngưỡng 95% là kết quả nghiệm thu quan sát được, không phải lời bảo đảm mọi phản hồi AI tương lai đều đúng.

Các bước đã hoàn tất trong learning.8:

1. Rà soát ngân hàng 311 câu, nguồn/ảnh/đáp án, tiểu dạng và độ dài bài đọc; giữ ID lịch sử, đóng gói và kiểm tra audio.
2. Nghiệm thu đề 200 câu, thời gian 45/75 phút, lưu/tiếp tục offline, bảy kết quả và backup.
3. Giữ bộ 200 đầu ra AI đã chốt; model sinh 178/186 và đầu ra ứng dụng 193/200 đạt ngưỡng, nguồn thay thế và các lần lỗi được ghi riêng.
4. Nghiệm thu bản ứng viên và production, có rollback tương thích. Hiệu quả tăng điểm người học vẫn là chỉ số riêng chưa đo.

Ngày 16/10/2026, người dùng chỉ định **Codex chịu trách nhiệm rà soát và nghiệm thu**. Không coi việc tìm một giáo viên khác là điều kiện chờ người dùng. Rà soát độc lập ở đây là luồng kiểm tra tách khỏi biên soạn, có đầu vào cố định, bằng chứng và xử lý bất đồng; phải công khai ai/model nào thực hiện, không gán danh nghĩa giáo viên độc lập. Codex vẫn phải kiểm tra tính duy nhất của đáp án và giải quyết lỗi trước khi nghiệm thu; một model đồng ý hoặc tests đạt chưa đủ. Chi tiết bản local: [FULL_EXAM.md](FULL_EXAM.md).

## Điều kiện trước khi công bố đạt

1. Nội dung đủ cả Part 1–7, có ảnh/audio/văn bản khớp câu hỏi và đáp án, không dùng câu hoặc transcript đoán.
2. Ít nhất một đề tích hợp đủ 200 câu; Listening 100 câu/45 phút, Reading 100 câu/75 phút, giữ nhóm hội thoại/bài đọc và đúng mốc thời gian khi reload.
3. Mỗi câu biên soạn có giải thích, nguồn/học liệu đi kèm và đáp án được rà soát; câu có nhiều đáp án hợp lý không dùng để chấm một lựa chọn.
4. Bộ nghiệm thu ngữ nghĩa AI cố định, tách người/luồng sinh và đánh giá; ít nhất 95% mẫu đạt, không còn lỗi nghiêm trọng trong phần nội dung hiển thị. Giữ riêng tỷ lệ thành công dịch vụ, schema, ngữ nghĩa, dùng nguồn thay thế và nguồn ghi chú biên soạn.
5. Lưu/khôi phục/đổi tài khoản/offline/resume/backup qua các ca sử dụng thực, không có lỗi mất hoặc lẫn tiến độ. Không dùng tổng số tests để suy thành phần trăm chất lượng.
6. Khảo sát nền tảng có kết quả theo kỹ năng được đo, đề xuất ôn từ câu sai và phạm vi rõ; chỉ gắn TOEIC/CEFR khi có thiết kế hiệu chuẩn phù hợp.
7. Các phần mới đạt kiểm tra UI mobile/keyboard, lỗi AI có đường học bằng nội dung có sẵn, API giữ auth/quota, bản phát hành và rollback có bằng chứng.
8. Nghiệm thu độc lập nội dung đầy đủ trước khi gọi đây là hệ thống luyện thi toàn diện. Hiệu quả tăng điểm của người học là chỉ số riêng, hiện chưa được đo.

Cấu trúc đích được đối chiếu từ [ETS — thông tin bài thi](https://www.ets.org/toeic/about/listening-reading.html) và [Examinee Handbook](https://www.ets.org/content/dam/ets-org/fr/pdfs/toeic/toeic-listening-reading-test.pdf). Số câu theo Part: 6, 25, 39, 30, 30, 16, 54. Dùng chuẩn cấu trúc, không sao chép hoặc coi nội dung ENG_MASTER là đề chính thức của ETS.

## Lịch sử việc làm trong learning.7

- [x] Lỗi đảo chữ: máy chủ so sánh câu trả lời thật và vị trí ký tự; không nhờ model đoán chữ đầu/cuối hay nguyên nhân tâm lý.
- [x] So sánh từ: ghi chú phạm vi có kiểm soát; phần diễn giải quá phạm vi được thay bằng nguồn gốc có nhãn khi đủ dữ liệu.
- [x] Chấm câu AI: chuyển các lựa chọn chưa được rà soát thành bài nhớ đúng từ theo nghĩa. Hiện nghĩa cần điền, không đánh giá một distractor có thể đúng trong câu khác là sai.
- [x] Ghi chú ENG_MASTER cho 20 mục dễ nhầm; tách khỏi catalog 1.575 từ. Nghĩa/cách dùng/cụm từ/mẹo và ví dụ song ngữ dùng ghi chú có nhãn nguồn. Mỗi mục có thêm ba ví dụ khác nhau; cặp có đủ ghi chú dùng so sánh biên soạn, không gọi model. Trong catalog hiện có 19 từ khớp (ghi chú dependent dành cho mở rộng, chưa thêm vào catalog). Bài luyện/quiz và câu ôn mới vẫn do AI tạo.
- [x] Khảo sát nền tảng 20 câu/4 bước từ ngân hàng hiện có, lưu vào lịch sử/backup/đồng bộ bank 2 như bài luyện bình thường. Chưa đánh giá Part 1/3/4, không quy đổi điểm thi.
- [x] Bộ mẫu cố định 45 mục/28 yêu cầu, có hash và ghi lại cả lần lỗi. Đọc tay riêng sau kiểm tra tự động; không có retry QA để bỏ qua mẫu lỗi.
- [x] Bổ sung ngân hàng đủ số lượng để ghép đề 200 câu (local 277 câu; nội dung/audio tiếp tục nghiệm thu).
- [ ] Nghiệm thu độc lập toàn bộ nội dung và đề đầy đủ.
- [ ] Đo hiệu quả học thực tế; không báo phần trăm tăng điểm từ kết quả kỹ thuật.

Các ghi chú do ENG_MASTER biên soạn là nguồn giảng giải bổ sung, không phải chứng nhận một giáo viên độc lập đã rà soát mọi nghĩa. Chúng không ghi đè catalog; 20 mục không được suy thành bao phủ toàn bộ 1.575 mục.

## Lịch sử học liệu và phần còn thiếu ở mốc learning.7

Hiện local có **277 câu đang dùng và engine đề 200 câu**, đã [rà soát đáp án/văn bản/ảnh](CONTENT_REVIEW.md) bởi Codex và kiểm tra chéo mù bằng Gemini. Thay một câu cũ mơ hồ bằng ID mới, giữ lịch sử. Còn audio, chuẩn hóa đề, benchmark ≥200 phản hồi AI và nghiệm thu sáu nhóm/production. Các đoạn dưới lưu diễn biến của các mốc trước; không áp trạng thái cũ cho bản local mới.

Ngân hàng learning.7 có 166 câu: Part 2/5/6/7, ngữ pháp và ngữ cảnh. Gói local 16/10 bổ sung 18 câu Part 1/3/4 có ảnh/kịch bản khớp, dùng giọng thiết bị; chưa nghiệm thu độc lập. Thư mục new/ có 47 MP3 và một WAV; chưa xác định được ảnh/câu hỏi/đáp án tương ứng. Inventory lưu đường dẫn, số byte và SHA-256 để đối chiếu về sau. Các file audio cũ này chưa được upload hoặc dùng làm bài chấm điểm.

Khảo sát 20 câu là một mẫu nền tảng trong phạm vi đang có: 5 Part 2, 5 Part 5, 4 Part 6 và 6 Part 7. Nó không bổ sung ba Part còn thiếu hay tạo một đề thi đầy đủ. Kết quả của từng bước là record bank 2 có ID vòng khảo sát, nên vẫn dùng các luồng lưu/Cloud/backup v4 hiện có. Không thêm namespace Cloud/rules. Draft theo cơ chế cũ, chỉ ở thiết bị; một vòng chưa hoàn thành không được trộn với vòng cũ.

## Phép đo và chống báo cáo sai

scripts/fixtures/learning-quality-v1.json được chốt trước khi sửa: 25 phần giải thích/hỏi tiếp, 10 câu quiz và 10 lỗi sai. Mẫu nhắm vào lỗi đã biết; chưa đại diện đủ 7 Part hoặc mọi từ.

Lần đầu đạt 40/45 tự động: năm câu nhanh bị chặn vì model gửi lựa chọn cho type=fill. Sau sửa, đạt 45/45 tự động; đọc tay vẫn chỉ đạt 38/45 theo rubric đã ghi: có sai chiều giới từ, tiếng Việt không dấu, hạn chế ngữ cảnh thiếu căn cứ, collocation lệch nghĩa và dịch không tự nhiên. Bằng chứng trước sửa ghi chú được giữ riêng; không sửa kết quả cũ thành đạt. Lần chỉ neo nghĩa/cách dùng vẫn còn 5 mục lỗi trong ví dụ/đối chiếu: 40/45, 88,89%. Bởi vậy bản tiếp theo dùng ví dụ biên soạn cùng nhãn nguồn cho phạm vi đã có ghi chú. Đây là thay đổi cơ chế cung cấp nội dung; không được nói model tự sinh đã đạt 100%.

Báo cáo mới phải giữ output hash, mọi ID mẫu và tỷ lệ theo từng loại kiểm tra. Phản hồi dùng ghi chú biên soạn hoặc nguồn thay thế được đếm riêng; không được quảng bá là toàn bộ do AI sinh đúng. Người đọc nội dung trong đợt này là Codex; không thay cho nghiệm thu giáo viên độc lập.

Người dùng trả lời không rõ tài liệu kèm audio ở đâu. Tìm lại trong workspace vẫn chỉ thấy PDF từ vựng và audio, chưa thấy bộ ảnh/đề/đáp án. Có thể bổ sung học liệu do dự án tự biên soạn trong giai đoạn tiếp theo, nhưng phải có media và đáp án được nghiệm thu; không tự gán đáp án cho audio không rõ bộ.

Đã tìm [nguồn học liệu thay thế](ALTERNATIVE_LEARNING_SOURCES.md) ngày 16/10/2026: mẫu chính thức IIBC để đối chiếu/dẫn liên kết, VOA và ảnh Commons có quyền phù hợp để biên soạn bài mới. Có bằng chứng truy cập audio đại diện; chưa nhập ngân hàng, nghiệm thu nội dung hoặc bổ sung đề 200 câu. Kết quả tìm nguồn không thay đổi trạng thái 95%.

Tại mốc gói thử đầu ngày 16/10, đã bổ sung local [18 câu Part 1/3/4](LISTENING_PILOT.md), tăng ngân hàng lên 184. Khi đó có ảnh/kịch bản/bản dịch và giọng thiết bị, nhưng chưa đủ đề 200 câu hoặc nghiệm thu nội dung. Bản local tiếp theo đã tiến tới 277 câu và đề đầy đủ như cập nhật đầu mục; audit hiện giữ các blocker audio, chuẩn hóa đề, benchmark AI và nghiệm thu sáu nhóm.

Giữ gemini-3.5-flash-lite, billing, quota ngày, Avatar/native TTL tạm hoãn và catalog đã chốt. Chưa commit/push Git.

## Nghiệm thu learning.7

Đã phát hành deployment dpl_EXuHgSHHuJrWgAA4F8nZmdCnaXDR lên https://eng-master-main2.vercel.app. 184 unit, bốn native API imports, 13 nhóm browser local + 13 production và 12 ca API candidate cuối đạt. Bốn hash nguồn đã chốt không đổi. Đã sửa thêm khoảng cách mobile để nút tài khoản không che Tạm dừng.

Bộ 45 mục local/candidate đạt kiểm tra tự động và lần đọc bởi Codex: 20 mục biên soạn, 15 câu luyện/quiz AI, 10 review kết hợp, tám yêu cầu gọi model. Đây là chỉ số của mẫu hẹp và cơ chế nguồn hỗn hợp, không phải độ chính xác model trên mọi từ. Báo cáo gắn hash và giữ kết quả trước sửa; chưa nghiệm thu giáo viên độc lập.

Mốc phát hành này hoàn tất; yêu cầu 95% toàn bộ vẫn chưa hoàn tất. Các phần còn thiếu được lưu tại quality95-readiness.json và quality95-release.json. Audio chưa rõ bộ gốc là tài liệu chưa sử dụng, không bắt buộc phải khôi phục bộ đó nếu dự án bổ sung học liệu mới đã nghiệm thu.
