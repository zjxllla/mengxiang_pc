<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import LoadingScreen from '../../components/LoadingScreen.vue'
import { useGlobalStore } from '../../stores';

const globalStore = useGlobalStore()
const back_enum = globalStore.getBackto_enum()
const containerRef = ref<HTMLElement | null>(null)
const currentIndex = ref([0])
const sections = ['#part1', '#part2', '#part3', '#part4']
const delta = ref(0)
let isScrolling = false
const ifShow = ref(false)
const isMobile = ref(false)
let touchStartY = 0
let touchEndY = 0
const loading_time = ref(0)
const container_over = ref(false)



// 控制加载屏幕的显示
const showLoading = ref(true)

// 检测是否为移动设备
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  globalStore.isMobile = isMobile.value
}

// PC端滚轮事件处理
const handleScroll = (e: WheelEvent) => {
  e.preventDefault()
  if (isScrolling) return

  delta.value = e.deltaY > 0 ? 1 : -1
  changePage(delta.value)
}

// 移动端触摸事件处理
const handleTouchStart = (e: TouchEvent) => {
  touchStartY = e.touches[0].clientY
}

const handleTouchMove = (e: TouchEvent) => {
  // 阻止默认行为，防止页面滚动
  e.preventDefault()
}

const handleTouchEnd = (e: TouchEvent) => {
  if (isScrolling) return
  touchEndY = e.changedTouches[0].clientY

  // 判断滑动方向
  const touchDelta = touchStartY - touchEndY

  // 设置一个最小滑动距离阈值，避免轻微触摸也触发翻页
  if (Math.abs(touchDelta) > 50) {
    delta.value = touchDelta > 0 ? 1 : -1
    changePage(delta.value)
  }
}

// 统一的页面切换逻辑
const changePage = (deltaValue: number) => {
  const newIndex = Math.min(Math.max(currentIndex.value[0] + deltaValue, 0), sections.length - 1)
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
})

// 添加或移除事件监听器的函数
const addEventListeners = () => {
  if (isMobile.value) {
    // 移动端：添加触摸事件
    containerRef.value?.addEventListener('touchstart', handleTouchStart, { passive: false })
    containerRef.value?.addEventListener('touchmove', handleTouchMove, { passive: false })
    containerRef.value?.addEventListener('touchend', handleTouchEnd)
    // 确保移除PC端事件
    containerRef.value?.removeEventListener('wheel', handleScroll)
  } else {
    // PC端：添加滚轮事件
    containerRef.value?.addEventListener('wheel', handleScroll)
    // 确保移除移动端事件
    containerRef.value?.removeEventListener('touchstart', handleTouchStart)
    containerRef.value?.removeEventListener('touchmove', handleTouchMove)
    containerRef.value?.removeEventListener('touchend', handleTouchEnd)
  }
}

onMounted(() => {
  // 切换到菜单
  if (back_enum) {
    globalStore.setBackto_enum(false)
    to_enum()
  }
  console.log(back_enum)
  // 首屏的加载时间
  const oberserver = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    const lastEntry = entries[entries.length - 1]
    loading_time.value = lastEntry.startTime + lastEntry.duration
    if (lastEntry) { showLoading.value = false }
  })
  oberserver.observe({
    type: 'largest-contentful-paint',
    buffered: true
  })

  // 检测设备类型
  checkMobile()
  window.addEventListener('resize', checkMobile)

  // 初始添加事件监听器
  addEventListeners()

  // 监听设备类型变化，重新绑定事件
  watch(isMobile, () => {
    addEventListeners()
  })

  setTimeout(() => {
    ifShow.value = true
  }, 2000)
  container_over.value = true

})

onUnmounted(() => {
  // 移除事件监听
  window.removeEventListener('resize', checkMobile)

  // 无论当前是什么设备类型，都移除所有可能的事件监听器
  if (containerRef.value) {
    // 移除PC端事件
    containerRef.value.removeEventListener('wheel', handleScroll)
    // 移除移动端事件
    containerRef.value.removeEventListener('touchstart', handleTouchStart)
    containerRef.value.removeEventListener('touchmove', handleTouchMove)
    containerRef.value.removeEventListener('touchend', handleTouchEnd)
  }
  document.querySelector('.enum_bgc')?.classList.remove('enum_bgc_animate')
  document.querySelector('.bear')?.classList.remove('bear_animation')
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
  setTimeout(() => {
    document.querySelector('.enum_bgc')?.classList.add('enum_bgc_animate')
    document.querySelector('.bear')?.classList.add('bear_animation')
  }, 100)
  setTimeout(() => {
    change_pic()
  }, 1000)
}

// 菜单
const pic_src = ref('https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/enum_computer.png')
const light = ref(true)

const back = () => {
  showMenu.value = false
  // 添加短暂延迟，确保menu的离开动画有时间开始
  setTimeout(() => {
    showContainer.value = true
    change_pic()
  }, 50)
  setTimeout(() => {
    document.querySelector('.enum_bgc')?.classList.remove('enum_bgc_animate')
    document.querySelector('.bear')?.classList.remove('bear_animation')
  }, 100)
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
  pic_src.value = light.value ? 'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/enum_computer_active.png' : 'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/enum_computer.png'
  light.value = !light.value
}
const mousein_link = (num: number) => {
  document.querySelectorAll('.enum_link_line')[num]?.classList.add('enum_link_line_in')
  document.querySelectorAll('.enum_link_line')[num]?.classList.remove('enum_link_line_out')
}
const mouseleave_link = (num: number) => {
  document.querySelectorAll('.enum_link_line')[num]?.classList.remove('enum_link_line_in')
  document.querySelectorAll('.enum_link_line')[num]?.classList.add('enum_link_line_out')
}
</script>

<template>
  <Transition name="fade-slide">
    <div class="container" v-show="showContainer">
      <img src="https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/icon.png" alt="菜单"
        class="enum_icon" @click="to_enum" :class="{ 'mobile-enum-icon': isMobile }" />
      <Transition>
        <div class="enum_text" v-if="ifShow" :class="{ 'mobile-enum-text': isMobile }">点我试试!</div>
      </Transition>
      <el-row>
        <el-col :span="24">
          <div ref="containerRef" style="height: 100vh; overflow-y: auto">
            <!-- 确保容器可以垂直滚动 -->
            <div id="part1" class="scroll-section" :class="{ active: currentIndex.includes(0) }" style="height: 100vh">
              <!-- 确保每个部分的高度不超过视口 -->
              <div class="title_bgc">
                <h1 class="title" :class="{ 'mobile-container-title': isMobile }">
                  <span v-for="(char, index) in '梦翔工作室'" :key="index" class="char"
                    :style="{ 'animation-delay': `${index * 0.4}s` }">{{ char }}</span>
                </h1>
                <div v-if="isMobile"><img src="../../assets/bottom.png" alt="" width="30px"
                    style="position: absolute;bottom: 0;left: 45vw; "></div>
              </div>

            </div>
            <div id="part2" class="scroll-section" :class="{ active: currentIndex.includes(1) }" style="height: 100vh">
              <!-- 确保每个部分的高度不超过视口 -->
              <div class="about_us">
                <div class="context">
                  <div class="section_title" :class="{ 'mobile_second_title': isMobile }">关于我们</div>
                  <div class="line" :class="{ 'mobile-line': isMobile }"></div>
                  <div class="content" :class="{ 'mobile-content': isMobile }">
                    <div class="box" :class="{ 'mobile-box': isMobile }">
                      <img src="../../assets/main_box1.png" alt="" class="box_img"
                        :class="{ 'mobile-box-img': isMobile }">
                      <div class="box_title">社团简介与理念</div>
                      <div class="box_content">梦翔工作室成立于2007年，至今已经历了13年的成长。社团一直秉承“自强不息”的理念，不断提高，努力创新。</div>
                    </div>
                    <div class="box" :class="{ 'mobile-box': isMobile }">
                      <img src="../../assets/main_box2.png" alt="" class="box_img"
                        :class="{ 'mobile-box-img': isMobile }">
                      <div class="box_title">师资与管理制度</div>
                      <div class="box_content">
                        梦翔社团有博学强识的带队老师，有认真负责的学长学姐，在这里你可以体会到家一般的温馨和睦。社团还拥有严格的管理制度，毕竟无规矩不成方圆，有制度的约束才可以让我们更好地成长。</div>
                    </div>
                    <div class="box" :class="{ 'mobile-box': isMobile }">
                      <img src="../../assets/main_box3.png" alt="" class="box_img"
                        :class="{ 'mobile-box-img': isMobile }">
                      <div class="box_title">发展方向与成就</div>
                      <div class="box_content">
                        梦翔社团自成立以来，紧跟软件发展方向，及时转变学习方向，紧跟市场的要求技术，确立了人工智能、前端、小程序、嵌入式等系统学习研究的发展方向，现已成为web应用方向主力社团之一。
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="isMobile"><img src="../../assets/bottom.png" alt="" width="30px"
                    style="position: absolute;bottom: 0;left: 45vw;"></div>
              </div>
            </div>
            <div id="part3" class="scroll-section"
              :class="{ active: currentIndex.includes(2) || currentIndex.includes(3) }" style="height: 100vh">
              <!-- 确保每个部分的高度不超过视口 -->
              <div class="award" style="display: flex;flex-direction: column;">
                <div class="context" :style="{ 'padding-bottom': isMobile ? '3vh' : '5vh' }">
                  <div class="section_title" :class="{ 'mobile_second_title': isMobile }">我们的优势</div>
                  <div class="line" :class="{ 'mobile-line': isMobile }"
                    style="margin: 3vh auto;border: 2px solid #deb13d;"></div>
                  <div class="content"
                    style="display: flex; justify-content: center; align-items: center; height: 100%;margin-top: 0;overflow: hidden;">
                    <el-carousel indicator-position="outside" :interval="5000" :height="isMobile ? '20vh' : '40vh'"
                      :style="isMobile ? 'width:80vw' : 'width:70vw'">
                      <el-carousel-item v-for="item in 4" :key="item">
                        <img
                          src="https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang%2Fpicture%2Fmain_pic1.jpg"
                          alt="" style="width: 100%;height: 100%; object-fit: fill;">
                      </el-carousel-item>
                    </el-carousel>
                  </div>
                </div>
                <div class="part3-bottom" :class="{ 'mobile-part3-bottom': isMobile }">
                  <div class="part3-box" :class="{ 'mobile-part3-box': isMobile }">
                    <div class="part3-icon"
                      :style="{ width: isMobile ? '10vw' : '5vw', height: isMobile ? '10vw' : '5vw' }">
                      <img src="../../assets/part3-icon2.png" alt="" class="part3-icon-img"
                        :class="{ 'mobile-part3-icon-img': isMobile }">
                    </div>
                    <div class="part3-title" :style="{ top: isMobile ? '6vh' : '12vh' }">专业紧跟市场</div>
                    <div class="part3-context" :style="{ top: isMobile ? '8vh' : '15vh' }">紧跟软件方向，及时调整学习内容，助力学生就业。</div>
                  </div>
                  <div class="part3-box" :class="{ 'mobile-part3-box': isMobile }">
                    <div class="part3-icon"
                      :style="{ width: isMobile ? '10vw' : '5vw', height: isMobile ? '10vw' : '5vw' }">
                      <img src="../../assets/part3-icon3.png" alt="" class="part3-icon-img"
                        :class="{ 'mobile-part3-icon-img': isMobile }">
                    </div>
                    <div class="part3-title" :style="{ top: isMobile ? '6vh' : '12vh' }">师资力量雄厚</div>
                    <div class="part3-context" :style="{ top: isMobile ? '8vh' : '15vh' }">有博学强识的老师和认真负责的学长学姐。</div>
                  </div>
                  <div class="part3-box" :class="{ 'mobile-part3-box': isMobile }">
                    <div class="part3-icon"
                      :style="{ width: isMobile ? '10vw' : '5vw', height: isMobile ? '10vw' : '5vw' }">
                      <img src="../../assets/part3-icon4.png" alt="" class="part3-icon-img"
                        :class="{ 'mobile-part3-icon-img': isMobile }">
                    </div>
                    <div class="part3-title" :style="{ top: isMobile ? '6vh' : '12vh' }">温馨和睦氛围</div>
                    <div class="part3-context" :style="{ top: isMobile ? '8vh' : '15vh' }">社团氛围如家般温馨，成员关系和睦。</div>
                  </div>
                  <div class="part3-box" :class="{ 'mobile-part3-box': isMobile }">
                    <div class="part3-icon"
                      :style="{ width: isMobile ? '10vw' : '5vw', height: isMobile ? '10vw' : '5vw' }">
                      <img src="../../assets/part3-icon1.png" alt="" class="part3-icon-img"
                        :class="{ 'mobile-part3-icon-img': isMobile }">
                    </div>
                    <div class="part3-title" :style="{ top: isMobile ? '6vh' : '12vh' }">实践成果丰硕</div>
                    <div class="part3-context" :style="{ top: isMobile ? '8vh' : '15vh' }">承接30余个项目，多次获奖，成绩突出。</div>
                  </div>
                </div>
              </div>
            </div>
            <div id="part4" class="scroll-section" :class="{ active: currentIndex.includes(3) }" style="height: 30vh;">
              <el-row>
                <el-col :span="24">
                  <div class="main-bottom">
                    <div class="bottom-box">
                      <div class="bottom-title">关于我们</div>
                      <div class="bottom-content">梦翔工作室是经学校审批于2007年成立的学习型工作....</div>
                    </div>
                    <div class="bottom-box">
                      <div class="bottom-title">联系我们</div>
                      <div class="bottom-content">
                        <a target="_blank"
                          href="https://qm.qq.com/cgi-bin/qm/qr?k=n2pzfGMmpUaj5RbTTa7_ti2k96uqgoFn&jump_from=webapi&authKey=0IBvXsTSc88nf5sBmyySkbjnAgduDPXfzMn0A1e66pviDD45vetA+1LBH0d40DAA"><img
                            src="../../assets/QQ.png" alt="" class="bottom-qq"></a>
                      </div>
                    </div>
                    <div class="bottom-box">
                      <div class="bottom-title">版权声明</div>
                      <div class="bottom-content">
                        @2025 梦翔工作室 版权所有<br>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <!-- 导航锚点，在移动端隐藏 -->
        <el-col :span="6" v-if="!isMobile"
          style="position: fixed; right: 20px; top: 50%; transform: translateY(-50%); z-index: 1000">
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
    <div class="enum_bgc" v-show="showMenu" v-if="container_over">
      <el-row>
        <el-col :xs="24" :sm="12" :md="6" class="enum_title">
          <img src="https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/icon.png"
            :style="isMobile ? 'width:60px;margin-left:20px;' : 'width:80px;margin-left:60px;'"
            style="vertical-align: middle;">
          <div class="title_name" :class="{ 'mobile-title': isMobile }">梦翔工作室</div>
        </el-col>
        <el-col :xs="0" :sm="0" :md="6"></el-col>
        <el-col :xs="0" :sm="0" :md="6"></el-col>
        <el-col :xs="24" :sm="12" :md="6" class="back_place">
          <div class="back" @click="back" @mouseenter="move_in" @mouseleave="move_out"
            :class="{ 'mobile-back': isMobile }">
            关闭
            <div class="enum_line"></div>
          </div>
        </el-col>
      </el-row>
      <el-row class="enum_content">
        <el-col :xs="24" :sm="12" :md="8" style="position:relative" :class="{ 'mobile-pic-col': isMobile }">
          <img :src='pic_src' class="enum_pic" @click="change_pic" :class="{ 'mobile-pic': isMobile }">
        </el-col>
        <el-col :xs="0" :sm="0" :md="4"></el-col>
        <el-col :xs="24" :sm="12" :md="9" class="enum_choice">
          <div class="bear" :class="{ 'mobile-bear': isMobile }"></div>
          <div class="link_row" :class="{ 'mobile-link-row': isMobile }">
            <div class="enum_link" v-if="!isMobile" @mouseenter="mousein_link(0)" @mouseleave="mouseleave_link(0)">
              <a href="/team/message">成员信息</a>
              <div class="enum_link_line"></div>
            </div>
            <div class="enum_link" v-if="!isMobile" @mouseenter="mousein_link(1)" @mouseleave="mouseleave_link(1)">
              <a href="/team/new">加入我们</a>
              <div class="enum_link_line"></div>
            </div>
            <a href="/team/message" v-if="isMobile">成员信息</a><a href="/team/new" v-if="isMobile">加入我们</a>
          </div>
          <div class="link_row" :class="{ 'mobile-link-row': isMobile }">
            <div class="enum_link" v-if="!isMobile" @mouseenter="mousein_link(2)" @mouseleave="mouseleave_link(2)">
              <a href="/resource">梦翔树洞</a>
              <div class="enum_link_line"></div>
            </div>
            <div class="enum_link" v-if="!isMobile" @mouseenter="mousein_link(3)" @mouseleave="mouseleave_link(3)">
              <a href="/blog">梦翔博客</a>
              <div class="enum_link_line"></div>
            </div>
            <a href="/resource" v-if="isMobile">梦翔树洞</a><a href="/blog" v-if="isMobile">梦翔博客</a>
          </div>
        </el-col>
      </el-row>
    </div>
  </Transition>
  <!-- 加载动画 -->
  <LoadingScreen v-if="showLoading" style="position: fixed" />
</template>

<style scoped>
/* #region */
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
  min-height: 100vh;
  overflow: hidden;
  transition: all 0.5s ease-in-out;
}

.enum_icon {
  position: fixed;
  top: 60px;
  right: 60px;
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
  top: 105px;
  right: 105px;
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
  background: url('https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/main_pic4.jpg') no-repeat center;
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

@keyframes char_appear {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.title {
  position: relative;
  text-align: center;
  top: 30%;
  z-index: 1;
  height: 30vh;
  color: white;
  display: flex;
  justify-content: center;
}

.char {
  display: inline-block;
  opacity: 0;
  animation: char_appear 0.5s ease-in-out forwards;
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
  width: 200px;
  border: 2px solid skyblue;
  margin: 20px auto;
}

.content {
  width: 70%;
  margin: 0 auto;
  margin-top: 10vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 3vw;
}

.box {
  position: relative;
  width: 20vw;
  height: 50vh;
  background: linear-gradient(to bottom right, #1f2937, #111827);
  border-radius: 1vw;
  box-shadow: rgba(255, 255, 255, 0.3) 0px 10px 10px;
}

.box_img {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 35%;
  border-radius: 10%;
}

.box_title {
  position: absolute;
  top: 43%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  padding-left: 2vw;
  padding-right: 2vw;
}

.box_content {
  position: absolute;
  top: 55%;
  font-size: 14px;
  line-height: 20px;
  padding-left: 2vw;
  padding-right: 2vw;
}

/* part3 */
.about_us,
.award {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-size: cover;
  line-height: 45px;
  background-color: #161d26;
}

.about_us::before,
.award::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

::v-deep .el-carousel__indicators--horizontal {
  display: none;
}

.part3-box {
  position: relative;
  width: 15vw;
}

.part3-bottom {
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 100vw;
  flex: 1;
  background-color: #161d26;
  padding-left: 8vw;
  padding-right: 8vw;
  padding-top: 5vh;
}

.part3-icon {
  position: relative;
  width: 5vw;
  height: 5vw;
  border-radius: 50%;
  background-color: #1f2937;
  transform: translateX(10%);
  margin: 0 auto;
}

.part3-icon-img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2vw;
}

.part3-title {
  position: absolute;
  top: 12vh;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  margin: 1vh;
  width: 100%;
  text-align: center;
}

.part3-context {
  position: absolute;
  top: 15vh;
  font-size: 14px;
  margin-top: 1vh;
  padding-left: 2vw;
  line-height: 20px;
  color: #9ca3af;
}

/* #endregion */
.main-bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 30vh;
  width: 100vw;
  background-color: #131a29;
  gap: 5vw;
  padding-left: 5vw;
  padding-right: 5vw;
  padding-top: 2vh;
}

.bottom-box {
  position: relative;
  width: 25vw;
  height: 25vh;
}

.bottom-title {
  position: absolute;
  top: 10%;
  left: 10%;
  font-size: 18px;
  font-weight: 700;
}

.bottom-content {
  position: absolute;
  top: 30%;
  left: 10%;
  font-size: 14px;
  line-height: 20px;
  color: #9CA3AF;
}

.bottom-qq {
  width: 20px;
}

/* 菜单 */
@keyframes color_change {
  0% {
    background-color: #232323;
  }

  100% {
    background-color: #44475c;
  }
}

.enum_bgc {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100vh;
  color: white;
  z-index: 1000;
  transform-origin: center;
  will-change: opacity, transform;
  background-color: #232323;
  overflow: hidden;
}

.enum_bgc_animate {
  animation: color_change 3s forwards;
}

.enum_title {
  display: flex;
  align-items: center;
  justify-content: start;
  padding-top: 40px;
}

.title_name {
  font-size: clamp(20px, 2.2vw, 50px);
  margin-left: 20px;
  font-weight: 700;
}

.back_place {
  position: relative;
  display: flex;
  justify-content: end;
}

.back {
  width: 60px;
  font-weight: 700;
  font-size: 30px;
  padding-top: 60px;
  margin-right: 60px;
  padding-bottom: 10px;
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
  bottom: 15%;
  width: 100%;
  cursor: pointer;
}

.enum_choice {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@keyframes bearRun {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: -1600px 0;
  }
}

@keyframes bearComing {
  0% {
    transform: translateX(-200px);
  }

  100% {
    transform: translateX(200px);
  }
}


.bear {
  width: 200px;
  height: 100px;
  background: url('https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/bear.png') repeat-x;
}

.bear_animation {
  animation: bearComing 7s both, bearRun 1s infinite steps(8);
}

.link_row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 60px;
}

.link_row a {
  text-align: center;
  font-size: 2vw;
}

.link_row a:hover {
  color: #fff300;
  font-weight: 700;
}

.link_row:nth-child(2) {
  padding-top: 50px;
  border-top: 3px solid white;
}

.link_row:nth-child(3) {
  padding-bottom: 50px;
  border-bottom: 3px solid white;
}

@keyframes enum_link_in {
  0% {
    width: 0;
  }

  100% {
    width: 100%;
  }
}

@keyframes enum_link_out {
  0% {
    width: 100%;
  }

  100% {
    width: 0;
  }
}

.enum_link {
  margin-left: 50px;
  margin-right: 50px;
  padding-bottom: 20px;
  position: relative;
  transition: all 0.5s;
}

.enum_link_line {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 5px;
  background-color: #fff300;
}

.enum_link_line_in {
  animation: enum_link_in 0.5s forwards;
}

.enum_link_line_out {
  animation: enum_link_out 0.5s forwards;
}

/* 移动端适配样式 */
.mobile-enum-icon {
  width: 80px !important;
}

.mobile-enum-text {
  font-size: 12px !important;
  top: 70px !important;
  right: 70px !important;
}

.mobile-indicator {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}

.mobile-container-title {
  font-size: 10vh !important;
  writing-mode: vertical-rl;
  text-orientation: upright;
  margin: 0 auto;
  top: 23%;
}

.mobile_second_title {
  padding-top: 5vh !important;
}

.mobile-line {
  width: 40vw !important;
}

.mobile-indicator span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #999;
  transition: all 0.3s ease;
}

.mobile-indicator span.active-dot {
  background-color: yellow;
  transform: scale(1.2);
}

.mobile-content {
  width: 85% !important;
  font-size: 18px !important;
  line-height: 30px !important;
  flex-direction: column;
  margin-top: 5vh;
}

.mobile-box {
  width: 80vw;
  height: 23vh;
  margin-bottom: 2vh;
}

.mobile-box-img {
  width: 15vw;
}

.mobile-part3-bottom {
  flex-direction: column;
  align-items: center;
  padding-top: 0;
}

.mobile-part3-box {
  width: 80vw !important;
  height: 15vh !important;
}

.mobile-part3-icon-img {
  width: 5vw !important;
}

.mobile-title {
  font-size: 24px !important;
}

.mobile-back {
  font-size: 24px !important;
  margin-right: 20px !important;
  padding-top: 5px !important;
}

.mobile-pic-col {
  margin-bottom: 10px;
}

.mobile-pic {
  width: 80% !important;
  margin: 0 auto !important;
  display: block !important;
  position: relative !important;
  bottom: 0 !important;
}

@keyframes mobile_bearComing {
  0% {
    transform: translateX(-300px);
  }

  100% {
    transform: translateX(100px);
  }
}

.mobile-bear {
  transform: scale(0.7);
}

.mobile-link-row {
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.mobile-link-row:nth-child(3) {
  border: transparent;
}

.mobile-link-row a {
  font-size: 20px !important;
  padding: 10px !important;
}

/* 媒体查询 */
@media screen and (max-width: 768px) {
  .title {
    font-size: 36px;
  }

  .section_title {
    font-size: 24px;
  }

  .enum_icon {
    width: 40px;
    top: 15px;
    right: 15px;
  }

  .enum_text {
    width: 90px;
    top: 50px;
    right: 40px;
    font-size: 14px;
  }
}
</style>
