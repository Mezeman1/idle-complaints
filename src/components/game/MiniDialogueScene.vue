<script setup lang="ts">
import { useDialogueStore } from '@/stores/dialogue-store'
import { onMounted, ref, watch } from 'vue'

const dialogueStore = useDialogueStore()
const currentLineIndex = ref(0)
const showLine = ref(true)

// Reset line index when dialogue changes
watch(() => dialogueStore.currentDialogue, (newDialogue) => {
  if (newDialogue) {
    currentLineIndex.value = 0
    startLineAnimation()
  }
}, { immediate: true })

function startLineAnimation() {
  if (!dialogueStore.currentDialogue?.lines) return

  const lineInterval = setInterval(() => {
    if (!dialogueStore.currentDialogue?.lines) {
      clearInterval(lineInterval)
      return
    }

    if (currentLineIndex.value < dialogueStore.currentDialogue.lines.length - 1) {
      currentLineIndex.value++
    } else {
      clearInterval(lineInterval)
      // Only start dismissal countdown after all lines are shown
      setTimeout(() => {
        dialogueStore.dismissDialogue()
      }, 30_000) // Keep visible for 30 seconds after last line
    }
  }, 3000) // Show each line for 3 seconds

  // Clean up interval
  return () => clearInterval(lineInterval)
}
</script>

<template>
  <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform translate-y-2 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100" leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100" leave-to-class="transform translate-y-2 opacity-0">
    <div v-if="dialogueStore.currentDialogue?.lines && showLine"
      class="fixed bottom-20 right-4 max-w-md card-theme rounded-lg shadow-lg p-4 border-2 border-theme">
      <div class="flex justify-between items-start">
        <div class="flex items-center space-x-3 mb-2">
          <div class="w-8 h-8 rounded-full bg-theme flex items-center justify-center">
            <span class="text-lg">🤖</span>
          </div>
          <span class="font-medium text-theme">{{ dialogueStore.currentDialogue.npcName }}</span>
        </div>
        <button @click="dialogueStore.dismissDialogue()" class="text-theme opacity-60 hover:opacity-100">
          ✕
        </button>
      </div>

      <div class="space-y-2">
        <p v-for="(line, index) in dialogueStore.currentDialogue.lines.slice(0, currentLineIndex + 1)" :key="index"
          class="text-theme text-sm" :class="{ 'opacity-60': index < currentLineIndex }">
          {{ line }}
        </p>
      </div>
    </div>
  </Transition>
</template>
