#!/usr/bin/env node
// Flow · build-bundle — regenera _ds_bundle.js desde primitives/ y components/.
// El bundle es un script plano: NO transpila. Si un archivo trae JSX, este
// generador se niega en vez de emitirlo, porque JSX crudo dentro de un <script>
// normal tumba window.Flow entero y el error aparece a 4000 lineas de distancia.
// Ese fallo ya ocurrio una vez, regenerando TopBar.jsx a mano.
//
//   node platforms/build-bundle.mjs [--check]
//
// --check no escribe: solo dice si el bundle esta al dia. Para CI.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = join(ROOT, '_ds_bundle.js');
const orden = JSON.parse(readFileSync(join(ROOT, 'platforms/bundle-order.json'), 'utf8'));

// Nombre exportado por archivo: el basename, salvo los que exportan mas de uno.
const EXTRA = { 'primitives/Toast.jsx': ['Toast', 'ToastStack'], 'primitives/Flag.jsx': ['Flag', 'ensureFlagCss'] };
// Cualquier nombre que el bundle exporte puede ser referenciado desde otra
// seccion, asi que la lista se deriva del propio orden en vez de mantenerse a
// mano. Mantenerla a mano ya fallo una vez: FilterableEditableTable paso a
// componer Input, Input no estaba en la lista, y la seccion quedo referenciando
// un identificador que no existe dentro de su IIFE.
const CRUZADOS = orden.map((r) => r.split('/').pop().replace('.jsx', ''))
  .concat(['ToastStack', 'ensureFlagCss']);

const traeJSX = (src) => {
  // El JSX aparece en posicion de expresion: tras (, return, =>, coma o ternario.
  // La version anterior solo quitaba comentarios y cadenas y daba falso positivo
  // con FlowChart, que trae un '</span>' dentro de una cadena de tooltip de
  // ECharts con comillas escapadas. Esa deteccion equivocada mantuvo el archivo
  // marcado como intocable durante toda la remediacion.
  const limpio = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  return /(?:^|[(,=>?:{[]|\breturn)\s*<(?:>|[A-Za-z][\w.]*[\s/>])/m.test(limpio);
};

// Los que siguen en JSX no se re-emiten: se copian tal cual del bundle vigente,
// que ya esta transpilado. Es deuda, no solucion — se avisa en cada corrida y
// significa que un cambio en esas fuentes NO llega al bundle.
const vigente = readFileSync(SALIDA, 'utf8');
const pendientes = [];

const copiarDelVigente = (ruta) => {
  const cabecera = '// ---- ' + ruta + ' ---- ';
  const i = vigente.indexOf(cabecera.trimEnd());
  if (i < 0) {
    console.error('RECHAZADO  ' + ruta + ' trae JSX y no hay seccion previa que copiar.');
    process.exit(2);
  }
  let j = vigente.indexOf('// ---- ', i + cabecera.length);
  if (j < 0) j = vigente.indexOf('window.Flow = F;', i);
  return vigente.slice(i, j);
};

const seccion = (ruta) => {
  const src = readFileSync(join(ROOT, ruta), 'utf8');
  if (traeJSX(src)) { pendientes.push(ruta); return copiarDelVigente(ruta); }
  const nombres = EXTRA[ruta] || [ruta.split('/').pop().replace('.jsx', '')];
  let cuerpo = src
    .replace(/^import .*;\s*$/gm, '')
    .replace(/^export (function|const) /gm, '$1 ')
    .trim();
  // Las referencias entre archivos se resuelven por el namespace, no por closure.
  for (const n of CRUZADOS) {
    if (nombres.includes(n)) continue;
    cuerpo = cuerpo.replace(new RegExp('React\\.createElement\\(' + n + ',', 'g'), 'React.createElement(F.' + n + ',');
  }
  const exports = nombres.map((n) => 'F.' + n + ' = ' + n + ';').join('\n');
  return '// ---- ' + ruta + ' ----\n(function(){\n\n' + cuerpo + '\n\n' + exports + '\n})();\n\n';
};

const salida = '/* Flow DS bundle — generado por platforms/build-bundle.mjs. No editar a mano. */\n'
  + '(function(){\n"use strict";\nvar React = window.React;\n'
  + 'if (!React) { console.error("Flow bundle: React must load first"); return; }\nvar F = {};\n\n'
  + orden.map(seccion).join('')
  + 'window.Flow = F;\n})();\n';

if (process.argv.includes('--check')) {
  const actual = readFileSync(SALIDA, 'utf8');
  if (actual === salida) { console.log('bundle al dia (' + orden.length + ' secciones).'); process.exit(0); }
  console.error('el bundle no coincide con las fuentes. Corre: node platforms/build-bundle.mjs');
  process.exit(1);
}
writeFileSync(SALIDA, salida);
console.log('bundle regenerado: ' + orden.length + ' secciones, ' + salida.length + ' chars.');
if (pendientes.length) {
  console.warn('\nAVISO — ' + pendientes.length + ' archivo(s) en JSX, copiados del bundle anterior sin regenerar:');
  for (const p of pendientes) console.warn('  ' + p);
  console.warn('Un cambio en esas fuentes no llega al bundle hasta reescribirlas en React.createElement.');
}
