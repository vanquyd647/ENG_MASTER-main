import { ALL_PRACTICE_QUESTIONS, questionById as questions } from '../data/learningContent';
import type { LearningQuestion as PracticeQuestion } from '../data/extendedPractice';
import type { LearningRecord as PracticeRecord } from './extendedPracticeRecords';
import { shuffle } from './random';


export interface PracticeMistake {
  question: PracticeQuestion;
  selectedIndex: number | null;
  wrongAttempts: number;
  unansweredAttempts: number;
  resolved: boolean;
  lastAttemptAt: string;
}

// Recompute from the retained actual records; never infer attempts from vocabulary SRS.
export const collectPracticeMistakes = (records: readonly PracticeRecord[]): PracticeMistake[] => {
  const rows = new Map<string, PracticeMistake>();
  for (const record of [...records].sort((a, b) => Date.parse(a.finishedAt) - Date.parse(b.finishedAt) || Date.parse(a.startedAt) - Date.parse(b.startedAt) || a.id.localeCompare(b.id))) {
    for (const answer of record.answers) {
      const question = questions.get(answer.questionId);
      if (!question) continue;
      const previous = rows.get(question.id);
      const correct = answer.selectedIndex === question.correctIndex;
      rows.set(question.id, {
        question, selectedIndex: answer.selectedIndex,
        wrongAttempts: (previous?.wrongAttempts || 0) + Number(!correct && answer.selectedIndex !== null),
        unansweredAttempts: (previous?.unansweredAttempts || 0) + Number(answer.selectedIndex === null),
        resolved: correct, lastAttemptAt: record.finishedAt,
      });
    }
  }
  return [...rows.values()].filter(row => row.wrongAttempts + row.unansweredAttempts > 0)
    .sort((a, b) => Date.parse(b.lastAttemptAt) - Date.parse(a.lastAttemptAt) || a.question.id.localeCompare(b.question.id));
};

export type PracticeScope = 'all' | 'unseen' | 'mistakes';
export const selectPracticeQuestions = (
  records: readonly PracticeRecord[],
  { kind, topic = '', scope = 'all', count = 10, lessonId, passageId, difficulty, random = Math.random }: {
    kind: PracticeQuestion['kind']; topic?: string; scope?: PracticeScope;
    count?: number; lessonId?: string; passageId?: string; difficulty?: number; random?: () => number;
  },
) => {
  const seen = new Set(records.flatMap(record => record.answers.map(answer => answer.questionId)));
  const open = new Set(collectPracticeMistakes(records).filter(row => !row.resolved).map(row => row.question.id));
  const available = ALL_PRACTICE_QUESTIONS.filter(question => question.kind === kind && (!topic || question.topic === topic)
    && (!lessonId || question.lessonId === lessonId) && (!passageId || question.passageId === passageId) && (!difficulty || question.difficulty === difficulty)
    && (scope !== 'unseen' || !seen.has(question.id)) && (scope !== 'mistakes' || open.has(question.id)));
  const limit=Math.max(0,Math.min(60,Math.floor(count)));
  if(kind==='part6'||kind==='part7'||kind==='part3'||kind==='part4'){
    if(!limit)return [];
    const selected:PracticeQuestion[]=[];
    for(const id of shuffle([...new Set(available.map(q=>q.passageId||q.listeningId))],random)){
      const group=available.filter(q=>(q.passageId||q.listeningId)===id);
      if(selected.length+group.length>limit&&selected.length)break;
      selected.push(...group);
    }
    return selected.slice(0,60);
  }
  return shuffle(available, random).slice(0,limit);
};

export const summarizePracticeTopics = (records: readonly PracticeRecord[], since = 0, until = Date.now()) => {
  const rows = new Map<string, { kind: PracticeQuestion['kind']; topic: string; correct: number; total: number; unanswered: number }>();
  for (const record of records) {
    const time = Date.parse(record.finishedAt);
    if (time < since || time > until) continue;
    for (const answer of record.answers) {
      const question = questions.get(answer.questionId);
      if (!question) continue;
      const key = question.kind + ':' + question.topic;
      const row = rows.get(key) || { kind: question.kind, topic: question.topic, correct: 0, total: 0, unanswered: 0 };
      row.total++; row.correct += Number(answer.selectedIndex === question.correctIndex); row.unanswered += Number(answer.selectedIndex === null);
      rows.set(key, row);
    }
  }
  return [...rows.values()].sort((a, b) => a.correct / a.total - b.correct / b.total || b.total - a.total || a.topic.localeCompare(b.topic));
};

export const learningPracticeResult=(record:PracticeRecord)=>({correct:record.answers.filter(answer=>answer.selectedIndex===questions.get(answer.questionId)?.correctIndex).length,total:record.answers.length,unanswered:record.answers.filter(answer=>answer.selectedIndex===null).length});
