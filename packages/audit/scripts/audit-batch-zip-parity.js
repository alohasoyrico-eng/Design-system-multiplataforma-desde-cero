const { add, path, readJson, root } = require("./audit-context.js");

const batchFile = path.join(root, "docs/audits/component-batch-zip-parity.json");
const requiredScope = ["avatar", "slider", "stepper"];
const requiredReferenceTypes = {
  avatar: "direct",
  slider: "direct",
  stepper: "direct",
};

function checkBatchZipParity() {
  const batch = readJson(batchFile);
  if (!batch) {
    add("errors", batchFile, 1, "Component batch ZIP parity brief is required before scaling batches.");
    return;
  }

  if (batch.batchId !== "identity-range-sequence-batch-03") {
    add("errors", batchFile, 1, "Current component batch must declare batchId identity-range-sequence-batch-03.");
  }

  for (const component of requiredScope) {
    if (!batch.scope?.includes(component)) {
      add("errors", batchFile, 1, `Batch scope must include ${component}.`);
    }

    const brief = batch.components?.[component];
    if (!brief) {
      add("errors", batchFile, 1, `Batch must include ZIP brief for ${component}.`);
      continue;
    }

    if (brief.zipReferenceRead !== true) {
      add("errors", batchFile, 1, `${component} must explicitly confirm the ZIP reference was read.`);
    }

    if (brief.referenceType !== requiredReferenceTypes[component]) {
      add("errors", batchFile, 1, `${component} must use a direct ZIP reference in this batch.`);
    }

    if (!Array.isArray(brief.zipPaths) || brief.zipPaths.length < 1) {
      add("errors", batchFile, 1, `${component} must list ZIP source paths.`);
    }

    if (!Array.isArray(brief.zipLookAndFeel) || brief.zipLookAndFeel.length < 6) {
      add("errors", batchFile, 1, `${component} must document concrete ZIP look and feel traits.`);
    }

    for (const foundation of ["Energy", "Frame", "Depth", "Momentum", "Accessibility"]) {
      if (!brief.systemMapping?.[foundation]?.length) {
        add("errors", batchFile, 1, `${component} must map ZIP traits to Design System ${foundation}.`);
      }
    }

    if (!Array.isArray(brief.implementationGuardrails) || brief.implementationGuardrails.length < 3) {
      add("errors", batchFile, 1, `${component} must define implementation guardrails.`);
    }
  }

  const viewports = batch.browserQa?.viewports ?? [];
  for (const name of ["desktop", "mobile"]) {
    if (!viewports.some((viewport) => viewport.name === name && viewport.width && viewport.height)) {
      add("errors", batchFile, 1, `Batch browser QA must include ${name} viewport dimensions.`);
    }
  }

  const mustCheck = batch.browserQa?.mustCheck ?? [];
  for (const check of ["pageOverflow", "componentOverflow", "focusVisibility", "keyboardEscape", "zipLookAndFeel"]) {
    if (!mustCheck.includes(check)) add("errors", batchFile, 1, `Batch browser QA must check ${check}.`);
  }
}

module.exports = { checkBatchZipParity };
