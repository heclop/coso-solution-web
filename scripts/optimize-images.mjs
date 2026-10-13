/**
 * Prepara los originales de img-example/ para el proyecto:
 * - reduce las fotos a un ancho máximo razonable y las renombra,
 * - recorta logo e ícono de la hoja de marca y les da fondo transparente,
 * - escribe en src/assets/ (Astro genera después AVIF/WebP y los srcset).
 *
 * Uso: node scripts/optimize-images.mjs
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const src = path.join(root, 'img-example');
const images = path.join(root, 'src/assets/images');
const brand = path.join(root, 'src/assets/brand');

await mkdir(images, { recursive: true });
await mkdir(brand, { recursive: true });

const log = (name, info) =>
  console.log(`✓ ${name} ${info.width}×${info.height} ${(info.size / 1024).toFixed(0)} KB`);

/** [original, destino, ancho máximo] */
const photos = [
  ['pexels-vanessa-garcia-6326394.jpg', 'reunion-consultoria.jpg', 1600],
  ['pexels-artempodrez-6779339.jpg', 'analisis-datos.jpg', 1400],
  ['pexels-thirdman-7652387.jpg', 'equipo-trabajo-colaborativo.jpg', 2400],
  ['diseño-pagina-web.png', 'diseno-pagina-web.jpg', 2000],
];

for (const [from, to, maxWidth] of photos) {
  const info = await sharp(path.join(src, from))
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(images, to));
  log(to, info);
}

const sheet = path.join(src, 'Modern COSO Solution Brand Identity.png');

/**
 * Convierte el blanco del fondo en transparencia (color-to-alpha):
 * los píxeles casi blancos se vuelven transparentes y los bordes suavizados conservan su color.
 */
async function whiteToAlpha(buffer) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const min = Math.min(data[i], data[i + 1], data[i + 2]);
    const alpha = Math.min(1, Math.max(0, (238 - min) / 48));
    if (alpha === 1) continue;
    for (let c = 0; c < 3; c++) {
      data[i + c] =
        alpha === 0
          ? 0
          : Math.round(Math.min(255, Math.max(0, (data[i + c] - 255 * (1 - alpha)) / alpha)));
    }
    data[i + 3] = Math.round(alpha * 255);
  }
  return sharp(data, { raw: info });
}

// Logo horizontal. extract y trim van en pasos separados: en la misma cadena sharp falla.
{
  const cropped = await sharp(sheet)
    .extract({ left: 95, top: 335, width: 920, height: 335 })
    .toBuffer();
  const trimmed = await sharp(cropped).trim({ threshold: 12 }).toBuffer();
  const info = await (
    await whiteToAlpha(trimmed)
  )
    .png({ compressionLevel: 9 })
    .toFile(path.join(brand, 'logo-coso-solution.png'));
  log('logo-coso-solution.png', info);
}

// Ícono de app: recorte interior + esquinas redondeadas transparentes
{
  const cropped = await sharp(sheet)
    .extract({ left: 1113, top: 335, width: 302, height: 304 })
    .resize(300, 300)
    .toBuffer();
  const mask = Buffer.from(
    '<svg width="300" height="300"><rect width="300" height="300" rx="58" fill="#fff"/></svg>',
  );
  const info = await sharp(cropped)
    .ensureAlpha()
    .composite([{ input: mask, blend: 'dest-in' }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(brand, 'icono-coso-solution.png'));
  log('icono-coso-solution.png', info);
}
