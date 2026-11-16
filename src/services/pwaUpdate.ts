// The notice can outlive registration.waiting (for example, another tab activates
// the update while a confirmation dialog is open). Approval must still reload.
export function applyOfflineUpdate(registration: ServiceWorkerRegistration, options: {
  reload?: () => void; timeoutMs?: number;
} = {}): Promise<void> {
  const worker = registration.waiting;
  const container = navigator.serviceWorker;
  return new Promise((resolve, reject) => {
    let settled = false;
    const cleanup = () => {
      clearTimeout(timer);
      container.removeEventListener('controllerchange', finish);
      worker?.removeEventListener('statechange', stateChanged);
    };
    const fail = (error: unknown) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };
    const finish = () => {
      if (settled) return;
      const previousApproval = document.documentElement.dataset.reloadApproved;
      try {
        document.documentElement.dataset.reloadApproved = 'true';
        (options.reload ?? (() => window.location.reload()))();
        settled = true;
        cleanup();
        resolve();
      } catch (error) {
        if (previousApproval === undefined) delete document.documentElement.dataset.reloadApproved;
        else document.documentElement.dataset.reloadApproved = previousApproval;
        fail(error);
      }
    };
    const stateChanged = () => {
      if (worker?.state === 'activated') finish();
      else if (worker?.state === 'redundant') fail(new Error('Update worker was replaced'));
    };
    const timer = setTimeout(() => {
      if (worker?.state === 'activated') finish();
      else fail(new Error('Update activation timed out'));
    }, options.timeoutMs ?? 12_000);
    // It may already have activated by the time the user confirms.
    if (!worker || worker.state === 'activated') { finish(); return; }
    if (worker.state === 'redundant') { fail(new Error('Update worker was replaced')); return; }
    container.addEventListener('controllerchange', finish);
    worker.addEventListener('statechange', stateChanged);
    try { worker.postMessage({ type: 'SKIP_WAITING' }); stateChanged(); }
    catch (error) { fail(error); }
  });
}
