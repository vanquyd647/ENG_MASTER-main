import type { MistakeRecord } from '../domain/mistakes';
import { quizQuestionKey } from '../domain/mistakes';
import { getDraft } from "../repositories/localRepository";
import { reportError } from "../services/telemetry";
import { useSessionDraft } from "../features/study/useSessionDraft";
import { getFavoriteWordIds, getDecks, getStudySessionSize } from "../lib/productPreferences";
import { useEffect } from "react";
import { buildLocalQuiz, parseAiQuiz, type QuizQuestion, type QuizMode } from "../domain/quiz";
import { normalizeAnswer, shuffle } from "../domain/random";
import { getWordById } from "../domain/catalog";
import { useActiveTime } from "../features/study/useActiveTime";
import type { StudyEvidence } from "../types";
import { speakEnglish } from "../services/speech";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "react-hot-toast";
import { AiResponse } from './AiResponse';
import { AiReviewResponse } from './AiStructuredResponse';
import { parseAiReview, type AiReviewData } from '../domain/aiContent';
import { AlertCircle, CheckCircle2, CheckSquare, ChevronRight, Sparkles, Trophy, Volume2 } from "lucide-react";
import { getVocabulary, type Word } from "../domain/catalog";
import { useCatalog } from "../domain/useCatalog";
import { callAiApi } from "../lib/apiClient";

import { cn } from "../lib/utils";
import type { UserProgress } from "../types";
import { Button, Card } from "./ui";

export function QuizSession({ progress, initialWordIds = [], initialMistake, resumeSessionId, onCancel, onFinish, onWordResult }: { progress: UserProgress; initialWordIds?:string[]; initialMistake?: MistakeRecord; resumeSessionId?: string; onCancel: () => void, onFinish?: (score: number, total: number, wordIds: string[], sessionId: string) => Promise<void>, onWordResult?: (wordId: string, isCorrect: boolean, operationId: string, evidence?: StudyEvidence) => Promise<void> }) {
  useCatalog();
  const [quizMode, setQuizMode] = useState<QuizMode | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [missedAnswers, setMissedAnswers] = useState<{ word: Word; userAnswer: string; correctAnswer: string }[]>([]);
  const [mistakeReview, setMistakeReview] = useState<string | null>(null);
  const [mistakeReviewData,setMistakeReviewData]=useState<AiReviewData|null>(null);
  const [reviewedCount,setReviewedCount]=useState(0);
  const [mistakeReviewError, setMistakeReviewError] = useState<string | null>(null);
  const [isReviewingMistakes, setIsReviewingMistakes] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(getStudySessionSize);
  const [quizScope, setQuizScope] = useState<'all' | 'studied' | 'mistakes' | 'favorites' | 'selected'>(initialWordIds.length?'selected':'all');
  const [quizDeck,setQuizDeck]=useState("");
  const [quizTopic, setQuizTopic] = useState('Tất cả');
  const sessionId = useRef<string>(resumeSessionId || crypto.randomUUID());
  const takeActiveSeconds = useActiveTime();
  const aiRequest=useRef<AbortController | null>(null);
  useEffect(()=>()=>aiRequest.current?.abort(),[]);
  const draftControl=useSessionDraft();
  const answers = useRef<Record<string, string>>({});
  useEffect(() => {
    if (!("indexedDB" in globalThis) || (initialWordIds.length || initialMistake) && !resumeSessionId) return;
    void draftControl.load("quiz",progress).then((draft) => {
      if (!draft || (resumeSessionId && draft.id !== resumeSessionId) || !draft.questions || !draft.wordIds.every((id) => getWordById(id))) return;
      const restored = (draft.questions as (Omit<QuizQuestion, "word"> & { wordId: string })[]).map((question) => ({ ...question, word: getWordById(question.wordId)! }));
      if (!restored.length) return;
      sessionId.current = draft.id; answers.current = draft.answers || {};
      setQuestions(restored); setQuizMode((draft.mode || "standard") as QuizMode); setCurrentIndex(draft.cursor);
      const incorrect = restored.filter((question) => answers.current[question.word.id] !== undefined && normalizeAnswer(answers.current[question.word.id]) !== normalizeAnswer(question.answer));
      setMissedAnswers(incorrect.map((question) => ({ word: question.word, userAnswer: answers.current[question.word.id], correctAnswer: question.answer })));
      setScore(Object.keys(answers.current).length - incorrect.length);
      if (answers.current[restored[draft.cursor].word.id] !== undefined) { setShowAnswer(true); setSelectedOption(answers.current[restored[draft.cursor].word.id]); setTypedAnswer(answers.current[restored[draft.cursor].word.id]); answerLock.current = true; }
    }).catch((error) => toast.error(error.message));
  }, []);
  const persistDraft = async (items = questions, cursor = currentIndex, mode = quizMode) => {
    if (!("indexedDB" in globalThis)) return;
    await draftControl.save({ id: sessionId.current, kind: "quiz", wordIds: items.map((question) => question.word.id), cursor, completedIds: Object.keys(answers.current), answers: answers.current, mode: mode || "standard", updatedAt: new Date().toISOString(), questions: items.map(({ word, ...question }) => ({ ...question, wordId: word.id })) });
  };
  const answerLock = useRef(false);
  const transitionLock = useRef(false);
  const [isSaving, setIsSaving] = useState(false);

  const startQuiz = async (mode: QuizMode) => {
    if (mode === "listening" && !("speechSynthesis" in window)) {toast.error("Thiết bị chưa hỗ trợ giọng đọc. Hãy chọn điền từ.");return;}
    if((initialWordIds.length || initialMistake) && "indexedDB" in globalThis && await getDraft("quiz") && !window.confirm("Bắt đầu bài ôn mới sẽ thay phiên quiz đang dở. Các câu đã chấm vẫn được giữ. Tiếp tục?"))return;
    aiRequest.current?.abort();const request=new AbortController();aiRequest.current=request;
    takeActiveSeconds();
    sessionId.current = resumeSessionId || crypto.randomUUID();
    answerLock.current = false;
    setQuizMode(mode);
    setIsLoading(true);
    setCurrentIndex(0);
    setSelectedOption(null);
    setTypedAnswer('');
    setScore(0);
    setIsFinished(false);
    setShowAnswer(false);
    setShowHint(false);
    answers.current = {};
    setMissedAnswers([]);
    setMistakeReview(null);setMistakeReviewData(null);setReviewedCount(0);
    setMistakeReviewError(null);

    const candidateWords = getVocabulary().filter((word) => {
      if(quizScope==='selected' && !initialWordIds.includes(word.id))return false;
      if (quizDeck && !getDecks().find(deck=>deck.id===quizDeck)?.wordIds.includes(word.id)) return false;
      if (quizScope === "favorites" && !getFavoriteWordIds().has(word.id)) return false;
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

    const selected = shuffle(candidateWords).slice(0, questionCount);
    try {
      let items: QuizQuestion[];
      if (initialMistake) {
        const word = getWordById(initialMistake.wordId);
        if (!word) throw Error('Từ của câu hỏi không còn trong thư viện.');
        const source = initialMistake.attempt;
        items = [{ word, type: source.questionType, questionText: source.questionText, answer: source.correctAnswer,
          options: [...source.options], explanation: source.explanation, sourceQuestionId: source.questionId }];
      } else if (mode === "ai") {
        try {
          const words = selected.map((word) => ({ id: word.id, word: word.word, meaning: word.meaning }));
          const data = await callAiApi<{ questions: unknown }>("quiz", { words }, {signal:request.signal});
          const validated = parseAiQuiz(data.questions, words);
          items = selected.map((word) => ({ ...validated.find((question) => question.wordId === word.id)!, word, isAi: true }));
        } catch (error) { if(request.signal.aborted)return; toast.error(`AI chưa sẵn sàng, chuyển sang quiz offline: ${(error as Error).message}`); items = buildLocalQuiz(selected); }
      } else items = buildLocalQuiz(selected, mode);
      await persistDraft(items, 0, mode); setQuestions(items);
    } catch (error) { toast.error((error as Error).message); setQuizMode(null); }
    finally { setIsLoading(false); }
  };

  const submitAnswer = async (answer: string) => {
    if (answerLock.current || showAnswer) return;
    answerLock.current = true;
    setIsSaving(true);
    const question = questions[currentIndex];
    const isCorrect = question.type === 'fill'
      ? normalizeAnswer(answer) === normalizeAnswer(question.answer)
      : answer === question.answer;
    try {
      await onWordResult?.(question.word.id, isCorrect, `${sessionId.current}:${question.word.id}`, { sessionId: sessionId.current, mode: quizMode === "listening" ? "listening" : quizMode === "cloze" ? "cloze" : "quiz", correct: isCorrect, durationSeconds: takeActiveSeconds(), attempt:{questionId:question.sourceQuestionId || await quizQuestionKey(question.word.id,quizMode || 'standard',question),questionType:question.type,questionText:question.questionText,userAnswer:answer,correctAnswer:question.answer,options:question.options,explanation:question.explanation || '',word:question.word.word,meaning:question.word.meaning} });
      answers.current[question.word.id] = answer;
      await persistDraft();
      setSelectedOption(answer);
      setShowAnswer(true);
      if (isCorrect) setScore((previous) => previous + 1);
      else setMissedAnswers((previous) => [...previous, { word: question.word, userAnswer: answer, correctAnswer: question.answer }]);
    } catch (error) {
      answerLock.current = false;
      reportError("QuizSession",error);
      toast.error('Chưa lưu được câu trả lời. Hãy thử lại.');
    } finally { setIsSaving(false); }
  };

  const handleMCQSelect = (option: string) => void submitAnswer(option);

  const handleFillSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (showAnswer || !typedAnswer.trim()) return;
    
    void submitAnswer(typedAnswer);
  };

  const finishEarly=async()=>{if(transitionLock.current || isSaving || !window.confirm('Kết thúc và ghi kết quả các câu đã trả lời?'))return;transitionLock.current=true;setIsSaving(true);try{const answered=questions.filter(question=>answers.current[question.word.id]!==undefined);if(answered.length){const correct=answered.filter(question=>normalizeAnswer(answers.current[question.word.id])===normalizeAnswer(question.answer)).length;if(onFinish)await onFinish(correct,answered.length,answered.map(question=>question.word.id),sessionId.current);setQuestions(answered);setIsFinished(true);}else onCancel();if('indexedDB' in globalThis)await draftControl.finish('quiz');}catch(error){toast.error((error as Error).message);}finally{transitionLock.current=false;setIsSaving(false);}};
  const nextQuestion = async () => {
    if (transitionLock.current || isSaving || !showAnswer) return;
    transitionLock.current = true;
    setIsSaving(true);
    try {
    if (currentIndex < questions.length - 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 150));
      await persistDraft(questions, currentIndex + 1);
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setTypedAnswer('');
      setShowAnswer(false);
      setShowHint(false);
      answerLock.current = false;
    } else {
      const finalScore = questions.length - missedAnswers.length;
      if (onFinish) {
        await onFinish(finalScore, questions.length, questions.map((question) => question.word.id), sessionId.current);
      }
      if ("indexedDB" in globalThis) await draftControl.finish("quiz");
      setIsFinished(true);

    }
    } catch (error) {
      reportError("QuizSession",error);
      toast.error('Chưa lưu được kết quả quiz. Hãy thử lại.');
    } finally { transitionLock.current = false; setIsSaving(false); }
  };

  if (!quizMode && initialMistake) return <Card className="mx-auto max-w-2xl space-y-4">
    <h1 className="text-2xl font-bold">Làm lại câu đã sai</h1>
    <p>Giữ nguyên câu hỏi và đáp án đã lưu cho {initialMistake.attempt.word}. Kết quả mới cập nhật đúng mục trong sổ lỗi.</p>
    <Button onClick={() => void startQuiz(initialMistake.mode === 'listening' ? 'listening' : initialMistake.mode === 'cloze' ? 'cloze' : 'standard')}>Bắt đầu làm lại câu</Button>
    <Button variant="outline" onClick={onCancel}>Quay lại</Button>
  </Card>;

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

        <label className="block text-sm text-zinc-400">Bộ từ cá nhân <select aria-label="Bộ từ cho quiz" value={quizDeck} onChange={event=>setQuizDeck(event.target.value)} className="ml-2 bg-zinc-900 border border-zinc-700 rounded-xl p-2"><option value="">Tất cả</option>{getDecks().map(deck=><option key={deck.id} value={deck.id}>{deck.name}</option>)}</select></label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left rounded-3xl border border-zinc-800 bg-zinc-900/40 p-4">
          <label>
            <span className="text-[10px] font-black uppercase text-zinc-500 block mb-2">Số câu</span>
            <select aria-label="Số câu" value={questionCount} onChange={(event) => setQuestionCount(Number(event.target.value))} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white">
              {[5, 10, 15, 20].map((value) => <option key={value} value={value}>{value} câu</option>)}
            </select>
          </label>
          <label>
            <span className="text-[10px] font-black uppercase text-zinc-500 block mb-2">Phạm vi</span>
            <select aria-label="Phạm vi quiz" value={quizScope} onChange={(event) => setQuizScope(event.target.value as typeof quizScope)} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white">
              <option value="all">Tất cả từ</option>
              <option value="studied">Từ đã học</option>
              <option value="mistakes">Từ hay sai</option>
              <option value="favorites">Từ yêu thích</option>
              {initialWordIds.length>0&&<option value="selected">Danh sách đã chọn ({initialWordIds.length})</option>}
            </select>
          </label>
          <label>
            <span className="text-[10px] font-black uppercase text-zinc-500 block mb-2">Chủ đề</span>
            <select aria-label="Chủ đề quiz" value={quizTopic} onChange={(event) => setQuizTopic(event.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white">
              <option>Tất cả</option>
              {Array.from(new Set(getVocabulary().map((word) => word.topic))).map((topic) => <option key={topic}>{topic}</option>)}
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card ariaLabel="Bắt đầu điền từ trong câu" onClick={() => void startQuiz("cloze")}><h3 className="font-bold text-lg">Điền từ trong câu</h3><p className="text-sm text-zinc-400">Luyện ngữ cảnh và cụm từ từ ví dụ đã rà soát.</p></Card>
          <Card ariaLabel="Bắt đầu nghe và gõ" onClick={() => void startQuiz("listening")}><h3 className="font-bold text-lg">Nghe và gõ</h3><p className="text-sm text-zinc-400">Nghe giọng tiếng Anh trên thiết bị, gõ lại từ/cụm từ.</p></Card>
        </div>
        <div className="flex justify-center mt-10">
          <Button onClick={onCancel} variant="ghost" className="text-zinc-500 hover:text-white uppercase tracking-widest text-xs font-black">
            Quay lại tổng quan
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
        className="max-w-3xl mx-auto text-center space-y-10 py-10"
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
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-zinc-800">
              <span className="rounded-xl bg-indigo-500/10 p-2.5"><Sparkles aria-hidden="true" className="w-5 h-5 text-indigo-300" /></span>
              <div className="min-w-0 flex-1"><h3 className="font-bold text-white">Phân tích lỗi sai</h3><p className="mt-1 text-xs text-zinc-400">Hiểu lỗi đã làm · Gợi ý ôn tập</p></div>
              <span className="shrink-0 rounded-md border border-indigo-400/20 bg-indigo-500/10 px-2 py-1 text-[11px] font-bold text-indigo-300">AI</span>
            </div>
            {mistakeReviewError && <p role="alert" className="mb-4 rounded-xl border border-rose-400/20 bg-rose-500/5 p-3 text-sm leading-relaxed text-rose-200">{mistakeReviewError}</p>}
            {isReviewingMistakes ? (
              <p role="status" className="text-sm text-indigo-300 font-medium animate-pulse">AI đang phân tích các lỗi sai...</p>
            ) : mistakeReview ? (
              mistakeReviewData ? <AiReviewResponse data={mistakeReviewData}/> : <AiResponse content={mistakeReview} />
            ) : (
              <div className="space-y-2">
                {missedAnswers.map((item) => (
                  <div key={`${item.word.id}-${item.userAnswer}`} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                    <div className="font-bold text-white">{item.word.word}</div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
                      <div className="rounded-lg border border-rose-400/15 bg-rose-500/5 p-3"><p className="mb-1 text-xs font-semibold text-rose-300">Bạn đã chọn</p><p className="break-words text-slate-200">{item.userAnswer || 'Bỏ trống'}</p></div>
                      <div className="rounded-lg border border-emerald-400/15 bg-emerald-500/5 p-3"><p className="mb-1 text-xs font-semibold text-emerald-300">Đáp án đúng</p><p className="break-words text-slate-200">{item.correctAnswer}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        <div className="space-y-3 pt-6">
          <Button onClick={() => { setQuizMode(null); setIsFinished(false); }} className="w-full py-4 text-lg">Làm lại bài thi</Button>
          {missedAnswers.length > 0 && <div className="space-y-2">
            {reviewedCount < missedAnswers.length && <Button disabled={isReviewingMistakes} onClick={() => {
              aiRequest.current?.abort();const request=new AbortController();aiRequest.current=request;
              setIsReviewingMistakes(true);setMistakeReviewError(null);
              const batch=missedAnswers.slice(reviewedCount,reviewedCount+5);
              void callAiApi<{text:unknown;review?:unknown}>("mistake-review", {mistakes:batch.map(item=>({wordId:item.word.id,word:item.word.word,meaning:item.word.meaning,userAnswer:item.userAnswer,correctAnswer:item.correctAnswer,questionText:questions.find(q=>q.word.id===item.word.id)?.questionText,questionType:questions.find(q=>q.word.id===item.word.id)?.type}))},{signal:request.signal}).then(data=>{
                if(request.signal.aborted || aiRequest.current!==request)return;
                if(typeof data.text!=='string'||!data.text.trim()||data.text.length>30_000)throw Error('AI chưa trả nhận xét hợp lệ.');
                const parsed=data.review===undefined?null:parseAiReview(data.review);
                if(parsed && (parsed.items.length!==batch.length || parsed.items.some((row,i)=>row.source.word!==batch[i].word.word || row.source.meaning!==batch[i].word.meaning || row.userAnswer!==batch[i].userAnswer || row.correctAnswer!==batch[i].correctAnswer)))throw Error('AI trả nhận xét không khớp lỗi đã làm.');
                setMistakeReview(previous=>previous?previous+'\n\n---\n\n'+data.text:data.text as string);
                setMistakeReviewData(previous=>parsed && (reviewedCount===0 || previous)?{version:parsed.version,items:[...(previous?.items||[]),...parsed.items]}:null);
                setReviewedCount(count=>count+batch.length);
              }).catch(error=>{if(!request.signal.aborted)setMistakeReviewError(error.message);}).finally(()=>{if(aiRequest.current===request)setIsReviewingMistakes(false);});
            }}>{reviewedCount?'Phân tích lỗi tiếp theo':'AI giải thích lỗi sai'}</Button>}
            <p className="text-xs text-zinc-400">Đã phân tích {reviewedCount}/{missedAnswers.length} lỗi · Tối đa 5 lỗi mỗi lượt</p>
          </div>}
          <Button onClick={onCancel} variant="outline" className="w-full py-4 text-lg border-zinc-800 text-zinc-400">Về tổng quan</Button>
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
              ? "Điền đúng từ đang ôn"
              : (current.type === 'fill' ? "Điền từ tiếng Anh tương ứng với nghĩa:" : "Nghĩa của từ này là gì?")
            }
          </span>
          
          {isAiScenario&&<p className="rounded-xl border border-indigo-400/20 bg-indigo-500/5 p-3 text-sm text-indigo-200">Nghĩa cần điền: {current.word.meaning}</p>}
          <h2 className={cn(
            "font-black tracking-tighter text-white whitespace-pre-wrap leading-tight mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 break-words",
            isAiScenario 
              ? "text-2xl sm:text-3xl md:text-4xl text-left font-serif" 
              : (current.type === 'fill' ? "text-2xl sm:text-3xl md:text-5xl text-center" : "text-4xl sm:text-6xl text-center")
          )}>
            {isAiScenario 
              ? current.questionText 
              : (["cloze", "listening"].includes(quizMode) ? current.questionText : current.type === 'fill' ? current.word.meaning : current.word.word)
            }
            {!isAiScenario && (current.type !== 'fill' || showAnswer || quizMode === 'listening') && (
              <button 
                type="button"
                aria-label="Phát âm tiếng Anh"
                onClick={() => {
                  speakEnglish(current.word.word);
                }}
                className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all shadow-lg shrink-0"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            )}
          </h2>
          
          {!isAiScenario && (current.type !== 'fill' || showAnswer) && (
            <p className="text-xl font-mono text-zinc-600 italic">{current.word.phonetic}</p>
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
                  disabled={showAnswer || isSaving}
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
                disabled={showAnswer || isSaving}
                className={cn(
                  "w-full bg-zinc-900 border-2 rounded-2xl py-4 px-6 text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-center",
                  showAnswer 
                    ? (normalizeAnswer(typedAnswer) === normalizeAnswer(current.answer)
                        ? "border-emerald-500 bg-emerald-500/10" 
                        : "border-rose-500 bg-rose-500/10")
                    : "border-zinc-800 focus:border-indigo-600"
                )}
              />
              {!showAnswer && (
                <div className="space-y-4">
                  <Button 
                    type="submit"
                    disabled={!typedAnswer.trim() || isSaving}
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
                                    const chars = trimmed.split("");
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
                 (current.type === 'fill' && normalizeAnswer(typedAnswer) === normalizeAnswer(current.answer)) ? (
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
                       (current.type === 'fill' && normalizeAnswer(typedAnswer) === normalizeAnswer(current.answer)))
                      ? 'text-emerald-500' : 'text-rose-500')}>
                    {((current.type === 'mcq' && selectedOption === current.answer) || 
                      (current.type === 'fill' && normalizeAnswer(typedAnswer) === normalizeAnswer(current.answer)))
                      ? 'Chính xác!' : current.isAi ? 'Chưa khớp từ đang ôn' : 'Chưa đúng rồi...'}
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
              <Button onClick={nextQuestion} disabled={isSaving} className="w-full md:w-auto px-10 py-4 shadow-xl shrink-0">
                {currentIndex === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            
            {((current.type === 'mcq' && selectedOption !== current.answer) || 
              (current.type === 'fill' && normalizeAnswer(typedAnswer) !== normalizeAnswer(current.answer))) && current.explanation && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 md:p-6 text-left">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-2 flex items-center gap-2">
                   <Sparkles className="w-3 h-3" />
                   {current.explanation.startsWith('Đối chiếu từ nguồn:')?'Nghĩa và đáp án từ nguồn':'AI Giải thích lỗi sai'}
                 </h4>
                 <AiResponse compact content={current.explanation} />
              </div>
            )}
          </motion.div>
        )}
      </Card>
      
      <div className="flex justify-center">
        <Button onClick={finishEarly} disabled={isSaving} variant="outline">Kết thúc sớm</Button>
        <Button onClick={() => {if (window.confirm("Tạm dừng quiz? Các câu đã trả lời được lưu để tiếp tục.")) onCancel();}} disabled={isSaving} variant="ghost" className="text-zinc-600 font-bold uppercase tracking-widest text-[10px] hover:text-rose-500">
          Hủy bỏ bài thi
        </Button>
      </div>
    </div>
  );
}
