const {
  add,
  docsStyleModuleFiles,
  path,
  read,
  readDocsCss,
  readJson,
  readSpec,
  resolveBoundaryPath,
  root,
} = require("./audit-context.js");

const voiceContractFile = path.join(root, "docs/audits/voice-quality-contract.json");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");

function collectTokens(css) {
  const tokens = {};
  for (const match of css.matchAll(/(--(?:ref|sys|comp|density)-[a-z0-9-]+):\s*([^;]+);/g)) {
    if (!tokens[match[1]]) tokens[match[1]] = match[2].trim();
  }
  return tokens;
}

function lineNumber(source, index) {
  return source.slice(0, index).split("\n").length;
}

function isAllowedTypographyValue(value, contract) {
  const trimmed = value.trim();
  if ((contract.allowedLiteralValues ?? []).includes(trimmed)) return true;
  return (contract.allowedComponentValuePrefixes ?? []).some((prefix) => trimmed.startsWith(prefix));
}

function checkVoiceTokens(contract, tokens) {
  for (const token of contract.requiredTokenRoles ?? []) {
    if (!tokens[token]) add("errors", voiceContractFile, 1, `Voice token role is missing: ${token}.`);
  }
}

function checkVoiceTokenOwnership(contract) {
  const tokenCss = read(tokenCssFile);
  for (const token of contract.requiredTokenRoles ?? []) {
    if (!tokenCss.includes(`${token}:`)) add("errors", tokenCssFile, 1, `Voice token must be declared by the token package: ${token}.`);
  }
  for (const file of docsStyleModuleFiles) {
    const source = read(file);
    for (const match of source.matchAll(/--(?:ref|sys)-voice-[a-z0-9-]+(?=\s*:)/g)) {
      add("errors", file, lineNumber(source, match.index), `Docs must consume Voice tokens, not declare ${match[0]}.`);
    }
  }
}

function checkVoiceSpec() {
  const voice = readSpec()?.artifacts?.foundations?.voice;
  const roleIds = new Set((voice?.roles ?? []).map((role) => role.id));
  for (const role of ["display", "heading", "numeral", "label", "paragraph", "caption", "code"]) {
    if (!roleIds.has(role)) add("errors", voiceContractFile, 1, `Voice foundation role is missing: ${role}.`);
  }
  if (!voice?.agentInstructions?.some((item) => item.includes("Edenred Black") && item.includes("Ubuntu"))) {
    add("errors", voiceContractFile, 1, "Voice must preserve the brand/product family split for humans and agents.");
  }
}

function checkComponentTypography(contract) {
  const properties = contract.componentCssProperties ?? [];
  const componentFiles = docsStyleModuleFiles.filter((file) => /^04.*\.css$/.test(path.basename(file)));
  for (const file of componentFiles) {
    const source = read(file);
    for (const property of properties) {
      const pattern = new RegExp(`${property}\\s*:\\s*([^;]+);`, "g");
      for (const match of source.matchAll(pattern)) {
        const value = match[1].trim();
        if (isAllowedTypographyValue(value, contract)) continue;
        add("errors", file, lineNumber(source, match.index), `${property} must use Voice, Density, or component typography tokens instead of "${value}".`);
      }
    }
    if (/letter-spacing:\s*-[^;]+;/.test(source)) {
      add("errors", file, 1, "Component letter spacing must not be negative.");
    }
  }
}

function checkVoiceContracts() {
  const contract = readJson(voiceContractFile);
  if (!contract?.requiredTokenRoles?.length || !contract?.componentCssProperties?.length) {
    add("errors", voiceContractFile, 1, "Voice quality contract must declare token roles and component typography properties.");
    return;
  }
  const generatedTokenCssFile = path.join(root, "apps/docs/generated/tokens.css");
  const generatedComponentCssFile = path.join(root, "apps/docs/generated/components.css");
  const tokens = collectTokens([
    generatedTokenCssFile,
    generatedComponentCssFile,
  ]
    .filter((file) => require("fs").existsSync(file))
    .map((file) => read(file))
    .concat(readDocsCss())
    .join("\n"));
  checkVoiceTokens(contract, tokens);
  checkVoiceTokenOwnership(contract);
  checkVoiceSpec();
  checkComponentTypography(contract);
}

module.exports = { checkVoiceContracts };
