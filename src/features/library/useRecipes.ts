import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import type { Recipe } from "@/domain/recipes/recipe";
import { supabaseRecipeStore } from "@/features/recipes/supabaseRecipeStore";

/** Las recetas guardadas, recargadas cada vez que se vuelve a la pantalla. */
export function useRecipes(): Recipe[] | null {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isCurrent = true;
      void supabaseRecipeStore
        .list()
        .catch((cause: unknown) => {
          console.warn("No se han podido leer las recetas", cause);
          return [];
        })
        .then((stored) => {
          if (isCurrent) setRecipes(stored);
        });
      return () => {
        isCurrent = false;
      };
    }, []),
  );

  return recipes;
}
