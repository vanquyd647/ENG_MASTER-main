import { registerOfflinePack } from "./services/pwa";
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './app/ErrorBoundary';
import { MotionConfig } from 'motion/react';
import { scheduleStudyReminder } from './services/reminders';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary><MotionConfig reducedMotion="user"><App /></MotionConfig></ErrorBoundary>
  </StrictMode>,
);
scheduleStudyReminder();

window.addEventListener('load', () => void registerOfflinePack());
