/**
 * Prepara imágenes para el catálogo del proyecto.
 *
 * Deja cada imagen cuadrada y en dos tamaños, que es lo que el selector de portada espera. Usa
 * `sips`, que viene con macOS: no instala nada.
 *
 *   npm run covers -- ~/Desktop/mis-imagenes
 *
 * Lee esa carpeta, escribe en `library/ready/` y de ahí las arrastras al bucket `library-images`
 * desde el panel de Supabase.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";

const READY_DIR = resolve(import.meta.dirname, "../library/ready");
const SOURCES = [".jpg", ".jpeg", ".png", ".heic", ".webp", ".tiff"];
const LARGE = 1200;
const SMALL = 400;

const sips = (args: string[]): string => execFileSync("sips", args, { encoding: "utf-8" });

/** El lado del cuadrado más grande que cabe en la imagen. */
const shorterSide = (file: string): number => {
  const output = sips(["-g", "pixelWidth", "-g", "pixelHeight", file]);
  const numbers = [...output.matchAll(/(\d+)/g)].map((match) => Number(match[1]));

  return Math.min(...numbers);
};

/** Recorta al centro y escala, en una copia: el original no se toca. */
const writeSquare = (file: string, id: string, size: number, suffix: string): void => {
  const side = shorterSide(file);
  const out = join(READY_DIR, `${id}${suffix}.jpg`);

  sips(["-s", "format", "jpeg", "-s", "formatOptions", "80", file, "--out", out]);
  sips(["-c", String(side), String(side), out]);
  sips(["-Z", String(size), out]);
};

const idFrom = (file: string): string =>
  basename(file, extname(file))
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const main = (): void => {
  const folder = process.argv[2];

  if (folder === undefined) {
    console.error("Dime qué carpeta: npm run covers -- ~/Desktop/mis-imagenes");
    process.exitCode = 1;
    return;
  }

  const files = readdirSync(folder)
    .filter((file) => SOURCES.includes(extname(file).toLowerCase()))
    .map((file) => join(folder, file));

  if (files.length === 0) {
    console.error(`No hay imágenes en ${folder}`);
    process.exitCode = 1;
    return;
  }

  if (existsSync(READY_DIR)) rmSync(READY_DIR, { recursive: true });
  mkdirSync(READY_DIR, { recursive: true });

  for (const file of files) {
    const id = idFrom(file);
    process.stdout.write(`  ${basename(file)} → ${id}.jpg + ${id}-small.jpg … `);
    writeSquare(file, id, LARGE, "");
    writeSquare(file, id, SMALL, "-small");
    console.log("listo");
  }

  console.log(`\n${String(files.length)} imágenes en library/ready/. Arrástralas al bucket.`);
};

main();
