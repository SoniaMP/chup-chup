/** Cuál de las dos fotos de una receta: la que se hizo, o la retocada. */
export type PhotoKind = "original" | "enhanced";

/**
 * Dónde vive la foto de una receta dentro del bucket `recipe-photos`.
 *
 * La primera carpeta es la propietaria, y eso no es decoración: las políticas de Storage leen
 * `storage.foldername(name)[1]` y lo comparan con `auth.uid()`. Si esta ruta cambia de forma, se
 * cae el permiso. Por eso se construye aquí y en un solo sitio.
 */
export function recipePhotoPath(ownerId: string, recipeId: string, kind: PhotoKind): string {
  return `${ownerId}/${recipeId}/${kind}.jpg`;
}
