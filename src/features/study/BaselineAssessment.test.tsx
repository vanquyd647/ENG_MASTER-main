import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {BaselineAssessment} from './BaselineAssessment';
afterEach(cleanup);
it('shows the assessed scope and blocks a listening start if no English voice is available',()=>{
 render(<BaselineAssessment records={[]} onStart={vi.fn()} onPractice={vi.fn()} canListen={false}/>);
 expect(screen.getByRole('button',{name:'Bắt đầu khảo sát nền tảng'})).toBeDisabled();
 expect(screen.getByText(/chưa đánh giá Part 1\/3\/4/)).toBeVisible();
 expect(screen.getByRole('link',{name:'Mở tài liệu chuẩn bị của ETS'})).toHaveAttribute('href','https://www.ets.org/toeic/test-takers/prepare.html');
});
it('starts the fixed first section in a separate round instead of grading the whole user profile',()=>{
 const onStart=vi.fn();render(<BaselineAssessment records={[]} onStart={onStart} onPractice={vi.fn()} canListen/>);
 fireEvent.click(screen.getByRole('button',{name:'Bắt đầu khảo sát nền tảng'}));
 expect(onStart).toHaveBeenCalledWith('part2',['p2-v1-1','p2-v1-2','p2-v1-3','p2-v1-4','p2-v1-5'],expect.stringMatching(/^[a-f0-9]{32}$/));
});
