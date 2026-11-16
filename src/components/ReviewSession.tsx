import { reportError } from "../services/telemetry";
import { useSessionDraft } from "../features/study/useSessionDraft";
import { getWordById } from "../domain/catalog";
import { StudyCard } from "../features/study/StudyCard";
import { RatingControls } from "../features/study/RatingControls";
import { useActiveTime } from "../features/study/useActiveTime";
import type { StudyEvidence } from "../types";
import { speakEnglish } from "../services/speech";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { toast } from "react-hot-toast";

import { BookOpen, RotateCcw, Volume2 } from "lucide-react";
import { type Word } from "../domain/catalog";
import { useCatalog } from "../domain/useCatalog";

import { getDueReviewQueue, getNewWordQueue } from "../lib/learning";
import { calculateNextReview, initialSRS } from "../lib/srs";
import { cn } from "../lib/utils";
import { getStudySessionSize } from "../lib/productPreferences";
import type { ProgressItem, UserProgress } from "../types";
import { Button } from "./ui";

export function ReviewSession({ 
  progress, 
  mode,
  onSaveProgress,
  onFinish,
  onCancel,
  onLearnMore,
  selectedWordIds,
  resumeSessionId,
}: { 
  progress: UserProgress;
  mode: 'new' | 'review';
  selectedWordIds?: string[];
  resumeSessionId?: string;
  onSaveProgress: (wordId: string, item: ProgressItem, operationId?: string, evidence?: StudyEvidence) => Promise<UserProgress>;
  onFinish: (p: UserProgress, wordIds: string[], sessionId: string) => Promise<void>;
  onCancel: () => void;
  onLearnMore: (word: string, meaning: string) => void;
}) {
  useCatalog();
  const [sessionWords, setSessionWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newProgress, setNewProgress] = useState<UserProgress>({ ...progress });
  const sessionId = useRef<string>(resumeSessionId || crypto.randomUUID());
  const takeActiveSeconds = useActiveTime();
  const draft = useSessionDraft();
  const draftKind = mode === "new" ? "review-new" : "review-review";
  const saving = useRef(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      const loaded = selectedWordIds?.length && !resumeSessionId ? null : await draft.load(draftKind, progress);
      const existing = loaded && (!resumeSessionId || (loaded.id === resumeSessionId && JSON.stringify(loaded.wordIds) === JSON.stringify(selectedWordIds))) ? loaded : null;
      if (!active) return;
      if (existing) {
        sessionId.current = existing.id; setSessionWords(existing.wordIds.map((id) => getWordById(id)!)); setCurrentIndex(existing.cursor);
      } else {
        const words = (selectedWordIds?.length ? selectedWordIds.map(id => getWordById(id)).filter((word): word is Word => Boolean(word)) : mode === "new" ? getNewWordQueue(progress) : getDueReviewQueue(progress)).slice(0, getStudySessionSize());
        if (words.length) await draft.save({ id: sessionId.current, kind: draftKind, wordIds: words.map((word) => word.id), cursor: 0, completedIds: [], updatedAt: new Date().toISOString() });
        if (active) setSessionWords(words);
      }
    };
    void initialize().catch((error) => toast.error(error.message));
    return () => { active = false; };
  }, [mode]);

  const handleRate = async (quality: number) => {
    if (saving.current || !isFlipped) return;
    saving.current = true;
    setIsSaving(true);
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
    if (quality < 3) {
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

    try {
      const savedProgress = await onSaveProgress(word.id, updatedProgress[word.id], `${sessionId.current}:${word.id}`, { sessionId: sessionId.current, mode: "review", quality, durationSeconds: takeActiveSeconds() });
      setNewProgress(savedProgress);
      await draft.save({ id: sessionId.current, kind: draftKind, wordIds: sessionWords.map((entry) => entry.id), cursor: Math.min(currentIndex + 1, sessionWords.length - 1), completedIds: sessionWords.slice(0, currentIndex + 1).map((entry) => entry.id), updatedAt: new Date().toISOString() });
      if (currentIndex < sessionWords.length - 1) {
        await new Promise((resolve) => window.setTimeout(resolve, 150));
        setCurrentIndex((index) => Math.min(index + 1, sessionWords.length - 1));
        setIsFlipped(false);
      } else {
        await onFinish(savedProgress, sessionWords.map((entry) => entry.id), sessionId.current);
        await draft.finish(draftKind);
        toast.success(mode === 'new' ? 'Đã hoàn thành phiên học từ mới!' : 'Đã hoàn thành phiên ôn tập!');
      }
    } catch (err) {
      reportError("ReviewSession",err);
      toast.error('Chưa lưu được phiên học. Hãy thử lại trên thẻ này.');
    } finally {
      saving.current = false;
      setIsSaving(false);
    }
  };

  const finishEarly = async () => {
    if (saving.current || !window.confirm('Kết thúc phiên và ghi nhận các từ đã chấm?')) return;
    saving.current = true; setIsSaving(true);
    try { const completed = sessionWords.filter(word => newProgress[word.id]?.lastOperationId === sessionId.current + ':' + word.id).map(word => word.id);
      if (completed.length) await onFinish(newProgress, completed, sessionId.current); else onCancel();
      await draft.finish(draftKind);
    } catch (error) { toast.error((error as Error).message); } finally { saving.current = false; setIsSaving(false); }
  };
  const currentWord = sessionWords[currentIndex];

  const speak = (event: React.MouseEvent | null, text: string | undefined) => { event?.stopPropagation(); speakEnglish(text); };

  const flipCard = () => {
    if (saving.current) return;
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
        <Button onClick={() => draft.pause(onCancel)} variant="primary" className="w-full py-4 rounded-2xl">Quay lại tổng quan</Button>
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

      <p className="text-center text-xs text-zinc-400">Enter/Space: lật thẻ · phím 1–4: chọn mức nhớ sau khi lật.</p>
      {/* Flashcard */}
      <div className="flex-grow flex items-center justify-center py-4 sm:py-10 perspective-1000">
        <StudyCard flipped={isFlipped} busy={isSaving} onFlip={flipCard} className="relative w-full max-w-[440px] h-[min(560px,74svh)] min-h-[420px] sm:h-[560px] preserve-3d cursor-pointer shadow-2xl shadow-black/50 rounded-[32px] sm:rounded-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950">
          {/* Front */}
          <div inert={isFlipped} aria-hidden={isFlipped} className={cn(
            "absolute inset-0 bg-zinc-900 border border-zinc-800 text-white p-6 sm:p-12 flex flex-col items-center justify-center text-center backface-hidden rounded-[32px] sm:rounded-[48px]",
            isFlipped ? "opacity-0 pointer-events-none" : "opacity-100"
          )}>
            <div className="absolute top-6 left-6 sm:top-10 sm:left-10 flex gap-2">
               <span className="bg-indigo-500/10 text-indigo-400 text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full border border-indigo-500/20">Từ vựng</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-4 break-words">{currentWord?.word}</h1>
            <div className="flex items-center gap-4 mb-8">
              <p className="text-base sm:text-xl font-mono text-zinc-500 italic">{currentWord?.phonetic}</p>
              <button 
                onClick={(e) => speak(e, currentWord?.word)}
                title="Phát âm tiếng Anh"
                aria-label="Phát âm tiếng Anh"
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
          <div inert={!isFlipped} aria-hidden={!isFlipped} className={cn(
            "absolute inset-0 bg-zinc-900 border border-zinc-800 p-5 sm:p-8 flex flex-col gap-4 text-center backface-hidden rounded-[32px] sm:rounded-[48px] overflow-hidden",
            !isFlipped ? "rotate-y-180 opacity-0 pointer-events-none" : "rotate-y-180 opacity-100"
          )}>
             <div role="region" aria-label="Nghĩa và ví dụ" tabIndex={isFlipped ? 0 : -1} className="min-h-0 flex-1 w-full overflow-y-auto overscroll-contain px-1 py-2 [scrollbar-gutter:stable] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-xl">
              <div className="min-h-full flex flex-col items-center justify-center gap-5 sm:gap-6">
               <div className="w-full space-y-3">
                 <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug break-words">{currentWord?.meaning}</h2>
                 <p className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.3em]">{currentWord?.pos}</p>
               </div>
               {currentWord?.example && <div className="h-px w-24 shrink-0 bg-zinc-800" />}
               <div className="w-full space-y-3 sm:space-y-4 break-words">
                 {currentWord?.example && <>
                   <p className="text-base sm:text-xl font-medium italic text-slate-300 leading-snug">"{currentWord.example}"</p>
                   <p className="text-[15px] text-zinc-500 font-medium leading-relaxed">{currentWord.exampleTranslation}</p>
                 </>}
               </div>
              </div>
            </div>
            <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLearnMore(currentWord.word, currentWord.meaning);
                  }}
                  className="mx-auto shrink-0 min-h-11 max-w-full text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-5 py-3 rounded-full border border-indigo-500/20 hover:bg-indigo-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-all tracking-[0.15em]"
                 >
                   Giải thích bằng AI
                 </button>
            <div className="w-full shrink-0 border-t border-zinc-800 pt-4">
              <RatingControls disabled={isSaving || !isFlipped} previous={progress[currentWord?.id]} onRate={(quality) => void handleRate(quality)} />
            </div>
          </div>
        </StudyCard>
      </div>

      <div className="flex justify-center">
        <Button onClick={finishEarly} disabled={isSaving} variant="outline" className="mt-3">Kết thúc sớm</Button>
        <Button onClick={() => draft.pause(onCancel)} disabled={isSaving} variant="ghost" className="text-zinc-500 font-black uppercase tracking-widest text-[10px] hover:text-rose-500 mt-8">
          Hủy bỏ phiên học
        </Button>
      </div>
    </div>
  );
}
