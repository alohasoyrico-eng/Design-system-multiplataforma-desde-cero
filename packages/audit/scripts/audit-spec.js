const {
  fs,
  specFile,
  result,
  foundations,
  foundationIds,
  primitiveNames,
  requiredFoundationContracts,
  requiredPrimitiveContracts,
  requiredComponentContracts,
  read,
  readJson,
  rel,
  add,
} = require("./audit-context.js");

function checkMachineReadableSpec() {
  if (!fs.existsSync(specFile)) {
    result.errors.push({ file: rel(specFile), line: 1, message: "Machine-readable system spec is missing." });
    return;
  }

  const spec = readJson(specFile);
  if (!spec) {
    result.errors.push({ file: rel(specFile), line: 1, message: "Machine-readable system spec is invalid JSON." });
    return;
  }

  const compareList = (key, expected) => {
    const actual = spec[key] || [];
    const missing = expected.filter((item) => !actual.includes(item));
    const extra = actual.filter((item) => !expected.includes(item));
    if (missing.length || extra.length) {
      add("errors", specFile, 1, `${key} out of sync. Missing: ${missing.join(", ") || "none"}. Extra: ${extra.join(", ") || "none"}.`);
    }
  };

  compareList("foundations", foundations);
  compareList("primitiveFamilies", primitiveNames);

  if (!spec.agentContract) {
    add("errors", specFile, 1, "Missing agentContract in machine-readable spec.");
  } else {
    for (const required of ["sourceOfTruth", "syncRule", "artifactRequirements", "rejectIf"]) {
      if (!spec.agentContract[required]) {
        add("errors", specFile, 1, `agentContract missing ${required}.`);
      }
    }
  }

  if (spec.foundations?.includes("Motion")) {
    add("errors", specFile, 1, "Spec still uses deprecated foundation name Motion; use Momentum.");
  }

  if (spec.agentContract?.temporaryPlanningDocs?.length) {
    add("errors", specFile, 1, "Temporary planning docs should not be part of the agent contract.");
  }

  const requiredSpecSections = ["operatingModel", "qualityGates", "referencePolicy", "maturity", "migrationPlan"];
  for (const section of requiredSpecSections) {
    if (!spec[section]) {
      add("errors", specFile, 1, `Missing ${section}; do not move system rules into markdown-only docs.`);
    }
  }

  for (const term of ["Adopt", "Adapt", "Reject"]) {
    const hasDecision = spec.referencePolicy?.decisions?.some((decision) => decision.decision?.includes(term));
    if (!hasDecision) {
      add("errors", specFile, 1, `referencePolicy must include at least one ${term} decision.`);
    }
  }

  if (!spec.qualityGates?.blocking?.length || !spec.qualityGates?.maturityWarnings?.length) {
    add("errors", specFile, 1, "qualityGates must define blocking gates and maturity warnings.");
  }

  if (!spec.migrationPlan?.foundationBatch?.length) {
    add("errors", specFile, 1, "migrationPlan must define foundationBatch.");
  }

  for (const id of requiredFoundationContracts) {
    const contract = spec.artifacts?.foundations?.[id];
    if (!contract) {
      add("errors", specFile, 1, `Missing machine-readable foundation contract: artifacts.foundations.${id}.`);
      continue;
    }

    const requiredContractFields = [
      "layer",
      "platform",
      "audiences",
      "purpose",
      "referenceDecision",
      "roles",
      "productExamples",
      "tokenDependencies",
      "primitiveDependencies",
      "componentDependencies",
      "agentInstructions",
      "rejectIf",
    ];

    for (const field of requiredContractFields) {
      const value = contract[field];
      const isEmptyArray = Array.isArray(value) && value.length === 0;
      if (value === undefined || value === "" || isEmptyArray) {
        add("errors", specFile, 1, `Foundation contract ${id} missing ${field}.`);
      }
    }

    if (contract.layer !== "Foundation") {
      add("errors", specFile, 1, `Foundation contract ${id} must declare layer Foundation.`);
    }

    if (!["Adopt", "Adapt", "Reject", "Adopt + adapt"].includes(contract.referenceDecision)) {
      add("errors", specFile, 1, `Foundation contract ${id} has invalid referenceDecision.`);
    }
  }

  for (const id of requiredPrimitiveContracts) {
    const contract = spec.artifacts?.primitives?.[id];
    if (!contract) {
      add("errors", specFile, 1, `Missing machine-readable primitive contract: artifacts.primitives.${id}.`);
      continue;
    }

    const requiredContractFields = [
      "layer",
      "platform",
      "audiences",
      "purpose",
      "governingFoundations",
      "foundationInputs",
      "roles",
      "productExamples",
      "api",
      "tokenDependencies",
      "states",
      "agentInstructions",
      "rejectIf",
    ];

    for (const field of requiredContractFields) {
      const value = contract[field];
      const isEmptyArray = Array.isArray(value) && value.length === 0;
      const isEmptyObject = value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0;
      if (value === undefined || value === "" || isEmptyArray || isEmptyObject) {
        add("errors", specFile, 1, `Primitive contract ${id} missing ${field}.`);
      }
    }

    if (contract.layer !== "Primitive") {
      add("errors", specFile, 1, `Primitive contract ${id} must declare layer Primitive.`);
    }
  }

  for (const group of ["components", "patterns", "templates"]) {
    const contracts = spec.artifacts?.[group] ?? {};
    for (const [artifactId, contract] of Object.entries(contracts)) {
      const propNames = contract.props?.map((prop) => prop.name) ?? [];
      if (propNames.includes("size")) {
        add("errors", specFile, 1, `${group}.${artifactId} must not expose public size; scale is owned by Density.`);
      }
      const serialized = JSON.stringify(contract);
      if (group !== "components" && !serialized.includes("density")) {
        add("errors", specFile, 1, `${group}.${artifactId} must declare density context.`);
      }
    }
  }

  for (const id of requiredComponentContracts) {
    const contract = spec.artifacts?.components?.[id];
    if (!contract) {
      add("errors", specFile, 1, `Missing machine-readable component contract: artifacts.components.${id}.`);
      continue;
    }

    const requiredContractFields = [
      "layer",
      "platform",
      "audiences",
      "purpose",
      "anatomy",
      "variants",
      "states",
      "statePrecedence",
      "foundations",
      "primitiveDependencies",
      "tokenDependencies",
      "props",
      "productExamples",
      "guidelines",
      "contextDensityStrategy",
      "tests",
      "agentInstructions",
      "rejectIf",
    ];

    for (const field of requiredContractFields) {
      const value = contract[field];
      const isEmptyArray = Array.isArray(value) && value.length === 0;
      const isEmptyObject = value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0;
      if (value === undefined || value === "" || isEmptyArray || isEmptyObject) {
        add("errors", specFile, 1, `Component contract ${id} missing ${field}.`);
      }
    }

    if (contract.layer !== "Component") {
      add("errors", specFile, 1, `Component contract ${id} must declare layer Component.`);
    }

    for (const foundation of foundations) {
      const coverage = contract.foundations?.[foundation];
      if (!coverage) {
        add("errors", specFile, 1, `Component contract ${id} missing foundation coverage for ${foundation}.`);
        continue;
      }
      if (coverage.status !== "covered") {
        add("errors", specFile, 1, `Component contract ${id} foundation ${foundation} must be covered, not ${coverage.status || "unset"}.`);
      }
      for (const field of ["decision", "tokens", "behavior", "example", "test", "rejectIf"]) {
        const value = coverage[field];
        const isEmptyArray = Array.isArray(value) && value.length === 0;
        if (value === undefined || value === "" || isEmptyArray) {
          add("errors", specFile, 1, `Component contract ${id} foundation ${foundation} missing ${field}.`);
        }
      }
    }

    const contexts = contract.contextDensityStrategy?.map((item) => item.context) ?? [];
    for (const requiredContext of ["smartphones + phablets", "tablets + laptops", "desktops + TV"]) {
      if (!contexts.includes(requiredContext)) {
        add("errors", specFile, 1, `Component contract ${id} missing density context: ${requiredContext}.`);
      }
    }

    if (id === "button") {
      if (JSON.stringify(contract).includes("xl")) {
        add("errors", specFile, 1, "Button contract must expose only sm, md, and lg sizing; xl is not allowed.");
      }
      const sizeProp = contract.props?.find((prop) => prop.name === "size");
      if (sizeProp) {
        add("errors", specFile, 1, "Button must not expose public size; scale is owned by Density.");
      }
      const densityProp = contract.props?.find((prop) => prop.name === "density");
      if (!densityProp || densityProp.type !== "sm | md | lg" || densityProp.default !== "inherited") {
        add("errors", specFile, 1, "Button must expose inherited density as the scale contract.");
      }
      for (const item of contract.contextDensityStrategy ?? []) {
        if (item.defaultSize || item.density?.includes("/")) {
          add("errors", specFile, 1, "Button context density strategy must not mix Density with defaultSize overrides.");
        }
        if (item.scaleSource !== "Density") {
          add("errors", specFile, 1, "Button context density strategy must declare scaleSource: Density.");
        }
      }
    }
  }
}

module.exports = { checkMachineReadableSpec };
