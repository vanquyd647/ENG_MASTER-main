import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {webcrypto} from 'node:crypto';
vi.mock('../lib/apiClient',()=>({callAiApi:vi.fn()}));
import {callAiApi} from '../lib/apiClient';
import {explainVocabulary} from './ai';
import {setActiveOwner} from '../repositories/ownerStorage';
import {AI_CONTENT_VERSION,type AiExplanationData} from '../domain/aiContent';
const explanation:AiExplanationData={version:AI_CONTENT_VERSION,action:'explain',source:{kind:'catalog',wordId:'rec-01',word:'opening',meaning:'vị trí trống',pos:'noun',topic:'Recruitment',example:'There is an opening.',exampleTranslation:'Có vị trí trống.'},lesson:{summary:'Một vị trí đang tuyển.',usage:'Dùng an opening.',collocations:[{phrase:'job opening',meaning:'vị trí tuyển dụng'}],examples:[{english:'We have an opening.',vietnamese:'Chúng tôi có vị trí trống.'}],caution:'Chú ý ngữ cảnh.',questions:[]}};
beforeEach(()=>{vi.stubGlobal('crypto',webcrypto);vi.mocked(callAiApi).mockReset();localStorage.clear();setActiveOwner('guest');});
afterEach(()=>{vi.unstubAllGlobals();setActiveOwner('guest');});
it('caches valid structured answers for the selected meaning but isolates owner, level and follow-up action',async()=>{
  vi.mocked(callAiApi).mockImplementation(async(_endpoint,body)=>{
    const action=(body as {action:AiExplanationData['action']}).action;
    return {text:'Lời giải.',explanation:{...explanation,action}};
  });
  expect((await explainVocabulary('rec-01','opening','vị trí trống')).cached).toBe(false);
  expect((await explainVocabulary('rec-01','opening','vị trí trống')).cached).toBe(true);
  await explainVocabulary('rec-01','opening','vị trí trống',undefined,{action:'simplify'});
  localStorage.setItem('ai_level','A1');await explainVocabulary('rec-01','opening','vị trí trống');
  setActiveOwner('account-two');await explainVocabulary('rec-01','opening','vị trí trống');
  expect(callAiApi).toHaveBeenCalledTimes(4);
});
it('keeps old text readable but refuses malformed structured responses and mismatched selected meanings',async()=>{
  vi.mocked(callAiApi).mockResolvedValueOnce({text:'**Giải thích:** Nội dung cũ.'});
  expect((await explainVocabulary('old','word','nghĩa')).text).toContain('Nội dung cũ');
  vi.mocked(callAiApi).mockResolvedValueOnce({text:'Lời giải.',explanation:{}});
  await expect(explainVocabulary('bad','word','nghĩa')).rejects.toThrow();
  vi.mocked(callAiApi).mockResolvedValueOnce({text:'Lời giải.',explanation});
  await expect(explainVocabulary('rec-01','opening','lễ khai trương')).rejects.toThrow('nhầm từ hoặc nghĩa');
});
it('revalidates corrupt cached content and does not reuse the same practice question',async()=>{
  vi.mocked(callAiApi).mockResolvedValue({text:'Lời giải.',explanation});
  await explainVocabulary('rec-01','opening','vị trí trống');
  const storageKey='eng_master_ai_explanations_v3',cache=JSON.parse(localStorage.getItem(storageKey)!);
  Object.values(cache).forEach(value=>(value as {explanation:unknown}).explanation={});
  localStorage.setItem(storageKey,JSON.stringify(cache));
  expect((await explainVocabulary('rec-01','opening','vị trí trống')).cached).toBe(false);
  const practice={...explanation,action:'practice',lesson:{...explanation.lesson,questions:[{wordId:'rec-01',type:'fill',questionText:'There is an _____ in sales.',options:[],answer:'opening',hint:'Một vị trí đang tuyển.',translation:'Có vị trí trống.',explanation:'Dùng opening.'}]}};
  vi.mocked(callAiApi).mockResolvedValue({text:'Bài kiểm tra.',explanation:practice});
  for(let i=0;i<2;i++)expect((await explainVocabulary('rec-01','opening','vị trí trống',undefined,{action:'practice'})).cached).toBe(false);
  expect(callAiApi).toHaveBeenCalledTimes(4);
});
it('does not save a late result to another account cache or send an already cancelled request',async()=>{
  const abort=new AbortController();abort.abort();
  await expect(explainVocabulary('rec-01','opening','vị trí trống',abort.signal)).rejects.toThrow();
  expect(callAiApi).not.toHaveBeenCalled();
  let resolve!:(value:unknown)=>void;vi.mocked(callAiApi).mockImplementationOnce(()=>new Promise(done=>{resolve=done;}));
  const request=explainVocabulary('rec-01','opening','vị trí trống');
  await vi.waitFor(()=>expect(callAiApi).toHaveBeenCalledTimes(1));
  setActiveOwner('changed-account');resolve({text:'Lời giải.',explanation});await request;
  expect(localStorage.length).toBe(0);
});
