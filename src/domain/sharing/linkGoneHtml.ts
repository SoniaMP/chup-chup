/**
 * Lo que ve quien abre un enlace que ya no vale.
 *
 * Caducado y nunca existido dan la misma página a propósito: distinguirlos sería decirle a
 * cualquiera que pruebe enlaces al azar cuáles de ellos existieron.
 */
export function linkGoneHtml(): string {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Este enlace ya no vale</title>
<style>
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FDF6EA;
    color: #2C1A14;
    font: 17px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    text-align: center;
    padding: 24px;
  }
  h1 { font-family: Georgia, "Times New Roman", serif; font-size: 1.6rem; margin: 0 0 8px; }
  p { color: #725F54; margin: 0; max-width: 24rem; }
</style>
</head>
<body>
<main>
<h1>Este enlace ya no vale</h1>
<p>Puede que haya caducado o que quien te lo mandó haya dejado de compartir la receta. Pídeselo otra vez.</p>
</main>
</body>
</html>`;
}
