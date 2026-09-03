import React from 'react';

/**
 * FlowChart — un solo envoltorio de ECharts con el tema de Flow.
 *
 * Lee los tokens del DOM en tiempo de ejecucion, asi que Canvas y su modo oscuro
 * salen del mismo componente sin configuracion. Re-tematiza al cambiar data-mode.
 *
 * ECharts se carga del CDN una sola vez y se comparte entre instancias.
 */

const ECHARTS_SRC = 'https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js';
let echartsPromise = null;

export function loadEcharts(src = ECHARTS_SRC) {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.echarts) return Promise.resolve(window.echarts);
  if (echartsPromise) return echartsPromise;
  echartsPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve(window.echarts);
    s.onerror = () => { echartsPromise = null; reject(new Error('ECharts no cargo')); };
    document.head.appendChild(s);
  });
  return echartsPromise;
}

/** ECharts quiere una lista de familias sin comillas sueltas. */
function cleanFont(v) {
  return String(v).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean).join(', ');
}

function readTokens(el) {
  const cs = getComputedStyle(el);
  const t = (name, fallback) => (cs.getPropertyValue(name) || '').trim() || fallback;
  // Los kits pasan colores como 'var(--flow-red-500)'; ECharts no resuelve custom props.
  const resolve = (c) => {
    let v = String(c || '');
    for (let i = 0; i < 4 && /^var\(/.test(v); i++) {
      const inner = v.slice(4, -1).split(',')[0].trim();
      v = (cs.getPropertyValue(inner) || '').trim() || v.slice(4, -1).split(',').slice(1).join(',').trim();
    }
    return v || c;
  };
  const theme = (el.closest('[data-mode]') || document.documentElement).getAttribute('data-mode') || 'light';
  // --type-data-lg: "600 26px/1.15 var(--font-mono)" — el mismo token que los KPIs
  const kpi = t('--type-data-lg', '600 26px/1.15').match(/(\d{3})\s+(\d+(?:\.\d+)?)px/);
  return {
    resolve,
    theme,
    palette: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => t('--viz-' + i, '#2E7CF6')),
    ramp: [1, 2, 3, 4, 5, 6].map((i) => t('--viz-ramp-' + i, '#E7F0FE')),
    accent: t('--viz-accent', '#FF3617'),
    positive: t('--viz-positive', '#12B76A'),
    negative: t('--viz-negative', '#D92D20'),
    neutral: t('--viz-neutral', '#B5B1AA'),
    grid: t('--viz-grid', '#EEEBE6'),
    axis: t('--viz-axis', '#E0DDD7'),
    label: t('--viz-label', '#55534E'),
    tipBg: t('--viz-tooltip-bg', '#17171A'),
    tipText: t('--viz-tooltip-text', '#F4F3F1'),
    card: t('--surface-card', '#FFFFFF'),
    text: t('--text-primary', '#17171A'),
    muted: t('--text-muted', '#8A8781'),
    fontBody: cleanFont(t('--font-body', 'sans-serif')),
    fontMono: cleanFont(t('--font-mono', 'monospace')),
    kpiWeight: kpi ? Number(kpi[1]) : 600,
    kpiSize: kpi ? parseFloat(kpi[2]) : 26,
  };
}

/**
 * Resuelve var(--x) en TODO el arbol de opciones, una sola vez y justo antes de
 * entregarlo a ECharts: cubre colores de series, passthroughs de adaptadores
 * (markLine) y cualquier `option` del llamador. Las funciones pasan intactas —
 * son formatters.
 */
function resolveVars(o, rz) {
  if (typeof o === 'string') return /var\(--/.test(o) ? rz(o) : o;
  if (typeof o === 'function' || o == null) return o;
  if (Array.isArray(o)) return o.map((v) => resolveVars(v, rz));
  if (typeof o === 'object') {
    if (o instanceof Date) return o;
    const out = {};
    Object.keys(o).forEach((k) => { out[k] = resolveVars(o[k], rz); });
    return out;
  }
  return o;
}

function isReduced() {
  return typeof window !== 'undefined' && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Luminancia relativa WCAG de un hex, para decidir texto claro u oscuro encima. */
function luminance(hex) {
  const m = String(hex).trim().replace('#', '');
  const full = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
  const n = parseInt(full, 16);
  if (isNaN(n) || full.length !== 6) return 1;
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

function contrast(a, b) {
  const l1 = luminance(a), l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/**
 * Texto legible sobre un relleno de chart. Prefiere los tokens, pero si ninguno
 * llega a AA (pasa en los tonos medios de la rampa) cae a los extremos puros:
 * el relleno no es una superficie del tema, es un dato.
 */
function onColor(fill, dark, light) {
  const best = (list) => list.reduce((a, c) => (contrast(fill, c) > contrast(fill, a) ? c : a));
  const tokenBest = best([dark, light]);
  return contrast(fill, tokenBest) >= 4.5 ? tokenBest : best(['#000000', '#FFFFFF']);
}

/** Une objetos en profundidad: el override del usuario gana siempre. */
function merge(base, extra) {
  if (!extra) return base;
  const out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
  Object.keys(extra).forEach((k) => {
    const a = out[k];
    const b = extra[k];
    out[k] = (b && typeof b === 'object' && !Array.isArray(b) && a && typeof a === 'object' && !Array.isArray(a))
      ? merge(a, b) : b;
  });
  return out;
}

/**
 * Con 1-3 series Flow no usa la paleta categorica: usa tinta + el accent.
 * Ocho colores es un default de libreria; dos es una decision.
 */
function paletteFor(count, mode, tk) {
  const duo = [tk.text, tk.accent, tk.neutral];
  if (mode === 'categorical') return tk.palette;
  if (mode === 'duo') return duo;
  return count <= 3 ? duo : tk.palette;
}

export function buildOption(type, props, tk) {
  const {
    series = [], labels = [], format, legend = false, stack = false, smooth = true,
    highlight, horizontal = false, matrix, indicators, target, max, min,
    showValues = false, area, palette = 'auto', animate = true, itemColors,
  } = props;

  const motion = animate && !isReduced();
  const fmt = typeof format === 'function' ? format : (v) => v;
  const axisFmt = (v) => (typeof v === 'number' ? fmt(v) : v);

  const rz = tk.resolve || ((c) => c);
  // Claves que consume el builder; el resto se pasa tal cual a la serie de ECharts
  // para que un adaptador pueda añadir markLine, markArea o lo que necesite.
  const OWN = ['label', 'values', 'data', 'color', 'symbolSize'];
  const extra = (s) => {
    const o = {};
    Object.keys(s || {}).forEach((k) => { if (OWN.indexOf(k) === -1) o[k] = s[k]; });
    return o;
  };
  const pal = paletteFor(series.length, palette, tk);
  // Con highlight, el accent queda reservado para esa serie: las demas lo saltan.
  const rest = highlight ? pal.filter((c) => c !== tk.accent) : pal;
  const assigned = [];
  let slot = 0;
  series.forEach((s) => {
    assigned.push((highlight && s.label === highlight) ? tk.accent : (s.color ? rz(s.color) : rest[slot++ % rest.length]));
  });
  const colorFor = (i, label) =>
    (highlight && label === highlight) ? tk.accent
      : (assigned[i] || rest[i % rest.length] || tk.text);

  const textStyle = { fontFamily: tk.fontBody, fontSize: 12, color: tk.label };
  const monoStyle = { fontFamily: tk.fontMono, fontSize: 11.5, color: tk.label };

  // Toda cifra en mono, tambien dentro del tooltip: en Flow el numero es mono, siempre.
  const num = (v) => '<span style="font-family:' + tk.fontMono + ';font-weight:600">' + v + '</span>';
  const tipHead = (s) => '<div style="font-size:11.5px;opacity:.65;margin-bottom:3px">' + s + '</div>';
  const tipRow = (marker, name, val) =>
    '<div style="display:flex;align-items:center;gap:6px">' + (marker || '')
    + '<span style="flex:1">' + (name || '') + '</span>' + num(val) + '</div>';

  const dur = 620;
  const stagger = 36;
  const mount = (perPoint) => (motion ? {
    animation: true,
    animationDuration: dur,
    animationEasing: 'cubicOut',
    animationDelay: perPoint ? (i) => i * stagger : 0,
  } : { animation: false });

  const base = {
    color: pal,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: tk.fontBody, color: tk.text },
    animation: motion,
    animationDuration: dur,
    animationEasing: 'cubicOut',
    grid: { left: 8, right: 14, top: legend ? 34 : 14, bottom: 6, containLabel: true },
    legend: legend ? {
      show: true, top: 0, left: 0, itemGap: 16, icon: 'roundRect',
      itemWidth: 10, itemHeight: 10, textStyle: textStyle,
    } : { show: false },
    tooltip: {
      backgroundColor: tk.tipBg,
      borderWidth: 0,
      padding: [9, 12],
      extraCssText: 'border-radius:' + (10) + 'px;box-shadow:0 8px 24px rgba(0,0,0,.18)',
      textStyle: { color: tk.tipText, fontFamily: tk.fontBody, fontSize: 12.5 },
      axisPointer: { type: 'line', lineStyle: { color: tk.axis, width: 1 } },
    },
  };

  // Geometria: sin lineas de eje, solo horizontales punteadas. Menos rejilla, mas aire.
  const catAxis = {
    type: 'category',
    data: labels,
    boundaryGap: type === 'bar' || type === 'stackedBar' || type === 'stacked100' || type === 'waterfall' || type === 'pareto',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: tk.label, fontFamily: tk.fontBody, fontSize: 11.5, hideOverlap: true, margin: 12 },
  };
  const valAxis = {
    type: 'value',
    splitLine: { lineStyle: { color: tk.grid, type: 'dashed' } },
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: tk.label, fontFamily: tk.fontMono, fontSize: 11, formatter: axisFmt, margin: 12 },
    min: min, max: max,
  };

  // Barra en pill: el radio es la mitad del ancho, como el Switch y el Progress.
  const BAR_W = 34;
  const cap = BAR_W / 2;
  const barRadius = (stacked) => {
    if (stacked) return 0;
    return horizontal ? [0, cap, cap, 0] : [cap, cap, 0, 0];
  };

  const label = showValues
    ? { show: true, position: horizontal ? 'right' : 'top', fontFamily: tk.fontMono, fontSize: 11, fontWeight: 600, color: tk.label, formatter: (p) => fmt(p.value) }
    : { show: false };

  switch (type) {
    case 'line':
    case 'area': {
      const isArea = type === 'area' || area;
      return merge(base, {
        tooltip: {
          trigger: 'axis',
          formatter: (ps) => tipHead(ps[0].axisValueLabel)
            + ps.map((p) => tipRow(p.marker, p.seriesName, fmt(p.value))).join(''),
        },
        xAxis: catAxis,
        yAxis: valAxis,
        series: series.map((s, i) => {
          const c = s.color || colorFor(i, s.label);
          return merge({
            name: s.label, type: 'line', data: s.values, smooth: smooth ? 0.35 : false,
            showSymbol: false, symbolSize: 7,
            lineStyle: { width: 2.25, color: c, cap: 'round', join: 'round' },
            itemStyle: { color: c },
            stack: stack ? 'total' : undefined,
            emphasis: { focus: 'series', scale: 1.4 },
            areaStyle: isArea ? { opacity: 0.14, color: c } : undefined,
          }, motion ? {
            // La linea se dibuja de izquierda a derecha; cada serie entra detras de la anterior.
            animationDuration: 900,
            animationDelay: i * 160,
            animationEasing: 'cubicOut',
          } : { animation: false });
        }),
      });
    }
    case 'bar':
    case 'stackedBar': {
      const stacked = type === 'stackedBar' || stack;
      return merge(base, {
        tooltip: {
          trigger: 'axis', axisPointer: { type: 'shadow' },
          formatter: (ps) => tipHead(ps[0].axisValueLabel)
            + ps.map((p) => tipRow(p.marker, p.seriesName, fmt(p.value))).join(''),
        },
        xAxis: horizontal ? valAxis : catAxis,
        yAxis: horizontal ? merge(catAxis, { boundaryGap: true, inverse: true }) : valAxis,
        series: series.map((s, i) => merge({
          name: s.label, type: 'bar',
          data: itemColors
            ? s.values.map((v, j) => ({ value: v, itemStyle: { color: rz(itemColors[j] || colorFor(i, s.label)) } }))
            : s.values,
          stack: stacked ? 'total' : undefined,
          barMaxWidth: BAR_W,
          itemStyle: { color: rz(s.color || colorFor(i, s.label)), borderRadius: barRadius(stacked) },
          emphasis: { focus: 'series' },
          label: label,
        }, mount(true))),
      });
    }
    case 'stacked100': {
      const n = (series[0] && series[0].values.length) || 0;
      const totals = Array.from({ length: n }, (_, j) => series.reduce((a, s) => a + (s.values[j] || 0), 0) || 1);
      return merge(base, {
        tooltip: {
          trigger: 'axis', axisPointer: { type: 'shadow' },
          formatter: (ps) => tipHead(ps[0].axisValueLabel) + ps.map((p) =>
            tipRow(p.marker, p.seriesName, Math.round(p.value / totals[p.dataIndex] * 100) + '%')
          ).join(''),
        },
        xAxis: horizontal ? merge(valAxis, { max: 'dataMax', axisLabel: { show: false } }) : catAxis,
        yAxis: horizontal ? merge(catAxis, { boundaryGap: true, inverse: true }) : merge(valAxis, { max: 'dataMax', axisLabel: { show: false } }),
        series: series.map((s, i) => merge({
          name: s.label, type: 'bar', stack: 'total', data: s.values, barMaxWidth: BAR_W,
          itemStyle: { color: rz(s.color || colorFor(i, s.label)) },
          emphasis: { focus: 'series' },
        }, mount(true))),
      });
    }
    case 'donut':
    case 'pie': {
      const data = (series[0] ? series[0].data || series[0].values : series) || [];
      const items = data.map((d, i) => (typeof d === 'number'
        ? { name: labels[i] || String(i), value: d }
        : { name: d.label || d.name, value: d.value, itemStyle: { color: rz(d.color || colorFor(i, d.label || d.name)) } }));
      const wedgePal = paletteFor(items.length, palette, tk);
      return merge(base, {
        color: wedgePal,
        tooltip: {
          trigger: 'item',
          formatter: (p) => tipRow(p.marker, p.name, fmt(p.value)) + tipHead(p.percent + '% del total'),
        },
        legend: legend ? { show: true, orient: 'vertical', right: 0, top: 'middle', itemGap: 12, icon: 'circle', itemWidth: 9, itemHeight: 9, textStyle: textStyle } : { show: false },
        series: [merge({
          type: 'pie',
          radius: type === 'donut' ? ['58%', '82%'] : ['0%', '80%'],
          center: legend ? ['36%', '52%'] : ['50%', '52%'],
          data: items.map((it, i) => merge({ itemStyle: { color: wedgePal[i % wedgePal.length] } }, it)),
          itemStyle: { borderColor: tk.card, borderWidth: 2, borderRadius: 3 },
          label: { show: false },
          emphasis: { scale: true, scaleSize: 5, itemStyle: { shadowBlur: 14, shadowColor: 'rgba(0,0,0,.14)' } },
        }, motion ? {
          // Barre como un reloj en vez de aparecer de golpe.
          animationType: 'expansion', animationDuration: 760, animationEasing: 'cubicOut',
        } : { animation: false })],
      });
    }
    case 'scatter': {
      return merge(base, {
        tooltip: {
          trigger: 'item',
          formatter: (p) => tipHead(p.seriesName) + tipRow('', fmt(p.value[0]), fmt(p.value[1])),
        },
        xAxis: merge(valAxis, { splitLine: { show: true, lineStyle: { color: tk.grid, type: 'dashed' } } }),
        yAxis: valAxis,
        series: series.map((s, i) => merge({
          name: s.label, type: 'scatter', data: s.values, symbolSize: s.symbolSize || 10,
          itemStyle: { color: rz(s.color || colorFor(i, s.label)), opacity: 0.78 },
          emphasis: { focus: 'series', itemStyle: { opacity: 1 } },
        }, merge(extra(s), motion ? {
          animationDuration: 700,
          animationDelay: (idx) => idx * 22 + i * 90,
          animationEasing: 'cubicOut',
        } : { animation: false }))),
      });
    }
    case 'heatmap': {
      const m = matrix || { rows: [], cols: [], values: [] };
      const vals = m.values.map((v) => v[2]);
      return merge(base, {
        tooltip: {
          position: 'top',
          formatter: (p) => tipHead(m.cols[p.value[0]] + ' · ' + m.rows[p.value[1]]) + num(fmt(p.value[2])),
        },
        grid: { left: 8, right: 14, top: 14, bottom: 46, containLabel: true },
        xAxis: merge(catAxis, { data: m.cols, boundaryGap: true, splitArea: { show: false }, axisLine: { show: false } }),
        yAxis: merge(catAxis, { data: m.rows, boundaryGap: true, splitArea: { show: false }, axisLine: { show: false }, inverse: true }),
        visualMap: {
          min: Math.min.apply(null, vals.concat([0])), max: Math.max.apply(null, vals.concat([1])),
          orient: 'horizontal', left: 'center', bottom: 0, itemWidth: 11, itemHeight: 90,
          inRange: { color: tk.ramp }, textStyle: monoStyle, formatter: (v) => String(fmt(Math.round(v))),
        },
        series: [merge({
          type: 'heatmap', data: m.values,
          itemStyle: { borderColor: tk.card, borderWidth: 2, borderRadius: 4 },
          emphasis: { itemStyle: { borderColor: tk.text, borderWidth: 1.5 } },
        }, mount(true))],
      });
    }
    case 'radar': {
      const inds = (indicators || labels).map((x) => (typeof x === 'string' ? { name: x, max: max || 100 } : x));
      return merge(base, {
        tooltip: { trigger: 'item' },
        radar: {
          indicator: inds, radius: '66%', splitNumber: 4,
          axisName: { color: tk.label, fontFamily: tk.fontBody, fontSize: 11.5 },
          splitLine: { lineStyle: { color: tk.grid, type: 'dashed' } },
          splitArea: { show: false },
          axisLine: { lineStyle: { color: tk.grid } },
        },
        series: [merge({
          type: 'radar',
          data: series.map((s, i) => {
            const c = s.color || colorFor(i, s.label);
            return {
              name: s.label, value: s.values,
              lineStyle: { color: c, width: 2.25, join: 'round' }, itemStyle: { color: c },
              areaStyle: { color: c, opacity: 0.16 },
            };
          }),
        }, mount(false))],
      });
    }
    case 'waterfall': {
      const vals = (series[0] && series[0].values) || [];
      const helper = [];
      const bars = [];
      let run = 0;
      vals.forEach((v, i) => {
        const isTotal = props.totals && props.totals.indexOf(i) !== -1;
        if (isTotal) {
          // Un total es absoluto: usa su propio valor, o el acumulado si viene en 0.
          const abs = v !== 0 ? v : run;
          helper.push(0);
          bars.push(abs);
          run = abs;
          return;
        }
        helper.push(v >= 0 ? run : run + v);
        bars.push(Math.abs(v));
        run += v;
      });
      return merge(base, {
        tooltip: {
          trigger: 'axis', axisPointer: { type: 'shadow' },
          formatter: (ps) => {
            const p = ps.filter((x) => x.seriesName !== '__helper')[0];
            if (!p) return '';
            const raw = vals[p.dataIndex];
            const isTotal = props.totals && props.totals.indexOf(p.dataIndex) !== -1;
            return tipHead(p.name) + num(isTotal ? fmt(bars[p.dataIndex]) : (raw >= 0 ? '+' : '−') + fmt(Math.abs(raw)));
          },
        },
        xAxis: catAxis,
        yAxis: valAxis,
        series: [
          { name: '__helper', type: 'bar', stack: 'wf', silent: true, itemStyle: { color: 'transparent' }, emphasis: { itemStyle: { color: 'transparent' } }, data: helper, animation: false },
          merge({
            name: series[0] ? series[0].label : 'Cambio', type: 'bar', stack: 'wf', barMaxWidth: 38,
            data: bars.map((v, i) => {
              const isTotal = props.totals && props.totals.indexOf(i) !== -1;
              return { value: v, itemStyle: { color: isTotal ? tk.neutral : (vals[i] >= 0 ? tk.positive : tk.negative), borderRadius: 6 } };
            }),
            label: label,
          }, mount(true)),
        ],
      });
    }
    case 'pareto': {
      const data = (series[0] && series[0].values) || [];
      const total = data.reduce((a, b) => a + b, 0) || 1;
      let acc = 0;
      const cum = data.map((v) => { acc += v; return +(acc / total * 100).toFixed(1); });
      return merge(base, {
        tooltip: {
          trigger: 'axis', axisPointer: { type: 'shadow' },
          formatter: (ps) => tipHead(ps[0].name) + ps.map((p) =>
            tipRow(p.marker, p.seriesName, p.seriesIndex === 1 ? p.value + '%' : fmt(p.value))).join(''),
        },
        legend: legend ? { show: true, top: 0, left: 0, textStyle: textStyle } : { show: false },
        xAxis: catAxis,
        yAxis: [
          valAxis,
          merge(valAxis, { max: 100, axisLabel: { formatter: (v) => v + '%' }, splitLine: { show: false } }),
        ],
        series: [
          merge({
            name: series[0] ? series[0].label : 'Frecuencia', type: 'bar', barMaxWidth: BAR_W,
            data: itemColors
              ? data.map((v, j) => ({ value: v, itemStyle: { color: rz(itemColors[j] || tk.text) } }))
              : data,
            itemStyle: { color: tk.text, borderRadius: barRadius(false) },
          }, mount(true)),
          merge({
            name: 'Acumulado', type: 'line', yAxisIndex: 1, data: cum, smooth: false,
            lineStyle: { color: tk.accent, width: 2.25, cap: 'round', join: 'round' }, itemStyle: { color: tk.accent }, symbolSize: 6,
          }, motion ? { animationDuration: 900, animationDelay: 260 } : { animation: false }),
        ],
      });
    }
    case 'gauge': {
      const v = target != null ? target : (series[0] && series[0].values[0]) || 0;
      const cap2 = max != null ? max : 100;
      return merge(base, {
        tooltip: { show: false },
        series: [{
          type: 'gauge', startAngle: 200, endAngle: -20, min: min || 0, max: cap2,
          radius: '96%', center: ['50%', '62%'],
          progress: { show: true, width: 14, roundCap: true, itemStyle: { color: v / cap2 >= 0.85 ? tk.negative : tk.text } },
          axisLine: { lineStyle: { width: 14, color: [[1, tk.grid]] }, roundCap: true },
          axisTick: { show: false }, splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: false },
          anchor: { show: false },
          title: { show: false },
          detail: {
            valueAnimation: motion, offsetCenter: [0, '-6%'],
            fontFamily: tk.fontMono, fontSize: tk.kpiSize, fontWeight: tk.kpiWeight, color: tk.text,
            formatter: (x) => String(fmt(x)),
          },
          data: [{ value: v }],
          animation: motion,
          animationDuration: 900,
          animationEasing: 'cubicOut',
        }],
      });
    }
    case 'funnel': {
      const data = (series[0] && (series[0].data || series[0].values)) || [];
      const items = data.map((d, i) => (typeof d === 'number'
        ? { name: labels[i] || String(i), value: d }
        : { name: d.label || d.name, value: d.value }));
      return merge(base, {
        tooltip: { trigger: 'item', formatter: (p) => tipRow(p.marker, p.name, fmt(p.value)) },
        series: [merge({
          type: 'funnel', left: '4%', right: '4%', top: legend ? 34 : 10, bottom: 6,
          minSize: '24%', gap: 2, sort: 'descending',
          data: items.map((it, i) => {
            const fill = tk.ramp[Math.max(0, tk.ramp.length - 1 - i)];
            return merge(it, {
              itemStyle: { color: fill, borderWidth: 0, borderRadius: 4 },
              label: { color: onColor(fill, tk.text, tk.card) },
            });
          }),
          label: { show: true, position: 'inside', fontFamily: tk.fontBody, fontSize: 12, fontWeight: 600, formatter: (p) => p.name },
          emphasis: { label: { fontSize: 12.5 } },
        }, mount(true))],
      });
    }
    case 'treemap': {
      const data = (series[0] && (series[0].data || series[0].values)) || [];
      return merge(base, {
        tooltip: { formatter: (p) => tipRow('', p.name, fmt(p.value)) },
        series: [merge({
          type: 'treemap', roam: false, nodeClick: false, breadcrumb: { show: false },
          left: 0, right: 0, top: legend ? 34 : 0, bottom: 0,
          itemStyle: { borderColor: tk.card, borderWidth: 2, gapWidth: 2, borderRadius: 4 },
          label: { fontFamily: tk.fontBody, fontSize: 12, fontWeight: 600 },
          data: data.map((d, i) => {
            const fill = rz(d.color || colorFor(i, d.label || d.name));
            return {
              name: d.label || d.name, value: d.value,
              itemStyle: { color: fill },
              label: { color: onColor(fill, tk.text, tk.card) },
            };
          }),
        }, mount(false))],
      });
    }
    case 'boxplot': {
      return merge(base, {
        tooltip: { trigger: 'item' },
        xAxis: merge(catAxis, { boundaryGap: true }),
        yAxis: valAxis,
        series: [merge({
          type: 'boxplot', data: (series[0] && series[0].values) || [],
          itemStyle: { color: tk.card, borderColor: tk.text, borderWidth: 1.5 },
          emphasis: { itemStyle: { borderColor: tk.accent, borderWidth: 2 } },
        }, mount(true))],
      });
    }
    default:
      return base;
  }
}

export function FlowChart({
  type = 'line',
  height = 280,
  loading = false,
  emptyLabel = 'Sin datos para este periodo',
  option: override,
  onSelect,
  ariaLabel,
  style,
  ...rest
}) {
  const hostRef = React.useRef(null);
  const chartRef = React.useRef(null);
  const rafRef = React.useRef(0);
  const lastSize = React.useRef({ w: 0, h: 0 });
  const [ready, setReady] = React.useState(typeof window !== 'undefined' && !!window.echarts);
  const [failed, setFailed] = React.useState(false);
  const [themeKey, setThemeKey] = React.useState(0);

  const props = rest;
  const hasData = React.useMemo(() => {
    if (props.target != null) return true;
    if (props.matrix) return (props.matrix.values || []).length > 0;
    const s = props.series || [];
    return s.length > 0 && s.some((x) => ((x.values || x.data || []).length > 0));
  }, [props.series, props.matrix, props.target]);

  React.useEffect(() => {
    let alive = true;
    loadEcharts().then(() => { if (alive) setReady(true); }).catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, []);

  // Re-tematiza cuando cambia data-mode en cualquier ancestro
  React.useEffect(() => {
    if (typeof MutationObserver === 'undefined') return;
    const obs = new MutationObserver(() => setThemeKey((k) => k + 1));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });
    let node = hostRef.current && hostRef.current.parentElement;
    while (node && node !== document.documentElement) {
      obs.observe(node, { attributes: true, attributeFilter: ['data-mode'] });
      node = node.parentElement;
    }
    return () => obs.disconnect();
  }, [ready]);

  React.useEffect(() => {
    if (!ready || !hostRef.current || !hasData) return;
    const ec = window.echarts;
    if (!chartRef.current || chartRef.current.isDisposed()) {
      chartRef.current = ec.init(hostRef.current, null, { renderer: 'canvas' });
      if (onSelect) chartRef.current.on('click', (p) => onSelect(p));
    }
    const tk = readTokens(hostRef.current);
    const opt = resolveVars(merge(buildOption(type, props, tk), override), tk.resolve);
    chartRef.current.setOption(opt, true);

    // La animacion de entrada arranca las series en su frame cero: barra de altura 0,
    // linea sin trazo, punto sin escala. Si el rAF del contenedor no avanza (iframe
    // en segundo plano, pestana oculta, preview throttleado) el frame cero se queda
    // fijo y el chart se ve como ejes vacios. Probamos el loop y, si no corre,
    // repintamos el estado final sin animacion.
    let looped = false;
    const probe = requestAnimationFrame(() => { looped = true; });
    const settle = setTimeout(() => {
      if (looped) return;
      const c = chartRef.current;
      if (!c || c.isDisposed()) return;
      // Se reconstruye la opcion por la rama sin motion: apagar la bandera global no
      // basta porque cada serie trae su propia animation con animationDelay, y la
      // configuracion por serie gana. Y hay que vaciar la instancia antes de repintar:
      // setOption no reconstruye los elementos ya atascados en su frame cero.
      const still = resolveVars(merge(buildOption(type, Object.assign({}, props, { animate: false }), tk), override), tk.resolve);
      still.animation = false;
      if (still.series) still.series = still.series.map(function (sr) {
        return Object.assign({}, sr, { animation: false, animationDuration: 0, animationDelay: 0, animationDurationUpdate: 0 });
      });
      c.clear();
      c.setOption(still, true);
    }, 320);
    return () => { cancelAnimationFrame(probe); clearTimeout(settle); };
  }, [ready, hasData, type, themeKey, override, JSON.stringify(props.series || null), JSON.stringify(props.matrix || null), props.highlight, props.stack, props.legend, props.horizontal, props.showValues, props.palette, props.animate]);

  React.useEffect(() => {
    if (!chartRef.current) return;
    if (loading) chartRef.current.showLoading('default', {
      text: '', maskColor: 'transparent', color: readTokens(hostRef.current).accent, spinnerRadius: 9, lineWidth: 2,
    });
    else chartRef.current.hideLoading();
  }, [loading, ready, hasData]);

  // El resize se difiere fuera del callback del observer: llamar a chart.resize()
  // dentro de la misma entrega re-ensucia el elemento observado y el navegador
  // aborta el ciclo ("loop completed with undelivered notifications").
  React.useEffect(() => {
    if (!hostRef.current || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const el = hostRef.current;
        if (!el || !chartRef.current || chartRef.current.isDisposed()) return;
        const w = el.clientWidth, h = el.clientHeight;
        if (w === lastSize.current.w && h === lastSize.current.h) return;
        lastSize.current = { w: w, h: h };
        chartRef.current.resize();
      });
    });
    ro.observe(hostRef.current);
    return () => { ro.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, [ready]);

  React.useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    if (chartRef.current && !chartRef.current.isDisposed()) chartRef.current.dispose();
    chartRef.current = null;
  }, []);

  const frame = {
    position: 'relative', width: '100%', height: height,
    fontFamily: 'var(--font-body)', ...style,
  };

  if (failed || !hasData) {
    return React.createElement('div', {
      style: merge(frame, { display: 'flex', alignItems: 'center', justifyContent: 'center' }),
      role: 'img', 'aria-label': failed ? 'La grafica no pudo cargar' : emptyLabel,
    }, React.createElement('div', {
      style: { textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 },
    },
      React.createElement('span', {
        className: 'flow-symbol', 'aria-hidden': true,
        style: { fontSize: 26, color: 'var(--text-muted)', display: 'block', marginBottom: 4 },
      }, failed ? 'cloud_off' : 'bar_chart'),
      failed ? 'La grafica no pudo cargar' : emptyLabel));
  }

  return React.createElement('div', {
    ref: hostRef,
    role: 'img',
    'aria-label': ariaLabel || ('Grafica ' + type),
    style: frame,
  });
}
