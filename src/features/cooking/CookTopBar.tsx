import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { KeepScreenOnChip } from "./KeepScreenOnChip";

/**
 * Salir y el aviso de pantalla encendida. Con un temporizador en marcha, salir pregunta antes:
 * al cerrar el modo cocina se para la cuenta atrás, y eso se hace sabiéndolo.
 */
export function CookTopBar({
  onLeave,
  isTimerRunning,
}: {
  onLeave: () => void;
  isTimerRunning: boolean;
}) {
  const colors = useColors();
  const [isConfirming, setIsConfirming] = useState(false);

  if (isConfirming) {
    return (
      <View style={styles.bar}>
        <Text style={[styles.question, { color: colors.foreground }]}>
          Tienes un temporizador en marcha.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setIsConfirming(false);
          }}
        >
          <Text style={[styles.action, { color: colors.mutedForeground }]}>Seguir</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onLeave}>
          <Text style={[styles.action, { color: colors.destructive }]}>Salir igualmente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.bar, styles.spread]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Salir del modo cocina"
        onPress={() => {
          if (isTimerRunning) setIsConfirming(true);
          else onLeave();
        }}
      >
        <Text style={[styles.action, { color: colors.mutedForeground }]}>Salir</Text>
      </Pressable>
      <KeepScreenOnChip />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row + 4,
    marginBottom: tokens.spacing.gutter,
    minHeight: 28,
  },
  spread: { justifyContent: "space-between" },
  question: { flex: 1, fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
  action: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.label },
});
