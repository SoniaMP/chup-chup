import { useState } from "react";
import { StyleSheet, View } from "react-native";

import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { CookbookActions } from "@/features/cookbooks/CookbookActions";
import { tokens } from "@/theme/tokens";
import { CookbookListItem } from "./CookbookListItem";

type CookbookListProps = {
  cookbooks: Cookbook[];
  /** Cuántas recetas tiene cada libro, por identificador. */
  recipeCounts: Map<string, number>;
  /** Para volver a leer la biblioteca cuando un libro cambia de nombre o desaparece. */
  onChanged: () => void;
};

/** La biblioteca: tus libros a lo ancho. Cada uno se abre en su pantalla. */
export function CookbookList({ cookbooks, recipeCounts, onChanged }: CookbookListProps) {
  // El libro cuyas acciones se han pedido dejando el dedo encima. Una hoja para toda la lista.
  const [chosen, setChosen] = useState<Cookbook | null>(null);

  return (
    <View style={styles.list}>
      {cookbooks.map((cookbook) => (
        <CookbookListItem
          key={cookbook.id}
          cookbook={cookbook}
          recipeCount={recipeCounts.get(cookbook.id) ?? 0}
          onOpenActions={() => {
            setChosen(cookbook);
          }}
        />
      ))}

      {chosen !== null && (
        <CookbookActions
          cookbook={chosen}
          isOpen
          onClose={() => {
            setChosen(null);
          }}
          onRenamed={() => {
            setChosen(null);
            onChanged();
          }}
          onDeleted={() => {
            setChosen(null);
            onChanged();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: tokens.spacing.row },
});
