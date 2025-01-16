import { defineStore } from 'pinia'
import { complaints } from '@/data/complaints'
import type { Complaint, ComplaintCollection } from '@/types'

export const useCollectionStore = defineStore('collection', {
  state: () => ({
    collectedComplaints: {} as Record<number, ComplaintCollection>,
  }),

  getters: {
    totalCollected(): number {
      return Object.keys(this.collectedComplaints).length
    },

    totalPossible(): number {
      return complaints.length
    },

    collectionProgress(): number {
      return (this.totalCollected / this.totalPossible) * 100
    },

    getComplaintStats(): (id: number) => ComplaintCollection | undefined {
      return (id: number) => this.collectedComplaints[id]
    },
  },

  actions: {
    collectComplaint(complaint: Complaint, accuracy: number, speed: number) {
      const stars = this.calculateStars(accuracy, speed)

      this.collectedComplaints[complaint.id] = {
        ...complaint,
        stars,
        bestAccuracy: Math.max(accuracy, this.collectedComplaints[complaint.id]?.bestAccuracy || 0),
        bestSpeed: Math.max(speed, this.collectedComplaints[complaint.id]?.bestSpeed || 0),
        timesTyped: (this.collectedComplaints[complaint.id]?.timesTyped || 0) + 1,
        lastTyped: Date.now(),
      }
    },

    calculateStars(accuracy: number, speed: number): number {
      // 0-3 stars based on performance
      let stars = 0
      if (accuracy >= 95) stars++
      if (speed >= 5) stars++ // 5 chars per second
      if (accuracy >= 98 && speed >= 8) stars++ // 8 chars per second
      return stars
    },

    getSaveState() {
      return {
        collectedComplaints: this.collectedComplaints,
      }
    },

    initializeFromSave(savedState: any) {
      if (savedState?.collectedComplaints) {
        this.collectedComplaints = savedState.collectedComplaints
      }
    },
  },
})
