export type AppMode = 'explore' | 'quiz'

export interface ProvinceInfo {
  name: string
  shortName: string
  capital: string
  region: string
  adcode: number
}

export interface QuizState {
  target: ProvinceInfo | null
  score: number
  total: number
  streak: number
  feedback: 'idle' | 'correct' | 'wrong'
  correctName: string | null
  finished: boolean
}
