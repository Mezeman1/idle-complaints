<script setup lang="ts">
import { formatNumber } from '@/utils/formatters'
import Decimal from 'break_infinity.js'

const props = defineProps<{
    points: Decimal
    multiplier: Decimal
}>()
</script>

<template>
    <div class="animate-fadeup pointer-events-none">
        <div class="text-green-500 font-bold text-lg">
            +{{ formatNumber(points) }}
            <span v-if="multiplier.gt(1)" class="text-blue-500 text-sm">
                (×{{ formatNumber(multiplier) }})
            </span>
        </div>
    </div>
</template>

<style scoped>
.animate-fadeup {
    animation: fadeup 1s ease-out forwards;
}

@keyframes fadeup {
    0% {
        opacity: 1;
        transform: translateY(0);
    }

    100% {
        opacity: 0;
        transform: translateY(-30px);
    }
}
</style>
