<script setup lang="ts">
import { ref } from 'vue'
import LoadingScreen from './components/LoadingScreen.vue'

// 控制加载屏幕的显示
const showLoading = ref(true)

// 当资源加载完成时触发
const handleLoaded = () => {
  showLoading.value = false
}
</script>

<template>
  <div class="app-container">
    <!-- 加载动画组件 -->
    <LoadingScreen :show="showLoading" @loaded="handleLoaded" />
    
    <!-- 只有在加载完成后才显示主内容 -->
    <div v-show="!showLoading">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
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
