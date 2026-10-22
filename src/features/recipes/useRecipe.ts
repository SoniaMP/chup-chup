import { useEffect, useState } from "react";

import type { Recipe } from "@/domain/recipes/recipe";
import { localRecipeStore } from "./localRecipeStore";

type LoadedRecipe = { recipe: Recipe | null; isLoaded: boolean };

/** Una receta guardada por su identificador. */
export function useRecipe(id: string): LoadedRecipe {
  const [loaded, setLoaded] = useState<LoadedRecipe>({ recipe: null, isLoaded: false });

  useEffect(() => {
    let isCurrent = true;
    void localRecipeStore.getById(id).then((recipe) => {
      if (isCurrent) setLoaded({ recipe, isLoaded: true });
    });
    return () => {
      isCurrent = false;
    };
  }, [id]);

  return loaded;
}
