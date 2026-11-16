import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { activateGuestSession, deactivateGuestSession, loadGuestSession, saveGuestProfile, saveGuestProgress } from '../../lib/guestPersistence';

const mocks = vi.hoisted(() => ({ popup: vi.fn(), error: vi.fn(), report: vi.fn() }));
vi.mock('firebase/auth', () => ({ signInWithPopup: mocks.popup }));
vi.mock('../../lib/firebase', () => ({ auth: {} }));
vi.mock('../../services/googleWorkspace', () => ({ createGoogleProvider: () => ({}) }));
vi.mock('../../services/telemetry', () => ({ reportError: mocks.report }));
vi.mock('react-hot-toast', () => ({ toast: { error: mocks.error } }));
import { useGoogleLogin } from './useGoogleLogin';

beforeEach(() => {
  localStorage.clear(); vi.clearAllMocks();
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
  saveGuestProfile({ uid: 'guest_test', email: 'guest@local', displayName: 'Khách', totalWordsLearned: 1, studyTimeMinutes: 0, streak: 1 });
  saveGuestProgress({ 'rec-01': { easiness: 2.5, interval: 1, repetitions: 1, nextReviewDate: '2026-10-15T00:00:00.000Z' } });
  activateGuestSession();
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('Google login from a guest session', () => {
  it('keeps guest data while the popup is open and after cancellation, allowing another attempt', async () => {
    let reject!: (error: unknown) => void;
    mocks.popup.mockImplementationOnce(() => new Promise((_resolve, fail) => { reject = fail; }));
    const before = loadGuestSession();
    const signedIn = vi.fn(deactivateGuestSession);
    const { result } = renderHook(() => useGoogleLogin({ blocked: false, canStart: () => true, onSignedIn: signedIn }));
    let attempt!: Promise<void>;
    act(() => { attempt = result.current.login(); });
    expect(result.current.isSigningIn).toBe(true);
    expect(loadGuestSession()).toEqual(before);
    await act(async () => { reject({ code: 'auth/popup-closed-by-user' }); await attempt; });
    expect(result.current.isSigningIn).toBe(false);
    expect(signedIn).not.toHaveBeenCalled();
    expect(loadGuestSession()).toEqual(before);
    expect(mocks.error).not.toHaveBeenCalled();
    mocks.popup.mockResolvedValueOnce({});
    await act(async () => { await result.current.login(); });
    expect(signedIn).toHaveBeenCalledOnce();
    expect(loadGuestSession()).toEqual({ ...before, active: false });
  });

  it('allows one popup and switches out of guest only after successful authentication', async () => {
    let resolve!: (value: unknown) => void;
    mocks.popup.mockImplementation(() => new Promise(done => { resolve = done; }));
    const signedIn = vi.fn(deactivateGuestSession);
    const { result } = renderHook(() => useGoogleLogin({ blocked: false, canStart: () => true, onSignedIn: signedIn }));
    let attempt!: Promise<void>;
    act(() => { attempt = result.current.login(); void result.current.login(); });
    expect(mocks.popup).toHaveBeenCalledOnce();
    expect(signedIn).not.toHaveBeenCalled();
    expect(loadGuestSession().active).toBe(true);
    await act(async () => { resolve({}); await attempt; });
    expect(signedIn).toHaveBeenCalledOnce();
    expect(loadGuestSession().active).toBe(false);
    expect(Object.keys(loadGuestSession().progress)).toEqual(['rec-01']);
  });

  it('keeps guest data on a blocked popup and shows how to retry', async () => {
    mocks.popup.mockRejectedValueOnce({ code: 'auth/popup-blocked' });
    const before = loadGuestSession(), signedIn = vi.fn();
    const { result } = renderHook(() => useGoogleLogin({ blocked: false, canStart: () => true, onSignedIn: signedIn }));
    await act(async () => { await result.current.login(); });
    expect(signedIn).not.toHaveBeenCalled();
    expect(loadGuestSession()).toEqual(before);
    expect(mocks.error).toHaveBeenCalledWith(expect.stringContaining('cửa sổ bật lên'));
  });

  it('does not start authentication while offline, writing, or when pausing a study session is declined', async () => {
    const signedIn = vi.fn();
    const { result, rerender } = renderHook(({ blocked, approved }) => useGoogleLogin({ blocked, canStart: () => approved, onSignedIn: signedIn }), { initialProps: { blocked: true, approved: true } });
    await act(async () => { await result.current.login(); });
    rerender({ blocked: false, approved: false });
    await act(async () => { await result.current.login(); });
    rerender({ blocked: false, approved: true });
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    await act(async () => { await result.current.login(); });
    expect(mocks.popup).not.toHaveBeenCalled();
    expect(signedIn).not.toHaveBeenCalled();
    expect(loadGuestSession().active).toBe(true);
    expect(mocks.error).toHaveBeenCalledWith(expect.stringContaining('Kết nối mạng'));
  });
});
