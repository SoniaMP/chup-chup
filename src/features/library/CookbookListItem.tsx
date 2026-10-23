import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";

import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

const countLabel = (total: number): string =>
  total === 1 ? "1 receta" : `${String(total)} recetas`;

/** De quién es el libro y cuánto lleva dentro: «Sonia · 12 recetas». */
const subtitleOf = (ownerName: string | null, total: number): string =>
  ownerName === null ? countLabel(total) : `${ownerName} · ${countLabel(total)}`;

type CookbookListItemProps = {
  cookbook: Cookbook;
  recipeCount: number;
  /** De quién es el libro. `null` mientras no se sabe, y entonces no se firma. */
  ownerName: string | null;
  /** Sin acciones, la tarjeta solo entra en el libro: así sale en los resultados de buscar. */
  onOpenActions?: () => void;
  /** El asa de arrastrar, cuando la biblioteca está en modo reordenar. */
  handle?: ReactNode;
};

/**
 * Un libro de la biblioteca: ahora sí una tarjeta.
 *
 * Desde que el libro se abre en su propia pantalla vuelve a ser una cosa que se coge, no un
 * rótulo que separa, así que tiene fondo, bordes redondeados y su sombra. La tarjeta entera
 * entra en el libro; dejando el dedo encima se abren sus acciones.
 */
export function CookbookListItem({
  cookbook,
  recipeCount,
  ownerName,
  onOpenActions,
  handle,
}: CookbookListItemProps) {
  const colors = useColors();
  const router = useRouter();
  const gradient =
    useColorScheme() === "dark" ? tokens.gradient.placeholderDark : tokens.gradient.placeholder;
  const isReordering = handle !== undefined;

  const body = (
    <>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cover}
      />

      <View style={styles.text}>
        {/* Reordenando, el título va a una línea: todas las tarjetas miden lo mismo. */}
        <Text
          numberOfLines={isReordering ? 1 : 2}
          style={[styles.title, { color: colors.foreground }]}
        >
          {cookbook.title}
        </Text>
        <Text numberOfLines={1} style={[styles.count, { color: colors.mutedForeground }]}>
          {subtitleOf(ownerName, recipeCount)}
        </Text>
      </View>

      {handle ?? <MaterialIcons name="chevron-right" size={24} color={colors.mutedForeground} />}
    </>
  );

  if (isReordering) {
    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {body}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir el libro ${cookbook.title}`}
      onPress={() => {
        router.push({ pathname: "/cookbook/[id]", params: { id: cookbook.id } });
      }}
      onLongPress={onOpenActions}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row + 4,
    padding: tokens.spacing.row + 4,
    borderRadius: tokens.radius.card,
    // Sin sombra: la pantalla la recorta contra su propio margen. Un filo basta para separar
    // la tarjeta del fondo, que son dos cremas muy parecidas.
    borderWidth: 1,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.995 }] },
  cover: { width: 64, height: 64, borderRadius: tokens.radius.card },
  // La misma tipografía que el título de una receta: en la cocina todo se lee igual.
  title: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
  text: { flex: 1, gap: 2 },
  count: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
});
