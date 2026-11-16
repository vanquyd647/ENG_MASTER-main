import {expect,it} from 'vitest';
import {assertLessonTeaching,assertVietnameseTeaching,teachingConstraints} from './teachingConstraints';
import type {AiLesson,AiSource} from '../domain/aiContent';
const source=(word:string):AiSource=>({kind:'user',wordId:'test',word,meaning:'nghĩa đang học',pos:'',topic:'',example:'',exampleTranslation:''});
const lesson:AiLesson={summary:'Bài học giải thích từ đang học.',usage:'Dùng đúng nghĩa trong câu ví dụ.',caution:'Chỉ xét ngữ cảnh đang học.',collocations:[{phrase:'example phrase',meaning:'cụm từ ví dụ'}],examples:[{english:'Please check the example.',vietnamese:'Hãy kiểm tra ví dụ.'}],questions:[]};
it('blocks clearly transliterated Vietnamese including partially accented boilerplate, while allowing short loan words',()=>{
 expect(()=>assertVietnameseTeaching(['Highly la trang tu dung truoc tinh tu.'])).toThrow();
 expect(()=>assertVietnameseTeaching(['professional la tinh tu trong môi trường công sở.'])).toThrow();
 expect(()=>assertVietnameseTeaching(['Email','Hãy kiểm tra thông tin đáng tin cậy.'])).not.toThrow();
});
it('rejects observed wrong grammar claims without rejecting their legitimate counterparts',()=>{
 expect(()=>assertLessonTeaching({...lesson,usage:'Highly không dùng cho động từ thường.'},source('highly'))).toThrow();
 expect(()=>assertLessonTeaching({...lesson,usage:'Highly đi với tính từ và một số động từ như highly recommend.'},source('highly'))).not.toThrow();
 expect(()=>assertLessonTeaching({...lesson,usage:'Reliable không dùng cho thông tin.'},source('reliable'))).toThrow();
 expect(()=>assertLessonTeaching({...lesson,usage:'Cần động từ sau trợ động từ please.'},source('monitor'))).toThrow();
 expect(()=>assertLessonTeaching({...lesson,usage:'Trợ động từ please cần được phân biệt rõ là từ thể hiện sự lịch sự.'},source('occasionally'))).toThrow();
 expect(()=>assertLessonTeaching({...lesson,usage:'Please là từ thể hiện lịch sự, không phải trợ động từ.'},source('monitor'))).not.toThrow();
 expect(()=>assertVietnameseTeaching(['chúc phúc lợi cho nhân viên'])).toThrow();
 expect(()=>assertVietnameseTeaching(['apparently là trạng thái từ đứng đầu câu'])).toThrow();
 expect(()=>assertLessonTeaching({...lesson,collocations:[{phrase:'stop to procrastinate',meaning:'ngừng chần chừ'}]},source('procrastinate'))).toThrow();
 expect(()=>assertLessonTeaching({...lesson,collocations:[{phrase:'avoid procrastinate',meaning:'tránh chần chừ'}]},source('procrastinate'))).toThrow();
 expect(()=>assertLessonTeaching({...lesson,collocations:[{phrase:'avoid procrastinating',meaning:'tránh chần chừ'}]},source('procrastinate'))).not.toThrow();
 expect(()=>assertLessonTeaching({...lesson,examples:[{english:'You need to submit receipts to reimburse medical expenses.',vietnamese:'Cần nộp biên lai để hoàn trả chi phí.'}]},source('reimburse'))).toThrow();
 expect(()=>assertLessonTeaching({...lesson,usage:'Reimburse thường dùng với cấu trúc reimbursement.'},source('occasionally'))).toThrow();
 expect(teachingConstraints(source('headquarters')).join(' ')).toContain('số ít và số nhiều');
});
