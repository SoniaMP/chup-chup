import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { ConfirmDeleteRecipe } from "./ConfirmDeleteRecipe";

type DeleteRecipeButtonProps = {
  recipeId: string;
  onDeleted: () => void;
};

/** Borrar la receta desde su pantalla. Pregunta en la misma hoja que el menú del libro. */
export function DeleteRecipeButton({ recipeId, onDeleted }: DeleteRecipeButtonProps) {
  const colors = useColors();
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          setIsConfirming(true);
        }}
        style={styles.quiet}
      >
        <Text style={[styles.quietLabel, { color: colors.destructive }]}>Borrar receta</Text>
      </Pressable>

      <ConfirmDeleteRecipe
        recipeId={recipeId}
        isOpen={isConfirming}
        onDeleted={onDeleted}
        onClose={() => {
          setIsConfirming(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: tokens.spacing.block * 1.5 },
  quiet: { alignSelf: "center", padding: tokens.spacing.row },
  quietLabel: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
});
