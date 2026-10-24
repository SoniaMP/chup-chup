import { LinearGradient } from "expo-linear-gradient";
import { Image, useColorScheme } from "react-native";

import type { Cover } from "@/domain/covers/coverFor";
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
  const shape = { width: size, height: size, borderRadius: tokens.radius.card };

  if (cover.kind === "none") {
    return (
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={shape} />
    );
  }

  if (cover.kind === "photo") {
    return <Image source={{ uri: cover.url }} style={shape} accessibilityIgnoresInvertColors />;
  }

  const image = supabaseLibraryImageStore.byId(cover.id);

  return (
    <Image
      source={{ uri: size > SMALL_UP_TO ? image.url : image.smallUrl }}
      style={shape}
      accessibilityIgnoresInvertColors
    />
  );
}
