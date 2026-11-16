export interface ImportRow {word:string;meaning:string;phonetic:string;pos:string;topic:string;example:string;exampleTranslation:string;}
export interface ImportPreview {rows:ImportRow[];issues:{line:number;message:string}[];duplicates:number;}
const fields=['word','meaning','phonetic','pos','topic','example','exampleTranslation'] as const;
const parseCells=(text:string,delimiter:string)=>{const rows:string[][]=[];let row:string[]=[];let cell='';let quoted=false;for(let i=0;i<text.length;i++){const char=text[i];if(char==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else if(quoted){quoted=false;}else if(cell===''){quoted=true;}else throw Error('Dấu ngoặc kép CSV không hợp lệ.');}else if(!quoted&&char===delimiter){row.push(cell);cell='';}else if(!quoted&&char==='\n'){row.push(cell.replace(/\r$/,''));rows.push(row);row=[];cell='';}else cell+=char;}if(quoted)throw Error('CSV có dấu ngoặc kép chưa đóng.');if(cell||row.length){row.push(cell.replace(/\r$/,''));rows.push(row);}return rows;};
export const previewWordImport=(text:string,existing:readonly {word:string}[]):ImportPreview=>{
  if(new TextEncoder().encode(text).length>2*1024*1024)throw Error('Nội dung từ vựng vượt quá 2 MB.');
  const data=parseCells(text.replace(/^\uFEFF/,''),text.split(/\r?\n/,1)[0].includes('\t')?'\t':',');
  if(data.length>10001)throw Error('Chỉ nhận tối đa 10.000 dòng mỗi lần.');
  const header=data[0]?.map(cell=>cell.trim());const hasHeader=header?.includes('word')&&header.includes('meaning');
  const indexes=fields.map((field,i)=>hasHeader?header.indexOf(field):i);
  const rows:ImportRow[]=[];const issues:ImportPreview['issues']=[];let duplicates=0;
  const seen=new Set(existing.map(row=>row.word.normalize('NFC').trim().toLowerCase()));
  data.slice(hasHeader?1:0).forEach((cells,index)=>{const line=index+(hasHeader?2:1);if(cells.every(cell=>!cell.trim()))return;const entry=Object.fromEntries(fields.map((field,i)=>[field,(cells[indexes[i]] || '').normalize('NFC').trim()])) as unknown as ImportRow;
    entry.pos ||= 'phrase';entry.topic ||= 'Từ tài liệu cá nhân';
    if(!entry.word||!entry.meaning||entry.word.length>80||entry.meaning.length>300||fields.some(field=>entry[field].length>2000)){issues.push({line,message:'Thiếu từ/nghĩa hoặc nội dung vượt giới hạn. Sửa dòng trước khi nhập.'});return;}
    const key=entry.word.toLowerCase();if(seen.has(key)){duplicates++;issues.push({line,message:`Bỏ qua từ trùng: ${entry.word}`});return;}seen.add(key);rows.push(entry);
  });
  return{rows,issues,duplicates};
};
