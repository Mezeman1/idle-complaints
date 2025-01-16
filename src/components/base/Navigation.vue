<template>
  <Navbar>
    <template #left>
      <router-link to="/" class="flex items-center px-3 py-2 rounded-md text-sm font-medium
        text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white
        hover:bg-gray-100 dark:hover:bg-gray-700">
        Game
      </router-link>
      <router-link to="/achievements" class="flex items-center px-3 py-2 rounded-md text-sm font-medium
        text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white
        hover:bg-gray-100 dark:hover:bg-gray-700">
        Achievements
      </router-link>
    </template>
  </Navbar>
</template>

<script setup lang="ts">
import Navbar from '@/components/base/Navbar.vue'
</script>
