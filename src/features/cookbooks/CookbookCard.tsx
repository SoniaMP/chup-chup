import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, useColorScheme } from "react-native";

import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/** Un libro en la estantería: portada en degradado mientras no haya fotos. */
export function CookbookCard({ cookbook, onPress }: { cookbook: Cookbook; onPress: () => void }) {
  const colors = useColors();
  const gradient =
    useColorScheme() === "dark" ? tokens.gradient.placeholderDark : tokens.gradient.placeholder;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.cover}
      >
        <Text numberOfLines={3} style={[styles.title, { color: colors.foreground }]}>
          {cookbook.title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 132 },
  pressed: { opacity: 0.85 },
  cover: {
    width: 132,
    height: 132,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.row + 4,
    justifyContent: "flex-end",
  },
  title: { fontFamily: tokens.fontFamily.display, fontSize: 20, letterSpacing: -0.2 },
});
