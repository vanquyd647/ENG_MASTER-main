import { beforeEach, expect, it } from 'vitest';
import { previewWordImport } from './documentImport';
import { importCustomWords, getCustomWords, getDecks } from '../lib/productPreferences';
import { setActiveOwner } from '../repositories/ownerStorage';
import { getVocabulary } from './catalog';
beforeEach(()=>{localStorage.clear();setActiveOwner('guest');});
it('parses quoted multiline CSV, skips existing words and exposes all invalid rows',()=>{
  const text='word,meaning,example\n"personal xyz","nghĩa, đầy đủ","first line\nsecond line"\nability,khả năng,\n,thiếu từ,\n"personal xyz",trùng,';
  const preview=previewWordImport(text,[{word:'ability'}]);
  expect(preview.rows).toHaveLength(1);expect(preview.rows[0]).toMatchObject({meaning:'nghĩa, đầy đủ',example:'first line\nsecond line'});expect(preview.issues).toHaveLength(3);expect(preview.duplicates).toBe(2);
  expect(()=>previewWordImport('word,meaning\n"broken,text',[])).toThrow(/chưa đóng/);
});
it('imports a reviewed TSV and deck atomically without touching the canonical catalog or another owner',()=>{
  const before=getVocabulary().filter(row=>!row.id.startsWith('custom-'));
  const preview=previewWordImport('word\tmeaning\nposv test\tnghĩa cá nhân',getVocabulary());
  expect(importCustomWords(preview.rows,'Bộ tài liệu')).toBe(1);expect(getDecks()[0].wordIds).toEqual([getCustomWords()[0].id]);
  expect(getVocabulary().filter(row=>!row.id.startsWith('custom-'))).toEqual(before);
  expect(()=>importCustomWords(preview.rows)).toThrow(/trùng/);expect(getCustomWords()).toHaveLength(1);
  setActiveOwner('account-2');expect(getCustomWords()).toEqual([]);
});
it('rejects oversized preferences before changing any key',()=>{
  const preview=previewWordImport('word,meaning\nnew data,nghĩa',[]);
  localStorage.setItem('eng_master_custom_words_v1','[]');const before=localStorage.getItem('eng_master_custom_words_v1');
  const rows=Array.from({length:500},(_,i)=>({...preview.rows[0],word:'term '+i,example:'x'.repeat(2000)}));
  expect(()=>importCustomWords(rows)).toThrow(/quá lớn/);expect(localStorage.getItem('eng_master_custom_words_v1')).toBe(before);expect(getDecks()).toEqual([]);
});
