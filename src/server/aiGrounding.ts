import reviewed from '../../new/vocabulary-reviewed.json' with { type: 'json' };
import type { AiSource } from '../domain/aiContent.js';
const topics: Record<string,string> = {
  'rec-':'Recruitment','reg-':'Regulations','off-':'Office Work','lei-':'Leisure Time, Community','mkt-':'Marketing',
  'eco-':'Economy','sho-':'Shopping','pde-':'Product Development','pmf-':'Product Manufacture','csv-':'Customer Service',
  'trv-':'Traveling','con-':'Contracts','tra-':'Trading','ttp-':'Trading Transport','hot-':'Hotel, Restaurant',
  'rev-':'Revenue','acc-':'Accounting','tre-':'Trend of Company','mee-':'Meeting','ben-':'Employee Benefits',
  'rot-':'Job Rotation','tff-':'Traffic','ban-':'Bank','env-':'Environment','pdf-toeic-':'TOEIC bổ sung (PDF)',
};
type Reviewed = {word:string;meaning:string;pos:string;example:string;exampleTranslation:string};
const catalog = new Map(Object.entries(reviewed as Record<string,Reviewed>));
const source = (id:string,w:Reviewed):AiSource => ({
  kind:'catalog',wordId:id,word:w.word,meaning:w.meaning,pos:w.pos,topic:topics[id.replace(/\d+$/,'')] || '',
  example:w.example,exampleTranslation:w.exampleTranslation,
});
export function groundWord(wordId:string,word:string,meaning:string):AiSource {
  const known = catalog.get(wordId);
  if(known) {
    if(known.word.toLowerCase()!==word.trim().toLowerCase() || meaning && known.meaning!==meaning.trim())throw Error('catalog_mismatch');
    return source(wordId,known);
  }
  const exact=[...catalog].find(([,w])=>w.word.toLowerCase()===word.trim().toLowerCase()&&w.meaning===meaning.trim());
  if(exact)return source(...exact);
  return {kind:'user',wordId,word:word.trim(),meaning:meaning.trim(),pos:'',topic:'',example:'',exampleTranslation:''};
}

