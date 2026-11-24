# Dirección de diseño

## Referencias

- [OpenClaw](https://openclaw.ai/): jerarquía clara de presentación del agente, ejemplos concretos y progresión hacia el proyecto. Se utiliza como referencia, sin copiar su código, marca, textos o testimonios.
- Flyer `Flayer-MeryApp.png` del usuario: fondo vino oscuro, rojo coral, letras crema, micrófono protagonista y frases flotando junto al teléfono.
- Icono original: `mery-app/assets/icon.svg`.

## Skills consultadas

- [Frontend Design — Anthropic](https://skills.sh/anthropics/skills/frontend-design): dirección visual propia, tipografía intencional, contención de efectos y revisión visual. Fuente oficial: https://github.com/anthropics/skills/tree/main/skills/frontend-design
- [Web Design Guidelines — Vercel](https://skills.sh/vercel-labs/agent-skills/web-design-guidelines): semántica, teclado, foco, contraste, movimiento reducido y rendimiento. Fuente oficial: https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines

Se consultaron las instrucciones originales y su procedencia oficial. No se instalaron skills globales ni se cambiaron las preferencias del entorno del usuario. Si más adelante se desean instalar, desde esta carpeta:

```powershell
npx skills add anthropics/skills --skill frontend-design
npx skills add vercel-labs/agent-skills --skill web-design-guidelines
```

## Sistema visual

- Vino profundo: `#17070B`, fondo general.
- Vino: `#21080F`, portada.
- Panel: `#2A1018`.
- Coral: `#FF3B4E`, identidad original, micrófono y acciones.
- Crema: `#FFF5EC`, texto principal.
- Rosa apagado: `#C9AEB5`, texto secundario.
- Tipografía: Manrope variable, alojada localmente; pesos 500–800, títulos compactos y párrafos de longitud contenida.

La portada usa una composición dividida: mensaje a la izquierda, teléfono a la derecha. El micrófono y el teléfono concentran el protagonismo; las secciones siguientes explican usos, muestran una conversación y dan contexto sobre autonomía. En móvil la composición pasa a una columna. El teléfono es HTML/CSS y sus frases son texto, no una imagen pesada con contenido incrustado.

## Decisiones de contenido

No se promete una descarga inexistente ni se publican formularios sin destino. La integración de mensajes de WhatsApp se diferencia de abrir la aplicación. La simulación está identificada y no solicita permisos. La página de privacidad explica el alcance de esta web sin inventar políticas de la app.
