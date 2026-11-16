import { beforeEach, describe, expect, it, vi } from "vitest";
import { recoverRestore, RestoreRecoveryError, runRecoverableRestore } from "./restoreJournal";

beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });

describe("recoverable restore", () => {
  it("captures before destructive changes and rolls back a failed later batch", async () => {
    let stored = [1, 2, 3];
    await expect(runRecoverableRestore({ owner: "user", snapshot: async () => [...stored],
      apply: async () => { stored = [9]; throw new Error("batch 2 failed"); },
      restore: async (before) => { stored = before; },
    })).rejects.toThrow(/đã phục hồi/);
    expect(stored).toEqual([1, 2, 3]);
    expect(localStorage.length).toBe(0);
  });

  it("retains its snapshot if rollback fails and recovers on a later attempt", async () => {
    let stored = [1, 2];
    await expect(runRecoverableRestore({ owner: "user", snapshot: async () => [...stored],
      apply: async () => { stored = []; throw new Error("connection lost"); },
      restore: async () => { throw new Error("still offline"); },
    })).rejects.toBeInstanceOf(RestoreRecoveryError);
    expect(localStorage.length).toBe(1);
    await expect(runRecoverableRestore({ owner: "user", snapshot: async () => [], apply: async () => {}, restore: async () => {} })).rejects.toBeInstanceOf(RestoreRecoveryError);
    expect(await recoverRestore<number[]>("other-user", async () => { throw new Error("must not run"); })).toBe(false);
    expect(await recoverRestore<number[]>("user", async (before) => { stored = before; })).toBe(true);
    expect(stored).toEqual([1, 2]);
    expect(localStorage.length).toBe(0);
  });

  it("aborts before any mutation when storage cannot hold the snapshot", async () => {
    const apply = vi.fn();
    vi.spyOn(localStorage, "setItem").mockImplementation(() => { throw new Error("storage full"); });
    await expect(runRecoverableRestore({ owner: "user", snapshot: async () => [1], apply, restore: async () => {} })).rejects.toThrow(/storage full/);
    expect(apply).not.toHaveBeenCalled();
  });

  it("keeps a completed operation's journal until its final checkpoint is removed", async () => {
    const result = await runRecoverableRestore({ owner: "user", snapshot: async () => [1],
      apply: async () => { expect(localStorage.length).toBe(1); return "done"; }, restore: async () => {},
    });
    expect(result).toBe("done");
    expect(localStorage.length).toBe(0);
  });
});
