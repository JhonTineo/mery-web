# MeryApp · Web de presentación

Landing en español construida con **Astro, TypeScript y CSS**, con salida estática para Vercel. Utiliza el icono original de MeryApp y los colores vino, coral y crema del flyer. No necesita backend, base de datos, claves de API ni un framework de JavaScript en el navegador.

## Desarrollo

Requiere Node.js 22.12 o posterior (se recomienda Node.js 24 LTS).

```powershell
npm ci
npm run dev
```

La terminal muestra la dirección local. Para comprobar y compilar:

```powershell
npm run build
npm run preview
```

`build` comprueba los tipos con `astro check` y genera `dist/`. `npm run check` ejecuta solo la comprobación de tipos.

`npm run verify` compila y verifica la integridad de las páginas, anclas, enlaces locales, recursos, fuente y tamaño comprimido del CSS/JavaScript.

## Desplegar en Vercel

1. Sube el contenido de esta carpeta a tu repositorio de GitHub.
2. En Vercel, selecciona **Add New → Project** e importa ese repositorio.
3. Framework: **Astro**. Directorio raíz: esta carpeta (o `.` si es un repositorio independiente). Build: `npm run build`. Output: `dist`. Install: `npm ci`.
4. Usa Node.js **24.x** y despliega.
5. Cuando tengas el dominio final, añade `PUBLIC_SITE_URL` con su origen HTTPS y vuelve a desplegar. Activa las URL canónicas y la imagen de Open Graph. No inventa un dominio mientras no se configure.

No hace falta `@astrojs/vercel`: la página es estática. `vercel.json` declara el framework, la salida, la caché de recursos con hash y las cabeceras. No hay despliegue público automático desde este proyecto.

## Publicar una descarga de Android

La página muestra “Explorar el proyecto” y avisa que no hay descarga pública. Cuando exista una versión real, configura `PUBLIC_DOWNLOAD_URL` en Vercel con una URL HTTPS pública de la APK o de su release y vuelve a desplegar. El botón y las preguntas se actualizan en la compilación. No añadas claves o datos privados a variables `PUBLIC_`.

## Compartir con código QR

La portada incluye un QR con el icono de Mery en el centro y descargas **PNG de 1600 × 1600** y **SVG vectorial**. Se genera al compilar, sin añadir la librería al JavaScript del visitante. Usa `PUBLIC_QR_URL`, `PUBLIC_SITE_URL` o el dominio detectado de Vercel, en ese orden. En local sin configurar muestra una vista previa identificada como local.

Consulta [la guía del QR](docs/codigo-qr.md) para configurar el enlace, descargarlo, usarlo en Canva y preparar el flyer. `npm run test:qr` comprueba que los archivos reales con el icono se puedan decodificar.

## Editar contenido

- `src/pages/index.astro`: secciones, textos y preguntas frecuentes.
- `src/config.ts`: repositorio, descripción y configuración de descarga.
- `src/scripts/interactions.ts`: ejemplos simulados y menú móvil.
- `src/styles/global.css`: colores, tipografía y diseño adaptable.
- `public/mery-icon.svg`: icono original de la aplicación.
- `public/social-card.png`: imagen para compartir la página.
- `src/pages/privacidad.astro`: privacidad de esta web.
- `docs/diseno.md`: referencias y decisiones de diseño.

## Alcance de la presentación

El contenido se contrastó con el repositorio de la app. Las llamadas requieren confirmación. Se describe la apertura de apps instaladas, las consultas del dispositivo y la memoria. Leer y enviar mensajes de WhatsApp aparece **en desarrollo**, porque su adaptador aún está pendiente. La demo es local y simulada: no utiliza el micrófono ni ejecuta acciones reales. No se incluyen testimonios, métricas ni certificaciones inventadas.

## Rendimiento y accesibilidad

HTML generado al compilar, un pequeño script para las interacciones, una sola fuente variable WOFF2 local y recursos visuales SVG/CSS. Enlaces y contenido se mantienen disponibles sin JavaScript; los ejemplos seleccionables y el menú móvil requieren JavaScript. Incluye enlace para saltar al contenido, estados de foco visibles, menú con Escape, anuncios de la demo para lectores de pantalla, FAQ nativo y respeto por movimiento reducido. La web no incorpora analítica, formularios ni fuentes externas.

Documentación oficial: [Astro en Vercel](https://docs.astro.build/en/guides/deploy/vercel/).
