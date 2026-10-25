import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { BottomSheet } from "@/components/BottomSheet";
import type { PhotoSource } from "@/features/photos/pickPhoto";
import { OwnCoverButtons } from "./OwnCoverButtons";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { useLibraryImages } from "./useLibraryImages";

/** Cuatro por fila: con cuarenta y ocho en el catálogo, más grandes obligan a bajar demasiado. */
const COLUMNS = 4;
/** El tamaño que se pinta mientras no se ha medido el ancho, para que no parpadee vacía. */
const UNMEASURED = 80;
/** Lo más alta que puede ser la rejilla. Sin tope, la hoja crece más que la pantalla y lo de
 * abajo queda fuera, que es lo que pasaba al llegar a cuarenta y ocho portadas. */
const TALLEST = 0.45;
const GAP = tokens.spacing.row;

type CoverPickerProps = {
  isOpen: boolean;
  /** La portada puesta ahora, para marcarla y para poder quitarla. */
  chosenId: string | undefined;
  onChoose: (imageId: string | null) => void;
  /** Cuando se puede poner una foto propia. Sin esto, el selector solo ofrece el catálogo. */
  onChoosePhoto?: ((source: PhotoSource) => void) | undefined;
  /** Si ya hay una foto propia puesta, para poder quitarla aunque no haya nada marcado. */
  hasPhoto?: boolean;
  /** Lo que ha fallado al poner la portada, dicho aquí y no en una pantalla que ya no se ve. */
  error?: string;
  onClose: () => void;
};

/** Las imágenes del proyecto, para ponerle cara a un libro o a una receta sin foto propia. */
export function CoverPicker({
  isOpen,
  chosenId,
  onChoose,
  onChoosePhoto,
  hasPhoto = false,
  error,
  onClose,
}: CoverPickerProps) {
  const colors = useColors();
  const images = useLibraryImages();
  const { height: screenHeight } = useWindowDimensions();
  // La rejilla se mide sola: las portadas llenan el ancho que haya en vez de dejar un hueco a
  // la derecha, que es lo que pasaba con un tamaño fijo.
  const [width, setWidth] = useState(0);

  const size = width === 0 ? UNMEASURED : (width - GAP * (COLUMNS - 1)) / COLUMNS;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <View style={styles.body}>
        <Text style={[styles.heading, { color: colors.foreground }]}>Elige una portada</Text>

        {onChoosePhoto !== undefined && (
          <>
            <OwnCoverButtons onChoose={onChoosePhoto} />
            <Text style={[styles.empty, { color: colors.mutedForeground }]}>
              O una del catálogo. Solo cabe una: al elegir, se queda la última.
            </Text>
          </>
        )}

        {error !== undefined && (
          <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>
        )}

        {images !== null && images.length === 0 && (
          <Text style={[styles.empty, { color: colors.mutedForeground }]}>
            Todavía no hay imágenes en el catálogo.
          </Text>
        )}

        <ScrollView
          style={{ maxHeight: screenHeight * TALLEST }}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          onLayout={(event) => {
            setWidth(event.nativeEvent.layout.width);
          }}
        >
          {(images ?? []).map((image) => (
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

        {(chosenId !== undefined || hasPhoto) && (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              onChoose(null);
            }}
            style={({ pressed }) => [styles.remove, pressed && styles.pressed]}
          >
            <Text style={[styles.removeLabel, { color: colors.destructive }]}>Quitar la portada</Text>
          </Pressable>
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: tokens.spacing.row + 4, paddingHorizontal: tokens.spacing.row + 4 },
  heading: { fontFamily: tokens.fontFamily.display, fontSize: tokens.fontSize.sectionHeading },
  empty: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
  error: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
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
  remove: { alignSelf: "center", padding: tokens.spacing.row },
  removeLabel: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
});
