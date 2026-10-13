/**
 * Mapa de imágenes por clave. Importar una imagen en Astro devuelve sus metadatos
 * (src, width, height, format), que <Picture> usa para generar AVIF/WebP y srcset.
 * Originales: img-example/ → script scripts/optimize-images.mjs → esta carpeta.
 */
import type { ImageMetadata } from 'astro';

import type { ImageKey } from '../../data/home';

import datos from './analisis-datos.jpg';
import frontend from './diseno-pagina-web.jpg';
import equipo from './equipo-trabajo-colaborativo.jpg';
import reunion from './reunion-consultoria.jpg';

export const images: Record<ImageKey, ImageMetadata> = { frontend, datos, reunion, equipo };
