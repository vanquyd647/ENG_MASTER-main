import type { LearningQuestion } from './extendedPractice';
import { EXPANSION_LISTENING } from './examExpansion';

export interface ListeningStimulus {
  id: string;
  kind: 'part1' | 'part3' | 'part4';
  title: string;
  lines: { speaker: string; text: string; translation: string }[];
  image?: { src: string; author: string; source: string; license: 'CC0-1.0' };
  graphic?: {title:string;columns:string[];rows:string[][]};
}

const commons = 'https://commons.wikimedia.org/wiki/File:';
const photo = (id: string, file: string, author: string): ListeningStimulus => ({
  id: 'p1-listening-v1-' + id, kind: 'part1', title: 'Mô tả ảnh', lines: [],
  image: { src: '/learning/listening-v1/' + id + '.jpg', author, source: commons + file, license: 'CC0-1.0' },
});

// Authored by ENG_MASTER; not ETS questions. Stable IDs and answer order after release.
// Part 1 audio reads the four options; descriptions/transcripts stay hidden until submission.
export const LISTENING_STIMULI: readonly ListeningStimulus[] = [
  photo('forklift', 'Heftruck_in_actie.JPG', 'Glasman5'),
  photo('desk', 'Desk_with_objects_for_editathon.jpg', 'Medea7'),
  photo('home-office', 'Home-office-336377.jpg', 'Free-Photos / Pixabay'),
  photo('conference', 'Neat_conference_room_(Unsplash).jpg', 'Breather'),
  photo('bicycle', 'White_bicycle.jpg', 'Fasalul Abid Shj'),
  photo('cyclist', 'Lonely_man_on_a_bicycle.jpg', 'Altitonantis'),
  {
    id: 'p3-listening-v1-meeting', kind: 'part3', title: 'Đổi phòng họp', lines: [
      { speaker: 'Maya', text: 'Hi Ben, this is Maya. Our client meeting starts at eleven, but the projector in room three hundred four has stopped working.', translation: 'Chào Ben, Maya đây. Cuộc họp với khách bắt đầu lúc mười một giờ, nhưng máy chiếu ở phòng 304 đã ngừng hoạt động.' },
      { speaker: 'Ben', text: 'Room two hundred eighteen is available. Its projector was tested this morning. Shall we move the meeting there?', translation: 'Phòng 218 còn trống. Máy chiếu ở đó đã được kiểm tra sáng nay. Chúng ta chuyển cuộc họp sang đó nhé?' },
      { speaker: 'Maya', text: 'Yes. I will email everyone the new room number now. Could you ask the technical team to repair the other projector?', translation: 'Được. Tôi sẽ gửi email báo số phòng mới cho mọi người ngay. Anh nhờ nhóm kỹ thuật sửa máy chiếu kia nhé?' },
      { speaker: 'Ben', text: 'Of course. I will call them as soon as we finish talking.', translation: 'Tất nhiên. Tôi sẽ gọi họ ngay sau khi chúng ta nói chuyện xong.' },
    ],
  },
  {
    id: 'p3-listening-v1-delivery', kind: 'part3', title: 'Giao thiếu hàng', lines: [
      { speaker: 'Nora', text: 'Hello, this is Nora. We ordered twelve desk lamps, but only ten arrived this morning.', translation: 'Xin chào, tôi là Nora. Chúng tôi đã đặt mười hai đèn bàn, nhưng sáng nay chỉ nhận được mười chiếc.' },
      { speaker: 'Leo', text: 'I am sorry about that. The other two are being packed now. They will arrive tomorrow, and there will be no additional delivery charge.', translation: 'Tôi xin lỗi về việc đó. Hai chiếc còn lại đang được đóng gói. Chúng sẽ đến vào ngày mai và không có thêm phí giao hàng.' },
      { speaker: 'Nora', text: 'That is fine. Could you email me the tracking number today?', translation: 'Như vậy được. Hôm nay anh gửi email cho tôi mã theo dõi đơn hàng được không?' },
      { speaker: 'Leo', text: 'Certainly. I will send it this afternoon when the package leaves our warehouse.', translation: 'Chắc chắn rồi. Tôi sẽ gửi chiều nay khi kiện hàng rời kho của chúng tôi.' },
    ],
  },
  {
    id: 'p4-listening-v1-museum', kind: 'part4', title: 'Thông báo tại bảo tàng', lines: [
      { speaker: 'Announcer', text: 'Welcome to the City Museum. Here is some information for your visit. We are open from nine in the morning until six in the evening. The photography gallery is closed today, Thursday, for maintenance. All other galleries remain open. You can find our cafe on the first floor, beside the gift shop. Please ask at the information desk if you need a map.', translation: 'Chào mừng đến Bảo tàng Thành phố. Sau đây là thông tin cho chuyến tham quan. Chúng tôi mở cửa từ chín giờ sáng đến sáu giờ tối. Phòng trưng bày nhiếp ảnh đóng cửa hôm nay, thứ Năm, để bảo trì. Các phòng trưng bày khác vẫn mở cửa. Quán cà phê ở tầng một, cạnh cửa hàng quà tặng. Hãy hỏi quầy thông tin nếu bạn cần bản đồ.' },
    ],
  },
  {
    id: 'p4-listening-v1-repair', kind: 'part4', title: 'Tin nhắn hẹn sửa chữa', lines: [
      { speaker: 'Technician', text: 'Hello, this is Jordan from Greenway Repairs. I am calling to confirm the appointment to repair your office air conditioner. Our technician will arrive this Friday between ten and eleven in the morning. Please arrange for someone to meet the technician at the rear entrance, because the front entrance is being painted. Call us by noon on Thursday to confirm that someone will be available. Thank you.', translation: 'Xin chào, tôi là Jordan từ Greenway Repairs. Tôi gọi để xác nhận lịch sửa máy điều hòa văn phòng. Kỹ thuật viên sẽ đến vào thứ Sáu này, từ mười đến mười một giờ sáng. Vui lòng bố trí người gặp kỹ thuật viên ở lối vào phía sau vì lối vào phía trước đang được sơn. Hãy gọi cho chúng tôi chậm nhất trưa thứ Năm để xác nhận sẽ có người đón. Cảm ơn.' },
    ],
  },
];

type QuestionRow = [string, string[], number, string];
const rows = (stimulusId: string, topic: string, questions: QuestionRow[]): LearningQuestion[] => {
  const stimulus = LISTENING_STIMULI.find(row => row.id === stimulusId)!;
  return questions.map(([prompt, options, correctIndex, explanation], i) => ({
    id: stimulusId + '-q' + (i + 1), kind: stimulus.kind, listeningId: stimulusId, topic, prompt,
    options, correctIndex, explanation, difficulty: 1,
  }));
};
const imageQuestion = (id: string, options: string[], correctIndex: number, explanation: string) =>
  rows('p1-listening-v1-' + id, 'Mô tả ảnh', [['Choose the statement that best describes the photograph.', options, correctIndex, explanation]]);

export const LISTENING_QUESTIONS: readonly LearningQuestion[] = [
  ...imageQuestion('forklift', ['Several people are boarding a bus.', 'A forklift is positioned beside a truck.', 'A man is washing a car.', 'Boxes are floating on water.'], 1,
    'Trong ảnh, xe nâng nằm sát xe tải. Không có nhóm người lên xe buýt, người rửa xe hoặc hộp nổi trên nước. Positioned beside chỉ vị trí nhìn thấy; không suy đoán xe đang chuyển động.'),
  ...imageQuestion('desk', ['A woman is typing at a keyboard.', 'Some dishes are stacked in a sink.', 'A man is opening a suitcase.', 'A small bust is displayed in front of the windows.'], 3,
    'Có một tượng bán thân nhỏ phía trước các cửa sổ. Ảnh không có người phụ nữ gõ bàn phím, chồng đĩa trong bồn rửa hoặc người đàn ông mở vali. Bust ở đây là tượng phần đầu và ngực.'),
  ...imageQuestion('home-office', ['An open laptop is sitting on a wooden table.', 'A worker is carrying a ladder.', 'Several chairs are stacked against a wall.', 'A printer is underneath a desk.'], 0,
    'Máy tính xách tay đang mở nằm trên bàn gỗ. Các phương án còn lại mô tả người mang thang, ghế xếp chồng hoặc máy in dưới bàn, đều không xuất hiện trong ảnh.'),
  ...imageQuestion('conference', ['Several people are attending a meeting.', 'A waiter is serving food.', 'Chairs are arranged around a white table.', 'A man is repairing a window.'], 2,
    'Các ghế được bố trí quanh chiếc bàn trắng. Phòng không có người dự họp, người phục vụ đồ ăn hoặc người sửa cửa sổ. Không suy ra đang có cuộc họp chỉ từ đồ nội thất.'),
  ...imageQuestion('bicycle', ['A man is riding a motorcycle.', 'A bicycle is standing beside a blue wall.', 'A mechanic is replacing a wheel.', 'Two bicycles are hanging from the ceiling.'], 1,
    'Một xe đạp đứng bên bức tường xanh. Không có người đi xe máy, thợ thay bánh hoặc hai xe đạp treo trên trần. Beside mô tả vị trí, không khẳng định ai đã dựng xe.'),
  ...imageQuestion('cyclist', ['A person is riding a bicycle along a path.', 'A person is carrying a bicycle upstairs.', 'Several people are waiting at a counter.', 'A person is rowing a boat.'], 0,
    'Người trong ảnh đang đi xe đạp trên một lối đi có sương mù. Không có cầu thang, quầy chờ hoặc thuyền. Riding là đi xe, khác carrying là mang/vác.'),
  ...rows('p3-listening-v1-meeting', 'Cuộc họp', [
    ['Why are the speakers moving the meeting?', ['The client requested a later time.', 'The original room is too small.', 'A projector is not working.', 'The building is closing.'], 2,
      'Maya nói máy chiếu ở phòng 304 đã ngừng hoạt động. Đây là lý do đổi phòng; không có đề nghị đổi giờ hoặc thông tin phòng quá nhỏ.'],
    ['Where will the meeting take place?', ['In room 218.', 'In room 304.', 'At the client office.', 'In the cafeteria.'], 0,
      'Ben đề xuất phòng 218 và Maya đồng ý. Phòng 304 là địa điểm cũ có máy chiếu hỏng.'],
    ['What will Maya do next?', ['Purchase a projector.', 'Cancel the meeting.', 'Call the technical team.', 'Email the new room number.'], 3,
      'Maya nói sẽ gửi email số phòng mới ngay. Ben là người sẽ gọi nhóm kỹ thuật, nên không gán hành động đó cho Maya.'],
  ]),
  ...rows('p3-listening-v1-delivery', 'Giao hàng', [
    ['How many lamps are missing from the delivery?', ['One.', 'Two.', 'Ten.', 'Twelve.'], 1,
      'Đặt 12 đèn nhưng mới nhận 10, nên thiếu hai chiếc. Leo cũng xác nhận hai chiếc còn lại đang được đóng gói.'],
    ['When will the remaining lamps arrive?', ['This morning.', 'This afternoon.', 'Tomorrow.', 'Next week.'], 2,
      'Leo nói hai đèn còn lại sẽ đến ngày mai. Chiều nay là thời điểm gửi mã theo dõi, không phải thời điểm giao đèn.'],
    ['What does Nora ask Leo to email?', ['A tracking number.', 'A revised invoice.', 'A product catalog.', 'A return form.'], 0,
      'Nora yêu cầu gửi tracking number trong hôm nay. Không có yêu cầu sửa hóa đơn, gửi danh mục hoặc biểu mẫu trả hàng.'],
  ]),
  ...rows('p4-listening-v1-museum', 'Tham quan', [
    ['What is the main purpose of the announcement?', ['To advertise an evening concert.', 'To give visitors information about the museum.', 'To recruit museum employees.', 'To announce a ticket price increase.'], 1,
      'Thông báo chào khách rồi cung cấp giờ mở cửa, phòng đóng cửa và vị trí dịch vụ. Mục đích là hướng dẫn khách tham quan bảo tàng.'],
    ['Which area is closed today?', ['The gift shop.', 'The cafe.', 'The information desk.', 'The photography gallery.'], 3,
      'Người nói nêu rõ phòng trưng bày nhiếp ảnh đóng cửa thứ Năm để bảo trì; các phòng trưng bày khác vẫn mở.'],
    ['Where is the cafe?', ['Across from the main entrance.', 'Inside the photography gallery.', 'On the first floor, beside the gift shop.', 'Outside the museum.'], 2,
      'Bài nói xác định quán cà phê ở tầng một, bên cạnh cửa hàng quà tặng. Đây là thông tin vị trí được nói trực tiếp.'],
  ]),
  ...rows('p4-listening-v1-repair', 'Bảo trì văn phòng', [
    ['Why is Jordan calling?', ['To confirm a repair appointment.', 'To apply for an office job.', 'To sell a new air conditioner.', 'To request payment for painting.'], 0,
      'Jordan nói rõ gọi để xác nhận lịch sửa máy điều hòa văn phòng; không phải bán máy mới hoặc thu tiền sơn.'],
    ['On which day will the technician arrive?', ['Wednesday.', 'Thursday.', 'Friday.', 'Monday.'], 2,
      'Kỹ thuật viên sẽ đến vào thứ Sáu. Trưa thứ Năm là hạn gọi xác nhận có người đón, không phải ngày kỹ thuật viên đến.'],
    ['Where should someone meet the technician?', ['At the front entrance.', 'At the rear entrance.', 'In the parking garage.', 'At the train station.'], 1,
      'Người nói yêu cầu đón ở lối vào phía sau vì lối vào phía trước đang được sơn. Rear entrance là lối vào phía sau.'],
  ]),
];

export const listeningById = new Map([...LISTENING_STIMULI, ...EXPANSION_LISTENING].map(row => [row.id, row]));
export const isListeningKind = (kind: string) => ['part1', 'part2', 'part3', 'part4'].includes(kind);
