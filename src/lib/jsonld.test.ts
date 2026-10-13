import { describe, expect, it } from 'vitest';

import { buildJsonLd, serializeJsonLd, type JsonLdInput } from './jsonld';

const base: JsonLdInput = {
  url: 'https://coso.example.com',
  name: 'Coso Solution',
  description: 'Software a medida.',
  language: 'es',
  logoUrl: 'https://coso.example.com/icon-512.png',
  imageUrl: 'https://coso.example.com/og-image.jpg',
  email: 'hola@cososolution.com',
  telephone: '+507 6123 4567',
  city: 'Ciudad de Panamá',
  country: 'PA',
  sameAs: ['https://www.linkedin.com/company/coso'],
  services: [{ name: 'APIs', description: 'Integraciones.' }],
};

type Node = Record<string, unknown>;
const graph = (input: JsonLdInput) => buildJsonLd(input)['@graph'] as Node[];

describe('buildJsonLd', () => {
  it('genera Organization, WebSite y ProfessionalService enlazados', () => {
    const [org, website, service] = graph(base);
    expect(org?.['@type']).toBe('Organization');
    expect(website?.['publisher']).toEqual({ '@id': 'https://coso.example.com/#organization' });
    expect(service?.['@type']).toBe('ProfessionalService');
    expect(service?.['address']).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Ciudad de Panamá',
      addressCountry: 'PA',
    });
    expect(service?.['makesOffer']).toEqual([
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'APIs', description: 'Integraciones.' },
      },
    ]);
  });

  it('omite los campos que siguen siendo placeholders', () => {
    const [org, , service] = graph({
      ...base,
      email: 'contacto@cososolution.example',
      telephone: '+1 555 010 0000',
      city: '[CIUDAD POR CONFIRMAR]',
      country: '[PAÍS POR CONFIRMAR]',
      sameAs: [],
    });
    for (const key of ['email', 'telephone', 'sameAs']) expect(org).not.toHaveProperty(key);
    for (const key of ['email', 'telephone', 'address', 'areaServed'])
      expect(service).not.toHaveProperty(key);
  });
});

describe('serializeJsonLd', () => {
  it('escapa "<" para que nadie pueda cerrar el <script>', () => {
    expect(serializeJsonLd({ a: '</script>' })).toBe('{"a":"\\u003c/script>"}');
  });
});
