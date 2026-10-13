/** Manifiesto web (nombre, colores e íconos al añadir el sitio a la pantalla de inicio). */
import type { APIRoute } from 'astro';

import { site } from '../data/site';

export const GET: APIRoute = () => {
  const manifest = {
    name: site.name,
    short_name: 'Coso',
    description: site.description,
    lang: site.locale,
    start_url: '/',
    display: 'browser',
    theme_color: site.themeColor,
    background_color: site.backgroundColor,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
};
