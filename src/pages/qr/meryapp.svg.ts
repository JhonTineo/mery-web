import type { APIRoute } from 'astro';
import { createQrArtwork } from '../../lib/qr-artwork.mjs';
import { getQrTarget } from '../../lib/qr';

export const GET: APIRoute = async ({ url }) => {
  const target = getQrTarget(url.origin);
  const artwork = await createQrArtwork(target.url);
  return new Response(artwork.svg, {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
  });
};
