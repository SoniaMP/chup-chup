import { useCallback, useEffect, useState } from "react";

import type { RecipeDraft } from "@/domain/recipes/recipeDraft";
import { draftStore } from "./draftStore";

type DraftEditor = {
  draft: RecipeDraft | null;
  /** Si se ha tocado algo desde que se abrió. */
  isDirty: boolean;
  update: (patch: Partial<RecipeDraft>) => void;
};

/** Carga el borrador guardado en el dispositivo y lo mantiene mientras se edita. */
export function useDraftEditor(draftId: string): DraftEditor {
  const [draft, setDraft] = useState<RecipeDraft | null>(null);
  const [opened, setOpened] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;
    void draftStore.get(draftId).then((stored) => {
      if (!isCurrent) return;
      setDraft(stored);
      // El borrador tal y como se abrió, para saber después si ha cambiado.
      setOpened(stored === null ? null : JSON.stringify(stored));
    });
    return () => {
      isCurrent = false;
    };
  }, [draftId]);

  const update = useCallback((patch: Partial<RecipeDraft>) => {
    setDraft((current) => (current === null ? current : { ...current, ...patch }));
  }, []);

  const isDirty = draft !== null && opened !== null && JSON.stringify(draft) !== opened;

  return { draft, isDirty, update };
}
