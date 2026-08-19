const SHELL_HEAD = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}body{margin:0;padding:0;width:100%!important;background-color:#F3F1ED}a{color:#E62D10}@media only screen and (max-width:600px){.flow-container{width:100%!important}.flow-px{padding-left:20px!important;padding-right:20px!important}}</style></head><body style="margin:0;padding:0;background-color:#F3F1ED;">`

const SHELL_OPEN = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F3F1ED;"><tr><td align="center" style="padding:32px 16px;"><table role="presentation" class="flow-container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;"><tr><td align="center" style="padding:0 0 24px;"><div style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:bold;color:#17171A;letter-spacing:-0.5px;">Flow</div></td></tr><tr><td style="background-color:#FFFFFF;border:1px solid #E0DDD7;border-radius:20px;overflow:hidden;">`

const SHELL_CLOSE = `</td></tr><tr><td class="flow-px" style="padding:28px 24px 0;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#8A8781;">Flow Mobility S.A. de C.V. · Av. Insurgentes Sur 1234, CDMX<br><a href="#" style="color:#8A8781;text-decoration:underline;">Preferencias</a> · <a href="#" style="color:#8A8781;text-decoration:underline;">Darse de baja</a><br><br>© 2026 Flow Mobility</td></tr></table></td></tr></table></body></html>`

const SP = (h: number) => `<div style="height:${h}px;line-height:${h}px;font-size:1px;">&nbsp;</div>`

const CTA = (text: string) => `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-radius:999px;background-color:#FF3617;"><a href="#" style="display:inline-block;padding:13px 26px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#FFFFFF;text-decoration:none;border-radius:999px;">${text}</a></td></tr></table>`

const HR = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="flow-px" style="padding:0 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #E0DDD7;"></table></td></tr></table>`

function wrap(preheader: string, body: string) {
  return `${SHELL_HEAD}<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;font-family:sans-serif;">${preheader}</div>${SHELL_OPEN}${body}${SHELL_CLOSE}`
}

function cell(content: string, padding = '32px 32px') {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="flow-px" style="padding:${padding};font-family:Arial,Helvetica,sans-serif;">${content}</td></tr></table>`
}

function eyebrow(text: string, color = '#8A8781') {
  return `<div style="font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:${color};">${text}</div>`
}

function heading(text: string) {
  return `<div style="font-size:22px;font-weight:bold;color:#17171A;">${text}</div>`
}

function body(text: string) {
  return `<div style="font-size:14px;color:#55534E;line-height:21px;">${text}</div>`
}

function kv(label: string, value: string, mono = false, last = false) {
  const border = last ? '' : 'border-bottom:1px solid #EEEBE6;'
  const ff = mono ? 'font-family:Courier New,monospace;' : ''
  return `<tr><td style="padding:8px 0;${border}">${label}</td><td align="right" style="padding:8px 0;${border}${ff}color:#17171A;font-weight:bold;">${value}</td></tr>`
}

export const RECIBO = wrap(
  'Cargo de $820.50 en Pemex Reforma con tu tarjeta Flow ••4821',
  cell([
    eyebrow('CARGO REGISTRADO'),
    SP(8),
    '<div style="font-size:34px;font-weight:bold;color:#17171A;">−$820.50</div>',
    SP(4),
    body('Pemex Reforma · hoy 14:32'),
  ].join(''), '32px 32px 20px') +
  HR +
  cell([
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;color:#55534E;">`,
    kv('Tarjeta', '•••• 4821 (Flota)', true),
    kv('Categoría', 'Combustible'),
    kv('Consumo', '42.3 L', true),
    kv('Conductor', 'Ana Sosa', false, true),
    `</table>`,
    SP(24),
    CTA('Ver detalle en Flow'),
    SP(16),
    `<div style="font-size:12.5px;color:#8A8781;line-height:18px;">¿No reconoces este cargo? <a href="#" style="color:#E62D10;font-weight:bold;">Repórtalo aquí</a> — tienes 90 días para disputarlo.</div>`,
  ].join(''), '20px 32px 32px'),
)

export const RESUMEN_SEMANAL = wrap(
  'Tu resumen semanal: 412 viajes, $48.2k ingresos',
  cell([
    eyebrow('RESUMEN SEMANAL'),
    SP(8),
    heading('Hola Marta, esto pasó del 1 al 7 de julio'),
    SP(16),
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>`,
    `<td width="50%" style="padding:0 8px 8px 0;"><div style="background:#FAF9F7;border:1px solid #EEEBE6;border-radius:12px;padding:16px;"><div style="font-size:12px;color:#8A8781;text-transform:uppercase;letter-spacing:0.5px;">Viajes</div><div style="font-size:28px;font-weight:bold;color:#17171A;">412</div><div style="font-size:12px;color:#2D8C41;">↑ 12%</div></div></td>`,
    `<td width="50%" style="padding:0 0 8px 8px;"><div style="background:#FAF9F7;border:1px solid #EEEBE6;border-radius:12px;padding:16px;"><div style="font-size:12px;color:#8A8781;text-transform:uppercase;letter-spacing:0.5px;">Ingreso</div><div style="font-size:28px;font-weight:bold;color:#17171A;">$48.2k</div><div style="font-size:12px;color:#2D8C41;">↑ 8%</div></div></td>`,
    `</tr><tr>`,
    `<td width="50%" style="padding:8px 8px 0 0;"><div style="background:#FAF9F7;border:1px solid #EEEBE6;border-radius:12px;padding:16px;"><div style="font-size:12px;color:#8A8781;text-transform:uppercase;letter-spacing:0.5px;">Gasto combustible</div><div style="font-size:28px;font-weight:bold;color:#17171A;">$18.4k</div><div style="font-size:12px;color:#2D8C41;">↓ 4%</div></div></td>`,
    `<td width="50%" style="padding:8px 0 0 8px;"><div style="background:#FAF9F7;border:1px solid #EEEBE6;border-radius:12px;padding:16px;"><div style="font-size:12px;color:#8A8781;text-transform:uppercase;letter-spacing:0.5px;">Alertas abiertas</div><div style="font-size:28px;font-weight:bold;color:#E62D10;">3</div><div style="font-size:12px;color:#2D8C41;">↓ 2</div></div></td>`,
    `</tr></table>`,
    SP(24),
    `<div style="font-size:14px;font-weight:bold;color:#17171A;margin-bottom:12px;">Requiere tu atención</div>`,
    `<div style="padding:12px 16px;background:#FFF8F0;border:1px solid #F5D0A9;border-radius:10px;margin-bottom:8px;font-size:13px;color:#55534E;"><span style="font-weight:bold;color:#17171A;">KTR-882-A</span> consumo 38% sobre promedio esta semana</div>`,
    `<div style="padding:12px 16px;background:#FFF8F0;border:1px solid #F5D0A9;border-radius:10px;font-size:13px;color:#55534E;"><span style="font-weight:bold;color:#17171A;">PLQ-472-D</span> tag de peaje vence en 5 días</div>`,
    SP(24),
    CTA('Ver dashboard completo'),
  ].join('')),
)

export const ALERTA_SEGURIDAD = wrap(
  'Nuevo inicio de sesión detectado — verifica tu identidad',
  cell([
    `<div style="width:44px;height:44px;border-radius:50%;background:#FFF3E0;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;"><span style="font-size:22px;">🔒</span></div>`,
    eyebrow('NUEVO INICIO DE SESIÓN', '#D97706'),
    SP(8),
    heading('Verifica que fuiste tú'),
    SP(12),
    body('Detectamos un inicio de sesión en un dispositivo que no habíamos visto antes. Si fuiste tú, ignora este correo. Si no, protege tu cuenta.'),
    SP(20),
    `<div style="background:#FAF9F7;border:1px solid #EEEBE6;border-radius:12px;padding:20px;">`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:13px;color:#55534E;">`,
    kv('Dispositivo', 'Windows / Chrome 126'),
    kv('Ubicación', 'Ciudad de México, MX'),
    kv('Hora', 'hoy 09:14', false, true),
    `</table></div>`,
    SP(24),
    `<div style="text-align:center;">`,
    `<div style="font-size:12px;color:#8A8781;margin-bottom:8px;">Código de verificación</div>`,
    `<div style="font-family:Courier New,monospace;font-size:32px;font-weight:bold;color:#17171A;letter-spacing:6px;">482 917</div>`,
    `<div style="font-size:12px;color:#8A8781;margin-top:6px;">Válido por 10 minutos</div>`,
    `</div>`,
    SP(20),
    body('¿No fuiste tú? <a href="#" style="color:#E62D10;font-weight:bold;">Protege tu cuenta ahora</a>.'),
  ].join('')),
)

export const INVITACION_EQUIPO = wrap(
  'Marta Vidal te invitó a unirte a Transportes Vidal en Flow',
  cell([
    eyebrow('INVITACIÓN AL EQUIPO'),
    SP(8),
    heading('Marta Vidal te invitó a unirte a Transportes Vidal en Flow'),
    SP(12),
    body('Se te ha asignado el rol de <strong>Operaciones</strong> — podrás ver las unidades de la flota, editar información operativa y exportar reportes.'),
    SP(20),
    `<div style="background:#FAF9F7;border:1px solid #EEEBE6;border-radius:12px;padding:20px;">`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:13px;color:#55534E;">`,
    kv('Empresa', 'Transportes Vidal S.A.'),
    kv('Rol', 'Operaciones'),
    kv('Invitado por', 'Marta Vidal', false, true),
    `</table></div>`,
    SP(20),
    body('La invitación expira en <strong>7 días</strong>.'),
    SP(24),
    CTA('Aceptar invitación'),
  ].join('')),
)

export const BIENVENIDA = wrap(
  'Bienvenida a Flow — tu cuenta está verificada',
  cell([
    eyebrow('CUENTA VERIFICADA', '#2D8C41'),
    SP(8),
    heading('Bienvenida a Flow, Ana'),
    SP(12),
    body('Tu identidad está verificada y tu primera tarjeta lista. Aquí van tres cosas para empezar:'),
    SP(20),
    `<div style="display:flex;flex-direction:column;gap:0;">`,
    ...[
      ['1', 'Activa notificaciones', 'Sabrás al instante de cada cargo, alerta o aprobación pendiente.'],
      ['2', 'Configura Face ID / huella', 'Acceso rápido sin contraseña cada vez que abras la app.'],
      ['3', 'Explora "Rutas"', 'Te muestra la gasolinera más barata cerca de ti — el favorito de los conductores.'],
    ].map(([num, title, desc]) =>
      `<div style="display:flex;gap:14px;padding:14px 0;${num !== '3' ? 'border-bottom:1px solid #EEEBE6;' : ''}"><div style="width:28px;height:28px;border-radius:50%;background:#FF3617;color:#FFFFFF;font-weight:bold;font-size:13px;display:inline-flex;align-items:center;justify-content:center;flex:none;">${num}</div><div><div style="font-size:14px;font-weight:bold;color:#17171A;">${title}</div><div style="font-size:13px;color:#55534E;line-height:19px;margin-top:2px;">${desc}</div></div></div>`
    ),
    `</div>`,
    SP(24),
    CTA('Abrir Flow'),
  ].join('')),
)

export interface MailTemplate {
  id: string
  label: string
  html: string
}

export const MAIL_TEMPLATES: MailTemplate[] = [
  { id: 'recibo', label: 'Recibo', html: RECIBO },
  { id: 'resumen', label: 'Resumen semanal', html: RESUMEN_SEMANAL },
  { id: 'alerta', label: 'Alerta de seguridad', html: ALERTA_SEGURIDAD },
  { id: 'invitacion', label: 'Invitación al equipo', html: INVITACION_EQUIPO },
  { id: 'bienvenida', label: 'Bienvenida', html: BIENVENIDA },
]
