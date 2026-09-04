import { useRef, useState, useEffect, useMemo, type CSSProperties } from 'react'
import { useIntl } from 'react-intl'
import type { ECharts, EChartsCoreOption } from 'echarts/core'
import css from './FlowChart.module.css'

// fc-5: ECharts entra por carga perezosa — una sola vez por documento, y si
// la libreria no carga el componente degrada a mensaje, nunca a un hueco.
// Beneficio lateral: el bundle inicial de un consumidor sin graficas no la paga.
type EchartsCore = typeof import('echarts/core')
let echartsListo: EchartsCore | null = null
let echartsCarga: Promise<EchartsCore> | null = null

function cargarEcharts(): Promise<EchartsCore> {
  echartsCarga ??= Promise.all([
    import('echarts/core'),
    import('echarts/charts'),
    import('echarts/components'),
    import('echarts/renderers'),
  ]).then(([core, charts, comps, rends]) => {
    core.use([
      charts.BarChart, charts.LineChart, charts.PieChart, charts.ScatterChart,
      charts.RadarChart, charts.GaugeChart, charts.FunnelChart, charts.TreemapChart,
      charts.HeatmapChart, charts.BoxplotChart,
      comps.GridComponent, comps.TooltipComponent, comps.LegendComponent, comps.VisualMapComponent,
      rends.CanvasRenderer,
    ])
    echartsListo = core
    return core
  })
  echartsCarga.catch(() => { echartsCarga = null }) // un fallo no envenena el reintento
  return echartsCarga
}

export type FlowChartType =
  | 'line' | 'area' | 'bar' | 'stackedBar' | 'stacked100'
  | 'donut' | 'pie' | 'scatter' | 'heatmap' | 'radar'
  | 'waterfall' | 'pareto' | 'gauge' | 'funnel' | 'treemap' | 'boxplot'

export interface ChartSeries {
  label: string
  values?: number[]
  data?: Array<{ label: string; value: number; color?: string }>
  color?: string
  symbolSize?: number
  [k: string]: unknown
}

export interface ChartMatrix {
  rows: string[]
  cols: string[]
  values: [number, number, number][]
}

export interface FlowChartProps {
  type?: FlowChartType
  series?: ChartSeries[]
  labels?: string[]
  matrix?: ChartMatrix
  indicators?: Array<string | { name: string; max: number; icon?: string }>
  totals?: number[]
  target?: number
  max?: number
  min?: number
  format?: (value: number) => string
  palette?: 'auto' | 'duo' | 'categorical'
  highlight?: string
  animate?: boolean
  loading?: boolean
  height?: number
  legend?: boolean
  stack?: boolean
  smooth?: boolean
  horizontal?: boolean
  showValues?: boolean
  area?: boolean
  itemColors?: string[]
  color?: string
  thresholds?: [number, string][]
  option?: Record<string, unknown>
  onSelect?: (params: unknown) => void
  ariaLabel: string
  emptyLabel?: string
  style?: CSSProperties
}

function cleanFont(v: string) {
  return v.split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean).join(', ')
}

function readTokens(el: HTMLElement) {
  const cs = getComputedStyle(el)
  const t = (name: string, fallback: string) => (cs.getPropertyValue(name) || '').trim() || fallback
  const resolve = (c: string) => {
    let v = String(c || '')
    for (let i = 0; i < 4 && /^var\(/.test(v); i++) {
      const inner = v.slice(4, -1).split(',')[0].trim()
      v = (cs.getPropertyValue(inner) || '').trim() || v.slice(4, -1).split(',').slice(1).join(',').trim()
    }
    return v || c
  }
  const kpi = t('--type-data-lg', '600 26px/1.15').match(/(\d{3})\s+(\d+(?:\.\d+)?)px/)
  return {
    resolve,
    palette: [1, 2, 3, 4, 5, 6, 7, 8].map(i => t('--viz-' + i, '#2E7CF6')),
    ramp: [1, 2, 3, 4, 5, 6].map(i => t('--viz-ramp-' + i, '#E7F0FE')),
    accent: t('--viz-accent', '#F72717'),
    positive: t('--viz-positive', '#007840'),
    negative: t('--viz-negative', '#ca0e00'),
    neutral: t('--viz-neutral', '#94A3B8'),
    grid: t('--viz-grid', '#E2E8F0'),
    axis: t('--viz-axis', '#CBD5E1'),
    label: t('--viz-label', '#475569'),
    tipBg: t('--viz-tooltip-bg', '#0F172A'),
    tipText: t('--viz-tooltip-text', '#F8FAFC'),
    card: t('--surface-card', '#FFFFFF'),
    text: t('--text-primary', '#0F172A'),
    muted: t('--text-muted', '#64748B'),
    fontBody: cleanFont(t('--font-body', 'sans-serif')),
    fontMono: cleanFont(t('--font-mono', 'monospace')),
    kpiWeight: kpi ? Number(kpi[1]) : 600,
    kpiSize: kpi ? parseFloat(kpi[2]) : 26,
  }
}

type Tokens = ReturnType<typeof readTokens>

function isReduced() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function merge(base: any, extra: any): any {
  if (!extra) return base
  const out = Array.isArray(base) ? base.slice() : { ...base }
  for (const k of Object.keys(extra)) {
    const a = out[k]
    const b = extra[k]
    out[k] = (b && typeof b === 'object' && !Array.isArray(b) && a && typeof a === 'object' && !Array.isArray(a))
      ? merge(a, b) : b
  }
  return out
}

function paletteFor(count: number, mode: string, tk: Tokens) {
  const duo = [tk.palette[0], tk.accent, tk.neutral]
  if (mode === 'categorical') return tk.palette
  if (mode === 'duo') return duo
  return count <= 3 ? duo : tk.palette
}

function colorRamp(hex: string, steps: number): string[] {
  const h = hex.startsWith('#') ? hex : '#2E7CF6'
  const r = parseInt(h.slice(1, 3), 16)
  const g = parseInt(h.slice(3, 5), 16)
  const b = parseInt(h.slice(5, 7), 16)
  return Array.from({ length: steps }, (_, i) => {
    const a = 0.08 + (i / (steps - 1)) * 0.92
    return `rgba(${r},${g},${b},${a.toFixed(2)})`
  })
}

function resolveVars(o: unknown, rz: (c: string) => string): unknown {
  if (typeof o === 'string') return /var\(--/.test(o) ? rz(o) : o
  if (typeof o === 'function' || o == null) return o
  if (Array.isArray(o)) return o.map(v => resolveVars(v, rz))
  if (typeof o === 'object') {
    if (o instanceof Date) return o
    const out: Record<string, unknown> = {}
    for (const k of Object.keys(o)) out[k] = resolveVars((o as Record<string, unknown>)[k], rz)
    return out
  }
  return o
}

function buildOption(type: FlowChartType, props: FlowChartProps, tk: Tokens) {
  const {
    series = [], labels = [], format, legend = false, stack = false, smooth = true,
    highlight, horizontal = false, matrix, indicators, target, max, min,
    showValues = false, area, palette = 'auto', animate = true, itemColors, color, thresholds,
  } = props

  const motion = animate && !isReduced()
  const fmt = typeof format === 'function' ? format : (v: number) => String(v)
  const axisFmt = (v: number | string) => (typeof v === 'number' ? fmt(v) : v)

  const rz = tk.resolve
  const OWN = new Set(['label', 'values', 'data', 'color', 'symbolSize'])
  const extra = (s: ChartSeries) => {
    const o: Record<string, unknown> = {}
    for (const k of Object.keys(s)) { if (!OWN.has(k)) o[k] = s[k] }
    return o
  }

  const pal = paletteFor(series.length, palette, tk)
  const rest = highlight ? pal.filter(c => c !== tk.accent) : pal
  const assigned: string[] = []
  let slot = 0
  for (const s of series) {
    assigned.push((highlight && s.label === highlight) ? tk.accent : (s.color ? rz(s.color) : rest[slot++ % rest.length]))
  }
  const colorFor = (i: number, label: string) =>
    (highlight && label === highlight) ? tk.accent : (assigned[i] || rest[i % rest.length] || tk.text)

  const textStyle = { fontFamily: tk.fontBody, fontSize: 12, color: tk.label }
  const monoStyle = { fontFamily: tk.fontMono, fontSize: 11.5, color: tk.label }

  const num = (v: string) => '<span style="font-family:' + tk.fontMono + ';font-weight:600">' + v + '</span>'
  const tipHead = (s: string) => '<div style="font-size:11.5px;opacity:.65;margin-bottom:3px">' + s + '</div>'
  const tipRow = (marker: string, name: string, val: string) =>
    '<div style="display:flex;align-items:center;gap:6px">' + (marker || '')
    + '<span style="flex:1">' + (name || '') + '</span>' + num(val) + '</div>'

  const dur = 620
  const stagger = 36
  const mount = (perPoint: boolean) => (motion ? {
    animation: true,
    animationDuration: dur,
    animationEasing: 'cubicOut',
    animationDelay: perPoint ? (i: number) => i * stagger : 0,
  } : { animation: false })

  const BAR_W = 34
  const cap = BAR_W / 2
  const barRadius = (stacked: boolean) => {
    if (stacked) return 0
    return horizontal ? [0, cap, cap, 0] : [cap, cap, 0, 0]
  }

  const labelOpt = showValues
    ? { show: true, position: horizontal ? 'right' : 'top', fontFamily: tk.fontMono, fontSize: 11, fontWeight: 600, color: tk.label, formatter: (p: { value: number }) => fmt(p.value) }
    : { show: false }

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
      itemWidth: 10, itemHeight: 10, textStyle,
    } : { show: false },
    tooltip: {
      backgroundColor: tk.tipBg,
      borderWidth: 0,
      padding: [9, 12],
      extraCssText: 'border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.18)',
      textStyle: { color: tk.tipText, fontFamily: tk.fontBody, fontSize: 12.5 },
      axisPointer: { type: 'line', lineStyle: { color: tk.axis, width: 1 } },
    },
  }

  const catAxis = {
    type: 'category',
    data: labels,
    boundaryGap: type === 'bar' || type === 'stackedBar' || type === 'stacked100' || type === 'waterfall' || type === 'pareto',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: tk.label, fontFamily: tk.fontBody, fontSize: 11.5, hideOverlap: true, margin: 12 },
  }
  const valAxis = {
    type: 'value',
    splitLine: { lineStyle: { color: tk.grid, type: 'dashed' } },
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: tk.label, fontFamily: tk.fontMono, fontSize: 11, formatter: axisFmt, margin: 12 },
    min, max,
  }

  switch (type) {
    case 'line':
    case 'area': {
      const isArea = type === 'area' || area
      return merge(base, {
        tooltip: {
          trigger: 'axis',
          formatter: (ps: Array<{ axisValueLabel: string; marker: string; seriesName: string; value: number }>) =>
            tipHead(ps[0].axisValueLabel) + ps.map(p => tipRow(p.marker, p.seriesName, fmt(p.value))).join(''),
        },
        xAxis: catAxis,
        yAxis: valAxis,
        series: series.map((s, i) => {
          const c = s.color || colorFor(i, s.label)
          return merge({
            name: s.label, type: 'line', data: s.values, smooth: smooth ? 0.35 : false,
            showSymbol: false, symbolSize: 7,
            lineStyle: { width: 2.25, color: c, cap: 'round', join: 'round' },
            itemStyle: { color: c },
            stack: stack ? 'total' : undefined,
            emphasis: { focus: 'series', scale: 1.4 },
            areaStyle: isArea ? { opacity: 0.14, color: c } : undefined,
          }, motion ? { animationDuration: 900, animationDelay: i * 160, animationEasing: 'cubicOut' } : { animation: false })
        }),
      })
    }
    case 'bar':
    case 'stackedBar': {
      const stacked = type === 'stackedBar' || stack
      return merge(base, {
        tooltip: {
          trigger: 'axis', axisPointer: { type: 'shadow' },
          formatter: (ps: Array<{ axisValueLabel: string; marker: string; seriesName: string; value: number }>) =>
            tipHead(ps[0].axisValueLabel) + ps.map(p => tipRow(p.marker, p.seriesName, fmt(p.value))).join(''),
        },
        xAxis: horizontal ? valAxis : catAxis,
        yAxis: horizontal ? merge(catAxis, { boundaryGap: true, inverse: true }) : valAxis,
        series: series.map((s, i) => merge({
          name: s.label, type: 'bar',
          data: itemColors
            ? (s.values || []).map((v, j) => ({ value: v, itemStyle: { color: rz(itemColors[j] || colorFor(i, s.label)) } }))
            : s.values,
          stack: stacked ? 'total' : undefined,
          barMaxWidth: BAR_W,
          itemStyle: { color: rz(s.color || colorFor(i, s.label)), borderRadius: barRadius(!!stacked) },
          emphasis: { focus: 'series' },
          label: labelOpt,
        }, mount(true))),
      })
    }
    case 'stacked100': {
      const n = (series[0]?.values?.length) || 0
      const totals = Array.from({ length: n }, (_, j) => series.reduce((a, s) => a + ((s.values || [])[j] || 0), 0) || 1)
      return merge(base, {
        tooltip: {
          trigger: 'axis', axisPointer: { type: 'shadow' },
          formatter: (ps: Array<{ axisValueLabel: string; marker: string; seriesName: string; value: number; dataIndex: number }>) =>
            tipHead(ps[0].axisValueLabel) + ps.map(p =>
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
      })
    }
    case 'donut':
    case 'pie': {
      const data = (series[0] ? series[0].data || (series[0].values || []) : []) as Array<number | { label?: string; name?: string; value: number; color?: string }>
      const items = data.map((d, i) => (typeof d === 'number'
        ? { name: labels[i] || String(i), value: d }
        : { name: d.label || d.name || '', value: d.value, itemStyle: d.color ? { color: rz(d.color) } : undefined }))
      const wedgePal = paletteFor(items.length, palette, tk)
      return merge(base, {
        color: wedgePal,
        tooltip: {
          trigger: 'item',
          formatter: (p: { marker: string; name: string; value: number; percent: number }) =>
            tipRow(p.marker, p.name, fmt(p.value)) + tipHead(p.percent + '% del total'),
        },
        legend: legend ? { show: true, orient: 'vertical', right: 0, top: 'middle', itemGap: 12, icon: 'circle', itemWidth: 9, itemHeight: 9, textStyle } : { show: false },
        series: [merge({
          type: 'pie',
          radius: type === 'donut' ? ['58%', '82%'] : ['0%', '80%'],
          center: legend ? ['36%', '52%'] : ['50%', '52%'],
          data: items.map((it, i) => merge({ itemStyle: { color: wedgePal[i % wedgePal.length] } }, it as Record<string, unknown>)),
          itemStyle: { borderColor: tk.card, borderWidth: 2, borderRadius: 3 },
          label: { show: false },
          emphasis: { scale: true, scaleSize: 5, itemStyle: { shadowBlur: 14, shadowColor: 'rgba(0,0,0,.14)' } },
        }, motion ? { animationType: 'expansion', animationDuration: 760, animationEasing: 'cubicOut' } : { animation: false })],
      })
    }
    case 'scatter': {
      return merge(base, {
        tooltip: {
          trigger: 'item',
          formatter: (p: { seriesName: string; value: number[] }) =>
            tipHead(p.seriesName) + tipRow('', fmt(p.value[0]), fmt(p.value[1])),
        },
        xAxis: merge(valAxis, { splitLine: { show: true, lineStyle: { color: tk.grid, type: 'dashed' } } }),
        yAxis: valAxis,
        series: series.map((s, i) => merge({
          name: s.label, type: 'scatter', data: s.values, symbolSize: s.symbolSize || 10,
          itemStyle: { color: rz(s.color || colorFor(i, s.label)), opacity: 0.78 },
          emphasis: { focus: 'series', itemStyle: { opacity: 1 } },
        }, merge(extra(s), motion ? { animationDuration: 700, animationDelay: (idx: number) => idx * 22 + i * 90, animationEasing: 'cubicOut' } : { animation: false }))),
      })
    }
    case 'heatmap': {
      const m = matrix || { rows: [], cols: [], values: [] }
      const vals = m.values.map(v => v[2])
      return merge(base, {
        tooltip: {
          position: 'top',
          formatter: (p: { value: number[] }) =>
            tipHead(m.cols[p.value[0]] + ' · ' + m.rows[p.value[1]]) + num(fmt(p.value[2])),
        },
        grid: { left: 8, right: 14, top: 14, bottom: 46, containLabel: true },
        xAxis: merge(catAxis, { data: m.cols, boundaryGap: true, splitArea: { show: false }, axisLine: { show: false } }),
        yAxis: merge(catAxis, { data: m.rows, boundaryGap: true, splitArea: { show: false }, axisLine: { show: false }, inverse: true }),
        visualMap: {
          min: Math.min(...vals, 0), max: Math.max(...vals, 1),
          orient: 'horizontal', left: 'center', bottom: 0, itemWidth: 11, itemHeight: 90,
          inRange: { color: color ? colorRamp(rz(color), 6) : tk.ramp }, textStyle: monoStyle, formatter: (v: number) => String(fmt(Math.round(v))),
        },
        series: [merge({
          type: 'heatmap', data: m.values,
          itemStyle: { borderColor: tk.card, borderWidth: 2, borderRadius: 4 },
          emphasis: { itemStyle: { borderColor: tk.text, borderWidth: 1.5 } },
        }, mount(true))],
      })
    }
    case 'radar': {
      const inds = (indicators || labels).map(x => (typeof x === 'string' ? { name: x, max: max || 100 } : x)) as Array<{ name: string; max: number; icon?: string }>
      const indColors = itemColors && itemColors.length === inds.length ? itemColors.map(c => rz(c)) : null
      const hasIcons = inds.some(i => i.icon)

      const richEntries: Record<string, Record<string, unknown>> = {}
      let axisNameFormatter: ((name: string) => string) | undefined

      if (hasIcons || indColors) {
        inds.forEach((ind, i) => {
          const iconColor = indColors ? indColors[i] : tk.label
          if (ind.icon) {
            richEntries[`i${i}`] = { fontFamily: 'Material Symbols Rounded', fontSize: 18, color: iconColor, verticalAlign: 'middle' }
            richEntries[`t${i}`] = { fontFamily: tk.fontBody, fontSize: 11, fontWeight: 600, color: tk.label, verticalAlign: 'middle', padding: [0, 0, 0, 3] }
          } else {
            richEntries[`t${i}`] = { fontFamily: tk.fontBody, fontSize: 11.5, fontWeight: 600, color: indColors ? iconColor : tk.label }
          }
        })
        axisNameFormatter = (name: string) => {
          const idx = inds.findIndex(i => i.name === name)
          if (idx < 0) return name
          const ind = inds[idx]
          return ind.icon ? `{i${idx}|${ind.icon}}{t${idx}| ${name}}` : `{t${idx}|${name}}`
        }
      }

      const axisNameCfg: Record<string, unknown> = axisNameFormatter
        ? { formatter: axisNameFormatter, rich: richEntries }
        : { color: tk.label, fontFamily: tk.fontBody, fontSize: 11.5 }

      return merge(base, {
        tooltip: { show: false },
        radar: {
          indicator: inds.map(i => ({ name: i.name, max: i.max })), radius: '66%', splitNumber: 4,
          axisName: axisNameCfg,
          splitLine: { lineStyle: { color: tk.grid, type: 'dashed' } },
          splitArea: { show: false },
          axisLine: { lineStyle: { color: tk.grid } },
        },
        series: [merge({
          type: 'radar',
          data: series.map((s, i) => {
            const c = s.color || colorFor(i, s.label)
            return {
              name: s.label, value: s.values,
              lineStyle: { color: c, width: 2.25, join: 'round' }, itemStyle: { color: c },
              areaStyle: { color: c, opacity: 0.16 },
            }
          }),
        }, mount(false))],
      })
    }
    case 'waterfall': {
      const vals = (series[0]?.values) || []
      const helper: number[] = []
      const bars: number[] = []
      let run = 0
      vals.forEach((v, i) => {
        const isTotal = props.totals?.includes(i)
        if (isTotal) {
          const abs = v !== 0 ? v : run
          helper.push(0); bars.push(abs); run = abs; return
        }
        helper.push(v >= 0 ? run : run + v)
        bars.push(Math.abs(v))
        run += v
      })
      return merge(base, {
        tooltip: {
          trigger: 'axis', axisPointer: { type: 'shadow' },
          formatter: (ps: Array<{ seriesName: string; name: string; dataIndex: number }>) => {
            const p = ps.filter(x => x.seriesName !== '__helper')[0]
            if (!p) return ''
            const raw = vals[p.dataIndex]
            const isTot = props.totals?.includes(p.dataIndex)
            return tipHead(p.name) + num(isTot ? fmt(bars[p.dataIndex]) : (raw >= 0 ? '+' : '−') + fmt(Math.abs(raw)))
          },
        },
        xAxis: catAxis,
        yAxis: valAxis,
        series: [
          { name: '__helper', type: 'bar', stack: 'wf', silent: true, itemStyle: { color: 'transparent' }, emphasis: { itemStyle: { color: 'transparent' } }, data: helper, animation: false },
          merge({
            name: series[0]?.label || 'Cambio', type: 'bar', stack: 'wf', barMaxWidth: 38,
            data: bars.map((v, i) => {
              const isTot = props.totals?.includes(i)
              return { value: v, itemStyle: { color: isTot ? tk.neutral : (vals[i] >= 0 ? tk.positive : tk.negative), borderRadius: 6 } }
            }),
            label: labelOpt,
          }, mount(true)),
        ],
      })
    }
    case 'pareto': {
      const data = (series[0]?.values) || []
      const total2 = data.reduce((a, b) => a + b, 0) || 1
      let acc2 = 0
      const cum = data.map((v) => { acc2 += v; return +(acc2 / total2 * 100).toFixed(1) })
      return merge(base, {
        tooltip: {
          trigger: 'axis', axisPointer: { type: 'shadow' },
          formatter: (ps: Array<{ name: string; marker: string; seriesName: string; value: number; seriesIndex: number }>) =>
            tipHead(ps[0].name) + ps.map((p) =>
              tipRow(p.marker, p.seriesName, p.seriesIndex === 1 ? p.value + '%' : fmt(p.value))).join(''),
        },
        legend: legend ? { show: true, top: 0, left: 0, textStyle } : { show: false },
        xAxis: catAxis,
        yAxis: [
          valAxis,
          merge(valAxis, { max: 100, axisLabel: { formatter: (v: number) => v + '%' }, splitLine: { show: false } }),
        ],
        series: [
          merge({
            name: series[0]?.label || 'Frecuencia', type: 'bar', barMaxWidth: BAR_W,
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
      })
    }
    case 'gauge': {
      const v = (series[0]?.values?.[0]) || 0
      const cap2 = max != null ? max : 100
      const gaugeColor = (() => {
        if (thresholds?.length) {
          for (const [cutoff, c] of thresholds) if (v < cutoff) return rz(c)
          return rz(thresholds[thresholds.length - 1][1])
        }
        return v / cap2 >= 0.85 ? tk.negative : rz(series[0]?.color || color || tk.palette[0])
      })()
      const gaugeSeries: unknown[] = [{
        type: 'gauge', startAngle: 200, endAngle: -20, min: min || 0, max: cap2,
        radius: '96%', center: ['50%', '62%'],
        progress: { show: true, width: 14, roundCap: true, itemStyle: { color: gaugeColor } },
        axisLine: { lineStyle: { width: 14, color: [[1, tk.grid]] }, roundCap: true },
        axisTick: { show: false }, splitLine: { show: false },
        axisLabel: { show: false },
        pointer: { show: false },
        anchor: { show: false },
        title: { show: false },
        detail: {
          valueAnimation: motion, offsetCenter: [0, '-6%'],
          fontFamily: tk.fontMono, fontSize: tk.kpiSize, fontWeight: tk.kpiWeight, color: tk.text,
          formatter: (x: number) => String(fmt(x)),
        },
        data: [{ value: v }],
        animation: motion,
        animationDuration: 900,
        animationEasing: 'cubicOut',
      }]
      if (target != null) {
        gaugeSeries.push({
          type: 'gauge', startAngle: 200, endAngle: -20, min: min || 0, max: cap2,
          radius: '96%', center: ['50%', '62%'],
          axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false },
          axisLabel: { show: false }, progress: { show: false }, detail: { show: false },
          pointer: {
            show: true, length: '12%', width: 3, offsetCenter: [0, '-38%'],
            icon: 'triangle', itemStyle: { color: tk.text },
          },
          anchor: { show: false }, title: { show: false },
          data: [{ value: target }],
          animation: false,
        })
      }
      return merge(base, { tooltip: { show: false }, series: gaugeSeries })
    }
    case 'funnel': {
      const data = (series[0] ? series[0].data || (series[0].values || []) : []) as Array<number | { label?: string; name?: string; value: number }>
      const items = data.map((d, i) => (typeof d === 'number'
        ? { name: labels[i] || String(i), value: d }
        : { name: d.label || d.name || '', value: d.value }))
      return merge(base, {
        tooltip: { trigger: 'item', formatter: (p: { marker: string; name: string; value: number }) => tipRow(p.marker, p.name, fmt(p.value)) },
        series: [merge({
          type: 'funnel', left: '4%', right: '4%', top: legend ? 34 : 10, bottom: 6,
          minSize: '24%', gap: 2, sort: 'descending',
          data: items.map((it, i) => {
            const funnelRamp = (color || series[0]?.color) ? colorRamp(rz((color || series[0]?.color)!), items.length) : tk.ramp
            const fill = funnelRamp[Math.max(0, funnelRamp.length - 1 - i)]
            return { ...it, itemStyle: { color: fill, borderWidth: 0, borderRadius: 4 } }
          }),
          label: { show: true, position: 'inside', fontFamily: tk.fontBody, fontSize: 12, fontWeight: 600, formatter: (p: { name: string }) => p.name },
          emphasis: { label: { fontSize: 12.5 } },
        }, mount(true))],
      })
    }
    case 'treemap': {
      const data = (series[0] ? series[0].data || [] : []) as Array<{ label?: string; name?: string; value: number; color?: string }>
      return merge(base, {
        tooltip: { formatter: (p: { name: string; value: number }) => tipRow('', p.name, fmt(p.value)) },
        series: [merge({
          type: 'treemap', roam: false, nodeClick: false, breadcrumb: { show: false },
          left: 0, right: 0, top: legend ? 34 : 0, bottom: 0,
          itemStyle: { borderColor: tk.card, borderWidth: 2, gapWidth: 2, borderRadius: 4 },
          label: { fontFamily: tk.fontBody, fontSize: 12, fontWeight: 600 },
          data: data.map((d, i) => {
            const fill = rz(d.color || colorFor(i, d.label || d.name || ''))
            return { name: d.label || d.name, value: d.value, itemStyle: { color: fill } }
          }),
        }, mount(false))],
      })
    }
    case 'boxplot': {
      return merge(base, {
        tooltip: { trigger: 'item' },
        xAxis: merge(catAxis, { boundaryGap: true }),
        yAxis: valAxis,
        series: [merge({
          type: 'boxplot', data: (series[0]?.values) || [],
          itemStyle: { color: tk.card, borderColor: tk.text, borderWidth: 1.5 },
          emphasis: { itemStyle: { borderColor: tk.accent, borderWidth: 2 } },
        }, mount(true))],
      })
    }
    default:
      return base
  }
}

export function FlowChart({
  type = 'line',
  height = 280,
  loading = false,
  emptyLabel,
  option: override,
  onSelect,
  ariaLabel,
  style,
  ...rest
}: FlowChartProps) {
  const intl = useIntl()
  const resolvedEmptyLabel = emptyLabel ?? intl.formatMessage({ id: 'common.noData', defaultMessage: 'Sin datos para este periodo' })
  const hostRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ECharts | null>(null)
  const rafRef = useRef(0)
  const lastSize = useRef({ w: 0, h: 0 })
  const radarHandlerRef = useRef<((e: { offsetX: number; offsetY: number }) => void) | null>(null)
  const [themeKey, setThemeKey] = useState(0)
  // fc-5: 0 = cargando/lista, tick > 0 re-dispara el efecto al llegar la libreria
  const [libTick, setLibTick] = useState(0)
  const [libFallo, setLibFallo] = useState(false)

  const props = rest as FlowChartProps
  const hasData = useMemo(() => {
    if (props.target != null) return true
    if (props.matrix) return (props.matrix.values || []).length > 0
    const s = props.series || []
    return s.length > 0 && s.some(x => ((x.values || x.data || []).length > 0))
  }, [props.series, props.matrix, props.target])

  useEffect(() => {
    if (typeof MutationObserver === 'undefined') return
    const obs = new MutationObserver(() => setThemeKey(k => k + 1))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!hostRef.current || !hasData) return
    const core = echartsListo
    if (!core) {
      // la libreria aun no esta: pedirla y re-entrar cuando llegue (o degradar)
      let vivo = true
      cargarEcharts()
        .then(() => { if (vivo) setLibTick(t => t + 1) })
        .catch(() => { if (vivo) setLibFallo(true) })
      return () => { vivo = false }
    }
    if (!chartRef.current || chartRef.current.isDisposed()) {
      chartRef.current = core.init(hostRef.current, undefined, { renderer: 'canvas' })
      if (onSelect) chartRef.current.on('click', p => onSelect(p))
    }
    const tk = readTokens(hostRef.current)

    const opt = resolveVars(merge(buildOption(type as FlowChartType, { ...props, type: type as FlowChartType }, tk), override as Record<string, unknown>), tk.resolve) as Record<string, unknown>
    chartRef.current.setOption(opt as EChartsCoreOption, true)

    if (type === 'radar') {
      if (radarHandlerRef.current) chartRef.current.getZr().off('mousemove', radarHandlerRef.current)
      const host = hostRef.current
      const inds = (props.indicators || props.labels || []).map(x =>
        typeof x === 'string' ? { name: x, max: props.max || 100 } : x
      ) as Array<{ name: string; max: number }>
      const n = inds.length
      const chart = chartRef.current
      const meta = (props.series || []).length > 1 ? (props.series || [])[1] : null

      let tipEl = host.querySelector('.flow-radar-tip') as HTMLDivElement | null
      if (!tipEl) {
        tipEl = document.createElement('div')
        tipEl.className = 'flow-radar-tip'
        tipEl.style.cssText = `position:absolute;pointer-events:none;z-index:9999;display:none;background:${tk.card};border:1px solid ${tk.grid};border-radius:8px;padding:8px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.18);transition:opacity var(--dur-fast) var(--ease-out)`
        host.style.position = 'relative'
        host.appendChild(tipEl)
      }
      tipEl.style.background = tk.card
      tipEl.style.borderColor = tk.grid

      let radarHoverIdx = -1
      let isOver = false

      chart.on('mouseover', (p: { componentType?: string; seriesType?: string }) => {
        if (p.componentType === 'series' && p.seriesType === 'radar') { isOver = true; if (tipEl) tipEl.style.display = '' }
      })
      chart.on('mouseout', (p: { componentType?: string; seriesType?: string }) => {
        if (p.componentType === 'series' && p.seriesType === 'radar') { isOver = false; radarHoverIdx = -1; if (tipEl) tipEl.style.display = 'none' }
      })

      const handler = (e: { offsetX: number; offsetY: number }) => {
        if (!host || !isOver || n === 0 || !tipEl) return
        const cx = host.clientWidth / 2
        const cy = host.clientHeight / 2
        const dx = e.offsetX - cx
        const dy = -(e.offsetY - cy)
        let angle = Math.atan2(dy, dx)
        if (angle < 0) angle += 2 * Math.PI
        let best = 0, minD = Infinity
        for (let i = 0; i < n; i++) {
          const a = (Math.PI / 2 + (2 * Math.PI * i) / n) % (2 * Math.PI)
          let d = Math.abs(angle - a)
          if (d > Math.PI) d = 2 * Math.PI - d
          if (d < minD) { minD = d; best = i }
        }
        if (best !== radarHoverIdx) {
          radarHoverIdx = best
          const ind = inds[best]
          if (!ind) return
          const v = (props.series?.[0]?.values?.[best]) ?? 0
          if (meta) {
            const mv = meta.values?.[best] ?? 0
            const diff = v - (mv as number)
            const sc = diff >= 0 ? tk.positive : diff > -10 ? tk.resolve('var(--status-warning)') : tk.negative
            tipEl.innerHTML = `<div style="font-family:${tk.fontBody};font-size:12px;color:${tk.text};min-width:120px"><div style="border-left:3px solid ${sc};padding-left:8px"><div style="font-weight:700;margin-bottom:4px">${ind.name}</div><div><span style="font-weight:700;font-family:${tk.fontMono};font-size:18px">${v}</span> <span style="color:${tk.label}">/ ${mv}</span></div></div></div>`
          } else {
            tipEl.innerHTML = `<div style="font-family:${tk.fontBody};font-size:12px;color:${tk.text}"><div style="font-weight:700;margin-bottom:4px">${ind.name}</div><div style="font-weight:700;font-family:${tk.fontMono};font-size:18px">${v}</div></div>`
          }
        }
        const tw = tipEl.offsetWidth, th = tipEl.offsetHeight
        const cw = host.clientWidth, ch = host.clientHeight
        let tx = e.offsetX + 14, ty = e.offsetY - th - 10
        if (tx + tw > cw) tx = e.offsetX - tw - 14
        if (ty < 0) ty = e.offsetY + 14
        tipEl.style.left = tx + 'px'
        tipEl.style.top = ty + 'px'
      }
      radarHandlerRef.current = handler
      chart.getZr().on('mousemove', handler)
    } else if (radarHandlerRef.current) {
      chartRef.current.getZr().off('mousemove', radarHandlerRef.current)
      radarHandlerRef.current = null
    }

    let looped = false
    const probe = requestAnimationFrame(() => { looped = true })
    const settle = setTimeout(() => {
      if (looped) return
      const c = chartRef.current
      if (!c || c.isDisposed()) return
      const still = resolveVars(
        merge(buildOption(type as FlowChartType, { ...props, type: type as FlowChartType, animate: false }, tk), override as Record<string, unknown>),
        tk.resolve
      ) as Record<string, unknown>
      still.animation = false
      if (Array.isArray(still.series)) {
        still.series = (still.series as Record<string, unknown>[]).map(sr => ({
          ...sr, animation: false, animationDuration: 0, animationDelay: 0, animationDurationUpdate: 0,
        }))
      }
      c.clear()
      c.setOption(still as EChartsCoreOption, true)
    }, 320)

    return () => {
      cancelAnimationFrame(probe); clearTimeout(settle)
      if (type === 'radar' && chartRef.current && !chartRef.current.isDisposed()) {
        chartRef.current.off('mouseover')
        chartRef.current.off('mouseout')
      }
      const tip = hostRef.current?.querySelector('.flow-radar-tip')
      if (tip) tip.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasData, type, themeKey, libTick, override, JSON.stringify(props.series || null), JSON.stringify(props.matrix || null), props.highlight, props.stack, props.legend, props.horizontal, props.showValues, props.palette, props.animate])

  useEffect(() => {
    if (!chartRef.current) return
    if (loading) {
      const tk = hostRef.current ? readTokens(hostRef.current) : { accent: '#F72717' }
      chartRef.current.showLoading('default', { text: '', maskColor: 'transparent', color: tk.accent, spinnerRadius: 9, lineWidth: 2 })
    } else {
      chartRef.current.hideLoading()
    }
  }, [loading, hasData])

  useEffect(() => {
    if (!hostRef.current || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const el = hostRef.current
        if (!el || !chartRef.current || chartRef.current.isDisposed()) return
        const w = el.clientWidth, h = el.clientHeight
        if (w === lastSize.current.w && h === lastSize.current.h) return
        lastSize.current = { w, h }
        chartRef.current!.resize()
      })
    })
    ro.observe(hostRef.current)
    return () => { ro.disconnect(); cancelAnimationFrame(rafRef.current) }
  }, [])

  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current)
    if (chartRef.current && !chartRef.current.isDisposed()) chartRef.current.dispose()
    chartRef.current = null
  }, [])

  if (!hasData) {
    return (
      <div className={css.empty} style={{ height, ...style }} role="img" aria-label={resolvedEmptyLabel}>
        <div className={css.emptyInner}>
          <span className={`flow-symbol ${css.emptyIcon}`} aria-hidden="true">bar_chart</span>
          {resolvedEmptyLabel}
        </div>
      </div>
    )
  }

  // fc-5: si la libreria no carga, degrada a mensaje; nunca a un hueco.
  if (libFallo) {
    const fallo = intl.formatMessage({ id: 'chart.loadError', defaultMessage: 'La gráfica no pudo cargarse. Recarga la página para intentarlo de nuevo.' })
    return (
      <div className={css.empty} style={{ height, ...style }} role="img" aria-label={fallo}>
        <div className={css.emptyInner}>
          <span className={`flow-symbol ${css.emptyIcon}`} aria-hidden="true">error</span>
          {fallo}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label={ariaLabel}
      style={{ width: '100%', height, ...style }}
    />
  )
}
