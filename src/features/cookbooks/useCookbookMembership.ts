import { useMemo } from "react";

import { cachedKitchen } from "@/features/offline/cachedKitchen";
import { useCachedRead } from "@/features/offline/useCachedRead";
import type { Placement } from "./placement";
import { supabaseCookbookRecipeStore } from "./supabaseCookbookRecipeStore";

type Membership = Map<string, string[]>;

type LoadedMembership = {
  membership: Membership | null;
  /** Lo que se ve salió del disco: el servidor no ha contestado. */
  isStale: boolean;
  /** Para releerla sin salir de la pantalla: borrar un libro mueve recetas de sitio. */
  reload: () => void;
};

const NONE: Placement[] = [];
const readPlacements = (): Promise<Placement[]> => supabaseCookbookRecipeStore.listAll();

const byCookbook = (placements: Placement[]): Membership => {
  const grouped: Membership = new Map();
  for (const placement of placements) {
    grouped.set(placement.cookbookId, [
      ...(grouped.get(placement.cookbookId) ?? []),
      placement.recipeId,
    ]);
  }
  return grouped;
};

/**
 * Las recetas de cada libro, por identificador y en su orden.
 *
 * Se lee de una sola consulta en vez de una por libro: la pantalla principal necesita a la vez
 * cuántas recetas tiene cada libro y cuáles son, y así no hace una consulta por fila. Lo que
 * guarda es también lo que arma las pantallas de libro cuando no hay red.
 */
export function useCookbookMembership(): LoadedMembership {
  const { value, isStale, reload } = useCachedRead(
    cachedKitchen.what.placements,
    cachedKitchen.schema.placements,
    readPlacements,
    NONE,
  );
  const membership = useMemo(() => (value === null ? null : byCookbook(value)), [value]);

  return { membership, isStale, reload };
}
