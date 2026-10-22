import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { supabaseCookbookStore } from "./supabaseCookbookStore";

type LoadedCookbooks = {
  cookbooks: Cookbook[] | null;
  /** Para releerlos sin salir de la pantalla, después de renombrar o borrar uno. */
  reload: () => void;
};

const readCookbooks = async (): Promise<Cookbook[]> =>
  supabaseCookbookStore.list().catch((cause: unknown) => {
    console.warn("No se han podido leer los libros", cause);
    return [];
  });

/** Los libros de la usuaria, recargados cada vez que se vuelve a la pantalla. */
export function useCookbooks(): LoadedCookbooks {
  const [cookbooks, setCookbooks] = useState<Cookbook[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isCurrent = true;
      void readCookbooks().then((stored) => {
        if (isCurrent) setCookbooks(stored);
      });
      return () => {
        isCurrent = false;
      };
    }, []),
  );

  const reload = useCallback(() => {
    void readCookbooks().then(setCookbooks);
  }, []);

  return { cookbooks, reload };
}
