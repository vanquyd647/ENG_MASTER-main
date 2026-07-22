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
import type {
  BackupV2, DailyActivity, ProgressItem, UserProfile, UserProgress,
} from "../types";
import { Button, Card } from "./ui";

type SyncAction = "tasks" | "calendar" | "drive";

let studyReminderTimer: number | null = null;
const scheduleStudyReminder = () => {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  if (studyReminderTimer) window.clearTimeout(studyReminderTimer);
  const nextReminder = new Date();
  nextReminder.setHours(20, 0, 0, 0);
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

export function PracticeSession({ 
  progress, 
  onCancel,
  onFinish,
  onUpdateProgress
}: { 
  progress: UserProgress;
  onCancel: () => void;
  onFinish: (mode: string, wordIds: string[]) => void;
  onUpdateProgress: (wordId: string, nextSRS: any) => void;
}) {
  const [mode, setMode] = useState<'easy' | 'medium' | 'hard' | 'mistakes' | null>(null);
  const [practiceWords, setPracticeWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const startPractice = (difficulty: 'easy' | 'medium' | 'hard' | 'mistakes') => {
    let filtered = VOCABULARY.filter(w => {
      const p = progress[w.id];
      if (difficulty === 'easy') {
        return p && p.easiness > 2.8;
      }
      if (difficulty === 'medium') {
        return p && p.easiness >= 2.5 && p.easiness <= 2.8;
      }
      if (difficulty === 'hard') {
        return !p || p.easiness < 2.5; 
      }
      if (difficulty === 'mistakes') {
        return p && p.wrongCount && p.wrongCount > 0;
      }
      return true;
    });

    if (filtered.length === 0) {
      if (difficulty === 'mistakes') {
         toast.success('Tuyệt vời! Bạn chưa có từ sai nào. Đang tải một số từ phức tạp...');
         filtered = VOCABULARY.filter(w => {
           const p = progress[w.id];
           return p && p.easiness < 2.5;
         });
         if (filtered.length === 0) {
            filtered = VOCABULARY.filter(w => !progress[w.id]);
         }
      } else if (difficulty === 'hard') {
         filtered = VOCABULARY.filter(w => !progress[w.id]);
      } else {
         toast.error('Không có từ nào trong danh mục này! Hãy thử mức độ khác.');
         return;
      }
    }

    if (difficulty === 'mistakes') {
      // Prioritize by highest wrongCount first
      filtered = [...filtered].sort((a, b) => {
        const countA = progress[a.id]?.wrongCount || 0;
        const countB = progress[b.id]?.wrongCount || 0;
        return countB - countA;
      });
    } else {
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }

    setPracticeWords(filtered.slice(0, 15));
    setMode(difficulty);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleRate = async (quality: number) => {
    const word = practiceWords[currentIndex];
    const prevSRS = progress[word.id] || { 
      easiness: initialSRS.easiness, 
      interval: initialSRS.interval, 
      repetitions: initialSRS.repetitions,
      nextReviewDate: new Date().toISOString()
    };
    
    // Adjust quality slightly based on difficulty to influence interval correctly
    let adjustedQuality = quality;
    if (mode === 'hard' && quality >= 4) {
       adjustedQuality = Math.min(5, quality + 1); // Reward more for getting hard words right
    } else if (mode === 'easy' && quality < 4) {
       adjustedQuality = Math.max(1, quality - 1); // Penalize more for getting easy words wrong
    }

    let newWrongCount = prevSRS.wrongCount || 0;
    if (quality === 1) {
      newWrongCount += 1;
    } else if (quality >= 4 && newWrongCount > 0) {
      newWrongCount -= 1;
    }

    const nextSRS = calculateNextReview(adjustedQuality, {
      ...prevSRS,
      nextReviewDate: new Date(prevSRS.nextReviewDate)
    });

    onUpdateProgress(word.id, {
      ...nextSRS,
      wrongCount: newWrongCount
    });

    setIsFlipped(false);
    if (currentIndex >= practiceWords.length - 1) {
      onFinish(mode || 'practice', practiceWords.map((practiceWord) => practiceWord.id));
    } else {
      setTimeout(() => setCurrentIndex(prev => Math.min(prev + 1, practiceWords.length - 1)), 150);
    }
  };

  const speak = (e: any, text: string | undefined) => {
    if (e) e.stopPropagation();
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const flipCard = () => {
    if (!isFlipped && localStorage.getItem('app_sound') !== 'false') {
      speak(null, currentWord?.word);
    }
    setIsFlipped((flipped) => !flipped);
  };

  if (!mode) {
    const mistakeWordsCount = Object.values(progress).filter(p => p.wrongCount && p.wrongCount > 0).length;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8 sm:space-y-12 mt-4 sm:mt-10 w-full"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter">
            Luyện Chọn Lọc
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto font-medium">
            Chọn độ khó hoặc bộ từ đặc biệt để luyện tập. Tiến độ SRS và lịch sử lỗi sai của bạn sẽ tiếp tục được ghi nhận trong phiên học này.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card ariaLabel="Bắt đầu luyện tập mức dễ" onClick={() => startPractice('easy')} className="p-5 sm:p-8 cursor-pointer hover:border-emerald-500 hover:bg-emerald-500/5 transition-all border-zinc-800 bg-[#0c0c0e] flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 group hover:scale-[1.02] shadow-2xl">
            <div className="w-16 h-16 shrink-0 rounded-[20px] bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white text-xl">Dễ (Easy)</h3>
              <p className="text-zinc-500 text-sm mt-1">Ôn tập các từ bạn đã quen thuộc (Easiness cao)</p>
            </div>
          </Card>
          
          <Card ariaLabel="Bắt đầu luyện tập mức vừa" onClick={() => startPractice('medium')} className="p-5 sm:p-8 cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/5 transition-all border-zinc-800 bg-[#0c0c0e] flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 group hover:scale-[1.02] shadow-2xl">
            <div className="w-16 h-16 shrink-0 rounded-[20px] bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors border border-indigo-500/20">
              <Brain className="w-8 h-8" />
            </div>
            <div className="text-left">
               <h3 className="font-bold text-white text-xl">Vừa (Medium)</h3>
              <p className="text-zinc-500 text-sm mt-1">Các từ đang trong quá trình ghi nhớ</p>
            </div>
          </Card>
          
          <Card ariaLabel="Bắt đầu luyện tập mức khó" onClick={() => startPractice('hard')} className="p-5 sm:p-8 cursor-pointer hover:border-orange-500 hover:bg-orange-500/5 transition-all border-zinc-800 bg-[#0c0c0e] flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 group hover:scale-[1.02] shadow-2xl">
            <div className="w-16 h-16 shrink-0 rounded-[20px] bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors border border-orange-500/20">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="text-left">
               <h3 className="font-bold text-white text-xl">Khó (Hard)</h3>
              <p className="text-zinc-500 text-sm mt-1">Các từ hay sai hoặc từ mới chưa từng học</p>
            </div>
          </Card>

          <Card ariaLabel="Bắt đầu luyện lại các từ hay sai" onClick={() => startPractice('mistakes')} className="p-5 sm:p-8 cursor-pointer hover:border-rose-500 hover:bg-rose-500/5 transition-all border-zinc-800 bg-[#0c0c0e] flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 group hover:scale-[1.02] shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 shrink-0 rounded-[20px] bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors border border-rose-500/20">
              <Flame className="w-8 h-8 animate-pulse" />
            </div>
            <div className="text-left flex-1 border-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-xl">Luyện từ hay sai</h3>
                {mistakeWordsCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase animate-pulse shrink-0">
                    {mistakeWordsCount} từ
                  </span>
                )}
              </div>
              <p className="text-zinc-500 text-sm mt-1">Luyện lại có trọng tâm các từ bạn đã làm sai ở Quiz hoặc ôn tập. Ưu tiên các từ sai nhiều lần nhất.</p>
            </div>
          </Card>
        </div>
        <div className="flex justify-center mt-10">
          <Button onClick={onCancel} variant="ghost" className="text-zinc-500 hover:text-white uppercase tracking-widest text-xs font-black">
            Quay lại Dashboard
          </Button>
        </div>
      </motion.div>
    );
  }

  const currentWord = practiceWords[currentIndex];
  
  const modeLabel = mode === 'hard' ? 'Khó (Hard)' : 
                    mode === 'medium' ? 'Vừa (Medium)' : 
                    mode === 'easy' ? 'Dễ (Easy)' : 
                    mode === 'mistakes' ? 'Trọng tâm từ sai (Weaknesses)' : 'Luyện tập';

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-zinc-500">
        <span className="text-indigo-400 flex items-center gap-2">
          <Target className="w-4 h-4" />
          {modeLabel}
        </span>
        <span className="bg-zinc-800 px-3 py-1 rounded-full text-white">{currentIndex + 1} / {practiceWords.length}</span>
      </div>

      <div className="h-2 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden p-0.5">
        <motion.div 
          className="h-full bg-indigo-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / practiceWords.length) * 100}%` }}
        />
      </div>

      <div className="perspective-1000 w-full h-[min(420px,62vh)] sm:h-[450px]">
        <motion.div
            className="w-full h-full relative cursor-pointer rounded-[28px] sm:rounded-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950"
           role="button"
           tabIndex={0}
           aria-pressed={isFlipped}
           aria-label={isFlipped ? "Mặt sau thẻ từ. Nhấn để xem từ vựng" : "Mặt trước thẻ từ. Nhấn để xem nghĩa"}
           animate={{ rotateY: isFlipped ? 180 : 0 }}
           transition={{ type: 'spring', stiffness: 260, damping: 20 }}
           style={{ transformStyle: 'preserve-3d' }}
           onClick={flipCard}
           onKeyDown={(event) => {
             if (event.key === 'Enter' || event.key === ' ') {
               event.preventDefault();
               flipCard();
             }
           }}
        >
          {/* Front */}
          <div 
             className={cn(
                "absolute inset-0 bg-[#0c0c0e] border border-zinc-800 rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 flex flex-col items-center justify-center text-center shadow-2xl backface-hidden group",
               isFlipped ? "opacity-0 pointer-events-none" : "opacity-100"
             )}
          >
             <div className="absolute top-6 right-6 z-10">
                <button 
                  onClick={(e) => speak(e, currentWord?.word)}
                  className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors shadow-lg border border-zinc-700"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
             </div>
             <p className="text-[11px] font-black tracking-[0.3em] uppercase text-indigo-500 mb-6 group-hover:scale-105 transition-transform">
                Practice
             </p>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white mb-6 px-2 sm:px-4 py-6 sm:py-8 break-words">
                {currentWord?.word}
             </h2>
             <p className="text-xl font-mono text-zinc-500 opacity-80">/{currentWord?.phonetic}/</p>
             <div className="absolute bottom-8 left-0 w-full flex justify-center">
               <span className="text-[10px] uppercase font-black tracking-widest text-zinc-600 flex items-center gap-2">
                  <RotateCcw className="w-3 h-3" />
                  Chạm để lật thẻ
               </span>
             </div>
          </div>

          {/* Back */}
           <div 
             className={cn(
                "absolute inset-0 bg-indigo-600 rounded-[28px] sm:rounded-[32px] p-5 sm:p-10 flex flex-col items-center justify-center text-center shadow-2xl backface-hidden overflow-hidden",
               !isFlipped ? "opacity-0 pointer-events-none" : "opacity-100"
             )}
             style={{ transform: 'rotateY(180deg)' }}
           >
              <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at center, white 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
              <div className="relative z-10 w-full">
                <span className="px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/20 mb-8 inline-block shadow-lg backdrop-blur-sm">
                  {currentWord?.pos}
                </span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-5 sm:mb-8 drop-shadow-md">
                  {currentWord?.meaning}
                </h2>
                <div className="space-y-3 sm:space-y-4 bg-white/10 p-4 sm:p-6 rounded-2xl border border-white/20 shadow-xl backdrop-blur-sm max-h-44 sm:max-h-none overflow-y-auto">
                  <p className="text-base sm:text-xl font-medium italic text-indigo-50 leading-snug">"{currentWord?.example}"</p>
                  <p className="text-[15px] text-indigo-200 font-medium leading-relaxed">{currentWord?.exampleTranslation}</p>
                </div>
              </div>
           </div>
        </motion.div>
      </div>

      <div className={cn(
        "transition-all duration-300 mt-8",
        !isFlipped ? "opacity-0 pointer-events-none translate-y-4" : "opacity-100 translate-y-0"
      )}>
        <p className="text-center text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">Đánh giá độ khó để cập nhật tiến độ (SRS)</p>
        <div className="grid grid-cols-4 gap-2 md:gap-3">
          {[
            { q: 1, label: 'Again', color: 'border-rose-900/50 bg-rose-950/20 text-rose-400 hover:bg-rose-950/40' },
            { q: 3, label: 'Hard', color: 'border-amber-900/50 bg-amber-950/20 text-amber-400 hover:bg-amber-950/40' },
            { q: 4, label: 'Good', color: 'border-emerald-900/50 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40' },
            { q: 5, label: 'Easy', color: 'border-indigo-900/50 bg-indigo-950/20 text-indigo-400 hover:bg-indigo-950/40' },
          ].map(btn => (
            <button
              key={btn.q}
              onClick={(e) => {
                e.stopPropagation();
                handleRate(btn.q);
              }}
              className={cn(
                "flex flex-col items-center gap-2 py-4 rounded-2xl transition-all active:scale-95 border",
                btn.color,
                "font-bold text-[10px] uppercase tracking-tighter shadow-lg"
              )}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <Button onClick={onCancel} variant="ghost" className="text-zinc-500 font-black uppercase tracking-widest text-[10px] hover:text-rose-500 transition-colors">
          Kết thúc ngay
        </Button>
      </div>
    </div>
  );
}
