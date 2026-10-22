import { getRandomBytes } from "expo-crypto";

import { uuidFromBytes } from "@/domain/ids/uuidFromBytes";

/**
 * Identificadores nuevos.
 *
 * No usa `crypto.randomUUID()` a propósito: el navegador solo lo expone en contexto seguro
 * (https o localhost), y la app se abre por IP desde el móvil, donde no existe.
 * `getRandomBytes` funciona en los dos sitios y en nativo.
 */
export function randomUuid(): string {
  return uuidFromBytes(getRandomBytes(16));
}
