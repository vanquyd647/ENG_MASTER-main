import { DraftNotice } from "./DraftNotice";
import { PwaNotice } from "./PwaNotice";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { lazy, Suspense, useState, useEffect } from 'react';
import { getActiveOwner, readOwnerItem } from '../repositories/ownerStorage';
import type { MistakeRecord } from '../domain/mistakes';
import type { PracticeSelection } from '../features/study/WorkplaceView';
const TodayLearningView = lazy(() => import('../features/study/TodayLearningView'));

import { getVocabulary } from "../domain/catalog";

import { BookOpen, GraduationCap, LayoutDashboard, LogIn, LogOut, CheckSquare, Target, Settings, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { toast, Toaster } from 'react-hot-toast';
const AiExplanation = lazy(() => import("../features/study/AiExplanation"));
import { cn } from '../lib/utils';
import { completeOnboarding } from '../lib/productPreferences';
import { Button, Modal } from "../components/ui";

const StatsView = lazy(() =>
  import('../components/StatsView').then((module) => ({ default: module.StatsView }))
);
const Dashboard = lazy(() =>
  import("../components/Dashboard").then((module) => ({ default: module.Dashboard }))
);
const Browse = lazy(() =>
  import("../components/Browse").then((module) => ({ default: module.Browse }))
);
const QuizSession = lazy(() =>
  import("../components/QuizSession").then((module) => ({ default: module.QuizSession }))
);
const ReviewSession = lazy(() =>
  import("../components/ReviewSession").then((module) => ({ default: module.ReviewSession }))
);
const PracticeSession = lazy(() =>
  import("../components/PracticeSession").then((module) => ({ default: module.PracticeSession }))
);
const SettingsView = lazy(() =>
  import("../components/SettingsView").then((module) => ({ default: module.SettingsView }))
);

const DocumentImportView=lazy(()=>import('../features/study/DocumentImportView'));
const WorkplaceView=lazy(()=>import('../features/study/WorkplaceView'));
const MistakesView=lazy(()=>import('../features/study/MistakesView'));
const RoadmapView=lazy(()=>import('../features/study/RoadmapView'));

// --- Main App ---

// --- Main App ---
// --- Main App ---
// --- Main App ---
import type { useAppController } from "./useAppController";
export function AppShell({ controller }: { controller: ReturnType<typeof useAppController> }) {
 const [learningIntent, setLearningIntent] = useState<{ scope: string; id: string; mistake?: MistakeRecord; practice?: PracticeSelection } | null>(null);
 const { datasetPreparing, cancelDatasetJob, rollbackDataset, datasetConflict, exportDeviceBackup, adoptCloudDataset, calendarOpen,setCalendarOpen,calendarId,setCalendarId,calendarTime,setCalendarTime, dailyActivities, cancelExplanation, guestMerge, mergingGuest, dismissGuestMerge, confirmGuestMerge, selectedWordIds, setSelectedWordIds, startSelectedWords, events, syncStatus, syncNow, user, isGuest, profile, progress, todayActivity, currentView, setCurrentView, studyMode, setStudyMode, loading, explainingWord, isExplaining, syncingAction, showOnboarding, setShowOnboarding, recoveryError, isWriting, fetchUserData, login, isSigningIn, handleGuestLogin, logout, syncToGoogleCalendar, syncToGoogleTasks, exportToGoogleDrive, persistProgressItem, resetWordProgress, delayWordReview, handleLearnMore, reviewSessionOnFinish, quizSessionOnFinish, quizSessionOnWordResult, practiceSessionOnFinish, practiceSessionOnUpdateProgress, settingsViewOnImportBackup, settingsViewOnUpdateProfile, settingsViewOnResetProgress } = controller;
  const learningScope = getActiveOwner() + ':' + (profile?.datasetGeneration || 'legacy') + ':' + (readOwnerItem('eng_master_local_dataset_revision_v1') || 'legacy');
  const intent = learningIntent?.scope === learningScope ? learningIntent : null;
  useEffect(() => { if (currentView !== 'quiz' && currentView !== 'workplace') setLearningIntent(null); }, [currentView]);
  const openPracticeQuestions = (practice: PracticeSelection) => { setLearningIntent({ scope: learningScope, id: crypto.randomUUID(), practice }); setCurrentView('workplace'); };
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

  if (recoveryError) return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-950 text-white">
      <div className="max-w-md space-y-5">
        <h1 className="text-xl font-bold">Cần phục hồi dữ liệu học tập</h1>
        <p>{recoveryError}</p>
        {datasetConflict ? <><Button disabled={isWriting} onClick={()=>void exportDeviceBackup()}>Tải bản sao dữ liệu thiết bị</Button><Button disabled={isWriting} onClick={()=>void adoptCloudDataset()}>Tải Cloud mới và giữ bản cũ trên thiết bị</Button></> : <Button onClick={() => user && void fetchUserData(user.uid)}>Thử phục hồi lại</Button>}
        <Button variant="outline" onClick={logout}>Đăng xuất</Button>
      </div>
    </div>
  );

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
              <p className="text-zinc-500 text-base sm:text-lg font-medium">Học từ vựng thông minh với SM-2</p>
            </div>
          </div>
          <div className="space-y-4">
            <Button onClick={login} disabled={isSigningIn} className="w-full py-3.5 sm:py-4 text-base sm:text-lg rounded-2xl">
              {isSigningIn ? 'Đang mở Google...' : 'Đăng nhập với Google'}
            </Button>
            <Button onClick={handleGuestLogin} disabled={isSigningIn} variant="outline" className="w-full py-3.5 sm:py-4 text-base sm:text-lg rounded-2xl border-zinc-800 text-zinc-400 hover:text-white">
              Tiếp tục với tư cách Khách
            </Button>
          </div>
          <div className="pt-8 sm:pt-10 border-t border-zinc-800/50 grid grid-cols-3 gap-2 sm:gap-4 text-[9px] sm:text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            <div className="space-y-2">
              <div className="text-slate-300 text-lg sm:text-xl font-bold tracking-tight">{getVocabulary().length.toLocaleString('vi-VN')}</div>
              <div>Từ vựng</div>
            </div>
            <div className="space-y-2 border-x border-zinc-800/50">
              <div className="text-slate-300 text-lg sm:text-xl font-bold tracking-tight">SM-2</div>
              <div>Thuật toán</div>
            </div>
            <div className="space-y-2">
              <div className="text-slate-300 text-lg sm:text-xl font-bold tracking-tight">{new Set(getVocabulary().map((word) => word.topic)).size}</div>
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
      {isSigningIn && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/70 p-6" role="status" aria-live="polite"><p className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6 text-center">Hoàn tất đăng nhập trong cửa sổ Google. Dữ liệu trên thiết bị đang được giữ nguyên.</p></div>}
      
      {!isGuest && <div className="max-w-7xl mx-auto pt-3 px-4 md:pt-24 flex flex-wrap gap-3 text-xs text-zinc-400"><span role="status">{syncStatus}</span><button onClick={() => void syncNow(true)} className="underline text-indigo-300">Thử đồng bộ</button></div>}
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
              { id: 'dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
              { id: 'browse', icon: BookOpen, label: 'Thư viện' },
              { id: 'quiz', icon: CheckSquare, label: 'Kiểm tra' },
              { id: 'practice', icon: Target, label: 'Luyện tập' },
              { id: 'stats', icon: TrendingUp, label: 'Thống kê' },
            ].map((item) => (
              <button
                key={item.id}
                disabled={isWriting}
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
            <button disabled={isWriting} aria-label="Mở cài đặt" onClick={() => setCurrentView('settings')} className="p-3 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-all text-zinc-500 shadow-lg hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
              <Settings className="w-5 h-5" />
            </button>
            <button disabled={isWriting} aria-label="Đăng xuất" onClick={logout} className="p-3 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-all text-zinc-500 shadow-lg hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex justify-end gap-2 px-3 pt-3 md:hidden">
        <button disabled={isWriting} aria-label="Mở cài đặt" onClick={() => setCurrentView('settings')} className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-950/90 backdrop-blur-xl text-zinc-400 shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
          <Settings className="w-5 h-5" />
        </button>
        <button disabled={isWriting} aria-label="Đăng xuất" onClick={logout} className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-950/90 backdrop-blur-xl text-zinc-400 shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <Modal isOpen={Boolean(guestMerge)} onClose={() => { if (!mergingGuest) dismissGuestMerge(); }} title="Gộp dữ liệu Khách vào tài khoản">
        {guestMerge && <div className="space-y-4"><p>Trên thiết bị có {Object.keys(guestMerge.progress).length} từ đã học và {guestMerge.customWords.length} từ cá nhân, {guestMerge.favorites.length} từ yêu thích và {guestMerge.decks?.length || 0} bộ từ của dữ liệu Khách/thiết bị.</p><p>{Object.keys(guestMerge.progress).filter(id=>progress[id]).length} từ trùng tiến độ: giữ giá trị tài khoản. Yêu thích, bộ từ và lịch sử được gộp; hồ sơ tài khoản giữ nguyên. Bản Khách vẫn được giữ riêng.</p><Button disabled={mergingGuest} onClick={confirmGuestMerge}>{mergingGuest ? 'Đang gộp...' : 'Gộp dữ liệu'}</Button><Button disabled={mergingGuest} variant="outline" onClick={dismissGuestMerge}>Giữ riêng</Button></div>}
      </Modal>
      <Modal isOpen={calendarOpen} onClose={()=>{if(!syncingAction)setCalendarOpen(false);}} title="Lên lịch học trên Google Calendar"><div className="space-y-4"><label className="block text-sm">Ngày và giờ học<input type="datetime-local" value={calendarTime} onChange={event=>setCalendarTime(event.target.value)} className="block w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 mt-2" /></label><label className="block text-sm">Lịch Google (primary là lịch chính)<input value={calendarId} onChange={event=>setCalendarId(event.target.value)} className="block w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 mt-2" /></label><p className="text-xs text-zinc-400">Phiên dài 30 phút, báo trước 10 phút. Google sẽ yêu cầu quyền ghi lịch khi bạn xác nhận.</p><Button disabled={Boolean(syncingAction)} onClick={()=>void syncToGoogleCalendar(true)}>Xác nhận lịch học</Button></div></Modal>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-28 pt-6 md:pt-32">
        {isGuest && <section aria-label="Đồng bộ dữ liệu Khách" className="mb-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <h2 className="font-bold text-white">Bạn đang học với tư cách Khách</h2>
            <p className="mt-1 text-sm text-zinc-400">Tiến độ đang lưu trên thiết bị. Đăng nhập Google để gộp dữ liệu vào tài khoản và đồng bộ.</p>
          </div>
          <Button onClick={login} disabled={isWriting || isSigningIn} className="mt-4 w-full shrink-0 sm:mt-0 sm:w-auto">
            <LogIn className="mr-2 inline-block h-4 w-4" aria-hidden="true" />Đăng nhập để đồng bộ
          </Button>
        </section>}
        {!isGuest && datasetPreparing && !isWriting && <div role="status" className="mb-4 rounded-xl border border-amber-500/30 p-4 text-sm text-amber-200"><p>Có một lần khôi phục đang dở trên tài khoản. Dữ liệu đang dùng vẫn được giữ; thao tác mới sẽ chờ đồng bộ.</p><Button variant="outline" onClick={()=>void cancelDatasetJob().catch(error=>toast.error(error.message))}>Dừng lần khôi phục</Button></div>}
        <PwaNotice busy={isWriting} />
        <Suspense fallback={<div className="py-24 text-center text-zinc-500 font-bold">Đang tải...</div>}>
          {currentView === 'dashboard' && (
            <div key="dashboard" className="space-y-8">
              <DraftNotice onResume={draft=>{setSelectedWordIds([]);if(draft.kind.startsWith("review")){setStudyMode(draft.kind==="review-new"?"new":"review");setCurrentView("review");}else setCurrentView(draft.kind as "practice" | "quiz");}} />
              <Dashboard 
                dailyActivities={dailyActivities}
                onViewToday={()=>setCurrentView('today')}
                onViewMistakes={()=>setCurrentView('mistakes')}
                onViewRoadmap={()=>setCurrentView('roadmap')}
                onViewWorkplace={()=>setCurrentView('workplace')}
                onStartPlan={startSelectedWords}
                profile={profile} 
                events={events}
                progress={progress} 
                todayActivity={todayActivity}
                onStartNewWords={() => {
                  setSelectedWordIds([]); setStudyMode('new');
                  setCurrentView('review');
                }}
                onStartReview={() => {
                  setSelectedWordIds([]); setStudyMode('review');
                  setCurrentView('review');
                }}
                onStartQuiz={() => {setSelectedWordIds([]);setCurrentView('quiz');}}
                onStartPractice={() => setCurrentView('practice')}
                onSyncTasks={() => syncToGoogleTasks()}
                onSyncCalendar={() => syncToGoogleCalendar()}
                onExportDrive={exportToGoogleDrive}
                syncingAction={syncingAction}
                isGuest={isGuest}
                syncStatus={syncStatus}
                onViewStats={() => setCurrentView('stats')}
              />
            </div>
          )}
          {currentView === 'browse' && (
            <Browse key="browse"
              onStudySelected={startSelectedWords}
              onImportWords={()=>setCurrentView('import-words')}
              progress={progress} 
              onLearnMore={handleLearnMore} 
              onSyncTask={syncToGoogleTasks}
              onResetWord={resetWordProgress}
              onDelayWord={delayWordReview}
            />
          )}
          {currentView === 'today' && <TodayLearningView key={"today-"+learningScope} progress={progress} events={events} datasetGeneration={profile?.datasetGeneration || 'legacy'} onBack={()=>setCurrentView('dashboard',true)} onSaveProgress={persistProgressItem} onLearnMore={handleLearnMore} onWordResult={quizSessionOnWordResult} onQuizFinish={quizSessionOnFinish} onReviewFinish={async (_progress,wordIds,sessionId)=>{await controller.logSessionHistory({type:'review',score:wordIds.length+' từ',details:'Học hôm nay · hoàn thành '+wordIds.length+' thẻ',wordIds,sessionId});}} />}
          {currentView === 'review' && (
            <ReviewSession 
              selectedWordIds={selectedWordIds}
              key={`review-${studyMode}`}
              progress={progress} 
              mode={studyMode}
              onSaveProgress={persistProgressItem}
              onFinish={reviewSessionOnFinish}
              onCancel={() => setCurrentView('dashboard',true)}
              onLearnMore={handleLearnMore}
            />
          )}
          {currentView==='import-words'&&<DocumentImportView key="import-words" onBack={()=>setCurrentView('browse')} />}
          {currentView==='workplace'&&<WorkplaceView key={"workplace-"+(intent?.id || learningScope)} selection={intent?.practice} onBack={()=>setCurrentView('dashboard')} />}
          {currentView==='mistakes'&&<MistakesView key="mistakes" events={events} onBack={()=>setCurrentView('dashboard')} onPractice={ids=>{setLearningIntent(null);setSelectedWordIds(ids.slice(0,20));setCurrentView('quiz');}} onExactPractice={mistake=>{setLearningIntent({scope:learningScope,id:crypto.randomUUID(),mistake});setSelectedWordIds([mistake.wordId]);setCurrentView('quiz');}} onPracticeQuestions={openPracticeQuestions} />}
          {currentView==='roadmap'&&<RoadmapView key="roadmap" progress={progress} events={events} onBack={()=>setCurrentView('dashboard')} onStudy={startSelectedWords} />}
          {currentView === 'quiz' && (
            <QuizSession key={"quiz-"+(intent?.id || learningScope)} initialMistake={intent?.mistake}
              initialWordIds={selectedWordIds}
              progress={progress}
              onCancel={() => setCurrentView('dashboard')}
              onFinish={quizSessionOnFinish}
              onWordResult={quizSessionOnWordResult}
            />
          )}
          {currentView === 'practice' && (
            <PracticeSession key="practice"
              progress={progress}
              onCancel={() => setCurrentView('dashboard')}
              onFinish={practiceSessionOnFinish}
              onUpdateProgress={practiceSessionOnUpdateProgress}
            />
          )}
          {currentView === 'settings' && (
            <SettingsView key="settings"
              isGuest={isGuest}
              profile={profile}
              progress={progress}
              onCancel={() => setCurrentView('dashboard')}
              onImportBackup={settingsViewOnImportBackup}
              onUpdateProfile={settingsViewOnUpdateProfile}
              onRollbackDataset={rollbackDataset}
              onResetProgress={settingsViewOnResetProgress}
            />
          )}
          {currentView === 'stats' && (
            <Suspense key="stats" fallback={<div className="py-24 text-center text-zinc-500 font-bold">Đang tải thống kê...</div>}>
              <StatsView onPracticeQuestions={openPracticeQuestions}
                events={events}
                progress={progress}
                onBack={() => setCurrentView('dashboard')}
              />
            </Suspense>
          )}
        </Suspense>

        <Modal 
          isOpen={!!explainingWord} 
          onClose={cancelExplanation} 
          title={`Tìm hiểu thêm: ${explainingWord?.word}`}
          scrollBody
          className="max-w-3xl"
        >
          <Suspense fallback={<p>Đang tải giải thích...</p>}><AiExplanation content={explainingWord?.content || ""} meaning={explainingWord?.meaning} isLoading={isExplaining} error={controller.explanationError} onRetry={controller.retryExplanation} explanation={explainingWord?.explanation} word={explainingWord?.word} followup={controller.followup} isFollowingUp={controller.isFollowingUp} followupError={controller.followupError} followupNumber={controller.followupNumber} onFollowup={controller.followUpExplanation} onRetryFollowup={controller.retryFollowup} /></Suspense>
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
