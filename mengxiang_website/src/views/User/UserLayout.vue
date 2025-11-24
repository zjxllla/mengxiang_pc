<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const aside_active = ref(1)

const active_index = () => {
  switch (route.path.toLowerCase()) {
    case '/user/center':
      return 1
    case '/user/tree':
      return 2
    case '/user/blog':
      return 3
    default:
      return 4
  }
}
aside_active.value = active_index()
const change_active = (index: number) => {
  aside_active.value = index
  switch (index) {
    case 1:
      router.replace('/user/center')
      break
    case 2:
      router.replace('/user/tree')
      break
    case 3:
      router.replace('/user/blog')
      break
    case 4:
      router.back()
      break
  }
}
</script>

<template>
  <div class="container">
    <div class="user-container">
      <div class="user-aside">
        <div class="aside-item" :class="{ 'aside-item-active': aside_active === 1 }" @click="change_active(1)">
          <i class="iconfont icon-haoyou" style="color: #01b9f5;"></i> 个人中心
        </div>
        <div class="aside-item" :class="{ 'aside-item-active': aside_active === 2 }" @click="change_active(2)">
          <i class="iconfont icon-shudong" style="color:#64b02e"></i> 树洞管理
        </div>
        <div class="aside-item" :class="{ 'aside-item-active': aside_active === 3 }" @click="change_active(3)">
          <i class="iconfont icon-bokeyuan" style="color:#ff5713"></i> 博客管理
        </div>
        <div class="aside-item" :class="{ 'aside-item-active': aside_active === 4 }" @click="change_active(4)">
          <i class="iconfont icon-tuichu2" style="color:#f0bd65"></i> 返回上页
        </div>
      </div>

      <div class="user-main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-container {
  display: flex;
  justify-content: space-between;
  width: 90%;
  height: 90%;
  background: #fff;
  border-radius: 20px;
  padding: 5vh 4vw;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.user-container::-webkit-scrollbar {
  display: none;
}

/* 侧边栏 */
/* #region */
.user-aside {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 20%;
  height: 100%;
  background: #f1f1f1;
  border-radius: 20px;
}

.aside-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100px;
  cursor: pointer;
  border-radius: 20px;
  transition: all 0.3s;
  color: #3d3d3d;
  font-weight: 700;
  font-size: 20px;
}

.aside-item i {
  margin-right: 10px;
}

.aside-item:hover {
  background: #d1d0d0;
}

.aside-item-active {
  background: #3d3d3d;
  color: #fff;
}

/* #endregion */
/* 主体 */
/* #region */
.user-main {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 75%;
  height: 100%;
  background: #f1f1f1;
  border-radius: 20px;
}

/* #endregion */

/* 移动端是适配 */
@media screen and (max-width: 768px) {
  .user-container {
    width: 93%;
    height: 93%;
    flex-direction: column;
    gap: 10px;
    justify-content: start;
    padding: 20px 5px;
  }

  .user-aside {
    width: 100%;
    flex-direction: row;
    height: auto;
    gap: 1.5vw;
  }

  .aside-item {
    flex: 1;
    font-size: 11px;
    min-height: 40px;
  }

  .aside-item i {
    font-size: 11px;
    margin-right: 5px;
  }

  .aside-item:hover {
    background: none;
  }

  .user-main {
    width: 100%;
    height: auto;
  }

  .aside-item:hover {
    background: #3d3d3d;
  }
}
</style>
