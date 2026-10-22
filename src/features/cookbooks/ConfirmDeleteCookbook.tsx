import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { BottomSheet } from "@/components/BottomSheet";
import { DestructiveButton } from "@/components/DestructiveButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { supabaseCookbookStore } from "./supabaseCookbookStore";

type ConfirmDeleteCookbookProps = {
  cookbookId: string;
  isOpen: boolean;
  onDeleted: () => void;
  onClose: () => void;
};

/** La pregunta antes de borrar un libro, en la misma hoja desde la que se ha pedido. */
export function ConfirmDeleteCookbook({
  cookbookId,
  isOpen,
  onDeleted,
  onClose,
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
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <View style={styles.body}>
        <Text style={[styles.heading, { color: colors.foreground }]}>¿Eliminar el libro?</Text>
        <Text style={[styles.line, { color: colors.mutedForeground }]}>
          Se borra el libro, no sus recetas: las que solo estuvieran aquí pasan al libro por
          defecto.
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
              label="Eliminar"
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
