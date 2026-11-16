import type { UserProgress } from '../types';
import type { Word } from '../data/vocabularyTypes';

export interface Roadmap { version:1; examDate:string; targetScore:number; minutesPerDay:number; targetWords:number; }
const day=(date:string)=>Date.parse(date+'T00:00:00.000Z');
export const parseRoadmap = (value:unknown):Roadmap => {
  if(!value || typeof value!=='object' || Array.isArray(value))throw Error('Lộ trình không hợp lệ.');
  const data=value as Record<string,unknown>;
  if(data.version!==1 || typeof data.examDate!=='string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.examDate) || !Number.isFinite(day(data.examDate)) || new Date(day(data.examDate)).toISOString().slice(0,10)!==data.examDate || !Number.isInteger(data.targetScore) || Number(data.targetScore)<10 || Number(data.targetScore)>990 || Number(data.targetScore)%5 || !Number.isInteger(data.minutesPerDay) || Number(data.minutesPerDay)<5 || Number(data.minutesPerDay)>180 || !Number.isInteger(data.targetWords) || Number(data.targetWords)<1 || Number(data.targetWords)>10000)throw Error('Kiểm tra ngày thi, mục tiêu điểm, thời gian 5–180 phút và số từ 1–10.000.');
  return {version:1,examDate:data.examDate,targetScore:Number(data.targetScore),minutesPerDay:Number(data.minutesPerDay),targetWords:Number(data.targetWords)};
};
export const buildRoadmapDay = (roadmap:Roadmap,words:readonly Word[],progress:UserProgress,today:string,secondsPerReview=25,now=Date.now()) => {
  const knownIds=new Set(words.map(word=>word.id));
  const started=Object.keys(progress).filter(id=>knownIds.has(id)).length;
  const target=Math.min(roadmap.targetWords,words.length);
  const remaining=Math.max(0,target-started);
  const daysLeft=Math.max(0,Math.round((day(roadmap.examDate)-day(today))/86400000)+1);
  const due=words.filter(word=>progress[word.id] && Date.parse(progress[word.id].nextReviewDate)<=now).sort((a,b)=>Date.parse(progress[a.id].nextReviewDate)-Date.parse(progress[b.id].nextReviewDate)||a.id.localeCompare(b.id));
  const seconds=Math.max(10,Math.min(90,Number.isFinite(secondsPerReview)?secondsPerReview:25));
  const budget=roadmap.minutesPerDay*60;
  const reviewCount=Math.min(due.length,50,Math.floor(budget*0.6/seconds));
  const neededPerDay=daysLeft>1?Math.ceil(remaining/(daysLeft-1)):0;
  const capacity=Math.min(50,Math.floor(Math.max(0,budget-reviewCount*seconds)/(seconds*2)));
  const newCount=daysLeft>1?Math.min(remaining,neededPerDay,capacity):0;
  return {daysLeft,started,target,remaining,neededPerDay,newCount,reviewCount,feasible:remaining===0 || (daysLeft>1 && neededPerDay<=capacity),reviewIds:due.slice(0,reviewCount).map(word=>word.id),newIds:words.filter(word=>!progress[word.id]).slice(0,newCount).map(word=>word.id)};
};
