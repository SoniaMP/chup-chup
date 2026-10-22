import { useEffect, useState } from "react";

import { moveItem } from "@/domain/ordering/moveItem";
import { positionForMove } from "@/domain/ordering/positionForMove";
import type { CookbookEntry } from "./cookbookEntry";
import { supabaseCookbookRecipeStore } from "./supabaseCookbookRecipeStore";

type ReorderableEntries = {
  /** Las recetas en el orden que se ve, ya con el último arrastre aplicado. */
  items: CookbookEntry[];
  move: (from: number, to: number) => void;
};

/**
 * Las recetas de un libro en su orden, reordenables arrastrando.
 *
 * El orden es del libro, no de la receta: la misma receta puede ir la primera aquí y la última
 * en otro libro, así que lo que se guarda es su sitio en este.
 */
export function useReorderCookbookRecipes(
  cookbookId: string,
  entries: CookbookEntry[],
  onFailed: () => void,
): ReorderableEntries {
  const [items, setItems] = useState(entries);

  useEffect(() => {
    setItems(entries);
  }, [entries]);

  const move = (from: number, to: number): void => {
    const moved = items[from];
    if (moved === undefined) return;

    const position = positionForMove(
      items.map((entry) => entry.position),
      from,
      to,
    );

    setItems(
      moveItem(items, from, to).map((item) =>
        item.recipe.id === moved.recipe.id ? { ...item, position } : item,
      ),
    );

    void supabaseCookbookRecipeStore
      .move(cookbookId, moved.recipe.id, position)
      .catch((cause: unknown) => {
        console.warn("No se ha podido cambiar el orden de las recetas", cause);
        onFailed();
      });
  };

  return { items, move };
}
