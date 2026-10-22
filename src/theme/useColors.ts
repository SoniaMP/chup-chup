import { useColorScheme } from "react-native";
import { palette } from "./palette";
import type { Colors } from "./colors";

/** The palette for the device's current appearance. */
export function useColors(): Colors {
  return useColorScheme() === "dark" ? palette.dark : palette.light;
}
