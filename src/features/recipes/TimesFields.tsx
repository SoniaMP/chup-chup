import { StyleSheet, Text, TextInput, View } from "react-native";

import type { RecipeDraft } from "@/domain/recipes/recipeDraft";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { webFocusReset } from "@/theme/webFocusReset";
import { numberFromText } from "./numberFromText";

type Times = Pick<RecipeDraft, "prepMin" | "cookMin" | "servings">;

const FIELDS: { key: keyof Times; label: string; suffix: string }[] = [
  { key: "prepMin", label: "Preparación", suffix: "min" },
  { key: "cookMin", label: "Cocción", suffix: "min" },
  { key: "servings", label: "Raciones", suffix: "" },
];

/** Los tres datos numéricos de la receta, en bloques del mismo ancho. */
export function TimesFields({ times, onChange }: { times: Times; onChange: (times: Times) => void }) {
  const colors = useColors();

  return (
    <View style={styles.row}>
      {FIELDS.map((field) => {
        const value = times[field.key];
        return (
          <View key={field.key} style={[styles.block, { backgroundColor: colors.muted }]}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>{field.label}</Text>
            <View style={styles.valueRow}>
              <TextInput
                value={value === null ? "" : String(value)}
                onChangeText={(text) => {
                  onChange({ ...times, [field.key]: numberFromText(text) });
                }}
                keyboardType="number-pad"
                placeholder="—"
                placeholderTextColor={colors.mutedForeground}
                style={[styles.value, webFocusReset, { color: colors.foreground }]}
              />
              {field.suffix !== "" && (
                <Text style={[styles.suffix, { color: colors.mutedForeground }]}>{field.suffix}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: tokens.spacing.row },
  block: { flex: 1, borderRadius: tokens.radius.lg, padding: tokens.spacing.row + 4 },
  label: { fontFamily: tokens.fontFamily.body, fontSize: 12, marginBottom: 2 },
  valueRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  value: { flex: 1, fontFamily: tokens.fontFamily.display, fontSize: tokens.fontSize.sectionHeading },
  suffix: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
});
