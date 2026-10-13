import { describe, expect, it } from 'vitest';

import { canonicalPath } from './links';

describe('canonicalPath', () => {
  it.each([
    ['/', '/'],
    ['/index.html', '/'],
    ['/index', '/'],
    ['/privacidad.html', '/privacidad'],
    ['/privacidad', '/privacidad'],
    ['/privacidad/', '/privacidad'],
    ['/blog/index.html', '/blog'],
  ])('%s → %s', (input, expected) => {
    expect(canonicalPath(input)).toBe(expected);
  });
});
