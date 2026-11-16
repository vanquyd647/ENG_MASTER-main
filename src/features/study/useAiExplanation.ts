import { useCallback, useEffect, useRef, useState } from 'react';
import { getVocabulary } from '../../domain/catalog';
import type { AiExplanationData } from '../../domain/aiContent';
import { getActiveOwner, subscribeOwner } from '../../repositories/ownerStorage';
import { explainVocabulary, type FollowupOptions } from '../../services/ai';
import { reportError } from '../../services/telemetry';
interface OpenWord { wordId:string;word:string;meaning:string;content:string;explanation?:AiExplanationData; }
export function useAiExplanation() {
  const [explainingWord, setExplainingWord] = useState<OpenWord | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanationError, setExplanationError] = useState<string | null>(null);
  const [followup,setFollowup]=useState<AiExplanationData|null>(null);
  const [isFollowingUp,setIsFollowingUp]=useState(false);
  const [followupError,setFollowupError]=useState<string|null>(null);
  const [followupNumber,setFollowupNumber]=useState(0);
  const lastFollowup=useRef<FollowupOptions|null>(null);
  const activeRequest = useRef<AbortController | null>(null);
  const cancelExplanation = useCallback(() => {
    activeRequest.current?.abort(); activeRequest.current = null;lastFollowup.current=null;
    setExplainingWord(null); setIsExplaining(false); setExplanationError(null);
    setFollowup(null);setIsFollowingUp(false);setFollowupError(null);
  }, []);
  useEffect(() => {
    const unsubscribe = subscribeOwner(reason => { if (reason === 'owner') cancelExplanation(); });
    return () => { unsubscribe(); activeRequest.current?.abort(); };
  }, [cancelExplanation]);
  const handleLearnMore = useCallback(async (word: string, meaning: string, selectedId?: string) => {
    activeRequest.current?.abort();
    const request = new AbortController(), owner = getActiveOwner(); activeRequest.current = request;
    const wordId = selectedId ?? getVocabulary().find(item => item.word === word && item.meaning === meaning)?.id ?? '';
    setExplainingWord({ wordId, word, meaning, content: '' }); setIsExplaining(true); setExplanationError(null);
    setFollowup(null);setIsFollowingUp(false);setFollowupError(null);lastFollowup.current=null;
    try {
      const data = await explainVocabulary(wordId, word, meaning, request.signal);
      if (request.signal.aborted || activeRequest.current !== request || getActiveOwner() !== owner) return;
      setExplainingWord({ wordId, word, meaning, content: data.text, explanation:data.explanation });
    } catch (error) {
      if (request.signal.aborted || activeRequest.current !== request || getActiveOwner() !== owner) return;
      reportError('ai-explanation', error);
      setExplanationError(error instanceof Error ? error.message : 'Chưa tải được giải thích. Vui lòng thử lại.');
    } finally { if (activeRequest.current === request) setIsExplaining(false); }
  }, []);
  const followUpExplanation=async(options:FollowupOptions)=>{
    if(!explainingWord || isExplaining || isFollowingUp)return;
    activeRequest.current?.abort();const request=new AbortController(),owner=getActiveOwner();activeRequest.current=request;lastFollowup.current=options;
    setIsFollowingUp(true);setFollowupError(null);
    const {wordId,word,meaning}=explainingWord;
    try{
      const data=await explainVocabulary(wordId,word,meaning,request.signal,options);
      if(request.signal.aborted || activeRequest.current!==request || getActiveOwner()!==owner)return;
      if(!data.explanation)throw Error('AI chưa trả nội dung hỏi tiếp hợp lệ.');
      setFollowup(data.explanation);setFollowupNumber(n=>n+1);
    }catch(error){
      if(request.signal.aborted || activeRequest.current!==request || getActiveOwner()!==owner)return;
      reportError('ai-followup',error);setFollowupError(error instanceof Error?error.message:'Chưa tải được câu trả lời tiếp theo.');
    }finally{if(activeRequest.current===request)setIsFollowingUp(false);}
  };
  const retryExplanation = () => { if (explainingWord) void handleLearnMore(explainingWord.word, explainingWord.meaning, explainingWord.wordId); };
  const retryFollowup=()=>{if(lastFollowup.current)void followUpExplanation(lastFollowup.current);};
  return { explainingWord, isExplaining, explanationError, handleLearnMore, cancelExplanation, retryExplanation,
    followup,isFollowingUp,followupError,followupNumber,followUpExplanation,retryFollowup };
}
