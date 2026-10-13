import { describe, expect, it } from 'vitest';

import {
  buildContactMessage,
  contactHref,
  parseContactForm,
  validateContact,
  type ContactFormData,
} from './contact-form';

const valid: ContactFormData = {
  nombre: 'Ana Pérez',
  empresa: 'Distribuidora Norte',
  correo: 'ana@norte.example',
  telefono: '',
  mensaje: 'Registramos los pedidos a mano en dos sistemas.',
  canal: 'correo',
};

const contact = { email: 'contacto@coso.example', whatsapp: '15550100000' };

describe('parseContactForm', () => {
  it('lee y recorta los campos', () => {
    const form = new FormData();
    form.set('nombre', '  Ana  ');
    form.set('correo', 'ana@norte.example ');
    form.set('mensaje', 'Hola');
    form.set('canal', 'whatsapp');
    expect(parseContactForm(form)).toEqual({
      nombre: 'Ana',
      empresa: '',
      correo: 'ana@norte.example',
      telefono: '',
      mensaje: 'Hola',
      canal: 'whatsapp',
    });
  });

  it('usa «correo» si el canal no es válido', () => {
    const form = new FormData();
    form.set('canal', 'paloma');
    expect(parseContactForm(form).canal).toBe('correo');
  });
});

describe('validateContact', () => {
  it('acepta un formulario completo', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('marca nombre, correo y mensaje inválidos', () => {
    const errors = validateContact({ ...valid, nombre: 'A', correo: 'ana@', mensaje: 'corto' });
    expect(Object.keys(errors).sort()).toEqual(['correo', 'mensaje', 'nombre']);
  });

  it('exige teléfono solo si el canal es llamada', () => {
    expect(validateContact({ ...valid, canal: 'llamada' }).telefono).toBeDefined();
    expect(validateContact({ ...valid, canal: 'llamada', telefono: '+507 6123-4567' })).toEqual({});
    expect(validateContact({ ...valid, canal: 'whatsapp' })).toEqual({});
  });
});

describe('buildContactMessage', () => {
  it('incluye empresa, correo y canal', () => {
    expect(buildContactMessage(valid)).toBe(
      [
        'Hola, soy Ana Pérez, de Distribuidora Norte.',
        '',
        'Registramos los pedidos a mano en dos sistemas.',
        '',
        'Correo: ana@norte.example',
        'Prefiero que me contacten por correo.',
      ].join('\n'),
    );
  });

  it('añade el teléfono cuando existe y omite la empresa vacía', () => {
    const message = buildContactMessage({ ...valid, empresa: '', telefono: '6123 4567' });
    expect(message).toContain('Hola, soy Ana Pérez.');
    expect(message).toContain('Teléfono: 6123 4567');
  });
});

describe('contactHref', () => {
  it('WhatsApp → wa.me con el mensaje', () => {
    const href = contactHref({ ...valid, canal: 'whatsapp' }, contact);
    expect(href.startsWith('https://wa.me/15550100000?text=')).toBe(true);
    expect(decodeURIComponent(href.replace(/\+/g, ' '))).toContain('Ana Pérez');
  });

  it('correo y llamada → mailto con asunto', () => {
    for (const canal of ['correo', 'llamada'] as const) {
      const href = contactHref({ ...valid, canal, telefono: '61234567' }, contact);
      expect(href.startsWith('mailto:contacto@coso.example?subject=')).toBe(true);
      expect(decodeURIComponent(href)).toContain('Nuevo caso: Ana Pérez (Distribuidora Norte)');
    }
  });
});
