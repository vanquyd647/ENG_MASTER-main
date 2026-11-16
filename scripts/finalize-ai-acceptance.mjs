// Codex read every frozen response, then adjudicated the separate checker's flags.
// Raw model quality is measured BEFORE any source substitutions, including rejected content.
import fs from'node:fs';import{createHash}from'node:crypto';
const input='output/verification/accept95-ai-local-v3.json',replayPath='output/verification/accept95-ai-v7-replay-v3.json',checkerPath='output/verification/accept95-ai-local-v3-checker.json';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const raw=read(input),replay=read(replayPath),checker=read(checkerPath);
if(!raw.finishedAt||!checker.finishedAt||raw.items.length!==200||replay.items.length!==200||replay.outputSha256!==hash(raw.items)||checker.outputSha256!==hash(raw.items))throw Error('Incomplete or mismatched evidence');
for(const [p,h]of Object.entries(replay.currentCodeHashes))if(createHash('sha256').update(fs.readFileSync(p)).digest('hex')!==h)throw Error('Stale current handler '+p);
const failures={
 'accept200-explain-procrastinate':{critical:true,reason:'avoid procrastinate phải là avoid procrastinating; stop trong usage cũng không phải trợ động từ. Luồng hiện tại trả nguồn có nhãn.',source:'https://dictionary.cambridge.org/grammar/british-grammar/verb-patterns-verb-infinitive-or-verb-ing'},
 'accept200-compare-occasionally':{critical:true,reason:'cấu trúc reimbursement không phải mô tả cấu trúc động từ reimburse. Luồng hiện tại dùng ví dụ/đối chiếu gốc có nhãn.',source:'https://dictionary.cambridge.org/dictionary/english/reimburse'},
 'accept200-examples-reimburse':{critical:true,reason:'You need to submit receipts to reimburse medical expenses gán hành động hoàn trả cho người nộp biên lai, thiếu ngữ cảnh người chi trả; dùng nội dung nguồn thay cách diễn đạt dễ dạy nhầm vai.',source:'https://dictionary.cambridge.org/dictionary/english/reimburse'},
 'accept200-quiz-0:rec-15':{critical:true,reason:'full-time chỉ thời lượng làm việc; không dịch thành nhân viên chính thức/permanent. Luồng hiện tại sửa thuật ngữ thành toàn thời gian.',source:'https://dictionaryblog.cambridge.org/2020/09/30/permanent-temporary-fulfilling-and-dead-end-jobs-collocations-for-work-2/'},
 'accept200-quiz-10:rev-27':{critical:true,reason:'whole là toàn bộ, không phải phần lớn; hint mơ hồ và lỗi dính chữ toànbộ. Luồng hiện tại dùng hint và giải thích từ nghĩa nguồn.',source:'https://dictionary.cambridge.org/dictionary/english/whole'},
 'accept200-quiz-11:tre-29':{critical:true,reason:'Câu mệnh lệnh Please merge không có trợ động từ trước merge. Luồng hiện tại bỏ diễn giải ngữ pháp AI, đối chiếu theo nghĩa nguồn.',source:'https://dictionary.cambridge.org/grammar/british-grammar/imperative-clauses-be-quiet'},
 'accept200-review-0:residence':{critical:true,reason:'located in downtown ở cuối câu không tự nhiên trong mẫu đang dùng; không dùng câu này để chấm. Luồng hiện tại dùng trọn câu gốc với chỗ trống đã đối chiếu.',source:'https://dictionary.cambridge.org/dictionary/english/downtown'},
 'accept200-review-11:sale':{critical:true,reason:'Ví dụ sale số ít được dịch như doanh số sales, lệch nghĩa đang học. Luồng hiện tại dùng câu biên soạn về việc bán tòa nhà và ghi nguồn ENG_MASTER.',source:'https://dictionary.cambridge.org/dictionary/english/sale'},
};
const notes={
 'accept200-quiz-4:eco-14':'Bác flag của checker: will likely approve là trạng từ hợp lệ, phổ biến trong tiếng Anh Mỹ. Cambridge Grammar nêu trực tiếp cấu trúc will + likely + động từ chính.',
 'accept200-examples-employee':'Cụm các thành viên nhân viên hơi lặp, nghĩa vẫn rõ; ghi nhận lỗi phong cách, không phải dạy sai nghĩa hoặc đáp án.',
 'accept200-explain-occasionally':'Mức B2 trong yêu cầu là mức diễn giải; không sử dụng nhận xét này để quy đổi điểm hay chứng nhận cấp độ từ.',
 'accept200-explain-professional':'Mức diễn giải được chọn, không có dữ liệu hiệu chuẩn CEFR/TOEIC cho từ hoặc người học.',
 'accept200-examples-professional':'Mức diễn giải được chọn, không chứng nhận từ này có cấp độ cố định A2.',
};
const items=raw.items.map(original=>{
 const served=replay.items.find(x=>x.id===original.id),check=checker.items.find(x=>x.id===original.id);if(!served||!check||check.inputSha256!==hash(original))throw Error('Missing per-item review '+original.id);
 const bad=failures[original.id],rawPassed=original.automatedPassed&&!bad;
 const sourceOnly=original.response?.quality?.mode==='reviewed'||original.sourceOnly===true;
 // Every original AI output, including one later replaced, remains in this denominator.
 const modelOutput=original.automatedPassed&&!sourceOnly;
 const response=served.servedResponse||served.response;
 const finalPassed=served.replayPassed===true&&(rawPassed||served.disposition!=='unchanged-content-accepted');
 const question=response?.questionText||response?.feedback?.question||response?.lesson?.questions?.[0]?.questionText;
 const answer=response?.answer||response?.feedback?.answer||response?.lesson?.questions?.[0]?.answer;
 return{id:original.id,inputSha256:hash(original),servedSha256:response?hash(response):null,reviewer:'Codex full content reading and adjudication',checker:check.source,checkerPassed:check.passed,rawSemanticPassed:rawPassed,modelOutput,disposition:served.disposition,passed:finalPassed,criticalInRaw:!!bad?.critical,unblockedCritical:!!bad?.critical&&served.disposition==='unchanged-content-accepted',reason:bad?.reason||notes[original.id]||(original.automatedPassed?'Đã đọc nghĩa, từ loại/cách dùng, tiếng Anh và bản dịch; đáp án khớp đúng từ mục tiêu được yêu cầu.':'Giữ nguyên ca dịch vụ thất bại, không thử lại để đổi thành đạt.'),...(bad?.source?{reference:bad.source}:{}),...(original.id==='accept200-quiz-4:eco-14'?{reference:'https://dictionary.cambridge.org/us/grammar/british-grammar/likely-and-unlikely'}:{}),...(question?{completedSentence:question.replace('_____',answer)}:{})};
});
const model=items.filter(x=>x.modelOutput),passed=items.filter(x=>x.passed).length,modelPassed=model.filter(x=>x.rawSemanticPassed).length;
const report={checkedAt:new Date().toISOString(),owner:'Codex, assigned by user',input,replayPath,checkerPath,fixtureSha256:raw.fixtureSha256,outputSha256:hash(raw.items),currentCodeHashes:replay.currentCodeHashes,method:'200 live recorded app outputs plus current-handler replay with unchanged generation inputs. Raw model errors never become model successes after source substitution. This is not 200 fresh v7 live calls.',denominator:200,passed,totalPercent:passed/200*100,service:{passed:raw.automated.passed,total:200,percent:raw.automated.percent,failedRequests:raw.requests.filter(x=>x.status!==200)},generatedSubset:{passed:modelPassed,total:model.length,percent:modelPassed/model.length*100,includesRejectedAndReplacedModelOutputs:true,serviceFailuresOutsideGeneratedSubset:7,serviceFailuresRemainInOverallDenominator:true},sourceBreakdown:Object.fromEntries([...new Set(items.map(x=>x.disposition))].map(d=>[d,items.filter(x=>x.disposition===d).length])),criticalUnblocked:items.filter(x=>x.unblockedCritical).length,thresholdMet:passed/200>=.95&&modelPassed/model.length>=.95&&!items.some(x=>x.unblockedCritical),rawModelFailures:Object.keys(failures),limits:['Synthetic sample of 152 catalog words; not every word or future output','No learner data or score-gain measurement','Original 7 service failures retained','Source substitutions are explicitly labeled and excluded from model success credit'],items};
fs.writeFileSync('output/verification/accept95-ai-semantic-final.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({overall:report.totalPercent,model:report.generatedSubset,criticalUnblocked:report.criticalUnblocked,thresholdMet:report.thresholdMet}));
