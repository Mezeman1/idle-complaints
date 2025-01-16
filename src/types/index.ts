import Decimal from 'break_infinity.js'

export interface GameState {
  isInitialized: boolean
  darkMode: boolean
  score: Decimal
  currentComplaint: string
  typedText: string
}

export interface Complaint {
  id: number
  text: string
}
