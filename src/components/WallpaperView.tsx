import { useCallback, useEffect, useState } from 'react'
import { pickRandomProvince } from '../data/provinces'
import { ChinaMap } from './ChinaMap'

const HIGHLIGHT_INTERVAL_MS = 6000

interface WallpaperViewProps {
  onExit: () => void
}

export function WallpaperView({ onExit }: WallpaperViewProps) {
  const [highlighted, setHighlighted] = useState(() => pickRandomProvince().name)
  const [showChrome, setShowChrome] = useState(false)

  useEffect(() => {
    const id = window.setInterval(() => {
      setHighlighted((prev) => pickRandomProvince(prev).name)
    }, HIGHLIGHT_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onExit])

  const handleMove = useCallback(() => {
    setShowChrome(true)
  }, [])

  return (
    <div
      className="wallpaper-view"
      onMouseMove={handleMove}
      onTouchStart={handleMove}
    >
      <ChinaMap
        mode="explore"
        wallpaper
        onProvinceClick={() => {}}
        selectedName={highlighted}
        feedback="idle"
        correctName={null}
      />
      <div className={`wallpaper-chrome ${showChrome ? 'wallpaper-chrome--visible' : ''}`}>
        <button
          type="button"
          className="wallpaper-exit"
          onClick={onExit}
          aria-label="退出壁纸视图"
          title="退出 (Esc)"
        >
          退出
        </button>
      </div>
    </div>
  )
}
