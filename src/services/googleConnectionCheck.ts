import type { User } from 'firebase/auth';
import { googleFetch, getApiErrorMessage } from './googleWorkspace';
export type WorkspaceService='calendar'|'tasks'|'drive';
export interface ConnectionCheck {service:WorkspaceService;checkedAt:string;readVerified:boolean;cleanup:boolean;error?:string;}
// Called only by the explicit connection-check button. Create/read/delete our
// own uniquely named item; never inspect or alter existing personal content.
export const checkGoogleConnection=async(user:User,service:WorkspaceService):Promise<ConnectionCheck>=>{
  const report:ConnectionCheck={service,checkedAt:new Date().toISOString(),readVerified:false,cleanup:false};let createdUrl:string|null=null;let creationRequested=false;let uncertainCreation=false;
  const title='ENG_MASTER kiểm tra kết nối '+crypto.randomUUID();
  const request=async(url:string,init:RequestInit={})=>{const response=await googleFetch(user,url,init);if(!response.ok)throw Object.assign(Error(await getApiErrorMessage(response)),{httpStatus:response.status});return response;};
  const json=(method:string,body:unknown):RequestInit=>({method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  try{
    if(service==='calendar'){
      const start=new Date(Date.now()+86400000),end=new Date(start.getTime()+60000);
      const url='https://www.googleapis.com/calendar/v3/calendars/primary/events';creationRequested=true;const result=await(await request(url,json('POST',{summary:title,description:'Mục kiểm tra kết nối tạm thời; ứng dụng sẽ xóa sau khi đọc lại.',start:{dateTime:start.toISOString()},end:{dateTime:end.toISOString()},reminders:{useDefault:false}}))).json();
      if(typeof result.id!=='string')throw Error('Google không trả ID lịch kiểm thử.');createdUrl=url+'/'+encodeURIComponent(result.id);
      const observed=await(await request(createdUrl)).json();if(observed.summary!==title)throw Error('Chưa đọc lại được lịch kiểm thử.');
    }else if(service==='tasks'){
      const url='https://tasks.googleapis.com/tasks/v1/lists/@default/tasks';creationRequested=true;const result=await(await request(url,json('POST',{title,notes:'Mục kiểm tra kết nối tạm thời; ứng dụng sẽ xóa sau khi đọc lại.'}))).json();
      if(typeof result.id!=='string')throw Error('Google không trả ID task kiểm thử.');createdUrl=url+'/'+encodeURIComponent(result.id);
      const observed=await(await request(createdUrl)).json();if(observed.title!==title)throw Error('Chưa đọc lại được task kiểm thử.');
    }else{
      const boundary='eng_master_'+crypto.randomUUID().replaceAll('-','');const metadata={name:title+'.json',mimeType:'application/json',appProperties:{engMasterPurpose:'connection-check'}};
      const content=JSON.stringify({app:'ENG_MASTER',purpose:'connection-check'});
      const body=`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${content}\r\n--${boundary}--`;
      creationRequested=true;const result=await(await request('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',{method:'POST',headers:{'Content-Type':'multipart/related; boundary='+boundary},body})).json();
      if(typeof result.id!=='string')throw Error('Google không trả ID file kiểm thử.');createdUrl='https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(result.id);
      const observed=await(await request(createdUrl+'?alt=media')).json();if(observed.app!=='ENG_MASTER'||observed.purpose!=='connection-check')throw Error('Chưa đọc lại được file kiểm thử.');
    }
    report.readVerified=true;
  }catch(error){report.error=(error as Error).message;const details=error as Error & {httpStatus?:number;code?:string};uncertainCreation=creationRequested&&!createdUrl&&!details.code?.startsWith("auth/")&&!(details.httpStatus&&details.httpStatus>=400&&details.httpStatus<500);if(uncertainCreation)report.error+=" Có thể Google đã nhận yêu cầu; kiểm tra mục có tên "+title+" trong dịch vụ và xóa nếu còn.";}
  finally{if(createdUrl){try{await request(createdUrl,{method:'DELETE'});report.cleanup=true;}catch(error){report.error=(report.error?report.error+' ':'')+'Chưa xóa được mục kiểm thử: '+(error as Error).message;}}else report.cleanup=!uncertainCreation;}
  return report;
};
