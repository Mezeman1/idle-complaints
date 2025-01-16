import { defineStore } from 'pinia'
import Decimal from 'break_infinity.js'
import type { GameState, GameSaveData } from '@/types'
import { useUpgradeStore } from '@/stores/upgrade-store'
import { upgradesList } from '@/data/upgrades'

function rehydrateUpgrade(upgrade: Upgrade): Upgrade {
  return {
    ...upgrade,
    baseCost: new Decimal(upgrade.baseCost),
    effect: new Decimal(upgrade.effect),
    unlockCost: new Decimal(upgrade.unlockCost),
  }
}

export const useStore = defineStore('main', {
  state: (): GameState => ({
    isInitialized: false,
    darkMode: false,
    score: new Decimal(0),
    highestScore: new Decimal(0),
    currentComplaint: '',
    typedText: '',
    upgrades: Object.fromEntries(upgradesList.map(upgrade => [upgrade.id, { ...upgrade }])),
    lastAutoScoreTime: Date.now(),
  }),

  actions: {
    initApp() {
      this.isInitialized = true
      // Load dark mode from localStorage if exists
      const savedDarkMode = localStorage.getItem('darkMode')
      this.darkMode = savedDarkMode ? JSON.parse(savedDarkMode) : false
      this.updateDarkMode()
    },

    toggleDarkMode() {
      this.darkMode = !this.darkMode
      localStorage.setItem('darkMode', JSON.stringify(this.darkMode))
      this.updateDarkMode()
    },

    updateDarkMode() {
      if (this.darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },

    setCurrentComplaint(complaint: string) {
      this.currentComplaint = complaint
      this.typedText = ''
    },

    addScore(points: number | Decimal) {
      const pointsDecimal = points instanceof Decimal ? points : new Decimal(points)
      this.score = this.score.plus(pointsDecimal)
      if (this.score.gt(this.highestScore)) {
        this.highestScore = this.score
      }
    },

    saveGame() {
      const saveData: GameSaveData = {
        score: this.score.toString(),
        highestScore: this.highestScore.toString(),
        darkMode: this.darkMode,
        timestamp: Date.now(),
        upgrades: useUpgradeStore().getUpgradeState(),
      }
      localStorage.setItem('idleComplaintsSave', JSON.stringify(saveData))
    },

    loadGame() {
      const savedState = localStorage.getItem('idleComplaintsSave')
      if (savedState) {
        const data = JSON.parse(savedState) as GameSaveData
        this.score = new Decimal(data.score)
        this.highestScore = new Decimal(data.highestScore)
        this.darkMode = data.darkMode

        // Initialize upgrades with saved state
        if (data.upgrades) {
          const upgradeStore = useUpgradeStore()
          upgradeStore.initializeFromSave(data.upgrades)
        }
      }
      this.isInitialized = true
    },

    exportSave(): string {
      const saveData: GameSaveData = {
        score: this.score.toString(),
        highestScore: this.highestScore.toString(),
        darkMode: this.darkMode,
        timestamp: Date.now(),
        upgrades: useUpgradeStore().getUpgradeState(),
      }
      return btoa(JSON.stringify(saveData))
    },

    importSave(saveString: string) {
      try {
        const saveData: GameSaveData = JSON.parse(atob(saveString))
        this.score = new Decimal(saveData.score)
        this.highestScore = new Decimal(saveData.highestScore || saveData.score)
        this.darkMode = saveData.darkMode
        this.updateDarkMode()
        if (saveData.upgrades) {
          const upgradeStore = useUpgradeStore()
          upgradeStore.initializeFromSave(saveData.upgrades)
        }
        this.saveGame()
      } catch (error) {
        console.error('Failed to import save:', error)
        throw new Error('Invalid save data')
      }
    },

    resetGame() {
      // Clear all saved data
      localStorage.removeItem('idleComplaintsSave')
      localStorage.removeItem('darkMode')

      // Reload the page to reset all stores to initial state
      window.location.reload()
    },

    processAutoScore() {
      const now = Date.now()
      const upgradeStore = useUpgradeStore()
      const typingSpeed = upgradeStore.getAutoTypingSpeed
      const avgComplaintLength = 50
      const basePoints = new Decimal(avgComplaintLength)
      const multiplier = upgradeStore.getTotalMultiplier
      const scorePerSecond = basePoints.times(multiplier).times(typingSpeed.div(avgComplaintLength))

      if (scorePerSecond.gt(0)) {
        const deltaTime = (now - this.lastAutoScoreTime) / 1000 // Convert to seconds
        const scoreToAdd = scorePerSecond.times(deltaTime)
        this.addScore(scoreToAdd)
      }

      this.lastAutoScoreTime = now
    },
  },

  getters: {
    isReady: state => state.isInitialized,
  },
})
