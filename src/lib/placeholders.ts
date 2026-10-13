/**
 * Detección de contenido provisional (placeholders) en los datos del sitio.
 * Formatos reconocidos:
 *  - Texto entre corchetes en mayúsculas: [CIUDAD POR CONFIRMAR]
 *  - Dominios de ejemplo: contacto@cososolution.example
 *  - El número ficticio de maquetación: 555 010 0000 / 15550100000
 */
const PATTERNS: RegExp[] = [/\[[A-ZÁÉÍÓÚÑ0-9 ,./-]{3,}\]/, /\.example\b/, /555[\s-]?010[\s-]?0000/];

export function isPlaceholder(value: string): boolean {
  return PATTERNS.some((pattern) => pattern.test(value));
}

export interface PlaceholderHit {
  path: string;
  value: string;
}

/** Recorre objetos y arrays y devuelve cada string que contiene un placeholder, con su ruta. */
export function findPlaceholders(value: unknown, path = ''): PlaceholderHit[] {
  if (typeof value === 'string') {
    return isPlaceholder(value) ? [{ path, value }] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => findPlaceholders(item, `${path}[${index}]`));
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) =>
      findPlaceholders(item, path ? `${path}.${key}` : key),
    );
  }
  return [];
}
