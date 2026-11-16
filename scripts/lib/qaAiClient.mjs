import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {parse} from 'dotenv';
import {cert,initializeApp,deleteApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {getFirestore} from 'firebase-admin/firestore';

export async function createQaAiClient(origin,cli) {
  const base=new URL(origin),local=base.protocol==='http:'&&['localhost','127.0.0.1'].includes(base.hostname);
  if(!local && (base.protocol!=='https:'||!(/^(eng-master-main2\.vercel\.app|eng-master-main2-[a-z0-9]+-quys-projects-d07a5005\.vercel\.app)$/.test(base.hostname))||!cli))throw Error('Unapproved QA target');
  const env=parse(fs.readFileSync('.env.local','utf8'));
  if(env.FIREBASE_PROJECT_ID!=='engai-2c7fe')throw Error('Wrong QA project');
  const app=initializeApp({credential:cert({projectId:env.FIREBASE_PROJECT_ID,clientEmail:env.FIREBASE_CLIENT_EMAIL,privateKey:env.FIREBASE_PRIVATE_KEY.replaceAll('\\n','\n')}),projectId:env.FIREBASE_PROJECT_ID},'quality-qa-'+randomUUID());
  const auth=getAuth(app),db=getFirestore(app),uid='qa_quality_'+randomUUID().replaceAll('-','');
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'eng-master-quality-'));
  let created=false,identity,sequence=0;
  const cleanup=async()=>{
    try {if(created){const docs=await db.collection('_systemRateLimits').where('uid','==',uid).get();if(docs.size){const batch=db.batch();docs.docs.forEach(doc=>batch.delete(doc.ref));await batch.commit();}await auth.deleteUser(uid);created=false;}}
    finally{fs.rmSync(directory,{recursive:true,force:true});await deleteApp(app);}
  };
  try {
    await auth.createUser({uid,displayName:'QA learning quality'});created=true;
    const customToken=await auth.createCustomToken(uid);
    let response;
    try{response=await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key='+encodeURIComponent(env.VITE_FIREBASE_API_KEY),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:customToken,returnSecureToken:true}),signal:AbortSignal.timeout(25000)});}catch{throw Error('QA sign-in transport failed');}
    identity=await response.json();if(!response.ok||!identity.idToken)throw Error('QA sign-in failed');
  }catch(error){await cleanup();throw error;}
  const windows=new Map();
  let nextRequestAt=0;
  const request=async(endpoint,body)=>{
    const spacing=Number(process.env.QA_REQUEST_SPACING_MS)||0;
    const reserved=Math.max(Date.now(),nextRequestAt);nextRequestAt=reserved+spacing;
    if(reserved>Date.now())await new Promise(resolve=>setTimeout(resolve,reserved-Date.now()));
    // Stay below the existing 20/min explain policy; never change project quotas.
    for(;;){const timestamps=(windows.get(endpoint)||[]).filter(time=>Date.now()-time<61000);if(timestamps.length<15){timestamps.push(Date.now());windows.set(endpoint,timestamps);break;}await new Promise(resolve=>setTimeout(resolve,Math.max(0,61000-(Date.now()-timestamps[0]))));}
    const id=++sequence,input=path.join(directory,id+'-body.json'),output=path.join(directory,id+'-response.json'),config=path.join(directory,id+'-curl.conf');
    fs.writeFileSync(input,JSON.stringify(body),{mode:0o600});
    const values={request:'POST',header:['Content-Type: application/json','Authorization: Bearer '+identity.idToken],data:'@'+input,output,'write-out':'%{http_code}','max-time':'60'};
    fs.writeFileSync(config,Object.entries(values).flatMap(([key,value])=>(Array.isArray(value)?value:[value]).map(item=>key+' = '+JSON.stringify(item))).join('\n'),{mode:0o600});
    const result=await new Promise(resolve=>{
      const child=spawn(local?'curl':process.execPath,local?[base.origin+'/api/gemini/'+endpoint,'--config',config,'--silent','--show-error']:[cli,'curl',base.origin+'/api/gemini/'+endpoint,'--yes','--','--config',config,'--silent','--show-error'],{stdio:['ignore','pipe','ignore']});
      let stdout='';const timer=setTimeout(()=>child.kill(),75000);
      child.stdout.on('data',chunk=>{stdout+=chunk.toString();if(stdout.length>2e6)child.kill();});
      child.on('error',()=>{clearTimeout(timer);resolve({status:1,stdout:''});});
      child.on('close',status=>{clearTimeout(timer);resolve({status,stdout});});
    });
    if(result.status!==0)throw Error('QA request transport failed');
    const status=Number(result.stdout.trim().match(/(\d{3})$/)?.[1]);
    let data;try{data=JSON.parse(fs.readFileSync(output,'utf8'));}catch{throw Error('QA response is not JSON');}
    return {status,data};
  };
  return {request,cleanup};
}
