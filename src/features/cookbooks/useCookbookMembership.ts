import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { supabaseCookbookRecipeStore } from "./supabaseCookbookRecipeStore";

/**
 * Las recetas de cada libro, por identificador y en su orden.
 *
 * Se lee de una sola consulta en vez de una por libro: la pantalla principal necesita a la vez
 * cuántas recetas tiene cada libro y cuáles son, y así no hace una consulta por fila.
 */
export function useCookbookMembership(): Map<string, string[]> | null {
  const [membership, setMembership] = useState<Map<string, string[]> | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isCurrent = true;
      void supabaseCookbookRecipeStore
        .listAll()
        .catch((cause: unknown) => {
          console.warn("No se ha podido leer qué recetas hay en cada libro", cause);
          return [];
        })
        .then((rows) => {
          if (!isCurrent) return;

          const byCookbook = new Map<string, string[]>();
          for (const row of rows) {
            byCookbook.set(row.cookbookId, [...(byCookbook.get(row.cookbookId) ?? []), row.recipeId]);
          }
          setMembership(byCookbook);
        });
      return () => {
        isCurrent = false;
      };
    }, []),
  );

  return membership;
}
