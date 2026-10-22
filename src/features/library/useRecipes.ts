import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import type { Recipe } from "@/domain/recipes/recipe";
import { localRecipeStore } from "@/features/recipes/localRecipeStore";

/** Las recetas guardadas, recargadas cada vez que se vuelve a la pantalla. */
export function useRecipes(): Recipe[] | null {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isCurrent = true;
      void localRecipeStore.list().then((stored) => {
        if (isCurrent) setRecipes(stored);
      });
      return () => {
        isCurrent = false;
      };
    }, []),
  );

  return recipes;
}
