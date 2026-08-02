const { componentDocsFile, goldComponents, readJson, add } = require("./audit-context.js");

function checkGoldComponentDocsContract() {
  const componentDocs = readJson(componentDocsFile);
  if (!componentDocs) {
    add("errors", componentDocsFile, 1, "Gold component documentation contract must live in content/component-docs.json.");
  } else {
    const expectedTabs = [
      ["overview", ["operational-example", "anatomy", "accessibility"]],
      ["design", ["variants", "states", "variant-state-behavior", "full-width", "responsive-layout-patterns", "viewport-organization"]],
      ["build", ["playground", "guidelines", "api-foundations", "tests-rejection-rules"]],
      ["miel", ["miel"]],
    ];
    const tabs = componentDocs.tabs ?? [];
    for (const [tabId, sections] of expectedTabs) {
      const tab = tabs.find((item) => item.id === tabId);
      if (!tab) {
        add("errors", componentDocsFile, 1, `Gold component documentation contract missing tab: ${tabId}.`);
        continue;
      }
      if (JSON.stringify(tab.sections) !== JSON.stringify(sections)) {
        add("errors", componentDocsFile, 1, `Gold component documentation tab ${tabId} has an invalid section order.`);
      }
    }
    if (tabs.at(3)?.id !== "miel" || tabs.at(3)?.label !== "MIEL") {
      add("errors", componentDocsFile, 1, "Gold component documentation must expose MIEL as the fourth tab.");
    }
    for (const component of goldComponents) {
      const componentContract = componentDocs.components?.[component];
      if (!componentContract) {
        add("errors", componentDocsFile, 1, `Gold component documentation contract missing component: ${component}.`);
        continue;
      }
      if (componentContract.renderer !== component) {
        add("errors", componentDocsFile, 1, `${component} gold component must map to its renderer contract.`);
      }
      if (JSON.stringify(componentContract.tabs) !== JSON.stringify(["overview", "design", "build", "miel"])) {
        add("errors", componentDocsFile, 1, `${component} gold component tabs must follow the shared standard.`);
      }
    }
  }


}

module.exports = { checkGoldComponentDocsContract };
