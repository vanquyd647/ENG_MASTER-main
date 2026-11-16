import { useEffect, useState } from "react";
import { getDraft, saveDraft, clearDraft } from "../../repositories/localRepository";
import { getWordById } from "../../domain/catalog";
import type { SessionDraft, UserProgress } from "../../types";
export const useSessionDraft = () => {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.studyActive=String(saved);
    const beforeUnload = (event: BeforeUnloadEvent) => { if (saved && document.documentElement.dataset.reloadApproved !== "true") { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("beforeunload", beforeUnload); return () => {document.documentElement.dataset.studyActive="false";window.removeEventListener("beforeunload", beforeUnload);};
  }, [saved]);
  return {
    load: async (kind: SessionDraft["kind"], progress: UserProgress) => {
      if (!("indexedDB" in globalThis)) return null;
      const draft = await getDraft(kind);
      if (!draft || !draft.wordIds.length || draft.wordIds.some((id) => !getWordById(id))) return null;
      while (draft.cursor < draft.wordIds.length - 1 && progress[draft.wordIds[draft.cursor]]?.lastOperationId === `${draft.id}:${draft.wordIds[draft.cursor]}`) draft.cursor++;
      setSaved(true); return draft;
    },
    save: async (draft: SessionDraft) => { if ("indexedDB" in globalThis) { await saveDraft(draft); setSaved(true); } },
    finish: async (kind: SessionDraft["kind"]) => { if ("indexedDB" in globalThis) await clearDraft(kind); setSaved(false); },
    pause: (onCancel: () => void) => { if (!saved || window.confirm("Tạm dừng phiên học? Bạn có thể tiếp tục đúng thẻ này khi quay lại.")) onCancel(); },
  };
};
