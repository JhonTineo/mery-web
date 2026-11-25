import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import jsQR from 'jsqr';
import { createQrArtwork } from '../src/lib/qr-artwork.mjs';
import { resolveQrTarget } from '../src/lib/qr-target.mjs';

test('QR target uses the explicit destination before site and Vercel domains', () => {
  const target = resolveQrTarget({ qrUrl: 'https://example.com/mery?via=flyer', siteUrl: 'https://example.org', productionHost: 'mery.vercel.app' }, 'http://localhost:4321');
  assert.equal(target.url, 'https://example.com/mery?via=flyer');
  assert.equal(target.isLocal, false);
  assert.equal(resolveQrTarget({ siteUrl: 'https://example.org' }, 'http://localhost').url, 'https://example.org/');
  assert.equal(resolveQrTarget({ productionHost: 'mery.vercel.app', previewHost: 'preview.vercel.app' }, 'http://localhost').url, 'https://mery.vercel.app/');
  assert.equal(resolveQrTarget({ previewHost: 'preview.vercel.app' }, 'http://localhost').url, 'https://preview.vercel.app/');
});

test('local QR is labeled and invalid or unsafe public addresses are rejected', () => {
  assert.equal(resolveQrTarget({}, 'http://localhost:4321').isLocal, true);
  assert.equal(resolveQrTarget({}, 'http://127.0.0.1:4322').isLocal, true);
  for (const qrUrl of ['javascript:alert(1)', 'https://user:secret@example.com', 'http://example.com', 'example.com']) {
    assert.throws(() => resolveQrTarget({ qrUrl }, 'http://localhost'));
  }
});

for (const url of ['http://localhost:4321/', 'https://meryapp.example/', 'https://mery-web-production.vercel.app/', 'https://example.com/descargar/?origen=flyer&version=1']) {
  test(`the actual SVG and PNG with the Mery icon decode to ${url}`, async () => {
    const artwork = await createQrArtwork(url);
    assert.match(artwork.svg, /#FF3B4E/);
    assert.match(artwork.svg, /Código QR de MeryApp/);
    for (const [format, data, width] of [['svg', Buffer.from(artwork.svg), 240], ['png', artwork.png, 1600]]) {
      const raster = await sharp(data).resize(width, width).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const decoded = jsQR(new Uint8ClampedArray(raster.data), raster.info.width, raster.info.height);
      assert.equal(decoded?.data, url, `${format} with logo failed to decode at ${width}px`);
    }
  });
}
