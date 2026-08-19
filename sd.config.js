import StyleDictionary from 'style-dictionary';

// ── Helpers ──

function isPrimitive(token) {
  return token.path[0] === 'flow' && token.path[1] === 'color';
}

function isSemantic(token, theme) {
  return token.path[0] === 'flow' && token.path[1] === 'semantic' && token.path[2] === theme;
}

function isScale(token) {
  const cat = token.path[1];
  return token.path[0] === 'flow' && ['font', 'fontSize', 'space', 'radius', 'duration', 'easing'].includes(cat);
}

// ── CSS name transforms ──

StyleDictionary.registerTransform({
  name: 'name/flow/primitive',
  type: 'name',
  filter: isPrimitive,
  transform: (token) => token.path.join('-'),
});

StyleDictionary.registerTransform({
  name: 'name/flow/semantic',
  type: 'name',
  filter: (token) => isSemantic(token, 'light') || isSemantic(token, 'dark'),
  transform: (token) => token.path.slice(3).join('-'),
});

const SCALE_PREFIX = {
  font: 'font',
  fontSize: 'font-size',
  space: 'space',
  radius: 'radius',
  duration: 'dur',
  easing: 'ease',
};

StyleDictionary.registerTransform({
  name: 'name/flow/scale',
  type: 'name',
  filter: isScale,
  transform: (token) => {
    const cat = token.path[1];
    const prefix = SCALE_PREFIX[cat] || cat;
    const suffix = token.path.slice(2).map(s =>
      s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    ).join('-');
    return `${prefix}-${suffix}`;
  },
});

// ── Dart transforms ──

StyleDictionary.registerTransform({
  name: 'name/dart',
  type: 'name',
  transform: (token) => {
    const parts = token.path.slice(1);
    return parts.map((p, i) =>
      i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)
    ).join('');
  },
});

StyleDictionary.registerTransform({
  name: 'value/dart/color',
  type: 'value',
  filter: (token) => (token.$type === 'color'),
  transform: (token) => {
    const v = token.$value;
    if (typeof v !== 'string') return v;
    const rgbaMatch = v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbaMatch) {
      const [, r, g, b, a = '1'] = rgbaMatch;
      const alpha = Math.round(parseFloat(a) * 255).toString(16).padStart(2, '0').toUpperCase();
      const hex = [r, g, b].map(c => parseInt(c).toString(16).padStart(2, '0').toUpperCase()).join('');
      return `Color(0x${alpha}${hex})`;
    }
    const hex = v.replace('#', '');
    if (hex.length === 6) return `Color(0xFF${hex.toUpperCase()})`;
    if (hex.length === 8) return `Color(0x${hex.toUpperCase()})`;
    return v;
  },
});

StyleDictionary.registerTransform({
  name: 'value/dart/dimension',
  type: 'value',
  filter: (token) => token.$type === 'dimension',
  transform: (token) => parseFloat(token.$value),
});

StyleDictionary.registerTransform({
  name: 'value/dart/duration',
  type: 'value',
  filter: (token) => token.$type === 'duration',
  transform: (token) => parseFloat(token.$value),
});

StyleDictionary.registerTransform({
  name: 'value/dart/cubicBezier',
  type: 'value',
  filter: (token) => token.$type === 'cubicBezier',
  transform: (token) => `Cubic(${token.$value.join(', ')})`,
});

StyleDictionary.registerTransform({
  name: 'value/dart/fontFamily',
  type: 'value',
  filter: (token) => token.$type === 'fontFamily',
  transform: (token) => `'${token.$value[0]}'`,
});

// ── Swift transforms ──

StyleDictionary.registerTransform({
  name: 'name/swift',
  type: 'name',
  transform: (token) => {
    const parts = token.path.slice(1);
    return parts.map((p, i) =>
      i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)
    ).join('');
  },
});

StyleDictionary.registerTransform({
  name: 'value/swift/color',
  type: 'value',
  filter: (token) => token.$type === 'color',
  transform: (token) => {
    const v = token.$value;
    if (typeof v !== 'string') return v;
    const rgbaMatch = v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
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
  filter: (token) => ['dimension', 'duration'].includes(token.$type),
  transform: (token) => parseFloat(token.$value),
});

StyleDictionary.registerTransform({
  name: 'value/swift/cubicBezier',
  type: 'value',
  filter: (token) => token.$type === 'cubicBezier',
  transform: (token) => {
    const v = token.$value;
    return `UnitCurve.bezier(controlPoint1: UnitPoint(x: ${v[0]}, y: ${v[1]}), controlPoint2: UnitPoint(x: ${v[2]}, y: ${v[3]}))`;
  },
});

StyleDictionary.registerTransform({
  name: 'value/swift/fontFamily',
  type: 'value',
  filter: (token) => token.$type === 'fontFamily',
  transform: (token) => `"${token.$value[0]}"`,
});

// ── Custom formats ──

StyleDictionary.registerFormat({
  name: 'css/themed',
  format: ({ dictionary, options }) => {
    const selector = options.selector || ':root';
    const vars = dictionary.allTokens
      .map(t => `  --${t.name}: ${t.$value};`)
      .join('\n');
    return `/* Generated by Style Dictionary — do not edit */\n${selector} {\n${vars}\n}\n`;
  },
});

StyleDictionary.registerFormat({
  name: 'dart/class',
  format: ({ dictionary }) => {
    const lines = dictionary.allTokens.map(t => {
      if (t.$type === 'color') return `  static const ${t.name} = ${t.$value};`;
      if (t.$type === 'fontFamily') return `  static const String ${t.name} = ${t.$value};`;
      if (t.$type === 'cubicBezier') return `  static const ${t.name} = ${t.$value};`;
      if (t.$type === 'duration') return `  static const ${t.name} = Duration(milliseconds: ${Math.round(t.$value)});`;
      return `  static const double ${t.name} = ${t.$value};`;
    });
    return [
      "// Generated by Style Dictionary — do not edit",
      "import 'dart:ui';",
      "",
      "abstract final class FlowTokens {",
      ...lines,
      "}",
      "",
    ].join('\n');
  },
});

StyleDictionary.registerFormat({
  name: 'swift/enum',
  format: ({ dictionary }) => {
    const lines = dictionary.allTokens.map(t => {
      if (t.$type === 'color') return `    static let ${t.name} = ${t.$value}`;
      if (t.$type === 'fontFamily') return `    static let ${t.name}: String = ${t.$value}`;
      if (t.$type === 'cubicBezier') return `    static let ${t.name} = ${t.$value}`;
      if (t.$type === 'duration') return `    static let ${t.name}: TimeInterval = ${(t.$value / 1000).toFixed(3)}`;
      return `    static let ${t.name}: CGFloat = ${t.$value}`;
    });
    return [
      "// Generated by Style Dictionary — do not edit",
      "import SwiftUI",
      "",
      "enum FlowTokens {",
      ...lines,
      "}",
      "",
    ].join('\n');
  },
});

// ── Build ──

// Built-in CSS value transforms + custom name transforms
const CSS_VALUE_TRANSFORMS = ['color/css', 'cubicBezier/css', 'fontFamily/css'];

const config = {
  source: ['tokens/**/*.json'],
  usesDtcg: true,
  platforms: {
    'css/primitives': {
      transforms: ['name/flow/primitive', ...CSS_VALUE_TRANSFORMS],
      buildPath: 'dist/tokens/css/',
      files: [{
        destination: 'primitives.css',
        format: 'css/themed',
        filter: isPrimitive,
        options: { selector: ':root' },
      }],
    },
    'css/light': {
      transforms: ['name/flow/semantic', ...CSS_VALUE_TRANSFORMS],
      buildPath: 'dist/tokens/css/',
      files: [{
        destination: 'semantic-light.css',
        format: 'css/themed',
        filter: (token) => isSemantic(token, 'light'),
        options: { selector: ':root' },
      }],
    },
    'css/dark': {
      transforms: ['name/flow/semantic', ...CSS_VALUE_TRANSFORMS],
      buildPath: 'dist/tokens/css/',
      files: [{
        destination: 'semantic-dark.css',
        format: 'css/themed',
        filter: (token) => isSemantic(token, 'dark'),
        options: { selector: ':root[data-mode="dark"]' },
      }],
    },
    'css/scale': {
      transforms: ['name/flow/scale', ...CSS_VALUE_TRANSFORMS],
      buildPath: 'dist/tokens/css/',
      files: [{
        destination: 'scale.css',
        format: 'css/themed',
        filter: isScale,
        options: { selector: ':root' },
      }],
    },
    dart: {
      transforms: ['name/dart', 'value/dart/color', 'value/dart/dimension', 'value/dart/duration', 'value/dart/cubicBezier', 'value/dart/fontFamily'],
      buildPath: 'dist/tokens/dart/',
      files: [{
        destination: 'flow_tokens.dart',
        format: 'dart/class',
      }],
    },
    swift: {
      transforms: ['name/swift', 'value/swift/color', 'value/swift/dimension', 'value/swift/cubicBezier', 'value/swift/fontFamily'],
      buildPath: 'dist/tokens/swift/',
      files: [{
        destination: 'FlowTokens.swift',
        format: 'swift/enum',
      }],
    },
  },
};

const sd = new StyleDictionary(config);
await sd.buildAllPlatforms();
console.log('✔ Tokens built for css, dart, swift');
