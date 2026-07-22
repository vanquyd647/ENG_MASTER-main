import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import {
  AlertCircle, Bell, BookOpen, Brain, Calendar, CalendarDays, CheckCircle2,
  CheckSquare, ChevronRight, ClipboardList, ExternalLink, FileDown, Flame,
  GraduationCap, History, Moon, RotateCcw, Settings, Sparkles, Sun, Target,
  Trash2, TrendingUp, Trophy, User as UserIcon, Volume2,
} from "lucide-react";
import { VOCABULARY, type Word } from "../data/vocabulary";
import { callAiApi } from "../lib/apiClient";
import { createBackup, normalizeBackup } from "../lib/backup";
import {
  getLearningStatus, getLearningStatusLabel, getRemainingNewWordCount,
  getReviewQueue, getSessionCorrectPercentage, getSessionStudiedCount,
  getStartedWordCount, REVIEW_SESSION_SIZE,
} from "../lib/learning";
import { calculateNextReview, initialSRS } from "../lib/srs";
import { cn } from "../lib/utils";
import {
  getReminderHour,
  getStudySessionSize,
  setReminderHour as persistReminderHour,
  setStudySessionSize as persistStudySessionSize,
} from "../lib/productPreferences";
import type {
  BackupV2, DailyActivity, ProgressItem, UserProfile, UserProgress,
} from "../types";
import { Button, Card } from "./ui";

type SyncAction = "tasks" | "calendar" | "drive";

let studyReminderTimer: number | null = null;
const scheduleStudyReminder = (hour = getReminderHour()) => {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  if (studyReminderTimer) window.clearTimeout(studyReminderTimer);
  const nextReminder = new Date();
  nextReminder.setHours(hour, 0, 0, 0);
  if (nextReminder.getTime() <= Date.now()) nextReminder.setDate(nextReminder.getDate() + 1);
  studyReminderTimer = window.setTimeout(() => {
    new Notification("ENG_MASTER", {
      body: "Đến giờ ôn lại kế hoạch từ vựng hôm nay.",
      icon: "/favicon.ico",
    });
    scheduleStudyReminder();
  }, nextReminder.getTime() - Date.now());
};
const clearStudyReminder = () => {
  if (studyReminderTimer) window.clearTimeout(studyReminderTimer);
  studyReminderTimer = null;
};

export function SettingsView({ 
  profile,
  progress,
  isGuest,
  onResetProgress,
  onCancel,
  onImportBackup,
  onUpdateProfile
}: { 
  profile: UserProfile | null;
  progress: UserProgress;
  isGuest: boolean;
  onResetProgress: () => void;
  onCancel: () => void;
  onImportBackup: (backup: BackupV2) => Promise<void>;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}) {
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

  useEffect(() => {
    if (notifications && 'Notification' in window && Notification.permission === 'granted') {
      scheduleStudyReminder(reminderHour);
    }
  }, [notifications, reminderHour]);

  const handleGenerateAvatar = async () => {
    if (isGuest) {
      toast.error('Chức năng tạo avatar AI chỉ dành cho tài khoản đăng nhập.');
      return;
    }
    setIsGeneratingAvatar(true);
    const toastId = toast.loading('Đang tạo avatar với AI...');
    try {
      const data = await callAiApi<{ image?: string }>('generate-avatar', {
        prompt: "A minimal, clean vector avatar for a professional profile, solid bright background, simple geometric shapes, very cute",
      });
      if (data.image) {
        onUpdateProfile({ photoURL: data.image });
        toast.success('Đã tạo avatar thành công!', { id: toastId });
      } else {
         throw new Error("No image");
      }
    } catch(err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Không thể tạo avatar, vui lòng thử lại sau.', { id: toastId });
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      toast.error('Tên không được để trống');
      return;
    }
    onUpdateProfile({ displayName: editName });
    setIsEditingProfile(false);
    toast.success('Đã cập nhật hồ sơ!');
  };

  const handleSaveGoal = () => {
    const nextGoal = Number(goalInput);
    if (!Number.isInteger(nextGoal) || nextGoal < 5 || nextGoal > 50) {
      toast.error('Mục tiêu mỗi ngày cần nằm trong khoảng 5-50 từ.');
      return;
    }
    onUpdateProfile({ dailyGoal: nextGoal });
    toast.success('Đã cập nhật mục tiêu học tập!');
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

  const exportBackup = () => {
    downloadFile(
      `toeic-master-backup-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(createBackup(profile, progress), null, 2),
      'application/json'
    );
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

  const importBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (!window.confirm('Nhập backup sẽ thay thế toàn bộ tiến độ hiện tại. Tiếp tục?')) {
        return;
      }
      const backup = normalizeBackup(JSON.parse(await file.text()));
      await onImportBackup(backup);
      toast.success('Đã nhập dữ liệu học tập!');
    } catch (err) {
      console.error(err);
      toast.error('File backup không hợp lệ.');
    } finally {
      event.target.value = '';
    }
  };

  const importCsv = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const lines = (await file.text()).split(/\r?\n/).filter(Boolean);
      const progressFromCsv: UserProgress = {};
      for (const line of lines.slice(1)) {
        const cells = line.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g)?.map((cell) =>
          cell.replace(/^,/, '').replace(/^"|"$/g, '').replace(/""/g, '"'),
        );
        if (!cells || cells.length < 5) continue;
        const [wordId, easiness, interval, repetitions, nextReviewDate, lastReviewDate, wrongCount] = cells;
        if (!VOCABULARY.some((word) => word.id === wordId)) continue;
        progressFromCsv[wordId] = {
          easiness: Number(easiness),
          interval: Number(interval),
          repetitions: Number(repetitions),
          nextReviewDate,
          lastReviewDate: lastReviewDate || undefined,
          wrongCount: Number(wrongCount || 0),
        };
      }
      await onImportBackup({
        version: 2,
        exportedAt: new Date().toISOString(),
        profile,
        progress: progressFromCsv,
      });
      toast.success(`Đã nhập ${Object.keys(progressFromCsv).length} từ từ CSV.`);
    } catch (error) {
      console.error(error);
      toast.error('File CSV không hợp lệ.');
    } finally {
      event.target.value = '';
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
        });
      } else {
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
        <Card className="bg-[#0c0c0e] border-zinc-800 p-0 overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg text-white mb-1">Tài khoản & Hồ sơ</h3>
              <p className="text-sm text-zinc-500">Thông tin cá nhân và chế độ hiện tại</p>
            </div>
            {!isGuest && (
              <Button 
                variant="outline" 
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
                disabled={isGeneratingAvatar || isGuest}
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
            <Button onClick={handleSaveGoal} className="py-3 px-6">
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
                  <p className="text-xs text-zinc-500">Nhắc nhở ôn tập từ vựng mỗi ngày</p>
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
              <input type="file" accept="application/json,.json" onChange={importBackup} className="sr-only" />
            </label>
            <label className="px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 cursor-pointer border border-zinc-700 text-slate-300 hover:bg-zinc-800 hover:text-white">
              Nhập CSV
              <input type="file" accept="text/csv,.csv" onChange={importCsv} className="sr-only" />
            </label>
          </div>
        </Card>

        <Card className="bg-rose-500/5 border-rose-500/20 p-0 overflow-hidden">
          <div className="p-6 border-b border-rose-500/20">
            <h3 className="font-bold text-lg text-rose-500 mb-1 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Khu vực nguy hiểm
            </h3>
            <p className="text-sm text-rose-500/70">Các hành động không thể khôi phục</p>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                 <h4 className="font-bold text-slate-300">Xóa tiến trình học tập</h4>
                 <p className="text-xs text-zinc-500 mt-1 max-w-sm">Hành động này sẽ thiết lập lại toàn bộ tiến độ, SRS, lịch sử và chuỗi ngày học của bạn.</p>
              </div>
              <Button onClick={onResetProgress} variant="outline" className="border-rose-500/50 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors shrink-0">
                Xóa tiến độ
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-center pt-8">
        <Button onClick={onCancel} variant="ghost" className="text-zinc-500 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors">
          Quay lại Dashboard
        </Button>
      </div>
    </motion.div>
  );
}
