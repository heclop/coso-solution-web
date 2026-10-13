/** Enlaces de navegación. Los href son anclas de la home (sin barra final). */
export interface NavLink {
  label: string;
  href: string;
}

export const mainNav: NavLink[] = [
  { label: 'Servicios', href: '/#servicios' },
  { label: 'IA y automatización', href: '/#ia' },
  { label: 'Cómo trabajamos', href: '/#proceso' },
  { label: 'Preguntas frecuentes', href: '/#preguntas' },
];

export const primaryCta: NavLink = { label: 'Cuéntanos tu proyecto', href: '/#contacto' };

export const legalNav: NavLink[] = [
  { label: 'Privacidad', href: '/privacidad' },
  { label: 'Términos', href: '/terminos' },
];
