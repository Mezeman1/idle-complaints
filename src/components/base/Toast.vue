<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
    message: string
}>()

const isVisible = ref(false)

onMounted(() => {
    isVisible.value = true
})
</script>

<template>
    <div class="fixed bottom-4 right-4 z-50">
        <div class="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300"
            :class="{ 'translate-y-0 opacity-100': isVisible, 'translate-y-4 opacity-0': !isVisible }">
            <div class="flex items-center space-x-2">
                <span class="text-lg">🚫</span>
                <span>{{ message }}</span>
            </div>
        </div>
    </div>
</template>
