import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

type CookbookCheckRowProps = {
  cookbook: Cookbook;
  isChecked: boolean;
  onToggle: () => void;
};

/** Un libro con su casilla, para meter o sacar la receta de un toque. */
export function CookbookCheckRow({ cookbook, isChecked, onToggle }: CookbookCheckRowProps) {
  const colors = useColors();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked }}
      accessibilityLabel={cookbook.title}
      onPress={onToggle}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: colors.card },
        pressed && styles.pressed,
      ]}
    >
      <MaterialIcons
        name={isChecked ? "check-circle" : "radio-button-unchecked"}
        size={24}
        color={isChecked ? colors.primary : colors.mutedForeground}
      />
      <Text numberOfLines={1} style={[styles.title, { color: colors.foreground }]}>
        {cookbook.title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row + 4,
    padding: tokens.spacing.gutter,
    borderRadius: tokens.radius.xl,
  },
  pressed: { opacity: 0.85 },
  title: { flex: 1, fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
});
