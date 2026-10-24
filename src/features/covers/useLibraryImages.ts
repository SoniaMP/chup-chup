import { useEffect, useState } from "react";

import type { LibraryImage } from "./libraryImage";
import { supabaseLibraryImageStore } from "./supabaseLibraryImageStore";

/** El catálogo, leído la primera vez que alguien abre el selector de portada. */
export function useLibraryImages(): LibraryImage[] | null {
  const [images, setImages] = useState<LibraryImage[] | null>(null);

  useEffect(() => {
    let isCurrent = true;

    void supabaseLibraryImageStore
      .list()
      .catch((cause: unknown) => {
        console.warn("No se ha podido leer el catálogo de imágenes", cause);
        return [];
      })
      .then((stored) => {
        if (isCurrent) setImages(stored);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  return images;
}
