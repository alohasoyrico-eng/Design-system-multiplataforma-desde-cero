#!/usr/bin/env node
// Flow · check-foundations — porte del chequeo de la referencia canonica al
// repo de implementacion: verifica los criterios automatizados de foundations
// contra src/tokens/*.css. Sin dependencias. Node 18+.
//   node scripts/check-foundations.mjs [--json]
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TOK = join(ROOT, 'src', 'tokens');
const read = f => readFileSync(join(TOK, f), 'utf8');
const readRef = () => readdirSync(join(TOK, 'ref')).filter(f => f.endsWith('.css'))
  .map(f => readFileSync(join(TOK, 'ref', f), 'utf8')).join('\n');

// --- parseo -----------------------------------------------------------------
// Declaraciones del bloque :root, ignorando @media. El bloque de
// prefers-reduced-motion redeclara a proposito: no es duplicado.
function declsOf(css, { insideMedia = false } = {}) {
  const out = {};
  let depth = 0, media = 0, dens = 0, buf = '';
  const src = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (ch === '{') { depth++; if (/@media[^{]*$/.test(buf)) media = depth; if (/data-density[^{]*$/.test(buf)) dens = depth; buf = ''; continue; }
    if (ch === '}') { if (media === depth) media = 0; if (dens === depth) dens = 0; depth--; buf = ''; continue; }
    if (ch === ';') {
      const m = buf.match(/(--[\w-]+)\s*:\s*([\s\S]+)/);
      if (m && dens === 0 && (insideMedia ? media > 0 : media === 0)) out[m[1]] = m[2].trim();
      buf = ''; continue;
    }
    buf += ch;
  }
  const m = buf.match(/(--[\w-]+)\s*:\s*([\s\S]+)/);
  if (m && dens === 0 && (insideMedia ? media > 0 : media === 0)) out[m[1]] = m[2].trim();
  return out;
}

const light = { ...declsOf(readRef()), ...declsOf(read('colors.css')), ...declsOf(read('typography.css')),
  ...declsOf(read('spacing.css')), ...declsOf(read('shape.css')),
  ...declsOf(read('motion.css')), ...declsOf(read('elevation.css')),
  ...declsOf(read('dataviz.css')), ...declsOf(read('a11y.css')), ...declsOf(read('products.css')) };
const darkOverrides = declsOf(read('dark.css'));
const dark = { ...light, ...darkOverrides };
const reduced = declsOf(read('motion.css'), { insideMedia: true });

// --- color ------------------------------------------------------------------
const resolve = (v, map, guard = 0) => {
  if (v == null || guard > 10) return v;
  const next = v.replace(/var\((--[\w-]+)[^)]*\)/g, (all, n) => map[n] ?? all);
  return next === v ? v : resolve(next, map, guard + 1);
};
const toRgb = s => {
  if (!s) return null;
  const h = s.match(/#([0-9a-f]{3}|[0-9a-f]{6})\b/i);
  if (h) { let x = h[1]; if (x.length === 3) x = [...x].map(c => c + c).join('');
    return { rgb: [0, 2, 4].map(i => parseInt(x.slice(i, i + 2), 16)), a: 1 }; }
  const r = s.match(/rgba?\(([^)]+)\)/i);
  if (r) { const p = r[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 }; }
  return null;
};
const over = (fg, bg) => fg.a >= 1 ? fg.rgb : fg.rgb.map((c, i) => c * fg.a + bg.rgb[i] * (1 - fg.a));
const lum = c => { const a = c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; };
const contrast = (a, b) => { const l1 = lum(a), l2 = lum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };

// Pares del sistema. 'on' es la superficie sobre la que se compone un fondo
// semitransparente: sin ella el par no es medible (criterio col-2).
const PAIRS = [
  ['--text-primary', '--surface-canvas'], ['--text-primary', '--surface-card'],
  ['--text-secondary', '--surface-card'], ['--text-muted', '--surface-card'],
  ['--text-accent', '--surface-card'], ['--text-link', '--surface-card'],
  ['--text-on-accent', '--action-accent'],   // Button/IconButton variant accent
  ['--text-on-inverse', '--action-primary'], // Button/IconButton variant primary
  ['--text-on-inverse', '--surface-inverse'],
  ['--status-success-text', '--status-success-bg', '--surface-card'],
  ['--status-warning-text', '--status-warning-bg', '--surface-card'],
  ['--status-danger-text', '--status-danger-bg', '--surface-card'],
  ['--status-info-text', '--status-info-bg', '--surface-card'],
  ['--viz-label', '--surface-card'],
];
// Excepciones declaradas de col-3: un token semantico sin contrapartida en
// dark.css porque su valor funciona en ambos modos. Se declara o falla.
const DARK_EXEMPT = new Set([
  // Identidad de avatar: color determinista por nombre — la misma persona tiene
  // el mismo color en ambos modos. El contraste que importa es con sus propias
  // iniciales blancas (mismos hex que la referencia, medidos: 4.59-4.63:1).
  '--avatar-1', '--avatar-2', '--avatar-3', '--avatar-4', '--avatar-5', '--avatar-6',
  // Fondos de ilustracion: decorativos, sin texto que exija contraste.
  '--illustration-1', '--illustration-2', '--illustration-3',
  '--illustration-4', '--illustration-5', '--illustration-6',
  // Tarjeta fisica: color de artefacto — una tarjeta roja/tinta sigue igual de noche.
  '--card-fg-on-ink', '--card-fg-on-accent', '--card-dim-on-ink', '--card-dim-on-accent',
  // Velos de utilidad: una opacidad sobre lo que haya debajo es la misma
  // decision en ambos modos.
  '--alpha-black-5', '--alpha-black-8', '--alpha-black-12', '--alpha-black-15', '--alpha-black-50',
  '--alpha-white-5', '--alpha-white-10', '--alpha-white-12', '--alpha-white-15', '--alpha-white-20',
  '--alpha-white-25', '--alpha-white-30', '--alpha-white-35', '--alpha-white-50', '--alpha-white-70',
]);

const findings = [];
const fail = (criterion, msg) => findings.push({ criterion, level: 'must', msg });
const warn = (criterion, msg) => findings.push({ criterion, level: 'should', msg });

for (const mode of ['light', 'dark']) {
  const map = mode === 'light' ? light : dark;
  for (const [fgN, bgN, onN] of PAIRS) {
    const fg = toRgb(resolve(map[fgN], map)), bg = toRgb(resolve(map[bgN], map));
    if (!fg || !bg) { fail('col-2', `${mode}: ${fgN} / ${bgN} no resuelve a un color medible`); continue; }
    let bgFlat = bg;
    if (bg.a < 1) {
      const on = toRgb(resolve(map[onN], map));
      if (!on) { fail('col-2', `${mode}: ${bgN} es semitransparente y su par no declara superficie de composicion`); continue; }
      bgFlat = { rgb: over(bg, on), a: 1 };
    }
    const r = contrast(over(fg, bgFlat), bgFlat.rgb);
    if (r < 4.5) fail('col-2', `${mode}: ${fgN} sobre ${bgN} da ${r.toFixed(2)}:1 (minimo 4.5)`);
  }
}

const isRef = k => k.startsWith('--ref-') || k.startsWith('--flow-'); // ref y rampas de marca: capa de referencia
const semantic = Object.keys(declsOf(read('colors.css'))).filter(k => !isRef(k));
for (const k of semantic) {
  if (k in darkOverrides || DARK_EXEMPT.has(k)) continue;
  const v = light[k];
  const alias = v && v.match(/^var\((--[\w-]+)/);
  // alias a un token que si se sobrescribe: hereda el modo oscuro
  if (alias && (alias[1] in darkOverrides)) continue;
  fail('col-3', `${k} no tiene contrapartida en dark.css ni es alias de uno que la tenga`);
}
const danger = resolve(light['--status-danger'], light), brand = resolve(light['--action-accent'], light);
if (danger && brand && danger.toLowerCase() === brand.toLowerCase())
  fail('col-5', 'danger y el rojo de marca resuelven al mismo valor');

// --- spacing ----------------------------------------------------------------
for (const [k, v] of Object.entries(declsOf(read('spacing.css')))) {
  if (k.startsWith('--bp-') || k.startsWith('--density-')) continue; // breakpoints y mandos de densidad no son pasos de la escala (el canon prescribe 14px de celda estandar)
  const px = parseFloat(resolve(v, light));
  if (/px$/.test(v) && px % 4 !== 0) fail('spc-1', `${k} = ${v} no es multiplo de 4px`);
}
const hit = parseFloat(resolve(light['--hit-target-min'] || light['--ref-size-hit-min'] || light['--hit-min'] || '0', light));
if (!(hit >= 44)) fail('spc-2', `--hit-target-min es ${hit || 'inexistente'}px; el minimo es 44`);

// --- shape ------------------------------------------------------------------
const radii = ['--radius-xs', '--radius-sm', '--radius-md', '--radius-lg', '--radius-xl']
  .map(k => [k, parseFloat(resolve(light[k], light))]);
for (let i = 1; i < radii.length; i++)
  if (!(radii[i][1] > radii[i - 1][1]))
    fail('shp-1', `${radii[i][0]} (${radii[i][1]}px) no es mayor que ${radii[i - 1][0]} (${radii[i - 1][1]}px)`);

// --- motion -----------------------------------------------------------------
const DURS = ['--dur-instant', '--dur-fast', '--dur-base', '--dur-slow'];
for (const k of DURS) {
  const ms = parseFloat(resolve(light[k], light));
  if (!(ms >= 100 && ms <= 400)) fail('mot-1', `${k} = ${light[k]} fuera del rango 100-400ms`);
}
const TRANSFORMS = ['--lift-hover', '--press-scale', '--hover-scale'];
for (const k of [...DURS, ...TRANSFORMS]) {
  if (!(k in reduced)) fail('mot-2', `${k} no se anula en el bloque prefers-reduced-motion`);
  else if (DURS.includes(k) && parseFloat(reduced[k]) > 1)
    fail('mot-2', `${k} en reduced-motion es ${reduced[k]}; deberia ser 1ms`);
}

// --- typography -------------------------------------------------------------
for (const [k, v] of Object.entries(declsOf(read('typography.css')))) {
  if (!k.startsWith('--type-')) continue;
  const hasSize = /\d/.test(v), hasFam = /var\(--font-/.test(v) || /[A-Za-z]{3,}/.test(v.replace(/var\([^)]*\)/g, ''));
  if (!(hasSize && hasFam)) warn('typ-2', `${k} no parece un shorthand completo (familia + tamano + linea): ${v}`);
}
for (const k of ['--font-display', '--font-body', '--font-mono']) {
  const fam = (light[k] || '').split(',')[0].replace(/['"]/g, '').trim();
  if (fam && !read('fonts.css').includes(fam))
    fail('typ-3', `la familia ${fam} de ${k} no esta declarada en tokens/fonts.css`);
}

// --- salida -----------------------------------------------------------------
const blocking = findings.filter(f => f.level === 'must');
if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ ok: blocking.length === 0, findings }, null, 2));
} else {
  const byCrit = {};
  for (const f of findings) (byCrit[f.criterion] ||= []).push(f.msg);
  if (!findings.length) console.log('foundations: 7 contratos, todos los criterios automatizados pasan.');
  for (const [c, msgs] of Object.entries(byCrit)) {
    console.log(`\n${c} — ${msgs.length} ${msgs.length === 1 ? 'hallazgo' : 'hallazgos'}`);
    for (const m of msgs) console.log('  · ' + m);
  }
  console.log(`\n${blocking.length} bloqueantes, ${findings.length - blocking.length} avisos.`);
}
process.exit(blocking.length ? 1 : 0);
