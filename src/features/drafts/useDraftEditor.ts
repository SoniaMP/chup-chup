import { useCallback, useEffect, useState } from "react";

import type { RecipeDraft } from "@/domain/recipes/recipeDraft";
import { draftStore } from "./draftStore";

type DraftEditor = {
  draft: RecipeDraft | null;
  update: (patch: Partial<RecipeDraft>) => void;
};

/** Carga el borrador guardado en el dispositivo y lo mantiene mientras se edita. */
export function useDraftEditor(draftId: string): DraftEditor {
  const [draft, setDraft] = useState<RecipeDraft | null>(null);

  useEffect(() => {
    let isCurrent = true;
    void draftStore.get(draftId).then((stored) => {
      if (isCurrent) setDraft(stored);
    });
    return () => {
      isCurrent = false;
    };
  }, [draftId]);

  const update = useCallback((patch: Partial<RecipeDraft>) => {
    setDraft((current) => (current === null ? current : { ...current, ...patch }));
  }, []);

  return { draft, update };
}
