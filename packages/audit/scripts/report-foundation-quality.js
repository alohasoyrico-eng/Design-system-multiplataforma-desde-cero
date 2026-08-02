#!/usr/bin/env node

const {
  fs,
  path,
  root,
  foundations,
  goldComponents,
  readDocsCss,
  readJson,
  readSpec,
  componentCopyFile,
} = require("./audit-context.js");

const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "foundation-quality-matrix.json");
const markdownOutput = path.join(outputDir, "foundation-quality-matrix.md");

const foundationNeedles = {
  Energy: ["sys.energy.", "ref-energy-", "energy"],
  Voice: ["sys.voice.", "ref-voice-", "voice"],
  Frame: ["sys.frame.", "ref-frame-", "frame"],
  Depth: ["sys.depth.", "depth", "elevation", "shadow"],
  Momentum: ["sys.momentum.", "ref-momentum-", "momentum", "transition", "animation"],
  State: ["sys.state.", "data-state", "aria-selected", "aria-pressed", "disabled"],
  Tone: ["sys.tone.", "tone", "danger", "warning", "success", "info"],
  Growth: ["sys.growth.", "growth", "deprecated", "stable"],
  Symbol: ["sys.symbol.", "symbol", "material-symbol"],
  Iconography: ["sys.iconography.", "iconography", "material-symbol"],
  Accessibility: ["sys.accessibility.", "sys.a11y.", "aria-", "focus", "accessibility"],
};

const componentNeedles = {
  button: ["--comp-button", ".button", "button-demo"],
  select: ["--comp-select", ".select-", "select-trigger"],
  card: ["--comp-card", ".card-", "card-demo"],
  "input": ["--comp-input", ".input-", "input-demo"],
  checkbox: ["--comp-checkbox", ".checkbox-", "checkbox-demo"],
  switch: ["--comp-switch", ".switch-", "switch-demo"],
  "radio-button": ["--comp-radio-button", ".radio-", "radio-button"],
  "text-area": ["--comp-text-area", ".text-area-", "text-area-demo"],
  "icon-button": ["--comp-icon-button", ".icon-button", "icon-button-demo"],
  badge: ["--comp-badge", ".badge-", "badge-demo"],
  chip: ["--comp-chip", ".chip"],
  tag: ["--comp-tag", ".tag-", "tag-demo"],
  tabs: ["--comp-tabs", ".tabs-", "tabs-demo"],
};

const statusRank = {
  fail: 0,
  "needs review": 1,
  pass: 2,
  "not applicable": 3,
};

function foundationToken(foundation) {
  if (foundation === "Accessibility") return ["sys.accessibility.", "sys.a11y."];
  return [`sys.${foundation.toLowerCase()}.`];
}

function normalizeToken(value) {
  return String(value).replace(/\.\*$/, ".");
}

function includesAny(text, needles) {
  return needles.some((needle) => text.includes(needle));
}

function sectionExists(copy, key) {
  const section = copy?.[key];
  return section && typeof section === "object" && Object.keys(section).length > 0;
}

function componentCss(css, component) {
  const needles = componentNeedles[component] ?? [`--comp-${component}`, `.${component}`];
  return css
    .split("\n")
    .filter((line) => needles.some((needle) => line.includes(needle)))
    .join("\n");
}

function stateCount(copy) {
  return copy?.states?.demos?.length ?? 0;
}

function hasToneSurface(copy) {
  const text = JSON.stringify(copy ?? {}).toLowerCase();
  return ["tone", "danger", "warning", "success", "info", "error"].some((word) => text.includes(word));
}

function directFoundationEvidence({ foundation, copy, specComponent, componentCssText }) {
  const copyText = JSON.stringify(copy ?? {});
  const anatomyTokens = (copy?.anatomy?.items ?? []).flatMap((item) => item.tokens ?? []).map(normalizeToken);
  const tokenDependencies = (specComponent?.tokenDependencies ?? []).map(normalizeToken);
  const tokens = foundationToken(foundation);
  const needles = foundationNeedles[foundation] ?? tokens;

  return {
    inSpecContract: Boolean(specComponent?.foundations?.[foundation]),
    inTokenDependencies: tokens.some((token) => tokenDependencies.some((dependency) => dependency.startsWith(token) || token.startsWith(dependency))),
    inAnatomy: tokens.some((token) => anatomyTokens.some((anatomyToken) => anatomyToken.startsWith(token) || token.startsWith(anatomyToken))),
    inCopy: includesAny(copyText, needles),
    inCss: includesAny(componentCssText, needles),
  };
}

function assessFoundation(component, foundation, copy, specComponent, componentCssText) {
  const evidence = directFoundationEvidence({ foundation, copy, specComponent, componentCssText });
  const notes = [];

  if (!evidence.inSpecContract) {
    return {
      status: "fail",
      evidence,
      notes: [`Missing ${foundation} in the machine-readable component contract.`],
    };
  }

  if (["Depth", "Tone", "Growth", "Symbol", "Iconography"].includes(foundation) && !evidence.inTokenDependencies && !evidence.inAnatomy && !evidence.inCopy) {
    return {
      status: "not applicable",
      evidence,
      notes: [`${foundation} is inherited or not directly exercised by this component.`],
    };
  }

  if (foundation === "Energy") {
    if (!evidence.inTokenDependencies || !evidence.inAnatomy || !evidence.inCss) {
      return {
        status: "fail",
        evidence,
        notes: ["Energy must be visible in token dependencies, Anatomy, and component CSS."],
      };
    }
    return {
      status: "needs review",
      evidence,
      notes: ["Token use is present; contrast and visual hierarchy still need visual/contrast audit by variant and state."],
    };
  }

  if (foundation === "Voice") {
    if (!evidence.inAnatomy) notes.push("Anatomy must expose text/label ownership through Voice.");
    if (!sectionExists(copy, "operational-example")) notes.push("Operational copy is missing.");
  }

  if (foundation === "Frame") {
    if (!evidence.inAnatomy) notes.push("Anatomy must expose size, spacing, or surface structure through Frame.");
    if (!sectionExists(copy, "viewport-organization")) notes.push("Viewport organization is missing.");
  }

  if (foundation === "Depth") {
    if (!evidence.inTokenDependencies && !evidence.inAnatomy) {
      return {
        status: "not applicable",
        evidence,
        notes: ["No direct elevation/layering dependency in this component contract."],
      };
    }
    if (!evidence.inCss) notes.push("Depth is in the contract but not visible in component CSS evidence.");
  }

  if (foundation === "Momentum") {
    if (!evidence.inTokenDependencies && !evidence.inAnatomy && !evidence.inCss) {
      return {
        status: "not applicable",
        evidence,
        notes: ["No direct motion dependency detected for this component."],
      };
    }
    return {
      status: "needs review",
      evidence,
      notes: ["Motion hooks are present; timing, easing, reduced-motion behavior, and ZIP-like feel require interaction review."],
    };
  }

  if (foundation === "State") {
    if (!sectionExists(copy, "states") || stateCount(copy) < 5) notes.push("States section must expose a complete state set.");
    if (!evidence.inAnatomy && !evidence.inCss) notes.push("State must be visible in anatomy or component CSS.");
  }

  if (foundation === "Tone") {
    if (!hasToneSurface(copy)) {
      return {
        status: "not applicable",
        evidence,
        notes: ["No semantic tone surface is directly exercised here."],
      };
    }
    return {
      status: "needs review",
      evidence,
      notes: ["Semantic tone exists; needs visual review so tone does not compete with primary action or rely on color alone."],
    };
  }

  if (foundation === "Growth") {
    if (!evidence.inTokenDependencies && !evidence.inAnatomy && !evidence.inCss) {
      return {
        status: "not applicable",
        evidence,
        notes: ["No direct maturity/adoption-stage surface in this component."],
      };
    }
  }

  if (foundation === "Symbol") {
    if (!evidence.inTokenDependencies && !evidence.inAnatomy && !evidence.inCss) {
      return {
        status: "not applicable",
        evidence,
        notes: ["No direct symbolic surface in this component."],
      };
    }
  }

  if (foundation === "Iconography") {
    if (!evidence.inTokenDependencies && !evidence.inAnatomy && !evidence.inCss) {
      return {
        status: "not applicable",
        evidence,
        notes: ["No direct iconographic surface in this component."],
      };
    }
    return {
      status: "needs review",
      evidence,
      notes: ["Icon tokens exist; size, weight, optical alignment, and mobile legibility need visual review."],
    };
  }

  if (foundation === "Accessibility") {
    if (!sectionExists(copy, "accessibility")) notes.push("Accessibility section is missing.");
    if (!evidence.inAnatomy && !evidence.inCopy) notes.push("Accessibility must be exposed in Anatomy or component copy.");
  }

  if (notes.length) return { status: "fail", evidence, notes };
  return { status: "pass", evidence, notes: ["Machine-readable contract and documentation evidence are present."] };
}

function summarize(matrix) {
  const counts = { pass: 0, "needs review": 0, fail: 0, "not applicable": 0 };
  for (const row of matrix.components) {
    for (const foundation of Object.values(row.foundations)) {
      counts[foundation.status] += 1;
    }
  }
  const componentSummary = matrix.components.map((component) => {
    const statuses = Object.values(component.foundations).map((foundation) => foundation.status);
    const worst = statuses.sort((a, b) => statusRank[a] - statusRank[b])[0];
    return {
      id: component.id,
      contractCoverage: component.contractCoverage,
      worstStatus: worst,
      needsReview: statuses.filter((status) => status === "needs review").length,
      failures: statuses.filter((status) => status === "fail").length,
    };
  });
  return { counts, componentSummary };
}

function statusMark(status) {
  return {
    pass: "pass",
    "needs review": "review",
    fail: "fail",
    "not applicable": "n/a",
  }[status];
}

function buildMarkdown(matrix) {
  const headers = ["Component", ...foundations];
  const lines = [
    "# Foundation Quality Matrix",
    "",
    `Generated: ${matrix.generatedAt}`,
    "",
    "This report separates minimum contract coverage from quality confidence. `pass` means the current automated evidence is sufficient for that foundation. `review` means tokens/docs exist, but the foundation still needs visual, motion, contrast, or interaction judgement before scaling.",
    "",
    "## Summary",
    "",
    `- Pass: ${matrix.summary.counts.pass}`,
    `- Needs review: ${matrix.summary.counts["needs review"]}`,
    `- Fail: ${matrix.summary.counts.fail}`,
    `- Not applicable: ${matrix.summary.counts["not applicable"]}`,
    "",
    "## Matrix",
    "",
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
  ];

  for (const component of matrix.components) {
    lines.push(`| ${component.id} | ${foundations.map((foundation) => statusMark(component.foundations[foundation].status)).join(" | ")} |`);
  }

  lines.push("", "## Component Notes", "");
  for (const component of matrix.components) {
    const needs = Object.entries(component.foundations)
      .filter(([, value]) => value.status === "needs review" || value.status === "fail")
      .map(([foundation, value]) => `- ${foundation}: ${value.status}. ${value.notes.join(" ")}`);
    lines.push(`### ${component.id}`, "");
    lines.push(`Contract coverage: ${component.contractCoverage.present}/${component.contractCoverage.expected} foundations.`);
    if (needs.length) lines.push("", ...needs);
    else lines.push("", "- No quality review blockers from the current automated checks.");
    lines.push("");
  }

  lines.push("## What This Still Does Not Prove", "");
  lines.push("- It does not replace visual comparison against the ZIP reference.");
  lines.push("- It does not compute full WCAG contrast for every rendered state.");
  lines.push("- It does not prove motion feel, only that motion hooks are present.");
  lines.push("- It does not prove icon optical quality, only that symbol/icon tokens are wired.");
  lines.push("- It does not judge whether product examples are strategically strong enough.");
  lines.push("");

  return `${lines.join("\n")}\n`;
}

function buildMatrix() {
  const copy = readJson(componentCopyFile);
  const spec = readSpec();
  const css = readDocsCss();
  const matrix = {
    generatedAt: new Date().toISOString(),
    foundations,
    components: goldComponents.map((component) => {
      const componentCopy = copy?.components?.[component] ?? {};
      const specComponent = spec?.artifacts?.components?.[component] ?? {};
      const cssText = componentCss(css, component);
      const componentFoundations = Object.keys(specComponent?.foundations ?? {});
      return {
        id: component,
        contractCoverage: {
          expected: foundations.length,
          present: componentFoundations.length,
          missing: foundations.filter((foundation) => !componentFoundations.includes(foundation)),
        },
        foundations: Object.fromEntries(
          foundations.map((foundation) => [
            foundation,
            assessFoundation(component, foundation, componentCopy, specComponent, cssText),
          ]),
        ),
      };
    }),
  };
  matrix.summary = summarize(matrix);
  return matrix;
}

fs.mkdirSync(outputDir, { recursive: true });
const matrix = buildMatrix();
fs.writeFileSync(jsonOutput, `${JSON.stringify(matrix, null, 2)}\n`);
fs.writeFileSync(markdownOutput, buildMarkdown(matrix));

console.log(JSON.stringify({
  status: matrix.summary.counts.fail ? "fail" : "pass",
  outputs: [
    path.relative(root, jsonOutput),
    path.relative(root, markdownOutput),
  ],
  summary: matrix.summary.counts,
}, null, 2));

if (matrix.summary.counts.fail) process.exitCode = 1;
