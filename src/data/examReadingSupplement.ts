import type { LearningQuestion,ReadingPassage } from './extendedPractice';
// Original single-document items close the 29 single / 25 multi-document exam split.
export const EXAM_READING_SUPPLEMENT:ReadingPassage[]=[{
 id:'p7-accept-v1-handover',kind:'part7',title:'Email bàn giao công việc',topic:'Bàn giao công việc',
 text:`To: Customer support team
From: Nina Patel, Support Manager
Subject: Temporary arrangements for next week

I will be attending a supplier training course from Monday through Thursday next week. During my absence, please send urgent customer complaints to Omar, who will check the shared support mailbox every hour. Routine requests should remain in the mailbox for the staff member assigned to them; there is no need to forward these to Omar as well.

Our usual Wednesday team meeting has been moved to Friday at 9:30 a.m., when I will be back in the office. Please update your case summaries before the meeting, and allow ten minutes to review the attached report before we start. The report lists recurring delivery problems, rather than individual staff performance. We will use it to decide which instructions on our website need clarification. Please email me any proposed changes by Thursday afternoon so that I can include them in Friday's discussion.`,
 translation:'Nina dự khóa đào tạo của nhà cung cấp từ thứ Hai đến hết thứ Năm tuần tới. Khi Nina vắng mặt, gửi khiếu nại khẩn cho Omar, người kiểm tra hộp thư hỗ trợ chung mỗi giờ. Yêu cầu thường vẫn do nhân viên được phân công xử lý, không cần chuyển thêm cho Omar. Cuộc họp thường vào thứ Tư được chuyển sang thứ Sáu lúc 9:30 khi Nina đã về văn phòng. Cập nhật tóm tắt hồ sơ và dành mười phút trước giờ họp để đọc báo cáo đính kèm. Báo cáo nêu vấn đề giao hàng lặp lại, không đánh giá nhân viên; nhóm dùng nó để chọn hướng dẫn trên website cần làm rõ. Gửi đề xuất sửa đổi chậm nhất chiều thứ Năm để đưa vào thảo luận thứ Sáu.',
},{
 id:'p7-accept-v1-parking',kind:'part7',title:'Thông báo và bảng phí đỗ xe',topic:'Cơ sở vật chất',
 text:`NORTH COURT BUSINESS CENTER — PARKING NOTICE
From November 1, visitors must register their vehicle at reception before leaving the building. Registration does not reserve a space; parking remains available on a first-come, first-served basis. Employees should continue to use their access cards and must not park in spaces marked VISITOR.

Visitor charges:
Up to 1 hour: free
More than 1 hour, up to 3 hours: $4
More than 3 hours: $8 per visit

An employee hosting a visitor may request a parking voucher from reception. One voucher covers the entire charge for one vehicle on that visit, regardless of the length of stay. Vouchers are issued to hosts, not directly to visitors. Please request them before your guest leaves, as charges already paid cannot be refunded.

The entrance on West Street will be closed for resurfacing on November 6 only. On that date, both visitors and employees should use the South Road entrance. The pedestrian entrance and reception will operate as usual.`,
 translation:'Từ 1/11, khách đăng ký xe tại lễ tân trước khi rời tòa nhà. Đăng ký không giữ chỗ; chỗ đỗ dành cho người đến trước. Nhân viên tiếp tục dùng thẻ ra vào và không đỗ ở ô dành cho khách. Phí khách: tối đa một giờ miễn phí; hơn một đến tối đa ba giờ là 4 đô; hơn ba giờ là 8 đô/lượt. Nhân viên đón khách có thể xin phiếu tại lễ tân; một phiếu chi trả toàn bộ phí cho một xe trong lượt đó, bất kể thời gian lưu lại. Phiếu cấp cho người đón, không cấp trực tiếp cho khách. Xin trước khi khách rời đi vì phí đã trả không được hoàn. Riêng 6/11, lối West Street đóng để làm mặt đường; cả khách và nhân viên dùng South Road. Lối đi bộ và lễ tân hoạt động bình thường.',
}];
export const EXAM_SUPPLEMENT_QUESTIONS:LearningQuestion[]=[
 {id:'p7-accept-v1-handover-q1',kind:'part7',topic:'Bàn giao công việc',passageId:'p7-accept-v1-handover',difficulty:2,prompt:'What is the main purpose of the email?',options:['To announce temporary work arrangements.','To advertise a new delivery service.','To evaluate Omar’s performance.','To cancel all customer support work.'],correctIndex:0,explanation:'Email phân công xử lý công việc khi quản lý vắng mặt và đổi lịch họp; không phải thư quảng cáo hay đánh giá Omar.',evidence:'During my absence, please send urgent customer complaints to Omar'},
 {id:'p7-accept-v1-handover-q2',kind:'part7',topic:'Bàn giao công việc',passageId:'p7-accept-v1-handover',difficulty:2,prompt:'What should staff do with routine requests?',options:['Delete them after one hour.','Forward every request to Nina’s supplier.','Leave them for the assigned staff member.','Delay them until the next training course.'],correctIndex:2,explanation:'Yêu cầu thường vẫn nằm trong hộp thư để nhân viên được phân công xử lý; chỉ khiếu nại khẩn chuyển Omar.',evidence:'Routine requests should remain in the mailbox for the staff member assigned to them'},
 {id:'p7-accept-v1-handover-q3',kind:'part7',topic:'Bàn giao công việc',passageId:'p7-accept-v1-handover',difficulty:2,prompt:'By what time should staff begin reviewing the report if they use the full ten minutes before Friday’s meeting?',options:['9:40 a.m.','9:20 a.m.','9:30 a.m.','10:00 a.m.'],correctIndex:1,explanation:'Họp lúc 9:30; đọc đủ mười phút trước khi họp thì bắt đầu chậm nhất 9:20.',evidence:'allow ten minutes to review the attached report before we start'},
 {id:'p7-accept-v1-parking-q1',kind:'part7',topic:'Cơ sở vật chất',passageId:'p7-accept-v1-parking',difficulty:2,prompt:'How much does a visitor without a voucher pay for a stay of exactly three hours?',options:['$8.','$0.','$12.','$4.'],correctIndex:3,explanation:'Mốc hơn một giờ đến tối đa ba giờ gồm cả đúng ba giờ, nên phí là 4 đô.',evidence:'More than 1 hour, up to 3 hours: $4'},
 {id:'p7-accept-v1-parking-q2',kind:'part7',topic:'Cơ sở vật chất',passageId:'p7-accept-v1-parking',difficulty:2,prompt:'Who should obtain a parking voucher from reception?',options:['The employee hosting the visitor.','The visitor’s car manufacturer.','The resurfacing contractor.','Any visitor after paying the charge.'],correctIndex:0,explanation:'Phiếu cấp cho nhân viên đón khách; không cấp trực tiếp cho khách và không hoàn khoản đã trả.',evidence:'Vouchers are issued to hosts, not directly to visitors.'},
 {id:'p7-accept-v1-parking-q3',kind:'part7',topic:'Cơ sở vật chất',passageId:'p7-accept-v1-parking',difficulty:2,prompt:'What changes on November 6?',options:['Reception closes for the whole day.','All visitor parking becomes free.','Drivers must enter from South Road.','Employees must replace their access cards.'],correctIndex:2,explanation:'Chỉ lối xe West Street đóng ngày 6/11; mọi tài xế dùng South Road. Lễ tân và lối đi bộ không đổi.',evidence:'both visitors and employees should use the South Road entrance'},
];
