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

export function QuizSession({ progress, onCancel, onFinish, onWordResult }: { progress: UserProgress; onCancel: () => void, onFinish?: (score: number, total: number, wordIds: string[]) => void, onWordResult?: (wordId: string, isCorrect: boolean) => void }) {
  const [quizMode, setQuizMode] = useState<'standard' | 'ai' | null>(null);
  const [questions, setQuestions] = useState<{ word: Word; questionText: string; options: string[]; answer: string; type: 'mcq' | 'fill'; hint?: string; translation?: string; explanation?: string; isAi?: boolean }[]>([]);
  const [missedAnswers, setMissedAnswers] = useState<{ word: Word; userAnswer: string; correctAnswer: string }[]>([]);
  const [mistakeReview, setMistakeReview] = useState<string | null>(null);
  const [isReviewingMistakes, setIsReviewingMistakes] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);
  const [quizScope, setQuizScope] = useState<'all' | 'studied' | 'mistakes'>('all');
  const [quizTopic, setQuizTopic] = useState('Tất cả');

  const startQuiz = async (mode: 'standard' | 'ai') => {
    setQuizMode(mode);
    setIsLoading(true);
    setCurrentIndex(0);
    setSelectedOption(null);
    setTypedAnswer('');
    setScore(0);
    setIsFinished(false);
    setShowAnswer(false);
    setShowHint(false);
    setMissedAnswers([]);
    setMistakeReview(null);

    const candidateWords = VOCABULARY.filter((word) => {
      if (quizTopic !== 'Tất cả' && word.topic !== quizTopic) return false;
      if (quizScope === 'studied' && !progress[word.id]) return false;
      if (quizScope === 'mistakes' && !(progress[word.id]?.wrongCount && progress[word.id].wrongCount! > 0)) return false;
      return true;
    });
    if (candidateWords.length === 0) {
      toast.error('Không có từ phù hợp với bộ lọc quiz.');
      setIsLoading(false);
      setQuizMode(null);
      return;
    }

    if (mode === 'standard') {
      try {
        const selectedWords = [...candidateWords]
          .sort(() => Math.random() - 0.5)
          .slice(0, questionCount);

        const localQuestions = selectedWords.map(word => {
          const distractors = VOCABULARY
            .filter(w => w.id !== word.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(w => w.meaning);
          
          const type = (Math.random() > 0.5 ? 'mcq' : 'fill') as 'mcq' | 'fill';
          
          if (type === 'fill') {
            return {
              word,
              questionText: `Hãy điền từ tiếng Anh có nghĩa là: "${word.meaning}"`,
              options: [],
              answer: word.word,
              type,
              isAi: false
            };
          } else {
            return {
              word,
              questionText: "Nghĩa của từ này là gì?",
              options: [...distractors, word.meaning].sort(() => Math.random() - 0.5),
              answer: word.meaning,
              type,
              isAi: false
            };
          }
        });
        setQuestions(localQuestions);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const selectedWords = [...candidateWords]
          .sort(() => Math.random() - 0.5)
          .slice(0, questionCount);

        const data = await callAiApi<{ questions: any[] }>('quiz', {
          words: selectedWords.map(w => ({
            word: w.word,
            meaning: w.meaning,
          })),
        });
        const aiQuestions = data.questions;

        const combined = selectedWords.map(word => {
          const aiQ = aiQuestions.find((q: any) => q.wordId === word.word || q.options?.includes(word.word) || q.answer === word.word);
          
          if (aiQ && aiQ.questionText) {
             return {
               word,
               questionText: aiQ.questionText,
               options: aiQ.options || [],
               answer: aiQ.answer,
               type: aiQ.type || 'mcq',
               hint: aiQ.hint,
               translation: aiQ.translation,
               explanation: aiQ.explanation,
               isAi: true
             };
          }

          // Fallback
          const type = (Math.random() > 0.5 ? 'mcq' : 'fill') as 'mcq' | 'fill';
          const distractors = VOCABULARY
            .filter(w => w.id !== word.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(w => w.meaning);
          
          if (type === 'fill') {
            return {
              word,
              questionText: `Hãy điền từ tiếng Anh có nghĩa là: "${word.meaning}"`,
              options: [],
              answer: word.word,
              type,
              isAi: false
            };
          } else {
            return {
              word,
              questionText: "Nghĩa của từ này là gì?",
              options: [...distractors, word.meaning].sort(() => Math.random() - 0.5),
              answer: word.meaning,
              type,
              isAi: false
            };
          }
        });

        setQuestions(combined);
      } catch (err) {
        console.error(err);
        toast.error(err instanceof Error ? `AI quiz: ${err.message}. Đang dùng quiz offline.` : 'Không thể tạo AI quiz, đang dùng quiz offline.');
        // Fallback local quiz
        const selectedWords = [...candidateWords].sort(() => Math.random() - 0.5).slice(0, questionCount);
        setQuestions(selectedWords.map(word => {
          const distractors = VOCABULARY.filter(w => w.id !== word.id).sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.meaning);
          const type = (Math.random() > 0.5 ? 'mcq' : 'fill') as 'mcq' | 'fill';
          
          if (type === 'fill') {
            return {
              word,
              questionText: `Hãy điền từ tiếng Anh có nghĩa là: "${word.meaning}"`,
              options: [],
              answer: word.word,
              type,
              isAi: false
            };
          } else {
            return {
              word,
              questionText: "Nghĩa của từ này là gì?",
              options: [...distractors, word.meaning].sort(() => Math.random() - 0.5),
              answer: word.meaning,
              type,
              isAi: false
            };
          }
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMCQSelect = (option: string) => {
    if (showAnswer) return;
    setSelectedOption(option);
    setShowAnswer(true);
    const isCorrect = option === questions[currentIndex].answer;
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setMissedAnswers(prev => [...prev, { word: questions[currentIndex].word, userAnswer: option, correctAnswer: questions[currentIndex].answer }]);
    }
    if (onWordResult) {
      onWordResult(questions[currentIndex].word.id, isCorrect);
    }
  };

  const handleFillSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (showAnswer || !typedAnswer.trim()) return;
    
    setShowAnswer(true);
    // Flexible matching: ignore case and trim
    const isCorrect = typedAnswer.trim().toLowerCase() === questions[currentIndex].answer.toLowerCase();
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setMissedAnswers(prev => [...prev, { word: questions[currentIndex].word, userAnswer: typedAnswer, correctAnswer: questions[currentIndex].answer }]);
    }
    setSelectedOption(typedAnswer);
    if (onWordResult) {
      onWordResult(questions[currentIndex].word.id, isCorrect);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setTypedAnswer('');
      setShowAnswer(false);
      setShowHint(false);
    } else {
      setIsFinished(true);
      const finalScore = questions.length - missedAnswers.length;
      if (onFinish) {
        onFinish(finalScore, questions.length, questions.map((question) => question.word.id));
      }
      if (missedAnswers.length > 0) {
        setIsReviewingMistakes(true);
        callAiApi<{ text?: string }>('mistake-review', {
            mistakes: missedAnswers.map((item) => ({
              word: item.word.word,
              meaning: item.word.meaning,
              userAnswer: item.userAnswer,
              correctAnswer: item.correctAnswer,
            })),
        })
          .then((data) => setMistakeReview(data.text || null))
          .catch((err) => {
            console.error(err);
            setMistakeReview(err instanceof Error ? err.message : null);
          })
          .finally(() => setIsReviewingMistakes(false));
      }
    }
  };

  if (!quizMode) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8 sm:space-y-12 py-4 sm:py-6 text-center"
      >
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Chọn chế độ kiểm tra
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto font-medium">
            Chọn cách bạn muốn kiểm tra từ vựng. Trắc nghiệm offline nhanh chóng hoặc tối ưu ngữ cảnh bằng AI thông minh bổ trợ.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left rounded-3xl border border-zinc-800 bg-zinc-900/40 p-4">
          <label>
            <span className="text-[10px] font-black uppercase text-zinc-500 block mb-2">Số câu</span>
            <select value={questionCount} onChange={(event) => setQuestionCount(Number(event.target.value))} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white">
              {[5, 10, 20].map((value) => <option key={value} value={value}>{value} câu</option>)}
            </select>
          </label>
          <label>
            <span className="text-[10px] font-black uppercase text-zinc-500 block mb-2">Phạm vi</span>
            <select value={quizScope} onChange={(event) => setQuizScope(event.target.value as typeof quizScope)} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white">
              <option value="all">Tất cả từ</option>
              <option value="studied">Từ đã học</option>
              <option value="mistakes">Từ hay sai</option>
            </select>
          </label>
          <label>
            <span className="text-[10px] font-black uppercase text-zinc-500 block mb-2">Chủ đề</span>
            <select value={quizTopic} onChange={(event) => setQuizTopic(event.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white">
              <option>Tất cả</option>
              {Array.from(new Set(VOCABULARY.map((word) => word.topic))).map((topic) => <option key={topic}>{topic}</option>)}
            </select>
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <Card ariaLabel="Bắt đầu kiểm tra tiêu chuẩn" onClick={() => startQuiz('standard')} className="p-5 sm:p-8 cursor-pointer hover:border-emerald-500 hover:bg-emerald-500/5 transition-all border-zinc-800 bg-[#0c0c0e] flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 group hover:scale-[1.02] shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 shrink-0 rounded-[20px] bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors border border-emerald-500/20">
              <CheckSquare className="w-8 h-8" />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-white text-xl">Kiểm tra tiêu chuẩn</h3>
              <p className="text-zinc-500 text-sm mt-1">Làm bài trắc nghiệm nhanh và điền từ vựng chuẩn xác từ thư viện. Tải ngay lập tức, không có thời gian chờ.</p>
            </div>
          </Card>
          
          <Card ariaLabel="Bắt đầu thử thách ngữ cảnh AI" onClick={() => startQuiz('ai')} className="p-5 sm:p-8 cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/5 transition-all border-zinc-800 bg-[#0c0c0e] flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 group hover:scale-[1.02] shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 shrink-0 rounded-[20px] bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors border border-indigo-500/20">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-white text-xl">Thử thách ngữ cảnh AI</h3>
              <p className="text-zinc-500 text-sm mt-1">Sử dụng mô hình AI Gemini tiên tiến sinh ngẫu nhiên các câu ngữ cảnh tiếng Anh đời sống & doanh nghiệp để điền từ khuyết thiếu.</p>
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

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-6">
        <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mx-auto" />
        <h2 className="text-xl font-bold font-mono tracking-widest uppercase text-indigo-400">✨ AI Generator ✨</h2>
        <p className="text-zinc-500 font-medium font-serif italic">Gemma AI is preparing your dynamic quiz...</p>
      </div>
    );
  }

  if (questions.length === 0) return null;

  if (isFinished) {
    const finalScore = questions.length - missedAnswers.length;
    const percentage = (finalScore / questions.length) * 100;
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto text-center space-y-10 py-10"
      >
        <div className="space-y-4">
          <div className="w-32 h-32 bg-indigo-600 rounded-[40px] mx-auto flex items-center justify-center shadow-2xl shadow-indigo-500/40 relative">
             <Trophy className="text-white w-16 h-16" />
             <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-black tracking-tighter">Kết quả bài thi</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Bạn đã hoàn thành thử thách!</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <div className="text-4xl font-black text-white">{finalScore} / {questions.length}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Câu trả lời đúng</div>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <div className="text-4xl font-black text-indigo-400">{percentage}%</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Độ chính xác</div>
          </Card>
        </div>

        {missedAnswers.length > 0 && (
          <Card className="bg-zinc-900 border-zinc-800 text-left">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="font-black text-white">AI Mistake Review</h3>
            </div>
            {isReviewingMistakes ? (
              <p className="text-sm text-zinc-500 font-medium">AI đang phân tích các lỗi sai...</p>
            ) : mistakeReview ? (
              <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                <ReactMarkdown>{mistakeReview}</ReactMarkdown>
              </div>
            ) : (
              <div className="space-y-2">
                {missedAnswers.map((item) => (
                  <div key={`${item.word.id}-${item.userAnswer}`} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                    <div className="font-bold text-white">{item.word.word}</div>
                    <div className="text-xs text-zinc-500">Bạn chọn: {item.userAnswer || 'trống'} · Đúng: {item.correctAnswer}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        <div className="space-y-3 pt-6">
          <Button onClick={() => { setQuizMode(null); setIsFinished(false); }} className="w-full py-4 text-lg">Làm lại bài thi</Button>
          <Button onClick={onCancel} variant="outline" className="w-full py-4 text-lg border-zinc-800 text-zinc-400">Về Dashboard</Button>
        </div>
      </motion.div>
    );
  }

  const current = questions[currentIndex];
  // Determine if this is a fallback or AI question. AI questions have isAi set to true.
  const isAiScenario = !!current.isAi;

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
      {/* Quiz Progress */}
      <div className="space-y-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-zinc-500">
          <span className="text-indigo-400 font-mono tracking-widest flex items-center gap-2">
            {isAiScenario ? (
              <>
                <Sparkles className="w-3 h-3 animate-pulse" />
                AI QUIZ
              </>
            ) : (
              <>
                <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                KIỂM TRA TIÊU CHUẨN
              </>
            )}
            - {current.type === 'mcq' ? 'TRẮC NGHIỆM' : 'ĐIỀN TỪ'}
          </span>
          <span className="text-white">Câu {currentIndex + 1} / {questions.length}</span>
        </div>
        <div className="h-2 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden p-0.5">
          <motion.div 
            className="h-full bg-indigo-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <Card className="p-5 sm:p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[260px] sm:min-h-[300px] bg-[#0c0c0e] border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />
        <div className="space-y-6 w-full max-w-2xl mx-auto pt-6">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
            {isAiScenario 
              ? "Complete the sentence" 
              : (current.type === 'fill' ? "Điền từ tiếng Anh tương ứng với nghĩa:" : "Nghĩa của từ này là gì?")
            }
          </span>
          
          <h2 className={cn(
            "font-black tracking-tighter text-white whitespace-pre-wrap leading-tight mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 break-words",
            isAiScenario 
              ? "text-2xl sm:text-3xl md:text-4xl text-left font-serif" 
              : (current.type === 'fill' ? "text-2xl sm:text-3xl md:text-5xl text-center" : "text-4xl sm:text-6xl text-center")
          )}>
            {isAiScenario 
              ? current.questionText 
              : (current.type === 'fill' ? current.word.meaning : current.word.word)
            }
            {!isAiScenario && (current.type !== 'fill' || showAnswer) && (
              <button 
                type="button"
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance(current.word.word);
                  utterance.lang = 'en-US';
                  window.speechSynthesis.speak(utterance);
                }}
                className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all shadow-lg shrink-0"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            )}
          </h2>
          
          {!isAiScenario && (current.type !== 'fill' || showAnswer) && (
            <p className="text-xl font-mono text-zinc-600 italic">/{current.word.phonetic}/</p>
          )}
        </div>

        {current.type === 'mcq' ? (
          <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 pt-10">
            {current.options.map((option, idx) => {
              const isCorrect = option === current.answer;
              const isSelected = option === selectedOption;
              
              let btnClass = "border-zinc-800 bg-zinc-900 text-slate-300 hover:border-zinc-700";
              if (showAnswer) {
                if (isCorrect) btnClass = "border-emerald-500 bg-emerald-500/10 text-emerald-400";
                else if (isSelected) btnClass = "border-rose-500 bg-rose-500/10 text-rose-400";
                else btnClass = "border-zinc-800 bg-zinc-900 opacity-40";
              }

              return (
                <button
                  key={idx}
                  disabled={showAnswer}
                  onClick={() => handleMCQSelect(option)}
                  className={cn(
                  "p-4 sm:p-6 rounded-2xl border-2 text-left transition-all relative group overflow-hidden",
                    btnClass
                  )}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs",
                      isSelected ? "bg-white/20" : "bg-zinc-800"
                    )}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="font-bold text-base sm:text-lg leading-snug">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="pt-4 max-w-md mx-auto w-full">
            <form onSubmit={handleFillSubmit} className="space-y-4">
              <label htmlFor="quiz-answer" className="sr-only">
                Nhập đáp án tiếng Anh
              </label>
              <input 
                id="quiz-answer"
                type="text"
                autoFocus
                placeholder={isAiScenario ? "Nhập từ tiếng Anh còn thiếu..." : "Nhập từ tiếng Anh tương ứng..."}
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                disabled={showAnswer}
                className={cn(
                  "w-full bg-zinc-900 border-2 rounded-2xl py-4 px-6 text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-center",
                  showAnswer 
                    ? (typedAnswer.trim().toLowerCase() === current.answer.toLowerCase() 
                        ? "border-emerald-500 bg-emerald-500/10" 
                        : "border-rose-500 bg-rose-500/10")
                    : "border-zinc-800 focus:border-indigo-600"
                )}
              />
              {!showAnswer && (
                <div className="space-y-4">
                  <Button 
                    type="submit"
                    disabled={!typedAnswer.trim()}
                    className="w-full py-4 text-lg font-black tracking-widest uppercase"
                  >
                    Kiểm tra đáp án
                  </Button>
                  
                  {(current.hint || current.type === 'fill') && (
                    <div className="flex flex-col items-center">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => setShowHint(!showHint)}
                        className="text-xs text-zinc-500 hover:text-indigo-400"
                      >
                        {showHint ? "Ẩn gợi ý" : "Cần gợi ý?"}
                      </Button>
                      <AnimatePresence>
                        {showHint && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }} 
                            animate={{ height: 'auto', opacity: 1 }} 
                            exit={{ height: 0, opacity: 0 }}
                            className="text-sm font-medium text-emerald-400 mt-2 bg-emerald-500/10 px-4.5 py-3 rounded-xl border border-emerald-500/20 text-center w-full max-w-sm space-y-2"
                          >
                            {current.hint && (
                              <p className="leading-relaxed">💡 {current.hint}</p>
                            )}
                            {current.type === 'fill' && (
                              <div className="pt-2 border-t border-emerald-500/10 flex flex-col items-center gap-1 w-full">
                                <span className="text-[10px] text-emerald-500/70 font-black uppercase tracking-widest">Gợi ý chữ cái</span>
                                <span className="font-mono text-base font-black tracking-[0.15em] text-white bg-zinc-950 border border-zinc-900 px-3 py-1 rounded-lg mt-0.5">
                                  {(() => {
                                    const trimmed = current.answer.trim();
                                    let prefixCount = 1;
                                    if (trimmed.length > 3 && trimmed.length <= 6) {
                                      prefixCount = 2;
                                    } else if (trimmed.length > 6) {
                                      prefixCount = 3;
                                    }
                                    let chars = trimmed.split("");
                                    let result = "";
                                    let letterCount = 0;
                                    for (let i = 0; i < chars.length; i++) {
                                      const char = chars[i];
                                      if (/[a-zA-Z]/.test(char)) {
                                        if (letterCount < prefixCount) {
                                          result += char;
                                          letterCount++;
                                        } else {
                                          result += "_";
                                        }
                                      } else {
                                        result += char;
                                      }
                                      if (i < chars.length - 1) {
                                        result += " ";
                                      }
                                    }
                                    return result;
                                  })()}
                                </span>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        )}

        {showAnswer && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-6 border-t border-zinc-800/50"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div className="flex items-start md:items-center gap-3 text-left">
                {(current.type === 'mcq' && selectedOption === current.answer) || 
                 (current.type === 'fill' && typedAnswer.trim().toLowerCase() === current.answer.toLowerCase()) ? (
                  <div className="w-12 h-12 shrink-0 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                    <CheckCircle2 strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-12 h-12 shrink-0 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
                    <AlertCircle strokeWidth={3} />
                  </div>
                )}
                <div>
                  <p className={cn("font-black text-[10px] uppercase tracking-widest", 
                      ((current.type === 'mcq' && selectedOption === current.answer) || 
                       (current.type === 'fill' && typedAnswer.trim().toLowerCase() === current.answer.toLowerCase())) 
                      ? 'text-emerald-500' : 'text-rose-500')}>
                    {((current.type === 'mcq' && selectedOption === current.answer) || 
                      (current.type === 'fill' && typedAnswer.trim().toLowerCase() === current.answer.toLowerCase())) 
                      ? 'Chính xác!' : 'Chưa đúng rồi...'}
                  </p>
                  <div className="flex flex-col gap-1 mt-1">
                     <p className="font-bold text-white text-lg leading-snug">
                       Đáp án đúng: <span className="text-emerald-400">{current.answer}</span>
                     </p>
                     {current.translation && (
                        <p className="text-sm text-zinc-400 italic mt-1 leading-relaxed border-l-2 border-zinc-700 pl-3">
                          {current.translation}
                        </p>
                     )}
                  </div>
                </div>
              </div>
              <Button onClick={nextQuestion} className="w-full md:w-auto px-10 py-4 shadow-xl shrink-0">
                {currentIndex === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            
            {((current.type === 'mcq' && selectedOption !== current.answer) || 
              (current.type === 'fill' && typedAnswer.trim().toLowerCase() !== current.answer.toLowerCase())) && current.explanation && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 md:p-6 text-left">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-2 flex items-center gap-2">
                   <Sparkles className="w-3 h-3" />
                   AI Giải thích lỗi sai
                 </h4>
                 <p className="text-sm font-medium text-slate-300 leading-relaxed">
                   {current.explanation}
                 </p>
              </div>
            )}
          </motion.div>
        )}
      </Card>
      
      <div className="flex justify-center">
        <Button onClick={onCancel} variant="ghost" className="text-zinc-600 font-bold uppercase tracking-widest text-[10px] hover:text-rose-500">
          Hủy bỏ bài thi
        </Button>
      </div>
    </div>
  );
}
