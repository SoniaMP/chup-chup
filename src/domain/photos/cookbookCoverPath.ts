/**
 * Dónde vive la portada propia de un libro dentro del bucket `cookbook-covers`.
 *
 * La primera carpeta es la dueña, igual que en las fotos de receta, porque las políticas de
 * Storage comparan `storage.foldername(name)[1]` con `auth.uid()`. Un libro tiene una sola
 * portada, así que la ruta no lleva nada más: la nueva pisa a la vieja.
 */
export function cookbookCoverPath(ownerId: string, cookbookId: string): string {
  return `${ownerId}/${cookbookId}.jpg`;
}
