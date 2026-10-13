import { describe, expect, it } from 'vitest';

import { mailtoUrl, whatsappUrl } from './whatsapp';

describe('whatsappUrl', () => {
  it('limpia el número y añade el mensaje codificado', () => {
    expect(whatsappUrl('+1 555 010-0000', 'Hola, quiero contar mi caso')).toBe(
      'https://wa.me/15550100000?text=Hola%2C+quiero+contar+mi+caso',
    );
  });

  it('omite el mensaje vacío', () => {
    expect(whatsappUrl('15550100000', '   ')).toBe('https://wa.me/15550100000');
  });

  it('rechaza números demasiado cortos', () => {
    expect(() => whatsappUrl('123')).toThrow();
  });
});

describe('mailtoUrl', () => {
  it('codifica espacios como %20', () => {
    expect(mailtoUrl('a@b.example', 'Mi caso', 'Hola equipo')).toBe(
      'mailto:a@b.example?subject=Mi%20caso&body=Hola%20equipo',
    );
  });

  it('sin parámetros devuelve el mailto simple', () => {
    expect(mailtoUrl('a@b.example')).toBe('mailto:a@b.example');
  });
});
