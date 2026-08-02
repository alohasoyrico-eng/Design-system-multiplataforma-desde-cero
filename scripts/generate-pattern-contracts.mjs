#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "packages/content/content/pattern-copy/patterns");
const targetDir = path.join(root, "packages/content/content/pattern-contracts/patterns");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function titleFromId(id) {
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

function cell(value) {
  if (Array.isArray(value)) return value.join(", ").replace(/\|/g, "\\|");
  return String(value ?? "").replace(/\n/g, " ").replace(/\|/g, "\\|");
}

function table(headers, rows) {
  if (!rows?.length) return "";
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(cell).join(" | ")} |`),
    "",
  ].join("\n");
}

function readPattern(id) {
  const file = path.join(sourceDir, id, "all.json");
  const json = readJson(file);
  return {
    sourceFiles: [file],
    content: json.patterns?.[id] ?? {},
  };
}

function renderPurpose(content) {
  return ["## Purpose", "", sentence(content.purpose), ""].join("\n");
}

function renderUseWhen(content) {
  return ["## Use When", "", list(content.useWhen)].join("\n");
}

function renderDoNotUse(content) {
  return ["## Do Not Use Without Review", "", list(content.doNotUseWithoutReview)].join("\n");
}

function renderFoundations(content) {
  return ["## Foundations", "", table(["Foundation", "Contract"], content.foundations ?? [])].join("\n");
}

function renderSlots(content) {
  return ["## Slot Contract", "", table(["Slot", "Type", "Required", "Notes"], content.slots ?? [])].join("\n");
}

function renderComponents(content) {
  return ["## Components And Primitives Used", "", list(content.componentsUsed)].join("\n");
}

function renderVariants(content) {
  return ["## Variants", "", table(["Variant", "Status", "Rule"], content.variants ?? [])].join("\n");
}

function renderMotion(content) {
  return ["## Motion Contract", "", table(["Behavior", "Rule"], content.motion ?? [])].join("\n");
}

function renderAccessibility(content) {
  return ["## Accessibility", "", list(content.accessibility)].join("\n");
}

function renderTests(content) {
  return ["## Tests And Rejection Rules", "", "Must test:", "", list(content.tests), "Reject if:", "", list(content.miel?.rejectIf)].join("\n");
}

function renderMiel(content) {
  const miel = content.miel ?? {};
  const lines = ["## MIEL", ""];
  if (miel.canDecide?.length) lines.push("Agents can decide:", "", list(miel.canDecide));
  if (miel.mustAsk?.length) lines.push("Agents must ask:", "", list(miel.mustAsk));
  if (miel.rejectIf?.length) lines.push("Agents must reject:", "", list(miel.rejectIf));
  if (sentence(miel.handoff)) lines.push("Handoff language:", "", `> ${miel.handoff}`, "");
  return lines.join("\n");
}

function renderImplementationChecklist(content) {
  const slotItems = (content.slots ?? [])
    .filter((row) => String(row[2]).toLowerCase() === "yes")
    .map((row) => `Declare \`${row[0]}\`: ${row[3]}`);
  const testItems = content.tests ?? [];
  const items = [...slotItems, ...testItems];
  return ["## Implementation Checklist", "", list(items)].join("\n");
}

function renderContract(id, sourceFiles, content) {
  const sources = sourceFiles.map((file) => `- \`${path.relative(root, file)}\``).join("\n");
  const sections = [
    renderPurpose(content),
    renderUseWhen(content),
    renderDoNotUse(content),
    renderFoundations(content),
    renderSlots(content),
    renderComponents(content),
    renderVariants(content),
    renderMotion(content),
    renderAccessibility(content),
    renderImplementationChecklist(content),
    renderTests(content),
    renderMiel(content),
  ].filter(Boolean);

  return [
    `# ${titleFromId(id)}`,
    "",
    "Generated portable agent contract for Design System.",
    "",
    "The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.",
    "",
    "Source content:",
    "",
    sources,
    "",
    ...sections,
  ].join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

fs.mkdirSync(targetDir, { recursive: true });

const patternIds = fs.readdirSync(sourceDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((id) => fs.existsSync(path.join(sourceDir, id, "all.json")))
  .sort();

for (const id of patternIds) {
  const { sourceFiles, content } = readPattern(id);
  fs.writeFileSync(path.join(targetDir, `${id}.md`), renderContract(id, sourceFiles, content));
}

console.log(`Generated ${patternIds.length} pattern contracts.`);
