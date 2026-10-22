import { useEffect, useState } from "react";

import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { moveItem } from "@/domain/ordering/moveItem";
import { positionForMove } from "@/domain/ordering/positionForMove";
import { supabaseCookbookStore } from "./supabaseCookbookStore";

type ReorderableCookbooks = {
  /** Los libros en el orden que se ve, ya con el último arrastre aplicado. */
  items: Cookbook[];
  move: (from: number, to: number) => void;
};

/**
 * Los libros en su orden, reordenables arrastrando.
 *
 * El sitio nuevo se pinta antes de guardarlo: soltar y esperar a la red se nota. Si la escritura
 * falla, se vuelve a leer la biblioteca y manda lo que hay guardado.
 */
export function useReorderCookbooks(cookbooks: Cookbook[], onFailed: () => void): ReorderableCookbooks {
  const [items, setItems] = useState(cookbooks);

  useEffect(() => {
    setItems(cookbooks);
  }, [cookbooks]);

  const move = (from: number, to: number): void => {
    const moved = items[from];
    if (moved === undefined) return;

    const position = positionForMove(
      items.map((cookbook) => cookbook.position),
      from,
      to,
    );

    setItems(moveItem(items, from, to).map((item) => (item.id === moved.id ? { ...item, position } : item)));

    void supabaseCookbookStore.move(moved.id, position).catch((cause: unknown) => {
      console.warn("No se ha podido cambiar el orden de los libros", cause);
      onFailed();
    });
  };

  return { items, move };
}
