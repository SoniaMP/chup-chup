/**
 * Las imágenes del repositorio se importan como módulos: Metro las empaqueta y devuelve el
 * identificador que `Image` entiende. TypeScript no lo sabe solo, así que se lo decimos aquí.
 */
declare module "*.png" {
  const source: number;
  export default source;
}
