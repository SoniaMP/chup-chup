import { EmptyState } from "@/components/EmptyState";

/** What the home screen shows before the first recipe exists. */
export function EmptyKitchen() {
  return (
    <EmptyState
      title="Tu cocina está vacía"
      line="Escribe tu primera receta como te salga. Ya la ordenamos nosotros."
    />
  );
}
