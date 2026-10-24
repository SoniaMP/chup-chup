/** Una hora, que es lo que dura una sesión de cocina de sobra. */
const LASTS_SECONDS = 3600;
/** Se vuelve a firmar diez minutos antes de caducar: nunca se enseña una URL muerta. */
const REUSE_MS = (LASTS_SECONDS - 600) * 1000;

const entries = new Map<string, { url: string; at: number }>();
const watchers = new Set<() => void>();

/**
 * Las URLs firmadas que ya se han pedido, mientras siguen vivas.
 *
 * Sin esto, cada tarjeta de una lista pediría su propia firma cada vez que se pinta. Y con esto
 * hace falta `forget`: al cambiar la foto, la ruta es la misma y la firma vieja seguiría
 * enseñando la imagen anterior.
 *
 * Olvidar avisa a quien esté mirando. Hace falta porque la ruta no cambia al cambiar de foto:
 * nadie se entera por sus propios datos de que lo que tiene pintado ya no vale, y sin el aviso
 * la foto nueva no se ve hasta volver a entrar.
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
    for (const watcher of watchers) watcher();
  },

  /** Avisa cuando se olvida alguna firma. Devuelve cómo dejar de mirar. */
  watch(watcher: () => void): () => void {
    watchers.add(watcher);

    return () => {
      watchers.delete(watcher);
    };
  },
};
