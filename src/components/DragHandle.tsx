import { MaterialIcons } from "@expo/vector-icons";

import { useColors } from "@/theme/useColors";

/** El asa de la que se tira para cambiar de sitio una fila. */
export function DragHandle() {
  const colors = useColors();

  return <MaterialIcons name="drag-handle" size={24} color={colors.mutedForeground} />;
}
