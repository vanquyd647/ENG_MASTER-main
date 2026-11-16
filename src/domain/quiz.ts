import type { Word } from "../data/vocabularyTypes";
import { normalizeAnswer, shuffle } from "./random";
import { getVocabulary } from "./catalog";
export type QuizMode = "standard" | "cloze" | "listening" | "ai";
export interface QuizQuestion { sourceQuestionId?: string; word: Word; questionText: string; options: string[]; answer: string; type: "mcq" | "fill"; hint?: string; translation?: string; explanation?: string; isAi?: boolean; }
export { parseAiQuizWords, parseAiQuiz } from "./aiQuiz";
export type { AiQuizWord, AiQuizQuestion } from "./aiQuiz";
export const buildLocalQuiz = (words: readonly Word[], mode: Exclude<QuizMode, "ai"> = "standard"): QuizQuestion[] => words.map((word) => {
  if (mode === "listening") return { word, type: "fill", questionText: "Nghe phát âm và gõ từ hoặc cụm từ tiếng Anh.", options: [], answer: word.word, hint: word.meaning, isAi: false };
  if (mode === "cloze") {
    const escaped=word.word.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
    const target=new RegExp('(?<![A-Za-z])'+escaped+'(?![A-Za-z])','gi');
    const usable=(word.example.match(target) || []).length===1;
    return {word,type:'fill',questionText:usable?word.example.replace(target,'_____'):'Gõ từ hoặc cụm từ có nghĩa: '+word.meaning,options:[],answer:word.word,hint:word.meaning,...(usable?{translation:word.exampleTranslation}:{}),isAi:false};
  }
  const parts = (meaning: string) => meaning.split(/[,;]/).map(value => normalizeAnswer(value.replace(/\([^)]*\)/g, "").replace(/^(sự|việc|một)\s+/i, ""))).filter(Boolean);
  const targetMeanings = new Set(parts(word.meaning));
  const meanings = shuffle(getVocabulary().filter((item) => item.id !== word.id && item.pos === word.pos && !parts(item.meaning).some(part => targetMeanings.has(part)))).map((item) => item.meaning);
  const choices = [...new Set(meanings)].filter((meaning) => normalizeAnswer(meaning) !== normalizeAnswer(word.meaning)).slice(0, 3);
  if (Math.random() < 0.5 || choices.length < 3) return { word, type: "fill", questionText: `Điền từ có nghĩa: ${word.meaning}`, options: [], answer: word.word, hint: word.meaning, isAi: false };
  return { word, type: "mcq", questionText: "Nghĩa của từ này là gì?", options: shuffle([...choices, word.meaning]), answer: word.meaning, isAi: false };
});
