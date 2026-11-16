"""Build the complete reviewed catalog from frozen references and authored contexts.

CMUdict supplies American-English phonemes and primary lexical stress. IPA is
broad phonemic transcription; secondary stress and optional syllable dots are
omitted. No espeak output or old example templates are used.
"""
from pathlib import Path
import json
import re
from vocabulary_language_content import VERBS, ADVERBS, SPECIAL

ROOT = Path(__file__).resolve().parents[1]
baseline = json.loads((ROOT / "new/vocabulary-review-baseline.json").read_text())
references = json.loads((ROOT / "new/vocabulary-lexical-evidence.json").read_text())["entries"]

POS = {
    "impressed": "adjective", "accessible": "adjective", "aware": "adjective",
    "necessarily": "adverb", "costly": "adjective", "limit": "noun",
    "manufacturing": "noun", "customs": "noun", "compensate": "verb",
    "elegant": "adjective", "tend": "verb", "coordination": "noun", "renewal": "noun",
    "cutting edge": "noun", "bulk": "noun", "onward": "adverb", "bankrupt": "adjective",
    "mere": "adjective", "lay": "verb", "lean": "verb", "individual": "adjective",
    "objective": "noun", "mimic": "verb", "log": "noun", "wholesale": "adjective",
    "retail": "noun", "right": "noun", "several": "determiner", "negative": "adjective",
    "concentrate": "verb", "contrary": "adjective", "joint": "adjective", "hide": "noun",
}
MEANINGS = {
    "negative": "tiêu cực; âm tính", "concentrate": "tập trung, chú tâm",
    "contrary": "trái ngược, đối lập", "manufacturing": "sự sản xuất, chế tạo",
    "bulk": "số lượng lớn, khối lượng lớn; phần chính", "cutting edge": "vị trí đi đầu, trình độ tiên tiến nhất; cạnh sắc",
    "onward": "tiếp tục về phía trước", "bankrupt": "phá sản, vỡ nợ", "mere": "chỉ là, đơn thuần",
    "lay": "đặt, để; đẻ (trứng)", "lean": "nghiêng, dựa", "individual": "riêng lẻ, cá nhân",
    "objective": "mục tiêu", "mimic": "bắt chước, mô phỏng", "wholesale": "bán buôn, bán sỉ",
    "joint": "chung, phối hợp", "hide": "da động vật", "right": "quyền; điều đúng đắn",
    "observe": "quan sát; tuân thủ", "dismiss": "sa thải; bác bỏ, bỏ qua",
    "settle": "giải quyết, dàn xếp; thanh toán", "assume": "giả định, cho rằng; đảm nhận",
    "admit": "thừa nhận; cho phép vào, tiếp nhận", "critical": "quan trọng, có tính quyết định; phê bình",
    "dull": "buồn tẻ; cùn; chậm hiểu", "rational": "hợp lý, dựa trên lý trí",
    "serious": "nghiêm túc; nghiêm trọng", "justice": "công lý, sự công bằng; hệ thống tư pháp",
    "specialty": "chuyên môn; món hoặc sản phẩm đặc trưng", "head office": "trụ sở chính",
    "cabin crew": "phi hành đoàn phục vụ hành khách, tiếp viên hàng không",
    "goods": "hàng hóa", "regardless": "bất kể, bất chấp", "log": "nhật ký, bản ghi; khúc gỗ",
    "prior": "trước, có trước", "liable": "có trách nhiệm pháp lý; có khả năng bị",
    "dental": "thuộc răng, nha khoa", "airline": "hãng hàng không", "line": "hàng, dòng",
    "prospective": "tiềm năng, có triển vọng", "advance": "sự tiến bộ; khoản ứng trước",
    "compensation": "sự bồi thường; tiền thù lao", "renewal": "sự gia hạn; sự đổi mới",
    "projection": "sự dự báo, sự ước tính; sự trình chiếu", "outstanding": "nổi bật, xuất sắc; chưa thanh toán, chưa giải quyết",
    "mounting": "đang tăng lên", "informed": "có hiểu biết, dựa trên thông tin đầy đủ",
    "discharge": "thải ra, xả ra; cho xuất viện", "qualify": "đủ điều kiện; làm cho đủ điều kiện",
    "diagnose": "chẩn đoán, xác định nguyên nhân", "proficiency": "sự thành thạo, sự thông thạo",
    "authority": "thẩm quyền, quyền lực; cơ quan chức trách", "exposure": "sự tiếp xúc, sự phơi nhiễm; sự phơi bày",
    "savvy": "sự hiểu biết thực tế, sự am hiểu", "concourse": "sảnh lớn ở sân bay hoặc nhà ga; sự tụ họp",
    "coverage": "phạm vi bảo hiểm; phạm vi bao phủ; việc đưa tin", "host": "người chủ trì, người đón tiếp; chủ nhà",
    "capital": "vốn; thủ đô; chữ viết hoa", "credit": "tín dụng; sự công nhận; tín chỉ",
    "stock": "hàng tồn kho; cổ phần", "traffic": "giao thông, lưu lượng xe cộ",
    "quarter": "quý; một phần tư", "claim": "yêu cầu, lời tuyên bố; yêu cầu bồi thường",
    "boast": "lời khoe khoang, sự khoe khoang", "bother": "điều phiền phức, sự phiền toái",
    "grid": "lưới, mạng lưới", "strike": "đánh, va vào; đình công",
    "warrant": "làm cơ sở cho, đáng được; bảo đảm", "upset": "làm xáo trộn; làm buồn, làm lo lắng",
    "grill": "vỉ nướng; món nướng", "regard": "coi, xem như; quan tâm",
    "likely": "có khả năng, có lẽ", "faithful": "trung thành", "poll": "cuộc thăm dò ý kiến; cuộc bỏ phiếu",
    "scheme": "kế hoạch, phương án", "rate": "mức giá, tỷ lệ, mức độ", "capacity": "sức chứa; năng lực",
    "calculation": "sự tính toán, phép tính", "law": "luật, pháp luật", "legislation": "luật pháp, việc lập pháp",
    "fee": "phí, lệ phí", "impact": "tác động, ảnh hưởng; sự va chạm", "interest": "tiền lãi; sự quan tâm, lợi ích",
    "service": "dịch vụ, sự phục vụ", "entitlement": "quyền được hưởng, quyền lợi",
}
MEANINGS.update({
    "form":"biểu mẫu; hình thức, dạng", "act":"đạo luật; hành động",
    "overview":"cái nhìn tổng quan, bản tổng quan", "showing":"suất chiếu; sự trình diễn",
    "reference":"lời giới thiệu, người giới thiệu; sự tham khảo", "article":"bài báo; vật phẩm; điều khoản",
    "assumption":"giả định, điều được giả định", "inventory":"hàng tồn kho; danh mục kiểm kê",
    "folder":"bìa hồ sơ; thư mục", "performance":"buổi biểu diễn; hiệu quả thực hiện công việc",
    "attachment":"tệp hoặc phần đính kèm; sự gắn bó", "alarm":"báo động, thiết bị báo động; sự hoảng sợ",
    "shipment":"lô hàng; việc gửi hàng", "consignment":"lô hàng ký gửi; sự ký gửi",
    "charity":"tổ chức từ thiện; hoạt động từ thiện, lòng nhân ái", "sequel":"phần tiếp theo (của phim, sách); hậu quả",
    "goal":"mục tiêu; khung thành", "inflation":"lạm phát; sự bơm phồng", "fatigue":"sự mệt mỏi, sự kiệt sức",
    "limousine":"xe limousine, xe hạng sang", "plumber":"thợ ống nước", "container":"vật chứa; bình, hộp, thùng",
    "accommodation":"chỗ ở; sự điều chỉnh để đáp ứng yêu cầu, sự thỏa thuận",
    "current":"dòng, luồng, dòng chảy", "broadcast":"chương trình phát thanh, truyền hình; sự phát sóng",
    "brush":"bàn chải, cọ", "budget":"ngân sách", "control":"sự kiểm soát, sự điều khiển",
    "counter":"quầy hàng, quầy thu ngân", "crash":"sự va chạm; sự sụp đổ; sự cố hệ thống",
    "damage":"thiệt hại, sự hư hỏng", "decrease":"sự giảm, sự sụt giảm", "delay":"sự chậm trễ, sự trì hoãn",
    "detail":"chi tiết", "document":"tài liệu, văn kiện", "drive":"chuyến đi bằng xe; nỗ lực, chiến dịch",
    "experiment":"thí nghiệm, cuộc thử nghiệm", "favor":"ân huệ, sự giúp đỡ; sự ưu ái",
    "figure":"con số, số liệu; hình dáng", "finance":"tài chính; nguồn kinh phí", "fold":"gấp, xếp",
    "harbor":"bến cảng", "highlight":"điểm nổi bật, phần đáng chú ý", "influence":"sự ảnh hưởng, sự tác động",
    "mention":"việc đề cập, lần nhắc đến", "mortgage":"khoản vay thế chấp; sự thế chấp",
    "purchase":"việc mua hàng; món hàng đã mua", "refund":"khoản hoàn tiền, sự hoàn tiền",
    "regret":"sự hối tiếc, sự ân hận", "rent":"tiền thuê; sự thuê mướn", "repayment":"sự hoàn trả tiền, sự trả nợ",
    "representative":"người đại diện", "rival":"đối thủ", "roadside":"lề đường, bên đường",
    "salvage":"việc cứu hộ, thu hồi tài sản; tài sản thu hồi", "scene":"hiện trường; cảnh, quang cảnh",
    "slump":"sự sụt giảm mạnh, sự suy thoái", "subsidiary":"công ty con",
    "upstairs":"ở tầng trên, lên tầng trên", "cancellation":"sự hủy bỏ",
    "reception":"quầy lễ tân; sự tiếp đón; tiệc chiêu đãi", "brand":"thương hiệu, nhãn hàng",
    "functional":"hoạt động được; thuộc chức năng", "tend":"có xu hướng; chăm sóc",
    "promotion":"sự thăng chức; sự quảng bá", "cabin crew":"đội tiếp viên hàng không",
    "satisfaction":"sự hài lòng, sự thỏa mãn", "interfere":"can thiệp; gây trở ngại",
    "retirement":"sự nghỉ hưu", "qualification":"trình độ, năng lực; bằng cấp",
    "signature":"chữ ký", "consent":"sự đồng ý, sự chấp thuận", "warning":"lời cảnh báo, sự cảnh báo",
    "forecast":"dự báo", "questionnaire":"bảng câu hỏi khảo sát", "reimbursement":"sự hoàn trả chi phí",
    "recruitment":"sự tuyển dụng", "career":"sự nghiệp, nghề nghiệp", "commuter":"người đi lại thường xuyên giữa nhà và nơi làm việc",
    "client":"khách hàng", "artist":"nghệ sĩ", "customer":"khách hàng",
    "adapter":"thiết bị chuyển đổi, bộ chuyển đổi", "applicant":"người ứng tuyển, ứng viên",
    "appreciative of":"biết ơn, trân trọng", "stagnant":"trì trệ, không phát triển; tù đọng",
    "reflective":"phản quang, phản chiếu; suy tư", "efficient":"hiệu quả, có hiệu suất cao",
    "seriously":"nghiêm túc; nghiêm trọng", "instantly":"ngay lập tức",
    "subject":"chủ đề, môn học", "terrific":"tuyệt vời, xuất sắc; rất lớn, dữ dội",
    "meet":"đáp ứng (yêu cầu); gặp, gặp gỡ", "live":"trực tiếp; còn sống",
    "separate":"riêng, tách biệt", "block":"khối, tảng, chướng ngại vật",
    "judge":"thẩm phán; người đánh giá, giám khảo", "manufacture":"sự sản xuất, chế tạo",
    "executive":"thuộc điều hành, cấp quản lý", "official":"chính thức, thuộc cơ quan chức trách",
    "equivalent":"tương đương", "moral":"thuộc đạo đức, hợp đạo đức",
    "power":"năng lượng, điện năng; quyền lực, khả năng", "priority":"ưu tiên, mức độ quan trọng",
    "admittance":"quyền vào, sự cho phép vào", "effectiveness":"tính hiệu quả",
    "efficiency":"hiệu suất, hiệu quả sử dụng nguồn lực", "preference":"sở thích, sự ưu tiên",
    "installation":"việc lắp đặt, cài đặt", "wellbeing":"sự khỏe mạnh, sự an lành",
    "aid":"sự giúp đỡ, sự cứu trợ, viện trợ", "license":"giấy phép, sự cho phép",
    "cuisine":"ẩm thực, cách nấu nướng", "obligation":"nghĩa vụ, trách nhiệm",
})

# Reviewed American-English pronunciations for phrases and POS-dependent words.
IPA = {
    "according to": "/əˈkɔrdɪŋ tə/", "appreciative of": "/əˈpriʃətɪv əv/",
    "baggage claim": "/ˈbæɡɪdʒ kleɪm/", "bar code": "/ˈbɑr koʊd/",
    "bottom line": "/ˈbɑtəm laɪn/", "cabin crew": "/ˈkæbɪn kru/",
    "chain store": "/ˈtʃeɪn stɔr/", "check in": "/tʃɛk ˈɪn/",
    "check out": "/tʃɛk ˈaʊt/", "control panel": "/kənˈtroʊl pænəl/",
    "cover letter": "/ˈkʌvɚ lɛtɚ/", "cutting edge": "/ˈkʌtɪŋ ɛdʒ/",
    "flight attendant": "/ˈflaɪt ətɛndənt/", "head office": "/ˈhɛd ɔfɪs/",
    "log on": "/lɔɡ ˈɑn/", "spare part": "/ˈspɛr pɑrt/",
    "spare time": "/ˈspɛr taɪm/", "utility bill": "/juˈtɪləti bɪl/",
    "duty-free": "/ˈduti fri/", "wastage": "/ˈweɪstɪdʒ/",
    "associate": "/əˈsoʊsieɪt/", "attribute": "/əˈtrɪbjut/",
    "conduct": "/kənˈdʌkt/", "present": "/prɪˈzɛnt/",
    "produce": "/prəˈdus/", "refuse": "/rɪˈfjuz/", "refusal": "/rɪˈfjuzəl/",
    "object": "/əbˈdʒɛkt/", "contract": "/ˈkɑntrækt/",
    "permit": "/pɚˈmɪt/", "project": "/ˈprɑdʒɛkt/",
    "content": "/ˈkɑntɛnt/", "live": "/laɪv/", "minute": "/ˈmɪnɪt/",
    "minutes": "/ˈmɪnɪts/", "resume": "/ˈrɛzəmeɪ/", "read": "/rid/",
    "separate": "/ˈsɛpɚət/", "duplicate": "/ˈduplɪkət/", "abstract": "/ˈæbstrækt/",
    "estimate": "/ˈɛstəmeɪt/", "advocate": "/ˈædvəkət/", "concentrate": "/ˈkɑnsəntreɪt/",
    "increase": "/ˈɪnkris/", "decrease": "/ˈdikris/", "discount": "/ˈdɪskaʊnt/",
    "refund": "/ˈrifʌnd/", "export": "/ˈɛkspɔrt/", "import": "/ˈɪmpɔrt/",
    "rebel": "/ˈrɛbəl/", "entrance": "/ˈɛntrəns/", "appropriate": "/əˈproʊpriət/",
    "alternate": "/ˈɔltɚnət/", "perfect": "/ˈpɝfɪkt/", "excuse": "/ɪkˈskjus/",
    "specialty": "/ˈspɛʃəlti/", "coordination": "/koʊɔrdəˈneɪʃən/",
    "compensate": "/ˈkɑmpənseɪt/", "elegant": "/ˈɛləɡənt/",
    "coordinate": "/koʊˈɔrdəneɪt/", "update": "/ˈʌpdeɪt/", "upgrade": "/ˈʌpɡreɪd/",
    "unable": "/ʌnˈeɪbəl/", "inaccurate": "/ɪnˈækjɚət/", "unoccupied": "/ʌnˈɑkjəpaɪd/",
    "inefficient": "/ɪnɪˈfɪʃənt/", "inexperienced": "/ɪnɪkˈspɪriənst/",
}

# CMUdict ARPAbet to broad American IPA, preserving lexical stress and syllable
# onsets. Vowel length marks are omitted consistently in this phonemic notation.
PHONES = dict(zip(
    "AA AE AH AO AW AY B CH D DH EH ER EY F G HH IH IY JH K L M N NG OW OY P R S SH T TH UH UW V W Y Z ZH".split(),
    "ɑ æ ʌ ɔ aʊ aɪ b tʃ d ð ɛ ɝ eɪ f ɡ h ɪ i dʒ k l m n ŋ oʊ ɔɪ p r s ʃ t θ ʊ u v w j z ʒ".split(),
))
ONSETS = {tuple(x.split()) for x in [
    "P R", "B R", "T R", "D R", "K R", "G R", "F R", "TH R", "SH R",
    "P L", "B L", "K L", "G L", "F L", "S L", "S W", "T W", "D W", "K W", "G W",
    "S P", "S T", "S K", "S M", "S N", "S F", "S V", "F Y", "K Y", "B Y", "P Y",
    "V Y", "M Y", "N Y", "HH Y", "S P R", "S T R", "S K R", "S P L", "S K L", "S K W",
]}

def pronunciation(word):
    if word in IPA:
        return IPA[word], "reviewed-phrase-or-homograph"
    phones = references[word]["pronunciations"][0]
    if not phones:
        raise ValueError("Missing pronunciation: " + word)
    stress_positions = set()
    previous_vowel = -1
    for i, p in enumerate(phones):
        if p[-1:].isdigit():
            if p.endswith("1"):
                cluster = [re.sub(r"\d", "", x) for x in phones[previous_vowel + 1:i]]
                onset_length = 0
                for size in range(1, min(3, len(cluster)) + 1):
                    if size == 1 and cluster[-1] != "NG" or tuple(cluster[-size:]) in ONSETS:
                        onset_length = size
                stress_positions.add(i - onset_length)
            previous_vowel = i
    output = ""
    for i, phone in enumerate(phones):
        if i in stress_positions:
            output += "ˈ"
        base = re.sub(r"\d", "", phone)
        symbol = "ə" if phone == "AH0" else "ɚ" if phone == "ER0" else PHONES[base]
        output += symbol
    return "/" + output + "/", "cmudict-broad-american"

PEOPLE = set("qualified professional impressed eligible apprehensive diligent accustomed involved responsible respectful aware concerned pleased experienced capable courteous attentive grateful excited interested dedicated informed anxious ambitious bored careless competent delighted determined elderly enthusiastic forgetful frank impatient inexperienced jealous jobless keen knowledgeable loyal optimistic pessimistic polite satisfied suspicious bankrupt receptive selective serious cheerful".split())
ROOMS = set("comfortable spacious vacant unoccupied tidy crowded secluded".split())
OBJECTS = set("authentic innovative reliable accurate compatible superior damaged tailored defective perishable fragile faulty flexible functional handy harmful hazardous invaluable priceless sharp stable stunning waterproof worthless".split())
VI_ADJECTIVES = {
    "apprehensive":"lo lắng", "diligent":"chăm chỉ", "professional":"chuyên nghiệp",
    "impressed":"ấn tượng", "involved":"có tham gia", "responsible":"có trách nhiệm",
    "respectful":"lễ phép", "concerned":"lo lắng", "pleased":"hài lòng",
    "courteous":"lịch sự", "attentive":"chăm chú", "excited":"hào hứng",
    "interested":"quan tâm", "dedicated":"tận tâm", "anxious":"lo lắng",
    "ambitious":"đầy tham vọng", "bored":"buồn chán", "careless":"bất cẩn",
    "competent":"có năng lực", "delighted":"rất vui", "determined":"quyết tâm",
    "enthusiastic":"nhiệt tình", "forgetful":"hay quên", "frank":"thẳng thắn",
    "impatient":"thiếu kiên nhẫn", "inexperienced":"thiếu kinh nghiệm",
    "loyal":"trung thành", "optimistic":"lạc quan", "pessimistic":"bi quan",
    "polite":"lịch sự", "satisfied":"hài lòng", "receptive":"sẵn sàng tiếp thu",
    "selective":"có chọn lọc", "serious":"nghiêm túc", "systematic":"có hệ thống",
    "differential":"có sự khác biệt", "probable":"có khả năng xảy ra",
    "imaginative":"giàu tính sáng tạo", "advantageous":"có lợi", "beneficial":"có lợi",
    "functional":"hoạt động được", "proper":"phù hợp", "predictable":"có thể dự đoán",
    "practical":"thiết thực", "improper":"không phù hợp", "moral":"đúng về mặt đạo đức",
    "revised":"đã được sửa đổi", "combined":"được kết hợp", "reverse":"theo chiều ngược lại",
    "unfavorable":"không thuận lợi", "disposable":"dùng một lần",
}

NOUN_SPECIAL = {
    "bank":("The bank is near our office.","Ngân hàng ở gần văn phòng chúng tôi."),
    "log":("Please check the system log.","Hãy kiểm tra nhật ký hệ thống."),
    "gestures":("A polite gesture reassures customers.","Một cử chỉ lịch sự trấn an khách hàng."),
    "gesture":("A polite gesture reassures customers.","Một cử chỉ lịch sự trấn an khách hàng."),
    "spare time":("She studies English in her spare time.","Cô ấy học tiếng Anh trong thời gian rảnh."),
    "leisure":("We have little time for leisure.","Chúng tôi có ít thời gian để nghỉ ngơi."),
    "ability":("She has the ability to lead the team.","Cô ấy có khả năng lãnh đạo đội."),
    "accommodation":("The company arranges accommodation for visitors.","Công ty bố trí chỗ ở cho khách."),
    "baggage claim":("Please wait at baggage claim.","Hãy chờ ở khu nhận hành lý."),
    "bar code":("The cashier scanned the bar code.","Thu ngân quét mã vạch."),
    "bottom line":("The bottom line is that we need more staff.","Điểm mấu chốt là chúng tôi cần thêm nhân viên."),
    "cabin crew":("The cabin crew assisted the passengers.","Phi hành đoàn phục vụ đã hỗ trợ hành khách."),
    "chain store":("She works at a chain store.","Cô ấy làm tại một cửa hàng thuộc chuỗi."),
    "control panel":("The technician checked the control panel.","Kỹ thuật viên kiểm tra bảng điều khiển."),
    "cover letter":("Please attach your cover letter.","Hãy đính kèm thư xin việc."),
    "flight attendant":("The flight attendant explained the safety rules.","Tiếp viên hàng không giải thích quy định an toàn."),
    "head office":("The head office approved the budget.","Trụ sở chính phê duyệt ngân sách."),
    "spare part":("We ordered a spare part for the machine.","Chúng tôi đặt một phụ tùng cho máy."),
    "utility bill":("Please pay the utility bill by Friday.","Hãy thanh toán hóa đơn điện nước trước thứ Sáu."),
    "wastage":("Better planning reduces material wastage.","Lập kế hoạch tốt hơn làm giảm hao hụt vật liệu."),
    "grievance":("The employee filed a formal grievance.","Nhân viên nộp đơn khiếu nại chính thức."),
    "priority":("Customer safety is our first priority.","An toàn của khách hàng là ưu tiên hàng đầu của chúng tôi."),
    "currency":("You can exchange currency at the bank.","Bạn có thể đổi tiền tại ngân hàng."),
    "furniture":("The office needs new furniture.","Văn phòng cần nội thất mới."),
    "fuel":("The vehicle needs more fuel.","Xe cần thêm nhiên liệu."),
    "material":("Please select a suitable material.","Hãy chọn vật liệu phù hợp."),
    "fabric":("This fabric is durable and soft.","Loại vải này bền và mềm."),
    "chemical":("The chemical must be stored safely.","Hóa chất phải được cất giữ an toàn."),
    "water":("Please bring some drinking water.","Hãy mang theo nước uống."),
}

NEGATIVE_VERBS = set("procrastinate disappoint infuriate cause distract misplace jeopardize misrepresent mishear disturb interrupt stare forget impersonate".split())
SUBJECT_VERBS = {
    "lack":("Some applicants ","Một số ứng viên "),
    "affect":("These changes can ","Những thay đổi này có thể "),
    "soar":("Prices can ","Giá có thể "), "fall":("Sales can ","Doanh số có thể "),
    "dwindle":("Supplies can ","Nguồn cung có thể "), "impede":("Roadworks can ","Việc sửa đường có thể "),
    "expire":("The permit will ","Giấy phép sẽ "), "tend":("Our employees ","Nhân viên chúng tôi "),
    "last":("The new battery can ","Pin mới có thể "), "arise":("Problems can ","Vấn đề có thể "),
    "occur":("Errors can ","Lỗi có thể "), "suffocate":("People can ","Mọi người có thể "),
    "fluctuate":("Demand can ","Nhu cầu có thể "), "pollute":("Factories can ","Nhà máy có thể "),
    "resemble":("The new models ","Các mẫu mới "), "owe":("Some customers ","Một số khách hàng "),
    "deserve":("Workers ","Người lao động "), "appear":("Their names ","Tên của họ "),
    "intend":("We ","Chúng tôi "), "like":("We ","Chúng tôi "), "prefer":("We ","Chúng tôi "),
    "thrive":("Small businesses can ","Doanh nghiệp nhỏ có thể "), "evolve":("Businesses must ","Doanh nghiệp phải "),
    "emerge":("The company hopes to ","Công ty hy vọng "), "imply":("These findings ","Những phát hiện này "),
    "discharge":("Factories must not ","Nhà máy không được "), "deplete":("Overuse can ","Sử dụng quá mức có thể "),
    "upset":("Unexpected delays can ","Chậm trễ bất ngờ có thể "), "shine":("The windows ","Những ô cửa "),
}

def first_meaning(text):
    text = re.sub(r"\([^)]*\)", "", text)
    return text.split(";")[0].split(",")[0].strip().removeprefix("thuộc về ")

def example(word, pos, meaning):
    if word in SPECIAL:
        return (*SPECIAL[word], "individual-context")
    if pos == "verb":
        phrase, translation = VERBS[word]
        if word in SUBJECT_VERBS:
            en, vi = SUBJECT_VERBS[word]
            return en + phrase + ".", vi + translation + ".", "authored-verb-complement"
        prefix_en, prefix_vi = ("Do not ", "Đừng ") if word in NEGATIVE_VERBS else ("Please ", "Hãy ")
        return prefix_en + phrase + ".", prefix_vi + translation + ".", "authored-verb-complement"
    if pos == "adverb":
        return (*ADVERBS[word], "individual-adverb-context")
    vi = first_meaning(meaning)
    if pos == "adjective":
        vi = VI_ADJECTIVES.get(word, vi)
        if word in PEOPLE:
            return f"The employee seemed {word} during the interview.", f"Nhân viên có vẻ {vi} trong buổi phỏng vấn.", "person-adjective"
        if word in ROOMS:
            return f"The meeting room is {word}.", f"Phòng họp {vi}.", "room-adjective"
        if word in OBJECTS:
            return f"The new product is {word}.", f"Sản phẩm mới {vi}.", "product-adjective"
        return f"The proposed plan is {word}.", f"Kế hoạch được đề xuất {vi}.", "plan-adjective"
    if word in NOUN_SPECIAL:
        return (*NOUN_SPECIAL[word], "individual-noun-context")
    if pos != "noun":
        raise ValueError("No context for " + word)
    classes = references[word]["nounClasses"]
    cls = classes[0] if classes else None
    if cls == 18:  # noun.person
        return f"The {word} answered our questions.", f"{vi[:1].upper()+vi[1:]} đã trả lời các câu hỏi của chúng tôi.", "person-noun"
    if cls == 15:  # noun.location
        return f"The {word} is near the station.", f"{vi[:1].upper()+vi[1:]} ở gần nhà ga.", "location-noun"
    if cls == 13:  # noun.food
        return f"We ordered the {word} at the restaurant.", f"Chúng tôi gọi {vi} tại nhà hàng.", "food-noun"
    if cls == 10:  # noun.communication
        return f"Please read the {word} carefully.", f"Hãy đọc {vi} cẩn thận.", "communication-noun"
    if cls == 6:  # noun.artifact
        return f"We inspected the {word} yesterday.", f"Chúng tôi kiểm tra {vi} hôm qua.", "artifact-noun"
    if cls == 12:  # noun.feeling
        return f"She expressed {word} in her message.", f"Cô ấy bày tỏ {vi} trong lời nhắn.", "feeling-noun"
    if cls == 27:  # noun.substance
        return f"We need more {word} for this project.", f"Chúng tôi cần thêm {vi} cho dự án này.", "material-noun"
    return f"We discussed the {word} at the meeting.", f"Chúng tôi thảo luận về {vi} tại cuộc họp.", "discussion-noun"

reviewed = {}
report = []
for entry in baseline:
    word = entry["word"]
    pos = POS.get(word, entry["pos"].split(", ")[0])
    pos = {"adj":"adjective", "adv":"adverb"}.get(pos, pos)
    meaning = MEANINGS.get(word, entry["meaning"])
    ipa, ipa_method = pronunciation(word)
    en, vi, context = example(word, pos, meaning)
    fields = dict(phonetic=ipa, pos=pos, meaning=meaning, example=en, exampleTranslation=vi)
    reviewed[entry["id"]] = {"word":word, **fields}
    report.append({"id":entry["id"],"word":word,
        "changedFields":[key for key,value in fields.items() if entry[key] != value],
        "pronunciationReference":ipa_method,"usageContext":context,
        "lexicalPartsOfSpeech":references[word]["partsOfSpeech"]})

(ROOT / "new/vocabulary-reviewed.json").write_text(json.dumps(reviewed,ensure_ascii=False,indent=2)+"\n")
(ROOT / "new/vocabulary-language-review-report.json").write_text(json.dumps({
    "reviewDate":"2026-10-13", "catalogSize":len(reviewed),
    "counts":{key:sum(key in entry["changedFields"] for entry in report)
              for key in ["phonetic", "pos", "meaning", "example", "exampleTranslation"]},
    "pronunciation":"Broad American English IPA; primary stress retained; secondary stress and optional length/dot marks omitted.",
    "sources":{"cmudict":"https://github.com/cmusphinx/cmudict","wordnet":"https://wordnet.princeton.edu/"},
    "examples":"Authored bilingual contexts; verb complements and special grammatical cases are explicit. These examples are not from the PDF.",
    "entries":report},ensure_ascii=False,indent=2)+"\n")
print(f"Built {len(reviewed)} complete reviewed entries.")
