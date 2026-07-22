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
  getDueReviewQueue, getLearningStatus, getLearningStatusLabel, getNewWordQueue,
  getRemainingNewWordCount, getSessionCorrectPercentage, getSessionStudiedCount,
  getStartedWordCount, REVIEW_SESSION_SIZE,
} from "../lib/learning";
import { calculateNextReview, initialSRS } from "../lib/srs";
import { cn } from "../lib/utils";
import { getStudySessionSize } from "../lib/productPreferences";
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

export function ReviewSession({ 
  progress, 
  mode,
  onSaveProgress,
  onFinish,
  onCancel,
  onLearnMore
}: { 
  progress: UserProgress;
  mode: 'new' | 'review';
  onSaveProgress: (wordId: string, item: ProgressItem) => Promise<UserProgress>;
  onFinish: (p: UserProgress, wordIds: string[]) => void;
  onCancel: () => void;
  onLearnMore: (word: string, meaning: string) => void;
}) {
  const [sessionWords, setSessionWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newProgress, setNewProgress] = useState<UserProgress>({ ...progress });

  useEffect(() => {
    const wordsToReview = (mode === 'new'
      ? getNewWordQueue(progress)
      : getDueReviewQueue(progress)
    ).slice(0, getStudySessionSize());
    
    // Shuffle
    const shuffled = [...wordsToReview].sort(() => Math.random() - 0.5);
    setSessionWords(shuffled);
  }, [mode]);

  const handleRate = async (quality: number) => {
    const word = sessionWords[currentIndex];
    const prevSRS = newProgress[word.id] || { 
      easiness: initialSRS.easiness, 
      interval: initialSRS.interval, 
      repetitions: initialSRS.repetitions,
      nextReviewDate: new Date().toISOString()
    };
    
    // Map existing structure to initialSRS and perform calculation
    const nextSRS = calculateNextReview(quality, {
      ...prevSRS,
      nextReviewDate: new Date(prevSRS.nextReviewDate)
    });

    let newWrongCount = prevSRS.wrongCount || 0;
    if (quality === 1) {
      newWrongCount += 1;
    } else if (quality >= 4 && newWrongCount > 0) {
      newWrongCount -= 1;
    }

    const updatedProgress = {
      ...newProgress,
      [word.id]: {
        ...nextSRS,
        nextReviewDate: nextSRS.nextReviewDate.toISOString(),
        lastReviewDate: new Date().toISOString(),
        wrongCount: newWrongCount
      }
    };

    setNewProgress(updatedProgress);
    try {
      await onSaveProgress(word.id, updatedProgress[word.id]);
    } catch (err) {
      console.error('Error saving progress:', err);
      toast.error('Không thể lưu tiến độ ôn tập.');
    }

    if (currentIndex < sessionWords.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => Math.min(prev + 1, sessionWords.length - 1)), 150);
    } else {
      toast.success(mode === 'new' ? 'Đã hoàn thành phiên học từ mới!' : 'Đã hoàn thành phiên ôn tập!');
      onFinish(updatedProgress, sessionWords.map((sessionWord) => sessionWord.id));
    }
  };

  const currentWord = sessionWords[currentIndex];

  const speak = (e: React.MouseEvent | null, text: string) => {
    if (e) e.stopPropagation();
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

  if (sessionWords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-8 max-w-md mx-auto">
        <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center shadow-2xl relative">
          <div className="absolute inset-0 bg-indigo-600/10 blur-2xl rounded-full" />
          <BookOpen className="w-12 h-12 text-indigo-400 relative z-10" />
        </div>
        <div className="space-y-3">
          <h3 className="text-3xl font-bold text-white tracking-tighter">
            {mode === 'new' ? 'Không còn từ mới!' : 'Ôn tập hoàn tất!'}
          </h3>
          <p className="text-zinc-500 font-medium">
            {mode === 'new'
              ? 'Bạn đã bắt đầu học toàn bộ từ vựng hiện có.'
              : 'Bạn không còn từ nào đến hạn ôn tập trong hôm nay.'}
          </p>
        </div>
        <Button onClick={onCancel} variant="primary" className="w-full py-4 rounded-2xl">Quay lại Dashboard</Button>
      </div>
    );
  }

  return (
     <div className="max-w-2xl mx-auto flex flex-col min-h-[60vh] gap-6 sm:gap-8">
      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">
          <span className="text-white">{mode === 'new' ? 'Học từ mới' : 'Ôn tập'}</span>
          <span className="text-indigo-400">{currentIndex + 1} / {sessionWords.length}</span>
        </div>
        <div className="h-2 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden p-0.5">
          <motion.div 
            className="h-full bg-indigo-600 rounded-full shadow-[0_0_12px_rgba(79,70,229,0.4)]"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / sessionWords.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex-grow flex items-center justify-center py-4 sm:py-10 perspective-1000">
        <motion.div
           role="button"
           tabIndex={0}
           aria-pressed={isFlipped}
           aria-label={isFlipped ? "Mặt sau thẻ từ. Nhấn để xem từ vựng" : "Mặt trước thẻ từ. Nhấn để xem nghĩa"}
           onClick={flipCard}
           onKeyDown={(event) => {
             if (event.key === 'Enter' || event.key === ' ') {
               event.preventDefault();
               flipCard();
             }
           }}
           animate={{ rotateY: isFlipped ? 180 : 0 }}
           transition={{ type: 'spring', stiffness: 260, damping: 20 }}
           className="relative w-full max-w-[440px] h-[min(420px,62vh)] sm:h-[480px] preserve-3d cursor-pointer shadow-2xl shadow-black/50 rounded-[32px] sm:rounded-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950"
        >
          {/* Front */}
          <div className={cn(
            "absolute inset-0 bg-zinc-900 border border-zinc-800 text-white p-6 sm:p-12 flex flex-col items-center justify-center text-center backface-hidden rounded-[32px] sm:rounded-[48px]",
            isFlipped ? "opacity-0 pointer-events-none" : "opacity-100"
          )}>
            <div className="absolute top-6 left-6 sm:top-10 sm:left-10 flex gap-2">
               <span className="bg-indigo-500/10 text-indigo-400 text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full border border-indigo-500/20">VOCABULARY</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-4 break-words">{currentWord?.word}</h1>
            <div className="flex items-center gap-4 mb-8">
              <p className="text-base sm:text-xl font-mono text-zinc-500 italic">/{currentWord?.phonetic}/</p>
              <button 
                onClick={(e) => speak(e, currentWord?.word)}
                title="Play pronunciation"
                aria-label="Play pronunciation"
                className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all shadow-lg"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            <div className="w-16 h-16 rounded-3xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-xl">
              <RotateCcw className="w-6 h-6 text-indigo-400" />
            </div>
          </div>

          {/* Back */}
          <div className={cn(
            "absolute inset-0 bg-zinc-900 border border-zinc-800 p-6 sm:p-12 flex flex-col items-center justify-center text-center backface-hidden rounded-[32px] sm:rounded-[48px]",
            !isFlipped ? "rotate-y-180 opacity-0 pointer-events-none" : "rotate-y-180 opacity-100"
          )}>
             <div className="flex-grow flex flex-col items-center justify-center gap-4 sm:gap-8 min-h-0">
               <div className="space-y-3">
                 <h2 className="text-2xl sm:text-4xl font-bold tracking-tighter text-white leading-tight">{currentWord?.meaning}</h2>
                 <p className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.3em]">{currentWord?.pos}</p>
               </div>
               <div className="h-px w-24 bg-zinc-800" />
               <div className="space-y-3 sm:space-y-4 px-0 sm:px-2 overflow-y-auto">
                 <p className="text-base sm:text-xl font-medium italic text-slate-300 leading-snug">"{currentWord?.example}"</p>
                 <p className="text-[15px] text-zinc-500 font-medium leading-relaxed">{currentWord?.exampleTranslation}</p>
                 <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onLearnMore(currentWord.word, currentWord.meaning);
                  }}
                  className="mx-auto block mt-6 text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all tracking-[0.2em]"
                 >
                   Deep Explain by AI
                 </button>
               </div>
            </div>
            
            <div className="w-full grid grid-cols-4 gap-2 sm:gap-3 mt-5 sm:mt-10">
              {[
                { q: 1, label: 'Học lại', color: 'border-rose-900/50 bg-rose-950/20 text-rose-400 hover:bg-rose-950/40' },
                { q: 3, label: 'Khó', color: 'border-orange-900/50 bg-orange-950/20 text-orange-400 hover:bg-orange-950/40' },
                { q: 4, label: 'Tốt', color: 'border-emerald-900/50 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40' },
                { q: 5, label: 'Dễ', color: 'border-indigo-900/50 bg-indigo-950/20 text-indigo-400 hover:bg-indigo-950/40' },
              ].map(btn => (
                <button
                  key={btn.q}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRate(btn.q);
                  }}
                  className={cn(
                    "flex flex-col items-center gap-2 py-3 sm:py-4 rounded-2xl transition-all active:scale-95 border",
                    btn.color,
                    "font-bold text-[10px] uppercase tracking-tighter shadow-lg"
                  )}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center">
        <Button onClick={onCancel} variant="ghost" className="text-zinc-500 font-black uppercase tracking-widest text-[10px] hover:text-rose-500 mt-8">
          Hủy bỏ phiên học
        </Button>
      </div>
    </div>
  );
}
