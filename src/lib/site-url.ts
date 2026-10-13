/**
 * Decide la URL pública del sitio.
 * Prioridad: SITE_URL (dominio definitivo) > CF_PAGES_URL (preview de Cloudflare Pages) > valor por defecto.
 * Siempre devuelve la URL sin barra final.
 */
export function resolveSiteUrl(env: Record<string, string | undefined>, fallback: string): string {
  const candidate = [env['SITE_URL'], env['CF_PAGES_URL'], fallback].find(
    (value) => value !== undefined && value.trim() !== '',
  );
  if (candidate === undefined) throw new Error('No hay URL de sitio definida');

  const url = new URL(candidate.trim());
  return url.origin + url.pathname.replace(/\/+$/, '');
}
