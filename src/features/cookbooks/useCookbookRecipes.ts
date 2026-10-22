import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import type { CookbookEntry } from "./cookbookEntry";
import { supabaseCookbookRecipeStore } from "./supabaseCookbookRecipeStore";

type LoadedEntries = {
  entries: CookbookEntry[] | null;
  /** Para releerlas si falla guardar un arrastre: manda lo que hay en la base de datos. */
  reload: () => void;
};

const readEntries = async (cookbookId: string): Promise<CookbookEntry[]> =>
  supabaseCookbookRecipeStore.listEntries(cookbookId).catch((cause: unknown) => {
    console.warn("No se han podido leer las recetas del libro", cause);
    return [];
  });

/** Las recetas de un libro, en el orden del libro. */
export function useCookbookRecipes(cookbookId: string): LoadedEntries {
  const [entries, setEntries] = useState<CookbookEntry[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isCurrent = true;
      void readEntries(cookbookId).then((stored) => {
        if (isCurrent) setEntries(stored);
      });
      return () => {
        isCurrent = false;
      };
    }, [cookbookId]),
  );

  const reload = useCallback(() => {
    void readEntries(cookbookId).then(setEntries);
  }, [cookbookId]);

  return { entries, reload };
}
