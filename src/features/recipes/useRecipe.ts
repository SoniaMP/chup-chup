import { useCallback, useEffect, useState } from "react";

import type { Recipe } from "@/domain/recipes/recipe";
import { localRecipeStore } from "./localRecipeStore";

type LoadedRecipe = {
  recipe: Recipe | null;
  isLoaded: boolean;
  /** Para quedarse con la versión recién guardada sin volver a leer del almacén. */
  replace: (recipe: Recipe) => void;
};

/** Una receta guardada por su identificador. */
export function useRecipe(id: string): LoadedRecipe {
  const [loaded, setLoaded] = useState<{ recipe: Recipe | null; isLoaded: boolean }>({
    recipe: null,
    isLoaded: false,
  });

  useEffect(() => {
    let isCurrent = true;
    void localRecipeStore.getById(id).then((recipe) => {
      if (isCurrent) setLoaded({ recipe, isLoaded: true });
    });
    return () => {
      isCurrent = false;
    };
  }, [id]);

  const replace = useCallback((recipe: Recipe) => {
    setLoaded({ recipe, isLoaded: true });
  }, []);

  return { ...loaded, replace };
}
