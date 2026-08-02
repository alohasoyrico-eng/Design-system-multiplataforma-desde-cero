const {
  add,
  docsStyleModuleFiles,
  path,
  read,
  readJson,
  resolveBoundaryPath,
  root,
} = require("./audit-context.js");

const motionContractFile = path.join(root, "docs/audits/motion-zip-to-system-contract.json");
const systemMomentumFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentMotionFiles = docsStyleModuleFiles.filter((file) => /\/(?:04|05)[a-z0-9-]*\.css$/.test(file));

function lineHasRawMotionValue(line) {
  if (/linear-gradient/.test(line)) return false;
  const withoutTokens = line.replace(/var\([^)]*\)/g, "");
  return /\b\d+(?:\.\d+)?m?s\b|\bcubic-bezier\(|\bease(?:-in|-out|-in-out)?\b|\blinear\b/.test(withoutTokens);
}

function isTokenDeclaration(line) {
  return /^\s*--(?:ref|sys)-/.test(line);
}

function isMotionLine(line) {
  return /(?:transition|animation|duration|easing|motion)/.test(line);
}

function checkZipMotionMapping() {
  const contract = readJson(motionContractFile);
  if (!contract) {
    add("errors", motionContractFile, 1, "ZIP-to-Design System motion contract is required before scaling component batches.");
    return;
  }

  for (const section of ["touchedControls", "appearingSurfaces", "movingStructure", "continuousFeedback"]) {
    const mapping = contract.systemMapping?.[section];
    if (!mapping?.duration || !mapping?.easing || !Array.isArray(mapping?.uses) || mapping.uses.length < 3) {
      add("errors", motionContractFile, 1, `Motion mapping ${section} must define uses, duration, and easing.`);
    }
  }

  const requiredZipValues = [
    "cubic-bezier(0.34, 1.56, 0.64, 1)",
    "cubic-bezier(0.22, 1, 0.36, 1)",
    "cubic-bezier(0.65, 0, 0.35, 1)",
    "160ms",
    "240ms",
    "400ms",
    "1.04",
    "0.96",
    "-3px",
  ];
  const systemMomentum = read(systemMomentumFile);
  for (const value of requiredZipValues) {
    if (!systemMomentum.includes(value)) {
      add("errors", systemMomentumFile, 1, `Design System Momentum tokens must preserve ZIP motion parameter: ${value}.`);
    }
  }
}

function checkComponentMotionTokens() {
  const globalReducedMotion = docsStyleModuleFiles.some((file) => /prefers-reduced-motion:\s*reduce/.test(read(file)));
  for (const file of componentMotionFiles) {
    const text = read(file);
    const lines = text.split("\n");
    let hasMotion = false;
    let hasReducedMotion = false;

    lines.forEach((lineText, index) => {
      const line = index + 1;
      if (!isMotionLine(lineText)) return;
      hasMotion = true;
      if (lineHasRawMotionValue(lineText) && !isTokenDeclaration(lineText)) {
        add("errors", file, line, "Component motion must use Design System Momentum tokens, not raw duration/easing values.");
      }
    });

    if (/animation\s*:/.test(text) || /transition\s*:/.test(text)) {
      hasReducedMotion = /prefers-reduced-motion:\s*reduce/.test(text) || globalReducedMotion;
    }

    if (hasMotion && /animation\s*:/.test(text) && !hasReducedMotion) {
      add("errors", file, 1, "Animated component CSS needs a prefers-reduced-motion path.");
    }
  }
}

function checkMotionContracts() {
  checkZipMotionMapping();
  checkComponentMotionTokens();
}

module.exports = { checkMotionContracts };
