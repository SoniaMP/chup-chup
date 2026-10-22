import { MaterialIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

type IconButtonProps = {
  name: ComponentProps<typeof MaterialIcons>["name"];
  /** Lo que lee un lector de pantalla: el icono solo no dice nada. */
  label: string;
  onPress: () => void;
  tone?: "muted" | "primary";
  isDisabled?: boolean;
};

/** Botón redondo de una sola acción, del tamaño mínimo que se acierta con el dedo. */
export function IconButton({
  name,
  label,
  onPress,
  tone = "muted",
  isDisabled = false,
}: IconButtonProps) {
  const colors = useColors();
  const isPrimary = tone === "primary";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: isPrimary ? colors.primary : colors.muted },
        isDisabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <MaterialIcons
        name={name}
        size={22}
        color={isPrimary ? colors.primaryForeground : colors.foreground}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: tokens.touch.headerButton,
    height: tokens.touch.headerButton,
    borderRadius: tokens.radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.85 },
});
