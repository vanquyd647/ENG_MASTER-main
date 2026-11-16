import { buildDailyPlan } from "../domain/planner";
import type { StudyEvent } from "../types";

import { motion } from "motion/react";

import { Brain, Calendar, CheckCircle2, CheckSquare, ChevronRight, ClipboardList, FileDown, Flame, History, RotateCcw, Sparkles, Target, TrendingUp } from "lucide-react";
import { getVocabulary } from "../domain/catalog";
import { useCatalog } from "../domain/useCatalog";

import { getDueReviewQueue, getRemainingNewWordCount, getLocalDateKey, getSessionCorrectPercentage, getSessionStudiedCount, getStartedWordCount } from "../lib/learning";

import { cn } from "../lib/utils";
import { getStudySessionSize } from "../lib/productPreferences";
import type { DailyActivity, UserProfile, UserProgress } from "../types";
import { Button, Card } from "./ui";

type SyncAction = "tasks" | "calendar" | "drive";

export function Dashboard({ 
  profile, 
  progress, 
  todayActivity,
  onStartNewWords,
  onStartPlan,
  dailyActivities = {},
  onStartReview,
  onStartQuiz,
  onStartPractice,
  onSyncTasks,
  onSyncCalendar,
  onExportDrive,
  syncingAction,
  isGuest,
  syncStatus,
  onViewStats,
  onViewToday,
  onViewMistakes,
  onViewRoadmap,
  onViewWorkplace,
  events = [],
}: { 
  profile: UserProfile | null;
  onStartPlan: (ids: string[]) => void;
  dailyActivities?: Record<string, DailyActivity>;
  progress: UserProgress;
  todayActivity: DailyActivity | null;
  onStartNewWords: () => void;
  onStartReview: () => void;
  onStartQuiz: () => void;
  onStartPractice: () => void;
  onSyncTasks: () => void;
  onSyncCalendar: () => void;
  onExportDrive: () => void;
  syncingAction: SyncAction | null;
  isGuest: boolean;
  syncStatus: string;
  onViewStats: () => void;
  onViewToday?: () => void;
  onViewMistakes?: () => void;
  onViewRoadmap?: () => void;
  onViewWorkplace?: () => void;
  events?: StudyEvent[];
}) {
  useCatalog();
  const sessionSize = getStudySessionSize();
  const reviewCount = Math.min(getDueReviewQueue(progress).length, sessionSize);
  const dailyGoal = profile?.dailyGoal || 15;
  const todayStudiedCount = new Set([...(todayActivity?.dateKey === getLocalDateKey() ? todayActivity.wordIds : []), ...events.filter((event) => getLocalDateKey(new Date(event.occurredAt), event.timeZone) === getLocalDateKey()).map((event) => event.wordId)]).size;
  const dailyPlan = buildDailyPlan(progress, dailyGoal).map((word) => ({ word, progress: progress[word.id] }));
  const weakWords = getVocabulary()
    .filter((word) => (progress[word.id]?.wrongCount || 0) > 0)
    .sort((a, b) => (progress[b.id]?.wrongCount || 0) - (progress[a.id]?.wrongCount || 0))
    .slice(0, 5);
  const syncDisabled = syncingAction !== null || isGuest;
  const startedWordCount = getStartedWordCount(progress);
  const remainingNewWordCount = getRemainingNewWordCount(progress);
  const newWordSessionCount = Math.min(remainingNewWordCount, sessionSize);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {onViewToday&&<Card className="space-y-3 border-indigo-500/30"><h2 className="text-xl font-bold">Học hôm nay</h2><p className="text-sm text-zinc-400">Ôn đến hạn → chữa lỗi → học mới → bài áp dụng. Tiếp tục phiên ngắn đang dở trên thiết bị.</p><Button onClick={onViewToday}>Mở Học hôm nay</Button></Card>}
      {onViewWorkplace&&<Button onClick={onViewWorkplace}>Bài học · Ngữ pháp · Part 1–7</Button>}
      {(onViewMistakes||onViewRoadmap)&&<div className="grid gap-3 sm:grid-cols-2">{onViewMistakes&&<Button variant="outline" onClick={onViewMistakes}>Sổ lỗi sai · ôn câu đã làm</Button>}{onViewRoadmap&&<Button variant="outline" onClick={onViewRoadmap}>Lộ trình theo ngày thi</Button>}</div>}
      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-[#0c0c0e] text-white border-zinc-800 shadow-2xl flex flex-col justify-between min-h-[auto] sm:min-h-[280px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-600/10 blur-[100px] -mr-32 -mt-32" />
          <div className="relative z-10 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
              <div className={cn(
                "px-3 py-1 rounded-full w-fit text-[10px] font-black tracking-widest inline-flex items-center gap-1.5 border uppercase",
                isGuest
                  ? "bg-zinc-800/60 text-zinc-400 border-zinc-700"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              )}>
                <Sparkles className="w-3 h-3" />
                {syncStatus}
              </div>
              <div className="grid grid-cols-3 gap-2 sm:flex">
                <Button 
                  onClick={onSyncTasks} 
                  disabled={syncDisabled} 
                  variant="outline" 
                  className="rounded-full py-1.5 px-2 sm:px-3 text-[9px] border-zinc-800 bg-zinc-900/50 hover:bg-indigo-600 hover:border-indigo-500"
                >
                  <ClipboardList className="w-3 h-3" />
                  {syncingAction === 'tasks' ? "Syncing..." : "Tasks"}
                </Button>
                <Button 
                  onClick={onExportDrive} 
                  disabled={syncDisabled} 
                  variant="outline" 
                  className="rounded-full py-1.5 px-2 sm:px-3 text-[9px] border-zinc-800 bg-zinc-900/50 hover:bg-emerald-600 hover:border-emerald-500"
                >
                  <FileDown className="w-3 h-3" />
                  {syncingAction === 'drive' ? "Exporting..." : "Drive"}
                </Button>
                <Button 
                  onClick={onSyncCalendar} 
                  disabled={syncDisabled} 
                  variant="outline" 
                  className="rounded-full py-1.5 px-2 sm:px-3 text-[9px] border-zinc-800 bg-zinc-900/50 hover:bg-rose-600 hover:border-rose-500"
                >
                  <Calendar className="w-3 h-3" />
                  {syncingAction === 'calendar' ? "Syncing..." : "Calendar"}
                </Button>
              </div>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter leading-tight break-words">Chào mừng,<br />{profile?.displayName}!</h2>
          </div>
          <div className="relative z-10 mt-8 space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Button onClick={onStartNewWords} disabled={newWordSessionCount === 0} className="w-full bg-white text-black hover:bg-zinc-100 px-3 py-4 rounded-[20px] text-sm sm:text-base font-bold shadow-2xl whitespace-nowrap">
              Học từ mới ({newWordSessionCount})
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Button onClick={onStartReview} disabled={reviewCount === 0} variant="secondary" className="w-full px-3 py-4 rounded-[20px] text-sm sm:text-base font-bold border border-zinc-800 text-indigo-300 whitespace-nowrap">
              Ôn tập ({reviewCount})
              <RotateCcw className="w-5 h-5" />
            </Button>
            <Button onClick={onStartQuiz} variant="secondary" className="w-full px-3 py-4 rounded-[20px] text-sm sm:text-base font-bold border border-zinc-800 whitespace-nowrap">
              Kiểm tra
              <CheckSquare className="w-5 h-5" />
            </Button>
            <Button onClick={onStartPractice} variant="secondary" className="w-full px-3 py-4 rounded-[20px] text-sm sm:text-base font-bold border border-zinc-800 text-indigo-400 hover:text-indigo-300 whitespace-nowrap">
              Luyện tự do
              <Target className="w-5 h-5" />
            </Button>
            </div>
            <div className="flex gap-3 sm:gap-4 items-center">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0c0c0e] bg-zinc-800 shadow-lg" />)}
              </div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{dailyPlan.length} từ trong kế hoạch hôm nay</span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <Card className="flex flex-col items-center justify-center text-center p-4 sm:p-6 border-zinc-800/50 bg-[#0c0c0e]/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-500/10 rounded-[18px] sm:rounded-[22px] flex items-center justify-center mb-4 border border-orange-500/20 relative">
              <Flame 
                className="text-orange-500 w-6 h-6 sm:w-7 sm:h-7" 
                fill={(profile?.streak || 0) > 0 ? "currentColor" : "none"} 
              />
              {(profile?.streak || 0) > 2 && (
                <motion.div 
                  className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white">{profile?.streak || 0}</div>
            <div className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.2em] mt-2 mb-6">Ngày liên tiếp</div>
            
            {/* 7-day mini heatmap representation */}
            <div className="flex gap-1 w-full justify-center">
              {Array.from({ length: 7 }).map((_, i) => {
                // Calculate if studied on this day (simplified representation)
                // Just visually filling it based on `streak` for a simple robust UI if accurate history filtering is complex inline
                // A better approach: 
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                
                // Let's accurately see if there's history for this day.
                const hasStudied = Boolean(dailyActivities[getLocalDateKey(date)]?.wordIds.length) || events.some((event) => getLocalDateKey(new Date(event.occurredAt), event.timeZone) === getLocalDateKey(date));
                
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div 
                      className={cn(
                        "w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-[5px] sm:rounded-[6px] border transition-all duration-300",
                        hasStudied 
                          ? "bg-orange-500 border-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.4)]" 
                          : "bg-zinc-800/40 border-zinc-700/50"
                      )}
                    />
                    <span className="text-[9px] text-zinc-600 font-bold">
                      {date.toLocaleDateString('vi-VN', { weekday: 'short' }).charAt(0)}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card className="flex flex-col items-center justify-center text-center py-8 sm:py-10 border-zinc-800/50 bg-[#0c0c0e]/50">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500/10 rounded-[18px] sm:rounded-[22px] flex items-center justify-center mb-4 border border-emerald-500/20">
              <CheckCircle2 className="text-emerald-500 w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white">{startedWordCount}</div>
            <div className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.2em] mt-2">Từ đã bắt đầu</div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-zinc-800/50 bg-[#0c0c0e]/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Kế hoạch hôm nay
              </h3>
              <p className="text-sm text-zinc-500 mt-1">Ưu tiên từ đến hạn, từ sai nhiều và từ mới.</p>
              <Button onClick={()=>onStartPlan(dailyPlan.map(item=>item.word.id))} disabled={!dailyPlan.length} variant="outline" className="mt-3">Học theo kế hoạch</Button>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-indigo-400">{Math.min(todayStudiedCount, dailyGoal)} / {dailyGoal}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">mục tiêu ngày</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dailyPlan.slice(0, 6).map(({ word, progress: item }) => (
              <div key={word.id} className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="min-w-0">
                  <div className="font-bold text-white truncate">{word.word}</div>
                  <div className="text-xs text-zinc-500 truncate">{word.meaning}</div>
                </div>
                <span className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase border",
                  item?.wrongCount
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    : item
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                )}>
                  {item && Date.parse(item.nextReviewDate)<=Date.now() ? "Đến hạn" : item?.wrongCount ? "Từ yếu · ôn thêm" : item ? "Ôn trước hạn" : "Từ mới"}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-zinc-800/50 bg-[#0c0c0e]/50">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-5">
            <Brain className="w-5 h-5 text-rose-400" />
            Từ cần luyện thêm
          </h3>
          {weakWords.length > 0 ? (
            <div className="space-y-3">
              {weakWords.map((word) => (
                <div key={word.id} className="rounded-2xl border border-rose-500/10 bg-rose-500/5 p-3">
                  <div className="flex justify-between gap-3">
                    <span className="font-bold text-white">{word.word}</span>
                    <span className="text-xs font-black text-rose-400">{progress[word.id]?.wrongCount || 0} lỗi</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{word.meaning}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 leading-relaxed">Chưa có từ yếu. Làm quiz hoặc ôn tập để hệ thống ghi nhận các từ cần luyện thêm.</p>
          )}
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-400" />
            Tiến độ học tập
          </h3>
          <Button 
            onClick={onViewStats} 
            variant="outline" 
            className="rounded-full py-2 px-4 text-xs bg-zinc-900 border-zinc-850 hover:bg-zinc-800 hover:text-indigo-400 hover:border-indigo-505/50 flex items-center gap-2 font-black tracking-wide"
          >
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Biểu đồ chi tiết
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
          {[
            { label: 'Từ mới', color: 'text-indigo-400' },
            { label: 'Đang học', color: 'text-orange-400' },
            { label: 'Đã thuộc', color: 'text-emerald-400' },
            { label: 'Thành thạo', color: 'text-indigo-600' }
          ].map((item, i) => {
            const counts = Object.values(progress).filter(p => {
              if (i === 0) return false;
              if (i === 1) return p.repetitions < 3;
              if (i === 2) return p.repetitions >= 3 && p.repetitions < 7;
              return p.repetitions >= 7;
            }).length;
            
            const finalCount = i === 0 ? remainingNewWordCount : counts;

            return (
              <Card key={item.label} className="p-4 sm:p-6 flex flex-col gap-2 border-zinc-800/50 bg-[#0c0c0e]/50 hover:border-zinc-700 transition-colors">
                <div className={cn("text-2xl sm:text-3xl font-black", item.color)}>{finalCount}</div>
                <div className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">{item.label}</div>
              </Card>
            );
          })}
        </div>
      </div>

      {profile?.history && profile.history.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-zinc-800/50 mt-12">
          <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <History className="w-6 h-6 text-zinc-400" />
            Lịch sử học tập
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.history.map(session => (
              <Card key={session.id} className="p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-zinc-800/50 bg-[#0c0c0e]/50 hover:bg-zinc-900 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-[16px] flex items-center justify-center border",
                    session.type === 'quiz' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                  )}>
                    {session.type === 'quiz' ? <CheckSquare className="w-5 h-5" /> : <RotateCcw className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-[15px]">
                      {session.type === 'quiz' ? 'Kiểm tra từ vựng' : 'Ôn tập SRS'}
                    </h4>
                    <p className="text-zinc-500 text-xs font-semibold mt-0.5">{session.details}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right sm:pl-4">
                  {session.score && (
                    <div className="flex flex-col items-end">
                       {session.type === 'quiz' ? (
                          <div className="flex items-baseline gap-1">
                             <span className="font-black text-rose-400 text-xl tracking-tighter">
                                {getSessionCorrectPercentage(session)}%
                             </span>
                             <span className="text-zinc-600 font-bold text-xs">đúng</span>
                          </div>
                       ) : (
                          <div className="flex items-baseline gap-1">
                             <span className="font-black text-indigo-400 text-xl tracking-tighter">
                                {getSessionStudiedCount(session)}
                             </span>
                             <span className="text-zinc-600 font-bold text-xs">từ</span>
                          </div>
                       )}
                    </div>
                  )}
                  <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider mt-1">
                    {new Date(session.date).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
