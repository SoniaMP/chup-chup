/** Qué imagen le toca a un libro o a una receta. La foto es una ruta del bucket, sin firmar. */
export type Cover =
  | { kind: "photo"; path: string }
  | { kind: "library"; id: string }
  | { kind: "none" };

type CoverSource = {
  /** El identificador de una imagen del catálogo del proyecto. */
  libraryImage?: string | undefined;
  /** La foto que una usuaria ha puesto de portada. Hoy, solo los libros tienen de esto. */
  coverPhoto?: string | undefined;
  photoOriginal?: string | undefined;
  photoEnhanced?: string | undefined;
  photoActive?: "original" | "enhanced" | undefined;
};

/**
 * Tu foto manda; si no hay, la del catálogo; si tampoco, nada.
 *
 * Una foto propia nunca se tapa con una decorativa: la del catálogo existe para que una receta
 * sin foto no se vea desnuda, no para competir con la que has hecho tú.
 *
 * En un libro no hay foto de contenido, solo portada, y ahí la app guarda una u otra: elegir una
 * vacía la otra. El orden de aquí es la red de seguridad de un libro que acabara con las dos.
 */
export function coverFor({
  libraryImage,
  coverPhoto,
  photoOriginal,
  photoEnhanced,
  photoActive,
}: CoverSource): Cover {
  const taken = photoActive === "enhanced" ? (photoEnhanced ?? photoOriginal) : photoOriginal;
  const own = taken ?? coverPhoto;

  if (own !== undefined) return { kind: "photo", path: own };
  if (libraryImage !== undefined && libraryImage !== "") return { kind: "library", id: libraryImage };

  return { kind: "none" };
}
