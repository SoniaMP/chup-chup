import { Pressable, StyleSheet, Text, View } from "react-native";

import { IconButton } from "@/components/IconButton";
import type { CookTimer } from "@/domain/cooking/cookTimer";
import { countdownText } from "@/domain/cooking/countdownText";
import { isTimerDone } from "@/domain/cooking/isTimerDone";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

type CookTimerRowProps = {
  timer: CookTimer;
  now: number;
  onAdjust: (minutes: number) => void;
  onDismiss: () => void;
};

/**
 * Un temporizador de la franja. En marcha: «Lentejas · 32:10 − + ×». Sonando: parpadea, dice
 * «¡Listo!» y enseña un «Parar» grande, que es lo que hay que encontrar a la primera con las
 * manos mojadas; el + sigue ahí para el «le faltan dos minutitos».
 */
export function CookTimerRow({ timer, now, onAdjust, onDismiss }: CookTimerRowProps) {
  const colors = useColors();
  const isDone = isTimerDone(timer, now);
  // Parpadea al ritmo del reloj de la pantalla, que ya avanza cada segundo.
  const isBlinkOn = isDone && Math.floor(now / 1000) % 2 === 0;
  const background = isDone ? (isBlinkOn ? colors.primary : colors.inferred) : colors.card;
  const textColor = isBlinkOn ? colors.primaryForeground : colors.foreground;
  const timeColor = isBlinkOn ? colors.primaryForeground : colors.primary;

  return (
    <View style={[styles.row, { backgroundColor: background }]}>
      <Text numberOfLines={1} style={[styles.text, { color: textColor }]}>
        {timer.label} ·{" "}
        <Text style={[styles.time, { color: timeColor }]}>
          {isDone ? "¡Listo!" : countdownText(timer.endsAt - now)}
        </Text>
      </Text>
      {!isDone && (
        <IconButton
          name="remove"
          label="Un minuto menos"
          onPress={() => {
            onAdjust(-1);
          }}
        />
      )}
      <IconButton
        name="add"
        label="Un minuto más"
        onPress={() => {
          onAdjust(1);
        }}
      />
      {isDone ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Parar la alarma de ${timer.label}`}
          onPress={onDismiss}
          style={[styles.stop, { backgroundColor: colors.foreground }]}
        >
          <Text style={[styles.stopLabel, { color: colors.background }]}>Parar</Text>
        </Pressable>
      ) : (
        <IconButton name="close" label="Quitar el temporizador" onPress={onDismiss} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row / 2,
    borderRadius: tokens.radius.card,
    paddingLeft: tokens.spacing.row + 4,
    paddingRight: 2,
    paddingVertical: 2,
  },
  text: { flex: 1, fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.body },
  time: { fontFamily: tokens.fontFamily.bodyStrong },
  stop: {
    height: tokens.touch.headerButton,
    paddingHorizontal: tokens.spacing.gutter,
    borderRadius: tokens.radius.pill,
    justifyContent: "center",
  },
  stopLabel: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
});
