import { reportError } from './telemetry';
export const registerOfflinePack = async () => {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return;
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
    const announce = () => { if (registration.waiting && navigator.serviceWorker.controller) window.dispatchEvent(new CustomEvent('eng-master-update', {detail: registration})); };
    announce();
    registration.addEventListener('updatefound', () => registration.installing?.addEventListener('statechange', announce));
    await navigator.serviceWorker.ready;
    window.dispatchEvent(new Event('eng-master-offline-ready'));
    document.documentElement.dataset.offlineReady = 'true';
  } catch (error) { reportError('offline-pack', error); window.dispatchEvent(new Event('eng-master-offline-error')); }
};
