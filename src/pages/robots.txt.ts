/**
 * robots.txt como endpoint: un archivo .ts en src/pages/ que exporta GET genera un archivo
 * estático en el build (aquí, dist/robots.txt). Así la URL del sitemap sale de Astro.site
 * y es correcta en local, en el preview de Cloudflare y en el dominio definitivo.
 *
 * Se permite rastrear siempre: los previews se protegen con <meta name="robots" content="noindex">,
 * que Google solo puede leer si puede rastrear la página.
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;
  const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemap}`, ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
