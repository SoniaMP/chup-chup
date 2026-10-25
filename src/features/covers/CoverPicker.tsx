import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BottomSheet } from "@/components/BottomSheet";
import { CoverColorFilter } from "./CoverColorFilter";
import { CoverGrid } from "./CoverGrid";
import type { CoverBackground } from "./coverBackgrounds";
import { coversOnBackground } from "./coversOnBackground";
import type { PhotoSource } from "@/features/photos/pickPhoto";
import { OwnCoverButtons } from "./OwnCoverButtons";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { useLibraryImages } from "./useLibraryImages";

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
  // Con cuarenta y ocho portadas, elegir color deja doce: las que caben de un vistazo.
  const [background, setBackground] = useState<CoverBackground | null>(null);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <View style={styles.body}>
        <Text style={[styles.heading, { color: colors.foreground }]}>Elige una portada</Text>

        {onChoosePhoto !== undefined && (
          <>
            <OwnCoverButtons onChoose={onChoosePhoto} />
            <Text style={[styles.empty, { color: colors.mutedForeground }]}>
              ¿No sabes qué foto poner? Elige una del catálogo y se pondrá como portada.
            </Text>
          </>
        )}

        {error !== undefined && (
          <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>
        )}

        {images !== null && images.length > 0 && (
          <CoverColorFilter chosen={background} onChoose={setBackground} />
        )}

        {images !== null && images.length === 0 && (
          <Text style={[styles.empty, { color: colors.mutedForeground }]}>
            Todavía no hay imágenes en el catálogo.
          </Text>
        )}

        <CoverGrid
          images={coversOnBackground(images ?? [], background)}
          chosenId={chosenId}
          onChoose={onChoose}
        />

        {(chosenId !== undefined || hasPhoto) && (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              onChoose(null);
            }}
            style={({ pressed }) => [styles.remove, pressed && styles.pressed]}
          >
            <Text style={[styles.removeLabel, { color: colors.destructive }]}>
              Quitar la portada
            </Text>
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
  pressed: { opacity: 0.8 },
  remove: { alignSelf: "center", padding: tokens.spacing.row },
  removeLabel: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
});
