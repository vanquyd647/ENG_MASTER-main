import type { AiSource } from '../domain/aiContent.js';
// Author-written constraints steer generation; they never replace generated examples
// or count source-only fallbacks as successful AI generations.
export const GENERATED_CAUTION='Bài này bám nghĩa và ví dụ đang học. Không suy ra rằng từ chỉ dùng được trong ngữ cảnh này.';
export const teachingConstraints=(source:AiSource):string[]=>{
 const specific:Record<string,string[]>={
  highly:['Highly là trạng từ mức độ, dùng với tính từ/phân từ và một số động từ như highly recommend. Không giới hạn rằng nó không đi với động từ thường. High dùng cho độ cao vật lý.'],
  headquarters:['Headquarters có cùng hình thức ở số ít và số nhiều. Có thể dùng với động từ số ít hoặc số nhiều theo cách diễn đạt; không nói việc này do quy định của công ty hoặc từ vốn có hình thái số ít.'],
  procrastinate:['Procrastinate là nội động từ chỉ chần chừ làm việc cần làm. Stop procrastinating là ngừng chần chừ; stop to procrastinate không có nghĩa đó. Postpone có thể do chính người thực hiện quyết định, không nhất thiết do người khác.'],
  reliable:['Reliable có thể mô tả người, thiết bị, dữ liệu và thông tin đáng tin cậy. Reliable information là cách dùng hợp lệ; không đặt lệnh cấm dùng cho thông tin.'],
  reimburse:['Reimburse someone for an expense; reimburse expenses. Hoàn trả khoản đã chi, không chỉ nhân viên hay chi phí công việc. Participants dịch là người tham gia, không tự đổi thành nhân viên.'],
  monitor:['Monitor ở nguồn này là ngoại động từ theo dõi/giám sát. Monitor a system / monitor the system / monitor progress; không dùng monitor system như cụm động từ với system số ít thiếu từ hạn định.'],
  occasionally:['Occasionally viết đúng với hai chữ l, nghĩa thỉnh thoảng. Thường trước động từ thường hoặc sau be. Không suy thành quy tắc cấm các vị trí khác.'],
  employee:['Employee là người làm việc cho người sử dụng lao động; người quản lý cũng có thể là employee. Employee benefits nghĩa là chế độ phúc lợi cho nhân viên.'],
  promote:['Với nghĩa thăng chức/đề bạt đang học, dùng promote an employee / promote someone to manager. Ví dụ catalog về quảng bá sản phẩm minh họa nghĩa KHÁC; hãy tạo ví dụ mới về thăng chức cho nghĩa hiện tại.'],
 };
 return ['Mọi nội dung tiếng Việt phải có dấu chuẩn và khoảng trắng đúng, kể cả summary/collocations/examples.','Chỉ giải thích nghĩa và cách kết hợp từ mục tiêu; bỏ nhận xét ngữ pháp về các từ khác trong câu.',...(specific[source.word.toLowerCase()]||[])];
};
export {assertLessonTeaching,assertVietnameseTeaching} from '../domain/teachingSafety.js';
