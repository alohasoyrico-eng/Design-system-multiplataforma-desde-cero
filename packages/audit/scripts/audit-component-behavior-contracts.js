const {
  path,
  add,
  readJson,
} = require("./audit-context.js");

const backlogFile = path.join(__dirname, "../../../packages/content/content/component-quality-backlog.json");
const behaviorFile = path.join(__dirname, "../../../packages/content/content/component-behavior-contracts.json");

function checkComponentBehaviorContracts() {
  const backlog = readJson(backlogFile);
  const behavior = readJson(behaviorFile);
  const pending = backlog?.contractPending ?? [];
  const components = behavior?.components ?? {};

  if (!behavior?.rules?.length) {
    add("errors", behaviorFile, 1, "Component behavior contracts must document ownership rules.");
  }

  for (const id of pending) {
    const contract = components[id];
    if (!contract) {
      add("errors", behaviorFile, 1, `Missing behavior contract for contract-pending component: ${id}.`);
      continue;
    }
    for (const key of ["model", "packageOwned", "callbacks", "focusRules", "keyboardRules", "docsOnlyUntilPackaged", "patternOwned"]) {
      if (!(key in contract)) {
        add("errors", behaviorFile, 1, `Behavior contract for ${id} missing required key: ${key}.`);
      }
    }
    for (const key of ["packageOwned", "focusRules", "keyboardRules", "patternOwned"]) {
      if (!Array.isArray(contract[key]) || !contract[key].length) {
        add("errors", behaviorFile, 1, `Behavior contract for ${id} must include at least one ${key} item.`);
      }
    }
    if (!Array.isArray(contract.callbacks)) {
      add("errors", behaviorFile, 1, `Behavior contract for ${id} callbacks must be an array.`);
    }
    if (!Array.isArray(contract.docsOnlyUntilPackaged)) {
      add("errors", behaviorFile, 1, `Behavior contract for ${id} docsOnlyUntilPackaged must be an array.`);
    }
  }

  const extra = Object.keys(components).filter((id) => !pending.includes(id));
  if (extra.length) {
    add("errors", behaviorFile, 1, `Behavior contracts include components not marked contractPending: ${extra.join(", ")}.`);
  }
}

module.exports = { checkComponentBehaviorContracts };
