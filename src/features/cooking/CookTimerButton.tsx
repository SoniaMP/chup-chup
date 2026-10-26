import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { IconButton } from "@/components/IconButton";
import { minutesText } from "@/domain/cooking/minutesText";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { TimerMinutesField } from "./TimerMinutesField";

const FEWEST_MINUTES = 1;
const MOST_MINUTES = 600;

/**
 * El temporizador de un paso, antes de arrancarlo: «− ⏱ 20 min + ▶ ×». Es opcional: si el paso
 * dice un tiempo sale ya puesto y destacado; si no, solo un «+ Añadir temporizador» discreto, que
 * lo abre en 5 minutos; la × lo quita, y al arrancarlo también se recoge. El tiempo se escribe tocándolo y se arranca con
 * el play, nunca solo: quien cocina sabe cuándo ha echado las lentejas, la app no.
 */
export function CookTimerButton({
  minutes,
  isFromStep,
  onStart,
}: {
  minutes: number;
  isFromStep: boolean;
  onStart: (minutes: number) => void;
}) {
  const colors = useColors();
  const [chosen, setChosen] = useState(minutes);
  const [isAdded, setIsAdded] = useState(isFromStep);
  const change = (delta: number): void => {
    setChosen((current) => Math.min(MOST_MINUTES, Math.max(FEWEST_MINUTES, current + delta)));
  };

  if (!isAdded) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          setIsAdded(true);
        }}
        style={[styles.row, styles.add]}
      >
        <MaterialIcons name="add" size={18} color={colors.mutedForeground} />
        <Text style={[styles.addLabel, { color: colors.mutedForeground }]}>
          Añadir temporizador
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.row}>
      <IconButton
        name="remove"
        label="Un minuto menos"
        onPress={() => {
          change(-1);
        }}
      />
      <TimerMinutesField minutes={chosen} isHighlighted={isFromStep} onChange={setChosen} />
      <IconButton
        name="add"
        label="Un minuto más"
        onPress={() => {
          change(1);
        }}
      />
      <IconButton
        name="play-arrow"
        label={`Empezar temporizador de ${minutesText(chosen)}`}
        tone="primary"
        onPress={() => {
          // Arrancado, se va a la franja de arriba y aquí vuelve el «+ Añadir temporizador»,
          // por si el paso necesita otro.
          onStart(chosen);
          setIsAdded(false);
          setChosen(minutes);
        }}
      />
      <IconButton
        name="close"
        label="Quitar el temporizador"
        onPress={() => {
          setIsAdded(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row,
    marginTop: tokens.spacing.row + 4,
  },
  add: {
    gap: tokens.spacing.row / 2,
    alignSelf: "flex-start",
    minHeight: tokens.touch.headerButton,
  },
  addLabel: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.label },
});
