import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {ExamAudio} from './ExamAudio';
beforeEach(()=>{
 vi.useFakeTimers({toFake:['Date']});vi.setSystemTime(new Date('2026-10-16T08:02:00Z'));
 vi.spyOn(HTMLMediaElement.prototype,'play').mockImplementation(function(this:HTMLMediaElement){this.dispatchEvent(new Event('play'));return Promise.resolve();});
 vi.spyOn(HTMLMediaElement.prototype,'pause').mockImplementation(function(this:HTMLMediaElement){this.dispatchEvent(new Event('pause'));});
});
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.useRealTimers();});
it('resumes at elapsed wall time, corrects drift and never resets the deadline when sound is re-enabled',async()=>{
 render(<ExamAudio startedAt={Date.parse('2026-10-16T08:00:00Z')}/>);
 const audio=document.querySelector('audio')!;expect(audio.currentTime).toBe(120);
 fireEvent.click(screen.getByRole('button',{name:'Tạm tắt âm thanh'}));
 vi.setSystemTime(new Date('2026-10-16T08:03:00Z'));fireEvent.click(screen.getByRole('button',{name:'Bật âm thanh'}));
 expect(audio.currentTime).toBe(180);expect(document.querySelector('input[type=range]')).toBeNull();
 Object.defineProperty(audio,'paused',{configurable:true,value:false});audio.currentTime=0;fireEvent.timeUpdate(audio);expect(audio.currentTime).toBe(180);
 await waitFor(()=>expect(screen.getByRole('status')).toHaveTextContent('Đang phát'));
});
it('provides an explicit retry when autoplay is blocked without moving the session start',async()=>{
 vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(new Error('autoplay'));
 render(<ExamAudio startedAt={Date.parse('2026-10-16T08:00:00Z')}/>);
 await screen.findByRole('alert');vi.setSystemTime(new Date('2026-10-16T08:04:00Z'));
 fireEvent.click(screen.getByRole('button',{name:'Bật âm thanh'}));
 await waitFor(()=>expect(screen.queryByRole('alert')).not.toBeInTheDocument());expect(document.querySelector('audio')!.currentTime).toBe(240);
});
