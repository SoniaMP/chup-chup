import { StyleSheet, Text, View } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

type NoSearchResultsProps = {
  query: string;
  isOnlyFavorites: boolean;
};

/** Lo que ve la usuaria cuando sí tiene recetas, pero ninguna responde a lo que pide. */
export function NoSearchResults({ query, isOnlyFavorites }: NoSearchResultsProps) {
  const colors = useColors();
  const isSearching = query.trim() !== "";

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.foreground }]}>Nada por aquí</Text>
      <Text style={[styles.line, { color: colors.mutedForeground }]}>
        {isSearching &&
          (isOnlyFavorites
            ? `Ninguna receta favorita habla de «${query.trim()}».`
            : `Ni tus libros ni tus recetas hablan de «${query.trim()}».`)}
        {!isSearching && "Todavía no has marcado ninguna receta como favorita."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: tokens.spacing.row },
  title: { fontFamily: tokens.fontFamily.display, fontSize: tokens.fontSize.sectionHeading },
  line: {
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.body,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 24,
  },
});
