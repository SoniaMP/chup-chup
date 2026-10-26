import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Logo } from "@/components/Logo";
import { AccountAvatar } from "@/features/auth/AccountAvatar";
import { AccountSheet } from "@/features/auth/AccountSheet";
import { useAccount } from "@/features/auth/useAccount";

import { FavoritesFilter } from "./FavoritesFilter";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { webFocusReset } from "@/theme/webFocusReset";

type KitchenHeaderProps = {
  query: string;
  onQueryChange: (query: string) => void;
  isOnlyFavorites: boolean;
  onOnlyFavoritesChange: () => void;
};

/** El nombre y el avatar en una fila, con el buscador y el filtro debajo. */
export function KitchenHeader({
  query,
  onQueryChange,
  isOnlyFavorites,
  onOnlyFavoritesChange,
}: KitchenHeaderProps) {
  const colors = useColors();
  const account = useAccount();
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.brand}>
          <Logo size={56} />
          <Text style={[styles.title, { color: colors.foreground }]}>Chup Chup</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tu cuenta"
          onPress={() => {
            setIsAccountOpen(true);
          }}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <AccountAvatar account={account} size={tokens.touch.headerButton} />
        </Pressable>
      </View>
      <AccountSheet
        account={account}
        isOpen={isAccountOpen}
        onClose={() => {
          setIsAccountOpen(false);
        }}
      />
      {/* La ✕ es nuestra: la del sistema (`clearButtonMode`) solo existe en iPhone. */}
      <View style={[styles.search, { backgroundColor: colors.muted }]}>
        <MaterialIcons name="search" size={22} color={colors.mutedForeground} />
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          placeholder="Busca una receta o un ingrediente"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.field, webFocusReset, { color: colors.foreground }]}
        />
        {query !== "" && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Vaciar la búsqueda"
            onPress={() => {
              onQueryChange("");
            }}
            style={({ pressed }) => [styles.clear, pressed && styles.pressed]}
          >
            <MaterialIcons name="close" size={20} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>
      {/* Solo filtros: crear un libro se pide en la hoja del botón Crear. Esta fila acabará
          siendo «Favoritas · Recetarios · Libros · Recetas», y los filtros crecen por la izquierda. */}
      <View style={styles.chips}>
        <FavoritesFilter isOn={isOnlyFavorites} onToggle={onOnlyFavoritesChange} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: tokens.spacing.row * 2, paddingBottom: tokens.spacing.block },
  chips: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brand: { flexDirection: "row", alignItems: "center", gap: tokens.spacing.row + 2 },
  // El logo es la marca y el texto la acompaña: el título baja para que mande el dibujo.
  title: { fontFamily: tokens.fontFamily.display, fontSize: 26, letterSpacing: -0.3 },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row + 2,
    height: tokens.touch.primaryButton,
    borderRadius: tokens.radius.pill,
    paddingHorizontal: tokens.spacing.gutter - 4,
  },
  field: { flex: 1, height: "100%", fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.body },
  clear: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.6 },
});
