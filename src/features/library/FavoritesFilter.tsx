import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

type FavoritesFilterProps = {
  isOn: boolean;
  onToggle: () => void;
};

/** Deja en la pantalla principal solo las favoritas. No es un libro: es una lista que se calcula sola. */
export function FavoritesFilter({ isOn, onToggle }: FavoritesFilterProps) {
  const colors = useColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isOn ? "Ver todas las recetas" : "Ver solo las favoritas"}
      accessibilityState={{ selected: isOn }}
      onPress={onToggle}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: isOn ? colors.primary : colors.muted },
        pressed && styles.pressed,
      ]}
    >
      <MaterialIcons
        name={isOn ? "favorite" : "favorite-border"}
        size={18}
        color={isOn ? colors.primaryForeground : colors.mutedForeground}
      />
      <Text style={[styles.label, { color: isOn ? colors.primaryForeground : colors.foreground }]}>
        Favoritas
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row - 2,
    height: 38,
    paddingHorizontal: tokens.spacing.row + 6,
    borderRadius: tokens.radius.pill,
  },
  pressed: { opacity: 0.85 },
  label: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.label },
});
