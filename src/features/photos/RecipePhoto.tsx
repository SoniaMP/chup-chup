import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";

import { ActionSheet, type SheetAction } from "@/components/ActionSheet";
import { Notice } from "@/components/Notice";
import type { SavedRecipe } from "@/domain/recipes/savedRecipe";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { pickPhoto, type PhotoSource } from "./pickPhoto";
import { removeRecipePhoto } from "./removeRecipePhoto";
import { saveRecipePhoto } from "./saveRecipePhoto";
import { useSignedPhotoUrl } from "./useSignedPhotoUrl";

/** Proporción de foto de comida, con tope para que en una ventana ancha no sea una franja. */
const RATIO = 4 / 3;
const MAX_HEIGHT = 320;

type RecipePhotoProps = {
  recipe: SavedRecipe;
  onChange: (recipe: SavedRecipe) => void;
};

/** La foto de la receta: la que hay, o el hueco para ponerla. */
export function RecipePhoto({ recipe, onChange }: RecipePhotoProps) {
  const colors = useColors();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const url = useSignedPhotoUrl(recipe.photoOriginal ?? null);

  const run = async (work: () => Promise<SavedRecipe | null>): Promise<void> => {
    setIsSheetOpen(false);
    setError(null);
    setIsBusy(true);
    try {
      const updated = await work();
      if (updated !== null) onChange(updated);
    } catch (cause) {
      console.warn("No se ha podido cambiar la foto", cause);
      setError(cause instanceof Error ? cause.message : "No se ha podido cambiar la foto");
    } finally {
      setIsBusy(false);
    }
  };

  const choosePhoto = (source: PhotoSource): void => {
    void run(async () => {
      const base64 = await pickPhoto(source);
      return base64 === null ? null : saveRecipePhoto(recipe, base64);
    });
  };

  const actions: SheetAction[] = [
    { label: "Hacer una foto", icon: "photo-camera", onPress: () => { choosePhoto("camera"); } },
    { label: "Elegir de la galería", icon: "photo-library", onPress: () => { choosePhoto("library"); } },
    ...(recipe.photoOriginal === undefined
      ? []
      : [
          {
            label: "Quitar la foto",
            icon: "delete-outline" as const,
            isDestructive: true,
            onPress: () => {
              void run(() => removeRecipePhoto(recipe));
            },
          },
        ]),
  ];

  return (
    <View style={styles.block}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={recipe.photoOriginal === undefined ? "Añadir una foto" : "Cambiar la foto"}
        onPress={() => {
          setIsSheetOpen(true);
        }}
        disabled={isBusy}
        style={({ pressed }) => [
          styles.frame,
          { borderColor: colors.border, backgroundColor: colors.muted },
          pressed && styles.pressed,
        ]}
      >
        {url !== null && (
          <Image
            source={{ uri: url }}
            resizeMode="cover"
            style={styles.photo}
            accessibilityIgnoresInvertColors
          />
        )}

        {isBusy && <ActivityIndicator color={colors.primary} />}

        {!isBusy && recipe.photoOriginal === undefined && (
          <>
            <MaterialIcons name="add-a-photo" size={24} color={colors.primary} />
            <Text style={[styles.label, { color: colors.primary }]}>Añadir una foto</Text>
          </>
        )}
      </Pressable>

      {error !== null && (
        <Notice
          text={error}
          onDismiss={() => {
            setError(null);
          }}
        />
      )}

      <ActionSheet
        isOpen={isSheetOpen}
        actions={actions}
        onClose={() => {
          setIsSheetOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: tokens.spacing.row, marginBottom: tokens.spacing.block },
  frame: {
    aspectRatio: RATIO,
    maxHeight: MAX_HEIGHT,
    // El mismo filo que las portadas de la biblioteca: todo lo que enmarca una imagen va igual.
    borderRadius: tokens.radius.card,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spacing.row / 2,
    overflow: "hidden",
  },
  photo: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" },
  pressed: { opacity: 0.85 },
  label: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
});
