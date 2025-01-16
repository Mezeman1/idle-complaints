import { defineStore } from 'pinia'
import { achievements } from '@/data/achievements'
import type { Achievement } from '@/types'
import { ref } from 'vue'

export const useAchievementStore = defineStore('achievements', {
  state: () => ({
    achievements,
    stats: {
      totalComplaints: 0,
      totalUpgrades: 0,
      totalCharacters: 0,
      perfectComplaints: 0,
      fastComplaints: 0,
      highSpeedComplaints: 0,
      lastComplaintTime: 0,
      lastAccuracy: 0,
      lastSpeedMultiplier: 0,
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

          case 'speed_demon':
            if (Date.now() - this.stats.lastComplaintTime < 10000) {
              this.stats.fastComplaints++
            } else {
              this.stats.fastComplaints = 0
            }
            achievement.progress = this.stats.fastComplaints
            if (this.stats.fastComplaints >= achievement.requirement) {
              this.unlockAchievement(achievement.id)
            }
            break

          case 'perfect_karen':
            if (this.stats.lastAccuracy === 100) {
              this.stats.perfectComplaints++
            } else {
              this.stats.perfectComplaints = 0
            }
            achievement.progress = this.stats.perfectComplaints
            if (this.stats.perfectComplaints >= achievement.requirement) {
              this.unlockAchievement(achievement.id)
            }
            break

          case 'marathon_complainer':
            achievement.progress = this.stats.totalCharacters
            if (this.stats.totalCharacters >= achievement.requirement) {
              this.unlockAchievement(achievement.id)
            }
            break

          case 'night_shift':
            const hour = new Date().getHours()
            if (hour >= 22 || hour < 5) {
              this.unlockAchievement(achievement.id)
            }
            break

          case 'rapid_fire':
            if (Date.now() - this.stats.lastComplaintTime < 30000) {
              achievement.progress++
            } else {
              achievement.progress = 0
            }
            if (achievement.progress >= achievement.requirement) {
              this.unlockAchievement(achievement.id)
            }
            break

          case 'combo_master':
            if (this.stats.lastSpeedMultiplier >= 2.5) {
              this.stats.highSpeedComplaints++
            } else {
              this.stats.highSpeedComplaints = 0
            }
            achievement.progress = this.stats.highSpeedComplaints
            if (this.stats.highSpeedComplaints >= achievement.requirement) {
              this.unlockAchievement(achievement.id)
            }
            break
        }
      })
      this.stats.lastComplaintTime = Date.now()
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
      this.stats = {
        totalComplaints: savedData.stats?.totalComplaints || 0,
        totalUpgrades: savedData.stats?.totalUpgrades || 0,
        totalCharacters: savedData.stats?.totalCharacters || 0,
        perfectComplaints: savedData.stats?.perfectComplaints || 0,
        fastComplaints: savedData.stats?.fastComplaints || 0,
        highSpeedComplaints: savedData.stats?.highSpeedComplaints || 0,
        lastComplaintTime: savedData.stats?.lastComplaintTime || 0,
        lastAccuracy: savedData.stats?.lastAccuracy || 0,
        lastSpeedMultiplier: savedData.stats?.lastSpeedMultiplier || 0,
      }
    },

    getSaveState() {
      return {
        achievements: this.achievements,
        stats: this.stats,
      }
    },

    addCharacters(count: number) {
      this.stats.totalCharacters += count
    },
  },
})
