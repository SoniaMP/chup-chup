import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { coverFor } from "@/domain/covers/coverFor";
import { CoverThumbnail } from "@/features/covers/CoverThumbnail";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

const COVER_SIZE = 64;

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
  const isReordering = handle !== undefined;

  const body = (
    <>
      <CoverThumbnail cover={coverFor(cookbook)} size={COVER_SIZE} />

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

    </>
  );

  const card = [styles.card, { backgroundColor: colors.card, borderColor: colors.border }];

  if (isReordering) {
    return (
      <View style={card}>
        {body}
        {handle}
      </View>
    );
  }

  // Dos botones hermanos, nunca uno dentro de otro: en web un Pressable es un <button>. Igual
  // que en la fila de una receta, para que la lista se comporte igual de arriba abajo.
  return (
    <View style={card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Abrir el libro ${cookbook.title}`}
        onPress={() => {
          router.push({ pathname: "/cookbook/[id]", params: { id: cookbook.id } });
        }}
        onLongPress={onOpenActions}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
      >
        {body}
      </Pressable>

      {onOpenActions === undefined ? (
        <MaterialIcons name="chevron-right" size={24} color={colors.mutedForeground} />
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Acciones del libro ${cookbook.title}`}
          onPress={onOpenActions}
          style={({ pressed }) => [styles.actions, pressed && styles.pressed]}
        >
          <MaterialIcons name="more-vert" size={22} color={colors.mutedForeground} />
        </Pressable>
      )}
    </View>
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
  main: { flex: 1, flexDirection: "row", alignItems: "center", gap: tokens.spacing.row + 4 },
  actions: { width: 36, height: 44, alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.9 },
  // La misma tipografía que el título de una receta: en la cocina todo se lee igual.
  title: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
  text: { flex: 1, gap: 2 },
  count: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
});
