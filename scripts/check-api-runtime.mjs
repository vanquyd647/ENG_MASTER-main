// Vercel emits separate ES modules, unlike the bundled local Express server.
// Import emitted modules with native Node to catch missing .js extensions.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import assert from 'node:assert/strict';

fs.mkdirSync('build',{recursive:true});
const directory=fs.mkdtempSync(path.resolve('build/api-runtime-'));
const entries=['explain','quiz','mistake-review','generate-avatar'];
const files=[...entries.map(name=>'api/gemini/'+name+'.ts'),'src/server/gemini.ts','src/server/geminiRetry.ts','src/server/vercelGeminiHandler.ts','src/server/apiSecurity.ts','src/server/quotaMaintenance.ts','src/server/firebaseAdmin.ts','src/domain/aiQuiz.ts','src/domain/random.ts','src/domain/aiContent.ts','src/domain/aiQuality.ts','src/server/aiGrounding.ts','src/server/aiPrompts.ts','src/server/learningNotes.ts','src/server/teachingConstraints.ts'];
try {
  fs.writeFileSync(path.join(directory,'package.json'),JSON.stringify({type:'module'}));
  for(const file of [...files,'src/domain/teachingSafety.ts']){const output=path.join(directory,file.replace(/\.ts$/,'.js'));fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,verbatimModuleSyntax:true}}).outputText);}
  fs.mkdirSync(path.join(directory,'new'),{recursive:true});fs.copyFileSync('new/vocabulary-reviewed.json',path.join(directory,'new/vocabulary-reviewed.json'));
  for(const name of entries){const {default:handler}=await import(pathToFileURL(path.join(directory,'api/gemini/'+name+'.js')).href);let status,body;const response={writeHead(code){status=code;},end(text){body=JSON.parse(text);}};await handler({method:'POST',headers:{},body:{}},response);assert.equal(status,401);assert.ok(body.code);}
  console.log('Native Node ESM: 4 API endpoints import and reject unauthenticated requests.');
} finally {fs.rmSync(directory,{recursive:true,force:true});}
