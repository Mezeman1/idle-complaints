import { complaints } from '@/data/complaints'
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface DialogueScenario {
  id: number
  complaintId: number // Match complaint IDs from complaints.ts
  npcName: string
  lines: string[]
}

interface DialogueState {
  currentDialogue: DialogueScenario | null
  scenarios: DialogueScenario[]
}

export const useDialogueStore = defineStore('dialogue', {
  state: (): DialogueState => ({
    currentDialogue: null,
    scenarios: [
      {
        id: 1,
        complaintId: 48, // "The coffee cup says 'World's Best Typist,' but it keeps spilling all over my keyboard. False advertising!"
        npcName: 'Office Bot',
        lines: [
          'Have you considered that maybe the cup is testing your typing skills?',
          'A true "World\'s Best Typist" can type through any coffee spill!',
          'Try our new "Keyboard-Proof Coffee Cup"... only $19.99!',
        ],
      },
      {
        id: 2,
        complaintId: 49, // "Our mandatory 'Wellness Session' was a silent meditation. How am I supposed to complain in silence?"
        npcName: 'Wellness Wendy',
        lines: [
          'The silence helps you internalize your complaints!',
          'Try our new "Mindful Complaining" workshop next week.',
          'Remember: Om... My... God... This... Is... Ridiculous...',
        ],
      },
      {
        id: 3,
        complaintId: 51, // "Who decided that typing an entire paragraph equals one measly point? This system is rigged!"
        npcName: 'Points Pete',
        lines: [
          'Our point system is perfectly balanced!',
          'Have you tried complaining about the point system for extra points?',
          'Wait until you hear about our new point-reduction feature!',
        ],
      },
      {
        id: 4,
        complaintId: 53, // "I got warned by HR for being 'too negative.' Isn't that the entire point of this game?!"
        npcName: 'HR Helen',
        lines: [
          'We need to maintain a positive complaining environment.',
          'Please file your negativity complaints more positively.',
          'Would you like to attend our "Constructive Complaining" seminar?',
        ],
      },
      {
        id: 5,
        complaintId: 59, // "I typed so much my keyboard asked for a raise. Now I'm complaining about sentient peripherals."
        npcName: 'Tech Support Tim',
        lines: [
          'Have you tried negotiating with your keyboard?',
          'Our peripherals union requires fair treatment of all input devices.',
          'Maybe switch to voice commands? Oh wait, the microphone is on strike...',
        ],
      },
      {
        id: 6,
        complaintId: 66, // "I tried calling tech support about my slow typing. They told me to take a typing course. Rude!"
        npcName: 'Training Terry',
        lines: [
          'Our "Speed Complaining 101" course is now available!',
          'Learn to type faster complaints in just 6 easy payments.',
          'Bonus module: Advanced Keyboard Warrior Techniques!',
        ],
      },
      {
        id: 7,
        complaintId: 73, // "My coffee's too hot, my code's too cold, and my boss is lukewarm. Complaints are my comfort zone."
        npcName: 'Temperature Tom',
        lines: [
          'Sounds like a classic case of Goldilocks Syndrome!',
          'Have you tried microwaving your boss?',
          'Our new thermal complaint system is coming soon™',
        ],
      },
      {
        id: 8,
        complaintId: 76, // "Why is there no 'sarcastic retort' upgrade? I need that to refine my complaining skills."
        npcName: 'Upgrade Ursula',
        lines: [
          'Oh sure, because we TOTALLY need more sarcasm around here.',
          'Would you like to purchase our Sarcasm DLC?',
          '*rolls eyes in premium feature*',
        ],
      },
      {
        id: 9,
        complaintId: 79, // "I tried to unionize all the complainers for better rant conditions. Management complained about that."
        npcName: 'Manager Mike',
        lines: [
          'A complainers union? How... constructive.',
          'Please file your union complaints individually.',
          'We\'re implementing a new "right to complain" state policy.',
        ],
      },
      {
        id: 10,
        complaintId: 47, // "I just realized I'm complaining about complaining while complaining. Somebody call a philosopher!"
        npcName: 'Professor Phil',
        lines: [
          'Ah, the paradox of meta-complaints!',
          'But what is the sound of one complaint complaining?',
          'We should schedule a symposium on complaint theory.',
        ],
      },
      {
        id: 21,
        complaintId: 81, // "So, there's a 'Buy Me a Coffee' link now? I'm complaining I still have to pay for my own coffee."
        npcName: 'Barista Bot',
        lines: [
          'Would you like to file a complaint about our complaint-powered coffee machine?',
          'Each whine gets you closer to a free virtual coffee!',
          'Terms and conditions apply. Void where prohibited by positive attitudes.',
        ],
      },
      {
        id: 22,
        complaintId: 82, // "Why buy you a coffee when I need coffee to power my complaining spree? Share the caffeine, please!"
        npcName: 'Caffeine Carl',
        lines: [
          'Our studies show complaining is 73% more effective with coffee!',
          'Have you tried our new "Perpetual Complaint" coffee blend?',
          'Side effects may include excessive typing and spontaneous ranting.',
        ],
      },
      {
        id: 23,
        complaintId: 83, // "I clicked 'Buy Me a Coffee,' but all I got was more reasons to whine about empty wallets."
        npcName: 'Finance Fred',
        lines: [
          'Have you considered our coffee-complaint exchange program?',
          'Current rate: 1 coffee = 1000 premium complaints!',
          'Warning: Premium complaints may contain traces of gratitude.',
        ],
      },
      {
        id: 24,
        complaintId: 84, // "We have a coffee tip jar? Great, I'm now complaining that it won't buy me a 'complaint-proof' keyboard instead."
        npcName: 'Tech Support Tim',
        lines: [
          'Our complaint-proof keyboards are coffee-resistant!',
          'But they tend to complain about the coffee quality...',
          'Maybe stick to water-cooled keyboards?',
        ],
      },
      {
        id: 25,
        complaintId: 85, // "I'll buy you a coffee if you promise to complain about how overpriced coffee is in the first place."
        npcName: 'Economy Emma',
        lines: [
          'Ah yes, our premium complaint-infused coffee!',
          'Each bean is carefully selected by professional complainers.',
          "The price? That's another topic for our complaint department.",
        ],
      },
    ],
  }),

  actions: {
    triggerDialogueForComplaint(text: string): void {
      const complaintId = complaints.find(c => c.text === text)?.id
      const matchingScenarios = this.scenarios.filter(s => s.complaintId === complaintId)
      if (matchingScenarios.length > 0) {
        const randomIndex = Math.floor(Math.random() * matchingScenarios.length)
        this.currentDialogue = matchingScenarios[randomIndex]
      }
    },

    dismissDialogue(): void {
      this.currentDialogue = null
    },
  },
})
