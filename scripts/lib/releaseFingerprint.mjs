import fs from'node:fs';import path from'node:path';import{createHash}from'node:crypto';
export const releaseFingerprint=()=>{
 const files=['server.ts','index.html','package.json','package-lock.json','vite.config.ts','vercel.json','firestore.rules','firebase-applet-config.json',...['src','api'].flatMap(root=>fs.readdirSync(root,{recursive:true}).filter(f=>fs.statSync(path.join(root,f)).isFile()).map(f=>path.join(root,f)))].filter(f=>fs.existsSync(f)).sort();
 return createHash('sha256').update(files.map(f=>f+':'+createHash('sha256').update(fs.readFileSync(f)).digest('hex')).join('\n')).digest('hex');
};
