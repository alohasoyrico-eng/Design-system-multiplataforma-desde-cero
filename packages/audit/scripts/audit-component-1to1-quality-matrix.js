const {
  add,
  fs,
  path,
  readJson,
  root,
  result,
} = require("./audit-context.js");

const matrixFile = path.join(root, "docs/audits/component-1to1-quality-matrix.json");

const requiredStepIds = [
  "zip-reference",
  "system-architecture",
  "package-source",
  "docs-source",
  "foundations-primitives",
  "states-variants",
  "interaction-logic",
  "motion",
  "density-layout",
  "typography-iconography",
  "accessibility",
  "visual-qa",
  "validation",
];

const validStepStatuses = new Set(["pass", "partial", "fail", "not-applicable"]);
const validComponentStatuses = new Set(["pass", "partial", "fail"]);

function evidenceExists(evidencePath) {
  return fs.existsSync(path.join(root, evidencePath));
}

function hasDarkEvidence(evidence) {
  return evidence.some((evidencePath) => /dark/i.test(evidencePath));
}

function checkComponent1to1QualityMatrix() {
  const matrix = readJson(matrixFile);
  if (!matrix) {
    add("errors", matrixFile, 1, "Component 1:1 quality matrix is required.");
    return;
  }

  const stepIds = (matrix.steps ?? []).map((step) => step.id);
  for (const requiredStep of requiredStepIds) {
    if (!stepIds.includes(requiredStep)) {
      add("errors", matrixFile, 1, `Component 1:1 quality matrix missing step: ${requiredStep}.`);
    }
  }
  if (stepIds.length !== requiredStepIds.length) {
    add("errors", matrixFile, 1, "Component 1:1 quality matrix must keep exactly 13 review steps.");
  }

  let passCount = 0;
  let partialCount = 0;
  let failCount = 0;

  for (const component of matrix.components ?? []) {
    if (!validComponentStatuses.has(component.status)) {
      add("errors", matrixFile, 1, `${component.id} has invalid component status: ${component.status}.`);
    }

    const componentStepIds = Object.keys(component.steps ?? {});
    for (const requiredStep of requiredStepIds) {
      const status = component.steps?.[requiredStep];
      if (!status) {
        add("errors", matrixFile, 1, `${component.id} is missing 13-step status for: ${requiredStep}.`);
      } else if (!validStepStatuses.has(status)) {
        add("errors", matrixFile, 1, `${component.id} has invalid status for ${requiredStep}: ${status}.`);
      }
    }
    for (const step of componentStepIds) {
      if (!requiredStepIds.includes(step)) {
        add("errors", matrixFile, 1, `${component.id} uses an unknown 13-step id: ${step}.`);
      }
    }

    const evidence = component.evidence ?? [];
    if (!Array.isArray(evidence) || evidence.length === 0) {
      add("errors", matrixFile, 1, `${component.id} must list evidence files.`);
    } else {
      for (const evidencePath of evidence) {
        if (!evidenceExists(evidencePath)) {
          add("errors", matrixFile, 1, `${component.id} references missing evidence: ${evidencePath}.`);
        }
      }
    }

    const stepStatuses = requiredStepIds.map((step) => component.steps?.[step]);
    const allClosed = stepStatuses.every((status) => status === "pass" || status === "not-applicable");
    if (component.status === "pass" && !allClosed) {
      add("errors", matrixFile, 1, `${component.id} cannot be pass while one or more 13-step checks are partial or fail.`);
    }
    if (component.status === "pass" && evidence.length < 3) {
      add("errors", matrixFile, 1, `${component.id} cannot be pass without enough evidence sources.`);
    }
    if ((component.status === "pass" || component.steps?.["visual-qa"] === "pass") && !hasDarkEvidence(evidence)) {
      add("errors", matrixFile, 1, `${component.id} cannot close visual QA without dark-mode evidence.`);
    }
    if (component.status !== "pass" && (!Array.isArray(component.openIssues) || component.openIssues.length === 0)) {
      add("errors", matrixFile, 1, `${component.id} is ${component.status} and must list open issues.`);
    }

    if (component.status === "pass") passCount += 1;
    if (component.status === "partial") partialCount += 1;
    if (component.status === "fail") failCount += 1;
  }

  result.inventory.component1to1Quality = {
    total: (matrix.components ?? []).length,
    pass: passCount,
    partial: partialCount,
    fail: failCount,
  };

  if (partialCount || failCount) {
    add("warnings", matrixFile, 1, `Component 1:1 quality matrix is not closed: ${partialCount} partial, ${failCount} fail.`);
  }
}

module.exports = { checkComponent1to1QualityMatrix };
