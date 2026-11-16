// @vitest-environment node
import { beforeEach, afterEach, expect, it, vi } from 'vitest';
const {generateContent}=vi.hoisted(()=>({generateContent:vi.fn()}));
vi.mock('@google/genai',()=>({GoogleGenAI:class {models={generateContent};}}));
vi.mock('./firebaseAdmin.js',()=>({getAdminStorage:vi.fn()}));
import {VOCABULARY} from '../data/vocabulary';
import {groundWord} from './aiGrounding';
import {reviewedLesson,reviewedComparison} from './learningNotes';
import {explainWord,generateMistakeReview,generateQuiz} from './gemini';
import {AI_CONTENT_VERSION,parseAiExplanation,parseAiLesson,parseAiReview} from '../domain/aiContent';
const source=groundWord('rec-01','opening',VOCABULARY[0].meaning);
const lesson={summary:'Trong câu ví dụ, opening chỉ vị trí tuyển dụng còn trống.',usage:'Dùng an opening in a department để nói vị trí đang tuyển.',
  collocations:[{phrase:'a job opening',meaning:'một vị trí đang tuyển'}],examples:[{english:'We have an opening for an accountant.',vietnamese:'Chúng tôi có một vị trí kế toán đang tuyển.'}],
  caution:'Nghĩa khai trương cần ngữ cảnh khác, chẳng hạn grand opening.',questions:[]};
beforeEach(()=>{vi.stubEnv('GEMINI_API_KEY','qa-placeholder');generateContent.mockReset();});
afterEach(()=>vi.unstubAllEnvs());
it('grounds all 1,575 approved IDs including topic and bilingual examples without rewriting the catalog',()=>{
  expect(VOCABULARY).toHaveLength(1575);
  for(const word of VOCABULARY)expect(groundWord(word.id,word.word,word.meaning)).toEqual({kind:'catalog',wordId:word.id,word:word.word,meaning:word.meaning,pos:word.pos,topic:word.topic,example:word.example,exampleTranslation:word.exampleTranslation});
});
it('rejects forged meanings for an approved ID and labels unmatched custom data as unverified',async()=>{
  const result=await explainWord({wordId:'rec-01',word:'opening',meaning:'hóa đơn'});
  expect(result.status).toBe(400);expect(generateContent).not.toHaveBeenCalled();
  expect(groundWord('personal-one','custom word','nghĩa cá nhân')).toMatchObject({kind:'user',example:'',topic:''});
});
it('uses structured output with trusted context and keeps instructions separate from supplied content',async()=>{
  generateContent.mockResolvedValue({text:JSON.stringify(lesson)});
  const result=await explainWord({wordId:'custom-context',word:'custom opening',meaning:'vị trí tùy chỉnh',action:'simplify',level:'A1'});
  expect(result.status).toBe(200);
  const data=parseAiExplanation((result.body as {explanation:unknown}).explanation);
  expect(data).toMatchObject({version:AI_CONTENT_VERSION,action:'simplify',source:{kind:'user',word:'custom opening',meaning:'vị trí tùy chỉnh'}});
  const call=generateContent.mock.calls[0][0];
  expect(call.config.responseMimeType).toBe('application/json');expect(call.config.responseJsonSchema.required).toContain('examples');
  expect(JSON.parse(call.contents)).toMatchObject({level:'A1',source:{kind:'user',word:'custom opening',meaning:'vị trí tùy chỉnh'}});
  expect(call.config.systemInstruction).toContain('không lời chào');
  expect((result.body as {text:string}).text).toContain('Cụm từ thường gặp');
});
it('keeps a comparison tied to both selected meanings and rejects a missing or identical second word',async()=>{
  expect((await explainWord({word:'opening',meaning:source.meaning,action:'compare'})).status).toBe(400);
  expect((await explainWord({word:'opening',meaning:source.meaning,action:'compare',comparison:{wordId:'rec-01',word:'opening',meaning:source.meaning}})).status).toBe(400);
  generateContent.mockResolvedValue({text:JSON.stringify(lesson)});
  const second=VOCABULARY[1],result=await explainWord({wordId:'rec-01',word:'opening',meaning:source.meaning,action:'compare',comparison:{wordId:second.id,word:second.word,meaning:second.meaning}});
  expect(result.status).toBe(200);expect(parseAiExplanation((result.body as {explanation:unknown}).explanation).comparison?.meaning).toBe(second.meaning);
});
it('does not accept Markdown, missing fields, wrong practice IDs or a wrong target answer as structured content',async()=>{
  generateContent.mockResolvedValue({text:'### Lời giải không theo schema'});
  expect((await explainWord({word:'schema-test',meaning:'kiểm thử',wordId:'custom-schema'})).status).toBe(502);
  expect(()=>parseAiLesson({...lesson,examples:[]},source,'explain')).toThrow();
  const question={wordId:'other-id',type:'fill',questionText:'There is an _____ in sales.',options:[],answer:'invoice',hint:'Một vị trí đang tuyển.',translation:'Có vị trí trống.',explanation:'Dùng opening.'};
  expect(()=>parseAiLesson({...lesson,questions:[question]},source,'practice')).toThrow();
  expect(()=>parseAiLesson({...lesson,questions:[{...question,wordId:source.wordId,answer:source.word}]},source,'explain')).toThrow();
});
it('generates a fresh practice question on every request and never shares private-word caches across owners',async()=>{
  const practice={...lesson,questions:[{wordId:'rec-01',type:'fill',questionText:'There is an _____ in sales.',options:[],answer:'opening',hint:'Vị trí đang tuyển.',translation:'Có một vị trí trống trong phòng bán hàng.',explanation:'Opening là danh từ.'}]};
  generateContent.mockResolvedValue({text:JSON.stringify(practice)});
  for(let i=0;i<2;i++)expect((await explainWord({wordId:'rec-01',word:'opening',meaning:source.meaning,action:'practice'})).status).toBe(200);
  expect(generateContent).toHaveBeenCalledTimes(2);
  generateContent.mockResolvedValue({text:JSON.stringify(lesson)});
  for(const uid of ['owner-a','owner-b'])await explainWord({wordId:'personal-cache',word:'private token',meaning:'nghĩa riêng'},{uid,requestId:'qa'});
  expect(generateContent).toHaveBeenCalledTimes(4);
});
it('pairs review feedback with exact original answers, including Vietnamese MCQ answers, and checks complete coverage',async()=>{
  generateContent.mockResolvedValue({text:JSON.stringify([{index:0,usageNote:'Opening chỉ vị trí tuyển dụng trong câu nguồn.',english:'We have an opening in sales.',vietnamese:'Chúng tôi có vị trí trống ở phòng bán hàng.',practice:{before:'There is an',after:'in sales.'}}])});
  const result=await generateMistakeReview({mistakes:[{wordId:'rec-01',word:'opening',meaning:source.meaning,userAnswer:'hóa đơn',correctAnswer:source.meaning}]});
  expect(result.status).toBe(200);
  const data=parseAiReview((result.body as {review:unknown}).review);
  expect(data.items[0]).toMatchObject({source,userAnswer:'hóa đơn',correctAnswer:source.meaning});
  expect(()=>parseAiReview({...data,items:[...data.items,...data.items]})).toThrow();
  generateContent.mockResolvedValue({text:JSON.stringify([])});
  expect((await generateMistakeReview({mistakes:[{word:'opening',meaning:source.meaning,userAnswer:'wrong',correctAnswer:'opening'}]})).status).toBe(502);
});
it('grounds quiz requests too and never lets an approved ID select a different meaning',async()=>{
  expect((await generateQuiz({words:[{id:'rec-01',word:'opening',meaning:'hóa đơn'}]})).status).toBe(400);
  expect(generateContent).not.toHaveBeenCalled();
});

it('normalizes only the width of one blank and rejects missing or multiple blanks without changing answers',()=>{
  const feedback={index:0,explanation:'Chọn danh từ.',english:'We have an opening.',vietnamese:'Chúng tôi có vị trí trống.',question:'There is an ____ in sales.',answer:'opening'};
  const result=parseAiReview({version:AI_CONTENT_VERSION,items:[{source,userAnswer:'  qa-wrong  ',correctAnswer:'opening',feedback}]});
  expect(result.items[0].feedback.question).toBe('There is an _____ in sales.');
  expect(result.items[0].userAnswer).toBe('  qa-wrong  ');
  for(const question of ['There is an opening in sales.','There is an ____ in _____.']){
    expect(()=>parseAiReview({version:AI_CONTENT_VERSION,items:[{source,userAnswer:'wrong',correctAnswer:'opening',feedback:{...feedback,question}}]})).toThrow();
  }
});

it('derives spelling evidence from the saved answer and keeps that answer out of model context',async()=>{
  generateContent.mockResolvedValue({text:JSON.stringify([{index:0,usageNote:'Invoice chỉ hóa đơn yêu cầu thanh toán.',english:'Please check the invoice.',vietnamese:'Hãy kiểm tra hóa đơn.',practice:{before:'Please check the',after:'before payment.'}}])});
  const result=await generateMistakeReview({mistakes:[{word:'invoice',meaning:'hoá đơn',userAnswer:'invioce',correctAnswer:'invoice',questionText:'Please check the _____.',questionType:'fill'}]});
  expect(result.status).toBe(200);
  expect(parseAiReview((result.body as {review:unknown}).review).items[0].feedback.explanation).toContain('vị trí 4 và 5');
  expect(generateContent.mock.calls[0][0].contents).not.toContain('invioce');
});
it('uses authored comparisons for covered words without asking the model to invent a rule',async()=>{
  generateContent.mockResolvedValue({text:JSON.stringify({...lesson,summary:'Hai từ không thể thay thế trong bất kỳ trường hợp nào.'})});
  const result=await explainWord({wordId:'rec-01',word:'opening',meaning:source.meaning,action:'compare',level:'B2',comparison:{wordId:'rec-02',word:'applicant',meaning:VOCABULARY[1].meaning}});
  expect(result.status).toBe(200);
  const data=parseAiExplanation((result.body as {explanation:unknown}).explanation);
  expect(data.quality?.mode).toBe('reviewed');expect(data.lesson.examples[0].english).toContain('opening');expect(generateContent).not.toHaveBeenCalled();
  expect(data.lesson.summary).not.toContain('bất kỳ trường hợp');
});
it('discards raw distractors before validating quick-check targets, while still rejecting a wrong answer',async()=>{
  const question={wordId:'rec-01',type:'fill',questionText:'There is an _____ in sales.',options:['opening','meeting','report','schedule'],answer:'opening',hint:'Vị trí đang tuyển.',translation:'Có vị trí trống trong phòng bán hàng.',explanation:'Từ đang ôn là opening.'};
  generateContent.mockResolvedValueOnce({text:JSON.stringify({...lesson,questions:[question]})});
  const result=await explainWord({wordId:'rec-01',word:'opening',meaning:source.meaning,action:'practice'});
  expect(result.status).toBe(200);expect(parseAiExplanation((result.body as {explanation:unknown}).explanation).lesson.questions[0].options).toEqual([]);
  generateContent.mockResolvedValueOnce({text:JSON.stringify({...lesson,questions:[{...question,answer:'report'}]})});
  expect((await explainWord({wordId:'rec-01',word:'opening',meaning:source.meaning,action:'practice'})).status).toBe(502);
});
it('serves ambiguous raw MCQ drafts as clearly cued target recall, without grading their distractors',async()=>{
  generateContent.mockResolvedValue({text:JSON.stringify([{wordId:'custom-agreement',type:'mcq',questionText:'Read the _____ before signing.',options:['agreement','report','letter','memo'],answer:'agreement',hint:'Văn bản thỏa thuận.',translation:'Đọc thỏa thuận trước khi ký.',explanation:'Từ đang ôn là agreement.'}])});
  const result=await generateQuiz({words:[{id:'custom-agreement',word:'agreement',meaning:'thỏa thuận'}]});
  expect(result.status).toBe(200);
  expect((result.body as {questions:unknown[]}).questions[0]).toMatchObject({type:'fill',options:[],answer:'agreement'});
});

it('serves bilingual authored examples only for the covered catalog, with honest provenance and no model charge',async()=>{
  const result=await explainWord({wordId:'rec-01',word:'opening',meaning:source.meaning,action:'examples'});
  expect(result.status).toBe(200);expect(result.body).toMatchObject({generated:false,source:'ENG_MASTER',model:null});
  const data=parseAiExplanation((result.body as {explanation:unknown}).explanation);
  expect(data.quality?.mode).toBe('reviewed');expect(data.lesson.examples).toHaveLength(3);
  expect(data.lesson.examples[0].vietnamese).toContain('vị trí còn trống');expect(generateContent).not.toHaveBeenCalled();
  generateContent.mockResolvedValue({text:JSON.stringify({...lesson,examples:[lesson.examples[0],{english:'The opening is tomorrow.',vietnamese:'Lễ khai trương diễn ra vào ngày mai.'},{english:'We attended the grand opening.',vietnamese:'Chúng tôi đã tham dự lễ khai trương.'}]})});
  const personal=await explainWord({wordId:'personal-opening-examples',word:'opening',meaning:'khai trương',action:'examples'});
  expect(personal.status).toBe(200);expect(personal.body).toMatchObject({generated:true,source:'AI'});expect(generateContent).toHaveBeenCalledOnce();
});

it('keeps authored examples distinct from source examples across every covered catalog entry',()=>{
  let covered=0;
  for(const word of VOCABULARY){
    const grounded=groundWord(word.id,word.word,word.meaning),content=reviewedLesson(grounded,'examples');
    if(!content)continue;
    expect(()=>parseAiLesson(content,grounded,'examples')).not.toThrow();covered++;
  }
  expect(covered).toBe(19);
});
it('anchors application to its selected catalog sense while naming the separate recruitment sense',()=>{
  const word=VOCABULARY.find(word=>word.id==='pdf-toeic-0066')!;
  const comparison=reviewedComparison(groundWord('rec-02','applicant',VOCABULARY[1].meaning),groundWord(word.id,word.word,word.meaning));
  expect(comparison?.summary).toContain('ứng dụng hoặc sự áp dụng');
  expect(comparison?.examples[1].english).toBe('The application of this rule requires care.');
});
