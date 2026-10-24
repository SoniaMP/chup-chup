type WebClipboard = { clipboard?: { writeText: (text: string) => Promise<void> } };

type Field = {
  value: string;
  readOnly: boolean;
  style: { position: string; top: string; left: string; opacity: string };
  focus: () => void;
  select: () => void;
  setSelectionRange: (start: number, end: number) => void;
};

type LegacyDocument = {
  createElement: (tag: string) => Field;
  body: { appendChild: (node: Field) => void; removeChild: (node: Field) => void };
  execCommand: (command: string) => boolean;
};

/**
 * El portapapeles de antes, el que sigue funcionando por `http`.
 *
 * `execCommand` está desaconsejado desde hace años, pero es lo único que copia en una página que
 * no es segura, y el servidor de desarrollo lo es poco: va por IP y sin cifrar. Se escribe el
 * texto en un campo invisible, se selecciona y se copia.
 */
const copyTheOldWay = (text: string): boolean => {
  const page = globalThis.document as unknown as LegacyDocument | undefined;
  if (page === undefined) return false;

  const field = page.createElement("textarea");
  field.value = text;
  field.readOnly = true;
  // Fuera de la vista pero dentro de la página: lo que no está puesto no se puede seleccionar.
  // Propiedad a propiedad, porque `style` no se deja reemplazar entero por un objeto.
  field.style.position = "fixed";
  field.style.top = "0";
  field.style.left = "-9999px";
  field.style.opacity = "0";

  try {
    page.body.appendChild(field);
    field.focus();
    field.select();
    field.setSelectionRange(0, text.length);
    return page.execCommand("copy");
  } catch (cause: unknown) {
    console.warn("No se ha podido copiar el enlace", cause);
    return false;
  } finally {
    page.body.removeChild(field);
  }
};

/**
 * Copia el enlace al portapapeles. `false` si no se ha podido y toca copiarlo a mano.
 *
 * Primero el portapapeles de verdad, que solo existe en páginas seguras, y si no está, el truco
 * de siempre. Hay que llamarlo desde el gesto de la usuaria: un navegador no deja copiar nada
 * que no haya pedido ella tocando algo.
 */
export async function copyLink(text: string): Promise<boolean> {
  // El truco de siempre va primero y sin esperar a nada. En cuanto hay un `await` por medio, el
  // navegador deja de considerar que estamos dentro del gesto de la usuaria y no deja copiar:
  // por eso intentar antes el portapapeles moderno rompía también este, en las páginas donde
  // existe pero no funciona.
  if (copyTheOldWay(text)) return true;

  const web = globalThis.navigator as unknown as WebClipboard | undefined;
  if (web?.clipboard === undefined) return false;

  try {
    await web.clipboard.writeText(text);
    return true;
  } catch (cause: unknown) {
    console.warn("El portapapeles del navegador no ha querido", cause);
    return false;
  }
}
