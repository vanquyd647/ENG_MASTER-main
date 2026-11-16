export type OwnerChange = 'local' | 'remote' | 'owner';
let owner = 'guest';
const listeners = new Set<(reason: OwnerChange) => void>();
export const getActiveOwner = () => owner;
export const ownerKeyFor = (key: string, ownerId: string) => ownerId === 'guest' ? key : `eng_master_owner_${encodeURIComponent(ownerId)}_${key}`;
export const ownerKey = (key: string) => ownerKeyFor(key, owner);
export const setActiveOwner = (next: string) => { if (!next || next === owner) return; owner = next; notifyOwnerStorage('owner'); };
export const subscribeOwner = (listener: (reason: OwnerChange) => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export const readOwnerItem = (key: string) => localStorage.getItem(ownerKey(key));
export const writeOwnerItem = (key: string, value: string) => { localStorage.setItem(ownerKey(key), value); notifyOwnerStorage('local'); };
export const notifyOwnerStorage = (reason: OwnerChange = 'local') => listeners.forEach(listener => listener(reason));
if (typeof window !== 'undefined') window.addEventListener('storage', event => {
  if (event.key?.startsWith(owner === 'guest' ? 'eng_master_' : `eng_master_owner_${encodeURIComponent(owner)}_`)) notifyOwnerStorage('remote');
});
