<script setup lang="ts">
import { useRoute } from 'vue-router'
import BottomNav from '@/components/BottomNav.vue'

const route = useRoute()
</script>

<template>
  <RouterView />
  <BottomNav v-if="!route.meta.hideNav" />
</template>
