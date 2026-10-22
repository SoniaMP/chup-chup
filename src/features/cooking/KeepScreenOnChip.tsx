import { StyleSheet, Text, View } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { useKeepScreenOn } from "./useKeepScreenOn";

/** Mantiene la pantalla encendida mientras cocinas, y solo lo dice si de verdad lo está. */
export function KeepScreenOnChip() {
  const colors = useColors();
  const isScreenKeptOn = useKeepScreenOn();

  if (!isScreenKeptOn) return null;

  return (
    <View style={[styles.chip, { backgroundColor: colors.oliveSoft }]}>
      <Text style={[styles.label, { color: colors.olive }]}>Pantalla siempre encendida</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: "center",
    borderRadius: tokens.radius.pill,
    paddingHorizontal: tokens.spacing.row + 8,
    paddingVertical: tokens.spacing.row / 2 + 2,
  },
  label: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: 12 },
});
