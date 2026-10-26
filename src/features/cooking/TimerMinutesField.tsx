import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";

import { minutesText } from "@/domain/cooking/minutesText";
import { typedMinutes } from "@/domain/cooking/typedMinutes";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

type TimerMinutesFieldProps = {
  minutes: number;
  isHighlighted: boolean;
  onChange: (minutes: number) => void;
};

/**
 * El tiempo del temporizador: se lee «⏱ 1 h 30 min» y, al tocarlo, se escribe a mano. Ir minuto a
 * minuto hasta hora y media es una tortura; escribir «1:30» o «90» no. Lo que no se entiende no
 * cambia nada: el tiempo se queda en el último que sí se entendió.
 */
export function TimerMinutesField({ minutes, isHighlighted, onChange }: TimerMinutesFieldProps) {
  const colors = useColors();
  const [draft, setDraft] = useState<string | null>(null);
  const background = isHighlighted ? colors.primary : colors.muted;
  const foreground = isHighlighted ? colors.primaryForeground : colors.foreground;

  if (draft !== null) {
    return (
      <TextInput
        autoFocus
        accessibilityLabel="Tiempo del temporizador"
        value={draft}
        placeholder="1:30"
        placeholderTextColor={colors.mutedForeground}
        keyboardType="numbers-and-punctuation"
        returnKeyType="done"
        selectTextOnFocus
        onChangeText={(text) => {
          setDraft(text);
          const typed = typedMinutes(text);
          if (typed !== null) onChange(typed);
        }}
        onBlur={() => {
          setDraft(null);
        }}
        style={[
          styles.pill,
          styles.input,
          { backgroundColor: colors.card, color: colors.foreground, borderColor: colors.primary },
        ]}
      />
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Cambiar el tiempo: ${minutesText(minutes)}`}
      onPress={() => {
        setDraft(String(minutes));
      }}
      style={({ pressed }) => [
        styles.pill,
        { backgroundColor: background },
        pressed && styles.pressed,
      ]}
    >
      <MaterialIcons name="timer" size={20} color={foreground} />
      <Text style={[styles.label, { color: foreground }]}>{minutesText(minutes)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row / 2,
    height: tokens.touch.headerButton,
    paddingHorizontal: tokens.spacing.gutter,
    borderRadius: tokens.radius.pill,
  },
  input: {
    width: 120,
    borderWidth: 2,
    textAlign: "center",
    fontFamily: tokens.fontFamily.bodyStrong,
    fontSize: tokens.fontSize.body,
  },
  label: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
});
