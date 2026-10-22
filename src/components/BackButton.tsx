import { useRouter } from "expo-router";

import { IconButton } from "./IconButton";

/** Vuelve a la pantalla anterior, o a Mi cocina si no hay ninguna. */
export function BackButton() {
  const router = useRouter();

  return (
    <IconButton
      name="arrow-back"
      label="Volver"
      onPress={() => {
        // Si se ha entrado directo a esta pantalla no hay pila que deshacer: a Mi cocina.
        if (router.canGoBack()) router.back();
        else router.replace("/");
      }}
    />
  );
}
