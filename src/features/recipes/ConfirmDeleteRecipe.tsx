import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { BottomSheet } from "@/components/BottomSheet";
import { DestructiveButton } from "@/components/DestructiveButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { supabaseRecipeStore } from "./supabaseRecipeStore";

type ConfirmDeleteRecipeProps = {
  recipeId: string;
  isOpen: boolean;
  onDeleted: () => void;
  onClose: () => void;
};

/** La pregunta antes de borrar una receta. La misma hoja desde donde se pida. */
export function ConfirmDeleteRecipe({
  recipeId,
  isOpen,
  onDeleted,
  onClose,
}: ConfirmDeleteRecipeProps) {
  const colors = useColors();
  const [error, setError] = useState<string | null>(null);

  const remove = async (): Promise<void> => {
    try {
      await supabaseRecipeStore.remove(recipeId);
      onDeleted();
    } catch (cause) {
      console.warn("No se ha podido borrar la receta", cause);
      setError("No se ha podido borrar. Inténtalo otra vez.");
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <View style={styles.body}>
        <Text style={[styles.heading, { color: colors.foreground }]}>¿Borrar la receta?</Text>
        <Text style={[styles.line, { color: colors.mutedForeground }]}>
          Se borra para siempre, con sus notas, y sale de todos los libros donde esté.
        </Text>
        {error !== null && (
          <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>
        )}
        <View style={styles.choices}>
          <View style={styles.choice}>
            <SecondaryButton label="Cancelar" onPress={onClose} />
          </View>
          <View style={styles.choice}>
            <DestructiveButton
              label="Borrar"
              onPress={() => {
                void remove();
              }}
            />
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: tokens.spacing.row + 4, paddingHorizontal: tokens.spacing.row + 4 },
  heading: { fontFamily: tokens.fontFamily.display, fontSize: tokens.fontSize.sectionHeading },
  line: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.body, lineHeight: 24 },
  choices: { flexDirection: "row", gap: tokens.spacing.row },
  choice: { flex: 1 },
  error: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
});
