import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

type CookIngredientsChipProps = {
  isOpen: boolean;
  onToggle: () => void;
};

/** Enseña y esconde los ingredientes sin salir del paso en el que vas. */
export function CookIngredientsChip({ isOpen, onToggle }: CookIngredientsChipProps) {
  const colors = useColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isOpen ? "Volver al paso" : "Ver los ingredientes"}
      onPress={onToggle}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: isOpen ? colors.secondary : colors.muted },
        pressed && styles.pressed,
      ]}
    >
      <MaterialIcons
        name={isOpen ? "arrow-back" : "format-list-bulleted"}
        size={20}
        color={colors.foreground}
      />
      <Text style={[styles.label, { color: colors.foreground }]}>
        {isOpen ? "Volver al paso" : "Ingredientes"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row,
    height: tokens.touch.headerButton,
    paddingHorizontal: tokens.spacing.gutter,
    borderRadius: tokens.radius.pill,
  },
  pressed: { opacity: 0.85 },
  label: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
});
