import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { BackButton } from "@/components/BackButton";
import { IconButton } from "@/components/IconButton";
import { Screen } from "@/components/Screen";
import { CookbookActions } from "@/features/cookbooks/CookbookActions";
import { CookbookRecipeList } from "@/features/cookbooks/CookbookRecipeList";
import { useCookbook } from "@/features/cookbooks/useCookbook";
import { useCookbookRecipes } from "@/features/cookbooks/useCookbookRecipes";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

export default function CookbookScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const cookbookId = params.id ?? "";
  const { cookbook, isLoaded, replace } = useCookbook(cookbookId);
  const { entries, reload } = useCookbookRecipes(cookbookId);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          {/* Las acciones del libro se piden aquí, que es donde se buscan: dentro del libro. */}
          <IconButton
            name="more-vert"
            label={`Acciones del libro ${cookbook.title}`}
            onPress={() => {
              setIsMenuOpen(true);
            }}
          />
        </View>

        <Text style={[styles.label, { color: colors.primary }]}>LIBRO</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>{cookbook.title}</Text>

        {entries !== null && (
          <CookbookRecipeList
            cookbookId={cookbookId}
            entries={entries}
            canDeleteCookbook={!cookbook.isSystem}
            onOpenRecipe={(recipeId) => {
              router.push({ pathname: "/recipe/[id]", params: { id: recipeId } });
            }}
            onAddToCookbook={(recipeId) => {
              router.push({ pathname: "/recipe/[id]/books", params: { id: recipeId } });
            }}
            onCookbookDeleted={() => {
              router.replace("/");
            }}
            onReload={reload}
          />
        )}

      </ScrollView>
      <CookbookActions
        cookbook={cookbook}
        isOpen={isMenuOpen}
        onClose={() => {
          setIsMenuOpen(false);
        }}
        onRenamed={(renamed) => {
          setIsMenuOpen(false);
          replace(renamed);
        }}
        onDeleted={() => {
          setIsMenuOpen(false);
          router.replace("/");
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: tokens.spacing.block * 2 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: tokens.spacing.block,
  },
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
});
