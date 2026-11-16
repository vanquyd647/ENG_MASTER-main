import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/utils";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  scrollBody = false,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  scrollBody?: boolean;
  className?: string;
}) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose); closeRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    if (scrollBody) document.body.style.overflow = 'hidden';
    const dialog = dialogRef.current;
    const focusableSelector =
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusable = dialog?.querySelectorAll<HTMLElement>(focusableSelector);
    (focusable?.[0] || dialog)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;

      const controls = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
      if (controls.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (scrollBody) document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isOpen, scrollBody]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          aria-hidden="true"
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={cn("relative bg-zinc-900 border border-zinc-800 w-full max-w-xl max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl sm:rounded-[32px] shadow-2xl p-5 sm:p-8 space-y-6", scrollBody && 'flex flex-col overflow-hidden p-0 sm:p-0 space-y-0', className)}
        >
          <div className={cn("flex justify-between items-center gap-3 text-white", scrollBody && 'shrink-0 border-b border-zinc-800 px-5 py-4 sm:px-8 sm:py-5')}>
            <h3 id={titleId} className="min-w-0 break-words text-xl sm:text-2xl font-bold tracking-tight">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Đóng hộp thoại"
              className="shrink-0 p-2 hover:bg-zinc-800 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
          <div className={cn("prose prose-invert max-w-none prose-p:leading-relaxed prose-li:my-1 prose-h3:text-lg prose-h3:font-bold prose-h3:mt-4 text-slate-300", scrollBody && 'min-h-0 overflow-y-auto overscroll-contain px-5 py-5 sm:px-8')}>
            {children}
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};

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
        "px-4 py-2 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
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
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
  ariaLabel?: string;
}) => {
  const classes = cn(
    "bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl shadow-black/10",
    onClick && "w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
    className,
  );

  if (onClick) {
    return (
      <button id={id} type="button" onClick={onClick} aria-label={ariaLabel} className={classes}>
        {children}
      </button>
    );
  }

  return <div id={id} className={classes}>{children}</div>;
};
