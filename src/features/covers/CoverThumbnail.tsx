import { LinearGradient } from "expo-linear-gradient";
import { Image, useColorScheme } from "react-native";

import type { Cover } from "@/domain/covers/coverFor";
import { useSignedPhotoUrl } from "@/features/photos/useSignedPhotoUrl";
import { tokens } from "@/theme/tokens";
import { supabaseLibraryImageStore } from "./supabaseLibraryImageStore";

/** Por encima de este tamaño, la miniatura del catálogo se ve blanda: toca la imagen grande. */
const SMALL_UP_TO = 160;

type CoverThumbnailProps = {
  cover: Cover;
  size: number;
};

/** La cara de un libro o de una receta: su foto, la del catálogo, o el degradado de siempre. */
export function CoverThumbnail({ cover, size }: CoverThumbnailProps) {
  const gradient =
    useColorScheme() === "dark" ? tokens.gradient.placeholderDark : tokens.gradient.placeholder;
  // La foto vive en un bucket privado y hay que firmarla para poder pintarla.
  const photoUrl = useSignedPhotoUrl(cover.kind === "photo" ? cover.path : null);
  const shape = { width: size, height: size, borderRadius: tokens.radius.card };

  const placeholder = (
    <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={shape} />
  );

  // Mientras la firma no vuelve se enseña el degradado, no un hueco en blanco.
  if (cover.kind === "photo") {
    if (photoUrl === null) return placeholder;

    return <Image source={{ uri: photoUrl }} style={shape} accessibilityIgnoresInvertColors />;
  }

  if (cover.kind === "none") return placeholder;

  const image = supabaseLibraryImageStore.byId(cover.id);

  return (
    <Image
      source={{ uri: size > SMALL_UP_TO ? image.url : image.smallUrl }}
      style={shape}
      accessibilityIgnoresInvertColors
    />
  );
}
