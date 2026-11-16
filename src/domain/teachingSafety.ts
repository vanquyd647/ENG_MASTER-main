import type {AiLesson,AiSource} from './aiContent.js';
const vietnameseMarks=/[ăâđêôơưáàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i;
export const assertVietnameseTeaching=(values:readonly string[])=>{
 for(const value of values){
  const asciiProse=/(?:^|\s)(?:la (?:danh|dong|trang|tinh) tu|trong moi truong|thuong dung|can phan biet|hay hoan tra)(?:\s|$)/i.test(value);
  const noAccents=value.split(/\s+/).length>=4&&!vietnameseMarks.test(value)&&/\b(la|trong|cua|mot|nghia|dung|voi|cho|khong|duoc|nhan|phai)\b/i.test(value);
  if(asciiProse||noAccents)throw Error('invalid_vietnamese_teaching');
  if(/chúc phúc lợi|trạng thái từ/i.test(value))throw Error('unsafe_teaching_claim');
 }
};
export const assertLessonTeaching=(lesson:AiLesson,source:AiSource)=>{
 assertVietnameseTeaching([lesson.summary,lesson.usage,lesson.caution,...lesson.collocations.map(c=>c.meaning),...lesson.examples.map(e=>e.vietnamese),...lesson.questions.flatMap(q=>[q.hint,q.translation,q.explanation])]);
 const text=[lesson.summary,lesson.usage,lesson.caution,...lesson.questions.map(q=>q.explanation)].join(' ').toLowerCase();
 const positive=text.replace(/không (?:phải )?(?:là )?(?:một )?trợ động từ please/g,'');
 if(/reimburse[^.]{0,45}cấu trúc reimbursement/.test(text))throw Error('unsafe_grammar_claim');
 if(lesson.examples.some(e=>/submit[^.]{0,30}receipts?[^.]{0,15}to reimburse/i.test(e.english)))throw Error('unsafe_grammar_claim');
 if(/(?:trợ động từ ["'“]?please|please là (?:một )?trợ động từ)/.test(positive))throw Error('unsafe_grammar_claim');
 if(source.word==='highly'&&/không[^.]{0,35}(?:động từ thường|động từ thông thường)/.test(text))throw Error('unsafe_grammar_claim');
 if(source.word==='reliable'&&/không dùng[^.]{0,45}thông tin/.test(text))throw Error('unsafe_grammar_claim');
 if(source.word==='headquarters'&&/(?:tùy[^.]{0,20}quy định công ty|hình (?:thức|thái)[^.]{0,25}là số ít)/.test(text))throw Error('unsafe_grammar_claim');
 if(source.word==='procrastinate'&&lesson.collocations.some(c=>c.phrase==='stop to procrastinate'&&/ngừng|hết chần chừ/.test(c.meaning)))throw Error('unsafe_grammar_claim');
 if(source.word==='procrastinate'&&lesson.collocations.some(c=>/\b(?:avoid|finish|enjoy|consider)\s+procrastinate\b/i.test(c.phrase)))throw Error('unsafe_grammar_claim');
};
