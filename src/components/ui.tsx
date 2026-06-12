import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/utils";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-zinc-900 border border-zinc-800 w-full max-w-xl max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl sm:rounded-[32px] shadow-2xl p-5 sm:p-8 space-y-6"
        >
          <div className="flex justify-between items-center text-white">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-full transition-all"
            >
              <LogOut className="w-5 h-5 rotate-180 text-zinc-500" />
            </button>
          </div>
          <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-li:my-1 prose-h3:text-lg prose-h3:font-bold prose-h3:mt-4 text-slate-300">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export const Button = ({
  children,
  onClick,
  className,
  variant = "primary",
  disabled = false,
  type = "button",
  id,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "success" | "danger";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  id?: string;
}) => {
  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20",
    secondary: "bg-zinc-800 text-slate-200 hover:bg-zinc-700",
    outline:
      "border border-zinc-700 text-slate-300 hover:bg-zinc-800 hover:text-white",
    ghost: "text-zinc-500 hover:bg-zinc-800 hover:text-slate-300",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-500/20",
  };

  return (
    <button
      id={id}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 cursor-pointer",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
};

export const Card = ({
  children,
  className,
  id,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
}) => (
  <div
    id={id}
    onClick={onClick}
    className={cn(
      "bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl shadow-black/10",
      className,
    )}
  >
    {children}
  </div>
);
