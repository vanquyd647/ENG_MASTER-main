import { useEffect, useRef } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { reportError } from '../../services/telemetry';
export function useAuthController(isGuest: boolean, initializeGuest: () => boolean, onUser: (user: User | null) => Promise<void>) {
  const handlers = useRef({initializeGuest,onUser}); handlers.current={initializeGuest,onUser};
  useEffect(() => {
    if (isGuest || handlers.current.initializeGuest()) return;
    let active=true;
    const unsubscribe=onAuthStateChanged(auth,user=>{ if(active) void handlers.current.onUser(user).catch(error=>reportError('auth-load',error)); });
    return ()=>{active=false;unsubscribe();};
  },[isGuest]);
}
