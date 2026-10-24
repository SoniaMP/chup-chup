import { useCallback, useEffect, useState } from "react";

import type { SavedRecipe } from "@/domain/recipes/savedRecipe";
import { supabaseRecipeStore } from "./supabaseRecipeStore";

type LoadedRecipe = {
  recipe: SavedRecipe | null;
  isLoaded: boolean;
  /** Para quedarse con la versión recién guardada sin volver a leer del almacén. */
  replace: (recipe: SavedRecipe) => void;
};

/** Una receta guardada por su identificador. */
export function useRecipe(id: string): LoadedRecipe {
  const [loaded, setLoaded] = useState<{ recipe: SavedRecipe | null; isLoaded: boolean }>({
    recipe: null,
    isLoaded: false,
  });

  useEffect(() => {
    let isCurrent = true;
    void supabaseRecipeStore
      .getById(id)
      .catch((cause: unknown) => {
        console.warn("No se ha podido leer la receta", cause);
        return null;
      })
      .then((recipe) => {
        if (isCurrent) setLoaded({ recipe, isLoaded: true });
      });
    return () => {
      isCurrent = false;
    };
  }, [id]);

  const replace = useCallback((recipe: SavedRecipe) => {
    setLoaded({ recipe, isLoaded: true });
  }, []);

  return { ...loaded, replace };
}
