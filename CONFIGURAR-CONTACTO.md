# Configurar el contacto por correo — guía paso a paso

> Estado al 2026-10-12: los DNS de `cososolution.com` están en Cloudflare; ahora el dominio sirve otro
> proyecto (el Worker `studio-flow-front`). Ya hechas: **Email Routing** (Parte A) y el dominio
> **verificado en Resend** (Parte B). Nada de lo que hay aquí afecta al otro proyecto hasta la Parte G.

Objetivo: que quien rellene el formulario de la landing te escriba **a tu correo personal**, sin que esa
dirección aparezca nunca en la web, y tener además un correo público `contacto@cososolution.com`.

Coste: **0 €**. Email Routing es gratis; Turnstile es gratis; las funciones de Cloudflare Pages entran en el
plan gratuito de Workers (100 000 peticiones al día); y el plan gratuito de Resend incluye 3 000 correos al
mes (100 al día), de sobra para un formulario de contacto.

---

## 1. Cómo funciona (la foto completa)

```
 Visitante                    Cloudflare Pages (tu cuenta)                       Resend         Tú
 ─────────                    ────────────────────────────                       ──────         ──
 Rellena el formulario
 y pulsa «Enviar consulta»
        │
        │  POST /api/contacto  (JSON: nombre, correo, mensaje, canal, token anti-spam)
        ▼
 ┌────────────────────────────────────────────────────────────┐
 │ Proyecto Pages «coso-solutions-web» (mismo dominio)        │
 │                                                            │
 │  • /, /privacidad, /og-image.jpg… → archivos estáticos     │
 │    del build de Astro (dist/), como estaba previsto        │
 │                                                            │
 │  • /api/contacto → Pages Function functions/api/contacto.ts│
 │     1. ¿Es POST y JSON? ¿Tamaño razonable?                 │
 │     2. ¿El campo trampa está vacío? (si no, es un robot)   │
 │     3. Valida con validateContact() (el del navegador)     │
 │     4. Pregunta a Turnstile si el token anti-spam es bueno │
 │     5. POST https://api.resend.com/emails ─────────────────────► envía ───────► Tu correo personal
 │     6. Responde { ok: true } o el error                    │                    («Responder» = correo
 └────────────────────────────────────────────────────────────┘                     del visitante)
        │
        ▼
 La web muestra «Recibimos tu consulta»     Alguien escribe a contacto@cososolution.com
                                             └─► Email Routing lo reenvía ─────────────────► Tu correo personal
```

### ¿Qué es «la API»?

Es **un único endpoint**, `POST /api/contacto`. Si vienes de NestJS: un controller con un solo método
`@Post('contacto')` y un servicio que valida y envía un correo. No hay base de datos ni se guarda nada:
recibe, comprueba, te reenvía el mensaje y olvida.

### ¿Dónde vive?

En el **mismo proyecto de Cloudflare Pages** que la web, tal como pedía la especificación:

- Las páginas (HTML, CSS, imágenes) son los archivos de `dist/` que genera `npm run build`. Pages los sirve
  como un hosting estático.
- Los archivos de la carpeta `functions/` del proyecto son **Pages Functions**: código que se ejecuta en los
  servidores de Cloudflare cuando llega una petición a su ruta. `functions/api/contacto.ts` responde en
  `/api/contacto`; la ruta sale del nombre del archivo, igual que las páginas de Astro en `src/pages/`.

Por eso la API está **en el mismo dominio** que la web (`https://cososolution.com/api/contacto`): no hay CORS
que configurar ni un segundo servidor.

### ¿Cómo envía el correo?

Con la **API de Resend**, la misma que ya usabas desde Supabase: una petición HTTPS con tu clave de API.

```
POST https://api.resend.com/emails
Authorization: Bearer <RESEND_API_KEY>

from:     "Formulario Coso Solution <formulario@cososolution.com>"
to:       <CONTACT_TO, tu correo personal>
reply_to: <correo que escribió el visitante>
subject:  "Nueva consulta: Ana Pérez (Distribuidora Norte)"
text:     nombre, empresa, correo, teléfono, canal preferido y mensaje
```

`formulario@cososolution.com` no hace falta crearlo: Resend puede enviar desde cualquier dirección del dominio
verificado. Gracias a `reply_to`, al pulsar «Responder» en tu correo le contestas directamente al visitante.

### Las respuestas de la API

| Caso                                   | Código | La web muestra                                       |
| -------------------------------------- | ------ | ---------------------------------------------------- |
| Todo bien                              | 200    | «Recibimos tu consulta» (ahora sí es verdad)         |
| Falta un campo o un correo mal escrito | 400    | El error junto a cada campo (igual que hoy)          |
| Turnstile no se superó                 | 403    | «No pudimos verificar el envío. Inténtalo de nuevo.» |
| Resend falla                           | 502    | Error + «escríbenos a contacto@cososolution.com»     |

### Por qué tu correo personal no aparece en la web

- El formulario manda los datos a `/api/contacto`, no a tu dirección.
- Tu dirección y la clave de Resend se guardan como **secretos** en Cloudflare. No van en el código ni en el
  repositorio.
- Lo único público es `contacto@cososolution.com`, que reenvía a tu correo personal.

---

## 2. Lo que tienes que hacer tú

### Parte A — Crear `contacto@cososolution.com` (Email Routing) · ✅ hecho

Cloudflare → **cososolution.com** → **Correo electrónico** → **Enrutamiento de correo electrónico**:
dirección personalizada `contacto` → tu correo personal (verificado). Probado: llega.

> **Responder como `contacto@`:** Email Routing solo **recibe** y reenvía; por ahora respondes desde tu
> correo personal. Como tienes Resend con SMTP, más adelante se puede configurar Gmail para «Enviar como»
> `contacto@cososolution.com` con el SMTP de Resend. Es opcional; lo vemos cuando quieras.

### Parte B — Clave de API de Resend solo para la web · ~3 min

El dominio ya está verificado en Resend (registros `send.cososolution.com` y `resend._domainkey`; conviven
sin problema con los de Email Routing). Solo falta una clave **nueva y exclusiva** para la landing. No reutilices
la de Supabase: así, si un día hay que revocar una, la otra sigue funcionando.

1. Resend → **API keys** → **Create API key**.
2. Nombre: `coso-landing-formulario`.
3. **Permission:** _Sending access_ (solo enviar, no puede leer ni borrar nada).
4. **Domain:** `cososolution.com` (solo puede enviar desde ese dominio).
5. Copia la clave (`re_…`). **No me la pases**: Resend solo la muestra una vez, así que guárdala en tu
   gestor de contraseñas hasta la Parte E.

> Recomendado (opcional): en **Cloudflare → DNS** añade un registro TXT `_dmarc` con valor
> `v=DMARC1; p=none;`. Ahora no existe, y tenerlo ayuda a que Gmail y Outlook confíen en los correos del
> dominio.

### Parte C — Turnstile, el filtro anti-spam · ~5 min

Turnstile es el «captcha» de Cloudflare. Casi nunca muestra nada al visitante: comprueba en segundo plano que
es una persona.

1. Cloudflare, en el menú de la **cuenta** (no del dominio): sal con «Back to Domains» y busca **Turnstile**
   en el menú lateral o con `Ctrl K` → **Add widget**.
2. Nombre: `Formulario Coso Solution`.
3. **Hostnames:** `cososolution.com`. El subdominio de pruebas `*.pages.dev` se añade en la Parte D.
4. **Widget mode:** _Managed_.
5. Te da dos claves:
   - **Site key** (pública): va en el HTML de la web. **Pásamela por el chat.**
   - **Secret key** (privada): **no me la pases.** Guárdala hasta la Parte E.

Para probar en tu ordenador (localhost) uso las claves de prueba oficiales de Cloudflare, así que no
necesitas nada más para eso.

### Parte D — Crear el proyecto en Cloudflare Pages (cuando yo tenga el código listo) · ~10 min

En la terminal, dentro del proyecto:

```bash
npx wrangler login       # abre el navegador: autoriza a Wrangler (la CLI de Cloudflare) en tu cuenta
npm run deploy           # build de Astro + publicación en Pages (la primera vez crea el proyecto)
```

La primera publicación da una dirección de pruebas tipo `https://coso-solutions-web.pages.dev`. Añádela a
los _Hostnames_ de Turnstile (Parte C, paso 3).

### Parte E — Guardar los secretos · ~3 min

Los secretos son variables de entorno cifradas que solo ve la función; es lo mismo que tu `.env` de NestJS,
pero guardado en Cloudflare. Desde la terminal (te pide el valor y no queda en ningún archivo):

```bash
npx wrangler pages secret put RESEND_API_KEY         # la clave re_… de la Parte B
npx wrangler pages secret put CONTACT_TO             # tu correo personal
npx wrangler pages secret put TURNSTILE_SECRET_KEY   # la Secret key de la Parte C
```

También se pueden poner en el panel: **Workers y Pages** → `coso-solutions-web` → **Configuración** →
**Variables y secretos** → tipo _Secret_. Después hay que volver a publicar (`npm run deploy`) para que la
función los tome.

### Parte F — Probar de verdad · ~5 min

En la dirección `*.pages.dev`:

1. Envía el formulario con datos reales → debe llegarte el correo y la web mostrar «Recibimos tu consulta».
   En Resend → **Emails** verás el envío con su estado.
2. Pulsa «Responder» en tu correo → el destinatario debe ser el correo que pusiste en el formulario.
3. Envía con el correo mal escrito → la web muestra el error y no te llega nada.
4. Escribe a `contacto@cososolution.com` → te llega (Parte A).

### Parte G — El día del lanzamiento: apuntar el dominio a la landing

Esto **sí** retira el otro proyecto (`studio-flow-front`) del dominio. Hazlo solo cuando quieras publicar.

1. Revisamos juntos el Worker `studio-flow-front` → **Configuración** → **Dominios y rutas** y quitamos
   `cososolution.com` de ahí.
2. **Workers y Pages** → `coso-solutions-web` → **Dominios personalizados** → **Configurar** →
   `cososolution.com` (y si quieres `www.cososolution.com`).
3. Activa la indexación (`SITE_INDEXABLE=true`) y la URL definitiva; eso lo hago yo en el código.

El correo (Partes A y B) funciona igual antes y después de este cambio.

---

## 3. Lo que hago yo en el código

- `functions/api/contacto.ts`: el endpoint (validación, campo trampa, Turnstile y envío con Resend).
  Reutiliza `validateContact()` de `src/lib/contact-form.ts`: las mismas reglas en el navegador y en el
  servidor, porque **nunca hay que fiarse solo de la validación del navegador**.
- Formulario: el widget de Turnstile, envío con `fetch` y los mensajes de éxito y error.
- Quitar WhatsApp de toda la web (formulario, «¿Prefieres otro canal?», pie, aviso sin JavaScript);
  publicar `contacto@cososolution.com`.
- CSP: permitir el script y el iframe de Turnstile (`challenges.cloudflare.com`).
- Política de privacidad: los datos se envían por correo a Coso Solution a través de Cloudflare y Resend, y
  no se guardan en ninguna base de datos.
- Tests del endpoint (casos válido, inválido, robot y fallo de Resend) y el script `npm run deploy`.

## 4. Resumen: qué me pasas y qué no

| Dato                     | ¿Me lo pasas?                                         |
| ------------------------ | ----------------------------------------------------- |
| Turnstile **Site key**   | **Sí** (es pública, va en la web)                     |
| Subdominio `*.pages.dev` | Sí, cuando lo tengas                                  |
| Clave de API de Resend   | **No**: la guardas tú con `wrangler pages secret put` |
| Turnstile **Secret key** | **No**: igual que la de Resend                        |
| Tu correo personal       | **No hace falta**: lo guardas tú como `CONTACT_TO`    |
| Contraseñas              | **Nunca**                                             |

## 5. Decisión pendiente

- [ ] **Canal «Llamada»:** ¿se mantiene? Si sí, el visitante deja su teléfono y tú le llamas, sin publicar tu
      número. Si no, el formulario queda solo con correo.
