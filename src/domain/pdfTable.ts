export interface PositionedText {str:string;transform:number[];width:number;}
export interface PdfVocabularyRow {word:string;pos:string;phonetic:string;meaning:string;}
// Recognize this vocabulary-table layout before converting columns. Other PDF
// layouts stay as raw editable text instead of guessing semantic fields.
export const extractVocabularyTable=(items:PositionedText[]):PdfVocabularyRow[]=>{
  const text=items.filter(item=>item.str.trim());const headers=['STT','Từ vựng','Loại từ','Phiên âm','Nghĩa của từ'].map(label=>text.find(item=>item.str===label));
  if(headers.some(item=>!item))return [];
  const headerY=headers[0]!.transform[5],numberX=headers[0]!.transform[4];
  const anchors=text.filter(item=>/^\d{1,4}$/.test(item.str)&&Math.abs(item.transform[4]-numberX)<15&&item.transform[5]<headerY-8&&item.transform[5]>45).sort((a,b)=>b.transform[5]-a.transform[5]);
  if(!anchors.length)return [];
  const nearFirst=text.filter(item=>Math.abs(item.transform[5]-anchors[0].transform[5])<9);
  const wordX=Math.min(...nearFirst.filter(item=>item.transform[4]>anchors[0].transform[4]+10&&item.transform[4]<headers[2]!.transform[4]-10).map(item=>item.transform[4]));
  const posX=Math.min(...nearFirst.filter(item=>/^(n|v|adj|adv|prep|pron|conj|det)(\b|[.,])/.test(item.str)&&item.transform[4]>wordX).map(item=>item.transform[4]));
  const phoneticX=Math.min(...nearFirst.filter(item=>item.str.startsWith('/')&&item.transform[4]>posX).map(item=>item.transform[4]));
  const meaningX=Math.min(...nearFirst.filter(item=>item.transform[4]>headers[4]!.transform[4]-100).map(item=>item.transform[4]));
  if(![wordX,posX,phoneticX,meaningX].every(Number.isFinite)||!(wordX<posX&&posX<phoneticX&&phoneticX<meaningX))return [];
  const boundaries=[wordX-4,posX-4,phoneticX-4,meaningX-4];
  return anchors.map((anchor,index)=>{
    const upper=index?(anchors[index-1].transform[5]+anchor.transform[5])/2:headerY-8;
    const lower=index<anchors.length-1?(anchors[index+1].transform[5]+anchor.transform[5])/2:anchor.transform[5]-15;
    const columns:Array<PositionedText[]>=[[],[],[],[]];
    for(const item of text){const y=item.transform[5],x=item.transform[4];if(y>upper||y<=lower||x<boundaries[0])continue;const col=x<boundaries[1]?0:x<boundaries[2]?1:x<boundaries[3]?2:3;columns[col].push(item);}
    const values=columns.map(column=>column.sort((a,b)=>b.transform[5]-a.transform[5]||a.transform[4]-b.transform[4]).map(item=>item.str.trim()).join(' ').normalize('NFC'));
    return{word:values[0],pos:values[1],phonetic:values[2],meaning:values[3]};
  });
};
