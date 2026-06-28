import { QUIZ_ROUND_SIZE } from '../data/provinces'
import type { QuizState } from '../types'

interface QuizPanelProps {
  state: QuizState
  onStart: () => void
  onNext: () => void
}

export function QuizPanel({ state, onStart, onNext }: QuizPanelProps) {
  const { target, score, total, streak, feedback, correctName, finished } = state
  const notStarted = !target

  if (notStarted) {
    return (
      <div className="panel panel--empty">
        <div className="panel-icon" aria-hidden="true">📍</div>
        <h2>认位置测验</h2>
        <p>系统随机出题，在地图上点击对应省份。每轮 {QUIZ_ROUND_SIZE} 题。</p>
        <button type="button" className="btn btn--primary" onClick={onStart}>
          开始练习
        </button>
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((score / QUIZ_ROUND_SIZE) * 100)
    return (
      <div className="panel">
        <p className="panel-label">本轮结束</p>
        <h2 className="panel-title">得分 {score} / {QUIZ_ROUND_SIZE}</h2>
        <p className="score-summary">
          正确率 <strong>{pct}%</strong>
          {pct >= 80 ? '，掌握不错！' : '，继续加油！'}
        </p>
        <button type="button" className="btn btn--primary" onClick={onStart}>
          再来一轮
        </button>
      </div>
    )
  }

  return (
    <div className="panel">
      <div className="quiz-header">
        <span className="quiz-progress">第 {total + (feedback === 'idle' ? 1 : 0)} / {QUIZ_ROUND_SIZE} 题</span>
        <span className="quiz-score">得分 {score}</span>
      </div>

      {feedback === 'idle' && target && (
        <>
          <p className="panel-label">请点击</p>
          <h2 className="panel-title panel-title--quiz">{target.name}</h2>
          {streak >= 3 && <p className="streak-badge">连对 {streak} 题 🔥</p>}
        </>
      )}

      {feedback === 'correct' && (
        <div className="feedback feedback--correct">
          <p className="feedback-title">回答正确！</p>
          <p>{target?.name}</p>
          <button type="button" className="btn btn--primary" onClick={onNext}>
            下一题
          </button>
        </div>
      )}

      {feedback === 'wrong' && (
        <div className="feedback feedback--wrong">
          <p className="feedback-title">答错了</p>
          <p>
            正确答案：<strong>{correctName}</strong>
          </p>
          <p className="feedback-hint">已在地图上用绿色标出</p>
          <button type="button" className="btn btn--primary" onClick={onNext}>
            下一题
          </button>
        </div>
      )}
    </div>
  )
}
