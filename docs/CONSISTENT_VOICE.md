# Giọng đọc thống nhất

Bản sửa ngày 16/11/2026 thay giọng hệ thống cho từ vựng đóng gói bằng audio cố định được tạo local với [hexgrad/Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M). Nguồn model Apache-2.0; attribution trong public/learning/pronunciation-v1/NOTICE.txt. Không gọi dịch vụ TTS ngoài và không gửi dữ liệu người học/từ cá nhân.

- 1.575 từ dùng cùng giọng `am_michael` (Michael, Anh Mỹ) trong thẻ học, luyện tự do, Thư viện và quiz nghe từ. Cùng một từ trỏ cùng một audio/cue, không phụ thuộc thứ tự giọng trình duyệt. Tốc độ phát vẫn điều chỉnh được và giữ cao độ qua HTMLAudio.
- Tám hội thoại công sở đã biên soạn có 17 câu với giọng cố định theo người nói: `am_michael`, `af_heart`, và `bf_emma` nếu có người thứ ba. Nghe riêng câu, lặp và nghe toàn bài dùng cùng mapping.
- Audio Listening/đề 200 câu hiện có giữ nguyên file, cue, nội dung và thời lượng; nhiều giọng trong hội thoại là chủ ý phân vai.
- Từ cá nhân chưa có audio đóng gói dùng giọng tiếng Anh của thiết bị đã chọn; UI ghi rõ phạm vi này. Không hứa cùng giọng giữa các hệ điều hành cho nội dung người dùng tự thêm. Lựa chọn mặc định được giữ ổn định trong phiên, chờ danh sách giọng tải thay vì phát bằng giọng mặc định không rõ ngôn ngữ.
- Lỗi tải audio đóng gói hiện thông báo thử lại/tải gói offline, không âm thầm chuyển sang giọng thiết bị. Chuyển màn hình, đổi tài khoản hoặc chuyển ứng dụng ra nền dừng âm thanh; yêu cầu phát cũ không được phát muộn chồng lên yêu cầu mới.

Audio được đóng thành các pack MP3 có khoảng lặng giữa cue để giảm số request offline; dữ liệu tra cứu trong src/data/pronunciationAudioManifest.json. Bộ render kiểm tra hash trọng số chính thức, sinh WAV local và chuẩn hóa âm lượng MP3; manifest chỉ ghi sau khi mọi pack hoàn tất. Khôi phục bằng scripts/prepare-pronunciation-audio.mjs và scripts/render-pronunciation-audio.py; script render dùng dependency Kokoro có sẵn trong workspace TTS bên cạnh, chỉ đọc dependency/model/voice của dự án đó.

Bằng chứng mới: output/verification/pronunciation-audio-verification.json (giải mã/hash/cue), voice-unit.log, voice-typecheck.log và voice-browser.json. Kiểm tra âm thanh tự động không phải chứng nhận người nghe đã duyệt từng cách phát âm, trọng âm hoặc mọi thiết bị iOS. Mốc nghiệm thu 95% learning.8 là hồ sơ bản trước, không được tự suy rộng từ số test mới.
