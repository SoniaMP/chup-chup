/** Una hora, que es lo que dura una sesión de cocina de sobra. */
const LASTS_SECONDS = 3600;
/** Se vuelve a firmar diez minutos antes de caducar: nunca se enseña una URL muerta. */
const REUSE_MS = (LASTS_SECONDS - 600) * 1000;

const entries = new Map<string, { url: string; at: number }>();

/**
 * Las URLs firmadas que ya se han pedido, mientras siguen vivas.
 *
 * Sin esto, cada tarjeta de una lista pediría su propia firma cada vez que se pinta. Y con esto
 * hace falta `forget`: al cambiar la foto, la ruta es la misma y la firma vieja seguiría
 * enseñando la imagen anterior.
 */
export const signedPhotoCache = {
  lastsSeconds: LASTS_SECONDS,

  fresh(path: string): string | null {
    const entry = entries.get(path);
    if (entry === undefined || Date.now() - entry.at >= REUSE_MS) return null;

    return entry.url;
  },

  keep(path: string, url: string): void {
    entries.set(path, { url, at: Date.now() });
  },

  forget(path: string): void {
    entries.delete(path);
  },
};
