<script setup lang="ts">
import { ref, onMounted } from 'vue'
import router from '../../router/index'

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

const to_enum = () => {
  router.push('/enum')
}
</script>

<template>
  <div class="container">
    <img src="../../assets/icon.png" alt="菜单" class="enum" @click="to_enum" />
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
                <div class="content" style="display: flex; justify-content: center; align-items: center; height: 100%">
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
</template>

<style scoped>
.container {
  color: white;
  height: 100vh;
  overflow: hidden;
}

.enum {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 60px;
  z-index: 2;
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
</style>
