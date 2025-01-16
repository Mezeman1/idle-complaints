import Decimal from 'break_infinity.js'

export interface Upgrade {
  id: string
  name: string
  description: string
  baseCost: Decimal
  level: number
  maxLevel?: number
  effect: Decimal // Multiplier or automation speed
  unlockCost: Decimal // Score needed to unlock/reveal
  type: 'automation' | 'multiplier' | 'assist'
  requires?: string // ID of upgrade required to unlock this
}

export interface GameState {
  isInitialized: boolean
  darkMode: boolean
  score: Decimal
  highestScore: Decimal
  currentComplaint: string
  typedText: string
  lastAutoScoreTime: number
  upgrades: Record<string, Upgrade>
}

export interface Complaint {
  id: number
  text: string
}

export interface GameSaveData {
  score: string
  highestScore: string
  darkMode: boolean
  timestamp: number
  upgrades: Record<string, Upgrade>
}
