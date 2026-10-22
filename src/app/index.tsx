import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { Screen } from "@/components/Screen";
import { recipeMatchesQuery } from "@/domain/recipes/recipeMatchesQuery";
import { useCookbookMembership } from "@/features/cookbooks/useCookbookMembership";
import { useCookbooks } from "@/features/cookbooks/useCookbooks";
import { CookbookList } from "@/features/library/CookbookList";
import { EmptyKitchen } from "@/features/library/EmptyKitchen";
import { KitchenHeader } from "@/features/library/KitchenHeader";
import { NoSearchResults } from "@/features/library/NoSearchResults";
import { RecipeRow } from "@/features/library/RecipeRow";
import { useRecipes } from "@/features/library/useRecipes";
import { CreateRecipeButton } from "@/features/recipes/CreateRecipeButton";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

export default function KitchenScreen() {
  const colors = useColors();
  const router = useRouter();
  const recipes = useRecipes();
  const cookbooks = useCookbooks();
  const membership = useCookbookMembership();
  const [query, setQuery] = useState("");
  const [isOnlyFavorites, setIsOnlyFavorites] = useState(false);

  // Sin buscar ni filtrar se ve la biblioteca: los libros con sus recetas dentro. Buscando, lo
  // que se quiere son recetas, vengan del libro que vengan.
  const isBrowsing = query.trim() === "" && !isOnlyFavorites;

  const found = useMemo(
    () =>
      (recipes ?? []).filter(
        (recipe) =>
          (!isOnlyFavorites || recipe.isFavorite) && recipeMatchesQuery(recipe, query),
      ),
    [recipes, query, isOnlyFavorites],
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Screen>
        <KitchenHeader
          query={query}
          onQueryChange={setQuery}
          isOnlyFavorites={isOnlyFavorites}
          onOnlyFavoritesChange={() => {
            setIsOnlyFavorites((isOn) => !isOn);
          }}
        />
        {recipes !== null && recipes.length === 0 && <EmptyKitchen />}

        {isBrowsing && recipes !== null && recipes.length > 0 && (
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            <CookbookList
              cookbooks={cookbooks ?? []}
              recipes={recipes}
              membership={membership ?? new Map()}
            />
          </ScrollView>
        )}

        {!isBrowsing && found.length === 0 && (
          <NoSearchResults query={query} isOnlyFavorites={isOnlyFavorites} />
        )}
        {!isBrowsing && found.length > 0 && (
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {found.map((recipe) => (
              <RecipeRow
                key={recipe.id}
                recipe={recipe}
                onPress={() => {
                  router.push({ pathname: "/recipe/[id]", params: { id: recipe.id } });
                }}
              />
            ))}
          </ScrollView>
        )}
      </Screen>
      <CreateRecipeButton
        onPress={() => {
          router.push("/create");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  list: { gap: tokens.spacing.row / 2, paddingBottom: tokens.touch.createButton * 2 },
});
