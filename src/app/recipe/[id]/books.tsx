import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { BackButton } from "@/components/BackButton";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { CookbookCheckRow } from "@/features/cookbooks/CookbookCheckRow";
import { useCookbooks } from "@/features/cookbooks/useCookbooks";
import { useRecipeCookbookIds } from "@/features/cookbooks/useRecipeCookbookIds";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

export default function RecipeCookbooksScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const recipeId = params.id ?? "";
  const cookbooks = useCookbooks();
  const { cookbookIds, toggle } = useRecipeCookbookIds(recipeId);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton />
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>Añadir a un libro</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Una receta puede estar en todos los libros que quieras. No se duplica.
        </Text>

        {cookbooks !== null && cookbooks.length === 0 && (
          <View style={styles.empty}>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Todavía no tienes ningún libro.
            </Text>
            <PrimaryButton
              label="Crear mi primer libro"
              onPress={() => {
                router.push("/cookbook/new");
              }}
            />
          </View>
        )}

        <View style={styles.list}>
          {(cookbooks ?? []).map((cookbook) => (
            <CookbookCheckRow
              key={cookbook.id}
              cookbook={cookbook}
              isChecked={(cookbookIds ?? []).includes(cookbook.id)}
              onToggle={() => {
                void toggle(cookbook.id);
              }}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: tokens.spacing.block * 2 },
  header: { marginBottom: tokens.spacing.block },
  title: {
    fontFamily: tokens.fontFamily.display,
    fontSize: tokens.fontSize.screenTitle,
    letterSpacing: -0.4,
    marginBottom: tokens.spacing.row / 2,
  },
  subtitle: {
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.body,
    lineHeight: 24,
    marginBottom: tokens.spacing.gutter,
  },
  empty: { gap: tokens.spacing.row },
  list: { gap: tokens.spacing.row / 2 },
});
