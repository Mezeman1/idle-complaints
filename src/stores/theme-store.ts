import { defineStore } from 'pinia'

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  card: string
  border: string
}

interface Theme {
  id: string
  name: string
  description: string
  cost: number
  colors: {
    light: ThemeColors
    dark: ThemeColors
  }
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: 'default',
    unlockedThemes: ['default'] as string[],
    themes: {
      default: {
        id: 'default',
        name: 'Default Theme',
        description: 'The classic complaint department look',
        cost: 0,
        colors: {
          light: {
            primary: '#3b82f6', // blue-500
            secondary: '#1f2937', // gray-800
            accent: '#10b981', // emerald-500
            background: '#f3f4f6', // gray-100
            text: '#111827', // gray-900
            card: '#ffffff', // white
            border: '#e5e7eb', // gray-200
          },
          dark: {
            primary: '#3b82f6', // blue-500
            secondary: '#1f2937', // gray-800
            accent: '#34d399', // emerald-400
            background: '#111827', // gray-900
            text: '#f9fafb', // gray-50
            card: '#1f2937', // gray-800
            border: '#374151', // gray-700
          },
        },
      },
      rage: {
        id: 'rage',
        name: 'Rage Mode',
        description: "For when you're REALLY angry",
        cost: 10_000,
        colors: {
          light: {
            primary: '#ef4444', // red-500
            secondary: '#991b1b', // red-800
            accent: '#f59e0b', // amber-500
            background: '#fef2f2', // red-50
            text: '#7f1d1d', // red-900
            card: '#ffffff', // white
            border: '#fecaca', // red-200
          },
          dark: {
            primary: '#ef4444', // red-500
            secondary: '#991b1b', // red-800
            accent: '#fbbf24', // amber-400
            background: '#7f1d1d', // red-900
            text: '#fef2f2', // red-50
            card: '#991b1b', // red-800
            border: '#b91c1c', // red-700
          },
        },
      },
      calm: {
        id: 'calm',
        name: 'Zen Garden',
        description: 'Complain peacefully',
        cost: 100_000,
        colors: {
          light: {
            primary: '#10b981', // emerald-500
            secondary: '#065f46', // emerald-800
            accent: '#6366f1', // indigo-500
            background: '#ecfdf5', // emerald-50
            text: '#064e3b', // emerald-900
            card: '#ffffff', // white
            border: '#a7f3d0', // emerald-200
          },
          dark: {
            primary: '#10b981', // emerald-500
            secondary: '#065f46', // emerald-800
            accent: '#818cf8', // indigo-400
            background: '#064e3b', // emerald-900
            text: '#ecfdf5', // emerald-50
            card: '#065f46', // emerald-800
            border: '#047857', // emerald-700
          },
        },
      },
      neon: {
        id: 'neon',
        name: 'Neon Nights',
        description: 'Complain in cyberpunk style',
        cost: 1_000_000,
        colors: {
          light: {
            primary: '#f472b6', // pink-400
            secondary: '#7c3aed', // violet-600
            accent: '#3b82f6', // blue-500
            background: '#0f172a', // slate-900
            text: '#f1f5f9', // slate-100
            card: '#1e293b', // slate-800
            border: '#334155', // slate-700
          },
          dark: {
            primary: '#ec4899', // pink-500
            secondary: '#8b5cf6', // violet-500
            accent: '#60a5fa', // blue-400
            background: '#020617', // slate-950
            text: '#f8fafc', // slate-50
            card: '#0f172a', // slate-900
            border: '#1e293b', // slate-800
          },
        },
      },
      coffee: {
        id: 'coffee',
        name: 'Coffee Break',
        description: 'Complain over a cup of coffee',
        cost: 10_000_000,
        colors: {
          light: {
            primary: '#92400e', // amber-800
            secondary: '#78350f', // amber-900
            accent: '#d97706', // amber-600
            background: '#fffbeb', // amber-50
            text: '#451a03', // amber-950
            card: '#ffffff', // white
            border: '#fde68a', // amber-200
          },
          dark: {
            primary: '#b45309', // amber-700
            secondary: '#92400e', // amber-800
            accent: '#f59e0b', // amber-500
            background: '#451a03', // amber-950
            text: '#fef3c7', // amber-100
            card: '#78350f', // amber-900
            border: '#b45309', // amber-700
          },
        },
      },
      ocean: {
        id: 'ocean',
        name: 'Deep Ocean',
        description: 'Complain in the depths',
        cost: 100_000_000,
        colors: {
          light: {
            primary: '#0ea5e9', // sky-500
            secondary: '#0369a1', // sky-700
            accent: '#14b8a6', // teal-500
            background: '#f0f9ff', // sky-50
            text: '#0c4a6e', // sky-900
            card: '#ffffff', // white
            border: '#bae6fd', // sky-200
          },
          dark: {
            primary: '#0284c7', // sky-600
            secondary: '#0369a1', // sky-700
            accent: '#2dd4bf', // teal-400
            background: '#082f49', // sky-950
            text: '#e0f2fe', // sky-100
            card: '#075985', // sky-800
            border: '#0369a1', // sky-700
          },
        },
      },
    } as Record<string, Theme>,
  }),

  actions: {
    setTheme(themeId: string) {
      if (this.themes[themeId] && this.unlockedThemes.includes(themeId)) {
        this.currentTheme = themeId
        this.applyTheme(themeId)
      }
    },

    unlockTheme(themeId: string) {
      if (!this.unlockedThemes.includes(themeId)) {
        this.unlockedThemes.push(themeId)
      }
    },

    applyTheme(themeId: string) {
      const theme = this.themes[themeId]
      const root = document.documentElement
      const isDark = document.documentElement.classList.contains('dark')
      const colors = isDark ? theme.colors.dark : theme.colors.light

      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value)
      })
    },

    getSaveState() {
      return {
        currentTheme: this.currentTheme,
        unlockedThemes: this.unlockedThemes,
      }
    },

    initializeFromSave(savedState: any) {
      if (savedState) {
        this.currentTheme = savedState.currentTheme || 'default'
        this.unlockedThemes = savedState.unlockedThemes || ['default']
        this.applyTheme(this.currentTheme)
      }
    },
  },
})
