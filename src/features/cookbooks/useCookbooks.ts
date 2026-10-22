import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { supabaseCookbookStore } from "./supabaseCookbookStore";

/** Los libros de la usuaria, recargados cada vez que se vuelve a la pantalla. */
export function useCookbooks(): Cookbook[] | null {
  const [cookbooks, setCookbooks] = useState<Cookbook[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isCurrent = true;
      void supabaseCookbookStore
        .list()
        .catch((cause: unknown) => {
          console.warn("No se han podido leer los libros", cause);
          return [];
        })
        .then((stored) => {
          if (isCurrent) setCookbooks(stored);
        });
      return () => {
        isCurrent = false;
      };
    }, []),
  );

  return cookbooks;
}
