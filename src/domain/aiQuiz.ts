import { normalizeAnswer } from "./random.js";
import {assertVietnameseTeaching} from './teachingSafety.js';
export interface AiQuizWord { id: string; word: string; meaning: string; }
export interface AiQuizQuestion { wordId: string; type: "mcq" | "fill"; questionText: string; options: string[]; answer: string; hint: string; translation: string; explanation: string; }
const record = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
export const parseAiQuizWords = (input: unknown): AiQuizWord[] => {
  if (!Array.isArray(input) || !input.length || input.length > 20) throw new Error("Quiz cần 1–20 từ.");
  const ids = new Set<string>();
  return input.map((value) => {
    if (!record(value) || typeof value.id !== "string" || !/^[a-zA-Z0-9_-]{1,128}$/.test(value.id) || ids.has(value.id) || typeof value.word !== "string" || !value.word.trim() || value.word.length > 80 || typeof value.meaning !== "string" || !value.meaning.trim() || value.meaning.length > 300) throw new Error("Từ cho quiz không hợp lệ.");
    ids.add(value.id); return { id: value.id, word: value.word, meaning: value.meaning };
  });
};
export const parseAiQuiz = (input: unknown, words: readonly AiQuizWord[]): AiQuizQuestion[] => {
  if (!Array.isArray(input) || input.length !== words.length) throw new Error("AI chưa tạo đủ câu hỏi.");
  const seen = new Set<string>();
  return input.map((item) => {
    if (!record(item) || typeof item.wordId !== "string" || seen.has(item.wordId)) throw new Error("ID câu hỏi AI trùng hoặc thiếu.");
    const word = words.find((word) => word.id === item.wordId);
    if (!word || (item.type !== "mcq" && item.type !== "fill") || typeof item.questionText !== "string" || item.questionText.length > 2000 || item.questionText.split("_____").length !== 2 || typeof item.answer !== "string" || normalizeAnswer(item.answer) !== normalizeAnswer(word.word)) throw new Error("Câu hỏi AI không khớp từ hoặc đáp án.");
    for (const field of ["hint", "translation", "explanation"] as const) if (typeof item[field] !== "string" || !item[field].trim() || item[field].length > 2000) throw new Error(`Thiếu ${field} trong câu AI.`);
    assertVietnameseTeaching([String(item.hint),String(item.translation),String(item.explanation)]);
    const options = item.options;
    if (!Array.isArray(options) || options.some((option) => typeof option !== "string" || !option.trim() || option.length > 200)) throw new Error("Lựa chọn AI không hợp lệ.");
    if (item.type === "mcq" && (options.length !== 4 || new Set(options.map(normalizeAnswer)).size !== 4 || !options.includes(item.answer))) throw new Error("Trắc nghiệm AI cần 4 lựa chọn riêng và một đáp án hợp lệ.");
    if(item.type==='fill' && options.length)throw new Error('Câu điền AI không có lựa chọn.');
    seen.add(item.wordId);
    return { wordId: item.wordId, type: item.type, questionText: item.questionText, options: item.type === "mcq" ? options : [], answer: item.answer, hint: String(item.hint), translation: String(item.translation), explanation: String(item.explanation) };
  });
};
