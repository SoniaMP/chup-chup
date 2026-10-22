import { StyleSheet, Text, View } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/** Lo que la IA ha dado por supuesto. Se enseña, no se guarda. */
export function AssumptionsNotice({ assumptions }: { assumptions: string[] }) {
  const colors = useColors();
  if (assumptions.length === 0) return null;

  return (
    <View style={[styles.box, { backgroundColor: colors.inferred }]}>
      <Text style={[styles.title, { color: colors.inferredForeground }]}>Lo que hemos supuesto</Text>
      {assumptions.map((assumption) => (
        <Text key={assumption} style={[styles.line, { color: colors.inferredForeground }]}>
          · {assumption}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.gutter,
    gap: tokens.spacing.row / 2,
    marginBottom: tokens.spacing.gutter,
  },
  title: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.label },
  line: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label, lineHeight: 20 },
});
