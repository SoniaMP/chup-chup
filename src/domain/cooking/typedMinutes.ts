/**
 * Los minutos que alguien escribe a mano en un temporizador: «90», «1:30», «1h30», «1 h 30 min»,
 * «2h». Todo eso es lo mismo para quien tiene las manos en la masa. Lo que no se entiende, o un
 * cero, devuelve null y el temporizador se queda como estaba.
 */
export function typedMinutes(text: string): number | null {
  const typed = text.trim().toLowerCase().replace(/\s+/g, "");

  const clock = /^(\d+):(\d{1,2})$/.exec(typed);
  const hours = /^(\d+)h(?:oras?)?(?:(\d+)(?:m|min|minutos?)?)?$/.exec(typed);
  const minutes = /^(\d+)(?:m|min|minutos?)?$/.exec(typed);

  const total =
    clock !== null
      ? Number(clock[1]) * 60 + Number(clock[2])
      : hours !== null
        ? Number(hours[1]) * 60 + Number(hours[2] ?? 0)
        : minutes !== null
          ? Number(minutes[1])
          : null;

  return total === null || total === 0 ? null : total;
}
