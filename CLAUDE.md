# Coso Solution — Landing (Astro 7 + Tailwind 4 + TypeScript 6)

Guía viva del proyecto. Especificación completa en `PROMPT-landing-coso-solutions.md` (stack/fases) y
`prompt_coso_solution_landing_contenido.md` (contenido). Responder en español. Trabajar **por fases** y
esperar el OK del desarrollador al terminar cada una. El desarrollador es backend (NestJS) y no conoce Astro:
explicar cada concepto nuevo de Astro la primera vez.

## Estado de las fases

| #   | Fase                                                                                                    | Estado               |
| --- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| 1   | Análisis de la referencia                                                                               | ✅ hecho (ver abajo) |
| 2   | Base: Astro + TS strictest + Tailwind `@theme` + fuentes + ESLint/Prettier + `BaseLayout` + `SEO.astro` | ✅ hecho             |
| 3   | UI y datos: componentes `ui/`, `data/*.ts`, optimización de imágenes, reporte de placeholders           | ✅ hecho             |
| 4   | Secciones (comparar con la referencia a 1440 y 390 px)                                                  | ✅ hecho             |
| 5   | Interactividad + efectos (formulario, animaciones, header al hacer scroll, tests)                       | ✅ hecho             |
| 6   | SEO técnico (JSON-LD, robots, manifest, íconos, OG, 404, legales)                                       | ✅ hecho             |
| 7   | Auditoría (Lighthouse, axe, e2e, `npm audit`)                                                           | ✅ hecho             |
| 8   | Entrega (Cloudflare Pages, `_headers`, README, LANZAMIENTO.md)                                          | ⏳ siguiente         |
| 9   | Contenido real (sustituir placeholders)                                                                 | —                    |

## Referencia de diseño

Lienzo de Claude Design: https://claude.ai/artifact/NmvKEQsiY7AavpGJWAqfXw (artboard `Main.dc.html`, 1440 px, fluido).
Manda cómo se ve renderizado. Dirección creativa: editorial, sobria, nada de patrones de "web hecha con IA"
(degradados azul-morado, glassmorphism, tarjetas clonadas, cerebros/robots, métricas inventadas).

### Inventario de secciones (orden)

1. **Header** — logo, nav (Servicios, IA y automatización, Cómo trabajamos, Preguntas frecuentes), CTA «Cuéntanos tu proyecto».
2. **Hero** `#inicio` — `<h1>` con etiqueta «Desarrollo de software a medida · [ciudad]» + titular
   «Primero entendemos el proceso. / Después escribimos el código.»; CTA primaria + enlace «Ver qué hacemos»;
   a la derecha diagrama _antes/después_ de un pedido (ilustrativo).
3. **Situaciones** — 4 frases de cliente numeradas (lista editorial, sin tarjetas), fondo `paper`.
4. **Servicios** `#servicios` — tabla editorial de 4 filas (Backend, Frontend, Datos, Consultoría):
   nombre · descripción · trabajos típicos. Fila Frontend usará `diseño-pagina-web.png` (pedido del desarrollador).
   Ampliada a 6 filas (pedido del desarrollador): 05 SEO técnico (con nota: no garantiza posiciones; no
   publicar puntuaciones de Lighthouse hasta medir el sitio real) y 06 Automatización de procesos
   (enlace a `#automatizacion`).
   4b. **Stack** — banda de tecnologías por grupo (Backend, Frontend, Bases de datos, Nube, Automatización):
   logos monocromos que toman color de marca al pasar el ratón; estática (sin carrusel, WCAG 2.2.2).
5. **Detalle datos** — foto + panel oscuro con fragmento SQL (índice).
6. **IA aplicada** `#ia` — sección oscura: texto + checklist de evaluación + traza de un agente (ilustrativa)
   y bloque `#automatizacion` (n8n: texto + diagrama disparador → n8n → 3 salidas, animado con `[data-flow]`).
7. **Proceso** `#proceso` — 5 pasos en línea con regla superior + foto de reunión.
8. **Enfoque** — foto panorámica + 4 principios (grid 2×2, sin iconos).
9. **FAQ** `#preguntas` — 6 preguntas con `<details>`.
10. **Contacto** `#contacto` — titular + canales alternativos + formulario (nombre, empresa opcional,
    correo, mensaje, canal preferido en pills/radios).
11. **Footer** — ícono, resumen, enlaces, contacto, legales.

### Tokens

- Colores en `src/styles/global.css` (`@theme`): `ink #0B1B33`, `ink-deep #06111F`, `ink-line #22344F`,
  `brand #1F5FE0`, `sky #5CC4F7` (solo sobre oscuro), `body #33465F`, `muted #4F6683`, `paper #F3F5F8`,
  `line #D6DCE5`, `line-strong #C9D2DE`, `field #9AA9BD`, `mist #B6C3D6`, `mist-strong #DCE5F2`,
  `amber #F2B36B`, `rust #9A4A12`.
- Tipografías: **Schibsted Grotesk** 400–800 (variable, `font-sans`) y **JetBrains Mono** 400–800 (`font-mono`),
  self-hosted vía API de fuentes de Astro (proveedor Fontsource) con fallbacks métricos.
- Escala: titular hero `clamp(40px,5.6vw,76px)`, H2 grandes `clamp(34px,4vw,56px)`, H2 medianos
  `clamp(30px,3.2vw,42px)`, cuerpo 17px/1.6, etiquetas mono 12–13px con `tracking 0.06em`.
- Contenedor 1200px + gutter `clamp(16px,4vw,48px)` (utilidad `wrap`). Radio 4px (`rounded-ui`).
- Ritmo vertical de sección: `clamp(64px,8vw,112px)` a `clamp(72px,9vw,128px)`.

### Breakpoints

La referencia es fluida (flex-wrap + `clamp`). Único corte explícito: nav visible desde **1024px** (antes 861; con los rótulos del texto revisado la nav necesita ~985 px; el mismo valor está en `MobileMenu.astro`)
(`nav:` en Tailwind). Resto mobile-first con `sm/md/lg` de Tailwind donde haga falta.

### Bugs / desviaciones de la referencia (corregir en implementación)

- Los enlaces de contacto apuntan a `#contacto` → usar `mailto:` y `https://wa.me/…` reales.
- El enlace «Privacidad» lleva `id="privacidad"` en el footer → páginas `/privacidad` y `/terminos`.
- En móvil la nav desaparece sin alternativa → añadir menú móvil (fuera del `<header>`).
- Texto `#4F6683` sobre `#F3F5F8`: 5.2:1 OK; mantener `muted` como mínimo para texto secundario sobre `paper`.
- Primer `<details>` abierto por defecto: se mantiene.

### Movimiento (revisado 2026-10-11 según el brief de animaciones)

Solo `transform`/`opacity` (excepción: `stroke-dashoffset` en trazos SVG cortos del diagrama), dentro de
`prefers-reduced-motion: no-preference`. Sin JS (`@media (scripting: enabled)`) nada se oculta.

- **Revelado una sola vez**: `[data-reveal]` (bloque) y `[data-reveal-group]` (hijos escalonados 90 ms,
  un solo disparador) con el único `IntersectionObserver` de `BaseLayout.astro` (`.is-in` + unobserve).
  Ya no se usa `view()` para revelar: al ser ligado al scroll se repetía al subir.
- El mismo observer dispara lo que va por tiempo: diagrama antes/después (`[data-diagram]`), traza de IA
  (`[data-trace]`), flujo n8n (`[data-flow]`), arquitectura (`[data-arch]`), línea `[data-draw]`.
- **Ligado al scroll** (solo lo que debe seguir al scroll): barra de lectura del header (`scroll(root)`),
  barra del proceso (`view()`), parallax del hero en dos planos (foto + retícula, solo ≥ 768 px) y
  parallax de la foto de Datos (`[data-parallax]`, solo ≥ 768 px). El resto de fotos, fijas.
- **Hero**: escritura (~2.5 s, antes ~4.5 s), retícula técnica `blueprint` que se mueve a otra
  profundidad con el puntero y el scroll (nunca sola), zoom de entrada de la foto, fundido de texto/CTA.
- **Arquitectura** (`ArchitectureDiagram.astro`, en «Cómo pensamos un proyecto», sustituye la foto
  panorámica): SVG generado en el build, 2 maquetaciones (horizontal ≥ 768 px / vertical), nodos en
  secuencia, conexiones que se dibujan y pulso 3 veces. Marcado «ilustrativo».
- **Continuidad**: la retícula `blueprint` se repite (estática) en la sección de IA; no hay separadores.
- **Navegación**: sección activa con `aria-current` (IntersectionObserver en franja central, desktop y
  menú móvil); menú móvil con transición de entrada y de salida (`data-closing`); «Saltar al contenido».
- **Microinteracciones**: botones `:active` scale .97, subrayado/flecha en enlaces, logos del stack.
- Nada se repite indefinidamente (WCAG 2.2.2): pulsos y parpadeos ≤ 4 ciclos.

### Formulario de contacto

`src/lib/contact-form.ts` (parse, validación, mensaje, enlace; con tests) + script en `Contact.astro`.
Validación propia (`noValidate`) con errores en `<p id="…-error">` enlazados por `aria-describedby`,
`aria-invalid` y foco en el primer error. Canal WhatsApp → `wa.me` en pestaña nueva; correo/llamada →
`mailto:` (llamada muestra y exige «Teléfono»). Confirmación `role="status"`. Sin JS: `<noscript>` con
canales directos. Si se añade backend (p. ej. Pages Function), solo cambia `contactHref`.

## Auditoría (Fase 7, 2026-10-10)

Medido sobre `npm run build` con `SITE_INDEXABLE=true` + `astro preview` (nunca en dev).

- Lighthouse 12 (3 pasadas): móvil **98 / 100 / 100 / 100**, escritorio **100 ×4**. LCP 1.9 s móvil /
  0.5 s escritorio (la imagen del hero), CLS **0**, TBT 0 ms. El Speed Index móvil oscila entre 1 y 3.8 s:
  mide el fin del cambio visual y el titular se escribe durante ~4–5 s (coste asumido del efecto).
- axe-core 4 (wcag2a/aa, 21a/aa, 22aa, best-practice): **0 violaciones** a 390 y 1440 px en home
  (movimiento normal y reducido), menú abierto, formulario con errores y enviado, legales y 404.
- Sin scroll horizontal de 320 a 1920 px. Un `<h1>` por página, sin saltos de encabezado, todas las
  imágenes con `width`/`height` y `alt`, enlaces internos 200, consola y CSP sin errores.
- JS enviado: ≈ 4 KB gzip (1.1 KB archivo + 2.9 KB módulos inline). HTML de la home ≈ 25 KB gzip.
- `npm audit --omit=dev`: 0. `npm audit` completo: 5 «high» en `eslint-plugin-astro` → `braces` (solo desarrollo).
- Correcciones de la fase: logo en 1x/2x, calidad AVIF 55 en el hero (va bajo una capa al 90 %),
  primera lectura de `scrollY` del header en rAF (reflow forzado), espacios colapsados entre nodos en el
  efecto de escritura y cursor de alto 0 (ambos causaban CLS), enlaces dentro de texto subrayados
  (`link-in-text-block`), `sizes` de la foto de Datos.
- Scripts de auditoría (puppeteer-core, lighthouse, axe-core) fuera del repo, como pide la especificación.

## Contenido revisado (2026-10-12)

`CONTENIDO.md` es el texto revisado por el desarrollador (fuente del contenido de `src/data/home.ts`), con la
lista de pendientes antes de publicar. Criterios que impone: nada de promesas o métricas sin verificar, ejemplos
marcados como ilustrativos, y la confirmación del formulario «Recibimos tu consulta» SOLO con un envío real
(con el `mailto:`/`wa.me` actual se mantiene «Tu mensaje está preparado»).

## Datos de maquetación (genéricos, sustituir en Fase 9)

- Dominio: el definitivo existe pero aún no se usa. `site.url` = `http://localhost:4321`; en Cloudflare
  Pages se toma `CF_PAGES_URL` (preview `*.pages.dev`). `SITE_INDEXABLE=false` hasta el lanzamiento.
- Correo `contacto@cososolution.example`, WhatsApp `15550100000` (+1 555 010 0000, número ficticio reservado).
- Pendiente: ciudad/país, horario, redes, logo en SVG.

## Decisiones

- TypeScript fijado a `~6.0` (`@astrojs/check` aún no admite TS 7).
- `markdown.syntaxHighlight: false`: Shiki usa estilos inline incompatibles con la CSP; no hay bloques de código en Markdown.
- Imágenes originales en `img-example/` (no se tocan); copias reducidas en `img-optimizadas/`.
  No se usan: `hero-desarrollador-referencia` (persona mirando código, va contra la dirección creativa) ni
  `codigo-pantalla` (muestra el nombre de una persona real).

- Hero (pedido del desarrollador): portada a todo el ancho con `diseno-pagina-web.jpg`, capa de degradado de marca (vertical en móvil, horizontal ≥ 1024 px; ≥ 0.9 de opacidad bajo el texto → contraste AA) y el texto encima. Movimiento solo con transform: zoom de entrada, parallax con `animation-timeline: scroll()` y seguimiento leve del puntero (JS, solo `pointer: fine`); nada en bucle (WCAG 2.2.2). El diagrama antes/después pasó a una franja «En la práctica» bajo la portada.
  Desviación del boceto, donde el titular compartía columna con el diagrama y se partía en 6 líneas.
- Header de altura fija: encogerlo al hacer scroll movería el contenido (CLS). Al bajar solo gana sombra (`data-scrolled`, Fase 5).
- Contenido en `src/data/home.ts` (+ `site.ts`, `contact.ts`, `navigation.ts`). Las imágenes se referencian
  por clave (`ImageKey`) y se resuelven en `src/assets/images/index.ts`, para que `astro.config.ts` pueda
  importar los datos (reporte de placeholders) sin importar archivos .jpg.
- Imágenes: `node scripts/optimize-images.mjs` regenera `src/assets/images` y `src/assets/brand` desde `img-example/`
  (logo con fondo transparente por color-to-alpha; ícono con esquinas redondeadas transparentes).
- Hooks de animación ya puestos en el marcado (Fase 5): `data-reveal`, `.hero-in`/`.hero-line` con `--d`,
  `.diagram-step`, `.flow-dot`, `[data-trace] .trace-step` con `--s`, `[data-process] .process-bar`, `.photo-frame`.

- Texto del hero con estilo de código (JetBrains Mono 400–800, números de línea, `//` y `/* */`
  decorativos con `aria-hidden`). El `<h1>` lleva el texto real en `.sr-only` y la versión visual es
  `aria-hidden`. Efecto de escritura: `src/lib/typing.ts` (ritmo, con test) + script del Hero que divide
  en `.tw-char` (opacity, sin CLS) con un cursor de ancho 0 que parpadea 4 veces y desaparece. Ocultación
  inicial con `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)` + animación de
  seguridad a los 4 s.
- SEO técnico (Fase 6): `src/lib/jsonld.ts` (Organization + WebSite + ProfessionalService con los servicios
  como `makesOffer`; omite placeholders) → `JsonLd.astro` solo en la home. `robots.txt` y `site.webmanifest`
  son endpoints en `src/pages/*.ts`. Íconos y `og-image.jpg` con `node scripts/generate-icons.mjs` → `public/`
  (ICO armado a mano con PNG 16/32/48; sin `favicon.svg` hasta tener logo vectorial). Legales en Markdown
  (`privacidad.md`, `terminos.md`) con `LegalLayout`, textos provisionales marcados para revisión legal.
  404 propia (noindex). El reporte de placeholders de `npm run dev` incluye también los `.md` legales.
- `site.ts`: `country`, `ogImage`, `ogImageAlt`, `sameAs` (vacío hasta que haya redes reales).

- Logos de tecnologías: `src/data/tech-icons.ts` (GENERADO desde Simple Icons 16.34 CC0 y Devicon 2.17 MIT;
  Aurora sin logo libre → ícono genérico de base de datos). Se sirven como sprite `/tech-icons.svg`
  (endpoint `src/pages/tech-icons.svg.ts`) y se usan con `TechLogo.astro` (`<use href>`): incrustados
  subían el HTML de la home de 25 a 44 KB gzip; con sprite queda en ~28 KB y el sprite (15 KB) va a caché.

## Gotchas

- **El minificador (lightningcss, vía Vite) fusiona `animation` + `animation-timeline` en
  `animation: … scroll()`, forma que Chrome descarta ENTERA.** `animation-timeline` y `animation-range`
  van en una regla aparte con selector duplicado (`.x.x { animation-timeline: … }`). Comprobar en el
  navegador con `getComputedStyle(el).animationTimeline`. (Hasta 2026-10-11 el parallax y la barra del
  proceso no funcionaban por esto; no se notaba porque el estado sin animar es visible.)

- Con `build.format: 'file'`, `Astro.url.pathname` llega como `/index.html` / `/privacidad.html` en el
  build: el canonical pasa por `canonicalPath()` (`src/lib/links.ts`, con test).
- `astro preview` no admite dos instancias: si ya hay una, reutilizarla o `astro preview stop`.

- La CSP de Astro **no** calcula hash para `<script is:inline>`: en producción se bloquearía. Usar
  scripts procesados (sin `is:inline`) o resolverlo con CSS (p. ej. la media query `scripting`).

- Capturas de diseño: Chrome headless con `--window-size=390,…` tiene un ancho mínimo (~500 px) y parece
  que desborda. Usar puppeteer con `setViewport` (script de auditoría fuera del repo).
- `extract()` + `trim()` en la misma cadena de sharp falla ("bad extract area"): hacerlo en dos pasos.
- Los `.astro` necesitan `import type { ImageMetadata } from 'astro'` (ESLint marca `no-undef` con el global).

- `exactOptionalPropertyTypes` (strictest): las props opcionales que reciben `undefined` deben tiparse `?: T | undefined`.
- `vitest.config.ts` necesita `/// <reference types="vitest/config" />` para que `astro check` acepte `test`.
- `tseslint.config()` está obsoleto: usar `defineConfig` de `eslint/config`.
- `npm audit` muestra 5 avisos "high" en `eslint-plugin-astro` → `braces` (solo desarrollo).
  `npm audit --omit=dev` está limpio.
- Prettier no debe tocar los `.md` de prompt (están en `.prettierignore`).

- Astro elimina el salto de línea entre un texto y una etiqueta inline (`… a\n<a>` → «aenlace»): usar `{' '}`.
- Para medir opacidades en e2e desactivar `scroll-behavior: smooth`, si no se mide a mitad del desplazamiento.

## Comandos

```bash
npm run dev       # http://localhost:4321
npm run build     # astro check && astro build → dist/
npm run serve     # build + preview (medir siempre aquí, nunca en dev)
npm run lint && npm test && npm run format
```
