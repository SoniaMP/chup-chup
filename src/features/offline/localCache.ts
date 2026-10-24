import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ZodType } from "zod";

/** Sube cuando cambie el formato de lo guardado: lo viejo se tira en vez de reventar la app. */
const VERSION = 1;
const PREFIX = "kitchen";

const keyFor = (ownerId: string, what: string): string => `${PREFIX}:${VERSION}:${ownerId}:${what}`;

const asJson = (raw: string): unknown => {
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
};

/**
 * La última cocina buena, en el disco del móvil.
 *
 * Es una copia de lectura: existe para poder abrir la app sin red, nunca para decidir nada. El
 * servidor manda siempre que conteste. Lo guardado se vuelve a validar al leerlo porque lo
 * escribió una versión anterior de la app, y si ya no encaja se tira: una cocina vacía se
 * arregla con una recarga, una fila corrupta no.
 */
export const localCache = {
  async read<T>(ownerId: string, what: string, schema: ZodType<T>): Promise<T | null> {
    const key = keyFor(ownerId, what);
    const raw = await AsyncStorage.getItem(key).catch(() => null);
    if (raw === null) return null;

    const stored = asJson(raw);
    const checked = stored === undefined ? null : schema.safeParse(stored);

    if (checked === null || !checked.success) {
      console.warn(`La copia local de ${what} ya no encaja y se tira`);
      await AsyncStorage.removeItem(key).catch(() => undefined);
      return null;
    }

    return checked.data;
  },

  async write(ownerId: string, what: string, value: unknown): Promise<void> {
    await AsyncStorage.setItem(keyFor(ownerId, what), JSON.stringify(value)).catch(
      (cause: unknown) => {
        console.warn(`No se ha podido guardar la copia local de ${what}`, cause);
      },
    );
  },

  /** Al cerrar sesión no queda en el móvil nada de esa cocina. */
  async forget(ownerId: string): Promise<void> {
    const keys = await AsyncStorage.getAllKeys().catch((): readonly string[] => []);
    const mine = keys.filter((key) => key.startsWith(`${PREFIX}:`) && key.includes(`:${ownerId}:`));

    if (mine.length > 0) await AsyncStorage.multiRemove(mine).catch(() => undefined);
  },
};
