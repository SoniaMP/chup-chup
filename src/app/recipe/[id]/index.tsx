import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { BackButton } from "@/components/BackButton";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SecondaryButton } from "@/components/SecondaryButton";
import { DeleteRecipeButton } from "@/features/recipes/DeleteRecipeButton";
import { EditRecipeButton } from "@/features/recipes/EditRecipeButton";
import { FavoriteButton } from "@/features/recipes/FavoriteButton";
import { RecipeFacts } from "@/features/recipes/RecipeFacts";
import { RecipeIngredients } from "@/features/recipes/RecipeIngredients";
import { RecipeNotes } from "@/features/recipes/RecipeNotes";
import { RecipeSteps } from "@/features/recipes/RecipeSteps";
import { SectionHeading } from "@/components/SectionHeading";
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
          <View style={styles.headerActions}>
            <FavoriteButton recipe={recipe} onChange={replace} />
            <EditRecipeButton recipe={recipe} />
          </View>
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>{recipe.title}</Text>
        <RecipeFacts recipe={recipe} />

        <View style={styles.actions}>
          {recipe.steps.length > 0 && (
            <PrimaryButton
              label="Modo cocina"
              onPress={() => {
                router.push({ pathname: "/recipe/[id]/cook", params: { id: recipe.id } });
              }}
            />
          )}
          <SecondaryButton
            label="Añadir a un libro"
            onPress={() => {
              router.push({ pathname: "/recipe/[id]/books", params: { id: recipe.id } });
            }}
          />
        </View>

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

        <DeleteRecipeButton
          recipeId={recipe.id}
          onDeleted={() => {
            router.replace("/");
          }}
        />
      </ScrollView>
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
  headerActions: { flexDirection: "row", gap: tokens.spacing.row },
  message: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.body, marginTop: tokens.spacing.block },
  title: {
    fontFamily: tokens.fontFamily.display,
    fontSize: tokens.fontSize.screenTitle,
    letterSpacing: -0.4,
    marginBottom: tokens.spacing.gutter,
  },
  actions: { marginTop: tokens.spacing.block, gap: tokens.spacing.row },
});
