const {
  path,
  read,
  add,
  lineNumber,
} = require("./audit-context.js");

const packageCssFile = path.join(process.cwd(), "packages/components/styles/components.css");
const packageFeedbackFile = path.join(process.cwd(), "packages/components/src/components/feedback.js");

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

function normalizedSelector(block) {
  return block?.selector.replace(/\/\*[\s\S]*?\*\//g, "").trim();
}

function checkPackageCssContracts() {
  const text = read(packageCssFile);
  const feedbackSource = read(packageFeedbackFile);
  const requiredAliases = [
    "--component-control-min-size",
    "--component-focus-ring-width",
    "--component-focus-ring-offset",
    "--component-radius-pill",
    "--component-radius-control",
    "--component-font-size-caption",
    "--component-font-size-small",
    "--component-font-size-label",
    "--component-font-size-body",
    "--component-font-size-title-sm",
    "--component-font-size-title-md",
    "--component-font-size-data-lg",
    "--component-icon-size-sm",
    "--component-icon-size-md",
    "--component-icon-size-lg",
    "--component-font-size-icon-md",
    "--component-font-size-display-sm",
    "--component-font-size-display-md",
    "--component-duration-fast",
    "--component-duration-snappy",
    "--component-duration-instant",
    "--component-duration-enter",
    "--component-duration-exit",
    "--component-duration-state",
    "--component-duration-overlay",
    "--component-duration-sheet",
    "--component-duration-reveal",
    "--component-duration-press",
    "--component-duration-medium",
    "--component-duration-loop",
    "--component-duration-loading-spin",
    "--component-duration-loading-cycle",
    "--component-duration-progress",
    "--component-duration-shimmer",
    "--component-duration-pulse",
    "--component-ease-standard",
    "--component-ease-emphasis",
    "--component-ease-progress",
    "--component-ease-enter",
    "--component-ease-move",
    "--component-ease-exit",
    "--component-ease-state",
    "--component-ease-press",
    "--component-ease-loading-rhythm",
    "--component-ease-linear",
    "--component-depth-low",
    "--component-depth-low-soft",
    "--component-depth-low-medium",
    "--component-depth-raised",
    "--component-depth-raised-soft",
    "--component-depth-raised-strong",
    "--component-depth-tooltip",
    "--component-depth-panel",
    "--component-depth-inset-track",
    "--component-depth-panel-strong",
    "--component-depth-sheet",
    "--component-depth-pill",
    "--component-depth-action-hover",
    "--component-depth-danger",
    "--component-depth-popover",
    "--component-depth-success-ring",
    "--component-depth-toast",
    "--component-depth-card-hover",
    "--component-depth-date-panel",
  ];
  for (const alias of requiredAliases) {
    if (!text.includes(`${alias}:`)) {
      add("errors", packageCssFile, 1, `Package component CSS must define the internal alias ${alias}.`);
    }
  }

  const cssWithoutDefinitions = text.replace(/:root\s*{[^}]*}/, "");
  const rawCurveIndex = cssWithoutDefinitions.search(/cubic-bezier\(/);
  if (rawCurveIndex >= 0) {
    const sourceIndex = text.indexOf("cubic-bezier", text.indexOf("}") + 1);
    add("errors", packageCssFile, lineNumber(text, sourceIndex), "Package motion curves must use internal motion aliases instead of raw cubic-bezier values.");
  }

  if (/border-radius:\s*999px\s*;/.test(cssWithoutDefinitions)) {
    add("errors", packageCssFile, 1, "Package pill radii must use --component-radius-pill outside the alias block.");
  }
  const directMotionAliasIndex = cssWithoutDefinitions.search(/var\(--component-(?:ease-standard|ease-emphasis|ease-progress|duration-fast)\)/);
  if (directMotionAliasIndex >= 0) {
    const sourceIndex = text.indexOf(cssWithoutDefinitions.match(/var\(--component-(?:ease-standard|ease-emphasis|ease-progress|duration-fast)\)/)?.[0] ?? "", text.indexOf("}") + 1);
    add("errors", packageCssFile, lineNumber(text, sourceIndex), "Package components must consume semantic motion role aliases, not base motion aliases.");
  }
  const rawFontSizeIndex = cssWithoutDefinitions.search(/font-size:\s*[0-9.]+(?:rem|px)\s*;/);
  if (rawFontSizeIndex >= 0) {
    const sourceIndex = text.indexOf("font-size:", text.indexOf("}") + 1);
    add("errors", packageCssFile, lineNumber(text, sourceIndex), "Package typography must use internal font-size aliases instead of raw rem or px values.");
  }
  const rawControlSizePattern = /\b(?:min-block-size|min-height|min-inline-size|inline-size|block-size|width):\s*44px\s*;/;
  if (rawControlSizePattern.test(cssWithoutDefinitions)) {
    add("errors", packageCssFile, 1, "Package 44px control sizing must use --component-control-min-size outside the alias block.");
  }

  const blocks = cssBlocks(text);
  const buttonBlock = blocks.find((block) => block.selector === ".button");
  const buttonSmBlock = blocks.find((block) => block.selector === ".button[data-density=\"sm\"]");
  const buttonLgBlock = blocks.find((block) => block.selector === ".button[data-density=\"lg\"]");
  const buttonIconBlock = blocks.find((block) => block.selector === ".button__icon");
  if (!buttonBlock?.body.includes("min-block-size: var(--button-current-size, var(--button-size-md))")) {
    add("errors", packageCssFile, buttonBlock ? lineNumber(text, buttonBlock.index) : 1, "Button block size must follow its density-owned size token.");
  }
  if (!buttonBlock?.body.includes("min-height: var(--button-current-size, var(--button-size-md))")) {
    add("errors", packageCssFile, buttonBlock ? lineNumber(text, buttonBlock.index) : 1, "Button physical fallback height must follow the same density-owned size token.");
  }
  if (!buttonSmBlock?.body.includes("--button-current-size: var(--button-size-sm)") || !buttonLgBlock?.body.includes("--button-current-size: var(--button-size-lg)")) {
    add("errors", packageCssFile, 1, "Button sm and lg densities must set --button-current-size from Button size tokens.");
  }
  if (!buttonIconBlock?.body.includes("font-size: var(--button-current-icon-size, var(--button-icon-size-md))")) {
    add("errors", packageCssFile, buttonIconBlock ? lineNumber(text, buttonIconBlock.index) : 1, "Button icon size must follow the current density token.");
  }
  if (/\.button,\s*\n[\s\S]{0,160}?min-block-size:\s*var\(--component-control-min-size\)/.test(text)) {
    add("errors", packageCssFile, 1, "Button must not be reset by a later generic 44px rule; use Button density tokens.");
  }

  const sliderBlock = blocks.find((block) => normalizedSelector(block) === ".slider");
  const sliderSmBlock = blocks.find((block) => normalizedSelector(block) === ".slider[data-density=\"sm\"]");
  const sliderLgBlock = blocks.find((block) => normalizedSelector(block) === ".slider[data-density=\"lg\"]");
  const sliderTrackBlock = blocks.find((block) => normalizedSelector(block).replace(/\s+/g, "") === ".slider__track,.slider__fill");
  const sliderThumbBlock = blocks.find((block) => normalizedSelector(block) === ".slider__thumb");
  if (!sliderBlock?.body.includes("--slider-track-size: var(--component-slider-track-size-md)")) {
    add("errors", packageCssFile, sliderBlock ? lineNumber(text, sliderBlock.index) : 1, "Slider md density must define the package-owned track size.");
  }
  if (!sliderBlock?.body.includes("--slider-thumb-border-width: calc(var(--component-border-width) * 3)")) {
    add("errors", packageCssFile, sliderBlock ? lineNumber(text, sliderBlock.index) : 1, "Slider md density must define the package-owned thumb border width.");
  }
  if (!sliderSmBlock?.body.includes("--slider-track-size: var(--component-slider-track-size-sm)") || !sliderSmBlock?.body.includes("--slider-thumb-size: var(--component-slider-thumb-size-sm)") || !sliderSmBlock?.body.includes("--slider-thumb-border-width: calc(var(--component-border-width) * 2)")) {
    add("errors", packageCssFile, sliderSmBlock ? lineNumber(text, sliderSmBlock.index) : 1, "Slider sm density must scale track, thumb, and thumb border geometry.");
  }
  if (!sliderLgBlock?.body.includes("--slider-track-size: var(--component-slider-track-size-lg)") || !sliderLgBlock?.body.includes("--slider-thumb-size: var(--component-slider-thumb-size-lg)") || !sliderLgBlock?.body.includes("--slider-thumb-halo: 0 0 0 calc(var(--component-border-width) * 5)")) {
    add("errors", packageCssFile, sliderLgBlock ? lineNumber(text, sliderLgBlock.index) : 1, "Slider lg density must scale track, thumb, and halo geometry.");
  }
  if (!sliderTrackBlock?.body.includes("block-size: var(--slider-track-size)") || !sliderTrackBlock?.body.includes("border-radius: var(--slider-track-radius)")) {
    add("errors", packageCssFile, sliderTrackBlock ? lineNumber(text, sliderTrackBlock.index) : 1, "Slider track and fill must consume the density-owned track size and radius.");
  }
  if (!sliderThumbBlock?.body.includes("border: var(--slider-thumb-border-width) solid var(--slider-state-color)") || !sliderThumbBlock?.body.includes("inline-size: var(--slider-thumb-size)")) {
    add("errors", packageCssFile, sliderThumbBlock ? lineNumber(text, sliderThumbBlock.index) : 1, "Slider thumb must consume density-owned size and border variables.");
  }

  const iconButtonBlock = blocks.find((block) => block.selector === ".icon-button");
  const iconButtonIconBlock = blocks.find((block) => block.selector === ".icon-button__icon");
  const iconButtonBadgeBlock = blocks.find((block) => block.selector === ".icon-button__badge");
  if (!iconButtonBlock?.body.includes("block-size: var(--icon-button-size, var(--icon-button-size-md))")) {
    add("errors", packageCssFile, iconButtonBlock ? lineNumber(text, iconButtonBlock.index) : 1, "Icon Button must use the density-owned size for both axes.");
  }
  if (!iconButtonIconBlock?.body.includes("font-size: var(--icon-button-current-icon-size, var(--icon-button-icon-size-md))")) {
    add("errors", packageCssFile, iconButtonIconBlock ? lineNumber(text, iconButtonIconBlock.index) : 1, "Icon Button symbol size must follow the current density token.");
  }
  if (!iconButtonBadgeBlock?.body.includes("animation: component-pulse var(--component-duration-loop) var(--component-ease-state) infinite")) {
    add("errors", packageCssFile, iconButtonBadgeBlock ? lineNumber(text, iconButtonBadgeBlock.index) : 1, "Icon Button badge must use the shared pulse motion role.");
  }
  if (!/@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.icon-button__badge[\s\S]*?animation:\s*none\s*!important/.test(text)) {
    add("errors", packageCssFile, 1, "Icon Button badge pulse must stop under reduced motion.");
  }

  const spinnerBlock = cssBlocks(text).find((block) => block.selector === ".spinner");
  const spinnerSvgBlock = cssBlocks(text).find((block) => block.selector === ".spinner__svg");
  const spinnerArcBlock = cssBlocks(text).find((block) => block.selector === ".spinner__arc");
  const spinnerKeyframes = text.match(/@keyframes\s+spinner-spin\s*{[\s\S]*?\n}/)?.[0] ?? "";
  if (spinnerBlock?.body.includes("animation:") || spinnerBlock?.body.includes("border:")) {
    add("errors", packageCssFile, spinnerBlock ? lineNumber(text, spinnerBlock.index) : 1, "Spinner base must not fake motion or geometry with border styles; use the SVG track and arc.");
  }
  if (!spinnerBlock?.body.includes("--spinner-spin-ease: var(--component-ease-linear)")) {
    add("errors", packageCssFile, spinnerBlock ? lineNumber(text, spinnerBlock.index) : 1, "Spinner must use the linear continuous motion alias.");
  }
  if (!spinnerBlock?.body.includes("--spinner-rhythm-ease: var(--component-ease-loading-rhythm)")) {
    add("errors", packageCssFile, spinnerBlock ? lineNumber(text, spinnerBlock.index) : 1, "Spinner must use the loading rhythm alias for arc motion.");
  }
  if (!spinnerSvgBlock?.body.includes("animation: spinner-spin var(--spinner-spin-cycle) var(--spinner-spin-ease) infinite")) {
    add("errors", packageCssFile, spinnerSvgBlock ? lineNumber(text, spinnerSvgBlock.index) : 1, "Spinner SVG must own the shared continuous spin animation.");
  }
  if (!spinnerArcBlock?.body.includes("animation: spinner-arc-breathe var(--spinner-rhythm-cycle) var(--spinner-rhythm-ease) infinite alternate")) {
    add("errors", packageCssFile, spinnerArcBlock ? lineNumber(text, spinnerArcBlock.index) : 1, "Spinner arc must breathe with an alternating loading rhythm so the loop does not visibly reset.");
  }
  if (!spinnerArcBlock?.body.includes("stroke-dasharray") || !spinnerArcBlock?.body.includes("stroke: var(--spinner-tone)")) {
    add("errors", packageCssFile, spinnerArcBlock ? lineNumber(text, spinnerArcBlock.index) : 1, "Spinner active arc must be one SVG stroke segment using the semantic tone.");
  }
  if (!text.includes("@keyframes spinner-arc-breathe")) {
    add("errors", packageCssFile, 1, "Spinner must define arc breathing keyframes so compact loading is not a flat rotation.");
  }
  if (!feedbackSource.includes('track.setAttribute("pathLength", "100")') || !feedbackSource.includes('arc.setAttribute("pathLength", "100")')) {
    add("errors", packageFeedbackFile, 1, "Spinner SVG track and arc must normalize pathLength to 100 so dash rhythm is stable across browsers.");
  }
  const spinnerArcKeyframes = text.match(/@keyframes\s+spinner-arc-breathe\s*{[\s\S]*?\n}/)?.[0] ?? "";
  if (/stroke-dashoffset/.test(spinnerArcKeyframes)) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("@keyframes spinner-arc-breathe")), "Spinner arc rhythm must not animate dashoffset because it creates a visible loop reset.");
  }
  if (!/from\s*{[\s\S]*?stroke-dasharray:\s*30 100/.test(spinnerArcKeyframes) || !/to\s*{[\s\S]*?stroke-dasharray:\s*74 100/.test(spinnerArcKeyframes)) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("@keyframes spinner-arc-breathe")), "Spinner arc breathing keyframes must use two stable endpoints for the alternating loop.");
  }
  if (/scale\(|translateY\(|cubic-bezier|ease-emphasis/.test(spinnerKeyframes)) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("@keyframes spinner-spin")), "Spinner keyframes must avoid scale, translate, and non-linear easing in the continuous loop.");
  }

  const enterAnimationPattern = /animation:\s*[^;]*-enter[^;]*;/g;
  for (const match of text.matchAll(enterAnimationPattern)) {
    if (match[0].includes("var(--component-ease-enter)")) continue;
    add("errors", packageCssFile, lineNumber(text, match.index), "Package lifecycle enter animations must use --component-ease-enter.");
  }

  const motionBoundaryEnteringBlock = cssBlocks(text).find((block) => block.selector === '.motion-boundary[data-state="entering"] .motion-boundary__cue');
  const motionBoundaryExitingBlock = cssBlocks(text).find((block) => block.selector === '.motion-boundary[data-state="exiting"] .motion-boundary__cue');
  if (!motionBoundaryEnteringBlock?.body.includes("--motion-boundary-cue-ease: var(--component-ease-enter)")) {
    add("errors", packageCssFile, motionBoundaryEnteringBlock ? lineNumber(text, motionBoundaryEnteringBlock.index) : 1, "Motion Boundary entering state must use the package enter motion role.");
  }
  if (!motionBoundaryExitingBlock?.body.includes("--motion-boundary-cue-ease: var(--component-ease-exit)")) {
    add("errors", packageCssFile, motionBoundaryExitingBlock ? lineNumber(text, motionBoundaryExitingBlock.index) : 1, "Motion Boundary exiting state must use the package exit motion role.");
  }

  for (const block of cssBlocks(text)) {
    if (!/:(?:focus-visible|focus-within|focus)\b/.test(block.selector)) continue;
    const line = lineNumber(text, block.index);
    if (/(?:^|\n)\s*box-shadow:\s*(?:inset\s*)?0\s+0\s+0\b/.test(block.body)) {
      add("errors", packageCssFile, line, "Package focus states must use outline and outline-offset, not box-shadow focus rings.");
    }
    if (/(?:^|\n)\s*outline:\s*0\s*;/.test(block.body) || /(?:^|\n)\s*outline:\s*none\s*;/.test(block.body)) {
      add("errors", packageCssFile, line, "Package focus states must not disable outline.");
    }
  }

  const kpiBlock = cssBlocks(text).find((block) => block.selector === ".kpi-tile");
  const kpiRiskBlock = cssBlocks(text).find((block) => block.selector.includes('.kpi-tile[data-variant="threshold"]'));
  if (!kpiBlock?.body.includes("box-shadow: var(--component-depth-panel)") || kpiBlock?.body.includes("border-inline-start")) {
    add("errors", packageCssFile, 1, "KPI Tile must match the StatTile reference: base tiles use panel depth and must not force a leading status rail.");
  }
  if (!kpiRiskBlock?.body.includes("border-inline-start")) {
    add("errors", packageCssFile, 1, "KPI Tile threshold/risk state must keep a semantic leading status rail.");
  }
}

module.exports = { checkPackageCssContracts };
