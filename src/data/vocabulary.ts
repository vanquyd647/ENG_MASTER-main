export interface Word {
  id: string;
  topic: string;
  word: string;
  phonetic: string;
  pos: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
  translations?: {
    vi?: string;
    fr?: string;
    es?: string;
    [key: string]: string | undefined;
  };
}

export const VOCABULARY: Word[] = [
  {
    "id": "rec-01",
    "topic": "Recruitment",
    "word": "opening",
    "phonetic": "/ˈəʊpənɪŋ/",
    "pos": "noun",
    "meaning": "vị trí trống, sự mở cửa, lễ khai trương",
    "example": "A huge crowd turned out for the opening of the new show.",
    "exampleTranslation": "Một đám đông lớn đã đến để khai mạc buổi biểu diễn mới.",
    "translations": {
      "vi": "vị trí trống, sự mở cửa, lễ khai trương",
      "fr": "poste vacant",
      "es": "vacante"
    }
  },
  {
    "id": "rec-02",
    "topic": "Recruitment",
    "word": "applicant",
    "phonetic": "/ˈæplɪkənt/",
    "pos": "noun",
    "meaning": "ứng viên, người xin việc",
    "example": "Successful applicants will be notified in writing.",
    "exampleTranslation": "Các ứng viên thành công sẽ được thông báo bằng văn bản.",
    "translations": {
      "vi": "ứng viên, người xin việc",
      "fr": "candidat",
      "es": "solicitante"
    }
  },
  {
    "id": "rec-03",
    "topic": "Recruitment",
    "word": "meet",
    "phonetic": "/mˈiːt/",
    "pos": "verb",
    "meaning": "thỏa mãn, đáp ứng yêu cầu/ điều kiện",
    "example": "They will only agree to sign the contract if certain conditions are met.",
    "exampleTranslation": "Họ chỉ sẽ đồng ý ký hợp đồng khi một số điều kiện được đáp ứng.",
    "translations": {
      "vi": "thỏa mãn, đáp ứng yêu cầu/ điều kiện",
      "fr": "rencontrer",
      "es": "reunirse"
    }
  },
  {
    "id": "rec-04",
    "topic": "Recruitment",
    "word": "qualified",
    "phonetic": "/kwˈɒlɪfˌaɪd/",
    "pos": "adj",
    "meaning": "đủ khả năng, trình độ, điều kiện",
    "example": "I can't think of anyone better qualified to take over.",
    "exampleTranslation": "Tôi không thể nghĩ về bất kỳ ai có đủ điều kiện tốt hơn để đảm nhận.",
    "translations": {
      "vi": "đủ khả năng, trình độ, điều kiện",
      "fr": "qualifié",
      "es": "cualificado"
    }
  },
  {
    "id": "rec-05",
    "topic": "Recruitment",
    "word": "candidate",
    "phonetic": "/kˈændɪdˌeɪt/",
    "pos": "noun",
    "meaning": "thí sinh, ứng viên",
    "example": "There are three candidates standing in the election.",
    "exampleTranslation": "Có 3 ứng cử viên đứng trong cuộc bầu cử.",
    "translations": {
      "vi": "thí sinh, ứng viên",
      "fr": "candidat",
      "es": "candidato"
    }
  },
  {
    "id": "rec-06",
    "topic": "Recruitment",
    "word": "confidence",
    "phonetic": "/kˈɒnfɪdəns/",
    "pos": "noun",
    "meaning": "sự tin tưởng, lòng tin",
    "example": "The changes should improve public confidence in the system.",
    "exampleTranslation": "Những thay đổi sẽ cải thiện lòng tin của công chúng vào hệ thống.",
    "translations": {
      "vi": "sự tin tưởng, lòng tin",
      "fr": "confiance",
      "es": "confianza"
    }
  },
  {
    "id": "rec-07",
    "topic": "Recruitment",
    "word": "highly",
    "phonetic": "/hˈaɪli/",
    "pos": "adv",
    "meaning": "rất, hết sức",
    "example": "It is an able, young and highly motivated workforce.",
    "exampleTranslation": "Đây là một lực lượng lao động có năng lực, trẻ và có động lực rất cao.",
    "translations": {
      "vi": "rất, hết sức",
      "fr": "hautement",
      "es": "altamente"
    }
  },
  {
    "id": "rec-08",
    "topic": "Recruitment",
    "word": "professional",
    "phonetic": "/pɹəfˈɛʃənəl/",
    "pos": "adj",
    "meaning": "có tính chuyên môn, chuyên nghiệp, lành nghề",
    "example": "He spent his professional career at the University of Pennsylvania.",
    "exampleTranslation": "Ông đã dành sự nghiệp chuyên môn của mình tại Đại học Pennsylvania.",
    "translations": {
      "vi": "có tính chuyên môn, chuyên nghiệp, lành nghề",
      "fr": "professionnel",
      "es": "profesional"
    }
  },
  {
    "id": "rec-09",
    "topic": "Recruitment",
    "word": "hire",
    "phonetic": "/hˈaɪə/",
    "pos": "verb",
    "meaning": "thuê mướn, tuyển dụng",
    "example": "Poor families don't have enough money to hire good lawyers.",
    "exampleTranslation": "Những gia đình nghèo không đủ tiền để thuê luật sư giỏi.",
    "translations": {
      "vi": "thuê mướn, tuyển dụng",
      "fr": "embaucher",
      "es": "contratar"
    }
  },
  {
    "id": "rec-10",
    "topic": "Recruitment",
    "word": "reference",
    "phonetic": "/ɹˈɛfɹəns/",
    "pos": "noun",
    "meaning": "sự giới thiệu, sự tham khảo",
    "example": "She spoke in very vague terms and there were no direct references to specific situations.",
    "exampleTranslation": "Cô ấy nói những thuật ngữ rất mơ hồ và không có sự đề cập trực tiếp đến các tình huống cụ thể.",
    "translations": {
      "vi": "sự giới thiệu, sự tham khảo",
      "fr": "référence",
      "es": "referencia"
    }
  },
  {
    "id": "rec-11",
    "topic": "Recruitment",
    "word": "position",
    "phonetic": "/pəzˈɪʃən/",
    "pos": "noun",
    "meaning": "chức vụ, vị trí",
    "example": "He applied for the position of marketing manager.",
    "exampleTranslation": "Anh ấy đã ứng tuyển vào vị trí trưởng phòng marketing.",
    "translations": {
      "vi": "chức vụ, vị trí"
    }
  },
  {
    "id": "rec-12",
    "topic": "Recruitment",
    "word": "achievement",
    "phonetic": "/ɐtʃˈiːvmənt/",
    "pos": "noun",
    "meaning": "thành tựu, thành tích, sự đạt được",
    "example": "Finishing the marathon in 10th place was an incredible achievement.",
    "exampleTranslation": "Kết thúc cuộc thi marathon ở vị trí thứ 10 là một thành tích đáng kinh ngạc.",
    "translations": {
      "vi": "thành tựu, thành tích, sự đạt được"
    }
  },
  {
    "id": "rec-13",
    "topic": "Recruitment",
    "word": "impressed",
    "phonetic": "/ɪmpɹˈɛst/",
    "pos": "verb",
    "meaning": "có ấn tượng, cảm phục",
    "example": "We were impressed by the great richness of detail in her painting.",
    "exampleTranslation": "Chúng tôi bị ấn tượng bởi sự phong phú của các chi tiết trong bức tranh của cô ấy.",
    "translations": {
      "vi": "có ấn tượng, cảm phục"
    }
  },
  {
    "id": "rec-14",
    "topic": "Recruitment",
    "word": "excellent",
    "phonetic": "/ˈɛksələnt/",
    "pos": "adj",
    "meaning": "xuất sắc, vượt trội, ưu tú",
    "example": "Her car is in excellent condition.",
    "exampleTranslation": "Xe của cô ấy luôn trong tình trạng tuyệt vời.",
    "translations": {
      "vi": "xuất sắc, vượt trội, ưu tú"
    }
  },
  {
    "id": "rec-15",
    "topic": "Recruitment",
    "word": "eligible",
    "phonetic": "/ˈɛlɪdʒəbəl/",
    "pos": "adj",
    "meaning": "có đủ tư cách, thích hợp",
    "example": "Only people over 18 are eligible to vote.",
    "exampleTranslation": "Chỉ những người trên 18 tuổi mới đủ tư cách bỏ phiếu.",
    "translations": {
      "vi": "có đủ tư cách, thích hợp"
    }
  },
  {
    "id": "rec-16",
    "topic": "Recruitment",
    "word": "identify",
    "phonetic": "/aɪdˈɛntɪfˌaɪ/",
    "pos": "verb",
    "meaning": "nhận diện, nhận ra",
    "example": "Even the smallest baby can identify its mother by her voice.",
    "exampleTranslation": "Ngay cả em bé nhỏ nhất cũng có thể nhận dạng mẹ của nó bằng giọng nói của mẹ.",
    "translations": {
      "vi": "nhận diện, nhận ra"
    }
  },
  {
    "id": "rec-17",
    "topic": "Recruitment",
    "word": "associate",
    "phonetic": "/əˈsoʊsiˌeɪt/",
    "pos": "verb",
    "meaning": "liên kết, kết giao",
    "example": "Most people associate this brand with good quality.",
    "exampleTranslation": "Hầu hết mọi người liên kết thương hiệu này với chất lượng tốt.",
    "translations": {
      "vi": "liên kết, kết giao"
    }
  },
  {
    "id": "rec-18",
    "topic": "Recruitment",
    "word": "employment",
    "phonetic": "/ɛmplˈɔɪmənt/",
    "pos": "noun",
    "meaning": "việc làm",
    "example": "If you are unemployed but you are actively seeking employment, you may qualify for benefits.",
    "exampleTranslation": "Nếu bạn đang thất nghiệp nhưng bạn đang tích cực tìm kiếm việc làm, bạn có thể đủ điều kiện nhận trợ cấp.",
    "translations": {
      "vi": "việc làm"
    }
  },
  {
    "id": "rec-19",
    "topic": "Recruitment",
    "word": "lack",
    "phonetic": "/lˈæk/",
    "pos": "verb",
    "meaning": "thiếu, không có",
    "example": "We are lacking three members of staff due to illness.",
    "exampleTranslation": "Chúng tôi đang thiếu ba nhân viên do bệnh tật.",
    "translations": {
      "vi": "thiếu, không có"
    }
  },
  {
    "id": "rec-20",
    "topic": "Recruitment",
    "word": "managerial",
    "phonetic": "/mˌænɐdʒˈiəɹɪəl/",
    "pos": "adj",
    "meaning": "thuộc về quản lý",
    "example": "She has developed critical technical and managerial skills.",
    "exampleTranslation": "Cô ấy đã phát triển các kỹ năng quản lý và kỹ thuật quan trọng.",
    "translations": {
      "vi": "thuộc về quản lý"
    }
  },
  {
    "id": "rec-21",
    "topic": "Recruitment",
    "word": "familiar",
    "phonetic": "/fəmˈɪliə/",
    "pos": "adj",
    "meaning": "quen thuộc, thuần thục",
    "example": "There were one or two familiar faces.",
    "exampleTranslation": "Có một hoặc hai khuôn mặt quen thuộc.",
    "translations": {
      "vi": "quen thuộc, thuần thục"
    }
  },
  {
    "id": "rec-22",
    "topic": "Recruitment",
    "word": "prospective",
    "phonetic": "/pɹəspˈɛktɪv/",
    "pos": "adj",
    "meaning": "có triển vọng, có tương lai",
    "example": "We've had three sets of prospective buyers looking at the house.",
    "exampleTranslation": "Chúng tôi đã có ba nhóm người mua tiềm năng đang xem nhà.",
    "translations": {
      "vi": "có triển vọng, có tương lai"
    }
  },
  {
    "id": "rec-23",
    "topic": "Recruitment",
    "word": "appeal",
    "phonetic": "/ɐpˈiːl/",
    "pos": "verb",
    "meaning": "kêu gọi, lôi cuốn, hấp dẫn",
    "example": "They're appealing for clothes and blankets to send to the devastated region.",
    "exampleTranslation": "Họ đang kêu gọi quần áo và chăn để gửi đến vùng bị tàn phá.",
    "translations": {
      "vi": "kêu gọi, lôi cuốn, hấp dẫn"
    }
  },
  {
    "id": "rec-24",
    "topic": "Recruitment",
    "word": "specialize",
    "phonetic": "/ˈspɛʃəˌɫaɪz/",
    "pos": "verb",
    "meaning": "chuyên làm về, học chuyên về",
    "example": "She hired a lawyer who specializes in divorce cases.",
    "exampleTranslation": "Cô thuê một luật sư chuyên về các vụ ly hôn.",
    "translations": {
      "vi": "chuyên làm về, học chuyên về"
    }
  },
  {
    "id": "rec-25",
    "topic": "Recruitment",
    "word": "apprehensive",
    "phonetic": "/ˌæpɹɪhˈɛnsɪv/",
    "pos": "adj",
    "meaning": "lo lắng,e sợ",
    "example": "I've invited a lot of people to the party, but I'm a little apprehensive that no one will come.",
    "exampleTranslation": "Tôi đã mời rất nhiều người đến bữa tiệc, nhưng tôi hơi e ngại rằng sẽ không có ai đến cả.",
    "translations": {
      "vi": "lo lắng,e sợ"
    }
  },
  {
    "id": "rec-26",
    "topic": "Recruitment",
    "word": "consultant",
    "phonetic": "/kənsˈʌltənt/",
    "pos": "noun",
    "meaning": "người tư vấn, cố vấn",
    "example": "She is a feng shui consultant.",
    "exampleTranslation": "Cô ấy là một nhà tư vấn phong thủy.",
    "translations": {
      "vi": "người tư vấn, cố vấn"
    }
  },
  {
    "id": "rec-27",
    "topic": "Recruitment",
    "word": "entitle",
    "phonetic": "/ɛntˈaɪtəl/",
    "pos": "verb",
    "meaning": "cho quyền làm gì",
    "example": "The employer is entitled to ask for references.",
    "exampleTranslation": "Nhà tuyển dụng có quyền yêu cầu các tài liệu tham khảo.",
    "translations": {
      "vi": "cho quyền làm gì"
    }
  },
  {
    "id": "rec-28",
    "topic": "Recruitment",
    "word": "certification",
    "phonetic": "/sˌɜːtɪfɪkˈeɪʃən/",
    "pos": "noun",
    "meaning": "sự chứng nhận, giấy chứng nhận",
    "example": "He earned certification to fly single-engine aircraft.",
    "exampleTranslation": "Anh đã đạt được giấy chứng nhận lái máy bay một động cơ.",
    "translations": {
      "vi": "sự chứng nhận, giấy chứng nhận"
    }
  },
  {
    "id": "rec-29",
    "topic": "Recruitment",
    "word": "occupation",
    "phonetic": "/ˌɒkjʊpˈeɪʃən/",
    "pos": "noun",
    "meaning": "nghề nghiệp",
    "example": "He listed his occupation on the form as 'teacher.'",
    "exampleTranslation": "Anh ta liệt kê nghề nghiệp của mình trên biểu mẫu là một giáo viên.",
    "translations": {
      "vi": "nghề nghiệp"
    }
  },
  {
    "id": "rec-30",
    "topic": "Recruitment",
    "word": "wage",
    "phonetic": "/wˈeɪdʒ/",
    "pos": "noun",
    "meaning": "tiền lương, tiền công",
    "example": "There will be an increase in tax for those earning in excess of twice the national average wage.",
    "exampleTranslation": "Sẽ tăng thuế đối với những người có thu nhập cao hơn gấp đôi tiền lương trung bình của cả nước.",
    "translations": {
      "vi": "tiền lương, tiền công"
    }
  },
  {
    "id": "rec-31",
    "topic": "Recruitment",
    "word": "resume",
    "phonetic": "/ˈɹɛzəˌmeɪ/",
    "pos": "noun",
    "meaning": "sơ yếu lý lịch",
    "example": "She sent her resume to 50 companies, but didn't even get an interview.",
    "exampleTranslation": "Cô đã gửi sơ yếu lý lịch của mình đến 50 công ty, nhưng thậm chí không nhận được một cuộc phỏng vấn.",
    "translations": {
      "vi": "sơ yếu lý lịch"
    }
  },
  {
    "id": "rec-32",
    "topic": "Recruitment",
    "word": "requirement",
    "phonetic": "/ɹɪkwˈaɪəmənt/",
    "pos": "noun",
    "meaning": "điều kiện cần thiết, yêu cầu",
    "example": "A good degree is a minimum requirement for many jobs.",
    "exampleTranslation": "Bằng cấp tốt là yêu cầu tối thiểu cho nhiều công việc.",
    "translations": {
      "vi": "điều kiện cần thiết, yêu cầu"
    }
  },
  {
    "id": "rec-33",
    "topic": "Recruitment",
    "word": "interview",
    "phonetic": "/ˈɪntəvjˌuː/",
    "pos": "noun",
    "meaning": "cuộc phỏng vấn",
    "example": "I had an interview for a job with a publisher.",
    "exampleTranslation": "Tôi đã có một cuộc phỏng vấn cho một công việc với một nhà xuất bản.",
    "translations": {
      "vi": "cuộc phỏng vấn"
    }
  },
  {
    "id": "rec-34",
    "topic": "Recruitment",
    "word": "training",
    "phonetic": "/tɹˈeɪnɪŋ/",
    "pos": "noun",
    "meaning": "sự đào tạo, huấn luyện",
    "example": "No formal qualifications are required for the work - you'll get on-the-job training.",
    "exampleTranslation": "Không yêu cầu bằng cấp chính thức cho công việc - bạn sẽ được đào tạo tại chỗ.",
    "translations": {
      "vi": "sự đào tạo, huấn luyện"
    }
  },
  {
    "id": "rec-35",
    "topic": "Recruitment",
    "word": "condition",
    "phonetic": "/kəndˈɪʃən/",
    "pos": "noun",
    "meaning": "điều kiện",
    "example": "Riis devoted his life to improving conditions in urban slums.",
    "exampleTranslation": "Riis cống hiến cuộc đời của mình để cải thiện điều kiện ở các khu ổ chuột ở đô thị.",
    "translations": {
      "vi": "điều kiện"
    }
  },
  {
    "id": "rec-36",
    "topic": "Recruitment",
    "word": "diligent",
    "phonetic": "/dˈɪlɪdʒənt/",
    "pos": "adj",
    "meaning": "siêng năng, cần cù",
    "example": "Their lawyer was extremely diligent in preparing their case.",
    "exampleTranslation": "Luật sư của họ đã cực kỳ siêng năng chuẩn bị vụ án của họ.",
    "translations": {
      "vi": "siêng năng, cần cù"
    }
  },
  {
    "id": "rec-37",
    "topic": "Recruitment",
    "word": "proficiency",
    "phonetic": "/pɹəfˈɪʃənsi/",
    "pos": "noun",
    "meaning": "sự thông thạo, sự thành thạo",
    "example": "Some providers recommended strategies for students with limited English proficiency.",
    "exampleTranslation": "Một số nhà cung cấp đề xuất các chiến lược cho học sinh có trình độ tiếng Anh hạn chế.",
    "translations": {
      "vi": "sự thông thạo, sự thành thạo"
    }
  },
  {
    "id": "rec-38",
    "topic": "Recruitment",
    "word": "degree",
    "phonetic": "/dɪɡɹˈiː/",
    "pos": "noun",
    "meaning": "trình độ, bằng cấp",
    "example": "This job demands a high degree of skill.",
    "exampleTranslation": "Công việc này đòi hỏi trình độ kỹ năng cao.",
    "translations": {
      "vi": "trình độ, bằng cấp"
    }
  },
  {
    "id": "rec-39",
    "topic": "Recruitment",
    "word": "payroll",
    "phonetic": "/pˈeɪɹəʊl/",
    "pos": "noun",
    "meaning": "bảng lương, tổng quỹ lương",
    "example": "With debts of $4 million and a monthly payroll of $1.2 million, the venture is clearly heading for trouble.",
    "exampleTranslation": "Với khoản nợ 4 triệu đô la và bảng lương hàng tháng là 1,2 triệu đô la, các dự án rõ ràng đang gặp khó khăn.",
    "translations": {
      "vi": "bảng lương, tổng quỹ lương"
    }
  },
  {
    "id": "rec-40",
    "topic": "Recruitment",
    "word": "recruit",
    "phonetic": "/ɹɪkɹˈuːt/",
    "pos": "verb",
    "meaning": "tuyển dụng",
    "example": "I recruited three of my friends to help me move.",
    "exampleTranslation": "Tôi đã tuyển dụng ba người bạn của mình để giúp tôi di chuyển.",
    "translations": {
      "vi": "tuyển dụng"
    }
  },
  {
    "id": "reg-01",
    "topic": "Regulations",
    "word": "attire",
    "phonetic": "/ɐtˈaɪə/",
    "pos": "noun",
    "meaning": "quần áo, cách ăn mặc",
    "example": "I hardly think jeans are appropriate attire for a wedding.",
    "exampleTranslation": "Tôi hầu như không nghĩ quần jean là trang phục thích hợp cho một đám cưới.",
    "translations": {
      "vi": "quần áo, cách ăn mặc",
      "fr": "tenue",
      "es": "atuendo"
    }
  },
  {
    "id": "reg-02",
    "topic": "Regulations",
    "word": "concern",
    "phonetic": "/kənsˈɜːn/",
    "pos": "noun",
    "meaning": "sự lo lắng, mối quan ngại",
    "example": "Concern for the safety of the two missing teenagers is growing.",
    "exampleTranslation": "Mối lo lắng cho sự an toàn của 2 thanh niên mất tích ngày càng lớn.",
    "translations": {
      "vi": "sự lo lắng, mối quan ngại",
      "fr": "préoccupation",
      "es": "preocupación"
    }
  },
  {
    "id": "reg-03",
    "topic": "Regulations",
    "word": "exception",
    "phonetic": "/ɛksˈɛpʃən/",
    "pos": "noun",
    "meaning": "ngoại lệ",
    "example": "There are exceptions to every rule.",
    "exampleTranslation": "Có những ngoại lệ cho mọi quy tắc.",
    "translations": {
      "vi": "ngoại lệ",
      "fr": "exception",
      "es": "excepción"
    }
  },
  {
    "id": "reg-04",
    "topic": "Regulations",
    "word": "comply",
    "phonetic": "/kəmplˈaɪ/",
    "pos": "verb",
    "meaning": "tuân thủ, tuân theo",
    "example": "There are serious penalties for failure to comply with the regulations.",
    "exampleTranslation": "Có những hình phạt nghiêm khắc nếu không tuân thủ các quy định.",
    "translations": {
      "vi": "tuân thủ, tuân theo",
      "fr": "se conformer",
      "es": "cumplir"
    }
  },
  {
    "id": "reg-05",
    "topic": "Regulations",
    "word": "regulation",
    "phonetic": "/ɹˌɛɡjuːlˈeɪʃən/",
    "pos": "noun",
    "meaning": "quy định, quy tắc, điều lệ",
    "example": "I have acted strictly in accordance with the regulations at all times.",
    "exampleTranslation": "Tôi luôn luôn hành động theo đúng các quy định.",
    "translations": {
      "vi": "quy định, quy tắc, điều lệ",
      "fr": "règlement",
      "es": "reglamento"
    }
  },
  {
    "id": "off-01",
    "topic": "Office Work",
    "word": "accustomed",
    "phonetic": "/ɐkˈʌstəmd/",
    "pos": "adj",
    "meaning": "quen với, thành thói quen",
    "example": "Slowly Jack had become accustomed even to this.",
    "exampleTranslation": "Từ từ Jack đã trở nên quen với điều này.",
    "translations": {
      "vi": "quen với, thành thói quen"
    }
  },
  {
    "id": "off-02",
    "topic": "Office Work",
    "word": "demanding",
    "phonetic": "/dɪmˈɑːndɪŋ/",
    "pos": "adj",
    "meaning": "đòi hỏi khắt khe",
    "example": "I'm trying to learn English, and I find it very demanding.",
    "exampleTranslation": "Tôi đang cố gắng để học Tiếng Anh, và tôi thấy nó đòi hỏi rất khắt khe.",
    "translations": {
      "vi": "đòi hỏi khắt khe"
    }
  },
  {
    "id": "off-03",
    "topic": "Office Work",
    "word": "colleague",
    "phonetic": "/kˈɒliːɡ/",
    "pos": "noun",
    "meaning": "đồng nghiệp",
    "example": "We're entertaining some colleagues of Carol's tonight.",
    "exampleTranslation": "Chúng ta sẽ chiêu đãi một số đồng nghiệp của Carol vào tối nay.",
    "translations": {
      "vi": "đồng nghiệp"
    }
  },
  {
    "id": "off-04",
    "topic": "Office Work",
    "word": "division",
    "phonetic": "/dɪvˈɪʒən/",
    "pos": "noun",
    "meaning": "bộ phận, sự phân chia",
    "example": "The electronics division was split off into a freestanding company.",
    "exampleTranslation": "Bộ phận điện tử được tách ra thành một công ty tự do.",
    "translations": {
      "vi": "bộ phận, sự phân chia"
    }
  },
  {
    "id": "off-05",
    "topic": "Office Work",
    "word": "efficiently",
    "phonetic": "/ɪfˈɪʃəntli/",
    "pos": "adv",
    "meaning": "một cách hiệu quả",
    "example": "She runs the business very efficiently.",
    "exampleTranslation": "Cô ấy điều hành công việc kinh doanh một cách rất hiệu quả.",
    "translations": {
      "vi": "một cách hiệu quả"
    }
  },
  {
    "id": "reg-06",
    "topic": "Regulations",
    "word": "policy",
    "phonetic": "/pˈɒlɪsi/",
    "pos": "noun",
    "meaning": "quy chế, chínhs ách",
    "example": "The team discussed the policy during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"quy chế, chínhs ách\" trong cuộc họp.",
    "translations": {
      "vi": "quy chế, chínhs ách"
    }
  },
  {
    "id": "reg-07",
    "topic": "Regulations",
    "word": "severely",
    "phonetic": "/sɪvˈiəli/",
    "pos": "adv",
    "meaning": "nghiêm khắc, khắt khe",
    "example": "The team completed the task severely.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"nghiêm khắc, khắt khe\".",
    "translations": {
      "vi": "nghiêm khắc, khắt khe"
    }
  },
  {
    "id": "reg-08",
    "topic": "Regulations",
    "word": "refrain",
    "phonetic": "/ɹɪfɹˈeɪn/",
    "pos": "verb",
    "meaning": "kiềm chế, hạn chế",
    "example": "The team plans to refrain before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"kiềm chế, hạn chế\" trước thời hạn.",
    "translations": {
      "vi": "kiềm chế, hạn chế"
    }
  },
  {
    "id": "reg-09",
    "topic": "Regulations",
    "word": "access",
    "phonetic": "/ˈæksɛs/",
    "pos": "noun",
    "meaning": "quy ền truy cập, sự luit ới, đường vào",
    "example": "The team discussed the access during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"quy ền truy cập, sự luit ới, đường vào\" trong cuộc họp.",
    "translations": {
      "vi": "quy ền truy cập, sự luit ới, đường vào"
    }
  },
  {
    "id": "reg-10",
    "topic": "Regulations",
    "word": "thoroughly",
    "phonetic": "/θˈʌɹəli/",
    "pos": "adv",
    "meaning": "một cách kỹ lưỡng",
    "example": "The team completed the task thoroughly.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"một cách kỹ lưỡng\".",
    "translations": {
      "vi": "một cách kỹ lưỡng"
    }
  },
  {
    "id": "reg-11",
    "topic": "Regulations",
    "word": "revise",
    "phonetic": "/ɹɪvˈaɪz/",
    "pos": "verb",
    "meaning": "sửa đổi, thay đổi (ý kiến,kế hoạch)",
    "example": "The team plans to revise before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"sửa đổi, thay đổi (ý kiến,kế hoạch)\" trước thời hạn.",
    "translations": {
      "vi": "sửa đổi, thay đổi (ý kiến,kế hoạch)"
    }
  },
  {
    "id": "reg-12",
    "topic": "Regulations",
    "word": "approval",
    "phonetic": "/ɐpɹˈuːvəl/",
    "pos": "noun",
    "meaning": "sự chấp thuận, sự phê duy ệt",
    "example": "The team discussed the approval during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự chấp thuận, sự phê duy ệt\" trong cuộc họp.",
    "translations": {
      "vi": "sự chấp thuận, sự phê duy ệt"
    }
  },
  {
    "id": "reg-13",
    "topic": "Regulations",
    "word": "form",
    "phonetic": "/fˈɔːm/",
    "pos": "noun",
    "meaning": "kiểu, loại, hình thức",
    "example": "The team discussed the form during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"kiểu, loại, hình thức\" trong cuộc họp.",
    "translations": {
      "vi": "kiểu, loại, hình thức"
    }
  },
  {
    "id": "reg-14",
    "topic": "Regulations",
    "word": "immediately",
    "phonetic": "/ɪmˈiːdɪətli/",
    "pos": "adv",
    "meaning": "ngay lập tức",
    "example": "The team completed the task immediately.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"ngay lập tức\".",
    "translations": {
      "vi": "ngay lập tức"
    }
  },
  {
    "id": "reg-15",
    "topic": "Regulations",
    "word": "procedure",
    "phonetic": "/pɹəsˈiːdʒɐ/",
    "pos": "noun",
    "meaning": "thủ tục",
    "example": "The team discussed the procedure during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"thủ tục\" trong cuộc họp.",
    "translations": {
      "vi": "thủ tục"
    }
  },
  {
    "id": "reg-16",
    "topic": "Regulations",
    "word": "negative",
    "phonetic": "/nˈɛɡətˌɪv/",
    "pos": "noun",
    "meaning": "tiêu cực, bi quan",
    "example": "The team discussed the negative during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"tiêu cực, bi quan\" trong cuộc họp.",
    "translations": {
      "vi": "tiêu cực, bi quan"
    }
  },
  {
    "id": "reg-17",
    "topic": "Regulations",
    "word": "mandate",
    "phonetic": "/ˈmænˌdeɪt/",
    "pos": "verb",
    "meaning": "ra lệnh, uỷ quy ền, uỷ thác",
    "example": "The team plans to mandate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"ra lệnh, uỷ quy ền, uỷ thác\" trước thời hạn.",
    "translations": {
      "vi": "ra lệnh, uỷ quy ền, uỷ thác"
    }
  },
  {
    "id": "reg-18",
    "topic": "Regulations",
    "word": "standard",
    "phonetic": "/stˈændəd/",
    "pos": "noun",
    "meaning": "tiêu chuẩn, chuẩn, trình độ",
    "example": "The team discussed the standard during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"tiêu chuẩn, chuẩn, trình độ\" trong cuộc họp.",
    "translations": {
      "vi": "tiêu chuẩn, chuẩn, trình độ"
    }
  },
  {
    "id": "reg-19",
    "topic": "Regulations",
    "word": "constant",
    "phonetic": "/kˈɒnstənt/",
    "pos": "adj",
    "meaning": "liên tục, không ngớt, không đứt",
    "example": "The manager described the proposal as constant.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"liên tục, không ngớt, không đứt\".",
    "translations": {
      "vi": "liên tục, không ngớt, không đứt"
    }
  },
  {
    "id": "reg-20",
    "topic": "Regulations",
    "word": "obligation",
    "phonetic": "/ˌɒblɪɡˈeɪʃən/",
    "pos": "noun",
    "meaning": "nghĩa vụ, trách nhiệm",
    "example": "The team discussed the obligation during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"nghĩa vụ, trách nhiệm\" trong cuộc họp.",
    "translations": {
      "vi": "nghĩa vụ, trách nhiệm"
    }
  },
  {
    "id": "reg-21",
    "topic": "Regulations",
    "word": "authorize",
    "phonetic": "/ˈɔθɝˌaɪz/",
    "pos": "verb",
    "meaning": "uỷ quy ền, cho phép",
    "example": "The team plans to authorize before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"uỷ quy ền, cho phép\" trước thời hạn.",
    "translations": {
      "vi": "uỷ quy ền, cho phép"
    }
  },
  {
    "id": "reg-22",
    "topic": "Regulations",
    "word": "habit",
    "phonetic": "/hˈæbɪt/",
    "pos": "noun",
    "meaning": "thói quen,t ập quán",
    "example": "The team discussed the habit during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"thói quen,t ập quán\" trong cuộc họp.",
    "translations": {
      "vi": "thói quen,t ập quán"
    }
  },
  {
    "id": "reg-23",
    "topic": "Regulations",
    "word": "restrict",
    "phonetic": "/ɹɪstɹˈɪkt/",
    "pos": "verb",
    "meaning": "giới hạn, hạn chế",
    "example": "The team plans to restrict before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"giới hạn, hạn chế\" trước thời hạn.",
    "translations": {
      "vi": "giới hạn, hạn chế"
    }
  },
  {
    "id": "reg-24",
    "topic": "Regulations",
    "word": "code",
    "phonetic": "/kˈəʊd/",
    "pos": "noun",
    "meaning": "quy định",
    "example": "The team discussed the code during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"quy định\" trong cuộc họp.",
    "translations": {
      "vi": "quy định"
    }
  },
  {
    "id": "reg-25",
    "topic": "Regulations",
    "word": "adhere",
    "phonetic": "/ɐdhˈiə/",
    "pos": "verb",
    "meaning": "báms át, tuân thủ",
    "example": "The team plans to adhere before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"báms át, tuân thủ\" trước thời hạn.",
    "translations": {
      "vi": "báms át, tuân thủ"
    }
  },
  {
    "id": "reg-26",
    "topic": "Regulations",
    "word": "permission",
    "phonetic": "/pəmˈɪʃən/",
    "pos": "noun",
    "meaning": "sự cho phép",
    "example": "The team discussed the permission during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự cho phép\" trong cuộc họp.",
    "translations": {
      "vi": "sự cho phép"
    }
  },
  {
    "id": "reg-27",
    "topic": "Regulations",
    "word": "approach",
    "phonetic": "/ɐpɹˈəʊtʃ/",
    "pos": "noun",
    "meaning": "cách tiếp cận, phương pháp xử lý",
    "example": "The team discussed the approach during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"cách tiếp cận, phương pháp xử lý\" trong cuộc họp.",
    "translations": {
      "vi": "cách tiếp cận, phương pháp xử lý"
    }
  },
  {
    "id": "reg-28",
    "topic": "Regulations",
    "word": "inspection",
    "phonetic": "/ɪnspˈɛkʃən/",
    "pos": "noun",
    "meaning": "sự kiểm tr a, sự thanh tra",
    "example": "The team discussed the inspection during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự kiểm tr a, sự thanh tra\" trong cuộc họp.",
    "translations": {
      "vi": "sự kiểm tr a, sự thanh tra"
    }
  },
  {
    "id": "reg-29",
    "topic": "Regulations",
    "word": "arrangement",
    "phonetic": "/ɐɹˈeɪndʒmənt/",
    "pos": "noun",
    "meaning": "sựs ắp đặt, sựs ắpx ếp,",
    "example": "The team discussed the arrangement during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sựs ắp đặt, sựs ắpx ếp,\" trong cuộc họp.",
    "translations": {
      "vi": "sựs ắp đặt, sựs ắpx ếp,"
    }
  },
  {
    "id": "reg-30",
    "topic": "Regulations",
    "word": "enable",
    "phonetic": "/ɛnˈeɪbəl/",
    "pos": "verb",
    "meaning": "làm cho có thể, cho phép",
    "example": "The team plans to enable before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"làm cho có thể, cho phép\" trước thời hạn.",
    "translations": {
      "vi": "làm cho có thể, cho phép"
    }
  },
  {
    "id": "reg-31",
    "topic": "Regulations",
    "word": "act",
    "phonetic": "/ˈækt/",
    "pos": "noun",
    "meaning": "việc, hành động; đạo luật",
    "example": "The team discussed the act during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"việc, hành động; đạo luật\" trong cuộc họp.",
    "translations": {
      "vi": "việc, hành động; đạo luật"
    }
  },
  {
    "id": "reg-32",
    "topic": "Regulations",
    "word": "compensation",
    "phonetic": "/kˌɒmpənsˈeɪʃən/",
    "pos": "noun",
    "meaning": "sự đền bù, sự bồi thường",
    "example": "The team discussed the compensation during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự đền bù, sự bồi thường\" trong cuộc họp.",
    "translations": {
      "vi": "sự đền bù, sự bồi thường"
    }
  },
  {
    "id": "reg-33",
    "topic": "Regulations",
    "word": "ban",
    "phonetic": "/bˈæn/",
    "pos": "noun",
    "meaning": "lệnh cấm, sự cấm đoán",
    "example": "The team discussed the ban during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"lệnh cấm, sự cấm đoán\" trong cuộc họp.",
    "translations": {
      "vi": "lệnh cấm, sự cấm đoán"
    }
  },
  {
    "id": "reg-34",
    "topic": "Regulations",
    "word": "abolish",
    "phonetic": "/ɐbˈɒlɪʃ/",
    "pos": "verb",
    "meaning": "thủ tiêu, bãi bỏ, huỷ bỏ",
    "example": "The team plans to abolish before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"thủ tiêu, bãi bỏ, huỷ bỏ\" trước thời hạn.",
    "translations": {
      "vi": "thủ tiêu, bãi bỏ, huỷ bỏ"
    }
  },
  {
    "id": "off-06",
    "topic": "Office Work",
    "word": "request",
    "phonetic": "/ɹɪkwˈɛst/",
    "pos": "noun",
    "meaning": "lờiy êu cầu, thỉnh cầu",
    "example": "The team discussed the request during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"lờiy êu cầu, thỉnh cầu\" trong cuộc họp.",
    "translations": {
      "vi": "lờiy êu cầu, thỉnh cầu"
    }
  },
  {
    "id": "off-07",
    "topic": "Office Work",
    "word": "submit",
    "phonetic": "/səbmˈɪt/",
    "pos": "verb",
    "meaning": "đệ trình, nộp",
    "example": "The team plans to submit before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đệ trình, nộp\" trước thời hạn.",
    "translations": {
      "vi": "đệ trình, nộp"
    }
  },
  {
    "id": "off-08",
    "topic": "Office Work",
    "word": "directly",
    "phonetic": "/daɪɹˈɛktli/",
    "pos": "adv",
    "meaning": "trực tiếp, thẳng, ngay",
    "example": "The team completed the task directly.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"trực tiếp, thẳng, ngay\".",
    "translations": {
      "vi": "trực tiếp, thẳng, ngay"
    }
  },
  {
    "id": "off-09",
    "topic": "Office Work",
    "word": "remind",
    "phonetic": "/ɹɪmˈaɪnd/",
    "pos": "verb",
    "meaning": "nhắc nhở",
    "example": "The team plans to remind before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"nhắc nhở\" trước thời hạn.",
    "translations": {
      "vi": "nhắc nhở"
    }
  },
  {
    "id": "off-10",
    "topic": "Office Work",
    "word": "instruct",
    "phonetic": "/ɪnstɹˈʌkt/",
    "pos": "verb",
    "meaning": "hướng dẫn, chỉ thị, dạy",
    "example": "The team plans to instruct before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"hướng dẫn, chỉ thị, dạy\" trước thời hạn.",
    "translations": {
      "vi": "hướng dẫn, chỉ thị, dạy"
    }
  },
  {
    "id": "off-11",
    "topic": "Office Work",
    "word": "sample",
    "phonetic": "/sˈɑːmpəl/",
    "pos": "noun",
    "meaning": "vật mẫu, mẫu thử",
    "example": "The team discussed the sample during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"vật mẫu, mẫu thử\" trong cuộc họp.",
    "translations": {
      "vi": "vật mẫu, mẫu thử"
    }
  },
  {
    "id": "off-12",
    "topic": "Office Work",
    "word": "notify",
    "phonetic": "/nˈəʊtɪfˌaɪ/",
    "pos": "verb",
    "meaning": "thông báo, cho biết",
    "example": "The team plans to notify before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"thông báo, cho biết\" trước thời hạn.",
    "translations": {
      "vi": "thông báo, cho biết"
    }
  },
  {
    "id": "off-13",
    "topic": "Office Work",
    "word": "perform",
    "phonetic": "/pəfˈɔːm/",
    "pos": "verb",
    "meaning": "thi hành, thực hiện, hoạt động",
    "example": "The team plans to perform before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"thi hành, thực hiện, hoạt động\" trước thời hạn.",
    "translations": {
      "vi": "thi hành, thực hiện, hoạt động"
    }
  },
  {
    "id": "off-14",
    "topic": "Office Work",
    "word": "assignment",
    "phonetic": "/ɐsˈaɪnmənt/",
    "pos": "noun",
    "meaning": "công việc, nhiệm vụ, bàit ập",
    "example": "The team discussed the assignment during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"công việc, nhiệm vụ, bàit ập\" trong cuộc họp.",
    "translations": {
      "vi": "công việc, nhiệm vụ, bàit ập"
    }
  },
  {
    "id": "off-15",
    "topic": "Office Work",
    "word": "entire",
    "phonetic": "/ɛntˈaɪə/",
    "pos": "adj",
    "meaning": "tr ọnv ẹn, hoàn to àn",
    "example": "The manager described the proposal as entire.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"tr ọnv ẹn, hoàn to àn\".",
    "translations": {
      "vi": "tr ọnv ẹn, hoàn to àn"
    }
  },
  {
    "id": "off-16",
    "topic": "Office Work",
    "word": "attendance",
    "phonetic": "/ɐtˈɛndəns/",
    "pos": "noun",
    "meaning": "sự tham gia, sự có mặt",
    "example": "The team discussed the attendance during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự tham gia, sự có mặt\" trong cuộc họp.",
    "translations": {
      "vi": "sự tham gia, sự có mặt"
    }
  },
  {
    "id": "off-17",
    "topic": "Office Work",
    "word": "absolutely",
    "phonetic": "/ˌæbsəlˈuːtli/",
    "pos": "adv",
    "meaning": "hoànt oàn, chắc chắn,",
    "example": "The team completed the task absolutely.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"hoànt oàn, chắc chắn,\".",
    "translations": {
      "vi": "hoànt oàn, chắc chắn,"
    }
  },
  {
    "id": "off-18",
    "topic": "Office Work",
    "word": "attentively",
    "phonetic": "/ɐtˈɛntɪvli/",
    "pos": "adv",
    "meaning": "chăm chú, thận tr ọng",
    "example": "The team completed the task attentively.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"chăm chú, thận tr ọng\".",
    "translations": {
      "vi": "chăm chú, thận tr ọng"
    }
  },
  {
    "id": "off-19",
    "topic": "Office Work",
    "word": "supervision",
    "phonetic": "/suːpəvˈɪʒən/",
    "pos": "noun",
    "meaning": "sự giáms át",
    "example": "The team discussed the supervision during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự giáms át\" trong cuộc họp.",
    "translations": {
      "vi": "sự giáms át"
    }
  },
  {
    "id": "off-20",
    "topic": "Office Work",
    "word": "revision",
    "phonetic": "/ɹɪvˈɪʒən/",
    "pos": "noun",
    "meaning": "sự sửa lại, duyệt lại",
    "example": "The team discussed the revision during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự sửa lại, duyệt lại\" trong cuộc họp.",
    "translations": {
      "vi": "sự sửa lại, duyệt lại"
    }
  },
  {
    "id": "off-21",
    "topic": "Office Work",
    "word": "reluctantly",
    "phonetic": "/ɹɪlˈʌktəntli/",
    "pos": "adv",
    "meaning": "miễn cưỡng, bất đắc dĩ",
    "example": "The team completed the task reluctantly.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"miễn cưỡng, bất đắc dĩ\".",
    "translations": {
      "vi": "miễn cưỡng, bất đắc dĩ"
    }
  },
  {
    "id": "off-22",
    "topic": "Office Work",
    "word": "convey",
    "phonetic": "/kənvˈeɪ/",
    "pos": "verb",
    "meaning": "truy ền đạt,v ận chuyển",
    "example": "The team plans to convey before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"truy ền đạt,v ận chuyển\" trước thời hạn.",
    "translations": {
      "vi": "truy ền đạt,v ận chuyển"
    }
  },
  {
    "id": "off-23",
    "topic": "Office Work",
    "word": "check",
    "phonetic": "/tʃˈɛk/",
    "pos": "verb",
    "meaning": "kiểm tr a, xemxé t,x ác nhận",
    "example": "The team plans to check before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"kiểm tr a, xemxé t,x ác nhận\" trước thời hạn.",
    "translations": {
      "vi": "kiểm tr a, xemxé t,x ác nhận"
    }
  },
  {
    "id": "off-24",
    "topic": "Office Work",
    "word": "oversee",
    "phonetic": "/ˌəʊvəsˈiː/",
    "pos": "verb",
    "meaning": "quans át, giáms át",
    "example": "The team plans to oversee before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"quans át, giáms át\" trước thời hạn.",
    "translations": {
      "vi": "quans át, giáms át"
    }
  },
  {
    "id": "off-25",
    "topic": "Office Work",
    "word": "concentrate",
    "phonetic": "/kˈɒnsəntɹˌeɪt/",
    "pos": "noun",
    "meaning": "tập trung, chút âm",
    "example": "The team discussed the concentrate during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"tập trung, chút âm\" trong cuộc họp.",
    "translations": {
      "vi": "tập trung, chút âm"
    }
  },
  {
    "id": "off-26",
    "topic": "Office Work",
    "word": "corporation",
    "phonetic": "/kˌɔːpəɹˈeɪʃən/",
    "pos": "noun",
    "meaning": "công ty, tập đoàn",
    "example": "The team discussed the corporation during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"công ty, tập đoàn\" trong cuộc họp.",
    "translations": {
      "vi": "công ty, tập đoàn"
    }
  },
  {
    "id": "off-27",
    "topic": "Office Work",
    "word": "manage",
    "phonetic": "/mˈænɪdʒ/",
    "pos": "verb",
    "meaning": "quản lý,x oays ở, giải quyết được",
    "example": "The team plans to manage before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"quản lý,x oays ở, giải quyết được\" trước thời hạn.",
    "translations": {
      "vi": "quản lý,x oays ở, giải quyết được"
    }
  },
  {
    "id": "off-28",
    "topic": "Office Work",
    "word": "monitor",
    "phonetic": "/mˈɒnɪtɐ/",
    "pos": "verb",
    "meaning": "giáms át, theo dõi",
    "example": "The team plans to monitor before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"giáms át, theo dõi\" trước thời hạn.",
    "translations": {
      "vi": "giáms át, theo dõi"
    }
  },
  {
    "id": "off-29",
    "topic": "Office Work",
    "word": "deserve",
    "phonetic": "/dɪzˈɜːv/",
    "pos": "verb",
    "meaning": "đáng, xứng đáng",
    "example": "The team plans to deserve before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đáng, xứng đáng\" trước thời hạn.",
    "translations": {
      "vi": "đáng, xứng đáng"
    }
  },
  {
    "id": "off-30",
    "topic": "Office Work",
    "word": "release",
    "phonetic": "/ɹiˈɫis/",
    "pos": "verb",
    "meaning": "phát hành, phóng thích, làm nhẹ bớt",
    "example": "The team plans to release before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"phát hành, phóng thích, làm nhẹ bớt\" trước thời hạn.",
    "translations": {
      "vi": "phát hành, phóng thích, làm nhẹ bớt"
    }
  },
  {
    "id": "off-31",
    "topic": "Office Work",
    "word": "electronically",
    "phonetic": "/ˌɛlɪktɹˈɒnɪkli/",
    "pos": "adv",
    "meaning": "bằng điện tử",
    "example": "The team completed the task electronically.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"bằng điện tử\".",
    "translations": {
      "vi": "bằng điện tử"
    }
  },
  {
    "id": "off-32",
    "topic": "Office Work",
    "word": "workshop",
    "phonetic": "/wˈɜːkʃɒp/",
    "pos": "noun",
    "meaning": "hội thảo, buổi đàot ạo",
    "example": "The team discussed the workshop during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"hội thảo, buổi đàot ạo\" trong cuộc họp.",
    "translations": {
      "vi": "hội thảo, buổi đàot ạo"
    }
  },
  {
    "id": "off-33",
    "topic": "Office Work",
    "word": "headquarters",
    "phonetic": "/hɛdkwˈɔːtəz/",
    "pos": "noun",
    "meaning": "trụsở chính",
    "example": "The team discussed the headquarters during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"trụsở chính\" trong cuộc họp.",
    "translations": {
      "vi": "trụsở chính"
    }
  },
  {
    "id": "off-34",
    "topic": "Office Work",
    "word": "involved",
    "phonetic": "/ɪnvˈɒlvd/",
    "pos": "adj",
    "meaning": "có tham giav ào, có liên quan",
    "example": "The manager described the proposal as involved.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"có tham giav ào, có liên quan\".",
    "translations": {
      "vi": "có tham giav ào, có liên quan"
    }
  },
  {
    "id": "off-35",
    "topic": "Office Work",
    "word": "procrastinate",
    "phonetic": "/pɹəkɹˈɑːstɪnˌeɪt/",
    "pos": "verb",
    "meaning": "trì hoãn, chần chừ",
    "example": "The team plans to procrastinate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"trì hoãn, chần chừ\" trước thời hạn.",
    "translations": {
      "vi": "trì hoãn, chần chừ"
    }
  },
  {
    "id": "off-36",
    "topic": "Office Work",
    "word": "combined",
    "phonetic": "/kəmbˈaɪnd/",
    "pos": "adj",
    "meaning": "đượckết hợp, chung,t ổng hợp",
    "example": "The manager described the proposal as combined.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"đượckết hợp, chung,t ổng hợp\".",
    "translations": {
      "vi": "đượckết hợp, chung,t ổng hợp"
    }
  },
  {
    "id": "off-37",
    "topic": "Office Work",
    "word": "occasionally",
    "phonetic": "/əkˈeɪʒənəli/",
    "pos": "adv",
    "meaning": "thỉnh thoảng, đôi khi",
    "example": "The team completed the task occasionally.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"thỉnh thoảng, đôi khi\".",
    "translations": {
      "vi": "thỉnh thoảng, đôi khi"
    }
  },
  {
    "id": "off-38",
    "topic": "Office Work",
    "word": "employee",
    "phonetic": "/ɛmplˈɔɪiː/",
    "pos": "noun",
    "meaning": "nhân viên, người lao động",
    "example": "The team discussed the employee during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"nhân viên, người lao động\" trong cuộc họp.",
    "translations": {
      "vi": "nhân viên, người lao động"
    }
  },
  {
    "id": "off-39",
    "topic": "Office Work",
    "word": "assist",
    "phonetic": "/ɐsˈɪst/",
    "pos": "verb",
    "meaning": "trợ giúp, hỗ trợ",
    "example": "The team plans to assist before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"trợ giúp, hỗ trợ\" trước thời hạn.",
    "translations": {
      "vi": "trợ giúp, hỗ trợ"
    }
  },
  {
    "id": "off-40",
    "topic": "Office Work",
    "word": "responsible",
    "phonetic": "/ɹɪspˈɒnsəbəl/",
    "pos": "adj",
    "meaning": "có tr ách nhiệm,",
    "example": "The manager described the proposal as responsible.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"có tr ách nhiệm,\".",
    "translations": {
      "vi": "có tr ách nhiệm,"
    }
  },
  {
    "id": "off-41",
    "topic": "Office Work",
    "word": "conduct",
    "phonetic": "/ˈkɑndəkt/",
    "pos": "verb",
    "meaning": "tiến hành, chỉ đạo, điều khiển",
    "example": "The team plans to conduct before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"tiến hành, chỉ đạo, điều khiển\" trước thời hạn.",
    "translations": {
      "vi": "tiến hành, chỉ đạo, điều khiển"
    }
  },
  {
    "id": "off-42",
    "topic": "Office Work",
    "word": "agree",
    "phonetic": "/ɐɡɹˈiː/",
    "pos": "verb",
    "meaning": "đồngý",
    "example": "The team plans to agree before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đồngý\" trước thời hạn.",
    "translations": {
      "vi": "đồngý"
    }
  },
  {
    "id": "off-43",
    "topic": "Office Work",
    "word": "supervise",
    "phonetic": "/sˈuːpəvˌaɪz/",
    "pos": "verb",
    "meaning": "giáms át",
    "example": "The team plans to supervise before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"giáms át\" trước thời hạn.",
    "translations": {
      "vi": "giáms át"
    }
  },
  {
    "id": "off-44",
    "topic": "Office Work",
    "word": "direct",
    "phonetic": "/daɪɹˈɛkt/",
    "pos": "verb",
    "meaning": "hướng dẫn, chỉ đạo",
    "example": "The team plans to direct before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"hướng dẫn, chỉ đạo\" trước thời hạn.",
    "translations": {
      "vi": "hướng dẫn, chỉ đạo"
    }
  },
  {
    "id": "off-45",
    "topic": "Office Work",
    "word": "assign",
    "phonetic": "/ɐsˈaɪn/",
    "pos": "verb",
    "meaning": "phân công, bổ nhiệm",
    "example": "The team plans to assign before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"phân công, bổ nhiệm\" trước thời hạn.",
    "translations": {
      "vi": "phân công, bổ nhiệm"
    }
  },
  {
    "id": "off-46",
    "topic": "Office Work",
    "word": "leading",
    "phonetic": "/ˈɫidɪŋ/",
    "pos": "adj",
    "meaning": "dẫn đầu, tiên phong, hàng đầu",
    "example": "The manager described the proposal as leading.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"dẫn đầu, tiên phong, hàng đầu\".",
    "translations": {
      "vi": "dẫn đầu, tiên phong, hàng đầu"
    }
  },
  {
    "id": "off-47",
    "topic": "Office Work",
    "word": "formal",
    "phonetic": "/fˈɔːməl/",
    "pos": "adj",
    "meaning": "tr ang tr ọng, chính thức",
    "example": "The manager described the proposal as formal.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"tr ang tr ọng, chính thức\".",
    "translations": {
      "vi": "tr ang tr ọng, chính thức"
    }
  },
  {
    "id": "off-48",
    "topic": "Office Work",
    "word": "remove",
    "phonetic": "/ɹɪmˈuːv/",
    "pos": "verb",
    "meaning": "xoá, dẹp; đuổi, cách chức",
    "example": "The team plans to remove before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"xoá, dẹp; đuổi, cách chức\" trước thời hạn.",
    "translations": {
      "vi": "xoá, dẹp; đuổi, cách chức"
    }
  },
  {
    "id": "off-49",
    "topic": "Office Work",
    "word": "collect",
    "phonetic": "/kəˈɫɛkt/",
    "pos": "verb",
    "meaning": "thu thập,t ập hợp",
    "example": "The team plans to collect before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"thu thập,t ập hợp\" trước thời hạn.",
    "translations": {
      "vi": "thu thập,t ập hợp"
    }
  },
  {
    "id": "off-50",
    "topic": "Office Work",
    "word": "coordinate",
    "phonetic": "/koʊˈɔɹdəˌneɪt/",
    "pos": "verb",
    "meaning": "điều phối,kết hợp",
    "example": "The team plans to coordinate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"điều phối,kết hợp\" trước thời hạn.",
    "translations": {
      "vi": "điều phối,kết hợp"
    }
  },
  {
    "id": "off-51",
    "topic": "Office Work",
    "word": "hardly",
    "phonetic": "/hˈɑːdli/",
    "pos": "adv",
    "meaning": "hiếm khi, khó khăn, hầu như không",
    "example": "The team completed the task hardly.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"hiếm khi, khó khăn, hầu như không\".",
    "translations": {
      "vi": "hiếm khi, khó khăn, hầu như không"
    }
  },
  {
    "id": "off-52",
    "topic": "Office Work",
    "word": "skillfully",
    "phonetic": "/skˈɪlfəli/",
    "pos": "adv",
    "meaning": "thành thạo, khéo léo",
    "example": "The team completed the task skillfully.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"thành thạo, khéo léo\".",
    "translations": {
      "vi": "thành thạo, khéo léo"
    }
  },
  {
    "id": "off-53",
    "topic": "Office Work",
    "word": "exclusive",
    "phonetic": "/ɛksklˈuːsɪv/",
    "pos": "adj",
    "meaning": "riêng biệ t, độc quy ền",
    "example": "The manager described the proposal as exclusive.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"riêng biệ t, độc quy ền\".",
    "translations": {
      "vi": "riêng biệ t, độc quy ền"
    }
  },
  {
    "id": "off-54",
    "topic": "Office Work",
    "word": "intention",
    "phonetic": "/ɪntˈɛnʃən/",
    "pos": "noun",
    "meaning": "ýđịnh, mục đích,ý muốn",
    "example": "The team discussed the intention during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"ýđịnh, mục đích,ý muốn\" trong cuộc họp.",
    "translations": {
      "vi": "ýđịnh, mục đích,ý muốn"
    }
  },
  {
    "id": "off-55",
    "topic": "Office Work",
    "word": "disturbing",
    "phonetic": "/dɪstˈɜːbɪŋ/",
    "pos": "adj",
    "meaning": "làm nhiễu loạn, làmx áo tr ộn",
    "example": "The manager described the proposal as disturbing.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"làm nhiễu loạn, làmx áo tr ộn\".",
    "translations": {
      "vi": "làm nhiễu loạn, làmx áo tr ộn"
    }
  },
  {
    "id": "off-56",
    "topic": "Office Work",
    "word": "foster",
    "phonetic": "/fˈɒstɐ/",
    "pos": "verb",
    "meaning": "thúc đẩy, bồi dưỡng, bồi đắp",
    "example": "The team plans to foster before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"thúc đẩy, bồi dưỡng, bồi đắp\" trước thời hạn.",
    "translations": {
      "vi": "thúc đẩy, bồi dưỡng, bồi đắp"
    }
  },
  {
    "id": "off-57",
    "topic": "Office Work",
    "word": "neutrality",
    "phonetic": "/njuːtɹˈælɪti/",
    "pos": "noun",
    "meaning": "tính chất trung lập, thái độ trung lập",
    "example": "The team discussed the neutrality during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"tính chất trung lập, thái độ trung lập\" trong cuộc họp.",
    "translations": {
      "vi": "tính chất trung lập, thái độ trung lập"
    }
  },
  {
    "id": "off-58",
    "topic": "Office Work",
    "word": "widely",
    "phonetic": "/wˈaɪdli/",
    "pos": "adv",
    "meaning": "rộng, nhiều,xa",
    "example": "The team completed the task widely.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"rộng, nhiều,xa\".",
    "translations": {
      "vi": "rộng, nhiều,xa"
    }
  },
  {
    "id": "off-59",
    "topic": "Office Work",
    "word": "undertake",
    "phonetic": "/ˌʌndətˈeɪk/",
    "pos": "verb",
    "meaning": "đảm nhận, tiếp quản",
    "example": "The team plans to undertake before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đảm nhận, tiếp quản\" trước thời hạn.",
    "translations": {
      "vi": "đảm nhận, tiếp quản"
    }
  },
  {
    "id": "off-60",
    "topic": "Office Work",
    "word": "manner",
    "phonetic": "/mˈænɐ/",
    "pos": "noun",
    "meaning": "cách, lối; thái độ, cử chỉ",
    "example": "The team discussed the manner during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"cách, lối; thái độ, cử chỉ\" trong cuộc họp.",
    "translations": {
      "vi": "cách, lối; thái độ, cử chỉ"
    }
  },
  {
    "id": "off-61",
    "topic": "Office Work",
    "word": "adjust",
    "phonetic": "/ɐdʒˈʌst/",
    "pos": "verb",
    "meaning": "điều chỉnh, làm cho thích hợp",
    "example": "The team plans to adjust before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"điều chỉnh, làm cho thích hợp\" trước thời hạn.",
    "translations": {
      "vi": "điều chỉnh, làm cho thích hợp"
    }
  },
  {
    "id": "off-62",
    "topic": "Office Work",
    "word": "personnel",
    "phonetic": "/pˌɜːsənˈɛl/",
    "pos": "noun",
    "meaning": "nhân viên, công chức",
    "example": "The team discussed the personnel during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"nhân viên, công chức\" trong cuộc họp.",
    "translations": {
      "vi": "nhân viên, công chức"
    }
  },
  {
    "id": "off-63",
    "topic": "Office Work",
    "word": "abstract",
    "phonetic": "/ˈæbˌstɹækt/",
    "pos": "adj",
    "meaning": "trừu tượng, mơ hồ",
    "example": "The manager described the proposal as abstract.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"trừu tượng, mơ hồ\".",
    "translations": {
      "vi": "trừu tượng, mơ hồ"
    }
  },
  {
    "id": "off-64",
    "topic": "Office Work",
    "word": "directory",
    "phonetic": "/daɪɹˈɛktəɹˌi/",
    "pos": "noun",
    "meaning": "danh bạ,sổ địa chỉ",
    "example": "The team discussed the directory during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"danh bạ,sổ địa chỉ\" trong cuộc họp.",
    "translations": {
      "vi": "danh bạ,sổ địa chỉ"
    }
  },
  {
    "id": "off-65",
    "topic": "Office Work",
    "word": "transform",
    "phonetic": "/ˈtɹænsfɔɹm/",
    "pos": "verb",
    "meaning": "biến đổi, thay đổi",
    "example": "The team plans to transform before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"biến đổi, thay đổi\" trước thời hạn.",
    "translations": {
      "vi": "biến đổi, thay đổi"
    }
  },
  {
    "id": "off-66",
    "topic": "Office Work",
    "word": "respectful",
    "phonetic": "/ɹɪspˈɛktfəl/",
    "pos": "adj",
    "meaning": "tôn tr ọng, lễ phép, kính cẩn",
    "example": "The manager described the proposal as respectful.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"tôn tr ọng, lễ phép, kính cẩn\".",
    "translations": {
      "vi": "tôn tr ọng, lễ phép, kính cẩn"
    }
  },
  {
    "id": "off-67",
    "topic": "Office Work",
    "word": "duplicate",
    "phonetic": "/ˈdupɫəˌkeɪt/",
    "pos": "noun",
    "meaning": "bảns ao",
    "example": "The team discussed the duplicate during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"bảns ao\" trong cuộc họp.",
    "translations": {
      "vi": "bảns ao"
    }
  },
  {
    "id": "off-68",
    "topic": "Office Work",
    "word": "contrary",
    "phonetic": "/ˈkɑntɹɛɹi/",
    "pos": "noun",
    "meaning": "sự tr ái ngược, điều ngược lại",
    "example": "The team discussed the contrary during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự tr ái ngược, điều ngược lại\" trong cuộc họp.",
    "translations": {
      "vi": "sự tr ái ngược, điều ngược lại"
    }
  },
  {
    "id": "off-69",
    "topic": "Office Work",
    "word": "engage",
    "phonetic": "/ɛnɡˈeɪdʒ/",
    "pos": "verb",
    "meaning": "tham gia, camkế t, thu hút",
    "example": "The team plans to engage before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"tham gia, camkế t, thu hút\" trước thời hạn.",
    "translations": {
      "vi": "tham gia, camkế t, thu hút"
    }
  },
  {
    "id": "off-70",
    "topic": "Office Work",
    "word": "timely",
    "phonetic": "/tˈaɪmli/",
    "pos": "adj",
    "meaning": "kịp thời",
    "example": "The manager described the proposal as timely.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"kịp thời\".",
    "translations": {
      "vi": "kịp thời"
    }
  },
  {
    "id": "off-71",
    "topic": "Office Work",
    "word": "realistically",
    "phonetic": "/ɹiəlˈɪstɪkli/",
    "pos": "adv",
    "meaning": "theo thực tế, thực tế là",
    "example": "The team completed the task realistically.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"theo thực tế, thực tế là\".",
    "translations": {
      "vi": "theo thực tế, thực tế là"
    }
  },
  {
    "id": "off-72",
    "topic": "Office Work",
    "word": "promptly",
    "phonetic": "/pɹˈɒmptli/",
    "pos": "adv",
    "meaning": "nhanh chóng, ngay lập tức, đúng giờ",
    "example": "The team completed the task promptly.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"nhanh chóng, ngay lập tức, đúng giờ\".",
    "translations": {
      "vi": "nhanh chóng, ngay lập tức, đúng giờ"
    }
  },
  {
    "id": "off-73",
    "topic": "Office Work",
    "word": "accessible",
    "phonetic": "/ɐksˈɛsəbəl/",
    "pos": "adv",
    "meaning": "có thể truy cập/ tiếp cận được,",
    "example": "The team completed the task accessible.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"có thể truy cập/ tiếp cận được,\".",
    "translations": {
      "vi": "có thể truy cập/ tiếp cận được,"
    }
  },
  {
    "id": "off-74",
    "topic": "Office Work",
    "word": "implement",
    "phonetic": "/ˈɪmpɫəmənt/",
    "pos": "verb",
    "meaning": "thi hành, tiến hành",
    "example": "The team plans to implement before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"thi hành, tiến hành\" trước thời hạn.",
    "translations": {
      "vi": "thi hành, tiến hành"
    }
  },
  {
    "id": "off-75",
    "topic": "Office Work",
    "word": "feedback",
    "phonetic": "/fˈiːdbæk/",
    "pos": "noun",
    "meaning": "phản hồi,ý kiến nhậnx ét",
    "example": "The team discussed the feedback during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"phản hồi,ý kiến nhậnx ét\" trong cuộc họp.",
    "translations": {
      "vi": "phản hồi,ý kiến nhậnx ét"
    }
  },
  {
    "id": "off-76",
    "topic": "Office Work",
    "word": "outstanding",
    "phonetic": "/aʊtstˈændɪŋ/",
    "pos": "adj",
    "meaning": "nội bật, đáng chú ý; cònt ồnt ại,",
    "example": "The manager described the proposal as outstanding.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"nội bật, đáng chú ý; cònt ồnt ại,\".",
    "translations": {
      "vi": "nội bật, đáng chú ý; cònt ồnt ại,"
    }
  },
  {
    "id": "off-77",
    "topic": "Office Work",
    "word": "inform",
    "phonetic": "/ɪnfˈɔːm/",
    "pos": "verb",
    "meaning": "thông báo, báo tin",
    "example": "The team plans to inform before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"thông báo, báo tin\" trước thời hạn.",
    "translations": {
      "vi": "thông báo, báo tin"
    }
  },
  {
    "id": "off-78",
    "topic": "Office Work",
    "word": "replacement",
    "phonetic": "/ɹɪplˈeɪsmənt/",
    "pos": "noun",
    "meaning": "sự thay thế, vật/ người thay thế",
    "example": "The team discussed the replacement during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự thay thế, vật/ người thay thế\" trong cuộc họp.",
    "translations": {
      "vi": "sự thay thế, vật/ người thay thế"
    }
  },
  {
    "id": "off-79",
    "topic": "Office Work",
    "word": "announcement",
    "phonetic": "/ɐnˈaʊnsmənt/",
    "pos": "noun",
    "meaning": "thông cáo, thông báo",
    "example": "The team discussed the announcement during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"thông cáo, thông báo\" trong cuộc họp.",
    "translations": {
      "vi": "thông cáo, thông báo"
    }
  },
  {
    "id": "off-80",
    "topic": "Office Work",
    "word": "outline",
    "phonetic": "/ˈaʊtlaɪn/",
    "pos": "noun",
    "meaning": "bản thảo, nét phác thảo, dàn bài",
    "example": "The team discussed the outline during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"bản thảo, nét phác thảo, dàn bài\" trong cuộc họp.",
    "translations": {
      "vi": "bản thảo, nét phác thảo, dàn bài"
    }
  },
  {
    "id": "off-81",
    "topic": "Office Work",
    "word": "explain",
    "phonetic": "/ɛksplˈeɪn/",
    "pos": "verb",
    "meaning": "giải thích, giảng giải",
    "example": "The team plans to explain before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"giải thích, giảng giải\" trước thời hạn.",
    "translations": {
      "vi": "giải thích, giảng giải"
    }
  },
  {
    "id": "off-82",
    "topic": "Office Work",
    "word": "overview",
    "phonetic": "/ˈəʊvəvjˌuː/",
    "pos": "noun",
    "meaning": "tổng quát, khái quát",
    "example": "The team discussed the overview during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"tổng quát, khái quát\" trong cuộc họp.",
    "translations": {
      "vi": "tổng quát, khái quát"
    }
  },
  {
    "id": "off-83",
    "topic": "Office Work",
    "word": "matter",
    "phonetic": "/mˈætɐ/",
    "pos": "noun",
    "meaning": "vấn đề, công việc",
    "example": "The team discussed the matter during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"vấn đề, công việc\" trong cuộc họp.",
    "translations": {
      "vi": "vấn đề, công việc"
    }
  },
  {
    "id": "off-84",
    "topic": "Office Work",
    "word": "remainder",
    "phonetic": "/ɹɪmˈeɪndɐ/",
    "pos": "noun",
    "meaning": "người/ vật còn lại, phần còn lại",
    "example": "The team discussed the remainder during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"người/ vật còn lại, phần còn lại\" trong cuộc họp.",
    "translations": {
      "vi": "người/ vật còn lại, phần còn lại"
    }
  },
  {
    "id": "off-85",
    "topic": "Office Work",
    "word": "essential",
    "phonetic": "/ɪsˈɛnʃəl/",
    "pos": "adj",
    "meaning": "cần thiết, thiết yếu, cốt yếu",
    "example": "The manager described the proposal as essential.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"cần thiết, thiết yếu, cốt yếu\".",
    "translations": {
      "vi": "cần thiết, thiết yếu, cốt yếu"
    }
  },
  {
    "id": "off-86",
    "topic": "Office Work",
    "word": "divide",
    "phonetic": "/dɪvˈaɪd/",
    "pos": "verb",
    "meaning": "chia ra, phân chia",
    "example": "The team plans to divide before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"chia ra, phân chia\" trước thời hạn.",
    "translations": {
      "vi": "chia ra, phân chia"
    }
  },
  {
    "id": "off-87",
    "topic": "Office Work",
    "word": "major",
    "phonetic": "/mˈeɪdʒɐ/",
    "pos": "adj",
    "meaning": "chủ yếu, chủ chốt, trọng đại",
    "example": "The manager described the proposal as major.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"chủ yếu, chủ chốt, trọng đại\".",
    "translations": {
      "vi": "chủ yếu, chủ chốt, trọng đại"
    }
  },
  {
    "id": "off-88",
    "topic": "Office Work",
    "word": "face",
    "phonetic": "/fˈeɪs/",
    "pos": "verb",
    "meaning": "đương đầu, đối mặt, hướng về",
    "example": "The team plans to face before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đương đầu, đối mặt, hướng về\" trước thời hạn.",
    "translations": {
      "vi": "đương đầu, đối mặt, hướng về"
    }
  },
  {
    "id": "off-89",
    "topic": "Office Work",
    "word": "follow",
    "phonetic": "/fˈɒləʊ/",
    "pos": "verb",
    "meaning": "làm theo, theo dõi, chú ý, theo kịp",
    "example": "The team plans to follow before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"làm theo, theo dõi, chú ý, theo kịp\" trước thời hạn.",
    "translations": {
      "vi": "làm theo, theo dõi, chú ý, theo kịp"
    }
  },
  {
    "id": "off-90",
    "topic": "Office Work",
    "word": "apparently",
    "phonetic": "/ɐpˈæɹəntli/",
    "pos": "adv",
    "meaning": "hình như",
    "example": "The team completed the task apparently.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"hình như\".",
    "translations": {
      "vi": "hình như"
    }
  },
  {
    "id": "off-91",
    "topic": "Office Work",
    "word": "aware",
    "phonetic": "/ɐwˈeə/",
    "pos": "adv",
    "meaning": "biế t, nhận thấy, nhận thức được",
    "example": "The team completed the task aware.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"biế t, nhận thấy, nhận thức được\".",
    "translations": {
      "vi": "biế t, nhận thấy, nhận thức được"
    }
  },
  {
    "id": "off-92",
    "topic": "Office Work",
    "word": "extended",
    "phonetic": "/ɛkstˈɛndɪd/",
    "pos": "adj",
    "meaning": "mởr ộng,k éo dài",
    "example": "The manager described the proposal as extended.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"mởr ộng,k éo dài\".",
    "translations": {
      "vi": "mởr ộng,k éo dài"
    }
  },
  {
    "id": "off-93",
    "topic": "Office Work",
    "word": "accidentally",
    "phonetic": "/ˌæksɪdˈɛntəli/",
    "pos": "adv",
    "meaning": "tình cờ, ngoàiý muốn",
    "example": "The team completed the task accidentally.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"tình cờ, ngoàiý muốn\".",
    "translations": {
      "vi": "tình cờ, ngoàiý muốn"
    }
  },
  {
    "id": "off-94",
    "topic": "Office Work",
    "word": "advisable",
    "phonetic": "/ɐdvˈaɪzəbəl/",
    "pos": "adj",
    "meaning": "nên làm, thích hợp",
    "example": "The manager described the proposal as advisable.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"nên làm, thích hợp\".",
    "translations": {
      "vi": "nên làm, thích hợp"
    }
  },
  {
    "id": "off-95",
    "topic": "Office Work",
    "word": "concerned",
    "phonetic": "/kənsˈɜːnd/",
    "pos": "adj",
    "meaning": "lo lắng, lo âu, có liên quan đến",
    "example": "The manager described the proposal as concerned.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"lo lắng, lo âu, có liên quan đến\".",
    "translations": {
      "vi": "lo lắng, lo âu, có liên quan đến"
    }
  },
  {
    "id": "off-96",
    "topic": "Office Work",
    "word": "speak",
    "phonetic": "/spˈiːk/",
    "pos": "verb",
    "meaning": "nói",
    "example": "The team plans to speak before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"nói\" trước thời hạn.",
    "translations": {
      "vi": "nói"
    }
  },
  {
    "id": "lei-01",
    "topic": "Leisure Time, Community",
    "word": "exhibition",
    "phonetic": "/ɛksɪbˈɪʃən/",
    "pos": "noun",
    "meaning": "cuộc triển lãm, sự trưng bày",
    "example": "The team discussed the exhibition during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"cuộc triển lãm, sự trưng bày\" trong cuộc họp.",
    "translations": {
      "vi": "cuộc triển lãm, sự trưng bày"
    }
  },
  {
    "id": "lei-02",
    "topic": "Leisure Time, Community",
    "word": "live",
    "phonetic": "/ˈɫaɪv/",
    "pos": "adj",
    "meaning": "pháts óng trực tiếp (r adio, tv),s ống",
    "example": "The manager described the proposal as live.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"pháts óng trực tiếp (r adio, tv),s ống\".",
    "translations": {
      "vi": "pháts óng trực tiếp (r adio, tv),s ống"
    }
  },
  {
    "id": "lei-03",
    "topic": "Leisure Time, Community",
    "word": "donation",
    "phonetic": "/dəʊnˈeɪʃən/",
    "pos": "noun",
    "meaning": "sự quy ên góp, từ thiện, sựt ặng",
    "example": "The team discussed the donation during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự quy ên góp, từ thiện, sựt ặng\" trong cuộc họp.",
    "translations": {
      "vi": "sự quy ên góp, từ thiện, sựt ặng"
    }
  },
  {
    "id": "lei-04",
    "topic": "Leisure Time, Community",
    "word": "present",
    "phonetic": "/ˈpɹɛzənt/",
    "pos": "verb",
    "meaning": "trình bày, giới thiệu",
    "example": "The team plans to present before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"trình bày, giới thiệu\" trước thời hạn.",
    "translations": {
      "vi": "trình bày, giới thiệu"
    }
  },
  {
    "id": "lei-05",
    "topic": "Leisure Time, Community",
    "word": "required",
    "phonetic": "/ɹɪkwˈaɪəd/",
    "pos": "adj",
    "meaning": "cần thiế t, đượcy êu cầu, phải có",
    "example": "The manager described the proposal as required.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"cần thiế t, đượcy êu cầu, phải có\".",
    "translations": {
      "vi": "cần thiế t, đượcy êu cầu, phải có"
    }
  },
  {
    "id": "lei-06",
    "topic": "Leisure Time, Community",
    "word": "appear",
    "phonetic": "/ɐpˈiə/",
    "pos": "verb",
    "meaning": "xuất hiện, trình diện",
    "example": "The team plans to appear before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"xuất hiện, trình diện\" trước thời hạn.",
    "translations": {
      "vi": "xuất hiện, trình diện"
    }
  },
  {
    "id": "lei-07",
    "topic": "Leisure Time, Community",
    "word": "accompany",
    "phonetic": "/ɐkˈʌmpəni/",
    "pos": "verb",
    "meaning": "đi cùng ai đó, kèm theo",
    "example": "The team plans to accompany before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đi cùng ai đó, kèm theo\" trước thời hạn.",
    "translations": {
      "vi": "đi cùng ai đó, kèm theo"
    }
  },
  {
    "id": "lei-08",
    "topic": "Leisure Time, Community",
    "word": "note",
    "phonetic": "/nˈəʊt/",
    "pos": "verb",
    "meaning": "ghi chú, lưuý",
    "example": "The team plans to note before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"ghi chú, lưuý\" trước thời hạn.",
    "translations": {
      "vi": "ghi chú, lưuý"
    }
  },
  {
    "id": "lei-09",
    "topic": "Leisure Time, Community",
    "word": "upcoming",
    "phonetic": "/ʌpkˈʌmɪŋ/",
    "pos": "adj",
    "meaning": "sắp đến,s ắpt ới",
    "example": "The manager described the proposal as upcoming.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"sắp đến,s ắpt ới\".",
    "translations": {
      "vi": "sắp đến,s ắpt ới"
    }
  },
  {
    "id": "lei-10",
    "topic": "Leisure Time, Community",
    "word": "lend",
    "phonetic": "/lˈɛnd/",
    "pos": "verb",
    "meaning": "cho mượn, chov ay",
    "example": "The team plans to lend before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"cho mượn, chov ay\" trước thời hạn.",
    "translations": {
      "vi": "cho mượn, chov ay"
    }
  },
  {
    "id": "lei-11",
    "topic": "Leisure Time, Community",
    "word": "local",
    "phonetic": "/lˈəʊkəl/",
    "pos": "adj",
    "meaning": "địa phương, cục bộ",
    "example": "The manager described the proposal as local.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"địa phương, cục bộ\".",
    "translations": {
      "vi": "địa phương, cục bộ"
    }
  },
  {
    "id": "lei-12",
    "topic": "Leisure Time, Community",
    "word": "contributor",
    "phonetic": "/kəntɹˈɪbjuːtɐ/",
    "pos": "noun",
    "meaning": "người cống hiến, người đóng góp",
    "example": "The team discussed the contributor during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"người cống hiến, người đóng góp\" trong cuộc họp.",
    "translations": {
      "vi": "người cống hiến, người đóng góp"
    }
  },
  {
    "id": "lei-13",
    "topic": "Leisure Time, Community",
    "word": "fascinating",
    "phonetic": "/fˈæsɪnˌeɪtɪŋ/",
    "pos": "adj",
    "meaning": "hấp dẫn, lôi cuốn, quyến rũ",
    "example": "The manager described the proposal as fascinating.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"hấp dẫn, lôi cuốn, quyến rũ\".",
    "translations": {
      "vi": "hấp dẫn, lôi cuốn, quyến rũ"
    }
  },
  {
    "id": "lei-14",
    "topic": "Leisure Time, Community",
    "word": "showing",
    "phonetic": "/ʃˈəʊɪŋ/",
    "pos": "noun",
    "meaning": "sự trình diễn, chứngcứ",
    "example": "The team discussed the showing during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự trình diễn, chứngcứ\" trong cuộc họp.",
    "translations": {
      "vi": "sự trình diễn, chứngcứ"
    }
  },
  {
    "id": "lei-15",
    "topic": "Leisure Time, Community",
    "word": "celebrity",
    "phonetic": "/səlˈɛbɹɪti/",
    "pos": "noun",
    "meaning": "người nổi tiếng",
    "example": "The team discussed the celebrity during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"người nổi tiếng\" trong cuộc họp.",
    "translations": {
      "vi": "người nổi tiếng"
    }
  },
  {
    "id": "lei-16",
    "topic": "Leisure Time, Community",
    "word": "alumni",
    "phonetic": "/ɐlˈʌmni/",
    "pos": "noun",
    "meaning": "cựu sinh viên",
    "example": "The team discussed the alumni during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"cựu sinh viên\" trong cuộc họp.",
    "translations": {
      "vi": "cựu sinh viên"
    }
  },
  {
    "id": "lei-17",
    "topic": "Leisure Time, Community",
    "word": "banquet",
    "phonetic": "/bˈæŋkwɪt/",
    "pos": "noun",
    "meaning": "bữa tiệc lớn",
    "example": "The team discussed the banquet during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"bữa tiệc lớn\" trong cuộc họp.",
    "translations": {
      "vi": "bữa tiệc lớn"
    }
  },
  {
    "id": "lei-18",
    "topic": "Leisure Time, Community",
    "word": "anniversary",
    "phonetic": "/ˌænɪvˈɜːsəɹˌi/",
    "pos": "noun",
    "meaning": "lễ kỷ niệm, ngày kỷ niệm",
    "example": "The team discussed the anniversary during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"lễ kỷ niệm, ngày kỷ niệm\" trong cuộc họp.",
    "translations": {
      "vi": "lễ kỷ niệm, ngày kỷ niệm"
    }
  },
  {
    "id": "lei-19",
    "topic": "Leisure Time, Community",
    "word": "rest",
    "phonetic": "/ɹˈɛst/",
    "pos": "verb",
    "meaning": "nghỉ ngơi, thư giãn",
    "example": "The team plans to rest before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"nghỉ ngơi, thư giãn\" trước thời hạn.",
    "translations": {
      "vi": "nghỉ ngơi, thư giãn"
    }
  },
  {
    "id": "lei-20",
    "topic": "Leisure Time, Community",
    "word": "fundraising",
    "phonetic": "/fʌndɹˈeɪzɪŋ/",
    "pos": "noun",
    "meaning": "việc gây quỹ",
    "example": "The team discussed the fundraising during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"việc gây quỹ\" trong cuộc họp.",
    "translations": {
      "vi": "việc gây quỹ"
    }
  },
  {
    "id": "lei-21",
    "topic": "Leisure Time, Community",
    "word": "issue",
    "phonetic": "/ˈɪʃuː/",
    "pos": "verb",
    "meaning": "phát hành, chora mắt",
    "example": "The team plans to issue before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"phát hành, chora mắt\" trước thời hạn.",
    "translations": {
      "vi": "phát hành, chora mắt"
    }
  },
  {
    "id": "lei-22",
    "topic": "Leisure Time, Community",
    "word": "anonymous",
    "phonetic": "/ɐnˈɒnəməs/",
    "pos": "adj",
    "meaning": "giấut ên, ẩn danh, nặc danh",
    "example": "The manager described the proposal as anonymous.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"giấut ên, ẩn danh, nặc danh\".",
    "translations": {
      "vi": "giấut ên, ẩn danh, nặc danh"
    }
  },
  {
    "id": "lei-23",
    "topic": "Leisure Time, Community",
    "word": "commit",
    "phonetic": "/kəmˈɪt/",
    "pos": "verb",
    "meaning": "giao phó, uỷ thác, camkế t, hứa",
    "example": "The team plans to commit before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"giao phó, uỷ thác, camkế t, hứa\" trước thời hạn.",
    "translations": {
      "vi": "giao phó, uỷ thác, camkế t, hứa"
    }
  },
  {
    "id": "lei-24",
    "topic": "Leisure Time, Community",
    "word": "audience",
    "phonetic": "/ˈɔːdiəns/",
    "pos": "noun",
    "meaning": "khán giả, thính giả",
    "example": "The team discussed the audience during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"khán giả, thính giả\" trong cuộc họp.",
    "translations": {
      "vi": "khán giả, thính giả"
    }
  },
  {
    "id": "lei-25",
    "topic": "Leisure Time, Community",
    "word": "author",
    "phonetic": "/ˈɔːθɐ/",
    "pos": "noun",
    "meaning": "tác giả",
    "example": "The team discussed the author during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"tác giả\" trong cuộc họp.",
    "translations": {
      "vi": "tác giả"
    }
  },
  {
    "id": "lei-26",
    "topic": "Leisure Time, Community",
    "word": "antique",
    "phonetic": "/æntˈiːk/",
    "pos": "noun",
    "meaning": "đồ cổ",
    "example": "The team discussed the antique during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"đồ cổ\" trong cuộc họp.",
    "translations": {
      "vi": "đồ cổ"
    }
  },
  {
    "id": "lei-27",
    "topic": "Leisure Time, Community",
    "word": "manuscript",
    "phonetic": "/mˈænjuːskɹˌɪpt/",
    "pos": "noun",
    "meaning": "bản viết tay, bản thảo",
    "example": "The team discussed the manuscript during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"bản viết tay, bản thảo\" trong cuộc họp.",
    "translations": {
      "vi": "bản viết tay, bản thảo"
    }
  },
  {
    "id": "lei-28",
    "topic": "Leisure Time, Community",
    "word": "advocate",
    "phonetic": "/ˈædvəˌkeɪt/",
    "pos": "noun",
    "meaning": "người ủng hộ, người biện hộ",
    "example": "The team discussed the advocate during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"người ủng hộ, người biện hộ\" trong cuộc họp.",
    "translations": {
      "vi": "người ủng hộ, người biện hộ"
    }
  },
  {
    "id": "mkt-01",
    "topic": "Marketing",
    "word": "survey",
    "phonetic": "/ˈsɝˌveɪ/",
    "pos": "noun",
    "meaning": "cuộc khảos át, cuộc thăm dò",
    "example": "The team discussed the survey during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"cuộc khảos át, cuộc thăm dò\" trong cuộc họp.",
    "translations": {
      "vi": "cuộc khảos át, cuộc thăm dò"
    }
  },
  {
    "id": "mkt-02",
    "topic": "Marketing",
    "word": "analysis",
    "phonetic": "/ɐnˈæləsˌɪs/",
    "pos": "noun",
    "meaning": "sự phân tích",
    "example": "The team discussed the analysis during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự phân tích\" trong cuộc họp.",
    "translations": {
      "vi": "sự phân tích"
    }
  },
  {
    "id": "mkt-03",
    "topic": "Marketing",
    "word": "monopoly",
    "phonetic": "/mənˈɒpəli/",
    "pos": "noun",
    "meaning": "sự độc quy ền,v ật độc quy ền",
    "example": "The team discussed the monopoly during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự độc quy ền,v ật độc quy ền\" trong cuộc họp.",
    "translations": {
      "vi": "sự độc quy ền,v ật độc quy ền"
    }
  },
  {
    "id": "mkt-04",
    "topic": "Marketing",
    "word": "competition",
    "phonetic": "/kˌɒmpətˈɪʃən/",
    "pos": "noun",
    "meaning": "sự cạnh tr anh, cuộc thi",
    "example": "The team discussed the competition during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự cạnh tr anh, cuộc thi\" trong cuộc họp.",
    "translations": {
      "vi": "sự cạnh tr anh, cuộc thi"
    }
  },
  {
    "id": "mkt-05",
    "topic": "Marketing",
    "word": "demand",
    "phonetic": "/dɪmˈɑːnd/",
    "pos": "noun",
    "meaning": "nhu cầu",
    "example": "The team discussed the demand during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"nhu cầu\" trong cuộc họp.",
    "translations": {
      "vi": "nhu cầu"
    }
  },
  {
    "id": "mkt-06",
    "topic": "Marketing",
    "word": "expand",
    "phonetic": "/ɛkspˈænd/",
    "pos": "verb",
    "meaning": "mởr ộng",
    "example": "The team plans to expand before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"mởr ộng\" trước thời hạn.",
    "translations": {
      "vi": "mởr ộng"
    }
  },
  {
    "id": "mkt-07",
    "topic": "Marketing",
    "word": "advanced",
    "phonetic": "/ɐdvˈænst/",
    "pos": "adj",
    "meaning": "tiên tiến, cao cấp",
    "example": "The manager described the proposal as advanced.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"tiên tiến, cao cấp\".",
    "translations": {
      "vi": "tiên tiến, cao cấp"
    }
  },
  {
    "id": "mkt-08",
    "topic": "Marketing",
    "word": "postpone",
    "phonetic": "/pəʊstpˈəʊn/",
    "pos": "verb",
    "meaning": "trì hoãn, hoãn lại",
    "example": "The team plans to postpone before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"trì hoãn, hoãn lại\" trước thời hạn.",
    "translations": {
      "vi": "trì hoãn, hoãn lại"
    }
  },
  {
    "id": "mkt-09",
    "topic": "Marketing",
    "word": "additional",
    "phonetic": "/ɐdˈɪʃənəl/",
    "pos": "adj",
    "meaning": "thêm vào, bổ sungv ào",
    "example": "The manager described the proposal as additional.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"thêm vào, bổ sungv ào\".",
    "translations": {
      "vi": "thêm vào, bổ sungv ào"
    }
  },
  {
    "id": "mkt-10",
    "topic": "Marketing",
    "word": "examine",
    "phonetic": "/ɛɡzˈæmɪn/",
    "pos": "verb",
    "meaning": "xemx ét, kiểm tra, điều tra",
    "example": "The team plans to examine before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"xemx ét, kiểm tra, điều tra\" trước thời hạn.",
    "translations": {
      "vi": "xemx ét, kiểm tra, điều tra"
    }
  },
  {
    "id": "mkt-11",
    "topic": "Marketing",
    "word": "like",
    "phonetic": "/lˈaɪk/",
    "pos": "verb",
    "meaning": "yêu thích",
    "example": "The team plans to like before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"yêu thích\" trước thời hạn.",
    "translations": {
      "vi": "yêu thích"
    }
  },
  {
    "id": "mkt-12",
    "topic": "Marketing",
    "word": "especially",
    "phonetic": "/ɪspˈɛʃəlˌi/",
    "pos": "adv",
    "meaning": "đặc biệt",
    "example": "The team completed the task especially.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"đặc biệt\".",
    "translations": {
      "vi": "đặc biệt"
    }
  },
  {
    "id": "mkt-13",
    "topic": "Marketing",
    "word": "reserve",
    "phonetic": "/ɹiˈzɝv/",
    "pos": "verb",
    "meaning": "đặt trước, dự trữ, để dành",
    "example": "The team plans to reserve before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đặt trước, dự trữ, để dành\" trước thời hạn.",
    "translations": {
      "vi": "đặt trước, dự trữ, để dành"
    }
  },
  {
    "id": "mkt-14",
    "topic": "Marketing",
    "word": "cooperate",
    "phonetic": "/kəʊˈɒpəɹˌeɪt/",
    "pos": "verb",
    "meaning": "hợpt ác",
    "example": "The team plans to cooperate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"hợpt ác\" trước thời hạn.",
    "translations": {
      "vi": "hợpt ác"
    }
  },
  {
    "id": "mkt-15",
    "topic": "Marketing",
    "word": "very",
    "phonetic": "/vˈɛɹi/",
    "pos": "adv",
    "meaning": "rất, hết sức",
    "example": "The team completed the task very.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"rất, hết sức\".",
    "translations": {
      "vi": "rất, hết sức"
    }
  },
  {
    "id": "mkt-16",
    "topic": "Marketing",
    "word": "consecutive",
    "phonetic": "/kənsˈɛkjuːtˌɪv/",
    "pos": "adj",
    "meaning": "liên tiếp, liên tục, liền nhau",
    "example": "The manager described the proposal as consecutive.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"liên tiếp, liên tục, liền nhau\".",
    "translations": {
      "vi": "liên tiếp, liên tục, liền nhau"
    }
  },
  {
    "id": "mkt-17",
    "topic": "Marketing",
    "word": "expectation",
    "phonetic": "/ɛkspɪktˈeɪʃən/",
    "pos": "noun",
    "meaning": "sự mong muốn, kỳv ọng, dự kiến",
    "example": "The team discussed the expectation during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự mong muốn, kỳv ọng, dự kiến\" trong cuộc họp.",
    "translations": {
      "vi": "sự mong muốn, kỳv ọng, dự kiến"
    }
  },
  {
    "id": "mkt-18",
    "topic": "Marketing",
    "word": "raise",
    "phonetic": "/ɹˈeɪz/",
    "pos": "verb",
    "meaning": "tăng lên, nâng lên, đề xuất, đưara",
    "example": "The team plans to raise before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"tăng lên, nâng lên, đề xuất, đưara\" trước thời hạn.",
    "translations": {
      "vi": "tăng lên, nâng lên, đề xuất, đưara"
    }
  },
  {
    "id": "mkt-19",
    "topic": "Marketing",
    "word": "extremely",
    "phonetic": "/ɛkstɹˈiːmli/",
    "pos": "adv",
    "meaning": "vô cùng, cựckỳ",
    "example": "The team completed the task extremely.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"vô cùng, cựckỳ\".",
    "translations": {
      "vi": "vô cùng, cựckỳ"
    }
  },
  {
    "id": "mkt-20",
    "topic": "Marketing",
    "word": "probable",
    "phonetic": "/pɹˈɒbəbəl/",
    "pos": "adj",
    "meaning": "nhiều khả năng, có thể,",
    "example": "The manager described the proposal as probable.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"nhiều khả năng, có thể,\".",
    "translations": {
      "vi": "nhiều khả năng, có thể,"
    }
  },
  {
    "id": "mkt-21",
    "topic": "Marketing",
    "word": "focus",
    "phonetic": "/fˈəʊkəs/",
    "pos": "verb",
    "meaning": "tập trung",
    "example": "The team plans to focus before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"tập trung\" trước thời hạn.",
    "translations": {
      "vi": "tập trung"
    }
  },
  {
    "id": "mkt-22",
    "topic": "Marketing",
    "word": "impact",
    "phonetic": "/ˈɪmpækt/",
    "pos": "noun",
    "meaning": "sự ảnh hưởng, sự tác động",
    "example": "The team discussed the impact during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự ảnh hưởng, sự tác động\" trong cuộc họp.",
    "translations": {
      "vi": "sự ảnh hưởng, sự tác động"
    }
  },
  {
    "id": "mkt-23",
    "topic": "Marketing",
    "word": "comparison",
    "phonetic": "/kəmpˈæɹɪsən/",
    "pos": "noun",
    "meaning": "sự so sánh",
    "example": "The team discussed the comparison during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự so sánh\" trong cuộc họp.",
    "translations": {
      "vi": "sự so sánh"
    }
  },
  {
    "id": "mkt-24",
    "topic": "Marketing",
    "word": "gap",
    "phonetic": "/ɡˈæp/",
    "pos": "noun",
    "meaning": "lỗ hỏng, kẽ hở, khoảng trắng",
    "example": "The team discussed the gap during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"lỗ hỏng, kẽ hở, khoảng trắng\" trong cuộc họp.",
    "translations": {
      "vi": "lỗ hỏng, kẽ hở, khoảng trắng"
    }
  },
  {
    "id": "mkt-25",
    "topic": "Marketing",
    "word": "mounting",
    "phonetic": "/mˈaʊntɪŋ/",
    "pos": "adj",
    "meaning": "tăng dần lên",
    "example": "The manager described the proposal as mounting.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"tăng dần lên\".",
    "translations": {
      "vi": "tăng dần lên"
    }
  },
  {
    "id": "mkt-26",
    "topic": "Marketing",
    "word": "reflective",
    "phonetic": "/ɹɪflˈɛktɪv/",
    "pos": "adj",
    "meaning": "phản chiếu, phản ánh",
    "example": "The manager described the proposal as reflective.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"phản chiếu, phản ánh\".",
    "translations": {
      "vi": "phản chiếu, phản ánh"
    }
  },
  {
    "id": "mkt-27",
    "topic": "Marketing",
    "word": "appreciate",
    "phonetic": "/ɐpɹˈiːʃɪˌeɪt/",
    "pos": "verb",
    "meaning": "đánh giá cao, cảm kích,",
    "example": "The team plans to appreciate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đánh giá cao, cảm kích,\" trước thời hạn.",
    "translations": {
      "vi": "đánh giá cao, cảm kích,"
    }
  },
  {
    "id": "mkt-28",
    "topic": "Marketing",
    "word": "publicize",
    "phonetic": "/ˈpəbɫɪˌsaɪz/",
    "pos": "verb",
    "meaning": "quảng cáo, đưara công khai",
    "example": "The team plans to publicize before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"quảng cáo, đưara công khai\" trước thời hạn.",
    "translations": {
      "vi": "quảng cáo, đưara công khai"
    }
  },
  {
    "id": "mkt-29",
    "topic": "Marketing",
    "word": "target",
    "phonetic": "/tˈɑːɡɪt/",
    "pos": "noun",
    "meaning": "mục tiêu, đích",
    "example": "The team discussed the target during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"mục tiêu, đích\" trong cuộc họp.",
    "translations": {
      "vi": "mục tiêu, đích"
    }
  },
  {
    "id": "mkt-30",
    "topic": "Marketing",
    "word": "campaign",
    "phonetic": "/kæmpˈeɪn/",
    "pos": "noun",
    "meaning": "chiến dịch, cuộcv ận động",
    "example": "The team discussed the campaign during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"chiến dịch, cuộcv ận động\" trong cuộc họp.",
    "translations": {
      "vi": "chiến dịch, cuộcv ận động"
    }
  },
  {
    "id": "mkt-31",
    "topic": "Marketing",
    "word": "marginal",
    "phonetic": "/mˈɑːdʒɪnəl/",
    "pos": "adj",
    "meaning": "ởmép, ngoài lề, không đángkể",
    "example": "The manager described the proposal as marginal.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"ởmép, ngoài lề, không đángkể\".",
    "translations": {
      "vi": "ởmép, ngoài lề, không đángkể"
    }
  },
  {
    "id": "mkt-32",
    "topic": "Marketing",
    "word": "instantly",
    "phonetic": "/ˈɪnstəntli/",
    "pos": "adv",
    "meaning": "ngay khi, ngay lập tức",
    "example": "The team completed the task instantly.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"ngay khi, ngay lập tức\".",
    "translations": {
      "vi": "ngay khi, ngay lập tức"
    }
  },
  {
    "id": "mkt-33",
    "topic": "Marketing",
    "word": "creative",
    "phonetic": "/kɹiːˈeɪtɪv/",
    "pos": "adj",
    "meaning": "sángt ạo",
    "example": "The manager described the proposal as creative.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"sángt ạo\".",
    "translations": {
      "vi": "sángt ạo"
    }
  },
  {
    "id": "mkt-34",
    "topic": "Marketing",
    "word": "aggressively",
    "phonetic": "/ɐɡɹˈɛsɪvli/",
    "pos": "adv",
    "meaning": "xôngx áo, tích cực",
    "example": "The team completed the task aggressively.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"xôngx áo, tích cực\".",
    "translations": {
      "vi": "xôngx áo, tích cực"
    }
  },
  {
    "id": "mkt-35",
    "topic": "Marketing",
    "word": "strategy",
    "phonetic": "/stɹˈætədʒi/",
    "pos": "noun",
    "meaning": "chiến lược",
    "example": "The team discussed the strategy during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"chiến lược\" trong cuộc họp.",
    "translations": {
      "vi": "chiến lược"
    }
  },
  {
    "id": "mkt-36",
    "topic": "Marketing",
    "word": "indicate",
    "phonetic": "/ˈɪndɪkˌeɪt/",
    "pos": "verb",
    "meaning": "biểu thị, chỉ ra",
    "example": "The team plans to indicate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"biểu thị, chỉ ra\" trước thời hạn.",
    "translations": {
      "vi": "biểu thị, chỉ ra"
    }
  },
  {
    "id": "mkt-37",
    "topic": "Marketing",
    "word": "attract",
    "phonetic": "/ɐtɹˈækt/",
    "pos": "verb",
    "meaning": "thu hút, lôi cuốn",
    "example": "The team plans to attract before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"thu hút, lôi cuốn\" trước thời hạn.",
    "translations": {
      "vi": "thu hút, lôi cuốn"
    }
  },
  {
    "id": "mkt-38",
    "topic": "Marketing",
    "word": "experience",
    "phonetic": "/ɛkspˈiəɹɪəns/",
    "pos": "noun",
    "meaning": "kinh nghiệm, sự trải nghiệm",
    "example": "The team discussed the experience during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"kinh nghiệm, sự trải nghiệm\" trong cuộc họp.",
    "translations": {
      "vi": "kinh nghiệm, sự trải nghiệm"
    }
  },
  {
    "id": "mkt-39",
    "topic": "Marketing",
    "word": "analyze",
    "phonetic": "/ˈænəˌɫaɪz/",
    "pos": "verb",
    "meaning": "phân tích",
    "example": "The team plans to analyze before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"phân tích\" trước thời hạn.",
    "translations": {
      "vi": "phân tích"
    }
  },
  {
    "id": "mkt-40",
    "topic": "Marketing",
    "word": "advise",
    "phonetic": "/ɐdvˈaɪz/",
    "pos": "verb",
    "meaning": "khuy ên nhủ, tưv ấn",
    "example": "The team plans to advise before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"khuy ên nhủ, tưv ấn\" trước thời hạn.",
    "translations": {
      "vi": "khuy ên nhủ, tưv ấn"
    }
  },
  {
    "id": "mkt-41",
    "topic": "Marketing",
    "word": "means",
    "phonetic": "/mˈiːnz/",
    "pos": "noun",
    "meaning": "phương tiện, cách",
    "example": "The team discussed the means during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"phương tiện, cách\" trong cuộc họp.",
    "translations": {
      "vi": "phương tiện, cách"
    }
  },
  {
    "id": "mkt-42",
    "topic": "Marketing",
    "word": "prefer",
    "phonetic": "/pɹɪfˈɜː/",
    "pos": "verb",
    "meaning": "yêu thích hơn (những cái khác)",
    "example": "The team plans to prefer before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"yêu thích hơn (những cái khác)\" trước thời hạn.",
    "translations": {
      "vi": "yêu thích hơn (những cái khác)"
    }
  },
  {
    "id": "mkt-43",
    "topic": "Marketing",
    "word": "advantage",
    "phonetic": "/ɐdvˈɑːntɪdʒ/",
    "pos": "noun",
    "meaning": "lợi ích, lợi thế",
    "example": "The team discussed the advantage during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"lợi ích, lợi thế\" trong cuộc họp.",
    "translations": {
      "vi": "lợi ích, lợi thế"
    }
  },
  {
    "id": "mkt-44",
    "topic": "Marketing",
    "word": "steadily",
    "phonetic": "/stˈɛdɪli/",
    "pos": "adv",
    "meaning": "vững chắc, bình tĩnh, kiên định",
    "example": "The team completed the task steadily.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"vững chắc, bình tĩnh, kiên định\".",
    "translations": {
      "vi": "vững chắc, bình tĩnh, kiên định"
    }
  },
  {
    "id": "mkt-45",
    "topic": "Marketing",
    "word": "necessarily",
    "phonetic": "/nˌɛsɪsˈɛɹəli/",
    "pos": "verb",
    "meaning": "tấty ếu, nhất thiết",
    "example": "The team plans to necessarily before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"tấty ếu, nhất thiết\" trước thời hạn.",
    "translations": {
      "vi": "tấty ếu, nhất thiết"
    }
  },
  {
    "id": "mkt-46",
    "topic": "Marketing",
    "word": "detect",
    "phonetic": "/dɪtˈɛkt/",
    "pos": "verb",
    "meaning": "phát hiệnr a, khám phá ra",
    "example": "The team plans to detect before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"phát hiệnr a, khám phá ra\" trước thời hạn.",
    "translations": {
      "vi": "phát hiệnr a, khám phá ra"
    }
  },
  {
    "id": "mkt-47",
    "topic": "Marketing",
    "word": "cover",
    "phonetic": "/kˈʌvɐ/",
    "pos": "verb",
    "meaning": "bao gồm, thanht oán, che phủ",
    "example": "The team plans to cover before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"bao gồm, thanht oán, che phủ\" trước thời hạn.",
    "translations": {
      "vi": "bao gồm, thanht oán, che phủ"
    }
  },
  {
    "id": "mkt-48",
    "topic": "Marketing",
    "word": "less",
    "phonetic": "/lˈɛs/",
    "pos": "adj",
    "meaning": "ít hơn,k ém hơn",
    "example": "The manager described the proposal as less.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"ít hơn,k ém hơn\".",
    "translations": {
      "vi": "ít hơn,k ém hơn"
    }
  },
  {
    "id": "mkt-49",
    "topic": "Marketing",
    "word": "majority",
    "phonetic": "/mədʒˈɒɹɪtˌi/",
    "pos": "noun",
    "meaning": "đas ố,số đông",
    "example": "The team discussed the majority during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"đas ố,số đông\" trong cuộc họp.",
    "translations": {
      "vi": "đas ố,số đông"
    }
  },
  {
    "id": "mkt-50",
    "topic": "Marketing",
    "word": "adopt",
    "phonetic": "/ɐdˈɒpt/",
    "pos": "verb",
    "meaning": "thông qua, lựa chọn, làm theo",
    "example": "The team plans to adopt before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"thông qua, lựa chọn, làm theo\" trước thời hạn.",
    "translations": {
      "vi": "thông qua, lựa chọn, làm theo"
    }
  },
  {
    "id": "mkt-51",
    "topic": "Marketing",
    "word": "largely",
    "phonetic": "/lˈɑːdʒli/",
    "pos": "adv",
    "meaning": "tr ên quy mô lớn, phần lớn",
    "example": "The team completed the task largely.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"tr ên quy mô lớn, phần lớn\".",
    "translations": {
      "vi": "tr ên quy mô lớn, phần lớn"
    }
  },
  {
    "id": "mkt-52",
    "topic": "Marketing",
    "word": "incentive",
    "phonetic": "/ɪnsˈɛntɪv/",
    "pos": "noun",
    "meaning": "sự khích lệ, ưu đãi",
    "example": "The team discussed the incentive during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự khích lệ, ưu đãi\" trong cuộc họp.",
    "translations": {
      "vi": "sự khích lệ, ưu đãi"
    }
  },
  {
    "id": "mkt-53",
    "topic": "Marketing",
    "word": "need",
    "phonetic": "/nˈiːd/",
    "pos": "noun",
    "meaning": "nhu cầu, sự cần thiết",
    "example": "The team discussed the need during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"nhu cầu, sự cần thiết\" trong cuộc họp.",
    "translations": {
      "vi": "nhu cầu, sự cần thiết"
    }
  },
  {
    "id": "mkt-54",
    "topic": "Marketing",
    "word": "advertisement",
    "phonetic": "/ɐdvˈɜːtɪsmənt/",
    "pos": "noun",
    "meaning": "quảng cáo",
    "example": "The team discussed the advertisement during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"quảng cáo\" trong cuộc họp.",
    "translations": {
      "vi": "quảng cáo"
    }
  },
  {
    "id": "mkt-55",
    "topic": "Marketing",
    "word": "aim",
    "phonetic": "/ˈeɪm/",
    "pos": "verb",
    "meaning": "nhắmt ới, có mục đích",
    "example": "The team plans to aim before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"nhắmt ới, có mục đích\" trước thời hạn.",
    "translations": {
      "vi": "nhắmt ới, có mục đích"
    }
  },
  {
    "id": "mkt-56",
    "topic": "Marketing",
    "word": "introduce",
    "phonetic": "/ˌɪntɹədjˈuːs/",
    "pos": "verb",
    "meaning": "giới thiệu, đưara",
    "example": "The team plans to introduce before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"giới thiệu, đưara\" trước thời hạn.",
    "translations": {
      "vi": "giới thiệu, đưara"
    }
  },
  {
    "id": "mkt-57",
    "topic": "Marketing",
    "word": "absence",
    "phonetic": "/ˈæbsəns/",
    "pos": "noun",
    "meaning": "sựv ắng mặt, nghỉ; sự thiếu, khôngcó",
    "example": "The team discussed the absence during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sựv ắng mặt, nghỉ; sự thiếu, khôngcó\" trong cuộc họp.",
    "translations": {
      "vi": "sựv ắng mặt, nghỉ; sự thiếu, khôngcó"
    }
  },
  {
    "id": "mkt-58",
    "topic": "Marketing",
    "word": "forward",
    "phonetic": "/fˈɔːwəd/",
    "pos": "adv",
    "meaning": "về phía trước; tiến bộ",
    "example": "The team completed the task forward.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"về phía trước; tiến bộ\".",
    "translations": {
      "vi": "về phía trước; tiến bộ"
    }
  },
  {
    "id": "mkt-59",
    "topic": "Marketing",
    "word": "contemporary",
    "phonetic": "/kəntˈɛmpəɹəɹi/",
    "pos": "adj",
    "meaning": "đương thời, hiện đại",
    "example": "The manager described the proposal as contemporary.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"đương thời, hiện đại\".",
    "translations": {
      "vi": "đương thời, hiện đại"
    }
  },
  {
    "id": "mkt-60",
    "topic": "Marketing",
    "word": "discussion",
    "phonetic": "/dɪskˈʌʃən/",
    "pos": "noun",
    "meaning": "sự thảo luận, sự tr anh luận",
    "example": "The team discussed the discussion during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự thảo luận, sự tr anh luận\" trong cuộc họp.",
    "translations": {
      "vi": "sự thảo luận, sự tr anh luận"
    }
  },
  {
    "id": "mkt-61",
    "topic": "Marketing",
    "word": "initial",
    "phonetic": "/ɪnˈɪʃəl/",
    "pos": "adj",
    "meaning": "ban đầu, lúc đầu",
    "example": "The manager described the proposal as initial.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"ban đầu, lúc đầu\".",
    "translations": {
      "vi": "ban đầu, lúc đầu"
    }
  },
  {
    "id": "mkt-62",
    "topic": "Marketing",
    "word": "resolve",
    "phonetic": "/ɹiˈzɑɫv/",
    "pos": "verb",
    "meaning": "giải quyế t, kiên quy ết",
    "example": "The team plans to resolve before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"giải quyế t, kiên quy ết\" trước thời hạn.",
    "translations": {
      "vi": "giải quyế t, kiên quy ết"
    }
  },
  {
    "id": "mkt-63",
    "topic": "Marketing",
    "word": "disregard",
    "phonetic": "/dˌɪsɹɪɡˈɑːd/",
    "pos": "verb",
    "meaning": "xem nhẹ, không đếm xỉa đến",
    "example": "The team plans to disregard before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"xem nhẹ, không đếm xỉa đến\" trước thời hạn.",
    "translations": {
      "vi": "xem nhẹ, không đếm xỉa đến"
    }
  },
  {
    "id": "eco-01",
    "topic": "Economy",
    "word": "dramatically",
    "phonetic": "/dɹəmˈætɪkli/",
    "pos": "adv",
    "meaning": "đột ngột, đáng kể",
    "example": "The team completed the task dramatically.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"đột ngột, đáng kể\".",
    "translations": {
      "vi": "đột ngột, đáng kể"
    }
  },
  {
    "id": "eco-02",
    "topic": "Economy",
    "word": "unstable",
    "phonetic": "/ʌnstˈeɪbəl/",
    "pos": "adj",
    "meaning": "không ổn định, không bền vững",
    "example": "The manager described the proposal as unstable.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"không ổn định, không bền vững\".",
    "translations": {
      "vi": "không ổn định, không bền vững"
    }
  },
  {
    "id": "eco-03",
    "topic": "Economy",
    "word": "rapidly",
    "phonetic": "/ɹˈæpɪdli/",
    "pos": "adv",
    "meaning": "nhanh chóng, mau lẹ",
    "example": "The team completed the task rapidly.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"nhanh chóng, mau lẹ\".",
    "translations": {
      "vi": "nhanh chóng, mau lẹ"
    }
  },
  {
    "id": "eco-04",
    "topic": "Economy",
    "word": "assert",
    "phonetic": "/ɐsˈɜːt/",
    "pos": "verb",
    "meaning": "khẳng định, quả quyết, đòi",
    "example": "The team plans to assert before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"khẳng định, quả quyết, đòi\" trước thời hạn.",
    "translations": {
      "vi": "khẳng định, quả quyết, đòi"
    }
  },
  {
    "id": "eco-05",
    "topic": "Economy",
    "word": "potential",
    "phonetic": "/pətˈɛnʃəl/",
    "pos": "adj",
    "meaning": "tiềm năng, có khả năng",
    "example": "The manager described the proposal as potential.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"tiềm năng, có khả năng\".",
    "translations": {
      "vi": "tiềm năng, có khả năng"
    }
  },
  {
    "id": "eco-06",
    "topic": "Economy",
    "word": "pleased",
    "phonetic": "/plˈiːzd/",
    "pos": "adj",
    "meaning": "hài lòng, vui",
    "example": "The manager described the proposal as pleased.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"hài lòng, vui\".",
    "translations": {
      "vi": "hài lòng, vui"
    }
  },
  {
    "id": "eco-07",
    "topic": "Economy",
    "word": "remain",
    "phonetic": "/ɹɪmˈeɪn/",
    "pos": "verb",
    "meaning": "giữ nguy ên,v ẫn, còn nhưcũ",
    "example": "The team plans to remain before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"giữ nguy ên,v ẫn, còn nhưcũ\" trước thời hạn.",
    "translations": {
      "vi": "giữ nguy ên,v ẫn, còn nhưcũ"
    }
  },
  {
    "id": "eco-08",
    "topic": "Economy",
    "word": "limited",
    "phonetic": "/lˈɪmɪtɪd/",
    "pos": "adj",
    "meaning": "bị giới hạn, hạn chế",
    "example": "The manager described the proposal as limited.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"bị giới hạn, hạn chế\".",
    "translations": {
      "vi": "bị giới hạn, hạn chế"
    }
  },
  {
    "id": "eco-09",
    "topic": "Economy",
    "word": "particular",
    "phonetic": "/pətˈɪkjʊlɐ/",
    "pos": "adj",
    "meaning": "đặc biệ t, đặc thù, chi tiết",
    "example": "The manager described the proposal as particular.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"đặc biệ t, đặc thù, chi tiết\".",
    "translations": {
      "vi": "đặc biệ t, đặc thù, chi tiết"
    }
  },
  {
    "id": "eco-10",
    "topic": "Economy",
    "word": "evenly",
    "phonetic": "/ˈiːvənli/",
    "pos": "adv",
    "meaning": "công bằng, đều, ngang bằng nhau",
    "example": "The team completed the task evenly.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"công bằng, đều, ngang bằng nhau\".",
    "translations": {
      "vi": "công bằng, đều, ngang bằng nhau"
    }
  },
  {
    "id": "eco-11",
    "topic": "Economy",
    "word": "prospect",
    "phonetic": "/ˈpɹɑspɛkt/",
    "pos": "noun",
    "meaning": "viễn cảnh, triểnv ọng",
    "example": "The team discussed the prospect during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"viễn cảnh, triểnv ọng\" trong cuộc họp.",
    "translations": {
      "vi": "viễn cảnh, triểnv ọng"
    }
  },
  {
    "id": "eco-12",
    "topic": "Economy",
    "word": "period",
    "phonetic": "/pˈiəɹɪəd/",
    "pos": "noun",
    "meaning": "thời kỳ, giai đoạn, khoảng thời gian",
    "example": "The team discussed the period during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"thời kỳ, giai đoạn, khoảng thời gian\" trong cuộc họp.",
    "translations": {
      "vi": "thời kỳ, giai đoạn, khoảng thời gian"
    }
  },
  {
    "id": "eco-13",
    "topic": "Economy",
    "word": "industry",
    "phonetic": "/ˈɪndʌstɹˌi/",
    "pos": "noun",
    "meaning": "công nghiệp, ngành, nghề",
    "example": "The team discussed the industry during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"công nghiệp, ngành, nghề\" trong cuộc họp.",
    "translations": {
      "vi": "công nghiệp, ngành, nghề"
    }
  },
  {
    "id": "eco-14",
    "topic": "Economy",
    "word": "likely",
    "phonetic": "/lˈaɪkli/",
    "pos": "adv",
    "meaning": "có khả năng, có thểx ảyra",
    "example": "The team completed the task likely.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"có khả năng, có thểx ảyra\".",
    "translations": {
      "vi": "có khả năng, có thểx ảyra"
    }
  },
  {
    "id": "eco-15",
    "topic": "Economy",
    "word": "director",
    "phonetic": "/daɪɹˈɛktɐ/",
    "pos": "noun",
    "meaning": "giám đốc, người chỉ đạo",
    "example": "The team discussed the director during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"giám đốc, người chỉ đạo\" trong cuộc họp.",
    "translations": {
      "vi": "giám đốc, người chỉ đạo"
    }
  },
  {
    "id": "eco-16",
    "topic": "Economy",
    "word": "substitute",
    "phonetic": "/sˈʌbstɪtjˌuːt/",
    "pos": "noun",
    "meaning": "ngườiv ật thay thế",
    "example": "The team discussed the substitute during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"ngườiv ật thay thế\" trong cuộc họp.",
    "translations": {
      "vi": "ngườiv ật thay thế"
    }
  },
  {
    "id": "eco-17",
    "topic": "Economy",
    "word": "fairly",
    "phonetic": "/fˈeəli/",
    "pos": "adv",
    "meaning": "công bằng, ngay thẳng, kha khá",
    "example": "The team completed the task fairly.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"công bằng, ngay thẳng, kha khá\".",
    "translations": {
      "vi": "công bằng, ngay thẳng, kha khá"
    }
  },
  {
    "id": "eco-18",
    "topic": "Economy",
    "word": "economical",
    "phonetic": "/ˌiːkənˈɒmɪkəl/",
    "pos": "adj",
    "meaning": "tiết kiệm, kinhtế",
    "example": "The manager described the proposal as economical.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"tiết kiệm, kinhtế\".",
    "translations": {
      "vi": "tiết kiệm, kinhtế"
    }
  },
  {
    "id": "eco-19",
    "topic": "Economy",
    "word": "implication",
    "phonetic": "/ˌɪmplɪkˈeɪʃən/",
    "pos": "noun",
    "meaning": "sự liên quan, sự dính líu, hàmý",
    "example": "The team discussed the implication during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự liên quan, sự dính líu, hàmý\" trong cuộc họp.",
    "translations": {
      "vi": "sự liên quan, sự dính líu, hàmý"
    }
  },
  {
    "id": "eco-20",
    "topic": "Economy",
    "word": "prosperity",
    "phonetic": "/pɹəspˈɛɹɪti/",
    "pos": "noun",
    "meaning": "sự hưng thịnh, sự phát đạt",
    "example": "The team discussed the prosperity during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự hưng thịnh, sự phát đạt\" trong cuộc họp.",
    "translations": {
      "vi": "sự hưng thịnh, sự phát đạt"
    }
  },
  {
    "id": "eco-21",
    "topic": "Economy",
    "word": "promising",
    "phonetic": "/pɹˈɒmɪsɪŋ/",
    "pos": "adj",
    "meaning": "đầy hứa hẹn, nhiều triểnv ọng",
    "example": "The manager described the proposal as promising.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"đầy hứa hẹn, nhiều triểnv ọng\".",
    "translations": {
      "vi": "đầy hứa hẹn, nhiều triểnv ọng"
    }
  },
  {
    "id": "eco-22",
    "topic": "Economy",
    "word": "stagnant",
    "phonetic": "/stˈæɡnənt/",
    "pos": "adj",
    "meaning": "trì tr ệ, uể oải, lờ đờ",
    "example": "The manager described the proposal as stagnant.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"trì tr ệ, uể oải, lờ đờ\".",
    "translations": {
      "vi": "trì tr ệ, uể oải, lờ đờ"
    }
  },
  {
    "id": "eco-23",
    "topic": "Economy",
    "word": "soar",
    "phonetic": "/sˈɔː/",
    "pos": "verb",
    "meaning": "bay vút lên,t ăng vọt",
    "example": "The team plans to soar before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"bay vút lên,t ăng vọt\" trước thời hạn.",
    "translations": {
      "vi": "bay vút lên,t ăng vọt"
    }
  },
  {
    "id": "eco-24",
    "topic": "Economy",
    "word": "boost",
    "phonetic": "/bˈuːst/",
    "pos": "verb",
    "meaning": "nâng lên, thúc đẩy",
    "example": "The team plans to boost before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"nâng lên, thúc đẩy\" trước thời hạn.",
    "translations": {
      "vi": "nâng lên, thúc đẩy"
    }
  },
  {
    "id": "eco-25",
    "topic": "Economy",
    "word": "costly",
    "phonetic": "/kˈɒstli/",
    "pos": "adv",
    "meaning": "tốnk ém, đắt tiền",
    "example": "The team completed the task costly.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"tốnk ém, đắt tiền\".",
    "translations": {
      "vi": "tốnk ém, đắt tiền"
    }
  },
  {
    "id": "eco-26",
    "topic": "Economy",
    "word": "drastic",
    "phonetic": "/dɹˈɑːstɪk/",
    "pos": "adj",
    "meaning": "mạnh mẽ, quyết liệt",
    "example": "The manager described the proposal as drastic.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"mạnh mẽ, quyết liệt\".",
    "translations": {
      "vi": "mạnh mẽ, quyết liệt"
    }
  },
  {
    "id": "eco-27",
    "topic": "Economy",
    "word": "evidence",
    "phonetic": "/ˈɛvɪdəns/",
    "pos": "noun",
    "meaning": "bằng chứng, dấu hiệu",
    "example": "The team discussed the evidence during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"bằng chứng, dấu hiệu\" trong cuộc họp.",
    "translations": {
      "vi": "bằng chứng, dấu hiệu"
    }
  },
  {
    "id": "eco-28",
    "topic": "Economy",
    "word": "fall",
    "phonetic": "/fˈɔːl/",
    "pos": "verb",
    "meaning": "giảm xuống (giá cả, giá trị)",
    "example": "The team plans to fall before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"giảm xuống (giá cả, giá trị)\" trước thời hạn.",
    "translations": {
      "vi": "giảm xuống (giá cả, giá trị)"
    }
  },
  {
    "id": "eco-29",
    "topic": "Economy",
    "word": "indicator",
    "phonetic": "/ˈɪndɪkˌeɪtɐ/",
    "pos": "noun",
    "meaning": "chỉ số",
    "example": "The team discussed the indicator during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"chỉ số\" trong cuộc họp.",
    "translations": {
      "vi": "chỉ số"
    }
  },
  {
    "id": "eco-30",
    "topic": "Economy",
    "word": "consequence",
    "phonetic": "/kˈɒnsɪkwəns/",
    "pos": "noun",
    "meaning": "hậu quả, hệ quả,kết quả",
    "example": "The team discussed the consequence during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"hậu quả, hệ quả,kết quả\" trong cuộc họp.",
    "translations": {
      "vi": "hậu quả, hệ quả,kết quả"
    }
  },
  {
    "id": "eco-31",
    "topic": "Economy",
    "word": "thrive",
    "phonetic": "/θɹˈaɪv/",
    "pos": "verb",
    "meaning": "phát triển mạnh, phát đạt",
    "example": "The team plans to thrive before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"phát triển mạnh, phát đạt\" trước thời hạn.",
    "translations": {
      "vi": "phát triển mạnh, phát đạt"
    }
  },
  {
    "id": "eco-32",
    "topic": "Economy",
    "word": "depression",
    "phonetic": "/dɪpɹˈɛʃən/",
    "pos": "noun",
    "meaning": "sự sụt giá, tình tr ạng đình trệ",
    "example": "The team discussed the depression during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự sụt giá, tình tr ạng đình trệ\" trong cuộc họp.",
    "translations": {
      "vi": "sự sụt giá, tình tr ạng đình trệ"
    }
  },
  {
    "id": "eco-33",
    "topic": "Economy",
    "word": "dwindle",
    "phonetic": "/dwˈɪndəl/",
    "pos": "verb",
    "meaning": "thu nhỏ lại, giảm",
    "example": "The team plans to dwindle before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"thu nhỏ lại, giảm\" trước thời hạn.",
    "translations": {
      "vi": "thu nhỏ lại, giảm"
    }
  },
  {
    "id": "eco-34",
    "topic": "Economy",
    "word": "impede",
    "phonetic": "/ɪmpˈiːd/",
    "pos": "verb",
    "meaning": "cản tr ở, ngăn cản",
    "example": "The team plans to impede before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"cản tr ở, ngăn cản\" trước thời hạn.",
    "translations": {
      "vi": "cản tr ở, ngăn cản"
    }
  },
  {
    "id": "eco-35",
    "topic": "Economy",
    "word": "adversity",
    "phonetic": "/ædvˈəsɪti/",
    "pos": "noun",
    "meaning": "sự bất lợi, nghịch cảnh",
    "example": "The team discussed the adversity during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự bất lợi, nghịch cảnh\" trong cuộc họp.",
    "translations": {
      "vi": "sự bất lợi, nghịch cảnh"
    }
  },
  {
    "id": "sho-01",
    "topic": "Shopping",
    "word": "exactly",
    "phonetic": "/ɛɡzˈæktli/",
    "pos": "adv",
    "meaning": "chính xác, đúng",
    "example": "The team completed the task exactly.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"chính xác, đúng\".",
    "translations": {
      "vi": "chính xác, đúng"
    }
  },
  {
    "id": "sho-02",
    "topic": "Shopping",
    "word": "charge",
    "phonetic": "/ˈtʃɑɹdʒ/",
    "pos": "noun",
    "meaning": "tiền phải trả, phí; nhiệm vụ, trách nhiệm",
    "example": "The team discussed the charge during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"tiền phải trả, phí; nhiệm vụ, trách nhiệm\" trong cuộc họp.",
    "translations": {
      "vi": "tiền phải trả, phí; nhiệm vụ, trách nhiệm"
    }
  },
  {
    "id": "sho-03",
    "topic": "Shopping",
    "word": "experienced",
    "phonetic": "/ɛkspˈiəɹɪənst/",
    "pos": "adj",
    "meaning": "có kinh nghiệm, lão luy ện",
    "example": "The manager described the proposal as experienced.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"có kinh nghiệm, lão luy ện\".",
    "translations": {
      "vi": "có kinh nghiệm, lão luy ện"
    }
  },
  {
    "id": "sho-04",
    "topic": "Shopping",
    "word": "instruction",
    "phonetic": "/ɪnstɹˈʌkʃən/",
    "pos": "noun",
    "meaning": "lời chỉ dẫn, hướng dẫn",
    "example": "The team discussed the instruction during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"lời chỉ dẫn, hướng dẫn\" trong cuộc họp.",
    "translations": {
      "vi": "lời chỉ dẫn, hướng dẫn"
    }
  },
  {
    "id": "sho-05",
    "topic": "Shopping",
    "word": "expert",
    "phonetic": "/ˈɛkspɜːt/",
    "pos": "noun",
    "meaning": "chuy ên gia",
    "example": "The team discussed the expert during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"chuy ên gia\" trong cuộc họp.",
    "translations": {
      "vi": "chuy ên gia"
    }
  },
  {
    "id": "sho-06",
    "topic": "Shopping",
    "word": "delivery",
    "phonetic": "/dɪlˈɪvəɹi/",
    "pos": "noun",
    "meaning": "sự giao hàng, sự phân phát",
    "example": "The team discussed the delivery during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự giao hàng, sự phân phát\" trong cuộc họp.",
    "translations": {
      "vi": "sự giao hàng, sự phân phát"
    }
  },
  {
    "id": "sho-07",
    "topic": "Shopping",
    "word": "carefully",
    "phonetic": "/kˈeəfəli/",
    "pos": "adv",
    "meaning": "một cách cẩn thận, thận tr ọng",
    "example": "The team completed the task carefully.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"một cách cẩn thận, thận tr ọng\".",
    "translations": {
      "vi": "một cách cẩn thận, thận tr ọng"
    }
  },
  {
    "id": "sho-08",
    "topic": "Shopping",
    "word": "exclusively",
    "phonetic": "/ɛksklˈuːsɪvli/",
    "pos": "adv",
    "meaning": "riêng, dành riêng",
    "example": "The team completed the task exclusively.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"riêng, dành riêng\".",
    "translations": {
      "vi": "riêng, dành riêng"
    }
  },
  {
    "id": "sho-09",
    "topic": "Shopping",
    "word": "description",
    "phonetic": "/dɪskɹˈɪpʃən/",
    "pos": "noun",
    "meaning": "sự miêut ả, sự môtả",
    "example": "The team discussed the description during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự miêut ả, sự môtả\" trong cuộc họp.",
    "translations": {
      "vi": "sự miêut ả, sự môtả"
    }
  },
  {
    "id": "sho-10",
    "topic": "Shopping",
    "word": "relatively",
    "phonetic": "/ɹˈɛlətˌɪvli/",
    "pos": "adv",
    "meaning": "có liên quan, tương đối, vừa phải",
    "example": "The team completed the task relatively.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"có liên quan, tương đối, vừa phải\".",
    "translations": {
      "vi": "có liên quan, tương đối, vừa phải"
    }
  },
  {
    "id": "sho-11",
    "topic": "Shopping",
    "word": "preparation",
    "phonetic": "/pɹˌɛpəɹˈeɪʃən/",
    "pos": "noun",
    "meaning": "sự chuẩn bị",
    "example": "The team discussed the preparation during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự chuẩn bị\" trong cuộc họp.",
    "translations": {
      "vi": "sự chuẩn bị"
    }
  },
  {
    "id": "sho-12",
    "topic": "Shopping",
    "word": "area",
    "phonetic": "/ˈeəɹiə/",
    "pos": "noun",
    "meaning": "khu vực, vùng, lĩnh vực",
    "example": "The team discussed the area during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"khu vực, vùng, lĩnh vực\" trong cuộc họp.",
    "translations": {
      "vi": "khu vực, vùng, lĩnh vực"
    }
  },
  {
    "id": "sho-13",
    "topic": "Shopping",
    "word": "alter",
    "phonetic": "/ˈɒltɐ/",
    "pos": "verb",
    "meaning": "thay đổi, sửa đổi",
    "example": "The team plans to alter before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"thay đổi, sửa đổi\" trước thời hạn.",
    "translations": {
      "vi": "thay đổi, sửa đổi"
    }
  },
  {
    "id": "sho-14",
    "topic": "Shopping",
    "word": "apply",
    "phonetic": "/əˈpɫaɪ/",
    "pos": "verb",
    "meaning": "nộp đơn, ứng tuy ển, áp dụng",
    "example": "The team plans to apply before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"nộp đơn, ứng tuy ển, áp dụng\" trước thời hạn.",
    "translations": {
      "vi": "nộp đơn, ứng tuy ển, áp dụng"
    }
  },
  {
    "id": "sho-15",
    "topic": "Shopping",
    "word": "mutually",
    "phonetic": "/mjˈuːtʃuːəli/",
    "pos": "adv",
    "meaning": "với nhau, lẫn nhau, qua lại",
    "example": "The team completed the task mutually.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"với nhau, lẫn nhau, qua lại\".",
    "translations": {
      "vi": "với nhau, lẫn nhau, qua lại"
    }
  },
  {
    "id": "sho-16",
    "topic": "Shopping",
    "word": "qualify",
    "phonetic": "/kwˈɒlɪfˌaɪ/",
    "pos": "verb",
    "meaning": "đủ điều kiện, đủ khả năng",
    "example": "The team plans to qualify before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đủ điều kiện, đủ khả năng\" trước thời hạn.",
    "translations": {
      "vi": "đủ điều kiện, đủ khả năng"
    }
  },
  {
    "id": "sho-17",
    "topic": "Shopping",
    "word": "valid",
    "phonetic": "/vˈælɪd/",
    "pos": "adj",
    "meaning": "có hiệu lực, hợp lý, hợp lệ",
    "example": "The manager described the proposal as valid.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"có hiệu lực, hợp lý, hợp lệ\".",
    "translations": {
      "vi": "có hiệu lực, hợp lý, hợp lệ"
    }
  },
  {
    "id": "sho-18",
    "topic": "Shopping",
    "word": "installment",
    "phonetic": "/ɪnstˈɔːlmənt/",
    "pos": "noun",
    "meaning": "sự trả góp",
    "example": "The team discussed the installment during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự trả góp\" trong cuộc họp.",
    "translations": {
      "vi": "sự trả góp"
    }
  },
  {
    "id": "sho-19",
    "topic": "Shopping",
    "word": "auction",
    "phonetic": "/ˈɔːkʃən/",
    "pos": "noun",
    "meaning": "cuộc đấu giá, sự bán đấu giá",
    "example": "The team discussed the auction during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"cuộc đấu giá, sự bán đấu giá\" trong cuộc họp.",
    "translations": {
      "vi": "cuộc đấu giá, sự bán đấu giá"
    }
  },
  {
    "id": "sho-20",
    "topic": "Shopping",
    "word": "authentic",
    "phonetic": "/ɔːθˈɛntɪk/",
    "pos": "adj",
    "meaning": "thật, đích thực, đáng tin",
    "example": "The manager described the proposal as authentic.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"thật, đích thực, đáng tin\".",
    "translations": {
      "vi": "thật, đích thực, đáng tin"
    }
  },
  {
    "id": "sho-21",
    "topic": "Shopping",
    "word": "warranty",
    "phonetic": "/wˈɒɹənti/",
    "pos": "noun",
    "meaning": "giấy bảo hành, sự bảo hành",
    "example": "The team discussed the warranty during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"giấy bảo hành, sự bảo hành\" trong cuộc họp.",
    "translations": {
      "vi": "giấy bảo hành, sự bảo hành"
    }
  },
  {
    "id": "sho-22",
    "topic": "Shopping",
    "word": "receipt",
    "phonetic": "/ɹɪsˈiːt/",
    "pos": "noun",
    "meaning": "biên lai",
    "example": "The team discussed the receipt during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"biên lai\" trong cuộc họp.",
    "translations": {
      "vi": "biên lai"
    }
  },
  {
    "id": "sho-23",
    "topic": "Shopping",
    "word": "spare",
    "phonetic": "/spˈeə/",
    "pos": "verb",
    "meaning": "để dành, miễn cho, không cần đến",
    "example": "The team plans to spare before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"để dành, miễn cho, không cần đến\" trước thời hạn.",
    "translations": {
      "vi": "để dành, miễn cho, không cần đến"
    }
  },
  {
    "id": "sho-24",
    "topic": "Shopping",
    "word": "desire",
    "phonetic": "/dɪzˈaɪə/",
    "pos": "noun",
    "meaning": "niềm mong muốn, khát khao",
    "example": "The team discussed the desire during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"niềm mong muốn, khát khao\" trong cuộc họp.",
    "translations": {
      "vi": "niềm mong muốn, khát khao"
    }
  },
  {
    "id": "sho-25",
    "topic": "Shopping",
    "word": "consumption",
    "phonetic": "/kənsˈʌmpʃən/",
    "pos": "noun",
    "meaning": "sự tiêu thụ, sự tiêu dùng",
    "example": "The team discussed the consumption during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự tiêu thụ, sự tiêu dùng\" trong cuộc họp.",
    "translations": {
      "vi": "sự tiêu thụ, sự tiêu dùng"
    }
  },
  {
    "id": "sho-26",
    "topic": "Shopping",
    "word": "fabric",
    "phonetic": "/fˈæbɹɪk/",
    "pos": "noun",
    "meaning": "vải",
    "example": "The team discussed the fabric during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"vải\" trong cuộc họp.",
    "translations": {
      "vi": "vải"
    }
  },
  {
    "id": "sho-27",
    "topic": "Shopping",
    "word": "research",
    "phonetic": "/ˈɹisɝtʃ/",
    "pos": "noun",
    "meaning": "sự nghiên cứu, điều tra",
    "example": "The team discussed the research during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự nghiên cứu, điều tra\" trong cuộc họp.",
    "translations": {
      "vi": "sự nghiên cứu, điều tra"
    }
  },
  {
    "id": "sho-28",
    "topic": "Shopping",
    "word": "devise",
    "phonetic": "/dɪvˈaɪz/",
    "pos": "verb",
    "meaning": "phát minh,s ángt ạo",
    "example": "The team plans to devise before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"phát minh,s ángt ạo\" trước thời hạn.",
    "translations": {
      "vi": "phát minh,s ángt ạo"
    }
  },
  {
    "id": "sho-29",
    "topic": "Shopping",
    "word": "innovative",
    "phonetic": "/ˈɪnəvˌeɪtɪv/",
    "pos": "adj",
    "meaning": "tân tiến, đổi mới",
    "example": "The manager described the proposal as innovative.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"tân tiến, đổi mới\".",
    "translations": {
      "vi": "tân tiến, đổi mới"
    }
  },
  {
    "id": "pde-01",
    "topic": "Product Development",
    "word": "intend",
    "phonetic": "/ɪntˈɛnd/",
    "pos": "verb",
    "meaning": "định, cóý định",
    "example": "The team plans to intend before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"định, cóý định\" trước thời hạn.",
    "translations": {
      "vi": "định, cóý định"
    }
  },
  {
    "id": "pde-02",
    "topic": "Product Development",
    "word": "allow",
    "phonetic": "/ɐlˈaʊ/",
    "pos": "verb",
    "meaning": "cho phép, phê duyệt, chấp thuận",
    "example": "The team plans to allow before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"cho phép, phê duyệt, chấp thuận\" trước thời hạn.",
    "translations": {
      "vi": "cho phép, phê duyệt, chấp thuận"
    }
  },
  {
    "id": "pde-03",
    "topic": "Product Development",
    "word": "inspect",
    "phonetic": "/ɪnspˈɛkt/",
    "pos": "verb",
    "meaning": "kiểm tra, thanh tra",
    "example": "The team plans to inspect before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"kiểm tra, thanh tra\" trước thời hạn.",
    "translations": {
      "vi": "kiểm tra, thanh tra"
    }
  },
  {
    "id": "pde-04",
    "topic": "Product Development",
    "word": "improve",
    "phonetic": "/ɪmpɹˈuːv/",
    "pos": "verb",
    "meaning": "cải tiến",
    "example": "The team plans to improve before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"cải tiến\" trước thời hạn.",
    "translations": {
      "vi": "cải tiến"
    }
  },
  {
    "id": "pde-05",
    "topic": "Product Development",
    "word": "increasingly",
    "phonetic": "/ɪnkɹˈiːsɪŋli/",
    "pos": "adv",
    "meaning": "tăng dần",
    "example": "The team completed the task increasingly.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"tăng dần\".",
    "translations": {
      "vi": "tăng dần"
    }
  },
  {
    "id": "pde-06",
    "topic": "Product Development",
    "word": "invest",
    "phonetic": "/ɪnvˈɛst/",
    "pos": "verb",
    "meaning": "đầu tư",
    "example": "The team plans to invest before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đầu tư\" trước thời hạn.",
    "translations": {
      "vi": "đầu tư"
    }
  },
  {
    "id": "pde-07",
    "topic": "Product Development",
    "word": "upgrade",
    "phonetic": "/ˈəpˈɡɹeɪd/",
    "pos": "noun",
    "meaning": "sự cải tiến, sự nâng cấp",
    "example": "The team discussed the upgrade during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự cải tiến, sự nâng cấp\" trong cuộc họp.",
    "translations": {
      "vi": "sự cải tiến, sự nâng cấp"
    }
  },
  {
    "id": "pde-08",
    "topic": "Product Development",
    "word": "explore",
    "phonetic": "/ɛksplˈɔː/",
    "pos": "verb",
    "meaning": "thám hiểm, tìmt òi, khám phá",
    "example": "The team plans to explore before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"thám hiểm, tìmt òi, khám phá\" trước thời hạn.",
    "translations": {
      "vi": "thám hiểm, tìmt òi, khám phá"
    }
  },
  {
    "id": "pde-09",
    "topic": "Product Development",
    "word": "appearance",
    "phonetic": "/ɐpˈiəɹəns/",
    "pos": "noun",
    "meaning": "sự xuất hiện,vẻ ngoài, diện mạo",
    "example": "The team discussed the appearance during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự xuất hiện,vẻ ngoài, diện mạo\" trong cuộc họp.",
    "translations": {
      "vi": "sự xuất hiện,vẻ ngoài, diện mạo"
    }
  },
  {
    "id": "pde-10",
    "topic": "Product Development",
    "word": "successful",
    "phonetic": "/səksˈɛsfəl/",
    "pos": "adj",
    "meaning": "thành công, thành đạt",
    "example": "The manager described the proposal as successful.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"thành công, thành đạt\".",
    "translations": {
      "vi": "thành công, thành đạt"
    }
  },
  {
    "id": "pde-11",
    "topic": "Product Development",
    "word": "advance",
    "phonetic": "/ɐdvˈæns/",
    "pos": "noun",
    "meaning": "thành tựu, sự tiến bộ, sự thăng tiến",
    "example": "The team discussed the advance during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"thành tựu, sự tiến bộ, sự thăng tiến\" trong cuộc họp.",
    "translations": {
      "vi": "thành tựu, sự tiến bộ, sự thăng tiến"
    }
  },
  {
    "id": "pde-12",
    "topic": "Product Development",
    "word": "reliable",
    "phonetic": "/ɹɪlˈaɪəbəl/",
    "pos": "adj",
    "meaning": "đáng tin cậy",
    "example": "The manager described the proposal as reliable.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"đáng tin cậy\".",
    "translations": {
      "vi": "đáng tin cậy"
    }
  },
  {
    "id": "pde-13",
    "topic": "Product Development",
    "word": "quality",
    "phonetic": "/kwˈɒlɪti/",
    "pos": "noun",
    "meaning": "chất lượng",
    "example": "The team discussed the quality during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"chất lượng\" trong cuộc họp.",
    "translations": {
      "vi": "chất lượng"
    }
  },
  {
    "id": "pde-14",
    "topic": "Product Development",
    "word": "development",
    "phonetic": "/dɪvˈɛləpmənt/",
    "pos": "noun",
    "meaning": "sự phát triển, sự tiến triển",
    "example": "The team discussed the development during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự phát triển, sự tiến triển\" trong cuộc họp.",
    "translations": {
      "vi": "sự phát triển, sự tiến triển"
    }
  },
  {
    "id": "pde-15",
    "topic": "Product Development",
    "word": "update",
    "phonetic": "/ˈəpˌdeɪt/",
    "pos": "noun",
    "meaning": "sự cập nhật, sự nâng cấp",
    "example": "The team discussed the update during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự cập nhật, sự nâng cấp\" trong cuộc họp.",
    "translations": {
      "vi": "sự cập nhật, sự nâng cấp"
    }
  },
  {
    "id": "pde-16",
    "topic": "Product Development",
    "word": "accurate",
    "phonetic": "/ˈækjʊɹət/",
    "pos": "adj",
    "meaning": "đúng, chínhx ác",
    "example": "The manager described the proposal as accurate.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"đúng, chínhx ác\".",
    "translations": {
      "vi": "đúng, chínhx ác"
    }
  },
  {
    "id": "pde-17",
    "topic": "Product Development",
    "word": "complicated",
    "phonetic": "/kˈɒmplɪkˌeɪtɪd/",
    "pos": "adj",
    "meaning": "phứct ạp,r ắcr ối",
    "example": "The manager described the proposal as complicated.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"phứct ạp,r ắcr ối\".",
    "translations": {
      "vi": "phứct ạp,r ắcr ối"
    }
  },
  {
    "id": "pde-18",
    "topic": "Product Development",
    "word": "indication",
    "phonetic": "/ˌɪndɪkˈeɪʃən/",
    "pos": "noun",
    "meaning": "biểu hiện, dấu hiệu",
    "example": "The team discussed the indication during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"biểu hiện, dấu hiệu\" trong cuộc họp.",
    "translations": {
      "vi": "biểu hiện, dấu hiệu"
    }
  },
  {
    "id": "pde-19",
    "topic": "Product Development",
    "word": "compatible",
    "phonetic": "/kəmpˈætəbəl/",
    "pos": "adj",
    "meaning": "tương thích, thích hợp",
    "example": "The manager described the proposal as compatible.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"tương thích, thích hợp\".",
    "translations": {
      "vi": "tương thích, thích hợp"
    }
  },
  {
    "id": "pde-20",
    "topic": "Product Development",
    "word": "superior",
    "phonetic": "/suːpˈiəɹɪɐ/",
    "pos": "adj",
    "meaning": "cao, cao cấp, tốt hơn",
    "example": "The manager described the proposal as superior.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"cao, cao cấp, tốt hơn\".",
    "translations": {
      "vi": "cao, cao cấp, tốt hơn"
    }
  },
  {
    "id": "pde-21",
    "topic": "Product Development",
    "word": "absolute",
    "phonetic": "/ˈæbsəlˌuːt/",
    "pos": "adj",
    "meaning": "tuyệt đối, hoànt oàn, thuần tuý",
    "example": "The manager described the proposal as absolute.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"tuyệt đối, hoànt oàn, thuần tuý\".",
    "translations": {
      "vi": "tuyệt đối, hoànt oàn, thuần tuý"
    }
  },
  {
    "id": "pde-22",
    "topic": "Product Development",
    "word": "broaden",
    "phonetic": "/bɹˈɔːdən/",
    "pos": "verb",
    "meaning": "mởr ộng",
    "example": "The team plans to broaden before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"mởr ộng\" trước thời hạn.",
    "translations": {
      "vi": "mởr ộng"
    }
  },
  {
    "id": "pde-23",
    "topic": "Product Development",
    "word": "corrosion",
    "phonetic": "/kəɹˈəʊʒən/",
    "pos": "noun",
    "meaning": "sự ăn mòn",
    "example": "The team discussed the corrosion during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự ăn mòn\" trong cuộc họp.",
    "translations": {
      "vi": "sự ăn mòn"
    }
  },
  {
    "id": "pde-24",
    "topic": "Product Development",
    "word": "feature",
    "phonetic": "/fˈiːtʃɐ/",
    "pos": "noun",
    "meaning": "đặc điểm, tính năng",
    "example": "The team discussed the feature during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"đặc điểm, tính năng\" trong cuộc họp.",
    "translations": {
      "vi": "đặc điểm, tính năng"
    }
  },
  {
    "id": "pde-25",
    "topic": "Product Development",
    "word": "inspiration",
    "phonetic": "/ˌɪnspəɹˈeɪʃən/",
    "pos": "noun",
    "meaning": "cảm hứng, nguồn cảm hứng",
    "example": "The team discussed the inspiration during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"cảm hứng, nguồn cảm hứng\" trong cuộc họp.",
    "translations": {
      "vi": "cảm hứng, nguồn cảm hứng"
    }
  },
  {
    "id": "pde-26",
    "topic": "Product Development",
    "word": "patent",
    "phonetic": "/ˈpætənt/",
    "pos": "noun",
    "meaning": "bằngs áng chế, giấy đăngký",
    "example": "The team discussed the patent during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"bằngs áng chế, giấy đăngký\" trong cuộc họp.",
    "translations": {
      "vi": "bằngs áng chế, giấy đăngký"
    }
  },
  {
    "id": "pde-27",
    "topic": "Product Development",
    "word": "envision",
    "phonetic": "/ɛnvˈɪʒən/",
    "pos": "verb",
    "meaning": "hình dung, mường tượng",
    "example": "The team plans to envision before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"hình dung, mường tượng\" trước thời hạn.",
    "translations": {
      "vi": "hình dung, mường tượng"
    }
  },
  {
    "id": "pde-28",
    "topic": "Product Development",
    "word": "grant",
    "phonetic": "/ɡɹˈɑːnt/",
    "pos": "verb",
    "meaning": "ban, cấp, thừa nhận, công nhận",
    "example": "The team plans to grant before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"ban, cấp, thừa nhận, công nhận\" trước thời hạn.",
    "translations": {
      "vi": "ban, cấp, thừa nhận, công nhận"
    }
  },
  {
    "id": "pde-29",
    "topic": "Product Development",
    "word": "various",
    "phonetic": "/vˈeəɹɪəs/",
    "pos": "adj",
    "meaning": "nhiều, đa dạng, khác nhau",
    "example": "The manager described the proposal as various.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"nhiều, đa dạng, khác nhau\".",
    "translations": {
      "vi": "nhiều, đa dạng, khác nhau"
    }
  },
  {
    "id": "pde-30",
    "topic": "Product Development",
    "word": "manual",
    "phonetic": "/mˈænjuːəl/",
    "pos": "noun",
    "meaning": "sổ tay, sách hướng dẫn",
    "example": "The team discussed the manual during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sổ tay, sách hướng dẫn\" trong cuộc họp.",
    "translations": {
      "vi": "sổ tay, sách hướng dẫn"
    }
  },
  {
    "id": "pde-31",
    "topic": "Product Development",
    "word": "automate",
    "phonetic": "/ˈɔːtəmˌeɪt/",
    "pos": "verb",
    "meaning": "tự động hoá",
    "example": "The team plans to automate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"tự động hoá\" trước thời hạn.",
    "translations": {
      "vi": "tự động hoá"
    }
  },
  {
    "id": "pde-32",
    "topic": "Product Development",
    "word": "properly",
    "phonetic": "/pɹˈɒpəli/",
    "pos": "adv",
    "meaning": "đúng đắn, thích đáng, hợp lệ",
    "example": "The team completed the task properly.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"đúng đắn, thích đáng, hợp lệ\".",
    "translations": {
      "vi": "đúng đắn, thích đáng, hợp lệ"
    }
  },
  {
    "id": "pde-33",
    "topic": "Product Development",
    "word": "safety",
    "phonetic": "/sˈeɪfti/",
    "pos": "noun",
    "meaning": "sự an toàn, tính an toàn",
    "example": "The team discussed the safety during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự an toàn, tính an toàn\" trong cuộc họp.",
    "translations": {
      "vi": "sự an toàn, tính an toàn"
    }
  },
  {
    "id": "pde-34",
    "topic": "Product Development",
    "word": "precaution",
    "phonetic": "/pɹɪkˈɔːʃən/",
    "pos": "noun",
    "meaning": "sự phòng ngừa, sự đề phòng",
    "example": "The team discussed the precaution during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự phòng ngừa, sự đề phòng\" trong cuộc họp.",
    "translations": {
      "vi": "sự phòng ngừa, sự đề phòng"
    }
  },
  {
    "id": "pde-35",
    "topic": "Product Development",
    "word": "processing",
    "phonetic": "/ˈpɹɑsɛsɪŋ/",
    "pos": "noun",
    "meaning": "sự chế biến, sự gia công",
    "example": "The team discussed the processing during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự chế biến, sự gia công\" trong cuộc họp.",
    "translations": {
      "vi": "sự chế biến, sự gia công"
    }
  },
  {
    "id": "pmf-01",
    "topic": "Product Manufacture",
    "word": "capacity",
    "phonetic": "/kəpˈæsɪti/",
    "pos": "noun",
    "meaning": "sức chứa, năng lực, tư cách",
    "example": "The team discussed the capacity during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sức chứa, năng lực, tư cách\" trong cuộc họp.",
    "translations": {
      "vi": "sức chứa, năng lực, tư cách"
    }
  },
  {
    "id": "pmf-02",
    "topic": "Product Manufacture",
    "word": "utilize",
    "phonetic": "/ˈjutəˌɫaɪz/",
    "pos": "verb",
    "meaning": "dùng, sử dụng,t ận dụng, khai thác",
    "example": "The team plans to utilize before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"dùng, sử dụng,t ận dụng, khai thác\" trước thời hạn.",
    "translations": {
      "vi": "dùng, sử dụng,t ận dụng, khai thác"
    }
  },
  {
    "id": "pmf-03",
    "topic": "Product Manufacture",
    "word": "place",
    "phonetic": "/plˈeɪs/",
    "pos": "verb",
    "meaning": "đặt, để, sắp xếp; đặt (hàng)",
    "example": "The team plans to place before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đặt, để, sắp xếp; đặt (hàng)\" trước thời hạn.",
    "translations": {
      "vi": "đặt, để, sắp xếp; đặt (hàng)"
    }
  },
  {
    "id": "pmf-04",
    "topic": "Product Manufacture",
    "word": "renovate",
    "phonetic": "/ɹˈɛnəvˌeɪt/",
    "pos": "verb",
    "meaning": "nâng cấp, cảit ạo (nhà cửa, nội thất)",
    "example": "The team plans to renovate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"nâng cấp, cảit ạo (nhà cửa, nội thất)\" trước thời hạn.",
    "translations": {
      "vi": "nâng cấp, cảit ạo (nhà cửa, nội thất)"
    }
  },
  {
    "id": "pmf-05",
    "topic": "Product Manufacture",
    "word": "decision",
    "phonetic": "/dɪsˈɪʒən/",
    "pos": "noun",
    "meaning": "quyết định",
    "example": "The team discussed the decision during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"quyết định\" trong cuộc họp.",
    "translations": {
      "vi": "quyết định"
    }
  },
  {
    "id": "pmf-06",
    "topic": "Product Manufacture",
    "word": "material",
    "phonetic": "/mətˈiəɹɪəl/",
    "pos": "noun",
    "meaning": "chất liệu,t ài liệu, nguyên liệu",
    "example": "The team discussed the material during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"chất liệu,t ài liệu, nguyên liệu\" trong cuộc họp.",
    "translations": {
      "vi": "chất liệu,t ài liệu, nguyên liệu"
    }
  },
  {
    "id": "pmf-07",
    "topic": "Product Manufacture",
    "word": "success",
    "phonetic": "/səksˈɛs/",
    "pos": "noun",
    "meaning": "sự thành công, thắng lợi",
    "example": "The team discussed the success during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự thành công, thắng lợi\" trong cuộc họp.",
    "translations": {
      "vi": "sự thành công, thắng lợi"
    }
  },
  {
    "id": "pmf-08",
    "topic": "Product Manufacture",
    "word": "attribute",
    "phonetic": "/ˈætɹəbˌjut/",
    "pos": "verb",
    "meaning": "quy cho, gán cho",
    "example": "The team plans to attribute before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"quy cho, gán cho\" trước thời hạn.",
    "translations": {
      "vi": "quy cho, gán cho"
    }
  },
  {
    "id": "pmf-09",
    "topic": "Product Manufacture",
    "word": "limit",
    "phonetic": "/lˈɪmɪt/",
    "pos": "adj",
    "meaning": "giới hạn,r anh giới",
    "example": "The manager described the proposal as limit.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"giới hạn,r anh giới\".",
    "translations": {
      "vi": "giới hạn,r anh giới"
    }
  },
  {
    "id": "pmf-10",
    "topic": "Product Manufacture",
    "word": "component",
    "phonetic": "/kəmpˈəʊnənt/",
    "pos": "noun",
    "meaning": "thành phần, bộ phận",
    "example": "The team discussed the component during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"thành phần, bộ phận\" trong cuộc họp.",
    "translations": {
      "vi": "thành phần, bộ phận"
    }
  },
  {
    "id": "pmf-11",
    "topic": "Product Manufacture",
    "word": "capable",
    "phonetic": "/kˈeɪpəbəl/",
    "pos": "adj",
    "meaning": "có khả năng, có năng lực",
    "example": "The manager described the proposal as capable.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"có khả năng, có năng lực\".",
    "translations": {
      "vi": "có khả năng, có năng lực"
    }
  },
  {
    "id": "pmf-12",
    "topic": "Product Manufacture",
    "word": "comparable",
    "phonetic": "/kˈɒmpəɹəbəl/",
    "pos": "adj",
    "meaning": "có thểsos ánh",
    "example": "The manager described the proposal as comparable.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"có thểsos ánh\".",
    "translations": {
      "vi": "có thểsos ánh"
    }
  },
  {
    "id": "pmf-13",
    "topic": "Product Manufacture",
    "word": "produce",
    "phonetic": "/ˈpɹoʊdus/",
    "pos": "verb",
    "meaning": "sản xuất, chế tạo",
    "example": "The team plans to produce before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"sản xuất, chế tạo\" trước thời hạn.",
    "translations": {
      "vi": "sản xuất, chế tạo"
    }
  },
  {
    "id": "pmf-14",
    "topic": "Product Manufacture",
    "word": "respectively",
    "phonetic": "/ɹɪspˈɛktɪvli/",
    "pos": "adv",
    "meaning": "riêng từng cái, tương ứng",
    "example": "The team completed the task respectively.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"riêng từng cái, tương ứng\".",
    "translations": {
      "vi": "riêng từng cái, tương ứng"
    }
  },
  {
    "id": "pmf-15",
    "topic": "Product Manufacture",
    "word": "separately",
    "phonetic": "/sˈɛpɹətli/",
    "pos": "adv",
    "meaning": "tách biệt, riêng rẽ, khác nhau",
    "example": "The team completed the task separately.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"tách biệt, riêng rẽ, khác nhau\".",
    "translations": {
      "vi": "tách biệt, riêng rẽ, khác nhau"
    }
  },
  {
    "id": "pmf-16",
    "topic": "Product Manufacture",
    "word": "damaged",
    "phonetic": "/dˈæmɪdʒd/",
    "pos": "adj",
    "meaning": "bị phá huỷ, bị hư hại, hỏng",
    "example": "The manager described the proposal as damaged.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"bị phá huỷ, bị hư hại, hỏng\".",
    "translations": {
      "vi": "bị phá huỷ, bị hư hại, hỏng"
    }
  },
  {
    "id": "pmf-17",
    "topic": "Product Manufacture",
    "word": "prevent",
    "phonetic": "/pɹɪvˈɛnt/",
    "pos": "verb",
    "meaning": "ngăn chặn, ngăn ngừa",
    "example": "The team plans to prevent before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"ngăn chặn, ngăn ngừa\" trước thời hạn.",
    "translations": {
      "vi": "ngăn chặn, ngăn ngừa"
    }
  },
  {
    "id": "pmf-18",
    "topic": "Product Manufacture",
    "word": "chemical",
    "phonetic": "/kˈɛmɪkəl/",
    "pos": "noun",
    "meaning": "chất hoá học",
    "example": "The team discussed the chemical during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"chất hoá học\" trong cuộc họp.",
    "translations": {
      "vi": "chất hoá học"
    }
  },
  {
    "id": "pmf-19",
    "topic": "Product Manufacture",
    "word": "equipment",
    "phonetic": "/ɪkwˈɪpmənt/",
    "pos": "noun",
    "meaning": "máy móc, tr ang thiết bị",
    "example": "The team discussed the equipment during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"máy móc, tr ang thiết bị\" trong cuộc họp.",
    "translations": {
      "vi": "máy móc, tr ang thiết bị"
    }
  },
  {
    "id": "pmf-20",
    "topic": "Product Manufacture",
    "word": "operate",
    "phonetic": "/ˈɒpəɹˌeɪt/",
    "pos": "verb",
    "meaning": "vận hành, hoạt động",
    "example": "The team plans to operate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"vận hành, hoạt động\" trước thời hạn.",
    "translations": {
      "vi": "vận hành, hoạt động"
    }
  },
  {
    "id": "pmf-21",
    "topic": "Product Manufacture",
    "word": "assemble",
    "phonetic": "/ɐsˈɛmbəl/",
    "pos": "verb",
    "meaning": "lắp ráp; triệu tập, triệu hồi",
    "example": "The team plans to assemble before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"lắp ráp; triệu tập, triệu hồi\" trước thời hạn.",
    "translations": {
      "vi": "lắp ráp; triệu tập, triệu hồi"
    }
  },
  {
    "id": "pmf-22",
    "topic": "Product Manufacture",
    "word": "manufacturing",
    "phonetic": "/mˌænjuːfˈæktʃəɹɪŋ/",
    "pos": "adj",
    "meaning": "thuộc sản xuất, chế tạo",
    "example": "The manager described the proposal as manufacturing.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"thuộc sản xuất, chế tạo\".",
    "translations": {
      "vi": "thuộc sản xuất, chế tạo"
    }
  },
  {
    "id": "pmf-23",
    "topic": "Product Manufacture",
    "word": "tailored",
    "phonetic": "/tˈeɪləd/",
    "pos": "adj",
    "meaning": "được tuỳ chỉnh, điều chỉnh",
    "example": "The manager described the proposal as tailored.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"được tuỳ chỉnh, điều chỉnh\".",
    "translations": {
      "vi": "được tuỳ chỉnh, điều chỉnh"
    }
  },
  {
    "id": "pmf-24",
    "topic": "Product Manufacture",
    "word": "economize",
    "phonetic": "/iˈkɑnəˌmaɪz/",
    "pos": "verb",
    "meaning": "tiết kiệm",
    "example": "The team plans to economize before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"tiết kiệm\" trước thời hạn.",
    "translations": {
      "vi": "tiết kiệm"
    }
  },
  {
    "id": "pmf-25",
    "topic": "Product Manufacture",
    "word": "device",
    "phonetic": "/dɪvˈaɪs/",
    "pos": "noun",
    "meaning": "máy móc, thiết bị",
    "example": "The team discussed the device during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"máy móc, thiết bị\" trong cuộc họp.",
    "translations": {
      "vi": "máy móc, thiết bị"
    }
  },
  {
    "id": "pmf-26",
    "topic": "Product Manufacture",
    "word": "trim",
    "phonetic": "/tɹˈɪm/",
    "pos": "verb",
    "meaning": "cắt, tỉa, loại bỏ; sắp xếp, thu dọn",
    "example": "The team plans to trim before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"cắt, tỉa, loại bỏ; sắp xếp, thu dọn\" trước thời hạn.",
    "translations": {
      "vi": "cắt, tỉa, loại bỏ; sắp xếp, thu dọn"
    }
  },
  {
    "id": "pmf-27",
    "topic": "Product Manufacture",
    "word": "launch",
    "phonetic": "/lˈɔːntʃ/",
    "pos": "verb",
    "meaning": "ra mắt (sản phẩm mới)",
    "example": "The team plans to launch before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"ra mắt (sản phẩm mới)\" trước thời hạn.",
    "translations": {
      "vi": "ra mắt (sản phẩm mới)"
    }
  },
  {
    "id": "pmf-28",
    "topic": "Product Manufacture",
    "word": "expiration",
    "phonetic": "/ɛkspəɹˈeɪʃən/",
    "pos": "noun",
    "meaning": "sự hết hạn",
    "example": "The team discussed the expiration during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự hết hạn\" trong cuộc họp.",
    "translations": {
      "vi": "sự hết hạn"
    }
  },
  {
    "id": "pmf-29",
    "topic": "Product Manufacture",
    "word": "maneuver",
    "phonetic": "/mənˈuːvɐ/",
    "pos": "verb",
    "meaning": "diễn tập, điều động",
    "example": "The team plans to maneuver before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"diễn tập, điều động\" trước thời hạn.",
    "translations": {
      "vi": "diễn tập, điều động"
    }
  },
  {
    "id": "pmf-30",
    "topic": "Product Manufacture",
    "word": "coming",
    "phonetic": "/kˈʌmɪŋ/",
    "pos": "adj",
    "meaning": "sắpt ới",
    "example": "The manager described the proposal as coming.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"sắpt ới\".",
    "translations": {
      "vi": "sắpt ới"
    }
  },
  {
    "id": "csv-01",
    "topic": "Customer Service",
    "word": "complaint",
    "phonetic": "/kəmplˈeɪnt/",
    "pos": "noun",
    "meaning": "lời than phiền, lời phàn nàn",
    "example": "The team discussed the complaint during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"lời than phiền, lời phàn nàn\" trong cuộc họp.",
    "translations": {
      "vi": "lời than phiền, lời phàn nàn"
    }
  },
  {
    "id": "csv-02",
    "topic": "Customer Service",
    "word": "deal",
    "phonetic": "/dˈiːl/",
    "pos": "verb",
    "meaning": "giải quyế t; buôn bán; phân phối",
    "example": "The team plans to deal before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"giải quyế t; buôn bán; phân phối\" trước thời hạn.",
    "translations": {
      "vi": "giải quyế t; buôn bán; phân phối"
    }
  },
  {
    "id": "csv-03",
    "topic": "Customer Service",
    "word": "argumentative",
    "phonetic": "/ˌɑːɡjuːmˈɛntətˌɪv/",
    "pos": "adj",
    "meaning": "thích tr anh cãi",
    "example": "The manager described the proposal as argumentative.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"thích tr anh cãi\".",
    "translations": {
      "vi": "thích tr anh cãi"
    }
  },
  {
    "id": "csv-04",
    "topic": "Customer Service",
    "word": "appropriately",
    "phonetic": "/ɐpɹˈəʊpɹɪətli/",
    "pos": "adv",
    "meaning": "thích hợp, thích đáng",
    "example": "The team completed the task appropriately.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"thích hợp, thích đáng\".",
    "translations": {
      "vi": "thích hợp, thích đáng"
    }
  },
  {
    "id": "csv-05",
    "topic": "Customer Service",
    "word": "respond",
    "phonetic": "/ɹɪspˈɒnd/",
    "pos": "verb",
    "meaning": "phản ứng, phản hồi, trả lời",
    "example": "The team plans to respond before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"phản ứng, phản hồi, trả lời\" trước thời hạn.",
    "translations": {
      "vi": "phản ứng, phản hồi, trả lời"
    }
  },
  {
    "id": "csv-06",
    "topic": "Customer Service",
    "word": "courteous",
    "phonetic": "/kˈɜːtiəs/",
    "pos": "adj",
    "meaning": "lịch sự, nhã nhặn",
    "example": "The manager described the proposal as courteous.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"lịch sự, nhã nhặn\".",
    "translations": {
      "vi": "lịch sự, nhã nhặn"
    }
  },
  {
    "id": "csv-07",
    "topic": "Customer Service",
    "word": "satisfaction",
    "phonetic": "/sˌætɪsfˈækʃən/",
    "pos": "noun",
    "meaning": "sự hài lòng/thoả mãn",
    "example": "The team discussed the satisfaction during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự hài lòng/thoả mãn\" trong cuộc họp.",
    "translations": {
      "vi": "sự hài lòng/thoả mãn"
    }
  },
  {
    "id": "csv-08",
    "topic": "Customer Service",
    "word": "inconvenience",
    "phonetic": "/ɪnkənvˈiːnɪəns/",
    "pos": "noun",
    "meaning": "sự bất lợi, bất tiện",
    "example": "The team discussed the inconvenience during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự bất lợi, bất tiện\" trong cuộc họp.",
    "translations": {
      "vi": "sự bất lợi, bất tiện"
    }
  },
  {
    "id": "csv-09",
    "topic": "Customer Service",
    "word": "complete",
    "phonetic": "/kəmplˈiːt/",
    "pos": "verb",
    "meaning": "hoàn thiện, hoàn thành",
    "example": "The team plans to complete before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"hoàn thiện, hoàn thành\" trước thời hạn.",
    "translations": {
      "vi": "hoàn thiện, hoàn thành"
    }
  },
  {
    "id": "csv-10",
    "topic": "Customer Service",
    "word": "return",
    "phonetic": "/ɹiˈtɝn/",
    "pos": "verb",
    "meaning": "trở lại, quayvề",
    "example": "The team plans to return before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"trở lại, quayvề\" trước thời hạn.",
    "translations": {
      "vi": "trở lại, quayvề"
    }
  },
  {
    "id": "csv-11",
    "topic": "Customer Service",
    "word": "replace",
    "phonetic": "/ɹɪplˈeɪs/",
    "pos": "verb",
    "meaning": "thay thế, thay chỗ",
    "example": "The team plans to replace before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"thay thế, thay chỗ\" trước thời hạn.",
    "translations": {
      "vi": "thay thế, thay chỗ"
    }
  },
  {
    "id": "csv-12",
    "topic": "Customer Service",
    "word": "evaluation",
    "phonetic": "/ɪvˌæljuːˈeɪʃən/",
    "pos": "noun",
    "meaning": "sự đánh giá, sự ước lượng",
    "example": "The team discussed the evaluation during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự đánh giá, sự ước lượng\" trong cuộc họp.",
    "translations": {
      "vi": "sự đánh giá, sự ước lượng"
    }
  },
  {
    "id": "csv-13",
    "topic": "Customer Service",
    "word": "apologize",
    "phonetic": "/əˈpɑɫəˌdʒaɪz/",
    "pos": "verb",
    "meaning": "xin lỗi",
    "example": "The team plans to apologize before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"xin lỗi\" trước thời hạn.",
    "translations": {
      "vi": "xin lỗi"
    }
  },
  {
    "id": "csv-14",
    "topic": "Customer Service",
    "word": "certain",
    "phonetic": "/sˈɜːtən/",
    "pos": "adj",
    "meaning": "chắc, chắc chắn, nhất định",
    "example": "The manager described the proposal as certain.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"chắc, chắc chắn, nhất định\".",
    "translations": {
      "vi": "chắc, chắc chắn, nhất định"
    }
  },
  {
    "id": "csv-15",
    "topic": "Customer Service",
    "word": "commitment",
    "phonetic": "/kəmˈɪtmənt/",
    "pos": "noun",
    "meaning": "sự camkế t, sựt ậnt âm",
    "example": "The team discussed the commitment during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự camkế t, sựt ậnt âm\" trong cuộc họp.",
    "translations": {
      "vi": "sự camkế t, sựt ậnt âm"
    }
  },
  {
    "id": "csv-16",
    "topic": "Customer Service",
    "word": "biography",
    "phonetic": "/baɪˈɒɡɹəfi/",
    "pos": "noun",
    "meaning": "tiểu sử, lý lịch",
    "example": "The team discussed the biography during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"tiểu sử, lý lịch\" trong cuộc họp.",
    "translations": {
      "vi": "tiểu sử, lý lịch"
    }
  },
  {
    "id": "csv-17",
    "topic": "Customer Service",
    "word": "critical",
    "phonetic": "/kɹˈɪtɪkəl/",
    "pos": "adj",
    "meaning": "phê bình, chỉ trích",
    "example": "The manager described the proposal as critical.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"phê bình, chỉ trích\".",
    "translations": {
      "vi": "phê bình, chỉ trích"
    }
  },
  {
    "id": "csv-18",
    "topic": "Customer Service",
    "word": "combine",
    "phonetic": "/ˈkɑmbaɪn/",
    "pos": "verb",
    "meaning": "kết hợp",
    "example": "The team plans to combine before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"kết hợp\" trước thời hạn.",
    "translations": {
      "vi": "kết hợp"
    }
  },
  {
    "id": "csv-19",
    "topic": "Customer Service",
    "word": "observe",
    "phonetic": "/ɒbzˈɜːv/",
    "pos": "verb",
    "meaning": "quan sát",
    "example": "The team plans to observe before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"quan sát\" trước thời hạn.",
    "translations": {
      "vi": "quan sát"
    }
  },
  {
    "id": "csv-20",
    "topic": "Customer Service",
    "word": "attitude",
    "phonetic": "/ˈætɪtjˌuːd/",
    "pos": "noun",
    "meaning": "thái độ",
    "example": "The team discussed the attitude during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"thái độ\" trong cuộc họp.",
    "translations": {
      "vi": "thái độ"
    }
  },
  {
    "id": "csv-21",
    "topic": "Customer Service",
    "word": "disappoint",
    "phonetic": "/dˌɪsɐpˈɔɪnt/",
    "pos": "verb",
    "meaning": "làm thất vọng",
    "example": "The team plans to disappoint before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"làm thất vọng\" trước thời hạn.",
    "translations": {
      "vi": "làm thất vọng"
    }
  },
  {
    "id": "csv-22",
    "topic": "Customer Service",
    "word": "insert",
    "phonetic": "/ˈɪnˌsɝt/",
    "pos": "verb",
    "meaning": "chèn vào, đưa vào",
    "example": "The team plans to insert before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"chèn vào, đưa vào\" trước thời hạn.",
    "translations": {
      "vi": "chèn vào, đưa vào"
    }
  },
  {
    "id": "csv-23",
    "topic": "Customer Service",
    "word": "disclose",
    "phonetic": "/dɪsklˈəʊz/",
    "pos": "verb",
    "meaning": "phơi bày, vạch trần, để lộ",
    "example": "The team plans to disclose before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"phơi bày, vạch trần, để lộ\" trước thời hạn.",
    "translations": {
      "vi": "phơi bày, vạch trần, để lộ"
    }
  },
  {
    "id": "csv-24",
    "topic": "Customer Service",
    "word": "politely",
    "phonetic": "/pəlˈaɪtli/",
    "pos": "adv",
    "meaning": "lịch sự lễ phép",
    "example": "The team completed the task politely.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"lịch sự lễ phép\".",
    "translations": {
      "vi": "lịch sự lễ phép"
    }
  },
  {
    "id": "csv-25",
    "topic": "Customer Service",
    "word": "seriously",
    "phonetic": "/sˈiəɹɪəsli/",
    "pos": "adv",
    "meaning": "nghiêm túc, nghiêm trọng",
    "example": "The team completed the task seriously.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"nghiêm túc, nghiêm trọng\".",
    "translations": {
      "vi": "nghiêm túc, nghiêm trọng"
    }
  },
  {
    "id": "csv-26",
    "topic": "Customer Service",
    "word": "infuriate",
    "phonetic": "/ɪnfjˈɔːɹɪˌeɪt/",
    "pos": "verb",
    "meaning": "làm tức điên lên",
    "example": "The team plans to infuriate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"làm tức điên lên\" trước thời hạn.",
    "translations": {
      "vi": "làm tức điên lên"
    }
  },
  {
    "id": "csv-27",
    "topic": "Customer Service",
    "word": "cause",
    "phonetic": "/kˈɔːz/",
    "pos": "verb",
    "meaning": "gây ra, tạo ra",
    "example": "The team plans to cause before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"gây ra, tạo ra\" trước thời hạn.",
    "translations": {
      "vi": "gây ra, tạo ra"
    }
  },
  {
    "id": "csv-28",
    "topic": "Customer Service",
    "word": "commentary",
    "phonetic": "/kˈɒməntɹˌi/",
    "pos": "noun",
    "meaning": "bài bình luận, lời chú thích",
    "example": "The team discussed the commentary during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"bài bình luận, lời chú thích\" trong cuộc họp.",
    "translations": {
      "vi": "bài bình luận, lời chú thích"
    }
  },
  {
    "id": "csv-29",
    "topic": "Customer Service",
    "word": "interact",
    "phonetic": "/ˌɪntəɹˈækt/",
    "pos": "verb",
    "meaning": "tương tác, tác động qua lại",
    "example": "The team plans to interact before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"tương tác, tác động qua lại\" trước thời hạn.",
    "translations": {
      "vi": "tương tác, tác động qua lại"
    }
  },
  {
    "id": "csv-30",
    "topic": "Customer Service",
    "word": "applaud",
    "phonetic": "/ɐplˈɔːd/",
    "pos": "verb",
    "meaning": "hoan nghênh, tán thưởng",
    "example": "The team plans to applaud before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"hoan nghênh, tán thưởng\" trước thời hạn.",
    "translations": {
      "vi": "hoan nghênh, tán thưởng"
    }
  },
  {
    "id": "csv-31",
    "topic": "Customer Service",
    "word": "defective",
    "phonetic": "/dɪfˈɛktɪv/",
    "pos": "adj",
    "meaning": "có lỗi, có thiếu sót, nhược điểm",
    "example": "The manager described the proposal as defective.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"có lỗi, có thiếu sót, nhược điểm\".",
    "translations": {
      "vi": "có lỗi, có thiếu sót, nhược điểm"
    }
  },
  {
    "id": "csv-32",
    "topic": "Customer Service",
    "word": "guarantee",
    "phonetic": "/ɡˌæɹɑːntˈiː/",
    "pos": "verb",
    "meaning": "cam đoan, đảm bảo, chắc chắn",
    "example": "The team plans to guarantee before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"cam đoan, đảm bảo, chắc chắn\" trước thời hạn.",
    "translations": {
      "vi": "cam đoan, đảm bảo, chắc chắn"
    }
  },
  {
    "id": "trv-01",
    "topic": "Traveling",
    "word": "international",
    "phonetic": "/ˌɪntənˈæʃənəl/",
    "pos": "adj",
    "meaning": "quốc tế",
    "example": "The manager described the proposal as international.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"quốc tế\".",
    "translations": {
      "vi": "quốc tế"
    }
  },
  {
    "id": "trv-02",
    "topic": "Traveling",
    "word": "diverse",
    "phonetic": "/daɪvˈɜːs/",
    "pos": "adj",
    "meaning": "phong phú, đa dạng, nhiều loại",
    "example": "The manager described the proposal as diverse.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"phong phú, đa dạng, nhiều loại\".",
    "translations": {
      "vi": "phong phú, đa dạng, nhiều loại"
    }
  },
  {
    "id": "trv-03",
    "topic": "Traveling",
    "word": "approximately",
    "phonetic": "/ɐpɹˈɒksɪmətlˌi/",
    "pos": "adv",
    "meaning": "xấp xỉ, khoảng",
    "example": "The team completed the task approximately.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"xấp xỉ, khoảng\".",
    "translations": {
      "vi": "xấp xỉ, khoảng"
    }
  },
  {
    "id": "trv-04",
    "topic": "Traveling",
    "word": "comfortable",
    "phonetic": "/kˈʌmftəbəl/",
    "pos": "adj",
    "meaning": "thoải mái, dễ chịu",
    "example": "The manager described the proposal as comfortable.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"thoải mái, dễ chịu\".",
    "translations": {
      "vi": "thoải mái, dễ chịu"
    }
  },
  {
    "id": "trv-05",
    "topic": "Traveling",
    "word": "specify",
    "phonetic": "/spˈɛsɪfˌaɪ/",
    "pos": "verb",
    "meaning": "làm rõ, ghi rõ",
    "example": "The team plans to specify before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"làm rõ, ghi rõ\" trước thời hạn.",
    "translations": {
      "vi": "làm rõ, ghi rõ"
    }
  },
  {
    "id": "trv-06",
    "topic": "Traveling",
    "word": "tightly",
    "phonetic": "/tˈaɪtli/",
    "pos": "adv",
    "meaning": "chặt, chặt chẽ",
    "example": "The team completed the task tightly.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"chặt, chặt chẽ\".",
    "translations": {
      "vi": "chặt, chặt chẽ"
    }
  },
  {
    "id": "trv-07",
    "topic": "Traveling",
    "word": "tour",
    "phonetic": "/tˈɔː/",
    "pos": "noun",
    "meaning": "chuyến du lịch, chuyến tham quan",
    "example": "The team discussed the tour during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"chuyến du lịch, chuyến tham quan\" trong cuộc họp.",
    "translations": {
      "vi": "chuyến du lịch, chuyến tham quan"
    }
  },
  {
    "id": "trv-08",
    "topic": "Traveling",
    "word": "brochure",
    "phonetic": "/bɹˈəʊʃɐ/",
    "pos": "noun",
    "meaning": "cuốn sách mỏng, tờ gấp",
    "example": "The team discussed the brochure during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"cuốn sách mỏng, tờ gấp\" trong cuộc họp.",
    "translations": {
      "vi": "cuốn sách mỏng, tờ gấp"
    }
  },
  {
    "id": "trv-09",
    "topic": "Traveling",
    "word": "involve",
    "phonetic": "/ɪnvˈɒlv/",
    "pos": "verb",
    "meaning": "gồm,k éo theo; tham gia",
    "example": "The team plans to involve before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"gồm,k éo theo; tham gia\" trước thời hạn.",
    "translations": {
      "vi": "gồm,k éo theo; tham gia"
    }
  },
  {
    "id": "trv-10",
    "topic": "Traveling",
    "word": "away",
    "phonetic": "/ɐwˈeɪ/",
    "pos": "adv",
    "meaning": "xa, cáchx a, mất đi",
    "example": "The team completed the task away.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"xa, cáchx a, mất đi\".",
    "translations": {
      "vi": "xa, cáchx a, mất đi"
    }
  },
  {
    "id": "trv-11",
    "topic": "Traveling",
    "word": "hospitality",
    "phonetic": "/hˌɒspɪtˈælɪti/",
    "pos": "noun",
    "meaning": "sự hiếu khách, sụ thân thiện",
    "example": "The team discussed the hospitality during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự hiếu khách, sụ thân thiện\" trong cuộc họp.",
    "translations": {
      "vi": "sự hiếu khách, sụ thân thiện"
    }
  },
  {
    "id": "trv-12",
    "topic": "Traveling",
    "word": "unlimited",
    "phonetic": "/ʌnlˈɪmɪtɪd/",
    "pos": "adj",
    "meaning": "vô hạn,vôt ận, không giới hạn",
    "example": "The manager described the proposal as unlimited.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"vô hạn,vôt ận, không giới hạn\".",
    "translations": {
      "vi": "vô hạn,vôt ận, không giới hạn"
    }
  },
  {
    "id": "trv-13",
    "topic": "Traveling",
    "word": "attraction",
    "phonetic": "/ɐtɹˈækʃən/",
    "pos": "noun",
    "meaning": "sự thu hút, điểm tham quan",
    "example": "The team discussed the attraction during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự thu hút, điểm tham quan\" trong cuộc họp.",
    "translations": {
      "vi": "sự thu hút, điểm tham quan"
    }
  },
  {
    "id": "trv-14",
    "topic": "Traveling",
    "word": "itinerary",
    "phonetic": "/aɪtˈɪnəɹəɹi/",
    "pos": "noun",
    "meaning": "hành trình, lộ trình",
    "example": "The team discussed the itinerary during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"hành trình, lộ trình\" trong cuộc họp.",
    "translations": {
      "vi": "hành trình, lộ trình"
    }
  },
  {
    "id": "trv-15",
    "topic": "Traveling",
    "word": "exotic",
    "phonetic": "/ɛɡzˈɒtɪk/",
    "pos": "adj",
    "meaning": "kỳ lạ, đẹp kỳ lạ",
    "example": "The manager described the proposal as exotic.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"kỳ lạ, đẹp kỳ lạ\".",
    "translations": {
      "vi": "kỳ lạ, đẹp kỳ lạ"
    }
  },
  {
    "id": "trv-16",
    "topic": "Traveling",
    "word": "super",
    "phonetic": "/sˈuːpɐ/",
    "pos": "adj",
    "meaning": "nguy nga, tr áng lệ, tuyệt vời",
    "example": "The manager described the proposal as super.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"nguy nga, tr áng lệ, tuyệt vời\".",
    "translations": {
      "vi": "nguy nga, tr áng lệ, tuyệt vời"
    }
  },
  {
    "id": "trv-17",
    "topic": "Traveling",
    "word": "baggage",
    "phonetic": "/bˈæɡɪdʒ/",
    "pos": "noun",
    "meaning": "hành lý",
    "example": "The team discussed the baggage during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"hành lý\" trong cuộc họp.",
    "translations": {
      "vi": "hành lý"
    }
  },
  {
    "id": "trv-18",
    "topic": "Traveling",
    "word": "destination",
    "phonetic": "/dˌɛstɪnˈeɪʃən/",
    "pos": "noun",
    "meaning": "đích, điểm đến",
    "example": "The team discussed the destination during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"đích, điểm đến\" trong cuộc họp.",
    "translations": {
      "vi": "đích, điểm đến"
    }
  },
  {
    "id": "trv-19",
    "topic": "Traveling",
    "word": "missing",
    "phonetic": "/mˈɪsɪŋ/",
    "pos": "adj",
    "meaning": "bị mất, thất lạc",
    "example": "The manager described the proposal as missing.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"bị mất, thất lạc\".",
    "translations": {
      "vi": "bị mất, thất lạc"
    }
  },
  {
    "id": "trv-20",
    "topic": "Traveling",
    "word": "locate",
    "phonetic": "/ləʊkˈeɪt/",
    "pos": "verb",
    "meaning": "có vị trí, nằm ở, định vị",
    "example": "The team plans to locate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"có vị trí, nằm ở, định vị\" trước thời hạn.",
    "translations": {
      "vi": "có vị trí, nằm ở, định vị"
    }
  },
  {
    "id": "trv-21",
    "topic": "Traveling",
    "word": "duty",
    "phonetic": "/djˈuːti/",
    "pos": "noun",
    "meaning": "thuế, nhiệm vụ/nghĩa vụ",
    "example": "The team discussed the duty during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"thuế, nhiệm vụ/nghĩa vụ\" trong cuộc họp.",
    "translations": {
      "vi": "thuế, nhiệm vụ/nghĩa vụ"
    }
  },
  {
    "id": "trv-22",
    "topic": "Traveling",
    "word": "process",
    "phonetic": "/ˈpɹɑˌsɛs/",
    "pos": "noun",
    "meaning": "quá trình, tiến trình",
    "example": "The team discussed the process during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"quá trình, tiến trình\" trong cuộc họp.",
    "translations": {
      "vi": "quá trình, tiến trình"
    }
  },
  {
    "id": "trv-23",
    "topic": "Traveling",
    "word": "board",
    "phonetic": "/bˈɔːd/",
    "pos": "verb",
    "meaning": "lên (tàu,x e, máy bay)",
    "example": "The team plans to board before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"lên (tàu,x e, máy bay)\" trước thời hạn.",
    "translations": {
      "vi": "lên (tàu,x e, máy bay)"
    }
  },
  {
    "id": "trv-24",
    "topic": "Traveling",
    "word": "depart",
    "phonetic": "/dɪpˈɑːt/",
    "pos": "verb",
    "meaning": "khởi hành",
    "example": "The team plans to depart before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"khởi hành\" trước thời hạn.",
    "translations": {
      "vi": "khởi hành"
    }
  },
  {
    "id": "trv-25",
    "topic": "Traveling",
    "word": "emergency",
    "phonetic": "/ɪmˈɜːdʒənsi/",
    "pos": "noun",
    "meaning": "trường hợp khẩn cấp",
    "example": "The team discussed the emergency during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"trường hợp khẩn cấp\" trong cuộc họp.",
    "translations": {
      "vi": "trường hợp khẩn cấp"
    }
  },
  {
    "id": "trv-26",
    "topic": "Traveling",
    "word": "passenger",
    "phonetic": "/pˈæsɪndʒɐ/",
    "pos": "noun",
    "meaning": "hành khách",
    "example": "The team discussed the passenger during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"hành khách\" trong cuộc họp.",
    "translations": {
      "vi": "hành khách"
    }
  },
  {
    "id": "trv-27",
    "topic": "Traveling",
    "word": "carrier",
    "phonetic": "/kˈæɹɪɐ/",
    "pos": "noun",
    "meaning": "người vận chuyển, hãng vận tải",
    "example": "The team discussed the carrier during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"người vận chuyển, hãng vận tải\" trong cuộc họp.",
    "translations": {
      "vi": "người vận chuyển, hãng vận tải"
    }
  },
  {
    "id": "trv-28",
    "topic": "Traveling",
    "word": "arrive",
    "phonetic": "/ɐɹˈaɪv/",
    "pos": "verb",
    "meaning": "đến, tới nơi",
    "example": "The team plans to arrive before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đến, tới nơi\" trước thời hạn.",
    "translations": {
      "vi": "đến, tới nơi"
    }
  },
  {
    "id": "trv-29",
    "topic": "Traveling",
    "word": "customs",
    "phonetic": "/kˈʌstəmz/",
    "pos": "verb",
    "meaning": "hải quan",
    "example": "The team plans to customs before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"hải quan\" trước thời hạn.",
    "translations": {
      "vi": "hải quan"
    }
  },
  {
    "id": "trv-30",
    "topic": "Traveling",
    "word": "indulge",
    "phonetic": "/ɪndˈʌldʒ/",
    "pos": "verb",
    "meaning": "chiều theo;t ận hưởng,s ay mê",
    "example": "The team plans to indulge before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"chiều theo;t ận hưởng,s ay mê\" trước thời hạn.",
    "translations": {
      "vi": "chiều theo;t ận hưởng,s ay mê"
    }
  },
  {
    "id": "trv-31",
    "topic": "Traveling",
    "word": "proximity",
    "phonetic": "/pɹɒksˈɪmɪti/",
    "pos": "noun",
    "meaning": "sự gần, sự lân cận",
    "example": "The team discussed the proximity during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự gần, sự lân cận\" trong cuộc họp.",
    "translations": {
      "vi": "sự gần, sự lân cận"
    }
  },
  {
    "id": "trv-32",
    "topic": "Traveling",
    "word": "seating",
    "phonetic": "/sˈiːtɪŋ/",
    "pos": "noun",
    "meaning": "chỗ ngồi; sựs ắp chỗ",
    "example": "The team discussed the seating during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"chỗ ngồi; sựs ắp chỗ\" trong cuộc họp.",
    "translations": {
      "vi": "chỗ ngồi; sựs ắp chỗ"
    }
  },
  {
    "id": "con-01",
    "topic": "Contracts",
    "word": "proposal",
    "phonetic": "/pɹəpˈəʊzəl/",
    "pos": "noun",
    "meaning": "sự đề xuất, lời đề nghị",
    "example": "The team discussed the proposal during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự đề xuất, lời đề nghị\" trong cuộc họp.",
    "translations": {
      "vi": "sự đề xuất, lời đề nghị"
    }
  },
  {
    "id": "con-02",
    "topic": "Contracts",
    "word": "term",
    "phonetic": "/tˈɜːm/",
    "pos": "noun",
    "meaning": "điều khoản; thời hạn",
    "example": "The team discussed the term during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"điều khoản; thời hạn\" trong cuộc họp.",
    "translations": {
      "vi": "điều khoản; thời hạn"
    }
  },
  {
    "id": "con-03",
    "topic": "Contracts",
    "word": "review",
    "phonetic": "/ˌɹivˈju/",
    "pos": "verb",
    "meaning": "xemxé t, duyệt lại, phê bình",
    "example": "The team plans to review before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"xemxé t, duyệt lại, phê bình\" trước thời hạn.",
    "translations": {
      "vi": "xemxé t, duyệt lại, phê bình"
    }
  },
  {
    "id": "con-04",
    "topic": "Contracts",
    "word": "contract",
    "phonetic": "/ˈkɑnˌtɹækt/",
    "pos": "noun",
    "meaning": "hợp đồng",
    "example": "The team discussed the contract during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"hợp đồng\" trong cuộc họp.",
    "translations": {
      "vi": "hợp đồng"
    }
  },
  {
    "id": "con-05",
    "topic": "Contracts",
    "word": "originally",
    "phonetic": "/əɹˈɪdʒɪnəli/",
    "pos": "adv",
    "meaning": "ban đầu, khởi đầu",
    "example": "The team completed the task originally.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"ban đầu, khởi đầu\".",
    "translations": {
      "vi": "ban đầu, khởi đầu"
    }
  },
  {
    "id": "con-06",
    "topic": "Contracts",
    "word": "initially",
    "phonetic": "/ɪnˈɪʃəlˌi/",
    "pos": "adv",
    "meaning": "lúc đầu, ban đầu",
    "example": "The team completed the task initially.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"lúc đầu, ban đầu\".",
    "translations": {
      "vi": "lúc đầu, ban đầu"
    }
  },
  {
    "id": "con-07",
    "topic": "Contracts",
    "word": "expire",
    "phonetic": "/ɛkspˈaɪə/",
    "pos": "verb",
    "meaning": "hết hạn, hết hiệu lực",
    "example": "The team plans to expire before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"hết hạn, hết hiệu lực\" trước thời hạn.",
    "translations": {
      "vi": "hết hạn, hết hiệu lực"
    }
  },
  {
    "id": "con-08",
    "topic": "Contracts",
    "word": "collaborate",
    "phonetic": "/kəlˈæbəɹˌeɪt/",
    "pos": "verb",
    "meaning": "cộngt ác, hợpt ác",
    "example": "The team plans to collaborate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"cộngt ác, hợpt ác\" trước thời hạn.",
    "translations": {
      "vi": "cộngt ác, hợpt ác"
    }
  },
  {
    "id": "con-09",
    "topic": "Contracts",
    "word": "dedicate",
    "phonetic": "/dˈɛdɪkˌeɪt/",
    "pos": "verb",
    "meaning": "cống hiến,t ậnt âm, dành cho",
    "example": "The team plans to dedicate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"cống hiến,t ậnt âm, dành cho\" trước thời hạn.",
    "translations": {
      "vi": "cống hiến,t ậnt âm, dành cho"
    }
  },
  {
    "id": "con-10",
    "topic": "Contracts",
    "word": "renew",
    "phonetic": "/ɹɪnjˈuː/",
    "pos": "verb",
    "meaning": "làm mới, gia hạn (hợp đồng)",
    "example": "The team plans to renew before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"làm mới, gia hạn (hợp đồng)\" trước thời hạn.",
    "translations": {
      "vi": "làm mới, gia hạn (hợp đồng)"
    }
  },
  {
    "id": "con-11",
    "topic": "Contracts",
    "word": "dispute",
    "phonetic": "/dɪspjˈuːt/",
    "pos": "noun",
    "meaning": "cuộc tranh luận, sự bất đồng",
    "example": "The team discussed the dispute during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"cuộc tranh luận, sự bất đồng\" trong cuộc họp.",
    "translations": {
      "vi": "cuộc tranh luận, sự bất đồng"
    }
  },
  {
    "id": "con-12",
    "topic": "Contracts",
    "word": "impression",
    "phonetic": "/ɪmpɹˈɛʃən/",
    "pos": "noun",
    "meaning": "ấn tượng",
    "example": "The team discussed the impression during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"ấn tượng\" trong cuộc họp.",
    "translations": {
      "vi": "ấn tượng"
    }
  },
  {
    "id": "con-13",
    "topic": "Contracts",
    "word": "option",
    "phonetic": "/ˈɒpʃən/",
    "pos": "noun",
    "meaning": "lựa chọn, quyền lựa chọn",
    "example": "The team discussed the option during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"lựa chọn, quyền lựa chọn\" trong cuộc họp.",
    "translations": {
      "vi": "lựa chọn, quyền lựa chọn"
    }
  },
  {
    "id": "con-14",
    "topic": "Contracts",
    "word": "terminate",
    "phonetic": "/tˈɜːmɪnˌeɪt/",
    "pos": "verb",
    "meaning": "chấm dứt, hoàn thành",
    "example": "The team plans to terminate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"chấm dứt, hoàn thành\" trước thời hạn.",
    "translations": {
      "vi": "chấm dứt, hoàn thành"
    }
  },
  {
    "id": "con-15",
    "topic": "Contracts",
    "word": "proceed",
    "phonetic": "/pɹəsˈiːd/",
    "pos": "verb",
    "meaning": "tiến hành, tiếp tục",
    "example": "The team plans to proceed before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"tiến hành, tiếp tục\" trước thời hạn.",
    "translations": {
      "vi": "tiến hành, tiếp tục"
    }
  },
  {
    "id": "con-16",
    "topic": "Contracts",
    "word": "narrow",
    "phonetic": "/nˈæɹəʊ/",
    "pos": "verb",
    "meaning": "thu hẹp, giảm bớt",
    "example": "The team plans to narrow before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"thu hẹp, giảm bớt\" trước thời hạn.",
    "translations": {
      "vi": "thu hẹp, giảm bớt"
    }
  },
  {
    "id": "con-17",
    "topic": "Contracts",
    "word": "foundation",
    "phonetic": "/faʊndˈeɪʃən/",
    "pos": "noun",
    "meaning": "nềnt ảng, sự thành lập",
    "example": "The team discussed the foundation during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"nềnt ảng, sự thành lập\" trong cuộc họp.",
    "translations": {
      "vi": "nềnt ảng, sự thành lập"
    }
  },
  {
    "id": "con-18",
    "topic": "Contracts",
    "word": "alliance",
    "phonetic": "/ɐlˈaɪəns/",
    "pos": "noun",
    "meaning": "sự liên minh, khối liên minh",
    "example": "The team discussed the alliance during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự liên minh, khối liên minh\" trong cuộc họp.",
    "translations": {
      "vi": "sự liên minh, khối liên minh"
    }
  },
  {
    "id": "con-19",
    "topic": "Contracts",
    "word": "stipulation",
    "phonetic": "/stˌɪpjʊlˈeɪʃən/",
    "pos": "noun",
    "meaning": "sự quy định, điều khoản quy định",
    "example": "The team discussed the stipulation during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự quy định, điều khoản quy định\" trong cuộc họp.",
    "translations": {
      "vi": "sự quy định, điều khoản quy định"
    }
  },
  {
    "id": "con-20",
    "topic": "Contracts",
    "word": "compromise",
    "phonetic": "/kˈɒmpɹəmˌaɪz/",
    "pos": "noun",
    "meaning": "sự thoả hiệp",
    "example": "The team discussed the compromise during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự thoả hiệp\" trong cuộc họp.",
    "translations": {
      "vi": "sự thoả hiệp"
    }
  },
  {
    "id": "con-21",
    "topic": "Contracts",
    "word": "deadlock",
    "phonetic": "/dˈɛdlɒk/",
    "pos": "noun",
    "meaning": "sự bế tắc, sự đình trệ",
    "example": "The team discussed the deadlock during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự bế tắc, sự đình trệ\" trong cuộc họp.",
    "translations": {
      "vi": "sự bế tắc, sự đình trệ"
    }
  },
  {
    "id": "con-22",
    "topic": "Contracts",
    "word": "signature",
    "phonetic": "/sˈɪɡnɪtʃɐ/",
    "pos": "noun",
    "meaning": "chữ ký",
    "example": "The team discussed the signature during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"chữ ký\" trong cuộc họp.",
    "translations": {
      "vi": "chữ ký"
    }
  },
  {
    "id": "con-23",
    "topic": "Contracts",
    "word": "cooperatively",
    "phonetic": "/kəʊˈɒpəɹətˌɪvli/",
    "pos": "adv",
    "meaning": "hợp tác",
    "example": "The team completed the task cooperatively.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"hợp tác\".",
    "translations": {
      "vi": "hợp tác"
    }
  },
  {
    "id": "con-24",
    "topic": "Contracts",
    "word": "objection",
    "phonetic": "/ɒbdʒˈɛkʃən/",
    "pos": "noun",
    "meaning": "sự phản đối, sự bất bình",
    "example": "The team discussed the objection during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự phản đối, sự bất bình\" trong cuộc họp.",
    "translations": {
      "vi": "sự phản đối, sự bất bình"
    }
  },
  {
    "id": "con-25",
    "topic": "Contracts",
    "word": "security",
    "phonetic": "/sɪkjˈɔːɹɪti/",
    "pos": "noun",
    "meaning": "an ninh, sự bảo vệ",
    "example": "The team discussed the security during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"an ninh, sự bảo vệ\" trong cuộc họp.",
    "translations": {
      "vi": "an ninh, sự bảo vệ"
    }
  },
  {
    "id": "con-26",
    "topic": "Contracts",
    "word": "modify",
    "phonetic": "/mˈɒdɪfˌaɪ/",
    "pos": "verb",
    "meaning": "sửa đổi, điều chỉnh",
    "example": "The team plans to modify before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"sửa đổi, điều chỉnh\" trước thời hạn.",
    "translations": {
      "vi": "sửa đổi, điều chỉnh"
    }
  },
  {
    "id": "con-27",
    "topic": "Contracts",
    "word": "bid",
    "phonetic": "/bˈɪd/",
    "pos": "noun",
    "meaning": "sự đắt giá, sự bỏ thầu",
    "example": "The team discussed the bid during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự đắt giá, sự bỏ thầu\" trong cuộc họp.",
    "translations": {
      "vi": "sự đắt giá, sự bỏ thầu"
    }
  },
  {
    "id": "con-28",
    "topic": "Contracts",
    "word": "settle",
    "phonetic": "/sˈɛtəl/",
    "pos": "verb",
    "meaning": "giải quyế t, dàn xếp",
    "example": "The team plans to settle before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"giải quyế t, dàn xếp\" trước thời hạn.",
    "translations": {
      "vi": "giải quyế t, dàn xếp"
    }
  },
  {
    "id": "con-29",
    "topic": "Contracts",
    "word": "challenging",
    "phonetic": "/tʃˈælɪndʒˌɪŋ/",
    "pos": "adj",
    "meaning": "đầy thách thức, khó khăn",
    "example": "The manager described the proposal as challenging.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"đầy thách thức, khó khăn\".",
    "translations": {
      "vi": "đầy thách thức, khó khăn"
    }
  },
  {
    "id": "tra-01",
    "topic": "Trading",
    "word": "refuse",
    "phonetic": "/ˈɹɛfˌjuz/",
    "pos": "verb",
    "meaning": "từ chối",
    "example": "The team plans to refuse before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"từ chối\" trước thời hạn.",
    "translations": {
      "vi": "từ chối"
    }
  },
  {
    "id": "tra-02",
    "topic": "Trading",
    "word": "temporarily",
    "phonetic": "/tˌɛmpəɹˈɛɹəli/",
    "pos": "adv",
    "meaning": "tạm thời, nhất thời",
    "example": "The team completed the task temporarily.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"tạm thời, nhất thời\".",
    "translations": {
      "vi": "tạm thời, nhất thời"
    }
  },
  {
    "id": "tra-03",
    "topic": "Trading",
    "word": "bulk",
    "phonetic": "/bˈʌlk/",
    "pos": "adj",
    "meaning": "lớn nhiều",
    "example": "The manager described the proposal as bulk.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"lớn nhiều\".",
    "translations": {
      "vi": "lớn nhiều"
    }
  },
  {
    "id": "tra-04",
    "topic": "Trading",
    "word": "short",
    "phonetic": "/ʃˈɔːt/",
    "pos": "adj",
    "meaning": "ngắn, thiếu, không đủ",
    "example": "The manager described the proposal as short.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"ngắn, thiếu, không đủ\".",
    "translations": {
      "vi": "ngắn, thiếu, không đủ"
    }
  },
  {
    "id": "tra-05",
    "topic": "Trading",
    "word": "cost",
    "phonetic": "/kˈɒst/",
    "pos": "noun",
    "meaning": "giá, chi phí",
    "example": "The team discussed the cost during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"giá, chi phí\" trong cuộc họp.",
    "translations": {
      "vi": "giá, chi phí"
    }
  },
  {
    "id": "tra-06",
    "topic": "Trading",
    "word": "order",
    "phonetic": "/ˈɔːdɐ/",
    "pos": "verb",
    "meaning": "đặt hàng,y êu cầu",
    "example": "The team plans to order before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đặt hàng,y êu cầu\" trước thời hạn.",
    "translations": {
      "vi": "đặt hàng,y êu cầu"
    }
  },
  {
    "id": "tra-07",
    "topic": "Trading",
    "word": "provide",
    "phonetic": "/pɹəvˈaɪd/",
    "pos": "verb",
    "meaning": "cung cấp, dự phòng",
    "example": "The team plans to provide before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"cung cấp, dự phòng\" trước thời hạn.",
    "translations": {
      "vi": "cung cấp, dự phòng"
    }
  },
  {
    "id": "tra-08",
    "topic": "Trading",
    "word": "contact",
    "phonetic": "/ˈkɑnˌtækt/",
    "pos": "verb",
    "meaning": "liên lạc, liên hệ",
    "example": "The team plans to contact before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"liên lạc, liên hệ\" trước thời hạn.",
    "translations": {
      "vi": "liên lạc, liên hệ"
    }
  },
  {
    "id": "tra-09",
    "topic": "Trading",
    "word": "discount",
    "phonetic": "/ˈdɪskaʊnt/",
    "pos": "noun",
    "meaning": "sự giảm, tiền chiết khấu",
    "example": "The team discussed the discount during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự giảm, tiền chiết khấu\" trong cuộc họp.",
    "translations": {
      "vi": "sự giảm, tiền chiết khấu"
    }
  },
  {
    "id": "tra-10",
    "topic": "Trading",
    "word": "assure",
    "phonetic": "/əʃjˈɔː/",
    "pos": "verb",
    "meaning": "đảm bảo, cam đoan",
    "example": "The team plans to assure before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đảm bảo, cam đoan\" trước thời hạn.",
    "translations": {
      "vi": "đảm bảo, cam đoan"
    }
  },
  {
    "id": "tra-11",
    "topic": "Trading",
    "word": "seek",
    "phonetic": "/sˈiːk/",
    "pos": "verb",
    "meaning": "tìm kiếm, theo đuổi",
    "example": "The team plans to seek before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"tìm kiếm, theo đuổi\" trước thời hạn.",
    "translations": {
      "vi": "tìm kiếm, theo đuổi"
    }
  },
  {
    "id": "tra-12",
    "topic": "Trading",
    "word": "unable",
    "phonetic": "/ʌnˈeɪbəl/",
    "pos": "adj",
    "meaning": "không thể, không có khả năng",
    "example": "The manager described the proposal as unable.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"không thể, không có khả năng\".",
    "translations": {
      "vi": "không thể, không có khả năng"
    }
  },
  {
    "id": "tra-13",
    "topic": "Trading",
    "word": "payment",
    "phonetic": "/pˈeɪmənt/",
    "pos": "noun",
    "meaning": "việc trả tiền, khoản thanht oán",
    "example": "The team discussed the payment during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"việc trả tiền, khoản thanht oán\" trong cuộc họp.",
    "translations": {
      "vi": "việc trả tiền, khoản thanht oán"
    }
  },
  {
    "id": "tra-14",
    "topic": "Trading",
    "word": "bargain",
    "phonetic": "/bˈɑːɡɪn/",
    "pos": "noun",
    "meaning": "sự mặc cả, món hời",
    "example": "The team discussed the bargain during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự mặc cả, món hời\" trong cuộc họp.",
    "translations": {
      "vi": "sự mặc cả, món hời"
    }
  },
  {
    "id": "tra-15",
    "topic": "Trading",
    "word": "represent",
    "phonetic": "/ˌɹɛpɹɪˈzɛnt/",
    "pos": "verb",
    "meaning": "đại diện, tiêu biểu cho",
    "example": "The team plans to represent before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đại diện, tiêu biểu cho\" trước thời hạn.",
    "translations": {
      "vi": "đại diện, tiêu biểu cho"
    }
  },
  {
    "id": "tra-16",
    "topic": "Trading",
    "word": "dealer",
    "phonetic": "/dˈiːlɐ/",
    "pos": "noun",
    "meaning": "người buôn bán, lái buôn",
    "example": "The team discussed the dealer during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"người buôn bán, lái buôn\" trong cuộc họp.",
    "translations": {
      "vi": "người buôn bán, lái buôn"
    }
  },
  {
    "id": "tra-17",
    "topic": "Trading",
    "word": "inventory",
    "phonetic": "/ˈɪnvəntɹˌi/",
    "pos": "noun",
    "meaning": "hàng tồn kho",
    "example": "The team discussed the inventory during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"hàng tồn kho\" trong cuộc họp.",
    "translations": {
      "vi": "hàng tồn kho"
    }
  },
  {
    "id": "tra-18",
    "topic": "Trading",
    "word": "commercial",
    "phonetic": "/kəmˈɜːʃəl/",
    "pos": "adj",
    "meaning": "(thuộc thương mại)",
    "example": "The manager described the proposal as commercial.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"(thuộc thương mại)\".",
    "translations": {
      "vi": "(thuộc thương mại)"
    }
  },
  {
    "id": "tra-19",
    "topic": "Trading",
    "word": "invoice",
    "phonetic": "/ˈɪnvɔɪs/",
    "pos": "noun",
    "meaning": "hoá đơn",
    "example": "The team discussed the invoice during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"hoá đơn\" trong cuộc họp.",
    "translations": {
      "vi": "hoá đơn"
    }
  },
  {
    "id": "tra-20",
    "topic": "Trading",
    "word": "move",
    "phonetic": "/mˈuːv/",
    "pos": "verb",
    "meaning": "chuy ển động, di chuyển",
    "example": "The team plans to move before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"chuy ển động, di chuyển\" trước thời hạn.",
    "translations": {
      "vi": "chuy ển động, di chuyển"
    }
  },
  {
    "id": "tra-21",
    "topic": "Trading",
    "word": "distribute",
    "phonetic": "/dˈɪstɹɪbjˌuːt/",
    "pos": "verb",
    "meaning": "phân phối/phân phát",
    "example": "The team plans to distribute before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"phân phối/phân phát\" trước thời hạn.",
    "translations": {
      "vi": "phân phối/phân phát"
    }
  },
  {
    "id": "tra-22",
    "topic": "Trading",
    "word": "stock",
    "phonetic": "/stˈɒk/",
    "pos": "noun",
    "meaning": "kho hàng, nguồn hàng; cổ phần",
    "example": "The team discussed the stock during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"kho hàng, nguồn hàng; cổ phần\" trong cuộc họp.",
    "translations": {
      "vi": "kho hàng, nguồn hàng; cổ phần"
    }
  },
  {
    "id": "tra-23",
    "topic": "Trading",
    "word": "rating",
    "phonetic": "/ɹˈeɪtɪŋ/",
    "pos": "noun",
    "meaning": "sự đánh giá, thứ bậc",
    "example": "The team discussed the rating during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự đánh giá, thứ bậc\" trong cuộc họp.",
    "translations": {
      "vi": "sự đánh giá, thứ bậc"
    }
  },
  {
    "id": "tra-24",
    "topic": "Trading",
    "word": "encompass",
    "phonetic": "/ɛnkˈʌmpəs/",
    "pos": "verb",
    "meaning": "bao quanh, bao gồm",
    "example": "The team plans to encompass before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"bao quanh, bao gồm\" trước thời hạn.",
    "translations": {
      "vi": "bao quanh, bao gồm"
    }
  },
  {
    "id": "tra-25",
    "topic": "Trading",
    "word": "market",
    "phonetic": "/mˈɑːkɪt/",
    "pos": "noun",
    "meaning": "thị trường",
    "example": "The team discussed the market during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"thị trường\" trong cuộc họp.",
    "translations": {
      "vi": "thị trường"
    }
  },
  {
    "id": "tra-26",
    "topic": "Trading",
    "word": "commodity",
    "phonetic": "/kəmˈɒdɪti/",
    "pos": "noun",
    "meaning": "hàng hoá, mặt hàng",
    "example": "The team discussed the commodity during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"hàng hoá, mặt hàng\" trong cuộc họp.",
    "translations": {
      "vi": "hàng hoá, mặt hàng"
    }
  },
  {
    "id": "tra-27",
    "topic": "Trading",
    "word": "quote",
    "phonetic": "/kwˈəʊt/",
    "pos": "noun",
    "meaning": "báo giá",
    "example": "The team discussed the quote during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"báo giá\" trong cuộc họp.",
    "translations": {
      "vi": "báo giá"
    }
  },
  {
    "id": "tra-28",
    "topic": "Trading",
    "word": "consignment",
    "phonetic": "/kənsˈaɪnmənt/",
    "pos": "noun",
    "meaning": "sự gửi hàng, sự ký gửi (để bán)",
    "example": "The team discussed the consignment during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự gửi hàng, sự ký gửi (để bán)\" trong cuộc họp.",
    "translations": {
      "vi": "sự gửi hàng, sự ký gửi (để bán)"
    }
  },
  {
    "id": "ttp-01",
    "topic": "Trading Transport",
    "word": "perishable",
    "phonetic": "/pˈɛɹɪʃəbəl/",
    "pos": "adj",
    "meaning": "dễ hỏng, dễ thối",
    "example": "The manager described the proposal as perishable.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"dễ hỏng, dễ thối\".",
    "translations": {
      "vi": "dễ hỏng, dễ thối"
    }
  },
  {
    "id": "ttp-02",
    "topic": "Trading Transport",
    "word": "ensure",
    "phonetic": "/ɛnʃˈɔː/",
    "pos": "verb",
    "meaning": "bảo đảm, quả quy ết",
    "example": "The team plans to ensure before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"bảo đảm, quả quy ết\" trước thời hạn.",
    "translations": {
      "vi": "bảo đảm, quả quy ết"
    }
  },
  {
    "id": "ttp-03",
    "topic": "Trading Transport",
    "word": "particularly",
    "phonetic": "/pətˈɪkjʊləli/",
    "pos": "adv",
    "meaning": "đặc biệt, cá biệt, đặc biệt là",
    "example": "The team completed the task particularly.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"đặc biệt, cá biệt, đặc biệt là\".",
    "translations": {
      "vi": "đặc biệt, cá biệt, đặc biệt là"
    }
  },
  {
    "id": "ttp-04",
    "topic": "Trading Transport",
    "word": "adequately",
    "phonetic": "/ˈædɪkwətli/",
    "pos": "adv",
    "meaning": "tương xứng, thích đáng",
    "example": "The team completed the task adequately.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"tương xứng, thích đáng\".",
    "translations": {
      "vi": "tương xứng, thích đáng"
    }
  },
  {
    "id": "ttp-05",
    "topic": "Trading Transport",
    "word": "article",
    "phonetic": "/ˈɑːtɪkəl/",
    "pos": "noun",
    "meaning": "vật phẩm, đồ; bài báo; điều khoản",
    "example": "The team discussed the article during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"vật phẩm, đồ; bài báo; điều khoản\" trong cuộc họp.",
    "translations": {
      "vi": "vật phẩm, đồ; bài báo; điều khoản"
    }
  },
  {
    "id": "ttp-06",
    "topic": "Trading Transport",
    "word": "agency",
    "phonetic": "/ˈeɪdʒənsi/",
    "pos": "noun",
    "meaning": "đại lý, cơ quan, hãng, sở",
    "example": "The team discussed the agency during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"đại lý, cơ quan, hãng, sở\" trong cuộc họp.",
    "translations": {
      "vi": "đại lý, cơ quan, hãng, sở"
    }
  },
  {
    "id": "ttp-07",
    "topic": "Trading Transport",
    "word": "enclose",
    "phonetic": "/ɛnklˈəʊz/",
    "pos": "verb",
    "meaning": "bao gồm, gửi kèm theo; vây quanh",
    "example": "The team plans to enclose before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"bao gồm, gửi kèm theo; vây quanh\" trước thời hạn.",
    "translations": {
      "vi": "bao gồm, gửi kèm theo; vây quanh"
    }
  },
  {
    "id": "ttp-08",
    "topic": "Trading Transport",
    "word": "careful",
    "phonetic": "/kˈeəfəl/",
    "pos": "adj",
    "meaning": "cẩn thận, kỹ lượng, chu đáo",
    "example": "The manager described the proposal as careful.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"cẩn thận, kỹ lượng, chu đáo\".",
    "translations": {
      "vi": "cẩn thận, kỹ lượng, chu đáo"
    }
  },
  {
    "id": "ttp-09",
    "topic": "Trading Transport",
    "word": "attach",
    "phonetic": "/ɐtˈætʃ/",
    "pos": "verb",
    "meaning": "đính kèm, gắn vào",
    "example": "The team plans to attach before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đính kèm, gắn vào\" trước thời hạn.",
    "translations": {
      "vi": "đính kèm, gắn vào"
    }
  },
  {
    "id": "ttp-10",
    "topic": "Trading Transport",
    "word": "formerly",
    "phonetic": "/fˈɔːməli/",
    "pos": "adv",
    "meaning": "trước đây",
    "example": "The team completed the task formerly.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"trước đây\".",
    "translations": {
      "vi": "trước đây"
    }
  },
  {
    "id": "ttp-11",
    "topic": "Trading Transport",
    "word": "package",
    "phonetic": "/pˈækɪdʒ/",
    "pos": "noun",
    "meaning": "gói hàng, kiện hàng",
    "example": "The team discussed the package during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"gói hàng, kiện hàng\" trong cuộc họp.",
    "translations": {
      "vi": "gói hàng, kiện hàng"
    }
  },
  {
    "id": "ttp-12",
    "topic": "Trading Transport",
    "word": "react",
    "phonetic": "/ɹɪˈækt/",
    "pos": "verb",
    "meaning": "phản ứng,t ác động lại",
    "example": "The team plans to react before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"phản ứng,t ác động lại\" trước thời hạn.",
    "translations": {
      "vi": "phản ứng,t ác động lại"
    }
  },
  {
    "id": "ttp-13",
    "topic": "Trading Transport",
    "word": "convenience",
    "phonetic": "/kənvˈiːnɪəns/",
    "pos": "noun",
    "meaning": "sự thuận lợi/thuận tiện",
    "example": "The team discussed the convenience during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự thuận lợi/thuận tiện\" trong cuộc họp.",
    "translations": {
      "vi": "sự thuận lợi/thuận tiện"
    }
  },
  {
    "id": "ttp-14",
    "topic": "Trading Transport",
    "word": "separate",
    "phonetic": "/ˈsɛpɝˌeɪt/",
    "pos": "adj",
    "meaning": "tách rời ra, chia tay; phân loại",
    "example": "The manager described the proposal as separate.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"tách rời ra, chia tay; phân loại\".",
    "translations": {
      "vi": "tách rời ra, chia tay; phân loại"
    }
  },
  {
    "id": "ttp-15",
    "topic": "Trading Transport",
    "word": "handle",
    "phonetic": "/hˈændəl/",
    "pos": "verb",
    "meaning": "điều khiển, xử lý",
    "example": "The team plans to handle before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"điều khiển, xử lý\" trước thời hạn.",
    "translations": {
      "vi": "điều khiển, xử lý"
    }
  },
  {
    "id": "ttp-16",
    "topic": "Trading Transport",
    "word": "warehouse",
    "phonetic": "/wˈeəhaʊs/",
    "pos": "noun",
    "meaning": "nhà kho",
    "example": "The team discussed the warehouse during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"nhà kho\" trong cuộc họp.",
    "translations": {
      "vi": "nhà kho"
    }
  },
  {
    "id": "ttp-17",
    "topic": "Trading Transport",
    "word": "storage",
    "phonetic": "/stˈɔːɹɪdʒ/",
    "pos": "noun",
    "meaning": "kho, sự tích trữ",
    "example": "The team discussed the storage during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"kho, sự tích trữ\" trong cuộc họp.",
    "translations": {
      "vi": "kho, sự tích trữ"
    }
  },
  {
    "id": "ttp-18",
    "topic": "Trading Transport",
    "word": "detach",
    "phonetic": "/dɪtˈætʃ/",
    "pos": "verb",
    "meaning": "gỡ, tháo, tách ra",
    "example": "The team plans to detach before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"gỡ, tháo, tách ra\" trước thời hạn.",
    "translations": {
      "vi": "gỡ, tháo, tách ra"
    }
  },
  {
    "id": "ttp-19",
    "topic": "Trading Transport",
    "word": "envelope",
    "phonetic": "/ˈɛnvəˌɫoʊp/",
    "pos": "noun",
    "meaning": "phong bì",
    "example": "The team discussed the envelope during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"phong bì\" trong cuộc họp.",
    "translations": {
      "vi": "phong bì"
    }
  },
  {
    "id": "ttp-20",
    "topic": "Trading Transport",
    "word": "exclusion",
    "phonetic": "/ɛksklˈuːʒən/",
    "pos": "noun",
    "meaning": "sự không tính vào, sự loại trừ",
    "example": "The team discussed the exclusion during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự không tính vào, sự loại trừ\" trong cuộc họp.",
    "translations": {
      "vi": "sự không tính vào, sự loại trừ"
    }
  },
  {
    "id": "ttp-21",
    "topic": "Trading Transport",
    "word": "incorrect",
    "phonetic": "/ɪnkəɹˈɛkt/",
    "pos": "adj",
    "meaning": "không đúng, sai",
    "example": "The manager described the proposal as incorrect.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"không đúng, sai\".",
    "translations": {
      "vi": "không đúng, sai"
    }
  },
  {
    "id": "ttp-22",
    "topic": "Trading Transport",
    "word": "step",
    "phonetic": "/stˈɛp/",
    "pos": "noun",
    "meaning": "bước đi, bước; biện pháp, bước tiến",
    "example": "The team discussed the step during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"bước đi, bước; biện pháp, bước tiến\" trong cuộc họp.",
    "translations": {
      "vi": "bước đi, bước; biện pháp, bước tiến"
    }
  },
  {
    "id": "ttp-23",
    "topic": "Trading Transport",
    "word": "fragile",
    "phonetic": "/fɹˈædʒaɪl/",
    "pos": "adj",
    "meaning": "dễv ỡ, mỏng manh",
    "example": "The manager described the proposal as fragile.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"dễv ỡ, mỏng manh\".",
    "translations": {
      "vi": "dễv ỡ, mỏng manh"
    }
  },
  {
    "id": "ttp-24",
    "topic": "Trading Transport",
    "word": "deliver",
    "phonetic": "/dɪlˈɪvɐ/",
    "pos": "verb",
    "meaning": "giao, phát; phát biểu, bàytỏ",
    "example": "The team plans to deliver before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"giao, phát; phát biểu, bàytỏ\" trước thời hạn.",
    "translations": {
      "vi": "giao, phát; phát biểu, bàytỏ"
    }
  },
  {
    "id": "ttp-25",
    "topic": "Trading Transport",
    "word": "courier",
    "phonetic": "/kˈɜːɹɪɐ/",
    "pos": "noun",
    "meaning": "người đưa thư, công ty vận chuy ển",
    "example": "The team discussed the courier during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"người đưa thư, công ty vận chuy ển\" trong cuộc họp.",
    "translations": {
      "vi": "người đưa thư, công ty vận chuy ển"
    }
  },
  {
    "id": "ttp-26",
    "topic": "Trading Transport",
    "word": "carton",
    "phonetic": "/kˈɑːtən/",
    "pos": "noun",
    "meaning": "giấy bìa, hộp/thùng bìa cứng",
    "example": "The team discussed the carton during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"giấy bìa, hộp/thùng bìa cứng\" trong cuộc họp.",
    "translations": {
      "vi": "giấy bìa, hộp/thùng bìa cứng"
    }
  },
  {
    "id": "ttp-27",
    "topic": "Trading Transport",
    "word": "address",
    "phonetic": "/ˈæˌdɹɛs/",
    "pos": "noun",
    "meaning": "địa chỉ",
    "example": "The team discussed the address during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"địa chỉ\" trong cuộc họp.",
    "translations": {
      "vi": "địa chỉ"
    }
  },
  {
    "id": "ttp-28",
    "topic": "Trading Transport",
    "word": "carry",
    "phonetic": "/kˈæɹi/",
    "pos": "verb",
    "meaning": "mang,v ác, đem theo;có",
    "example": "The team plans to carry before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"mang,v ác, đem theo;có\" trước thời hạn.",
    "translations": {
      "vi": "mang,v ác, đem theo;có"
    }
  },
  {
    "id": "ttp-29",
    "topic": "Trading Transport",
    "word": "content",
    "phonetic": "/ˈkɑntɛnt/",
    "pos": "noun",
    "meaning": "nội dung, đồ đựng bên trong",
    "example": "The team discussed the content during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"nội dung, đồ đựng bên trong\" trong cuộc họp.",
    "translations": {
      "vi": "nội dung, đồ đựng bên trong"
    }
  },
  {
    "id": "ttp-30",
    "topic": "Trading Transport",
    "word": "correspondence",
    "phonetic": "/kˌɒɹɪspˈɒndəns/",
    "pos": "noun",
    "meaning": "thư từ, quan hệ thư từ",
    "example": "The team discussed the correspondence during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"thư từ, quan hệ thư từ\" trong cuộc họp.",
    "translations": {
      "vi": "thư từ, quan hệ thư từ"
    }
  },
  {
    "id": "ttp-31",
    "topic": "Trading Transport",
    "word": "remarkable",
    "phonetic": "/ɹɪmˈɑːkəbəl/",
    "pos": "adj",
    "meaning": "đáng chý ý, xuấts ắc, đặc biệt",
    "example": "The manager described the proposal as remarkable.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"đáng chý ý, xuấts ắc, đặc biệt\".",
    "translations": {
      "vi": "đáng chý ý, xuấts ắc, đặc biệt"
    }
  },
  {
    "id": "ttp-32",
    "topic": "Trading Transport",
    "word": "impose",
    "phonetic": "/ɪmpˈəʊz/",
    "pos": "verb",
    "meaning": "đánh, áp (thuế)",
    "example": "The team plans to impose before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đánh, áp (thuế)\" trước thời hạn.",
    "translations": {
      "vi": "đánh, áp (thuế)"
    }
  },
  {
    "id": "ttp-33",
    "topic": "Trading Transport",
    "word": "recipient",
    "phonetic": "/ɹɪsˈɪpiənt/",
    "pos": "noun",
    "meaning": "người nhận",
    "example": "The team discussed the recipient during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"người nhận\" trong cuộc họp.",
    "translations": {
      "vi": "người nhận"
    }
  },
  {
    "id": "ttp-34",
    "topic": "Trading Transport",
    "word": "obligate",
    "phonetic": "/ˈɑbɫəˌɡeɪt/",
    "pos": "verb",
    "meaning": "bắt buộc, giao tr ách nhiệm",
    "example": "The team plans to obligate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"bắt buộc, giao tr ách nhiệm\" trước thời hạn.",
    "translations": {
      "vi": "bắt buộc, giao tr ách nhiệm"
    }
  },
  {
    "id": "hot-01",
    "topic": "Hotel, Restaurant",
    "word": "compensate",
    "phonetic": "/kˈɒmpənsˌeɪt/",
    "pos": "noun",
    "meaning": "sự tiếp đón, sự tiếp nhận",
    "example": "The team discussed the compensate during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự tiếp đón, sự tiếp nhận\" trong cuộc họp.",
    "translations": {
      "vi": "sự tiếp đón, sự tiếp nhận"
    }
  },
  {
    "id": "hot-02",
    "topic": "Hotel, Restaurant",
    "word": "complimentary",
    "phonetic": "/kˌɒmplɪmˈɛntəɹi/",
    "pos": "adj",
    "meaning": "miễn phí, biếu,t ặng",
    "example": "The manager described the proposal as complimentary.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"miễn phí, biếu,t ặng\".",
    "translations": {
      "vi": "miễn phí, biếu,t ặng"
    }
  },
  {
    "id": "hot-03",
    "topic": "Hotel, Restaurant",
    "word": "container",
    "phonetic": "/kəntˈeɪnɐ/",
    "pos": "noun",
    "meaning": "đồ để chứa (bình, lọ, hộp, thùng)",
    "example": "The team discussed the container during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"đồ để chứa (bình, lọ, hộp, thùng)\" trong cuộc họp.",
    "translations": {
      "vi": "đồ để chứa (bình, lọ, hộp, thùng)"
    }
  },
  {
    "id": "hot-04",
    "topic": "Hotel, Restaurant",
    "word": "elegant",
    "phonetic": "/ˈɛlɪɡənt/",
    "pos": "noun",
    "meaning": "sự đặt trước, sự bảot ồn",
    "example": "The team discussed the elegant during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự đặt trước, sự bảot ồn\" trong cuộc họp.",
    "translations": {
      "vi": "sự đặt trước, sự bảot ồn"
    }
  },
  {
    "id": "hot-05",
    "topic": "Hotel, Restaurant",
    "word": "make",
    "phonetic": "/mˈeɪk/",
    "pos": "verb",
    "meaning": "làm,t ạo, gâyr a, thực hiện",
    "example": "The team plans to make before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"làm,t ạo, gâyr a, thực hiện\" trước thời hạn.",
    "translations": {
      "vi": "làm,t ạo, gâyr a, thực hiện"
    }
  },
  {
    "id": "hot-06",
    "topic": "Hotel, Restaurant",
    "word": "beverage",
    "phonetic": "/bˈɛvəɹɪdʒ/",
    "pos": "noun",
    "meaning": "đồ uống",
    "example": "The team discussed the beverage during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"đồ uống\" trong cuộc họp.",
    "translations": {
      "vi": "đồ uống"
    }
  },
  {
    "id": "hot-07",
    "topic": "Hotel, Restaurant",
    "word": "rate",
    "phonetic": "/ɹˈeɪt/",
    "pos": "noun",
    "meaning": "giá, mức giá",
    "example": "The team discussed the rate during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"giá, mức giá\" trong cuộc họp.",
    "translations": {
      "vi": "giá, mức giá"
    }
  },
  {
    "id": "hot-08",
    "topic": "Hotel, Restaurant",
    "word": "atmosphere",
    "phonetic": "/ˈætməsfˌiə/",
    "pos": "noun",
    "meaning": "không khí, bầu không khí",
    "example": "The team discussed the atmosphere during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"không khí, bầu không khí\" trong cuộc họp.",
    "translations": {
      "vi": "không khí, bầu không khí"
    }
  },
  {
    "id": "hot-09",
    "topic": "Hotel, Restaurant",
    "word": "sequence",
    "phonetic": "/sˈiːkwəns/",
    "pos": "noun",
    "meaning": "sự nối tiếp, trình tự, chuỗi",
    "example": "The team discussed the sequence during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự nối tiếp, trình tự, chuỗi\" trong cuộc họp.",
    "translations": {
      "vi": "sự nối tiếp, trình tự, chuỗi"
    }
  },
  {
    "id": "hot-10",
    "topic": "Hotel, Restaurant",
    "word": "extensive",
    "phonetic": "/ɛkstˈɛnsɪv/",
    "pos": "adj",
    "meaning": "rộngr ãi, bao quát",
    "example": "The manager described the proposal as extensive.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"rộngr ãi, bao quát\".",
    "translations": {
      "vi": "rộngr ãi, bao quát"
    }
  },
  {
    "id": "hot-11",
    "topic": "Hotel, Restaurant",
    "word": "prior",
    "phonetic": "/pɹˈaɪɐ/",
    "pos": "adj",
    "meaning": "trước, ưu tiên",
    "example": "The manager described the proposal as prior.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"trước, ưu tiên\".",
    "translations": {
      "vi": "trước, ưu tiên"
    }
  },
  {
    "id": "hot-12",
    "topic": "Hotel, Restaurant",
    "word": "belongings",
    "phonetic": "/bɪlˈɒŋɪŋz/",
    "pos": "noun",
    "meaning": "đồ cá nhân, hành lý",
    "example": "The team discussed the belongings during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"đồ cá nhân, hành lý\" trong cuộc họp.",
    "translations": {
      "vi": "đồ cá nhân, hành lý"
    }
  },
  {
    "id": "hot-13",
    "topic": "Hotel, Restaurant",
    "word": "entirely",
    "phonetic": "/ɛntˈaɪəli/",
    "pos": "adv",
    "meaning": "tr ọnv ẹn, hoànt oàn",
    "example": "The team completed the task entirely.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"tr ọnv ẹn, hoànt oàn\".",
    "translations": {
      "vi": "tr ọnv ẹn, hoànt oàn"
    }
  },
  {
    "id": "hot-14",
    "topic": "Hotel, Restaurant",
    "word": "stir",
    "phonetic": "/stˈɜː/",
    "pos": "verb",
    "meaning": "khuấy động",
    "example": "The team plans to stir before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"khuấy động\" trước thời hạn.",
    "translations": {
      "vi": "khuấy động"
    }
  },
  {
    "id": "hot-15",
    "topic": "Hotel, Restaurant",
    "word": "choice",
    "phonetic": "/tʃˈɔɪs/",
    "pos": "noun",
    "meaning": "sự lựa chọn, quyền chọn",
    "example": "The team discussed the choice during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự lựa chọn, quyền chọn\" trong cuộc họp.",
    "translations": {
      "vi": "sự lựa chọn, quyền chọn"
    }
  },
  {
    "id": "hot-16",
    "topic": "Hotel, Restaurant",
    "word": "freshness",
    "phonetic": "/fɹˈɛʃnəs/",
    "pos": "noun",
    "meaning": "sự tươi, sự sảng khoái",
    "example": "The team discussed the freshness during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự tươi, sự sảng khoái\" trong cuộc họp.",
    "translations": {
      "vi": "sự tươi, sự sảng khoái"
    }
  },
  {
    "id": "hot-17",
    "topic": "Hotel, Restaurant",
    "word": "occupancy",
    "phonetic": "/ˈɒkjʊpənsi/",
    "pos": "noun",
    "meaning": "sự cư ngụsống tại",
    "example": "The team discussed the occupancy during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự cư ngụsống tại\" trong cuộc họp.",
    "translations": {
      "vi": "sự cư ngụsống tại"
    }
  },
  {
    "id": "hot-18",
    "topic": "Hotel, Restaurant",
    "word": "chef",
    "phonetic": "/ʃˈɛf/",
    "pos": "noun",
    "meaning": "đầu bếp",
    "example": "The team discussed the chef during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"đầu bếp\" trong cuộc họp.",
    "translations": {
      "vi": "đầu bếp"
    }
  },
  {
    "id": "hot-19",
    "topic": "Hotel, Restaurant",
    "word": "decorate",
    "phonetic": "/dˈɛkəɹˌeɪt/",
    "pos": "verb",
    "meaning": "tr ang trí",
    "example": "The team plans to decorate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"tr ang trí\" trước thời hạn.",
    "translations": {
      "vi": "tr ang trí"
    }
  },
  {
    "id": "hot-20",
    "topic": "Hotel, Restaurant",
    "word": "information",
    "phonetic": "/ˌɪnfəmˈeɪʃən/",
    "pos": "noun",
    "meaning": "thông tin,t ài liệu",
    "example": "The team discussed the information during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"thông tin,t ài liệu\" trong cuộc họp.",
    "translations": {
      "vi": "thông tin,t ài liệu"
    }
  },
  {
    "id": "hot-21",
    "topic": "Hotel, Restaurant",
    "word": "cuisine",
    "phonetic": "/kwɪzˈiːn/",
    "pos": "noun",
    "meaning": "ẩm thực, cách nấu nướng",
    "example": "The team discussed the cuisine during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"ẩm thực, cách nấu nướng\" trong cuộc họp.",
    "translations": {
      "vi": "ẩm thực, cách nấu nướng"
    }
  },
  {
    "id": "hot-22",
    "topic": "Hotel, Restaurant",
    "word": "book",
    "phonetic": "/bˈʊk/",
    "pos": "verb",
    "meaning": "đặt trước",
    "example": "The team plans to book before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đặt trước\" trước thời hạn.",
    "translations": {
      "vi": "đặt trước"
    }
  },
  {
    "id": "hot-23",
    "topic": "Hotel, Restaurant",
    "word": "amenity",
    "phonetic": "/ɐmˈɛnɪti/",
    "pos": "noun",
    "meaning": "tiện nghi, sự dễ chịu",
    "example": "The team discussed the amenity during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"tiện nghi, sự dễ chịu\" trong cuộc họp.",
    "translations": {
      "vi": "tiện nghi, sự dễ chịu"
    }
  },
  {
    "id": "hot-24",
    "topic": "Hotel, Restaurant",
    "word": "ease",
    "phonetic": "/ˈiːz/",
    "pos": "verb",
    "meaning": "làm dễ chịu, làm nhẹ đi",
    "example": "The team plans to ease before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"làm dễ chịu, làm nhẹ đi\" trước thời hạn.",
    "translations": {
      "vi": "làm dễ chịu, làm nhẹ đi"
    }
  },
  {
    "id": "hot-25",
    "topic": "Hotel, Restaurant",
    "word": "ingredient",
    "phonetic": "/ɪnɡɹˈiːdiənt/",
    "pos": "noun",
    "meaning": "thành phần, nguyên liệu",
    "example": "The team discussed the ingredient during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"thành phần, nguyên liệu\" trong cuộc họp.",
    "translations": {
      "vi": "thành phần, nguyên liệu"
    }
  },
  {
    "id": "hot-26",
    "topic": "Hotel, Restaurant",
    "word": "sip",
    "phonetic": "/sˈɪp/",
    "pos": "verb",
    "meaning": "uống từng ngụm, nhấm nháp",
    "example": "The team plans to sip before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"uống từng ngụm, nhấm nháp\" trước thời hạn.",
    "translations": {
      "vi": "uống từng ngụm, nhấm nháp"
    }
  },
  {
    "id": "hot-27",
    "topic": "Hotel, Restaurant",
    "word": "complication",
    "phonetic": "/kˌɒmplɪkˈeɪʃən/",
    "pos": "noun",
    "meaning": "sự phức tạp, sự rắc rối",
    "example": "The team discussed the complication during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự phức tạp, sự rắc rối\" trong cuộc họp.",
    "translations": {
      "vi": "sự phức tạp, sự rắc rối"
    }
  },
  {
    "id": "rev-01",
    "topic": "Revenue",
    "word": "decline",
    "phonetic": "/dɪklˈaɪn/",
    "pos": "noun",
    "meaning": "sự giảm, sự sụt giảm",
    "example": "The team discussed the decline during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự giảm, sự sụt giảm\" trong cuộc họp.",
    "translations": {
      "vi": "sự giảm, sự sụt giảm"
    }
  },
  {
    "id": "rev-02",
    "topic": "Revenue",
    "word": "markedly",
    "phonetic": "/mˈɑːkɪdli/",
    "pos": "adv",
    "meaning": "rõ ràng,rõ rệt",
    "example": "The team completed the task markedly.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"rõ ràng,rõ rệt\".",
    "translations": {
      "vi": "rõ ràng,rõ rệt"
    }
  },
  {
    "id": "rev-03",
    "topic": "Revenue",
    "word": "increase",
    "phonetic": "/ˈɪnˌkɹis/",
    "pos": "noun",
    "meaning": "sự tăng, sự tăng thêm",
    "example": "The team discussed the increase during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự tăng, sự tăng thêm\" trong cuộc họp.",
    "translations": {
      "vi": "sự tăng, sự tăng thêm"
    }
  },
  {
    "id": "rev-04",
    "topic": "Revenue",
    "word": "substantial",
    "phonetic": "/səbstˈænʃəl/",
    "pos": "adj",
    "meaning": "lớn, quan trọng, có giá trị",
    "example": "The manager described the proposal as substantial.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"lớn, quan trọng, có giá trị\".",
    "translations": {
      "vi": "lớn, quan trọng, có giá trị"
    }
  },
  {
    "id": "rev-05",
    "topic": "Revenue",
    "word": "anticipate",
    "phonetic": "/æntˈɪsɪpˌeɪt/",
    "pos": "verb",
    "meaning": "thấy trước, đoán trước",
    "example": "The team plans to anticipate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"thấy trước, đoán trước\" trước thời hạn.",
    "translations": {
      "vi": "thấy trước, đoán trước"
    }
  },
  {
    "id": "rev-06",
    "topic": "Revenue",
    "word": "estimate",
    "phonetic": "/ˈɛstəˌmeɪt/",
    "pos": "verb",
    "meaning": "ước tính, ước lượng",
    "example": "The team plans to estimate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"ước tính, ước lượng\" trước thời hạn.",
    "translations": {
      "vi": "ước tính, ước lượng"
    }
  },
  {
    "id": "rev-07",
    "topic": "Revenue",
    "word": "production",
    "phonetic": "/pɹədˈʌkʃən/",
    "pos": "noun",
    "meaning": "sựs ản xuất,s ản lượng",
    "example": "The team discussed the production during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sựs ản xuất,s ản lượng\" trong cuộc họp.",
    "translations": {
      "vi": "sựs ản xuất,s ản lượng"
    }
  },
  {
    "id": "rev-08",
    "topic": "Revenue",
    "word": "impressive",
    "phonetic": "/ɪmpɹˈɛsɪv/",
    "pos": "adj",
    "meaning": "đầy ấn tượng",
    "example": "The manager described the proposal as impressive.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"đầy ấn tượng\".",
    "translations": {
      "vi": "đầy ấn tượng"
    }
  },
  {
    "id": "rev-09",
    "topic": "Revenue",
    "word": "recent",
    "phonetic": "/ɹˈiːsənt/",
    "pos": "adj",
    "meaning": "gần đây, mớix ảy ra",
    "example": "The manager described the proposal as recent.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"gần đây, mớix ảy ra\".",
    "translations": {
      "vi": "gần đây, mớix ảy ra"
    }
  },
  {
    "id": "rev-10",
    "topic": "Revenue",
    "word": "exceed",
    "phonetic": "/ɛksˈiːd/",
    "pos": "verb",
    "meaning": "vượt quá, trội hơn",
    "example": "The team plans to exceed before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"vượt quá, trội hơn\" trước thời hạn.",
    "translations": {
      "vi": "vượt quá, trội hơn"
    }
  },
  {
    "id": "rev-11",
    "topic": "Revenue",
    "word": "summarize",
    "phonetic": "/ˈsəmɝˌaɪz/",
    "pos": "verb",
    "meaning": "tóm tắt, tổngk ết",
    "example": "The team plans to summarize before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"tóm tắt, tổngk ết\" trước thời hạn.",
    "translations": {
      "vi": "tóm tắt, tổngk ết"
    }
  },
  {
    "id": "rev-12",
    "topic": "Revenue",
    "word": "growth",
    "phonetic": "/ɡɹˈəʊθ/",
    "pos": "noun",
    "meaning": "sựt ăng trưởng, sự lớn mạnh",
    "example": "The team discussed the growth during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sựt ăng trưởng, sự lớn mạnh\" trong cuộc họp.",
    "translations": {
      "vi": "sựt ăng trưởng, sự lớn mạnh"
    }
  },
  {
    "id": "rev-13",
    "topic": "Revenue",
    "word": "frequent",
    "phonetic": "/ˈfɹiˌkwɛnt/",
    "pos": "adj",
    "meaning": "thường xuy ên",
    "example": "The manager described the proposal as frequent.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"thường xuy ên\".",
    "translations": {
      "vi": "thường xuy ên"
    }
  },
  {
    "id": "rev-14",
    "topic": "Revenue",
    "word": "achieve",
    "phonetic": "/ɐtʃˈiːv/",
    "pos": "verb",
    "meaning": "đạt được, giành được",
    "example": "The team plans to achieve before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đạt được, giành được\" trước thời hạn.",
    "translations": {
      "vi": "đạt được, giành được"
    }
  },
  {
    "id": "rev-15",
    "topic": "Revenue",
    "word": "illustrate",
    "phonetic": "/ˈɪləstɹˌeɪt/",
    "pos": "verb",
    "meaning": "minh hoạ, làmrõý",
    "example": "The team plans to illustrate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"minh hoạ, làmrõý\" trước thời hạn.",
    "translations": {
      "vi": "minh hoạ, làmrõý"
    }
  },
  {
    "id": "rev-16",
    "topic": "Revenue",
    "word": "inaccurate",
    "phonetic": "/ɪnˈækjʊɹət/",
    "pos": "adj",
    "meaning": "không chính xác, sai",
    "example": "The manager described the proposal as inaccurate.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"không chính xác, sai\".",
    "translations": {
      "vi": "không chính xác, sai"
    }
  },
  {
    "id": "rev-17",
    "topic": "Revenue",
    "word": "percentage",
    "phonetic": "/pəsˈɛntɪdʒ/",
    "pos": "noun",
    "meaning": "tỷ lệ, tỷ lệ phần trăm",
    "example": "The team discussed the percentage during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"tỷ lệ, tỷ lệ phần trăm\" trong cuộc họp.",
    "translations": {
      "vi": "tỷ lệ, tỷ lệ phần trăm"
    }
  },
  {
    "id": "rev-18",
    "topic": "Revenue",
    "word": "reduce",
    "phonetic": "/ɹɪdjˈuːs/",
    "pos": "verb",
    "meaning": "giảm, giảm bớt,hạ",
    "example": "The team plans to reduce before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"giảm, giảm bớt,hạ\" trước thời hạn.",
    "translations": {
      "vi": "giảm, giảm bớt,hạ"
    }
  },
  {
    "id": "rev-19",
    "topic": "Revenue",
    "word": "tend",
    "phonetic": "/tˈɛnd/",
    "pos": "noun",
    "meaning": "có khuynh hướng",
    "example": "The team discussed the tend during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"có khuynh hướng\" trong cuộc họp.",
    "translations": {
      "vi": "có khuynh hướng"
    }
  },
  {
    "id": "rev-20",
    "topic": "Revenue",
    "word": "revenue",
    "phonetic": "/ɹˈɛvənjˌuː/",
    "pos": "noun",
    "meaning": "thu nhập, doanh thu",
    "example": "The team discussed the revenue during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"thu nhập, doanh thu\" trong cuộc họp.",
    "translations": {
      "vi": "thu nhập, doanh thu"
    }
  },
  {
    "id": "rev-21",
    "topic": "Revenue",
    "word": "projection",
    "phonetic": "/pɹədʒˈɛkʃən/",
    "pos": "noun",
    "meaning": "sự đặt kế hoạch",
    "example": "The team discussed the projection during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự đặt kế hoạch\" trong cuộc họp.",
    "translations": {
      "vi": "sự đặt kế hoạch"
    }
  },
  {
    "id": "rev-22",
    "topic": "Revenue",
    "word": "shift",
    "phonetic": "/ʃˈɪft/",
    "pos": "verb",
    "meaning": "chuyển, thay đổi",
    "example": "The team plans to shift before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"chuyển, thay đổi\" trước thời hạn.",
    "translations": {
      "vi": "chuyển, thay đổi"
    }
  },
  {
    "id": "rev-23",
    "topic": "Revenue",
    "word": "fee",
    "phonetic": "/fˈiː/",
    "pos": "noun",
    "meaning": "lệ phí, tiền thù lao",
    "example": "The team discussed the fee during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"lệ phí, tiền thù lao\" trong cuộc họp.",
    "translations": {
      "vi": "lệ phí, tiền thù lao"
    }
  },
  {
    "id": "rev-24",
    "topic": "Revenue",
    "word": "improvement",
    "phonetic": "/ɪmpɹˈuːvmənt/",
    "pos": "noun",
    "meaning": "sự cải thiện, sự cải tiến",
    "example": "The team discussed the improvement during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự cải thiện, sự cải tiến\" trong cuộc họp.",
    "translations": {
      "vi": "sự cải thiện, sự cải tiến"
    }
  },
  {
    "id": "rev-25",
    "topic": "Revenue",
    "word": "employer",
    "phonetic": "/ɛmplˈɔɪɐ/",
    "pos": "noun",
    "meaning": "chủ, người sử dụng lao động",
    "example": "The team discussed the employer during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"chủ, người sử dụng lao động\" trong cuộc họp.",
    "translations": {
      "vi": "chủ, người sử dụng lao động"
    }
  },
  {
    "id": "rev-26",
    "topic": "Revenue",
    "word": "typically",
    "phonetic": "/tˈɪpɪkli/",
    "pos": "adv",
    "meaning": "điển hình, thông thường",
    "example": "The team completed the task typically.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"điển hình, thông thường\".",
    "translations": {
      "vi": "điển hình, thông thường"
    }
  },
  {
    "id": "rev-27",
    "topic": "Revenue",
    "word": "whole",
    "phonetic": "/hˈəʊl/",
    "pos": "adj",
    "meaning": "toàn bộ, đầy đủ",
    "example": "The manager described the proposal as whole.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"toàn bộ, đầy đủ\".",
    "translations": {
      "vi": "toàn bộ, đầy đủ"
    }
  },
  {
    "id": "rev-28",
    "topic": "Revenue",
    "word": "assumption",
    "phonetic": "/ɐsˈʌmpʃən/",
    "pos": "noun",
    "meaning": "nhận định, điều giả định",
    "example": "The team discussed the assumption during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"nhận định, điều giả định\" trong cuộc họp.",
    "translations": {
      "vi": "nhận định, điều giả định"
    }
  },
  {
    "id": "rev-29",
    "topic": "Revenue",
    "word": "share",
    "phonetic": "/ʃˈeə/",
    "pos": "verb",
    "meaning": "chia sẻ, phân phát",
    "example": "The team plans to share before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"chia sẻ, phân phát\" trước thời hạn.",
    "translations": {
      "vi": "chia sẻ, phân phát"
    }
  },
  {
    "id": "rev-30",
    "topic": "Revenue",
    "word": "reliant",
    "phonetic": "/ɹɪlˈaɪənt/",
    "pos": "adj",
    "meaning": "dựav ào, nhờv ào",
    "example": "The manager described the proposal as reliant.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"dựav ào, nhờv ào\".",
    "translations": {
      "vi": "dựav ào, nhờv ào"
    }
  },
  {
    "id": "acc-01",
    "topic": "Accounting",
    "word": "recently",
    "phonetic": "/ɹˈiːsəntli/",
    "pos": "adv",
    "meaning": "gần đây",
    "example": "The team completed the task recently.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"gần đây\".",
    "translations": {
      "vi": "gần đây"
    }
  },
  {
    "id": "acc-02",
    "topic": "Accounting",
    "word": "substantially",
    "phonetic": "/səbstˈænʃəlˌi/",
    "pos": "adv",
    "meaning": "đángk ể, nhìn chung",
    "example": "The team completed the task substantially.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"đángk ể, nhìn chung\".",
    "translations": {
      "vi": "đángk ể, nhìn chung"
    }
  },
  {
    "id": "acc-03",
    "topic": "Accounting",
    "word": "frequently",
    "phonetic": "/fɹˈiːkwəntli/",
    "pos": "adv",
    "meaning": "thường xuyên",
    "example": "The team completed the task frequently.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"thường xuyên\".",
    "translations": {
      "vi": "thường xuyên"
    }
  },
  {
    "id": "acc-04",
    "topic": "Accounting",
    "word": "reimburse",
    "phonetic": "/ɹˌiːɪmbˈɜːs/",
    "pos": "verb",
    "meaning": "hoàn trả, trả lại",
    "example": "The team plans to reimburse before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"hoàn trả, trả lại\" trước thời hạn.",
    "translations": {
      "vi": "hoàn trả, trả lại"
    }
  },
  {
    "id": "acc-05",
    "topic": "Accounting",
    "word": "considerably",
    "phonetic": "/kənsˈɪdəɹəbli/",
    "pos": "adv",
    "meaning": "đáng kể",
    "example": "The team completed the task considerably.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"đáng kể\".",
    "translations": {
      "vi": "đáng kể"
    }
  },
  {
    "id": "acc-06",
    "topic": "Accounting",
    "word": "total",
    "phonetic": "/tˈəʊtəl/",
    "pos": "adj",
    "meaning": "tổng, toàn bộ",
    "example": "The manager described the proposal as total.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"tổng, toàn bộ\".",
    "translations": {
      "vi": "tổng, toàn bộ"
    }
  },
  {
    "id": "acc-07",
    "topic": "Accounting",
    "word": "allocate",
    "phonetic": "/ˈæləkˌeɪt/",
    "pos": "verb",
    "meaning": "phân bổ, phân chia",
    "example": "The team plans to allocate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"phân bổ, phân chia\" trước thời hạn.",
    "translations": {
      "vi": "phân bổ, phân chia"
    }
  },
  {
    "id": "acc-08",
    "topic": "Accounting",
    "word": "quarter",
    "phonetic": "/kwˈɔːtɐ/",
    "pos": "noun",
    "meaning": "quý; một phần tư",
    "example": "The team discussed the quarter during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"quý; một phần tư\" trong cuộc họp.",
    "translations": {
      "vi": "quý; một phần tư"
    }
  },
  {
    "id": "acc-09",
    "topic": "Accounting",
    "word": "prompt",
    "phonetic": "/pɹˈɒmpt/",
    "pos": "adj",
    "meaning": "ngay lập tức; nhanh",
    "example": "The manager described the proposal as prompt.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"ngay lập tức; nhanh\".",
    "translations": {
      "vi": "ngay lập tức; nhanh"
    }
  },
  {
    "id": "acc-10",
    "topic": "Accounting",
    "word": "shorten",
    "phonetic": "/ʃˈɔːtən/",
    "pos": "verb",
    "meaning": "rút ngắn",
    "example": "The team plans to shorten before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"rút ngắn\" trước thời hạn.",
    "translations": {
      "vi": "rút ngắn"
    }
  },
  {
    "id": "acc-11",
    "topic": "Accounting",
    "word": "calculate",
    "phonetic": "/kˈælkjʊlˌeɪt/",
    "pos": "verb",
    "meaning": "tính toán",
    "example": "The team plans to calculate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"tính toán\" trước thời hạn.",
    "translations": {
      "vi": "tính toán"
    }
  },
  {
    "id": "acc-12",
    "topic": "Accounting",
    "word": "compare",
    "phonetic": "/kəmpˈeə/",
    "pos": "verb",
    "meaning": "so sánh",
    "example": "The team plans to compare before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"so sánh\" trước thời hạn.",
    "translations": {
      "vi": "so sánh"
    }
  },
  {
    "id": "acc-13",
    "topic": "Accounting",
    "word": "fortunate",
    "phonetic": "/fˈɔːtʃənət/",
    "pos": "adj",
    "meaning": "may mắn, thuận lợi",
    "example": "The manager described the proposal as fortunate.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"may mắn, thuận lợi\".",
    "translations": {
      "vi": "may mắn, thuận lợi"
    }
  },
  {
    "id": "acc-14",
    "topic": "Accounting",
    "word": "accurately",
    "phonetic": "/ˈækjʊɹətli/",
    "pos": "adv",
    "meaning": "chính xác",
    "example": "The team completed the task accurately.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"chính xác\".",
    "translations": {
      "vi": "chính xác"
    }
  },
  {
    "id": "acc-15",
    "topic": "Accounting",
    "word": "worth",
    "phonetic": "/wˈɜːθ/",
    "pos": "adj",
    "meaning": "đáng giá, bỏ công",
    "example": "The manager described the proposal as worth.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"đáng giá, bỏ công\".",
    "translations": {
      "vi": "đáng giá, bỏ công"
    }
  },
  {
    "id": "acc-16",
    "topic": "Accounting",
    "word": "spend",
    "phonetic": "/spˈɛnd/",
    "pos": "verb",
    "meaning": "tiêu, chi tiêu, sử dụng (thời gian)",
    "example": "The team plans to spend before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"tiêu, chi tiêu, sử dụng (thời gian)\" trước thời hạn.",
    "translations": {
      "vi": "tiêu, chi tiêu, sử dụng (thời gian)"
    }
  },
  {
    "id": "acc-17",
    "topic": "Accounting",
    "word": "curtail",
    "phonetic": "/kɜːtˈeɪl/",
    "pos": "verb",
    "meaning": "cắt bớt, rút ngắn",
    "example": "The team plans to curtail before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"cắt bớt, rút ngắn\" trước thời hạn.",
    "translations": {
      "vi": "cắt bớt, rút ngắn"
    }
  },
  {
    "id": "acc-18",
    "topic": "Accounting",
    "word": "committee",
    "phonetic": "/kəˈmɪti/",
    "pos": "noun",
    "meaning": "uỷ ban",
    "example": "The team discussed the committee during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"uỷ ban\" trong cuộc họp.",
    "translations": {
      "vi": "uỷ ban"
    }
  },
  {
    "id": "acc-19",
    "topic": "Accounting",
    "word": "capability",
    "phonetic": "/kˌeɪpəbˈɪlɪti/",
    "pos": "noun",
    "meaning": "khả năng, năng lực",
    "example": "The team discussed the capability during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"khả năng, năng lực\" trong cuộc họp.",
    "translations": {
      "vi": "khả năng, năng lực"
    }
  },
  {
    "id": "acc-20",
    "topic": "Accounting",
    "word": "adequate",
    "phonetic": "/ˈædɪkwət/",
    "pos": "adj",
    "meaning": "đủ, đầy đủ",
    "example": "The manager described the proposal as adequate.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"đủ, đầy đủ\".",
    "translations": {
      "vi": "đủ, đầy đủ"
    }
  },
  {
    "id": "acc-21",
    "topic": "Accounting",
    "word": "inspector",
    "phonetic": "/ɪnspˈɛktɐ/",
    "pos": "noun",
    "meaning": "thanh tra viên",
    "example": "The team discussed the inspector during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"thanh tra viên\" trong cuộc họp.",
    "translations": {
      "vi": "thanh tra viên"
    }
  },
  {
    "id": "acc-22",
    "topic": "Accounting",
    "word": "browse",
    "phonetic": "/bɹˈaʊz/",
    "pos": "verb",
    "meaning": "đọc lướt qua, xem qua",
    "example": "The team plans to browse before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đọc lướt qua, xem qua\" trước thời hạn.",
    "translations": {
      "vi": "đọc lướt qua, xem qua"
    }
  },
  {
    "id": "acc-23",
    "topic": "Accounting",
    "word": "exempt",
    "phonetic": "/ɛɡzˈɛmpt/",
    "pos": "adj",
    "meaning": "được miễn (thuế)",
    "example": "The manager described the proposal as exempt.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"được miễn (thuế)\".",
    "translations": {
      "vi": "được miễn (thuế)"
    }
  },
  {
    "id": "acc-24",
    "topic": "Accounting",
    "word": "incidental",
    "phonetic": "/ˌɪnsɪdˈɛntəl/",
    "pos": "adj",
    "meaning": "phụ, thứy ếu; ngẫu nhiên",
    "example": "The manager described the proposal as incidental.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"phụ, thứy ếu; ngẫu nhiên\".",
    "translations": {
      "vi": "phụ, thứy ếu; ngẫu nhiên"
    }
  },
  {
    "id": "tre-01",
    "topic": "Trend of Company",
    "word": "announce",
    "phonetic": "/ɐnˈaʊns/",
    "pos": "verb",
    "meaning": "thông báo, tuy ên bố",
    "example": "The team plans to announce before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"thông báo, tuy ên bố\" trước thời hạn.",
    "translations": {
      "vi": "thông báo, tuy ên bố"
    }
  },
  {
    "id": "tre-02",
    "topic": "Trend of Company",
    "word": "interested",
    "phonetic": "/ˈɪntɹəstɪd/",
    "pos": "adj",
    "meaning": "quan tâm; có hứng thú",
    "example": "The manager described the proposal as interested.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"quan tâm; có hứng thú\".",
    "translations": {
      "vi": "quan tâm; có hứng thú"
    }
  },
  {
    "id": "tre-03",
    "topic": "Trend of Company",
    "word": "active",
    "phonetic": "/ˈæktɪv/",
    "pos": "adj",
    "meaning": "tích cực, chủ động",
    "example": "The manager described the proposal as active.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"tích cực, chủ động\".",
    "translations": {
      "vi": "tích cực, chủ động"
    }
  },
  {
    "id": "tre-04",
    "topic": "Trend of Company",
    "word": "accept",
    "phonetic": "/ɐksˈɛpt/",
    "pos": "verb",
    "meaning": "chấp nhận, thừa nhận",
    "example": "The team plans to accept before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"chấp nhận, thừa nhận\" trước thời hạn.",
    "translations": {
      "vi": "chấp nhận, thừa nhận"
    }
  },
  {
    "id": "tre-05",
    "topic": "Trend of Company",
    "word": "expansion",
    "phonetic": "/ɛkspˈænʃən/",
    "pos": "noun",
    "meaning": "sự mởr ộng, sự bành trướng",
    "example": "The team discussed the expansion during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự mởr ộng, sự bành trướng\" trong cuộc họp.",
    "translations": {
      "vi": "sự mởr ộng, sự bành trướng"
    }
  },
  {
    "id": "tre-06",
    "topic": "Trend of Company",
    "word": "relocate",
    "phonetic": "/ɹɪləʊkˈeɪt/",
    "pos": "verb",
    "meaning": "chuy ển chỗ",
    "example": "The team plans to relocate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"chuy ển chỗ\" trước thời hạn.",
    "translations": {
      "vi": "chuy ển chỗ"
    }
  },
  {
    "id": "tre-07",
    "topic": "Trend of Company",
    "word": "competitor",
    "phonetic": "/kəmpˈɛtɪtɐ/",
    "pos": "noun",
    "meaning": "đối thủ, người cạnh tr anh",
    "example": "The team discussed the competitor during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"đối thủ, người cạnh tr anh\" trong cuộc họp.",
    "translations": {
      "vi": "đối thủ, người cạnh tr anh"
    }
  },
  {
    "id": "tre-08",
    "topic": "Trend of Company",
    "word": "contribute",
    "phonetic": "/kˈɒntɹɪbjˌuːt/",
    "pos": "verb",
    "meaning": "đóng góp, góp phần",
    "example": "The team plans to contribute before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đóng góp, góp phần\" trước thời hạn.",
    "translations": {
      "vi": "đóng góp, góp phần"
    }
  },
  {
    "id": "tre-09",
    "topic": "Trend of Company",
    "word": "dedicated",
    "phonetic": "/dˈɛdɪkˌeɪtɪd/",
    "pos": "adj",
    "meaning": "tậnt âm, nhiệt tình, cống hiến",
    "example": "The manager described the proposal as dedicated.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"tậnt âm, nhiệt tình, cống hiến\".",
    "translations": {
      "vi": "tậnt âm, nhiệt tình, cống hiến"
    }
  },
  {
    "id": "tre-10",
    "topic": "Trend of Company",
    "word": "considerable",
    "phonetic": "/kənsˈɪdəɹəbəl/",
    "pos": "adj",
    "meaning": "đángkể",
    "example": "The manager described the proposal as considerable.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"đángkể\".",
    "translations": {
      "vi": "đángkể"
    }
  },
  {
    "id": "tre-11",
    "topic": "Trend of Company",
    "word": "last",
    "phonetic": "/lˈɑːst/",
    "pos": "verb",
    "meaning": "kéo dài,t ồnt ại",
    "example": "The team plans to last before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"kéo dài,t ồnt ại\" trước thời hạn.",
    "translations": {
      "vi": "kéo dài,t ồnt ại"
    }
  },
  {
    "id": "tre-12",
    "topic": "Trend of Company",
    "word": "emerge",
    "phonetic": "/ɪmˈɜːdʒ/",
    "pos": "verb",
    "meaning": "nổi lên,x ảyra",
    "example": "The team plans to emerge before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"nổi lên,x ảyra\" trước thời hạn.",
    "translations": {
      "vi": "nổi lên,x ảyra"
    }
  },
  {
    "id": "tre-13",
    "topic": "Trend of Company",
    "word": "select",
    "phonetic": "/sɪlˈɛkt/",
    "pos": "verb",
    "meaning": "lựa chọn, tuy ển chọn",
    "example": "The team plans to select before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"lựa chọn, tuy ển chọn\" trước thời hạn.",
    "translations": {
      "vi": "lựa chọn, tuy ển chọn"
    }
  },
  {
    "id": "tre-14",
    "topic": "Trend of Company",
    "word": "vital",
    "phonetic": "/vˈaɪtəl/",
    "pos": "adj",
    "meaning": "sống còn, quan tr ọng",
    "example": "The manager described the proposal as vital.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"sống còn, quan tr ọng\".",
    "translations": {
      "vi": "sống còn, quan tr ọng"
    }
  },
  {
    "id": "tre-15",
    "topic": "Trend of Company",
    "word": "persist",
    "phonetic": "/pəsˈɪst/",
    "pos": "verb",
    "meaning": "kiên trì, vẫn còn",
    "example": "The team plans to persist before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"kiên trì, vẫn còn\" trước thời hạn.",
    "translations": {
      "vi": "kiên trì, vẫn còn"
    }
  },
  {
    "id": "tre-16",
    "topic": "Trend of Company",
    "word": "independent",
    "phonetic": "/ˌɪndɪpˈɛndənt/",
    "pos": "adj",
    "meaning": "độc lập, không lệ thuộc",
    "example": "The manager described the proposal as independent.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"độc lập, không lệ thuộc\".",
    "translations": {
      "vi": "độc lập, không lệ thuộc"
    }
  },
  {
    "id": "tre-17",
    "topic": "Trend of Company",
    "word": "force",
    "phonetic": "/fˈɔːs/",
    "pos": "noun",
    "meaning": "lực, quy ền lực",
    "example": "The team discussed the force during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"lực, quy ền lực\" trong cuộc họp.",
    "translations": {
      "vi": "lực, quy ền lực"
    }
  },
  {
    "id": "tre-18",
    "topic": "Trend of Company",
    "word": "renowned",
    "phonetic": "/ɹɪnˈaʊnd/",
    "pos": "adj",
    "meaning": "nổi tiếng, có tiếng",
    "example": "The manager described the proposal as renowned.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"nổi tiếng, có tiếng\".",
    "translations": {
      "vi": "nổi tiếng, có tiếng"
    }
  },
  {
    "id": "tre-19",
    "topic": "Trend of Company",
    "word": "informed",
    "phonetic": "/ɪnfˈɔːmd/",
    "pos": "adj",
    "meaning": "có hiểu biết, am hiểu",
    "example": "The manager described the proposal as informed.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"có hiểu biết, am hiểu\".",
    "translations": {
      "vi": "có hiểu biết, am hiểu"
    }
  },
  {
    "id": "tre-20",
    "topic": "Trend of Company",
    "word": "waive",
    "phonetic": "/wˈeɪv/",
    "pos": "verb",
    "meaning": "miễn, từ bỏ",
    "example": "The team plans to waive before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"miễn, từ bỏ\" trước thời hạn.",
    "translations": {
      "vi": "miễn, từ bỏ"
    }
  },
  {
    "id": "tre-21",
    "topic": "Trend of Company",
    "word": "reach",
    "phonetic": "/ɹˈiːtʃ/",
    "pos": "verb",
    "meaning": "đạt tới; đi tới",
    "example": "The team plans to reach before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đạt tới; đi tới\" trước thời hạn.",
    "translations": {
      "vi": "đạt tới; đi tới"
    }
  },
  {
    "id": "tre-22",
    "topic": "Trend of Company",
    "word": "acquire",
    "phonetic": "/ɐkwˈaɪə/",
    "pos": "verb",
    "meaning": "giành được, thu được",
    "example": "The team plans to acquire before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"giành được, thu được\" trước thời hạn.",
    "translations": {
      "vi": "giành được, thu được"
    }
  },
  {
    "id": "tre-23",
    "topic": "Trend of Company",
    "word": "simultaneously",
    "phonetic": "/sˌɪməltˈeɪniəsli/",
    "pos": "adv",
    "meaning": "đồng thời, cùng lúc",
    "example": "The team completed the task simultaneously.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"đồng thời, cùng lúc\".",
    "translations": {
      "vi": "đồng thời, cùng lúc"
    }
  },
  {
    "id": "tre-24",
    "topic": "Trend of Company",
    "word": "reveal",
    "phonetic": "/ɹɪvˈiːl/",
    "pos": "verb",
    "meaning": "hé lộ, tiết lộ, khám phá",
    "example": "The team plans to reveal before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"hé lộ, tiết lộ, khám phá\" trước thời hạn.",
    "translations": {
      "vi": "hé lộ, tiết lộ, khám phá"
    }
  },
  {
    "id": "tre-25",
    "topic": "Trend of Company",
    "word": "uncertain",
    "phonetic": "/ʌnsˈɜːtən/",
    "pos": "adj",
    "meaning": "không chắc chắn",
    "example": "The manager described the proposal as uncertain.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"không chắc chắn\".",
    "translations": {
      "vi": "không chắc chắn"
    }
  },
  {
    "id": "tre-26",
    "topic": "Trend of Company",
    "word": "asset",
    "phonetic": "/ˈæsɛt/",
    "pos": "noun",
    "meaning": "tàis ản, của cải",
    "example": "The team discussed the asset during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"tàis ản, của cải\" trong cuộc họp.",
    "translations": {
      "vi": "tàis ản, của cải"
    }
  },
  {
    "id": "tre-27",
    "topic": "Trend of Company",
    "word": "misplace",
    "phonetic": "/mɪsplˈeɪs/",
    "pos": "verb",
    "meaning": "đặt nhầm chỗ, làm thất lạc",
    "example": "The team plans to misplace before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đặt nhầm chỗ, làm thất lạc\" trước thời hạn.",
    "translations": {
      "vi": "đặt nhầm chỗ, làm thất lạc"
    }
  },
  {
    "id": "tre-28",
    "topic": "Trend of Company",
    "word": "grow",
    "phonetic": "/ɡɹˈəʊ/",
    "pos": "verb",
    "meaning": "mọc lên, lớn lên, phát triển",
    "example": "The team plans to grow before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"mọc lên, lớn lên, phát triển\" trước thời hạn.",
    "translations": {
      "vi": "mọc lên, lớn lên, phát triển"
    }
  },
  {
    "id": "tre-29",
    "topic": "Trend of Company",
    "word": "merge",
    "phonetic": "/mˈɜːdʒ/",
    "pos": "verb",
    "meaning": "kết hợp, hợp nhất, sáp nhập",
    "example": "The team plans to merge before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"kết hợp, hợp nhất, sáp nhập\" trước thời hạn.",
    "translations": {
      "vi": "kết hợp, hợp nhất, sáp nhập"
    }
  },
  {
    "id": "tre-30",
    "topic": "Trend of Company",
    "word": "imply",
    "phonetic": "/ɪmplˈaɪ/",
    "pos": "verb",
    "meaning": "ýnói, ngụý",
    "example": "The team plans to imply before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"ýnói, ngụý\" trước thời hạn.",
    "translations": {
      "vi": "ýnói, ngụý"
    }
  },
  {
    "id": "tre-31",
    "topic": "Trend of Company",
    "word": "initiate",
    "phonetic": "/ˌɪˈnɪʃiˌeɪt/",
    "pos": "verb",
    "meaning": "khởi đầu, bắt đầu",
    "example": "The team plans to initiate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"khởi đầu, bắt đầu\" trước thời hạn.",
    "translations": {
      "vi": "khởi đầu, bắt đầu"
    }
  },
  {
    "id": "tre-32",
    "topic": "Trend of Company",
    "word": "enhance",
    "phonetic": "/ɛnhˈɑːns/",
    "pos": "verb",
    "meaning": "tăng cường, nâng cao",
    "example": "The team plans to enhance before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"tăng cường, nâng cao\" trước thời hạn.",
    "translations": {
      "vi": "tăng cường, nâng cao"
    }
  },
  {
    "id": "tre-33",
    "topic": "Trend of Company",
    "word": "minutes",
    "phonetic": "/mˈɪnɪts/",
    "pos": "noun",
    "meaning": "biên bản",
    "example": "The team discussed the minutes during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"biên bản\" trong cuộc họp.",
    "translations": {
      "vi": "biên bản"
    }
  },
  {
    "id": "tre-34",
    "topic": "Trend of Company",
    "word": "surpass",
    "phonetic": "/səpˈɑːs/",
    "pos": "verb",
    "meaning": "vượt, tr ội hơn",
    "example": "The team plans to surpass before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"vượt, tr ội hơn\" trước thời hạn.",
    "translations": {
      "vi": "vượt, tr ội hơn"
    }
  },
  {
    "id": "tre-35",
    "topic": "Trend of Company",
    "word": "run",
    "phonetic": "/ɹˈʌn/",
    "pos": "verb",
    "meaning": "quản lý,v ận hành",
    "example": "The team plans to run before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"quản lý,v ận hành\" trước thời hạn.",
    "translations": {
      "vi": "quản lý,v ận hành"
    }
  },
  {
    "id": "tre-36",
    "topic": "Trend of Company",
    "word": "edge",
    "phonetic": "/ˈɛdʒ/",
    "pos": "noun",
    "meaning": "lợi thế; rìa, cạnh",
    "example": "The team discussed the edge during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"lợi thế; rìa, cạnh\" trong cuộc họp.",
    "translations": {
      "vi": "lợi thế; rìa, cạnh"
    }
  },
  {
    "id": "mee-01",
    "topic": "Meeting",
    "word": "coordination",
    "phonetic": "/kəʊˈɔːdɪnˈeɪʃən/",
    "pos": "adj",
    "meaning": "tích cực, chủ động",
    "example": "The manager described the proposal as coordination.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"tích cực, chủ động\".",
    "translations": {
      "vi": "tích cực, chủ động"
    }
  },
  {
    "id": "mee-02",
    "topic": "Meeting",
    "word": "unanimous",
    "phonetic": "/juːnˈænɪməs/",
    "pos": "adj",
    "meaning": "nhất trí, nhấtt âm",
    "example": "The manager described the proposal as unanimous.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"nhất trí, nhấtt âm\".",
    "translations": {
      "vi": "nhất trí, nhấtt âm"
    }
  },
  {
    "id": "mee-03",
    "topic": "Meeting",
    "word": "consensus",
    "phonetic": "/kənsˈɛnsəs/",
    "pos": "noun",
    "meaning": "sự đồng thuận, sự nhất trí",
    "example": "The team discussed the consensus during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự đồng thuận, sự nhất trí\" trong cuộc họp.",
    "translations": {
      "vi": "sự đồng thuận, sự nhất trí"
    }
  },
  {
    "id": "mee-04",
    "topic": "Meeting",
    "word": "reschedule",
    "phonetic": "/ɹɪstʃˈɛdjuːl/",
    "pos": "verb",
    "meaning": "dời lịch, đổi lịch",
    "example": "The team plans to reschedule before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"dời lịch, đổi lịch\" trước thời hạn.",
    "translations": {
      "vi": "dời lịch, đổi lịch"
    }
  },
  {
    "id": "mee-05",
    "topic": "Meeting",
    "word": "determine",
    "phonetic": "/dɪtˈɜːmɪn/",
    "pos": "verb",
    "meaning": "xác định, quyết định",
    "example": "The team plans to determine before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"xác định, quyết định\" trước thời hạn.",
    "translations": {
      "vi": "xác định, quyết định"
    }
  },
  {
    "id": "mee-06",
    "topic": "Meeting",
    "word": "approve",
    "phonetic": "/ɐpɹˈuːv/",
    "pos": "verb",
    "meaning": "chấp thuận, phê chuẩn",
    "example": "The team plans to approve before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"chấp thuận, phê chuẩn\" trước thời hạn.",
    "translations": {
      "vi": "chấp thuận, phê chuẩn"
    }
  },
  {
    "id": "mee-07",
    "topic": "Meeting",
    "word": "enclosed",
    "phonetic": "/ɛnklˈəʊzd/",
    "pos": "adj",
    "meaning": "được gửi kèm, kèm theo",
    "example": "The manager described the proposal as enclosed.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"được gửi kèm, kèm theo\".",
    "translations": {
      "vi": "được gửi kèm, kèm theo"
    }
  },
  {
    "id": "mee-08",
    "topic": "Meeting",
    "word": "easy",
    "phonetic": "/ˈiːzi/",
    "pos": "adj",
    "meaning": "dễ dàng, đơn giản",
    "example": "The manager described the proposal as easy.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"dễ dàng, đơn giản\".",
    "translations": {
      "vi": "dễ dàng, đơn giản"
    }
  },
  {
    "id": "mee-09",
    "topic": "Meeting",
    "word": "suggestion",
    "phonetic": "/sədʒˈɛstʃən/",
    "pos": "noun",
    "meaning": "sự đề nghị, đề xuất",
    "example": "The team discussed the suggestion during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự đề nghị, đề xuất\" trong cuộc họp.",
    "translations": {
      "vi": "sự đề nghị, đề xuất"
    }
  },
  {
    "id": "mee-10",
    "topic": "Meeting",
    "word": "attention",
    "phonetic": "/ɐtˈɛnʃən/",
    "pos": "noun",
    "meaning": "sự chú ý, sự chăm sóc",
    "example": "The team discussed the attention during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự chú ý, sự chăm sóc\" trong cuộc họp.",
    "translations": {
      "vi": "sự chú ý, sự chăm sóc"
    }
  },
  {
    "id": "mee-11",
    "topic": "Meeting",
    "word": "object",
    "phonetic": "/ˈɑbdʒɛkt/",
    "pos": "verb",
    "meaning": "phản đối, chống",
    "example": "The team plans to object before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"phản đối, chống\" trước thời hạn.",
    "translations": {
      "vi": "phản đối, chống"
    }
  },
  {
    "id": "mee-12",
    "topic": "Meeting",
    "word": "undergo",
    "phonetic": "/ˌʌndəɡˈəʊ/",
    "pos": "verb",
    "meaning": "chịu, bị, trải qua",
    "example": "The team plans to undergo before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"chịu, bị, trải qua\" trước thời hạn.",
    "translations": {
      "vi": "chịu, bị, trải qua"
    }
  },
  {
    "id": "mee-13",
    "topic": "Meeting",
    "word": "outcome",
    "phonetic": "/ˈaʊtkʌm/",
    "pos": "noun",
    "meaning": "kết quả, hậu quả",
    "example": "The team discussed the outcome during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"kết quả, hậu quả\" trong cuộc họp.",
    "translations": {
      "vi": "kết quả, hậu quả"
    }
  },
  {
    "id": "mee-14",
    "topic": "Meeting",
    "word": "give",
    "phonetic": "/ɡˈɪv/",
    "pos": "verb",
    "meaning": "đưa ra, cho, tặng",
    "example": "The team plans to give before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đưa ra, cho, tặng\" trước thời hạn.",
    "translations": {
      "vi": "đưa ra, cho, tặng"
    }
  },
  {
    "id": "mee-15",
    "topic": "Meeting",
    "word": "distract",
    "phonetic": "/dɪstɹˈækt/",
    "pos": "verb",
    "meaning": "làm sao nhãng, gây phân tâm",
    "example": "The team plans to distract before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"làm sao nhãng, gây phân tâm\" trước thời hạn.",
    "translations": {
      "vi": "làm sao nhãng, gây phân tâm"
    }
  },
  {
    "id": "mee-16",
    "topic": "Meeting",
    "word": "emphasis",
    "phonetic": "/ˈɛmfəsˌɪs/",
    "pos": "noun",
    "meaning": "sự nhấn mạnh",
    "example": "The team discussed the emphasis during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự nhấn mạnh\" trong cuộc họp.",
    "translations": {
      "vi": "sự nhấn mạnh"
    }
  },
  {
    "id": "mee-17",
    "topic": "Meeting",
    "word": "organize",
    "phonetic": "/ˈɔɹɡəˌnaɪz/",
    "pos": "verb",
    "meaning": "tổ chức, thiết lập",
    "example": "The team plans to organize before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"tổ chức, thiết lập\" trước thời hạn.",
    "translations": {
      "vi": "tổ chức, thiết lập"
    }
  },
  {
    "id": "mee-18",
    "topic": "Meeting",
    "word": "persuasive",
    "phonetic": "/pəswˈeɪsɪv/",
    "pos": "adj",
    "meaning": "có sức thuyết phục",
    "example": "The manager described the proposal as persuasive.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"có sức thuyết phục\".",
    "translations": {
      "vi": "có sức thuyết phục"
    }
  },
  {
    "id": "mee-19",
    "topic": "Meeting",
    "word": "constructive",
    "phonetic": "/kənstɹˈʌktɪv/",
    "pos": "adj",
    "meaning": "mang tínhx ây dựng",
    "example": "The manager described the proposal as constructive.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"mang tínhx ây dựng\".",
    "translations": {
      "vi": "mang tínhx ây dựng"
    }
  },
  {
    "id": "mee-20",
    "topic": "Meeting",
    "word": "irrelevant",
    "phonetic": "/ɪɹˈɛlɪvənt/",
    "pos": "adj",
    "meaning": "không liên quan",
    "example": "The manager described the proposal as irrelevant.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"không liên quan\".",
    "translations": {
      "vi": "không liên quan"
    }
  },
  {
    "id": "mee-21",
    "topic": "Meeting",
    "word": "refute",
    "phonetic": "/ɹɪfjˈuːt/",
    "pos": "verb",
    "meaning": "bác bỏ, bẻ lại",
    "example": "The team plans to refute before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"bác bỏ, bẻ lại\" trước thời hạn.",
    "translations": {
      "vi": "bác bỏ, bẻ lại"
    }
  },
  {
    "id": "mee-22",
    "topic": "Meeting",
    "word": "defer",
    "phonetic": "/dɪfˈɜː/",
    "pos": "verb",
    "meaning": "hoãn, trì hoãn",
    "example": "The team plans to defer before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"hoãn, trì hoãn\" trước thời hạn.",
    "translations": {
      "vi": "hoãn, trì hoãn"
    }
  },
  {
    "id": "mee-23",
    "topic": "Meeting",
    "word": "meeting",
    "phonetic": "/mˈiːtɪŋ/",
    "pos": "noun",
    "meaning": "cuộc họp, cuộc gặp",
    "example": "The team discussed the meeting during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"cuộc họp, cuộc gặp\" trong cuộc họp.",
    "translations": {
      "vi": "cuộc họp, cuộc gặp"
    }
  },
  {
    "id": "mee-24",
    "topic": "Meeting",
    "word": "comment",
    "phonetic": "/kˈɒmɛnt/",
    "pos": "verb",
    "meaning": "bình luận, đưaraý kiến",
    "example": "The team plans to comment before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"bình luận, đưaraý kiến\" trước thời hạn.",
    "translations": {
      "vi": "bình luận, đưaraý kiến"
    }
  },
  {
    "id": "mee-25",
    "topic": "Meeting",
    "word": "phase",
    "phonetic": "/fˈeɪz/",
    "pos": "noun",
    "meaning": "bước, giai đoạn",
    "example": "The team discussed the phase during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"bước, giai đoạn\" trong cuộc họp.",
    "translations": {
      "vi": "bước, giai đoạn"
    }
  },
  {
    "id": "mee-26",
    "topic": "Meeting",
    "word": "coincidentally",
    "phonetic": "/kəʊˌɪnsɪdˈɛntəli/",
    "pos": "adv",
    "meaning": "trùng hợp, ngẫu nhiên",
    "example": "The team completed the task coincidentally.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"trùng hợp, ngẫu nhiên\".",
    "translations": {
      "vi": "trùng hợp, ngẫu nhiên"
    }
  },
  {
    "id": "mee-27",
    "topic": "Meeting",
    "word": "crowded",
    "phonetic": "/kɹˈaʊdɪd/",
    "pos": "adj",
    "meaning": "đông đúc, chật ních",
    "example": "The manager described the proposal as crowded.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"đông đúc, chật ních\".",
    "translations": {
      "vi": "đông đúc, chật ních"
    }
  },
  {
    "id": "mee-28",
    "topic": "Meeting",
    "word": "press",
    "phonetic": "/pɹˈɛs/",
    "pos": "noun",
    "meaning": "báo chí",
    "example": "The team discussed the press during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"báo chí\" trong cuộc họp.",
    "translations": {
      "vi": "báo chí"
    }
  },
  {
    "id": "mee-29",
    "topic": "Meeting",
    "word": "adjourn",
    "phonetic": "/ɐdʒˈɜːn/",
    "pos": "verb",
    "meaning": "hoãn lại, ngừng",
    "example": "The team plans to adjourn before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"hoãn lại, ngừng\" trước thời hạn.",
    "translations": {
      "vi": "hoãn lại, ngừng"
    }
  },
  {
    "id": "mee-30",
    "topic": "Meeting",
    "word": "preside",
    "phonetic": "/pɹɪsˈaɪd/",
    "pos": "verb",
    "meaning": "chủ trì, chủ toạ",
    "example": "The team plans to preside before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"chủ trì, chủ toạ\" trước thời hạn.",
    "translations": {
      "vi": "chủ trì, chủ toạ"
    }
  },
  {
    "id": "ben-01",
    "topic": "Employee Benefits",
    "word": "purpose",
    "phonetic": "/pˈɜːpəs/",
    "pos": "noun",
    "meaning": "mục đích,ý định",
    "example": "The team discussed the purpose during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"mục đích,ý định\" trong cuộc họp.",
    "translations": {
      "vi": "mục đích,ý định"
    }
  },
  {
    "id": "ben-02",
    "topic": "Employee Benefits",
    "word": "lecture",
    "phonetic": "/lˈɛktʃɐ/",
    "pos": "noun",
    "meaning": "bài giảng, bài diễn thuyết",
    "example": "The team discussed the lecture during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"bài giảng, bài diễn thuyết\" trong cuộc họp.",
    "translations": {
      "vi": "bài giảng, bài diễn thuyết"
    }
  },
  {
    "id": "ben-03",
    "topic": "Employee Benefits",
    "word": "participant",
    "phonetic": "/pɑːtˈɪsɪpənt/",
    "pos": "noun",
    "meaning": "người tham gia/tham dự",
    "example": "The team discussed the participant during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"người tham gia/tham dự\" trong cuộc họp.",
    "translations": {
      "vi": "người tham gia/tham dự"
    }
  },
  {
    "id": "ben-04",
    "topic": "Employee Benefits",
    "word": "attend",
    "phonetic": "/ɐtˈɛnd/",
    "pos": "verb",
    "meaning": "dự, có mặt",
    "example": "The team plans to attend before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"dự, có mặt\" trước thời hạn.",
    "translations": {
      "vi": "dự, có mặt"
    }
  },
  {
    "id": "ben-05",
    "topic": "Employee Benefits",
    "word": "schedule",
    "phonetic": "/ʃˈɛdjuːl/",
    "pos": "verb",
    "meaning": "xếp lịch, lên lịch",
    "example": "The team plans to schedule before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"xếp lịch, lên lịch\" trước thời hạn.",
    "translations": {
      "vi": "xếp lịch, lên lịch"
    }
  },
  {
    "id": "ben-06",
    "topic": "Employee Benefits",
    "word": "include",
    "phonetic": "/ɪnklˈuːd/",
    "pos": "verb",
    "meaning": "bao gồm",
    "example": "The team plans to include before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"bao gồm\" trước thời hạn.",
    "translations": {
      "vi": "bao gồm"
    }
  },
  {
    "id": "ben-07",
    "topic": "Employee Benefits",
    "word": "require",
    "phonetic": "/ɹɪkwˈaɪə/",
    "pos": "verb",
    "meaning": "đòi hỏi,y êu cầu",
    "example": "The team plans to require before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đòi hỏi,y êu cầu\" trước thời hạn.",
    "translations": {
      "vi": "đòi hỏi,y êu cầu"
    }
  },
  {
    "id": "ben-08",
    "topic": "Employee Benefits",
    "word": "responsibility",
    "phonetic": "/ɹɪspˌɒnsəbˈɪlɪti/",
    "pos": "noun",
    "meaning": "tr ách nhiệm",
    "example": "The team discussed the responsibility during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"tr ách nhiệm\" trong cuộc họp.",
    "translations": {
      "vi": "tr ách nhiệm"
    }
  },
  {
    "id": "ben-09",
    "topic": "Employee Benefits",
    "word": "regard",
    "phonetic": "/ɹɪɡˈɑːd/",
    "pos": "verb",
    "meaning": "coi như, xem như",
    "example": "The team plans to regard before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"coi như, xem như\" trước thời hạn.",
    "translations": {
      "vi": "coi như, xem như"
    }
  },
  {
    "id": "ben-10",
    "topic": "Employee Benefits",
    "word": "tentative",
    "phonetic": "/tˈɛntətˌɪv/",
    "pos": "adj",
    "meaning": "chưa chắc chắn, ướm thử",
    "example": "The manager described the proposal as tentative.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"chưa chắc chắn, ướm thử\".",
    "translations": {
      "vi": "chưa chắc chắn, ướm thử"
    }
  },
  {
    "id": "ben-11",
    "topic": "Employee Benefits",
    "word": "function",
    "phonetic": "/fˈʌŋkʃən/",
    "pos": "noun",
    "meaning": "chức năng, nhiệm vụ",
    "example": "The team discussed the function during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"chức năng, nhiệm vụ\" trong cuộc họp.",
    "translations": {
      "vi": "chức năng, nhiệm vụ"
    }
  },
  {
    "id": "ben-12",
    "topic": "Employee Benefits",
    "word": "reimbursement",
    "phonetic": "/ɹˌiːɪmbˈɜːsmənt/",
    "pos": "noun",
    "meaning": "sự hoàn tiền, sự trả lại",
    "example": "The team discussed the reimbursement during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự hoàn tiền, sự trả lại\" trong cuộc họp.",
    "translations": {
      "vi": "sự hoàn tiền, sự trả lại"
    }
  },
  {
    "id": "ben-13",
    "topic": "Employee Benefits",
    "word": "treatment",
    "phonetic": "/tɹˈiːtmənt/",
    "pos": "noun",
    "meaning": "sự đối xửcư xử",
    "example": "The team discussed the treatment during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự đối xửcư xử\" trong cuộc họp.",
    "translations": {
      "vi": "sự đối xửcư xử"
    }
  },
  {
    "id": "ben-14",
    "topic": "Employee Benefits",
    "word": "honor",
    "phonetic": "/ˈɒnɐ/",
    "pos": "noun",
    "meaning": "niềm vinh dự, danh dự",
    "example": "The team discussed the honor during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"niềm vinh dự, danh dự\" trong cuộc họp.",
    "translations": {
      "vi": "niềm vinh dự, danh dự"
    }
  },
  {
    "id": "ben-15",
    "topic": "Employee Benefits",
    "word": "bonus",
    "phonetic": "/bˈəʊnəs/",
    "pos": "noun",
    "meaning": "tiền thưởng, lợi tức thêmv ào",
    "example": "The team discussed the bonus during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"tiền thưởng, lợi tức thêmv ào\" trong cuộc họp.",
    "translations": {
      "vi": "tiền thưởng, lợi tức thêmv ào"
    }
  },
  {
    "id": "ben-16",
    "topic": "Employee Benefits",
    "word": "salary",
    "phonetic": "/sˈæləɹi/",
    "pos": "noun",
    "meaning": "lương",
    "example": "The team discussed the salary during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"lương\" trong cuộc họp.",
    "translations": {
      "vi": "lương"
    }
  },
  {
    "id": "ben-17",
    "topic": "Employee Benefits",
    "word": "labor",
    "phonetic": "/lˈeɪbɐ/",
    "pos": "noun",
    "meaning": "lao động, nhân công",
    "example": "The team discussed the labor during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"lao động, nhân công\" trong cuộc họp.",
    "translations": {
      "vi": "lao động, nhân công"
    }
  },
  {
    "id": "ben-18",
    "topic": "Employee Benefits",
    "word": "existing",
    "phonetic": "/ɛɡzˈɪstɪŋ/",
    "pos": "adj",
    "meaning": "hiện tại, hiện hành",
    "example": "The manager described the proposal as existing.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"hiện tại, hiện hành\".",
    "translations": {
      "vi": "hiện tại, hiện hành"
    }
  },
  {
    "id": "ben-19",
    "topic": "Employee Benefits",
    "word": "annual",
    "phonetic": "/ˈænjuːəl/",
    "pos": "adj",
    "meaning": "hằng năm, thường niên",
    "example": "The manager described the proposal as annual.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"hằng năm, thường niên\".",
    "translations": {
      "vi": "hằng năm, thường niên"
    }
  },
  {
    "id": "ben-20",
    "topic": "Employee Benefits",
    "word": "enroll",
    "phonetic": "/ɛnɹˈəʊl/",
    "pos": "verb",
    "meaning": "ghi danh, đăng ký",
    "example": "The team plans to enroll before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"ghi danh, đăng ký\" trước thời hạn.",
    "translations": {
      "vi": "ghi danh, đăng ký"
    }
  },
  {
    "id": "ben-21",
    "topic": "Employee Benefits",
    "word": "leave",
    "phonetic": "/lˈiːv/",
    "pos": "noun",
    "meaning": "sự nghỉ phép",
    "example": "The team discussed the leave during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự nghỉ phép\" trong cuộc họp.",
    "translations": {
      "vi": "sự nghỉ phép"
    }
  },
  {
    "id": "ben-22",
    "topic": "Employee Benefits",
    "word": "conference",
    "phonetic": "/kˈɒnfɹəns/",
    "pos": "noun",
    "meaning": "cuộc họp, hội nghị",
    "example": "The team discussed the conference during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"cuộc họp, hội nghị\" trong cuộc họp.",
    "translations": {
      "vi": "cuộc họp, hội nghị"
    }
  },
  {
    "id": "ben-23",
    "topic": "Employee Benefits",
    "word": "grateful",
    "phonetic": "/ɡɹˈeɪtfəl/",
    "pos": "adj",
    "meaning": "biết ơn",
    "example": "The manager described the proposal as grateful.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"biết ơn\".",
    "translations": {
      "vi": "biết ơn"
    }
  },
  {
    "id": "ben-24",
    "topic": "Employee Benefits",
    "word": "overtime",
    "phonetic": "/ˈəʊvətˌaɪm/",
    "pos": "noun",
    "meaning": "giờ làm thêm",
    "example": "The team discussed the overtime during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"giờ làm thêm\" trong cuộc họp.",
    "translations": {
      "vi": "giờ làm thêm"
    }
  },
  {
    "id": "ben-25",
    "topic": "Employee Benefits",
    "word": "assent",
    "phonetic": "/ɐsˈɛnt/",
    "pos": "verb",
    "meaning": "tán thành, đồngý",
    "example": "The team plans to assent before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"tán thành, đồngý\" trước thời hạn.",
    "translations": {
      "vi": "tán thành, đồngý"
    }
  },
  {
    "id": "ben-26",
    "topic": "Employee Benefits",
    "word": "commence",
    "phonetic": "/kəmˈɛns/",
    "pos": "verb",
    "meaning": "bắt đầu, khởi đầu",
    "example": "The team plans to commence before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"bắt đầu, khởi đầu\" trước thời hạn.",
    "translations": {
      "vi": "bắt đầu, khởi đầu"
    }
  },
  {
    "id": "ben-27",
    "topic": "Employee Benefits",
    "word": "excited",
    "phonetic": "/ɛksˈaɪtɪd/",
    "pos": "adj",
    "meaning": "hào hứng, phấn khích",
    "example": "The manager described the proposal as excited.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"hào hứng, phấn khích\".",
    "translations": {
      "vi": "hào hứng, phấn khích"
    }
  },
  {
    "id": "ben-28",
    "topic": "Employee Benefits",
    "word": "emphasize",
    "phonetic": "/ˈɛmfəˌsaɪz/",
    "pos": "verb",
    "meaning": "nhấn mạnh",
    "example": "The team plans to emphasize before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"nhấn mạnh\" trước thời hạn.",
    "translations": {
      "vi": "nhấn mạnh"
    }
  },
  {
    "id": "ben-29",
    "topic": "Employee Benefits",
    "word": "arise",
    "phonetic": "/ɐɹˈaɪz/",
    "pos": "verb",
    "meaning": "xuất hiện, phát sinh, xảyra",
    "example": "The team plans to arise before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"xuất hiện, phát sinh, xảyra\" trước thời hạn.",
    "translations": {
      "vi": "xuất hiện, phát sinh, xảyra"
    }
  },
  {
    "id": "ben-30",
    "topic": "Employee Benefits",
    "word": "exploit",
    "phonetic": "/ˈɛksˌpɫɔɪt/",
    "pos": "verb",
    "meaning": "khai thác, lợi dụng, bóc lột",
    "example": "The team plans to exploit before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"khai thác, lợi dụng, bóc lột\" trước thời hạn.",
    "translations": {
      "vi": "khai thác, lợi dụng, bóc lột"
    }
  },
  {
    "id": "ben-31",
    "topic": "Employee Benefits",
    "word": "appraisal",
    "phonetic": "/ɐpɹˈeɪsəl/",
    "pos": "noun",
    "meaning": "sự đánh giá, sự thẩm định",
    "example": "The team discussed the appraisal during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự đánh giá, sự thẩm định\" trong cuộc họp.",
    "translations": {
      "vi": "sự đánh giá, sự thẩm định"
    }
  },
  {
    "id": "ben-32",
    "topic": "Employee Benefits",
    "word": "radically",
    "phonetic": "/ɹˈædɪkli/",
    "pos": "adv",
    "meaning": "căn bản,t ận gốc, triệt để",
    "example": "The team completed the task radically.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"căn bản,t ận gốc, triệt để\".",
    "translations": {
      "vi": "căn bản,t ận gốc, triệt để"
    }
  },
  {
    "id": "ben-33",
    "topic": "Employee Benefits",
    "word": "exceptional",
    "phonetic": "/ɛksˈɛpʃənəl/",
    "pos": "adj",
    "meaning": "xuất chúng, đặc biệt",
    "example": "The manager described the proposal as exceptional.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"xuất chúng, đặc biệt\".",
    "translations": {
      "vi": "xuất chúng, đặc biệt"
    }
  },
  {
    "id": "ben-34",
    "topic": "Employee Benefits",
    "word": "appreciation",
    "phonetic": "/ɐpɹˌiːʃɪˈeɪʃən/",
    "pos": "noun",
    "meaning": "sự đánh giá cao, sự cảm kích",
    "example": "The team discussed the appreciation during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự đánh giá cao, sự cảm kích\" trong cuộc họp.",
    "translations": {
      "vi": "sự đánh giá cao, sự cảm kích"
    }
  },
  {
    "id": "ben-35",
    "topic": "Employee Benefits",
    "word": "evaluate",
    "phonetic": "/ɪvˈæljuːˌeɪt/",
    "pos": "verb",
    "meaning": "đánh giá",
    "example": "The team plans to evaluate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đánh giá\" trước thời hạn.",
    "translations": {
      "vi": "đánh giá"
    }
  },
  {
    "id": "ben-36",
    "topic": "Employee Benefits",
    "word": "preference",
    "phonetic": "/pɹˈɛfɹəns/",
    "pos": "noun",
    "meaning": "sự thích hơn, sở thích",
    "example": "The team discussed the preference during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự thích hơn, sở thích\" trong cuộc họp.",
    "translations": {
      "vi": "sự thích hơn, sở thích"
    }
  },
  {
    "id": "ben-37",
    "topic": "Employee Benefits",
    "word": "predict",
    "phonetic": "/pɹɪdˈɪkt/",
    "pos": "verb",
    "meaning": "dự đoán",
    "example": "The team plans to predict before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"dự đoán\" trước thời hạn.",
    "translations": {
      "vi": "dự đoán"
    }
  },
  {
    "id": "ben-38",
    "topic": "Employee Benefits",
    "word": "award",
    "phonetic": "/ɐwˈɔːd/",
    "pos": "noun",
    "meaning": "giải thưởng, phần thưởng",
    "example": "The team discussed the award during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"giải thưởng, phần thưởng\" trong cuộc họp.",
    "translations": {
      "vi": "giải thưởng, phần thưởng"
    }
  },
  {
    "id": "ben-39",
    "topic": "Employee Benefits",
    "word": "performance",
    "phonetic": "/pəfˈɔːməns/",
    "pos": "noun",
    "meaning": "sự biểu diễn, trình diễn",
    "example": "The team discussed the performance during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự biểu diễn, trình diễn\" trong cuộc họp.",
    "translations": {
      "vi": "sự biểu diễn, trình diễn"
    }
  },
  {
    "id": "ben-40",
    "topic": "Employee Benefits",
    "word": "reward",
    "phonetic": "/ɹɪwˈɔːd/",
    "pos": "verb",
    "meaning": "thưởng",
    "example": "The team plans to reward before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"thưởng\" trước thời hạn.",
    "translations": {
      "vi": "thưởng"
    }
  },
  {
    "id": "ben-41",
    "topic": "Employee Benefits",
    "word": "search",
    "phonetic": "/sˈɜːtʃ/",
    "pos": "noun",
    "meaning": "sự tìm kiếm, sự điều tra",
    "example": "The team discussed the search during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự tìm kiếm, sự điều tra\" trong cuộc họp.",
    "translations": {
      "vi": "sự tìm kiếm, sự điều tra"
    }
  },
  {
    "id": "ben-42",
    "topic": "Employee Benefits",
    "word": "early",
    "phonetic": "/ˈɜːli/",
    "pos": "adj",
    "meaning": "sớm, gần đây",
    "example": "The manager described the proposal as early.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"sớm, gần đây\".",
    "translations": {
      "vi": "sớm, gần đây"
    }
  },
  {
    "id": "ben-43",
    "topic": "Employee Benefits",
    "word": "dedication",
    "phonetic": "/dˌɛdɪkˈeɪʃən/",
    "pos": "noun",
    "meaning": "chỉ định, bổ nhiệm",
    "example": "The team discussed the dedication during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"chỉ định, bổ nhiệm\" trong cuộc họp.",
    "translations": {
      "vi": "chỉ định, bổ nhiệm"
    }
  },
  {
    "id": "ben-44",
    "topic": "Employee Benefits",
    "word": "congratulate",
    "phonetic": "/kənɡɹˈætʃʊlˌeɪt/",
    "pos": "verb",
    "meaning": "chúc mừng",
    "example": "The team plans to congratulate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"chúc mừng\" trước thời hạn.",
    "translations": {
      "vi": "chúc mừng"
    }
  },
  {
    "id": "ben-45",
    "topic": "Employee Benefits",
    "word": "dismiss",
    "phonetic": "/dɪsmˈɪs/",
    "pos": "verb",
    "meaning": "cho nghỉ,sa thải",
    "example": "The team plans to dismiss before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"cho nghỉ,sa thải\" trước thời hạn.",
    "translations": {
      "vi": "cho nghỉ,sa thải"
    }
  },
  {
    "id": "ben-46",
    "topic": "Employee Benefits",
    "word": "participation",
    "phonetic": "/pɑːtˈɪsɪpˈeɪʃən/",
    "pos": "noun",
    "meaning": "sự tham gia, sự tham dự",
    "example": "The team discussed the participation during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự tham gia, sự tham dự\" trong cuộc họp.",
    "translations": {
      "vi": "sự tham gia, sự tham dự"
    }
  },
  {
    "id": "ben-47",
    "topic": "Employee Benefits",
    "word": "retire",
    "phonetic": "/ɹɪtˈaɪə/",
    "pos": "verb",
    "meaning": "thôi việc, về hưu",
    "example": "The team plans to retire before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"thôi việc, về hưu\" trước thời hạn.",
    "translations": {
      "vi": "thôi việc, về hưu"
    }
  },
  {
    "id": "rot-01",
    "topic": "Job Rotation",
    "word": "resignation",
    "phonetic": "/ɹɪzɪɡnˈeɪʃən/",
    "pos": "noun",
    "meaning": "sự từ chức",
    "example": "The team discussed the resignation during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự từ chức\" trong cuộc họp.",
    "translations": {
      "vi": "sự từ chức"
    }
  },
  {
    "id": "rot-02",
    "topic": "Job Rotation",
    "word": "strictly",
    "phonetic": "/stɹˈɪktli/",
    "pos": "adv",
    "meaning": "nghiêm khắc, hoànt oàn",
    "example": "The team completed the task strictly.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"nghiêm khắc, hoànt oàn\".",
    "translations": {
      "vi": "nghiêm khắc, hoànt oàn"
    }
  },
  {
    "id": "rot-03",
    "topic": "Job Rotation",
    "word": "appoint",
    "phonetic": "/ɐpˈɔɪnt/",
    "pos": "verb",
    "meaning": "chỉ định, bổ nhiệm",
    "example": "The team plans to appoint before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"chỉ định, bổ nhiệm\" trước thời hạn.",
    "translations": {
      "vi": "chỉ định, bổ nhiệm"
    }
  },
  {
    "id": "rot-04",
    "topic": "Job Rotation",
    "word": "management",
    "phonetic": "/mˈænɪdʒmənt/",
    "pos": "noun",
    "meaning": "sự quản lý, ban quản lý",
    "example": "The team discussed the management during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự quản lý, ban quản lý\" trong cuộc họp.",
    "translations": {
      "vi": "sự quản lý, ban quản lý"
    }
  },
  {
    "id": "rot-05",
    "topic": "Job Rotation",
    "word": "transfer",
    "phonetic": "/ˈtɹænsfɝ/",
    "pos": "verb",
    "meaning": "chuy ển, dời; thuy ên chuyển",
    "example": "The team plans to transfer before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"chuy ển, dời; thuy ên chuyển\" trước thời hạn.",
    "translations": {
      "vi": "chuy ển, dời; thuy ên chuyển"
    }
  },
  {
    "id": "rot-06",
    "topic": "Job Rotation",
    "word": "mandatory",
    "phonetic": "/mˈændətəɹˌi/",
    "pos": "adj",
    "meaning": "bắt buộc",
    "example": "The manager described the proposal as mandatory.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"bắt buộc\".",
    "translations": {
      "vi": "bắt buộc"
    }
  },
  {
    "id": "rot-07",
    "topic": "Job Rotation",
    "word": "designate",
    "phonetic": "/dˈɛzɪɡnˌeɪt/",
    "pos": "verb",
    "meaning": "chỉ định, bổ nhiệm",
    "example": "The team plans to designate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"chỉ định, bổ nhiệm\" trước thời hạn.",
    "translations": {
      "vi": "chỉ định, bổ nhiệm"
    }
  },
  {
    "id": "rot-08",
    "topic": "Job Rotation",
    "word": "unanimously",
    "phonetic": "/juːnˈænɪməsli/",
    "pos": "adv",
    "meaning": "đồng thuận, nhất trí",
    "example": "The team completed the task unanimously.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"đồng thuận, nhất trí\".",
    "translations": {
      "vi": "đồng thuận, nhất trí"
    }
  },
  {
    "id": "rot-09",
    "topic": "Job Rotation",
    "word": "independence",
    "phonetic": "/ˌɪndɪpˈɛndəns/",
    "pos": "noun",
    "meaning": "sự độc lập, nền độc lập",
    "example": "The team discussed the independence during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự độc lập, nền độc lập\" trong cuộc họp.",
    "translations": {
      "vi": "sự độc lập, nền độc lập"
    }
  },
  {
    "id": "rot-10",
    "topic": "Job Rotation",
    "word": "praise",
    "phonetic": "/pɹˈeɪz/",
    "pos": "noun",
    "meaning": "sự khen ngợi, lời tán dương",
    "example": "The team discussed the praise during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự khen ngợi, lời tán dương\" trong cuộc họp.",
    "translations": {
      "vi": "sự khen ngợi, lời tán dương"
    }
  },
  {
    "id": "rot-11",
    "topic": "Job Rotation",
    "word": "nomination",
    "phonetic": "/nˌɒmɪnˈeɪʃən/",
    "pos": "noun",
    "meaning": "sự bổ nhiệm, sự đề cử",
    "example": "The team discussed the nomination during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự bổ nhiệm, sự đề cử\" trong cuộc họp.",
    "translations": {
      "vi": "sự bổ nhiệm, sự đề cử"
    }
  },
  {
    "id": "rot-12",
    "topic": "Job Rotation",
    "word": "reorganize",
    "phonetic": "/ɹiˈɔɹɡəˌnaɪz/",
    "pos": "verb",
    "meaning": "tổ chức lại, cảitổ lại",
    "example": "The team plans to reorganize before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"tổ chức lại, cảitổ lại\" trước thời hạn.",
    "translations": {
      "vi": "tổ chức lại, cảitổ lại"
    }
  },
  {
    "id": "tff-01",
    "topic": "Traffic",
    "word": "alleviate",
    "phonetic": "/ɐlˈiːvɪˌeɪt/",
    "pos": "verb",
    "meaning": "làm dịu, làm giảm bớt",
    "example": "The team plans to alleviate before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"làm dịu, làm giảm bớt\" trước thời hạn.",
    "translations": {
      "vi": "làm dịu, làm giảm bớt"
    }
  },
  {
    "id": "tff-02",
    "topic": "Traffic",
    "word": "opportunity",
    "phonetic": "/ɒpətjˈuːnɪti/",
    "pos": "noun",
    "meaning": "cơ hội, thờicơ",
    "example": "The team discussed the opportunity during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"cơ hội, thờicơ\" trong cuộc họp.",
    "translations": {
      "vi": "cơ hội, thờicơ"
    }
  },
  {
    "id": "tff-03",
    "topic": "Traffic",
    "word": "detailed",
    "phonetic": "/dˈiːteɪld/",
    "pos": "adj",
    "meaning": "chi tiết, cặn kẽ, tỉ mỉ",
    "example": "The manager described the proposal as detailed.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"chi tiết, cặn kẽ, tỉ mỉ\".",
    "translations": {
      "vi": "chi tiết, cặn kẽ, tỉ mỉ"
    }
  },
  {
    "id": "tff-04",
    "topic": "Traffic",
    "word": "alternative",
    "phonetic": "/ɔːltˈɜːnətˌɪv/",
    "pos": "noun",
    "meaning": "sự lựa chọn, phương án khác",
    "example": "The team discussed the alternative during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự lựa chọn, phương án khác\" trong cuộc họp.",
    "translations": {
      "vi": "sự lựa chọn, phương án khác"
    }
  },
  {
    "id": "tff-05",
    "topic": "Traffic",
    "word": "obtain",
    "phonetic": "/ɒbtˈeɪn/",
    "pos": "verb",
    "meaning": "đạt được, giành được",
    "example": "The team plans to obtain before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đạt được, giành được\" trước thời hạn.",
    "translations": {
      "vi": "đạt được, giành được"
    }
  },
  {
    "id": "tff-06",
    "topic": "Traffic",
    "word": "fare",
    "phonetic": "/fˈeə/",
    "pos": "noun",
    "meaning": "tiềnx e, tiềnvé",
    "example": "The team discussed the fare during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"tiềnx e, tiềnvé\" trong cuộc họp.",
    "translations": {
      "vi": "tiềnx e, tiềnvé"
    }
  },
  {
    "id": "tff-07",
    "topic": "Traffic",
    "word": "expense",
    "phonetic": "/ɛkspˈɛns/",
    "pos": "noun",
    "meaning": "chi phí, phít ổn",
    "example": "The team discussed the expense during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"chi phí, phít ổn\" trong cuộc họp.",
    "translations": {
      "vi": "chi phí, phít ổn"
    }
  },
  {
    "id": "tff-08",
    "topic": "Traffic",
    "word": "trust",
    "phonetic": "/tɹˈʌst/",
    "pos": "noun",
    "meaning": "lòng tin, sự tin cậy",
    "example": "The team discussed the trust during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"lòng tin, sự tin cậy\" trong cuộc họp.",
    "translations": {
      "vi": "lòng tin, sự tin cậy"
    }
  },
  {
    "id": "tff-09",
    "topic": "Traffic",
    "word": "securely",
    "phonetic": "/sɪkjˈɔːli/",
    "pos": "adv",
    "meaning": "chắc chắn, an toàn",
    "example": "The team completed the task securely.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"chắc chắn, an toàn\".",
    "translations": {
      "vi": "chắc chắn, an toàn"
    }
  },
  {
    "id": "tff-10",
    "topic": "Traffic",
    "word": "prominently",
    "phonetic": "/pɹˈɒmɪnəntli/",
    "pos": "adv",
    "meaning": "dễ thấy, nổi bật",
    "example": "The team completed the task prominently.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"dễ thấy, nổi bật\".",
    "translations": {
      "vi": "dễ thấy, nổi bật"
    }
  },
  {
    "id": "tff-11",
    "topic": "Traffic",
    "word": "reserved",
    "phonetic": "/ɹiˈzɝvd/",
    "pos": "adj",
    "meaning": "dành riêng, được đặt trước",
    "example": "The manager described the proposal as reserved.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"dành riêng, được đặt trước\".",
    "translations": {
      "vi": "dành riêng, được đặt trước"
    }
  },
  {
    "id": "tff-12",
    "topic": "Traffic",
    "word": "congestion",
    "phonetic": "/kəndʒˈɛstʃən/",
    "pos": "noun",
    "meaning": "ngã tư, chỗ giao nhau",
    "example": "The team discussed the congestion during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"ngã tư, chỗ giao nhau\" trong cuộc họp.",
    "translations": {
      "vi": "ngã tư, chỗ giao nhau"
    }
  },
  {
    "id": "tff-13",
    "topic": "Traffic",
    "word": "inward",
    "phonetic": "/ˈɪnwəd/",
    "pos": "adv",
    "meaning": "ở/về phía trung tâm, vào phía trong",
    "example": "The team completed the task inward.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"ở/về phía trung tâm, vào phía trong\".",
    "translations": {
      "vi": "ở/về phía trung tâm, vào phía trong"
    }
  },
  {
    "id": "tff-14",
    "topic": "Traffic",
    "word": "detour",
    "phonetic": "/dˈiːtɔː/",
    "pos": "noun",
    "meaning": "khúc ngoặt, đườngv òng",
    "example": "The team discussed the detour during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"khúc ngoặt, đườngv òng\" trong cuộc họp.",
    "translations": {
      "vi": "khúc ngoặt, đườngv òng"
    }
  },
  {
    "id": "tff-15",
    "topic": "Traffic",
    "word": "malfunction",
    "phonetic": "/mˌælfˈʌŋkʃən/",
    "pos": "noun",
    "meaning": "sự trục tr ặc, sựcố",
    "example": "The team discussed the malfunction during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự trục tr ặc, sựcố\" trong cuộc họp.",
    "translations": {
      "vi": "sự trục tr ặc, sựcố"
    }
  },
  {
    "id": "tff-16",
    "topic": "Traffic",
    "word": "ongoing",
    "phonetic": "/ˈɒŋɡəʊɪŋ/",
    "pos": "adj",
    "meaning": "liên tục, đang tiếp diễn",
    "example": "The manager described the proposal as ongoing.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"liên tục, đang tiếp diễn\".",
    "translations": {
      "vi": "liên tục, đang tiếp diễn"
    }
  },
  {
    "id": "tff-17",
    "topic": "Traffic",
    "word": "intersection",
    "phonetic": "/ˌɪntəsˈɛkʃən/",
    "pos": "noun",
    "meaning": "ngã tư, chỗ giao nhau",
    "example": "The team discussed the intersection during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"ngã tư, chỗ giao nhau\" trong cuộc họp.",
    "translations": {
      "vi": "ngã tư, chỗ giao nhau"
    }
  },
  {
    "id": "tff-18",
    "topic": "Traffic",
    "word": "commute",
    "phonetic": "/kəmjˈuːt/",
    "pos": "verb",
    "meaning": "đi lại đều đặn (đi làm)",
    "example": "The team plans to commute before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đi lại đều đặn (đi làm)\" trước thời hạn.",
    "translations": {
      "vi": "đi lại đều đặn (đi làm)"
    }
  },
  {
    "id": "tff-19",
    "topic": "Traffic",
    "word": "automotive",
    "phonetic": "/ˌɔːtəʊmˈəʊtɪv/",
    "pos": "adj",
    "meaning": "tự động, (thuộc)ô tô",
    "example": "The manager described the proposal as automotive.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"tự động, (thuộc)ô tô\".",
    "translations": {
      "vi": "tự động, (thuộc)ô tô"
    }
  },
  {
    "id": "tff-20",
    "topic": "Traffic",
    "word": "closure",
    "phonetic": "/klˈəʊʒɐ/",
    "pos": "noun",
    "meaning": "sự đóng cửa",
    "example": "The team discussed the closure during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự đóng cửa\" trong cuộc họp.",
    "translations": {
      "vi": "sự đóng cửa"
    }
  },
  {
    "id": "tff-21",
    "topic": "Traffic",
    "word": "platform",
    "phonetic": "/plˈætfɔːm/",
    "pos": "noun",
    "meaning": "sân ga",
    "example": "The team discussed the platform during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sân ga\" trong cuộc họp.",
    "translations": {
      "vi": "sân ga"
    }
  },
  {
    "id": "tff-22",
    "topic": "Traffic",
    "word": "head",
    "phonetic": "/hˈɛd/",
    "pos": "verb",
    "meaning": "dẫn đầu, hướngv ề, đivề phía",
    "example": "The team plans to head before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"dẫn đầu, hướngv ề, đivề phía\" trước thời hạn.",
    "translations": {
      "vi": "dẫn đầu, hướngv ề, đivề phía"
    }
  },
  {
    "id": "tff-23",
    "topic": "Traffic",
    "word": "pass",
    "phonetic": "/pˈɑːs/",
    "pos": "verb",
    "meaning": "đi qua, vượt qua",
    "example": "The team plans to pass before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đi qua, vượt qua\" trước thời hạn.",
    "translations": {
      "vi": "đi qua, vượt qua"
    }
  },
  {
    "id": "tff-24",
    "topic": "Traffic",
    "word": "average",
    "phonetic": "/ˈævɹɪdʒ/",
    "pos": "noun",
    "meaning": "số trung bình, mức bình quân",
    "example": "The team discussed the average during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"số trung bình, mức bình quân\" trong cuộc họp.",
    "translations": {
      "vi": "số trung bình, mức bình quân"
    }
  },
  {
    "id": "tff-25",
    "topic": "Traffic",
    "word": "tow",
    "phonetic": "/tˈəʊ/",
    "pos": "verb",
    "meaning": "kéo, lai dắt (t àu, thuy ền)",
    "example": "The team plans to tow before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"kéo, lai dắt (t àu, thuy ền)\" trước thời hạn.",
    "translations": {
      "vi": "kéo, lai dắt (t àu, thuy ền)"
    }
  },
  {
    "id": "tff-26",
    "topic": "Traffic",
    "word": "reverse",
    "phonetic": "/ɹɪvˈɜːs/",
    "pos": "adj",
    "meaning": "đảo, ngược, trái lại",
    "example": "The manager described the proposal as reverse.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"đảo, ngược, trái lại\".",
    "translations": {
      "vi": "đảo, ngược, trái lại"
    }
  },
  {
    "id": "ban-01",
    "topic": "Bank",
    "word": "overdue",
    "phonetic": "/ˌəʊvədjˈuː/",
    "pos": "adj",
    "meaning": "quá hạn",
    "example": "The manager described the proposal as overdue.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"quá hạn\".",
    "translations": {
      "vi": "quá hạn"
    }
  },
  {
    "id": "ban-02",
    "topic": "Bank",
    "word": "regrettably",
    "phonetic": "/ɹɪɡɹˈɛtəbli/",
    "pos": "adv",
    "meaning": "thật đáng tiếc",
    "example": "The team completed the task regrettably.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"thật đáng tiếc\".",
    "translations": {
      "vi": "thật đáng tiếc"
    }
  },
  {
    "id": "ban-03",
    "topic": "Bank",
    "word": "deposit",
    "phonetic": "/dɪpˈɒsɪt/",
    "pos": "verb",
    "meaning": "gởi, nộp (tiềnở ngân hàng)",
    "example": "The team plans to deposit before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"gởi, nộp (tiềnở ngân hàng)\" trước thời hạn.",
    "translations": {
      "vi": "gởi, nộp (tiềnở ngân hàng)"
    }
  },
  {
    "id": "ban-04",
    "topic": "Bank",
    "word": "previously",
    "phonetic": "/pɹˈiːvɪəsli/",
    "pos": "adv",
    "meaning": "trước, trước đây",
    "example": "The team completed the task previously.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"trước, trước đây\".",
    "translations": {
      "vi": "trước, trước đây"
    }
  },
  {
    "id": "ban-05",
    "topic": "Bank",
    "word": "receive",
    "phonetic": "/ɹɪsˈiːv/",
    "pos": "verb",
    "meaning": "nhận, lĩnh, thu",
    "example": "The team plans to receive before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"nhận, lĩnh, thu\" trước thời hạn.",
    "translations": {
      "vi": "nhận, lĩnh, thu"
    }
  },
  {
    "id": "ban-06",
    "topic": "Bank",
    "word": "expect",
    "phonetic": "/ɛkspˈɛkt/",
    "pos": "verb",
    "meaning": "tr ông đợi, dự đoán",
    "example": "The team plans to expect before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"tr ông đợi, dự đoán\" trước thời hạn.",
    "translations": {
      "vi": "tr ông đợi, dự đoán"
    }
  },
  {
    "id": "ban-07",
    "topic": "Bank",
    "word": "study",
    "phonetic": "/stˈʌdi/",
    "pos": "noun",
    "meaning": "sự nghiên cứu, sự tìm tòi",
    "example": "The team discussed the study during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự nghiên cứu, sự tìm tòi\" trong cuộc họp.",
    "translations": {
      "vi": "sự nghiên cứu, sự tìm tòi"
    }
  },
  {
    "id": "ban-08",
    "topic": "Bank",
    "word": "lower",
    "phonetic": "/ˈɫoʊɝ/",
    "pos": "verb",
    "meaning": "hạ thấp, giảm",
    "example": "The team plans to lower before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"hạ thấp, giảm\" trước thời hạn.",
    "translations": {
      "vi": "hạ thấp, giảm"
    }
  },
  {
    "id": "ban-09",
    "topic": "Bank",
    "word": "double",
    "phonetic": "/dˈʌbəl/",
    "pos": "verb",
    "meaning": "nhân đôi,t ăng gấp đôi",
    "example": "The team plans to double before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"nhân đôi,t ăng gấp đôi\" trước thời hạn.",
    "translations": {
      "vi": "nhân đôi,t ăng gấp đôi"
    }
  },
  {
    "id": "ban-10",
    "topic": "Bank",
    "word": "interest",
    "phonetic": "/ˈɪntɹəst/",
    "pos": "noun",
    "meaning": "sự quant âm; lợi ích; tiền lãi",
    "example": "The team discussed the interest during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự quant âm; lợi ích; tiền lãi\" trong cuộc họp.",
    "translations": {
      "vi": "sự quant âm; lợi ích; tiền lãi"
    }
  },
  {
    "id": "ban-11",
    "topic": "Bank",
    "word": "alternatively",
    "phonetic": "/ɔːltˈɜːnətˌɪvli/",
    "pos": "adv",
    "meaning": "hoặc, như một sự lựa chọn",
    "example": "The team completed the task alternatively.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"hoặc, như một sự lựa chọn\".",
    "translations": {
      "vi": "hoặc, như một sự lựa chọn"
    }
  },
  {
    "id": "ban-12",
    "topic": "Bank",
    "word": "attentive",
    "phonetic": "/ɐtˈɛntɪv/",
    "pos": "adj",
    "meaning": "chăm chú, lưu tâm",
    "example": "The manager described the proposal as attentive.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"chăm chú, lưu tâm\".",
    "translations": {
      "vi": "chăm chú, lưu tâm"
    }
  },
  {
    "id": "ban-13",
    "topic": "Bank",
    "word": "heavily",
    "phonetic": "/hˈɛvili/",
    "pos": "adv",
    "meaning": "nặng, nặng nề",
    "example": "The team completed the task heavily.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"nặng, nặng nề\".",
    "translations": {
      "vi": "nặng, nặng nề"
    }
  },
  {
    "id": "ban-14",
    "topic": "Bank",
    "word": "payable",
    "phonetic": "/pˈeɪəbəl/",
    "pos": "adj",
    "meaning": "có thể tr ả, phải trả",
    "example": "The manager described the proposal as payable.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"có thể tr ả, phải trả\".",
    "translations": {
      "vi": "có thể tr ả, phải trả"
    }
  },
  {
    "id": "ban-15",
    "topic": "Bank",
    "word": "personal",
    "phonetic": "/pˈɜːsənəl/",
    "pos": "adj",
    "meaning": "riêng, cá nhân",
    "example": "The manager described the proposal as personal.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"riêng, cá nhân\".",
    "translations": {
      "vi": "riêng, cá nhân"
    }
  },
  {
    "id": "ban-16",
    "topic": "Bank",
    "word": "balance",
    "phonetic": "/bˈæləns/",
    "pos": "noun",
    "meaning": "số dưt ài khoản",
    "example": "The team discussed the balance during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"số dưt ài khoản\" trong cuộc họp.",
    "translations": {
      "vi": "số dưt ài khoản"
    }
  },
  {
    "id": "ban-17",
    "topic": "Bank",
    "word": "investigation",
    "phonetic": "/ɪnvˌɛstɪɡˈeɪʃən/",
    "pos": "noun",
    "meaning": "sự điều tra",
    "example": "The team discussed the investigation during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự điều tra\" trong cuộc họp.",
    "translations": {
      "vi": "sự điều tra"
    }
  },
  {
    "id": "ban-18",
    "topic": "Bank",
    "word": "amount",
    "phonetic": "/ɐmˈaʊnt/",
    "pos": "noun",
    "meaning": "lượng,số lượng,số tiền",
    "example": "The team discussed the amount during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"lượng,số lượng,số tiền\" trong cuộc họp.",
    "translations": {
      "vi": "lượng,số lượng,số tiền"
    }
  },
  {
    "id": "ban-19",
    "topic": "Bank",
    "word": "withdrawal",
    "phonetic": "/wɪðdɹˈɔːl/",
    "pos": "noun",
    "meaning": "sự rútra",
    "example": "The team discussed the withdrawal during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự rútra\" trong cuộc họp.",
    "translations": {
      "vi": "sự rútra"
    }
  },
  {
    "id": "ban-20",
    "topic": "Bank",
    "word": "pleasure",
    "phonetic": "/plˈɛʒɐ/",
    "pos": "noun",
    "meaning": "niềm vui, sự hài lòng",
    "example": "The team discussed the pleasure during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"niềm vui, sự hài lòng\" trong cuộc họp.",
    "translations": {
      "vi": "niềm vui, sự hài lòng"
    }
  },
  {
    "id": "ban-21",
    "topic": "Bank",
    "word": "summary",
    "phonetic": "/sˈʌməɹi/",
    "pos": "noun",
    "meaning": "bảnt ómt ắt",
    "example": "The team discussed the summary during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"bảnt ómt ắt\" trong cuộc họp.",
    "translations": {
      "vi": "bảnt ómt ắt"
    }
  },
  {
    "id": "ban-22",
    "topic": "Bank",
    "word": "temporary",
    "phonetic": "/tˈɛmpɹəɹˌi/",
    "pos": "adj",
    "meaning": "tạm thời, nhất thời",
    "example": "The manager described the proposal as temporary.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"tạm thời, nhất thời\".",
    "translations": {
      "vi": "tạm thời, nhất thời"
    }
  },
  {
    "id": "ban-23",
    "topic": "Bank",
    "word": "transaction",
    "phonetic": "/tɹænsˈækʃən/",
    "pos": "noun",
    "meaning": "gsự giao dịch, thương vụ",
    "example": "The team discussed the transaction during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"gsự giao dịch, thương vụ\" trong cuộc họp.",
    "translations": {
      "vi": "gsự giao dịch, thương vụ"
    }
  },
  {
    "id": "ban-24",
    "topic": "Bank",
    "word": "reject",
    "phonetic": "/ˈɹidʒɛkt/",
    "pos": "verb",
    "meaning": "đổi, biến đổi, chuyển",
    "example": "The team plans to reject before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đổi, biến đổi, chuyển\" trước thời hạn.",
    "translations": {
      "vi": "đổi, biến đổi, chuyển"
    }
  },
  {
    "id": "ban-25",
    "topic": "Bank",
    "word": "convert",
    "phonetic": "/ˈkɑnvɝt/",
    "pos": "verb",
    "meaning": "đổi, biến đổi, chuyển",
    "example": "The team plans to convert before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đổi, biến đổi, chuyển\" trước thời hạn.",
    "translations": {
      "vi": "đổi, biến đổi, chuyển"
    }
  },
  {
    "id": "ban-26",
    "topic": "Bank",
    "word": "loan",
    "phonetic": "/lˈəʊn/",
    "pos": "noun",
    "meaning": "sự cho vay, khoản vay",
    "example": "The team discussed the loan during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự cho vay, khoản vay\" trong cuộc họp.",
    "translations": {
      "vi": "sự cho vay, khoản vay"
    }
  },
  {
    "id": "ban-27",
    "topic": "Bank",
    "word": "cash",
    "phonetic": "/kˈæʃ/",
    "pos": "verb",
    "meaning": "đổi sang tiền mặt",
    "example": "The team plans to cash before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đổi sang tiền mặt\" trước thời hạn.",
    "translations": {
      "vi": "đổi sang tiền mặt"
    }
  },
  {
    "id": "ban-28",
    "topic": "Bank",
    "word": "investment",
    "phonetic": "/ɪnvˈɛstmənt/",
    "pos": "noun",
    "meaning": "sự đầu tư,v ốn đầu tư",
    "example": "The team discussed the investment during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự đầu tư,v ốn đầu tư\" trong cuộc họp.",
    "translations": {
      "vi": "sự đầu tư,v ốn đầu tư"
    }
  },
  {
    "id": "ban-29",
    "topic": "Bank",
    "word": "inherently",
    "phonetic": "/ɪnhˈiəɹəntli/",
    "pos": "adv",
    "meaning": "vốn dĩ, về bản chất",
    "example": "The team completed the task inherently.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"vốn dĩ, về bản chất\".",
    "translations": {
      "vi": "vốn dĩ, về bản chất"
    }
  },
  {
    "id": "ban-30",
    "topic": "Bank",
    "word": "propose",
    "phonetic": "/pɹəpˈəʊz/",
    "pos": "verb",
    "meaning": "đề xuất, đề nghị",
    "example": "The team plans to propose before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đề xuất, đề nghị\" trước thời hạn.",
    "translations": {
      "vi": "đề xuất, đề nghị"
    }
  },
  {
    "id": "ban-31",
    "topic": "Bank",
    "word": "support",
    "phonetic": "/səpˈɔːt/",
    "pos": "noun",
    "meaning": "sự hỗ tr ợ, sự ủng hộ",
    "example": "The team discussed the support during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự hỗ tr ợ, sự ủng hộ\" trong cuộc họp.",
    "translations": {
      "vi": "sự hỗ tr ợ, sự ủng hộ"
    }
  },
  {
    "id": "ban-32",
    "topic": "Bank",
    "word": "consider",
    "phonetic": "/kənsˈɪdɐ/",
    "pos": "verb",
    "meaning": "cân nhắc, suy xét",
    "example": "The team plans to consider before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"cân nhắc, suy xét\" trước thời hạn.",
    "translations": {
      "vi": "cân nhắc, suy xét"
    }
  },
  {
    "id": "ban-33",
    "topic": "Bank",
    "word": "nearly",
    "phonetic": "/nˈiəli/",
    "pos": "adv",
    "meaning": "gần, sắp, suýt",
    "example": "The team completed the task nearly.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"gần, sắp, suýt\".",
    "translations": {
      "vi": "gần, sắp, suýt"
    }
  },
  {
    "id": "ban-34",
    "topic": "Bank",
    "word": "consent",
    "phonetic": "/kənsˈɛnt/",
    "pos": "noun",
    "meaning": "sự đồng ý, sự tán thành",
    "example": "The team discussed the consent during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự đồng ý, sự tán thành\" trong cuộc họp.",
    "translations": {
      "vi": "sự đồng ý, sự tán thành"
    }
  },
  {
    "id": "ban-35",
    "topic": "Bank",
    "word": "gratitude",
    "phonetic": "/ɡɹˈætɪtjˌuːd/",
    "pos": "noun",
    "meaning": "lòng biết ơn, sự nhớ ơn",
    "example": "The team discussed the gratitude during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"lòng biết ơn, sự nhớ ơn\" trong cuộc họp.",
    "translations": {
      "vi": "lòng biết ơn, sự nhớ ơn"
    }
  },
  {
    "id": "ban-36",
    "topic": "Bank",
    "word": "consult",
    "phonetic": "/kənˈsəɫt/",
    "pos": "verb",
    "meaning": "hỏiý kiến, bàn bạc, tham khảo",
    "example": "The team plans to consult before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"hỏiý kiến, bàn bạc, tham khảo\" trước thời hạn.",
    "translations": {
      "vi": "hỏiý kiến, bàn bạc, tham khảo"
    }
  },
  {
    "id": "ban-37",
    "topic": "Bank",
    "word": "advice",
    "phonetic": "/ɐdvˈaɪs/",
    "pos": "noun",
    "meaning": "lời khuy ên, sự tưv ấn",
    "example": "The team discussed the advice during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"lời khuy ên, sự tưv ấn\" trong cuộc họp.",
    "translations": {
      "vi": "lời khuy ên, sự tưv ấn"
    }
  },
  {
    "id": "ban-38",
    "topic": "Bank",
    "word": "partially",
    "phonetic": "/pˈɑːʃəlˌi/",
    "pos": "adv",
    "meaning": "một phần, cục bộ",
    "example": "The team completed the task partially.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"một phần, cục bộ\".",
    "translations": {
      "vi": "một phần, cục bộ"
    }
  },
  {
    "id": "ban-39",
    "topic": "Bank",
    "word": "cautious",
    "phonetic": "/kˈɔːʃəs/",
    "pos": "adj",
    "meaning": "thận tr ọng, cẩn thận",
    "example": "The manager described the proposal as cautious.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"thận tr ọng, cẩn thận\".",
    "translations": {
      "vi": "thận tr ọng, cẩn thận"
    }
  },
  {
    "id": "ban-40",
    "topic": "Bank",
    "word": "possible",
    "phonetic": "/pˈɒsəbəl/",
    "pos": "adj",
    "meaning": "có thể, khả thi",
    "example": "The manager described the proposal as possible.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"có thể, khả thi\".",
    "translations": {
      "vi": "có thể, khả thi"
    }
  },
  {
    "id": "ban-41",
    "topic": "Bank",
    "word": "stability",
    "phonetic": "/stəbˈɪlɪti/",
    "pos": "noun",
    "meaning": "sự ổn định, sự vững chắc",
    "example": "The team discussed the stability during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự ổn định, sự vững chắc\" trong cuộc họp.",
    "translations": {
      "vi": "sự ổn định, sự vững chắc"
    }
  },
  {
    "id": "ban-42",
    "topic": "Bank",
    "word": "prevalent",
    "phonetic": "/pɹˈɛvələnt/",
    "pos": "adj",
    "meaning": "phổ biến, thịnh hành",
    "example": "The manager described the proposal as prevalent.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"phổ biến, thịnh hành\".",
    "translations": {
      "vi": "phổ biến, thịnh hành"
    }
  },
  {
    "id": "ban-43",
    "topic": "Bank",
    "word": "rapid",
    "phonetic": "/ɹˈæpɪd/",
    "pos": "adj",
    "meaning": "nhanh, nhanh chóng, mau lẹ",
    "example": "The manager described the proposal as rapid.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"nhanh, nhanh chóng, mau lẹ\".",
    "translations": {
      "vi": "nhanh, nhanh chóng, mau lẹ"
    }
  },
  {
    "id": "ban-44",
    "topic": "Bank",
    "word": "lucrative",
    "phonetic": "/lˈuːkɹətˌɪv/",
    "pos": "adj",
    "meaning": "có lợi, sinh lời",
    "example": "The manager described the proposal as lucrative.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"có lợi, sinh lời\".",
    "translations": {
      "vi": "có lợi, sinh lời"
    }
  },
  {
    "id": "ban-45",
    "topic": "Bank",
    "word": "innate",
    "phonetic": "/ɪnnˈeɪt/",
    "pos": "adj",
    "meaning": "bẩm sinh",
    "example": "The manager described the proposal as innate.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"bẩm sinh\".",
    "translations": {
      "vi": "bẩm sinh"
    }
  },
  {
    "id": "ban-46",
    "topic": "Bank",
    "word": "property",
    "phonetic": "/pɹˈɒpəti/",
    "pos": "noun",
    "meaning": "quy ềnsở hữu,t àis ản",
    "example": "The team discussed the property during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"quy ềnsở hữu,t àis ản\" trong cuộc họp.",
    "translations": {
      "vi": "quy ềnsở hữu,t àis ản"
    }
  },
  {
    "id": "ban-47",
    "topic": "Bank",
    "word": "lease",
    "phonetic": "/lˈiːs/",
    "pos": "noun",
    "meaning": "hợp đồng cho thuê",
    "example": "The team discussed the lease during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"hợp đồng cho thuê\" trong cuộc họp.",
    "translations": {
      "vi": "hợp đồng cho thuê"
    }
  },
  {
    "id": "ban-48",
    "topic": "Bank",
    "word": "sponsor",
    "phonetic": "/spˈɒnsɐ/",
    "pos": "verb",
    "meaning": "nhà tài trợ",
    "example": "The team plans to sponsor before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"nhà tài trợ\" trước thời hạn.",
    "translations": {
      "vi": "nhà tài trợ"
    }
  },
  {
    "id": "ban-49",
    "topic": "Bank",
    "word": "evident",
    "phonetic": "/ˈɛvɪdənt/",
    "pos": "adj",
    "meaning": "hiển nhiên,rõr àng,rõr ệt",
    "example": "The manager described the proposal as evident.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"hiển nhiên,rõr àng,rõr ệt\".",
    "translations": {
      "vi": "hiển nhiên,rõr àng,rõr ệt"
    }
  },
  {
    "id": "ban-50",
    "topic": "Bank",
    "word": "reliability",
    "phonetic": "/ɹɪlˌaɪəbˈɪlɪti/",
    "pos": "noun",
    "meaning": "sự đáng tin cậy",
    "example": "The team discussed the reliability during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự đáng tin cậy\" trong cuộc họp.",
    "translations": {
      "vi": "sự đáng tin cậy"
    }
  },
  {
    "id": "ban-51",
    "topic": "Bank",
    "word": "shareholder",
    "phonetic": "/ʃˈeəhəʊldɐ/",
    "pos": "noun",
    "meaning": "cổ đông",
    "example": "The team discussed the shareholder during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"cổ đông\" trong cuộc họp.",
    "translations": {
      "vi": "cổ đông"
    }
  },
  {
    "id": "ban-52",
    "topic": "Bank",
    "word": "outlook",
    "phonetic": "/ˈaʊtlʊk/",
    "pos": "noun",
    "meaning": "viễn cảnh, triểnv ọng",
    "example": "The team discussed the outlook during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"viễn cảnh, triểnv ọng\" trong cuộc họp.",
    "translations": {
      "vi": "viễn cảnh, triểnv ọng"
    }
  },
  {
    "id": "ban-53",
    "topic": "Bank",
    "word": "bond",
    "phonetic": "/bˈɒnd/",
    "pos": "noun",
    "meaning": "tr ái phiếu",
    "example": "The team discussed the bond during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"tr ái phiếu\" trong cuộc họp.",
    "translations": {
      "vi": "tr ái phiếu"
    }
  },
  {
    "id": "ban-54",
    "topic": "Bank",
    "word": "depreciation",
    "phonetic": "/dɪpɹˌiːʃɪˈeɪʃən/",
    "pos": "noun",
    "meaning": "sự sụt giá",
    "example": "The team discussed the depreciation during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự sụt giá\" trong cuộc họp.",
    "translations": {
      "vi": "sự sụt giá"
    }
  },
  {
    "id": "ban-55",
    "topic": "Bank",
    "word": "yield",
    "phonetic": "/jˈiːld/",
    "pos": "verb",
    "meaning": "tạor a, sinh lợi",
    "example": "The team plans to yield before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"tạor a, sinh lợi\" trước thời hạn.",
    "translations": {
      "vi": "tạor a, sinh lợi"
    }
  },
  {
    "id": "ban-56",
    "topic": "Bank",
    "word": "residence",
    "phonetic": "/ɹˈɛzɪdəns/",
    "pos": "noun",
    "meaning": "nơi cư trú, nhàở",
    "example": "The team discussed the residence during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"nơi cư trú, nhàở\" trong cuộc họp.",
    "translations": {
      "vi": "nơi cư trú, nhàở"
    }
  },
  {
    "id": "ban-57",
    "topic": "Bank",
    "word": "drape",
    "phonetic": "/dɹˈeɪp/",
    "pos": "verb",
    "meaning": "tr eo màn, cher èm",
    "example": "The team plans to drape before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"tr eo màn, cher èm\" trước thời hạn.",
    "translations": {
      "vi": "tr eo màn, cher èm"
    }
  },
  {
    "id": "ban-58",
    "topic": "Bank",
    "word": "unoccupied",
    "phonetic": "/ʌnˈɒkjʊpˌaɪd/",
    "pos": "adj",
    "meaning": "bỏ tr ống, không có ngườiở",
    "example": "The manager described the proposal as unoccupied.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"bỏ tr ống, không có ngườiở\".",
    "translations": {
      "vi": "bỏ tr ống, không có ngườiở"
    }
  },
  {
    "id": "ban-59",
    "topic": "Bank",
    "word": "renovation",
    "phonetic": "/ɹˌɛnəvˈeɪʃən/",
    "pos": "noun",
    "meaning": "sự cảit ạo, sửas ang",
    "example": "The team discussed the renovation during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự cảit ạo, sửas ang\" trong cuộc họp.",
    "translations": {
      "vi": "sự cảit ạo, sửas ang"
    }
  },
  {
    "id": "ban-60",
    "topic": "Bank",
    "word": "construction",
    "phonetic": "/kənstɹˈʌkʃən/",
    "pos": "noun",
    "meaning": "sựx ây dựng",
    "example": "The team discussed the construction during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sựx ây dựng\" trong cuộc họp.",
    "translations": {
      "vi": "sựx ây dựng"
    }
  },
  {
    "id": "ban-61",
    "topic": "Bank",
    "word": "regularly",
    "phonetic": "/ɹˈɛɡjuːləli/",
    "pos": "adv",
    "meaning": "đều đặn, thường xuy ên",
    "example": "The team completed the task regularly.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"đều đặn, thường xuy ên\".",
    "translations": {
      "vi": "đều đặn, thường xuy ên"
    }
  },
  {
    "id": "ban-62",
    "topic": "Bank",
    "word": "arrange",
    "phonetic": "/ɐɹˈeɪndʒ/",
    "pos": "verb",
    "meaning": "sắpx ếp,s ắp đặt",
    "example": "The team plans to arrange before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"sắpx ếp,s ắp đặt\" trước thời hạn.",
    "translations": {
      "vi": "sắpx ếp,s ắp đặt"
    }
  },
  {
    "id": "ban-63",
    "topic": "Bank",
    "word": "presently",
    "phonetic": "/pɹˈɛzəntlˌi/",
    "pos": "adv",
    "meaning": "hiện giờ, chẳng mấy chóc",
    "example": "The team completed the task presently.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"hiện giờ, chẳng mấy chóc\".",
    "translations": {
      "vi": "hiện giờ, chẳng mấy chóc"
    }
  },
  {
    "id": "ban-64",
    "topic": "Bank",
    "word": "maintain",
    "phonetic": "/meɪntˈeɪn/",
    "pos": "verb",
    "meaning": "duy trì, bảo quản",
    "example": "The team plans to maintain before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"duy trì, bảo quản\" trước thời hạn.",
    "translations": {
      "vi": "duy trì, bảo quản"
    }
  },
  {
    "id": "ban-65",
    "topic": "Bank",
    "word": "densely",
    "phonetic": "/dˈɛnsli/",
    "pos": "adv",
    "meaning": "dày đặc, rậmr ạp",
    "example": "The team completed the task densely.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"dày đặc, rậmr ạp\".",
    "translations": {
      "vi": "dày đặc, rậmr ạp"
    }
  },
  {
    "id": "ban-66",
    "topic": "Bank",
    "word": "prepare",
    "phonetic": "/pɹɪpˈeə/",
    "pos": "verb",
    "meaning": "chuẩn bị, sửas oạn",
    "example": "The team plans to prepare before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"chuẩn bị, sửas oạn\" trước thời hạn.",
    "translations": {
      "vi": "chuẩn bị, sửas oạn"
    }
  },
  {
    "id": "ban-67",
    "topic": "Bank",
    "word": "renewal",
    "phonetic": "/ɹɪnjˈuːəl/",
    "pos": "adj",
    "meaning": "sự đổi mới, sự phục hồi",
    "example": "The manager described the proposal as renewal.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"sự đổi mới, sự phục hồi\".",
    "translations": {
      "vi": "sự đổi mới, sự phục hồi"
    }
  },
  {
    "id": "ban-68",
    "topic": "Bank",
    "word": "interfere",
    "phonetic": "/ˌɪntəfˈiə/",
    "pos": "verb",
    "meaning": "can thiệp, quấyr ầy",
    "example": "The team plans to interfere before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"can thiệp, quấyr ầy\" trước thời hạn.",
    "translations": {
      "vi": "can thiệp, quấyr ầy"
    }
  },
  {
    "id": "ban-69",
    "topic": "Bank",
    "word": "totally",
    "phonetic": "/tˈəʊtəli/",
    "pos": "adv",
    "meaning": "hoànt oàn",
    "example": "The team completed the task totally.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"hoànt oàn\".",
    "translations": {
      "vi": "hoànt oàn"
    }
  },
  {
    "id": "ban-70",
    "topic": "Bank",
    "word": "actually",
    "phonetic": "/ˈæktʃuːəli/",
    "pos": "adv",
    "meaning": "thực sự, quả là, thựcra",
    "example": "The team completed the task actually.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"thực sự, quả là, thựcra\".",
    "translations": {
      "vi": "thực sự, quả là, thựcra"
    }
  },
  {
    "id": "ban-71",
    "topic": "Bank",
    "word": "architect",
    "phonetic": "/ˈɑːkɪtˌɛkt/",
    "pos": "noun",
    "meaning": "kiến trúcsư",
    "example": "The team discussed the architect during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"kiến trúcsư\" trong cuộc họp.",
    "translations": {
      "vi": "kiến trúcsư"
    }
  },
  {
    "id": "ban-72",
    "topic": "Bank",
    "word": "consist",
    "phonetic": "/kənˈsɪst/",
    "pos": "verb",
    "meaning": "bao gồm, gồmcó",
    "example": "The team plans to consist before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"bao gồm, gồmcó\" trước thời hạn.",
    "translations": {
      "vi": "bao gồm, gồmcó"
    }
  },
  {
    "id": "ban-73",
    "topic": "Bank",
    "word": "community",
    "phonetic": "/kəmjˈuːnɪtˌi/",
    "pos": "noun",
    "meaning": "cộng đồng, dân chúng",
    "example": "The team discussed the community during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"cộng đồng, dân chúng\" trong cuộc họp.",
    "translations": {
      "vi": "cộng đồng, dân chúng"
    }
  },
  {
    "id": "ban-74",
    "topic": "Bank",
    "word": "contractor",
    "phonetic": "/kəntɹˈæktɐ/",
    "pos": "noun",
    "meaning": "nhà thầu",
    "example": "The team discussed the contractor during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"nhà thầu\" trong cuộc họp.",
    "translations": {
      "vi": "nhà thầu"
    }
  },
  {
    "id": "ban-75",
    "topic": "Bank",
    "word": "district",
    "phonetic": "/dˈɪstɹɪkt/",
    "pos": "noun",
    "meaning": "quận, khu vực",
    "example": "The team discussed the district during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"quận, khu vực\" trong cuộc họp.",
    "translations": {
      "vi": "quận, khu vực"
    }
  },
  {
    "id": "ban-76",
    "topic": "Bank",
    "word": "compulsory",
    "phonetic": "/kəmpˈʌlsəɹˌi/",
    "pos": "adj",
    "meaning": "bắt buộc, cưỡng bách",
    "example": "The manager described the proposal as compulsory.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"bắt buộc, cưỡng bách\".",
    "translations": {
      "vi": "bắt buộc, cưỡng bách"
    }
  },
  {
    "id": "ban-77",
    "topic": "Bank",
    "word": "relocation",
    "phonetic": "/ɹɪləʊkˈeɪʃən/",
    "pos": "noun",
    "meaning": "sự chuy ển chỗ",
    "example": "The team discussed the relocation during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự chuy ển chỗ\" trong cuộc họp.",
    "translations": {
      "vi": "sự chuy ển chỗ"
    }
  },
  {
    "id": "ban-78",
    "topic": "Bank",
    "word": "enlarge",
    "phonetic": "/ɛnlˈɑːdʒ/",
    "pos": "verb",
    "meaning": "mởr ộng, khuếch trương",
    "example": "The team plans to enlarge before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"mởr ộng, khuếch trương\" trước thời hạn.",
    "translations": {
      "vi": "mởr ộng, khuếch trương"
    }
  },
  {
    "id": "ban-79",
    "topic": "Bank",
    "word": "install",
    "phonetic": "/ɪnstˈɔːl/",
    "pos": "verb",
    "meaning": "đặt, lắp đặt, cài đặt",
    "example": "The team plans to install before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"đặt, lắp đặt, cài đặt\" trước thời hạn.",
    "translations": {
      "vi": "đặt, lắp đặt, cài đặt"
    }
  },
  {
    "id": "ban-80",
    "topic": "Bank",
    "word": "suppose",
    "phonetic": "/sʌpˈəʊz/",
    "pos": "verb",
    "meaning": "giả sử, chor ằng",
    "example": "The team plans to suppose before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"giả sử, chor ằng\" trước thời hạn.",
    "translations": {
      "vi": "giả sử, chor ằng"
    }
  },
  {
    "id": "ban-81",
    "topic": "Bank",
    "word": "adjacent",
    "phonetic": "/ɐdʒˈeɪsənt/",
    "pos": "adj",
    "meaning": "liềnk ề,s át",
    "example": "The manager described the proposal as adjacent.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"liềnk ề,s át\".",
    "translations": {
      "vi": "liềnk ề,s át"
    }
  },
  {
    "id": "ban-82",
    "topic": "Bank",
    "word": "utility",
    "phonetic": "/juːtˈɪlɪti/",
    "pos": "noun",
    "meaning": "phương tiện dịch vụ công cộng",
    "example": "The team discussed the utility during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"phương tiện dịch vụ công cộng\" trong cuộc họp.",
    "translations": {
      "vi": "phương tiện dịch vụ công cộng"
    }
  },
  {
    "id": "ban-83",
    "topic": "Bank",
    "word": "conserve",
    "phonetic": "/kənˈsɝv/",
    "pos": "verb",
    "meaning": "bảot ồn, duy trì",
    "example": "The team plans to conserve before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"bảot ồn, duy trì\" trước thời hạn.",
    "translations": {
      "vi": "bảot ồn, duy trì"
    }
  },
  {
    "id": "ban-84",
    "topic": "Bank",
    "word": "chance",
    "phonetic": "/tʃˈɑːns/",
    "pos": "noun",
    "meaning": "khả năng, sự có khả năng",
    "example": "The team discussed the chance during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"khả năng, sự có khả năng\" trong cuộc họp.",
    "translations": {
      "vi": "khả năng, sự có khả năng"
    }
  },
  {
    "id": "ban-85",
    "topic": "Bank",
    "word": "dispose",
    "phonetic": "/dɪspˈəʊz/",
    "pos": "verb",
    "meaning": "xử lý, vứt bỏ, thanh lý",
    "example": "The team plans to dispose before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"xử lý, vứt bỏ, thanh lý\" trước thời hạn.",
    "translations": {
      "vi": "xử lý, vứt bỏ, thanh lý"
    }
  },
  {
    "id": "ban-86",
    "topic": "Bank",
    "word": "clear",
    "phonetic": "/klˈiə/",
    "pos": "adj",
    "meaning": "trong, trong tr ẻo;rõr àng, dễ hiểu",
    "example": "The manager described the proposal as clear.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"trong, trong tr ẻo;rõr àng, dễ hiểu\".",
    "translations": {
      "vi": "trong, trong tr ẻo;rõr àng, dễ hiểu"
    }
  },
  {
    "id": "ban-87",
    "topic": "Bank",
    "word": "solution",
    "phonetic": "/səlˈuːʃən/",
    "pos": "noun",
    "meaning": "giải pháp, đáp án",
    "example": "The team discussed the solution during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"giải pháp, đáp án\" trong cuộc họp.",
    "translations": {
      "vi": "giải pháp, đáp án"
    }
  },
  {
    "id": "ban-88",
    "topic": "Bank",
    "word": "preserve",
    "phonetic": "/pɹɪsˈɜːv/",
    "pos": "verb",
    "meaning": "giữ gìn, bảot ồn",
    "example": "The team plans to preserve before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"giữ gìn, bảot ồn\" trước thời hạn.",
    "translations": {
      "vi": "giữ gìn, bảot ồn"
    }
  },
  {
    "id": "ban-89",
    "topic": "Bank",
    "word": "consistent",
    "phonetic": "/kənsˈɪstənt/",
    "pos": "adj",
    "meaning": "kiên định, nhất quán, phù hợp",
    "example": "The manager described the proposal as consistent.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"kiên định, nhất quán, phù hợp\".",
    "translations": {
      "vi": "kiên định, nhất quán, phù hợp"
    }
  },
  {
    "id": "ban-90",
    "topic": "Bank",
    "word": "continually",
    "phonetic": "/kəntˈɪnjuːəli/",
    "pos": "adv",
    "meaning": "liên tục, không ngớt",
    "example": "The team completed the task continually.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"liên tục, không ngớt\".",
    "translations": {
      "vi": "liên tục, không ngớt"
    }
  },
  {
    "id": "env-01",
    "topic": "Environment",
    "word": "intensively",
    "phonetic": "/ɪntˈɛnsɪvli/",
    "pos": "adv",
    "meaning": "mạnh mẽ,s âus ắc",
    "example": "The team completed the task intensively.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"mạnh mẽ,s âus ắc\".",
    "translations": {
      "vi": "mạnh mẽ,s âus ắc"
    }
  },
  {
    "id": "env-02",
    "topic": "Environment",
    "word": "disturb",
    "phonetic": "/dɪstˈɜːb/",
    "pos": "verb",
    "meaning": "quấyr ầy, làm phiền",
    "example": "The team plans to disturb before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"quấyr ầy, làm phiền\" trước thời hạn.",
    "translations": {
      "vi": "quấyr ầy, làm phiền"
    }
  },
  {
    "id": "env-03",
    "topic": "Environment",
    "word": "pollutant",
    "phonetic": "/pəlˈuːtənt/",
    "pos": "noun",
    "meaning": "chất gâyô nhiễm",
    "example": "The team discussed the pollutant during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"chất gâyô nhiễm\" trong cuộc họp.",
    "translations": {
      "vi": "chất gâyô nhiễm"
    }
  },
  {
    "id": "env-04",
    "topic": "Environment",
    "word": "dense",
    "phonetic": "/dˈɛns/",
    "pos": "adj",
    "meaning": "dày đặc, đông đúc",
    "example": "The manager described the proposal as dense.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"dày đặc, đông đúc\".",
    "translations": {
      "vi": "dày đặc, đông đúc"
    }
  },
  {
    "id": "env-05",
    "topic": "Environment",
    "word": "environmental",
    "phonetic": "/ɛnvˌaɪɹənmˈɛntəl/",
    "pos": "adj",
    "meaning": "thuộc về môi trường",
    "example": "The manager described the proposal as environmental.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"thuộc về môi trường\".",
    "translations": {
      "vi": "thuộc về môi trường"
    }
  },
  {
    "id": "env-06",
    "topic": "Environment",
    "word": "leak",
    "phonetic": "/lˈiːk/",
    "pos": "noun",
    "meaning": "lỗ thủng, sự rò rỉ",
    "example": "The team discussed the leak during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"lỗ thủng, sự rò rỉ\" trong cuộc họp.",
    "translations": {
      "vi": "lỗ thủng, sự rò rỉ"
    }
  },
  {
    "id": "env-07",
    "topic": "Environment",
    "word": "disaster",
    "phonetic": "/dˌɪsˈɑːstɐ/",
    "pos": "noun",
    "meaning": "thảm hoạ",
    "example": "The team discussed the disaster during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"thảm hoạ\" trong cuộc họp.",
    "translations": {
      "vi": "thảm hoạ"
    }
  },
  {
    "id": "env-08",
    "topic": "Environment",
    "word": "discharge",
    "phonetic": "/ˈdɪsˌtʃɑɹdʒ/",
    "pos": "verb",
    "meaning": "thảir a, tuônr a, chảyra",
    "example": "The team plans to discharge before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"thảir a, tuônr a, chảyra\" trước thời hạn.",
    "translations": {
      "vi": "thảir a, tuônr a, chảyra"
    }
  },
  {
    "id": "env-09",
    "topic": "Environment",
    "word": "resource",
    "phonetic": "/ɹɪzˈɔːs/",
    "pos": "noun",
    "meaning": "nguồn, nguồnt ài nguyên",
    "example": "The team discussed the resource during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"nguồn, nguồnt ài nguyên\" trong cuộc họp.",
    "translations": {
      "vi": "nguồn, nguồnt ài nguyên"
    }
  },
  {
    "id": "env-10",
    "topic": "Environment",
    "word": "deplete",
    "phonetic": "/dɪplˈiːt/",
    "pos": "verb",
    "meaning": "làm suyy ếu, làm cạn kiệt",
    "example": "The team plans to deplete before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"làm suyy ếu, làm cạn kiệt\" trước thời hạn.",
    "translations": {
      "vi": "làm suyy ếu, làm cạn kiệt"
    }
  },
  {
    "id": "env-11",
    "topic": "Environment",
    "word": "purify",
    "phonetic": "/pjˈʊɹɪfˌaɪ/",
    "pos": "verb",
    "meaning": "lọc, làms ạch",
    "example": "The team plans to purify before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"lọc, làms ạch\" trước thời hạn.",
    "translations": {
      "vi": "lọc, làms ạch"
    }
  },
  {
    "id": "env-12",
    "topic": "Environment",
    "word": "endangered",
    "phonetic": "/ɛndˈeɪndʒəd/",
    "pos": "adj",
    "meaning": "bị đe doạ",
    "example": "The manager described the proposal as endangered.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"bị đe doạ\".",
    "translations": {
      "vi": "bị đe doạ"
    }
  },
  {
    "id": "env-13",
    "topic": "Environment",
    "word": "drought",
    "phonetic": "/dɹˈaʊt/",
    "pos": "noun",
    "meaning": "hạn hán",
    "example": "The team discussed the drought during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"hạn hán\" trong cuộc họp.",
    "translations": {
      "vi": "hạn hán"
    }
  },
  {
    "id": "env-14",
    "topic": "Environment",
    "word": "migration",
    "phonetic": "/maɪɡɹˈeɪʃən/",
    "pos": "noun",
    "meaning": "sự di cư, sự chuy ển",
    "example": "The team discussed the migration during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự di cư, sự chuy ển\" trong cuộc họp.",
    "translations": {
      "vi": "sự di cư, sự chuy ển"
    }
  },
  {
    "id": "env-15",
    "topic": "Environment",
    "word": "ecology",
    "phonetic": "/ɛkˈɒlədʒi/",
    "pos": "noun",
    "meaning": "hệ sinh thái, sinh thái học",
    "example": "The team discussed the ecology during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"hệ sinh thái, sinh thái học\" trong cuộc họp.",
    "translations": {
      "vi": "hệ sinh thái, sinh thái học"
    }
  },
  {
    "id": "env-16",
    "topic": "Environment",
    "word": "habitat",
    "phonetic": "/hˈæbɪtˌæt/",
    "pos": "noun",
    "meaning": "môi trườngs ống, nơis ống",
    "example": "The team discussed the habitat during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"môi trườngs ống, nơis ống\" trong cuộc họp.",
    "translations": {
      "vi": "môi trườngs ống, nơis ống"
    }
  },
  {
    "id": "env-17",
    "topic": "Environment",
    "word": "checkup",
    "phonetic": "/tʃˈɛkʌp/",
    "pos": "noun",
    "meaning": "khám sức khoẻ",
    "example": "The team discussed the checkup during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"khám sức khoẻ\" trong cuộc họp.",
    "translations": {
      "vi": "khám sức khoẻ"
    }
  },
  {
    "id": "env-18",
    "topic": "Environment",
    "word": "physician",
    "phonetic": "/fɪzˈɪʃən/",
    "pos": "noun",
    "meaning": "bác sĩ",
    "example": "The team discussed the physician during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"bác sĩ\" trong cuộc họp.",
    "translations": {
      "vi": "bác sĩ"
    }
  },
  {
    "id": "env-19",
    "topic": "Environment",
    "word": "diagnosis",
    "phonetic": "/dˌaɪəɡnˈəʊsɪs/",
    "pos": "noun",
    "meaning": "sự chuẩn đoán, lời chẩn đoán",
    "example": "The team discussed the diagnosis during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự chuẩn đoán, lời chẩn đoán\" trong cuộc họp.",
    "translations": {
      "vi": "sự chuẩn đoán, lời chẩn đoán"
    }
  },
  {
    "id": "env-20",
    "topic": "Environment",
    "word": "prescribe",
    "phonetic": "/pɹɪskɹˈaɪb/",
    "pos": "verb",
    "meaning": "cho thuốc, kê đơn",
    "example": "The team plans to prescribe before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"cho thuốc, kê đơn\" trước thời hạn.",
    "translations": {
      "vi": "cho thuốc, kê đơn"
    }
  },
  {
    "id": "env-21",
    "topic": "Environment",
    "word": "recognize",
    "phonetic": "/ˈɹɛkəɡˌnaɪz/",
    "pos": "verb",
    "meaning": "nhận ra, công nhận",
    "example": "The team plans to recognize before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"nhận ra, công nhận\" trước thời hạn.",
    "translations": {
      "vi": "nhận ra, công nhận"
    }
  },
  {
    "id": "env-22",
    "topic": "Environment",
    "word": "join",
    "phonetic": "/dʒˈɔɪn/",
    "pos": "verb",
    "meaning": "nối liền, gia nhập, tham gia",
    "example": "The team plans to join before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"nối liền, gia nhập, tham gia\" trước thời hạn.",
    "translations": {
      "vi": "nối liền, gia nhập, tham gia"
    }
  },
  {
    "id": "env-23",
    "topic": "Environment",
    "word": "recommend",
    "phonetic": "/ɹˌɛkəmˈɛnd/",
    "pos": "verb",
    "meaning": "khuy ên, giới thiệu, tiến cử",
    "example": "The team plans to recommend before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"khuy ên, giới thiệu, tiến cử\" trước thời hạn.",
    "translations": {
      "vi": "khuy ên, giới thiệu, tiến cử"
    }
  },
  {
    "id": "env-24",
    "topic": "Environment",
    "word": "necessary",
    "phonetic": "/nˈɛsəsəɹi/",
    "pos": "adj",
    "meaning": "cần thiế t, thiếty ếu",
    "example": "The manager described the proposal as necessary.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"cần thiế t, thiếty ếu\".",
    "translations": {
      "vi": "cần thiế t, thiếty ếu"
    }
  },
  {
    "id": "env-25",
    "topic": "Environment",
    "word": "reaction",
    "phonetic": "/ɹɪˈækʃən/",
    "pos": "noun",
    "meaning": "sự phản ứng",
    "example": "The team discussed the reaction during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự phản ứng\" trong cuộc họp.",
    "translations": {
      "vi": "sự phản ứng"
    }
  },
  {
    "id": "env-26",
    "topic": "Environment",
    "word": "simple",
    "phonetic": "/sˈɪmpəl/",
    "pos": "adj",
    "meaning": "đơn giản",
    "example": "The manager described the proposal as simple.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"đơn giản\".",
    "translations": {
      "vi": "đơn giản"
    }
  },
  {
    "id": "env-27",
    "topic": "Environment",
    "word": "exposure",
    "phonetic": "/ɛkspˈəʊʒɐ/",
    "pos": "noun",
    "meaning": "sự phơi bày, sự bốc tr ần",
    "example": "The team discussed the exposure during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự phơi bày, sự bốc tr ần\" trong cuộc họp.",
    "translations": {
      "vi": "sự phơi bày, sự bốc tr ần"
    }
  },
  {
    "id": "env-28",
    "topic": "Environment",
    "word": "fatigue",
    "phonetic": "/fɐtˈiːɡ/",
    "pos": "noun",
    "meaning": "sự mệt mỏi, công việc mệt nhọc",
    "example": "The team discussed the fatigue during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự mệt mỏi, công việc mệt nhọc\" trong cuộc họp.",
    "translations": {
      "vi": "sự mệt mỏi, công việc mệt nhọc"
    }
  },
  {
    "id": "env-29",
    "topic": "Environment",
    "word": "symptom",
    "phonetic": "/sˈɪmptəm/",
    "pos": "noun",
    "meaning": "triệu chứng",
    "example": "The team discussed the symptom during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"triệu chứng\" trong cuộc họp.",
    "translations": {
      "vi": "triệu chứng"
    }
  },
  {
    "id": "env-30",
    "topic": "Environment",
    "word": "examination",
    "phonetic": "/ɛɡzˌæmɪnˈeɪʃən/",
    "pos": "noun",
    "meaning": "sự kiểm tr a, sự thăm khám",
    "example": "The team discussed the examination during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự kiểm tr a, sự thăm khám\" trong cuộc họp.",
    "translations": {
      "vi": "sự kiểm tr a, sự thăm khám"
    }
  },
  {
    "id": "env-31",
    "topic": "Environment",
    "word": "easily",
    "phonetic": "/ˈiːzɪli/",
    "pos": "adv",
    "meaning": "dễ dàng, thoải mái",
    "example": "The team completed the task easily.",
    "exampleTranslation": "Nhóm đã hoàn thành công việc theo cách \"dễ dàng, thoải mái\".",
    "translations": {
      "vi": "dễ dàng, thoải mái"
    }
  },
  {
    "id": "env-32",
    "topic": "Environment",
    "word": "dental",
    "phonetic": "/dˈɛntəl/",
    "pos": "adj",
    "meaning": "thuộc về răng/nha khoa",
    "example": "The manager described the proposal as dental.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"thuộc về răng/nha khoa\".",
    "translations": {
      "vi": "thuộc về răng/nha khoa"
    }
  },
  {
    "id": "env-33",
    "topic": "Environment",
    "word": "pharmaceutical",
    "phonetic": "/fˌɑːmɐsˈuːtɪkəl/",
    "pos": "adj",
    "meaning": "thuộc dược phẩm",
    "example": "The manager described the proposal as pharmaceutical.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"thuộc dược phẩm\".",
    "translations": {
      "vi": "thuộc dược phẩm"
    }
  },
  {
    "id": "env-34",
    "topic": "Environment",
    "word": "relieve",
    "phonetic": "/ɹɪlˈiːv/",
    "pos": "verb",
    "meaning": "làm dịu, làm giảm bớt",
    "example": "The team plans to relieve before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"làm dịu, làm giảm bớt\" trước thời hạn.",
    "translations": {
      "vi": "làm dịu, làm giảm bớt"
    }
  },
  {
    "id": "env-35",
    "topic": "Environment",
    "word": "induce",
    "phonetic": "/ɪndjˈuːs/",
    "pos": "verb",
    "meaning": "gây ra, đem lại",
    "example": "The team plans to induce before the deadline.",
    "exampleTranslation": "Nhóm dự định thực hiện hành động \"gây ra, đem lại\" trước thời hạn.",
    "translations": {
      "vi": "gây ra, đem lại"
    }
  },
  {
    "id": "env-36",
    "topic": "Environment",
    "word": "insurance",
    "phonetic": "/ɪnʃˈɔːɹəns/",
    "pos": "noun",
    "meaning": "sự bảo hiểm",
    "example": "The team discussed the insurance during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự bảo hiểm\" trong cuộc họp.",
    "translations": {
      "vi": "sự bảo hiểm"
    }
  },
  {
    "id": "env-37",
    "topic": "Environment",
    "word": "nutrition",
    "phonetic": "/njuːtɹˈɪʃən/",
    "pos": "noun",
    "meaning": "sự nuôi dưỡng, dinh dưỡng",
    "example": "The team discussed the nutrition during the meeting.",
    "exampleTranslation": "Nhóm đã thảo luận về \"sự nuôi dưỡng, dinh dưỡng\" trong cuộc họp.",
    "translations": {
      "vi": "sự nuôi dưỡng, dinh dưỡng"
    }
  },
  {
    "id": "env-38",
    "topic": "Environment",
    "word": "susceptible",
    "phonetic": "/səsˈɛptəbəl/",
    "pos": "adj",
    "meaning": "nhạy cảm, dễ bị, dễ mắc",
    "example": "The manager described the proposal as susceptible.",
    "exampleTranslation": "Người quản lý mô tả đề xuất là \"nhạy cảm, dễ bị, dễ mắc\".",
    "translations": {
      "vi": "nhạy cảm, dễ bị, dễ mắc"
    }
  }
];
