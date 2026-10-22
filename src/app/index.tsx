import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import { Screen } from "@/components/Screen";
import { EmptyKitchen } from "@/features/library/EmptyKitchen";
import { KitchenHeader } from "@/features/library/KitchenHeader";
import { RecipeRow } from "@/features/library/RecipeRow";
import { useRecipes } from "@/features/library/useRecipes";
import { CreateRecipeButton } from "@/features/recipes/CreateRecipeButton";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

export default function KitchenScreen() {
  const colors = useColors();
  const router = useRouter();
  const recipes = useRecipes();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Screen>
        <KitchenHeader />
        {recipes !== null && recipes.length === 0 && <EmptyKitchen />}
        {recipes !== null && recipes.length > 0 && (
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {recipes.map((recipe) => (
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
