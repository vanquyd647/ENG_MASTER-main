// Explicit source verification after adding 6 reading items and 2 listening subtypes.
import fs from 'node:fs';import {createHash} from 'node:crypto';
import {questionById,ALL_WORKPLACE_LESSONS} from '../src/data/learningContent.ts';
import {readingById} from '../src/data/readingContent.ts';import {listeningById} from '../src/data/listeningPractice.ts';
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const decisions={
 'p7-accept-v1-handover-q1':['To announce temporary work arrangements.','Email phân công công việc trong thời gian Nina đi học và đổi cuộc họp; các phương án quảng cáo/đánh giá Omar/ngừng hỗ trợ đều sai.'],
 'p7-accept-v1-handover-q2':['Leave them for the assigned staff member.','Nguồn giữ yêu cầu thường cho nhân viên được phân công; chỉ khiếu nại khẩn chuyển Omar.'],
 'p7-accept-v1-handover-q3':['9:20 a.m.','9:30 bắt đầu họp; dành đủ 10 phút đọc trước đó thì chậm nhất bắt đầu 9:20.'],
 'p7-accept-v1-parking-q1':['$4.','Đúng ba giờ nằm trong hơn một giờ đến tối đa ba giờ, phí4; câu hỏi nêu rõ không có voucher.'],
 'p7-accept-v1-parking-q2':['The employee hosting the visitor.','Thông báo cấp voucher cho người đón là nhân viên, không cấp trực tiếp khách; phí đã trả không hoàn.'],
 'p7-accept-v1-parking-q3':['Drivers must enter from South Road.','Ngày6/11 chỉ lối West Street đóng; cả khách/nhân viên dùng South Road, lễ tân/lối bộ không đổi.'],
 'p3-exam-v1-software-q1':['Attend another training session.','Lời A bỏ lỡ khóa học, xin buổi khác; thêm ngườiC hỏi cài đặt không đổi ý nghĩa.'],
 'p3-exam-v1-software-q2':['Online.','Lời B nói rõ buổi thứNăm trực tuyến. Ba người A/B/C được gán ba giọng, không đổi đáp án.'],
 'p3-exam-v1-software-q3':['Install the software using the emailed guide.','B yêu cầu cài đặt theo email; câu hỏi C là chuẩn bị trước đào tạo.'],
 'p4-exam-v1-shuttle-q1':['Bay four.','Audio cho biết chuyến đi Airport; bảng Airport→4, CityCenter→1, Harbor→3. Bay2 cũ đóng, hai đáp án khác không phải ô đón.'],
 'p4-exam-v1-shuttle-q2':['Buy a ticket at the kiosk.','Audio vẫn yêu cầu mua vé tại kiosk trước khi lên xe.'],
 'p4-exam-v1-shuttle-q3':['About forty minutes.','Audio vẫn nêu thời gian khoảng40 phút; bảng chỉ đổi dữ liệu bay theo đích đến.'],
};
const snapshot=[],items=[];
for(const [id,[answer,reason]] of Object.entries(decisions)){
 const q=questionById.get(id);if(!q||q.options[q.correctIndex]!==answer)throw Error('Reviewed answer changed '+id);
 const source={question:q,listening:q.listeningId?listeningById.get(q.listeningId):null,reading:q.passageId?readingById.get(q.passageId):null,context:q.lessonId?ALL_WORKPLACE_LESSONS.find(l=>l.id===q.lessonId):null};
 snapshot.push(source);items.push({id,chosenIndex:q.options.indexOf(answer),answerMatches:true,ambiguous:false,issue:'',translationIssue:'',reason});
}
if(new Set(listeningById.get('p3-exam-v1-software').lines.map(l=>l.speaker)).size!==3)throw Error('Missing third speaker');
const prefix='output/verification/bank-review-delta-v1';
fs.writeFileSync(prefix+'-snapshot.json',JSON.stringify(snapshot,null,2)+'\n');
fs.writeFileSync(prefix+'.json',JSON.stringify({checkedAt:new Date().toISOString(),reviewer:'Codex second-pass source verification; not a new Gemini or teacher review',model:null,sourceSha256:hash(snapshot),items,summary:{reviewed:items.length,failedBatches:0}},null,2)+'\n');
console.log({reviewed:items.length,reviewer:'Codex',newReading:6,updatedListeningQuestions:6});
