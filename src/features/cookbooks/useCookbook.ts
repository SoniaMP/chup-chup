import { useEffect, useState } from "react";

import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { cachedKitchen } from "@/features/offline/cachedKitchen";
import { supabaseCookbookStore } from "./supabaseCookbookStore";

type LoadedCookbook = {
  cookbook: Cookbook | null;
  isLoaded: boolean;
};

/** Un libro por su identificador. */
export function useCookbook(id: string): LoadedCookbook {
  const [loaded, setLoaded] = useState<LoadedCookbook>({
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

  return loaded;
}
