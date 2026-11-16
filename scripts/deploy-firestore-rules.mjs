// Approved ENG_MASTER project only. Always snapshots the current release.
// node scripts/deploy-firestore-rules.mjs --activate
import fs from 'node:fs';
import crypto from 'node:crypto';
import { parse } from 'dotenv';
import { GoogleAuth } from 'google-auth-library';
if (!process.argv.includes('--activate')) throw Error('Use --activate after local Emulator acceptance');
const env=parse(fs.readFileSync('.env.local','utf8'));
if(env.FIREBASE_PROJECT_ID!=='engai-2c7fe')throw Error('Unexpected Firebase project');
const auth=new GoogleAuth({credentials:{client_email:env.FIREBASE_CLIENT_EMAIL,private_key:env.FIREBASE_PRIVATE_KEY.replaceAll('\\n','\n')},scopes:['https://www.googleapis.com/auth/firebase','https://www.googleapis.com/auth/cloud-platform']});
const token=(await (await auth.getClient()).getAccessToken()).token;
const api=async(path,method='GET',body)=>{
  const response=await fetch('https://firebaserules.googleapis.com/v1/'+path,{method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
  if(!response.ok)throw Error('Firebase Rules '+method+' failed: HTTP '+response.status);
  return response.json();
};
const project='projects/engai-2c7fe',release=project+'/releases/cloud.firestore',before=await api(release);
const checkedAt=new Date().toISOString(),stamp=checkedAt.replace(/[^0-9]/g,'');
fs.mkdirSync('.secrets',{recursive:true,mode:0o700});fs.writeFileSync('.secrets/firestore-release-'+stamp+'.json',JSON.stringify(before,null,2)+'\n',{mode:0o600});
const content=fs.readFileSync('firestore.rules','utf8');
const candidate=await api(project+'/rulesets','POST',{source:{files:[{name:'firestore.rules',content}]}});
if((await api(release)).rulesetName!==before.rulesetName)throw Error('Rules changed while preparing release');
await api(release,'PATCH',{release:{name:release,rulesetName:candidate.name},updateMask:'rulesetName'});
if((await api(release)).rulesetName!==candidate.name)throw Error('Activation verification failed');
const report={checkedAt,project:'engai-2c7fe',previousRuleset:before.rulesetName,activeRuleset:candidate.name,sha256:crypto.createHash('sha256').update(content).digest('hex'),activated:true,legacyDataMigrated:false};
fs.mkdirSync('output/verification/rules-history',{recursive:true});fs.writeFileSync('output/verification/rules-history/'+stamp+'.json',JSON.stringify(report,null,2)+'\n');
fs.writeFileSync('output/verification/firebase-dataset-rules.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
