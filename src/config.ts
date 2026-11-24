const configuredDownload = import.meta.env.PUBLIC_DOWNLOAD_URL?.trim();

function httpsUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export const mery = {
  name: 'MeryApp',
  repository: 'https://github.com/JhonTineo/mery-app',
  downloadUrl: httpsUrl(configuredDownload),
  description: 'Di lo que quieres hacer. Mery es un agente de voz para Android, pensado para que las personas ciegas puedan usar su celular con más autonomía.',
};
