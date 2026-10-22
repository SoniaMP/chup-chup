import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

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

/** Title, profile and + on one row, with the search field underneath. */
export function KitchenHeader({
  query,
  onQueryChange,
  isOnlyFavorites,
  onOnlyFavoritesChange,
}: KitchenHeaderProps) {
  const colors = useColors();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={[styles.title, { color: colors.foreground }]}>Chup Chup</Text>
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Perfil y ajustes"
            style={[styles.roundButton, { backgroundColor: colors.secondary }]}
          >
            <Text style={[styles.initial, { color: colors.secondaryForeground }]}>S</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Nuevo libro"
            onPress={() => {
              router.push("/cookbook/new");
            }}
            style={[styles.roundButton, { backgroundColor: colors.muted }]}
          >
            <Text style={[styles.plus, { color: colors.foreground }]}>+</Text>
          </Pressable>
        </View>
      </View>
      <TextInput
        value={query}
        onChangeText={onQueryChange}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
        placeholder="Busca una receta o un ingrediente"
        placeholderTextColor={colors.mutedForeground}
        style={[styles.search, webFocusReset, { backgroundColor: colors.muted, color: colors.foreground }]}
      />
      <FavoritesFilter isOn={isOnlyFavorites} onToggle={onOnlyFavoritesChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: tokens.spacing.row * 2, paddingBottom: tokens.spacing.block },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontFamily: tokens.fontFamily.display, fontSize: tokens.fontSize.screenTitle, letterSpacing: -0.4 },
  actions: { flexDirection: "row", gap: tokens.spacing.row },
  roundButton: {
    width: tokens.touch.headerButton,
    height: tokens.touch.headerButton,
    borderRadius: tokens.radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  initial: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
  plus: { fontFamily: tokens.fontFamily.body, fontSize: 24, lineHeight: 28 },
  search: {
    height: tokens.touch.primaryButton,
    borderRadius: tokens.radius.pill,
    paddingHorizontal: tokens.spacing.gutter,
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.body,
  },
});
