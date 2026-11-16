// Original ENG_MASTER practice content; not an official ETS test. Bank IDs/version are immutable.
export interface PracticeQuestion {id:string;kind:'part5'|'part2'|'context';topic:string;lessonId?:string;prompt:string;options:string[];correctIndex:number;explanation:string;}
export interface WorkplaceLesson {id:string;title:string;lines:{speaker:string;text:string;translation:string}[];note:string;}
export const PRACTICE_BANK:PracticeQuestion[]=[
  {
    "id": "p5-v1-1",
    "kind": "part5",
    "topic": "Giới từ",
    "prompt": "Please submit the expense report _____ Friday.",
    "options": [
      "by",
      "in",
      "at",
      "of"
    ],
    "correctIndex": 0,
    "explanation": "by + thời điểm: hạn cuối là thứ Sáu."
  },
  {
    "id": "p5-v1-2",
    "kind": "part5",
    "topic": "Từ loại",
    "prompt": "The new printer works more _____ than the old one.",
    "options": [
      "efficient",
      "efficiency",
      "efficiencies",
      "efficiently"
    ],
    "correctIndex": 3,
    "explanation": "Trạng từ efficiently bổ nghĩa cho works; more tạo dạng so sánh."
  },
  {
    "id": "p5-v1-3",
    "kind": "part5",
    "topic": "Động từ",
    "prompt": "All visitors must _____ at the reception desk.",
    "options": [
      "registered",
      "registering",
      "register",
      "registration"
    ],
    "correctIndex": 2,
    "explanation": "Sau động từ khuyết thiếu must dùng động từ nguyên mẫu."
  },
  {
    "id": "p5-v1-4",
    "kind": "part5",
    "topic": "Thì",
    "prompt": "Ms. Kim has worked in accounting _____ 2022.",
    "options": [
      "while",
      "since",
      "for",
      "during"
    ],
    "correctIndex": 1,
    "explanation": "since đi với mốc thời gian; for đi với khoảng thời gian."
  },
  {
    "id": "p5-v1-5",
    "kind": "part5",
    "topic": "Từ loại",
    "prompt": "The supplier offered us a _____ on bulk orders.",
    "options": [
      "discount",
      "discounted",
      "discounting",
      "discounts"
    ],
    "correctIndex": 0,
    "explanation": "Sau a cần danh từ số ít: a discount."
  },
  {
    "id": "p5-v1-6",
    "kind": "part5",
    "topic": "Liên từ",
    "prompt": "The meeting was postponed _____ the manager was ill.",
    "options": [
      "despite",
      "although",
      "unless",
      "because"
    ],
    "correctIndex": 3,
    "explanation": "because mở đầu mệnh đề chỉ nguyên nhân. Despite cần danh từ/cụm danh từ."
  },
  {
    "id": "p5-v1-7",
    "kind": "part5",
    "topic": "Cấu trúc",
    "prompt": "Employees are encouraged _____ feedback on the new policy.",
    "options": [
      "provide",
      "provided",
      "to provide",
      "providing"
    ],
    "correctIndex": 2,
    "explanation": "be encouraged to + động từ nguyên mẫu."
  },
  {
    "id": "p5-v1-8",
    "kind": "part5",
    "topic": "Từ loại",
    "prompt": "Neither proposal meets all of our _____.",
    "options": [
      "required",
      "requirements",
      "requires",
      "requiring"
    ],
    "correctIndex": 1,
    "explanation": "Sau our cần danh từ; requirements là các yêu cầu."
  },
  {
    "id": "p5-v1-9",
    "kind": "part5",
    "topic": "Điều kiện",
    "prompt": "If the shipment arrives today, we _____ it this afternoon.",
    "options": [
      "will inspect",
      "inspected",
      "would inspect",
      "have inspected"
    ],
    "correctIndex": 0,
    "explanation": "Điều kiện loại 1: if + hiện tại đơn, mệnh đề chính will + động từ."
  },
  {
    "id": "p5-v1-10",
    "kind": "part5",
    "topic": "Bị động",
    "prompt": "The documents _____ by the legal department yesterday.",
    "options": [
      "review",
      "are reviewing",
      "have reviewed",
      "were reviewed"
    ],
    "correctIndex": 3,
    "explanation": "yesterday: quá khứ. Tài liệu được xem xét nên dùng bị động were reviewed."
  },
  {
    "id": "p5-v1-11",
    "kind": "part5",
    "topic": "Đại từ",
    "prompt": "Please contact _____ if you need assistance.",
    "options": [
      "mine",
      "I",
      "me",
      "my"
    ],
    "correctIndex": 2,
    "explanation": "Sau contact cần đại từ tân ngữ me."
  },
  {
    "id": "p5-v1-12",
    "kind": "part5",
    "topic": "Giới từ",
    "prompt": "The office is located _____ the train station.",
    "options": [
      "nearness",
      "near",
      "nearly",
      "nearest"
    ],
    "correctIndex": 1,
    "explanation": "near làm giới từ chỉ vị trí; nearly là trạng từ chỉ mức độ."
  },
  {
    "id": "p5-v1-13",
    "kind": "part5",
    "topic": "Cấu trúc",
    "prompt": "We look forward to _____ you at the conference.",
    "options": [
      "seeing",
      "see",
      "saw",
      "seen"
    ],
    "correctIndex": 0,
    "explanation": "look forward to + danh từ/V-ing; to ở đây là giới từ."
  },
  {
    "id": "p5-v1-14",
    "kind": "part5",
    "topic": "Từ loại",
    "prompt": "The final invoice must be checked _____.",
    "options": [
      "careful",
      "care",
      "carefulness",
      "carefully"
    ],
    "correctIndex": 3,
    "explanation": "Trạng từ carefully bổ nghĩa cho be checked."
  },
  {
    "id": "p5-v1-15",
    "kind": "part5",
    "topic": "Giới từ",
    "prompt": "Our sales increased _____ ten percent last quarter.",
    "options": [
      "on",
      "with",
      "by",
      "at"
    ],
    "correctIndex": 2,
    "explanation": "increase by + mức tăng. Increase to + mức đạt tới."
  },
  {
    "id": "p5-v1-16",
    "kind": "part5",
    "topic": "So sánh",
    "prompt": "This is the _____ route to the airport.",
    "options": [
      "fastly",
      "fastest",
      "faster",
      "fast"
    ],
    "correctIndex": 1,
    "explanation": "the + so sánh nhất: the fastest route."
  },
  {
    "id": "p5-v1-17",
    "kind": "part5",
    "topic": "Giới từ",
    "prompt": "The warranty is valid _____ two years.",
    "options": [
      "for",
      "since",
      "until",
      "while"
    ],
    "correctIndex": 0,
    "explanation": "for + khoảng thời gian: two years."
  },
  {
    "id": "p5-v1-18",
    "kind": "part5",
    "topic": "Hòa hợp",
    "prompt": "Every applicant _____ to complete an online form.",
    "options": [
      "need",
      "needing",
      "have needed",
      "needs"
    ],
    "correctIndex": 3,
    "explanation": "Every applicant là chủ ngữ số ít; hiện tại đơn dùng needs."
  },
  {
    "id": "p5-v1-19",
    "kind": "part5",
    "topic": "Liên từ",
    "prompt": "Please keep the receipt _____ you need it for a refund.",
    "options": [
      "as soon as",
      "so that",
      "in case",
      "even though"
    ],
    "correctIndex": 2,
    "explanation": "in case: giữ phòng khi cần tới biên lai để hoàn tiền."
  },
  {
    "id": "p5-v1-20",
    "kind": "part5",
    "topic": "Từ loại",
    "prompt": "The technician will replace the _____ component.",
    "options": [
      "damages",
      "damaged",
      "damage",
      "damagingly"
    ],
    "correctIndex": 1,
    "explanation": "damaged là tính từ/phân từ mô tả linh kiện đã bị hỏng."
  },
  {
    "id": "p5-v1-21",
    "kind": "part5",
    "topic": "Bị động",
    "prompt": "The presentation has been _____ for Monday morning.",
    "options": [
      "scheduled",
      "schedule",
      "scheduling",
      "schedules"
    ],
    "correctIndex": 0,
    "explanation": "has been + phân từ quá khứ tạo bị động hiện tại hoàn thành."
  },
  {
    "id": "p5-v1-22",
    "kind": "part5",
    "topic": "Mệnh đề quan hệ",
    "prompt": "We need a room _____ can accommodate twenty people.",
    "options": [
      "who",
      "where",
      "whose",
      "that"
    ],
    "correctIndex": 3,
    "explanation": "that làm chủ ngữ thay cho a room trong mệnh đề quan hệ."
  },
  {
    "id": "p5-v1-23",
    "kind": "part5",
    "topic": "Đại từ",
    "prompt": "The company provides training to help staff improve _____ skills.",
    "options": [
      "they",
      "theirs",
      "their",
      "them"
    ],
    "correctIndex": 2,
    "explanation": "their là tính từ sở hữu đứng trước skills."
  },
  {
    "id": "p5-v1-24",
    "kind": "part5",
    "topic": "Từ vựng",
    "prompt": "Please send the file as an email _____.",
    "options": [
      "attaching",
      "attachment",
      "attach",
      "attached"
    ],
    "correctIndex": 1,
    "explanation": "email attachment là danh từ: tệp đính kèm email."
  },
  {
    "id": "p2-v1-1",
    "kind": "part2",
    "topic": "Hỏi và đáp",
    "prompt": "When will the replacement parts arrive?",
    "options": [
      "On Thursday morning.",
      "They are on the shelf.",
      "Yes, they fit well."
    ],
    "correctIndex": 0,
    "explanation": "When hỏi thời gian; Thursday morning trả lời đúng."
  },
  {
    "id": "p2-v1-2",
    "kind": "part2",
    "topic": "Hỏi và đáp",
    "prompt": "Where did you put the signed contract?",
    "options": [
      "I signed it yesterday.",
      "It expires next month.",
      "In the top drawer."
    ],
    "correctIndex": 2,
    "explanation": "Where hỏi địa điểm; top drawer là ngăn kéo trên cùng."
  },
  {
    "id": "p2-v1-3",
    "kind": "part2",
    "topic": "Hỏi và đáp",
    "prompt": "Who is leading the safety workshop?",
    "options": [
      "In the main hall.",
      "The operations manager.",
      "It starts at nine."
    ],
    "correctIndex": 1,
    "explanation": "Who hỏi người phụ trách."
  },
  {
    "id": "p2-v1-4",
    "kind": "part2",
    "topic": "Hỏi và đáp",
    "prompt": "Could you send me the updated schedule?",
    "options": [
      "Certainly, I will email it now.",
      "It was last month.",
      "The office is upstairs."
    ],
    "correctIndex": 0,
    "explanation": "Đây là lời nhờ gửi lịch; lời nhận lời và hành động gửi email phù hợp."
  },
  {
    "id": "p2-v1-5",
    "kind": "part2",
    "topic": "Hỏi và đáp",
    "prompt": "Why was the shipment delayed?",
    "options": [
      "At the loading dock.",
      "About twenty boxes.",
      "Because the road was closed."
    ],
    "correctIndex": 2,
    "explanation": "Why hỏi nguyên nhân; because đưa ra nguyên nhân."
  },
  {
    "id": "p2-v1-6",
    "kind": "part2",
    "topic": "Hỏi và đáp",
    "prompt": "How often do you inspect the equipment?",
    "options": [
      "By the entrance.",
      "Once a month.",
      "For the new office."
    ],
    "correctIndex": 1,
    "explanation": "How often hỏi tần suất."
  },
  {
    "id": "p2-v1-7",
    "kind": "part2",
    "topic": "Hỏi và đáp",
    "prompt": "Would you prefer a window seat or an aisle seat?",
    "options": [
      "An aisle seat, please.",
      "The flight is late.",
      "I arrived yesterday."
    ],
    "correctIndex": 0,
    "explanation": "Câu hỏi lựa chọn chỗ ngồi: chọn aisle seat."
  },
  {
    "id": "p2-v1-8",
    "kind": "part2",
    "topic": "Hỏi và đáp",
    "prompt": "Have you finished reviewing the budget?",
    "options": [
      "It is next to the door.",
      "Yes, the room is large.",
      "Not yet, I need another hour."
    ],
    "correctIndex": 2,
    "explanation": "Câu hỏi tiến độ: Not yet trả lời chưa xong."
  },
  {
    "id": "p2-v1-9",
    "kind": "part2",
    "topic": "Hỏi và đáp",
    "prompt": "How much does the delivery service cost?",
    "options": [
      "At the front desk.",
      "Twelve dollars per order.",
      "Three times a week."
    ],
    "correctIndex": 1,
    "explanation": "How much hỏi chi phí."
  },
  {
    "id": "p2-v1-10",
    "kind": "part2",
    "topic": "Hỏi và đáp",
    "prompt": "Should we reserve the larger conference room?",
    "options": [
      "Yes, we are expecting thirty guests.",
      "It is on the third floor.",
      "I reserved a table yesterday."
    ],
    "correctIndex": 0,
    "explanation": "Đồng ý và lý do số khách đông phù hợp đề xuất phòng lớn."
  },
  {
    "id": "p2-v1-11",
    "kind": "part2",
    "topic": "Hỏi và đáp",
    "prompt": "Is the supervisor in the office today?",
    "options": [
      "At half past two.",
      "The office is newly painted.",
      "No, she is visiting a client."
    ],
    "correctIndex": 2,
    "explanation": "Câu hỏi có mặt tại văn phòng; No kèm nơi supervisor đang đi trả lời đúng."
  },
  {
    "id": "p2-v1-12",
    "kind": "part2",
    "topic": "Hỏi và đáp",
    "prompt": "Which folder contains the invoice copies?",
    "options": [
      "Please sign the invoice.",
      "The one labeled April.",
      "We copied them twice."
    ],
    "correctIndex": 1,
    "explanation": "Which folder hỏi lựa chọn thư mục; nhãn April xác định thư mục."
  },
  {
    "id": "p2-v1-13",
    "kind": "part2",
    "topic": "Hỏi và đáp",
    "prompt": "Can we move the meeting to two o’clock?",
    "options": [
      "That works for me.",
      "It was two kilometers away.",
      "There are two chairs."
    ],
    "correctIndex": 0,
    "explanation": "Lời đề xuất giờ họp; That works for me là đồng ý."
  },
  {
    "id": "p2-v1-14",
    "kind": "part2",
    "topic": "Hỏi và đáp",
    "prompt": "Where can I get a visitor badge?",
    "options": [
      "It is a useful visit.",
      "The visitors left early.",
      "Ask the receptionist."
    ],
    "correctIndex": 2,
    "explanation": "Câu trả lời hướng dẫn hỏi lễ tân là phù hợp câu hỏi nơi lấy thẻ."
  },
  {
    "id": "p2-v1-15",
    "kind": "part2",
    "topic": "Hỏi và đáp",
    "prompt": "Why don’t we order lunch for the team?",
    "options": [
      "The team is on page two.",
      "Good idea, I will check the menu.",
      "Because lunch was delicious."
    ],
    "correctIndex": 1,
    "explanation": "Why don’t we là đề xuất; Good idea là chấp thuận."
  },
  {
    "id": "p2-v1-16",
    "kind": "part2",
    "topic": "Hỏi và đáp",
    "prompt": "How long does the installation take?",
    "options": [
      "About forty minutes.",
      "At the service counter.",
      "It costs forty dollars."
    ],
    "correctIndex": 0,
    "explanation": "How long hỏi khoảng thời gian."
  },
  {
    "id": "p2-v1-17",
    "kind": "part2",
    "topic": "Hỏi và đáp",
    "prompt": "You have already booked the hotel, haven’t you?",
    "options": [
      "The hotel has five floors.",
      "I work at the restaurant.",
      "Yes, I received the confirmation."
    ],
    "correctIndex": 2,
    "explanation": "Câu hỏi đuôi xác nhận đặt phòng; Yes với xác nhận phù hợp."
  },
  {
    "id": "p2-v1-18",
    "kind": "part2",
    "topic": "Hỏi và đáp",
    "prompt": "Would you mind closing the door?",
    "options": [
      "That is the door number.",
      "Of course not, I will close it.",
      "It closes at six."
    ],
    "correctIndex": 1,
    "explanation": "Of course not nghĩa là không phiền, nhận lời nhờ đóng cửa."
  },
  {
    "id": "context-v1-meeting-1",
    "kind": "context",
    "lessonId": "meeting",
    "topic": "Sắp xếp cuộc họp",
    "prompt": "Why does the speaker want to move the meeting?",
    "options": [
      "To finish an estimate.",
      "To hire more staff.",
      "To cancel the project."
    ],
    "correctIndex": 0,
    "explanation": "Người nói cần thêm một ngày để hoàn thành cost estimate."
  },
  {
    "id": "context-v1-meeting-2",
    "kind": "context",
    "lessonId": "meeting",
    "topic": "Sắp xếp cuộc họp",
    "prompt": "What will the second speaker update?",
    "options": [
      "The product price.",
      "The staff handbook.",
      "The invitation."
    ],
    "correctIndex": 2,
    "explanation": "Câu thứ hai nói rõ update the invitation."
  },
  {
    "id": "context-v1-meeting-3",
    "kind": "context",
    "lessonId": "meeting",
    "topic": "Sắp xếp cuộc họp",
    "prompt": "How many people will the room hold for this meeting?",
    "options": [
      "One hundred.",
      "Ten.",
      "Thursday."
    ],
    "correctIndex": 1,
    "explanation": "Phòng được đặt cho ten people."
  },
  {
    "id": "context-v1-travel-1",
    "kind": "context",
    "lessonId": "travel",
    "topic": "Đi công tác",
    "prompt": "When does the flight arrive?",
    "options": [
      "At six in the evening.",
      "At noon.",
      "At six in the morning."
    ],
    "correctIndex": 0,
    "explanation": "six in the evening là sáu giờ tối."
  },
  {
    "id": "context-v1-travel-2",
    "kind": "context",
    "lessonId": "travel",
    "topic": "Đi công tác",
    "prompt": "How often does the shuttle leave?",
    "options": [
      "Once a day.",
      "Every two hours.",
      "Every thirty minutes."
    ],
    "correctIndex": 2,
    "explanation": "Đối thoại nêu every thirty minutes."
  },
  {
    "id": "context-v1-travel-3",
    "kind": "context",
    "lessonId": "travel",
    "topic": "Đi công tác",
    "prompt": "Where should the traveler meet the driver?",
    "options": [
      "Inside the office.",
      "Outside Terminal Two.",
      "At the hotel restaurant."
    ],
    "correctIndex": 1,
    "explanation": "Chỉ dẫn là outside Terminal Two."
  },
  {
    "id": "context-v1-shipping-1",
    "kind": "context",
    "lessonId": "shipping",
    "topic": "Theo dõi đơn hàng",
    "prompt": "What problem does the customer report?",
    "options": [
      "The tracking page has no update.",
      "The order contains too many items.",
      "The invoice is missing."
    ],
    "correctIndex": 0,
    "explanation": "Khách nói tracking page still shows no update."
  },
  {
    "id": "context-v1-shipping-2",
    "kind": "context",
    "lessonId": "shipping",
    "topic": "Theo dõi đơn hàng",
    "prompt": "When did the carrier collect the order?",
    "options": [
      "Last Friday.",
      "Tomorrow evening.",
      "This morning."
    ],
    "correctIndex": 2,
    "explanation": "Người trả lời nói collected it this morning."
  },
  {
    "id": "context-v1-shipping-3",
    "kind": "context",
    "lessonId": "shipping",
    "topic": "Theo dõi đơn hàng",
    "prompt": "When is delivery expected?",
    "options": [
      "Yesterday.",
      "On Friday.",
      "Tonight."
    ],
    "correctIndex": 1,
    "explanation": "Thông tin theo dõi có tối nay; ngày giao dự kiến là Friday."
  },
  {
    "id": "context-v1-hiring-1",
    "kind": "context",
    "lessonId": "hiring",
    "topic": "Tuyển dụng",
    "prompt": "What position is mentioned?",
    "options": [
      "Analyst.",
      "Driver.",
      "Receptionist."
    ],
    "correctIndex": 0,
    "explanation": "Đối thoại nhắc analyst position."
  },
  {
    "id": "context-v1-hiring-2",
    "kind": "context",
    "lessonId": "hiring",
    "topic": "Tuyển dụng",
    "prompt": "When is the interview proposed?",
    "options": [
      "This Thursday at twelve.",
      "Next Monday at nine.",
      "Next Tuesday at ten."
    ],
    "correctIndex": 2,
    "explanation": "Lời mời nêu next Tuesday at ten."
  },
  {
    "id": "context-v1-hiring-3",
    "kind": "context",
    "lessonId": "hiring",
    "topic": "Tuyển dụng",
    "prompt": "What does the applicant ask about?",
    "options": [
      "Parking fees.",
      "Documents to bring.",
      "The lunch menu."
    ],
    "correctIndex": 1,
    "explanation": "Ứng viên hỏi có nên mang résumé và references không."
  },
  {
    "id": "context-v1-maintenance-1",
    "kind": "context",
    "lessonId": "maintenance",
    "topic": "Bảo trì thiết bị",
    "prompt": "What is wrong with the copier?",
    "options": [
      "It stops after a few pages.",
      "It is missing from the office.",
      "It prints only in color."
    ],
    "correctIndex": 0,
    "explanation": "Câu đầu nêu keeps stopping after a few pages."
  },
  {
    "id": "context-v1-maintenance-2",
    "kind": "context",
    "lessonId": "maintenance",
    "topic": "Bảo trì thiết bị",
    "prompt": "When will the technician inspect it?",
    "options": [
      "Next week.",
      "Yesterday.",
      "This afternoon."
    ],
    "correctIndex": 2,
    "explanation": "Người nói hẹn inspect it this afternoon."
  },
  {
    "id": "context-v1-maintenance-3",
    "kind": "context",
    "lessonId": "maintenance",
    "topic": "Bảo trì thiết bị",
    "prompt": "What should staff use in the meantime?",
    "options": [
      "A new scanner.",
      "The printer on the second floor.",
      "The copier in the lobby."
    ],
    "correctIndex": 1,
    "explanation": "Chỉ dẫn dùng printer on the second floor tới khi sửa xong."
  },
  {
    "id": "context-v1-payment-1",
    "kind": "context",
    "lessonId": "payment",
    "topic": "Xử lý hóa đơn",
    "prompt": "What is missing from the invoice?",
    "options": [
      "The purchase order number.",
      "The company address.",
      "The payment amount."
    ],
    "correctIndex": 0,
    "explanation": "Câu đầu nêu purchase order number is missing."
  },
  {
    "id": "context-v1-payment-2",
    "kind": "context",
    "lessonId": "payment",
    "topic": "Xử lý hóa đơn",
    "prompt": "When will the revised invoice be sent?",
    "options": [
      "In thirty days.",
      "Next month.",
      "Today."
    ],
    "correctIndex": 2,
    "explanation": "Người trả lời sẽ send the revised invoice today."
  },
  {
    "id": "context-v1-payment-3",
    "kind": "context",
    "lessonId": "payment",
    "topic": "Xử lý hóa đơn",
    "prompt": "When is payment due?",
    "options": [
      "Immediately.",
      "Within thirty days.",
      "Within one week."
    ],
    "correctIndex": 1,
    "explanation": "Điều khoản thanh toán là within thirty days."
  }
];
export const WORKPLACE_LESSONS:WorkplaceLesson[]=[
  {
    "id": "meeting",
    "title": "Sắp xếp cuộc họp",
    "lines": [
      {
        "speaker": "A",
        "text": "Could we move the project meeting to Thursday? I need another day to finish the cost estimate.",
        "translation": "Chúng ta có thể chuyển cuộc họp dự án sang thứ Năm không? Tôi cần thêm một ngày để hoàn thành ước tính chi phí."
      },
      {
        "speaker": "B",
        "text": "We look forward to reviewing your estimate. I will update the invitation and reserve a room for ten people.",
        "translation": "Chúng tôi mong được xem ước tính của bạn. Tôi sẽ cập nhật lời mời và đặt phòng cho mười người."
      }
    ],
    "note": "move the meeting: đổi lịch họp; cost estimate: ước tính chi phí; reserve a room: đặt phòng."
  },
  {
    "id": "travel",
    "title": "Đi công tác",
    "lines": [
      {
        "speaker": "A",
        "text": "My flight lands at six in the evening. Is there a shuttle from the airport to the hotel?",
        "translation": "Chuyến bay của tôi hạ cánh lúc sáu giờ tối. Có xe đưa đón từ sân bay tới khách sạn không?"
      },
      {
        "speaker": "B",
        "text": "Yes, our shuttle leaves every thirty minutes. Please meet the driver outside Terminal Two.",
        "translation": "Có, xe đưa đón của chúng tôi chạy mỗi ba mươi phút. Vui lòng gặp tài xế bên ngoài Nhà ga Hai."
      }
    ],
    "note": "lands: hạ cánh; shuttle: xe đưa đón; terminal: nhà ga."
  },
  {
    "id": "shipping",
    "title": "Theo dõi đơn hàng",
    "lines": [
      {
        "speaker": "A",
        "text": "The order was dispatched yesterday, but the tracking page still shows no update. Could you check its status?",
        "translation": "Đơn hàng đã được gửi đi hôm qua, nhưng trang theo dõi vẫn chưa cập nhật. Bạn có thể kiểm tra tình trạng không?"
      },
      {
        "speaker": "B",
        "text": "The carrier collected it this morning. The tracking information should appear tonight, and delivery is expected on Friday.",
        "translation": "Đơn vị vận chuyển đã lấy hàng sáng nay. Thông tin theo dõi sẽ xuất hiện tối nay, và dự kiến giao hàng vào thứ Sáu."
      }
    ],
    "note": "dispatch: gửi hàng; carrier: đơn vị vận chuyển; delivery: giao hàng."
  },
  {
    "id": "hiring",
    "title": "Tuyển dụng",
    "lines": [
      {
        "speaker": "A",
        "text": "Thank you for applying for the analyst position. Could you attend an interview next Tuesday at ten?",
        "translation": "Cảm ơn bạn đã ứng tuyển vị trí chuyên viên phân tích. Bạn có thể tham dự phỏng vấn vào thứ Ba tới lúc mười giờ không?"
      },
      {
        "speaker": "B",
        "text": "Yes, that time is convenient. Should I bring copies of my résumé and references?",
        "translation": "Có, thời gian đó thuận tiện. Tôi có nên mang bản sao lý lịch và thông tin người tham chiếu không?"
      }
    ],
    "note": "apply for: ứng tuyển; analyst: chuyên viên phân tích; references: người/thông tin tham chiếu."
  },
  {
    "id": "maintenance",
    "title": "Bảo trì thiết bị",
    "lines": [
      {
        "speaker": "A",
        "text": "The copier keeps stopping after a few pages. We have already replaced the paper and checked for a jam.",
        "translation": "Máy photocopy cứ dừng sau vài trang. Chúng tôi đã thay giấy và kiểm tra giấy bị kẹt."
      },
      {
        "speaker": "B",
        "text": "I will inspect it this afternoon. Please use the printer on the second floor until the repair is complete.",
        "translation": "Tôi sẽ kiểm tra máy chiều nay. Vui lòng dùng máy in ở tầng hai cho tới khi sửa xong."
      }
    ],
    "note": "jam: kẹt giấy; inspect: kiểm tra; repair: sửa chữa."
  },
  {
    "id": "payment",
    "title": "Xử lý hóa đơn",
    "lines": [
      {
        "speaker": "A",
        "text": "We received your invoice, but the purchase order number is missing. Could you send a corrected copy?",
        "translation": "Chúng tôi đã nhận hóa đơn của bạn, nhưng thiếu số đơn đặt hàng. Bạn có thể gửi bản đã sửa không?"
      },
      {
        "speaker": "B",
        "text": "Certainly. I will add the number and send the revised invoice today. Payment is due within thirty days.",
        "translation": "Được. Tôi sẽ thêm số đó và gửi hóa đơn đã chỉnh sửa hôm nay. Hạn thanh toán là trong vòng ba mươi ngày."
      }
    ],
    "note": "purchase order: đơn đặt hàng; revised: đã sửa đổi; due: đến hạn."
  }
];
