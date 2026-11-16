import AiExplanation from '../features/study/AiExplanation';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it} from 'vitest';
import {AiLessonResponse,AiSourceCard} from './AiStructuredResponse';
import {AI_CONTENT_VERSION,type AiExplanationData} from '../domain/aiContent';
const data:AiExplanationData={version:AI_CONTENT_VERSION,action:'practice',source:{kind:'catalog',wordId:'rec-01',word:'opening',meaning:'vị trí trống',pos:'noun',topic:'Recruitment',example:'There is an opening in sales.',exampleTranslation:'Có một vị trí trống trong phòng bán hàng.'},lesson:{
 summary:'Không hiện phần này trước khi làm bài.',usage:'Chỉ hiện sau khi làm bài.',collocations:[{phrase:'job opening',meaning:'vị trí tuyển dụng'}],
 examples:[{english:'We have an opening.',vietnamese:'Chúng tôi có vị trí trống.'}],caution:'Giữ đúng nghĩa.',
 questions:[{wordId:'rec-01',type:'fill',questionText:'There is an _____ in sales.',options:[],answer:'opening',hint:'Một vị trí đang tuyển.',translation:'Có vị trí trống trong phòng bán hàng.',explanation:'Opening chỉ vị trí tuyển dụng còn trống.'}]}};
afterEach(cleanup);
it('hides the answer, explanation, translation and other lesson fields until submission, then grades locally',()=>{
  render(<AiLessonResponse data={data}/>);
  expect(screen.queryByText('Opening chỉ vị trí tuyển dụng còn trống.')).not.toBeInTheDocument();
  expect(screen.queryByText(data.lesson.summary)).not.toBeInTheDocument();
  expect(screen.queryByText(data.lesson.questions[0].translation)).not.toBeInTheDocument();
  expect(screen.getByRole('button',{name:'Chấm câu này'})).toBeDisabled();
  fireEvent.change(screen.getByLabelText('Điền từ tiếng Anh'),{target:{value:'  OPENING  '}});
  fireEvent.click(screen.getByRole('button',{name:'Chấm câu này'}));
  expect(screen.getByRole('status')).toHaveTextContent('Chính xác!');
  expect(screen.getByRole('status')).toHaveTextContent(data.lesson.questions[0].explanation);
  expect(screen.getByLabelText('Điền từ tiếng Anh')).toBeDisabled();
});
it('shows a wrong-answer explanation and supports MCQ selection without recording study progress',()=>{
  render(<AiLessonResponse data={{...data,lesson:{...data.lesson,questions:[{...data.lesson.questions[0],type:'mcq',options:['opening','invoice','meeting','salary']}]}}}/>);
  fireEvent.click(screen.getByLabelText('invoice'));fireEvent.click(screen.getByRole('button',{name:'Chấm câu này'}));
  expect(screen.getByRole('status')).toHaveTextContent('Chưa đúng. Đáp án: opening');
  expect(screen.getByText('Bài kiểm tra nhanh này không thay đổi tiến độ học.')).toBeVisible();
});
it('renders supplied content as text and visibly separates personal sources from approved data',()=>{
  render(<AiSourceCard source={{...data.source,kind:'user',word:'<script>alert(1)</script>'}}/>);
  expect(screen.getByText('Từ thư viện cá nhân · chưa rà soát')).toBeVisible();
  expect(screen.getByText('<script>alert(1)</script>')).toBeVisible();expect(document.querySelector('script')).toBeNull();
});

it('labels authored knowledge separately from generated examples and fully authored comparisons',()=>{
  const {unmount}=render(<AiExplanation content="Lời giải." isLoading={false} meaning={data.source.meaning} explanation={{...data,action:'explain',quality:{mode:'anchored'},lesson:{...data.lesson,questions:[]}}}/>);
  expect(screen.getByText('Ghi chú ENG_MASTER · Ví dụ AI bổ sung')).toBeVisible();
  unmount();
  render(<AiExplanation content="So sánh." isLoading={false} meaning={data.source.meaning} explanation={{...data,action:'compare',quality:{mode:'reviewed'},comparison:{...data.source,word:'vacancy'},lesson:{...data.lesson,questions:[]}}}/>);
  expect(screen.getByText('Ghi chú và ví dụ ENG_MASTER')).toBeVisible();
  expect(screen.queryByText('AI bổ sung · Giải thích và luyện tập')).not.toBeInTheDocument();
});
