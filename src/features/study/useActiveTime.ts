import { useEffect, useRef } from "react";
export const useActiveTime = () => {
  const seconds = useRef(0);
  const lastInput = useRef(Date.now());
  useEffect(() => {
    const activity = () => { lastInput.current = Date.now(); };
    const timer = setInterval(() => { if (document.visibilityState === "visible" && Date.now() - lastInput.current < 60_000) seconds.current++; }, 1000);
    for (const event of ["pointerdown", "keydown", "touchstart"]) document.addEventListener(event, activity, { passive: true });
    return () => { clearInterval(timer); for (const event of ["pointerdown", "keydown", "touchstart"]) document.removeEventListener(event, activity); };
  }, []);
  return () => { const elapsed = Math.min(seconds.current, 3600); seconds.current = 0; lastInput.current = Date.now(); return elapsed; };
};
