import QRCode from 'qrcode';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const iconSource = resolve('public/mery-icon.svg');
const artworkCache = new Map();

/** @param {string} value */
export function createQrArtwork(value) {
  if (!artworkCache.has(value)) artworkCache.set(value, generate(value));
  return artworkCache.get(value);
}

/** @param {string} value */
async function generate(value) {
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('El QR necesita una dirección web HTTP o HTTPS.');
  const options = { errorCorrectionLevel: /** @type {const} */ ('H'), margin: 4, color: { dark: '#21080f', light: '#ffffff' } };
  const symbol = QRCode.create(value, options);
  const size = symbol.modules.size + options.margin * 2;
  const logoSize = symbol.modules.size * 0.17;
  const logoX = (size - logoSize) / 2;
  const padding = 0.7;
  const rawIcon = await readFile(iconSource, 'utf8');
  const iconContent = rawIcon.replace(/^[\s\S]*?<svg\b[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  const baseSvg = await QRCode.toString(value, { ...options, type: 'svg' });
  const badge = `<rect x="${logoX - padding}" y="${logoX - padding}" width="${logoSize + padding * 2}" height="${logoSize + padding * 2}" rx="0.8" fill="#fff"/><svg x="${logoX}" y="${logoX}" width="${logoSize}" height="${logoSize}" viewBox="0 0 1024 1024">${iconContent}</svg>`;
  const svg = baseSvg.replace(/<svg\b/, '<svg width="1600" height="1600" role="img" aria-label="Código QR de MeryApp"').replace('</svg>', `${badge}</svg>`);
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return { svg, png };
}
