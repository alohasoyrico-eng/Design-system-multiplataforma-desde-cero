#!/usr/bin/env node
// Flow · check-color — verifica col-1 sobre el arbol de componentes:
// ningun color literal ni alcance a la capa de referencia fuera de tokens/.
// Sin dependencias. Node 18+.
//   node platforms/check-color.mjs [--json]
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIRS = ['primitives', 'components', 'ui_kits'];

// Excepciones declaradas. Una excepcion sin motivo escrito es un defecto sin
// registrar: si algo entra aqui, entra con su razon.
const EXCEPCIONES = [
  {
    archivo: 'primitives/FlowChart.jsx',
    motivo: 'Lee los tokens del DOM en runtime para pasarlos a ECharts, que no entiende var(). ' +
      'Los hex son el ultimo recurso de cada lectura, no una decision de diseno: si el token existe, gana. ' +
      'Y los dos de la linea del calculo de contraste (#000000 y #FFFFFF) son los extremos del algoritmo, no colores del sistema.',
    solo: 'hex',
  },
  {
    archivo: 'primitives/FlowChart.jsx',
    motivo: 'shadowColor de enfasis dentro del lienzo: el canvas de ECharts no entiende var(). ' +
      'La sombra del tooltip (DOM) si consume var(--shadow-float).',
    solo: 'func',
  },
  {
    archivo: 'components/PaymentCard.jsx',
    motivo: 'Color de artefacto tambien en los velos: el brillo del chip, el velo de congelado y las ' +
      'sombras de texto sobre la tarjeta fisica no cambian con el modo.',
    solo: 'func',
  },
  {
    archivo: 'ui_kits/ios-frame.jsx',
    motivo: 'Marco de iPhone solo para demos moviles; el handoff lo declara fuera del DS a portar. ' +
      'Dibuja un artefacto fisico — biseles, isla dinamica, barra de estado — cuyos colores no son de interfaz.',
  },
  {
    carpeta: 'ui_kits/mailings/',
    motivo: 'HTML de email: Gmail y Outlook no soportan custom properties, asi que el hex es el medio, no una deriva. ' +
      'Los valores replican los tokens a mano — su README documenta la restriccion y el mapeo.',
  },
  {
    archivo: 'components/PaymentCard.jsx',
    motivo: 'Color de artefacto: una tarjeta roja sigue siendo roja en modo oscuro. Alcanza --flow-* a proposito ' +
      'porque su color no es semantico, es fisico. Los valores viven en tokens (--card-fg-*, --card-dim-*).',
    solo: 'ref',
  },
];

const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const FUNC = /\b(rgba?|hsla?)\s*\(/g;
const REF = /var\(\s*(--flow-[\w-]+)/g;

function archivos(dir) {
  const out = [];
  const rec = (d) => {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (statSync(p).isDirectory()) rec(p);
      else if (/\.(jsx|html)$/.test(n)) out.push(p);
    }
  };
  try { rec(join(ROOT, dir)); } catch (e) {}
  return out;
}

const hallazgos = [];
for (const dir of DIRS) {
  for (const abs of archivos(dir)) {
    const rel = relative(ROOT, abs).split('\\').join('/');
    const exc = EXCEPCIONES.filter((e) => e.archivo === rel || (e.carpeta && rel.startsWith(e.carpeta)));
    const exento = (tipo) => exc.some((e) => !e.solo || e.solo === tipo);
    const src = readFileSync(abs, 'utf8');
    src.split('\n').forEach((linea, i) => {
      // Un color dentro de un comentario es prosa, no una decision.
      const code = linea.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '');
      const pos = (m) => ({ archivo: rel, linea: i + 1, valor: m, texto: code.trim().slice(0, 90) });
      if (!exento('hex')) for (const m of code.matchAll(HEX)) hallazgos.push({ regla: 'col-1', tipo: 'hex', ...pos(m[0]) });
      if (!exento('func')) for (const m of code.matchAll(FUNC)) hallazgos.push({ regla: 'col-1', tipo: 'func', ...pos(m[1] + '()') });
      if (!exento('ref')) for (const m of code.matchAll(REF)) hallazgos.push({ regla: 'col-1', tipo: 'ref', ...pos(m[1]) });
    });
  }
}

const MENSAJE = {
  hex: 'color literal: usa un token semantico o el modo oscuro se rompe',
  func: 'funcion de color literal: las sombras y los velos tambien son tokens',
  ref: 'alcance a la capa de referencia: --flow-* solo se consume dentro de tokens/',
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ ok: hallazgos.length === 0, total: hallazgos.length, hallazgos, excepciones: EXCEPCIONES }, null, 2));
} else if (!hallazgos.length) {
  console.log('color: ningun literal fuera de tokens/. ' + EXCEPCIONES.length + ' excepciones declaradas.');
} else {
  const porTipo = {};
  for (const h of hallazgos) (porTipo[h.tipo] ||= []).push(h);
  for (const [tipo, hs] of Object.entries(porTipo)) {
    console.log('\n' + tipo + ' — ' + hs.length + ' (' + MENSAJE[tipo] + ')');
    for (const h of hs) console.log('  ' + h.archivo + ':' + h.linea + '  ' + h.valor);
  }
  console.log('\n' + hallazgos.length + ' hallazgos. Excepciones declaradas: ' + EXCEPCIONES.map((e) => e.archivo || e.carpeta).join(', '));
}
process.exit(hallazgos.length ? 1 : 0);
