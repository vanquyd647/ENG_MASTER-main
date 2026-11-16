import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { applyOfflineUpdate } from './pwaUpdate';
let container: EventTarget;
const fixture = () => {
  const worker = Object.assign(new EventTarget(), { state: 'installed', postMessage: vi.fn() });
  const registration = { waiting: worker } as unknown as ServiceWorkerRegistration;
  return { worker, registration };
};
beforeEach(() => {
  container = new EventTarget(); vi.stubGlobal('navigator', { serviceWorker: container });
  delete document.documentElement.dataset.reloadApproved;
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); delete document.documentElement.dataset.reloadApproved; });
it('reloads an approved stale notice even when the waiting worker has already disappeared', async () => {
  const reload = vi.fn();
  await applyOfflineUpdate({ waiting: null } as ServiceWorkerRegistration, { reload });
  expect(reload).toHaveBeenCalledTimes(1);
  expect(document.documentElement.dataset.reloadApproved).toBe('true');
});
it('waits for activation and reloads only once when both lifecycle notifications arrive', async () => {
  const { worker, registration } = fixture(), reload = vi.fn();
  const remove = vi.spyOn(container, 'removeEventListener');
  const update = applyOfflineUpdate(registration, { reload });
  expect(worker.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
  expect(reload).not.toHaveBeenCalled(); expect(document.documentElement.dataset.reloadApproved).toBeUndefined();
  container.dispatchEvent(new Event('controllerchange'));
  worker.state = 'activated'; worker.dispatchEvent(new Event('statechange'));
  await update; expect(reload).toHaveBeenCalledTimes(1); expect(remove).toHaveBeenCalled();
});
it('also completes when activation succeeds without a controllerchange notification', async () => {
  const { worker, registration } = fixture(), reload = vi.fn();
  const update = applyOfflineUpdate(registration, { reload });
  worker.state = 'activated'; worker.dispatchEvent(new Event('statechange'));
  await update; expect(reload).toHaveBeenCalledTimes(1);
});
it('times out without disabling unload protection and allows a later retry to succeed', async () => {
  vi.useFakeTimers(); const { registration } = fixture(), reload = vi.fn();
  const failed = expect(applyOfflineUpdate(registration, { reload, timeoutMs: 50 })).rejects.toThrow('timed out');
  await vi.advanceTimersByTimeAsync(50); await failed;
  container.dispatchEvent(new Event('controllerchange'));
  expect(reload).not.toHaveBeenCalled(); expect(document.documentElement.dataset.reloadApproved).toBeUndefined();
  const retry = applyOfflineUpdate(registration, { reload });
  container.dispatchEvent(new Event('controllerchange')); await retry;
  expect(reload).toHaveBeenCalledTimes(1);
});
it('reports a message failure and removes its reload listener', async () => {
  const { worker, registration } = fixture(), reload = vi.fn();
  worker.postMessage.mockImplementation(() => { throw Error('message failed'); });
  await expect(applyOfflineUpdate(registration, { reload })).rejects.toThrow('message failed');
  container.dispatchEvent(new Event('controllerchange')); expect(reload).not.toHaveBeenCalled();
});
it('rejects a replaced worker instead of hanging or approving an unrelated reload', async () => {
  const { worker, registration } = fixture(), reload = vi.fn();
  const update = applyOfflineUpdate(registration, { reload });
  worker.state = 'redundant'; worker.dispatchEvent(new Event('statechange'));
  await expect(update).rejects.toThrow('replaced'); expect(reload).not.toHaveBeenCalled();
});
