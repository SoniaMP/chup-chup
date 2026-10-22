import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";

import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

const countLabel = (total: number): string =>
  total === 1 ? "1 receta" : `${String(total)} recetas`;

type CookbookListItemProps = {
  cookbook: Cookbook;
  recipeCount: number;
  onOpenActions: () => void;
};

/**
 * Un libro de la biblioteca: un rótulo, no un objeto.
 *
 * La fila entera entra en el libro, sin sitios que se puedan fallar. Dejando el dedo encima se
 * abren sus acciones, como en las listas de Spotify.
 */
export function CookbookListItem({ cookbook, recipeCount, onOpenActions }: CookbookListItemProps) {
  const colors = useColors();
  const router = useRouter();
  const gradient =
    useColorScheme() === "dark" ? tokens.gradient.placeholderDark : tokens.gradient.placeholder;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir el libro ${cookbook.title}`}
      onPress={() => {
        router.push({ pathname: "/cookbook/[id]", params: { id: cookbook.id } });
      }}
      onLongPress={onOpenActions}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cover}
      />

      <View style={styles.text}>
        <Text numberOfLines={2} style={[styles.title, { color: colors.foreground }]}>
          {cookbook.title}
        </Text>
        <Text style={[styles.count, { color: colors.mutedForeground }]}>
          {countLabel(recipeCount)}
        </Text>
      </View>

      <MaterialIcons name="chevron-right" size={24} color={colors.mutedForeground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row + 2,
    paddingVertical: tokens.spacing.row + 2,
  },
  pressed: { opacity: 0.85 },
  cover: { width: 56, height: 56, borderRadius: tokens.radius.md },
  text: { flex: 1, gap: 1 },
  title: {
    fontFamily: tokens.fontFamily.display,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  count: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
});
