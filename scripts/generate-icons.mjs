/**
 * Genera en public/ los íconos y la imagen para compartir en redes:
 *   favicon.ico (16/32/48) · apple-touch-icon.png (180) · icon-192.png · icon-512.png
 *   maskable-512.png · og-image.jpg (1200×630)
 *
 * Fuentes: hoja de marca en img-example/ y la imagen del hero en src/assets/images/.
 * No hay logo vectorial todavía: cuando exista un SVG, añadir favicon.svg.
 *
 * Uso: node scripts/generate-icons.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const pub = path.join(root, 'public');
const sheet = path.join(root, 'img-example/Modern COSO Solution Brand Identity.png');
const roundedIcon = path.join(root, 'src/assets/brand/icono-coso-solution.png');
const heroImage = path.join(root, 'src/assets/images/diseno-pagina-web.jpg');
const INK = '#0B1B33';

await mkdir(pub, { recursive: true });
const log = (name) => console.log(`✓ public/${name}`);

// Cuadrado del ícono sin esquinas redondeadas (iOS y Android aplican su propia máscara)
const square = await sharp(sheet)
  .extract({ left: 1113, top: 335, width: 302, height: 304 })
  .resize(300, 300)
  .flatten({ background: INK })
  .toBuffer();

// apple-touch-icon: opaco, 180×180
await sharp(square).resize(180, 180).png().toFile(path.join(pub, 'apple-touch-icon.png'));
log('apple-touch-icon.png');

// Íconos del manifiesto (con esquinas redondeadas transparentes)
for (const size of [192, 512]) {
  await sharp(roundedIcon)
    .resize(size, size, { kernel: 'lanczos3' })
    .png()
    .toFile(path.join(pub, `icon-${size}.png`));
  log(`icon-${size}.png`);
}

// Maskable: la marca dentro de la zona segura (80 %) sobre fondo de marca
await sharp(square)
  .resize(420, 420)
  .extend({ top: 46, bottom: 46, left: 46, right: 46, background: INK })
  .png()
  .toFile(path.join(pub, 'maskable-512.png'));
log('maskable-512.png');

// favicon.ico: contenedor ICO con PNG de 16, 32 y 48 px
{
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(
    sizes.map((size) => sharp(roundedIcon).resize(size, size).png().toBuffer()),
  );
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reservado
  header.writeUInt16LE(1, 2); // tipo: icono
  header.writeUInt16LE(sizes.length, 4);
  let offset = 6 + 16 * sizes.length;
  const entries = sizes.map((size, i) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0);
    entry.writeUInt8(size, 1);
    entry.writeUInt16LE(1, 4); // planos
    entry.writeUInt16LE(32, 6); // bits por píxel
    entry.writeUInt32LE(pngs[i].length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += pngs[i].length;
    return entry;
  });
  await writeFile(path.join(pub, 'favicon.ico'), Buffer.concat([header, ...entries, ...pngs]));
  log('favicon.ico');
}

// og-image: foto del hero + degradado de marca + titular con estilo de código
{
  const W = 1200;
  const H = 630;
  const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="${INK}" stop-opacity="0.97"/>
      <stop offset="0.55" stop-color="${INK}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="${INK}" stop-opacity="0.35"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <g font-family="Consolas, 'Cascadia Mono', 'DejaVu Sans Mono', monospace">
    <text x="88" y="150" font-size="24" fill="#7F93AE">// Desarrollo de software a medida</text>
    <text x="88" y="250" font-size="62" font-weight="700" fill="#FFFFFF">Primero entendemos</text>
    <text x="88" y="324" font-size="62" font-weight="700" fill="#FFFFFF">el proceso.</text>
    <text x="88" y="410" font-size="62" font-weight="700" fill="#5CC4F7">Después escribimos</text>
    <text x="88" y="484" font-size="62" font-weight="700" fill="#5CC4F7">el código.</text>
  </g>
  <text x="170" y="565" font-family="'Segoe UI', Arial, sans-serif" font-size="28" font-weight="700" fill="#FFFFFF">Coso Solution</text>
</svg>`);
  const badge = await sharp(roundedIcon).resize(60, 60).toBuffer();
  await sharp(heroImage)
    .resize(W, H, { fit: 'cover', position: 'right' })
    .composite([
      { input: overlay, top: 0, left: 0 },
      { input: badge, top: 526, left: 88 },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(pub, 'og-image.jpg'));
  log('og-image.jpg');
}
