import { StyleSheet, Text, View } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/** El aviso de que lo que se ve es la copia del móvil y puede estar viejo. */
export function StaleNotice({ isStale }: { isStale: boolean }) {
  const colors = useColors();
  if (!isStale) return null;

  return (
    <View style={[styles.box, { backgroundColor: colors.muted }]}>
      <Text style={[styles.line, { color: colors.mutedForeground }]}>
        Sin conexión: esto es lo último que guardamos en el móvil.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: tokens.radius.lg,
    paddingVertical: tokens.spacing.row + 2,
    paddingHorizontal: tokens.spacing.gutter - 4,
    marginBottom: tokens.spacing.row + 2,
  },
  line: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label, lineHeight: 20 },
});
