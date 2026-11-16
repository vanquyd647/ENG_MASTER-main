import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
vi.mock('../services/pwaUpdate', () => ({ applyOfflineUpdate: vi.fn() }));
import { applyOfflineUpdate } from '../services/pwaUpdate';
import { PwaNotice } from './PwaNotice';
const registration = { waiting: {} } as ServiceWorkerRegistration;
beforeEach(() => {
  vi.mocked(applyOfflineUpdate).mockReset().mockImplementation(() => new Promise(() => {}));
  vi.stubGlobal('navigator', { serviceWorker: { controller: {}, getRegistration: async () => registration } });
  vi.spyOn(window, 'confirm').mockReturnValue(true);
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });
it('does not advertise an initial installation as an available update', async () => {
  vi.stubGlobal('navigator', { serviceWorker: { controller: null, getRegistration: async () => registration } });
  await act(async () => { render(<PwaNotice />); });
  expect(screen.queryByRole('button', { name: 'Cập nhật' })).not.toBeInTheDocument();
});
it('blocks update while saving and respects cancel without starting activation', async () => {
  const view = render(<PwaNotice busy />);
  const button = await screen.findByRole('button', { name: 'Cập nhật' });
  expect(button).toBeDisabled(); view.rerender(<PwaNotice />);
  vi.mocked(window.confirm).mockReturnValue(false); fireEvent.click(button);
  expect(applyOfflineUpdate).not.toHaveBeenCalled(); expect(button).toBeEnabled();
});
it('shows activation progress, rejects duplicate clicks and enables retry after a failure', async () => {
  let reject!: (error: Error) => void;
  vi.mocked(applyOfflineUpdate).mockImplementationOnce(() => new Promise((_resolve, fail) => { reject = fail; }));
  render(<PwaNotice />); fireEvent.click(await screen.findByRole('button', { name: 'Cập nhật' }));
  expect(screen.getByRole('button', { name: 'Đang cập nhật…' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Để sau' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Đang cập nhật…' })); expect(applyOfflineUpdate).toHaveBeenCalledTimes(1);
  await act(async () => reject(Error('timeout')));
  expect(screen.getByRole('alert')).toHaveTextContent('Chưa thể cập nhật');
  fireEvent.click(screen.getByRole('button', { name: 'Cập nhật' }));
  expect(applyOfflineUpdate).toHaveBeenCalledTimes(2); expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
it('defers an update without confirming or activating it', async () => {
  render(<PwaNotice />); fireEvent.click(await screen.findByRole('button', { name: 'Để sau' }));
  expect(screen.queryByRole('button', { name: 'Cập nhật' })).not.toBeInTheDocument();
  expect(window.confirm).not.toHaveBeenCalled(); expect(applyOfflineUpdate).not.toHaveBeenCalled();
});
