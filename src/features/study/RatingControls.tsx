import { useEffect } from "react";
import { calculateNextReview, initialSRS } from "../../lib/srs";
import type { ProgressItem } from "../../types";
const ratings = [{ quality: 1, label: "Học lại", color: "text-rose-400" }, { quality: 3, label: "Khó", color: "text-amber-400" }, { quality: 4, label: "Tốt", color: "text-emerald-400" }, { quality: 5, label: "Dễ", color: "text-indigo-400" }];
export function RatingControls({ disabled, previous, onRate }: { disabled: boolean; previous?: ProgressItem; onRate: (quality: number) => void }) {
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (disabled || (event.target instanceof HTMLElement && event.target.closest("input,textarea,select"))) return;
      const index = ["1", "2", "3", "4"].indexOf(event.key);
      if (index >= 0) { event.preventDefault(); onRate(ratings[index].quality); }
    };
    document.addEventListener("keydown", keydown); return () => document.removeEventListener("keydown", keydown);
  }, [disabled, onRate]);
  return <div className="space-y-3"><div className="grid grid-cols-4 gap-2 sm:gap-3">{ratings.map((rating) => {
    const next = calculateNextReview(rating.quality, previous ? { ...previous, nextReviewDate: new Date(previous.nextReviewDate) } : initialSRS);
    return <button key={rating.quality} aria-label={rating.label} disabled={disabled} onClick={() => onRate(rating.quality)} className={`rounded-2xl border border-zinc-700 bg-zinc-900 px-2 py-3 text-xs font-bold disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-indigo-400 ${rating.color}`}><span>{rating.label}</span><span className="block mt-1 text-[10px] text-zinc-500">{next.interval} ngày</span></button>;
  })}</div><p className="text-center text-[10px] text-zinc-500">Phím 1–4 để đánh giá · Space hoặc Enter để lật thẻ</p></div>;
}
