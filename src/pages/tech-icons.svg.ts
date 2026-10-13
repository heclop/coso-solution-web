/**
 * Sprite SVG con los logotipos de tecnologías (un <symbol> por logo), generado en el build
 * desde src/data/tech-icons.ts. Se usa con <svg><use href="/tech-icons.svg#clave" /></svg>:
 * los trazados no engordan el HTML y el archivo queda en caché del navegador.
 */
import type { APIRoute } from 'astro';

import { techIcons } from '../data/tech-icons';

export const GET: APIRoute = () => {
  const symbols = Object.entries(techIcons)
    .map(
      ([key, icon]) =>
        `<symbol id="${key}" viewBox="${icon.viewBox}">${icon.paths
          .map((d) => `<path d="${d}"/>`)
          .join('')}</symbol>`,
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } });
};
