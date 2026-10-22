import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { supabaseCookbookRecipeStore } from "./supabaseCookbookRecipeStore";

type Membership = Map<string, string[]>;

type LoadedMembership = {
  membership: Membership | null;
  /** Para releerla sin salir de la pantalla: borrar un libro mueve recetas de sitio. */
  reload: () => void;
};

const readMembership = async (): Promise<Membership> => {
  const rows = await supabaseCookbookRecipeStore.listAll().catch((cause: unknown) => {
    console.warn("No se ha podido leer qué recetas hay en cada libro", cause);
    return [];
  });

  const byCookbook: Membership = new Map();
  for (const row of rows) {
    byCookbook.set(row.cookbookId, [...(byCookbook.get(row.cookbookId) ?? []), row.recipeId]);
  }
  return byCookbook;
};

/**
 * Las recetas de cada libro, por identificador y en su orden.
 *
 * Se lee de una sola consulta en vez de una por libro: la pantalla principal necesita a la vez
 * cuántas recetas tiene cada libro y cuáles son, y así no hace una consulta por fila.
 */
export function useCookbookMembership(): LoadedMembership {
  const [membership, setMembership] = useState<Membership | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isCurrent = true;
      void readMembership().then((read) => {
        if (isCurrent) setMembership(read);
      });
      return () => {
        isCurrent = false;
      };
    }, []),
  );

  const reload = useCallback(() => {
    void readMembership().then(setMembership);
  }, []);

  return { membership, reload };
}
