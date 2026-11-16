"""Authored usage contexts. Each verb has its own complement, never a bare slot."""

def table(text):
    return {fields[0]: fields[1:] for line in text.strip().splitlines()
            if (fields := line.split('|'))}

# A complete, context-specific verb phrase and its Vietnamese counterpart.
VERBS = table('''
meet|meet the requirements|đáp ứng các yêu cầu
hire|hire a new assistant|thuê một trợ lý mới
identify|identify the main problem|xác định vấn đề chính
associate|associate this brand with quality|liên hệ thương hiệu này với chất lượng
lack|lack the necessary experience|thiếu kinh nghiệm cần thiết
appeal|appeal to younger customers|thu hút khách hàng trẻ tuổi hơn
specialize|specialize in business law|chuyên về luật kinh doanh
entitle|entitle members to a discount|cho phép hội viên được hưởng giảm giá
recruit|recruit more engineers|tuyển thêm kỹ sư
comply|comply with the safety rules|tuân thủ các quy định an toàn
refrain|refrain from smoking here|tránh hút thuốc ở đây
revise|revise the final report|chỉnh sửa báo cáo cuối cùng
mandate|mandate regular safety checks|yêu cầu kiểm tra an toàn thường xuyên
authorize|authorize the bank transfer|phê duyệt việc chuyển khoản
restrict|restrict access to this room|hạn chế quyền vào phòng này
adhere|adhere to the company policy|tuân thủ chính sách công ty
enable|enable online payments|cho phép thanh toán trực tuyến
abolish|abolish the outdated rule|bãi bỏ quy định lỗi thời
submit|submit your application online|nộp hồ sơ trực tuyến
remind|remind me about the meeting|nhắc tôi về cuộc họp
instruct|instruct the staff on safety|hướng dẫn nhân viên về an toàn
notify|notify customers of the delay|thông báo cho khách hàng về sự chậm trễ
perform|perform a routine inspection|thực hiện một cuộc kiểm tra định kỳ
convey|convey the message clearly|truyền đạt thông điệp rõ ràng
check|check the delivery address|kiểm tra địa chỉ giao hàng
oversee|oversee the construction project|giám sát dự án xây dựng
manage|manage the project budget|quản lý ngân sách dự án
monitor|monitor the system regularly|theo dõi hệ thống thường xuyên
deserve|deserve a fair payment|xứng đáng nhận mức thù lao công bằng
release|release the updated software|phát hành phần mềm đã cập nhật
procrastinate|procrastinate over important tasks|chần chừ với những nhiệm vụ quan trọng
assist|assist customers with their orders|hỗ trợ khách hàng với đơn hàng của họ
conduct|conduct a customer survey|tiến hành khảo sát khách hàng
agree|agree on a delivery date|thống nhất ngày giao hàng
supervise|supervise the new employees|giám sát các nhân viên mới
direct|direct visitors to the reception desk|hướng dẫn khách đến quầy lễ tân
assign|assign tasks to each member|phân công nhiệm vụ cho từng thành viên
remove|remove the damaged parts|tháo các bộ phận bị hỏng
collect|collect the completed forms|thu thập các biểu mẫu đã điền
coordinate|coordinate the delivery schedule|điều phối lịch giao hàng
foster|foster cooperation between departments|thúc đẩy sự hợp tác giữa các phòng ban
undertake|undertake a detailed investigation|tiến hành một cuộc điều tra chi tiết
adjust|adjust the seat height|điều chỉnh độ cao của ghế
transform|transform the empty room into an office|biến căn phòng trống thành văn phòng
engage|engage in the discussion|tham gia cuộc thảo luận
implement|implement the new policy|triển khai chính sách mới
inform|inform us of any changes|thông báo cho chúng tôi về mọi thay đổi
explain|explain the payment terms|giải thích các điều khoản thanh toán
divide|divide the work equally|chia đều công việc
face|face the problem directly|đối mặt trực tiếp với vấn đề
follow|follow the instructions carefully|làm theo hướng dẫn cẩn thận
speak|speak to the manager|nói chuyện với người quản lý
present|present the survey results|trình bày kết quả khảo sát
appear|appear on the guest list|có tên trong danh sách khách mời
accompany|accompany visitors to the conference room|đi cùng khách đến phòng hội nghị
note|note the revised deadline|lưu ý thời hạn đã thay đổi
lend|lend me your calculator|cho tôi mượn máy tính bỏ túi
rest|rest after the long journey|nghỉ ngơi sau hành trình dài
issue|issue a receipt for the payment|xuất biên lai cho khoản thanh toán
commit|commit to the agreed schedule|cam kết tuân theo lịch đã thống nhất
expand|expand the customer service team|mở rộng đội ngũ chăm sóc khách hàng
postpone|postpone the meeting until Friday|hoãn cuộc họp đến thứ Sáu
examine|examine the equipment carefully|kiểm tra thiết bị cẩn thận
like|like the new office layout|thích cách bố trí văn phòng mới
reserve|reserve a table for four|đặt bàn cho bốn người
cooperate|cooperate with the inspection team|hợp tác với đoàn kiểm tra
raise|raise the issue at the meeting|nêu vấn đề tại cuộc họp
focus|focus on the main objective|tập trung vào mục tiêu chính
appreciate|appreciate your colleagues' efforts|trân trọng nỗ lực của đồng nghiệp
publicize|publicize the upcoming event|quảng bá sự kiện sắp tới
indicate|indicate your preferred delivery date|ghi rõ ngày giao hàng mong muốn
attract|attract more customers to the store|thu hút thêm khách đến cửa hàng
analyze|analyze the sales figures|phân tích số liệu bán hàng
advise|advise customers on suitable products|tư vấn cho khách hàng về sản phẩm phù hợp
prefer|prefer a quieter meeting room|thích một phòng họp yên tĩnh hơn
detect|detect errors in the report|phát hiện lỗi trong báo cáo
cover|cover the cost of transportation|chi trả chi phí vận chuyển
adopt|adopt a more effective approach|áp dụng cách tiếp cận hiệu quả hơn
aim|aim to improve customer satisfaction|đặt mục tiêu cải thiện sự hài lòng của khách hàng
introduce|introduce the new team members|giới thiệu các thành viên mới
resolve|resolve the billing issue|giải quyết vấn đề thanh toán
disregard|disregard the outdated instructions|bỏ qua những hướng dẫn lỗi thời
assert|assert your rights politely|khẳng định quyền của mình một cách lịch sự
remain|remain calm during the interview|giữ bình tĩnh trong buổi phỏng vấn
soar|soar to a record level|tăng vọt lên mức kỷ lục
boost|boost sales through better service|tăng doanh số nhờ dịch vụ tốt hơn
fall|fall below the expected level|giảm xuống dưới mức dự kiến
thrive|thrive in a competitive market|phát triển mạnh trong thị trường cạnh tranh
dwindle|dwindle as demand falls|giảm dần khi nhu cầu giảm
impede|impede the flow of traffic|cản trở lưu thông
alter|alter the delivery schedule|thay đổi lịch giao hàng
apply|apply for the vacant position|ứng tuyển vào vị trí còn trống
qualify|qualify for the employee discount|đủ điều kiện hưởng giảm giá dành cho nhân viên
spare|spare a few minutes for this survey|dành vài phút cho cuộc khảo sát này
devise|devise a practical solution|nghĩ ra một giải pháp thiết thực
intend|intend to renew the contract|dự định gia hạn hợp đồng
allow|allow enough time for registration|dành đủ thời gian để đăng ký
inspect|inspect the goods before delivery|kiểm tra hàng trước khi giao
improve|improve the quality of service|cải thiện chất lượng dịch vụ
invest|invest in employee training|đầu tư vào đào tạo nhân viên
explore|explore alternative solutions|tìm hiểu các giải pháp khác
broaden|broaden your knowledge of accounting|mở rộng kiến thức về kế toán
envision|envision a more efficient workplace|hình dung một nơi làm việc hiệu quả hơn
grant|grant access to authorized users|cấp quyền truy cập cho người dùng được phép
automate|automate the billing process|tự động hóa quy trình thanh toán
utilize|utilize the available resources|sử dụng các nguồn lực sẵn có
place|place an order before noon|đặt hàng trước buổi trưa
renovate|renovate the reception area|cải tạo khu vực lễ tân
attribute|attribute the increase to better marketing|cho rằng mức tăng là nhờ tiếp thị tốt hơn
produce|produce a detailed progress report|lập một báo cáo tiến độ chi tiết
prevent|prevent unauthorized access|ngăn truy cập trái phép
operate|operate the machine safely|vận hành máy an toàn
assemble|assemble the parts carefully|lắp ráp các bộ phận cẩn thận
economize|economize on office supplies|tiết kiệm vật tư văn phòng
trim|trim unnecessary expenses|cắt giảm chi phí không cần thiết
launch|launch the new product next month|ra mắt sản phẩm mới vào tháng tới
maneuver|maneuver the vehicle into the parking space|điều khiển xe vào chỗ đỗ
deal|deal with the complaint promptly|xử lý khiếu nại nhanh chóng
respond|respond to the customer's question|trả lời câu hỏi của khách hàng
complete|complete the registration form|điền đầy đủ biểu mẫu đăng ký
return|return the damaged item|trả lại món hàng bị hỏng
replace|replace the faulty battery|thay pin bị lỗi
apologize|apologize for the inconvenience|xin lỗi vì sự bất tiện
combine|combine the two reports|kết hợp hai báo cáo
observe|observe the safety procedures|tuân thủ các quy trình an toàn
disappoint|disappoint customers with poor service|làm khách hàng thất vọng vì dịch vụ kém
insert|insert the card into the machine|đưa thẻ vào máy
disclose|disclose the relevant information|cung cấp thông tin liên quan
infuriate|infuriate customers with repeated delays|khiến khách hàng tức giận vì chậm trễ liên tục
cause|cause unnecessary delays|gây ra sự chậm trễ không cần thiết
interact|interact with customers politely|tương tác với khách hàng lịch sự
applaud|applaud the team's achievement|tán thưởng thành tích của đội
guarantee|guarantee the quality of the product|bảo đảm chất lượng sản phẩm
specify|specify the required quantity|ghi rõ số lượng cần thiết
involve|involve all departments in planning|cho tất cả phòng ban tham gia lập kế hoạch
locate|locate the nearest emergency exit|xác định lối thoát hiểm gần nhất
board|board the train at platform two|lên tàu ở sân ga số hai
depart|depart from the main terminal|khởi hành từ nhà ga chính
arrive|arrive at the airport early|đến sân bay sớm
indulge|indulge in a relaxing weekend|tận hưởng một cuối tuần thư giãn
review|review the contract before signing|xem xét hợp đồng trước khi ký
expire|expire at the end of the year|hết hạn vào cuối năm
collaborate|collaborate with the design team|cộng tác với đội thiết kế
dedicate|dedicate more time to training|dành thêm thời gian cho đào tạo
renew|renew your membership online|gia hạn tư cách hội viên trực tuyến
terminate|terminate the agreement legally|chấm dứt thỏa thuận theo đúng pháp luật
proceed|proceed with the approved plan|tiếp tục thực hiện kế hoạch đã được phê duyệt
narrow|narrow the list of candidates|thu hẹp danh sách ứng viên
modify|modify the existing design|điều chỉnh thiết kế hiện tại
settle|settle the outstanding invoice|thanh toán hóa đơn còn nợ
refuse|refuse an unreasonable request|từ chối một yêu cầu vô lý
order|order additional office supplies|đặt thêm vật tư văn phòng
provide|provide proof of identity|cung cấp giấy tờ chứng minh danh tính
contact|contact the customer service department|liên hệ bộ phận chăm sóc khách hàng
assure|assure customers of our commitment|cam đoan với khách hàng về cam kết của chúng tôi
seek|seek advice from an expert|tìm lời khuyên từ chuyên gia
represent|represent the company at the conference|đại diện công ty tại hội nghị
move|move the boxes to the warehouse|chuyển các thùng hàng vào kho
distribute|distribute the materials before the meeting|phát tài liệu trước cuộc họp
encompass|encompass all stages of production|bao gồm mọi giai đoạn sản xuất
ensure|ensure that every order is correct|bảo đảm mọi đơn hàng đều chính xác
enclose|enclose a copy of the receipt|gửi kèm bản sao biên lai
attach|attach the file to your email|đính kèm tệp vào email
react|react calmly to unexpected changes|phản ứng bình tĩnh trước thay đổi bất ngờ
handle|handle fragile items with care|xử lý đồ dễ vỡ cẩn thận
detach|detach the cable before cleaning|tháo dây trước khi vệ sinh
deliver|deliver the goods on time|giao hàng đúng giờ
carry|carry your passport with you|mang theo hộ chiếu
impose|impose a reasonable limit|áp dụng một giới hạn hợp lý
obligate|obligate the supplier to meet the deadline|ràng buộc nhà cung cấp phải đáp ứng thời hạn
compensate|compensate customers for the delay|bồi thường cho khách hàng vì sự chậm trễ
make|make a reservation in advance|đặt chỗ trước
stir|stir the soup gently|khuấy súp nhẹ nhàng
decorate|decorate the conference room|trang trí phòng hội nghị
book|book a room for two nights|đặt phòng cho hai đêm
ease|ease the pressure on employees|giảm áp lực cho nhân viên
sip|sip your coffee slowly|nhấp cà phê chậm rãi
anticipate|anticipate changes in demand|dự đoán những thay đổi về nhu cầu
estimate|estimate the total cost|ước tính tổng chi phí
exceed|exceed the monthly sales target|vượt chỉ tiêu bán hàng tháng
summarize|summarize the main findings|tóm tắt các kết quả chính
achieve|achieve the required standard|đạt tiêu chuẩn yêu cầu
illustrate|illustrate the process with a diagram|minh họa quy trình bằng sơ đồ
reduce|reduce unnecessary paperwork|giảm công việc giấy tờ không cần thiết
tend|tend to arrive early|có xu hướng đến sớm
shift|shift resources to the new project|chuyển nguồn lực sang dự án mới
share|share the results with your colleagues|chia sẻ kết quả với đồng nghiệp
reimburse|reimburse employees for travel expenses|hoàn trả chi phí đi lại cho nhân viên
allocate|allocate funds to staff training|phân bổ kinh phí cho đào tạo nhân viên
shorten|shorten the waiting time|rút ngắn thời gian chờ
calculate|calculate the final price|tính giá cuối cùng
compare|compare the two proposals|so sánh hai đề xuất
spend|spend the budget wisely|sử dụng ngân sách hợp lý
curtail|curtail nonessential spending|cắt giảm chi tiêu không thiết yếu
browse|browse the online catalog|xem danh mục trực tuyến
announce|announce the results tomorrow|công bố kết quả vào ngày mai
accept|accept the revised terms|chấp nhận các điều khoản đã sửa đổi
relocate|relocate the office to a larger building|chuyển văn phòng sang tòa nhà lớn hơn
contribute|contribute ideas during the discussion|đóng góp ý tưởng trong cuộc thảo luận
last|last for at least five years|bền được ít nhất năm năm
emerge|emerge as a market leader|vươn lên thành doanh nghiệp dẫn đầu thị trường
select|select the most suitable candidate|chọn ứng viên phù hợp nhất
persist|persist despite the difficulties|kiên trì bất chấp khó khăn
waive|waive the registration fee|miễn phí đăng ký
reach|reach an agreement by Friday|đạt thỏa thuận trước thứ Sáu
acquire|acquire the necessary skills|tiếp thu các kỹ năng cần thiết
reveal|reveal the survey findings|công bố kết quả khảo sát
misplace|misplace an important document|để thất lạc một tài liệu quan trọng
grow|grow the business gradually|phát triển doanh nghiệp dần dần
merge|merge the two departments|sáp nhập hai phòng ban
imply|imply that further changes are needed|ngụ ý rằng cần thêm thay đổi
initiate|initiate the refund process|bắt đầu quy trình hoàn tiền
enhance|enhance the customer experience|cải thiện trải nghiệm khách hàng
surpass|surpass last year's sales|vượt doanh số năm ngoái
run|run the department efficiently|điều hành phòng ban hiệu quả
reschedule|reschedule the interview for Monday|đổi lịch phỏng vấn sang thứ Hai
determine|determine the cause of the problem|xác định nguyên nhân vấn đề
approve|approve the purchase request|phê duyệt yêu cầu mua hàng
object|object to the proposed changes|phản đối các thay đổi được đề xuất
undergo|undergo a routine medical examination|trải qua một cuộc khám sức khỏe định kỳ
give|give customers clear instructions|đưa hướng dẫn rõ ràng cho khách hàng
distract|distract the driver during the journey|làm tài xế mất tập trung trong chuyến đi
organize|organize the documents by date|sắp xếp tài liệu theo ngày
refute|refute the claim with evidence|bác bỏ nhận định bằng chứng cứ
defer|defer the decision until next week|hoãn quyết định đến tuần sau
comment|comment on the proposed design|nhận xét về thiết kế được đề xuất
adjourn|adjourn the meeting until tomorrow|tạm ngừng cuộc họp đến ngày mai
preside|preside over the annual meeting|chủ trì cuộc họp thường niên
attend|attend the training session|tham dự buổi đào tạo
schedule|schedule the inspection for Tuesday|xếp lịch kiểm tra vào thứ Ba
include|include all relevant documents|bao gồm mọi tài liệu liên quan
require|require written confirmation|yêu cầu xác nhận bằng văn bản
regard|regard this issue as a priority|coi vấn đề này là ưu tiên
enroll|enroll in the training course|đăng ký khóa đào tạo
assent|assent to the proposed agreement|tán thành thỏa thuận được đề xuất
commence|commence work on the new project|bắt đầu thực hiện dự án mới
emphasize|emphasize the importance of safety|nhấn mạnh tầm quan trọng của an toàn
arise|arise during the final inspection|phát sinh trong lần kiểm tra cuối
exploit|exploit the available opportunities|khai thác những cơ hội sẵn có
evaluate|evaluate the supplier's performance|đánh giá hiệu quả làm việc của nhà cung cấp
predict|predict future demand|dự đoán nhu cầu trong tương lai
reward|reward employees for good performance|khen thưởng nhân viên làm việc tốt
congratulate|congratulate the team on its success|chúc mừng đội về thành công của họ
dismiss|dismiss the complaint without investigation|bác bỏ khiếu nại mà không điều tra
retire|retire at the age of sixty-five|nghỉ hưu ở tuổi sáu mươi lăm
appoint|appoint a new department head|bổ nhiệm trưởng phòng mới
transfer|transfer the funds electronically|chuyển tiền bằng phương thức điện tử
designate|designate a person to lead the team|chỉ định một người lãnh đạo đội
reorganize|reorganize the filing system|tổ chức lại hệ thống lưu hồ sơ
alleviate|alleviate the pressure on the team|giảm áp lực cho đội
obtain|obtain written permission first|xin phép bằng văn bản trước
commute|commute to work by train|đi làm bằng tàu
head|head toward the main entrance|đi về phía lối vào chính
pass|pass through the security checkpoint|đi qua chốt kiểm tra an ninh
tow|tow the damaged vehicle to a garage|kéo chiếc xe bị hỏng đến xưởng sửa chữa
deposit|deposit the money into your account|gửi tiền vào tài khoản
receive|receive the delivery before noon|nhận hàng trước buổi trưa
expect|expect a reply within two days|mong nhận được trả lời trong hai ngày
lower|lower the price slightly|giảm giá một chút
double|double the storage capacity|tăng gấp đôi sức chứa
reject|reject the incomplete application|từ chối hồ sơ chưa đầy đủ
convert|convert the price into dollars|đổi giá sang đô la
cash|cash the check at the bank|đổi séc thành tiền mặt tại ngân hàng
propose|propose a more practical solution|đề xuất giải pháp thiết thực hơn
consider|consider all available options|cân nhắc mọi lựa chọn sẵn có
consult|consult a qualified accountant|tham khảo ý kiến kế toán viên có chuyên môn
sponsor|sponsor the community event|tài trợ sự kiện cộng đồng
yield|yield a reasonable profit|mang lại lợi nhuận hợp lý
drape|drape the curtain over the window|phủ rèm lên cửa sổ
arrange|arrange the chairs in rows|xếp ghế thành các hàng
maintain|maintain the equipment regularly|bảo dưỡng thiết bị thường xuyên
prepare|prepare the agenda in advance|chuẩn bị chương trình họp trước
interfere|interfere with the work schedule|gây trở ngại cho lịch làm việc
consist|consist of three main sections|gồm ba phần chính
enlarge|enlarge the photograph slightly|phóng to bức ảnh một chút
install|install the latest software update|cài bản cập nhật phần mềm mới nhất
suppose|suppose that the estimate is correct|giả sử ước tính là đúng
conserve|conserve water and electricity|tiết kiệm nước và điện
dispose|dispose of the waste safely|xử lý chất thải an toàn
preserve|preserve the original documents|bảo quản tài liệu gốc
disturb|disturb other passengers|làm phiền hành khách khác
discharge|discharge waste into the river|xả chất thải ra sông
deplete|deplete the available resources|làm cạn kiệt nguồn lực sẵn có
purify|purify the water before use|lọc sạch nước trước khi sử dụng
prescribe|prescribe medicine for the patient|kê thuốc cho bệnh nhân
recognize|recognize the warning signs|nhận biết các dấu hiệu cảnh báo
join|join the sales team|gia nhập đội bán hàng
recommend|recommend a suitable product|giới thiệu sản phẩm phù hợp
relieve|relieve the patient's pain|giảm đau cho bệnh nhân
induce|induce a change in consumer behavior|gây ra thay đổi trong hành vi tiêu dùng
accommodate|accommodate the additional guests|bố trí chỗ ở cho những khách bổ sung
accomplish|accomplish the task before Friday|hoàn thành nhiệm vụ trước thứ Sáu
adapt|adapt to the new work schedule|thích nghi với lịch làm việc mới
admire|admire the elegant design|ngưỡng mộ thiết kế thanh lịch
admit|admit visitors with valid tickets|cho khách có vé hợp lệ vào
advertise|advertise the vacancy online|đăng tin tuyển dụng trực tuyến
affect|affect the final decision|ảnh hưởng đến quyết định cuối cùng
afford|afford a larger office|đủ khả năng chi trả cho văn phòng lớn hơn
amend|amend the terms of the contract|sửa đổi điều khoản hợp đồng
arbitrate|arbitrate the dispute fairly|phân xử tranh chấp công bằng
argue|argue for a better solution|đưa ra lý lẽ ủng hộ giải pháp tốt hơn
assess|assess the potential risks|đánh giá những rủi ro tiềm ẩn
assume|assume responsibility for the project|nhận trách nhiệm về dự án
avoid|avoid unnecessary delays|tránh những chậm trễ không cần thiết
behave|behave professionally at work|cư xử chuyên nghiệp tại nơi làm việc
cancel|cancel the duplicate order|hủy đơn hàng bị lặp
celebrate|celebrate the company's anniversary|kỷ niệm ngày thành lập công ty
characterize|characterize the main differences clearly|mô tả rõ những khác biệt chính
check in|check in at the reception desk|làm thủ tục nhận phòng ở quầy lễ tân
check out|check out before eleven o'clock|làm thủ tục trả phòng trước mười một giờ
classify|classify the documents by topic|phân loại tài liệu theo chủ đề
complain|complain about the poor service|phàn nàn về dịch vụ kém
concede|concede that improvements are necessary|thừa nhận rằng cần cải thiện
conclude|conclude the meeting on time|kết thúc cuộc họp đúng giờ
connect|connect the printer to the computer|kết nối máy in với máy tính
consume|consume less electricity|tiêu thụ ít điện hơn
continue|continue working on the proposal|tiếp tục hoàn thiện đề xuất
convince|convince the client to accept the offer|thuyết phục khách hàng chấp nhận lời đề nghị
criticize|criticize the proposal constructively|phê bình đề xuất theo hướng xây dựng
deduct|deduct the discount from the total|trừ khoản giảm giá khỏi tổng tiền
demonstrate|demonstrate how the machine works|trình bày cách máy hoạt động
depend|depend on accurate information|dựa vào thông tin chính xác
develop|develop a practical training plan|xây dựng kế hoạch đào tạo thiết thực
diagnose|diagnose the cause of the failure|chẩn đoán nguyên nhân sự cố
disagree|disagree with the proposed changes|không đồng ý với các thay đổi được đề xuất
disconnect|disconnect the power supply first|ngắt nguồn điện trước
discuss|discuss the proposal with your team|thảo luận đề xuất với đội của mình
distinguish|distinguish facts from opinions|phân biệt sự thật với ý kiến
donate|donate unused equipment to the school|tặng thiết bị không dùng cho trường học
download|download the latest application form|tải biểu mẫu đăng ký mới nhất
downsize|downsize the department gradually|thu hẹp phòng ban dần dần
draw|draw a diagram of the process|vẽ sơ đồ quy trình
earn|earn a fair wage|kiếm được mức lương công bằng
embark|embark on a new project|bắt đầu một dự án mới
encourage|encourage employees to share ideas|khuyến khích nhân viên chia sẻ ý tưởng
endure|endure a long delay|chịu đựng sự chậm trễ kéo dài
enlighten|enlighten us about the new regulations|giải thích cho chúng tôi hiểu về quy định mới
evolve|evolve to meet customer needs|phát triển để đáp ứng nhu cầu khách hàng
excel|excel in customer service|vượt trội trong chăm sóc khách hàng
exhibit|exhibit the new products at the fair|trưng bày sản phẩm mới tại hội chợ
express|express your concerns clearly|trình bày rõ những điều bạn lo ngại
extend|extend the warranty by one year|gia hạn bảo hành thêm một năm
fail|fail to meet the deadline|không đáp ứng được thời hạn
fill|fill the container with clean water|đổ đầy nước sạch vào bình
fix|fix the broken printer|sửa máy in bị hỏng
fluctuate|fluctuate throughout the year|dao động suốt năm
fold|fold the document neatly|gấp tài liệu gọn gàng
forget|forget an important appointment|quên một cuộc hẹn quan trọng
fulfill|fulfill all contractual obligations|thực hiện mọi nghĩa vụ theo hợp đồng
haggle|haggle over the final price|mặc cả về giá cuối cùng
hesitate|hesitate to ask for help|ngần ngại nhờ giúp đỡ
impersonate|impersonate a company representative|mạo danh đại diện công ty
infer|infer the answer from the evidence|suy ra câu trả lời từ chứng cứ
inflate|inflate the tire to the correct pressure|bơm lốp đến áp suất phù hợp
insure|insure the shipment against damage|mua bảo hiểm cho lô hàng phòng hư hại
interrupt|interrupt the speaker during the presentation|ngắt lời người thuyết trình
invent|invent a more efficient device|phát minh thiết bị hiệu quả hơn
invite|invite customers to the opening ceremony|mời khách hàng đến lễ khai trương
isolate|isolate the source of the problem|tách riêng nguồn gây ra vấn đề
itemize|itemize the expenses on the invoice|liệt kê từng khoản chi phí trên hóa đơn
jeopardize|jeopardize the project's success|đe dọa thành công của dự án
justify|justify the additional expense|giải trình khoản chi bổ sung
keep|keep a copy of the receipt|giữ một bản sao biên lai
lay|lay the documents on the desk|đặt tài liệu lên bàn
lean|lean against the wall|dựa vào tường
log on|log on to the company website|đăng nhập vào trang web công ty
mimic|mimic the competitor's design|bắt chước thiết kế của đối thủ
mishear|mishear an important instruction|nghe nhầm một hướng dẫn quan trọng
misrepresent|misrepresent the survey results|trình bày sai kết quả khảo sát
motivate|motivate employees with clear goals|khích lệ nhân viên bằng mục tiêu rõ ràng
nominate|nominate a colleague for the award|đề cử đồng nghiệp nhận giải thưởng
oblige|oblige the contractor to correct the defect|buộc nhà thầu sửa lỗi
occur|occur during the inspection|xảy ra trong cuộc kiểm tra
owe|owe money to the bank|nợ tiền ngân hàng
permit|permit access to authorized staff|cho phép nhân viên được ủy quyền truy cập
persuade|persuade the customer to try the product|thuyết phục khách hàng thử sản phẩm
pollute|pollute the local water supply|làm ô nhiễm nguồn nước địa phương
prohibit|prohibit smoking in the building|cấm hút thuốc trong tòa nhà
promote|promote the new product online|quảng bá sản phẩm mới trực tuyến
protect|protect confidential customer information|bảo vệ thông tin khách hàng bí mật
pursue|pursue a career in accounting|theo đuổi sự nghiệp kế toán
realize|realize the importance of training|nhận ra tầm quan trọng của đào tạo
rearrange|rearrange the chairs for the meeting|sắp xếp lại ghế cho cuộc họp
regulate|regulate the temperature automatically|điều chỉnh nhiệt độ tự động
relax|relax after a busy day|thư giãn sau một ngày bận rộn
repair|repair the damaged equipment|sửa thiết bị bị hỏng
rescue|rescue passengers from the damaged vehicle|cứu hành khách khỏi xe bị hỏng
resemble|resemble the original design|giống thiết kế ban đầu
resign|resign from the current position|từ chức khỏi vị trí hiện tại
resist|resist pressure to lower standards|chống lại áp lực hạ thấp tiêu chuẩn
restructure|restructure the sales department|tái cơ cấu phòng bán hàng
revamp|revamp the company website|cải tiến trang web công ty
satisfy|satisfy the customer's requirements|đáp ứng yêu cầu của khách hàng
save|save a copy of the document|lưu một bản sao tài liệu
scrutinize|scrutinize the contract carefully|xem xét hợp đồng kỹ lưỡng
shine|shine brightly in the sunlight|tỏa sáng dưới ánh nắng
simplify|simplify the registration process|đơn giản hóa quy trình đăng ký
stare|stare at the computer screen|nhìn chằm chằm vào màn hình máy tính
streamline|streamline the ordering process|tinh giản quy trình đặt hàng
strike|strike the metal gently|gõ nhẹ vào kim loại
subscribe|subscribe to the company newsletter|đăng ký nhận bản tin công ty
suffocate|suffocate in a poorly ventilated space|bị ngạt trong nơi thông gió kém
suggest|suggest a more convenient time|đề xuất một thời điểm thuận tiện hơn
supply|supply the necessary materials|cung cấp vật liệu cần thiết
understand|understand the instructions fully|hiểu đầy đủ hướng dẫn
unwrap|unwrap the package carefully|mở gói hàng cẩn thận
upset|upset the agreed schedule|làm xáo trộn lịch đã thống nhất
warn|warn visitors about the wet floor|cảnh báo khách về sàn ướt
warrant|warrant further investigation|đáng được điều tra thêm
win|win the contract fairly|giành được hợp đồng một cách công bằng
withdraw|withdraw money from your account|rút tiền từ tài khoản
wrap|wrap the fragile item carefully|bọc món đồ dễ vỡ cẩn thận
write|write a clear confirmation email|viết email xác nhận rõ ràng
concentrate|concentrate on the task|tập trung vào nhiệm vụ
''')

ADVERBS = table('''
highly|The candidate is highly qualified.|Ứng viên có trình độ rất tốt.
efficiently|The new machine works efficiently.|Máy mới hoạt động hiệu quả.
severely|The storm severely damaged the roof.|Cơn bão làm mái nhà hư hại nghiêm trọng.
thoroughly|Please inspect the equipment thoroughly.|Hãy kiểm tra thiết bị kỹ lưỡng.
immediately|Please contact the manager immediately.|Hãy liên hệ người quản lý ngay lập tức.
directly|Send the invoice directly to accounting.|Gửi hóa đơn trực tiếp đến phòng kế toán.
absolutely|The information is absolutely correct.|Thông tin hoàn toàn chính xác.
attentively|The trainees listened attentively to the instructor.|Học viên chăm chú nghe người hướng dẫn.
reluctantly|She reluctantly accepted the revised schedule.|Cô ấy miễn cưỡng chấp nhận lịch đã sửa.
electronically|Customers can pay their bills electronically.|Khách hàng có thể thanh toán hóa đơn bằng phương thức điện tử.
occasionally|We occasionally hold meetings online.|Thỉnh thoảng chúng tôi họp trực tuyến.
hardly|We could hardly hear the announcement.|Chúng tôi gần như không nghe được thông báo.
skillfully|The technician repaired the device skillfully.|Kỹ thuật viên sửa thiết bị khéo léo.
widely|This software is widely used in offices.|Phần mềm này được dùng rộng rãi trong các văn phòng.
realistically|We must assess the situation realistically.|Chúng ta phải đánh giá tình hình một cách thực tế.
promptly|The supplier responded promptly to our request.|Nhà cung cấp phản hồi yêu cầu nhanh chóng.
apparently|Apparently, the meeting has been postponed.|Có vẻ cuộc họp đã bị hoãn.
accidentally|I accidentally deleted the wrong file.|Tôi vô tình xóa nhầm tệp.
especially|This guide is especially useful for beginners.|Hướng dẫn này đặc biệt hữu ích cho người mới.
very|The instructions are very clear.|Hướng dẫn rất rõ ràng.
extremely|The delivery team was extremely helpful.|Đội giao hàng giúp đỡ rất nhiệt tình.
instantly|The system updates the balance instantly.|Hệ thống cập nhật số dư ngay lập tức.
aggressively|The company is expanding aggressively.|Công ty đang mở rộng rất mạnh mẽ.
steadily|Sales have increased steadily this year.|Doanh số tăng đều đặn trong năm nay.
necessarily|A higher price does not necessarily mean better quality.|Giá cao hơn không nhất thiết đồng nghĩa với chất lượng tốt hơn.
largely|The delay was largely caused by bad weather.|Sự chậm trễ chủ yếu do thời tiết xấu.
forward|Please move forward to the next counter.|Hãy tiến lên quầy tiếp theo.
dramatically|Production costs have fallen dramatically.|Chi phí sản xuất đã giảm mạnh.
rapidly|The local economy is growing rapidly.|Kinh tế địa phương đang tăng trưởng nhanh chóng.
evenly|Distribute the workload evenly among employees.|Chia đều khối lượng công việc cho nhân viên.
likely|The manager will likely approve the request.|Người quản lý có khả năng sẽ phê duyệt yêu cầu.
fairly|The supervisor treated everyone fairly.|Người giám sát đối xử công bằng với mọi người.
exactly|The package arrived exactly on time.|Gói hàng đến đúng giờ.
carefully|Read the contract carefully before signing.|Đọc kỹ hợp đồng trước khi ký.
exclusively|This service is available exclusively to members.|Dịch vụ này chỉ dành cho hội viên.
relatively|The new procedure is relatively simple.|Quy trình mới tương đối đơn giản.
mutually|The agreement is mutually beneficial.|Thỏa thuận có lợi cho cả hai bên.
increasingly|Customers are increasingly interested in online services.|Khách hàng ngày càng quan tâm đến dịch vụ trực tuyến.
properly|Make sure the machine is installed properly.|Hãy bảo đảm máy được lắp đúng cách.
respectively|Anna and Ben manage sales and finance, respectively.|Anna và Ben lần lượt phụ trách bán hàng và tài chính.
separately|Please pack these items separately.|Hãy đóng gói riêng các món này.
appropriately|Employees should dress appropriately for the event.|Nhân viên nên mặc trang phục phù hợp với sự kiện.
politely|The receptionist greeted the visitors politely.|Lễ tân chào khách lịch sự.
seriously|We take customer complaints seriously.|Chúng tôi xem xét khiếu nại của khách hàng nghiêm túc.
approximately|The repair will take approximately two hours.|Việc sửa chữa sẽ mất khoảng hai giờ.
tightly|Close the lid tightly after use.|Đóng chặt nắp sau khi sử dụng.
away|Please keep the boxes away from the exit.|Hãy để các thùng hàng cách xa lối ra.
originally|The event was originally planned for Monday.|Ban đầu sự kiện được lên kế hoạch vào thứ Hai.
initially|The service was initially available only locally.|Lúc đầu dịch vụ chỉ có tại địa phương.
cooperatively|The departments worked cooperatively on the project.|Các phòng ban hợp tác thực hiện dự án.
temporarily|The office is temporarily closed for repairs.|Văn phòng tạm đóng cửa để sửa chữa.
particularly|The manager was particularly impressed by the proposal.|Người quản lý đặc biệt ấn tượng với đề xuất.
adequately|The staff have been adequately trained.|Nhân viên đã được đào tạo đầy đủ.
formerly|The building was formerly a warehouse.|Trước đây tòa nhà là nhà kho.
entirely|The decision is entirely up to you.|Quyết định hoàn toàn tùy ở bạn.
markedly|Customer satisfaction has improved markedly.|Mức độ hài lòng của khách hàng đã cải thiện rõ rệt.
typically|We typically send invoices by email.|Thông thường chúng tôi gửi hóa đơn qua email.
recently|The company recently opened a new branch.|Công ty gần đây mở chi nhánh mới.
substantially|The upgrade substantially reduced processing time.|Bản nâng cấp làm giảm đáng kể thời gian xử lý.
frequently|Customers frequently ask about delivery times.|Khách hàng thường xuyên hỏi về thời gian giao hàng.
considerably|The new office is considerably larger.|Văn phòng mới lớn hơn đáng kể.
accurately|Please record the measurements accurately.|Hãy ghi số đo chính xác.
simultaneously|The two workshops will run simultaneously.|Hai hội thảo sẽ diễn ra cùng lúc.
coincidentally|Coincidentally, we booked the same flight.|Thật trùng hợp, chúng tôi đặt cùng một chuyến bay.
radically|The new system radically changed our workflow.|Hệ thống mới thay đổi căn bản quy trình làm việc.
strictly|Safety rules must be strictly followed.|Phải tuân thủ nghiêm ngặt quy định an toàn.
unanimously|The committee unanimously approved the proposal.|Ủy ban nhất trí phê duyệt đề xuất.
securely|Store confidential files securely.|Hãy lưu trữ tài liệu bí mật an toàn.
prominently|The warning is prominently displayed.|Cảnh báo được đặt ở vị trí dễ thấy.
inward|The door opens inward for safety.|Cửa mở vào phía trong để bảo đảm an toàn.
regrettably|Regrettably, the flight has been canceled.|Rất tiếc, chuyến bay đã bị hủy.
previously|We previously used a different supplier.|Trước đây chúng tôi dùng nhà cung cấp khác.
alternatively|You can pay online or, alternatively, by check.|Bạn có thể trả trực tuyến hoặc chọn trả bằng séc.
heavily|The company invested heavily in training.|Công ty đầu tư nhiều vào đào tạo.
inherently|This process is inherently risky.|Quy trình này vốn có rủi ro.
nearly|The project is nearly complete.|Dự án gần hoàn thành.
partially|The invoice has been partially paid.|Hóa đơn đã được thanh toán một phần.
regularly|The equipment is inspected regularly.|Thiết bị được kiểm tra thường xuyên.
presently|The director is presently attending a conference.|Hiện giám đốc đang dự hội nghị.
densely|The district is densely populated.|Quận có mật độ dân cư cao.
totally|The figures are totally incorrect.|Các số liệu hoàn toàn sai.
actually|The repair actually took less than an hour.|Thực tế việc sửa chữa mất chưa đến một giờ.
continually|We continually review our safety procedures.|Chúng tôi liên tục xem xét các quy trình an toàn.
intensively|The staff trained intensively for the launch.|Nhân viên được đào tạo chuyên sâu để chuẩn bị ra mắt.
easily|You can easily update your account online.|Bạn có thể dễ dàng cập nhật tài khoản trực tuyến.
abroad|She often travels abroad for work.|Cô ấy thường đi công tác nước ngoài.
accordingly|Demand increased, so we adjusted production accordingly.|Nhu cầu tăng nên chúng tôi điều chỉnh sản xuất tương ứng.
commonly|This term is commonly used in accounting.|Thuật ngữ này thường được dùng trong kế toán.
consistently|The supplier consistently delivers on time.|Nhà cung cấp luôn giao hàng đúng giờ.
conveniently|The hotel is conveniently located near the station.|Khách sạn nằm ở vị trí thuận tiện gần nhà ga.
definitely|We will definitely attend the conference.|Chúng tôi chắc chắn sẽ dự hội nghị.
downward|The graph shows prices moving downward.|Biểu đồ cho thấy giá đang giảm.
drastically|The company drastically reduced its expenses.|Công ty cắt giảm mạnh chi phí.
effectively|The new system handles requests effectively.|Hệ thống mới xử lý yêu cầu hiệu quả.
enthusiastically|The team enthusiastically welcomed the new members.|Đội nhiệt tình chào đón thành viên mới.
frankly|Frankly, we need a better plan.|Nói thẳng ra, chúng ta cần kế hoạch tốt hơn.
gradually|The team gradually improved its performance.|Đội dần cải thiện hiệu quả làm việc.
individually|Each application is reviewed individually.|Mỗi hồ sơ được xét riêng.
intently|She listened intently to the instructions.|Cô ấy chăm chú nghe hướng dẫn.
obviously|The machine is obviously not working.|Rõ ràng máy không hoạt động.
onward|The shipment continued onward to the next port.|Lô hàng tiếp tục đến cảng tiếp theo.
practically|The conference room was practically empty.|Phòng hội nghị gần như trống.
probably|The delivery will probably arrive tomorrow.|Hàng có lẽ sẽ đến vào ngày mai.
reasonably|The products are reasonably priced.|Các sản phẩm có giá hợp lý.
regardless|We will proceed regardless of the weather.|Chúng tôi sẽ tiếp tục bất kể thời tiết.
roughly|The project will cost roughly ten thousand dollars.|Dự án sẽ tốn khoảng mười nghìn đô la.
unfortunately|Unfortunately, the item is out of stock.|Rất tiếc, mặt hàng đã hết.
upstairs|The meeting room is upstairs.|Phòng họp ở tầng trên.
yearly|The company reviews its budget yearly.|Công ty xem xét ngân sách hằng năm.
''')

# Individual contexts for senses, grammar constraints, or unusual countability.
SPECIAL = table('''
opening|There is an opening in the sales department.|Phòng bán hàng có một vị trí còn trống.
according to|According to the report, sales increased.|Theo báo cáo, doanh số đã tăng.
appreciative of|She was appreciative of our help.|Cô ấy biết ơn sự giúp đỡ của chúng tôi.
regarding|Please contact us regarding your order.|Hãy liên hệ chúng tôi về đơn hàng của bạn.
several|Several employees attended the workshop.|Một vài nhân viên dự hội thảo.
negative|The test result was negative.|Kết quả xét nghiệm âm tính.
contrary|The decision was contrary to our expectations.|Quyết định trái với kỳ vọng của chúng tôi.
mounting|We are concerned about mounting costs.|Chúng tôi lo ngại về chi phí đang tăng.
manufacturing|Manufacturing requires careful quality control.|Hoạt động sản xuất đòi hỏi kiểm soát chất lượng cẩn thận.
bulk|Buying in bulk can reduce costs.|Mua với số lượng lớn có thể giảm chi phí.
cutting edge|The laboratory is at the cutting edge of technology.|Phòng thí nghiệm đi đầu về công nghệ.
worth|The proposal is worth considering.|Đề xuất đáng được cân nhắc.
less|We now use less paper.|Hiện chúng tôi dùng ít giấy hơn.
prior|You need prior approval for this expense.|Bạn cần được phê duyệt trước cho khoản chi này.
coming|We will finish in the coming week.|Chúng tôi sẽ hoàn thành trong tuần tới.
live|We watched a live broadcast of the event.|Chúng tôi xem chương trình phát sóng trực tiếp của sự kiện.
required|Please submit all the required documents.|Hãy nộp tất cả tài liệu được yêu cầu.
upcoming|The upcoming meeting will discuss the budget.|Cuộc họp sắp tới sẽ bàn về ngân sách.
extended|The hotel offers an extended stay package.|Khách sạn cung cấp gói lưu trú dài ngày.
entire|The entire team attended the meeting.|Cả đội đã dự cuộc họp.
whole|The whole building needs repairs.|Cả tòa nhà cần sửa chữa.
total|The total cost includes delivery.|Tổng chi phí bao gồm giao hàng.
further|Please contact us for further information.|Hãy liên hệ chúng tôi để biết thêm thông tin.
initial|The initial estimate was too low.|Ước tính ban đầu quá thấp.
additional|We need additional staff this month.|Chúng tôi cần thêm nhân viên trong tháng này.
consecutive|Sales increased for three consecutive months.|Doanh số tăng trong ba tháng liên tiếp.
annual|The annual meeting takes place in June.|Cuộc họp thường niên diễn ra vào tháng Sáu.
daily|Please check the daily schedule.|Hãy kiểm tra lịch hằng ngày.
overall|The overall result was satisfactory.|Kết quả tổng thể đạt yêu cầu.
mere|The task took a mere five minutes.|Nhiệm vụ chỉ mất năm phút.
secretarial|She has extensive secretarial experience.|Cô ấy có nhiều kinh nghiệm làm thư ký.
executive|The company provides executive training.|Công ty cung cấp chương trình đào tạo quản lý cấp cao.
managerial|She has strong managerial skills.|Cô ấy có kỹ năng quản lý tốt.
corporate|We discussed the corporate strategy.|Chúng tôi thảo luận chiến lược công ty.
commercial|The bank offers commercial loans.|Ngân hàng cung cấp các khoản vay kinh doanh.
financial|We reviewed the financial report.|Chúng tôi xem xét báo cáo tài chính.
agricultural|The region exports agricultural products.|Khu vực xuất khẩu nông sản.
automotive|He works in the automotive industry.|Anh ấy làm trong ngành ô tô.
environmental|The project requires an environmental assessment.|Dự án cần đánh giá tác động môi trường.
dental|The clinic provides dental care.|Phòng khám cung cấp dịch vụ chăm sóc răng miệng.
medical|Please bring your medical records.|Hãy mang theo hồ sơ y tế.
pharmaceutical|The company produces pharmaceutical products.|Công ty sản xuất dược phẩm.
solar|The factory uses solar energy.|Nhà máy dùng năng lượng mặt trời.
technical|Please read the technical specifications.|Hãy đọc thông số kỹ thuật.
theoretical|The course combines theoretical and practical work.|Khóa học kết hợp lý thuyết và thực hành.
external|An external auditor reviewed the accounts.|Kiểm toán viên bên ngoài kiểm tra sổ sách.
internal|Please follow the internal procedures.|Hãy làm theo quy trình nội bộ.
regional|The company opened a regional office.|Công ty mở văn phòng khu vực.
local|We buy supplies from local businesses.|Chúng tôi mua vật tư từ doanh nghiệp địa phương.
international|She attended an international conference.|Cô ấy dự hội nghị quốc tế.
probationary|New employees complete a probationary period.|Nhân viên mới trải qua thời gian thử việc.
permanent|The company offered her a permanent position.|Công ty đề nghị cô ấy một vị trí lâu dài.
temporary|We need temporary staff this summer.|Chúng tôi cần nhân viên thời vụ vào mùa hè này.
personal|Please update your personal information.|Hãy cập nhật thông tin cá nhân.
private|This is a private meeting.|Đây là cuộc họp riêng.
official|We are waiting for official confirmation.|Chúng tôi đang chờ xác nhận chính thức.
personalized|The hotel provides personalized service.|Khách sạn cung cấp dịch vụ phù hợp với từng khách.
individual|Each employee receives individual feedback.|Mỗi nhân viên nhận phản hồi riêng.
surrounding|We visited the surrounding villages.|Chúng tôi thăm các làng xung quanh.
wholesale|We buy goods at wholesale prices.|Chúng tôi mua hàng với giá bán buôn.
raw|The factory imports raw materials.|Nhà máy nhập nguyên liệu thô.
duty-free|We bought perfume at a duty-free shop.|Chúng tôi mua nước hoa ở cửa hàng miễn thuế.
patented|The device uses a patented design.|Thiết bị sử dụng thiết kế đã được cấp bằng sáng chế.
senior|She is a senior accountant.|Cô ấy là kế toán viên cấp cao.
leading|The company is a leading supplier.|Công ty là nhà cung cấp hàng đầu.
strategic|The board discussed strategic priorities.|Hội đồng quản trị thảo luận các ưu tiên chiến lược.
previously|We previously used a different supplier.|Trước đây chúng tôi dùng nhà cung cấp khác.
abstract|The lecture introduced an abstract concept.|Bài giảng giới thiệu một khái niệm trừu tượng.
advisable|It is advisable to book early.|Nên đặt chỗ sớm.
inclined|She is inclined to accept the offer.|Cô ấy có xu hướng chấp nhận lời đề nghị.
aware|The staff are aware of the risks.|Nhân viên nhận thức được những rủi ro.
accustomed|She is accustomed to working early.|Cô ấy quen làm việc sớm.
reliant|The company is reliant on imports.|Công ty phụ thuộc vào hàng nhập khẩu.
susceptible|The material is susceptible to corrosion.|Vật liệu dễ bị ăn mòn.
eligible|Members are eligible for a discount.|Hội viên đủ điều kiện hưởng giảm giá.
qualified|She is qualified for the position.|Cô ấy đủ trình độ cho vị trí này.
capable|The team is capable of completing the project.|Đội có khả năng hoàn thành dự án.
grateful|We are grateful for your support.|Chúng tôi biết ơn sự hỗ trợ của bạn.
keen|She is keen to join the team.|Cô ấy rất muốn gia nhập đội.
avid|He is an avid reader.|Anh ấy là người rất ham đọc sách.
jealous|He felt jealous of his colleague's promotion.|Anh ấy ghen tị với việc đồng nghiệp được thăng chức.
jobless|The program helps jobless people find work.|Chương trình giúp người thất nghiệp tìm việc.
elderly|The service assists elderly customers.|Dịch vụ hỗ trợ khách hàng cao tuổi.
famed|The restaurant is famed for its seafood.|Nhà hàng nổi tiếng về hải sản.
renowned|The hotel is renowned for excellent service.|Khách sạn nổi tiếng về dịch vụ xuất sắc.
informed|We need to make an informed decision.|Chúng ta cần đưa ra quyết định dựa trên đầy đủ thông tin.
enclosed|Please read the enclosed document.|Hãy đọc tài liệu được gửi kèm.
missing|One item is missing from the shipment.|Lô hàng thiếu một món.
reserved|These seats are reserved for guests.|Những chỗ này được dành trước cho khách.
overdue|The payment is now overdue.|Khoản thanh toán hiện đã quá hạn.
payable|The invoice is payable within thirty days.|Hóa đơn phải được thanh toán trong ba mươi ngày.
exempt|This purchase is exempt from tax.|Khoản mua này được miễn thuế.
unoccupied|The office remained unoccupied for months.|Văn phòng không có người sử dụng suốt nhiều tháng.
endangered|The reserve protects endangered species.|Khu bảo tồn bảo vệ các loài có nguy cơ tuyệt chủng.
unspoiled|The island has unspoiled beaches.|Hòn đảo có những bãi biển hoang sơ.
secluded|We stayed at a secluded resort.|Chúng tôi ở tại một khu nghỉ dưỡng biệt lập.
spacious|The meeting room is spacious.|Phòng họp rộng rãi.
steep|The road has a steep slope.|Con đường có độ dốc lớn.
sharp|Be careful with the sharp blade.|Hãy cẩn thận với lưỡi dao sắc.
waterproof|We need a waterproof container.|Chúng tôi cần một hộp chống nước.
worthless|The damaged ticket is worthless.|Tấm vé bị hỏng không còn giá trị.
priceless|The museum displays priceless artifacts.|Bảo tàng trưng bày các hiện vật vô giá.
invaluable|Your advice has been invaluable.|Lời khuyên của bạn rất quý giá.
expensive|This model is more expensive.|Mẫu này đắt hơn.
cheap|We found a cheap flight.|Chúng tôi tìm được chuyến bay giá rẻ.
affordable|The store sells affordable furniture.|Cửa hàng bán nội thất có giá phải chăng.
costly|Replacing the equipment was costly.|Việc thay thiết bị tốn kém.
luxurious|We stayed in a luxurious hotel.|Chúng tôi ở trong một khách sạn sang trọng.
elegant|The hotel has an elegant lobby.|Khách sạn có tiền sảnh thanh lịch.
stunning|The balcony offers a stunning view.|Ban công có tầm nhìn tuyệt đẹp.
beautiful|The hotel has a beautiful garden.|Khách sạn có một khu vườn đẹp.
vivid|She gave a vivid description of the trip.|Cô ấy mô tả chuyến đi rất sinh động.
constant|The equipment requires constant monitoring.|Thiết bị cần được theo dõi liên tục.
continual|Continual interruptions delayed our work.|Những lần gián đoạn liên tiếp làm chậm công việc.
ongoing|The ongoing repairs will finish tomorrow.|Việc sửa chữa đang diễn ra sẽ hoàn thành vào ngày mai.
recent|Have you read the recent announcement?|Bạn đã đọc thông báo gần đây chưa?
frequent|Frequent delays affect customer satisfaction.|Chậm trễ thường xuyên ảnh hưởng đến sự hài lòng của khách hàng.
regular|We perform regular safety checks.|Chúng tôi thực hiện kiểm tra an toàn định kỳ.
early|The early flight leaves at six.|Chuyến bay sớm khởi hành lúc sáu giờ.
prompt|Thank you for your prompt reply.|Cảm ơn bạn đã trả lời nhanh chóng.
immediate|The problem requires immediate attention.|Vấn đề cần được xử lý ngay.
short|The meeting was short but useful.|Cuộc họp ngắn nhưng hữu ích.
separate|Please use a separate form.|Hãy dùng một biểu mẫu riêng.
superior|This material is superior in quality.|Vật liệu này có chất lượng tốt hơn.
familiar|The procedure is familiar to us.|Chúng tôi quen với quy trình này.
comparable|The two products are comparable in quality.|Hai sản phẩm có chất lượng tương đương.
equivalent|The two certificates are equivalent.|Hai chứng chỉ có giá trị tương đương.
approximate|Please provide an approximate delivery date.|Hãy cung cấp ngày giao hàng dự kiến.
differential|The study examined differential growth rates.|Nghiên cứu xem xét mức tăng trưởng khác nhau.
reflective|Workers must wear reflective clothing.|Công nhân phải mặc quần áo phản quang.
marginal|The change produced only a marginal improvement.|Thay đổi chỉ đem lại cải thiện rất nhỏ.
potential|We discussed the potential risks.|Chúng tôi thảo luận những rủi ro tiềm ẩn.
prospective|We met with prospective clients.|Chúng tôi gặp các khách hàng tiềm năng.
previously|We previously used a different supplier.|Trước đây chúng tôi dùng nhà cung cấp khác.
joint|The companies announced a joint project.|Các công ty công bố một dự án chung.
headquarters|Our headquarters are in the city center.|Trụ sở chính của chúng tôi ở trung tâm thành phố.
personnel|The personnel department handles recruitment.|Phòng nhân sự phụ trách tuyển dụng.
alumni|The university invited its alumni to the event.|Trường đại học mời cựu sinh viên đến sự kiện.
staff|The staff attended a safety briefing.|Nhân viên tham dự buổi hướng dẫn an toàn.
customs|Passengers must declare goods at customs.|Hành khách phải khai báo hàng hóa tại hải quan.
goods|The goods arrived in excellent condition.|Hàng hóa đến trong tình trạng rất tốt.
belongings|Please keep your belongings with you.|Hãy giữ đồ dùng cá nhân bên mình.
valuables|Store your valuables in the hotel safe.|Hãy cất đồ có giá trị trong két khách sạn.
premises|Visitors must leave the premises by six.|Khách phải rời khuôn viên trước sáu giờ.
circumstances|We changed the plan because of the circumstances.|Chúng tôi đổi kế hoạch do hoàn cảnh.
credentials|Please submit your professional credentials.|Hãy nộp giấy tờ chứng minh chuyên môn.
means|We need a reliable means of transport.|Chúng tôi cần phương tiện vận chuyển đáng tin cậy.
minutes|Please send me the minutes of the meeting.|Hãy gửi tôi biên bản cuộc họp.
earnings|The company announced higher quarterly earnings.|Công ty công bố thu nhập quý tăng.
million|The project cost one million dollars.|Dự án tốn một triệu đô la.
zero|The account balance was zero.|Số dư tài khoản bằng không.
youth|The program supports youth employment.|Chương trình hỗ trợ việc làm cho người trẻ.
wealth|The report examines the distribution of wealth.|Báo cáo nghiên cứu sự phân bố của cải.
justice|The lawyer argued for equal justice.|Luật sư lập luận ủng hộ công lý bình đẳng.
lie|His statement was a lie.|Lời phát biểu của anh ấy là lời nói dối.
hold|The handle provides a firm hold.|Tay cầm giúp cầm nắm chắc chắn.
hide|The leather comes from an animal hide.|Da thuộc được làm từ da động vật.
current|The boat struggled against the strong current.|Thuyền phải chống chọi với dòng nước mạnh.
block|A concrete block obstructed the entrance.|Một khối bê tông chắn lối vào.
boast|His claim was an empty boast.|Lời khẳng định của anh ấy chỉ là sự khoe khoang.
bother|Finding parking was a real bother.|Tìm chỗ đỗ xe thật phiền phức.
grill|The chef cooked fish on the grill.|Đầu bếp nướng cá trên vỉ.
fair|The company exhibited products at a trade fair.|Công ty trưng bày sản phẩm tại hội chợ thương mại.
host|The host welcomed everyone to the event.|Người chủ trì chào đón mọi người đến sự kiện.
starter|We ordered soup as a starter.|Chúng tôi gọi súp làm món khai vị.
specialty|Fresh seafood is the restaurant's specialty.|Hải sản tươi là món đặc trưng của nhà hàng.
entrée|She ordered fish as her entrée.|Cô ấy gọi cá làm món chính.
salary|Her salary is paid monthly.|Lương của cô ấy được trả hằng tháng.
wage|The company pays a fair wage.|Công ty trả mức lương công bằng.
capital|The company needs more capital.|Công ty cần thêm vốn.
credit|The store offers credit to regular customers.|Cửa hàng cho khách quen mua chịu.
debit|The statement shows a debit of fifty dollars.|Bảng kê ghi khoản ghi nợ năm mươi đô la.
dividend|The company paid a dividend to shareholders.|Công ty trả cổ tức cho cổ đông.
interest|The bank pays interest on savings.|Ngân hàng trả lãi cho tiền tiết kiệm.
advance|The supplier requested an advance on the payment.|Nhà cung cấp yêu cầu ứng trước một phần tiền thanh toán.
quote|We received a quote for the repairs.|Chúng tôi nhận được báo giá sửa chữa.
quotation|Please send a quotation for these materials.|Hãy gửi báo giá cho những vật liệu này.
bid|The company submitted a bid for the contract.|Công ty nộp hồ sơ dự thầu hợp đồng.
stock|The store has sufficient stock.|Cửa hàng có đủ hàng tồn kho.
balance|Please check your account balance.|Hãy kiểm tra số dư tài khoản.
force|The door opened with very little force.|Cửa mở chỉ với một lực rất nhỏ.
power|The machine requires electrical power.|Máy cần nguồn điện.
right|Employees have the right to fair treatment.|Nhân viên có quyền được đối xử công bằng.
profile|Please update your professional profile.|Hãy cập nhật hồ sơ nghề nghiệp.
negative|The test result was negative.|Kết quả xét nghiệm âm tính.
concentrate|Please concentrate on the task.|Hãy tập trung vào nhiệm vụ.
coordination|Good coordination helps the team work efficiently.|Sự phối hợp tốt giúp đội làm việc hiệu quả.
dedication|Her dedication to customer service impressed us.|Sự tận tâm của cô ấy với dịch vụ khách hàng khiến chúng tôi ấn tượng.
compensation|Employees received compensation for overtime.|Nhân viên nhận thù lao cho giờ làm thêm.
renewal|The contract renewal is due next month.|Việc gia hạn hợp đồng đến hạn vào tháng tới.
occupancy|The hotel's occupancy rate increased.|Tỷ lệ lấp đầy phòng của khách sạn tăng.
projection|The sales projection covers the next quarter.|Dự báo doanh số bao gồm quý tới.
manufacture|The manufacture of these parts requires precision.|Việc sản xuất những bộ phận này đòi hỏi độ chính xác.
retail|The company specializes in retail.|Công ty chuyên về bán lẻ.
salvage|The salvage of damaged goods took several days.|Việc thu hồi hàng hư hỏng mất vài ngày.
slump|The industry experienced a slump in demand.|Ngành trải qua sự sụt giảm mạnh về nhu cầu.
takeover|The board approved the company takeover.|Hội đồng quản trị phê duyệt việc tiếp quản công ty.
turnover|Annual turnover increased by ten percent.|Doanh thu năm tăng mười phần trăm.
liability|The contract defines each party's liability.|Hợp đồng xác định trách nhiệm pháp lý của mỗi bên.
mortgage|They applied for a mortgage to buy a house.|Họ xin vay thế chấp để mua nhà.
overdraft|The bank charged a fee for the overdraft.|Ngân hàng tính phí cho khoản thấu chi.
remittance|The bank processed the remittance today.|Ngân hàng xử lý khoản chuyển tiền hôm nay.
livestock|The farm raises livestock for sale.|Trang trại nuôi gia súc để bán.
stationery|We ordered stationery for the office.|Chúng tôi đặt văn phòng phẩm cho văn phòng.
furniture|The new office needs furniture.|Văn phòng mới cần nội thất.
information|Please check the information carefully.|Hãy kiểm tra thông tin cẩn thận.
equipment|The equipment needs regular maintenance.|Thiết bị cần được bảo dưỡng thường xuyên.
traffic|Heavy traffic delayed the delivery.|Giao thông đông đúc làm chậm việc giao hàng.
congestion|Traffic congestion caused a long delay.|Ùn tắc giao thông gây chậm trễ kéo dài.
labor|The project requires skilled labor.|Dự án cần lao động có tay nghề.
leave|She requested two days of leave.|Cô ấy xin nghỉ phép hai ngày.
study|The study examined consumer behavior.|Nghiên cứu xem xét hành vi người tiêu dùng.
press|The company released a statement to the press.|Công ty công bố thông cáo cho báo chí.
content|Please review the content of the report.|Hãy xem xét nội dung báo cáo.
custom|It is a local custom to welcome visitors with tea.|Mời khách uống trà là phong tục địa phương.
scene|The police arrived at the scene.|Cảnh sát đến hiện trường.
scenery|We enjoyed the beautiful scenery.|Chúng tôi thưởng thức phong cảnh đẹp.
track|The train stopped on the track.|Tàu dừng trên đường ray.
joint|The mechanic checked the joint between the parts.|Thợ máy kiểm tra mối nối giữa các bộ phận.
roadside|The car stopped at the roadside.|Xe dừng bên đường.
line|Please wait in line.|Hãy chờ theo hàng.
''')

# Final sense-alignment pass: these contexts override ambiguous WordNet senses
# (for example, a job position rather than a physical location).
SPECIAL.update(table('''
combined|The combined cost includes both services.|Chi phí tổng hợp bao gồm cả hai dịch vụ.
formal|Please wear formal clothing to the reception.|Hãy mặc trang phục lịch sự đến buổi tiếp đón.
exclusive|Members receive exclusive access to the lounge.|Hội viên được quyền sử dụng phòng chờ riêng.
disturbing|The report contained disturbing findings.|Báo cáo chứa những phát hiện đáng lo ngại.
accessible|The building is accessible to wheelchair users.|Người dùng xe lăn có thể tiếp cận tòa nhà.
major|The delay caused a major problem.|Sự chậm trễ gây ra vấn đề lớn.
anonymous|The company received an anonymous complaint.|Công ty nhận được khiếu nại nặc danh.
probable|The engineer identified the probable cause.|Kỹ sư xác định nguyên nhân có khả năng nhất.
contemporary|The gallery displays contemporary art.|Phòng trưng bày giới thiệu nghệ thuật đương đại.
unstable|The internet connection is unstable.|Kết nối internet không ổn định.
particular|Please pay attention to this particular detail.|Hãy chú ý đến chi tiết cụ thể này.
stagnant|Sales remained stagnant for several months.|Doanh số trì trệ trong vài tháng.
drastic|The company made drastic changes.|Công ty thực hiện những thay đổi mạnh mẽ.
valid|Please present a valid ticket.|Hãy xuất trình vé hợp lệ.
absolute|Customer safety is an absolute priority.|An toàn của khách hàng là ưu tiên tuyệt đối.
various|We considered various options.|Chúng tôi cân nhắc nhiều lựa chọn khác nhau.
argumentative|The customer became argumentative during the discussion.|Khách hàng trở nên thích tranh cãi trong cuộc thảo luận.
certain|We are certain about the delivery date.|Chúng tôi chắc chắn về ngày giao hàng.
diverse|The team has diverse experience.|Đội có kinh nghiệm đa dạng.
unlimited|Members have unlimited access to the library.|Hội viên được sử dụng thư viện không giới hạn.
exotic|The shop sells exotic fruit.|Cửa hàng bán trái cây ngoại nhập lạ mắt.
unable|We are unable to process the payment.|Chúng tôi không thể xử lý khoản thanh toán.
careful|Please be careful with this equipment.|Hãy cẩn thận với thiết bị này.
complimentary|The hotel offers complimentary breakfast.|Khách sạn cung cấp bữa sáng miễn phí.
extensive|She has extensive experience in marketing.|Cô ấy có nhiều kinh nghiệm tiếp thị.
substantial|The company made a substantial investment.|Công ty thực hiện khoản đầu tư lớn.
inaccurate|The report contains inaccurate figures.|Báo cáo chứa số liệu không chính xác.
fortunate|We were fortunate to find a suitable office.|Chúng tôi may mắn tìm được văn phòng phù hợp.
adequate|The room has adequate ventilation.|Phòng được thông gió đầy đủ.
incidental|Please record any incidental expenses.|Hãy ghi lại mọi chi phí phát sinh phụ.
active|She takes an active role in the project.|Cô ấy đóng vai trò tích cực trong dự án.
considerable|The renovation required considerable effort.|Việc cải tạo đòi hỏi nhiều nỗ lực.
independent|We hired an independent consultant.|Chúng tôi thuê một tư vấn viên độc lập.
unanimous|The committee reached a unanimous decision.|Ủy ban đạt quyết định nhất trí.
persuasive|She gave a persuasive presentation.|Cô ấy thuyết trình rất thuyết phục.
constructive|We welcome constructive feedback.|Chúng tôi hoan nghênh phản hồi mang tính xây dựng.
tentative|This is a tentative schedule.|Đây là lịch tạm thời, chưa chốt.
existing|We reviewed the existing procedures.|Chúng tôi xem xét các quy trình hiện hành.
mandatory|Attendance at the training is mandatory.|Việc tham dự đào tạo là bắt buộc.
reverse|Use reverse gear when backing up.|Hãy dùng số lùi khi lùi xe.
cautious|Be cautious when sharing personal information.|Hãy thận trọng khi chia sẻ thông tin cá nhân.
possible|We discussed a possible solution.|Chúng tôi thảo luận một giải pháp có thể áp dụng.
prevalent|Online shopping is prevalent among younger consumers.|Mua sắm trực tuyến phổ biến ở người tiêu dùng trẻ.
rapid|The company experienced rapid growth.|Công ty tăng trưởng nhanh chóng.
lucrative|The company won a lucrative contract.|Công ty giành được hợp đồng sinh lời cao.
innate|She has an innate ability to lead.|Cô ấy có khả năng lãnh đạo bẩm sinh.
evident|The improvement was evident in the results.|Sự cải thiện thể hiện rõ trong kết quả.
compulsory|Safety training is compulsory for all staff.|Đào tạo an toàn là bắt buộc với mọi nhân viên.
adjacent|The warehouse is adjacent to the factory.|Nhà kho nằm liền kề nhà máy.
clear|The instructions are clear and concise.|Hướng dẫn rõ ràng và ngắn gọn.
consistent|The supplier provides consistent quality.|Nhà cung cấp bảo đảm chất lượng ổn định.
dense|Dense fog delayed the flight.|Sương mù dày đặc làm chậm chuyến bay.
agreeable|We found a mutually agreeable solution.|Chúng tôi tìm được giải pháp cả hai bên chấp nhận.
amusing|The speaker told an amusing story.|Người diễn thuyết kể một câu chuyện vui.
appreciable|There was an appreciable increase in sales.|Doanh số tăng đáng kể.
available|The item is available in three sizes.|Mặt hàng có sẵn ba kích cỡ.
awkward|The question created an awkward situation.|Câu hỏi tạo ra tình huống khó xử.
competitive|The store offers competitive prices.|Cửa hàng có giá cạnh tranh.
definite|We need a definite delivery date.|Chúng tôi cần ngày giao hàng rõ ràng.
dismissive|The manager was dismissive of our concerns.|Người quản lý xem nhẹ những lo ngại của chúng tôi.
disposable|The clinic uses disposable gloves.|Phòng khám dùng găng tay dùng một lần.
efficient|The new system is efficient.|Hệ thống mới hoạt động hiệu quả.
exact|Please confirm the exact arrival time.|Hãy xác nhận giờ đến chính xác.
final|This is the final version of the report.|Đây là phiên bản cuối cùng của báo cáo.
focused|The team remained focused on its goal.|Đội vẫn tập trung vào mục tiêu.
foreign|We work with several foreign suppliers.|Chúng tôi hợp tác với một số nhà cung cấp nước ngoài.
influential|She is an influential business leader.|Cô ấy là lãnh đạo doanh nghiệp có ảnh hưởng.
moral|The decision raises a moral question.|Quyết định đặt ra vấn đề đạo đức.
organized|The files are well organized.|Các hồ sơ được sắp xếp gọn gàng.
pleasant|We had a pleasant stay at the hotel.|Chúng tôi có kỳ nghỉ dễ chịu tại khách sạn.
progressive|The company follows a progressive hiring policy.|Công ty áp dụng chính sách tuyển dụng tiến bộ.
rare|This is a rare opportunity.|Đây là cơ hội hiếm có.
refundable|The deposit is fully refundable.|Khoản đặt cọc được hoàn lại toàn bộ.
relevant|Please provide the relevant documents.|Hãy cung cấp tài liệu liên quan.
repetitive|The machine automates repetitive tasks.|Máy tự động hóa các công việc lặp lại.
respectable|The company has a respectable reputation.|Công ty có danh tiếng đáng kính trọng.
satisfactory|The inspection results were satisfactory.|Kết quả kiểm tra đạt yêu cầu.
unconditional|The agreement provides unconditional support.|Thỏa thuận cung cấp sự hỗ trợ vô điều kiện.
impressed|She was impressed by the presentation.|Cô ấy ấn tượng với bài thuyết trình.
involved|All departments are involved in the project.|Tất cả phòng ban đều tham gia dự án.
interested|She is interested in the vacant position.|Cô ấy quan tâm đến vị trí còn trống.
bankrupt|The company went bankrupt last year.|Công ty phá sản năm ngoái.
knowledgeable|The guide is knowledgeable about local history.|Hướng dẫn viên am hiểu lịch sử địa phương.
selective|The company is selective when hiring.|Công ty tuyển chọn kỹ khi tuyển dụng.
suspicious|We reported the suspicious transaction.|Chúng tôi báo cáo giao dịch khả nghi.
compatible|The software is compatible with our computers.|Phần mềm tương thích với máy tính của chúng tôi.
tailored|The course is tailored to beginners.|Khóa học được điều chỉnh cho người mới.
functional|The repaired printer is now functional.|Máy in đã sửa hiện hoạt động được.
handy|A calculator is handy for this task.|Máy tính bỏ túi hữu ích cho nhiệm vụ này.
perishable|Keep perishable food in the refrigerator.|Hãy bảo quản thực phẩm dễ hỏng trong tủ lạnh.
position|She applied for a position in accounting.|Cô ấy ứng tuyển vào vị trí kế toán.
outline|Please prepare an outline of the report.|Hãy chuẩn bị đề cương báo cáo.
itinerary|Please confirm your travel itinerary.|Hãy xác nhận lịch trình chuyến đi.
edge|Better service gives us a competitive edge.|Dịch vụ tốt hơn tạo lợi thế cạnh tranh cho chúng tôi.
reservation|Please confirm the hotel reservation.|Hãy xác nhận đặt phòng khách sạn.
tip|She left a tip for the waiter.|Cô ấy để lại tiền boa cho người phục vụ.
trend|The report identifies a new market trend.|Báo cáo xác định xu hướng thị trường mới.
reference|Please provide a reference from your former employer.|Hãy cung cấp lời giới thiệu từ người sử dụng lao động trước.
interview|The interview will take place on Monday.|Buổi phỏng vấn diễn ra vào thứ Hai.
form|Please complete the application form.|Hãy điền đầy đủ biểu mẫu ứng tuyển.
permission|We need permission to enter the building.|Chúng tôi cần được phép vào tòa nhà.
act|The new act protects employee rights.|Đạo luật mới bảo vệ quyền của nhân viên.
overview|The report provides an overview of the project.|Báo cáo cung cấp cái nhìn tổng quan về dự án.
showing|The film's first showing starts at seven.|Suất chiếu đầu của bộ phim bắt đầu lúc bảy giờ.
demand|Demand for the product is increasing.|Nhu cầu về sản phẩm đang tăng.
target|We reached the monthly sales target.|Chúng tôi đạt chỉ tiêu bán hàng tháng.
discussion|The discussion focused on customer service.|Cuộc thảo luận tập trung vào chăm sóc khách hàng.
indicator|The unemployment rate is an economic indicator.|Tỷ lệ thất nghiệp là chỉ số kinh tế.
description|The website provides a detailed product description.|Trang web cung cấp mô tả sản phẩm chi tiết.
update|Please install the latest software update.|Hãy cài bản cập nhật phần mềm mới nhất.
indication|The increase is an indication of stronger demand.|Mức tăng là dấu hiệu cho thấy nhu cầu mạnh hơn.
hospitality|We appreciated the hotel's hospitality.|Chúng tôi trân trọng sự hiếu khách của khách sạn.
proposal|Please review the proposal before the meeting.|Hãy xem xét đề xuất trước cuộc họp.
dispute|The parties resolved the contract dispute.|Các bên giải quyết tranh chấp hợp đồng.
stipulation|The contract includes a payment stipulation.|Hợp đồng có điều khoản quy định về thanh toán.
objection|No one raised an objection.|Không ai đưa ra ý kiến phản đối.
bargain|This jacket was a real bargain.|Chiếc áo khoác này là món hời thật sự.
inventory|We checked the warehouse inventory.|Chúng tôi kiểm tra hàng tồn kho.
article|She wrote an article about customer service.|Cô ấy viết bài báo về chăm sóc khách hàng.
assumption|The estimate was based on an incorrect assumption.|Ước tính dựa trên giả định sai.
lecture|The lecture starts at nine.|Bài giảng bắt đầu lúc chín giờ.
honor|It is an honor to receive this award.|Được nhận giải thưởng này là vinh dự.
performance|The theater announced a new performance.|Nhà hát thông báo buổi biểu diễn mới.
praise|The team received praise for its work.|Đội được khen về công việc của mình.
withdrawal|The bank processed the cash withdrawal.|Ngân hàng xử lý việc rút tiền mặt.
consent|We need your written consent.|Chúng tôi cần sự đồng ý bằng văn bản của bạn.
accounting|She studies accounting at university.|Cô ấy học kế toán ở đại học.
argument|They settled the argument peacefully.|Họ giải quyết cuộc tranh luận ôn hòa.
brand|This brand is known for quality.|Thương hiệu này nổi tiếng về chất lượng.
briefing|The safety briefing lasted ten minutes.|Buổi hướng dẫn an toàn kéo dài mười phút.
broadcast|We watched the live broadcast.|Chúng tôi xem chương trình phát sóng trực tiếp.
display|The store created a new product display.|Cửa hàng bố trí khu trưng bày sản phẩm mới.
figure|Please check the sales figure.|Hãy kiểm tra số liệu bán hàng.
folder|Please put the documents in this folder.|Hãy đặt tài liệu vào bìa hồ sơ này.
input|The system requires accurate input.|Hệ thống cần dữ liệu đầu vào chính xác.
item|One item is missing from the order.|Đơn hàng thiếu một món.
mention|The report makes mention of the new policy.|Báo cáo có đề cập chính sách mới.
promotion|She received a promotion to manager.|Cô ấy được thăng chức lên quản lý.
publicity|The event generated positive publicity.|Sự kiện tạo sự chú ý tích cực của công chúng.
reception|Please leave your key at reception.|Hãy để chìa khóa ở quầy lễ tân.
recommendation|We accepted the consultant's recommendation.|Chúng tôi chấp nhận khuyến nghị của tư vấn viên.
refusal|His refusal to cooperate delayed the project.|Việc anh ấy từ chối hợp tác làm chậm dự án.
software|Please update the software regularly.|Hãy cập nhật phần mềm thường xuyên.
warning|The label carries a safety warning.|Nhãn có cảnh báo an toàn.
website|Please visit our website for details.|Hãy truy cập trang web của chúng tôi để biết chi tiết.
cuisine|We enjoyed local cuisine at the restaurant.|Chúng tôi thưởng thức ẩm thực địa phương tại nhà hàng.
preference|Please tell us your seating preference.|Hãy cho chúng tôi biết chỗ ngồi bạn thích.
resignation|She submitted her resignation yesterday.|Cô ấy nộp đơn từ chức hôm qua.
alarm|The smoke triggered the fire alarm.|Khói kích hoạt báo động cháy.
attachment|Please open the email attachment.|Hãy mở tệp đính kèm email.
solution|We need a practical solution to the problem.|Chúng tôi cần giải pháp thiết thực cho vấn đề.
pollutant|The factory reduced emissions of this pollutant.|Nhà máy giảm phát thải chất gây ô nhiễm này.
workshop|The workshop teaches practical skills.|Hội thảo hướng dẫn kỹ năng thực tế.
airline|The airline canceled the morning flight.|Hãng hàng không hủy chuyến bay buổi sáng.
commuter|The commuter travels by train every day.|Người đi làm sử dụng tàu hằng ngày.
medication|The patient takes medication every morning.|Bệnh nhân uống thuốc mỗi sáng.
shipment|The shipment arrived this morning.|Lô hàng đến sáng nay.
transit|The goods were damaged in transit.|Hàng hóa bị hỏng trong quá trình vận chuyển.
transportation|The company arranges transportation for visitors.|Công ty bố trí phương tiện đi lại cho khách.
antique|The museum displays a valuable antique.|Bảo tàng trưng bày một món đồ cổ có giá trị.
adapter|You need an adapter for this plug.|Bạn cần bộ chuyển đổi cho phích cắm này.
browser|Please update your web browser.|Hãy cập nhật trình duyệt web.
calculator|The calculator is on the desk.|Máy tính bỏ túi ở trên bàn.
carrier|The carrier delivered the package safely.|Đơn vị vận chuyển giao gói hàng an toàn.
subsidiary|The company owns a subsidiary overseas.|Công ty sở hữu một công ty con ở nước ngoài.
consignment|The consignment contains twenty boxes.|Lô hàng ký gửi gồm hai mươi thùng.
ingredient|The recipe uses a fresh ingredient.|Công thức dùng một nguyên liệu tươi.
deadline|We must meet the project deadline.|Chúng tôi phải đáp ứng thời hạn dự án.
fare|Please pay the bus fare.|Hãy trả tiền xe buýt.
goal|Our goal is to improve service.|Mục tiêu của chúng tôi là cải thiện dịch vụ.
inflation|Inflation has increased the cost of living.|Lạm phát làm tăng chi phí sinh hoạt.
fatigue|Long working hours can cause fatigue.|Giờ làm việc kéo dài có thể gây mệt mỏi.
charity|The company donated money to a charity.|Công ty quyên góp tiền cho tổ chức từ thiện.
confidence|Training increased her confidence.|Đào tạo giúp cô ấy tự tin hơn.
authority|The manager has authority to approve refunds.|Người quản lý có thẩm quyền phê duyệt hoàn tiền.
sequel|The author is writing a sequel.|Tác giả đang viết phần tiếp theo.
mishear|It is easy to mishear a number over the phone.|Rất dễ nghe nhầm một con số qua điện thoại.
warrant|The evidence may warrant further investigation.|Chứng cứ có thể là cơ sở để điều tra thêm.
endure|Passengers sometimes endure long delays.|Hành khách đôi khi phải chịu những chậm trễ kéo dài.
hesitate|Do not hesitate to ask for help.|Đừng ngần ngại nhờ giúp đỡ.
fail|We must not fail to meet the deadline.|Chúng tôi không được bỏ lỡ thời hạn.
accurate|The measurements are accurate.|Các số đo chính xác.
timely|Thank you for your timely response.|Cảm ơn bạn đã phản hồi kịp thời.
uncertain|We are uncertain about the delivery date.|Chúng tôi chưa chắc chắn về ngày giao hàng.
limited|The offer is available for a limited time.|Ưu đãi chỉ có trong thời gian giới hạn.
vital|Accurate information is vital to the project.|Thông tin chính xác rất quan trọng với dự án.
easy|The new software is easy to use.|Phần mềm mới dễ sử dụng.
profitable|The new service is profitable.|Dịch vụ mới mang lại lợi nhuận.
redundant|Please remove the redundant information.|Hãy bỏ thông tin thừa.
revised|Please read the revised schedule.|Hãy đọc lịch đã sửa đổi.
thorough|The equipment needs a thorough inspection.|Thiết bị cần được kiểm tra kỹ lưỡng.
varied|The restaurant offers a varied menu.|Nhà hàng có thực đơn đa dạng.
unfavorable|Unfavorable weather delayed the shipment.|Thời tiết không thuận lợi làm chậm lô hàng.
'''))
