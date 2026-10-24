import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { cachedKitchen } from "@/features/offline/cachedKitchen";
import { useCachedRead } from "@/features/offline/useCachedRead";
import { supabaseCookbookStore } from "./supabaseCookbookStore";

type LoadedCookbooks = {
  cookbooks: Cookbook[] | null;
  /** Lo que se ve salió del disco: el servidor no ha contestado. */
  isStale: boolean;
  /** Para releerlos sin salir de la pantalla, después de renombrar o borrar uno. */
  reload: () => void;
};

const NONE: Cookbook[] = [];
const readCookbooks = (): Promise<Cookbook[]> => supabaseCookbookStore.list();

/** Los libros de la usuaria, recargados cada vez que se vuelve a la pantalla. */
export function useCookbooks(): LoadedCookbooks {
  const { value, isStale, reload } = useCachedRead(cachedKitchen.what.cookbooks, cachedKitchen.schema.cookbooks, readCookbooks, NONE);

  return { cookbooks: value, isStale, reload };
}
