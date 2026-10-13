import { describe, expect, it } from 'vitest';

import { resolveSiteUrl } from './site-url';

const fallback = 'http://localhost:4321';

describe('resolveSiteUrl', () => {
  it('usa SITE_URL cuando existe', () => {
    expect(
      resolveSiteUrl(
        { SITE_URL: 'https://cososolution.com', CF_PAGES_URL: 'https://x.pages.dev' },
        fallback,
      ),
    ).toBe('https://cososolution.com');
  });

  it('usa CF_PAGES_URL si no hay SITE_URL', () => {
    expect(resolveSiteUrl({ CF_PAGES_URL: 'https://abc.coso.pages.dev' }, fallback)).toBe(
      'https://abc.coso.pages.dev',
    );
  });

  it('ignora valores vacíos y cae al valor por defecto', () => {
    expect(resolveSiteUrl({ SITE_URL: '  ', CF_PAGES_URL: '' }, fallback)).toBe(fallback);
  });

  it('quita la barra final', () => {
    expect(resolveSiteUrl({ SITE_URL: 'https://cososolution.com/' }, fallback)).toBe(
      'https://cososolution.com',
    );
  });

  it('falla con una URL inválida', () => {
    expect(() => resolveSiteUrl({ SITE_URL: 'no-es-url' }, fallback)).toThrow();
  });
});
