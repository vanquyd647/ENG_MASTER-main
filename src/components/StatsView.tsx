import type { PracticeSelection } from '../features/study/WorkplaceView';
import { PracticeInsights } from '../features/study/PracticeInsights';
import { getDecks } from "../lib/productPreferences";
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { motion } from 'motion/react';
import { TrendingUp, ArrowLeft, Info, Brain, Award, Target, Sparkles, Calendar } from 'lucide-react';
import { getVocabulary } from "../domain/catalog";
import { useCatalog } from "../domain/useCatalog";
import { getLearningStatus, getDueReviewQueue } from '../lib/learning';
import type { UserProgress } from '../types';
import type { StudyEvent } from '../types';
import { summarizeEvents } from '../domain/statistics';
import { cn } from '../lib/utils';
interface StatsViewProps {
    onPracticeQuestions?:(selection:PracticeSelection)=>void;
    progress: UserProgress;
    onBack: () => void;
    events?: StudyEvent[];
}
export function StatsView({ progress, onBack, onPracticeQuestions, events = [] }: StatsViewProps) {
    useCatalog();
    const [periodDays, setPeriodDays] = useState<7 | 30 | 90>(30);
    const measured = summarizeEvents(events, periodDays);
    // --- Real Stats Calculation ---
    const totalWords = getVocabulary().length;
    const progressList = getVocabulary().map((word) => progress[word.id]).filter(Boolean);
    const startedWordsCount = progressList.length;
    // 1. Learned vs In Progress vs New
    // "New": Not in progress
    const learnedCount = progressList.filter((item) => getLearningStatus(item) === 'learned' || getLearningStatus(item) === 'mastered').length;
    const inProgressCount = progressList.filter((item) => getLearningStatus(item) === 'learning').length;
    const newCount = Math.max(totalWords - startedWordsCount, 0);
    // 2. Interval distribution
    const intervalRanges = {
        '1 ngày hoặc ít hơn': 0,
        '2 - 6 ngày': 0,
        '7 - 14 ngày': 0,
        '15 - 30 ngày': 0,
        '> 30 ngày': 0,
    };
    progressList.forEach(p => {
        if (p.interval <= 1)
            intervalRanges['1 ngày hoặc ít hơn']++;
        else if (p.interval <= 6)
            intervalRanges['2 - 6 ngày']++;
        else if (p.interval <= 14)
            intervalRanges['7 - 14 ngày']++;
        else if (p.interval <= 30)
            intervalRanges['15 - 30 ngày']++;
        else
            intervalRanges['> 30 ngày']++;
    });
    const calculatedEasinessData = measured.days;
    // --- Final Data Binding ---
    const statusData = [
        { name: 'Từ mới', value: newCount, color: '#6366f1' },
        { name: 'Đang học', value: inProgressCount, color: '#f59e0b' },
        { name: 'Đã thuộc', value: learnedCount, color: '#10b981' },
    ];
    const intervalData = Object.entries(intervalRanges).map(([range, count]) => ({
        range,
        'Số lượng từ': count,
    }));
    const easinessData = calculatedEasinessData.length > 0
        ? calculatedEasinessData
        : [];
    // --- Summary Insights & Metrics ---
    const activeStatusPercentage = startedWordsCount > 0 ? Math.round((learnedCount / totalWords) * 100) : 0;
    const avgEasinessCurrent = progressList.length > 0
        ? parseFloat((progressList.reduce((sum, p) => sum + p.easiness, 0) / progressList.length).toFixed(2))
        : 2.50;
    const groups=[...new Set(getVocabulary().map(word=>word.topic))].map(topic=>({name:topic,words:getVocabulary().filter(word=>word.topic===topic)}));
  const breakdown=[...getDecks().map(deck=>({name:'Bộ từ: '+deck.name,words:getVocabulary().filter(word=>deck.wordIds.includes(word.id))})),...groups].map(group=>({name:group.name,total:group.words.length,started:group.words.filter(word=>progress[word.id]).length,mastered:group.words.filter(word=>(progress[word.id]?.repetitions || 0)>=7).length})).sort((a,b)=>b.started-a.started);
  const difficult=getVocabulary().filter(word=>(progress[word.id]?.wrongCount || 0)>0).sort((a,b)=>(progress[b.id].wrongCount || 0)-(progress[a.id].wrongCount || 0)).slice(0,10);
  return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all shadow-md" title="Quay lại tổng quan" aria-label="Quay lại tổng quan">
              <ArrowLeft className="w-4 h-4"/>
            </button>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <TrendingUp className="text-indigo-400 w-6 h-6 sm:w-8 sm:h-8"/>
              Phân Tích Thống Kê
            </h2>
          </div>
          <p className="text-sm text-zinc-400 font-medium">
            Phân tích chi tiết tiến trình ghi nhớ từ vựng qua thuật toán lặp khoảng cách SuperMemo (SM-2).
          </p>
        </div>

        <div className="flex rounded-xl border border-zinc-800 bg-zinc-900 p-1" aria-label="Khoảng thời gian thống kê">
          {[7, 30, 90].map((days) => (<button key={days} type="button" onClick={() => setPeriodDays(days as 7 | 30 | 90)} className={cn('rounded-lg px-3 py-2 text-xs font-bold', periodDays === days ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white')}>
              {days} ngày
            </button>))}
        </div>

      </div>

      <PracticeInsights days={periodDays} onPractice={onPracticeQuestions} />
      {startedWordsCount === 0 ? (<div className="bg-amber-500/10 border border-amber-500/20 text-amber-100 rounded-3xl p-6 sm:p-8 flex items-start gap-4">
          <Info className="w-6 h-6 shrink-0 text-amber-400"/>
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-lg">Chưa có dữ liệu học tập</h3>
              <p className="text-sm text-amber-200/80 leading-relaxed font-medium">
                Hãy hoàn thành một lượt ôn tập hoặc bài kiểm tra. Thống kê sẽ xuất hiện khi ứng dụng có dữ liệu thật của bạn.
              </p>
            </div>
            <button type="button" onClick={onBack} className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-zinc-950 hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200">
              Bắt đầu học
            </button>
          </div>
        </div>) : (<>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{[
                ["Lượt học", measured.attempts], ["Từ duy nhất", measured.uniqueWords], ["Phút học thực", measured.activeMinutes], ["Đúng quiz", measured.accuracy === null ? "Chưa có" : `${measured.accuracy}%`]
            ].map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"><div className="text-xl font-bold">{value}</div><div className="text-xs text-zinc-400">{label} · {periodDays} ngày</div></div>)}</div>
      <p className="text-xs text-zinc-400">Cloud tải tối đa 10.000 lượt trong 90 ngày gần nhất. Backup trong Cài đặt lấy toàn bộ lịch sử Cloud theo từng trang khi có mạng.</p>
      {new Set(events.map(event=>event.wordId)).size < startedWordsCount && <p className="text-sm text-amber-300">Tiến độ cũ chưa có lịch sử từng lượt học. Các biểu đồ theo thời gian sẽ bắt đầu từ những lượt học mới.</p>}
      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0c0c0e] border border-zinc-800/80 rounded-2xl sm:rounded-[32px] p-4 sm:p-6 flex items-center justify-between shadow-2xl relative overflow-hidden group">
          <div className="space-y-2 relative z-10">
            <div className="text-zinc-400 font-bold text-xs uppercase tracking-wider">Tổng từ vựng</div>
            <div className="text-3xl sm:text-4xl font-black text-white">{totalWords}</div>
            <div className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full inline-block">Mục tiêu TOEIC</div>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 w-12 h-12 rounded-[20px] flex items-center justify-center text-indigo-400 relative z-10">
            <Brain className="w-6 h-6"/>
          </div>
        </div>

        <div className="bg-[#0c0c0e] border border-zinc-800/80 rounded-2xl sm:rounded-[32px] p-4 sm:p-6 flex items-center justify-between shadow-2xl relative overflow-hidden group">
          <div className="space-y-2 relative z-10">
            <div className="text-zinc-400 font-bold text-xs uppercase tracking-wider">Đang chinh phục</div>
            <div className="text-3xl sm:text-4xl font-black text-amber-400">{startedWordsCount}</div>
            <div className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full inline-block">Đang nằm trong SRS</div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 w-12 h-12 rounded-[20px] flex items-center justify-center text-amber-400 relative z-10">
            <Target className="w-6 h-6"/>
          </div>
        </div>

        <div className="bg-[#0c0c0e] border border-zinc-800/80 rounded-2xl sm:rounded-[32px] p-4 sm:p-6 flex items-center justify-between shadow-2xl relative overflow-hidden group">
          <div className="space-y-2 relative z-10">
            <div className="text-zinc-400 font-bold text-xs uppercase tracking-wider">Trình độ Thuộc</div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400">{learnedCount}</div>
            <div className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block">Repetitions &ge; 3</div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 w-12 h-12 rounded-[20px] flex items-center justify-center text-emerald-400 relative z-10">
            <Award className="w-6 h-6"/>
          </div>
        </div>

        <div className="bg-[#0c0c0e] border border-zinc-800/80 rounded-2xl sm:rounded-[32px] p-4 sm:p-6 flex items-center justify-between shadow-2xl relative overflow-hidden group">
          <div className="space-y-2 relative z-10">
            <div className="text-zinc-400 font-bold text-xs uppercase tracking-wider">Độ dễ trung bình (EF)</div>
            <div className="text-3xl sm:text-4xl font-black text-indigo-400">{startedWordsCount ? avgEasinessCurrent.toFixed(2) : "Chưa có"}</div>
            <div className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full inline-block">Tiêu chuẩn: 2.50</div>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 w-12 h-12 rounded-[20px] flex items-center justify-center text-indigo-400 relative z-10">
            <TrendingUp className="w-6 h-6"/>
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-zinc-800 p-5 space-y-4"><h3 className="font-bold text-lg">Theo chủ đề và bộ từ</h3><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr><th className="p-2">Nhóm</th><th className="p-2">Đã bắt đầu</th><th className="p-2">Thành thạo (≥7)</th></tr></thead><tbody>{breakdown.map(group=><tr key={group.name} className="border-t border-zinc-800"><th className="p-2 font-medium">{group.name}</th><td className="p-2">{group.started}/{group.total}</td><td className="p-2">{group.mastered}</td></tr>)}</tbody></table></div><h3 className="font-bold">Từ cần chú ý</h3>{difficult.length ? <p className="text-sm text-zinc-400">{difficult.map(word=>word.word+' ('+progress[word.id].wrongCount+' điểm lỗi hiện tại)').join(', ')}</p> : <p className="text-sm text-zinc-400">Chưa có từ bị đánh dấu lỗi.</p>}</section>
      <p className="text-sm text-zinc-400">Hiện có {getDueReviewQueue(progress).length} từ đến hạn; {progressList.filter(item=>item.repetitions >= 7).length} từ thành thạo (≥7 lần nhớ).</p>
      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Learned vs In Progress Donut Chart */}
        <div className="bg-[#0c0c0e] border border-zinc-800/80 rounded-2xl sm:rounded-[32px] p-4 sm:p-6 flex flex-col justify-between shadow-2xl min-h-[360px] sm:min-h-[400px]">
          <div className="space-y-1 pb-4">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-400"/>
              Tỷ Lệ Chinh Phục Từ Vựng
            </h3>
            <p className="text-xs text-zinc-500 font-medium">Sự phân hóa của trạng thái từ học tại hệ thống.</p>
          </div>
          
          <div className="relative flex items-center justify-center h-48">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={1} initialDimension={{width:300,height:300}}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color}/>))}
                </Pie>
                <Tooltip contentStyle={{
                background: '#121214',
                border: '1px solid #27272a',
                borderRadius: '16px',
                color: '#f8fafc',
                fontFamily: 'sans-serif',
                fontSize: '12px'
            }}/>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Summary Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <span className="text-2xl font-black text-white">
                {`${activeStatusPercentage}%`}
              </span>
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Chinh Phục</span>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            {statusData.map((item) => (<div key={item.name} className="flex justify-between items-center py-1 border-b border-zinc-800/40 last:border-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}/>
                  <span className="text-xs font-bold text-zinc-400">{item.name}</span>
                </div>
                <span className="text-xs font-black text-slate-200">{item.value} từ</span>
              </div>))}
          </div>
        </div>

        {/* Interval Distribution Bar Chart */}
        <div className="bg-[#0c0c0e] border border-zinc-800/80 rounded-2xl sm:rounded-[32px] p-4 sm:p-6 lg:col-span-2 flex flex-col justify-between shadow-2xl min-h-[360px] sm:min-h-[400px]">
          <div className="space-y-1 pb-4">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400"/>
              Khoảng Cách Ôn Tập (Intervals)
            </h3>
            <p className="text-xs text-zinc-500 font-medium">Khoảng cách lặp lại (ngày) trước khi từ được yêu cầu ôn tập tiếp theo.</p>
          </div>

          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={1}>
              <BarChart data={intervalData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false}/>
                <XAxis dataKey="range" stroke="#71717a" fontSize={10} fontWeight={600} tickLine={false} axisLine={false}/>
                <YAxis stroke="#71717a" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} allowDecimals={false}/>
                <Tooltip cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} contentStyle={{
                background: '#121214',
                border: '1px solid #27272a',
                borderRadius: '16px',
                color: '#f8fafc',
                fontFamily: 'sans-serif',
                fontSize: '11px'
            }}/>
                <Bar dataKey="Số lượng từ" fill="#6366f1" radius={[8, 8, 0, 0]} maxBarSize={45}>
                  {intervalData.map((entry, index) => (<Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#818cf8'}/>))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-2">
            <Info className="w-4 h-4 text-zinc-600"/>
            <span>Khoảng cách ôn tập lớn hơn nghĩa là trí nhớ dài hạn của bạn đang tốt lên!</span>
          </div>
        </div>
      </div>

      {/* Row for Easiness Curve over Time */}
      <div className="bg-[#0c0c0e] border border-zinc-800/80 rounded-2xl sm:rounded-[32px] p-4 sm:p-6 shadow-2xl">
        <div className="space-y-1 pb-6 border-b border-zinc-800/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400"/>
              Độ Dễ Bài Học (Easiness Factor) Theo Thời Gian
            </h3>
            <p className="text-xs text-zinc-500 font-medium font-bold">Lượng hóa mức độ ghi nhớ dễ hay khó của các bộ từ được nạp vào não bạn.</p>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-2xl flex items-center gap-3 w-fit">
            <div className="w-3 h-3">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse"/>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Xu hướng độ dễ ghi nhớ</span>
          </div>
        </div>

        <div className="h-72 mt-6">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={1}>
            <AreaChart data={easinessData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEasiness" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false}/>
              <XAxis dataKey="date" stroke="#71717a" fontSize={10} fontWeight={600} tickLine={false} axisLine={false}/>
              <YAxis stroke="#71717a" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} domain={[1.3, 'auto']} tickFormatter={(val) => val.toFixed(1)}/>
              <Tooltip contentStyle={{
                background: '#121214',
                border: '1px solid #27272a',
                borderRadius: '16px',
                color: '#f8fafc',
                fontFamily: 'sans-serif',
                fontSize: '11px'
            }}/>
              <Area type="monotone" dataKey="Độ dễ (EF)" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorEasiness)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
        </>)}
    </motion.div>);
}
