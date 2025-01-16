import { defineStore } from 'pinia'
import { achievements } from '@/data/achievements'
import type { Achievement } from '@/types'
import { ref } from 'vue'

export const useAchievementStore = defineStore('achievements', {
  state: () => ({
    achievements: achievements,
    stats: {
      totalComplaints: 0,
      totalUpgrades: 0,
    },
    notifications: [] as Achievement[],
  }),

  getters: {
    getEarnedBonuses(): { type: string; amount: number }[] {
      return this.achievements.filter(a => a.earned).map(a => a.bonus)
    },

    getTotalMultiplierBonus(): number {
      return this.getEarnedBonuses.filter(b => b.type === 'multiplier').reduce((acc, b) => acc + b.amount, 0)
    },

    getTotalAutoTypingBonus(): number {
      return this.getEarnedBonuses.filter(b => b.type === 'auto_typing').reduce((acc, b) => acc + b.amount, 0)
    },

    getTotalWordAssistSpeedBonus(): number {
      return this.getEarnedBonuses.filter(b => b.type === 'word_assist_speed').reduce((acc, b) => acc + b.amount, 0)
    },
  },

  actions: {
    checkAchievements(store: any) {
      this.achievements.forEach(achievement => {
        if (achievement.earned) return

        switch (achievement.id) {
          case 'complaints_10':
          case 'complaints_100':
          case 'complaints_1000':
            achievement.progress = this.stats.totalComplaints || 0
            if (this.stats.totalComplaints >= achievement.requirement) {
              this.unlockAchievement(achievement.id)
            }
            break

          case 'score_1000':
          case 'score_10000':
          case 'score_100000':
            achievement.progress = store.highestScore?.toNumber() || 0
            if (store.highestScore.gte(achievement.requirement)) {
              this.unlockAchievement(achievement.id)
            }
            break

          case 'upgrades_5':
          case 'upgrades_20':
          case 'upgrades_50':
            achievement.progress = this.stats.totalUpgrades || 0
            if (this.stats.totalUpgrades >= achievement.requirement) {
              this.unlockAchievement(achievement.id)
            }
            break

          case 'auto_typing_5':
            const autoSpeed = store.upgradeStore?.getAutoTypingSpeed?.toNumber() || 0
            achievement.progress = autoSpeed
            if (autoSpeed >= achievement.requirement) {
              this.unlockAchievement(achievement.id)
            }
            break

          case 'word_assist_1':
            const cooldown = store.upgradeStore?.getWordAssistCooldown?.toNumber() || 3
            achievement.progress = 3 - cooldown // Convert cooldown to progress (3 - current)
            if (cooldown <= achievement.requirement) {
              this.unlockAchievement(achievement.id)
            }
            break
        }
      })
    },

    unlockAchievement(id: string) {
      const achievement = this.achievements.find(a => a.id === id)
      if (achievement && !achievement.earned) {
        achievement.earned = true
        this.notifications.push(achievement)

        // Remove notification after 5 seconds
        setTimeout(() => {
          this.notifications = this.notifications.filter(n => n.id !== achievement.id)
        }, 5000)
      }
    },

    incrementStat(stat: keyof typeof this.stats) {
      this.stats[stat]++
    },

    initializeFromSave(savedData: any) {
      this.achievements = this.achievements.map(achievement => {
        const savedAchievement = savedData.achievements.find((a: Achievement) => a.id === achievement.id)
        return {
          ...achievement,
          earned: savedAchievement?.earned || false,
          progress: savedAchievement?.progress || 0,
        }
      })
      this.stats = savedData.stats || { totalComplaints: 0, totalUpgrades: 0 }
    },

    getSaveState() {
      return {
        achievements: this.achievements,
        stats: this.stats,
      }
    },
  },
})
