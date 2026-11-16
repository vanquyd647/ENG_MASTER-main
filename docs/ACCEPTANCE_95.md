# Nghiệm thu learning.8 — đạt mốc tối thiểu 95%

Hoàn tất ngày 16/10/2026. Bản `2026.10.16-learning.8` đã phát hành tại https://eng-master-main2.vercel.app, deployment `dpl_Afst1V1YfZ66H3HSCFEKFSvXQSvQ`. Báo cáo máy xác nhận `overall95Ready=true`, không còn gate bắt buộc chờ hoặc lỗi.

Kế hoạch cố định: [system-acceptance-v1.json](../scripts/fixtures/system-acceptance-v1.json). Từng nhóm phải đạt ít nhất 95%; mọi gate nghiêm trọng phải đạt, không lấy trung bình. Mức thấp nhất quan sát được là **95,70%**. Đây là nghiệm thu theo bộ ca và rubric đã chốt, không phải bảo đảm độ chính xác của mọi nội dung hoặc phản hồi tương lai.

| Nhóm | Kết quả | Bằng chứng chính |
| --- | --- | --- |
| Nội dung học/đề | 97,18% | 311/311 đáp án và nguồn có hash; đề 200 câu đủ Part 1–7; ASR 69/71 clip không bị đánh dấu |
| AI hỗ trợ học | 95,70% | Model sinh 178/186; đầu ra cuối ứng dụng 193/200 (96,5%), giữ cả lỗi dịch vụ |
| Dữ liệu/đồng bộ | 100% | 18 nhóm ca local/Cloud thực, đổi tài khoản, gộp Khách và thay/khôi phục dataset |
| Offline/tiếp tục | 100% | 21 nhóm ca; giữ đáp án, thời hạn đề, audio range và phiên học qua cập nhật |
| UI/thao tác | 100% | 39 nhóm ca; kích thước 360/390/768/1280 px và bàn phím |
| Bảo mật/phát hành | 100% | 11 gate: quyền sở hữu, auth/quota, build, API và trình duyệt, rollback tương thích |

Hồ sơ tổng: [system-acceptance-final.json](../output/verification/system-acceptance-final.json) và [quality95-readiness.json](../output/verification/quality95-readiness.json). Tạo lại bằng `node --import tsx scripts/audit-learning-readiness.mjs`; nguồn, phiên bản build và bằng chứng phải khớp hash.

## Kiểm tra bản phát hành

- 211 tests thường và 15 tests Firestore Emulator đạt; test replay 200 đầu ra handler hiện tại đạt riêng. Các ca bỏ qua trong lệnh tests thường đã được ghi rõ, không tính là đã chạy ở lệnh đó.
- 12 ca API production đạt, gồm tác vụ AI thật, nguồn cá nhân và các ca âm auth/quota; tài khoản và dữ liệu QA đã dọn. Codex đọc lại nội dung mẫu live trong accept95-production-semantic-smoke.json.
- Tám bộ trình duyệt đạt: bảy bộ chạy trực tiếp domain production, riêng bộ cập nhật PWA chạy frontend cùng build trên localhost với revision worker điều khiển để tái tạo cập nhật. Không gọi fixture này là hai phiên bản worker thật trên production.
- Quét 122 tài nguyên production, không phát hiện bí mật server; đối chiếu SHA toàn bộ 72 MP3. Gzip tài nguyên ban đầu 400.406 byte, dưới ngân sách 420.000 byte. Catalog 1.575 từ và bốn hash nguồn giữ nguyên.
- Lần đầu kiểm tra trình duyệt timeout khi chờ gói offline tải qua mạng ở ngưỡng 30 giây; giữ bằng chứng trong accept95-browser-production-v1. Sau khi xác nhận cache đủ 122 mục, tăng thời gian chờ QA lên 120 giây và chạy lại toàn bộ, giữ nguyên điều kiện offline/playback.
- Hồ sơ phát hành/rollback: accept95-release.json. Bản rollback v7 đã kiểm tra 12 API, hỗ trợ 311 ID câu và bank 2; không dùng learning.7 để rollback dữ liệu mới.

## Phạm vi và giới hạn

Codex chịu trách nhiệm rà soát nội dung theo chỉ định người dùng. Bản 277 câu được Gemini giải mù; phần mở rộng được Codex đối chiếu riêng, gồm 64 câu/17 bài đọc. Không tuyên bố cả 311 câu được một giáo viên độc lập hoặc một model khác nghiệm thu.

AI giữ 200 đầu ra của lượt live và bảy ca đầu ra lỗi dịch vụ. Replay v7 dùng đúng nội dung ghi lại với SDK mock; không phải 200 lời gọi live mới. Cả tám lỗi ngữ nghĩa model vẫn nằm trong mẫu số model, kể cả khi phần hiển thị đã dùng nguồn thay thế/chỉnh lý. Nguồn ENG_MASTER có nhãn riêng. Mẫu gồm 152 từ, không đại diện mọi phản hồi tương lai trên 1.575 từ.

Audio tổng hợp Kokoro local: 71 clip và track 45 phút, cả 72 file được giải mã/đối chiếu SHA. ASR giữ hai bất đồng như ca rõ tiếng chưa đạt; không tuyên bố chứng nhận nghe bởi người. Chưa đo tăng điểm người học, hiệu chuẩn điểm TOEIC/CEFR hoặc chứng nhận WCAG đầy đủ. Các tỷ lệ 100% áp dụng các ca đã chốt trong nhóm tương ứng.

Avatar, native Firestore TTL và nâng billing tiếp tục trì hoãn theo yêu cầu. Không thay cấu hình billing. Những phần này nằm ngoài phạm vi nghiệm thu hiện tại.
