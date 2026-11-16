# AI học tập và nghiệm thu 95%

Cập nhật 16/10/2026: learning.8 đã phát hành tại https://eng-master-main2.vercel.app, dùng hợp đồng toeic-vi-v7, 311 câu luyện và đề 200 câu, cùng 71 clip/track nghe 45 phút đóng gói. Catalog 1.575 từ giữ nguyên. Sáu nhóm nghiệm thu đều đạt ngưỡng; mức thấp nhất 95,70% theo bộ ca cố định, xem [hồ sơ nghiệm thu](ACCEPTANCE_95.md).

Bộ mẫu cố định 200 đầu ra/88 yêu cầu/152 từ đã được chạy thật và kiểm tra chéo theo quyền người dùng. Giữ mọi lần lỗi. Sau thay đổi xử lý đầu ra, replay toàn bộ nội dung qua handler hiện tại với SDK được mock; đây không phải 200 lần gọi live mới. Kết quả: 193/200 đầu ra ứng dụng đạt (96,5%); giữ nguyên 7 lỗi dịch vụ. Tám lỗi ngữ nghĩa trong 186 đầu ra model thực sự sinh vẫn tính là lỗi, kể cả khi phần hiển thị đã dùng nguồn thay thế: 178/186 = 95,70%.

Bài điền từ dùng câu ngữ cảnh/bản dịch AI, còn hint và giải thích bám nghĩa nguồn. Ba bài giải thích không đạt kiểm tra dùng nguồn có nhãn source-only; hai nhận xét dùng ví dụ/nhận xét nguồn có nhãn ENG_MASTER. Không dùng các phần này để tăng tỷ lệ model. Cache v7 tách khỏi v6; vẫn đọc dữ liệu v3–v6 qua kiểm tra an toàn.

Bằng chứng: output/verification/accept95-ai-semantic-final.json, accept95-ai-v7-replay-v3.json và system-acceptance-final.json. [Nghiệm thu toàn hệ thống](ACCEPTANCE_95.md). Phần dưới là lịch sử learning.7, không phải trạng thái hiện tại.

## Hồ sơ các mốc trước (giữ để đối chiếu)

**Mốc hoàn thành bắt buộc: ít nhất 95% cho toàn hệ thống học tập**, tái xác nhận ngày 16/10/2026. Từng nhóm nội dung, AI, dữ liệu/đồng bộ, offline, UI và bảo mật/phát hành phải đạt ngưỡng; mọi điều kiện cốt lõi phải đạt và không còn lỗi nghiêm trọng. Gói thử là bước trung gian. [Quy tắc nghiệm thu và thứ tự công việc](QUALITY_TARGET_95.md#mốc-nghiệm-thu-bắt-buộc).

Ngày 15/10/2026: `2026.10.15-learning.7`, deployment `dpl_EXuHgSHHuJrWgAA4F8nZmdCnaXDR`, đã promote lên https://eng-master-main2.vercel.app. Hồ sơ phát hành: output/verification/quality95-release.json. Phạm vi 95% người dùng chọn là toàn hệ thống; **chưa đủ điều kiện công bố đạt**, xem [tiêu chí và phần còn thiếu](QUALITY_TARGET_95.md).

Cập nhật local 16/10/2026: sau [gói thử nghe Part 1/3/4](LISTENING_PILOT.md), đã thêm 93 câu, nâng ngân hàng lên **277 câu** và có [đề luyện 200 câu](FULL_EXAM.md) với thời gian 45/75 phút, tiếp tục offline, khóa phần và kết quả từng Part. Người dùng giao Codex chịu trách nhiệm rà soát. Đã [đối chiếu đáp án/văn bản/ảnh](CONTENT_REVIEW.md) cùng checker Gemini mù, xử lý tám bất đồng và thay một câu mơ hồ bằng ID mới, bảo toàn lịch sử. Chưa nghiệm thu audio/chuẩn hóa đề đầy đủ hoặc phát hành. Các bằng chứng learning.7 bên dưới mô tả bản phát hành trước, không tự áp dụng cho thay đổi local.

## Hành vi hiện tại

Lời giải gồm nghĩa, cách dùng, cụm từ, ví dụ song ngữ và mẹo tránh nhầm. UI dựng khối màu từ JSON đã kiểm tra và vẫn đọc Markdown cũ. Máy chủ lookup nghĩa/từ loại/chủ đề/ví dụ từ catalog 1.575 mục; ID có sẵn nhưng nghĩa bị sửa bị từ chối. Từ cá nhân chưa khớp catalog có nhãn chưa rà soát.

Bốn tác vụ hỏi tiếp giữ từ/nghĩa đang mở: đơn giản hóa, thêm ví dụ, so sánh và kiểm tra nhanh. Mỗi lần thêm ví dụ có ba câu khác nhau, khác câu nguồn. Bài nhanh/quiz AI dùng điền đúng từ mục tiêu với nghĩa đang học hiển thị rõ. Máy chủ bỏ distractor chưa được duyệt trước khi kiểm tra ID/đáp án; đáp án sai hoặc thiếu/nhiều ô trống vẫn bị từ chối. Nhập từ khác báo chưa khớp từ đang ôn, không suy ra từ đó luôn sai trong mọi ngữ cảnh. Bài nhanh trong dialog không ghi SRS/tiến độ.

Có 20 ghi chú ENG_MASTER và ba ví dụ bổ sung mỗi ghi chú, tách khỏi catalog; hiện 19 từ có trong catalog, dependent chỉ là ghi chú dành cho mở rộng. Với các mục này, giải thích/ví dụ/so sánh dùng nội dung biên soạn và ghi rõ nguồn, response generated=false, model=null; không gọi Gemini cho phần biên soạn. Không coi đây là toàn bộ từ vựng đã có ghi chú hoặc đã được giáo viên độc lập nghiệm thu. Ghi chú application bám nghĩa ứng dụng/sự áp dụng đang chọn, đồng thời nêu riêng nghĩa đơn xin việc.

Phần chưa có ghi chú và các bài luyện mới vẫn dùng Gemini. So sánh có ghi chú phạm vi cố định; diễn giải khẳng định quá mức được thay bằng nghĩa/ví dụ gốc khi đủ dữ liệu và gắn nhãn nguồn thay thế. Không có đủ nguồn thì báo lỗi. Schema không phát hiện được mọi lỗi ngữ nghĩa.

Review giữ câu hỏi/loại câu/câu trả lời và đáp án thực; UI chia lượt tối đa năm lỗi, giữ phần còn lại để xem tiếp. Nhận xét câu trả lời được máy chủ tính, gồm đúng vị trí đảo chữ (invioce và reciept: 4/5), không nhờ model đoán nguyên nhân. Ghi chú có sẵn cung cấp cách dùng/ví dụ; AI tạo câu ôn mới từ hai phần trước/sau ô trống. Nhãn nguồn phân biệt các phần này. Không thay câu trả lời người học để khớp lời giải.

## Mô-đun và dữ liệu

- src/domain/aiContent.ts: hợp đồng nội dung v4, kiểm tra nguồn/lesson/review; vẫn đọc v3.
- src/domain/aiQuality.ts: đối chiếu đáp án, vị trí ký tự, giới hạn phát biểu so sánh và bài nhớ từ mục tiêu.
- src/server/aiGrounding.ts: lookup approved JSON, giữ nguồn gốc và nhãn từ cá nhân.
- src/server/learningNotes.ts: ghi chú/ví dụ bổ sung có phạm vi; không ghi đè catalog.
- src/server/aiPrompts.ts và gemini.ts: schema/prompt, lựa chọn nguồn, gọi SDK/retry/deadline/log/cache.
- AiStructuredResponse/AiExplanation/useAiExplanation: hiển thị, hỏi tiếp, cache, hủy request khi đóng/đổi tài khoản, loại kết quả trễ.
- src/domain/baselineAssessment.ts và features/study/BaselineAssessment.tsx: khảo sát 20 câu/4 bước, kết quả theo câu thật và ôn chủ điểm sai.

Từ Tổng quan, mở “Bài học · Ngữ pháp · Part 2/5/6/7” → “Khảo sát nền tảng”. Bao gồm Part 2/5/6/7, chưa đánh giá Part 1/3/4 và không quy đổi TOEIC/CEFR. Giữ nguyên nhóm bài đọc. Bước đã nộp là record bank 2 có mã vòng khảo sát, dùng lịch sử/Cloud/backup v4 hiện có; không trộn kết quả vòng cũ. Draft vẫn chỉ lưu trên thiết bị như các bài luyện khác. Giọng nghe dùng giọng tiếng Anh trên thiết bị.

## Cache, API và phạm vi phát hành

Prompt/schema/cache key mới toeic-vi-v4; namespace browser v3 giữ tương thích nhưng key gồm version nên không dùng lại kết quả v3. Browser tối đa 40 mục/owner và server 256 mục/instance trong 24 giờ; từ cá nhân có UID trong key. Practice không cache, chưa bảo đảm model không lặp câu. Response vẫn giữ text cho client cũ. Yêu cầu đến máy chủ vẫn tính hạn mức kể cả nội dung biên soạn; mở lại cache browser không cần gọi API.

Giữ gemini-3.5-flash-lite, Firebase auth, hạn mức mặc định 100/người/ngày UTC, hạn mức phút, timeout server 45 giây/client 55 giây/Vercel 60 giây. Avatar/native TTL tạm hoãn, billing giữ nguyên. Không đổi rules/schema Cloud. PDF/audio không upload; .vercelignore chỉ cho phép approved JSON trong new/.

## Bằng chứng và giới hạn

184 unit/UI/repository/HTTP tests, typecheck/lint/catalog/build và bốn native API imports đạt. 14 Emulator tests không chạy lại vì không đổi persistence/rules/quota. Bốn hash nguồn bất biến không đổi; offline pack có 42 assets. Bộ browser có 13 nhóm cho dialog/nguồn/câu điền và khảo sát lưu/tiếp tục/mobile; dùng Firebase QA thật cùng HTTP/giọng fixture, không được coi là kiểm chứng mọi nội dung AI hoặc giọng thiết bị thật.

Bộ mẫu cố định 45 mục/28 yêu cầu được chạy local và candidate; đọc nội dung riêng, gắn hash từng đầu ra. Mỗi lần có 20 mục biên soạn, 15 câu luyện/quiz AI và 10 review kết hợp ghi chú với câu ôn AI, tổng tám yêu cầu gọi model. Cả hai lần đạt 45/45 tự động và lần đọc bởi Codex; **không gọi đây là AI luôn đúng hoặc 95% toàn hệ thống**. Một số quiz bám câu nguồn nên chưa chứng minh độ đa dạng. Candidate có thêm 12 ca hồi quy API/auth/quota/flag; QA đã dọn.

Bằng chứng trước sửa được giữ: tự động 40/45 vì practice có options; sau đó tự động 45/45 nhưng đọc chỉ 38/45, rồi lần chỉ neo ghi chú còn 40/45. Không sửa kết quả cũ thành đạt. learning.6 có 165 tests/10 nhóm UI; giới hạn nhận xét vị trí chữ, so sánh tuyệt đối và distractor mơ hồ được lưu tại ai-content-manual-content-review.json. Hồ sơ mới dùng tiền tố quality95- trong output/verification/.

Tại thời điểm phát hành learning.7 chưa có Part 1/3/4 hoặc đề 200 câu; bản local mới đã bổ sung như phần cập nhật đầu tài liệu. Chưa nghiệm thu đầy đủ toàn bộ nội dung/audio. Có 48 audio nguồn chưa tìm thấy bộ ảnh/câu hỏi/đáp án khớp; chưa dùng chúng để chấm. Chưa đo hiệu quả tăng điểm của người học. Không gán phần trăm sẵn sàng từ số test. Git chưa commit/push.

Nghiệm thu production cuối: 13 nhóm UI đạt, gồm đo nút tài khoản không che Tạm dừng trên mobile; 42 public assets, revision f1bbdc64a36c2ee4, initial referenced gzip 399299 byte. Candidate cuối có 12 ca API đạt. Pilot 45 mục giữ ở deployment trước bản chỉnh khoảng cách UI; backend không thay đổi. QA đã dọn.
