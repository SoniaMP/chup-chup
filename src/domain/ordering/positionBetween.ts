const FIRST = "a".charCodeAt(0);
const LAST = "z".charCodeAt(0);
const BEFORE_FIRST = FIRST - 1;
const AFTER_LAST = LAST + 1;

/** La letra en esa posición, o el borde del alfabeto si la clave ya se ha acabado. */
const digitAt = (key: string, index: number, fallback: number): number =>
  index < key.length ? key.charCodeAt(index) : fallback;

/**
 * Una clave de orden que cae entre otras dos (fractional indexing).
 *
 * Mover una fila solo cambia esa fila: en vez de renumerar la lista entera, se calcula una clave
 * nueva entre la de arriba y la de abajo. Las claves se ordenan alfabéticamente, así que Postgres
 * ordena con un `order by position` normal.
 *
 * Cadena vacía significa "no hay vecino por ese lado": `positionBetween(ultima, "")` añade al
 * final, y `positionBetween("", primera)` añade al principio.
 */
export function positionBetween(before: string, after: string): string {
  let index = 0;
  let low = digitAt(before, 0, BEFORE_FIRST);
  let high = digitAt(after, 0, AFTER_LAST);

  // Se avanza por el prefijo común: hasta que los dos no difieren, no hay hueco donde meterse.
  while (low === high) {
    index += 1;
    low = digitAt(before, index, BEFORE_FIRST);
    high = digitAt(after, index, AFTER_LAST);
  }
  index += 1;

  let position = before.slice(0, index - 1);

  if (low === BEFORE_FIRST) {
    while (high === FIRST) {
      high = digitAt(after, index, AFTER_LAST);
      index += 1;
      position += "a";
    }
    if (high === FIRST + 1) {
      position += "a";
      high = AFTER_LAST;
    }
  } else if (low + 1 === high) {
    // Pegadas: hay que alargar la clave para caber entre las dos.
    position += String.fromCharCode(low);
    high = AFTER_LAST;
    while (true) {
      low = digitAt(before, index, BEFORE_FIRST);
      index += 1;
      if (low !== LAST) break;
      position += "z";
    }
  }

  return position + String.fromCharCode(Math.ceil((low + high) / 2));
}
