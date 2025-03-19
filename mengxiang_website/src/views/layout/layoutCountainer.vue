<script setup lang="ts">
</script>

<template>
  <div class="common-layout">
    <el-container class="main_container">
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
</template>

<style scoped>
.common-layout {
  display: flex;
  height: 100vh;
  flex-direction: column;
  background-color: #232323;
  /* 设置背景色，防止出现白色区域 */
  overflow: hidden;
  /* 防止滚动溢出 */
}

/* 主体 */
.main {
  height: 100vh;
  /* 确保主体内容的高度不超过视口 */
  background-color: #232323;
  margin-bottom: 60px;
  padding: 0px;
  transition: margin-top 0.3s ease-in-out;
  overflow-x: hidden;
  /* 防止水平方向滚动 */
}

.no_change.is-active {
  background-color: #232323 !important;
  color: #fff !important;
  border-bottom: none;
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
  z-index: 222;
}
</style>
