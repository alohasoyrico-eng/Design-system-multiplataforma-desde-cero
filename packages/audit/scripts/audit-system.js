#!/usr/bin/env node

const { finishAudit } = require("./audit-result.js");

const {
  checkStaticHygiene,
  checkDocsModuleBoundaries,
  checkCssBalance,
} = require("./audit-css.js");
const { checkFrameLayoutContract } = require("./audit-frame-contracts.js");

const {
  checkHomeContentOwnership,
  checkFoundationCopyOwnership,
  checkPrimitiveCopyOwnership,
  checkReferenceCopyOwnership,
  checkDocsContentOwnership,
} = require("./audit-content-ownership.js");

const {
  checkArchitectureGate,
  checkPrototypePackages,
  checkReleaseAndAdoption,
  countInventory,
} = require("./audit-platform.js");

const { checkMachineReadableSpec } = require("./audit-spec.js");

const {
  checkFoundationRoutesAndContent,
  checkPrimitiveRoutesAndContent,
} = require("./audit-routes.js");

const { checkGoldComponentTokens } = require("./audit-gold-components.js");
const { checkFoundationContracts } = require("./audit-foundation-contracts.js");
const { checkPrimitiveContracts } = require("./audit-primitive-contracts.js");
const { checkGoldPageParity } = require("./audit-gold-page-parity.js");
const { checkGoldDemoQuality } = require("./audit-gold-demo-quality.js");
const { checkDemoLayoutContracts } = require("./audit-demo-layout-contracts.js");
const { checkImplementationStatus } = require("./audit-component-implementation-status.js");
const { checkComponentContracts } = require("./audit-component-contracts.js");
const { checkPatternContracts } = require("./audit-pattern-contracts.js");
const { checkComponentBehaviorContracts } = require("./audit-component-behavior-contracts.js");
const { checkComponentModules } = require("./audit-component-modules.js");
const { checkComponentApiPropAlignment } = require("./audit-component-api-prop-alignment.js");
const { checkComponentRemediationCoverage } = require("./audit-component-remediation-coverage.js");
const { checkComponentRegistry } = require("./audit-component-registry.js");
const { checkComponent1to1QualityMatrix } = require("./audit-component-1to1-quality-matrix.js");
const { checkBatchZipParity } = require("./audit-batch-zip-parity.js");
const { checkPriorityComponentMotionRoles } = require("./audit-component-motion-role-coverage.js");
const { checkMotionContracts } = require("./audit-motion-contracts.js");
const { checkAccessibilityContracts } = require("./audit-accessibility-contracts.js");
const { checkTableContracts } = require("./audit-table-contracts.js");
const { checkLayoutContracts } = require("./audit-layout-contracts.js");
const { checkStateContracts } = require("./audit-state-contracts.js");
const { checkEnergyContracts } = require("./audit-energy-contracts.js");
const { checkVoiceContracts } = require("./audit-voice-contracts.js");
const { checkFoundationCascadeContracts } = require("./audit-foundation-cascade-contracts.js");
const { checkDensityContracts } = require("./audit-density-contracts.js");
const { checkPackageCssContracts } = require("./audit-package-css-contracts.js");
const { checkTemplateComposition } = require("./audit-template-composition.js");
const {
  checkDocsComponentCssOwnership,
  checkDocsPackageImportBoundary,
  checkPublicClassNamespaceOwnership,
} = require("./audit-css-ownership.js");

const {
  checkTemplateBlueprints,
  checkI18nReadiness,
} = require("./audit-docs-content.js");

checkArchitectureGate();
checkPrototypePackages();
checkReleaseAndAdoption();
checkStaticHygiene();
checkDocsModuleBoundaries();
checkCssBalance();
checkFrameLayoutContract();
countInventory();
checkMachineReadableSpec();
checkFoundationRoutesAndContent();
checkPrimitiveRoutesAndContent();
checkFoundationContracts();
checkPrimitiveContracts();
checkGoldComponentTokens();
checkGoldPageParity();
checkGoldDemoQuality();
checkDemoLayoutContracts();
checkImplementationStatus();
checkComponentContracts();
checkPatternContracts();
checkComponentBehaviorContracts();
checkComponentModules();
checkComponentApiPropAlignment();
checkComponentRemediationCoverage();
checkComponentRegistry();
checkComponent1to1QualityMatrix();
checkBatchZipParity();
checkPriorityComponentMotionRoles();
checkMotionContracts();
checkAccessibilityContracts();
checkTableContracts();
checkLayoutContracts();
checkStateContracts();
checkEnergyContracts();
checkVoiceContracts();
checkFoundationCascadeContracts();
checkDensityContracts();
checkPackageCssContracts();
checkTemplateComposition();
checkTemplateBlueprints();
checkI18nReadiness();
checkHomeContentOwnership();
checkFoundationCopyOwnership();
checkPrimitiveCopyOwnership();
checkReferenceCopyOwnership();
checkDocsContentOwnership();
checkDocsComponentCssOwnership();
checkDocsPackageImportBoundary();
checkPublicClassNamespaceOwnership();

finishAudit();
