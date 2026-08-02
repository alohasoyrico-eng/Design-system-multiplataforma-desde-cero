const { componentCopyFile, docsAppFile, goldComponents, readJson, add } = require("./audit-context.js");

function checkGoldComponentCopyContract({ app, spec }) {
  const componentCopy = readJson(componentCopyFile);
  if (!componentCopy) {
    add("errors", componentCopyFile, 1, "Gold component copy contract must live in content/component-copy.json.");
  } else {
    for (const field of ["profiles", "fallbackProfile", "scenarioCopy", "standardCopy", "mustProve", "demoCopy", "stateMatrixCopy", "responsiveBehavior", "apiRows", "testRows", "testingModelCopy"]) {
      if (!componentCopy.familyStandards?.[field]) {
        add("errors", componentCopyFile, 1, `Component family standard copy missing field: ${field}.`);
      }
    }
    for (const group of ["Core", "Selection", "Inputs", "Mobile", "Maps", "Navigation", "Dashboards", "Configuration", "Feedback", "Overlay", "Layout", "Display", "Data", "Motion"]) {
      if (!componentCopy.familyStandards?.profiles?.[group]) {
        add("errors", componentCopyFile, 1, `Component family profile missing group: ${group}.`);
      }
    }
    for (const forbidden of [
      "Action and entry controls",
      "Driver or manager completes a primary task safely.",
      "The demo is generated from the",
      "Compact view cannot hide required labels or recovery actions.",
      "Required for input, selection, data, and navigation components.",
      "Pointer, keyboard, touch, escape, focus restoration, and duplicate-action blocking match the component family pattern.",
      "The testing model is shared by every component.",
    ]) {
      if (app.includes(forbidden)) add("errors", docsAppFile, 1, `Component family standard copy must not live in app.js: ${forbidden}`);
    }
    const requiredCopySections = [
      "operational-example",
      "states",
      "variants",
      "variant-state-behavior",
      "full-width",
      "responsive-layout-patterns",
      "viewport-organization",
      "playground",
    ];
    const requiredApiCopyComponents = new Set(["select", "card", "input", "checkbox", "switch", "radio-button", "text-area", "icon-button"]);
    const componentLocaleOverlays = Object.keys(componentCopy.locales?.es?.components ?? {});
    if (componentLocaleOverlays.length) {
      add("errors", componentCopyFile, 1, `Component copy must not define per-component locale overlays: ${componentLocaleOverlays.join(", ")}.`);
    }
    for (const component of goldComponents) {
      const content = componentCopy.components?.[component];
      if (!content) {
        add("errors", componentCopyFile, 1, `Gold component copy missing component: ${component}.`);
        continue;
      }
      const sections = requiredApiCopyComponents.has(component) ? [...requiredCopySections, "api-foundations"] : requiredCopySections;
      for (const section of sections) {
        if (typeof content[section]?.copy !== "string" || content[section].copy.length < 20) {
          add("errors", componentCopyFile, 1, `${component} gold copy missing section copy: ${section}.`);
        }
      }
      if (!Array.isArray(content.anatomy?.items) || content.anatomy.items.length < 3) {
        add("errors", componentCopyFile, 1, `${component} gold anatomy must be structured in content/component-copy.json.`);
      } else {
        for (const item of content.anatomy.items) {
          if (!item.part || !item.rule || !Array.isArray(item.tokens)) {
            add("errors", componentCopyFile, 1, `${component} anatomy items must include part, rule, and tokens.`);
          }
        }
      }
      if (!content.accessibility?.statePrecedence || !Array.isArray(content.accessibility?.items) || content.accessibility.items.length < 4) {
        add("errors", componentCopyFile, 1, `${component} gold accessibility must include statePrecedence and checklist items.`);
      }
      const specContract = spec?.artifacts?.components?.[component];
      const specStates = new Set(specContract?.states ?? []);
      const specStatePrecedence = specContract?.statePrecedence?.replace(/\s*>\s*/g, ", ");
      if (specStatePrecedence && content.accessibility.statePrecedence !== specStatePrecedence) {
        add("errors", componentCopyFile, 1, `${component} accessibility statePrecedence must match specs/unison.system.json.`);
      }
      if (!content["operational-example"]?.scenario) {
        add("errors", componentCopyFile, 1, `${component} operational example must be structured in content/component-copy.json.`);
      }
      const miel = content.miel;
      for (const section of ["canDecide", "mustAsk", "rejectIf"]) {
        if (!Array.isArray(miel?.[section]) || miel[section].length < 3) {
          add("errors", componentCopyFile, 1, `${component} MIEL ${section} must be structured in content/component-copy.json.`);
        }
      }
      if (typeof miel?.handoff !== "string" || miel.handoff.length < 60) {
        add("errors", componentCopyFile, 1, `${component} MIEL handoff must give the agent a concrete handoff sentence.`);
      }
      if (typeof miel?.copy !== "string" || miel.copy.length < 40) {
        add("errors", componentCopyFile, 1, `${component} MIEL copy must be structured in content/component-copy.json.`);
      }
      const playground = content.playground;
      if (!Array.isArray(playground?.controls) || playground.controls.length < 4 || !playground.preview) {
        add("errors", componentCopyFile, 1, `${component} playground controls and preview must be structured in content/component-copy.json.`);
      }
      if (component === "button") {
        const controlOptions = Object.fromEntries((playground?.controls ?? []).filter((control) => control.type === "select").map((control) => [control.name, control.options ?? []]));
        const specVariants = specContract?.variants?.map((variant) => variant.id) ?? [];
        const specIntents = specContract?.intents?.map((intent) => intent.id) ?? [];
        const specStatesForControl = specContract?.states ?? [];
        if (JSON.stringify(controlOptions.variant) !== JSON.stringify(specVariants)) {
          add("errors", componentCopyFile, 1, "Button playground variant options must match specs/unison.system.json.");
        }
        if (JSON.stringify(controlOptions.intent) !== JSON.stringify(specIntents)) {
          add("errors", componentCopyFile, 1, "Button playground intent options must match specs/unison.system.json.");
        }
        if (JSON.stringify(controlOptions.state) !== JSON.stringify(specStatesForControl)) {
          add("errors", componentCopyFile, 1, "Button playground state options must match specs/unison.system.json.");
        }
        if (!Array.isArray(playground?.warnings) || playground.warnings.length < 4) {
          add("errors", componentCopyFile, 1, "Button playground warnings must be structured in content/component-copy.json.");
        }
      }
      const minimumVariantDemos = Math.min(4, Math.max(1, specContract?.variants?.length ?? 4));
      const minimumStateDemos = 4;
      if (!Array.isArray(content.variants?.demos) || content.variants.demos.length < minimumVariantDemos) {
        add("errors", componentCopyFile, 1, `${component} variants demos must include at least ${minimumVariantDemos} component-scoped demos.`);
      }
      if (!Array.isArray(content.states?.demos) || content.states.demos.length < minimumStateDemos) {
        add("errors", componentCopyFile, 1, `${component} states demos must be structured in content/component-copy.json.`);
      }
      for (const demo of content.states?.demos ?? []) {
        const state = demo.state || demo.button?.state || "default";
        if (!specStates.has(state)) {
          add("errors", componentCopyFile, 1, `${component} visible state demo ${state} is missing from specs/unison.system.json.`);
        }
      }
      const matrix = content["variant-state-behavior"];
      const minimumMatrixStates = Math.min(5, Math.max(1, specStates.size));
      if (!Array.isArray(matrix?.rows) || matrix.rows.length < 3 || !Array.isArray(matrix?.states) || matrix.states.length < minimumMatrixStates) {
        add("errors", componentCopyFile, 1, `${component} variant-state-behavior fixtures must be structured in content/component-copy.json.`);
      }
      for (const state of matrix?.states ?? []) {
        if (!specStates.has(state)) {
          add("errors", componentCopyFile, 1, `${component} matrix state ${state} is missing from specs/unison.system.json.`);
        }
      }
      const specVariantIds = new Set(specContract?.variants?.map((variant) => variant.id) ?? []);
      const specIntentIds = new Set(specContract?.intents?.map((intent) => intent.id) ?? []);
      for (const demo of content.variants?.demos ?? []) {
        const variant = demo.variant || demo.button?.variant?.replace(" full", "") || demo.state || demo.label?.toLowerCase();
        const intent = demo.intent || demo.button?.intent || "default";
        if (!specVariantIds.has(variant)) {
          add("errors", componentCopyFile, 1, `${component} visible variant demo ${variant} is missing from specs/unison.system.json.`);
        }
        if (intent !== "default" && !specIntentIds.has(intent)) {
          add("errors", componentCopyFile, 1, `${component} visible intent demo ${intent} is missing from specs/unison.system.json.`);
        }
        if (["danger", "warning"].includes(demo.label?.toLowerCase()) && intent === "default") {
          add("errors", componentCopyFile, 1, `${component} ${demo.label} demo must declare a matching technical intent.`);
        }
      }
      for (const section of ["full-width", "viewport-organization"]) {
        if (!Array.isArray(content[section]?.items) || content[section].items.length < 3) {
          add("errors", componentCopyFile, 1, `${component} ${section} fixtures must be structured in content/component-copy.json.`);
        }
      }
      if (!Array.isArray(content["responsive-layout-patterns"]?.examples) || content["responsive-layout-patterns"].examples.length < 2) {
        add("errors", componentCopyFile, 1, `${component} responsive-layout-patterns examples must be structured in content/component-copy.json.`);
      }
      if (component !== "button") {
        if (!Array.isArray(content.guidelines?.groups) || content.guidelines.groups.length !== 3) {
          add("errors", componentCopyFile, 1, `${component} gold guidelines must be structured in content/component-copy.json.`);
        }
        if (!Array.isArray(content["tests-rejection-rules"]?.mustTest) || !Array.isArray(content["tests-rejection-rules"]?.rejectIf)) {
          add("errors", componentCopyFile, 1, `${component} gold tests and rejection rules must be structured in content/component-copy.json.`);
        }
        const specProps = spec?.artifacts?.components?.[component]?.props ?? [];
        if (!Array.isArray(content["api-foundations"]?.props) || content["api-foundations"].props.length !== specProps.length) {
          add("errors", componentCopyFile, 1, `${component} API props must be structured in content/component-copy.json.`);
        } else {
          const specPropNames = new Set(specProps.map((prop) => prop.name));
          for (const prop of content["api-foundations"].props) {
            if (!prop.name || !prop.type || !prop.required || !prop.notes) {
              add("errors", componentCopyFile, 1, `${component} API props must include name, type, required, and notes.`);
            }
            if (!specPropNames.has(prop.name)) {
              add("errors", componentCopyFile, 1, `${component} visible API prop ${prop.name} is missing from specs/unison.system.json.`);
            }
          }
        }
      }
      if (component === "select") {
        const optionGroups = content.demoOptions ?? {};
        if (!Object.keys(optionGroups).length) {
          add("errors", componentCopyFile, 1, "Select demo options must be structured in content/component-copy.json.");
        }
        for (const [group, options] of Object.entries(optionGroups)) {
          if (!Array.isArray(options) || options.length < 3) {
            add("errors", componentCopyFile, 1, `Select demo option group ${group} must include at least three options.`);
            continue;
          }
          for (const option of options) {
            if (!option.label || !option.helper || !option.icon) {
              add("errors", componentCopyFile, 1, `Select demo option group ${group} options must include label, helper, and icon.`);
            }
          }
        }
      }
    }
  }
}

module.exports = { checkGoldComponentCopyContract };
