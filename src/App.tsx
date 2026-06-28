import { useCallback, useEffect, useState } from 'react'
import { PROVINCE_BY_NAME } from './data/provinces'
import { useQuiz } from './hooks/useQuiz'
import { ChinaMap } from './components/ChinaMap'
import { ExplorePanel } from './components/ExplorePanel'
import { QuizPanel } from './components/QuizPanel'
import { WallpaperView } from './components/WallpaperView'
import type { AppMode, ProvinceInfo } from './types'

function isFileProtocol() {
  return window.location.protocol === 'file:'
}

function isAppRoute() {
  if (isFileProtocol()) return false
  return window.location.hash === '#app'
}

function isWallpaperRoute() {
  if (isFileProtocol()) return true
  return !isAppRoute()
}

function App() {
  const [wallpaper, setWallpaper] = useState(isWallpaperRoute)
  const [mode, setMode] = useState<AppMode>('explore')
  const [selected, setSelected] = useState<ProvinceInfo | null>(null)
  const [lastClick, setLastClick] = useState<string | null>(null)
  const [showCapitals, setShowCapitals] = useState(false)
  const { state: quiz, startQuiz, answer, nextQuestion } = useQuiz()

  useEffect(() => {
    if (mode === 'quiz') {
      setSelected(null)
      setLastClick(null)
    }
  }, [mode])

  useEffect(() => {
    const onHashChange = () => setWallpaper(isWallpaperRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const enterWallpaper = useCallback(() => {
    if (!isFileProtocol()) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    setWallpaper(true)
  }, [])

  const exitWallpaper = useCallback(() => {
    if (!isFileProtocol()) window.location.hash = '#app'
    setWallpaper(false)
  }, [])

  const handleProvinceClick = useCallback(
    (name: string) => {
      if (mode === 'explore') {
        setSelected(PROVINCE_BY_NAME.get(name) ?? null)
        setLastClick(name)
        return
      }

      if (quiz.feedback !== 'idle' || quiz.finished || !quiz.target) return
      setLastClick(name)
      answer(name)
    },
    [mode, quiz.feedback, quiz.finished, quiz.target, answer],
  )

  if (wallpaper) {
    return <WallpaperView onExit={exitWallpaper} />
  }

  const mapSelected =
    mode === 'explore'
      ? selected?.name ?? lastClick
      : quiz.feedback !== 'idle'
        ? lastClick
        : null

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <div>
            <h1>中国地图</h1>
            <p>熟悉省界 · 认位置练习</p>
          </div>
        </div>
        <div className="header-actions">
          <nav className="mode-nav" aria-label="模式切换">
            <button
              type="button"
              className={`mode-btn ${mode === 'explore' ? 'mode-btn--active' : ''}`}
              onClick={() => setMode('explore')}
            >
              探索
            </button>
            <button
              type="button"
              className={`mode-btn ${mode === 'quiz' ? 'mode-btn--active' : ''}`}
              onClick={() => setMode('quiz')}
            >
              测验
            </button>
          </nav>
          <button
            type="button"
            className="wallpaper-btn"
            onClick={enterWallpaper}
            title="全屏地图，隐藏界面"
          >
            壁纸
          </button>
        </div>
      </header>

      <main className="main">
        <section className="map-section" aria-label="中国地图">
          <ChinaMap
            mode={mode}
            onProvinceClick={handleProvinceClick}
            selectedName={mapSelected}
            feedback={mode === 'quiz' ? quiz.feedback : 'idle'}
            correctName={mode === 'quiz' ? quiz.correctName : null}
            showCapitals={showCapitals}
          />
          <label className="map-toggle">
            <input
              type="checkbox"
              checked={showCapitals}
              onChange={(e) => setShowCapitals(e.target.checked)}
            />
            <span>显示省会</span>
          </label>
        </section>
        <aside className="side-panel">
          {mode === 'explore' ? (
            <ExplorePanel province={selected} />
          ) : (
            <QuizPanel state={quiz} onStart={startQuiz} onNext={nextQuestion} />
          )}
        </aside>
      </main>
    </div>
  )
}

export default App
