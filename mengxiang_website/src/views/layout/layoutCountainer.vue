<script setup lang="ts">
import { HomeFilled, UserFilled, CirclePlus, Menu, Document } from '@element-plus/icons-vue'
import { onMounted, onUnmounted, ref } from 'vue'

const is_show = ref(false)

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  console.log(scrollTop)
  if (scrollTop > 740) {
    is_show.value = true
  } else {
    is_show.value = false
  }
};
const scrollTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
// 在组件挂载时添加滚动事件监听器
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

// 在组件卸载时移除滚动事件监听器
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="common-layout">
    <el-container class="main_container">
      <!-- 头部 -->
      <el-header class="header" :class="{ 'header_fixed': is_show }">
        <el-menu active-text-color="#ffd04b" background-color="#232323" :default-active="$route.path" mode="horizontal"
          text-color="#fff" router class="menu-container">
          <el-menu-item>
            <img src="/src/assets/icon.png" class="icon">
            <span class="title">梦翔官网</span>
          </el-menu-item>
          <el-menu-item index="/home" class="menu">
            <el-icon>
              <HomeFilled />
            </el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/team/message">
            <el-icon>
              <UserFilled />
            </el-icon>
            <span>成员信息</span>
          </el-menu-item>
          <el-menu-item index="/team/new">
            <el-icon>
              <CirclePlus />
            </el-icon>
            <span>加入我们</span>
          </el-menu-item>
          <el-menu-item index="/resource">
            <el-icon>
              <Menu />
            </el-icon>
            <span>梦翔树洞</span>
          </el-menu-item>
          <el-menu-item index="/blog">
            <el-icon>
              <Document />
            </el-icon>
            <span>博客专区</span>
          </el-menu-item>
        </el-menu>
      </el-header>
      <!-- 主体内容 -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
      <!-- 底部内容 -->
      <el-footer class="foot">
        <div>底部</div>
      </el-footer>
    </el-container>
  </div>
  <el-button class="toTop" circle v-if="is_show" @click="scrollTop">
    ↑
  </el-button>
</template>

<style scoped>
.common-layout {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

/* 头部 */
.header {
  width: 100%;
  background-color: #232323;
  border-bottom: #232323;
  transition: top 0.3s ease-in-out;
  border-bottom: 1px solid #232323;
}

.header_fixed {
  position: fixed;
  top: 0;
}

.icon {
  width: 30px;
  height: 30px;
  margin-right: 20px;
}

.menu-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.right-menu-items {
  display: flex;
}

.menu {
  margin-left: 350px;
}

.title {
  font-size: 20px;
  font-weight: 700;
  line-height: 20px;
}

/* 主体 */
.main {
  flex: 1;
  background-color: #232323;
  margin-bottom: 60px;
  padding: 0px;
  transition: margin-top 0.3s ease-in-out;
}

/* 底部 */
.foot {
  display: none;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60px;
  margin-bottom: 0px;
  background-color: #232323;
}

.toTop {
  position: fixed;
  bottom: 20px;
  right: 30px;
  background-color: transparent;
  color: white;
  font-size: 20px;
  text-align: center;
}
</style>
