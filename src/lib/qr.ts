import { resolveQrTarget } from './qr-target.mjs';

/** Only imported from Astro frontmatter / build-time endpoints, never the browser. */
export function getQrTarget(origin: string) {
  return resolveQrTarget({
    qrUrl: import.meta.env.PUBLIC_QR_URL,
    siteUrl: import.meta.env.PUBLIC_SITE_URL,
    productionHost: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    previewHost: process.env.VERCEL_URL,
  }, origin);
}
