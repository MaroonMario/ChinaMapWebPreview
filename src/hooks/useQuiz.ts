import { useCallback, useState } from 'react'
import { pickRandomProvince, QUIZ_ROUND_SIZE } from '../data/provinces'
import type { ProvinceInfo, QuizState } from '../types'

const initialState: QuizState = {
  target: null,
  score: 0,
  total: 0,
  streak: 0,
  feedback: 'idle',
  correctName: null,
  finished: false,
}

export function useQuiz() {
  const [state, setState] = useState<QuizState>(initialState)

  const startQuiz = useCallback(() => {
    const target = pickRandomProvince()
    setState({
      target,
      score: 0,
      total: 0,
      streak: 0,
      feedback: 'idle',
      correctName: null,
      finished: false,
    })
  }, [])

  const answer = useCallback((clickedName: string) => {
    setState((prev) => {
      if (!prev.target || prev.feedback !== 'idle' || prev.finished) return prev

      const isCorrect = clickedName === prev.target.name
      const nextTotal = prev.total + 1
      const nextScore = isCorrect ? prev.score + 1 : prev.score
      const nextStreak = isCorrect ? prev.streak + 1 : 0
      const roundDone = nextTotal >= QUIZ_ROUND_SIZE

      return {
        ...prev,
        score: nextScore,
        total: nextTotal,
        streak: nextStreak,
        feedback: isCorrect ? 'correct' : 'wrong',
        correctName: isCorrect ? null : prev.target.name,
        finished: roundDone,
      }
    })
  }, [])

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      if (prev.finished) return prev
      const target = pickRandomProvince(prev.target?.name)
      return {
        ...prev,
        target,
        feedback: 'idle',
        correctName: null,
      }
    })
  }, [])

  return { state, startQuiz, answer, nextQuestion }
}

export type { ProvinceInfo }
