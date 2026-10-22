import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { BackButton } from "@/components/BackButton";
import { EmptyState } from "@/components/EmptyState";
import { Screen } from "@/components/Screen";
import { useCookbook } from "@/features/cookbooks/useCookbook";
import { useCookbookRecipes } from "@/features/cookbooks/useCookbookRecipes";
import { RecipeRow } from "@/features/library/RecipeRow";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

export default function CookbookScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const cookbookId = params.id ?? "";
  const { cookbook, isLoaded } = useCookbook(cookbookId);
  const recipes = useCookbookRecipes(cookbookId);

  if (cookbook === null) {
    return (
      <Screen>
        <BackButton />
        <Text style={[styles.message, { color: colors.mutedForeground }]}>
          {isLoaded ? "Este libro ya no está." : "Abriendo el libro…"}
        </Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton />
        </View>

        <Text style={[styles.label, { color: colors.primary }]}>LIBRO</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>{cookbook.title}</Text>

        {recipes !== null && recipes.length === 0 && (
          <EmptyState
            title="Este libro está vacío"
            line="Las recetas se añaden desde la propia receta, con «Añadir a un libro»."
          />
        )}

        <View style={styles.list}>
          {(recipes ?? []).map((recipe) => (
            <RecipeRow
              key={recipe.id}
              recipe={recipe}
              onPress={() => {
                router.push({ pathname: "/recipe/[id]", params: { id: recipe.id } });
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
  label: {
    fontFamily: tokens.fontFamily.bodyStrong,
    fontSize: tokens.fontSize.label,
    letterSpacing: 2,
    marginBottom: tokens.spacing.row / 2,
  },
  title: {
    fontFamily: tokens.fontFamily.display,
    fontSize: tokens.fontSize.screenTitle,
    letterSpacing: -0.4,
    marginBottom: tokens.spacing.gutter,
  },
  message: {
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.body,
    lineHeight: 24,
    marginTop: tokens.spacing.block,
  },
  list: { gap: tokens.spacing.row / 2 },
});
