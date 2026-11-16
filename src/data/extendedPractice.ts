// Original ENG_MASTER content. IDs, answer order and bank version are immutable after release.
import type { WorkplaceLesson } from './workplacePractice';
export type ExtendedKind = 'part1' | 'part2' | 'part3' | 'part4' | 'part5' | 'context' | 'grammar' | 'part6' | 'part7';
export interface LearningQuestion { id:string; kind:ExtendedKind; topic:string; prompt:string; options:string[]; correctIndex:number; explanation:string; difficulty:1|2|3; lessonId?:string; passageId?:string; listeningId?:string; evidence?:string; }
export interface ReadingPassage { id:string; kind:'part6'|'part7'; title:string; topic:string; text:string; translation:string; }
export interface GrammarLesson { id:string; title:string; topic:string; rule:string; examples:{text:string;translation:string}[]; pitfall:string; }
export const GRAMMAR_LESSONS:GrammarLesson[]=[
  {id:'grammar-v2-word-forms',title:'Chọn đúng từ loại',topic:'Từ loại',rule:'Xác định vị trí trống cần danh từ, động từ, tính từ hay trạng từ. Tính từ thường bổ nghĩa danh từ; trạng từ có thể bổ nghĩa động từ hoặc tính từ. Đọc cả cụm thay vì chỉ nhìn đuôi từ.',examples:[{text:'The team responded quickly to the request.',translation:'Nhóm đã phản hồi yêu cầu một cách nhanh chóng.'},{text:'Please provide an accurate estimate.',translation:'Vui lòng cung cấp một bản ước tính chính xác.'}],pitfall:'Sau mạo từ có thể còn tính từ trước danh từ: an accurate estimate. Không kết luận mọi chỗ trống sau an đều là danh từ.'},
  {id:'grammar-v2-agreement',title:'Chủ ngữ và động từ',topic:'Hòa hợp chủ vị',rule:'Tìm danh từ chính của chủ ngữ. Cụm giới từ chen giữa không quyết định số của động từ. Ở hiện tại đơn, chủ ngữ số ít ngôi thứ ba thường đi với động từ thêm s/es.',examples:[{text:'The list of approved suppliers is on the website.',translation:'Danh sách nhà cung cấp được phê duyệt nằm trên website.'},{text:'Both offices open at nine.',translation:'Cả hai văn phòng đều mở cửa lúc chín giờ.'}],pitfall:'Trong the list of suppliers, chủ ngữ chính là list, không phải suppliers.'},
  {id:'grammar-v2-tenses',title:'Thì và mốc thời gian',topic:'Thì động từ',rule:'Đối chiếu dấu hiệu thời gian và ý nghĩa câu. Quá khứ đơn dùng cho sự việc đã kết thúc ở mốc quá khứ; hiện tại hoàn thành nối quá khứ với hiện tại; tương lai dùng khi nói kế hoạch hoặc sự việc sắp tới.',examples:[{text:'The branch opened in 2022.',translation:'Chi nhánh đã mở cửa vào năm 2022.'},{text:'We have used this system since March.',translation:'Chúng tôi đã dùng hệ thống này từ tháng Ba đến nay.'}],pitfall:'Since + mốc bắt đầu thường đi với hiện tại hoàn thành khi trạng thái vẫn tiếp diễn. Không dùng hiện tại hoàn thành chỉ vì câu có ngày tháng.'},
  {id:'grammar-v2-prepositions',title:'Giới từ thời gian',topic:'Giới từ thời gian',rule:'At thường chỉ giờ; on chỉ ngày hoặc ngày cụ thể; in chỉ tháng, năm hoặc buổi. By diễn tả hạn chót, until diễn tả sự tiếp diễn đến một thời điểm.',examples:[{text:'Send the form by Friday.',translation:'Gửi biểu mẫu chậm nhất vào thứ Sáu.'},{text:'The counter is open until six.',translation:'Quầy mở cửa cho đến sáu giờ.'}],pitfall:'By Friday là hạn hoàn tất; until Friday diễn tả một trạng thái hoặc hoạt động kéo dài đến thứ Sáu.'},
  {id:'grammar-v2-connectors',title:'Nối ý và phân biệt cụm từ',topic:'Liên từ',rule:'Because/although theo sau bởi mệnh đề có chủ ngữ và động từ. Because of/despite thường theo sau bởi danh từ, cụm danh từ hoặc dạng V-ing. Chọn cả cấu trúc lẫn quan hệ ý nghĩa.',examples:[{text:'Although demand increased, prices remained stable.',translation:'Mặc dù nhu cầu tăng, giá vẫn ổn định.'},{text:'The event was moved indoors because of the rain.',translation:'Sự kiện được chuyển vào trong nhà vì trời mưa.'}],pitfall:'Không đặt despite trực tiếp trước một mệnh đề hoàn chỉnh nếu không có cấu trúc như despite the fact that.'},
  {id:'grammar-v2-passive',title:'Câu bị động trong công việc',topic:'Bị động',rule:'Khi chủ ngữ nhận tác động, dùng dạng be + quá khứ phân từ. Sau động từ khuyết thiếu như must/can, bị động có dạng modal + be + V3.',examples:[{text:'The documents must be signed today.',translation:'Các tài liệu phải được ký hôm nay.'},{text:'The room was cleaned before the meeting.',translation:'Phòng đã được dọn trước cuộc họp.'}],pitfall:'Must be signed khác must sign: cần xem chủ ngữ là người ký hay tài liệu được ký.'},
];
const extra:LearningQuestion[]=[];
type Row=[string,string[],number,string,1|2|3];
const add=(kind:ExtendedKind,topic:string,rows:Row[],prefix:string)=>rows.forEach(([prompt,options,correctIndex,explanation,difficulty],i)=>extra.push({id:prefix+'-'+(i+1),kind,topic,prompt,options,correctIndex,explanation,difficulty}));
add('part5','Từ loại',[
 ['The technician inspected the equipment _____.',['careful','carefully','care','carefulness'],1,'Carefully là trạng từ bổ nghĩa inspected: kiểm tra một cách cẩn thận.',1],
 ['All visitors need written _____ to enter the laboratory.',['permit','permitted','permission','permissible'],2,'Written bổ nghĩa cho danh từ permission: sự cho phép bằng văn bản. Permit là giấy phép đếm được nên cần cấu trúc khác.',2],
 ['The new schedule is more _____ for employees who commute.',['convenience','conveniently','convenient','convene'],2,'Sau is more cần tính từ convenient để mô tả schedule.',1],
 ['Customer _____ is our main priority.',['satisfy','satisfactory','satisfying','satisfaction'],3,'Customer satisfaction là cụm danh từ nghĩa là sự hài lòng của khách hàng.',1],
 ['The report contains a _____ analysis of operating costs.',['detail','details','detailed','detailing'],2,'Detailed là tính từ đứng trước analysis: bản phân tích chi tiết.',2],
 ['The committee reached its decision _____.',['unanimous','unanimously','unanimity','unify'],1,'Unanimously là trạng từ bổ nghĩa reached: đạt quyết định một cách nhất trí.',2],
], 'p5-v2-forms');
add('part5','Hòa hợp chủ vị',[
 ['The package of replacement parts _____ on the loading dock.',['are','were','is','have'],2,'Chủ ngữ chính package là số ít nên dùng is; of replacement parts không làm đổi số của chủ ngữ.',2],
 ['Both branches _____ free delivery within the city.',['offers','offer','offering','has offered'],1,'Both branches là chủ ngữ số nhiều nên hiện tại đơn dùng offer.',1],
 ['Each applicant _____ to submit two references.',['need','needing','have needed','needs'],3,'Each applicant mang nghĩa số ít nên động từ hiện tại đơn là needs.',2],
 ['The instructions for assembling the desk _____ easy to follow.',['is','was','are','has been'],2,'Chủ ngữ chính instructions là số nhiều, phù hợp với are.',2],
 ['One of the meeting rooms _____ a video conferencing system.',['has','have','having','were having'],0,'One là chủ ngữ chính số ít, nên dùng has.',2],
 ['The manager and her assistant _____ attending the conference now.',['is','are','was','has'],1,'Hai người được nối bằng and là chủ ngữ số nhiều, dùng are attending.',1],
], 'p5-v2-agree');
add('part5','Thì động từ',[
 ['The company _____ its first overseas branch in 2019.',['opens','has opened','opened','opening'],2,'In 2019 là mốc quá khứ đã kết thúc, nên dùng quá khứ đơn opened.',1],
 ['We _____ this supplier since 2021 and still place orders every month.',['used','are using','have used','will use'],2,'Since 2021 cùng still cho biết trạng thái nối quá khứ với hiện tại: have used.',2],
 ['At the moment, the engineers _____ the new safety system.',['test','tested','are testing','has tested'],2,'At the moment chỉ hoạt động đang diễn ra; engineers số nhiều đi với are testing.',1],
 ['By the time the guests arrived yesterday, the staff _____ the tables.',['prepare','has prepared','had prepared','will prepare'],2,'Hành động chuẩn bị hoàn tất trước một sự việc quá khứ khác nên dùng had prepared.',3],
 ['The train _____ at 8:15 every weekday.',['leave','leaves','leaving','have left'],1,'Lịch chạy lặp lại dùng hiện tại đơn; the train số ít nên leaves.',1],
 ['The director says she _____ the revised proposal tomorrow.',['reviewed','has reviewed','had reviewed','will review'],3,'Tomorrow trong lời tường thuật hiện tại định hướng hành động tương lai: will review.',1],
], 'p5-v2-tense');
add('part5','Bị động',[
 ['All expense claims must _____ by a supervisor.',['approve','approved','be approved','approving'],2,'Claims nhận tác động phê duyệt; sau must dùng be approved.',1],
 ['The damaged items _____ to the warehouse yesterday.',['returned','were returned','return','have returned'],1,'Items được trả lại, với yesterday dùng quá khứ đơn bị động were returned.',2],
 ['The final invoice will _____ by email this afternoon.',['send','sent','be sent','sending'],2,'Invoice là hóa đơn được gửi, nên dùng will be sent.',1],
 ['The meeting room _____ before the clients arrived.',['had cleaned','had been cleaned','has cleaned','will clean'],1,'Phòng đã được dọn trước khi khách đến: quá khứ hoàn thành bị động had been cleaned.',3],
 ['The survey results are _____ on the company website.',['publish','publishing','publication','published'],3,'Are + published tạo dạng bị động: kết quả được công bố.',1],
 ['Employees _____ to wear identification badges while on site.',['require','are required','requiring','has required'],1,'Nhân viên được yêu cầu đeo thẻ: are required to.',2],
], 'p5-v2-passive');
add('part2','Địa điểm',[
 ['Where is the nearest photocopier?',['At half past ten.','Beside the reception desk.','I printed three copies.'],1,'Where hỏi địa điểm; beside the reception desk chỉ vị trí bên cạnh quầy lễ tân.',1],
 ['Where will the training session take place?',['In the second-floor conference room.','For two hours.','The trainers arrived early.'],0,'Câu hỏi nơi diễn ra buổi đào tạo; phòng họp tầng hai là địa điểm phù hợp.',1],
 ['Where should I leave these signed forms?',['They need your signature.','Before the deadline.','In the tray marked Human Resources.'],2,'Câu trả lời chỉ chỗ để biểu mẫu: khay có nhãn Human Resources.',1],
 ['Where did you park the company van?',['In the underground garage.','It needs new tires.','The company has two vans.'],0,'Park hỏi chỗ đỗ xe; underground garage là gara ngầm.',1],
 ['Where can visitors pick up a temporary badge?',['They are visiting tomorrow.','At the security counter.','The badges are blue.'],1,'Câu hỏi nơi nhận thẻ tạm; security counter là quầy an ninh.',1],
 ['Where will the new branch be located?',['It opened last month.','About twenty employees.','Across from the central station.'],2,'Across from the central station diễn tả vị trí chi nhánh mới.',1],
], 'p2-v2-where');
add('part2','Thời gian',[
 ['When is the revised budget due?',['By noon on Thursday.','It is under budget.','The finance department.'],0,'When hỏi hạn nộp; by noon on Thursday là một mốc thời gian.',1],
 ['When does the visitor center close?',['A map of the center.','At six in the evening.','Near the east entrance.'],1,'Close hỏi giờ đóng cửa; at six in the evening trả lời đúng trọng tâm.',1],
 ['When will the replacement printer arrive?',['The old one is broken.','We ordered two cartridges.','It is scheduled for Monday morning.'],2,'Monday morning là thời điểm dự kiến máy in đến.',1],
 ['When did you last update the contact list?',['Yesterday afternoon.','There are fifty contacts.','The new office number.'],0,'Câu hỏi một lần cập nhật đã xảy ra; yesterday afternoon là thời điểm quá khứ.',1],
 ['When can we discuss the proposal?',['It proposes a new service.','I have some time after lunch.','The document is six pages long.'],1,'Người trả lời nêu khoảng thời gian có thể thảo luận: sau bữa trưa.',2],
 ['When should I confirm my attendance?',['The seminar is popular.','The attendance sheet is full.','No later than Friday.'],2,'No later than Friday nêu hạn chót xác nhận tham dự.',1],
], 'p2-v2-when');
add('part2','Đề nghị và yêu cầu',[
 ['Could you email me the updated price list?',['The prices increased recently.','Certainly, I will send it now.','I bought it last week.'],1,'Certainly, I will send it now chấp nhận yêu cầu gửi bảng giá.',1],
 ['Would you like me to reserve a taxi?',['Yes, that would be helpful.','The taxi was yellow.','It is a reserved parking space.'],0,'Câu trả lời đồng ý với đề nghị đặt taxi; hai lựa chọn còn lại chỉ lặp từ liên quan.',1],
 ['Shall we review the contract together?',['The review was favorable.','It is a large conference.','Yes, let us meet at three.'],2,'Đề nghị xem hợp đồng cùng nhau được đáp bằng lời đồng ý và giờ gặp.',2],
 ['Could you hold the elevator for a moment?',['The moment has passed.','Of course, take your time.','It is on the maintenance schedule.'],1,'Of course, take your time thể hiện đồng ý giữ thang máy chờ.',2],
 ['Would you mind checking these figures?',['Not at all. Let me take a look.','There are four figures in the report.','I checked in yesterday.'],0,'Not at all là cách lịch sự nhận lời kiểm tra số liệu sau Would you mind.',2],
 ['Can someone cover my shift on Saturday?',['Saturday is my favorite day.','The cover is missing.','I can, if it is the morning shift.'],2,'Người trả lời nhận thay ca với điều kiện đó là ca sáng.',2],
], 'p2-v2-request');
add('part2','Phản hồi gián tiếp',[
 ['Who is responsible for arranging the shipment?',['Ask Ms. Chen in logistics.','The shipment weighs twenty kilos.','It arrived yesterday.'],0,'Câu trả lời hướng người hỏi đến người có thể cung cấp thông tin về trách nhiệm vận chuyển.',2],
 ['Why has the presentation been postponed?',['The presenter is from Boston.','The client requested more time to review the data.','At the downtown hotel.'],1,'Client requested more time nêu lý do hoãn buổi trình bày.',2],
 ['Do we need to print more brochures?',['A colorful brochure.','The printer is on the third floor.','There are still several boxes in storage.'],2,'Thông tin còn nhiều hộp brochure trong kho là phản hồi gián tiếp về nhu cầu in thêm.',3],
 ['Has the conference room been booked?',['Let me check the reservation calendar.','The book is on the table.','For twelve participants.'],0,'Người trả lời chưa xác nhận mà đề nghị kiểm tra lịch đặt phòng, vẫn đáp đúng ý câu hỏi.',2],
 ['How will you get to the trade fair?',['It runs for three days.','A colleague offered me a ride.','The tickets were reasonably priced.'],1,'A colleague offered me a ride nêu cách di chuyển: đi nhờ đồng nghiệp.',2],
 ['Is the application form available online?',['The applicant starts next week.','A line at the information desk.','The website is being updated; I can give you a paper copy.'],2,'Câu trả lời giải thích tình trạng website và đưa phương án bản giấy, đáp đúng nhu cầu lấy biểu mẫu.',3],
], 'p2-v2-indirect');
const grammarRows:Record<string,Row[]>={
 'Từ loại':[
  ['The team completed the installation _____.',['success','successful','successfully','succeed'],2,'Successfully là trạng từ bổ nghĩa completed.',1],
  ['The board requested a clear _____ of the risks.',['explain','explanation','explanatory','explained'],1,'Sau a clear cần danh từ explanation, nghĩa là lời giải thích.',1],
  ['The new packaging is both attractive and _____.',['durability','durably','endure','durable'],3,'Attractive và durable là hai tính từ song song sau both ... and.',2],
 ],
 'Hòa hợp chủ vị':[
  ['The number of online orders _____ increasing.',['are','is','were','have'],1,'The number là chủ ngữ số ít, nên dùng is increasing.',2],
  ['Several members of the committee _____ abroad each year.',['travels','travel','is traveling','has traveled'],1,'Several members là số nhiều, hiện tại đơn dùng travel.',1],
  ['Every employee _____ access to the internal portal.',['have','having','has','are having'],2,'Every employee là số ít, dùng has.',1],
 ],
 'Thì động từ':[
  ['Last month, the sales team _____ its quarterly target.',['exceeds','has exceeded','exceeded','will exceed'],2,'Last month là mốc quá khứ đã kết thúc, dùng exceeded.',1],
  ['Ms. Park _____ here since she graduated and still enjoys her job.',['worked','has worked','will work','was working'],1,'Since cùng trạng thái còn tiếp diễn phù hợp với has worked.',2],
  ['While I was preparing the slides, my colleague _____ the equipment.',['was checking','checks','has checked','will check'],0,'Hai hành động đang diễn ra song song ở quá khứ: was preparing và was checking.',2],
 ],
 'Giới từ thời gian':[
  ['The interview starts _____ 9:30.',['in','on','at','during'],2,'At dùng với giờ cụ thể như 9:30; in, on và during không dùng trực tiếp theo cách này trước một giờ cụ thể.',1],
  ['Our office will be closed _____ Monday, June 8.',['on','at','since','during'],0,'On dùng với ngày cụ thể.',1],
  ['The reception desk remains open _____ 8 p.m.',['by','until','within','since'],1,'Remains open là trạng thái kéo dài đến 8 giờ, nên dùng until.',2],
 ],
 'Liên từ':[
  ['_____ the heavy snow, all flights were canceled.',['Because','Although','Because of','Even though'],2,'Sau chỗ trống là cụm danh từ the heavy snow, nên dùng Because of.',1],
  ['_____ the report is lengthy, it is easy to understand.',['Despite','Although','Because of','During'],1,'Although nối với mệnh đề the report is lengthy và diễn tả nhượng bộ.',2],
  ['Please contact support _____ you encounter any technical problems.',['if','despite','during','because of'],0,'If mở đầu mệnh đề điều kiện: nếu gặp vấn đề kỹ thuật.',1],
 ],
 'Bị động':[
  ['The office windows _____ every Friday.',['clean','are cleaned','cleaning','has cleaned'],1,'Windows được lau; every Friday dùng hiện tại đơn bị động are cleaned.',1],
  ['The password must _____ every ninety days.',['change','changed','be changed','changing'],2,'Password nhận tác động thay đổi, sau must dùng be changed.',1],
  ['The invitations _____ before the venue changed last week.',['had sent','have sent','had been sent','are sending'],2,'Thư mời đã được gửi trước một thay đổi trong quá khứ: had been sent.',3],
 ],
};
GRAMMAR_LESSONS.forEach(lesson=>{const start=extra.length;add('grammar',lesson.topic,grammarRows[lesson.topic],lesson.id);extra.slice(start).forEach(question=>question.lessonId=lesson.id);});
export const READING_PASSAGES:ReadingPassage[]=[
 {id:'p6-v2-delivery',kind:'part6',title:'Email đổi lịch giao hàng',topic:'Giao hàng',text:'To: Harbor Office Supplies\nSubject: Updated delivery time\n\nThank you for your order. Our driver will (1) _____ your desks on Tuesday morning. The delivery was originally planned for Monday, but the warehouse is closed that day for an annual safety inspection.\n\nPlease ensure that someone is available to sign for the (2) _____. If the new time is inconvenient, contact us (3) _____ 4 p.m. today so that we can arrange another date.\n\n(4) _____\n\nBest regards,\nMaya Lewis, Delivery Coordinator',translation:'Cảm ơn đơn hàng của quý khách. Tài xế sẽ giao bàn vào sáng thứ Ba. Lịch ban đầu là thứ Hai, nhưng kho đóng cửa hôm đó để kiểm tra an toàn hằng năm. Vui lòng bố trí người ký nhận lô hàng. Nếu giờ mới không thuận tiện, liên hệ trước hạn 4 giờ chiều hôm nay để sắp xếp ngày khác.'},
 {id:'p6-v2-training',kind:'part6',title:'Thông báo đào tạo hệ thống',topic:'Đào tạo',text:'Staff Notice: Booking System Training\n\nThe company will introduce a new room-booking system next month. A training session will (1) _____ in Room 204 this Friday at 2 p.m. The session is intended for employees who regularly arrange meetings.\n\nParticipants should bring a laptop so that they can (2) _____ the booking process during the session. No software installation is necessary. (3) _____, please check that you can connect to the office wireless network.\n\n(4) _____ A second session will be offered next Wednesday for those who cannot attend on Friday.',translation:'Công ty đưa vào hệ thống đặt phòng mới từ tháng sau. Buổi đào tạo diễn ra tại Phòng 204 vào thứ Sáu lúc 2 giờ chiều, dành cho nhân viên thường tổ chức họp. Hãy mang laptop để thực hành. Không cần cài phần mềm, nhưng cần kiểm tra kết nối Wi-Fi văn phòng. Có buổi học thứ hai vào thứ Tư tới cho người không dự được thứ Sáu.'},
 {id:'p6-v2-renovation',kind:'part6',title:'Thông báo sửa khu vực tiếp khách',topic:'Cơ sở vật chất',text:'Lobby Renovation\n\nRenovation of the main lobby will begin on May 12 and is expected to last two weeks. During this period, all visitors must use the side (1) _____ on Pine Street. Clear signs will be placed outside the building.\n\nThe reception team will continue to assist visitors from a temporary desk on the ground floor. (2) _____ some noise is unavoidable, the contractor will carry out the loudest work before 9 a.m.\n\nWe appreciate your (3) _____ while these improvements are made. (4) _____',translation:'Sửa sảnh chính bắt đầu ngày 12 tháng Năm và dự kiến kéo dài hai tuần. Khách phải dùng lối bên đường Pine. Bộ phận lễ tân hỗ trợ tại bàn tạm ở tầng trệt. Dù không tránh khỏi tiếng ồn, công việc ồn nhất sẽ được làm trước 9 giờ sáng. Ban quản lý cảm ơn sự kiên nhẫn và dự kiến sảnh hoàn thiện sẽ tiện nghi hơn.'},
 {id:'p6-v2-membership',kind:'part6',title:'Email gia hạn hội viên',topic:'Dịch vụ khách hàng',text:'Dear Ms. Ortiz,\n\nYour annual membership at Westbridge Business Library will (1) _____ on June 30. Renewing before that date will ensure uninterrupted access to our online journals and meeting rooms.\n\nTo renew, sign in to your account and select Membership. The annual fee has not changed. Once payment is processed, a receipt will be sent (2) _____ to your registered email address.\n\nIf your contact details have changed, please update (3) _____ before completing payment. (4) _____\n\nSincerely,\nMembership Services',translation:'Thẻ hội viên thư viện kinh doanh Westbridge hết hạn ngày 30 tháng Sáu. Gia hạn trước ngày đó để tiếp tục truy cập tạp chí trực tuyến và phòng họp. Đăng nhập, chọn Membership; phí năm không đổi. Biên lai tự động gửi tới email đăng ký sau khi xử lý thanh toán. Hãy cập nhật thông tin liên hệ nếu đã thay đổi; bộ phận hội viên có thể hỗ trợ khi gặp khó khăn.'},
 {id:'p7-v2-workshop',kind:'part7',title:'Email và lịch hội thảo',topic:'Hội thảo',text:'EMAIL\nTo: Registered workshop participants\nFrom: Elena Tran, Event Coordinator\nSubject: Friday workshop update\n\nThe Customer Service Workshop will now be held in Room B, rather than Room A. The building entrance has not changed. Please arrive fifteen minutes before the opening session to collect your materials. The afternoon practical session is optional; email me by Wednesday if you would like to attend it.\n\nFRIDAY SCHEDULE\n9:00–10:30 Opening session\n10:45–12:00 Handling customer complaints\n12:00–1:00 Lunch\n1:00–2:30 Practical session',translation:'Hội thảo dịch vụ khách hàng chuyển từ Phòng A sang Phòng B; lối vào tòa nhà không đổi. Người tham dự cần đến sớm 15 phút để lấy tài liệu. Buổi thực hành chiều là tùy chọn, đăng ký qua email trước hạn thứ Tư. Lịch sáng bắt đầu 9 giờ; thực hành chiều từ 1 giờ đến 2 giờ 30.'},
 {id:'p7-v2-store',kind:'part7',title:'Thông báo cửa hàng',topic:'Bán lẻ',text:'NORTHLINE ELECTRONICS\nStore Collection Service\n\nPlace your order on our website and choose Collect in Store at checkout. Orders confirmed before 3 p.m. are usually ready the same day. You will receive an email when your items are ready; please wait for this message before visiting the store.\n\nBring your order number and a photo ID. A friend may collect an order on your behalf if you enter their name in your account before collection. Orders not collected within seven days will be canceled and refunded.\n\nCollection desk hours: Monday–Saturday, 10 a.m.–7 p.m. Closed on Sundays.',translation:'Đặt hàng trên website và chọn nhận tại cửa hàng. Đơn xác nhận trước 3 giờ chiều thường sẵn sàng trong ngày; hãy đợi email xác nhận hàng đã sẵn sàng. Khi nhận, mang mã đơn và giấy tờ có ảnh. Bạn có thể nhờ bạn bè nhận nếu khai báo tên người đó trước. Quá bảy ngày không nhận, đơn bị hủy và hoàn tiền. Quầy mở thứ Hai đến thứ Bảy, 10 giờ–19 giờ, nghỉ Chủ nhật.'},
 {id:'p7-v2-invoice',kind:'part7',title:'Hóa đơn và ghi chú thanh toán',topic:'Thanh toán',text:'CEDAR DESIGN STUDIO\nInvoice CD-418\nIssued: September 2\nClient: Brookfield Travel\n\nWebsite banner design: $360\nThree brochure layouts: $540\nTotal due: $900\nPayment deadline: September 16\n\nPlease include CD-418 as the payment reference. Payments should be made by bank transfer; bank details appear in the client portal. Printed brochures and printing services are not included in this invoice. For questions about the listed design work, contact accounts@cedar.example.',translation:'Hóa đơn CD-418 ngày 2 tháng Chín cho Brookfield Travel gồm thiết kế banner website 360 đô và ba bản bố cục brochure 540 đô, tổng 900 đô, hạn thanh toán 16 tháng Chín. Chuyển khoản và ghi mã CD-418; thông tin ngân hàng có trong cổng khách hàng. Hóa đơn không gồm brochure in sẵn hoặc dịch vụ in.'},
 {id:'p7-v2-recruitment',kind:'part7',title:'Tin tuyển trợ lý điều phối',topic:'Tuyển dụng',text:'OPERATIONS ASSISTANT — LARKIN EVENTS\n\nWe are seeking an organized assistant to support our event coordination team. Duties include maintaining supplier records, preparing schedules, and answering client inquiries. Previous experience in event planning is welcome but is not required. Applicants must be comfortable using spreadsheets and communicating in English.\n\nThis is a full-time role based at our downtown office. Occasional Saturday work is required during major events; employees receive a weekday off in return.\n\nEmail a résumé and a short cover letter by April 18. Shortlisted applicants will be contacted for interviews in the following week.',translation:'Larkin Events tuyển trợ lý vận hành làm toàn thời gian ở văn phòng trung tâm: quản lý hồ sơ nhà cung cấp, chuẩn bị lịch và trả lời khách. Có kinh nghiệm sự kiện là lợi thế nhưng không bắt buộc; cần dùng bảng tính và giao tiếp tiếng Anh. Đôi khi làm thứ Bảy và được nghỉ bù ngày thường. Nộp CV và thư ứng tuyển ngắn trước hạn 18 tháng Tư.'},
 {id:'p7-v2-train',kind:'part7',title:'Thông báo đường sắt và lịch thay thế',topic:'Đi lại',text:'RIVERLINE RAIL NOTICE\nEngineering work: Sunday, October 11\n\nTrains between Easton and Mill Park will not operate before noon. Replacement buses will run every thirty minutes from outside Easton Station, beginning at 6 a.m. Travel by bus is expected to take twenty minutes longer than the usual train journey. Regular rail tickets will be accepted on the replacement buses at no additional charge.\n\nTrains on the Mill Park–Harbor section will operate normally throughout the day. Normal service between Easton and Mill Park resumes at noon.',translation:'Chủ nhật 11 tháng Mười, tàu Easton–Mill Park ngừng trước trưa để thi công. Xe buýt thay thế khởi hành ngoài ga Easton từ 6 giờ, mỗi 30 phút; đi lâu hơn tàu khoảng 20 phút và chấp nhận vé tàu không thu thêm phí. Đoạn Mill Park–Harbor vẫn hoạt động bình thường. Tàu Easton–Mill Park chạy lại lúc trưa.'},
 {id:'p7-v2-feedback',kind:'part7',title:'Phản hồi khách và thư trả lời',topic:'Dịch vụ khách hàng',text:'CUSTOMER MESSAGE\nI attended the breakfast seminar at your hotel on Tuesday. The staff were welcoming, and the room was comfortable. However, the printed agenda said breakfast would be available until 9:30, while the buffet was cleared at 9:00. Several attendees, including me, missed breakfast. — Jordan Blake\n\nHOTEL REPLY\nDear Mr. Blake,\nThank you for bringing this to our attention. We used an outdated agenda template, which listed the wrong breakfast time. We have corrected the template and will ask event staff to confirm service times at the start of future seminars. We would also like to refund your breakfast charge; please send us your booking reference.',translation:'Khách Jordan Blake hài lòng với nhân viên và phòng hội thảo nhưng bỏ lỡ bữa sáng vì tài liệu ghi phục vụ tới 9 giờ 30 trong khi buffet dọn lúc 9 giờ. Khách sạn nhận lỗi dùng mẫu chương trình cũ, đã sửa và sẽ xác nhận giờ phục vụ ở đầu sự kiện. Khách sạn đề nghị hoàn phí bữa sáng và cần mã đặt chỗ.'},
];
const reading=(passageId:string,rows:Row[])=>{const passage=READING_PASSAGES.find(row=>row.id===passageId)!;const start=extra.length;add(passage.kind,passage.topic,rows,passageId);extra.slice(start).forEach(question=>question.passageId=passageId);};
reading('p6-v2-delivery',[
 ['Chọn từ cho chỗ trống (1).',['deliver','delivery','delivered','delivering'],0,'Sau will cần động từ nguyên mẫu deliver: giao các bàn làm việc.',1],
 ['Chọn từ cho chỗ trống (2).',['shipping','shipment','ship','shipped'],1,'Sign for the shipment nghĩa là ký nhận lô hàng; cần danh từ shipment.',2],
 ['Chọn từ cho chỗ trống (3).',['in','on','by','since'],2,'By 4 p.m. nêu hạn chót cần liên hệ để thay lịch.',1],
 ['Chọn câu phù hợp cho chỗ trống (4).',['We look forward to completing your delivery.','No signature will be required for this order.','Please ignore the updated delivery schedule.','The warehouse will be open all day on Monday.'],0,'Đoạn thư đang xác nhận lịch giao hàng; lời kết về việc hoàn tất giao hàng nối đúng chủ đề.',2],
]);
reading('p6-v2-training',[
 ['Chọn từ cho chỗ trống (1).',['held','be held','holding','have held'],1,'A training session là buổi học được tổ chức; will be held là bị động tương lai.',1],
 ['Chọn từ cho chỗ trống (2).',['practice','practical','practically','practitioner'],0,'Sau can cần động từ nguyên mẫu practice: thực hành quy trình đặt phòng.',1],
 ['Chọn từ nối cho chỗ trống (3).',['Otherwise','However','For example','As a result'],1,'Không cần cài phần mềm, tuy nhiên vẫn phải kiểm tra kết nối mạng; However thể hiện chuyển ý phù hợp.',2],
 ['Chọn câu phù hợp cho chỗ trống (4).',['Please let your supervisor know which session you plan to attend.','All training sessions are canceled this month.','Please leave your laptop at home.','The session can only be accessed from outside the office.'],0,'Câu nhắc thông báo buổi sẽ tham dự nối hợp lý với thông tin có buổi học thứ hai ở câu sau.',2],
]);
reading('p6-v2-renovation',[
 ['Chọn từ cho chỗ trống (1).',['entryway','enter','entering','entered'],0,'Sau side cần danh từ entryway: lối vào bên hông tòa nhà.',2],
 ['Chọn từ nối cho chỗ trống (2).',['Despite','Although','Because of','During'],1,'Sau chỗ trống là mệnh đề some noise is unavoidable, dùng Although để diễn tả nhượng bộ.',2],
 ['Chọn từ cho chỗ trống (3).',['patient','patiently','patience','patients'],2,'Your patience là cụm danh từ: sự kiên nhẫn của quý khách.',1],
 ['Chọn câu phù hợp cho chỗ trống (4).',['The finished lobby will provide a more welcoming space for everyone.','Visitors should continue to use the main lobby.','The renovation will not affect the lobby.','Reception services will be unavailable until next month.'],0,'Câu kết nói lợi ích của sảnh sau sửa chữa, phù hợp toàn bộ thông báo.',2],
]);
reading('p6-v2-membership',[
 ['Chọn từ cho chỗ trống (1).',['expand','expire','expect','express'],1,'Membership sẽ hết hạn vào June 30; expire là động từ đúng nghĩa.',1],
 ['Chọn từ cho chỗ trống (2).',['automatic','automation','automate','automatically'],3,'Automatically là trạng từ bổ nghĩa will be sent: được gửi tự động.',1],
 ['Chọn từ cho chỗ trống (3).',['they','their','them','theirs'],2,'Them là đại từ tân ngữ thay cho contact details sau update.',2],
 ['Chọn câu phù hợp cho chỗ trống (4).',['Our membership team can help if you have trouble with the renewal process.','The annual fee has doubled this year.','Paper receipts can only be collected at reception.','Your access will end even if you renew on time.'],0,'Câu đề nghị hỗ trợ gia hạn tiếp nối hướng dẫn thanh toán; không mâu thuẫn với quyền truy cập đã nêu.',2],
]);
reading('p7-v2-workshop',[
 ['What has changed about the workshop?',['Its building entrance','Its meeting room','Its opening date','Its registration fee'],1,'Email ghi chuyển từ Room A sang Room B và lối vào không đổi.',1],
 ['What time should participants arrive to collect their materials?',['8:30 a.m.','8:45 a.m.','9:15 a.m.','10:30 a.m.'],1,'Lịch mở đầu 9:00; email yêu cầu đến trước 15 phút, tức 8:45.',2],
 ['What should someone do to attend the afternoon session?',['Pay an extra fee at reception','Bring a printed agenda','Email the coordinator by Wednesday','Book Room A directly'],2,'Email nêu buổi thực hành là tùy chọn và cần gửi email cho điều phối viên trước hạn thứ Tư.',2],
]);
reading('p7-v2-store',[
 ['What should a customer do before visiting the collection desk?',['Wait for the ready-for-collection email','Call the manufacturer','Print the entire online catalog','Cancel the delivery service'],0,'Thông báo yêu cầu đợi email xác nhận hàng sẵn sàng trước khi đến.',1],
 ['Under what condition may a friend collect an order?',['The friend pays an additional fee','The customer adds the friend’s name in the account beforehand','The friend arrives on Sunday','The order has been waiting over seven days'],1,'Người mua phải nhập tên người nhận thay trong tài khoản trước lúc nhận hàng.',2],
 ['What happens to an order that is not collected within seven days?',['It is transferred to another store','A storage fee is charged','It is delivered automatically','It is canceled and refunded'],3,'Thông báo nêu rõ orders not collected within seven days will be canceled and refunded.',1],
]);
reading('p7-v2-invoice',[
 ['What is the total amount due?',['$360','$540','$900','$1,080'],2,'Total due trên hóa đơn là $900, bằng 360 + 540.',1],
 ['Which service is NOT included?',['Website banner design','Brochure layout design','Printed brochures','Design work for Brookfield Travel'],2,'Ghi chú loại trừ printed brochures và dịch vụ in; các mục thiết kế có trên hóa đơn.',2],
 ['What should the client include when making payment?',['The invoice reference CD-418','A copy of its travel brochure','The designer’s personal address','A membership number'],0,'Ghi chú yêu cầu dùng CD-418 làm payment reference khi chuyển khoản.',1],
]);
reading('p7-v2-recruitment',[
 ['Which skill is required for the position?',['Designing event venues','Using spreadsheets','Driving a delivery van','Managing hotel restaurants'],1,'Thông báo yêu cầu comfortable using spreadsheets và giao tiếp tiếng Anh.',1],
 ['What is stated about Saturday work?',['It is required every week','It is paid only in cash','It may be necessary, with a weekday off in return','It is never part of the role'],2,'Đôi khi phải làm thứ Bảy khi có sự kiện lớn và được nghỉ bù ngày thường.',2],
 ['What must applicants send by April 18?',['A résumé and a short cover letter','A full event budget','Two signed contracts','A software certificate'],0,'Hướng dẫn ứng tuyển yêu cầu résumé và short cover letter trước hạn 18 tháng Tư.',1],
]);
reading('p7-v2-train',[
 ['Which section is affected before noon?',['Mill Park–Harbor','Harbor–Easton direct express','Easton–Mill Park','Every Riverline service'],2,'Thông báo ngừng tàu Easton–Mill Park trước trưa; đoạn Mill Park–Harbor vẫn bình thường.',1],
 ['How much extra must regular ticket holders pay for a replacement bus?',['Nothing','$2','$5','The full bus fare'],0,'Regular rail tickets được chấp nhận trên xe buýt mà không thu thêm phí.',1],
 ['What should passengers allow for when using the replacement bus?',['A twenty-minute longer journey','A departure every ten minutes','A walk from Mill Park to Harbor','An afternoon-only service'],0,'Hành trình xe buýt dự kiến lâu hơn tàu thông thường 20 phút.',2],
]);
reading('p7-v2-feedback',[
 ['What problem does Mr. Blake report?',['An uncomfortable seminar room','An unfriendly receptionist','A buffet time that differed from the printed agenda','An incorrect room booking date'],2,'Khách phản ánh tài liệu ghi ăn sáng tới 9:30 nhưng buffet dọn lúc 9:00.',1],
 ['Why did the hotel provide incorrect information?',['An attendee changed the schedule','An outdated template was used','The event staff arrived late','The booking system was unavailable'],1,'Thư trả lời nhận lỗi dùng agenda template cũ có giờ ăn sáng sai.',1],
 ['Why does the hotel request a booking reference?',['To issue a breakfast refund','To register the customer for another seminar','To change the room temperature','To send a revised invoice for the venue'],0,'Khách sạn đề nghị hoàn phí bữa sáng rồi yêu cầu mã đặt chỗ để xử lý.',2],
]);
export const EXTRA_WORKPLACE_LESSONS:WorkplaceLesson[]=[
 {id:'workplace-v2-supplier',title:'Xác nhận đơn hàng với nhà cung cấp',lines:[{speaker:'A',text:'Could you confirm whether the replacement parts will arrive by Thursday? Our maintenance team needs them for the weekend inspection.',translation:'Bạn có thể xác nhận linh kiện thay thế có đến trước hạn thứ Năm không? Nhóm bảo trì cần chúng để kiểm tra cuối tuần.'},{speaker:'B',text:'The parts are ready to ship today. I will send the tracking number this afternoon and let you know immediately if the delivery date changes.',translation:'Linh kiện đã sẵn sàng gửi hôm nay. Tôi sẽ gửi mã theo dõi chiều nay và báo ngay nếu ngày giao thay đổi.'}],note:'replacement parts: linh kiện thay thế; ready to ship: sẵn sàng gửi; tracking number: mã theo dõi.'},
 {id:'workplace-v2-onboarding',title:'Hướng dẫn nhân viên mới',lines:[{speaker:'A',text:'Before you begin, please collect your identification badge from reception. The orientation session starts at ten in the training room.',translation:'Trước khi bắt đầu, hãy nhận thẻ nhân viên ở lễ tân. Buổi hướng dẫn bắt đầu lúc mười giờ trong phòng đào tạo.'},{speaker:'B',text:'Thank you. Should I bring my laptop, or will the company provide one for the session?',translation:'Cảm ơn. Tôi nên mang laptop của mình hay công ty sẽ cung cấp máy cho buổi hướng dẫn?'},{speaker:'A',text:'A laptop will be provided. You only need the welcome email, which contains your temporary login details.',translation:'Công ty sẽ cung cấp laptop. Bạn chỉ cần email chào mừng có thông tin đăng nhập tạm thời.'}],note:'identification badge: thẻ nhân viên; orientation session: buổi hướng dẫn ban đầu; temporary login details: thông tin đăng nhập tạm thời.'},
];
const context=(lessonId:string,rows:Row[])=>{const start=extra.length;add('context','Giao tiếp công việc',rows,lessonId);extra.slice(start).forEach(q=>q.lessonId=lessonId);};
context('workplace-v2-supplier',[
 ['Why does the maintenance team need the parts?',['For a weekend inspection','For a customer seminar','For a new website','For a job interview'],0,'Người A nói nhóm bảo trì cần linh kiện cho đợt kiểm tra cuối tuần.',1],
 ['When will the tracking number be sent?',['Next Thursday','This afternoon','After the inspection','Next month'],1,'Người B hứa gửi tracking number chiều nay.',1],
 ['What will the supplier do if the delivery date changes?',['Cancel all orders','Wait until the inspection ends','Inform the customer immediately','Change the invoice currency'],2,'Người B nói sẽ let you know immediately nếu ngày giao thay đổi.',2],
]);
context('workplace-v2-onboarding',[
 ['Where should the new employee collect a badge?',['In the training room','At reception','At the warehouse','In the cafeteria'],1,'Người A hướng dẫn nhận identification badge tại reception.',1],
 ['What time does the orientation begin?',['Nine','Nine thirty','Ten','Eleven'],2,'Buổi orientation bắt đầu at ten.',1],
 ['What does the new employee need to bring?',['A personal laptop','A printed supplier list','A maintenance report','The welcome email'],3,'Laptop được cung cấp; người mới chỉ cần email chào mừng có thông tin đăng nhập tạm thời.',2],
]);
export const EXTENDED_PRACTICE_BANK:readonly LearningQuestion[]=extra;
