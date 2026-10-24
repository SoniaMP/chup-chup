import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { BottomSheet } from "@/components/BottomSheet";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { useLibraryImages } from "./useLibraryImages";

type CoverPickerProps = {
  isOpen: boolean;
  /** La portada puesta ahora, para marcarla y para poder quitarla. */
  chosenId: string | undefined;
  onChoose: (imageId: string | null) => void;
  onClose: () => void;
};

/** Las imágenes del proyecto, para ponerle cara a un libro o a una receta sin foto propia. */
export function CoverPicker({ isOpen, chosenId, onChoose, onClose }: CoverPickerProps) {
  const colors = useColors();
  const images = useLibraryImages();

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <View style={styles.body}>
        <Text style={[styles.heading, { color: colors.foreground }]}>Elige una portada</Text>

        {images !== null && images.length === 0 && (
          <Text style={[styles.empty, { color: colors.mutedForeground }]}>
            Todavía no hay imágenes en el catálogo.
          </Text>
        )}

        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
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
                image.id === chosenId && { borderColor: colors.primary },
                pressed && styles.pressed,
              ]}
            >
              <Image source={{ uri: image.smallUrl }} style={styles.thumbnail} />
            </Pressable>
          ))}
        </ScrollView>

        {chosenId !== undefined && (
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
  empty: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.body },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: tokens.spacing.row, paddingBottom: 4 },
  option: {
    borderRadius: tokens.radius.card,
    borderWidth: 2,
    borderColor: "transparent",
    padding: 2,
  },
  pressed: { opacity: 0.8 },
  thumbnail: { width: 88, height: 88, borderRadius: tokens.radius.card },
  remove: { alignSelf: "center", padding: tokens.spacing.row },
  removeLabel: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
});
