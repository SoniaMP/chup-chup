import { useCallback, useEffect, useState } from "react";

import { removeRecipeFromCookbook } from "./removeRecipeFromCookbook";
import { supabaseCookbookRecipeStore } from "./supabaseCookbookRecipeStore";

type RecipeCookbooks = {
  /** `null` mientras se cargan: así las casillas no parpadean de vacías a marcadas. */
  cookbookIds: string[] | null;
  toggle: (cookbookId: string) => Promise<void>;
};

/** En qué libros está una receta, y cómo meterla y sacarla. */
export function useRecipeCookbookIds(recipeId: string): RecipeCookbooks {
  const [cookbookIds, setCookbookIds] = useState<string[] | null>(null);

  useEffect(() => {
    let isCurrent = true;
    void supabaseCookbookRecipeStore
      .listCookbookIds(recipeId)
      .catch((cause: unknown) => {
        console.warn("No se han podido leer los libros de la receta", cause);
        return [];
      })
      .then((ids) => {
        if (isCurrent) setCookbookIds(ids);
      });
    return () => {
      isCurrent = false;
    };
  }, [recipeId]);

  const toggle = useCallback(
    async (cookbookId: string): Promise<void> => {
      const current = cookbookIds ?? [];
      const isIn = current.includes(cookbookId);

      if (!isIn) {
        await supabaseCookbookRecipeStore.add(cookbookId, recipeId);
        setCookbookIds([...current, cookbookId]);
        return;
      }

      // Sacarla del último libro no la deja en ninguno: vuelve al libro por defecto.
      const fallback = await removeRecipeFromCookbook(cookbookId, recipeId);

      setCookbookIds(fallback === null ? current.filter((id) => id !== cookbookId) : [fallback.id]);
    },
    [cookbookIds, recipeId],
  );

  return { cookbookIds, toggle };
}
