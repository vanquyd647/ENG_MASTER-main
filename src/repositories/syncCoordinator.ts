import { reportError } from "../services/telemetry";
import { acknowledgeOperation, getPendingOperations, queueOperation, type PendingOperation, type OperationAcknowledgement } from "./localRepository";
type Status = { pending: number; syncing: boolean; error: string | null; code?: string };
const statuses = new Map<string, Status>();
const listeners = new Set<() => void>();
const active = new Map<string, Promise<void>>();
const paused = new Set<string>();
export const withPausedSync = async <T,>(owner:string,action:()=>Promise<T>):Promise<T> => {
  if(paused.has(owner))throw new Error('Đang tiếp nhận dữ liệu Cloud.');
  paused.add(owner);
  try {
    await active.get(owner);
    return await (typeof navigator!=='undefined' && navigator.locks?navigator.locks.request(`eng-master-sync-${owner}`,action):action());
  } finally {paused.delete(owner);}
};
export const getSyncStatus = (owner: string): Status => statuses.get(owner) || { pending: 0, syncing: false, error: null };
export const subscribeSync = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export const resetSyncStatus = (owner: string) => update(owner,{pending:0,syncing:false,error:null});
const update = (owner: string, status: Status) => { statuses.set(owner, status); listeners.forEach((listener) => listener()); };
export const flushOperations = (owner: string, send: (operation: PendingOperation) => Promise<OperationAcknowledgement | void>, force = false): Promise<void> => {
  if(paused.has(owner))return Promise.resolve();
  if (active.has(owner)) return active.get(owner)!;
  const execute = async () => {
    if (!force && getSyncStatus(owner).code === 'dataset-changed') return;
    const operations = await getPendingOperations(owner);
    update(owner, { pending: operations.length, syncing: false, error: getSyncStatus(owner).error });
    if (typeof navigator !== "undefined" && !navigator.onLine) return;
    for (let index = 0; index < operations.length; index++) {
      const operation = operations[index];
      if (!force && operation.nextAttemptAt > Date.now()) break;
      update(owner, { pending: operations.length - index, syncing: true, error: null });
      try { const canonical = await send(operation); await acknowledgeOperation(operation, canonical || undefined); }
      catch (error) {
        reportError("sync-send",error,{operationId:operation.id,attempt:operation.attempts + 1});
        const retained=await queueOperation({ ...operation, attempts: operation.attempts + 1, nextAttemptAt: Date.now() + Math.min(60_000, 1000 * 2 ** Math.min(operation.attempts, 6)) });
        if(!retained){const pending=await getPendingOperations(owner);update(owner,{pending:pending.length,syncing:false,error:null});return;}
        const code=error && typeof error==='object' && 'code' in error?String(error.code):undefined;
        update(owner, { pending: operations.length - index, syncing: false, error: error instanceof Error ? error.message : "Chưa thể đồng bộ",code }); return;
      }
    }
    const pending = await getPendingOperations(owner);
    update(owner, { pending: pending.length, syncing: false, error: pending.length ? getSyncStatus(owner).error : null });
  };
  const task = (typeof navigator !== "undefined" && navigator.locks ? navigator.locks.request(`eng-master-sync-${owner}`, execute) : execute()).finally(() => active.delete(owner));
  active.set(owner, task); return task;
};
