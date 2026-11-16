import { reportError } from "./telemetry";
import { getReminderHour } from "../lib/productPreferences";
import { useState } from "react";
import type { User } from "firebase/auth";
import type { UserProfile, UserProgress } from "../types";
import { getVocabulary, type Word } from "../domain/catalog";
import { getStartedWordCount, getRemainingNewWordCount } from "../lib/learning";
import { toast } from "react-hot-toast";
import { googleFetch as fetchGoogle, getApiErrorMessage, googleEventId } from "./googleWorkspace";
export function useGoogleWorkspace({ user, isGuest, profile, progress }: { user: User | null; isGuest: boolean; profile: UserProfile | null; progress: UserProgress }) {
 const [calendarOpen,setCalendarOpen]=useState(false);
 const [calendarId,setCalendarId]=useState("primary");
 const [calendarTime,setCalendarTime]=useState(()=>{const date=new Date();date.setHours(getReminderHour(),0,0,0);if(date.getTime()<Date.now())date.setDate(date.getDate()+1);return new Date(date.getTime()-date.getTimezoneOffset()*60_000).toISOString().slice(0,16);});
 const [syncingAction, setSyncingAction] = useState<"tasks" | "calendar" | "drive" | null>(null);
  const googleFetch = (url: string, init: RequestInit = {}) => {
    if (isGuest || !user) throw new Error("Đăng nhập Google để dùng tác vụ này.");
    return fetchGoogle(user, url, init);
  };

  const syncToGoogleCalendar = async (confirmed = false) => {
    if (isGuest) {
      toast.error('Cần đăng nhập Google để đồng bộ Lịch thi/Lịch học');
      return;
    }
    
    if (!confirmed) {setCalendarOpen(true);return;}
    const scheduled=new Date(calendarTime);
    if (!Number.isFinite(scheduled.getTime()) || scheduled.getTime()<=Date.now() || !calendarId.trim()) {toast.error("Chọn lịch và giờ trong tương lai.");return;}

    setSyncingAction('calendar');
    const toastId = toast.loading('Đang lên lịch trên Google Calendar...');

    try {
      const startTime = scheduled;
      const endTime = new Date(startTime.getTime() + 30 * 60000);

      const event = {
        id: await googleEventId(user!.uid, calendarId + ":" + calendarTime),
        summary: 'TOEIC Master - Ôn tập từ vựng',
        description: 'Đã đến giờ ôn tập các từ vựng khó trong TOEIC Master!',
        start: { dateTime: startTime.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        end: { dateTime: endTime.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        reminders: {
          useDefault: false,
          overrides: [ { method: 'popup', minutes: 10 } ]
        }
      };

      const eventUrl = 'https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(calendarId.trim()) + '/events';
      const res = await googleFetch(eventUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });

      if (res.status === 409) {const updated=await googleFetch(eventUrl+"/"+event.id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(event)});if(!updated.ok)throw new Error(await getApiErrorMessage(updated));} else if (!res.ok) throw new Error(await getApiErrorMessage(res));
      setCalendarOpen(false);
      
      toast.success('Đã lên lịch học trên Google Calendar!', { id: toastId });
    } catch (err: any) {
      reportError("useGoogleWorkspace.ts",err);
      toast.error('Lỗi khi đồng bộ Calendar', { id: toastId });
    } finally {
      setSyncingAction(null);
    }
  };

  const syncToGoogleTasks = async (wordToSync?: Word) => {
    if (isGuest) {
      toast.error('Cần đăng nhập Google để sử dụng tính năng này');
      return;
    }
    
    setSyncingAction('tasks');
    const toastId = toast.loading('Đang chuẩn bị danh sách Tasks...');

    try {
      // 1. Get or Create Task List
      const listsRes = await googleFetch('https://www.googleapis.com/tasks/v1/users/@me/lists');
      if (!listsRes.ok) throw new Error(await getApiErrorMessage(listsRes));
      const listsData = await listsRes.json();
      let listId = listsData.items?.find((l: any) => l.title === 'TOEIC Master - Words to Learn')?.id;

      if (!listId) {
        const newListRes = await googleFetch('https://www.googleapis.com/tasks/v1/users/@me/lists', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title: 'TOEIC Master - Words to Learn' })
        });
        if (!newListRes.ok) throw new Error(await getApiErrorMessage(newListRes));
        const newList = await newListRes.json();
        listId = newList.id;
      }

      const existingTitles=new Set<string>();const existingIds=new Set<string>();let pageToken='';let pages=0;
      do {const url='https://www.googleapis.com/tasks/v1/lists/'+listId+'/tasks?showCompleted=true&showHidden=true&maxResults=100'+(pageToken?'&pageToken='+encodeURIComponent(pageToken):'');const response=await googleFetch(url);if(!response.ok)throw new Error(await getApiErrorMessage(response));const body=await response.json();for(const task of body.items || []){existingTitles.add(task.title);const marker=task.notes?.match(/ENG_MASTER_WORD:([a-zA-Z0-9_-]+)/)?.[1];if(marker)existingIds.add(marker);}pageToken=body.nextPageToken || '';pages++;if(pageToken && pages>=20)throw new Error('Danh sách Tasks quá lớn; hãy chọn danh sách khác.');}while(pageToken);

      // 2. Add word(s)
      const words = wordToSync ? [wordToSync] : getVocabulary().filter(w => !progress[w.id]).slice(0, 5);
      
      if (!wordToSync) {
        toast.loading(`Đang đồng bộ ${words.length} từ mới...`, { id: toastId });
      }

      for (const w of words) {
        if (existingIds.has(w.id) || existingTitles.has(`Học từ: ${w.word}`)) continue;
        const taskRes = await googleFetch(`https://www.googleapis.com/tasks/v1/lists/${listId}/tasks`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: `Học từ: ${w.word}`,
            notes: `ENG_MASTER_WORD:${w.id}\n${w.pos} - ${w.meaning}\nVD: ${w.example}`,
            due: new Date(Date.now() + 86400000).toISOString() // Tomorrow
          })
        });
        if (!taskRes.ok) throw new Error(await getApiErrorMessage(taskRes));
      }

      toast.success('Đã đồng bộ sang Google Tasks!', { id: toastId });
    } catch (err: any) {
      reportError("useGoogleWorkspace.ts",err);
      toast.error('Lỗi khi đồng bộ Tasks', { id: toastId });
    } finally {
      setSyncingAction(null);
    }
  };

  const exportToGoogleDrive = async () => {
    if (isGuest) {
      toast.error('Cần đăng nhập Google để sử dụng tính năng này');
      return;
    }

    if (!window.confirm('Bạn có muốn xuất báo cáo tiến độ học tập sang Google Drive không?')) return;

    setSyncingAction('drive');
    const toastId = toast.loading('Đang khởi tạo tệp báo cáo...');

    try {
      const masteredWords = getVocabulary().filter(w => progress[w.id]?.repetitions >= 7);
      const report = {
        userName: profile?.displayName,
        exportDate: new Date().toLocaleDateString(),
        stats: {
          totalWords: getVocabulary().length,
          learned: getStartedWordCount(progress),
          remainingNew: getRemainingNewWordCount(progress),
          mastered: masteredWords.length
        },
        masteredList: masteredWords.map(w => ({ word: w.word, meaning: w.meaning }))
      };

      const reportDate=new Date().toISOString().slice(0,10);const marker=await googleEventId(user!.uid,reportDate);const existingResponse=await googleFetch('https://www.googleapis.com/drive/v3/files?q='+encodeURIComponent("trashed=false and appProperties has { key='engMasterReport' and value='"+marker+"' }")+'&fields=files(id)');if(!existingResponse.ok)throw new Error(await getApiErrorMessage(existingResponse));const existingId=(await existingResponse.json()).files?.[0]?.id;
      const boundary = 'eng_master_'+crypto.randomUUID();
      const metadata = {
        name: `TOEIC_Master_Report_${new Date().toISOString().split('T')[0]}.json`,
        appProperties: {engMasterReport:marker},
        mimeType: 'application/json'
      };

      const multipartBody = 
        `--${boundary}\r\n` +
        `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
        JSON.stringify(metadata) + `\r\n` +
        `--${boundary}\r\n` +
        `Content-Type: application/json\r\n\r\n` +
        JSON.stringify(report, null, 2) + `\r\n` +
        `--${boundary}--`;

      const res = await googleFetch('https://www.googleapis.com/upload/drive/v3/files'+(existingId?'/'+existingId:'')+'?uploadType=multipart', {
        method: existingId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: multipartBody
      });

      if (!res.ok) throw new Error(await getApiErrorMessage(res));
      
      toast.success('Đã lưu báo cáo vào Google Drive!', { id: toastId });
    } catch (err: any) {
      reportError("useGoogleWorkspace.ts",err);
      toast.error('Lỗi khi xuất Drive', { id: toastId });
    } finally {
      setSyncingAction(null);
    }
  };

 return { calendarOpen,setCalendarOpen,calendarId,setCalendarId,calendarTime,setCalendarTime, syncingAction, syncToGoogleCalendar, syncToGoogleTasks, exportToGoogleDrive };
}
