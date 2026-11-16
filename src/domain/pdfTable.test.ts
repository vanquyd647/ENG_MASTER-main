import { expect, it } from 'vitest';
import { extractVocabularyTable, type PositionedText } from './pdfTable';
const item=(str:string,x:number,y:number):PositionedText=>({str,transform:[1,0,0,1,x,y],width:20});
it('assigns meanings above and below a centered row to that row, never to the previous vocabulary word',()=>{
 const rows=extractVocabularyTable([item('STT',63,777),item('Từ vựng',117,777),item('Loại từ',193,777),item('Phiên âm',272,777),item('Nghĩa của từ',415,777),item('1',70,760),item('ability',97,760),item('n',179,760),item('/test/',245,760),item('năng lực',345,760),item('2',70,736),item('adapter',97,736),item('n',179,736),item('/test2/',245,736),item('thiết bị',345,742),item('chuyển đổi',345,730)]);
 expect(rows).toHaveLength(2);expect(rows[0].meaning).toBe('năng lực');expect(rows[1]).toMatchObject({word:'adapter',meaning:'thiết bị chuyển đổi'});
});
it('refuses unknown layouts instead of assigning an arbitrary text column as meaning',()=>{
 expect(extractVocabularyTable([item('hello',100,700),item('world',200,700)])).toEqual([]);
});
