#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "packages/content/content/component-copy/components");
const targetDir = path.join(root, "packages/content/content/component-contracts/components");
const specDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const sectionOrder = [
  "operational-example",
  "anatomy",
  "accessibility",
  "variants",
  "states",
  "variant-state-behavior",
  "full-width",
  "responsive-layout-patterns",
  "viewport-organization",
  "playground",
  "guidelines",
  "api-foundations",
  "tests-rejection-rules",
  "miel",
];

function mergeJson(target, source) {
  if (Array.isArray(target) && Array.isArray(source)) return [...target, ...source];
  if (!target || typeof target !== "object" || Array.isArray(target)) return source;
  if (!source || typeof source !== "object" || Array.isArray(source)) return source;
  return Object.entries(source).reduce((next, [key, value]) => {
    next[key] = key in next ? mergeJson(next[key], value) : value;
    return next;
  }, { ...target });
}

function readJson(file) {
  return resolveJsonShards(JSON.parse(fs.readFileSync(file, "utf8")), path.dirname(file));
}

function resolveJsonShards(content, baseDir) {
  if (!Array.isArray(content?.$systemShards)) return content;
  return content.$systemShards
    .map((shardPath) => resolveJsonShards(JSON.parse(fs.readFileSync(path.join(baseDir, shardPath), "utf8")), path.dirname(path.join(baseDir, shardPath))))
    .reduce((merged, shard) => mergeJson(merged, shard), {});
}

function componentTitle(id) {
  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function sentence(value) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function list(items) {
  const values = [...new Set((items ?? []).filter(Boolean).map((item) => String(item).trim()).filter(Boolean))];
  return values.length ? `${values.map((item) => `- ${item}`).join("\n")}\n` : "";
}

function itemSummary(item) {
  if (typeof item === "string") return item;
  if (!item || typeof item !== "object") return "";
  const label = item.label ?? item.title ?? item.name ?? item.part ?? "";
  const rule = item.rule ?? item.copy ?? item.rationale ?? item.notes ?? "";
  const layout = item.layout ? `layout: ${item.layout}` : "";
  const density = item.density ? `density: ${item.density}` : "";
  const detail = [rule, layout, density].filter(Boolean).join("; ");
  return [label, detail].filter(Boolean).join(": ");
}

function inlineList(items) {
  const values = [...new Set((items ?? []).filter(Boolean).map((item) => String(item).trim()).filter(Boolean))];
  return values.length ? values.map((item) => `\`${item}\``).join(", ") : "None declared";
}

function collectTokenFamilies(content) {
  const tokens = [];
  for (const item of content.anatomy?.items ?? []) tokens.push(...(item.tokens ?? []));
  const raw = JSON.stringify(content);
  for (const match of raw.matchAll(/"(sys|comp)\.([a-z0-9-]+)/gi)) tokens.push(`${match[1]}.${match[2]}`);
  return [...new Set(tokens
    .map((token) => String(token).split(".").slice(0, 2).join("."))
    .filter((token) => token.includes(".")))]
    .sort();
}

function cell(value) {
  if (Array.isArray(value)) return value.join(", ").replace(/\|/g, "\\|");
  return String(value ?? "").replace(/\n/g, " ").replace(/\|/g, "\\|");
}

function table(headers, rows) {
  if (!rows.length) return "";
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(cell).join(" | ")} |`),
    "",
  ].join("\n");
}

function collectSources(componentDir) {
  return fs.readdirSync(componentDir)
    .filter((file) => file.endsWith(".json"))
    .sort((a, b) => {
      const ai = sectionOrder.indexOf(a.replace(/\.json$/, ""));
      const bi = sectionOrder.indexOf(b.replace(/\.json$/, ""));
      if (a === "all.json") return -1;
      if (b === "all.json") return 1;
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      return a.localeCompare(b);
    })
    .map((file) => path.join(componentDir, file));
}

function readComponent(id) {
  const componentDir = path.join(sourceDir, id);
  const sourceFiles = collectSources(componentDir);
  const merged = sourceFiles
    .map((file) => readJson(file))
    .reduce((next, json) => mergeJson(next, json), {});
  return {
    sourceFiles,
    content: merged.components?.[id] ?? {},
  };
}

function readComponentSpec(id) {
  const file = path.join(specDir, `${id}.json`);
  if (fs.existsSync(file)) return readJson(file).artifacts?.components?.[id] ?? {};
  const dir = path.join(specDir, id);
  if (!fs.existsSync(dir)) return {};
  return fs.readdirSync(dir)
    .filter((entry) => entry.endsWith(".json"))
    .sort()
    .map((entry) => readJson(path.join(dir, entry)))
    .reduce((merged, json) => mergeJson(merged, json.artifacts?.components?.[id] ?? {}), {});
}

function renderOperational(section) {
  if (!section) return "";
  const lines = ["## Operational Example", ""];
  if (sentence(section.copy)) lines.push(section.copy, "");
  const scenario = section.scenario ?? {};
  if (sentence(scenario.rationaleTitle)) lines.push(`### ${scenario.rationaleTitle}`, "");
  if (Array.isArray(scenario.rationale)) lines.push(list(scenario.rationale));
  if (sentence(scenario.type)) lines.push(`Scenario type: \`${scenario.type}\``, "");
  return lines.join("\n");
}

function renderPurpose(content) {
  const purpose = sentence(content["operational-example"]?.copy) || sentence(content.miel?.copy);
  const lines = ["## Purpose", ""];
  if (purpose) lines.push(purpose, "");
  return lines.join("\n");
}

function renderUseWhen(content) {
  const items = content.miel?.canDecide ?? [];
  if (!items.length) return "";
  return ["## Use When", "", list(items)].join("\n");
}

function renderDoNotUse(content) {
  const items = [
    ...(content.miel?.mustAsk ?? []).map((item) => `Ask before use when ${String(item).charAt(0).toLowerCase()}${String(item).slice(1)}`),
    ...(content.miel?.rejectIf ?? []),
    ...(content["tests-rejection-rules"]?.rejectIf ?? []),
  ];
  if (!items.length) return "";
  return ["## Do Not Use Without Review", "", list(items)].join("\n");
}

function renderAnatomy(section) {
  if (!section?.items?.length) return "";
  return [
    "## Anatomy",
    "",
    table(["Part", "Rule", "Tokens"], section.items.map((item) => [item.part, item.rule, item.tokens ?? []])),
  ].join("\n");
}

function renderAccessibility(section) {
  if (!section) return "";
  const lines = ["## Accessibility", ""];
  if (sentence(section.statePrecedence)) lines.push(`State precedence: ${section.statePrecedence}`, "");
  if (Array.isArray(section.items)) lines.push(list(section.items));
  return lines.join("\n");
}

function renderFoundations(content) {
  const tokenFamilies = collectTokenFamilies(content);
  const lines = ["## Foundations", ""];
  if (tokenFamilies.length) {
    lines.push("Referenced token families:", "", list(tokenFamilies.map((token) => `\`${token}.*\``)));
  }
  const apiCopy = sentence(content["api-foundations"]?.copy);
  if (apiCopy) lines.push(apiCopy, "");
  return lines.length > 2 ? lines.join("\n") : "";
}

function renderDefinitionOfReady(content, spec) {
  const foundationNames = Object.keys(spec?.foundations ?? {});
  const tokenDependencies = spec?.tokenDependencies ?? collectTokenFamilies(content).map((token) => `${token}.*`);
  const primitiveDependencies = spec?.primitiveDependencies ?? [];
  const componentDependencies = spec?.componentDependencies ?? spec?.componentsUsed ?? [];
  const referenceDecision = sentence(spec?.referenceDecision);
  const referenceRationale = sentence(spec?.referenceRationale);
  const reviewGates = [
    ...(spec?.rejectIf ?? []),
    ...(content.miel?.mustAsk ?? []).map((item) => `Ask before build: ${item}`),
  ];
  const lines = ["## Definition Of Ready", ""];
  lines.push("Before building or changing this component, confirm:", "");
  lines.push("- Design System owns naming, tokens, foundations, primitives, and public API.");
  lines.push("- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.");
  lines.push("- Documentation, patterns, and templates must consume the package component or the official Package component registry.");
  lines.push("- Docs CSS may arrange examples, but must not redefine component anatomy.");
  lines.push("");
  lines.push(`Foundations required: ${inlineList(foundationNames)}`);
  lines.push("");
  lines.push(`Primitive dependencies: ${inlineList(primitiveDependencies)}`);
  lines.push("");
  lines.push(`Component dependencies: ${inlineList(componentDependencies.length ? componentDependencies : ["None declared"])}`);
  lines.push("");
  lines.push(`Token dependencies: ${inlineList(tokenDependencies)}`);
  lines.push("");
  if (referenceDecision || referenceRationale) {
    lines.push(`Reference translation: ${[referenceDecision, referenceRationale].filter(Boolean).join(" - ")}`, "");
  }
  if (reviewGates.length) {
    lines.push("Gaps or review gates:", "", list(reviewGates));
  } else {
    lines.push("Gaps or review gates:", "", "- None declared in the current spec or MIEL contract.", "");
  }
  return lines.join("\n");
}

function renderVariants(section) {
  if (!section) return "";
  const demos = section.demos ?? [];
  const variants = demos.map((demo) => demo.variant ?? demo.button?.variant ?? demo.select?.variant ?? demo.card?.variant ?? demo.checkbox?.variant ?? demo.switch?.variant ?? demo.radio?.variant ?? demo.field?.variant ?? demo.badge?.variant ?? demo.chip?.variant).filter(Boolean);
  const labels = demos.map((demo) => demo.label).filter(Boolean);
  const lines = ["## Variants", ""];
  if (sentence(section.copy)) lines.push(section.copy, "");
  lines.push(`Approved variants from demos: ${inlineList(variants.length ? variants : labels)}`, "");
  if (labels.length) lines.push("Demo labels:", "", list(labels));
  return lines.join("\n");
}

function renderStates(section) {
  if (!section) return "";
  const demos = section.demos ?? [];
  const states = section.states ?? demos.map((demo) => demo.state ?? demo.label).filter(Boolean);
  const lines = ["## States", ""];
  if (sentence(section.copy)) lines.push(section.copy, "");
  lines.push(`Supported states from docs: ${inlineList(states)}`, "");
  return lines.join("\n");
}

function renderVariantState(section) {
  if (!section) return "";
  const rows = section.rows ?? [];
  const lines = ["## Variant X State Behavior", ""];
  if (sentence(section.copy)) lines.push(section.copy, "");
  if (section.states?.length) lines.push(`State matrix: ${inlineList(section.states)}`, "");
  if (rows.length) lines.push(table(["Row", "Demo variant", "Demo state"], rows.map((row) => [row.label, row.demo?.variant ?? "", row.demo?.state ?? ""])));
  return lines.join("\n");
}

function renderFullWidth(section) {
  if (!section) return "";
  const lines = ["## Full Width", ""];
  if (sentence(section.copy)) lines.push(section.copy, "");
  if (Array.isArray(section.items)) lines.push(list(section.items.map(itemSummary)));
  return lines.join("\n");
}

function renderResponsive(section) {
  if (!section) return "";
  const lines = ["## Responsive Layout Patterns", ""];
  if (sentence(section.copy)) lines.push(section.copy, "");
  if (section.examples?.length) {
    lines.push(table(["Example", "Layout", "Density"], section.examples.map((item) => [item.label, item.layout, item.density])));
  }
  return lines.join("\n");
}

function renderViewport(section) {
  if (!section) return "";
  const lines = ["## Viewport Organization", ""];
  if (sentence(section.copy)) lines.push(section.copy, "");
  if (section.items?.length) {
    lines.push(table(["Viewport", "Rule", "Layout", "Density"], section.items.map((item) => [item.title, item.rule, item.layout, item.density])));
  }
  return lines.join("\n");
}

function renderPlayground(section) {
  if (!section) return "";
  const controls = section.controls ?? section.fields ?? [];
  const lines = ["## Playground", ""];
  if (sentence(section.copy)) lines.push(section.copy, "");
  if (controls.length) {
    lines.push(table(["Control", "Type", "Default", "Options"], controls.map((item) => [item.name ?? item.label, item.type, item.default ?? item.value ?? "", item.options ?? []])));
  }
  return lines.join("\n");
}

function renderGuidelines(section) {
  if (!section) return "";
  const lines = ["## Guidelines", ""];
  if (sentence(section.copy)) lines.push(section.copy, "");
  for (const key of ["do", "dont", "items"]) {
    if (Array.isArray(section[key])) {
      lines.push(`### ${key}`, "", list(section[key].map((item) => item.rule ?? item)));
    }
  }
  return lines.length > 2 ? lines.join("\n") : "";
}

function renderApi(section) {
  if (!section) return "";
  const lines = ["## API And Foundations", ""];
  if (sentence(section.copy)) lines.push(section.copy, "");
  if (section.props?.length) {
    lines.push(table(["Name", "Type", "Required", "Notes"], section.props.map((prop) => [prop.name, prop.type, prop.required, prop.notes])));
  }
  return lines.join("\n");
}

function renderTests(section) {
  if (!section) return "";
  const lines = ["## Tests And Rejection Rules", ""];
  if (section.mustTest?.length) lines.push("Must test:", "", list(section.mustTest));
  if (section.rejectIf?.length) lines.push("Reject if:", "", list(section.rejectIf));
  return lines.join("\n");
}

function renderImplementationChecklist(content) {
  const props = content["api-foundations"]?.props ?? [];
  const requiredProps = props.filter((prop) => String(prop.required).toLowerCase() === "yes").map((prop) => `Provide \`${prop.name}\`: ${prop.notes ?? prop.type ?? "required by API"}`);
  const controls = content.playground?.controls ?? content.playground?.fields ?? [];
  const controlItems = requiredProps.length ? [] : controls.map((control) => {
    const options = Array.isArray(control.options) && control.options.length ? ` Options: ${control.options.join(", ")}.` : "";
    const defaultValue = control.default !== undefined ? ` Default: ${control.default}.` : "";
    return `Set \`${control.name ?? control.label}\` as a documented control.${defaultValue}${options}`;
  });
  const testItems = content["tests-rejection-rules"]?.mustTest ?? [];
  const items = [...requiredProps, ...controlItems, ...testItems];
  if (!items.length) return "";
  return ["## Implementation Checklist", "", list(items)].join("\n");
}

function renderMiel(section) {
  if (!section) return "";
  const lines = ["## MIEL", ""];
  if (sentence(section.copy)) lines.push(section.copy, "");
  if (section.canDecide?.length) lines.push("Agents can decide:", "", list(section.canDecide));
  if (section.mustAsk?.length) lines.push("Agents must ask:", "", list(section.mustAsk));
  if (section.rejectIf?.length) lines.push("Agents must reject:", "", list(section.rejectIf));
  if (sentence(section.handoff)) lines.push("Handoff language:", "", `> ${section.handoff}`, "");
  return lines.join("\n");
}

function renderContract(id, sourceFiles, content, spec) {
  const title = componentTitle(id);
  const sources = sourceFiles.map((file) => `- \`${path.relative(root, file)}\``).join("\n");
  const sections = [
    renderPurpose(content),
    renderDefinitionOfReady(content, spec),
    renderUseWhen(content),
    renderDoNotUse(content),
    renderOperational(content["operational-example"]),
    renderAnatomy(content.anatomy),
    renderAccessibility(content.accessibility),
    renderFoundations(content),
    renderVariants(content.variants),
    renderStates(content.states),
    renderVariantState(content["variant-state-behavior"]),
    renderFullWidth(content["full-width"]),
    renderResponsive(content["responsive-layout-patterns"]),
    renderViewport(content["viewport-organization"]),
    renderPlayground(content.playground),
    renderGuidelines(content.guidelines),
    renderApi(content["api-foundations"]),
    renderImplementationChecklist(content),
    renderTests(content["tests-rejection-rules"]),
    renderMiel(content.miel),
  ].filter(Boolean);
  return [
    `# ${title}`,
    "",
    "Generated portable agent contract for Design System.",
    "",
    "The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.",
    "",
    "Source content:",
    "",
    sources,
    "",
    ...sections,
  ].join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

fs.mkdirSync(targetDir, { recursive: true });

const componentIds = fs.readdirSync(sourceDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const id of componentIds) {
  const { sourceFiles, content } = readComponent(id);
  const spec = readComponentSpec(id);
  const contract = renderContract(id, sourceFiles, content, spec);
  fs.writeFileSync(path.join(targetDir, `${id}.md`), contract);
}

console.log(`Generated ${componentIds.length} component contracts.`);
