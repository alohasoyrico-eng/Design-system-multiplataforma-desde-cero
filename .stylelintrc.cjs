/**
 * Stylelint — enforces the "cero hardcode" rule on component/pattern/primitive CSS.
 * The token package (packages/tokens) is the ONLY place absolute values may live, so it is ignored.
 */
module.exports = {
  extends: ["stylelint-config-standard"],
  ignoreFiles: ["**/dist/**", "packages/tokens/**"],
  rules: {
    // No raw hex/named/rgb colors — colors must come through var(--sys-*/--comp-*).
    "color-no-hex": true,
    "color-named": "never",
    "function-disallowed-list": ["rgb", "rgba", "hsl", "hsla"],
    // No hardcoded z-index — must reference a token.
    "declaration-property-value-disallowed-list": {
      "/^z-index$/": ["/^-?\\d+$/"],
      "/color$/": ["/#/", "/^rgb/", "/^hsl/"],
      "/^background$/": ["/#/", "/^rgb/", "/^hsl/"],
      "/^border/": ["/#/", "/^rgb/", "/^hsl/"],
      "/duration$/": ["/^\\d+m?s$/"],
      "/^transition$/": ["/\\b\\d+m?s\\b/"],
    },
    // Relax standard rules that fight a token-driven / bundler-oriented system.
    "custom-property-pattern": null,
    "selector-class-pattern": null,
    "declaration-block-no-redundant-longhand-properties": null,
    "no-descending-specificity": null,
    "media-feature-range-notation": null,
    "alpha-value-notation": null,
    "import-notation": null,
    "at-rule-empty-line-before": null,
    "keyframes-name-pattern": null,
    // Icon fonts (Material Symbols) intentionally have no generic fallback.
    "font-family-no-missing-generic-family-keyword": null,
  },
};
