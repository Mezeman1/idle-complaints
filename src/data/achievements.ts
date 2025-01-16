import type { Achievement } from '@/types'

export const achievements: Achievement[] = [
  // Complaint Milestones
  {
    id: 'complaints_10',
    name: 'Novice Complainer',
    description: 'Submit 10 complaints',
    requirement: 10,
    bonus: { type: 'multiplier', amount: 0.1 },
    icon: '😤',
    earned: false,
    progress: 0,
  },
  {
    id: 'complaints_100',
    name: 'Professional Whiner',
    description: 'Submit 100 complaints',
    requirement: 100,
    bonus: { type: 'multiplier', amount: 0.2 },
    icon: '😠',
    earned: false,
    progress: 0,
  },
  {
    id: 'complaints_1000',
    name: 'Legendary Karen',
    description: 'Submit 1,000 complaints',
    requirement: 1000,
    bonus: { type: 'multiplier', amount: 0.5 },
    icon: '👑',
    earned: false,
    progress: 0,
  },

  // Score Milestones
  {
    id: 'score_1000',
    name: 'Minor Annoyance',
    description: 'Reach 1,000 total points',
    requirement: 1000,
    bonus: { type: 'auto_typing', amount: 0.1 },
    icon: '📈',
    earned: false,
    progress: 0,
  },
  {
    id: 'score_10000',
    name: 'Major Disruption',
    description: 'Reach 10,000 total points',
    requirement: 10000,
    bonus: { type: 'auto_typing', amount: 0.2 },
    icon: '🚀',
    earned: false,
    progress: 0,
  },
  {
    id: 'score_100000',
    name: 'Viral Sensation',
    description: 'Reach 100,000 total points',
    requirement: 100000,
    bonus: { type: 'auto_typing', amount: 0.5 },
    icon: '🌟',
    earned: false,
    progress: 0,
  },

  // Upgrade Milestones
  {
    id: 'upgrades_5',
    name: 'Upgrade Enthusiast',
    description: 'Purchase 5 total upgrades',
    requirement: 5,
    bonus: { type: 'word_assist_speed', amount: 0.1 },
    icon: '⚡',
    earned: false,
    progress: 0,
  },
  {
    id: 'upgrades_20',
    name: 'Upgrade Addict',
    description: 'Purchase 20 total upgrades',
    requirement: 20,
    bonus: { type: 'word_assist_speed', amount: 0.2 },
    icon: '💪',
    earned: false,
    progress: 0,
  },
  {
    id: 'upgrades_50',
    name: 'Upgrade Master',
    description: 'Purchase 50 total upgrades',
    requirement: 50,
    bonus: { type: 'word_assist_speed', amount: 0.5 },
    icon: '🏆',
    earned: false,
    progress: 0,
  },

  // Speed Milestones
  {
    id: 'auto_typing_5',
    name: 'Speed Demon',
    description: 'Reach 5 characters per second auto-typing',
    requirement: 5,
    bonus: { type: 'multiplier', amount: 0.3 },
    icon: '⚡',
    earned: false,
    progress: 0,
  },
  {
    id: 'word_assist_1',
    name: 'Quick Draw',
    description: 'Reduce word assist cooldown to 1 second',
    requirement: 1,
    bonus: { type: 'auto_typing', amount: 0.3 },
    icon: '⚔️',
    earned: false,
    progress: 0,
  },
  // Speed & Accuracy Achievements
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Typed 5 consecutive complaints in under 10 seconds each. Your keyboard is smoking!',
    requirement: 5,
    bonus: { type: 'multiplier', amount: 0.5 },
    icon: '⚡',
    earned: false,
    progress: 0,
  },
  {
    id: 'perfect_karen',
    name: 'Perfect Karen',
    description: 'Submitted 10 complaints in a row with 100% accuracy. The manager is trembling.',
    requirement: 10,
    bonus: { type: 'multiplier', amount: 0.8 },
    icon: '👑',
    earned: false,
    progress: 0,
  },
  {
    id: 'marathon_complainer',
    name: 'Marathon Complainer',
    description: 'Typed 5,000 characters total. Your fingers deserve a vacation.',
    requirement: 5000,
    bonus: { type: 'auto_typing', amount: 1 },
    icon: '🏃',
    earned: false,
    progress: 0,
  },
  // Creative Achievements
  {
    id: 'night_shift',
    name: 'Night Shift Karen',
    description: 'Submitted complaints between 10 PM and 5 AM. The early bird gets the manager!',
    requirement: 1,
    bonus: { type: 'multiplier', amount: 0.3 },
    icon: '🌙',
    earned: false,
    progress: 0,
  },
  {
    id: 'rapid_fire',
    name: 'Rapid Fire Complaints',
    description: 'Submitted 3 complaints within 30 seconds. Take a breath!',
    requirement: 3,
    bonus: { type: 'word_assist_speed', amount: 0.2 },
    icon: '🔥',
    earned: false,
    progress: 0,
  },
  {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Complained for 10 minutes straight on a weekend. No days off!',
    requirement: 600, // seconds
    bonus: { type: 'multiplier', amount: 0.4 },
    icon: '📅',
    earned: false,
    progress: 0,
  },
  {
    id: 'combo_master',
    name: 'Combo Master',
    description: 'Maintained 2.5x speed bonus for 5 complaints in a row. Fast AND furious!',
    requirement: 5,
    bonus: { type: 'multiplier', amount: 0.6 },
    icon: '⚔️',
    earned: false,
    progress: 0,
  },
]
