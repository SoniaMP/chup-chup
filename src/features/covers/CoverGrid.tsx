import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, useWindowDimensions } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import type { LibraryImage } from "./libraryImage";

/** Cuatro por fila: con cuarenta y ocho en el catálogo, más grandes obligan a bajar demasiado. */
const COLUMNS = 4;
/** El tamaño que se pinta mientras no se ha medido el ancho, para que no parpadee vacía. */
const UNMEASURED = 80;
/**
 * Lo más alta que puede ser la rejilla. Sin tope, la hoja crece más que la pantalla y lo de abajo
 * queda fuera, que es lo que pasaba al llegar a cuarenta y ocho portadas.
 */
const TALLEST = 0.45;
const GAP = tokens.spacing.row;

type CoverGridProps = {
  images: LibraryImage[];
  chosenId: string | undefined;
  onChoose: (imageId: string) => void;
};

/** Las portadas en rejilla, del tamaño que haga falta para llenar el ancho que haya. */
export function CoverGrid({ images, chosenId, onChoose }: CoverGridProps) {
  const colors = useColors();
  const { height: screenHeight } = useWindowDimensions();
  // Se mide sola: las portadas llenan el ancho en vez de dejar un hueco a la derecha, que es lo
  // que pasaba con un tamaño fijo.
  const [width, setWidth] = useState(0);

  const size = width === 0 ? UNMEASURED : (width - GAP * (COLUMNS - 1)) / COLUMNS;

  return (
    <ScrollView
      style={{ maxHeight: screenHeight * TALLEST }}
      contentContainerStyle={styles.grid}
      showsVerticalScrollIndicator={false}
      onLayout={(event) => {
        setWidth(event.nativeEvent.layout.width);
      }}
    >
      {images.map((image) => (
        <Pressable
          key={image.id}
          accessibilityRole="button"
          accessibilityLabel={`Portada ${image.id}`}
          accessibilityState={{ selected: image.id === chosenId }}
          onPress={() => {
            onChoose(image.id);
          }}
          style={({ pressed }) => [
            styles.option,
            { width: size },
            image.id === chosenId && { borderColor: colors.primary },
            pressed && styles.pressed,
          ]}
        >
          <Image source={{ uri: image.smallUrl }} style={styles.thumbnail} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: GAP, paddingBottom: 4 },
  option: {
    borderRadius: tokens.radius.card,
    borderWidth: 2,
    borderColor: "transparent",
    padding: 2,
  },
  pressed: { opacity: 0.8 },
  // Cuadrada y del ancho que le toque: el recorte lo pone la propia imagen, que ya viene cuadrada.
  thumbnail: { width: "100%", aspectRatio: 1, borderRadius: tokens.radius.card },
});
