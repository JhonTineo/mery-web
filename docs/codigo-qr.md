# Código QR de MeryApp

La sección **“Visita nuestra página”**, al final de la portada, muestra únicamente la invitación y el QR. También se puede entrar directamente en `/#compartir`. Los archivos se conservan en `/qr/meryapp.png` y `/qr/meryapp.svg`: abre esas direcciones para guardarlos.

Se utiliza la librería general `qrcode` desde Astro. No es un paquete exclusivo de Astro. La generación se hace en el servidor de desarrollo o durante la compilación: la librería no se envía al navegador del visitante ni requiere un servicio de QR externo.

## Qué mejora frente al generador del navegador

| Navegador | Implementación de MeryApp |
| --- | --- |
| Genera manualmente el enlace de la pestaña abierta. | Usa la dirección configurada y vuelve a generar las imágenes en cada compilación. |
| Apariencia decidida por el navegador. | Módulos vino oscuro sobre blanco, con el icono original de Mery centrado. |
| Opciones de descarga según el navegador. | SVG vectorial y PNG de 1600 × 1600, disponibles desde la página. |
| La persona debe preparar y distribuir el archivo. | Los archivos se publican junto a la landing en `/qr/meryapp.svg` y `/qr/meryapp.png`. |

Los dos métodos crean códigos QR normales. No cambian la velocidad de la web de destino ni añaden seguimiento o estadísticas. El patrón puede verse distinto y aun así contener el mismo enlace.

## Elegir la dirección

El destino se decide en este orden:

1. `PUBLIC_QR_URL`: enlace exacto elegido para compartir (por ejemplo, una página estable de descarga).
2. `PUBLIC_SITE_URL`: dirección pública de la landing.
3. `VERCEL_PROJECT_PRODUCTION_URL`: dominio de producción que expone Vercel.
4. `VERCEL_URL`: dirección de ese despliegue, si no existe un dominio de producción.
5. En desarrollo local sin configurar: el origen local. La página lo identifica como **vista previa local** y los archivos descargados incluyen `vista-previa` en el nombre.

Para un flyer, usa tu dominio final y estable. Un QR local no permite abrir tu computadora desde otro teléfono. Un dominio temporal de un despliegue puede dejar de servir si ese despliegue se elimina.

## Probar con tu dirección pública desde PowerShell

```powershell
cd "D:\JhonTineo\Documents\GitHub\mery-web"
$env:PUBLIC_SITE_URL = "https://TU-DOMINIO-REAL"
npm run dev
```

Reemplaza el ejemplo por tu dirección real. Abre la sección de compartir. Para guardar el QR, abre `/qr/meryapp.png` o `/qr/meryapp.svg`. Para configurar otro destino sin cambiar el dominio de la landing, usa `$env:PUBLIC_QR_URL = "https://TU-ENLACE-REAL"` antes de iniciar el servidor.

También puedes copiar `.env.example` a `.env` y guardar allí los valores, sin `#` al comienzo de esas líneas. Reinicia el servidor si estaba abierto. No incluyas credenciales ni información privada en estos enlaces.

En Vercel: **Project → Settings → Environment Variables**. Define `PUBLIC_SITE_URL` con el dominio final; opcionalmente, `PUBLIC_QR_URL`. Después vuelve a desplegar: el QR se genera al compilar, no se modifica en los archivos ya descargados.

La detección automática de los dominios de Vercel requiere tener habilitado el acceso a sus variables de entorno del sistema. Configurar explícitamente `PUBLIC_SITE_URL` evita depender de esa detección.

## Usarlo en Canva o en un flyer

1. Descarga **PNG** para Canva, Word y presentaciones; **SVG** para edición vectorial e impresión a cualquier escala.
2. Inserta el archivo completo. Conserva el margen blanco y las proporciones cuadradas; evita filtros y recolorear los módulos.
3. Para un flyer de mano, empieza con un tamaño de unos 3 cm de lado y comprueba la lectura en una impresión de prueba. La distancia, el papel y la cámara influyen: no hay un tamaño único que garantice lectura.
4. Escanéalo con varios celulares antes de imprimir la tirada final y verifica el destino.

## Icono central y lectura

`qrcode` genera la matriz. El proyecto incorpora después el SVG original de Mery en el centro, con una separación blanca. Se usa corrección de errores **H**, un icono pequeño (17 % del ancho de la matriz) y cuatro módulos de margen blanco exterior. La corrección de errores ayuda a tolerar la parte cubierta; no garantiza que cualquier logo o cualquier impresión se lea.

`npm run test:qr` rasteriza y decodifica los SVG/PNG finales con el icono, usando `jsqr`, y comprueba el enlace recuperado. Incluye URL local, dominio corto, dominio de Vercel y enlace con parámetros. Esto complementa la prueba real con la cámara del celular.

## Cambiar el destino después de imprimir

El archivo QR contiene una dirección fija. Si conservas esa dirección y cambias su página o su redirección, el mismo QR continúa siendo útil. Si cambias la dirección codificada y generas otro QR, las imágenes anteriores siguen apuntando a la dirección anterior. No hay vencimiento propio del QR; su utilidad depende de que el enlace siga disponible.

Documentación: [qrcode](https://github.com/soldair/node-qrcode), [variables del sistema de Vercel](https://vercel.com/docs/environment-variables/system-environment-variables).
