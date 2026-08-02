const {
  add,
  fs,
  path,
  read,
  root,
} = require("./audit-context.js");

const contractsFile = path.join(root, "packages/components/src/contracts.js");
const componentCopyRoot = path.join(root, "packages/content/content/component-copy/components");
const componentSpecRoot = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const implementationStatusFile = path.join(root, "packages/content/content/component-implementation-status.json");
const componentQualityMatrixFile = path.join(root, "docs/audits/component-1to1-quality-matrix.json");

function kebabToCamel(id) {
  return id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function sortedUnique(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

function sameList(left, right) {
  if (left.length !== right.length) return false;
  return left.every((item, index) => item === right[index]);
}

function parseJsonFile(file) {
  return JSON.parse(read(file));
}

function contractBlock(source, contractKey) {
  const keyIndex = source.indexOf(`${contractKey}: {`);
  if (keyIndex < 0) return "";
  const openIndex = source.indexOf("{", keyIndex);
  let depth = 0;
  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) return source.slice(openIndex, index + 1);
  }
  return "";
}

function arrayFromContractBlock(block, key) {
  const match = block.match(new RegExp(`${key}:\\s*\\[([^\\]]*)\\]`));
  if (!match) return [];
  return sortedUnique([...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]));
}

function specList(componentSpec, key) {
  const values = componentSpec?.[key] ?? [];
  if (!Array.isArray(values)) return [];
  return sortedUnique(values.map((item) => (typeof item === "string" ? item : item.id ?? item.name)));
}

function contentValues(componentCopy, key) {
  const values = [];
  for (const section of Object.values(componentCopy ?? {})) {
    for (const item of section?.scenario?.items ?? []) {
      if (item[key]) values.push(item[key]);
      if (item.field?.[key]) values.push(item.field[key]);
      if (item.button?.[key]) values.push(item.button[key]);
      if (item.select?.[key]) values.push(item.select[key]);
      if (item.card?.[key]) values.push(item.card[key]);
    }
    for (const demo of section?.demos ?? []) {
      if (demo[key]) values.push(demo[key]);
      if (demo.field?.[key]) values.push(demo.field[key]);
      if (demo.button?.[key]) values.push(demo.button[key]);
      if (demo.select?.[key]) values.push(demo.select[key]);
      if (demo.card?.[key]) values.push(demo.card[key]);
    }
  }
  return sortedUnique(values);
}

function implementationStatusFor(status, id) {
  const value = status.components?.[id];
  return typeof value === "string" ? value : value?.status;
}

function compareDeclaredList(id, field, contractList, specDeclaredList) {
  if (sameList(contractList, specDeclaredList)) return;
  const missing = specDeclaredList.filter((item) => !contractList.includes(item));
  const extra = contractList.filter((item) => !specDeclaredList.includes(item));
  const details = [
    missing.length ? `missing from componentContracts: ${missing.join(", ")}` : "",
    extra.length ? `extra in componentContracts: ${extra.join(", ")}` : "",
  ].filter(Boolean).join("; ");
  add("errors", contractsFile, 1, `${id} ${field} must match component spec exactly (${details}).`);
}

function compareContentUsage(id, field, contentList, contractList) {
  const outside = contentList.filter((item) => !contractList.includes(item) && item !== "default" && item !== "standard");
  if (!outside.length) return;
  add("errors", path.join(componentCopyRoot, id, "all.json"), 1, `${id} content uses ${field} outside componentContracts: ${outside.join(", ")}.`);
}

function checkComponentContractAlignment() {
  const source = read(contractsFile);
  const status = parseJsonFile(implementationStatusFile);
  const qualityMatrix = parseJsonFile(componentQualityMatrixFile);
  const ids = (qualityMatrix.components ?? [])
    .filter((component) => component.status === "pass")
    .map((component) => component.id)
    .filter((id) => fs.existsSync(path.join(componentCopyRoot, id, "all.json")))
    .filter((id) => implementationStatusFor(status, id) === "package-component")
    .sort();

  for (const id of ids) {
    const contractKey = kebabToCamel(id);
    const block = contractBlock(source, contractKey);
    if (!block) {
      add("errors", contractsFile, 1, `${id} package component is missing from componentContracts.`);
      continue;
    }

    const specFile = path.join(componentSpecRoot, `${id}.json`);
    if (!fs.existsSync(specFile)) {
      add("errors", specFile, 1, `${id} package component is missing component spec artifact.`);
      continue;
    }

    const copyFile = path.join(componentCopyRoot, id, "all.json");
    const componentSpec = parseJsonFile(specFile).artifacts?.components?.[id];
    const componentCopy = parseJsonFile(copyFile).components?.[id];

    const contractVariants = arrayFromContractBlock(block, "variants");
    const contractStates = arrayFromContractBlock(block, "states");
    const specVariants = specList(componentSpec, "variants");
    const specStates = specList(componentSpec, "states");

    compareDeclaredList(id, "variants", contractVariants, specVariants);
    compareDeclaredList(id, "states", contractStates, specStates);
    compareContentUsage(id, "variants", contentValues(componentCopy, "variant"), contractVariants);
    compareContentUsage(id, "states", contentValues(componentCopy, "state"), contractStates);
  }
}

module.exports = { checkComponentContractAlignment };
