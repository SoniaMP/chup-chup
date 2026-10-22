import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { CookbookCard } from "./CookbookCard";

/** La fila de libros de la pantalla principal. No se pinta nada mientras no haya ninguno. */
export function CookbookShelf({ cookbooks }: { cookbooks: Cookbook[] }) {
  const colors = useColors();
  const router = useRouter();

  if (cookbooks.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.heading, { color: colors.mutedForeground }]}>MIS LIBROS</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {cookbooks.map((cookbook) => (
          <CookbookCard
            key={cookbook.id}
            cookbook={cookbook}
            onPress={() => {
              router.push({ pathname: "/cookbook/[id]", params: { id: cookbook.id } });
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: tokens.spacing.row, paddingBottom: tokens.spacing.block },
  heading: {
    fontFamily: tokens.fontFamily.bodyStrong,
    fontSize: tokens.fontSize.label,
    letterSpacing: 2,
  },
  row: { gap: tokens.spacing.row + 4, paddingRight: tokens.spacing.gutter },
});
