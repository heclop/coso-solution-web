/**
 * Datos estructurados (JSON-LD, schema.org) de la home: Organization + WebSite +
 * ProfessionalService con los servicios como ofertas.
 *
 * Regla: cualquier campo que siga siendo placeholder se OMITE (mejor ausente que falso).
 * Validar el resultado con https://search.google.com/test/rich-results
 */
import { isPlaceholder } from './placeholders';

export interface JsonLdInput {
  /** URL absoluta del sitio, sin barra final. */
  url: string;
  name: string;
  description: string;
  language: string;
  logoUrl: string;
  imageUrl: string;
  email: string;
  /** Teléfono en formato internacional (+…); se omite si es placeholder. */
  telephone: string;
  city: string;
  country: string;
  sameAs: string[];
  services: { name: string; description: string }[];
}

type JsonObject = Record<string, unknown>;

/** Devuelve el valor solo si es un texto real (no vacío ni placeholder). */
const real = (value: string): string | undefined =>
  value.trim() !== '' && !isPlaceholder(value) ? value.trim() : undefined;

/** Elimina las claves con valor undefined o arrays vacíos. */
function compact(object: JsonObject): JsonObject {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) => value !== undefined && !(Array.isArray(value) && value.length === 0),
    ),
  );
}

export function buildJsonLd(input: JsonLdInput): JsonObject {
  const orgId = `${input.url}/#organization`;
  const email = real(input.email);
  const telephone = real(input.telephone);
  const city = real(input.city);
  const country = real(input.country);
  const sameAs = input.sameAs.filter((link) => real(link) !== undefined);

  const address =
    city || country
      ? compact({ '@type': 'PostalAddress', addressLocality: city, addressCountry: country })
      : undefined;

  const organization = compact({
    '@type': 'Organization',
    '@id': orgId,
    name: input.name,
    url: `${input.url}/`,
    logo: input.logoUrl,
    email,
    telephone,
    sameAs,
  });

  const website = {
    '@type': 'WebSite',
    '@id': `${input.url}/#website`,
    url: `${input.url}/`,
    name: input.name,
    inLanguage: input.language,
    publisher: { '@id': orgId },
  };

  const service = compact({
    '@type': 'ProfessionalService',
    '@id': `${input.url}/#service`,
    name: input.name,
    description: input.description,
    url: `${input.url}/`,
    image: input.imageUrl,
    logo: input.logoUrl,
    email,
    telephone,
    address,
    areaServed: city ?? country,
    parentOrganization: { '@id': orgId },
    makesOffer: input.services.map((item) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: item.name, description: item.description },
    })),
  });

  return { '@context': 'https://schema.org', '@graph': [organization, website, service] };
}

/** Serializa para un <script type="application/ld+json"> sin permitir cerrar la etiqueta. */
export function serializeJsonLd(data: JsonObject): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
