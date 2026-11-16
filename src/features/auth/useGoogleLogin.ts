import { useRef, useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { auth } from '../../lib/firebase';
import { createGoogleProvider } from '../../services/googleWorkspace';
import { reportError } from '../../services/telemetry';

export function useGoogleLogin({ blocked, canStart, onSignedIn }: {
  blocked: boolean;
  canStart: () => boolean;
  onSignedIn: () => void;
}) {
  const pending = useRef(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const login = async () => {
    if (blocked || pending.current) return;
    if (!navigator.onLine) {
      toast.error('Kết nối mạng để đăng nhập và đồng bộ. Dữ liệu Khách vẫn được giữ trên thiết bị.');
      return;
    }
    if (!canStart()) return;
    pending.current = true;
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, createGoogleProvider());
      // Keep the guest session active until Google actually succeeds. A cancelled
      // popup must not clear the guest profile/progress through the auth listener.
      onSignedIn();
    } catch (error) {
      const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return;
      reportError('login', error);
      if (code === 'auth/popup-blocked') toast.error('Trình duyệt chặn cửa sổ Google. Cho phép cửa sổ bật lên rồi thử lại.');
      else if (code === 'auth/configuration-not-found') toast.error('Firebase Auth chưa được cấu hình. Thử chế độ Khách.');
      else if (code === 'auth/unauthorized-domain') toast.error('Domain chưa được cho phép đăng nhập Google.');
      else toast.error('Chưa đăng nhập được. Dữ liệu trên thiết bị vẫn được giữ; hãy thử lại.');
    } finally {
      pending.current = false;
      setIsSigningIn(false);
    }
  };
  return { login, isSigningIn };
}
