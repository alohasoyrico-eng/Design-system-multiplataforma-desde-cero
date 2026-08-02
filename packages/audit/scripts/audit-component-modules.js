const {
  fs,
  path,
  root,
  add,
  read,
} = require("./audit-context.js");

const moduleRules = [
  {
    id: "actions",
    file: "packages/components/src/components/actions.js",
    exports: ["createButton", "createIconButton"],
  },
  {
    id: "choices",
    file: "packages/components/src/components/choices.js",
    exports: ["createCheckbox", "createRadioButton", "createSwitch"],
  },
  {
    id: "commerce",
    file: "packages/components/src/components/commerce.js",
    exports: [
      "createCardSummary",
      "createChartPanel",
      "createMovementRow",
      "createQuickAction",
      "createRouteSummary",
      "createStationPin",
      "createTable",
    ],
  },
  {
    id: "display",
    file: "packages/components/src/components/display.js",
    exports: ["createAuditEvent", "createAvatar", "createKpiTile", "createList"],
  },
  {
    id: "feedback",
    file: "packages/components/src/components/feedback.js",
    exports: ["createEmptyState", "createErrorPanel", "createProgressIndicator", "createSkeleton", "createSpinner"],
  },
  {
    id: "fields",
    file: "packages/components/src/components/fields.js",
    exports: ["createSelect", "createTextArea", "createInput"],
  },
  {
    id: "interactions",
    file: "packages/components/src/components/interactions.js",
    exports: ["createAccordion", "createSegmentedControl", "createSlider", "createTabs", "createTreeView"],
  },
  {
    id: "navigation",
    file: "packages/components/src/components/navigation.js",
    exports: ["createBreadcrumbs", "createPagination", "createStepper"],
  },
  {
    id: "motion",
    file: "packages/components/src/components/motion.js",
    exports: ["createAnimatedMoment", "createMotionBoundary"],
  },
  {
    id: "overlays",
    file: "packages/components/src/components/overlays.js",
    exports: [
      "createDialog",
      "createDrawer",
      "createMenu",
      "createPopover",
      "createToast",
      "createTooltip",
    ],
  },
  {
    id: "specialized-inputs",
    file: "packages/components/src/components/specialized-inputs.js",
    exports: ["createDatePicker", "createCodeInput", "createPhoneInput"],
  },
  {
    id: "security",
    file: "packages/components/src/components/security.js",
    exports: ["createBiometricPrompt"],
  },
  {
    id: "status",
    file: "packages/components/src/components/status.js",
    exports: ["createBadge", "createChip", "createTag"],
  },
  {
    id: "surfaces",
    file: "packages/components/src/components/surfaces.js",
    exports: ["createCard", "createFloatingActionButton", "createInlineValidation"],
  },
];

function checkComponentModules() {
  const indexFile = path.join(root, "packages/components/src/index.js");
  const index = read(indexFile);
  if (/^export function create/m.test(index)) {
    add("errors", indexFile, 1, "Public component index must stay declarative; place component factories in focused modules.");
  }

  for (const rule of moduleRules) {
    const file = path.join(root, rule.file);
    if (!fs.existsSync(file)) {
      add("errors", file, 1, `Missing component module: ${rule.id}.`);
      continue;
    }
    const source = read(file);
    for (const exportName of rule.exports) {
      if (!source.includes(`export function ${exportName}`) && !source.includes(`export const ${exportName}`)) {
        add("errors", file, 1, `Component module ${rule.id} must export ${exportName}.`);
      }
      if (!index.includes(exportName) || !index.includes(`./components/${rule.id}.js`)) {
        add("errors", indexFile, 1, `Public component index must re-export ${exportName} from ${rule.id} module.`);
      }
      if (index.includes(`export function ${exportName}`)) {
        add("errors", indexFile, 1, `Public component index must not redefine ${exportName}; keep it in ${rule.id} module.`);
      }
    }
  }
}

module.exports = { checkComponentModules };
