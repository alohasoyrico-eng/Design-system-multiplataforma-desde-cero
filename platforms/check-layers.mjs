#!/usr/bin/env node
// Flow — revision de capas. Node 18+, cero dependencias.
//
//   node platforms/check-layers.mjs                 revisa este repo de referencia
//   node platforms/check-layers.mjs --target src    revisa un codebase real
//   node platforms/check-layers.mjs --json          salida para CI
//
// Que revisa (ver architecture.json y "Arquitectura de capas.dc.html"):
//   R1  las dependencias solo van hacia abajo
//   R2  una variante no es un item — nada absorbido sobrevive: ni archivo, ni entrada, ni mencion en texto
//   R3  una carcasa, un dueno — fuera de los shells nadie redibuja borde/backdrop/keyframes
//   R4  la composicion no se filtra a la API publica
//   P1  ninguna ruta del registry usa expansion con llaves: la forma que no se puede verificar no existe
//   P2  toda ruta del registry existe en disco
//   P4  un item no declara dos veces lo mismo: demo y demos a la vez pinta la demo dos veces
//   P5  todo contrato casa con un item del registry, salvo los shells (que no se publican)
//   P6  la capa declarada coincide con la recomputada desde el artefacto
//   P7  todo anclaje ?item= existe como seccion en su demo (si no, el iframe sale en blanco sin error)
//   P8  ningun campo del registry es metadata muerta: la docs tiene que leerlo
//   P9  toda prop documentada existe en la firma real del componente
//   P10 toda prop real esta documentada (el hueco espejo: se omitio label y la barra quedo sin nombre)
//   P11 todo callback de un shell tiene al menos un consumidor que lo pasa
//   P3  cobertura de contratos (ratchet: puede subir, no bajar)

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const asJson = args.includes('--json');
const targetIdx = args.indexOf('--target');
const TARGET = targetIdx > -1 ? args[targetIdx + 1] : null;

const arch = JSON.parse(readFileSync(join(ROOT, 'architecture.json'), 'utf8'));
const ORDER = {};
arch.layers.forEach((l) => { ORDER[l.id] = l.order; });
const SHELL_IDS = new Set(arch.shells);

const problems = [];
const notes = [];
const fail = (rule, where, msg) => problems.push({ rule, where, msg });

// ---------- utilidades ----------
function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const rel = (p) => relative(ROOT, p).split('\\').join('/');
const isCode = (p) => /\.(jsx?|tsx?|mjs)$/.test(p);

function layerOfFile(relPath) {
  if (arch.fileLayers[relPath]) return arch.fileLayers[relPath];
  // La capa se lee de la carpeta. Es el criterio que el chequeo puede recomputar
  // sin creerle a nadie: mover un archivo cambia su capa, y R1 lo nota al instante.
  const m = relPath.match(/^(foundations|primitives|components|patterns|templates)\//);
  if (m) return m[1];
  return null;
}

function readRegistry() {
  const items = [];
  for (const l of arch.layers.map((x) => x.id)) {
    const p = join(ROOT, 'docs', 'registry-' + l + '.js');
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      if (!line.startsWith('{"id":"')) continue;
      try { items.push(JSON.parse(line.replace(/,\s*$/, ''))); }
      catch (e) { fail('P2', 'docs/registry-' + l + '.js', 'linea de item que no parsea como JSON'); }
    }
  }
  return items;
}

function readContracts() {
  const dir = join(ROOT, 'contracts');
  if (!existsSync(dir)) return {};
  const out = {};
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.json') || f === '_schema.json') continue;
    try { out[f.replace('.json', '')] = JSON.parse(readFileSync(join(dir, f), 'utf8')); }
    catch (e) { fail('P2', 'contracts/' + f, 'no parsea como JSON'); }
  }
  return out;
}

// Recorre todos los campos de string de un objeto. Los defectos mas caros de esta
// clase no son rutas: son frases que recomiendan un componente que ya no existe.
function strings(v, path = '', out = []) {
  if (typeof v === 'string') out.push({ path, value: v });
  else if (Array.isArray(v)) v.forEach((x, i) => strings(x, path + '[' + i + ']', out));
  else if (v && typeof v === 'object') Object.keys(v).forEach((k) => strings(v[k], path ? path + '.' + k : k, out));
  return out;
}

// ---------- R1: dependencias hacia abajo ----------
function checkR1(files) {
  for (const abs of files) {
    const p = rel(abs);
    const from = layerOfFile(p);
    if (!from) continue;
    const src = readFileSync(abs, 'utf8');
    const re = /(?:from|require\()\s*['"]([^'"]+)['"]/g;
    let m;
    while ((m = re.exec(src))) {
      const spec = m[1];
      if (!spec.startsWith('.')) continue; // externo: R1 solo mira el grafo del sistema
      let target = rel(resolve(dirname(abs), spec));
      if (!/\.[a-z]+$/.test(target)) {
        for (const ext of ['.jsx', '.js', '.tsx', '.ts']) {
          if (existsSync(join(ROOT, target + ext))) { target += ext; break; }
        }
      }
      const to = layerOfFile(target);
      if (!to) continue;
      const id = Object.keys(arch.fileLayers).includes(target)
        ? (arch.items.find((it) => it.src === target) || {}).id
        : null;
      // Misma capa solo si uno de los dos lados es shell: shells/ esta por debajo de
      // su capa, asi que tanto componer un shell como que un shell componga un primitive
      // siguen siendo dependencias hacia abajo.
      const isShell = /shells\//.test(target) || /shells\//.test(p) || (id && SHELL_IDS.has(id));
      if (ORDER[to] > ORDER[from]) {
        fail('R1', p, 'importa hacia arriba: ' + target + ' (' + to + ' > ' + from + ')');
      } else if (ORDER[to] === ORDER[from] && !isShell) {
        fail('R1', p, 'importa de su propia capa sin ser shell: ' + target);
      }
    }
  }
}

// ---------- R2: nada absorbido sobrevive ----------
function checkR2(items, contracts, files) {
  const absorbed = [];
  Object.keys(contracts).forEach((k) => {
    (contracts[k].supersedes || []).forEach((id) => absorbed.push({ id, by: k }));
  });
  if (!absorbed.length) { notes.push('R2: ningun contrato declara supersedes todavia'); return; }
  const ids = new Set(items.map((i) => i.id));
  const camel = (id) => id.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  // El nombre en prosa no siempre es la camelizacion del id: hay mayusculas
  // internas que el id no trae, y separadores (foo-bar como "Foo Bar"). Primera
  // letra de cada segmento en mayuscula, el resto sin distinguir caja, y hasta
  // tres caracteres de separacion entre segmentos.
  const seg = (s) => s.charAt(0).toUpperCase() + s.slice(1).split('').map((c) => (/[a-z]/.test(c) ? '[' + c + c.toUpperCase() + ']' : c)).join('');
  const nameBody = (id) => id.split('-').map(seg).join('[^A-Za-z0-9]{0,3}');

  for (const { id, by } of absorbed) {
    if (ids.has(id)) fail('R2', 'docs/registry-*.js', 'el item "' + id + '" sigue registrado y ' + by + ' declara haberlo absorbido');
    const name = camel(id);
    const body = nameBody(id);
    const stem = camel(by) + '.'; // Select. → Select.jsx, Select.d.ts, Select.prompt.md
    for (const abs of files) {
      const p = rel(abs);
      if (p.startsWith('contracts/') || p === 'SKILL.md' || p === 'readme.md') continue; // documentan la absorcion a proposito
      if (/^docs\/registry-/.test(p)) continue; // el registry se escanea por strings, con sus excepciones declaradas
      if (p.split('/').pop().startsWith(stem)) continue; // los archivos del absorbedor llevan su mapa de migracion
      const lineas = readFileSync(abs, 'utf8').split('\n');
      for (let i = 0; i < lineas.length; i++) {
        if (/absorb|supersed/i.test(lineas[i])) continue; // la linea documenta la absorcion, no recomienda al muerto
        if (new RegExp('(^|[^A-Za-z])' + body + '($|[^A-Za-z])').test(lineas[i])) {
          fail('R2', p + ':' + (i + 1), 'menciona "' + name + '", absorbido por ' + by);
          break;
        }
      }
    }
    // menciones en el texto del registry: el caso que un chequeo de rutas no ve.
    // Un item puede documentar la absorcion a proposito, pero tiene que declararlo
    // en documentsAbsorption: la intencion se declara, no se adivina.
    for (const it of items) {
      if (it.id === by || (it.documentsAbsorption || []).includes(id)) continue;
      for (const s of strings(it)) {
        if (/absorb|supersed/i.test(s.value)) continue;
        if (new RegExp('(^|[^A-Za-z\'])' + body + '($|[^A-Za-z\'])').test(s.value)) {
          fail('R2', 'registry:' + it.id + '.' + s.path, 'recomienda "' + name + '", que ya no existe');
        }
      }
    }
  }
}

// ---------- R3: una carcasa, un dueno ----------
const CARCASS = [
  { id: 'control', re: /var\(--border-focus\)[\s\S]{0,200}var\(--radius-(md|sm)\)|var\(--radius-(md|sm)\)[\s\S]{0,200}var\(--border-focus\)/, what: 'borde+foco+radio de control (es ControlShell)' },
  { id: 'backdrop', re: /position:\s*'?fixed'?[\s\S]{0,80}inset:\s*0/, what: 'backdrop fijo (es OverlayShell)' },
  { id: 'keyframes', re: /@keyframes/, what: '@keyframes propios (van en el shell o en la hoja de tokens)' },
];
function checkR3(files) {
  let count = 0;
  for (const abs of files) {
    const p = rel(abs);
    if (!isCode(abs)) continue;
    // ui_kits y docs SI se revisan: un template que redibuja una carcasa es la deriva
    // que R3 existe para atrapar, no un estilo inline legitimo.
    if (/shells\//.test(p) || /^tokens\//.test(p)) continue;
    const src = readFileSync(abs, 'utf8');
    for (const c of CARCASS) {
      if (c.re.test(src)) { count++; problems.push({ rule: 'R3', where: p, msg: 'declara ' + c.what, ratchet: true }); }
    }
  }
  notes.push('R3: ' + count + ' declaraciones de carcasa fuera de los shells (ratchet: este numero solo puede bajar)');
}

// ---------- R4: la composicion no se filtra a la API ----------
function checkR4(contracts) {
  Object.keys(contracts).forEach((k) => {
    const c = contracts[k];
    if (!c.api || !c.api.members || !c.composition) return;
    const declared = []
      .concat(c.composition.shells || [], c.composition.primitives || [], c.composition.components || [], c.composition.patterns || [])
      .map((x) => x.toLowerCase());
    for (const m of c.api.members) {
      if (declared.includes(String(m.name).toLowerCase())) {
        fail('R4', 'contracts/' + k + '.json', 'la prop "' + m.name + '" repite un nombre de composition: lo interno se volvio publico');
      }
    }
  });
}

// ---------- P1 y P2: rutas del registry ----------
function checkPaths(items) {
  for (const it of items) {
    // P4: dos campos para lo mismo. La pagina embebe los dos y la demo sale duplicada.
    if (it.demo && it.demos) {
      fail('P4', 'registry:' + it.id, 'declara demo y demos a la vez: la pagina de detalle pinta la demo dos veces. Deja uno.');
    }
    const paths = [];
    if (it.src) paths.push({ field: 'src', value: it.src });
    if (it.demo) paths.push({ field: 'demo', value: it.demo });
    (it.demos || []).forEach((d, i) => paths.push({ field: 'demos[' + i + '].src', value: d.src }));
    for (const { field, value } of paths) {
      // Toda forma que finge ser ruta y no se puede resolver: llaves, separadores,
      // varios archivos en una cadena. La forma que no se puede verificar no existe.
      if (/[{}*]/.test(value) || value.includes(' · ') || value.includes(', ')) {
        fail('P1', 'registry:' + it.id + '.' + field, 'no es una ruta resoluble: "' + value + '". Un item, un archivo; si necesita nombrar varios, van en srcs[].');
        continue;
      }
      const clean = value.split('?')[0].split('#')[0];
      const base = clean.startsWith('../') ? join(ROOT, 'docs', clean) : join(ROOT, clean.startsWith('demos/') ? 'docs/' + clean : clean);
      if (!existsSync(base)) fail('P2', 'registry:' + it.id + '.' + field, 'apunta a un archivo que no existe: ' + value);
    }
  }
}

// ---------- P11: el shell que expone y nadie cablea ----------
// Listbox exponia onActiveIdChange y Select no lo pasaba: aria-activedescendant
// nunca se emitio. Las dos mitades pasaban revision por separado.
function checkShellWiring(contracts, files) {
  const sources = files.filter((p) => /\.jsx$/.test(p)).map((p) => readFileSync(p, 'utf8'));
  Object.keys(contracts).forEach((k) => {
    const ct = contracts[k];
    if (!ct.shell || !ct.api || !ct.api.members) return;
    const src = ct.reference && ct.reference.src ? ct.reference.src : null;
    for (const m of ct.api.members) {
      if (m.kind !== 'event' && m.kind !== 'renderProp') continue;
      if (m.required) continue; // si es obligatoria, el consumidor no puede omitirla
      if (m.unusedByDesign) continue; // intencion declarada, no cable olvidado
      const used = sources.some((s, i) => {
        if (src && rel(files[i]) === src) return false; // el propio shell no cuenta
        return new RegExp('(^|[^\\w])' + m.name + '\\s*[:,}]').test(s);
      });
      if (!used) fail('P11', 'contracts/' + k + '.json', 'expone "' + m.name + '" y ningun consumidor lo pasa: la mitad declarada sin cablear');
    }
  });
}

// ---------- P9: documentacion sin implementacion ----------
// El espejo de P8: en vez de un campo que nadie lee, una prop que nadie implementa.
// Copiar el ejemplo de la docs no hace nada y nadie se enteraria.
function checkDocumentedProps(items) {
  for (const it of items) {
    if (!it.code || !it.code.props || !it.src || !/\.jsx$/.test(it.src)) continue;
    const abs = join(ROOT, it.src);
    if (!existsSync(abs)) continue;
    const src = readFileSync(abs, 'utf8');
    // Un archivo puede exportar varios componentes (Charts.jsx trae Sparkline y Bars)
    // y las firmas llevan defaults con llaves: hay que balancear, no cortar en la primera.
    const name = String(it.name).replace(/[^A-Za-z]/g, '') || it.id;
    const at = src.search(new RegExp('export (?:function|const) ' + name + '\\b'));
    if (at < 0) continue;
    const open = src.indexOf('({', at);
    if (open < 0) continue;
    let depth = 0, end = open + 1;
    for (; end < src.length; end++) {
      if (src[end] === '{') depth++;
      else if (src[end] === '}') { depth--; if (depth === 0) break; }
    }
    // Los literales de cadena pueden traer comas: hay que neutralizarlos antes de partir.
    const body = src.slice(open + 2, end)
      .replace(/'(?:[^'\\]|\\.)*'/g, "'S'")
      .replace(/"(?:[^"\\]|\\.)*"/g, "'S'")
      .replace(/\{[^}]*\}/g, 'O')
      .replace(/\[[^\]]*\]/g, 'A');
    const real = new Set(body.split(',').map((x) => x.split(/[=:]/)[0].trim()).filter(Boolean));
    if (real.has('...rest') || real.has('rest')) continue; // pasa props sueltas: no se puede afirmar
    const documented = new Set();
    for (const row of it.code.props) {
      const names = String(row[0]).split('/').map((x) => x.trim().replace(/\W+$/, ''));
      for (const nm of names) {
        if (!nm || nm === 'children' || nm === 'style') continue;
        documented.add(nm);
        if (!real.has(nm)) fail('P9', 'registry:' + it.id, 'documenta la prop "' + nm + '" y ' + it.src + ' no la recibe');
      }
    }
    // P10: lo que existe y nadie documento. Omitir label deja el control sin nombre accesible.
    for (const nm of real) {
      if (nm === 'children' || nm === 'style' || nm.startsWith('...')) continue;
      if (!documented.has(nm)) fail('P10', 'registry:' + it.id, 'la prop "' + nm + '" existe en ' + it.src + ' y no esta documentada');
    }
  }
}

// ---------- P8: metadata muerta ----------
// Un campo que nadie renderiza es una intencion que no llego a ningun lado. Pasa
// callado: escribes status/product/plannedNote esperando que se vean y la docs
// sigue diciendo lo contrario.
const FIELD_EXEMPT = new Set(['id', 'cat', 'layer', 'name', 'subtitle', 'src', 'srcs', 'demo', 'demoH', 'demos', 'function', 'documentsAbsorption', 'implements']);
function checkDeadFields(items) {
  const app = join(ROOT, 'docs', 'index.html');
  if (!existsSync(app)) return;
  const src = readFileSync(app, 'utf8');
  const seen = new Set();
  for (const it of items) for (const k of Object.keys(it)) seen.add(k);
  for (const k of seen) {
    if (FIELD_EXEMPT.has(k)) continue;
    if (src.indexOf('item.' + k) < 0 && src.indexOf('.' + k) < 0) {
      fail('P8', 'docs/index.html', 'el campo "' + k + '" existe en el registry y la docs no lo lee nunca: metadata muerta');
    }
  }
}

// ---------- P7: los anclajes de demo existen ----------
// Un ?item= que no casa con ninguna seccion no rompe nada: renderiza vacio y en
// silencio. Es la falla mas barata de detectar y la mas facil de dejar pasar.
function checkAnchors(items) {
  const cache = {};
  for (const it of items) {
    const urls = [];
    if (it.demo) urls.push({ field: 'demo', url: it.demo });
    (it.demos || []).forEach((d, i) => urls.push({ field: 'demos[' + i + '].src', url: d.src }));
    for (const { field, url } of urls) {
      if (url.indexOf('?item=') < 0) continue;
      const [file, qs] = url.split('?');
      const want = new URLSearchParams(qs).get('item');
      const abs = file.startsWith('../') ? join(ROOT, 'docs', file) : join(ROOT, 'docs', file);
      if (!existsSync(abs)) continue; // lo reporta P2
      // Heuristica deliberadamente laxa: cada demo filtra a su manera (LIST de
      // secciones, comparacion directa contra el parametro). Lo unico comun y
      // verificable es que el valor del anclaje aparezca como literal citado.
      if (!cache[abs]) cache[abs] = readFileSync(abs, 'utf8');
      if (cache[abs].indexOf("'" + want + "'") < 0 && cache[abs].indexOf('"' + want + '"') < 0) {
        fail('P7', 'registry:' + it.id + '.' + field, 'el anclaje "' + want + '" no existe en ' + file + ': el iframe renderiza vacio sin error');
      }
    }
  }
}

// ---------- P6: la capa se recomputa, no se cree ----------
// Un criterio que el chequeo no puede recomputar no se puede sostener: deriva.
// Reglas de derivacion, en orden:
//   sin src y sin api            -> pattern (receta: no tiene una sola API)
//   con tabla de props / api     -> component o primitive
//   solo importa tokens y shells -> primitive
//   contenido final de pantalla  -> template
function checkLayer(items, contracts) {
  for (const it of items) {
    const declared = it.layer || it.cat;
    const hasApi = !!((it.code && it.code.props) || (contracts[it.id] && contracts[it.id].api));
    if (declared === 'patterns' && hasApi) {
      fail('P6', 'registry:' + it.id, 'declarado pattern pero expone tabla de props: un pattern no tiene una sola API. Es un component.');
    }
    if (declared === 'components' && !hasApi && it.src) {
      notes.push('P6 (aviso): ' + it.id + ' es component y no declara props. Si no exporta un componente, es pattern.');
    }
    if (declared === 'templates' && hasApi) {
      fail('P6', 'registry:' + it.id, 'declarado template pero expone props: un template se copia, no se importa.');
    }
    if (it.domain && (declared === 'primitives' || declared === 'foundations')) {
      fail('P6', 'registry:' + it.id, 'lleva domain en una capa que no puede conocer el dominio.');
    }
  }
}

// ---------- P3: cobertura de contratos (ratchet) ----------
// P5: un contrato cuyo id no casa con ningun item es invisible en la docs y nadie
// se enterara de que existe. Los shells son la excepcion declarada: no se publican.
function checkOrphans(items, contracts) {
  const ids = new Set(items.map((i) => i.id));
  Object.keys(contracts).forEach((k) => {
    if (k.startsWith('_')) return;
    if (contracts[k].shell) return;
    if (!ids.has(k)) fail('P5', 'contracts/' + k + '.json', 'no casa con ningun item del registry: el contrato es invisible en la docs');
  });
}

function checkCoverage(items, contracts) {
  const shellCount = Object.keys(contracts).filter((k) => contracts[k].shell).length;
  const need = items.length + shellCount;
  const have = Object.keys(contracts).filter((k) => !k.startsWith('_')).length;
  notes.push('P3: contratos ' + have + '/' + need + ' (' + items.length + ' items + ' + shellCount + ' shells). Ratchet: solo puede subir.');
}

// ---------- modo destino ----------
function checkTarget(dir) {
  const map = arch.targetPaths || {};
  const files = walk(resolve(dir)).filter(isCode);
  const layerOf = (p) => {
    for (const L of Object.keys(map)) {
      if (typeof map[L] === 'string' && p.includes(map[L].split('/').pop())) return L;
    }
    return null;
  };
  const adopted = new Set((arch.adoption && arch.adoption.adopted) || []);
  if (!adopted.size) {
    notes.push('destino: adoption.adopted esta vacio, asi que no hay nada bajo reja todavia. Un item entra cuando alguien lo adopta.');
    return;
  }
  for (const abs of files) {
    const p = abs;
    const from = layerOf(p);
    if (!from) continue;
    const src = readFileSync(abs, 'utf8');
    const re = /from\s*['"]([^'"]+)['"]/g;
    let m;
    while ((m = re.exec(src))) {
      const to = layerOf(m[1]);
      if (to && ORDER[to] > ORDER[from]) fail('R1', p, 'importa hacia arriba: ' + m[1]);
    }
  }
}

// ---------- run ----------
const items = readRegistry();
const contracts = readContracts();
const allFiles = walk(ROOT).filter((p) => {
  const r = rel(p);
  return !r.startsWith('node_modules') && (isCode(p) || /\.(html|md|css|json)$/.test(p)) && r !== '_ds_bundle.js';
});
const codeFiles = allFiles.filter(isCode);

if (TARGET) {
  checkTarget(TARGET);
} else {
  checkR1(codeFiles);
  checkR2(items, contracts, allFiles);
  checkR3(codeFiles);
  checkR4(contracts);
  checkShellWiring(contracts, codeFiles);
  checkPaths(items);
  checkOrphans(items, contracts);
  checkLayer(items, contracts);
  checkAnchors(items);
  checkDeadFields(items);
  checkDocumentedProps(items);
  checkCoverage(items, contracts);
}

const blocking = problems.filter((p) => !p.ratchet);
if (asJson) {
  console.log(JSON.stringify({ problems, notes, blocking: blocking.length }, null, 2));
} else {
  for (const n of notes) console.log('  · ' + n);
  if (problems.length) {
    console.log('');
    for (const p of problems) console.log('  ' + (p.ratchet ? '~' : '✗') + ' [' + p.rule + '] ' + p.where + '\n      ' + p.msg);
  }
  console.log('');
  console.log(blocking.length
    ? '  ' + blocking.length + ' violacion(es) que bloquean, ' + (problems.length - blocking.length) + ' de ratchet.'
    : '  Sin violaciones que bloqueen' + (problems.length ? ', ' + problems.length + ' de ratchet.' : '.'));
}
process.exit(blocking.length ? 1 : 0);
