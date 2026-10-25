import type { LibraryImage } from "./libraryImage";
import type { CoverBackground } from "./coverBackgrounds";

/**
 * Las portadas dibujadas sobre un fondo, o todas si no se ha elegido ninguno.
 *
 * El fondo va delante en el nombre del fichero, así que basta mirar por dónde empieza. El guion
 * forma parte de la comparación: sin él, un fondo llamado `cream` se llevaría también las de uno
 * que algún día se llamara `creamy`.
 */
export function coversOnBackground(
  images: LibraryImage[],
  background: CoverBackground | null,
): LibraryImage[] {
  if (background === null) return images;

  return images.filter((image) => image.id.startsWith(`${background}-`));
}
