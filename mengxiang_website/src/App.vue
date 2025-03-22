<script setup lang="ts">
</script>

<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
.app-container {
  background-color: #232323;
  min-height: 100vh;
  width: 100%;
}

/* 全局过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

html,
body {
  background-color: #232323;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>
