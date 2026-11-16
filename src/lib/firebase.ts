import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, memoryLocalCache } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const requiredEnv = (key: string,value:string|undefined) => {
  if (!value) {
    return key.endsWith("PROJECT_ID") ? "demo-eng-master" : key.endsWith("AUTH_DOMAIN") ? "demo-eng-master.firebaseapp.com" : "demo-guest-mode";
  }
  return value;
};

const firebaseConfig = {
  apiKey: requiredEnv("VITE_FIREBASE_API_KEY",import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: requiredEnv("VITE_FIREBASE_AUTH_DOMAIN",import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: requiredEnv("VITE_FIREBASE_PROJECT_ID",import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: requiredEnv("VITE_FIREBASE_STORAGE_BUCKET",import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: requiredEnv("VITE_FIREBASE_MESSAGING_SENDER_ID",import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: requiredEnv("VITE_FIREBASE_APP_ID",import.meta.env.VITE_FIREBASE_APP_ID),
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// IndexedDB/outbox is the single durable coordinator; SDK memory cache cannot replay separately after reload.
export const db = initializeFirestore(app, { localCache: memoryLocalCache() });
export const cloudConfigured = Boolean(import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID);
export const analytics =
  typeof window !== 'undefined' && firebaseConfig.measurementId ? getAnalytics(app) : null;
