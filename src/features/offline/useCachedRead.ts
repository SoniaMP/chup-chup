import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import type { ZodType } from "zod";

import { currentOwnerId } from "@/features/auth/currentOwnerId";
import { localCache } from "./localCache";

type Cached<T> = {
  /** `null` mientras no hay nada que enseñar todavía. */
  value: T | null;
  /** Lo que se ve salió de la copia local: el servidor no ha contestado. */
  isStale: boolean;
  reload: () => void;
};

/**
 * Lee algo de la cocina enseñando primero lo guardado y luego lo del servidor.
 *
 * La copia local se pinta al instante y se marca como vieja; cuando el servidor contesta, manda
 * él y la copia se reescribe. Si no contesta y no había copia, se devuelve `empty`, que es lo
 * que hacía la app antes de que existiera la caché.
 */
export function useCachedRead<T>(
  what: string,
  schema: ZodType<T>,
  read: () => Promise<T>,
  empty: T,
): Cached<T> {
  const [value, setValue] = useState<T | null>(null);
  const [isStale, setIsStale] = useState(false);

  const load = useCallback(
    async (isCurrent: () => boolean): Promise<void> => {
      const ownerId = await currentOwnerId().catch(() => null);
      if (ownerId === null) return;

      const kept = await localCache.read(ownerId, what, schema);
      if (kept !== null && isCurrent()) {
        setValue(kept);
        setIsStale(true);
      }

      try {
        const fresh = await read();
        if (!isCurrent()) return;

        setValue(fresh);
        setIsStale(false);
        await localCache.write(ownerId, what, fresh);
      } catch (cause: unknown) {
        console.warn(`No se ha podido leer ${what} del servidor`, cause);
        if (kept === null && isCurrent()) setValue(empty);
      }
    },
    [what, schema, read, empty],
  );

  useFocusEffect(
    useCallback(() => {
      let isCurrent = true;
      void load(() => isCurrent);
      return () => {
        isCurrent = false;
      };
    }, [load]),
  );

  const reload = useCallback(() => {
    void load(() => true);
  }, [load]);

  return { value, isStale, reload };
}
