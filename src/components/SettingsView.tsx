import WorkspaceCheck from '../features/auth/WorkspaceCheck';
import { removeUnusedDatasets } from '../repositories/datasetRetention';
import { getCompleteCloudEvents } from '../repositories/cloudHistory';
import { getCachedEvents } from '../repositories/localRepository';
import { reportError } from "../services/telemetry";
import { readOwnerItem, writeOwnerItem } from "../repositories/ownerStorage";
import { scheduleStudyReminder, clearStudyReminder } from "../services/reminders";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { toast } from "react-hot-toast";

import { Bell, Moon, Settings, Sparkles, Trash2, User as UserIcon, Volume2 } from "lucide-react";

import { useCatalog } from "../domain/useCatalog";
import { callAiApi } from "../lib/apiClient";
import { createBackup, mergeBackup, MAX_BACKUP_BYTES, parseBackupText, parseProgressCsv } from "../lib/backup";
import { getCloudActivities, loadGuestSession } from "../lib/persistence";
import { loadLocalState, getLocalArchives, type LocalArchive } from "../repositories/localRepository";
import { downloadLocalArchive } from '../lib/localArchives';
import { getActiveOwner } from "../repositories/ownerStorage";

import { cn } from "../lib/utils";
import { getReminderHour, getStudySessionSize, setReminderHour as persistReminderHour, setStudySessionSize as persistStudySessionSize } from "../lib/productPreferences";
import type { StudyBackup, UserProfile, UserProgress } from "../types";
import { Button, Card, Modal } from "./ui";

export function SettingsView({ 
  profile,
  progress,
  isGuest,
  onResetProgress,
  onCancel,
  onImportBackup,
  onUpdateProfile,
  onRollbackDataset,
}: { 
  profile: UserProfile | null;
  progress: UserProgress;
  isGuest: boolean;
  onResetProgress: () => void;
  onCancel: () => void;
  onImportBackup: (backup: StudyBackup) => Promise<void>;
  onUpdateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  onRollbackDataset?: () => Promise<void>;
}) {
  useCatalog();
  const [aiLevel,setAiLevel]=useState(readOwnerItem("ai_level") || "A2");
  const [cleaningDatasets,setCleaningDatasets]=useState(false);
  const [archives,setArchives]=useState<LocalArchive[]>([]);
  useEffect(()=>{let active=true;void getLocalArchives(getActiveOwner()).then(value=>{if(active)setArchives(value);}).catch(error=>reportError('local-archives',error));return()=>{active=false;};},[profile?.uid]);
  const [speechRate,setSpeechRate]=useState(Number(readOwnerItem("speech_rate")) || 0.9);
  const [speechVoice,setSpeechVoice]=useState(readOwnerItem("speech_voice") || "");
  const [voices,setVoices]=useState<SpeechSynthesisVoice[]>([]);
  useEffect(()=>{if (!("speechSynthesis" in window)) return;const changed=()=>setVoices(speechSynthesis.getVoices().filter(voice=>voice.lang.startsWith("en")));changed();speechSynthesis.addEventListener("voiceschanged",changed);return()=>speechSynthesis.removeEventListener("voiceschanged",changed);},[]);
  const [notifications, setNotifications] = useState(
    localStorage.getItem('app_notifications') === 'true'
  );
  const [sound, setSound] = useState(
    localStorage.getItem('app_sound') !== 'false'
  );
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(profile?.displayName || '');
  const [goalInput, setGoalInput] = useState(String(profile?.dailyGoal || 15));
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [sessionSize, setSessionSize] = useState(getStudySessionSize);
  const [reminderHour, setReminderHour] = useState(getReminderHour);
  const [pendingImport, setPendingImport] = useState<{ backup: StudyBackup; filename: string } | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const updateLock = useRef(false);
  const importLock = useRef(false);
  useEffect(() => setGoalInput(String(profile?.dailyGoal || 15)), [profile?.dailyGoal]);

  useEffect(() => {
    if (notifications && 'Notification' in window && Notification.permission === 'granted') {
      scheduleStudyReminder(reminderHour);
    } else clearStudyReminder();
  }, [notifications, reminderHour]);

  const handleGenerateAvatar = async () => {
    if (updateLock.current) return;
    if (isGuest) {
      toast.error('Chức năng tạo avatar AI chỉ dành cho tài khoản đăng nhập.');
      return;
    }
    updateLock.current = true;
    setIsUpdating(true);
    setIsGeneratingAvatar(true);
    const toastId = toast.loading('Đang tạo avatar với AI...');
    try {
      const data = await callAiApi<{ image?: string }>('generate-avatar', {
        prompt: "A minimal, clean vector avatar for a professional profile, solid bright background, simple geometric shapes, very cute",
      });
      if (data.image) {
        await onUpdateProfile({ photoURL: data.image });
        toast.success('Đã tạo avatar thành công!', { id: toastId });
      } else {
         throw new Error("No image");
      }
    } catch(err) {
      reportError("SettingsView",err);
      toast.error(err instanceof Error ? err.message : 'Không thể tạo avatar, vui lòng thử lại sau.', { id: toastId });
    } finally {
      setIsGeneratingAvatar(false);
      updateLock.current = false;
      setIsUpdating(false);
    }
  };

  const handleSaveProfile = async () => {
    if (updateLock.current) return;
    if (!editName.trim() || editName.trim().length > 120) {
      toast.error('Tên cần có 1–120 ký tự');
      return;
    }
    updateLock.current = true;
    setIsUpdating(true);
    try {
      await onUpdateProfile({ displayName: editName.trim() });
      setIsEditingProfile(false);
      toast.success('Đã cập nhật hồ sơ!');
    } catch { toast.error('Chưa lưu được hồ sơ. Hãy thử lại.'); }
    finally { updateLock.current = false; setIsUpdating(false); }
  };

  const handleSaveGoal = async () => {
    if (updateLock.current) return;
    const nextGoal = Number(goalInput);
    if (!Number.isInteger(nextGoal) || nextGoal < 5 || nextGoal > 50) {
      toast.error('Mục tiêu mỗi ngày cần nằm trong khoảng 5-50 từ.');
      return;
    }
    updateLock.current = true;
    setIsUpdating(true);
    try {
      await onUpdateProfile({ dailyGoal: nextGoal });
      toast.success('Đã cập nhật mục tiêu học tập!');
    } catch { toast.error('Chưa lưu được mục tiêu. Hãy thử lại.'); }
    finally { updateLock.current = false; setIsUpdating(false); }
  };

  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getActivities = async () => {
    if ("indexedDB" in globalThis) { const local = await loadLocalState(getActiveOwner()); if (local) return local.activities; }
    return isGuest ? loadGuestSession().activities : profile ? getCloudActivities(profile.uid) : {};
  };

  const exportBackup = async () => {
    try {
      const activities=await getActivities();
      const backup=createBackup(profile,progress,activities);
      if(!isGuest&&profile){const all=await getCompleteCloudEvents(profile.uid,profile.datasetGeneration || "legacy");backup.events=[...new Map([...all,...getCachedEvents()].map(row=>[row.id,row])).values()];}
      const content = JSON.stringify(backup, null, 2);
      if (new Blob([content]).size > MAX_BACKUP_BYTES) throw new Error('Backup vượt quá giới hạn 20 MB.');
      downloadFile(
      `toeic-master-backup-${new Date().toISOString().slice(0, 10)}.json`,
      content,
      'application/json'
    ); } catch (error) { toast.error(`Chưa xuất được backup: ${(error as Error).message}`); }
  };

  const exportCsv = () => {
    const rows = [
      ['wordId', 'easiness', 'interval', 'repetitions', 'nextReviewDate', 'lastReviewDate', 'wrongCount'],
      ...Object.entries(progress).map(([wordId, item]) => [
        wordId,
        String(item.easiness),
        String(item.interval),
        String(item.repetitions),
        item.nextReviewDate,
        item.lastReviewDate || '',
        String(item.wrongCount || 0),
      ]),
    ];
    downloadFile(
      `toeic-master-progress-${new Date().toISOString().slice(0, 10)}.csv`,
      rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n'),
      'text/csv'
    );
  };

  const prepareImport = async (event: React.ChangeEvent<HTMLInputElement>, format: 'json' | 'csv') => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    try {
      if (file.size > MAX_BACKUP_BYTES) throw new Error('File vượt quá giới hạn 20 MB.');
      const text = await file.text();
      const backup = format === 'json' ? parseBackupText(text) : parseProgressCsv(text);
      if (!Object.keys(backup.progress).length && !(backup.version !== 2 && (backup.customWords.length || backup.practiceRecords?.length || backup.extendedPracticeRecords?.length || backup.roadmap || backup.favorites.length || backup.decks?.length || backup.events?.length))) throw new Error('File không có dữ liệu học tập để nhập.');
      setImportMode('merge');
      setImportError(null);
      setPendingImport({ backup, filename: file.name });
    } catch (err) {
      toast.error(`File không hợp lệ: ${(err as Error).message}`);
    } finally {
      input.value = '';
    }
  };

  const confirmImport = async () => {
    if (!pendingImport || importLock.current) return;
    importLock.current = true;
    setIsImporting(true);
    setImportError(null);
    try {
      const backup = importMode === 'merge'
        ? mergeBackup(createBackup(profile, progress, await getActivities()), pendingImport.backup)
        : pendingImport.backup;
      await onImportBackup(backup);
      setSessionSize(getStudySessionSize());
      setReminderHour(getReminderHour());
      setSound(localStorage.getItem('app_sound') !== 'false');
      setNotifications(localStorage.getItem('app_notifications') === 'true');
      setPendingImport(null);
      toast.success('Đã nhập dữ liệu học tập!');
    } catch (error) {
      reportError("SettingsView",error);
      setImportError(`Chưa nhập được dữ liệu: ${(error as Error).message}`);
    } finally {
      importLock.current = false;
      setIsImporting(false);
    }
  };

  const toggleNotifications = () => {
    const newVal = !notifications;
    setNotifications(newVal);
    localStorage.setItem('app_notifications', String(newVal));
    if (newVal) {
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            toast.success('Đã bật thông báo trình duyệt');
            scheduleStudyReminder();
          } else {
            setNotifications(false);
            localStorage.setItem('app_notifications', 'false');
            toast.error('Bạn cần cho phép quyền thông báo trong trình duyệt.');
          }
        }).catch(()=>{setNotifications(false);localStorage.setItem("app_notifications","false");toast.error("Chưa cấp được quyền thông báo.");});
      } else {
        setNotifications(false);localStorage.setItem("app_notifications","false");
        toast.error('Trình duyệt không hỗ trợ thông báo.');
      }
    } else {
      clearStudyReminder();
      toast.success('Đã tắt thông báo');
    }
  };

  const toggleSound = () => {
    const newVal = !sound;
    setSound(newVal);
    localStorage.setItem('app_sound', String(newVal));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto space-y-8 mt-10 w-full"
    >
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Cài Đặt Hệ Thống</h2>
          <p className="text-zinc-500 font-medium">Tùy chỉnh trải nghiệm học tập của bạn</p>
        </div>
      </div>

      <div className="space-y-6">
        {!isGuest&&profile&&<WorkspaceCheck />}
        {!isGuest&&profile&&<Card className="space-y-3"><h3 className="font-bold text-white">Dọn các lần khôi phục cũ</h3><p className="text-sm text-zinc-400">Giữ dữ liệu đang dùng và bản ngay trước đó để rollback. Các bản xa hơn và lần nhập bỏ dở sẽ được xóa. Tải backup nếu cần lưu lâu hơn.</p><Button disabled={cleaningDatasets||isImporting||isUpdating} variant="outline" onClick={()=>{if(!window.confirm('Xóa các phiên bản Cloud cũ, giữ bản hiện tại và bản trước đó? Thao tác này không khôi phục được.'))return;setCleaningDatasets(true);void removeUnusedDatasets(profile.uid).then(count=>toast.success(`Đã dọn ${count} phiên bản cũ.`)).catch(error=>toast.error(error.message)).finally(()=>setCleaningDatasets(false));}}>{cleaningDatasets?'Đang dọn…':'Dọn phiên bản Cloud cũ'}</Button></Card>}
        {archives.length>0 && <Card className="bg-[#0c0c0e] border-zinc-800 space-y-3"><h3 className="font-bold text-white">Bản sao trước khôi phục</h3><p className="text-sm text-zinc-400">Dữ liệu và thao tác chưa gửi của thiết bị được giữ riêng khi Cloud thay đổi. Tải bản sao để xem hoặc nhập lại có chọn lọc.</p>{archives.map(archive=><div key={archive.owner} className="flex flex-wrap items-center justify-between gap-3"><span className="text-sm text-zinc-400">{new Date(archive.archivedAt).toLocaleString('vi-VN')} · {Object.keys(archive.progress).length} từ</span><Button variant="outline" onClick={()=>void downloadLocalArchive(archive).catch(error=>toast.error(error.message))}>Tải bản sao</Button></div>)}</Card>}
        <Card className="bg-[#0c0c0e] border-zinc-800 p-0 overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg text-white mb-1">Tài khoản & Hồ sơ</h3>
              <p className="text-sm text-zinc-500">Thông tin cá nhân và chế độ hiện tại</p>
            </div>
            {!isGuest && (
              <Button 
                variant="outline" 
                disabled={isUpdating || isImporting}
                onClick={() => {
                  if (isEditingProfile) handleSaveProfile();
                  else setIsEditingProfile(true);
                }}
                className="text-xs uppercase font-black tracking-widest border-zinc-700 bg-zinc-800 hover:bg-zinc-700 hover:text-white"
              >
                {isEditingProfile ? 'Lưu hồ sơ' : 'Chỉnh sửa'}
              </Button>
            )}
          </div>
          <div className="p-6 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center gap-4 shrink-0">
              <div className="w-24 h-24 rounded-3xl bg-zinc-800 border-2 border-zinc-700 overflow-hidden relative shadow-xl">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                    <UserIcon className="w-10 h-10" />
                  </div>
                )}
                {isGeneratingAvatar && (
                   <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                     <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                   </div>
                )}
              </div>
              <Button 
                onClick={handleGenerateAvatar} 
                disabled={isUpdating || isGuest || isImporting}
                variant="ghost" 
                className="text-[10px] uppercase font-black tracking-widest text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
              >
                <Sparkles className="w-3 h-3 mr-1.5 inline-block" /> Tạo bằng AI
              </Button>
            </div>
            <div className="space-y-4 flex-grow w-full">
              <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
                <div className="w-full mr-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Tên hiển thị</label>
                  {isEditingProfile ? (
                     <input 
                       aria-label="Tên hiển thị"
                       type="text" 
                       value={editName}
                       onChange={e => setEditName(e.target.value)}
                       className="bg-[#0c0c0e] border border-zinc-700 rounded-xl px-3 py-2 text-white font-bold w-full focus:outline-none focus:border-indigo-500 transition-colors"
                     />
                  ) : (
                    <div className="font-bold text-white text-lg">{profile?.displayName || 'Khách'}</div>
                  )}
                </div>
                <span className={cn(
                  "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border shrink-0",
                  isGuest 
                    ? "bg-zinc-800 text-zinc-400 border-zinc-700" 
                    : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                )}>
                  {isGuest ? 'Offline' : 'Cloud Sync'}
                </span>
              </div>
              {!isGuest && profile?.email && (
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Email liên kết</label>
                  <div className="font-bold text-slate-300">{profile.email}</div>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="bg-[#0c0c0e] border-zinc-800 p-0 overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h3 className="font-bold text-lg text-white mb-1">Mục tiêu học tập</h3>
            <p className="text-sm text-zinc-500">Đặt mục tiêu và số lượng thẻ trong mỗi phiên học.</p>
          </div>
          <div className="p-6 flex flex-col sm:flex-row gap-4 sm:items-end">
            <label className="flex-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-2">Từ mỗi ngày</span>
              <input
                type="number"
                min={5}
                max={50}
                value={goalInput}
                onChange={(event) => setGoalInput(event.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white font-bold w-full focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </label>
            <Button onClick={handleSaveGoal} disabled={isUpdating || isImporting} className="py-3 px-6">
              Lưu mục tiêu
            </Button>
          </div>
          <div className="px-6 pb-6">
            <label>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-2">Số thẻ mỗi phiên</span>
              <select
                value={sessionSize}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setSessionSize(value);
                  persistStudySessionSize(value);
                }}
                className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white font-bold w-full"
              >
                {[5, 10, 15, 20].map((value) => <option key={value} value={value}>{value} thẻ</option>)}
              </select>
            </label>
          </div>
        </Card>

        <Card className="bg-[#0c0c0e] border-zinc-800 p-0 overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h3 className="font-bold text-lg text-white mb-1">Thiết lập chung</h3>
            <p className="text-sm text-zinc-500">Cấu hình ứng dụng</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-300">Giao diện Tối</h4>
                  <p className="text-xs text-zinc-500">Chỉ hỗ trợ giao diện tối (Dark mode)</p>
                </div>
              </div>
              <button 
                type="button"
                disabled
                role="switch"
                aria-checked="true"
                aria-label="Giao diện tối, hiện không thể thay đổi"
                title="Phiên bản hiện tại chỉ hỗ trợ giao diện tối"
                className="w-12 h-6 bg-indigo-500/50 rounded-full relative cursor-not-allowed opacity-50"
              >
                <div className="absolute top-1 left-1 w-4 h-4 bg-white/50 rounded-full translate-x-6"></div>
              </button>
            </div>
            <label className="block border-t border-zinc-800 pt-5">
              <span className="text-sm font-bold text-slate-300 block mb-2">Giờ nhắc học</span>
              <select
                value={reminderHour}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setReminderHour(value);
                  persistReminderHour(value);
                  if (notifications) scheduleStudyReminder(value);
                }}
                className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white font-bold w-full"
              >
                {Array.from({ length: 24 }, (_, hour) => <option key={hour} value={hour}>{String(hour).padStart(2, '0')}:00</option>)}
              </select>
            </label>

            <label className="block text-sm">Trình độ cho giải thích AI <select aria-label="Trình độ AI" value={aiLevel} onChange={event=>{setAiLevel(event.target.value);writeOwnerItem("ai_level",event.target.value);}} className="ml-2 bg-zinc-900 border border-zinc-700 rounded-xl p-2">{["A1","A2","B1","B2"].map(level=><option key={level} value={level}>{level}</option>)}</select></label>
            <label className="block text-sm">Tốc độ phát âm <select aria-label="Tốc độ phát âm" value={speechRate} onChange={event=>{const rate=Number(event.target.value);setSpeechRate(rate);writeOwnerItem("speech_rate",String(rate));}} className="ml-2 bg-zinc-900 border border-zinc-700 rounded-xl p-2">{[0.5,0.75,0.9,1,1.25,1.5].map(rate=><option key={rate} value={rate}>{rate}×</option>)}</select></label>
            <p className="text-sm text-indigo-200">Giọng từ vựng: Michael · Anh Mỹ. Cùng một audio cho 1.575 từ trong thẻ học, Thư viện và quiz trên mọi thiết bị. Hội thoại dùng giọng cố định theo nhân vật.</p>
            <label className="block text-sm">Giọng dự phòng cho từ cá nhân <select aria-label="Giọng tiếng Anh" value={speechVoice} onChange={event=>{setSpeechVoice(event.target.value);writeOwnerItem("speech_voice",event.target.value);}} className="block w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-xl p-2"><option value="">Tự chọn giọng tiếng Anh ổn định</option>{voices.map(voice=><option key={voice.voiceURI} value={voice.name}>{voice.name} ({voice.lang})</option>)}</select></label>
            <p className="text-xs text-zinc-400">Từ cá nhân chưa có audio đóng gói dùng giọng thiết bị đã chọn, có thể khác giữa điện thoại và máy tính. Audio đóng gói dùng offline sau khi tải gói học. Quyền thông báo theo thiết bị; mục tiêu và tiến độ theo tài khoản.</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-300">Âm thanh phát âm</h4>
                  <p className="text-xs text-zinc-500">Tự động phát âm thanh khi lật thẻ từ vựng</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={toggleSound}
                role="switch"
                aria-checked={sound}
                aria-label="Bật hoặc tắt âm thanh phát âm"
                className={cn(
                  "w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900",
                  sound ? "bg-indigo-500" : "bg-zinc-700"
                )}
              >
                <div className={cn(
                  "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300",
                  sound ? "translate-x-6" : "translate-x-0"
                )}></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-300">Thông báo nhắc nhở</h4>
                  <p className="text-xs text-zinc-500">Nhắc khi trang đang mở và có quyền thông báo; chưa hỗ trợ nhắc khi đóng ứng dụng.</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={toggleNotifications}
                role="switch"
                aria-checked={notifications}
                aria-label="Bật hoặc tắt thông báo nhắc nhở"
                className={cn(
                  "w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900",
                  notifications ? "bg-indigo-500" : "bg-zinc-700"
                )}
              >
                <div className={cn(
                  "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300",
                  notifications ? "translate-x-6" : "translate-x-0"
                )}></div>
              </button>
            </div>
          </div>
        </Card>

        <Card className="bg-[#0c0c0e] border-zinc-800 p-0 overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h3 className="font-bold text-lg text-white mb-1">Sao lưu dữ liệu</h3>
            {!isGuest && onRollbackDataset && <Button variant="outline" disabled={isImporting || isUpdating} onClick={()=>void onRollbackDataset().catch(error=>toast.error(error.message))}>Phục hồi bản Cloud trước</Button>}
            <p className="text-sm text-zinc-500">Xuất hoặc nhập lại tiến độ học tập ngoài Firebase.</p>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button onClick={exportBackup} variant="outline" className="py-3">
              Xuất JSON
            </Button>
            <Button onClick={exportCsv} variant="outline" className="py-3">
              Xuất CSV
            </Button>
            <label className="px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 cursor-pointer border border-zinc-700 text-slate-300 hover:bg-zinc-800 hover:text-white">
              Nhập JSON
              <input type="file" accept="application/json,.json" onChange={(event) => void prepareImport(event, 'json')} disabled={isImporting} className="sr-only" />
            </label>
            <label className="px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 cursor-pointer border border-zinc-700 text-slate-300 hover:bg-zinc-800 hover:text-white">
              Nhập CSV
              <input type="file" accept="text/csv,.csv" onChange={(event) => void prepareImport(event, 'csv')} disabled={isImporting} className="sr-only" />
            </label>
          </div>
        </Card>

        <Card className="bg-rose-500/5 border-rose-500/20 p-0 overflow-hidden">
          <div className="p-6 border-b border-rose-500/20">
            <h3 className="font-bold text-lg text-rose-500 mb-1 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Khu vực nguy hiểm
            </h3>
            <p className="text-sm text-rose-500/70">Thiết lập lại tiến độ từ vựng</p>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                 <h4 className="font-bold text-slate-300">Xóa tiến trình học tập</h4>
                 <p className="text-xs text-zinc-500 mt-1 max-w-sm">Hành động này sẽ thiết lập lại tiến độ từ vựng, SRS, lịch sử học từ và chuỗi ngày học của bạn.</p>
              </div>
              <Button onClick={onResetProgress} disabled={isImporting || isUpdating} variant="outline" className="border-rose-500/50 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors shrink-0">
                Xóa tiến độ
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-center pt-8">
        <Button onClick={onCancel} disabled={isImporting || isUpdating} variant="ghost" className="text-zinc-500 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors">
          Quay lại tổng quan
        </Button>
      </div>
      <Modal isOpen={Boolean(pendingImport)} onClose={() => { if (!importLock.current) setPendingImport(null); }} title="Kiểm tra dữ liệu trước khi nhập">
        {pendingImport && <div className="space-y-4">
          <p className="break-words">{pendingImport.filename}</p>
          <p><strong>{Object.keys(pendingImport.backup.progress).length} từ có tiến độ</strong>; {pendingImport.backup.version !== 2 ? pendingImport.backup.customWords.length : 0} từ cá nhân trong file.</p>
          {pendingImport.backup.version!==2&&<p>{(pendingImport.backup.practiceRecords?.length||0)+(pendingImport.backup.extendedPracticeRecords?.length||0)} kết quả bài luyện trong file, gồm ngữ pháp và bài đọc nếu có.</p>}
          <label className="block"><input type="radio" name="import-mode" checked={importMode === 'merge'} disabled={isImporting} onChange={() => setImportMode('merge')} /> Gộp với dữ liệu hiện tại; tiến độ trùng ID dùng giá trị trong file.</label>
          <label className="block"><input type="radio" name="import-mode" checked={importMode === 'replace'} disabled={isImporting} onChange={() => setImportMode('replace')} /> Thay thế tiến độ hiện tại{pendingImport.backup.version !== 2 ? ', từ cá nhân, yêu thích và cài đặt bằng dữ liệu trong file' : '; giữ từ cá nhân, cài đặt và hoạt động ngày hiện có'}.</label>
          {importError && <p role="alert" className="text-rose-400">{importError}</p>}
          <Button onClick={confirmImport} disabled={isImporting || isUpdating} className="w-full">{isImporting ? 'Đang nhập dữ liệu...' : 'Xác nhận nhập dữ liệu'}</Button>
          <Button onClick={() => setPendingImport(null)} disabled={isImporting} variant="outline" className="w-full">Hủy</Button>
        </div>}
      </Modal>
    </motion.div>
  );
}
