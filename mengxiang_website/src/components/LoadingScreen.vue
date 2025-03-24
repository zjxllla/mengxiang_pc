<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps({
  // 是否显示加载动画
  show: {
    type: Boolean,
    default: true
  }
})

// 加载动画状态
const loading = ref(true)

// 发出加载完成事件
const emit = defineEmits(['loaded'])

// 在组件挂载后，模拟资源加载
onMounted(() => {
  // 创建一个图片加载检测数组
  const imagesToLoad = [
    '../assets/bear.png',
    '../assets/bottom.png',
    '../assets/enum_computer.png',
    '../assets/enum_computer_active.png',
    '../assets/icon.png',
    '../assets/lk.jpg',
    '../assets/main_pic1.jpg',
    '../assets/main_pic2.jpg',
    '../assets/main_pic3.jpg',
    '../assets/enum_pic1.jpg'
  ]

  // 加载所有图片
  const imagePromises = imagesToLoad.map(src => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false) // 即使加载失败也继续
      img.src = new URL(src, import.meta.url).href
    })
  })

  // 当所有图片加载完成或超时后
  Promise.all(imagePromises).then(() => {
    // 添加一个小延迟，确保DOM渲染完成
    setTimeout(() => {
      loading.value = false
      emit('loaded')
    }, 500)
  })

  // 设置最大加载时间，避免无限等待
  setTimeout(() => {
    if (loading.value) {
      loading.value = false
      emit('loaded')
    }
  }, 5000) // 最多等待5秒
})
</script>

<template>
  <Transition name="fade">
    <div v-if="props.show && loading" class="loading-screen">
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