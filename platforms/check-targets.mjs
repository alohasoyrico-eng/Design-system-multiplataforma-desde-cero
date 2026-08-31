#!/usr/bin/env node
// Flow · check-targets — verifica a11y-2 sobre las fuentes: ningun objetivo
// operable declara un alto o ancho literal por debajo de --hit-target-min.
// Sin dependencias. Node 18+.
//   node platforms/check-targets.mjs [--json]
//
// Por que existe: el defecto no aparecio una vez, aparecio en Button, en
// ControlShell, en Chip, en Tabs y en doce componentes mas. Ninguno lo violaba
// por descuido puntual: cada uno traia su propia tabla de alturas. El patron no
// es el olvido, es que la altura se decidia por componente.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MINIMO = 44;

// Excepciones declaradas: medidas que el escaner ve como objetivo y no lo son.
const EXCEPCIONES = [
  { archivo: 'primitives/shells/DataGrid.jsx', motivo: 'width de una columna <td>, no de un control.' },
  { archivo: 'components/OTPInput.jsx', motivo: 'La barra de 2x24 es el cursor dibujado, aria-hidden. El objetivo real es el input que cubre las casillas.' },
];

// Las plantillas son .html con JSX en linea: el boton a mano de 32px que se repetia
// en siete de ellas no lo veia nadie, porque el escaner solo miraba las fuentes de
// componente. Un suelo se salta igual de facil desde arriba.
const OPERABLE = /createElement\('button'|createElement\('input'|<button|<input|role="?button"?|role: '(button|tab|menuitem|option|switch|slider)'|onClick|type: 'button'/;

// Tablas de tamanos: la medida no siempre esta en una declaracion de estilo.
// IconButton tenia { sm: { d: 36 } } y el escaner no lo veia, porque 'd' no es
// una propiedad CSS. Cualquier tabla con sm/md/lg cuenta como tabla de tamanos.
const TABLA = /\b(sm|md|lg)\s*:\s*\{?[^}\n]*?\b(d|h|height|size)\s*:\s*(\d+(?:\.\d+)?)/g;

function fuentes(dir) {
  const out = [];
  const rec = (d) => {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (statSync(p).isDirectory()) rec(p);
      else if (n.endsWith('.jsx') || n.endsWith('.html')) out.push(p);
    }
  };
  try { rec(join(ROOT, dir)); } catch (e) {}
  return out;
}

const hallazgos = [];
for (const dir of ['primitives', 'components', 'ui_kits']) {
  for (const abs of fuentes(dir)) {
    const rel = relative(ROOT, abs).split('\\').join('/');
    if (EXCEPCIONES.some((e) => e.archivo === rel)) continue;
    const src = readFileSync(abs, 'utf8');
    src.split('\n').forEach((linea, i) => {
      for (const m of linea.replace(/\/\/.*$/, '').matchAll(TABLA)) {
        const v = parseFloat(m[3]);
        if (v >= 20 && v < MINIMO) hallazgos.push({ archivo: rel, linea: i + 1, prop: 'tabla ' + m[1] + '.' + m[2], valor: v, texto: linea.trim().slice(0, 80) });
      }
    });
    const lineas = src.split('\n');
    lineas.forEach((linea, i) => {
      const code = linea.replace(/\/\/.*$/, '');
      // El entorno decide si la medida pertenece a algo que se toca.
      // Una imagen o un icono dentro de un enlace no es el objetivo: el objetivo
      // es el enlace. El logo de los dashboards media 24 de alto y el <a> que lo
      // envuelve ya declara --hit-target-min.
      if (/<img|<svg/.test(code)) return;
      const ctx = lineas.slice(Math.max(0, i - 6), i + 3).join(' ');
      if (!OPERABLE.test(ctx)) return;
      // Si la misma declaracion trae la otra dimension por debajo de 20, la caja
      // es una linea o una barra: un asa de 40x5 no es un objetivo tactil.
      const otras = [...code.matchAll(/\b(minHeight|height|minWidth|width)\s*:\s*(\d+(?:\.\d+)?)\b/g)].map((x) => parseFloat(x[2]));
      const esAdorno = otras.some((v) => v < 20);
      for (const m of code.matchAll(/\b(minHeight|height|minWidth|width)\s*:\s*(\d+(?:\.\d+)?)\b/g)) {
        const v = parseFloat(m[2]);
        // Por debajo de 20 es un adorno (punto, barra, linea), no un objetivo.
        if (v >= 20 && v < MINIMO && !esAdorno) hallazgos.push({ archivo: rel, linea: i + 1, prop: m[1], valor: v, texto: code.trim().slice(0, 80) });
      }
    });
  }
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ ok: hallazgos.length === 0, total: hallazgos.length, minimo: MINIMO, hallazgos, excepciones: EXCEPCIONES }, null, 2));
} else if (!hallazgos.length) {
  console.log('objetivos: ninguna medida literal por debajo de ' + MINIMO + 'px. ' + EXCEPCIONES.length + ' excepciones declaradas.');
} else {
  console.log('a11y-2 — ' + hallazgos.length + ' objetivo(s) por debajo de ' + MINIMO + 'px:');
  for (const h of hallazgos) console.log('  ' + h.archivo + ':' + h.linea + '  ' + h.prop + ': ' + h.valor);
  console.log('\nUsa var(--hit-target-min). El glifo puede seguir siendo pequeno; el area no.');
}
process.exit(hallazgos.length ? 1 : 0);
