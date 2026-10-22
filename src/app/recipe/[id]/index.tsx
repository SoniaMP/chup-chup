import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { BackButton } from "@/components/BackButton";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { RecipeFacts } from "@/features/recipes/RecipeFacts";
import { RecipeIngredients } from "@/features/recipes/RecipeIngredients";
import { RecipeNotes } from "@/features/recipes/RecipeNotes";
import { RecipeSteps } from "@/features/recipes/RecipeSteps";
import { SectionHeading } from "@/features/recipes/SectionHeading";
import { saveRecipeNotes } from "@/features/recipes/saveRecipeNotes";
import { useRecipe } from "@/features/recipes/useRecipe";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

export default function RecipeScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { recipe, isLoaded, replace } = useRecipe(params.id ?? "");

  if (recipe === null) {
    return (
      <Screen>
        <BackButton />
        <Text style={[styles.message, { color: colors.mutedForeground }]}>
          {isLoaded ? "Esta receta ya no está." : "Abriendo la receta…"}
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

        <Text style={[styles.title, { color: colors.foreground }]}>{recipe.title}</Text>
        <RecipeFacts recipe={recipe} />

        {recipe.steps.length > 0 && (
          <View style={styles.cook}>
            <PrimaryButton
              label="Modo cocina"
              onPress={() => {
                router.push({ pathname: "/recipe/[id]/cook", params: { id: recipe.id } });
              }}
            />
          </View>
        )}

        <SectionHeading>Ingredientes</SectionHeading>
        <RecipeIngredients ingredients={recipe.ingredients} />

        <SectionHeading>Pasos</SectionHeading>
        <RecipeSteps steps={recipe.steps} />

        <SectionHeading>Mis notas</SectionHeading>
        <RecipeNotes
          notes={recipe.notes}
          onSave={(notes) => {
            void saveRecipeNotes(recipe, notes).then(replace);
          }}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: tokens.spacing.block * 2 },
  header: { marginBottom: tokens.spacing.block },
  message: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.body, marginTop: tokens.spacing.block },
  title: {
    fontFamily: tokens.fontFamily.display,
    fontSize: tokens.fontSize.screenTitle,
    letterSpacing: -0.4,
    marginBottom: tokens.spacing.gutter,
  },
  cook: { marginTop: tokens.spacing.block },
});
