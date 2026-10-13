import { describe, expect, it } from 'vitest';

import { keystrokeDelays, typingDuration } from './typing';

const fixed = () => 0.5; // variación neutra: cada tecla dura exactamente `base`

describe('keystrokeDelays', () => {
  it('devuelve un retardo por carácter y el primero es 0', () => {
    const delays = keystrokeDelays('Hola', 40, fixed);
    expect(delays).toEqual([0, 40, 40, 40]);
  });

  it('hace una pausa mayor tras un espacio y tras la puntuación', () => {
    const [, , afterSpace] = keystrokeDelays('a b', 40, fixed);
    expect(afterSpace).toBe(64); // 40 + 40 × 0.6
    const [, afterDot] = keystrokeDelays('.x', 40, fixed);
    expect(afterDot).toBe(200); // 40 + 40 × 4
  });

  it('mantiene la variación dentro de ±40 %', () => {
    expect(keystrokeDelays('ab', 50, () => 0)[1]).toBe(30);
    expect(keystrokeDelays('ab', 50, () => 0.999999)[1]).toBe(70);
  });

  it('cuenta caracteres Unicode completos', () => {
    expect(keystrokeDelays('código', 10, fixed)).toHaveLength(6);
  });

  it('texto vacío → array vacío', () => {
    expect(keystrokeDelays('', 40)).toEqual([]);
  });
});

describe('typingDuration', () => {
  it('suma los retardos con variación neutra', () => {
    expect(typingDuration('Hola', 40)).toBe(120);
  });
});
