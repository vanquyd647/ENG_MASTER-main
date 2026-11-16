import React from "react";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { UserProfile } from "../types";
import { VOCABULARY } from "../data/vocabulary";

const toasts = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));
vi.mock("react-hot-toast", () => ({ toast: toasts }));
vi.mock("../lib/firebase", () => ({ auth: { currentUser: null }, db: {} }));
vi.mock("../lib/persistence", () => ({ loadGuestSession: () => ({ activities: {} }), getCloudActivities: async () => ({}) }));
import { SettingsView } from "./SettingsView";

const profile: UserProfile = { uid: "test", email: "test@local", displayName: "Test", totalWordsLearned: 0, studyTimeMinutes: 0, streak: 0 };
beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
afterEach(cleanup);

describe("Settings persistence feedback", () => {
  it("does not report a saved goal before the write succeeds", async () => {
    let reject: (error: Error) => void;
    const update = vi.fn(() => new Promise<void>((_resolve, rejectPromise) => { reject = rejectPromise; }));
    render(<SettingsView isGuest profile={profile} progress={{}} onUpdateProfile={update} onImportBackup={vi.fn()} onResetProgress={vi.fn()} onCancel={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Lưu mục tiêu" }));
    expect(toasts.success).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Lưu mục tiêu" })).toBeDisabled();
    await act(async () => reject(new Error("offline")));
    expect(toasts.success).not.toHaveBeenCalled();
    expect(toasts.error).toHaveBeenCalled();
  });

  it("validates CSV before preview and requires a separate import confirmation", async () => {
    const importBackup = vi.fn().mockResolvedValue(undefined);
    const { container } = render(<SettingsView isGuest profile={profile} progress={{}} onUpdateProfile={vi.fn()} onImportBackup={importBackup} onResetProgress={vi.fn()} onCancel={vi.fn()} />);
    const input = container.querySelector('input[accept="text/csv,.csv"]')!;
    const file = new File(["csv"], "progress.csv", { type: "text/csv" });
    Object.defineProperty(file, "text", { value: async () => `wordId,easiness,interval,repetitions,nextReviewDate,lastReviewDate,wrongCount\n${VOCABULARY[0].id},2.5,1,1,2026-10-14T00:00:00.000Z,,0` });
    fireEvent.change(input, { target: { files: [file] } });
    await screen.findByRole("dialog", { name: "Kiểm tra dữ liệu trước khi nhập" });
    expect(importBackup).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Xác nhận nhập dữ liệu" }));
    await waitFor(() => expect(importBackup).toHaveBeenCalledTimes(1));
    expect(importBackup.mock.calls[0][0].progress[VOCABULARY[0].id].repetitions).toBe(1);
  });
});
