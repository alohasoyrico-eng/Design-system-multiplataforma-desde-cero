const {
  add,
  docsAppDir,
  path,
  read,
  root,
} = require("./audit-context.js");

function checkTableContracts() {
  const tableComponentFile = path.join(root, "packages/components/src/components/commerce.js");
  const tableCssFile = path.join(docsAppDir, "styles", "04x-table-docs.css");
  const tableComponent = read(tableComponentFile);
  const tableCss = read(tableCssFile);

  if (!tableComponent.includes('th.setAttribute("aria-sort", sortKey === column.key ? sortDir : "none")')) {
    add("errors", tableComponentFile, 1, "Table sortable headers must expose aria-sort for every sortable column.");
  }
  if (!tableComponent.includes("if (column.align) th.dataset.align = column.align") || !tableComponent.includes("if (column.align) td.dataset.align = column.align")) {
    add("errors", tableComponentFile, 1, "Table headers must share the same data-align contract as body cells.");
  }
  if (!/\.table-demo th button\s*{[^}]*inline-size:\s*100%;[^}]*}/s.test(tableCss)) {
    add("errors", tableCssFile, 1, "Table sortable header buttons must fill the header cell so label alignment matches column content.");
  }
  if (!/\.table-demo th\[data-align="right"\] button\s*{[^}]*justify-content:\s*flex-end;/s.test(tableCss)) {
    add("errors", tableCssFile, 1, "Table right-aligned sortable headers must align their button content to the column edge.");
  }
}

module.exports = { checkTableContracts };
