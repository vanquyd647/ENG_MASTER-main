type Journal<T> = { version: 1; owner: string; createdAt: string; snapshot: T };
const keyFor = (owner: string) => `eng_master_restore_journal_v1_${owner}`;
const activeOwners = new Set<string>();

export class RestoreRecoveryError extends Error {
  constructor() {
    super("Chưa thể phục hồi dữ liệu trước khi nhập. Bản chụp vẫn được giữ trên thiết bị này; hãy kết nối lại và thử phục hồi trước khi tiếp tục học.");
    this.name = "RestoreRecoveryError";
  }
}

export const recoverRestore = async <T>(owner: string, restore: (snapshot: T) => Promise<void>) => {
  const raw = localStorage.getItem(keyFor(owner));
  if (!raw) return false;
  if (activeOwners.has(owner)) throw new RestoreRecoveryError();
  activeOwners.add(owner);
  try {
    const journal = JSON.parse(raw) as Journal<T>;
    if (journal.version !== 1 || journal.owner !== owner || !journal.snapshot) throw new RestoreRecoveryError();
    await restore(journal.snapshot);
    localStorage.removeItem(keyFor(owner));
    return true;
  } catch {
    throw new RestoreRecoveryError();
  } finally { activeOwners.delete(owner); }
};

export const runRecoverableRestore = async <T, R>({ owner, snapshot, apply, restore }: {
  owner: string; snapshot: () => Promise<T>; apply: () => Promise<R>; restore: (snapshot: T) => Promise<void>;
}): Promise<R> => {
  if (activeOwners.has(owner) || localStorage.getItem(keyFor(owner))) throw new RestoreRecoveryError();
  activeOwners.add(owner);
  try {
    const previous = await snapshot();
    // If storage is unavailable/full, abort before any destructive Cloud write.
    localStorage.setItem(keyFor(owner), JSON.stringify({ version: 1, owner, createdAt: new Date().toISOString(), snapshot: previous } satisfies Journal<T>));
    try {
      const result = await apply();
      localStorage.removeItem(keyFor(owner));
      return result;
    } catch (error) {
      try {
        await restore(previous);
        localStorage.removeItem(keyFor(owner));
      } catch { throw new RestoreRecoveryError(); }
      throw new Error(`Nhập dữ liệu thất bại; đã phục hồi dữ liệu cũ. ${(error as Error).message}`);
    }
  } finally { activeOwners.delete(owner); }
};
