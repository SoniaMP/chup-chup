import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import type { Recipe } from "@/domain/recipes/recipe";
import { supabaseCookbookRecipeStore } from "./supabaseCookbookRecipeStore";

/** Las recetas de un libro, en el orden del libro. */
export function useCookbookRecipes(cookbookId: string): Recipe[] | null {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isCurrent = true;
      void supabaseCookbookRecipeStore
        .listRecipes(cookbookId)
        .catch((cause: unknown) => {
          console.warn("No se han podido leer las recetas del libro", cause);
          return [];
        })
        .then((stored) => {
          if (isCurrent) setRecipes(stored);
        });
      return () => {
        isCurrent = false;
      };
    }, [cookbookId]),
  );

  return recipes;
}
