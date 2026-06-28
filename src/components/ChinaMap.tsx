import { useCallback, useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import type { ECElementEvent } from 'echarts'
import type { AppMode } from '../types'

interface ChinaMapProps {
  mode: AppMode
  onProvinceClick: (name: string) => void
  selectedName: string | null
  feedback: 'idle' | 'correct' | 'wrong'
  correctName: string | null
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

function buildSeriesData(
  selected: string | null,
  feedback: 'idle' | 'correct' | 'wrong',
  correct: string | null,
) {
  const tagged = new Set<string>()
  if (selected) tagged.add(selected)
  if (correct) tagged.add(correct)

  return [...tagged].map((name) => ({
    name,
    itemStyle: {
      areaColor: areaColor(name, selected, feedback, correct),
      borderColor: '#1d4ed8',
      borderWidth: 1.5,
    },
  }))
}

function buildMapOption(
  selected: string | null,
  feedback: 'idle' | 'correct' | 'wrong',
  correct: string | null,
): echarts.EChartsOption {
  return {
    tooltip: {
      trigger: 'item',
      formatter: (p) => {
        const item = Array.isArray(p) ? p[0] : p
        return item.name ? `<b>${item.name}</b>` : ''
      },
      backgroundColor: '#fff',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#334155', fontSize: 13 },
      extraCssText: 'box-shadow:0 4px 12px rgba(37,99,235,.12);border-radius:8px;',
    },
    series: [
      {
        type: 'map',
        map: 'china',
        roam: true,
        scaleLimit: { min: 0.8, max: 4 },
        selectedMode: false,
        label: { show: false },
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
        data: buildSeriesData(selected, feedback, correct),
      },
    ],
  }
}

export function ChinaMap({
  mode,
  onProvinceClick,
  selectedName,
  feedback,
  correctName,
}: ChinaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts | null>(null)
  const readyRef = useRef(false)
  const propsRef = useRef({ selectedName, feedback, correctName, mode })

  propsRef.current = { selectedName, feedback, correctName, mode }

  const render = useCallback(() => {
    const chart = chartRef.current
    if (!chart || chart.isDisposed() || !readyRef.current) return

    const { selectedName: sel, feedback: fb, correctName: corr } = propsRef.current
    chart.setOption({
      series: [{ data: buildSeriesData(sel, fb, corr) }],
    })
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let cancelled = false
    const chart = echarts.init(el)
    chartRef.current = chart
    chart.showLoading({ text: '地图加载中…', color: '#2563eb' })

    const resizeChart = () => {
      if (!chart.isDisposed()) chart.resize()
    }

    fetch('/china.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((geo) => {
        if (cancelled) return
        echarts.registerMap('china', geo)
        readyRef.current = true
        chart.hideLoading()
        resizeChart()
        chart.setOption(buildMapOption(null, 'idle', null), true)
        render()
      })
      .catch(() => {
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
      })

    const onClick = (p: ECElementEvent) => {
      if (p.name) onProvinceClick(p.name as string)
    }

    chart.on('click', onClick)

    const ro = new ResizeObserver(resizeChart)
    ro.observe(el)
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
  }, [selectedName, feedback, correctName, mode, render])

  const resetView = () => {
    const chart = chartRef.current
    if (!chart || chart.isDisposed() || !readyRef.current) return
    chart.setOption(buildMapOption(selectedName, feedback, correctName), true)
  }

  return (
    <div className="map-wrap">
      <div ref={containerRef} className="map-canvas" />
      <button type="button" className="reset-btn" onClick={resetView}>
        重置视图
      </button>
    </div>
  )
}
