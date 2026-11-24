import { defineConfig } from 'astro/config';

// Static HTML on Vercel's CDN. No server or Vercel adapter is needed.
const site = process.env.PUBLIC_SITE_URL;

export default defineConfig({
  site: site || undefined,
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
