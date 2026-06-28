import { useCallback, useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import type { ECElementEvent, EChartsOption, LinesSeriesOption, ScatterSeriesOption } from 'echarts'
import type { AppMode } from '../types'
import { CAPITAL_MARKERS } from '../data/capitals'
import chinaGeo from '../data/china.json'

interface ChinaMapProps {
  mode: AppMode
  onProvinceClick: (name: string) => void
  selectedName: string | null
  feedback: 'idle' | 'correct' | 'wrong'
  correctName: string | null
  showCapitals?: boolean
  wallpaper?: boolean
}

const COLORS = {
  fill: '#eef2f7',
  border: '#cbd5e1',
  hover: '#3b82f6',
  selected: '#2563eb',
  correct: '#22c55e',
  wrong: '#ef4444',
}

function areaColor(
  name: string,
  selected: string | null,
  feedback: 'idle' | 'correct' | 'wrong',
  correct: string | null,
) {
  if (feedback === 'wrong' && name === correct) return COLORS.correct
  if (feedback === 'wrong' && name === selected) return COLORS.wrong
  if (feedback === 'correct' && name === selected) return COLORS.correct
  if (name === selected) return COLORS.selected
  return COLORS.fill
}

function answerProvinceName(
  selected: string | null,
  feedback: 'idle' | 'correct' | 'wrong',
  correct: string | null,
) {
  if (feedback === 'wrong') return correct
  if (feedback === 'correct') return selected
  return null
}

const GEO_INSET = { top: '5%', bottom: '5%', left: '5%', right: '5%' }

/** Rendered map width/height at fit; keeps province shapes from stretching on resize. */
const MAP_VIEW_ASPECT = 0.884

type GeoView = { center?: number[]; zoom?: number }

function provinceBorderLines(name: string) {
  const feature = chinaGeo.features.find(
    (f) => (f.properties as { name: string }).name === name,
  )
  if (!feature) return []

  const lines: Array<{ coords: [number, number][] }> = []
  const { type, coordinates } = feature.geometry as {
    type: string
    coordinates: unknown
  }

  const addRings = (rings: [number, number][][]) => {
    for (const ring of rings) {
      if (ring.length > 1) lines.push({ coords: ring })
    }
  }

  if (type === 'Polygon') {
    addRings(coordinates as [number, number][][])
  } else if (type === 'MultiPolygon') {
    for (const polygon of coordinates as [number, number][][][]) {
      addRings(polygon)
    }
  }

  return lines
}

const HOVER_FILL = { areaColor: COLORS.hover }

function buildGeoRegions(
  selected: string | null,
  feedback: 'idle' | 'correct' | 'wrong',
  correct: string | null,
  wallpaper = false,
) {
  const tagged = new Set<string>()
  if (selected) tagged.add(selected)
  if (correct) tagged.add(correct)

  return [...tagged].map((name) => {
    if (wallpaper && name === selected) {
      return {
        name,
        itemStyle: HOVER_FILL,
        emphasis: { itemStyle: HOVER_FILL },
      }
    }
    const fill = areaColor(name, selected, feedback, correct)
    const style = { areaColor: fill }
    return {
      name,
      itemStyle: style,
      emphasis: { itemStyle: style },
    }
  })
}

function resolveBorderHighlight(
  selected: string | null,
  feedback: 'idle' | 'correct' | 'wrong',
  correct: string | null,
  wallpaper: boolean,
): { name: string; lineWidth: number } | null {
  const answer = answerProvinceName(selected, feedback, correct)
  if (answer) return { name: answer, lineWidth: 2.5 }
  if (wallpaper && selected) return { name: selected, lineWidth: 1.5 }
  return null
}

function buildProvinceBorderSeries(
  name: string,
  lineWidth: number,
): LinesSeriesOption | null {
  const data = provinceBorderLines(name)
  if (!data.length) return null

  return {
    type: 'lines',
    coordinateSystem: 'geo',
    geoIndex: 0,
    zlevel: 10,
    polyline: true,
    silent: true,
    clip: false,
    animation: false,
    lineStyle: { color: '#1d4ed8', width: lineWidth, cap: 'round', join: 'round' },
    data,
  }
}

function buildHighlightBorderSeries(
  selected: string | null,
  feedback: 'idle' | 'correct' | 'wrong',
  correct: string | null,
  wallpaper: boolean,
) {
  const highlight = resolveBorderHighlight(selected, feedback, correct, wallpaper)
  if (!highlight) return null
  return buildProvinceBorderSeries(highlight.name, highlight.lineWidth)
}

function buildCapitalSeries(): ScatterSeriesOption {
  return {
    type: 'scatter',
    coordinateSystem: 'geo',
    geoIndex: 0,
    zlevel: 2,
    symbolSize: 7,
    itemStyle: { color: '#dc2626', borderColor: '#fff', borderWidth: 1 },
    label: {
      show: true,
      formatter: ({ data }) => {
        const value = (data as { value: [number, number, string] }).value
        return value[2]
      },
      position: 'right',
      distance: 4,
      fontSize: 11,
      color: '#334155',
      backgroundColor: 'rgba(255,255,255,0.75)',
      padding: [1, 4],
      borderRadius: 3,
    },
    data: CAPITAL_MARKERS.map(({ capital, coord }) => ({
      name: capital,
      value: [...coord, capital] as [number, number, string],
    })),
  }
}

function buildMapOption(
  selected: string | null,
  feedback: 'idle' | 'correct' | 'wrong',
  correct: string | null,
  showCapitals: boolean,
  geoView?: GeoView,
  wallpaper = false,
): EChartsOption {
  const geoRegions = buildGeoRegions(selected, feedback, correct, wallpaper)
  const highlightBorderSeries = buildHighlightBorderSeries(selected, feedback, correct, wallpaper)
  const mapSeries = {
    type: 'map' as const,
    map: 'china' as const,
    geoIndex: 0,
    selectedMode: false as const,
    label: { show: false },
    emphasis: {
      label: { show: false },
      itemStyle: {
        areaColor: COLORS.hover,
        borderColor: '#1d4ed8',
        borderWidth: 1.5,
      },
    },
    data: [],
  }

  const series = showCapitals
    ? [mapSeries, ...(highlightBorderSeries ? [highlightBorderSeries] : []), buildCapitalSeries()]
    : [mapSeries, ...(highlightBorderSeries ? [highlightBorderSeries] : [])]

  return {
    tooltip: {
      trigger: 'item',
      formatter: (p) => {
        const item = Array.isArray(p) ? p[0] : p
        if (!item.name) return ''
        const value = item.value as [number, number, string] | undefined
        if (value?.[2]) return `<b>${value[2]}</b><br/>省会`
        return `<b>${item.name}</b>`
      },
      backgroundColor: '#fff',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#334155', fontSize: 13 },
      extraCssText: 'box-shadow:0 4px 12px rgba(37,99,235,.12);border-radius:8px;',
    },
    geo: {
      map: 'china',
      roam: true,
      aspectScale: 0.75,
      layoutCenter: ['50%', '50%'],
      layoutSize: '100%',
      ...GEO_INSET,
      ...(geoView?.center ? { center: geoView.center } : {}),
      ...(geoView?.zoom != null ? { zoom: geoView.zoom } : {}),
      scaleLimit: { min: 0.8, max: 4 },
      label: { show: false },
      regions: geoRegions,
      itemStyle: {
        areaColor: COLORS.fill,
        borderColor: COLORS.border,
        borderWidth: 0.8,
      },
      emphasis: {
        label: { show: false },
        itemStyle: {
          areaColor: COLORS.hover,
          borderColor: '#1d4ed8',
          borderWidth: 1.5,
        },
      },
    },
    series,
  }
}

export function ChinaMap({
  mode,
  onProvinceClick,
  selectedName,
  feedback,
  correctName,
  showCapitals = false,
  wallpaper = false,
}: ChinaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts | null>(null)
  const readyRef = useRef(false)
  const propsRef = useRef({ selectedName, feedback, correctName, mode, showCapitals, wallpaper })

  propsRef.current = { selectedName, feedback, correctName, mode, showCapitals, wallpaper }

  const readGeoView = useCallback((chart: echarts.ECharts): GeoView => {
    const geo = (chart.getOption().geo as GeoView[] | undefined)?.[0]
    return { center: geo?.center, zoom: geo?.zoom }
  }, [])

  const render = useCallback(() => {
    const chart = chartRef.current
    if (!chart || chart.isDisposed() || !readyRef.current) return

    const {
      selectedName: sel,
      feedback: fb,
      correctName: corr,
      showCapitals: caps,
      wallpaper: wp,
    } = propsRef.current
    const geoView = readGeoView(chart)
    chart.setOption(buildMapOption(sel, fb, corr, caps, geoView, wp), {
      replaceMerge: ['series', 'geo'],
    })
    if (wp) {
      chart.dispatchAction({ type: 'hideTip' })
      if (sel) {
        chart.dispatchAction({ type: 'showTip', seriesIndex: 0, name: sel })
      }
    }
  }, [readGeoView])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let cancelled = false
    const chart = echarts.init(el)
    chartRef.current = chart
    chart.showLoading({ text: '地图加载中…', color: '#2563eb' })

    const resizeChart = () => {
      if (chart.isDisposed()) return

      const measureEl = el.parentElement ?? el
      const clientW = measureEl.clientWidth
      const clientH = measureEl.clientHeight
      if (!clientW || !clientH) return

      const containerAspect = clientW / clientH
      let resizeW = clientW
      let resizeH = clientH
      if (containerAspect > MAP_VIEW_ASPECT) {
        resizeW = Math.round(clientH * MAP_VIEW_ASPECT)
      } else {
        resizeH = Math.round(clientW / MAP_VIEW_ASPECT)
      }

      chart.resize({ width: resizeW, height: resizeH })
    }

    try {
      echarts.registerMap('china', chinaGeo as Parameters<typeof echarts.registerMap>[1])
      readyRef.current = true
      chart.hideLoading()
      resizeChart()
      chart.setOption(
        buildMapOption(null, 'idle', null, propsRef.current.showCapitals, undefined, propsRef.current.wallpaper),
        true,
      )
      render()
    } catch {
      if (cancelled) return
      chart.hideLoading()
      chart.setOption({
        title: {
          text: '地图加载失败，请刷新页面',
          left: 'center',
          top: 'center',
          textStyle: { color: '#64748b', fontSize: 14, fontWeight: 400 },
        },
      })
    }

    const onClick = (p: ECElementEvent) => {
      if (p.name) onProvinceClick(p.name as string)
    }

    chart.on('click', onClick)

    const ro = new ResizeObserver(resizeChart)
    ro.observe(el.parentElement ?? el)
    window.addEventListener('resize', resizeChart)

    return () => {
      cancelled = true
      ro.disconnect()
      window.removeEventListener('resize', resizeChart)
      chart.off('click', onClick)
      chart.dispose()
      chartRef.current = null
      readyRef.current = false
    }
  }, [onProvinceClick, render])

  useEffect(() => {
    render()
  }, [selectedName, feedback, correctName, mode, showCapitals, wallpaper, render])

  const resetView = () => {
    const chart = chartRef.current
    if (!chart || chart.isDisposed() || !readyRef.current) return
    chart.setOption(
      buildMapOption(selectedName, feedback, correctName, showCapitals, readGeoView(chart), wallpaper),
      true,
    )
  }

  return (
    <div className={`map-wrap ${wallpaper ? 'map-wrap--wallpaper' : ''}`}>
      <div ref={containerRef} className="map-canvas" />
      {!wallpaper && (
        <button type="button" className="reset-btn" onClick={resetView}>
          重置视图
        </button>
      )}
    </div>
  )
}
