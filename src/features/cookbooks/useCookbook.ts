import { useCallback, useEffect, useState } from "react";

import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { cachedKitchen } from "@/features/offline/cachedKitchen";
import { supabaseCookbookStore } from "./supabaseCookbookStore";

type LoadedCookbook = {
  cookbook: Cookbook | null;
  isLoaded: boolean;
  /** Para quedarse con el libro recién renombrado sin volver a preguntar. */
  replace: (cookbook: Cookbook) => void;
};

/** Un libro por su identificador. */
export function useCookbook(id: string): LoadedCookbook {
  const [loaded, setLoaded] = useState<{ cookbook: Cookbook | null; isLoaded: boolean }>({
    cookbook: null,
    isLoaded: false,
  });

  useEffect(() => {
    let isCurrent = true;
    void supabaseCookbookStore
      .getById(id)
      .catch((cause: unknown) => {
        console.warn("No se ha podido leer el libro", cause);
        return cachedKitchen.cookbook(id);
      })
      .then((cookbook) => {
        if (isCurrent) setLoaded({ cookbook, isLoaded: true });
      });
    return () => {
      isCurrent = false;
    };
  }, [id]);

  const replace = useCallback((cookbook: Cookbook) => {
    setLoaded({ cookbook, isLoaded: true });
  }, []);

  return { ...loaded, replace };
}
