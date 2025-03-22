<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router/index'

const pic_src = ref(new URL('../../assets/enum_computer.png', import.meta.url).href)
const light = ref(false)

const back = () => {
  router.push({ path: '/' })
};
const move_in = () => {
  document.querySelector('.enum_line')?.classList.add('line_in')
  document.querySelector('.enum_line')?.classList.remove('line_out')
};
const move_out = () => {
  document.querySelector('.enum_line')?.classList.remove('line_in')
  document.querySelector('.enum_line')?.classList.add('line_out')
};
const change_pic = () => {
  pic_src.value = !light.value ? new URL('../../assets/enum_computer_active.png', import.meta.url).href : new URL('../../assets/enum_computer.png', import.meta.url).href
  light.value = !light.value
}
</script>

<template>
  <!-- 菜单 -->
  <div class="menu_bgc">
    <el-row>
      <el-col :span="6" class="enum_title">
        <img src="../../assets/icon.png" style="width:45px;margin-left:60px;vertical-align: middle;">
        <div class="title_name">梦翔工作室</div>
      </el-col>
      <el-col :span="6"></el-col>
      <el-col :span="6"></el-col>
      <el-col :span="6" class="back_place">
        <div class="back" @click="back" @mouseenter="move_in" @mouseleave="move_out">
          关闭
          <div class="enum_line"></div>
        </div>
      </el-col>
    </el-row>
    <el-row class="enum_content">
      <el-col :span="6" style="position:relative">
        <img :src='pic_src' class="enum_pic" @click="change_pic">
      </el-col>
    </el-row>
  </div>
</template>
<style>
/* 菜单 */
.menu_bgc {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #44475c;
  color: white;
  z-index: 1000;
}

.enum_title {
  display: flex;
  align-items: center;
  justify-content: start;
  padding-top: 40px;
}

.title_name {
  font-size: 28px;
  margin-left: 20px;
}

.back_place {
  position: relative;
  display: flex;
  justify-content: end;
}

.back {
  width: 60px;
  font-weight: 700;
  font-size: 28px;
  padding-top: 42px;
  margin-right: 60px;
  padding-bottom: 15px;
  border-bottom: 1px solid white;
  transition: all 0.3s;
}

.back:hover {
  cursor: pointer;
}

.line_in {
  position: absolute;
  height: 3px;
  background-color: white;
  bottom: 1px;
  animation: line_add 0.5s forwards;
}

.line_out {
  position: absolute;
  height: 3px;
  background-color: white;
  bottom: 1px;
  animation: line_remove 0.5s forwards;
}

@keyframes line_add {
  0% {
    width: 0;
  }

  100% {
    width: 60px;
  }
}

@keyframes line_remove {
  0% {
    width: 60px;
  }

  100% {
    width: 0;
  }
}

.enum_content {
  flex: 1;
}

.enum_pic {
  position: absolute;
  bottom: 20%;
  width: 100%;
  cursor: pointer;
}
</style>