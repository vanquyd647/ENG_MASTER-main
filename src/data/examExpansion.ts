import type { LearningQuestion, ReadingPassage } from './extendedPractice';
import type { ListeningStimulus } from './listeningPractice';

// Original ENG_MASTER authoring, v1. Never change released IDs, scripts or answer order.
// Evidence is an exact source excerpt for review; it is not independent acceptance.
export const EXPANSION_LISTENING: ListeningStimulus[] = [];
export const EXPANSION_PASSAGES: ReadingPassage[] = [];
export const EXPANSION_QUESTIONS: LearningQuestion[] = [];
type Row = [prompt:string, answer:string, distractor1:string, distractor2:string, distractor3:string, explanation:string, evidence:string];
const questions = (id:string, kind:'part3'|'part4'|'part7', topic:string, rows:Row[]) => rows.forEach(([prompt, answer, ...rest], i) => {
  const [d1,d2,d3,explanation,evidence]=rest;
  const offset=(EXPANSION_QUESTIONS.length+1)%4, original=[answer,d1,d2,d3];
  EXPANSION_QUESTIONS.push({id:id+'-q'+(i+1),kind,topic,prompt,options:[...original.slice(offset),...original.slice(0,offset)],correctIndex:(4-offset)%4,explanation,evidence,difficulty:2,...(kind==='part7'?{passageId:id}:{listeningId:id})});
});
const conversation = (slug:string, topic:string, turns:[string,string][], rows:Row[]) => {
 const id='p3-exam-v1-'+slug;
 EXPANSION_LISTENING.push({id,kind:'part3',title:topic,lines:turns.map(([text,translation],i)=>({speaker:slug==='software'&&i===2?'C':i%2?'B':'A',text,translation}))});questions(id,'part3',topic,rows);
};
const talk = (slug:string, topic:string, text:string, translation:string, rows:Row[]) => {
 const id='p4-exam-v1-'+slug;
 EXPANSION_LISTENING.push({id,kind:'part4',title:topic,lines:[{speaker:'Speaker',text,translation}],...(slug==='shuttle'?{graphic:{title:'Shuttle departures',columns:['Destination','Bay'],rows:[['Airport','4'],['City Center','1'],['Harbor','3']]}}:{})});questions(id,'part4',topic,rows);
};
const reading = (slug:string, title:string, text:string, translation:string, rows:Row[]) => {
 const id='p7-exam-v1-'+slug;
 EXPANSION_PASSAGES.push({id,kind:'part7',title,topic:title,text,translation});questions(id,'part7',title,rows);
};

conversation('registration','Đăng ký hội thảo',[
 ['Hello. I registered for the sales workshop, but my confirmation email lists the online session. I wanted to attend in person.','Xin chào. Tôi đã đăng ký hội thảo bán hàng nhưng email xác nhận ghi buổi trực tuyến. Tôi muốn dự trực tiếp.'],
 ['There are still seats in the in-person session on Tuesday. I can change your registration without a fee.','Buổi trực tiếp thứ Ba vẫn còn chỗ. Tôi có thể đổi đăng ký miễn phí.'],
 ['Thank you. Should I bring a printed ticket?','Cảm ơn. Tôi có cần mang vé in không?'],
 ['No. Just show the confirmation email on your phone at the reception desk. I will send an updated email now.','Không. Chỉ cần cho lễ tân xem email xác nhận trên điện thoại. Tôi sẽ gửi email cập nhật ngay.'],
],[
 ['Why is the caller contacting the workshop organizer?','To change the attendance format.','To request a refund.','To apply for a sales position.','To cancel all workshop sessions.','Người gọi muốn đổi từ trực tuyến sang tham dự trực tiếp.','I wanted to attend in person.'],
 ['When is the in-person session?','On Tuesday.','On Monday.','On Wednesday.','On Friday.','Nhân viên nói buổi trực tiếp diễn ra thứ Ba.','in-person session on Tuesday'],
 ['What should the caller show at reception?','A confirmation email on a phone.','A printed parking permit.','An employee contract.','A payment receipt only.','Không cần vé in; email xác nhận trên điện thoại được chấp nhận.','show the confirmation email on your phone'],
]);
conversation('restaurant','Đặt bàn',[
 ['I booked a table for six at seven tonight, but two colleagues cannot come. Could you change it to four people?','Tôi đặt bàn sáu người lúc bảy giờ tối nay, nhưng hai đồng nghiệp không đến được. Có thể đổi thành bốn người không?'],
 ['Certainly. Your table will still be ready at seven. Would you prefer a table near the window?','Được. Bàn vẫn sẵn sàng lúc bảy giờ. Anh muốn ngồi gần cửa sổ không?'],
 ['Yes, please. One guest cannot eat peanuts. Can you inform the kitchen?','Có, cảm ơn. Một khách không ăn được đậu phộng. Cô báo nhà bếp giúp nhé?'],
 ['I will add that note to the reservation and speak to the chef before you arrive.','Tôi sẽ ghi chú vào đặt chỗ và trao đổi với bếp trưởng trước khi anh đến.'],
],[
 ['How many people will attend the dinner?','Four.','Two.','Six.','Seven.','Sáu người ban đầu trừ hai người không đến, còn bốn.','change it to four people'],
 ['What will remain unchanged?','The reservation time.','The number of guests.','The dietary note.','The table location requested originally.','Nhân viên xác nhận bàn vẫn sẵn sàng lúc bảy giờ.','still be ready at seven'],
 ['What will the restaurant employee do?','Tell the chef about a dietary restriction.','Cancel the dinner.','Charge a window-table fee.','Send a menu by mail.','Nhân viên sẽ ghi chú việc không ăn đậu phộng và trao đổi với bếp trưởng.','speak to the chef before you arrive'],
]);
conversation('printer','Sửa máy in',[
 ['The printer on the second floor keeps leaving dark lines on our documents. We need clean copies for a client meeting tomorrow.','Máy in tầng hai liên tục để lại vệt đen. Chúng tôi cần bản in sạch cho cuộc họp khách hàng ngày mai.'],
 ['A technician can come at two this afternoon. Until then, you can use the printer in the ground-floor copy room.','Kỹ thuật viên có thể đến lúc hai giờ chiều nay. Trong lúc chờ, có thể dùng máy in tại phòng sao chụp ở tầng trệt.'],
 ['That will help. Should I send the technician a sample of the problem?','Như vậy tốt. Tôi có nên gửi bản mẫu lỗi cho kỹ thuật viên không?'],
 ['Yes, please email a scanned copy to our support address.','Có, vui lòng gửi bản quét qua email hỗ trợ của chúng tôi.'],
],[
 ['What problem is reported?','Dark lines appear on printed documents.','The printer has been delivered late.','The meeting has been canceled.','The office has run out of paper.','Lỗi được nêu là các vệt đen trên tài liệu in.','leaving dark lines on our documents'],
 ['Where can staff print documents temporarily?','In the ground-floor copy room.','In the client office.','In the second-floor cafeteria.','At the reception counter.','Nhân viên được hướng dẫn dùng máy tại phòng sao chụp tầng trệt.','ground-floor copy room'],
 ['What does the support employee request?','An emailed scan of a defective printout.','A new client contract.','A payment in cash.','The original purchase box.','Nhân viên yêu cầu email bản quét để xem mẫu lỗi in.','email a scanned copy to our support address'],
]);
conversation('hotel','Nhận phòng khách sạn',[
 ['I have a room reservation for tonight. My flight arrives at eleven in the morning. Could I check in then?','Tôi có đặt phòng tối nay. Chuyến bay đến lúc mười một giờ sáng. Tôi có thể nhận phòng lúc đó không?'],
 ['Our regular check-in time is three. Early check-in depends on room availability, but we can store your luggage for free.','Giờ nhận phòng thường lệ là ba giờ. Nhận sớm tùy phòng trống, nhưng chúng tôi giữ hành lý miễn phí.'],
 ['That is useful. I have a meeting at one, so I will leave my bags and come back later.','Thật tiện. Tôi có cuộc họp lúc một giờ nên sẽ gửi hành lý rồi quay lại sau.'],
 ['Of course. Please bring your booking confirmation and identification when you return to check in.','Được. Khi quay lại nhận phòng, vui lòng mang xác nhận đặt phòng và giấy tờ tùy thân.'],
],[
 ['What does the guest ask about?','Checking in before the regular time.','Canceling a flight.','Changing the meeting location.','Extending a stay by a week.','Khách hỏi có thể nhận phòng lúc 11 giờ thay vì giờ thường lệ không.','Could I check in then?'],
 ['Which service is offered without a fee?','Luggage storage.','Airport transportation.','A meeting room.','Guaranteed early check-in.','Giữ hành lý miễn phí; nhận phòng sớm không được bảo đảm.','store your luggage for free'],
 ['What does the guest plan to do before the meeting?','Leave bags at the hotel.','Buy a flight ticket.','Pay for a conference room.','Return a rental car.','Khách nói sẽ để hành lý lại và quay lại sau.','I will leave my bags and come back later.'],
]);
conversation('interview','Lịch phỏng vấn',[
 ['We would like to interview you for the accounting position next Wednesday at ten. Are you available?','Chúng tôi muốn phỏng vấn bạn cho vị trí kế toán lúc mười giờ thứ Tư tới. Bạn có rảnh không?'],
 ['I have another appointment that morning. Could we meet in the afternoon instead?','Sáng đó tôi có hẹn khác. Chúng ta có thể gặp buổi chiều không?'],
 ['Yes, two thirty is available. Please bring a copy of your resume and a list of two references.','Được, hai giờ ba mươi còn trống. Vui lòng mang bản sơ yếu lý lịch và danh sách hai người tham chiếu.'],
 ['Thank you. I will be there at two thirty on Wednesday.','Cảm ơn. Tôi sẽ đến lúc hai giờ ba mươi thứ Tư.'],
],[
 ['Which position is being discussed?','An accounting position.','A hotel reception position.','A delivery driver position.','A graphic design position.','Người gọi nêu rõ vị trí kế toán.','accounting position'],
 ['What time is agreed on for the interview?','2:30 p.m.','10:00 a.m.','11:30 a.m.','4:00 p.m.','Hai bên chốt 2:30 chiều thứ Tư; mười giờ là đề nghị ban đầu.','two thirty on Wednesday'],
 ['What is the applicant asked to bring?','A resume and a list of two references.','An employment contract.','A laptop and a calculator.','A completed tax return.','Yêu cầu gồm bản sơ yếu lý lịch và danh sách hai người tham chiếu.','a copy of your resume and a list of two references'],
]);
conversation('catering','Suất ăn hội nghị',[
 ['We ordered forty lunches for Friday, but five more participants have registered. Can you increase the order?','Chúng tôi đặt bốn mươi suất ăn thứ Sáu, nhưng có thêm năm người đăng ký. Có thể tăng đơn không?'],
 ['Yes. I will prepare forty-five lunches. Do you still want delivery at eleven thirty?','Được. Tôi sẽ chuẩn bị bốn mươi lăm suất. Anh vẫn muốn giao lúc mười một giờ ba mươi chứ?'],
 ['Yes. Please use the east entrance, since the main hall will be crowded.','Có. Vui lòng dùng lối vào phía đông vì sảnh chính sẽ đông.'],
 ['Understood. I will send a revised invoice this afternoon.','Đã rõ. Tôi sẽ gửi hóa đơn sửa đổi chiều nay.'],
],[
 ['Why is the order being changed?','More participants have registered.','The event has moved to another city.','The food was delivered incorrectly.','The supplier has raised prices.','Có thêm năm người đăng ký nên cần tăng số suất.','five more participants have registered'],
 ['How many lunches will be prepared?','Forty-five.','Thirty-five.','Forty.','Fifty.','Bốn mươi ban đầu cộng năm, thành bốn mươi lăm suất.','prepare forty-five lunches'],
 ['Which entrance should the delivery person use?','The east entrance.','The main hall entrance.','The west entrance.','The garage entrance.','Khách yêu cầu dùng lối phía đông, tránh sảnh chính đông người.','Please use the east entrance'],
]);
conversation('software','Đào tạo phần mềm',[
 ['I could not attend yesterday\'s training on the new inventory system. Is there another session?','Tôi không dự được buổi đào tạo hệ thống tồn kho mới hôm qua. Có buổi nào khác không?'],
 ['There is a repeat session on Thursday at nine. It will be online, and I can send you the link.','Có buổi học lại lúc chín giờ thứ Năm. Buổi này trực tuyến và tôi có thể gửi liên kết.'],
 ['Great. Do I need to install the software before the session?','Tốt quá. Tôi cần cài phần mềm trước buổi học không?'],
 ['Yes. Follow the installation guide in the welcome email. Contact the help desk if you cannot sign in.','Có. Hãy theo hướng dẫn cài đặt trong email chào mừng. Liên hệ bộ phận hỗ trợ nếu không đăng nhập được.'],
],[
 ['What does the employee want to do?','Attend another training session.','Purchase new warehouse shelves.','Cancel a software subscription.','Change a customer order.','Nhân viên đã bỏ lỡ buổi trước và muốn dự buổi khác.','Is there another session?'],
 ['How will the repeat session be held?','Online.','In the warehouse.','At a hotel.','In the cafeteria.','Buổi học lại thứ Năm được tổ chức trực tuyến.','It will be online'],
 ['What should the employee do before training?','Install the software using the emailed guide.','Print all inventory records.','Call every customer.','Return an old computer.','Cần cài phần mềm theo hướng dẫn trong email trước buổi học.','Follow the installation guide in the welcome email.'],
]);
conversation('bicycle-repair','Bảo dưỡng xe đạp',[
 ['I left my bicycle here yesterday. Have you finished replacing the brakes?','Hôm qua tôi để xe đạp ở đây. Anh thay phanh xong chưa?'],
 ['Yes, the brakes are ready. However, I noticed a worn rear tire. Would you like us to replace it too?','Phanh đã xong. Nhưng tôi thấy lốp sau bị mòn. Anh muốn thay luôn không?'],
 ['Yes, please. Can I collect the bicycle before the shop closes at six?','Có. Tôi có thể lấy xe trước khi cửa hàng đóng lúc sáu giờ không?'],
 ['Certainly. It will be ready at four. We will text you when the work is complete.','Được. Xe sẽ sẵn sàng lúc bốn giờ. Chúng tôi sẽ nhắn khi hoàn tất.'],
],[
 ['Which repair has already been completed?','Replacing the brakes.','Replacing the rear tire.','Adjusting the seat.','Painting the bicycle.','Thợ xác nhận phanh đã làm xong; thay lốp là việc bổ sung.','the brakes are ready'],
 ['What additional work does the customer approve?','Replacing a worn rear tire.','Installing a new basket.','Replacing the front light.','Removing the pedals.','Khách đồng ý thay lốp sau bị mòn.','a worn rear tire'],
 ['When will the bicycle be ready?','At four.','At noon.','At five thirty.','After six.','Thợ chốt xe sẵn sàng lúc bốn giờ, không phải giờ đóng cửa sáu giờ.','It will be ready at four.'],
]);
conversation('supplies','Vật tư văn phòng',[
 ['The order form says we requested blue folders, but the delivery contains green ones.','Phiếu đặt hàng ghi bìa hồ sơ xanh dương, nhưng hàng giao là xanh lá.'],
 ['I checked the order number. The supplier sent the wrong color. They can exchange them on Monday.','Tôi đã kiểm tra mã đơn. Nhà cung cấp giao sai màu. Họ có thể đổi vào thứ Hai.'],
 ['That should work. We do not need the folders until the staff seminar on Wednesday.','Như vậy được. Chúng ta chưa cần đến bìa hồ sơ cho đến hội thảo nhân viên thứ Tư.'],
 ['I will contact the supplier now and ask them to collect the green folders when they deliver the replacements.','Tôi sẽ liên hệ nhà cung cấp ngay và đề nghị thu lại bìa xanh lá khi giao hàng thay thế.'],
],[
 ['What is wrong with the delivery?','The folders are the wrong color.','The folders arrived too late.','The boxes are empty.','The order number is missing.','Đặt xanh dương nhưng nhận xanh lá, nên sai màu.','The supplier sent the wrong color.'],
 ['When can the folders be exchanged?','On Monday.','On Tuesday.','On Wednesday.','On Friday.','Nhà cung cấp có thể đổi vào thứ Hai; thứ Tư là ngày cần dùng.','exchange them on Monday'],
 ['What will the employee ask the supplier to do?','Collect the incorrect folders during the replacement delivery.','Send twice as many folders.','Cancel the staff seminar.','Change the seminar date.','Nhân viên sẽ yêu cầu thu lại bìa giao sai khi giao bìa thay thế.','collect the green folders when they deliver the replacements'],
]);
conversation('travel','Đi công tác',[
 ['Our flight to the trade fair has been moved to eight in the morning. We should leave the office earlier.','Chuyến bay đi hội chợ được đổi sang tám giờ sáng. Chúng ta nên rời văn phòng sớm hơn.'],
 ['I will book a taxi for five thirty. Shall I ask the hotel to keep our rooms despite our earlier arrival?','Tôi sẽ đặt taxi lúc năm giờ ba mươi. Tôi hỏi khách sạn giữ phòng dù chúng ta đến sớm hơn nhé?'],
 ['Our rooms have been reserved since last night, so they should already be available. Please email our new arrival time to the hotel.','Phòng đã được đặt từ tối qua nên lúc đó đã sẵn sàng. Hãy email giờ đến mới cho khách sạn.'],
 ['I will do that after I reserve the taxi.','Tôi sẽ làm sau khi đặt taxi.'],
],[
 ['What has changed?','The flight departure time.','The trade fair location.','The number of hotel rooms.','The hotel price.','Chuyến bay được chuyển sang tám giờ sáng.','moved to eight in the morning'],
 ['What time will the taxi be booked for?','5:30 a.m.','6:30 a.m.','8:00 a.m.','8:30 a.m.','Người B sẽ đặt taxi lúc 5:30 sáng.','book a taxi for five thirty'],
 ['What will the hotel be informed about?','The new arrival time.','The company\'s annual budget.','The taxi driver\'s home address.','A canceled room reservation.','Yêu cầu là email giờ đến mới; không hủy phòng.','email our new arrival time to the hotel'],
]);
conversation('library','Mượn tài liệu',[
 ['I borrowed the marketing handbook last week. Can I renew it for another seven days?','Tôi mượn cẩm nang tiếp thị tuần trước. Có thể gia hạn thêm bảy ngày không?'],
 ['I am sorry, but another member has reserved that copy. You need to return it by Friday.','Rất tiếc, một thành viên khác đã đặt trước bản đó. Anh cần trả chậm nhất thứ Sáu.'],
 ['Is there an electronic version I can read after I return the book?','Có bản điện tử để tôi đọc sau khi trả sách không?'],
 ['Yes. Sign in to the member portal and open the digital resources page. You can access it there.','Có. Đăng nhập cổng thành viên rồi mở trang tài nguyên số. Anh có thể đọc ở đó.'],
],[
 ['Why can the handbook not be renewed?','Another member has reserved it.','Its pages are damaged.','The library is closing permanently.','The electronic version has expired.','Không được gia hạn vì có thành viên khác đặt trước bản sách.','another member has reserved that copy'],
 ['When must the printed book be returned?','By Friday.','By Monday.','By Wednesday.','By Sunday.','Thủ thư yêu cầu trả sách chậm nhất thứ Sáu.','return it by Friday'],
 ['Where can the member find the electronic version?','On the portal\'s digital resources page.','At the hotel reception desk.','In a printed newspaper.','On the supplier\'s order form.','Bản điện tử nằm ở trang tài nguyên số trong cổng thành viên.','open the digital resources page'],
]);

talk('shuttle','Thông báo xe đưa đón',
 'Attention, passengers traveling to the airport. The next shuttle will leave at ten fifteen. Please check the departure board for your bay. Bay two, our usual departure point, is closed for repairs today. Please purchase your ticket at the kiosk before boarding. Large suitcases must be placed in the luggage compartment. The journey will take approximately forty minutes.',
 'Xin chú ý, hành khách đi sân bay. Xe tiếp theo rời lúc 10:15. Hãy xem bảng khởi hành để biết ô đón. Ô số hai thường dùng đang đóng để sửa chữa. Vui lòng mua vé ở quầy tự phục vụ trước khi lên xe. Vali lớn phải để trong khoang hành lý. Hành trình khoảng bốn mươi phút.',[
 ['Look at the departure board. Which bay should airport passengers use?','Bay four.','Bay two.','The hotel lobby.','The railway platform.','Bài nghe nói xe đi sân bay; bảng ghi Airport ở Bay 4. Ô số hai cũ đang sửa.','passengers traveling to the airport'],
 ['What should passengers do before boarding?','Buy a ticket at the kiosk.','Reserve a hotel room.','Call the repair office.','Collect a parcel.','Cần mua vé tại quầy tự phục vụ trước khi lên xe.','purchase your ticket at the kiosk before boarding'],
 ['How long is the journey expected to take?','About forty minutes.','About fifteen minutes.','About two hours.','About ten minutes.','Bài nói nêu hành trình dự kiến khoảng bốn mươi phút.','approximately forty minutes'],
]);
talk('opening','Tin nhắn đổi giờ mở cửa',
 'This is a message for customers of Eastbank Hardware. Starting next Monday, our weekday opening time will change from eight to seven thirty. We are making this change to serve customers who need supplies before work. Our closing time remains six, and weekend hours will not change. The tool rental desk will continue to open at nine.',
 'Đây là thông báo cho khách của Eastbank Hardware. Từ thứ Hai tới, cửa hàng ngày thường mở lúc 7:30 thay vì 8 giờ để phục vụ khách cần vật tư trước giờ làm. Giờ đóng cửa vẫn là sáu giờ, giờ cuối tuần không đổi. Quầy thuê dụng cụ vẫn mở lúc chín giờ.',[
 ['What is the main purpose of the message?','To announce an earlier weekday opening time.','To advertise a permanent store closure.','To increase rental prices.','To introduce a new weekend schedule.','Thông báo thay đổi giờ mở cửa ngày thường sớm hơn.','weekday opening time will change from eight to seven thirty'],
 ['Why is the change being made?','To help customers shop before work.','To allow staff to leave earlier.','To close the tool rental desk.','To prepare for a weekend festival.','Cửa hàng muốn phục vụ khách mua vật tư trước giờ làm.','supplies before work'],
 ['What will stay the same?','The closing time.','The weekday opening time.','The store name announced for next year.','The number of store locations.','Giờ đóng cửa vẫn là sáu giờ. Hai lựa chọn về tên/nơi bán không được bài nói xác nhận.','Our closing time remains six'],
]);
talk('safety','Hướng dẫn an toàn',
 'Before we begin the warehouse tour, please put on the yellow safety vest provided at reception. Keep your vest on throughout the tour. Photography is permitted in the packing area, but it is not allowed near the loading dock. Stay with your guide at all times, because forklifts operate along several routes. We will finish the tour in the training room.',
 'Trước khi tham quan kho, hãy mặc áo bảo hộ vàng được phát tại lễ tân và giữ áo suốt chuyến đi. Được chụp ảnh ở khu đóng gói nhưng không được chụp gần bến bốc dỡ. Luôn đi cùng hướng dẫn viên vì xe nâng hoạt động trên nhiều tuyến. Chuyến tham quan kết thúc ở phòng đào tạo.',[
 ['What should visitors put on?','A yellow safety vest.','A black business jacket.','A blue raincoat.','A red company cap.','Khách được yêu cầu mặc áo bảo hộ vàng.','put on the yellow safety vest'],
 ['Where is photography prohibited?','Near the loading dock.','In the packing area.','At the reception desk.','In the training room.','Bài nói cấm chụp gần bến bốc dỡ; khu đóng gói được phép.','not allowed near the loading dock'],
 ['Why must visitors stay with the guide?','Forklifts are operating in the warehouse.','All visitors must take an exam.','The training room is locked.','The packing equipment is being sold.','Xe nâng hoạt động dọc nhiều tuyến nên khách cần theo hướng dẫn viên.','forklifts operate along several routes'],
]);
talk('order','Tin nhắn nhận đơn hàng',
 'Hello, this is Clara from Oak Street Books. The business dictionaries you ordered are ready for collection. We will hold them at the front counter until we close at five on Saturday. Please bring your order number when you collect them. We close at five on Saturday. If you prefer delivery, call us by Friday afternoon so that we can arrange it. Delivery costs six dollars.',
 'Xin chào, tôi là Clara từ Oak Street Books. Từ điển thương mại anh đặt đã sẵn sàng. Chúng tôi giữ ở quầy trước đến khi đóng cửa lúc năm giờ chiều thứ Bảy. Vui lòng mang mã đơn khi đến nhận. Thứ Bảy cửa hàng đóng lúc năm giờ. Muốn giao tận nơi, hãy gọi chậm nhất chiều thứ Sáu; phí giao sáu đô la.',[
 ['Why is Clara calling?','To say an order is ready for collection.','To ask for a dictionary donation.','To cancel a book signing.','To announce a price increase.','Đơn từ điển đã sẵn sàng để khách đến nhận.','ready for collection'],
 ['What should the customer bring?','The order number.','A warehouse entry permit.','A signed employment contract.','A library membership application.','Khách cần mang mã đơn hàng.','bring your order number'],
 ['What should the customer do to request delivery?','Call by Friday afternoon.','Visit the store after five on Saturday.','Wait until Sunday evening.','Send a letter next week.','Cần gọi chậm nhất chiều thứ Sáu để sắp xếp giao hàng.','call us by Friday afternoon'],
]);
talk('presentation','Giới thiệu diễn giả',
 'Our next speaker is Dr. Elena Park, a transportation researcher. She will discuss how companies can reduce delivery delays by using better route planning. Her presentation will last thirty minutes, followed by a ten-minute question period. Please keep your questions until the end. After the session, printed copies of the presentation will be available at the information desk, not at the exit.',
 'Diễn giả tiếp theo là tiến sĩ Elena Park, nhà nghiên cứu vận tải. Bà sẽ nói về giảm chậm giao hàng bằng lập tuyến tốt hơn. Bài trình bày dài ba mươi phút rồi hỏi đáp mười phút. Vui lòng để câu hỏi đến cuối. Sau buổi nói, bản in được phát ở quầy thông tin, không phải lối ra.',[
 ['What is the presentation about?','Reducing delivery delays through route planning.','Designing a new museum.','Hiring accounting staff.','Creating restaurant menus.','Chủ đề là giảm trễ giao hàng nhờ lập tuyến đường tốt hơn.','reduce delivery delays by using better route planning'],
 ['When should attendees ask questions?','After the presentation.','During the introduction.','Before the speaker arrives.','Only after leaving the building.','Người dẫn đề nghị giữ câu hỏi đến cuối bài trình bày.','keep your questions until the end'],
 ['Where can attendees obtain printed copies?','At the information desk.','At the exit.','At the parking office.','At a nearby bookstore.','Bản in ở quầy thông tin, bài nói chủ động loại trừ lối ra.','available at the information desk, not at the exit'],
]);
talk('maintenance','Thông báo mất nước',
 'Attention, tenants of Riverside Offices. Water service will be temporarily interrupted this Wednesday from two to four in the afternoon while a pipe is replaced. The elevators and electricity will continue to operate normally. Please avoid using the kitchen taps during this period. Drinking water will be available in bottles at reception. If work finishes early, we will send an email to all tenants.',
 'Xin thông báo tới người thuê Riverside Offices. Nước tạm ngừng thứ Tư từ hai đến bốn giờ chiều để thay ống. Thang máy và điện vẫn hoạt động. Tránh dùng vòi bếp trong thời gian đó. Nước uống đóng chai có tại lễ tân. Nếu xong sớm, chúng tôi sẽ email cho mọi người thuê.',[
 ['Which service will be interrupted?','Water service.','Elevator service.','Electricity.','Internet access.','Thông báo nói ngừng nước, còn thang máy và điện hoạt động bình thường.','Water service will be temporarily interrupted'],
 ['How long is the interruption scheduled to last?','Two hours.','Thirty minutes.','Four hours.','All day.','Từ hai đến bốn giờ chiều là hai tiếng.','from two to four in the afternoon'],
 ['Where can tenants obtain drinking water?','At reception.','On the roof.','At the loading dock.','In the elevator.','Nước đóng chai được cung cấp tại lễ tân.','in bottles at reception'],
]);
talk('recruitment','Thông báo tuyển tình nguyện viên',
 'The town business fair needs volunteers next Saturday. Volunteers will welcome visitors and help exhibitors find their assigned booths. No sales experience is required. All volunteers must attend a short briefing at eight thirty on the morning of the fair. Lunch will be provided, but you should bring a reusable water bottle. To register, complete the form on the town website by Thursday.',
 'Hội chợ doanh nghiệp của thị trấn cần tình nguyện viên thứ Bảy tới. Công việc là đón khách và giúp đơn vị trưng bày tìm gian được phân. Không yêu cầu kinh nghiệm bán hàng. Mọi tình nguyện viên phải dự hướng dẫn ngắn lúc 8:30 sáng ngày hội chợ. Có suất trưa, nhưng nên mang bình nước tái sử dụng. Đăng ký qua mẫu trên website thị trấn chậm nhất thứ Năm.',[
 ['What will volunteers help exhibitors do?','Find their assigned booths.','Prepare tax returns.','Repair delivery trucks.','Negotiate building leases.','Tình nguyện viên giúp đơn vị trưng bày tìm gian được phân.','help exhibitors find their assigned booths'],
 ['What must all volunteers attend?','A briefing at 8:30 a.m.','A sales exam on Friday.','A dinner on Thursday.','A driving lesson at noon.','Mọi tình nguyện viên phải dự hướng dẫn lúc 8:30.','a short briefing at eight thirty'],
 ['How should people register?','Complete a form on the town website.','Call each exhibitor separately.','Send a printed resume to a hotel.','Buy a visitor ticket at the gate.','Cần điền mẫu trên website thị trấn trước hạn thứ Năm.','complete the form on the town website'],
]);
talk('lost-property','Thông báo đồ thất lạc',
 'May I have your attention, please? A black laptop bag has been found in the second-floor conference room. It is now at the security desk near the main entrance. To claim the bag, please describe what is inside and show identification. The security desk is staffed until eight this evening. After that time, call the building office tomorrow morning to arrange collection.',
 'Xin chú ý. Một túi laptop đen được tìm thấy ở phòng họp tầng hai và hiện ở quầy an ninh gần cửa chính. Để nhận, hãy mô tả đồ bên trong và xuất trình giấy tờ. Quầy có nhân viên đến tám giờ tối. Sau đó, gọi văn phòng tòa nhà sáng mai để hẹn nhận.',[
 ['Where was the bag found?','In a second-floor conference room.','In a taxi outside the building.','At the main entrance.','Inside the building office.','Nơi tìm thấy là phòng họp tầng hai; quầy an ninh là nơi giữ hiện tại.','found in the second-floor conference room'],
 ['What must the owner do to claim the bag?','Describe its contents and show identification.','Pay a storage charge.','Submit a job application.','Bring a printed conference agenda.','Cần mô tả vật dụng bên trong và xuất trình giấy tờ.','describe what is inside and show identification'],
 ['Until what time is the security desk staffed tonight?','8:00 p.m.','5:00 p.m.','6:30 p.m.','10:00 p.m.','Quầy an ninh có nhân viên đến tám giờ tối.','until eight this evening'],
]);

reading('fitness','Quy định phòng tập',
 `NORTHVIEW FITNESS — MEMBER NOTICE
From May 1, lockers must be emptied at the end of each visit. Items left overnight will be taken to reception and kept for seven days. Members may collect them during staffed hours, from 6 a.m. to 9 p.m. The center is not introducing a locker rental charge. Please bring your own padlock; spare padlocks are not available at the desk.`,
 'Từ ngày 1/5, phải dọn hết đồ trong tủ sau mỗi lần tập. Đồ để qua đêm được đưa về lễ tân và giữ bảy ngày. Có thể nhận từ 6 giờ sáng đến 9 giờ tối khi có nhân viên. Không có phí thuê tủ mới. Hội viên tự mang khóa; quầy không có khóa dự phòng.',[
 ['What must members do after each visit?','Remove all items from their lockers.','Pay a new locker fee.','Leave padlocks at reception.','Register for a personal trainer.','Thông báo yêu cầu dọn trống tủ sau mỗi lần sử dụng.','lockers must be emptied at the end of each visit'],
 ['How long are items left overnight kept at reception?','Seven days.','One day.','Three days.','One month.','Đồ được chuyển về lễ tân và giữ bảy ngày.','kept for seven days'],
 ['What should members bring?','Their own padlock.','A printed locker rental contract.','A towel for the receptionist.','A spare membership application.','Hội viên cần tự mang ổ khóa vì quầy không có khóa dự phòng.','Please bring your own padlock'],
]);
reading('course','Email khóa học',
 `To: New course participants
Subject: Business writing course
Our four-week course begins on June 3. Classes meet on Tuesdays and Thursdays from 6 to 7:30 p.m. in Room 12. There will be no class on June 12 because the building will be closed for maintenance. A replacement class will be held on Friday, June 13, at the same time. All worksheets are included in the course fee. Please bring a notebook, but a laptop is optional.`,
 'Khóa viết thương mại kéo dài bốn tuần, bắt đầu 3/6. Học thứ Ba và thứ Năm từ 18:00 đến 19:30 ở phòng 12. Ngày 12/6 nghỉ vì tòa nhà bảo trì; học bù thứ Sáu 13/6 cùng giờ. Phí bao gồm phiếu bài tập. Cần mang vở; laptop là tùy chọn.',[
 ['Why will there be no class on June 12?','The building will be closed for maintenance.','The instructor will attend a conference.','The course fee has not been paid.','All participants have completed the course.','Email nêu tòa nhà đóng cửa để bảo trì.','the building will be closed for maintenance'],
 ['When will the replacement class begin?','At 6 p.m. on June 13.','At 7:30 p.m. on June 12.','At 9 a.m. on June 3.','At noon on June 13.','Học bù ngày 13/6 cùng giờ bắt đầu thường lệ là 18:00.','Friday, June 13, at the same time'],
 ['What is included in the fee?','Worksheets.','A laptop.','A notebook.','Transportation to class.','Phí bao gồm phiếu bài tập; laptop không được nói là cấp miễn phí.','All worksheets are included in the course fee.'],
]);
reading('returns','Chính sách đổi trả',
 `WESTBROOK ELECTRONICS — RETURNS
Unused accessories may be returned within 30 days of purchase with the original receipt. Opened headphones may be returned only if faulty. Online orders can be returned by post or at any branch. Customers pay return postage unless the item is defective. Refunds are sent to the original payment method within five business days after the return is approved. Gift vouchers cannot be exchanged for cash.`,
 'Phụ kiện chưa sử dụng được trả trong 30 ngày với hóa đơn gốc. Tai nghe đã mở chỉ được trả khi có lỗi. Đơn trực tuyến có thể trả qua bưu điện hoặc tại mọi chi nhánh. Khách trả bưu phí trừ hàng lỗi. Tiền về phương thức thanh toán ban đầu trong năm ngày làm việc sau khi duyệt. Phiếu quà tặng không đổi thành tiền mặt.',[
 ['Under what condition can opened headphones be returned?','They are faulty.','They were bought with a gift voucher.','They are more than a year old.','The customer prefers another color.','Tai nghe đã mở chỉ được nhận trả khi bị lỗi.','Opened headphones may be returned only if faulty.'],
 ['Where can an online purchase be returned?','At any branch or by post.','Only at the head office.','Only through a delivery driver.','Only at the branch nearest the warehouse.','Đơn trực tuyến được trả tại bất kỳ chi nhánh hoặc qua bưu điện.','by post or at any branch'],
 ['When does the customer not have to pay return postage?','When the item is defective.','Whenever the packaging is open.','Whenever a gift voucher was used.','When the receipt is missing.','Chính sách miễn phí trả hàng qua bưu điện cho hàng lỗi.','unless the item is defective'],
]);
reading('appointment','Hướng dẫn khám sức khỏe',
 `HARBOR CLINIC — APPOINTMENT REMINDER
Your workplace health check is scheduled for August 14 at 10:20 a.m. Please arrive 15 minutes early to complete a registration form. Bring photo identification and the authorization letter supplied by your employer. You do not need to fast for this appointment. If you need to reschedule, telephone the clinic at least 24 hours before your visit. Parking is available behind the building, but it is not free.`,
 'Lịch khám sức khỏe cơ quan là 14/8 lúc 10:20. Đến sớm 15 phút để điền phiếu. Mang giấy tờ có ảnh và thư chấp thuận do cơ quan cung cấp. Không cần nhịn ăn cho lịch này. Muốn đổi lịch, gọi trước ít nhất 24 giờ. Bãi đỗ phía sau có thu phí.',[
 ['What time should the patient arrive?','10:05 a.m.','10:20 a.m.','10:35 a.m.','9:20 a.m.','Lịch 10:20, đến sớm 15 phút là 10:05.','Please arrive 15 minutes early'],
 ['Which document should the employer provide?','An authorization letter.','A parking receipt.','A restaurant reservation.','A library membership card.','Thư chấp thuận do cơ quan cung cấp.','the authorization letter supplied by your employer'],
]);
reading('venue','Đặt địa điểm sự kiện',
 `DOCUMENT 1 — VENUE PRICE LIST
Elm Room: up to 20 guests, $180 per half-day.
Cedar Room: up to 40 guests, $260 per half-day.
Oak Room: up to 80 guests, $420 per half-day.
All prices include chairs, tables and a projector. Catering costs extra. Half-day periods are 8 a.m.–noon or 1–5 p.m.

DOCUMENT 2 — EMAIL
To: Venue coordinator
We need a room for 32 people on September 9, from 1 to 5 p.m. Please reserve the least expensive room that can accommodate everyone. We will use your projector, but we will arrange lunch ourselves. Send the invoice to our finance team, not to the individual participants.`,
 'Bảng giá nửa ngày: Elm tối đa 20 người/180 đô; Cedar tối đa 40/260 đô; Oak tối đa 80/420 đô. Giá gồm bàn ghế và máy chiếu, ăn uống tính thêm. Ca sáng 8–12, chiều 13–17. Email đặt phòng rẻ nhất đủ cho 32 người ngày 9/9, 13–17; dùng máy chiếu, tự lo ăn trưa; gửi hóa đơn cho bộ phận tài chính.',[
 ['Which room best meets the request?','Cedar Room.','Elm Room.','Oak Room.','All three rooms equally.','Cedar đủ cho 32 người và rẻ hơn Oak; Elm chỉ chứa 20 người.','Cedar Room: up to 40 guests, $260 per half-day.'],
 ['What is the room rental charge for the requested period?','$260.','$180.','$420.','$520.','Thời gian 13–17 là một nửa ngày; Cedar giá 260 đô.','Cedar Room: up to 40 guests, $260 per half-day.'],
 ['Which item is included in the rental price?','A projector.','Lunch.','Transport for all guests.','An overnight room.','Bảng giá gồm máy chiếu; ăn uống tính riêng.','include chairs, tables and a projector'],
 ['What will the customer arrange independently?','Lunch.','The projector installation.','The room reservation system.','The chairs and tables.','Email nói khách tự lo bữa trưa.','we will arrange lunch ourselves'],
 ['Who should receive the invoice?','The finance team.','Every participant individually.','The catering company.','The projector manufacturer.','Email yêu cầu gửi hóa đơn cho nhóm tài chính.','Send the invoice to our finance team'],
]);
reading('shipment','Đối chiếu lô hàng',
 `DOCUMENT 1 — ORDER CONFIRMATION
Customer: Harbor Design
Order HD-82: 8 desk chairs at $90 each; 2 filing cabinets at $150 each.
Delivery address: 14 River Road, loading bay at rear.
Delivery date: October 6.

DOCUMENT 2 — DELIVERY EMAIL
We delivered the eight chairs this morning. The two cabinets were not loaded onto the truck because they were still being checked. They will arrive on October 7, with no extra delivery charge. Please keep order HD-82 available for the driver. We apologize for the split delivery.`,
 'Đơn HD-82: 8 ghế bàn làm việc giá 90 đô/chiếc, 2 tủ hồ sơ 150 đô/chiếc; giao 14 River Road ở bến phía sau ngày 6/10. Email xác nhận đã giao đủ ghế sáng nay; hai tủ chưa lên xe do còn kiểm tra, sẽ giao ngày 7/10 không thu thêm phí; giữ mã đơn để đưa tài xế.',[
 ['What was delivered first?','Eight desk chairs.','Two filing cabinets.','Ten filing cabinets.','Six office desks.','Email xác nhận giao tám ghế trước.','delivered the eight chairs this morning'],
 ['Why were the cabinets not included in the first delivery?','They were still being checked.','The customer canceled them.','The address was incorrect.','Their price had increased.','Các tủ vẫn đang được kiểm tra nên chưa đưa lên xe.','they were still being checked'],
 ['When will the cabinets arrive?','October 7.','October 5.','October 6.','October 14.','Email cho biết giao tủ ngày 7/10, sau lịch ban đầu một ngày.','They will arrive on October 7'],
 ['Where should the driver unload the items?','At the rear loading bay.','At the main reception counter.','At a neighboring office.','At the railway station.','Địa chỉ trong xác nhận yêu cầu bến bốc dỡ phía sau.','loading bay at rear'],
 ['What is the total price of the ordered furniture, excluding any delivery charges?','$1,020.','$720.','$870.','$1,200.','Tám ghế: 8×90=720; hai tủ: 2×150=300; cộng 1.020 đô.','8 desk chairs at $90 each; 2 filing cabinets at $150 each.'],
]);
reading('volunteer','Phân ca tình nguyện',
 `DOCUMENT 1 — VOLUNTEER NOTICE
The Lakeside Book Fair is on November 8. Morning volunteers work 8 a.m.–noon; afternoon volunteers work noon–4 p.m. Each volunteer receives a meal voucher. Volunteers assigned to the information desk must attend an online briefing on November 6.

DOCUMENT 2 — EMAIL FROM A VOLUNTEER
I can help on November 8, but I have an appointment at 2 p.m. I have worked at an information desk before and would prefer that assignment. Please let me know whether I can work the morning shift.

DOCUMENT 3 — COORDINATOR REPLY
Your requested shift and assignment are confirmed. The online briefing link will be sent tomorrow. Please report to the north gate 15 minutes before your shift begins, where you will receive a badge.`,
 'Hội sách Lakeside ngày 8/11 có ca sáng 8–12 và chiều 12–16; mỗi tình nguyện viên nhận phiếu ăn. Trực quầy thông tin phải họp trực tuyến 6/11. Người đăng ký có hẹn 14 giờ, muốn ca sáng và công việc quầy thông tin. Điều phối viên xác nhận cả ca lẫn vị trí, sẽ gửi liên kết họp ngày mai; đến cổng bắc sớm 15 phút để nhận thẻ.',[
 ['Which shift is confirmed for the volunteer?','8 a.m.–noon.','Noon–4 p.m.','2–6 p.m.','6–10 p.m.','Người đăng ký xin ca sáng; thư trả lời xác nhận ca được yêu cầu.','Your requested shift and assignment are confirmed.'],
 ['Where will the volunteer work?','At the information desk.','In the catering kitchen.','At the south parking lot.','In the ticket printing office.','Người đăng ký muốn trực quầy thông tin và được chấp thuận.','would prefer that assignment'],
 ['What must the volunteer attend on November 6?','An online briefing.','A book signing.','A driving test.','An in-person lunch.','Thông báo yêu cầu người trực quầy thông tin dự họp trực tuyến 6/11.','an online briefing on November 6'],
 ['What time should the volunteer report to the north gate?','7:45 a.m.','8:00 a.m.','8:15 a.m.','11:45 a.m.','Ca bắt đầu 8 giờ; đến trước 15 phút là 7:45.','15 minutes before your shift begins'],
 ['What is provided to every volunteer?','A meal voucher.','A free hotel room.','A permanent parking permit.','A cash transport allowance.','Thông báo nêu mỗi tình nguyện viên nhận một phiếu ăn.','Each volunteer receives a meal voucher.'],
]);
reading('conference','Lịch hội nghị và thay đổi',
 `DOCUMENT 1 — FRIDAY PROGRAM
9:00–10:00: Opening talk, Hall A.
10:15–11:15: Data workshop, Room 5.
11:30–12:30: Marketing panel, Hall B.
12:30–1:30: Lunch, Garden Room.

DOCUMENT 2 — ORGANIZER EMAIL
Room 5 has an electrical fault. The data workshop will now take place in Room 8 at its original time. All other sessions remain as printed. Participants who registered for the data workshop should bring a laptop with the provided sample files downloaded.

DOCUMENT 3 — PARTICIPANT MESSAGE
I will attend the data workshop, then meet a colleague at the marketing panel. I have already downloaded the sample files. Please tell me where to find the updated room information when I arrive.
Reply: Updated signs will be displayed beside the registration counter.`,
 'Lịch thứ Sáu: khai mạc 9–10 ở Hall A, thực hành dữ liệu 10:15–11:15 ở phòng 5, thảo luận tiếp thị 11:30–12:30 ở Hall B, ăn trưa 12:30–13:30 tại Garden Room. Do lỗi điện, thực hành chuyển sang phòng 8 cùng giờ; các buổi khác không đổi. Người dự mang laptop có file mẫu. Khách dự thực hành rồi gặp đồng nghiệp tại buổi tiếp thị; biển cập nhật nằm cạnh quầy đăng ký.',[
 ['Which room will host the data workshop?','Room 8.','Room 5.','Hall A.','Garden Room.','Email đổi riêng phòng thực hành dữ liệu từ 5 sang 8.','take place in Room 8'],
 ['When will the data workshop begin?','10:15 a.m.','9:00 a.m.','11:30 a.m.','12:30 p.m.','Đổi phòng nhưng giữ giờ ban đầu, tức 10:15.','10:15–11:15: Data workshop'],
 ['What should workshop participants bring?','A laptop with the sample files.','A printed lunch menu.','A hotel booking receipt.','A new electrical cable for Room 5.','Email yêu cầu laptop có các file mẫu đã tải.','bring a laptop with the provided sample files downloaded'],
 ['Where will the participant meet the colleague?','In Hall B.','In Room 5.','In Hall A.','At the north gate.','Khách hẹn ở buổi thảo luận tiếp thị; lịch ghi Hall B.','Marketing panel, Hall B.'],
 ['Where will updated signs be displayed?','Beside the registration counter.','Inside the hotel bedrooms.','At the railway platform.','Behind the catering kitchen.','Thư trả lời chỉ rõ biển cập nhật cạnh quầy đăng ký.','beside the registration counter'],
]);
reading('supplier','Chọn nhà cung cấp in ấn',
 `DOCUMENT 1 — PRINTING QUOTE
Maple Print: 500 full-color brochures for $240. Standard turnaround: five business days after artwork approval. Express service: two business days for an additional $60. Delivery within the city is included.

DOCUMENT 2 — CUSTOMER EMAIL
We approve the artwork today, Monday, March 3. We need the brochures delivered by Wednesday, March 5, for a product launch. Please use the service that meets that deadline. Delivery is to our city office at 8 Elm Street.

DOCUMENT 3 — SUPPLIER REPLY
We confirm your selected service. The total is $300, including city delivery. Please check that the delivery contact number on the order form is correct. Production will begin once we receive payment today.`,
 'Báo giá Maple Print: 500 tờ gấp màu 240 đô; thường cần năm ngày làm việc sau duyệt bản thiết kế. Dịch vụ nhanh hai ngày làm việc, thêm 60 đô; miễn phí giao trong thành phố. Khách duyệt thứ Hai 3/3, cần hàng thứ Tư 5/3 tại 8 Elm Street. Nhà in xác nhận tổng 300 đô có giao hàng, yêu cầu kiểm tra số liên hệ; bắt đầu sản xuất khi nhận thanh toán hôm nay.',[
 ['Which service meets the customer\'s deadline?','The two-business-day express service.','The five-business-day standard service.','An overseas postal service.','A service beginning after the product launch.','Từ thứ Hai đến thứ Tư cần dịch vụ nhanh hai ngày làm việc.','Express service: two business days'],
 ['What causes the total to rise from $240 to $300?','The express service surcharge.','A city delivery charge.','A larger order quantity.','A change to black-and-white printing.','Phụ phí nhanh 60 đô làm tổng thành 300; giao nội thành đã gồm.','an additional $60'],
 ['How many brochures were quoted?','500.','240.','300.','60.','Báo giá ghi số lượng 500 tờ, các số khác là giá/phụ phí.','500 full-color brochures'],
 ['What must happen before production begins?','The printer must receive payment.','The launch must finish.','The delivery office must move.','The customer must order another 500 brochures.','Thư trả lời yêu cầu nhận thanh toán trước khi sản xuất.','Production will begin once we receive payment today.'],
 ['What does the supplier ask the customer to check?','The delivery contact number.','The number of hotel rooms.','The launch speaker\'s biography.','The address of an overseas branch.','Nhà in yêu cầu kiểm tra số điện thoại liên hệ giao hàng trên phiếu.','delivery contact number on the order form'],
]);
