import fs from 'node:fs';
import path from 'node:path';
import { createPrivateKey } from 'node:crypto';
const source=process.argv[2];
if(!source){console.error('Usage: node scripts/configure-firebase-admin.mjs /absolute/path/service-account.json');process.exit(1);}
try {
  const file=JSON.parse(fs.readFileSync(path.resolve(source),'utf8'));
  if(file.type!=='service_account'||typeof file.project_id!=='string'||typeof file.client_email!=='string'||!file.client_email.endsWith('.iam.gserviceaccount.com')||typeof file.private_key!=='string')throw Error('File không phải JSON service account Firebase/Google.');
  createPrivateKey(file.private_key);
  const client=JSON.parse(fs.readFileSync('firebase-applet-config.json','utf8'));
  if(client.projectId!==file.project_id)throw Error('Service account khác project Firebase client. Hãy chọn đúng project; chưa ghi cấu hình.');
  const target='.env.local';let contents=fs.existsSync(target)?fs.readFileSync(target,'utf8'):fs.readFileSync('.env.example','utf8');
  for(const [name,value]of Object.entries({FIREBASE_PROJECT_ID:file.project_id,FIREBASE_CLIENT_EMAIL:file.client_email,FIREBASE_PRIVATE_KEY:file.private_key})){
    const row=name+'='+JSON.stringify(value);const regex=new RegExp('^'+name+'=.*$','m');contents=regex.test(contents)?contents.replace(regex,()=>row):contents+'\n'+row+'\n';
  }
  fs.writeFileSync(target,contents,{mode:0o600});fs.chmodSync(target,0o600);
  console.log('Đã cập nhật Firebase Admin trong .env.local; không in khóa. Khởi động lại server để áp dụng.');
} catch(error) { console.error(error instanceof SyntaxError ? 'File JSON không hợp lệ; chưa ghi cấu hình.' : error instanceof Error ? error.message : 'Không đọc được cấu hình.');process.exit(1); }
