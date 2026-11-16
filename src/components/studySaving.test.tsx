import React from "react";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VOCABULARY } from "../data/vocabulary";

vi.mock("../lib/firebase", () => ({ auth: { currentUser: null }, db: {} }));
vi.mock("react-hot-toast", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
import { ReviewSession } from "./ReviewSession";
import { PracticeSession } from "./PracticeSession";

beforeEach(() => { localStorage.clear(); localStorage.setItem("app_sound", "false"); });
afterEach(cleanup);

describe("study save lifecycle", () => {
  it("locks review ratings until persistence resolves and keeps the card on failure", async () => {
    let rejectSave: (error: Error) => void;
    const save = vi.fn((_wordId: string, _item: unknown, _operationId?: string) => new Promise<any>((_resolve, reject) => { rejectSave = reject; }));
    const finish = vi.fn();
    render(<ReviewSession progress={{}} mode="new" onSaveProgress={save} onFinish={finish} onCancel={vi.fn()} onLearnMore={vi.fn()} />);
    await screen.findByRole("button", { name: "Mặt trước thẻ từ. Nhấn để xem nghĩa" });
    fireEvent.click(await screen.findByRole("button", { name: "Mặt trước thẻ từ. Nhấn để xem nghĩa" }));
    const word = screen.getByRole("heading", { level: 2 }).textContent;
    const rate = screen.getByRole("button", { name: "Tốt" });
    fireEvent.click(rate);
    fireEvent.click(rate);
    expect(save).toHaveBeenCalledTimes(1);
    expect(rate).toBeDisabled();
    await act(async () => rejectSave(new Error("offline")));
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(word);
    expect(finish).not.toHaveBeenCalled();
    expect(rate).not.toBeDisabled();
    const firstOperation = save.mock.calls[0][2];
    fireEvent.click(rate);
    expect(save.mock.calls[1][2]).toBe(firstOperation);
    await act(async () => rejectSave(new Error("offline")));
  });

  it("awaits the final practice write and session log before completing", async () => {
    let resolveSave: () => void;
    const save = vi.fn((_wordId: string, _item: unknown, _operationId?: string) => new Promise<void>((resolve) => { resolveSave = resolve; }));
    const finish = vi.fn().mockResolvedValue(undefined);
    const word = VOCABULARY[0];
    render(<PracticeSession progress={{ [word.id]: { easiness: 3, interval: 6, repetitions: 2, nextReviewDate: "2026-10-14T00:00:00.000Z" } }} onUpdateProgress={save} onFinish={finish} onCancel={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Bắt đầu luyện tập mức dễ" }));
    fireEvent.click(await screen.findByRole("button", { name: "Mặt trước thẻ từ. Nhấn để xem nghĩa" }));
    fireEvent.click(screen.getByRole("button", { name: "Tốt" }));
    expect(finish).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Tốt" })).toBeDisabled();
    await act(async () => resolveSave());
    await waitFor(() => expect(finish).toHaveBeenCalledTimes(1));
    expect(save.mock.calls[0][2]).toContain(word.id);
    expect(finish.mock.calls[0][2]).toBeTruthy();
  });
});
