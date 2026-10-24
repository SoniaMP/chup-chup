import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { Screen } from "@/components/Screen";
import { cookbookMatchesQuery } from "@/domain/cookbooks/cookbookMatchesQuery";
import { recipeMatchesQuery } from "@/domain/recipes/recipeMatchesQuery";
import { useCookbookMembership } from "@/features/cookbooks/useCookbookMembership";
import { useCookbooks } from "@/features/cookbooks/useCookbooks";
import { CookbookList } from "@/features/library/CookbookList";
import { EmptyKitchen } from "@/features/library/EmptyKitchen";
import { KitchenHeader } from "@/features/library/KitchenHeader";
import { FilteredLibrary } from "@/features/library/FilteredLibrary";
import { NoSearchResults } from "@/features/library/NoSearchResults";
import { useRecipes } from "@/features/library/useRecipes";
import { CreateRecipeButton } from "@/features/recipes/CreateRecipeButton";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

export default function KitchenScreen() {
  const colors = useColors();
  const router = useRouter();
  const { recipes, reload: reloadRecipes } = useRecipes();
  const { cookbooks, reload: reloadCookbooks } = useCookbooks();
  const { membership, reload: reloadMembership } = useCookbookMembership();
  const [query, setQuery] = useState("");
  const [isOnlyFavorites, setIsOnlyFavorites] = useState(false);

  // Borrar una receta o un libro cambia las tres cosas: qué recetas hay, qué libros hay y qué
  // receta está dónde. Se releen juntas y así ninguna pantalla se queda enseñando lo que ya no está.
  const refreshKitchen = useCallback(() => {
    reloadRecipes();
    reloadCookbooks();
    reloadMembership();
  }, [reloadRecipes, reloadCookbooks, reloadMembership]);

  // Sin buscar ni filtrar se ve la biblioteca: los libros con sus recetas dentro. Buscando, lo
  // que se quiere son recetas, vengan del libro que vengan.
  const isBrowsing = query.trim() === "" && !isOnlyFavorites;

  // La biblioteca solo necesita cuántas recetas tiene cada libro: las de dentro se ven al entrar.
  const recipeCounts = useMemo(
    () => new Map([...(membership ?? new Map<string, string[]>())].map(([id, ids]) => [id, ids.length])),
    [membership],
  );

  const found = useMemo(
    () =>
      (recipes ?? []).filter(
        (recipe) =>
          (!isOnlyFavorites || recipe.isFavorite) && recipeMatchesQuery(recipe, query),
      ),
    [recipes, query, isOnlyFavorites],
  );

  // Los libros solo salen cuando se escribe: marcar favoritas es una pregunta sobre recetas.
  const foundCookbooks = useMemo(
    () =>
      query.trim() === ""
        ? []
        : (cookbooks ?? []).filter((cookbook) => cookbookMatchesQuery(cookbook, query)),
    [cookbooks, query],
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
              recipeCounts={recipeCounts}
              onChanged={refreshKitchen}
            />
          </ScrollView>
        )}

        {!isBrowsing && found.length === 0 && foundCookbooks.length === 0 && (
          <NoSearchResults query={query} isOnlyFavorites={isOnlyFavorites} />
        )}
        {!isBrowsing && (found.length > 0 || foundCookbooks.length > 0) && (
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            <FilteredLibrary
              cookbooks={foundCookbooks}
              recipeCounts={recipeCounts}
              recipes={found}
              onOpenRecipe={(recipeId) => {
                router.push({ pathname: "/recipe/[id]", params: { id: recipeId } });
              }}
              onAddToCookbook={(recipeId) => {
                router.push({ pathname: "/recipe/[id]/books", params: { id: recipeId } });
              }}
              onChanged={refreshKitchen}
            />
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
