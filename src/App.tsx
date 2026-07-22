/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  reauthenticateWithPopup,
  onAuthStateChanged, 
  User, 
  signOut
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { VOCABULARY, Word } from './data/vocabulary';
import { initialSRS, calculateNextReview } from './lib/srs';
import { callAiApi } from './lib/apiClient';
import { createBackup, normalizeBackup } from './lib/backup';
import {
  getLearningStatus,
  getLearningStatusLabel,
  getLocalDateKey,
  getRemainingNewWordCount,
  getReviewQueue,
  getSessionCorrectPercentage,
  getSessionStudiedCount,
  getStartedWordCount,
  normalizeProfileWordCount,
  REVIEW_SESSION_SIZE,
} from './lib/learning';
import {
  activateGuestSession,
  clearGuestProgress,
  deactivateGuestSession,
  getCloudDailyActivity,
  loadGuestSession,
  recordCloudSession,
  recordGuestSession,
  replaceCloudProgress,
  resetCloudProgress,
  saveCloudProgressItem,
  saveGuestProfile,
  saveGuestProgress,
  toStoredProgress,
} from './lib/persistence';
import type {
  AppSessionType,
  BackupV2,
  DailyActivity,
  ProgressItem,
  StudySessionLog,
  UserProfile,
  UserProgress,
} from './types';
import { 
  BookOpen, 
  GraduationCap, 
  LayoutDashboard, 
  LogOut, 
  CheckCircle2, 
  Volume2,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Trophy,
  History,
  FileDown,
  ClipboardList,
  ExternalLink,
  CheckSquare,
  AlertCircle,
  Flame,
  CalendarDays,
  Target,
  Brain,
  Settings,
  Trash2,
  Moon,
  Sun,
  Bell,
  Calendar,
  User as UserIcon,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';
import { completeOnboarding, hydrateCustomVocabulary, isOnboardingComplete } from './lib/productPreferences';
import { Button, Modal } from "./components/ui";

const StatsView = lazy(() =>
  import('./components/StatsView').then((module) => ({ default: module.StatsView }))
);
const Dashboard = lazy(() =>
  import("./components/Dashboard").then((module) => ({ default: module.Dashboard }))
);
const Browse = lazy(() =>
  import("./components/Browse").then((module) => ({ default: module.Browse }))
);
const QuizSession = lazy(() =>
  import("./components/QuizSession").then((module) => ({ default: module.QuizSession }))
);
const ReviewSession = lazy(() =>
  import("./components/ReviewSession").then((module) => ({ default: module.ReviewSession }))
);
const PracticeSession = lazy(() =>
  import("./components/PracticeSession").then((module) => ({ default: module.PracticeSession }))
);
const SettingsView = lazy(() =>
  import("./components/SettingsView").then((module) => ({ default: module.SettingsView }))
);

type SyncAction = 'tasks' | 'calendar' | 'drive';

hydrateCustomVocabulary();

// --- Main App ---

const createGoogleProvider = () => {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/tasks');
  provider.addScope('https://www.googleapis.com/auth/drive.file');
  provider.addScope('https://www.googleapis.com/auth/calendar.events');
  provider.setCustomParameters({ prompt: 'select_account' });
  return provider;
};

const getApiErrorMessage = async (res: Response) => {
  try {
    const data = await res.json();
    return data?.error || data?.message || `${res.status} ${res.statusText}`;
  } catch {
    return `${res.status} ${res.statusText}`;
  }
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const profileRef = useRef<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress>({});
  const progressRef = useRef<UserProgress>({});
  const [todayActivity, setTodayActivity] = useState<DailyActivity | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'review' | 'browse' | 'quiz' | 'practice' | 'settings' | 'stats'>('dashboard');
  const [studyMode, setStudyMode] = useState<'new' | 'review'>('new');
  const [loading, setLoading] = useState(true);
  const [explainingWord, setExplainingWord] = useState<{ word: string; meaning: string; content: string } | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [syncingAction, setSyncingAction] = useState<SyncAction | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(() => !isOnboardingComplete());
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [currentView]);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // --- Auth & Data Fetching ---
  useEffect(() => {
    // Check for existing guest session
    const guestSession = loadGuestSession();
    if (guestSession.active && guestSession.profile) {
      const normalizedProfile = normalizeProfileWordCount(
        guestSession.profile,
        guestSession.progress,
      );
      setIsGuest(true);
      setProfile(normalizedProfile);
      setProgress(guestSession.progress);
      progressRef.current = guestSession.progress;
      setTodayActivity(guestSession.activities[getLocalDateKey()] || null);
      saveGuestProfile(normalizedProfile);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        setIsGuest(false);
        await fetchUserData(user.uid);
      } else if (!isGuest) {
        setProfile(null);
        setProgress({});
        progressRef.current = {};
        setTodayActivity(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isGuest]);

  const fetchUserData = async (uid: string) => {
    try {
      const profileRef = doc(db, 'users', uid);
      const profileDoc = await getDoc(profileRef);
      let profileData: UserProfile;
      
      if (profileDoc.exists()) {
        profileData = profileDoc.data() as UserProfile;
      } else {
        const newProfile: UserProfile = {
          uid,
          email: auth.currentUser?.email || '',
          displayName: auth.currentUser?.displayName || 'User',
          totalWordsLearned: 0,
          studyTimeMinutes: 0,
          streak: 0,
          dailyGoal: 15,
        };
        await setDoc(profileRef, newProfile);
        profileData = newProfile;
      }

      const progressSnap = await getDocs(collection(db, `users/${uid}/progress`));
      const progressData: UserProgress = {};
      progressSnap.forEach((d) => {
        progressData[d.id] = d.data() as any;
      });

      const normalizedProfile = normalizeProfileWordCount(profileData, progressData);
      if (normalizedProfile.totalWordsLearned !== profileData.totalWordsLearned) {
        await updateDoc(profileRef, { totalWordsLearned: normalizedProfile.totalWordsLearned });
      }

      setProfile(normalizedProfile);
      setProgress(progressData);
      progressRef.current = progressData;
      setTodayActivity(await getCloudDailyActivity(uid));
    } catch (err: any) {
      console.error('Error fetching data:', err);
      if (err.message?.includes('offline') || err.code === 'unavailable') {
        toast.error('Không thể kết nối đến Cloud. Đang chuyển sang chế độ Offline...');
        handleGuestLogin();
      } else {
        toast.error('Lỗi đồng bộ dữ liệu: ' + err.message);
      }
    }
  };

  const login = async () => {
    try {
      await signInWithPopup(auth, createGoogleProvider());
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/configuration-not-found') {
        toast.error('Firebase Auth chưa được cấu hình. Thử chế độ Khách.');
      } else if (err.code === 'auth/unauthorized-domain') {
        toast.error('Domain chưa được ủy quyền trong Firebase. Vui lòng sử dụng chế độ Khách hoặc kiểm tra lại Whitelist.');
      } else {
        toast.error('Đăng nhập thất bại: ' + err.message);
      }
    }
  };

  const handleGuestLogin = () => {
    const existing = loadGuestSession();
    activateGuestSession();
    const guestId =
      existing.profile?.uid ||
      'guest_' + Math.random().toString(36).slice(2, 11);
    const guestProfile: UserProfile = {
      ...existing.profile,
      uid: guestId,
      email: 'guest@local',
      displayName: existing.profile?.displayName || 'Khách (Guest)',
      totalWordsLearned: 0,
      studyTimeMinutes: existing.profile?.studyTimeMinutes || 0,
      streak: existing.profile?.streak || 0,
      dailyGoal: existing.profile?.dailyGoal || 15,
    };
    setIsGuest(true);

    const normalizedProfile = normalizeProfileWordCount(
      guestProfile,
      existing.progress,
    );
    setProfile(normalizedProfile);
    saveGuestProfile(normalizedProfile);
    setProgress(existing.progress);
    progressRef.current = existing.progress;
    setTodayActivity(existing.activities[getLocalDateKey()] || null);
    toast.success('Đã vào chế độ Khách (Offline)');
  };

  const logout = () => {
    if (isGuest) {
      deactivateGuestSession();
      setIsGuest(false);
      setProfile(null);
      setProgress({});
      progressRef.current = {};
      setTodayActivity(null);
    } else {
      signOut(auth);
    }
  };

  // --- Google Workspace Services ---
  const getGoogleAccessToken = async () => {
    if (isGuest || !user) {
      toast.error('Cần đăng nhập Google để sử dụng tính năng này.');
      return null;
    }

    const result = await reauthenticateWithPopup(user, createGoogleProvider());
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken || null;

    if (!accessToken) {
      toast.error('Không thể lấy quyền Google Workspace. Vui lòng thử lại.');
    }

    return accessToken;
  };

  const googleFetch = async (url: string, init: RequestInit = {}, retry = true): Promise<Response> => {
    const token = await getGoogleAccessToken();
    if (!token) throw new Error('Missing Google access token');

    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${token}`);
    const res = await fetch(url, { ...init, headers });

    if ((res.status === 401 || res.status === 403) && retry) {
      return googleFetch(url, init, false);
    }

    return res;
  };

  const syncToGoogleCalendar = async () => {
    if (isGuest) {
      toast.error('Cần đăng nhập Google để đồng bộ Lịch thi/Lịch học');
      return;
    }
    
    if (!window.confirm("Thêm lịch ôn tập vào Google Calendar của bạn?")) return;

    setSyncingAction('calendar');
    const toastId = toast.loading('Đang lên lịch trên Google Calendar...');

    try {
      // Add a session 1 hour from now for 30 minutes
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 1);
      const endTime = new Date(startTime.getTime() + 30 * 60000);

      const event = {
        summary: 'TOEIC Master - Ôn tập từ vựng',
        description: 'Đã đến giờ ôn tập các từ vựng khó trong TOEIC Master!',
        start: { dateTime: startTime.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        end: { dateTime: endTime.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        reminders: {
          useDefault: false,
          overrides: [ { method: 'popup', minutes: 10 } ]
        }
      };

      const res = await googleFetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });

      if (!res.ok) throw new Error(await getApiErrorMessage(res));
      
      toast.success('Đã lên lịch học trên Google Calendar!', { id: toastId });
    } catch (err: any) {
      console.error(err);
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

      // 2. Add word(s)
      const words = wordToSync ? [wordToSync] : VOCABULARY.filter(w => !progress[w.id]).slice(0, 5);
      
      if (!wordToSync) {
        toast.loading(`Đang đồng bộ ${words.length} từ mới...`, { id: toastId });
      }

      for (const w of words) {
        const taskRes = await googleFetch(`https://www.googleapis.com/tasks/v1/lists/${listId}/tasks`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: `Học từ: ${w.word}`,
            notes: `${w.pos} - ${w.meaning}\nVD: ${w.example}`,
            due: new Date(Date.now() + 86400000).toISOString() // Tomorrow
          })
        });
        if (!taskRes.ok) throw new Error(await getApiErrorMessage(taskRes));
      }

      toast.success('Đã đồng bộ sang Google Tasks!', { id: toastId });
    } catch (err: any) {
      console.error(err);
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
      const masteredWords = VOCABULARY.filter(w => progress[w.id]?.repetitions >= 7);
      const report = {
        userName: profile?.displayName,
        exportDate: new Date().toLocaleDateString(),
        stats: {
          totalWords: VOCABULARY.length,
          learned: getStartedWordCount(progress),
          remainingNew: getRemainingNewWordCount(progress),
          mastered: masteredWords.length
        },
        masteredList: masteredWords.map(w => ({ word: w.word, meaning: w.meaning }))
      };

      const boundary = 'foo_bar_baz';
      const metadata = {
        name: `TOEIC_Master_Report_${new Date().toISOString().split('T')[0]}.json`,
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

      const res = await googleFetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: multipartBody
      });

      if (!res.ok) throw new Error(await getApiErrorMessage(res));
      
      toast.success('Đã lưu báo cáo vào Google Drive!', { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error('Lỗi khi xuất Drive', { id: toastId });
    } finally {
      setSyncingAction(null);
    }
  };

  const persistProgressItem = async (
    wordId: string,
    item: ProgressItem,
  ) => {
    const updatedProgress = {
      ...progressRef.current,
      [wordId]: item,
    };
    progressRef.current = updatedProgress;
    setProgress(updatedProgress);

    const currentProfile = profileRef.current;
    if (!currentProfile) return updatedProgress;
    const updatedProfile = normalizeProfileWordCount(
      currentProfile,
      updatedProgress,
    );
    profileRef.current = updatedProfile;
    setProfile(updatedProfile);

    if (isGuest) {
      saveGuestProgress(updatedProgress);
      saveGuestProfile(updatedProfile);
    } else {
      await saveCloudProgressItem(
        currentProfile.uid,
        wordId,
        item,
        updatedProfile.totalWordsLearned,
      );
    }
    return updatedProgress;
  };

  const resetWordProgress = async (wordId: string) => {
    const nextProgress = { ...progressRef.current };
    delete nextProgress[wordId];
    progressRef.current = nextProgress;
    setProgress(nextProgress);
    const currentProfile = profileRef.current;
    if (currentProfile) {
      const nextProfile = normalizeProfileWordCount(currentProfile, nextProgress);
      profileRef.current = nextProfile;
      setProfile(nextProfile);
      if (isGuest) {
        saveGuestProgress(nextProgress);
        saveGuestProfile(nextProfile);
      } else {
        await Promise.all([
          deleteDoc(doc(db, `users/${currentProfile.uid}/progress`, wordId)),
          updateDoc(doc(db, 'users', currentProfile.uid), { totalWordsLearned: nextProfile.totalWordsLearned }),
        ]);
      }
    }
    toast.success('Đã đặt lại tiến độ của từ.');
  };

  const delayWordReview = async (wordId: string) => {
    const item = progressRef.current[wordId];
    if (!item) return;
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);
    await persistProgressItem(wordId, { ...item, nextReviewDate: nextDate.toISOString() });
    toast.success('Đã hoãn từ sang ngày mai.');
  };

  const logSessionHistory = async ({
    type,
    score,
    details,
    wordIds,
    correctCount,
    totalQuestions,
  }: {
    type: AppSessionType;
    score?: string;
    details: string;
    wordIds: string[];
    correctCount?: number;
    totalQuestions?: number;
  }) => {
    const currentProfile = profileRef.current;
    if (!currentProfile) return;
    const newLog: StudySessionLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type,
      score,
      details,
      wordIds: [...new Set(wordIds)],
      studiedCount: new Set(wordIds).size,
      correctCount,
      totalQuestions,
    };

    try {
      const result = isGuest
        ? recordGuestSession({
            profile: currentProfile,
            log: newLog,
            wordIds,
          })
        : await recordCloudSession({
            profile: currentProfile,
            log: newLog,
            wordIds,
          });
      profileRef.current = result.profile;
      setProfile(result.profile);
      if (result.activity.dateKey === getLocalDateKey()) {
        setTodayActivity(result.activity);
      }
    } catch (err) {
      console.error('Failed to log history', err);
      toast.error('Không thể lưu hoạt động học tập.');
    }
  };

  const handleLearnMore = async (word: string, meaning: string) => {
    setIsExplaining(true);
    setExplainingWord({ word, meaning, content: '' });
    try {
      const data = await callAiApi<{ text: string }>('explain', {
        word,
        meaning,
      });
      setExplainingWord({ word, meaning, content: data.text });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Không thể lấy thông tin chi tiết');
      setExplainingWord(null);
    } finally {
      setIsExplaining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 font-sans">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-black border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user && !isGuest) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-slate-200 p-4 sm:p-6 font-sans overflow-hidden relative">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8 sm:space-y-12 relative z-10"
        >
          <div className="space-y-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-indigo-600 rounded-[28px] sm:rounded-[32px] mx-auto flex items-center justify-center shadow-2xl shadow-indigo-500/40">
              <GraduationCap className="text-white w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-white">TOEIC Master</h1>
              <p className="text-zinc-500 text-base sm:text-lg font-medium">Học từ vựng thông minh với SRS v2.0</p>
            </div>
          </div>
          <div className="space-y-4">
            <Button onClick={login} className="w-full py-3.5 sm:py-4 text-base sm:text-lg rounded-2xl">
              Đăng nhập với Google
            </Button>
            <Button onClick={handleGuestLogin} variant="outline" className="w-full py-3.5 sm:py-4 text-base sm:text-lg rounded-2xl border-zinc-800 text-zinc-400 hover:text-white">
              Tiếp tục với tư cách Khách
            </Button>
          </div>
          <div className="pt-8 sm:pt-10 border-t border-zinc-800/50 grid grid-cols-3 gap-2 sm:gap-4 text-[9px] sm:text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            <div className="space-y-2">
              <div className="text-slate-300 text-lg sm:text-xl font-bold tracking-tight">1000+</div>
              <div>Từ vựng</div>
            </div>
            <div className="space-y-2 border-x border-zinc-800/50">
              <div className="text-slate-300 text-lg sm:text-xl font-bold tracking-tight">SM-2</div>
              <div>Thuật toán</div>
            </div>
            <div className="space-y-2">
              <div className="text-slate-300 text-lg sm:text-xl font-bold tracking-tight">27+</div>
              <div>Chủ đề</div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] font-sans text-slate-200 overflow-x-hidden">
      <Toaster 
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#f8fafc',
            border: '1px solid #27272a',
            borderRadius: '16px'
          }
        }}
        position="top-center" 
      />
      
      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0c0c0e]/90 backdrop-blur-2xl border-t border-zinc-800 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] z-50 md:top-0 md:bottom-auto md:bg-transparent md:border-b-0 md:backdrop-blur-none md:px-6 md:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-between">
          <div className="hidden md:flex items-center gap-3 md:bg-zinc-900 md:px-5 md:py-2.5 md:rounded-2xl md:border md:border-zinc-800 md:shadow-lg">
            <div className="bg-indigo-600 p-1 rounded-lg">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:inline text-white">TOEIC Master</span>
          </div>
          
          <div className="grid grid-cols-5 gap-1 w-full md:w-auto md:flex md:items-center md:bg-zinc-900 md:p-1.5 md:rounded-2xl md:border md:border-zinc-800 md:shadow-lg">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'browse', icon: BookOpen, label: 'Thư viện' },
              { id: 'quiz', icon: CheckSquare, label: 'Kiểm tra' },
              { id: 'practice', icon: Target, label: 'Luyện tập' },
              { id: 'stats', icon: TrendingUp, label: 'Thống kê' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as any)}
                aria-current={currentView === item.id ? 'page' : undefined}
                className={cn(
                  'min-w-0 flex flex-col items-center gap-1 px-1.5 py-2 rounded-xl transition-all md:flex-row md:px-5 md:py-2.5',
                  currentView === item.id ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-500 hover:text-slate-300'
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="w-full truncate text-[9px] leading-tight font-bold md:text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Tài khoản</span>
              <span className="text-sm font-bold text-white">{profile?.displayName}</span>
            </div>
            <button aria-label="Mở cài đặt" onClick={() => setCurrentView('settings')} className="p-3 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-all text-zinc-500 shadow-lg hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
              <Settings className="w-5 h-5" />
            </button>
            <button aria-label="Đăng xuất" onClick={logout} className="p-3 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-all text-zinc-500 shadow-lg hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="fixed right-3 top-3 z-40 flex gap-2 md:hidden">
        <button aria-label="Mở cài đặt" onClick={() => setCurrentView('settings')} className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-950/90 backdrop-blur-xl text-zinc-400 shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
          <Settings className="w-5 h-5" />
        </button>
        <button aria-label="Đăng xuất" onClick={logout} className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-950/90 backdrop-blur-xl text-zinc-400 shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-28 md:pt-32">
        <Suspense fallback={<div className="py-24 text-center text-zinc-500 font-bold">Đang tải...</div>}>
          <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <div className="space-y-8">
              <Dashboard 
                profile={profile} 
                progress={progress} 
                todayActivity={todayActivity}
                onStartNewWords={() => {
                  setStudyMode('new');
                  setCurrentView('review');
                }}
                onStartReview={() => {
                  setStudyMode('review');
                  setCurrentView('review');
                }}
                onStartQuiz={() => setCurrentView('quiz')}
                onStartPractice={() => setCurrentView('practice')}
                onSyncTasks={() => syncToGoogleTasks()}
                onSyncCalendar={() => syncToGoogleCalendar()}
                onExportDrive={exportToGoogleDrive}
                syncingAction={syncingAction}
                isGuest={isGuest}
                syncStatus={isGuest ? 'Lưu trên thiết bị' : isOnline ? 'Đã kết nối Cloud' : 'Mất kết nối'}
                onViewStats={() => setCurrentView('stats')}
              />
            </div>
          )}
          {currentView === 'browse' && (
            <Browse 
              progress={progress} 
              onLearnMore={handleLearnMore} 
              onSyncTask={syncToGoogleTasks}
              onResetWord={resetWordProgress}
              onDelayWord={delayWordReview}
            />
          )}
          {currentView === 'review' && (
            <ReviewSession 
              key={`review-${studyMode}`}
              progress={progress} 
              mode={studyMode}
              onSaveProgress={persistProgressItem}
              onFinish={(newProgress, wordIds) => {
                setProgress(newProgress);
                progressRef.current = newProgress;
                void logSessionHistory({
                  type: 'review',
                  score: `${wordIds.length} từ`,
                  details: studyMode === 'new'
                    ? `Hoàn thành học từ mới (${wordIds.length} thẻ)`
                    : `Hoàn thành ôn tập từ vựng (${wordIds.length} thẻ)`,
                  wordIds,
                });
                setCurrentView('dashboard');
              }}
              onCancel={() => setCurrentView('dashboard')}
              onLearnMore={handleLearnMore}
            />
          )}
          {currentView === 'quiz' && (
            <QuizSession 
              progress={progress}
              onCancel={() => setCurrentView('dashboard')}
              onFinish={(score, total, wordIds) => {
                void logSessionHistory({
                  type: 'quiz',
                  score: `${score}/${total}`,
                  details: `Hoàn thành bài kiểm tra (${Math.round((score/total)*100)}%)`,
                  wordIds,
                  correctCount: score,
                  totalQuestions: total,
                });
              }}
              onWordResult={async (wordId, isCorrect) => {
                const currentItem = progressRef.current[wordId] || {
                  easiness: initialSRS.easiness,
                  interval: initialSRS.interval,
                  repetitions: initialSRS.repetitions,
                  nextReviewDate: new Date().toISOString()
                };
                
                let newWrongCount = currentItem.wrongCount || 0;
                if (!isCorrect) {
                  newWrongCount += 1;
                } else if (newWrongCount > 0) {
                  newWrongCount -= 1;
                }

                const updatedItem = {
                  ...currentItem,
                  wrongCount: newWrongCount,
                  lastReviewDate: new Date().toISOString()
                };

                try {
                  await persistProgressItem(wordId, updatedItem);
                } catch (err) {
                  console.error("Failed to update progress for quiz word in DB", err);
                  toast.error('Không thể lưu tiến độ quiz.');
                }
              }}
            />
          )}
          {currentView === 'practice' && (
            <PracticeSession 
              progress={progress}
              onCancel={() => setCurrentView('dashboard')}
              onFinish={(mode, wordIds) => {
                void logSessionHistory({
                  type: 'review',
                  score: `${wordIds.length} từ`,
                  details: `Luyện tập tự do (${mode})`,
                  wordIds,
                });
                setCurrentView('dashboard');
              }}
              onUpdateProgress={async (wordId, nextSRS) => {
                const updatedItem: ProgressItem = {
                  ...nextSRS,
                  nextReviewDate: nextSRS.nextReviewDate.toISOString(),
                  lastReviewDate: new Date().toISOString(),
                  wrongCount: nextSRS.wrongCount !== undefined
                    ? nextSRS.wrongCount
                    : (progressRef.current[wordId]?.wrongCount || 0),
                };
                try {
                  await persistProgressItem(wordId, updatedItem);
                } catch (err) {
                  console.error("Failed to update progress in DB", err);
                  toast.error('Không thể lưu tiến độ luyện tập.');
                }
              }}
            />
          )}
          {currentView === 'settings' && (
            <SettingsView 
              isGuest={isGuest}
              profile={profile}
              progress={progress}
              onCancel={() => setCurrentView('dashboard')}
              onImportBackup={async (backup) => {
                const currentProfile = profileRef.current;
                if (!currentProfile) throw new Error('Missing profile.');
                const importedProgress = backup.progress;

                if (isGuest) {
                  clearGuestProgress();
                  const normalizedImportedProfile = normalizeProfileWordCount(
                    {
                      ...currentProfile,
                      ...(backup.profile || {}),
                      uid: currentProfile.uid,
                      email: currentProfile.email,
                    },
                    importedProgress,
                  );
                  setProgress(importedProgress);
                  progressRef.current = importedProgress;
                  setProfile(normalizedImportedProfile);
                  profileRef.current = normalizedImportedProfile;
                  saveGuestProfile(normalizedImportedProfile);
                  saveGuestProgress(importedProgress);
                  return;
                }

                if (user) {
                  const cloudProfile = await replaceCloudProgress(
                    currentProfile,
                    backup,
                  );
                  setProfile(cloudProfile);
                  profileRef.current = cloudProfile;
                  setProgress(importedProgress);
                  progressRef.current = importedProgress;
                }
              }}
              onUpdateProfile={async (updates: Partial<UserProfile>) => {
                 if (profile && !isGuest) {
                    const previousProfile = profile;
                    const newProfile = { ...profile, ...updates };
                    setProfile(newProfile);
                    try {
                       await updateDoc(doc(db, 'users', profile.uid), updates);
                    } catch (err) {
                       console.error('Failed to update profile', err);
                       setProfile(previousProfile);
                       toast.error('Lỗi khi lưu cấu hình.');
                    }
                 } else if (profile && isGuest) {
                    const newProfile = { ...profile, ...updates };
                    setProfile(newProfile);
                    localStorage.setItem('guest_profile', JSON.stringify(newProfile));
                 }
              }}
              onResetProgress={async () => {
                if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ tiến độ học tập? (Dữ liệu không thể khôi phục)")) {
                  try {
                    const currentProfile = profileRef.current;
                    const resetProfile = currentProfile
                      ? {
                          ...currentProfile,
                          totalWordsLearned: 0,
                          streak: 0,
                          lastStudyDate: undefined,
                          history: [],
                        }
                      : null;

                    if (isGuest) {
                      clearGuestProgress();
                      if (resetProfile) {
                        saveGuestProfile(resetProfile);
                      }
                    } else if (user && currentProfile) {
                      await resetCloudProgress(currentProfile);
                      toast.success("Đã xóa tiến độ học tập trên Cloud.");
                    }

                    setProgress({});
                    progressRef.current = {};
                    setProfile(resetProfile);
                    profileRef.current = resetProfile;
                    setTodayActivity(null);
                    toast.success("Đã cài đặt lại tiến trình học tập.");
                  } catch (err) {
                    console.error('Failed to reset progress', err);
                    toast.error('Không thể xóa tiến độ học tập. Vui lòng thử lại.');
                  }
                }
              }}
            />
          )}
          {currentView === 'stats' && (
            <Suspense fallback={<div className="py-24 text-center text-zinc-500 font-bold">Đang tải thống kê...</div>}>
              <StatsView 
                progress={progress}
                onBack={() => setCurrentView('dashboard')}
              />
            </Suspense>
          )}
          </AnimatePresence>
        </Suspense>

        <Modal 
          isOpen={!!explainingWord} 
          onClose={() => setExplainingWord(null)} 
          title={`Tìm hiểu thêm: ${explainingWord?.word}`}
        >
          {isExplaining ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-2 border-black border-t-transparent rounded-full" />
              <p className="text-neutral-500 font-medium animate-pulse">AI đang giải thích...</p>
            </div>
          ) : (
            <ReactMarkdown>{explainingWord?.content || ''}</ReactMarkdown>
          )}
        </Modal>
        <Modal
          isOpen={showOnboarding && Boolean(user || isGuest)}
          onClose={() => {
            completeOnboarding();
            setShowOnboarding(false);
          }}
          title="Bắt đầu học với ENG_MASTER"
        >
          <div className="space-y-4 text-sm">
            <p><strong>Học từ mới</strong> dành cho những từ bạn chưa bắt đầu.</p>
            <p><strong>Ôn tập</strong> chỉ hiện các từ đã đến hạn theo lịch SRS.</p>
            <p>Trong flashcard, hãy lật thẻ rồi chọn <strong>Học lại / Khó / Tốt / Dễ</strong> để lên lịch lần ôn tiếp theo.</p>
            <Button
              onClick={() => {
                completeOnboarding();
                setShowOnboarding(false);
              }}
              className="w-full py-3"
            >
              Bắt đầu
            </Button>
          </div>
        </Modal>
      </main>
    </div>
  );
}
