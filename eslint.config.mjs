import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Las Edge Functions son Deno, no la app: tienen su propio tiempo de ejecución y su
  // propio mapa de imports, así que no entran ni en este lint ni en el tsconfig.
  { ignores: ["node_modules", "reference", "coverage", ".expo", "dist", "supabase/functions"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
);
