import { normalizeAnswer } from './random.js';
import type { AiLesson, AiSource } from './aiContent.js';
import type { AiQuizQuestion } from './aiQuiz.js';

export const COMPARISON_SCOPE_NOTE = 'So sánh này chỉ áp dụng cho nghĩa và ví dụ đang học. Khả năng thay thế từ cần được xét trong từng câu cụ thể.';
const absoluteComparison = /bất (?:kỳ|kì) (?:trường hợp|ngữ cảnh)|mọi (?:trường hợp|ngữ cảnh)|không bao giờ (?:có thể )?thay thế|under (?:any|all) circumstances|never interchangeable/i;
export const hasUnsupportedComparison = (lesson:AiLesson) =>
  [lesson.summary,lesson.usage,lesson.caution].some(text=>absoluteComparison.test(text));

export function answerObservation(actual:string,expected:string):string {
  const entered=normalizeAnswer(actual),target=normalizeAnswer(expected);
  if(!entered)return 'Bạn chưa nhập câu trả lời. Đáp án của bài này: '+expected+'.';
  if(entered===target)return 'Câu trả lời đã khớp đáp án của bài này.';
  const left=Array.from(entered),right=Array.from(target);
  const differences=left.map((char,index)=>char!==right[index]?index:-1).filter(index=>index>=0);
  if(/^[a-z]+$/.test(entered) && /^[a-z]+$/.test(target) && left.length===right.length && differences.length===2) {
    const [a,b]=differences;
    if(b===a+1 && left[a]===right[b] && left[b]===right[a])
      return 'Hai ký tự ở vị trí '+(a+1)+' và '+(b+1)+' bị đảo thứ tự. Bạn nhập “'+actual+'”; đáp án là “'+expected+'”.';
  }
  return 'Bạn chọn “'+actual+'”; đáp án của bài này là “'+expected+'”. Đối chiếu nghĩa và ngữ cảnh bên dưới.';
}

// Generated distractors have not received an independent semantic review.
// Keep a target-recall exercise instead of grading a potentially valid alternative as wrong.
export const recallExplanation=(source:{word:string;meaning:string})=>'Đối chiếu từ nguồn: '+source.word+' — '+source.meaning+'. Bài này yêu cầu nhớ đúng từ đang học theo nghĩa đã cho.';
export const asTargetRecall=(question:AiQuizQuestion,source:{word:string;meaning:string}):AiQuizQuestion=>({...question,type:'fill',options:[],hint:'Nghĩa đang ôn: '+source.meaning,translation:/\bfull[- ]time\b/i.test(question.questionText)?question.translation.replace(/chính thức/g,'toàn thời gian'):question.translation,explanation:recallExplanation(source)});
export const lessonFromSource=(source:AiSource):AiLesson|null=>source.kind==='catalog'&&source.example&&source.exampleTranslation?{
 summary:source.word+' — '+source.meaning,
 usage:'Đọc ví dụ gốc dưới đây để đối chiếu nghĩa đang học. Phần diễn giải AI chưa đạt kiểm tra nên chưa được sử dụng.',
 caution:'Nội dung này dùng nghĩa và ví dụ có sẵn; chưa bổ sung quy tắc sử dụng mới.',collocations:[],examples:[{english:source.example,vietnamese:source.exampleTranslation}],questions:[],
}:null;

export function comparisonFromSources(source:AiSource,other:AiSource):AiLesson|null {
  if(source.kind!=='catalog'||other.kind!=='catalog'||!source.example||!other.example)return null;
  return {
    summary:'Đối chiếu '+source.word+' và '+other.word+' theo nghĩa và ví dụ gốc đang học.',
    usage:'Đối chiếu từng từ trong ví dụ gốc. Chưa dùng phần diễn giải AI chưa đạt kiểm tra để kết luận quy tắc sử dụng.',
    collocations:[],examples:[{english:source.example,vietnamese:source.exampleTranslation},{english:other.example,vietnamese:other.exampleTranslation}],
    caution:COMPARISON_SCOPE_NOTE,questions:[],
  };
}
