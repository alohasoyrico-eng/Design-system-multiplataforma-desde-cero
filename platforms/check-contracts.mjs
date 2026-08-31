#!/usr/bin/env node
// Flow · check-contracts — la reja final: todo item tiene contrato y todo
// contrato valida contra _schema.json. Sin dependencias. Node 18+.
//   node platforms/check-contracts.mjs [--json]
//
// El esquema NO es uniforme entre capas, y eso es lo que mas se cuela: un
// contrato de plantilla con bloque api, o un component declarado como pattern.
// El primer defecto que encontro este chequeo fue payment-card, con layer
// "patterns" y siete props publicas: si tiene props, es un component.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'contracts');
const arq = JSON.parse(readFileSync(join(ROOT, 'architecture.json'), 'utf8'));

const REQ = ['id', 'name', 'layer', 'status', 'summary'];
const CAPAS = ['foundations', 'primitives', 'components', 'patterns', 'templates'];
const KIND = ['prop', 'event', 'slot', 'renderProp'];
const LEVEL = ['must', 'should'];
const VERIFY = ['automated', 'visual', 'manual'];

const hallazgos = [];
const F = (archivo, msg) => hallazgos.push({ archivo, msg });

const archivos = readdirSync(DIR).filter((n) => n.endsWith('.json') && !n.startsWith('_'));
const vistos = new Set();

for (const n of archivos) {
  let c;
  try { c = JSON.parse(readFileSync(join(DIR, n), 'utf8')); }
  catch (e) { F(n, 'JSON invalido: ' + e.message); continue; }

  for (const k of REQ) if (c[k] == null) F(n, 'falta campo requerido: ' + k);
  if (c.layer && !CAPAS.includes(c.layer)) F(n, 'capa desconocida: ' + c.layer);
  if (c.id !== n.replace('.json', '')) F(n, 'id "' + c.id + '" no coincide con el nombre del archivo');
  if (vistos.has(c.id)) F(n, 'id duplicado'); else vistos.add(c.id);

  // allOf del esquema: cada capa tiene forma propia.
  if (c.layer === 'templates') {
    if (!c.content) F(n, 'template sin bloque content');
    if (c.api) F(n, 'template con api: una plantilla tiene contenido, no props');
  }
  if (c.layer === 'patterns') {
    if (!c.conformance) F(n, 'pattern sin conformance');
    if (c.api) F(n, 'pattern con api: si expone props es un component');
  }
  if (c.layer === 'foundations') {
    if (!c.tokens) F(n, 'foundation sin tokens');
    if (c.api) F(n, 'foundation con api');
  }
  if (c.layer === 'primitives' || c.layer === 'components') {
    if (!c.api) F(n, 'sin api');
    if (!c.conformance) F(n, 'sin conformance');
  }
  if (['foundations', 'primitives'].includes(c.layer) && c.domain) F(n, 'domain prohibido en ' + c.layer);

  for (const cr of (c.conformance && c.conformance.criteria) || []) {
    for (const k of ['id', 'rule', 'level', 'verify']) if (!cr[k]) F(n, 'criterio sin ' + k);
    if (cr.level && !LEVEL.includes(cr.level)) F(n, 'level invalido: ' + cr.level);
    if (cr.verify && !VERIFY.includes(cr.verify)) F(n, 'verify invalido: ' + cr.verify);
  }

  const comp = c.composition || {};
  const partes = new Set([...(comp.shells || []), ...(comp.primitives || []), ...(comp.components || []), ...(comp.patterns || [])]
    .map((s) => String(s).toLowerCase()));
  for (const m of (c.api && c.api.members) || []) {
    for (const k of ['name', 'kind', 'type']) if (!m[k]) F(n, 'miembro sin ' + k);
    if (m.kind && !KIND.includes(m.kind)) F(n, 'kind invalido: ' + m.kind);
    // R4: la composicion no se filtra a la API.
    if (partes.has(String(m.name).toLowerCase())) F(n, 'R4: la prop "' + m.name + '" repite un nombre de composition');
  }
}

// Todo item declarado tiene contrato, y el contrato dice la misma capa.
for (const it of arq.items || []) {
  if (!it.contract) { F('architecture.json', 'item sin contrato: ' + it.id); continue; }
  const n = it.contract.replace('contracts/', '');
  if (!archivos.includes(n)) { F('architecture.json', 'el item ' + it.id + ' apunta a un contrato que no existe: ' + n); continue; }
  const c = JSON.parse(readFileSync(join(DIR, n), 'utf8'));
  if (c.layer !== it.layer) F(n, 'capa discordante: el contrato dice ' + c.layer + ' y architecture.json dice ' + it.layer);
}

const total = (arq.items || []).length;
const conContrato = (arq.items || []).filter((i) => i.contract).length;

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ ok: hallazgos.length === 0, cobertura: conContrato + '/' + total, archivos: archivos.length, hallazgos }, null, 2));
} else if (!hallazgos.length) {
  console.log('contratos: ' + archivos.length + ' archivos, ' + conContrato + '/' + total + ' items con contrato, todos validan.');
} else {
  for (const h of hallazgos) console.log('  ' + h.archivo + ' — ' + h.msg);
  console.log('\n' + hallazgos.length + ' hallazgos. Cobertura ' + conContrato + '/' + total + '.');
}
process.exit(hallazgos.length ? 1 : 0);
