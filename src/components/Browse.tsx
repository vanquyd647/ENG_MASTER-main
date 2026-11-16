import { subscribeOwner } from "../repositories/ownerStorage";
import { speakEnglish } from "../services/speech";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { toast } from "react-hot-toast";
import { ClipboardList, Volume2, Search, Heart, Plus, X } from "lucide-react";
import { getVocabulary, type Word } from "../domain/catalog";
import { useCatalog } from "../domain/useCatalog";

import { getLearningStatusLabel } from "../lib/learning";

import { cn } from "../lib/utils";
import { addCustomWord, deleteCustomWord, getFavoriteWordIds, saveFavoriteWordIds, updateCustomWord, getDecks, saveDecks } from "../lib/productPreferences";
import type { UserProgress } from "../types";
import { Button, Card } from "./ui";

export function Browse({ 
  progress, 
  onLearnMore,
  onSyncTask,
  onResetWord,
  onDelayWord,
  onStudySelected,
  onImportWords,
}: { 
  onImportWords?:()=>void;
  onStudySelected: (ids: string[]) => void;
  progress: UserProgress; 
  onLearnMore: (word: string, meaning: string, wordId?: string) => void;
  onSyncTask: (word: Word) => void;
  onResetWord: (wordId: string) => Promise<void>;
  onDelayWord: (wordId: string) => Promise<void>;
}) {
  useCatalog();
  const [vocabularyVersion, setVocabularyVersion] = useState(0);
  const topics = ['Tất cả', ...Array.from(new Set(getVocabulary().map(w => w.topic)))];
  const initialFilter = new URLSearchParams(location.hash.split('?')[1] || '');
  const [selectedTopic, setSelectedTopic] = useState<string>(initialFilter.get('topic') || 'Tất cả');
  const [query, setQuery] = useState(initialFilter.get('q') || '');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'learning' | 'due' | 'learned' | 'favorites'>(() => ['all','new','learning','due','learned','favorites'].includes(initialFilter.get('status') || '') ? initialFilter.get('status') as 'all' : 'all');
  const [favorites, setFavorites] = useState(getFavoriteWordIds);
  useEffect(()=>subscribeOwner(()=>{setFavorites(getFavoriteWordIds());setDecks(getDecks());}),[]);
  const [decks, setDecks] = useState(getDecks);
  const [selectedDeck, setSelectedDeck] = useState(initialFilter.get("deck") || "");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showAddWord, setShowAddWord] = useState(false);
  const [visibleCount, setVisibleCount] = useState(30);
  const [customWord, setCustomWord] = useState({ word: '', meaning: '', phonetic: '', pos: 'noun', example: '', exampleTranslation: '', topic: 'Từ cá nhân' });

  useEffect(()=>{const changed=()=>{if(!location.hash.startsWith('#browse'))return;const params=new URLSearchParams(location.hash.split('?')[1] || '');setQuery(params.get('q')||'');setSelectedTopic(params.get('topic')||'Tất cả');const status=params.get('status')||'all';setStatusFilter(['all','new','learning','due','learned','favorites'].includes(status)?status as typeof statusFilter:'all');setSelectedDeck(params.get('deck')||'');};window.addEventListener('hashchange',changed);return()=>window.removeEventListener('hashchange',changed);},[]);
  const normalizedQuery = query.trim().toLocaleLowerCase('vi');
  const words = getVocabulary().filter((word) => {
    if (selectedDeck && !decks.find(deck => deck.id === selectedDeck)?.wordIds.includes(word.id)) return false;
    if (selectedTopic !== 'Tất cả' && word.topic !== selectedTopic) return false;
    if (normalizedQuery && !`${word.word} ${word.meaning} ${word.topic}`.toLocaleLowerCase('vi').includes(normalizedQuery)) return false;
    const item = progress[word.id];
    if (statusFilter === 'new' && item) return false;
    if (statusFilter === 'learning' && (!item || item.repetitions >= 3)) return false;
    if (statusFilter === 'due' && (!item || new Date(item.nextReviewDate) > new Date())) return false;
    if (statusFilter === 'learned' && (!item || item.repetitions < 3)) return false;
    if (statusFilter === 'favorites' && !favorites.has(word.id)) return false;
    return true;
  });
  const visibleWords = words.slice(0, visibleCount);

  useEffect(() => {
    const params = new URLSearchParams(); if (query) params.set("q",query); if (selectedTopic !== "Tất cả") params.set("topic",selectedTopic); if (statusFilter !== "all") params.set("status",statusFilter); if (selectedDeck) params.set("deck",selectedDeck);
    history.replaceState(null,"", "#browse" + (params.size ? "?" + params.toString() : ""));
    setVisibleCount(30);
  }, [selectedTopic, query, statusFilter, vocabularyVersion, selectedDeck]);

  const toggleFavorite = (wordId: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(wordId)) next.delete(wordId);
      else next.add(wordId);
      saveFavoriteWordIds(next);
      return next;
    });
  };

  const handleAddCustomWord = (event: React.FormEvent) => {
    event.preventDefault();
    if (!customWord.word.trim() || !customWord.meaning.trim()) {
      toast.error('Từ và nghĩa không được để trống.');
      return;
    }
    try {
    const input = {
      ...customWord,
      word: customWord.word.trim(),
      meaning: customWord.meaning.trim(),
      phonetic: customWord.phonetic.trim(),
      example: customWord.example.trim(),
      exampleTranslation: customWord.exampleTranslation.trim(),
    };
    if (editingId) updateCustomWord(editingId,input); else addCustomWord(input);
    setEditingId(null);
    setCustomWord({ word: '', meaning: '', phonetic: '', pos: 'noun', example: '', exampleTranslation: '', topic: 'Từ cá nhân' });
    setVocabularyVersion((value) => value + 1);
    setSelectedTopic('Từ cá nhân');
    setShowAddWord(false);
    toast.success('Đã lưu từ cá nhân.');
    } catch (error) { toast.error((error as Error).message); }
  };

  const speak = speakEnglish;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {onImportWords&&<Button variant="outline" onClick={onImportWords}>Nhập PDF / CSV từ vựng</Button>}
          <label>Bộ từ <select aria-label="Bộ từ cá nhân" value={selectedDeck} onChange={event => setSelectedDeck(event.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-xl p-2"><option value="">Tất cả bộ từ</option>{decks.map(deck => <option key={deck.id} value={deck.id}>{deck.name}</option>)}</select></label>
          <Button variant="outline" onClick={() => onStudySelected(selectedIds.size ? [...selectedIds] : words.map(word => word.id))}>Học {selectedIds.size ? `${selectedIds.size} từ đã chọn` : "danh sách này"}</Button>
          <Button variant="outline" disabled={!selectedIds.size} onClick={() => { const name = window.prompt("Tên bộ từ mới (tối đa 80 ký tự)"); if (!name) return; try { const next = [...decks, {id:`deck-${crypto.randomUUID()}`,name,wordIds:[...selectedIds]}]; saveDecks(next); setDecks(next); setSelectedIds(new Set()); toast.success("Đã lưu bộ từ."); } catch (error) { toast.error((error as Error).message); } }}>Lưu thành bộ từ</Button>
          {selectedDeck && <Button variant="ghost" onClick={() => { if (!window.confirm("Xóa bộ từ này? Các từ và tiến độ vẫn được giữ.")) return; const next=decks.filter(deck=>deck.id!==selectedDeck);saveDecks(next);setDecks(next);setSelectedDeck(""); }}>Xóa bộ từ</Button>}
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <label className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <span className="sr-only">Tìm từ vựng</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm theo từ, nghĩa hoặc chủ đề..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500"
            />
          </label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-white"
            aria-label="Lọc trạng thái từ"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="new">Chưa học</option>
            <option value="learning">Đang học</option>
            <option value="due">Đến hạn ôn</option>
            <option value="learned">Đã thuộc</option>
            <option value="favorites">Yêu thích</option>
          </select>
          <Button onClick={() => setShowAddWord((value) => !value)} className="py-3 whitespace-nowrap">
            {showAddWord ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAddWord ? 'Đóng' : 'Thêm từ'}
          </Button>
        </div>

        {showAddWord && (
          <form onSubmit={handleAddCustomWord} className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-5">
            <input required aria-label="Từ tiếng Anh" placeholder="Từ tiếng Anh" value={customWord.word} onChange={(event) => setCustomWord({ ...customWord, word: event.target.value })} className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white" />
            <input required aria-label="Nghĩa tiếng Việt" placeholder="Nghĩa tiếng Việt" value={customWord.meaning} onChange={(event) => setCustomWord({ ...customWord, meaning: event.target.value })} className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white" />
            <input aria-label="Phiên âm" placeholder="Phiên âm" value={customWord.phonetic} onChange={(event) => setCustomWord({ ...customWord, phonetic: event.target.value })} className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white" />
            <input aria-label="Chủ đề" placeholder="Chủ đề" value={customWord.topic} onChange={(event) => setCustomWord({ ...customWord, topic: event.target.value })} className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white" />
            <input aria-label="Ví dụ tiếng Anh" placeholder="Ví dụ tiếng Anh" value={customWord.example} onChange={(event) => setCustomWord({ ...customWord, example: event.target.value })} className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white" />
            <input aria-label="Dịch ví dụ" placeholder="Dịch ví dụ" value={customWord.exampleTranslation} onChange={(event) => setCustomWord({ ...customWord, exampleTranslation: event.target.value })} className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white" />
            <label className="text-sm">Từ loại<select aria-label="Từ loại" value={customWord.pos} onChange={event=>setCustomWord({...customWord,pos:event.target.value})} className="block w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3">{["noun","verb","adjective","adverb","preposition","conjunction","pronoun","phrase"].map(pos=><option key={pos} value={pos}>{pos}</option>)}</select></label>
            <Button type="submit" className="sm:col-span-2 py-3">Lưu từ cá nhân</Button>
          </form>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none">
        {topics.map(t => (
          <button
            key={t}
            onClick={() => setSelectedTopic(t)}
            className={cn(
              'px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap border',
              selectedTopic === t 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20' 
                : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-slate-300'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {visibleWords.map(w => {
          const p = progress[w.id];
          return (
            <Card key={w.id} className="group hover:border-zinc-700 transition-all border-zinc-800/80 p-0 overflow-hidden flex flex-col bg-[#0c0c0e]">
              <div className="p-5 sm:p-8 space-y-5 flex-grow">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h4 className="text-2xl sm:text-3xl font-bold tracking-tighter text-white break-words">{w.word}</h4>
                    <p className="text-zinc-500 font-mono text-sm mt-1">{w.phonetic}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => toggleFavorite(w.id)}
                      aria-label={favorites.has(w.id) ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
                      className={cn('p-2.5 sm:p-3 rounded-2xl bg-zinc-800 transition-all shadow-lg', favorites.has(w.id) ? 'text-rose-400' : 'text-zinc-400 hover:text-rose-400')}
                    >
                      <Heart className="w-5 h-5" fill={favorites.has(w.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button 
                      onClick={() => onSyncTask(w)}
                      title="Lưu vào Google Tasks"
                      aria-label="Save to Google Tasks"
                      className="p-2.5 sm:p-3 rounded-2xl bg-zinc-800 text-zinc-400 hover:bg-orange-600 hover:text-white transition-all shadow-lg"
                    >
                      <ClipboardList className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => speak(w.word)}
                      title="Play pronunciation"
                      aria-label="Play pronunciation"
                      className="p-2.5 sm:p-3 rounded-2xl bg-zinc-800 text-zinc-400 hover:bg-indigo-600 hover:text-white transition-all shadow-lg"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <label className="flex gap-2 text-sm text-zinc-400"><input type="checkbox" checked={selectedIds.has(w.id)} onChange={() => setSelectedIds(current => {const next=new Set(current);if(next.has(w.id))next.delete(w.id);else next.add(w.id);return next;})} /> Chọn {w.word}</label>
                <div className="space-y-2">
                  <p className="font-bold text-slate-200 text-base sm:text-lg leading-snug">{w.meaning}</p>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md inline-block">{w.pos}</span>
                </div>
                {w.example && <div className="pt-5 border-t border-zinc-800/50 space-y-3">
                  <p className="text-sm font-medium leading-relaxed text-slate-400 italic">"{w.example}"</p>
                  <p className="text-[13px] text-zinc-600 font-medium leading-relaxed">{w.exampleTranslation}</p>
                </div>}
                
                <Button 
                  onClick={() => onLearnMore(w.word, w.meaning, w.id)}
                  variant="outline" 
                  className="w-full mt-6 text-[10px] py-2.5 rounded-xl border-zinc-800 uppercase tracking-[0.2em] font-black transition-all hover:border-indigo-500/50 hover:text-indigo-400"
                >
                  Giải thích bằng AI
                </Button>
              </div>
              <div className="px-5 sm:px-8 py-4 bg-[#09090b] flex justify-between items-center border-t border-zinc-800/50">
                <div className="flex gap-2">
                  {p && <button onClick={() => void onResetWord(w.id)} className="text-[10px] font-black uppercase text-amber-400 hover:text-amber-300">Học lại</button>}
                  {p && <button onClick={() => void onDelayWord(w.id)} className="text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300">Hoãn 1 ngày</button>}
                  {w.id.startsWith('custom-') && <button className="text-xs text-indigo-300" onClick={() => { setEditingId(w.id); setCustomWord({word:w.word,meaning:w.meaning,phonetic:w.phonetic,pos:w.pos,example:w.example,exampleTranslation:w.exampleTranslation,topic:w.topic});setShowAddWord(true);window.scrollTo({top:0,behavior:'smooth'}); }}>Sửa từ</button>}
                  {w.id.startsWith('custom-') && (
                    <button
                      onClick={async () => {
                        if (!window.confirm('Xóa từ cá nhân và tiến độ? Lịch sử đã học sẽ được giữ.')) return;
                        try { await onResetWord(w.id); deleteCustomWord(w.id); setVocabularyVersion(value => value + 1); } catch (error) { toast.error((error as Error).message); }
                      }}
                      className="text-[10px] font-black uppercase text-rose-400 hover:text-rose-300"
                    >
                      Xóa từ
                    </button>
                  )}
                  {!p && !w.id.startsWith('custom-') && <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Trạng thái</span>}
                </div>
                <span className={cn(
                  'text-[10px] font-black uppercase tracking-[0.2em]',
                  p ? 'text-emerald-500' : 'text-zinc-700'
                )}>
                  {getLearningStatusLabel(p)}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
      {visibleCount < words.length && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={() => setVisibleCount((count) => count + 30)}>
            Xem thêm ({words.length - visibleCount} từ)
          </Button>
        </div>
      )}
      {words.length === 0 && <div className="text-center py-16 text-zinc-500">Không tìm thấy từ phù hợp với bộ lọc.</div>}
    </motion.div>
  );
}
