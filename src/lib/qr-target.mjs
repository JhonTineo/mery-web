/**
 * A stable explicit address wins over Vercel's generated deployment addresses.
 * @param {{qrUrl?: string, siteUrl?: string, productionHost?: string, previewHost?: string}} settings
 * @param {string} fallbackOrigin
 */
export function resolveQrTarget(settings, fallbackOrigin) {
  const configured = settings.qrUrl?.trim() || settings.siteUrl?.trim();
  const vercelHost = settings.productionHost?.trim() || settings.previewHost?.trim();
  const destination = configured || (vercelHost ? `https://${vercelHost}` : fallbackOrigin);
  let parsed;
  try {
    parsed = new URL(destination);
  } catch {
    throw new Error('PUBLIC_QR_URL o PUBLIC_SITE_URL debe ser una URL completa, por ejemplo https://meryapp.example.');
  }
  const host = parsed.hostname.toLowerCase();
  const isLocal = host === 'localhost' || host.endsWith('.localhost') || host.startsWith('127.') || host === '[::1]' || host === '0.0.0.0';
  if ((parsed.protocol !== 'https:' && !(isLocal && parsed.protocol === 'http:')) || parsed.username || parsed.password) {
    throw new Error('El QR público necesita una URL HTTPS sin credenciales.');
  }
  return { url: parsed.href, isLocal };
}
