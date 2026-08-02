#!/usr/bin/env node

const { checkRepoBoundary } = require("./audit-repo-boundary.js");
const { finishAudit } = require("./audit-result.js");

checkRepoBoundary();
finishAudit();
