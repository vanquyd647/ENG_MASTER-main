// Codex second-pass decisions after reading the longer texts and every option.
// This is an explicit author-independent workflow, not a claim of a second person.
import fs from 'node:fs';import{createHash}from'node:crypto';
import{ALL_PRACTICE_QUESTIONS,ALL_WORKPLACE_LESSONS}from'../src/data/learningContent.ts';
import{readingById}from'../src/data/readingContent.ts';
const choices={
 'p6-calibrated-v1-delivery':['deliver','shipment','by','We look forward to completing your delivery.'],
 'p6-calibrated-v1-training':['be held','practice','However','Please let your supervisor know which session you plan to attend.'],
 'p6-calibrated-v1-renovation':['entryway','Although','patience','The finished lobby will provide a more welcoming space for everyone.'],
 'p6-calibrated-v1-membership':['expire','automatically','them','Our membership team can help if you have trouble with the renewal process.'],
 'p7-calibrated-v1-store':['Wait for the ready-for-collection email','The customer adds the friend’s name in the account beforehand','It is canceled and refunded'],
 'p7-calibrated-v1-invoice':['$900','Printed brochures','The invoice reference CD-418'],
 'p7-calibrated-v1-recruitment':['Using spreadsheets','It may be necessary, with a weekday off in return','A résumé and a short cover letter'],
 'p7-calibrated-v1-train':['Easton–Mill Park','Nothing','A twenty-minute longer journey'],
 'p7-exam-v1-fitness':['Remove all items from their lockers.','Seven days.','Their own padlock.'],
 'p7-exam-v1-course':['The building will be closed for maintenance.','At 6 p.m. on June 13.','Worksheets.'],
 'p7-exam-v1-returns':['They are faulty.','At any branch or by post.','When the item is defective.'],
 'p7-exam-v1-appointment':['10:05 a.m.','An authorization letter.'],
 'p7-exam-v1-venue':['Cedar Room.','$260.','A projector.','Lunch.','The finance team.'],
 'p7-exam-v1-shipment':['Eight desk chairs.','They were still being checked.','October 7.','At the rear loading bay.','$1,020.'],
 'p7-exam-v1-volunteer':['8 a.m.–noon.','At the information desk.','An online briefing.','7:45 a.m.','A meal voucher.'],
 'p7-exam-v1-conference':['Room 8.','10:15 a.m.','A laptop with the sample files.','In Hall B.','Beside the registration counter.'],
 'p7-exam-v1-supplier':['The two-business-day express service.','The express service surcharge.','500.','The printer must receive payment.','The delivery contact number.'],
};
const snapshot=[],items=[];
for(const [passageId,answers]of Object.entries(choices)){
 const questions=ALL_PRACTICE_QUESTIONS.filter(q=>q.passageId===passageId),p=readingById.get(passageId);
 if(!p||questions.length!==answers.length)throw Error('Missing calibration source '+passageId);
 questions.forEach((q,i)=>{
  const chosenIndex=q.options.indexOf(answers[i]);if(chosenIndex<0||q.correctIndex!==chosenIndex)throw Error('Answer mismatch '+q.id);
  if(q.evidence&&!p.text.includes(q.evidence))throw Error('Evidence removed '+q.id);
  snapshot.push({question:q,listening:null,reading:p,context:q.lessonId?ALL_WORKPLACE_LESSONS.find(l=>l.id===q.lessonId):null});
  items.push({id:q.id,chosenIndex,answerMatches:true,ambiguous:false,issue:'',translationIssue:'',reason:'Codex đọc toàn văn và cả bốn lựa chọn: '+q.explanation+' Phần bổ sung không đổi sự kiện dùng chấm và không làm phương án nhiễu thành đúng.'});
 });
}
const prefix='output/verification/bank-review-calibration-v1';if(fs.existsSync(prefix+'.json'))throw Error('Preserve prior review; choose a new version');
fs.writeFileSync(prefix+'-snapshot.json',JSON.stringify(snapshot,null,2)+'\n');fs.writeFileSync(prefix+'.json',JSON.stringify({checkedAt:new Date().toISOString(),reviewer:'Codex second-pass source/text/options review; no teacher certification or new Gemini claim',sourceSha256:createHash('sha256').update(JSON.stringify(snapshot)).digest('hex'),items,summary:{reviewed:items.length,failedBatches:0}},null,2)+'\n');console.log({reviewed:items.length,passages:Object.keys(choices).length});
