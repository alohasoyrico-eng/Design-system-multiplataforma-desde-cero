#!/usr/bin/env node
/**
 * Flow mailings — email HTML generated from the design tokens.
 *
 * Email clients strip CSS custom properties and most modern CSS, so these templates use
 * table layout + inline styles with the brand values INLINED. To keep them systemic, every
 * color/radius is read from the resolved token map (packages/tokens/dist/tokens.json) — the
 * same single source of truth as the app — never hand-picked. Re-run after `tokens:build`.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(readFileSync(join(__dirname, "..", "tokens", "dist", "tokens.json"), "utf8"));
const DIST = join(__dirname, "dist");

const c = {
  canvas: T["sys.surface.canvas"],
  card: T["sys.surface.card"],
  ink: T["sys.text.primary"],
  sec: T["sys.text.secondary"],
  muted: T["sys.text.muted"],
  accent: T["sys.action.accent"],
  onAccent: T["sys.text.onAccent"],
  border: T["sys.border.subtle"],
  success: T["sys.status.successText"],
  sunken: T["sys.surface.sunken"],
};
const radius = parseInt(T["sys.radius.lg"], 10);
const FONT = "'Sora','Helvetica Neue',Arial,sans-serif";
const MONO = "'JetBrains Mono','Courier New',monospace";

const button = (label, href) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td style="border-radius:999px;background:${c.accent};">
    <a href="${href}" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:15px;font-weight:600;color:${c.onAccent};text-decoration:none;border-radius:999px;">${label}</a>
  </td></tr></table>`;

const base = (title, preheader, inner) => `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title></head>
<body style="margin:0;padding:0;background:${c.canvas};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${c.canvas};padding:32px 16px;">
<tr><td align="center">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
    <tr><td style="padding:0 8px 20px;font-family:${FONT};font-size:22px;font-weight:800;color:${c.accent};">⚡ Flow</td></tr>
    <tr><td style="background:${c.card};border:1px solid ${c.border};border-radius:${radius}px;padding:32px;">
      ${inner}
    </td></tr>
    <tr><td style="padding:20px 8px;font-family:${FONT};font-size:12px;color:${c.muted};">
      Flow · Movilidad en movimiento. Recibiste este correo porque tienes una cuenta Flow.
    </td></tr>
  </table>
</td></tr></table></body></html>`;

const h1 = (t) =>
  `<h1 style="margin:0 0 12px;font-family:${FONT};font-size:24px;font-weight:700;color:${c.ink};letter-spacing:-0.02em;">${t}</h1>`;
const p = (t) =>
  `<p style="margin:0 0 16px;font-family:${FONT};font-size:15px;line-height:1.55;color:${c.sec};">${t}</p>`;
const overline = (t) =>
  `<div style="font-family:${FONT};font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${c.muted};margin-bottom:6px;">${t}</div>`;

const templates = {
  "bienvenida.html": base(
    "Bienvenido a Flow",
    "Tu cuenta está lista. Empieza a mover la ciudad.",
    `${h1("Bienvenido a Flow, Ana")}
     ${p("Tu cuenta está lista. Conéctate a tu turno, acepta viajes y sigue tus ganancias — todo desde un solo lugar.")}
     <div style="margin:24px 0;">${button("Abrir Flow", "https://flow.example/app")}</div>
     ${p("Si tienes dudas, responde este correo y te ayudamos.")}`,
  ),

  "transaccional-recibo.html": base(
    "Recibo de tu viaje",
    "Viaje 214 · $185.00",
    `${overline("Recibo")}${h1("Gracias por tu viaje")}
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;border-top:1px solid ${c.border};">
       <tr><td style="padding:12px 0;font-family:${FONT};font-size:14px;color:${c.sec};border-bottom:1px solid ${c.border};">Viaje 214 · Centro → Aeropuerto</td>
           <td align="right" style="padding:12px 0;font-family:${MONO};font-size:14px;color:${c.ink};border-bottom:1px solid ${c.border};">$168.00</td></tr>
       <tr><td style="padding:12px 0;font-family:${FONT};font-size:14px;color:${c.sec};border-bottom:1px solid ${c.border};">Peaje</td>
           <td align="right" style="padding:12px 0;font-family:${MONO};font-size:14px;color:${c.ink};border-bottom:1px solid ${c.border};">$17.00</td></tr>
       <tr><td style="padding:14px 0;font-family:${FONT};font-size:15px;font-weight:700;color:${c.ink};">Total</td>
           <td align="right" style="padding:14px 0;font-family:${MONO};font-size:18px;font-weight:600;color:${c.ink};">$185.00</td></tr>
     </table>
     ${p("El cargo se aplicó a tu método de pago Flow terminación 2148.")}`,
  ),

  "resumen-semanal.html": base(
    "Tu semana en Flow",
    "12 viajes · $1,840 en ganancias",
    `${overline("Resumen semanal")}${h1("Tu semana en movimiento")}
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
       <tr>
         <td width="50%" style="padding:16px;background:${c.sunken};border-radius:16px;">
           <div style="font-family:${FONT};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${c.muted};">Ganancias</div>
           <div style="font-family:${MONO};font-size:26px;font-weight:600;color:${c.ink};margin-top:4px;">$1,840</div>
         </td>
         <td width="16"></td>
         <td width="50%" style="padding:16px;background:${c.sunken};border-radius:16px;">
           <div style="font-family:${FONT};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${c.muted};">Viajes</div>
           <div style="font-family:${MONO};font-size:26px;font-weight:600;color:${c.ink};margin-top:4px;">12</div>
         </td>
       </tr>
     </table>
     ${p(`Vas <strong style="color:${c.success};">+8%</strong> respecto a la semana pasada. ¡Sigue así!`)}
     <div style="margin:24px 0 0;">${button("Ver detalle", "https://flow.example/wallet")}</div>`,
  ),

  "alerta-otp.html": base(
    "Tu código de verificación",
    "Tu código Flow es 429 815",
    `${overline("Seguridad")}${h1("Tu código de verificación")}
     ${p("Usa este código para confirmar tu identidad. Vence en 10 minutos.")}
     <div style="margin:20px 0;padding:20px;background:${c.sunken};border-radius:16px;text-align:center;font-family:${MONO};font-size:32px;font-weight:600;letter-spacing:0.2em;color:${c.ink};">429 815</div>
     ${p(`Si no fuiste tú, ignora este correo o <a href="https://flow.example/security" style="color:${c.accent};">revisa tu cuenta</a>.`)}`,
  ),
};

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
for (const [name, html] of Object.entries(templates)) writeFileSync(join(DIST, name), html);
console.log(
  `✓ mailings built → dist/ (${Object.keys(templates).length} plantillas, colores desde tokens)`,
);
