import type { CSSProperties, ReactNode } from "react";
import { motion } from "motion/react";
export function StudyCard({ flipped, busy, onFlip, className, style, children }: { flipped: boolean; busy: boolean; onFlip: () => void; className: string; style?: CSSProperties; children: ReactNode }) {
  return <motion.div role="button" tabIndex={busy ? -1 : 0} aria-disabled={busy} aria-pressed={flipped} aria-label={flipped ? "Mặt sau thẻ từ. Nhấn để xem từ vựng" : "Mặt trước thẻ từ. Nhấn để xem nghĩa"} onClick={() => { if (!busy) onFlip(); }} onKeyDown={(event) => { if (event.target === event.currentTarget && !busy && ["Enter", " "].includes(event.key)) { event.preventDefault(); onFlip(); } }} animate={{ rotateY: flipped ? 180 : 0 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className={className} style={style}>{children}</motion.div>;
}
