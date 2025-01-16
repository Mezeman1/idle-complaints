<script setup lang="ts">
import Decimal from 'break_infinity.js'
import { formatNumber } from '@/utils/formatters'

defineProps<{
    points: Decimal
    multiplier: Decimal
    speedMultiplier: number
}>()
</script>

<template>
    <div class="points-popup">
        +{{ formatNumber(points) }}
        <span v-if="!multiplier.eq(1)" class="text-blue-500 dark:text-blue-400">
            ({{ formatNumber(multiplier) }}x)
        </span>
        <span v-if="speedMultiplier > 1" class="text-yellow-500 dark:text-yellow-400">
            ({{ speedMultiplier.toFixed(1) }}x speed)
        </span>
    </div>
</template>

<style scoped>
.points-popup {
    @apply text-sm font-medium text-gray-800 dark:text-gray-200;
    animation: popup 1s ease-out forwards;
}

@keyframes popup {
    0% {
        opacity: 0;
        transform: translateY(0);
    }
    20% {
        opacity: 1;
    }
    100% {
        opacity: 0;
        transform: translateY(-40px);
    }
}
</style>
