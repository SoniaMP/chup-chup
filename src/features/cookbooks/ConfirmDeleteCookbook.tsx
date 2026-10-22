import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { supabaseCookbookStore } from "./supabaseCookbookStore";

type ConfirmDeleteCookbookProps = {
  cookbookId: string;
  onDeleted: () => void;
  onCancel: () => void;
};

/** La pregunta antes de borrar un libro. Se responde en la pantalla, sin diálogos del sistema. */
export function ConfirmDeleteCookbook({
  cookbookId,
  onDeleted,
  onCancel,
}: ConfirmDeleteCookbookProps) {
  const colors = useColors();
  const [error, setError] = useState<string | null>(null);

  const remove = async (): Promise<void> => {
    try {
      await supabaseCookbookStore.remove(cookbookId);
      onDeleted();
    } catch (cause) {
      console.warn("No se ha podido borrar el libro", cause);
      setError("No se ha podido borrar. Inténtalo otra vez.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.question, { color: colors.foreground }]}>
        Se borra el libro, no sus recetas: las seguirás teniendo. ¿Seguro?
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
          onPress={onCancel}
          style={[styles.choice, { backgroundColor: colors.muted }]}
        >
          <Text style={[styles.choiceLabel, { color: colors.foreground }]}>Cancelar</Text>
        </Pressable>
      </View>
      {error !== null && <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: tokens.spacing.block * 1.5, gap: tokens.spacing.row },
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
