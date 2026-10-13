/**
 * Ruta canónica sin extensión ni barra final (trailingSlash: 'never').
 * Con build.format: 'file', Astro.url.pathname llega como "/index.html" o "/privacidad.html"
 * durante el build: aquí se normaliza a "/" y "/privacidad", igual que en el sitemap.
 */
export function canonicalPath(pathname: string): string {
  const clean = pathname
    .replace(/\.html$/, '')
    .replace(/\/index$/, '/')
    .replace(/\/+$/, '');
  return clean === '' ? '/' : clean;
}
