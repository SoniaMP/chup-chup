import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import type { RecipeDraft } from "@/domain/recipes/recipeDraft";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { webFocusReset } from "@/theme/webFocusReset";

type Steps = RecipeDraft["steps"];

/** Los pasos del borrador, numerados y editables. */
export function StepFields({
  steps,
  onChange,
}: {
  steps: Steps;
  onChange: (steps: Steps) => void;
}) {
  const colors = useColors();

  return (
    <View style={styles.list}>
      {steps.map((step, index) => (
        <View key={index} style={styles.row}>
          <View style={[styles.number, { backgroundColor: colors.oliveSoft }]}>
            <Text style={[styles.numberText, { color: colors.olive }]}>{index + 1}</Text>
          </View>
          <TextInput
            multiline
            value={step.text}
            onChangeText={(text) => {
              onChange(steps.map((item, i) => (i === index ? { text } : item)));
            }}
            placeholder="Describe el paso"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.text, webFocusReset, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Quitar el paso ${index + 1}`}
            onPress={() => {
              onChange(steps.filter((_, i) => i !== index));
            }}
            style={styles.remove}
          >
            <Text style={[styles.removeMark, { color: colors.mutedForeground }]}>×</Text>
          </Pressable>
        </View>
      ))}

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          onChange([...steps, { text: "" }]);
        }}
      >
        <Text style={[styles.add, { color: colors.primary }]}>+ Añadir paso</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: tokens.spacing.row + 4 },
  row: { flexDirection: "row", alignItems: "flex-start", gap: tokens.spacing.row },
  number: {
    width: 32,
    height: 32,
    borderRadius: tokens.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginTop: tokens.spacing.row + 6,
  },
  numberText: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
  text: {
    flex: 1,
    minHeight: 72,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    paddingHorizontal: tokens.spacing.row + 8,
    paddingVertical: tokens.spacing.row + 6,
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.body,
    lineHeight: 24,
  },
  remove: { width: 28, alignItems: "center", paddingTop: tokens.spacing.row + 10 },
  removeMark: { fontFamily: tokens.fontFamily.body, fontSize: 20 },
  add: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.label, paddingVertical: tokens.spacing.row },
});
