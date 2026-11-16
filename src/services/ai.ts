import { callAiApi } from '../lib/apiClient';
import { AI_CONTENT_VERSION, parseAiExplanation, type AiAction, type AiExplanationData } from '../domain/aiContent';
import { getActiveOwner, readOwnerItem, ownerKey } from '../repositories/ownerStorage';
export interface ExplanationResult { text:string; cached:boolean; explanation?:AiExplanationData; }
export interface FollowupOptions { action:AiAction; comparison?:{wordId:string;word:string;meaning:string}; }
export const explainVocabulary = async (wordId: string, word: string, meaning: string, signal?: AbortSignal, options?:FollowupOptions):Promise<ExplanationResult> => {
  const owner=getActiveOwner(), storageKey=ownerKey('eng_master_ai_explanations_v3');
  const level=readOwnerItem('ai_level') || 'A2',action=options?.action || 'explain';
  const request={wordId,word,meaning,level,action,...(options?.comparison?{comparison:options.comparison}:{})};
  const source=JSON.stringify({...request,model:'gemini-3.5-flash-lite',version:AI_CONTENT_VERSION});
  const validateContext=(explanation:AiExplanationData|undefined)=>{
    if(explanation && (explanation.action!==action || explanation.source.word.toLowerCase()!==word.trim().toLowerCase() || explanation.source.meaning!==meaning.trim()))throw Error('AI trả nhầm từ hoặc nghĩa đang học.');
    if(action!=='explain' && !explanation)throw Error('Nội dung hỏi tiếp chưa hợp lệ. Hãy thử lại.');
    if(action==='compare' && (!explanation?.comparison || explanation.comparison.word.toLowerCase()!==options?.comparison?.word.toLowerCase() || explanation.comparison.meaning!==options?.comparison?.meaning))throw Error('AI trả nhầm từ cần so sánh.');
  };
  const key=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(source)))).map(value=>value.toString(16).padStart(2,'0')).join('');
  if(signal?.aborted || getActiveOwner()!==owner)throw new DOMException('Request cancelled','AbortError');
  let entries: Record<string,{text:string;explanation?:unknown;expiresAt:number}>={};
  try {const parsed=JSON.parse(localStorage.getItem(storageKey)||'{}');if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))entries=parsed;}catch{/* The cache is optional. */}
  if(action!=='practice' && entries[key]?.expiresAt>Date.now()) {
    try {const value=entries[key];if(typeof value.text!=='string'||!value.text.trim()||value.text.length>20_000)throw Error('invalid_cache');
      const explanation=value.explanation===undefined?undefined:parseAiExplanation(value.explanation);
      validateContext(explanation);
      return {text:value.text,cached:true,...(explanation?{explanation}:{})};
    }catch{delete entries[key];}
  }
  const result=await callAiApi<{text?:unknown;explanation?:unknown}>('explain',request,{signal});
  if(typeof result.text!=='string'||!result.text.trim()||result.text.length>20_000)throw new Error('AI chưa trả nội dung giải thích hợp lệ.');
  const explanation=result.explanation===undefined?undefined:parseAiExplanation(result.explanation);
  validateContext(explanation);
  if(getActiveOwner()===owner && !signal?.aborted && action!=='practice') {
    try {
      const stored=JSON.parse(localStorage.getItem(storageKey)||'{}');
      const current=Object.fromEntries(Object.entries(stored&&typeof stored==='object'?stored:{}).filter(([,value])=>value&&typeof value==='object'&&(value as {expiresAt:number}).expiresAt>Date.now()).slice(-39));
      current[key]={text:result.text,...(explanation?{explanation}:{}),expiresAt:Date.now()+24*3600_000};
      localStorage.setItem(storageKey,JSON.stringify(current));
    } catch {/* Storage quota does not prevent reading the explanation. */}
  }
  return {text:result.text,cached:false,...(explanation?{explanation}:{})};
};
