const {
  add,
  path,
  read,
  readJson,
  root,
  lineNumber,
} = require("./audit-context.js");

const packageCssFile = path.join(root, "packages/components/styles/components.css");
const motionRoleContractFile = path.join(root, "docs/audits/component-motion-role-contract.json");

const roleTokens = {
  state: ["--component-ease-state", "--component-duration-state"],
  press: ["--component-ease-press", "--component-duration-press"],
  enter: ["--component-ease-enter", "--component-duration-enter"],
  exit: ["--component-ease-exit", "--component-duration-exit"],
  move: ["--component-ease-move"],
  loading: ["--component-ease-loading-rhythm", "--component-duration-loading", "--component-duration-shimmer", "--component-duration-pulse"],
  continuous: ["--component-ease-linear", "--component-duration-loading-spin"],
};

const forbiddenDirectCurves = [
  "--component-ease-standard",
  "--component-ease-emphasis",
  "--component-ease-progress",
  "--component-duration-fast",
];

function selectorBelongsToComponent(selector, selectors) {
  return selectors.some((scope) => selector.includes(scope));
}

function cssBlocks(text) {
  const blocks = [];
  const pattern = /(?<selector>[^{}]+)\{(?<body>[^{}]*)\}/g;
  for (const match of text.matchAll(pattern)) {
    blocks.push({
      selector: match.groups.selector.trim(),
      body: match.groups.body,
      index: match.index,
    });
  }
  return blocks;
}

function isMotionBody(body) {
  return /\b(?:transition|animation)\s*:/.test(body);
}

function hasRole(blocks, role) {
  const tokens = roleTokens[role] ?? [];
  return blocks.some((block) => tokens.some((token) => block.body.includes(token)));
}

function checkPriorityComponentMotionRoles() {
  const contract = readJson(motionRoleContractFile);
  if (!contract?.components?.length) {
    add("errors", motionRoleContractFile, 1, "Component motion role contract must list the 1:1 reviewed component priority set.");
    return;
  }
  const css = read(packageCssFile);
  const blocks = cssBlocks(css);

  for (const component of contract.components) {
    const scopedBlocks = blocks.filter((block) => selectorBelongsToComponent(block.selector, component.selectors));
    const motionBlocks = scopedBlocks.filter((block) => isMotionBody(block.body));

    if (motionBlocks.length === 0 && component.requiredRoles.length > 0) {
      add("errors", packageCssFile, 1, `Motion role coverage for ${component.id} expected package motion blocks for: ${component.covers.join(", ")}.`);
      continue;
    }

    for (const role of component.requiredRoles) {
      if (!hasRole(scopedBlocks, role)) {
        add("errors", packageCssFile, 1, `Motion role coverage for ${component.id} must include ${role} role tokens for: ${component.covers.join(", ")}.`);
      }
    }

    for (const block of motionBlocks) {
      for (const token of forbiddenDirectCurves) {
        if (!block.body.includes(token)) continue;
        add("errors", packageCssFile, lineNumber(css, block.index), `Motion role coverage for ${component.id} must use semantic motion roles instead of ${token}.`);
      }
    }
  }
}

module.exports = { checkPriorityComponentMotionRoles };
