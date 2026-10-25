import { EmptyState } from "@/components/EmptyState";

/**
 * Lo que enseña la pantalla principal antes de la primera receta.
 *
 * Va dentro de la lista, debajo de los libros, y en versión compacta. No se centra ni se pega
 * al fondo: en el navegador del móvil la ventana es más corta de lo que dice, y lo que se coloca
 * contra el borde de abajo acaba cortado y debajo del botón flotante.
 */
export function EmptyKitchen() {
  return (
    <EmptyState
      isCompact
      title="Tu cocina está vacía"
      line="Escribe tu primera receta como te salga. Ya la ordenamos nosotros."
    />
  );
}
