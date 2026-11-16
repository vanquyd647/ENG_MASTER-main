import { getReminderHour } from "../lib/productPreferences";
import { subscribeOwner } from "../repositories/ownerStorage";
let timer: ReturnType<typeof setTimeout> | null = null;
export const clearStudyReminder = () => { if (timer) clearTimeout(timer); timer = null; };
export const scheduleStudyReminder = (hour = getReminderHour()) => {
  clearStudyReminder();
  if (!("Notification" in window) || Notification.permission !== "granted" || localStorage.getItem("app_notifications") !== "true") return;
  const next = new Date();
  next.setHours(hour, 0, 0, 0);
  if (next.getTime() <= Date.now()) next.setDate(next.getDate() + 1);
  timer = setTimeout(() => {
    if (document.visibilityState === "visible") new Notification("ENG_MASTER", { body: "Đến giờ ôn lại từ vựng hôm nay.", icon: "/icons/app-192.svg" });
    scheduleStudyReminder(hour);
  }, next.getTime() - Date.now());
};

subscribeOwner(() => scheduleStudyReminder());
