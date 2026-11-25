import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join, relative, sep } from 'node:path';
import { gzipSync } from 'node:zlib';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import jsQR from 'jsqr';

const root = resolve('dist');
const files = [];
async function walk(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, item.name);
    if (item.isDirectory()) await walk(path);
    else files.push(path);
  }
}
await walk(root);
const pages = files.filter((path) => path.endsWith('.html'));
assert(pages.length >= 3, 'Missing generated pages');
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  assert.match(html, /<html[^>]*lang="es"/, `Missing Spanish lang in ${page}`);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `Expected one h1 in ${page}`);
  assert.match(html, /id="contenido"/, `Missing skip-link target in ${page}`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, `Duplicate IDs in ${page}`);
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const url = match[1];
    if (url.startsWith('#')) {
      assert(ids.includes(url.slice(1)), `Missing anchor ${url} in ${page}`);
    } else if (url.startsWith('/')) {
      const plainPath = decodeURIComponent(url.split(/[?#]/)[0]);
      const destination = resolve(root, '.' + plainPath, plainPath.endsWith('/') ? 'index.html' : '');
      assert(destination.startsWith(root + sep), `Invalid local path ${url}`);
      assert((await stat(destination)).isFile(), `Missing resource ${url} in ${page}`);
    }
  }
}
let jsBytes = 0;
let cssBytes = 0;
for (const file of files) {
  if (file.endsWith('.js')) jsBytes += gzipSync(await readFile(file)).length;
  if (file.endsWith('.css')) cssBytes += gzipSync(await readFile(file)).length;
}
assert(jsBytes < 12_000, `Unexpected JS payload: ${jsBytes} bytes gzip`);
assert(cssBytes < 25_000, `Unexpected CSS payload: ${cssBytes} bytes gzip`);
const home = await readFile(join(root, 'index.html'), 'utf8');
for (const match of home.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
  if (match[1].trim()) jsBytes += gzipSync(match[1]).length;
}
assert(jsBytes > 0 && jsBytes < 12_000, `Unexpected home JS payload: ${jsBytes} bytes gzip`);
for (const match of home.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
  if (match[1].trim()) jsBytes += gzipSync(match[1]).length;
}
assert(jsBytes > 0 && jsBytes < 12_000, `Unexpected home JS payload: ${jsBytes} bytes gzip`);
const fontCount = files.filter((file) => file.endsWith('.woff2')).length;
assert.equal(fontCount, 1, 'Expected one locally hosted WOFF2 font');
assert((await stat(join(root, 'social-card.png'))).size > 0, 'Missing social card');
assert((await stat(join(root, 'qr', 'meryapp.svg'))).size > 0, 'Missing QR SVG');
assert((await stat(join(root, 'qr', 'meryapp.png'))).size > 0, 'Missing QR PNG');
const qrDestination = home.match(/<figcaption[^>]*>[\s\S]*?<a href="([^"]+)"/)?.[1]?.replaceAll('&amp;', '&');
assert(qrDestination, 'Missing visible QR destination');
for (const extension of ['svg', 'png']) {
  const pixels = await sharp(join(root, 'qr', `meryapp.${extension}`)).resize(480, 480).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const decoded = jsQR(new Uint8ClampedArray(pixels.data), pixels.info.width, pixels.info.height);
  assert.equal(decoded?.data, qrDestination, `Built QR ${extension} differs from the link shown on the page`);
}
console.log(`Verified branded SVG and PNG decode to the visible QR destination: ${qrDestination}`);
console.log(`Verified ${pages.length} pages, internal anchors and local resources.`);
console.log(`HTML home: ${gzipSync(home).length} bytes gzip; JS: ${jsBytes}; CSS: ${cssBytes}; WOFF2: ${fontCount}.`);
console.log(`Pages: ${pages.map((page) => relative(root, page)).join(', ')}`);
