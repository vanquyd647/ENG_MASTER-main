import { extractVocabularyTable } from '../domain/pdfTable';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
GlobalWorkerOptions.workerSrc=workerUrl;
export const pdfToImportText=async(file:File,onProgress:(page:number,total:number)=>void,isCancelled:()=>boolean)=>{
  const task=getDocument({data:new Uint8Array(await file.arrayBuffer()),useSystemFonts:true});
  const result:string[]=[];let unstructuredPages=0;
  const dataRows:{word:string;meaning:string;pos:string;phonetic:string;page:number}[]=[];
  try{const pdf=await task.promise;if(pdf.numPages>200)throw Error('PDF vượt quá 200 trang.');
    for(let number=1;number<=pdf.numPages;number++){
      if(isCancelled())throw Error('Đã dừng đọc tài liệu.');
      const page=await pdf.getPage(number);const content=await page.getTextContent();
      const table=extractVocabularyTable(content.items.filter(item=>'str' in item));if(!table.length&&content.items.some(item=>'str' in item&&item.str.trim()))unstructuredPages++;dataRows.push(...table.map(row=>({...row,page:number})));
      const lines=new Map<number,{text:string;x:number;width:number}[]>();
      for(const item of content.items){if(!('str' in item)||!item.str.trim())continue;const y=Math.round(item.transform[5]);const row=lines.get(y)||[];row.push({text:item.str,x:item.transform[4],width:item.width});lines.set(y,row);}
      for(const [,items] of [...lines.entries()].sort((a,b)=>b[0]-a[0])){
        const ordered=items.sort((a,b)=>a.x-b.x);let line='';let right=0;
        ordered.forEach((item,i)=>{line+=(i?(item.x-right>12?'\t':' '):'')+item.text;right=item.x+item.width;});
        result.push(line);

      }
      page.cleanup();onProgress(number,pdf.numPages);
    }
  }finally{await task.destroy();}
  if(!result.length)throw Error('PDF không có lớp chữ đọc được. Bản scan cần OCR trước; bạn có thể nhập CSV hoặc dán từ/nghĩa.');
  const escape=(text:string)=>'"'+text.replaceAll('"','""')+'"';
  if(dataRows.length&&unstructuredPages===0)return 'word,meaning,phonetic,pos,topic\n'+dataRows.map(row=>[row.word,row.meaning,row.phonetic,row.pos,'Từ tài liệu cá nhân'].map(escape).join(',')).join('\n');
  return 'word,meaning\n'+result.map(line=>escape(line)+',""').join('\n');
};
