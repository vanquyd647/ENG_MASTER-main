import { auth } from "../lib/firebase";
import { GoogleAuthProvider, reauthenticateWithPopup, type User } from "firebase/auth";
export const createGoogleProvider = (scopes: string[] = []) => {
  const provider = new GoogleAuthProvider(); scopes.forEach((scope) => provider.addScope(scope));
  provider.setCustomParameters({ prompt: "select_account" }); return provider;
};
const tokens = new Map<string, { token: string; expires: number }>();
export const clearGoogleTokens = () => tokens.clear();
export const googleFetch = async (user: User, url: string, init: RequestInit = {}, retry = true): Promise<Response> => {
  if(auth.currentUser?.uid !== user.uid)throw new Error("Tài khoản đã thay đổi. Hãy thực hiện lại tác vụ.");
  const scope = url.includes("/tasks/") ? "tasks" : url.includes("/calendar/") ? "calendar.events" : "drive.file";
  const key = `${user.uid}:${scope}`;
  let credential = tokens.get(key);
  if (!credential || credential.expires < Date.now()) {
    const result = await reauthenticateWithPopup(user, createGoogleProvider([`https://www.googleapis.com/auth/${scope}`]));
    const token = GoogleAuthProvider.credentialFromResult(result)?.accessToken;
    if (!token) throw new Error("Chưa được cấp quyền cho tác vụ Google này.");
    credential = { token, expires: Date.now() + 50 * 60_000 }; tokens.set(key, credential);
  }
  if(auth.currentUser?.uid !== user.uid)throw new Error("Tài khoản đã thay đổi. Hãy thực hiện lại tác vụ.");
  const headers = new Headers(init.headers); headers.set("Authorization", `Bearer ${credential.token}`);
  const response = await fetch(url, { ...init, headers, signal: init.signal || AbortSignal.timeout(30_000) });
  const insufficientScope=response.status===403 && await response.clone().json().then(body=>body.error?.errors?.some((error:{reason?:string})=>error.reason==='insufficientPermissions')===true).catch(()=>false);
  if ((response.status===401 || insufficientScope) && retry) { tokens.delete(key); return googleFetch(user, url, init, false); }
  return response;
};
export const getApiErrorMessage = async (response: Response) => {
  try { const body = await response.json(); return typeof body.error === "string" ? body.error : body.error?.message || `${response.status} ${response.statusText}`; }
  catch { return `${response.status} ${response.statusText}`; }
};
export const googleEventId = async (uid: string, date: string) => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${uid}:${date}`)))).map((byte) => byte.toString(16).padStart(2, "0")).join("");
