import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { supabaseRecipeStore } from "./supabaseRecipeStore";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

type DeleteRecipeButtonProps = {
  recipeId: string;
  onDeleted: () => void;
};

/**
 * Borrar una receta, con la confirmación dentro de la pantalla.
 *
 * Sin `Alert` ni diálogos del navegador: en web no existen igual en todas partes, y un diálogo
 * del sistema para algo que no tiene vuelta se acepta sin leerlo.
 */
export function DeleteRecipeButton({ recipeId, onDeleted }: DeleteRecipeButtonProps) {
  const colors = useColors();
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (): Promise<void> => {
    try {
      await supabaseRecipeStore.remove(recipeId);
      onDeleted();
    } catch {
      setError("No se ha podido borrar. Inténtalo otra vez.");
      setIsConfirming(false);
    }
  };

  if (!isConfirming) {
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
        {error !== null && <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.question, { color: colors.foreground }]}>
        Se borra para siempre, con sus notas. ¿Seguro?
      </Text>
      <View style={styles.choices}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void remove();
          }}
          style={[styles.choice, { backgroundColor: colors.destructive }]}
        >
          <Text style={[styles.choiceLabel, { color: colors.primaryForeground }]}>Sí, borrar</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setIsConfirming(false);
          }}
          style={[styles.choice, { backgroundColor: colors.muted }]}
        >
          <Text style={[styles.choiceLabel, { color: colors.foreground }]}>Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: tokens.spacing.block * 1.5, gap: tokens.spacing.row },
  quiet: { alignSelf: "center", padding: tokens.spacing.row },
  quietLabel: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
  question: {
    fontFamily: tokens.fontFamily.bodyStrong,
    fontSize: tokens.fontSize.body,
    textAlign: "center",
  },
  choices: { flexDirection: "row", gap: tokens.spacing.row, justifyContent: "center" },
  choice: {
    height: tokens.touch.headerButton,
    paddingHorizontal: tokens.spacing.block,
    borderRadius: tokens.radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  choiceLabel: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
  error: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label, textAlign: "center" },
});
