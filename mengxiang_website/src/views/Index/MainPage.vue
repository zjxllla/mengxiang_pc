<script setup lang="ts">
import { ref, onMounted } from 'vue'

const containerRef = ref<HTMLElement | null>(null)
const currentIndex = ref([0])
const sections = ['#part1', '#part2', '#part3']
const delta = ref(0)
let isScrolling = false
const ifShow = ref(false)

const handleScroll = (e: WheelEvent) => {
  e.preventDefault()
  if (isScrolling) return
  delta.value = e.deltaY > 0 ? 1 : -1
  const newIndex = Math.min(Math.max(currentIndex.value[0] + delta.value, 0), sections.length - 1)
  const target = document.querySelector(sections[newIndex])
  if (newIndex !== currentIndex.value[0]) {
    isScrolling = true
    currentIndex.value[0] = newIndex
    target?.scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => {
      isScrolling = false
    }, 500)
  }
}
window.addEventListener('resize', () => {
  const midArr = []
  if (delta.value > 0 && currentIndex.value[0] < 2 || delta.value < 0 && currentIndex.value[0] === 2 || delta.value < 0 && currentIndex.value[0] === 1) {
    midArr.push(currentIndex.value[0])
    midArr.push(currentIndex.value[0] + 1)
    currentIndex.value = []
    currentIndex.value = midArr
  } else if (delta.value > 0 && currentIndex.value[0] === 2 || delta.value < 0 && currentIndex.value[0] > 0) {
    midArr.push(currentIndex.value[0])
    midArr.push(currentIndex.value[0] - 1)
    currentIndex.value = []
    currentIndex.value = midArr
  }
  console.log(currentIndex.value)
})

onMounted(() => {
  containerRef.value?.addEventListener('wheel', handleScroll)
  setTimeout(() => {
    ifShow.value = true
  }, 2000)
})

// 控制主页和菜单的显示状态
const showContainer = ref(true)
const showMenu = ref(false)

const to_enum = () => {
  showContainer.value = false
  // 添加短暂延迟，确保container的离开动画有时间开始
  setTimeout(() => {
    showMenu.value = true
  }, 50)
}

// 菜单
const pic_src = ref(new URL('../../assets/enum_computer.png', import.meta.url).href)
const light = ref(false)

const back = () => {
  showMenu.value = false
  // 添加短暂延迟，确保menu的离开动画有时间开始
  setTimeout(() => {
    showContainer.value = true
  }, 50)
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
  <Transition name="fade-slide">
    <div class="container" v-show="showContainer">
      <img src="../../assets/icon.png" alt="菜单" class="enum_icon" @click="to_enum" />
      <Transition>
        <div class="enum_text" v-if="ifShow">点我试试!</div>
      </Transition>
      <el-row>
        <el-col :span="24">
          <div ref="containerRef" style="height: 100vh; overflow-y: auto">
            <!-- 确保容器可以垂直滚动 -->
            <div id="part1" class="scroll-section" :class="{ active: currentIndex.includes(0) }" style="height: 100vh">
              <!-- 确保每个部分的高度不超过视口 -->
              <div class="title_bgc">
                <h1 class="title">梦翔工作室</h1>
              </div>
            </div>
            <div id="part2" class="scroll-section" :class="{ active: currentIndex.includes(1) }" style="height: 100vh">
              <!-- 确保每个部分的高度不超过视口 -->
              <div class="about_us">
                <div class="context">
                  <div class="section_title">关于我们</div>
                  <div class="line"></div>
                  <div class="content">
                    梦翔工作室成立于2007年，至今已经历了13年的成长。社团一直秉承“自强不息”的理念，不断提高，努力创新。
                    梦翔社团自成立以来，紧跟软件发展方向，及时转变学习方向，让走出去的学生都能很快找到适合的就业岗位。
                    梦翔社团有博学强识的带队老师，有认真负责的学长学姐，在这里你可以体会到家一般的温馨和睦。
                    社团还拥有严格的管理制度，毕竟无规矩不成方圆，有制度的约束才可以让我们更好的成长；
                    社团紧跟市场的要求技术，确立了人工智能，前端，小程序，嵌入式等系统学习研究的发展方向，现已成为web应用方向主力社团之一。
                    梦翔人自强不息，先后承接并完成项目三十余项，并在各种比赛中赢得了诸多荣誉。我们的脚步从未停息...
                  </div>
                </div>
              </div>
            </div>
            <div id="part3" class="scroll-section" :class="{ active: currentIndex.includes(2) }" style="height: 100vh">
              <!-- 确保每个部分的高度不超过视口 -->
              <div class="award">
                <div class="context">
                  <div class="section_title">奖项展示</div>
                  <div class="line"></div>
                  <div class="content"
                    style="display: flex; justify-content: center; align-items: center; height: 100%">
                    <el-carousel :interval="4000" type="card" height="50vh" class="pictures">
                      <el-carousel-item v-for="item in 6" :key="item">
                        <img src='../../assets/lk.jpg' alt="图片" style="width: 100%; height: 100%" />
                      </el-carousel-item>
                    </el-carousel>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" style="position: fixed; right: 20px; top: 50%; transform: translateY(-50%); z-index: 1000">
          <el-anchor :container="containerRef" direction="vertical" type="default" :offset="0"
            style="background: transparent; padding: 0; border-radius: 0" @click.prevent="">
            <el-anchor-link href="#part1" title="首页" />
            <el-anchor-link href="#part2" title="介绍" />
            <el-anchor-link href="#part3" title="奖项" />
          </el-anchor>
        </el-col>
      </el-row>
    </div>
  </Transition>

  <!-- 菜单 -->
  <Transition name="fade-slide-menu">
    <div class="enum_bgc" v-show="showMenu">
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
        <el-col :span="6"></el-col>
        <el-col :span="9" class="enum_choice">
          <div class="link_row"><a href="/team/message">成员信息</a><a href="/team/new">加入我们</a></div>
          <div class="link_row"><a href="/resource">梦翔树洞</a><a href="/blog">梦翔博客</a></div>
        </el-col>
      </el-row>
    </div>
  </Transition>

</template>

<style scoped>
/* 主页和菜单的过渡效果 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.fade-slide-menu-enter-active,
.fade-slide-menu-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-menu-enter-from,
.fade-slide-menu-leave-to {
  opacity: 0;
  transform: translateY(30px);
  visibility: hidden;
}

.container {
  color: white;
  height: 100vh;
  overflow: hidden;
  transition: all 0.5s ease-in-out;
}

.enum_icon {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 60px;
  z-index: 2;
}

.enum_icon:hover {
  cursor: pointer;
}

.enum_text {
  position: fixed;
  z-index: 3;
  width: 120px;
  top: 65px;
  right: 55px;
  font-weight: 700;
  border: 1px solid white;
  border-radius: 10px 0 12px 10px;
  color: black;
  background-color: white;
  text-align: center;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(1);
  opacity: 0;
}

.enum_text {
  /* 原有样式保持不变 */
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0;
  }

  50% {
    transform: scale(1.15);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

/* 移除原有的:hover样式 */
.v-enter-from,
.v-leave-to {
  opacity: 0;
}

a {
  color: white;
}

.title_bgc {
  position: relative;
  width: 100%;
  height: 100vh;
  font-size: 80px;
  font-weight: bold;
  color: #000;
  background: url('../../assets/main_pic1.jpg') no-repeat center;
  background-size: cover;
}

.title_bgc::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 0;
}

.title {
  position: relative;
  text-align: center;
  top: 30%;
  z-index: 1;
  color: white;
}

.context {
  position: relative;
  z-index: 1;
}

.section_title {
  text-align: center;
  padding-top: 50px;
  font-size: 30px;
  font-weight: 700;
}

.line {
  width: 90px;
  border: 2px solid skyblue;
  margin: 20px auto;
}

.content {
  width: 60%;
  margin: 0 auto;
  margin-top: 50px;
  font-size: 24px;
}

.about_us,
.award {
  position: relative;
  width: 100%;
  height: 100vh;
  background-size: cover;
  line-height: 45px;
}

.about_us {
  background: url('../../assets/main_pic2.jpg') no-repeat center;
}

.award {
  background: url('../../assets/main_pic3.jpg') no-repeat center;
}

.about_us::before,
.award::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 0;
}

.pictures {
  width: 70vw;
  margin-top: 50px;
}

.el-anchor {
  --el-anchor-active-color: yellow;
  --el-anchor-marker-bg-color: yellow;
  pointer-events: none;
}

.el-anchor-link__title {
  color: #999 !important;
  cursor: not-allowed;
}

.scroll-section {
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
}

.scroll-section.active {
  opacity: 1;
}

/* 菜单 */

.enum_bgc {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #44475c;
  color: white;
  z-index: 1000;
  transform-origin: center;
  will-change: opacity, transform;
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

.enum_choice {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.link_row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 60px;
}

.link_row a {
  text-align: center;
  padding: 20px;
  font-size: 28px;
}

.link_row a:hover {
  color: aqua;
}

.link_row:nth-child(1) {
  padding-top: 100px;
  border-top: 3px solid white;
}
.link_row:nth-child(2) {
  padding-bottom: 100px;
  border-bottom: 3px solid white;
}
</style>
