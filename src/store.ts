import { defineStore } from 'pinia'
import Decimal from 'break_infinity.js'
import type { GameState } from '@/types'

export const useStore = defineStore('main', {
  state: (): GameState => ({
    isInitialized: false,
    darkMode: false,
    score: new Decimal(0),
    currentComplaint: '',
    typedText: '',
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

    addScore(points: number) {
      this.score = this.score.plus(points)
    },
  },

  getters: {
    isReady: state => state.isInitialized,
  },
})
