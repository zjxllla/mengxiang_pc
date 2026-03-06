<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import LoadingScreen from '../../components/LoadingScreen.vue'
import { useGlobalStore } from '../../stores';
import Myaxios from '../../axios';
import { baseURL } from '../../axios';

const globalStore = useGlobalStore()
const back_enum = globalStore.getBackto_enum()
const containerRef = ref<HTMLElement | null>(null)
const awardRef = ref<HTMLImageElement | null>(null)
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
const start_time = ref(0)
const end_time = ref(0)
const stay_time = ref(0)
const awards_pics = ref([
  'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/award_pic1_compressed.png',
  'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/award_pic2_compressed.jpg',
  'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/award_pic3_compressed.jpg',
  'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/award_pic4_compressed.png',
  'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/award_pic5_compressed.png',
  'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/award_pic6_compressed.jpg',
  'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/award_pic7_compressed.png',
  'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/award_pic8_compressed.png',
  'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/award_pic9_compressed.jpg',
])
const music_src = ref('')
const music_pic = ref('')
const music_play = ref(false)
const show_control = ref(true)

// 轮播当前索引，仅对当前及前后一项设置 src，实现按需加载
const awardsCarouselIndex = ref(0)
let carouselImages: NodeListOf<HTMLImageElement> | null = null
const getAwardImgSrc = (index: number): string | undefined => {
  if (!carouselImages) return
  const n = awards_pics.value.length
  const prev = (awardsCarouselIndex.value - 1 + n) % n
  const next = (awardsCarouselIndex.value + 1) % n
  const shouldLoad = index === awardsCarouselIndex.value || index === prev || index === next
  if (shouldLoad) {
    if (carouselImages[index].src === '')
      carouselImages[index].src = awards_pics.value[index]
    if (carouselImages[prev].src === '')
      carouselImages[prev].src = awards_pics.value[prev]
    if (carouselImages[next].src === '')
      carouselImages[next].src = awards_pics.value[next]
  }
}
const onAwardsCarouselChange = (current: number) => {
  awardsCarouselIndex.value = current
}

const showDialog = ref(false)
const dialogImageUrl = ref('')
const isLong = ref(false)
let Interval: number | null = null
let Interval2: number | null = null

// 控制加载屏幕的显示
const showLoading = ref(true)
onMounted(() => {
  carouselImages = document.querySelectorAll('.carousel-img')

  // 异步更新网站访问量，不阻塞页面渲染
  Myaxios.get('/ip/get').catch(err => console.error('Failed to get IP:', err))

  // 预加载轮播图片
  // preloadImages()

  start_time.value = Math.floor(+new Date() / 1000)

  handle_ball_annimate()
  // 切换到菜单
  if (back_enum) {
    globalStore.setBackto_enum(false)
    to_enum()
  }
  // 获取随机音乐
  // get_music()

  // 检测设备类型
  checkMobile()
  window.addEventListener('resize', checkMobile)

  // 初始添加事件监听器
  addEventListeners()

  // 监听设备类型变化，重新绑定事件
  watch(isMobile, () => {
    addEventListeners()
  })

  // 减少等待时间，从2秒改为0.5秒
  setTimeout(() => {
    ifShow.value = true
  }, 500)

  container_over.value = true

  // 设置最大加载时间，避免无限等待
  const maxLoadingTime = 3000 // 3秒
  setTimeout(() => {
    if (showLoading.value) {
      showLoading.value = false
    }
  }, maxLoadingTime)

  // 首屏的加载时间 - 添加超时处理
  const oberserver = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    const lastEntry = entries[entries.length - 1]
    if (lastEntry) {
      loading_time.value = lastEntry.startTime + lastEntry.duration
      showLoading.value = false
    }
  })

  try {
    oberserver.observe({
      type: 'largest-contentful-paint',
      buffered: true
    })
  } catch {
    // 如果浏览器不支持，直接隐藏加载屏幕
    console.warn('PerformanceObserver not supported, hiding loading screen')
    showLoading.value = false
  }

  window.addEventListener('beforeunload', () => {
    end_time.value = Math.floor(+new Date() / 1000)
    stay_time.value = end_time.value - start_time.value
    // 上传访问量
    const analyticsData = {
      time: stay_time.value,
      startTime: start_time.value
    };
    const blob = new Blob([JSON.stringify(analyticsData)], {
      type: 'application/json; charset=UTF-8'
    });
    navigator.sendBeacon(`${baseURL}/visit/set`, blob);
  })


  // const audio = document.querySelector('.audio') as HTMLAudioElement;

  // audio!.addEventListener('canplaythrough', function () {
  //   console.log('音频已加载完毕，可以完整播放');
  // });
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

  if (Interval) clearInterval(Interval)
  if (Interval2) clearInterval(Interval2)

})

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

// 首页动画效果
const handle_ball_annimate = () => {
  const balls = document.querySelectorAll('.ball-item') as NodeListOf<HTMLElement>
  Interval = window.setInterval(() => {
    balls.forEach((ball) => {
      const sign1 = Math.random() < 0.5 ? -1 : 1
      const sign2 = Math.random() < 0.5 ? -1 : 1
      const top = Number(ball.style.getPropertyValue('--top').slice(0, -1))
      const left = Number(ball.style.getPropertyValue('--left').slice(0, -1))
      let top2 = top + sign1 * Math.random() * 10
      let left2 = left + sign2 * Math.random() * 10
      if (top2 < 0 || top2 > 100) top2 = 50 + sign1 * 10
      if (left2 < 0 || left2 > 100) left2 = 50 + sign2 * 10
      ball.style.setProperty('--top', `${top2}%`)
      ball.style.setProperty('--left', `${left2}%`)
      ball.style.setProperty('--width', `${Math.random() * 150 + 50}px`)
    })
  }, 2000)
  const ballContainer = document.querySelector('.ball-container') as HTMLElement
  let sign = 1
  Interval2 = window.setInterval(() => {
    const h = Number(ballContainer.style.getPropertyValue('--h'))
    if (h < 0 || h > 360) sign = -sign
    ballContainer.style.setProperty('--h', `${h + sign * 1}`)
  }, 100)
}

const handleTouchMove = (e: TouchEvent) => {
  const target = e.target as HTMLElement;
  if (target.closest('.box_content')) {
    // 如果在 .box_content 内，允许默认滚动行为
    return;
  }
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
function isTablet() {
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  // 触摸设备且宽度在平板范围内
  return hasTouch && viewportWidth >= 768 && viewportWidth <= 1200;
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
  if (isMobile.value || isTablet()) {
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
    // 重置音乐控制动画
    resetMusicAnimation()
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
const show_pic = (src: string, index: number) => {
  if (isMobile.value) {
    return
  }
  showDialog.value = true
  setTimeout(() => {
    if (!awardRef.value) return
    dialogImageUrl.value = src
  }, 0)
  if (index === 3 || index === 6 || index === 7 || index === 8) {
    isLong.value = true
  }
}
// const get_music = async () => {
//   const res = await Myaxios.get('/music/get')
//   console.log(res.data)
//   if (res.data.status === 1) {
//     music_pic.value = res.data.message.picture
//     music_src.value = res.data.message.url
//   } else {
//     show_control.value = false
//   }
// }

const on_music_play = () => {
  const audio = document.querySelector('.audio') as HTMLAudioElement;
  if (music_play.value) {
    audio.pause()
    music_play.value = false
  } else {
    audio.play()
    music_play.value = true
  }
}

// 重置音乐控制动画
const resetMusicAnimation = () => {
  // 等待DOM更新后再重置动画
  setTimeout(() => {
    const musicControl = document.querySelector('.music_control') as HTMLElement;
    const musicRecord = document.querySelector('.music_record') as HTMLElement;

    if (musicControl && musicRecord && music_play.value) {
      // 临时移除动画
      musicControl.style.animation = 'none';
      musicRecord.style.animation = 'none';

      // 重新应用动画 设置为空自动回退到默认样式(class)
      musicControl.style.animation = '';
      musicRecord.style.animation = '';
    }
  }, 100);
}
</script>

<template>
  <div>
    <Transition name="fade-slide">
      <div class="container" v-show="showContainer">
        <img src="https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/icon.png" alt="菜单"
          class="enum_icon" @click="to_enum" :class="{ 'mobile-enum-icon': isMobile }" loading="lazy" />
        <!-- <Transition>
          <div class="enum_text" v-if="ifShow" :class="{ 'mobile-enum-text': isMobile }">点我试试!</div>
        </Transition> -->

        <!-- 音乐播放器 -->
        <audio :src="music_src" class="audio" :loop="true" v-if="!isMobile && false"></audio>
        <div class="music_record" @mouseenter="show_control = true" @mouseleave="show_control = false"
          v-if="!isMobile && false">
          <div class="music_background" :style="{
            background: music_pic ? `url(${music_pic}) no-repeat center center` : '#fff',
            'background-size': 'cover', 'animation-play-state': music_play ? 'running' : 'paused'
          }"></div>
          <Transition name="fade">
            <div class="music_control" v-show="show_control"
              :style="{ 'animation-play-state': music_play ? 'running' : 'paused' }">
              <div class="music_show" @click="on_music_play">
                <div :class="{ 'music_play': music_play, 'music_pause': !music_play }" class="music_line"></div>
                <div :class="{ 'music_play': music_play, 'music_pause': !music_play }" class="music_line"></div>
                <div :class="{ 'music_play': music_play, 'music_pause': !music_play }" class="music_line"></div>
              </div>
            </div>
          </Transition>
        </div>

        <el-row>
          <el-col :span="24">
            <div ref="containerRef" style="height: 100vh; overflow-y: auto">
              <!-- 确保容器可以垂直滚动 -->
              <div id="part1" class="scroll-section" :class="{ active: currentIndex.includes(0) }"
                style="height: 100vh">
                <!-- 确保每个部分的高度不超过视口 -->
                <div class="title_bgc">
                  <div class="ball-bgc" :style="{ top: isMobile ? '75vh' : '20vh' }"></div>
                  <div class="ball-bgc"></div>
                  <div class="ball-bgc"></div>
                  <div class="ball-container">
                    <div class="ball-main ball" :style="{ top: isMobile ? '40%' : '50%' }"></div>
                    <div class="ball-item ball" v-for="i in 5" :key="i"
                      :style="{ '--width': `${Math.random() * 150 + 50}px`, '--top': `${(-1) ** i * Math.random() * 90}% `, '--left': `${(-1) ** i * Math.random() * 70}%` }">
                    </div>
                  </div>
                  <h1 class="title" :class="{ 'mobile-container-title': isMobile }">
                    <span v-for="(char, index) in '梦翔工作室'" :key="index" class="char"
                      :style="{ 'animation-delay': `${index * 0.4}s` }">{{ char }}</span>
                  </h1>
                  <div v-if="isMobile"><img src="../../assets/bottom.png" alt="" width="30px"
                      style="position: absolute;bottom: 0;left: 45vw; "></div>
                </div>

              </div>
              <div id="part2" class="scroll-section" :class="{ active: currentIndex.includes(1) }"
                style="height: 100vh">
                <!-- 确保每个部分的高度不超过视口 -->
                <div class="about_us">
                  <div class="context">
                    <div class="section_title" :class="{ 'mobile_second_title': isMobile }">关于我们</div>
                    <div class="line" :class="{ 'mobile-line': isMobile }"></div>
                    <div class="content" :class="{ 'mobile-content': isMobile }">
                      <div class="box" :class="{ 'mobile-box': isMobile }">
                        <img src="../../assets/main_box1.png" alt="" class="box_img"
                          :class="{ 'mobile-box-img': isMobile }" loading="lazy">
                        <div class="box-message">
                          <div class="box_title">社团简介与理念</div>
                          <div class="box_content">梦翔工作室成立于2007年，至今已经历了13年的成长。社团一直秉承“自强不息”的理念，不断提高，努力创新。</div>
                        </div>
                      </div>
                      <div class="box" :class="{ 'mobile-box': isMobile }">
                        <img src="../../assets/main_box2.png" alt="" class="box_img"
                          :class="{ 'mobile-box-img': isMobile }" loading="lazy">
                        <div class="box-message">
                          <div class="box_title">师资与管理制度</div>
                          <div class="box_content">
                            梦翔社团有博学强识的带队老师，有认真负责的学长学姐，在这里你可以体会到家一般的温馨和睦。社团还拥有严格的管理制度，毕竟无规矩不成方圆，有制度的约束才可以让我们更好地成长。
                          </div>
                        </div>
                      </div>
                      <div class="box" :class="{ 'mobile-box': isMobile }">
                        <img src="../../assets/main_box3.png" alt="" class="box_img"
                          :class="{ 'mobile-box-img': isMobile }" loading="lazy">
                        <div class="box-message">
                          <div class="box_title">发展方向与成就</div>
                          <div class="box_content">
                            梦翔社团自成立以来，紧跟软件发展方向，及时转变学习方向，紧跟市场的要求技术，确立了人工智能、前端、小程序、嵌入式等系统学习研究的发展方向，现已成为web应用方向主力社团之一。
                          </div>
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
                        :style="isMobile ? 'width:70vw' : 'width:60vw'" @change="onAwardsCarouselChange">
                        <el-carousel-item v-for="(item, index) in awards_pics" :key="index"
                          @click="show_pic(item, index)">
                          <img class="carousel-img" :src="getAwardImgSrc(index)" :data-src="item" alt="">
                        </el-carousel-item>
                      </el-carousel>
                      <el-dialog v-model="showDialog" width="600px" :draggable="true" top="10vh"
                        custom-class="image-dialog" @close="isLong = false">
                        <div class="dialog-image-container">
                          <img :src="dialogImageUrl" alt="Preview Image" class="dialog-image" ref="awardRef"
                            :style="{ width: isLong ? '400px' : '100%' }" />
                        </div>
                      </el-dialog>

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
                      <div class="part3-context" :style="{ top: isMobile ? '8vh' : '15vh' }">紧跟软件方向，及时调整学习内容，助力学生就业。
                      </div>
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
              <div id="part4" class="scroll-section" :class="{ active: currentIndex.includes(3) }"
                style="min-height: 30vh;">
                <el-row>
                  <el-col :span="24">
                    <div class="main-bottom" :style="{ 'flex-direction': isMobile ? 'column' : 'row' }">
                      <div class="bottom-box">
                        <div class="bottom-title">关于我们</div>
                        <div class="bottom-content">梦翔工作室是经学校审批于2007年成立的学习型工作....</div>
                      </div>
                      <div class="bottom-box">
                        <div class="bottom-title">联系我们</div>
                        <div class="bottom-content">
                          <a target="_blank"
                            href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=V0P7Mxz6Xsn0OsDU8icE3bkW7haPqF9b&authKey=93fETJ4VThAkBi068QdMnJ1YMhQ0tY2WhMZOXuBMTPwZy9k%2F90%2FZJtsqyWxPn8cf&noverify=0&group_code=1055107073"><img
                              src="../../assets/QQ.png" alt="" class="bottom-qq"></a>
                        </div>
                      </div>
                      <div class="bottom-box">
                        <div class="bottom-title">版权声明</div>
                        <div class="bottom-content">
                          2025 梦翔工作室 © 版权所有<br>
                          ICP备案号：浙ICP备2025172341号<br>
                          <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41010402003147">
                            <img src="../../assets/police.png" alt=""
                              style="width: 15px;height: 15px;margin-right: 5px;">公安备案号：豫公网安备41010402003147号
                          </a>
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
      <div class="enum_bgc" v-show="showMenu">
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
  </div>
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

/* 1. 进入/离开过渡的开始状态 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 2. 进入过渡的结束状态（可选，通常与默认样式一致） */
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}

/* 3. 进入/离开过渡的生效状态（添加过渡属性） */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}


.container {
  color: white;
  min-height: 100vh;
  overflow: hidden;
  transition: all 0.5s ease-in-out;
}

.enum_icon {
  --r: 255;
  --g: 220;
  --b: 0;
  position: fixed;
  top: 60px;
  right: 60px;
  width: 60px;
  z-index: 2;
  border-radius: 50%;
  box-shadow: rgba(var(--r), var(--g), var(--b), 1) 0 0 0 1px;
  animation: shadow-animate 2s ease-in-out infinite;
}

.enum_icon:hover {
  cursor: pointer;
}

@keyframes shadow-animate {
  0% {
    box-shadow: rgba(var(--r), var(--g), var(--b), 1) 0 0 0 0px;
  }

  100% {
    box-shadow: rgba(var(--r), var(--g), var(--b), 0) 0 0 0 15px;
  }
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
  background: #161d26;
  mix-blend-mode: lighten;
}

.ball-container {
  --h: 100;
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: hwb(var(--h) 9% 85%);
  filter: contrast(1000%);
  overflow: hidden;
  mix-blend-mode: lighten;
}

.ball-bgc {
  position: absolute;
  aspect-ratio: 1;
  border-radius: 50%;
  background: white;
  filter: blur(.5rem);
}

.ball-bgc:nth-child(1) {
  top: 20vh;
  left: 5vw;
  width: 15vmax;
}

.ball-bgc:nth-child(2) {
  top: 18vh;
  right: 5vw;
  width: 10vmax;
}

.ball-bgc:nth-child(3) {
  bottom: 4vh;
  right: 15vw;
  width: 5vmax;
}

.ball {
  background: white;
  border-radius: 50%;
  filter: blur(2.5rem);
  transition: all 2s ease;
}

.ball-main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 38vmax;
  aspect-ratio: 1;
}

.ball-main::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50vmax;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 70px solid white;
  border-style: dashed;
  transform-origin: 50% 50%;
  animation: rotateion 10s linear infinite;
}

@keyframes rotateion {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.ball-item {
  position: absolute;
  width: var(--width);
  top: var(--top);
  left: var(--left);
  aspect-ratio: 1;
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
  mix-blend-mode: difference;
  text-shadow: 2px 2px 0 black, 4px 4px 0 rgb(255, 64, 0), 6px 6px 0 rgb(255, 213, 0);
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
  position: relative;
  text-align: center;
  text-shadow: 1px 1px 0 red, 2px 1px 0 rgb(255, 64, 0), 3px 2px 0 rgb(255, 213, 0);
  padding-top: 50px;
  font-size: 30px;
  font-weight: 700;
  color: #fff;
  mix-blend-mode: difference;
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

/* 首页第二个页面盒子展示 */
/* #region */
.box {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  position: relative;
  gap: 10px;
  width: 20vw;
  height: 50vh;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 16px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
}

.box:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.box_img {
  margin-top: 3vh;
  width: 35%;
  border-radius: 10%;
}

.box-message {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  flex: 1;
  min-height: 0;
  height: 100%;
}

.box_title {
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  transition: all .3s;
}

.box_title:hover {
  color: skyblue;
}

.box_content {
  font-size: 15px;
  line-height: 20px;
  padding-left: 2vw;
  padding-right: 2vw;
  overflow-y: auto;
  transition: all .3s;
  min-height: 0;
  height: 100%;
  width: 100%;
}

.box_content:hover {
  color: turquoise;
}

@media screen and (max-width: 768px) {
  .box {
    display: flex;
    flex-direction: row;
    padding-left: 2vw;
  }

  .box-message {
    justify-content: center;
    overflow: auto;
  }

  .box_content {
    max-height: 80px;
    overflow-y: auto;
  }

  .box_content:hover {
    color: white;
  }

  .box-title :hover {
    color: white;
  }
}

/* #endregion */
/* part3 */
.about_us,
.award {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-size: cover;
  line-height: 45px;
  background-color: #232326;
  overflow: hidden;
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

/* .scroll-section {
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
}

.scroll-section.active {
  opacity: 1;
} */

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
  mix-blend-mode: difference;
}

.part3-context {
  position: absolute;
  top: 15vh;
  font-size: 14px;
  margin-top: 1vh;
  padding-left: 2vw;
  line-height: 20px;
  color: #d1dbec;
  mix-blend-mode: difference;
}

/* #endregion */
.main-bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 30vh;
  width: 100vw;
  background-color: #131a29;
  gap: 5vw;
  padding-left: 5vw;
  padding-right: 5vw;
  padding-top: 2vh;
  padding-bottom: 2vh;
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
  overflow-y: auto;
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

.el-carousel__item {
  background: white;
  display: flex;
  justify-content: center;
  align-content: center;
}

/* 对话框容器样式 */
.image-dialog {
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

/* 对话框内容区域样式 */
.image-dialog .el-dialog__body {
  padding: 0;
  overflow: auto;
  flex: 1;
}

.carousel-img {
  height: 100%;
  object-fit: fill;
}

/* 图片容器样式 */
.dialog-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

/* 图片样式 */
.dialog-image {
  max-height: none;
  object-fit: contain;
  transition: width 0.3s ease;
}

/* 音乐播放器 */
.music_record {
  position: fixed;
  top: 30px;
  left: 30px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  z-index: 3;
  transition: all .3s;
}

.music_background {
  position: absolute;
  transform-origin: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: rotate 5s infinite linear;
}

.music_control {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 4;
}

.music_record::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background-color: #000;
  border-radius: 50%;
  z-index: 3;
}

.music_show {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background-color: white;
  border-radius: 50%;
}

.music_line {
  transition: all .3s;
}

.music_play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 25px;
  width: 6px;
  background: black;
  border-radius: 3px;
}

.music_play:nth-child(1) {
  transform: translate(calc(-50% - 7px), -50%);
}

.music_play:nth-child(2) {
  transform: translate(calc(-50% + 7px), -50%);
}

.music_play:nth-child(3) {
  opacity: 0;
}

.music_pause {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 25px;
  width: 6px;
  background: black;
  border-radius: 3px;
}

.music_pause:nth-child(1) {
  transform: translate(calc(-50% - 7px), -50%);
}

.music_pause:nth-child(2) {
  height: 20px;
  transform: translate(calc(-50% + 7px), calc(-50% - 5px)) rotate(135deg);
}

.music_pause:nth-child(3) {
  height: 20px;
  transform: translate(calc(-50% + 7px), calc(-50% + 5px)) rotate(-135deg);
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* 移动端适配样式 */
.mobile-enum-icon {
  width: 60px !important;
}

.mobile-enum-text {
  font-size: 12px !important;
  top: 60px !important;
  right: 50px !important;
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

@media screen and (max-width: 768px) {
  .mobile-content {
    width: 90% !important;
  }
}

.mobile-box {
  width: 100%;
  height: 23vh;
  margin-bottom: 2vh;
  padding: 0 10px;
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
    width: 75px;
    top: 50px;
    right: 40px;
    font-size: 14px;
  }

  .bottom-box {
    width: 100%;
    height: auto;
  }

  .bottom-title {
    position: static;
    margin-left: 5vw;
  }

  .bottom-content {
    position: static;
    margin-left: 5vw;
    margin-top: 5px;
    margin-bottom: 5px;
  }
}
</style>
