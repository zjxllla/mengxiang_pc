<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LoadingScreen from './components/LoadingScreen.vue'

// 获取LoadingScreen组件实例
const loadingScreen = ref<InstanceType<typeof LoadingScreen> | null>(null)
const router = useRouter()

// 设置路由切换时的加载动画
onMounted(() => {
  // 全局前置守卫 - 路由开始切换时显示加载动画
  router.beforeEach((to, from, next) => {
    // 如果是首次加载或路由确实发生了变化
    if (from.path !== to.path) {
      loadingScreen.value?.showLoading()
    }
    next()
  })

  // 全局后置钩子 - 路由切换完成后隐藏加载动画
  router.afterEach(() => {
    // 延迟一段时间再隐藏加载动画，确保新页面已加载
    setTimeout(() => {
      loadingScreen.value?.hideLoading()
    }, 500) // 可以根据需要调整延迟时间
  })
})
</script>

<template>
  <div class="app-container">
    <!-- 加载动画组件 -->
    <LoadingScreen ref="loadingScreen" />

    <!-- 路由视图 -->
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
  background-color: #44475c;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>
