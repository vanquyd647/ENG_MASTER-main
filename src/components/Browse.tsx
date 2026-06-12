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

export function Browse({ 
  progress, 
  onLearnMore,
  onSyncTask
}: { 
  progress: UserProgress; 
  onLearnMore: (word: string, meaning: string) => void;
  onSyncTask: (word: Word) => void;
}) {
  const topics = Array.from(new Set(VOCABULARY.map(w => w.topic)));
  const [selectedTopic, setSelectedTopic] = useState<string>(topics[0]);
  const [inlineExplanations, setInlineExplanations] = useState<Record<string, { loading: boolean, content: string | null, error: string | null }>>({});

  const words = VOCABULARY.filter(w => w.topic === selectedTopic);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleInlineExplain = async (wordId: string, word: string, meaning: string) => {
    if (inlineExplanations[wordId]) {
      // Toggle off if already open
      setInlineExplanations(prev => {
        const next = { ...prev };
        delete next[wordId];
        return next;
      });
      return;
    }

    setInlineExplanations(prev => ({
      ...prev,
      [wordId]: { loading: true, content: null, error: null }
    }));

    try {
      const data = await callAiApi<{ text: string }>('explain', {
        word,
        meaning,
      });

      setInlineExplanations(prev => ({
        ...prev,
        [wordId]: { loading: false, content: data.text, error: null }
      }));
    } catch (err: any) {
      console.error(err);
      setInlineExplanations(prev => ({
        ...prev,
        [wordId]: { loading: false, content: null, error: err instanceof Error ? err.message : 'Failed to load explanation.' }
      }));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10"
    >
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none">
        {topics.map(t => (
          <button
            key={t}
            onClick={() => setSelectedTopic(t)}
            className={cn(
              'px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap border',
              selectedTopic === t 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20' 
                : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-slate-300'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {words.map(w => {
          const p = progress[w.id];
          return (
            <Card key={w.id} className="group hover:border-zinc-700 transition-all border-zinc-800/80 p-0 overflow-hidden flex flex-col bg-[#0c0c0e]">
              <div className="p-5 sm:p-8 space-y-5 flex-grow">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h4 className="text-2xl sm:text-3xl font-bold tracking-tighter text-white break-words">{w.word}</h4>
                    <p className="text-zinc-500 font-mono text-sm mt-1">{w.phonetic}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => onSyncTask(w)}
                      title="Lưu vào Google Tasks"
                      aria-label="Save to Google Tasks"
                      className="p-2.5 sm:p-3 rounded-2xl bg-zinc-800 text-zinc-400 hover:bg-orange-600 hover:text-white transition-all shadow-lg"
                    >
                      <ClipboardList className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => speak(w.word)}
                      title="Play pronunciation"
                      aria-label="Play pronunciation"
                      className="p-2.5 sm:p-3 rounded-2xl bg-zinc-800 text-zinc-400 hover:bg-indigo-600 hover:text-white transition-all shadow-lg"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-slate-200 text-base sm:text-lg leading-snug">{w.meaning}</p>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md inline-block">{w.pos}</span>
                </div>
                <div className="pt-5 border-t border-zinc-800/50 space-y-3">
                  <p className="text-sm font-medium leading-relaxed text-slate-400 italic">"{w.example}"</p>
                  <p className="text-[13px] text-zinc-600 font-medium leading-relaxed">{w.exampleTranslation}</p>
                </div>
                
                {inlineExplanations[w.id] && (
                  <div className="pt-5 border-t border-zinc-800/50 mt-4">
                    {inlineExplanations[w.id].loading ? (
                      <div className="flex items-center gap-3 text-indigo-400">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full" />
                        <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Đang giải thích...</span>
                      </div>
                    ) : inlineExplanations[w.id].error ? (
                      <div className="text-rose-400 text-xs font-bold">
                        {inlineExplanations[w.id].error}
                      </div>
                    ) : (
                      <div className="markdown-body prose prose-invert prose-sm max-w-none text-slate-300">
                        <ReactMarkdown>{inlineExplanations[w.id].content || ''}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                )}

                <Button 
                  onClick={() => handleInlineExplain(w.id, w.word, w.meaning)} 
                  variant="outline" 
                  className={cn(
                    "w-full mt-6 text-[10px] py-2.5 rounded-xl border-zinc-800 uppercase tracking-[0.2em] font-black transition-all",
                    inlineExplanations[w.id] 
                      ? "bg-zinc-800 text-slate-300 hover:bg-zinc-700 hover:text-white"
                      : "hover:border-indigo-500/50 hover:text-indigo-400"
                  )}
                >
                  {inlineExplanations[w.id] ? "Đóng giải thích" : "AI Explain"}
                </Button>
              </div>
              <div className="px-5 sm:px-8 py-4 bg-[#09090b] flex justify-between items-center border-t border-zinc-800/50">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Trạng thái</span>
                <span className={cn(
                  'text-[10px] font-black uppercase tracking-[0.2em]',
                  p ? 'text-emerald-500' : 'text-zinc-700'
                )}>
                  {getLearningStatusLabel(p)}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
