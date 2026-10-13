import { describe, expect, it } from 'vitest';

import { findPlaceholders, isPlaceholder } from './placeholders';

describe('isPlaceholder', () => {
  it.each([
    '[CIUDAD POR CONFIRMAR]',
    'Desarrollo · [CIUDAD POR CONFIRMAR]',
    'contacto@cososolution.example',
    '15550100000',
    '+1 555 010 0000',
  ])('detecta «%s»', (value) => {
    expect(isPlaceholder(value)).toBe(true);
  });

  it.each(['Coso Solution', 'contacto@cososolution.com', 'API [v2]', '+507 6123 4567'])(
    'no marca «%s»',
    (value) => {
      expect(isPlaceholder(value)).toBe(false);
    },
  );
});

describe('findPlaceholders', () => {
  it('devuelve la ruta de cada placeholder en objetos anidados', () => {
    const data = {
      site: { name: 'Coso', city: '[CIUDAD POR CONFIRMAR]' },
      faq: [{ answer: 'ok' }, { answer: 'Se acuerda. [SOPORTE POR CONFIRMAR]' }],
      count: 3,
    };
    expect(findPlaceholders(data)).toEqual([
      { path: 'site.city', value: '[CIUDAD POR CONFIRMAR]' },
      { path: 'faq[1].answer', value: 'Se acuerda. [SOPORTE POR CONFIRMAR]' },
    ]);
  });

  it('devuelve un array vacío si no hay placeholders', () => {
    expect(findPlaceholders({ a: 'texto', b: [1, null, true] })).toEqual([]);
  });
});
