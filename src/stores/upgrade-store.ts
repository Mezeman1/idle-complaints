import { defineStore } from 'pinia'
import { useStore } from '@/store'
import type { Upgrade } from '@/types'
import Decimal from 'break_infinity.js'
import { useAchievementStore } from '@/stores/achievement-store'

export const useUpgradeStore = defineStore('upgrades', {
  state: () => ({
    upgrades: {
      auto_type_1: {
        id: 'auto_type_1',
        name: 'Grumbling Ghost Writer',
        description: "Hires a disgruntled spirit to type {effect} characters per second. They're not happy about it.",
        baseCost: new Decimal(100),
        level: 0,
        effect: new Decimal(0.5),
        unlockCost: new Decimal(50),
        type: 'automation',
      },
      score_multi_1: {
        id: 'score_multi_1',
        name: 'Karen Energy Infusion',
        description: 'Channels the power of asking for the manager. {effect}x points per complaint!',
        baseCost: new Decimal(200),
        level: 0,
        effect: new Decimal(1.5),
        unlockCost: new Decimal(100),
        type: 'multiplier',
        requires: 'auto_type_1',
      },
      word_assist: {
        id: 'word_assist',
        name: 'Ctrl+Whine',
        description:
          'Adds a magical shortcut button. Because typing full complaints is just another thing to complain about.',
        baseCost: new Decimal(150),
        level: 0,
        maxLevel: 1,
        effect: new Decimal(3),
        unlockCost: new Decimal(75),
        type: 'assist',
      },
      word_assist_speed: {
        id: 'word_assist_speed',
        name: 'Rage Typing Boost',
        description: 'Reduces cooldown by {effect}s. The angrier you are, the faster you type!',
        baseCost: new Decimal(200),
        level: 0,
        effect: new Decimal(0.5),
        unlockCost: new Decimal(200),
        type: 'assist',
        requires: 'word_assist',
        maxLevel: 6,
      },
      auto_type_2: {
        id: 'auto_type_2',
        name: 'Complaint Bot 3000',
        description:
          'Deploys an AI trained on millions of "I want to speak to the manager" posts. Types {effect} characters per second.',
        baseCost: new Decimal(500),
        level: 0,
        effect: new Decimal(1),
        unlockCost: new Decimal(300),
        type: 'automation',
        requires: 'score_multi_1',
      },
      score_multi_2: {
        id: 'score_multi_2',
        name: 'Social Media Outrage',
        description: 'Your complaints go viral! {effect}x points as the internet joins your crusade.',
        baseCost: new Decimal(1000),
        level: 0,
        effect: new Decimal(2),
        unlockCost: new Decimal(600),
        type: 'multiplier',
        requires: 'auto_type_2',
      },
      auto_type_3: {
        id: 'auto_type_3',
        name: 'Complaint Assembly Line',
        description: 'Sets up a factory of professional complainers. Types {effect} characters per second.',
        baseCost: new Decimal(2500),
        level: 0,
        effect: new Decimal(2),
        unlockCost: new Decimal(1500),
        type: 'automation',
        requires: 'score_multi_2',
      },
      auto_type_4: {
        id: 'auto_type_4',
        name: 'Neural Network of Negativity',
        description: 'Harnesses the power of AI to generate complaints at {effect} characters per second.',
        baseCost: new Decimal(10000),
        level: 0,
        effect: new Decimal(5),
        unlockCost: new Decimal(5000),
        type: 'automation',
        requires: 'auto_type_3',
      },
      auto_type_5: {
        id: 'auto_type_5',
        name: 'Quantum Complaint Computer',
        description: 'Types complaints in multiple universes simultaneously at {effect} characters per second.',
        baseCost: new Decimal(50000),
        level: 0,
        effect: new Decimal(10),
        unlockCost: new Decimal(25000),
        type: 'automation',
        requires: 'auto_type_4',
      },
    } as Record<string, Upgrade>,
  }),

  getters: {
    getVisibleUpgrades(): Upgrade[] {
      const mainStore = useStore()
      const score = mainStore.highestScore

      return Object.values(this.upgrades).filter((upgrade: Upgrade) => {
        // If upgrade requires another upgrade
        if (upgrade.requires) {
          const requiredUpgrade = this.upgrades[upgrade.requires]
          if (requiredUpgrade.level === 0) {
            return false
          }
        }

        // Show if player has reached half the unlock cost ever
        return score.gte(upgrade.unlockCost.div(2))
      }) as Upgrade[]
    },

    canPurchaseUpgrade(): (upgradeId: string) => boolean {
      return (upgradeId: string) => {
        const mainStore = useStore()
        return mainStore.score.gte(this.getUpgradeCost(upgradeId))
      }
    },

    getUpgradeCost(): (upgradeId: string) => Decimal {
      return (upgradeId: string) => {
        const upgrade = this.upgrades[upgradeId]
        return upgrade.baseCost.times(new Decimal(2).pow(upgrade.level + upgrade.level * upgrade.level * 0.1))
      }
    },

    getTotalMultiplier(): Decimal {
      const multiplierUpgrades = Object.values(this.upgrades).filter(
        (upgrade: Upgrade): upgrade is Upgrade => upgrade.type === 'multiplier' && upgrade.level > 0
      )

      const baseMultiplier = new Decimal(1).plus(
        multiplierUpgrades.reduce((acc, upgrade) => acc.plus(upgrade.effect.times(upgrade.level)), new Decimal(0))
      )

      const achievementStore = useAchievementStore()
      const achievementBonus = new Decimal(achievementStore.getTotalMultiplierBonus)
      return baseMultiplier.plus(achievementBonus)
    },

    getAutoTypingSpeed(): Decimal {
      const automationUpgrades = Object.values(this.upgrades).filter(
        (upgrade: Upgrade) => upgrade.type === 'automation' && upgrade.level > 0
      ) as Upgrade[]

      const baseSpeed = automationUpgrades.reduce(
        (acc, upgrade) => acc.plus(upgrade.effect.times(upgrade.level)),
        new Decimal(0)
      )

      const achievementStore = useAchievementStore()
      const achievementBonus = new Decimal(achievementStore.getTotalAutoTypingBonus)
      return baseSpeed.plus(achievementBonus)
    },

    getWordAssistCooldown(): Decimal {
      if (this.upgrades.word_assist.level === 0) return new Decimal(0)

      const baseTime = this.upgrades.word_assist.effect
      const speedUpgrade = this.upgrades.word_assist_speed
      const reduction = speedUpgrade.effect.times(speedUpgrade.level)

      const achievementStore = useAchievementStore()
      const achievementBonus = new Decimal(achievementStore.getTotalWordAssistSpeedBonus)
      const totalReduction = reduction.plus(achievementBonus)

      // Allow reduction all the way to 0
      return Decimal.max(new Decimal(0), baseTime.minus(totalReduction))
    },
  },

  actions: {
    initializeFromSave(savedUpgrades: Record<string, Upgrade>) {
      Object.entries(savedUpgrades).forEach(([id, upgrade]) => {
        if (this.upgrades[id]) {
          this.upgrades[id] = {
            ...this.upgrades[id],
            level: upgrade.level,
          }
        }
      })
    },

    purchaseUpgrade(upgradeId: string) {
      const mainStore = useStore()
      const upgrade = this.upgrades[upgradeId]
      const cost = this.getUpgradeCost(upgradeId)

      // Check if upgrade has reached its max level
      if (upgrade.maxLevel && upgrade.level >= upgrade.maxLevel) {
        return
      }

      // Special check for word_assist_speed to prevent going below 0 cooldown
      if (upgradeId === 'word_assist_speed') {
        const currentCooldown = this.getWordAssistCooldown
        const reductionAmount = upgrade.effect
        if (currentCooldown.minus(reductionAmount).lt(0)) {
          return
        }
      }

      if (mainStore.score.gte(cost)) {
        mainStore.score = mainStore.score.minus(cost)
        this.upgrades[upgradeId] = {
          ...upgrade,
          level: upgrade.level + 1,
        }
        const achievementStore = useAchievementStore()
        achievementStore.incrementStat('totalUpgrades')
        achievementStore.checkAchievements(mainStore)
        mainStore.saveGame()
      }
    },

    getUpgradeState() {
      return Object.fromEntries(
        Object.entries(this.upgrades).map(([id, upgrade]) => [
          id,
          {
            ...upgrade,
            level: upgrade.level,
          },
        ])
      )
    },
  },
})
