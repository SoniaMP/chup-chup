import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/** The floating Crear button: the MVP has no bottom bar. */
export function CreateRecipeButton({ onPress }: { onPress: () => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Crear receta"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        tokens.shadow.glow,
        { bottom: insets.bottom + tokens.spacing.block, transform: [{ scale: pressed ? 0.96 : 1 }] },
      ]}
    >
      <LinearGradient
        colors={tokens.gradient.warm}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fill}
      >
        <Text style={[styles.plus, { color: colors.primaryForeground }]}>+</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: tokens.spacing.gutter,
    width: tokens.touch.createButton,
    height: tokens.touch.createButton,
    borderRadius: tokens.radius.pill,
  },
  fill: {
    flex: 1,
    borderRadius: tokens.radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  plus: { fontFamily: tokens.fontFamily.body, fontSize: 34, lineHeight: 38 },
});
