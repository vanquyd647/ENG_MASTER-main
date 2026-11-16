import { useState } from 'react';
import { Button, Card } from '../../components/ui';
import { auth } from '../../lib/firebase';
import { checkGoogleConnection, type ConnectionCheck, type WorkspaceService } from '../../services/googleConnectionCheck';
export default function WorkspaceCheck(){
 const [busy,setBusy]=useState<WorkspaceService|null>(null);const [reports,setReports]=useState<ConnectionCheck[]>([]);
 const check=async(service:WorkspaceService)=>{const user=auth.currentUser;if(!user||busy)return;setBusy(service);try{const report=await checkGoogleConnection(user,service);setReports(previous=>[...previous.filter(row=>row.service!==service),report]);}finally{setBusy(null);}};
 return <Card className="space-y-4"><h3 className="font-bold text-white">Kiểm tra kết nối Google</h3><p className="text-sm text-zinc-400">Mỗi nút yêu cầu quyền cho dịch vụ tương ứng, tạo một mục “ENG_MASTER kiểm tra kết nối”, đọc lại rồi xóa mục đó. Lịch thử dài 1 phút vào ngày mai và không có nhắc nhở; Tasks/Drive chỉ chứa nội dung kiểm thử. Không sửa nội dung đang có của bạn.</p><div className="flex flex-wrap gap-3">{(['calendar','tasks','drive'] as const).map(service=><Button key={service} disabled={!!busy} variant="outline" onClick={()=>void check(service)}>{busy===service?'Đang kiểm tra…':'Kiểm tra '+(service==='calendar'?'Calendar':service==='tasks'?'Tasks':'Drive')}</Button>)}</div><div aria-live="polite">{reports.map(row=><p key={row.service} className={'mt-2 break-words text-sm '+(row.readVerified&&row.cleanup?'text-emerald-300':'text-amber-300')}>{row.service}: {row.readVerified?'Tạo và đọc lại thành công':'Chưa xác minh kết nối'} · {row.cleanup?'Đã dọn mục kiểm thử':'Cần kiểm tra lại việc dọn mục thử'}{row.error?' · '+row.error:''}</p>)}</div></Card>;
}
