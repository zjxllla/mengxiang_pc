<script setup lang="ts">
import { ref } from 'vue'

// 加载动画状态，默认不显示
const loading = ref(true)

// 定义方法用于控制加载动画的显示和隐藏
const showLoading = () => {
  loading.value = true
}

const hideLoading = () => {
  loading.value = false
}

// 暴露方法给父组件使用
defineExpose({
  showLoading,
  hideLoading
})
</script>

<template>
  <Transition name="fade">
    <div v-if="loading" class="loading-screen">
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <div class="loading-text">梦翔工作室</div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #232323;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 5px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 1s ease-in-out infinite;
}

.loading-text {
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 2px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.6;
  }
}

/* 淡入淡出过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
