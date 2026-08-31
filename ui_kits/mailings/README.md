# Flow — Mailings

Plantillas de correo transaccional/operativo. Son **HTML de email**, no Design Components: los clientes de correo (Outlook/Windows, Gmail, Apple Mail) no soportan React, CSS custom properties, flex ni grid, así que estos archivos son HTML plano con tablas y estilos inline, pensado para pegarse directo en un ESP (SendGrid, Postmark, Braze, etc).

## Restricciones reales de email (por qué se ve "raro" vs el resto del DS)

- **Solo `<table>` para layout.** Sin flexbox ni grid — Outlook de escritorio usa el motor de render de Word y los ignora.
- **Sin variables CSS.** Todos los colores de `tokens/colors.css` están hardcodeados en hex dentro de cada archivo (ver tabla abajo) — los clientes de correo no evalúan `var()`.
- **Sin fuentes web.** Nada de Sora/JetBrains Mono vía `@font-face` con garantía de carga: el stack es `Arial, Helvetica, sans-serif` (y `Courier New, monospace` para cifras tipo mono). Es la aproximación más cercana sin depender de que el cliente cargue la fuente.
- **Ancho fijo de 600px**, con una única regla de `@media` para volverlo fluido en pantallas angostas (Apple Mail / Gmail app sí soportan `<style>` en `<head>`; Outlook de escritorio la ignora pero no rompe el layout de tabla).
- **Preheader oculto** (`display:none` + texto) al inicio del `<body>` — es lo que se ve como segunda línea en la bandeja de entrada.
- **Sin JS.** Ningún cliente de correo lo ejecuta — cero interactividad real; todo es estático o depende de que el usuario abra el link.
- **Imágenes con alt + fallback de texto** — muchos clientes bloquean imágenes por defecto (el logo aquí usa un fallback de texto "Flow" en vez de depender de que la imagen cargue).
- **Botones como tabla con `border-radius` en la celda**, no `<button>` — así se ven bien incluso en Outlook con VML si se necesita (no incluido aquí por simplicidad, se degrada a rectángulo).

## Paleta usada (hex fijo, no tokens)

| Uso | Hex |
|---|---|
| Texto primario / marca | `#17171A` |
| Texto secundario | `#55534E` |
| Texto muted | `#8A8781` |
| Fondo página | `#F3F1ED` |
| Borde | `#E0DDD7` |
| Acento (CTA) | `#FF3617` / hover `#E62D10` |
| Éxito | `#0E8A50` |
| Advertencia | `#B26A00` |
| Peligro | `#B42318` |

## Archivos

- `base-layout.html` — el shell reutilizable (logo, tarjeta blanca de 600px, footer legal) sin contenido — punto de partida para cualquier mailing nuevo.
- `transaccional-recibo.html` — cargo individual con monto, tarjeta, categoría y CTA de disputa.
- `resumen-semanal.html` — KPIs de la semana + alertas pendientes, para fleet managers.
- `alerta-seguridad.html` — nuevo inicio de sesión + código OTP de 6 dígitos.
- `invitacion-equipo.html` — invitación a colaborar con rol asignado.
- `bienvenida.html` — onboarding: checklist de 3 pasos tras la verificación.

## Uso

Abre cualquier archivo directo en el navegador para previsualizar. Para producción: pega el HTML completo en tu ESP, sube el logo real a una URL pública (reemplaza el fallback de texto), y corre por [Litmus](https://litmus.com) o [Email on Acid](https://www.emailonacid.com) antes de enviar a producción — el render varía entre Outlook, Gmail y Apple Mail más de lo que cualquier revisión manual puede cubrir.
