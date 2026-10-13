/**
 * Ritmo de un efecto de escritura "humano": cada tecla tarda alrededor de `base` ms,
 * con variación aleatoria, una pausa algo mayor tras un espacio y una pausa clara tras
 * un signo de puntuación.
 *
 * Devuelve, para cada carácter, la espera (ms) ANTES de mostrarlo. El primero es 0:
 * la pausa antes de empezar una línea la decide quien llama.
 */
export function keystrokeDelays(
  text: string,
  base: number,
  random: () => number = Math.random,
): number[] {
  const chars = [...text]; // [...] respeta caracteres Unicode compuestos
  return chars.map((_, index) => {
    if (index === 0) return 0;
    const previous = chars[index - 1] ?? '';
    let delay = base * (0.6 + random() * 0.8); // ±40 %
    if (/[.,;:!?…]/.test(previous)) delay += base * 4;
    else if (previous === ' ') delay += base * 0.6;
    return Math.round(delay);
  });
}

/** Duración total aproximada de escribir `text` (útil para coordinar otras animaciones). */
export function typingDuration(text: string, base: number): number {
  return keystrokeDelays(text, base, () => 0.5).reduce((sum, delay) => sum + delay, 0);
}
