import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import type { AstroIntegration } from 'astro';
import { defineConfig, envField, fontProviders } from 'astro/config';
import { readFileSync } from 'node:fs';

import { contact } from './src/data/contact';
import * as home from './src/data/home';
import { site } from './src/data/site';
import { findPlaceholders, isPlaceholder } from './src/lib/placeholders';
import { resolveSiteUrl } from './src/lib/site-url';

/** Líneas con placeholders en las páginas Markdown (legales). */
function markdownPlaceholders(files: string[]) {
  return files.flatMap((file) =>
    readFileSync(new URL(file, import.meta.url), 'utf8')
      .split('\n')
      .flatMap((line, index) =>
        isPlaceholder(line) ? [{ path: `${file}:${index + 1}`, value: line.trim() }] : [],
      ),
  );
}

/** Al arrancar `npm run dev`, lista en la terminal el contenido provisional pendiente de sustituir. */
const placeholderReport: AstroIntegration = {
  name: 'placeholder-report',
  hooks: {
    'astro:server:start': ({ logger }) => {
      const hits = [
        ...findPlaceholders({ site, contact, home }),
        ...markdownPlaceholders(['./src/pages/privacidad.md', './src/pages/terminos.md']),
      ];
      if (hits.length === 0) return logger.info('Sin placeholders pendientes ✔');
      logger.warn(`${hits.length} placeholders pendientes de sustituir:`);
      for (const { path, value } of hits) logger.warn(`  ${path}: ${value}`);
    },
  },
};

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // SITE_URL > CF_PAGES_URL (preview de Cloudflare) > site.url (localhost)
  site: resolveSiteUrl(process.env, site.url),
  env: {
    schema: {
      SITE_INDEXABLE: envField.boolean({ context: 'server', access: 'public', default: false }),
    },
  },
  output: 'static',
  scopedStyleStrategy: 'class',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "manifest-src 'self'",
        'upgrade-insecure-requests',
      ],
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
    },
  },
  markdown: { syntaxHighlight: false },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404') }), placeholderReport],
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Schibsted Grotesk',
      cssVariable: '--font-schibsted',
      weights: ['400 800'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains',
      weights: ['400 800'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'Consolas', 'monospace'],
    },
  ],
  vite: { plugins: [tailwindcss()] },
});
