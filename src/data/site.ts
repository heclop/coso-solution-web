/** Datos generales del sitio. Los valores con [...] o .example son placeholders. */
export interface SiteData {
  name: string;
  /** URL por defecto (local). En Cloudflare se sustituye por SITE_URL o CF_PAGES_URL. */
  url: string;
  locale: string;
  ogLocale: string;
  title: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  city: string;
  /** País (ISO 3166-1 alfa-2) para el JSON-LD. Vacío o placeholder = se omite. */
  country: string;
  /** Imagen para compartir en redes (1200×630), en public/. */
  ogImage: string;
  ogImageAlt: string;
  /** Perfiles oficiales (LinkedIn, Instagram…). Solo los que existan y se mantengan. */
  sameAs: string[];
}

export const site: SiteData = {
  name: 'Coso Solution',
  url: 'http://localhost:4321',
  locale: 'es',
  ogLocale: 'es_ES',
  // ~60 caracteres (Google recorta los más largos)
  title: 'Coso Solution | Desarrollo de software y soluciones tecnológicas',
  // ≤ 155 caracteres
  description:
    'Desarrollamos aplicaciones web, APIs e integraciones, optimizamos bases de datos y ayudamos a automatizar procesos con IA cuando aporta valor.',
  themeColor: '#0B1B33',
  backgroundColor: '#FFFFFF',
  city: '[CIUDAD POR CONFIRMAR]',
  country: '[PAÍS POR CONFIRMAR]',
  ogImage: '/og-image.jpg',
  ogImageAlt: 'Coso Solution — Desarrollo de software e integración de sistemas.',
  sameAs: [],
};
