/**
 * Compila la web y le deja el idioma puesto.
 *
 * `expo export` escribe `<html lang="en">` en el `index.html` que genera, y no hay forma de
 * cambiarlo desde la configuración: la plantilla `app/+html.tsx` solo la usa Expo cuando la salida
 * web es `static`, y la nuestra es `single`. Cambiar a `static` para arreglar un atributo sería
 * cambiar cómo se pinta la app entera, así que se corrige aquí, después de compilar.
 *
 * Cuando la app hable más idiomas, esto se cae y la portada pasará a declarar el que toque.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const INDEX = resolve(import.meta.dirname, "../dist/index.html");
const LANG = "es";

execFileSync("npx", ["expo", "export", "--platform", "web"], { stdio: "inherit" });

const html = readFileSync(INDEX, "utf8");
const fixed = html.replace(/<html lang="[^"]*">/, `<html lang="${LANG}">`);

if (fixed === html) {
  console.warn(`Ojo: no se ha encontrado el atributo lang en ${INDEX}. ¿Ha cambiado Expo?`);
} else {
  writeFileSync(INDEX, fixed);
  console.log(`\nIdioma de la portada: ${LANG}`);
}
