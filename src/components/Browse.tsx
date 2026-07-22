import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import {
  AlertCircle, Bell, BookOpen, Brain, Calendar, CalendarDays, CheckCircle2,
  CheckSquare, ChevronRight, ClipboardList, ExternalLink, FileDown, Flame,
  GraduationCap, History, Moon, RotateCcw, Settings, Sparkles, Sun, Target,
  Trash2, TrendingUp, Trophy, User as UserIcon, Volume2, Search, Heart, Plus, X,
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
  addCustomWord,
  deleteCustomWord,
  getFavoriteWordIds,
  saveFavoriteWordIds,
} from "../lib/productPreferences";
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
  onSyncTask,
  onResetWord,
  onDelayWord,
}: { 
  progress: UserProgress; 
  onLearnMore: (word: string, meaning: string) => void;
  onSyncTask: (word: Word) => void;
  onResetWord: (wordId: string) => Promise<void>;
  onDelayWord: (wordId: string) => Promise<void>;
}) {
  const [vocabularyVersion, setVocabularyVersion] = useState(0);
  const topics = ['Tất cả', ...Array.from(new Set(VOCABULARY.map(w => w.topic)))];
  const [selectedTopic, setSelectedTopic] = useState<string>('Tất cả');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'learning' | 'due' | 'learned' | 'favorites'>('all');
  const [favorites, setFavorites] = useState(getFavoriteWordIds);
  const [showAddWord, setShowAddWord] = useState(false);
  const [visibleCount, setVisibleCount] = useState(30);
  const [customWord, setCustomWord] = useState({ word: '', meaning: '', phonetic: '', pos: 'noun', example: '', exampleTranslation: '', topic: 'Từ cá nhân' });
  const [inlineExplanations, setInlineExplanations] = useState<Record<string, { loading: boolean, content: string | null, error: string | null }>>({});

  const normalizedQuery = query.trim().toLocaleLowerCase('vi');
  const words = VOCABULARY.filter((word) => {
    if (selectedTopic !== 'Tất cả' && word.topic !== selectedTopic) return false;
    if (normalizedQuery && !`${word.word} ${word.meaning} ${word.topic}`.toLocaleLowerCase('vi').includes(normalizedQuery)) return false;
    const item = progress[word.id];
    if (statusFilter === 'new' && item) return false;
    if (statusFilter === 'learning' && (!item || item.repetitions >= 3)) return false;
    if (statusFilter === 'due' && (!item || new Date(item.nextReviewDate) > new Date())) return false;
    if (statusFilter === 'learned' && (!item || item.repetitions < 3)) return false;
    if (statusFilter === 'favorites' && !favorites.has(word.id)) return false;
    return true;
  });
  const visibleWords = words.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(30);
  }, [selectedTopic, query, statusFilter, vocabularyVersion]);

  const toggleFavorite = (wordId: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(wordId)) next.delete(wordId);
      else next.add(wordId);
      saveFavoriteWordIds(next);
      return next;
    });
  };

  const handleAddCustomWord = (event: React.FormEvent) => {
    event.preventDefault();
    if (!customWord.word.trim() || !customWord.meaning.trim()) {
      toast.error('Từ và nghĩa không được để trống.');
      return;
    }
    addCustomWord({
      ...customWord,
      word: customWord.word.trim(),
      meaning: customWord.meaning.trim(),
      phonetic: customWord.phonetic.trim(),
      example: customWord.example.trim(),
      exampleTranslation: customWord.exampleTranslation.trim(),
    });
    setCustomWord({ word: '', meaning: '', phonetic: '', pos: 'noun', example: '', exampleTranslation: '', topic: 'Từ cá nhân' });
    setVocabularyVersion((value) => value + 1);
    setSelectedTopic('Từ cá nhân');
    setShowAddWord(false);
    toast.success('Đã thêm từ cá nhân.');
  };

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
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <label className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <span className="sr-only">Tìm từ vựng</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm theo từ, nghĩa hoặc chủ đề..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500"
            />
          </label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-white"
            aria-label="Lọc trạng thái từ"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="new">Chưa học</option>
            <option value="learning">Đang học</option>
            <option value="due">Đến hạn ôn</option>
            <option value="learned">Đã thuộc</option>
            <option value="favorites">Yêu thích</option>
          </select>
          <Button onClick={() => setShowAddWord((value) => !value)} className="py-3 whitespace-nowrap">
            {showAddWord ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAddWord ? 'Đóng' : 'Thêm từ'}
          </Button>
        </div>

        {showAddWord && (
          <form onSubmit={handleAddCustomWord} className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-5">
            <input required placeholder="Từ tiếng Anh" value={customWord.word} onChange={(event) => setCustomWord({ ...customWord, word: event.target.value })} className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white" />
            <input required placeholder="Nghĩa tiếng Việt" value={customWord.meaning} onChange={(event) => setCustomWord({ ...customWord, meaning: event.target.value })} className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white" />
            <input placeholder="Phiên âm" value={customWord.phonetic} onChange={(event) => setCustomWord({ ...customWord, phonetic: event.target.value })} className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white" />
            <input placeholder="Chủ đề" value={customWord.topic} onChange={(event) => setCustomWord({ ...customWord, topic: event.target.value })} className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white" />
            <input placeholder="Ví dụ tiếng Anh" value={customWord.example} onChange={(event) => setCustomWord({ ...customWord, example: event.target.value })} className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white" />
            <input placeholder="Dịch ví dụ" value={customWord.exampleTranslation} onChange={(event) => setCustomWord({ ...customWord, exampleTranslation: event.target.value })} className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white" />
            <Button type="submit" className="sm:col-span-2 py-3">Lưu từ cá nhân</Button>
          </form>
        )}
      </div>

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
        {visibleWords.map(w => {
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
                      onClick={() => toggleFavorite(w.id)}
                      aria-label={favorites.has(w.id) ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
                      className={cn('p-2.5 sm:p-3 rounded-2xl bg-zinc-800 transition-all shadow-lg', favorites.has(w.id) ? 'text-rose-400' : 'text-zinc-400 hover:text-rose-400')}
                    >
                      <Heart className="w-5 h-5" fill={favorites.has(w.id) ? 'currentColor' : 'none'} />
                    </button>
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
                  {inlineExplanations[w.id] ? "Đóng giải thích" : "Giải thích bằng AI"}
                </Button>
              </div>
              <div className="px-5 sm:px-8 py-4 bg-[#09090b] flex justify-between items-center border-t border-zinc-800/50">
                <div className="flex gap-2">
                  {p && <button onClick={() => void onResetWord(w.id)} className="text-[10px] font-black uppercase text-amber-400 hover:text-amber-300">Học lại</button>}
                  {p && <button onClick={() => void onDelayWord(w.id)} className="text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300">Hoãn 1 ngày</button>}
                  {w.id.startsWith('custom-') && (
                    <button
                      onClick={() => {
                        deleteCustomWord(w.id);
                        setVocabularyVersion((value) => value + 1);
                      }}
                      className="text-[10px] font-black uppercase text-rose-400 hover:text-rose-300"
                    >
                      Xóa từ
                    </button>
                  )}
                  {!p && !w.id.startsWith('custom-') && <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Trạng thái</span>}
                </div>
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
      {visibleCount < words.length && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={() => setVisibleCount((count) => count + 30)}>
            Xem thêm ({words.length - visibleCount} từ)
          </Button>
        </div>
      )}
      {words.length === 0 && <div className="text-center py-16 text-zinc-500">Không tìm thấy từ phù hợp với bộ lọc.</div>}
    </motion.div>
  );
}
