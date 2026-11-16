// A server snapshot can arrive while local writes are pending. Read it again
// after the outbox settles; never replay a stale cached snapshot over fresh work.
export const createDeferredRemoteUpdate=<T,>(options:{
 localVersion?:()=>unknown;isCurrent:()=>boolean;isBlocked:()=>boolean;hasPending:()=>Promise<boolean>;
 readRemote:()=>Promise<T>;apply:(value:T)=>void;onError:(error:unknown)=>void;
})=>{
 let revision=0,applied=0,busy=false,disposed=false;
 const ready=()=>!disposed&&options.isCurrent()&&!options.isBlocked();
 const flush=async()=>{
  if(busy||revision===applied||!ready())return;
  busy=true;const observed=revision,localVersion=options.localVersion?.();
  try{
   if(await options.hasPending()||!ready())return;
   const value=await options.readRemote();
   if(await options.hasPending()||!ready()||observed!==revision||options.localVersion?.()!==localVersion)return;
   options.apply(value);applied=observed;
  }catch(error){if(!disposed)options.onError(error);}
  finally{busy=false;if(observed!==revision&&ready())void flush();}
 };
 return{notify:()=>{revision++;void flush();},flush,dispose:()=>{disposed=true;}};
};
