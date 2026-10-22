import { Figtree_400Regular, Figtree_600SemiBold } from "@expo-google-fonts/figtree";
import { Fraunces_600SemiBold } from "@expo-google-fonts/fraunces";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useSession } from "@/features/auth/useSession";
import { useColors } from "@/theme/useColors";

export default function RootLayout() {
  const colors = useColors();
  const [areFontsLoaded] = useFonts({
    Fraunces_600SemiBold,
    Figtree_400Regular,
    Figtree_600SemiBold,
  });

  const { session, isLoaded } = useSession();

  // Sin fuentes o sin saber todavía si hay sesión no se pinta nada: así nadie ve un salto al
  // login por una sesión que sí existía.
  if (!areFontsLoaded || !isLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Protected guard={session !== null} redirectTo="/login">
            <Stack.Screen name="index" />
            <Stack.Screen name="create" />
            <Stack.Screen name="review" />
            <Stack.Screen name="recipe/[id]/index" />
            <Stack.Screen name="recipe/[id]/cook" />
          </Stack.Protected>

          <Stack.Protected guard={session === null} redirectTo="/">
            <Stack.Screen name="login" />
          </Stack.Protected>
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
