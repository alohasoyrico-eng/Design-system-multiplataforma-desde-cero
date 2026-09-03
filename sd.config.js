import StyleDictionary from 'style-dictionary';

// ── Token path helpers ──

const isRef = (t) => t.path[1] === 'ref';
const isSysLight = (t) => t.path[1] === 'sys' && t.path[2] === 'light';
const isSysDark = (t) => t.path[1] === 'sys' && t.path[2] === 'dark';
const isSysScale = (t) => t.path[1] === 'sys' && !['light', 'dark'].includes(t.path[2]);
const isTypography = (t) => t.$type === 'typography';

// ── CSS name: kebab-case from path ──
// Renombres de segmento: el CSS a mano abrevia. El nombre generado tiene que
// ser exactamente el consumido (check-tokens-parity es la reja).
const SEG = { duration: 'dur', easing: 'ease', lineHeight: 'lh', weight: 'wt', padding: 'pad' };
const seg = (s) => SEG[s] ?? s;
// 'sizing' se aplana con nombres propios en el CSS a mano:
const SIZING = { bar: 'height-bar', 'control-lg': 'height-control-lg', 'content-max': 'content-max',
  'hit-target-min': 'hit-target-min', 'sidebar-collapsed': 'sidebar-collapsed', 'sidebar-width': 'sidebar-width' };

function kebab(parts) {
  return parts
    .map(s => s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase())
    .join('-');
}

StyleDictionary.registerTransform({
  name: 'name/flow/ref',
  type: 'name',
  filter: isRef,
  transform: (t) => {
    let parts = t.path.slice(2).map(seg);
    if (parts[0] === 'color') parts = parts.slice(1); // --ref-grey-500, no --ref-color-grey-500
    return 'ref-' + kebab(parts);
  },
});

StyleDictionary.registerTransform({
  name: 'name/flow/sys-themed',
  type: 'name',
  filter: (t) => isSysLight(t) || isSysDark(t),
  transform: (t) => kebab(t.path.slice(3)),
});

StyleDictionary.registerTransform({
  name: 'name/flow/brand',
  type: 'name',
  filter: (t) => t.path[1] === 'brand',
  transform: (t) => 'flow-' + kebab(t.path.slice(2)),
});

StyleDictionary.registerTransform({
  name: 'name/flow/sys-scale',
  type: 'name',
  filter: isSysScale,
  transform: (t) => {
    const parts = t.path.slice(2).map(seg);
    if (parts[0] === 'sizing') {
      const rest = kebab(parts.slice(1));
      return SIZING[rest] ?? rest;
    }
    return kebab(parts);
  },
});

// Ruta json → nombre de variable CSS (las mismas reglas que las transforms).
// Lo usa css/flow para emitir alias como var(--nombre): la resolucion tardia
// de CSS es lo que hace que el modo oscuro salga gratis — congelar el valor
// en build la perderia.
function pathToCssName(path) {
  const tier = path[1];
  const segs = (p) => p.map(seg);
  if (tier === 'ref') {
    let parts = segs(path.slice(2));
    if (parts[0] === 'color') parts = parts.slice(1);
    return 'ref-' + kebab(parts);
  }
  if (tier === 'brand') return 'flow-' + kebab(segs(path.slice(2)));
  if (tier === 'sys' && (path[2] === 'light' || path[2] === 'dark')) return kebab(segs(path.slice(3)));
  if (tier === 'sys') {
    const parts = segs(path.slice(2));
    if (parts[0] === 'sizing') { const rest = kebab(parts.slice(1)); return SIZING[rest] ?? rest; }
    return kebab(parts);
  }
  return kebab(path.slice(2));
}

// ── CSS value transforms ──

StyleDictionary.registerTransform({
  name: 'value/css/dimension',
  type: 'value',
  filter: (t) => t.$type === 'dimension' && typeof t.$value === 'number',
  transform: (t) => `${t.$value}px`,
});

StyleDictionary.registerTransform({
  name: 'value/css/duration',
  type: 'value',
  filter: (t) => t.$type === 'duration' && typeof t.$value === 'number',
  transform: (t) => `${t.$value}ms`,
});

StyleDictionary.registerTransform({
  name: 'value/css/cubicBezier',
  type: 'value',
  filter: (t) => t.$type === 'cubicBezier',
  transform: (t) => `cubic-bezier(${t.$value.join(', ')})`,
});

StyleDictionary.registerTransform({
  name: 'value/css/fontFamily',
  type: 'value',
  filter: (t) => t.$type === 'fontFamily',
  transform: (t) => t.$value.map(f => f.includes(' ') ? `'${f}'` : f).join(', '),
});

// ── Dart transforms ──

StyleDictionary.registerTransform({
  name: 'name/dart',
  type: 'name',
  transform: (t) => {
    const parts = t.path.slice(2);
    return parts.map((p, i) =>
      i === 0 ? p.replace(/([A-Z])/g, (m) => m.toLowerCase())
              : p.charAt(0).toUpperCase() + p.slice(1)
    ).join('');
  },
});

StyleDictionary.registerTransform({
  name: 'value/dart/color',
  type: 'value',
  filter: (t) => t.$type === 'color' && typeof t.$value === 'string',
  transform: (t) => {
    const v = t.$value;
    const rgbaMatch = v.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
    if (rgbaMatch) {
      const [, r, g, b, a = '1'] = rgbaMatch;
      const alpha = Math.round(parseFloat(a) * 255).toString(16).padStart(2, '0').toUpperCase();
      const hex = [r, g, b].map(c => parseInt(c).toString(16).padStart(2, '0').toUpperCase()).join('');
      return `Color(0x${alpha}${hex})`;
    }
    const hex = v.replace('#', '');
    if (hex.length === 6) return `Color(0xFF${hex.toUpperCase()})`;
    if (hex.length === 8) return `Color(0x${hex.toUpperCase()})`;
    return `Color(0xFF000000)`;
  },
});

StyleDictionary.registerTransform({
  name: 'value/dart/dimension',
  type: 'value',
  filter: (t) => t.$type === 'dimension',
  transform: (t) => typeof t.$value === 'number' ? t.$value : parseFloat(t.$value),
});

StyleDictionary.registerTransform({
  name: 'value/dart/duration',
  type: 'value',
  filter: (t) => t.$type === 'duration',
  transform: (t) => typeof t.$value === 'number' ? t.$value : parseInt(t.$value),
});

StyleDictionary.registerTransform({
  name: 'value/dart/cubicBezier',
  type: 'value',
  filter: (t) => t.$type === 'cubicBezier',
  transform: (t) => {
    const v = Array.isArray(t.$value) ? t.$value : t.original.$value;
    return `Cubic(${v.join(', ')})`;
  },
});

StyleDictionary.registerTransform({
  name: 'value/dart/fontFamily',
  type: 'value',
  filter: (t) => t.$type === 'fontFamily',
  transform: (t) => {
    const v = Array.isArray(t.$value) ? t.$value : t.original.$value;
    return `'${v[0]}'`;
  },
});

// ── Swift transforms ──

StyleDictionary.registerTransform({
  name: 'name/swift',
  type: 'name',
  transform: (t) => {
    const parts = t.path.slice(2);
    return parts.map((p, i) =>
      i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)
    ).join('');
  },
});

StyleDictionary.registerTransform({
  name: 'value/swift/color',
  type: 'value',
  filter: (t) => t.$type === 'color' && typeof t.$value === 'string',
  transform: (t) => {
    const v = t.$value;
    const rgbaMatch = v.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
    if (rgbaMatch) {
      const [, r, g, b, a = '1'] = rgbaMatch;
      return `Color(red: ${(parseInt(r) / 255).toFixed(3)}, green: ${(parseInt(g) / 255).toFixed(3)}, blue: ${(parseInt(b) / 255).toFixed(3)}, opacity: ${parseFloat(a)})`;
    }
    return `Color(hex: 0x${v.replace('#', '').toUpperCase()})`;
  },
});

StyleDictionary.registerTransform({
  name: 'value/swift/dimension',
  type: 'value',
  filter: (t) => ['dimension', 'duration'].includes(t.$type),
  transform: (t) => typeof t.$value === 'number' ? t.$value : parseFloat(t.$value),
});

StyleDictionary.registerTransform({
  name: 'value/swift/cubicBezier',
  type: 'value',
  filter: (t) => t.$type === 'cubicBezier',
  transform: (t) => {
    const v = Array.isArray(t.$value) ? t.$value : t.original.$value;
    return `UnitCurve.bezier(controlPoint1: UnitPoint(x: ${v[0]}, y: ${v[1]}), controlPoint2: UnitPoint(x: ${v[2]}, y: ${v[3]}))`;
  },
});

StyleDictionary.registerTransform({
  name: 'value/swift/fontFamily',
  type: 'value',
  filter: (t) => t.$type === 'fontFamily',
  transform: (t) => {
    const v = Array.isArray(t.$value) ? t.$value : t.original.$value;
    return `"${v[0]}"`;
  },
});

// ── Custom formats ──

StyleDictionary.registerFormat({
  name: 'css/flow',
  format: ({ dictionary, options }) => {
    const selector = options.selector || ':root';
    const vars = dictionary.allTokens
      .filter(t => !isTypography(t))
      .map(t => {
        const orig = t.original && t.original.$value;
        if (typeof orig === 'string' && /^\{[^}]+\}$/.test(orig)) {
          return `  --${t.name}: var(--${pathToCssName(orig.slice(1, -1).split('.'))});`;
        }
        return `  --${t.name}: ${t.$value};`;
      })
      .join('\n');
    return `/* Generated by Style Dictionary — do not edit */\n${selector} {\n${vars}\n}\n`;
  },
});

StyleDictionary.registerFormat({
  name: 'scss/flow',
  format: ({ dictionary }) => {
    const lines = dictionary.allTokens
      .filter(t => !isTypography(t))
      .map(t => `$${t.name}: ${t.$value};`);
    return ['// Generated by Style Dictionary — do not edit', '', ...lines, ''].join('\n');
  },
});

// Font family map for typography tokens
const FONT_FAMILIES = {
  display: "'Edenred', 'Helvetica Neue', sans-serif",
  body: "'Ubuntu', 'Helvetica Neue', sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, monospace",
};

StyleDictionary.registerFormat({
  name: 'css/flow-typography',
  format: ({ dictionary }) => {
    const typo = dictionary.allTokens.filter(isTypography);
    if (!typo.length) return '';
    const vars = typo.map(t => {
      const v = t.original.$value || t.$value;
      const family = FONT_FAMILIES[v.family] || v.family;
      return `  --type-${kebab([t.path[t.path.length - 1]])}: ${v.weight} ${v.size}px/${v.lineHeight} ${family};`;
    }).join('\n');
    return `/* Generated by Style Dictionary — do not edit */\n:root {\n${vars}\n}\n`;
  },
});

StyleDictionary.registerFormat({
  name: 'scss/flow-typography',
  format: ({ dictionary }) => {
    const typo = dictionary.allTokens.filter(isTypography);
    if (!typo.length) return '';
    const lines = typo.map(t => {
      const v = t.original.$value || t.$value;
      const family = FONT_FAMILIES[v.family] || v.family;
      return `$type-${kebab([t.path[t.path.length - 1]])}: ${v.weight} ${v.size}px/${v.lineHeight} ${family};`;
    });
    return ['// Generated by Style Dictionary — do not edit', '', ...lines, ''].join('\n');
  },
});

StyleDictionary.registerFormat({
  name: 'dart/flow',
  format: ({ dictionary, options }) => {
    const className = options.className || 'FlowTokens';
    const lines = dictionary.allTokens.filter(t => !isTypography(t)).map(t => {
      if (t.$type === 'color') return `  static const ${t.name} = ${t.$value};`;
      if (t.$type === 'fontFamily') return `  static const String ${t.name} = ${t.$value};`;
      if (t.$type === 'cubicBezier') return `  static const ${t.name} = ${t.$value};`;
      if (t.$type === 'duration') return `  static const ${t.name} = Duration(milliseconds: ${Math.round(t.$value)});`;
      if (t.$type === 'shadow') return `  // ${t.name}: ${JSON.stringify(t.$value)} (complex — use FlowShadow)`;
      if (typeof t.$value !== 'number' && !/^[\d.]+$/.test(String(t.$value))) return `  static const String ${t.name} = '${t.$value}';`;
      return `  static const double ${t.name} = ${t.$value};`;
    });
    return [
      "// Generated by Style Dictionary — do not edit",
      "import 'dart:ui';",
      "",
      `abstract final class ${className} {`,
      ...lines,
      "}",
      "",
    ].join('\n');
  },
});

StyleDictionary.registerFormat({
  name: 'dart/flow-typography',
  format: ({ dictionary }) => {
    const typo = dictionary.allTokens.filter(isTypography);
    if (!typo.length) return '';
    const lines = typo.map(t => {
      const v = t.original.$value || t.$value;
      return `  static const double ${t.name} = ${v.size};`;
    });
    return [
      "// Generated by Style Dictionary — do not edit",
      "",
      "abstract final class FlowFontSize {",
      ...lines,
      "}",
      "",
    ].join('\n');
  },
});

StyleDictionary.registerFormat({
  name: 'swift/flow',
  format: ({ dictionary, options }) => {
    const enumName = options.enumName || 'FlowTokens';
    const lines = dictionary.allTokens.filter(t => !isTypography(t)).map(t => {
      if (t.$type === 'color') return `    static let ${t.name} = ${t.$value}`;
      if (t.$type === 'fontFamily') return `    static let ${t.name}: String = ${t.$value}`;
      if (t.$type === 'cubicBezier') return `    static let ${t.name} = ${t.$value}`;
      if (t.$type === 'duration') return `    static let ${t.name}: TimeInterval = ${(t.$value / 1000).toFixed(3)}`;
      if (t.$type === 'shadow') return `    // ${t.name}: complex — use FlowShadow`;
      if (typeof t.$value !== 'number' && !/^[\d.]+$/.test(String(t.$value))) return `    static let ${t.name}: String = "${t.$value}"`;
      return `    static let ${t.name}: CGFloat = ${t.$value}`;
    });
    return [
      "// Generated by Style Dictionary — do not edit",
      "import SwiftUI",
      "",
      `enum ${enumName} {`,
      ...lines,
      "}",
      "",
    ].join('\n');
  },
});

// compat-eone: la variable vieja de eOne apunta a la nueva. El mapa vive en
// tokens/compat-eone.json (medido del uso real); esta hoja es el puente que
// permite migrar pantalla a pantalla sin reescribir el CSS propio de eOne.
import { readFileSync as __rf } from 'node:fs';
StyleDictionary.registerFormat({
  name: 'css/compat-eone',
  format: () => {
    const mapa = JSON.parse(__rf('tokens/compat-eone.json', 'utf8'));
    const lineas = Object.entries(mapa)
      .filter(([k]) => !k.startsWith('$'))
      .map(([k, v]) => `  ${k}: ${v};`);
    return ['/* Generated by Style Dictionary — puente eOne → Flow 3.0, no editar */', ':root {', ...lineas, '}', ''].join('\n');
  },
});

// ── Shared transform groups ──

const CSS_TRANSFORMS = ['value/css/dimension', 'value/css/duration', 'value/css/cubicBezier', 'value/css/fontFamily'];
const DART_TRANSFORMS = ['name/dart', 'value/dart/color', 'value/dart/dimension', 'value/dart/duration', 'value/dart/cubicBezier', 'value/dart/fontFamily'];
const SWIFT_TRANSFORMS = ['name/swift', 'value/swift/color', 'value/swift/dimension', 'value/swift/cubicBezier', 'value/swift/fontFamily'];

// ── Build ──

const config = {
  source: ['tokens/**/*.json'],
  usesDtcg: true,
  platforms: {

    // ── CSS ──

    'css/ref': {
      transforms: ['name/flow/ref', ...CSS_TRANSFORMS],
      buildPath: 'generated/tokens/css/',
      files: [{
        destination: 'ref.css',
        format: 'css/flow',
        filter: isRef,
      }],
    },
    'css/brand': {
      transforms: ['name/flow/brand', ...CSS_TRANSFORMS],
      buildPath: 'generated/tokens/css/',
      files: [{
        destination: 'brand.css',
        format: 'css/flow',
        filter: (t) => t.path[1] === 'brand',
      }],
    },
    'css/compat-eone': {
      transforms: [...CSS_TRANSFORMS],
      buildPath: 'generated/tokens/css/',
      files: [{ destination: 'compat-eone.css', format: 'css/compat-eone' }],
    },
    'css/sys-light': {
      transforms: ['name/flow/sys-themed', ...CSS_TRANSFORMS],
      buildPath: 'generated/tokens/css/',
      files: [
        {
          destination: 'sys-light.css',
          format: 'css/flow',
          filter: isSysLight,
          options: { selector: ':root' },
        },
        {
          destination: 'sys-light-typography.css',
          format: 'css/flow-typography',
          filter: (t) => isSysLight(t) || (isSysScale(t) && isTypography(t)),
        },
      ],
    },
    'css/sys-dark': {
      transforms: ['name/flow/sys-themed', ...CSS_TRANSFORMS],
      buildPath: 'generated/tokens/css/',
      files: [{
        destination: 'sys-dark.css',
        format: 'css/flow',
        filter: isSysDark,
        options: { selector: '[data-mode="dark"]' },
      }],
    },
    'css/sys-scale': {
      transforms: ['name/flow/sys-scale', ...CSS_TRANSFORMS],
      buildPath: 'generated/tokens/css/',
      files: [
        {
          destination: 'sys-scale.css',
          format: 'css/flow',
          filter: (t) => isSysScale(t) && !isTypography(t),
        },
        {
          destination: 'sys-scale-typography.css',
          format: 'css/flow-typography',
          filter: (t) => isSysScale(t) && isTypography(t),
        },
      ],
    },

    // ── SCSS (Angular) ──

    'scss/ref': {
      transforms: ['name/flow/ref', ...CSS_TRANSFORMS],
      buildPath: 'generated/tokens/scss/',
      files: [{
        destination: '_ref.scss',
        format: 'scss/flow',
        filter: isRef,
      }],
    },
    'scss/sys-light': {
      transforms: ['name/flow/sys-themed', ...CSS_TRANSFORMS],
      buildPath: 'generated/tokens/scss/',
      files: [
        {
          destination: '_sys-light.scss',
          format: 'scss/flow',
          filter: isSysLight,
        },
        {
          destination: '_sys-light-typography.scss',
          format: 'scss/flow-typography',
          filter: (t) => isSysLight(t) || (isSysScale(t) && isTypography(t)),
        },
      ],
    },
    'scss/sys-dark': {
      transforms: ['name/flow/sys-themed', ...CSS_TRANSFORMS],
      buildPath: 'generated/tokens/scss/',
      files: [{
        destination: '_sys-dark.scss',
        format: 'scss/flow',
        filter: isSysDark,
      }],
    },
    'scss/sys-scale': {
      transforms: ['name/flow/sys-scale', ...CSS_TRANSFORMS],
      buildPath: 'generated/tokens/scss/',
      files: [
        {
          destination: '_sys-scale.scss',
          format: 'scss/flow',
          filter: (t) => isSysScale(t) && !isTypography(t),
        },
        {
          destination: '_sys-scale-typography.scss',
          format: 'scss/flow-typography',
          filter: (t) => isSysScale(t) && isTypography(t),
        },
      ],
    },

    // ── Dart (Flutter) ──

    'dart/ref': {
      transforms: DART_TRANSFORMS,
      buildPath: 'generated/tokens/dart/',
      files: [{
        destination: 'flow_ref_tokens.dart',
        format: 'dart/flow',
        filter: isRef,
        options: { className: 'FlowRefTokens' },
      }],
    },
    'dart/sys-light': {
      transforms: DART_TRANSFORMS,
      buildPath: 'generated/tokens/dart/',
      files: [
        {
          destination: 'flow_light_tokens.dart',
          format: 'dart/flow',
          filter: isSysLight,
          options: { className: 'FlowLightTokens' },
        },
        {
          destination: 'flow_font_size.dart',
          format: 'dart/flow-typography',
          filter: (t) => isSysScale(t) && isTypography(t),
        },
      ],
    },
    'dart/sys-dark': {
      transforms: DART_TRANSFORMS,
      buildPath: 'generated/tokens/dart/',
      files: [{
        destination: 'flow_dark_tokens.dart',
        format: 'dart/flow',
        filter: isSysDark,
        options: { className: 'FlowDarkTokens' },
      }],
    },
    'dart/sys-scale': {
      transforms: DART_TRANSFORMS,
      buildPath: 'generated/tokens/dart/',
      files: [{
        destination: 'flow_scale_tokens.dart',
        format: 'dart/flow',
        filter: (t) => isSysScale(t) && !isTypography(t),
        options: { className: 'FlowScaleTokens' },
      }],
    },

    // ── Swift ──

    'swift/ref': {
      transforms: SWIFT_TRANSFORMS,
      buildPath: 'generated/tokens/swift/',
      files: [{
        destination: 'FlowRefTokens.swift',
        format: 'swift/flow',
        filter: isRef,
        options: { enumName: 'FlowRefTokens' },
      }],
    },
    'swift/sys-light': {
      transforms: SWIFT_TRANSFORMS,
      buildPath: 'generated/tokens/swift/',
      files: [{
        destination: 'FlowLightTokens.swift',
        format: 'swift/flow',
        filter: isSysLight,
        options: { enumName: 'FlowLightTokens' },
      }],
    },
    'swift/sys-dark': {
      transforms: SWIFT_TRANSFORMS,
      buildPath: 'generated/tokens/swift/',
      files: [{
        destination: 'FlowDarkTokens.swift',
        format: 'swift/flow',
        filter: isSysDark,
        options: { enumName: 'FlowDarkTokens' },
      }],
    },
    'swift/sys-scale': {
      transforms: SWIFT_TRANSFORMS,
      buildPath: 'generated/tokens/swift/',
      files: [{
        destination: 'FlowScaleTokens.swift',
        format: 'swift/flow',
        filter: (t) => isSysScale(t) && !isTypography(t),
        options: { enumName: 'FlowScaleTokens' },
      }],
    },
  },
};

const sd = new StyleDictionary(config);
await sd.buildAllPlatforms();
console.log('✔ Tokens built: css, scss, dart, swift');
