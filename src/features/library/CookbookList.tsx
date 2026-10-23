import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { ReorderBar } from "@/components/ReorderBar";
import { ReorderableList } from "@/components/ReorderableList";
import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { CookbookActions } from "@/features/cookbooks/CookbookActions";
import { useDisplayName } from "@/features/auth/useDisplayName";
import { useReorderCookbooks } from "@/features/cookbooks/useReorderCookbooks";
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
  const ownerName = useDisplayName();
  const [chosen, setChosen] = useState<Cookbook | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const { items, move } = useReorderCookbooks(cookbooks, onChanged);

  if (isReordering) {
    return (
      <View>
        <ReorderBar
          hint="Arrastra los libros por el asa para ponerlos en orden."
          onDone={() => {
            setIsReordering(false);
          }}
        />
        <ReorderableList
          items={items}
          gap={tokens.spacing.row}
          keyOf={(cookbook) => cookbook.id}
          onMove={move}
          renderItem={(cookbook, handle) => (
            <CookbookListItem
              cookbook={cookbook}
              recipeCount={recipeCounts.get(cookbook.id) ?? 0}
              ownerName={ownerName}
              onOpenActions={() => {
                setChosen(cookbook);
              }}
              handle={handle}
            />
          )}
        />
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {items.map((cookbook) => (
        <CookbookListItem
          key={cookbook.id}
          cookbook={cookbook}
          recipeCount={recipeCounts.get(cookbook.id) ?? 0}
          ownerName={ownerName}
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
          onReorder={() => {
            setChosen(null);
            setIsReordering(true);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: tokens.spacing.row },
});
