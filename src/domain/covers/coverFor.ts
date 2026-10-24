/** Qué imagen le toca a un libro o a una receta. */
export type Cover =
  | { kind: "photo"; url: string }
  | { kind: "library"; id: string }
  | { kind: "none" };

type CoverSource = {
  /** El identificador de una imagen del catálogo del proyecto. */
  libraryImage?: string | undefined;
  photoOriginal?: string | undefined;
  photoEnhanced?: string | undefined;
  photoActive?: "original" | "enhanced" | undefined;
};

/**
 * Tu foto manda; si no hay, la del catálogo; si tampoco, nada.
 *
 * Una foto propia nunca se tapa con una decorativa: la del catálogo existe para que una receta
 * sin foto no se vea desnuda, no para competir con la que has hecho tú.
 */
export function coverFor({
  libraryImage,
  photoOriginal,
  photoEnhanced,
  photoActive,
}: CoverSource): Cover {
  const own = photoActive === "enhanced" ? (photoEnhanced ?? photoOriginal) : photoOriginal;

  if (own !== undefined) return { kind: "photo", url: own };
  if (libraryImage !== undefined && libraryImage !== "") return { kind: "library", id: libraryImage };

  return { kind: "none" };
}
