import { Pressable, StyleSheet, Text, View } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

type DiscardChangesNoticeProps = {
  onDiscard: () => void;
  onKeepEditing: () => void;
};

/** Lo que sale al volver atrás con cambios sin guardar, en vez de perderlos sin avisar. */
export function DiscardChangesNotice({ onDiscard, onKeepEditing }: DiscardChangesNoticeProps) {
  const colors = useColors();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.question, { color: colors.foreground }]}>
        Has cambiado cosas que no has guardado. ¿Las tiramos?
      </Text>
      <View style={styles.choices}>
        <Pressable
          accessibilityRole="button"
          onPress={onDiscard}
          style={[styles.choice, { backgroundColor: colors.muted }]}
        >
          <Text style={[styles.choiceLabel, { color: colors.destructive }]}>Salir sin guardar</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onKeepEditing}
          style={[styles.choice, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.choiceLabel, { color: colors.primaryForeground }]}>
            Seguir editando
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: tokens.radius.xl,
    borderWidth: 1,
    padding: tokens.spacing.gutter,
    gap: tokens.spacing.row + 4,
    marginBottom: tokens.spacing.block,
  },
  question: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
  choices: { flexDirection: "row", gap: tokens.spacing.row, flexWrap: "wrap" },
  choice: {
    height: tokens.touch.headerButton,
    paddingHorizontal: tokens.spacing.gutter,
    borderRadius: tokens.radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  choiceLabel: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
});
