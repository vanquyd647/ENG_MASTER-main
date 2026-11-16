import { beforeEach, expect, it, vi } from 'vitest';
import type { User } from 'firebase/auth';
const fetchGoogle=vi.hoisted(()=>vi.fn());
vi.mock('./googleWorkspace',()=>({googleFetch:fetchGoogle,getApiErrorMessage:async(response:Response)=>'HTTP '+response.status}));
import { checkGoogleConnection } from './googleConnectionCheck';
const user={uid:'qa-user'} as User;
beforeEach(()=>fetchGoogle.mockReset());
it('creates, reads and deletes only its own task ID',async()=>{
 let title='';fetchGoogle.mockImplementation(async(_user:User,_url:string,init:RequestInit={})=>{if(init.method==='POST'){title=JSON.parse(String(init.body)).title;return Response.json({id:'qa-task'});}if(init.method==='DELETE')return new Response(null,{status:204});return Response.json({title});});
 expect(await checkGoogleConnection(user,'tasks')).toMatchObject({readVerified:true,cleanup:true});
 expect(fetchGoogle.mock.calls.map(call=>call[1])).toEqual(['https://tasks.googleapis.com/tasks/v1/lists/@default/tasks','https://tasks.googleapis.com/tasks/v1/lists/@default/tasks/qa-task','https://tasks.googleapis.com/tasks/v1/lists/@default/tasks/qa-task']);expect(title).toMatch(/^ENG_MASTER kiểm tra kết nối/);
});
it('still cleans the created calendar item when read verification fails and leaves existing events alone',async()=>{
 fetchGoogle.mockResolvedValueOnce(Response.json({id:'only-created-id'})).mockResolvedValueOnce(Response.json({summary:'mismatch'})).mockResolvedValueOnce(new Response(null,{status:204}));
 const result=await checkGoogleConnection(user,'calendar');expect(result).toMatchObject({readVerified:false,cleanup:true});expect(result.error).toMatch(/đọc lại/);
 expect(fetchGoogle.mock.calls[2][1]).toBe('https://www.googleapis.com/calendar/v3/calendars/primary/events/only-created-id');expect(fetchGoogle.mock.calls[2][2]).toEqual({method:'DELETE'});
 const body=JSON.parse(fetchGoogle.mock.calls[0][2].body);expect(body.reminders).toEqual({useDefault:false});expect(Date.parse(body.end.dateTime)-Date.parse(body.start.dateTime)).toBe(60000);
});
it('verifies uploaded Drive content and reports a failed cleanup honestly',async()=>{
 fetchGoogle.mockResolvedValueOnce(Response.json({id:'qa-file'})).mockResolvedValueOnce(Response.json({app:'ENG_MASTER',purpose:'connection-check'})).mockResolvedValueOnce(Response.json({error:'denied'},{status:403}));
 expect(await checkGoogleConnection(user,'drive')).toMatchObject({readVerified:true,cleanup:false,error:expect.stringContaining('Chưa xóa')});
 expect(fetchGoogle.mock.calls[0][2].body).toContain('"purpose":"connection-check"');expect(fetchGoogle.mock.calls[1][1]).toBe('https://www.googleapis.com/drive/v3/files/qa-file?alt=media');
});
it('does not claim cleanup when a create response is lost before the server ID is known',async()=>{
 fetchGoogle.mockRejectedValueOnce(new Error('Network interrupted'));
 expect(await checkGoogleConnection(user,'tasks')).toMatchObject({readVerified:false,cleanup:false,error:expect.stringContaining('Có thể Google đã nhận')});
 expect(fetchGoogle).toHaveBeenCalledTimes(1);
});
