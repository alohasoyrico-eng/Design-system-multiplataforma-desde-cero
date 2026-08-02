#!/usr/bin/env node

const { checkSystemArchitectureGate } = require("./audit-architecture-gate.js");
const { checkMachineReadableSpec } = require("./audit-spec.js");
const { checkComponentContracts } = require("./audit-component-contracts.js");
const { checkPatternContracts } = require("./audit-pattern-contracts.js");
const { checkComponentBehaviorContracts } = require("./audit-component-behavior-contracts.js");
const { checkComponentModules } = require("./audit-component-modules.js");
const { checkPackageApiBoundary } = require("./audit-package-api.js");
const { checkPackageCssContracts } = require("./audit-package-css-contracts.js");
const { finishAudit } = require("./audit-result.js");

checkSystemArchitectureGate();
checkMachineReadableSpec();
checkComponentContracts();
checkPatternContracts();
checkComponentBehaviorContracts();
checkComponentModules();
checkPackageApiBoundary();
checkPackageCssContracts();

finishAudit();
