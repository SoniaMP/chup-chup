import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import type { SavedRecipe } from "@/domain/recipes/savedRecipe";
import { supabaseRecipeStore } from "@/features/recipes/supabaseRecipeStore";

type LoadedRecipes = {
  recipes: SavedRecipe[] | null;
  /** Para releerlas sin salir de la pantalla, después de borrar una o cambiarle la portada. */
  reload: () => void;
};

const readRecipes = async (): Promise<SavedRecipe[]> =>
  supabaseRecipeStore.list().catch((cause: unknown) => {
    console.warn("No se han podido leer las recetas", cause);
    return [];
  });

/** Las recetas guardadas, recargadas cada vez que se vuelve a la pantalla. */
export function useRecipes(): LoadedRecipes {
  const [recipes, setRecipes] = useState<SavedRecipe[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isCurrent = true;
      void readRecipes().then((stored) => {
        if (isCurrent) setRecipes(stored);
      });
      return () => {
        isCurrent = false;
      };
    }, []),
  );

  const reload = useCallback(() => {
    void readRecipes().then(setRecipes);
  }, []);

  return { recipes, reload };
}
