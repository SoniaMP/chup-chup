const toHex = (value: number): string => value.toString(16).padStart(2, "0");

/**
 * Da forma de UUID v4 a 16 bytes aleatorios: marca la versión en el byte 6 y la variante en
 * el 8, que es lo que distingue un UUID válido de una cadena de dígitos cualquiera.
 */
export function uuidFromBytes(bytes: Uint8Array): string {
  if (bytes.length !== 16) throw new Error("Un UUID son 16 bytes");

  const hex = Array.from(bytes, (byte, index) => {
    if (index === 6) return toHex((byte & 0x0f) | 0x40);
    if (index === 8) return toHex((byte & 0x3f) | 0x80);
    return toHex(byte);
  }).join("");

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-");
}
