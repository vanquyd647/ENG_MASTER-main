import { useEffect, useRef, useState } from 'react';
const views=['dashboard','review','browse','quiz','practice','settings','stats','mistakes','roadmap','workplace','import-words','today'] as const;
export type AppView=typeof views[number];
const readRoute=():AppView=>{const value=location.hash.slice(1).split('?')[0];return views.includes(value as AppView)?value as AppView:'dashboard';};
const canLeave=(view:AppView)=>!['review','practice','quiz','workplace','today'].includes(view)||document.documentElement.dataset.studyActive!=='true'||window.confirm('Tạm dừng phiên học? Các câu đã chấm được giữ và bạn có thể tiếp tục khi quay lại.');
export const useAppRoute=()=>{
  const [view,setView]=useState<AppView>(readRoute);const previousHash=useRef(location.hash);const current=useRef(view);const approved=useRef(false);
  useEffect(()=>{const changed=()=>{const next=readRoute();if(next!==current.current && !approved.current && !canLeave(current.current)){history.replaceState(null,'',previousHash.current || '#dashboard');return;}approved.current=false;previousHash.current=location.hash;current.current=next;setView(next);};window.addEventListener('hashchange',changed);return()=>window.removeEventListener('hashchange',changed);},[]);
  const navigate=(next:AppView,confirmed=false)=>{if(readRoute()===next){setView(next);return;}if(!confirmed&&!canLeave(current.current))return;approved.current=true;location.hash=next;current.current=next;setView(next);};
  return [view,navigate] as const;
};
