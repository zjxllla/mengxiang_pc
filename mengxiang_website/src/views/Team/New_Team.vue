<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import NewTeamButton from '../../components/NewTeamButton.vue'
import { useGlobalStore } from '../../stores'
import BackBtn from '@/components/BackBtn.vue';
import { baseURL } from '../../axios'
import { useRouter } from 'vue-router'
import axios from '@/axios'

const router = useRouter()
const observe = ref<IntersectionObserver | null>(null)
const video_ref = ref<HTMLVideoElement | null>(null)
const video_ref2 = ref<HTMLVideoElement | null>(null)
const life_item3_timer = ref<number | undefined>(0)
const count = ref(0)
const globalStore = useGlobalStore()
const isMobile = ref(globalStore.isMobile)
const listen_count = ref(0)
const start_time = ref(0)
const end_time = ref(0)
const stay_time = ref(0)
const dark_container_ref = ref<HTMLDivElement | null>(null)

onMounted(async () => {
  // 网站访问量
  await axios.get('/ip/get')
  start_time.value = Math.floor(+new Date() / 1000)
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

  // 开启轮播背景
  life_item_bgc_change()
  // 监听图标进入视口自动播放动画
  observe.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (listen_count.value === 4) {
        observe.value?.disconnect()
      }
      if (entry.isIntersecting) {
        const target = entry.target as HTMLElement
        if (target.classList.contains('icon-item1')) {
          icon_item_rotate()
          listen_count.value++
        } else if (target.classList.contains('icon-item2')) {
          icon_item2_rotate()
          listen_count.value++
        } else if (target.classList.contains('icon-item3')) {
          icon_item3_animate()
          listen_count.value++
        } else if (target.classList.contains('icon-item4')) {
          icon_item4_animate()
          listen_count.value++
        }
      }
    })
  }, { threshold: 0.9, rootMargin: '0px' })
  document.querySelectorAll('.icon-item1,.icon-item2,.icon-item3,.icon-item4').forEach((item) => {
    observe.value?.observe(item)
  })
})
onBeforeUnmount(() => {
  // 清除轮播背景
  clearInterval(life_item3_timer.value)
  // 清除视频播放
  if (video_ref.value || video_ref2.value) {
    video_ref.value?.pause()
    video_ref2.value?.pause()
  }
})
// 返回上一页
const back = () => {
  globalStore.setBackto_enum(true)
  router.go(-1)
}
// 第一个图标动画
const icon_item_rotate = () => {
  const icon_item = document.querySelector('.icon-item1') as HTMLElement
  icon_item.classList.add('icon-item1_active')
  setTimeout(() => {
    icon_item.classList.remove('icon-item1_active')
  }, 5000);
}
// 第二个图标动画
const icon_item2_rotate = () => {
  const icon_item2 = document.querySelector('.icon-item2-1') as HTMLElement
  icon_item2.classList.add('icon-item2_active1')
  setTimeout(() => {
    icon_item2.classList.remove('icon-item2_active1')
    icon_item2.classList.add('icon-item2_active2')
    setTimeout(() => {
      icon_item2.classList.remove('icon-item2_active2')
    }, 5000);
  }, 5000);
}
// 第三个图标动画
const icon_item3_animate = () => {
  const icon_item3_1 = document.querySelector('.icon-item3-1') as HTMLElement
  const icon_item3_2 = document.querySelector('.icon-item3-2') as HTMLElement
  const icon_item3_3 = document.querySelector('.icon-item3-3') as HTMLElement
  icon_item3_1.classList.add('icon-item3_activeout')
  setTimeout(() => {
    icon_item3_2.classList.add('icon-item3_activein')
    setTimeout(() => {
      icon_item3_2.classList.remove('icon-item3_activein')
      icon_item3_2.classList.add('icon-item3_activeout')
      icon_item3_3.classList.add('icon-item3_activein')
      setTimeout(() => {
        icon_item3_3.classList.remove('icon-item3_activein')
        icon_item3_3.classList.add('icon-item3_activeout')
        icon_item3_1.classList.remove('icon-item3_activeout')
        icon_item3_1.classList.add('icon-item3_activein')
        setTimeout(() => {
          icon_item3_1.classList.remove('icon-item3_activein')
          icon_item3_1.classList.remove('icon-item3_activeout')
          icon_item3_2.classList.remove('icon-item3_activeout')
          icon_item3_2.classList.remove('icon-item3_activein')
          icon_item3_3.classList.remove('icon-item3_activeout')
          icon_item3_3.classList.remove('icon-item3_activein')
        }, 2000)
      }, 2000)
    }, 2000)
  }, 800)
}
// 第四个图标动画
const icon_item4_animate = () => {
  const icon_item4_1 = document.querySelector('.icon-item4-1') as HTMLElement
  const icon_item4_2 = document.querySelector('.icon-item4-2') as HTMLElement
  const icon_item = document.querySelector('.icon-item4') as HTMLElement
  icon_item.classList.add('icon-item4_rotate')
  icon_item4_2.classList.add('icon-item4-2_activeout')
  setTimeout(() => {
    icon_item4_1.classList.add('icon-item4-1_activein')
    setTimeout(() => {
      icon_item4_2.classList.remove('icon-item4-2_activeout')
      icon_item4_1.classList.remove('icon-item4-1_activein')
      icon_item.classList.remove('icon-item4_rotate')

    }, 2500)
  }, 2500)
}
// life-item的动画
const life_item1_in = (index: number) => {
  const life_text = document.querySelectorAll('.life-text')[index] as HTMLElement
  if (index === 2) {
    clearInterval(life_item3_timer.value)
  }
  life_text.classList.add('life-text-in')

}
const life_item1_out = (index: number) => {
  const life_text = document.querySelectorAll('.life-text')[index] as HTMLElement
  if (index === 2) {
    life_item_bgc_change()
  }
  life_text.classList.remove('life-text-in')
  life_text.classList.add('life-text-out')
  setTimeout(() => {
    life_text.classList.remove('life-text-out')
  }, 500);
}
// life背景图片轮换
const life_item_bgc_change = () => {
  const life_item3_bgc1 = document.querySelector('.life-item3-bgc-1') as HTMLElement
  const life_item3_bgc2 = document.querySelector('.life-item3-bgc-2') as HTMLElement
  const life_item3_bgc3 = document.querySelector('.life-item3-bgc-3') as HTMLElement
  // 解决 setInterval 返回类型兼容性问题
  life_item3_timer.value = window.setInterval(() => {
    if (count.value % 4 == 0) {
      life_item3_bgc1.style.top = '-100%'
      life_item3_bgc2.style.top = '0'
      life_item3_bgc3.style.top = '100%'
      count.value++
    } else if (count.value % 4 == 1) {
      life_item3_bgc1.style.top = '-200%'
      life_item3_bgc2.style.top = '-100%'
      life_item3_bgc3.style.top = '0'
      count.value++
    } else if (count.value % 4 == 2) {
      life_item3_bgc1.style.top = '-100%'
      life_item3_bgc2.style.top = '0'
      life_item3_bgc3.style.top = '100%'
      count.value++
    } else if (count.value % 4 == 3) {
      life_item3_bgc1.style.top = '0'
      life_item3_bgc2.style.top = '100%'
      life_item3_bgc3.style.top = '200%'
      count.value++
    }
  }, 5000)
}
// 切换到登录页面
const ToLogin = () => {
  window.location.href = 'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=V0P7Mxz6Xsn0OsDU8icE3bkW7haPqF9b&authKey=93fETJ4VThAkBi068QdMnJ1YMhQ0tY2WhMZOXuBMTPwZy9k%2F90%2FZJtsqyWxPn8cf&noverify=0&group_code=1055107073'
}

const playVideo = (event: Event) => {
  const target = event.target as HTMLVideoElement
  target.play()
}

// dark显示
const mousemove = (e: MouseEvent) => {
  const { pageX, pageY } = e
  dark_container_ref.value?.style.setProperty('--left', pageX + 'px')
  dark_container_ref.value?.style.setProperty('--top', pageY + 'px')
}

const mouseleave = () => {
  dark_container_ref.value?.style.setProperty('--left', 10000 + 'px')
  dark_container_ref.value?.style.setProperty('--top', 10000 + 'px')
}

</script>

<template>
  <div class="back" :class="{ 'Mobile_back': isMobile }">
    <BackBtn @click="back" color="black"></BackBtn>
  </div>
  <div class="new_team">
    <el-row>
      <el-col :span="24" class="video_container" :class="{ 'mobile-video-container': isMobile }" @mousemove="mousemove"
        @mouseleave="mouseleave">
        <section class="light-container">
          <div class="light-title" :style="{ 'font-size': isMobile ? '35px' : '90px' }">梦翔，欢迎你！</div>
          <div class="light-text-bgc" v-for="i in 6" :key="i">
            <div class="light-text" v-for="i in 7" :key="i" :style="{ 'font-size': isMobile ? '20px' : '50px' }">M E N G
              X I A
              N G</div>
          </div>
        </section>
        <section class="dark-container" ref="dark_container_ref">
          <div class="dark-title" :style="{ 'font-size': isMobile ? '20px' : '60px' }">Welcome to MengXiang！</div>
          <div class="dark-text-bgc" v-for="i in 10" :key="i">
            <div class="dark-text" v-for="i in 7" :key="i" :style="{ 'font-size': isMobile ? '20px' : '50px' }">M E N G
              X I A N G</div>
          </div>
        </section>
      </el-col>
    </el-row>
    <el-row class="title">
      <el-col :span="2"></el-col>
      <el-col :span="22">
        <div class="title_text">为什么加入我们</div>
      </el-col>
    </el-row>
    <el-row class="content">
      <el-col :span="2"></el-col>
      <el-col :span="22" class="content_text" :class="{ 'mobile-content-text': isMobile }">
        <!-- 1 -->
        <div class="info_box" :class="{ 'mobile-info-box': isMobile }">
          <div class="icon-item1" @mouseenter="icon_item_rotate"></div>
          <div class="info-title">用行动关心你的成长</div>
          <div class="info-line"></div>
          <div class="info-text">
            这里有着富有挑战和影响力的工作内容，完备的职业培训和晋升体系，以及灵活的内部转岗机制，引领你发现更多可能。
          </div>
        </div>
        <!-- 2 -->
        <div class="info_box" :class="{ 'mobile-info-box': isMobile }">
          <div class="icon-item2" @mouseenter="icon_item2_rotate">
            <div class="icon-item2-1"></div>
          </div>
          <div class="info-title">迎接每个特别的你</div>
          <div class="info-line" style="background-color: #9B26B6;"></div>
          <div class="info-text">
            自由包容的文化氛围让你自由发展，你的声音会被认真聆听，在这里，你遇到的不只是同学，更是并肩成长的伙伴。
          </div>
        </div>
        <!-- 3 -->
        <div class="info_box" :class="{ 'mobile-info-box': isMobile }">
          <div class="icon-item3" @mouseenter="icon_item3_animate">
            <div class="icon-item3-1"></div>
            <div class="icon-item3-2"></div>
            <div class="icon-item3-3"></div>
          </div>
          <div class="info-title">福利关怀浸透你的生活</div>
          <div class="info-line" style="background-color: #FF671F;"></div>
          <div class="info-text">
            你的努力会被铭记，你的付出会被真诚对待，舒适与科技融合的社团环境，极具竞争力的薪酬和激励体系，完善和个性化成员福利，只为回报你的尽心拼搏。
          </div>
        </div>
        <!-- 4 -->
        <div class="info_box" :class="{ 'mobile-info-box': isMobile }">
          <div class="icon-item4" @mouseenter="icon_item4_animate">
            <div class="icon-item4-1"></div>
            <div class="icon-item4-2"></div>
          </div>
          <div class="info-title">智慧连接,美好生活</div>
          <div class="info-line" style="background-color: #00A9CE;"></div>
          <div class="info-text">
            长期致力于社交平台与数字内容两大核心业务，积极拥抱互联网，努力成为各行各业数字化助手，通过连接，提升每一个人的自我价值。
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="title">
      <el-col :span="2"></el-col>
      <el-col :span="22">
        <div class="title_text">社团日常活动</div>
      </el-col>
    </el-row>
    <el-row class="life" v-if="!isMobile">
      <el-col :span="2"></el-col>
      <el-col :span="14" class="life-item1" @mouseenter="life_item1_in(0)" @mouseleave="life_item1_out(0)">
        <div class="life-title">人才有活水,组织有活力</div>
        <div class="life-text">
          梦翔工作室以“人才有活水，组织有活力”为理念，通过举办多样化的活动，如创意比赛、技能培训等，激发成员潜能，培养创新思维。
          同时，工作室注重团队协作，鼓励成员积极参与项目实践，让人才在实践中成长，为组织注入源源不断的活力，推动社团持续发展。
        </div>
      </el-col>
      <el-col :span="6" class="life-item2" @mouseenter="life_item1_in(1)" @mouseleave="life_item1_out(1)">
        <div class="life-title">梦翔公社</div>
        <div class="life-text" style="background: linear-gradient(to top,#0052d9,#02fae9); padding-top: 25%">
          梦翔社团是由大学生们自发组织的充满活力与创造力的社团。在这里，同学们汇聚一堂，共同追求梦想，探索未知。
          社团以“梦翔公社”为平台，举办各类活动，如创意分享会、学术讲座、团队拓展等，旨在激发成员的创造力，培养团队合作精神，提升综合素质。
        </div>
      </el-col>
      <el-col :span="2"></el-col>
    </el-row>
    <el-row class="life" v-if="!isMobile">
      <el-col :span="2"></el-col>
      <el-col :span="8" class="life-item3" @mouseenter="life_item1_in(2)" @mouseleave="life_item1_out(2)">
        <div class="life-item3-bgc-1"></div>
        <div class="life-item3-bgc-2"></div>
        <div class="life-item3-bgc-3"></div>
        <div class="life-title">MengXiang Talk</div>
        <div class="life-text" style="background: linear-gradient(to top,#03576a,#02fae9);padding-top: 20%;">
          在当今信息爆炸的时代，知识的传播与思想的交流愈发重要。而在这片广阔的交流天地中，梦翔工作室犹如一颗璀璨的星辰，以其独特的 Mengxiang Talk 系列活动，闪耀着独特的光芒，为同学们带来了全新的思想盛宴。
        </div>
      </el-col>
      <el-col :span="12" class="life-item4" @mouseenter="life_item1_in(3)" @mouseleave="life_item1_out(3)">
        <div class="life-title">梦翔 Party</div>
        <div class="life-text" style="background: linear-gradient(to top,#598d00,#a6ff0e);padding-top: 15%;">
          梦翔Party是一场充满活力与创意的社交盛会。在这里，参与者们不仅能享受精彩的音乐和美食，还能与志同道合的朋友交流互动。工作室精心设计了各种趣味游戏和互动环节，让现场气氛热烈而温馨。
        </div>
      </el-col>
      <el-col :span="2"></el-col>
    </el-row>
    <el-row class="life" v-if="!isMobile">
      <el-col :span="2"></el-col>
      <el-col :span="10" class="life-item5" @mouseenter="life_item1_in(4)" @mouseleave="life_item1_out(4)">
        <div class="life-title">假期生活</div>
        <div class="life-text" style="background: linear-gradient(to top,red,pink);padding-top: 15%;">
          梦翔工作室的假期生活，是把键盘带到海边：上午用Python追浪，下午让树莓派晒盐，夜里在篝火旁commit星空。代码随潮汐迭代，灵感伴萤火开源；我们带着满格电量与海风编译的创意归来，为新学期注入更鲜活的0与1。
        </div>
      </el-col>
      <el-col :span="10" class="life-item6" @mouseenter="life_item1_in(5)" @mouseleave="life_item1_out(5)">
        <div class="life-item6-video">
          <video preload="auto" src="https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/vedio/add_us.mp4"
            width="100%" height="100%" muted loop autoplay playsinline webkit-playsinline x5-playsinline
            x5-video-player-type="h5" x5-video-player-fullscreen="true" class="video" ref="video_ref2"
            poster="https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/vedio/add_us_poster.jpg"
            @click="playVideo"></video>
        </div>
        <div class="life-title">加入我们</div>
        <div class="life-text" style="background: linear-gradient(to top,#c201f8,#eeb3ff);">
          <NewTeamButton class="life-item6-btn" @click="ToLogin"></NewTeamButton>
        </div>
      </el-col>
      <el-col :span="2"></el-col>
    </el-row>

    <!-- 移动端life -->
    <el-row class="life" v-if="isMobile">
      <el-col :span="24" class="life-item1" @mouseenter="life_item1_in(0)" @mouseleave="life_item1_out(0)">
        <div class="life-title">人才有活水,组织有活力</div>
        <div class="life-text" style="padding-top: 13vh ;">
          梦翔工作室以“人才有活水，组织有活力”为理念，通过举办多样化的活动，如创意比赛、技能培训等，激发成员潜能，培养创新思维。
          同时，工作室注重团队协作，鼓励成员积极参与项目实践，让人才在实践中成长，为组织注入源源不断的活力，推动社团持续发展。
        </div>
      </el-col>
    </el-row>
    <el-row class="life" v-if="isMobile">
      <el-col :span="24" class="life-item2" @mouseenter="life_item1_in(1)" @mouseleave="life_item1_out(1)">
        <div class="life-title">梦翔公社</div>
        <div class="life-text" style="background: linear-gradient(to top,#0052d9,#02fae9); padding-top: 13vh">
          梦翔社团是由大学生们自发组织的充满活力与创造力的社团。在这里，同学们汇聚一堂，共同追求梦想，探索未知。
          社团以“梦翔公社”为平台，举办各类活动，如创意分享会、学术讲座、团队拓展等，旨在激发成员的创造力，培养团队合作精神，提升综合素质。
        </div>
      </el-col>
    </el-row>
    <el-row class="life" v-if="isMobile">
      <el-col :span="24" class="life-item3" @mouseenter="life_item1_in(2)" @mouseleave="life_item1_out(2)">
        <div class="life-item3-bgc-1"></div>
        <div class="life-item3-bgc-2"></div>
        <div class="life-item3-bgc-3"></div>
        <div class="life-title">MengXiang Talk</div>
        <div class="life-text" style="background: linear-gradient(to top,#03576a,#02fae9);padding-top: 20%;">
          在当今信息爆炸的时代，知识的传播与思想的交流愈发重要。而在这片广阔的交流天地中，梦翔工作室犹如一颗璀璨的星辰，以其独特的 Mengxiang Talk 系列活动，闪耀着独特的光芒，为同学们带来了全新的思想盛宴。
        </div>
      </el-col>
    </el-row>
    <el-row class="life" v-if="isMobile">
      <el-col :span="24" class="life-item4" @mouseenter="life_item1_in(3)" @mouseleave="life_item1_out(3)">
        <div class="life-title">梦翔 Party</div>
        <div class="life-text" style="background: linear-gradient(to top,#598d00,#a6ff0e);padding-top: 13vh;">
          梦翔Party是一场充满活力与创意的社交盛会。在这里，参与者们不仅能享受精彩的音乐和美食，还能与志同道合的朋友交流互动。工作室精心设计了各种趣味游戏和互动环节，让现场气氛热烈而温馨。
        </div>
      </el-col>
    </el-row>
    <el-row class="life" v-if="isMobile">
      <el-col :span="24" class="life-item5" @mouseenter="life_item1_in(4)" @mouseleave="life_item1_out(4)">
        <div class="life-title">假期生活</div>
        <div class="life-text" style="background: linear-gradient(to top,red,pink);padding-top: 13vh;">
          梦翔工作室的假期生活，是把键盘带到海边：上午用Python追浪，下午让树莓派晒盐，夜里在篝火旁commit星空。代码随潮汐迭代，灵感伴萤火开源；我们带着满格电量与海风编译的创意归来，为新学期注入更鲜活的0与1。
        </div>
      </el-col>
    </el-row>
    <el-row class="life" v-if="isMobile">
      <el-col :span="24" class="life-item6" @mouseenter="life_item1_in(5)" @mouseleave="life_item1_out(5)">
        <div class="life-item6-video">
          <video src="https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/vedio/add_us.mp4" width="100%"
            height="100%" muted loop autoplay playsinline webkit-playsinline x5-playsinline x5-video-player-type="h5"
            x5-video-player-fullscreen="true" class="video"
            poster="https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/vedio/add_us_poster.jpg"
            @click="playVideo"></video>
        </div>
        <div class="life-title">加入我们</div>
        <div class="life-text" style="background: linear-gradient(to top,#c201f8,#eeb3ff);">
          <NewTeamButton class="life-item6-btn" @click="ToLogin" style="margin-left: 21vw;"></NewTeamButton>
        </div>
      </el-col>
    </el-row>
    <el-row class="space"></el-row>
  </div>
</template>

<style scoped>
@font-face {
  font-family: 'tencentFontW3';
  src: url(https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/font/%E5%8D%97%E6%9E%84%E6%97%A0%E6%81%99%E8%A1%8C%E4%B9%A6.ttf);
}

@font-face {
  font-family: 'ancientFont';
  src: url(https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/font/%E5%A2%A8%E8%B6%A3%E5%8F%A4%E9%A3%8E%E4%BD%93.ttf);
}

.back {
  position: fixed;
  top: 4vh;
  left: 1vh;
  z-index: 1;
}

.Mobile_back {
  top: 5vh;
  left: 85vw;
}

.new_team {
  width: 100vw;
  background-color: #f7f7f7;
}

.video_container {
  position: relative;
  height: 85vh;
  width: 100vw;
  cursor: crosshair;
  z-index: 1;
}

.light-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  width: 100%;
  height: 100%;
  background: #faf7f5;
  border-bottom: 3px solid rgba(0, 0, 0, .3);
  overflow: hidden;
}

.light-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 90px;
  font-weight: 700;
  letter-spacing: .35rem;
  z-index: 1;
  white-space: nowrap;
}

.light-text-bgc {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: .7rem;
  width: 100%;
  height: 15%;
}

.light-text-bgc:nth-child(2n) {
  transform: translateX(-200px);
}

.light-text {
  flex-shrink: 0;
  color: #edeae9;
  font-size: 50px;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: .5rem;
}

.dark-container {
  --top: -1000%;
  --left: -1000%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  width: 100%;
  height: 100%;
  background: black;
  z-index: 1;
  clip-path: circle(15vw at var(--left) var(--top));
  overflow: hidden;
}

.dark-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 60px;
  font-weight: 700;
  letter-spacing: .2rem;
  z-index: 1;
  color: white;
  white-space: nowrap;
}

.dark-text-bgc {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: .5rem;
  width: 100%;
  height: 10%;
}

.dark-text-bgc:nth-child(2n) {
  transform: translateX(-200px);
}

.dark-text {
  flex-shrink: 0;
  color: #1f1f1f;
  font-size: 30px;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: .4rem;
}

.title {
  margin-top: 10vh;
  margin-bottom: 5vh;
}

.title_text {
  position: relative;
  font-size: 32px;
  line-height: 32px;
  color: #323232;
  padding-left: 24px;
  font-family: 'tencentFontW3', 'microsoft yahei';
}

.title_text::after {
  content: "";
  position: absolute;
  left: 0;
  top: 6px;
  width: 8px;
  height: 26px;
  background-image: url(../../assets/new-line.png);
  background-repeat: no-repeat;
  background-size: 8px 26px;
  background-position: 0 bottom;
}

.content {
  padding-bottom: 10vh;
}

.content_text {
  display: flex;
  justify-content: start;
  align-items: start;
  gap: 32px
}

.info_box {
  width: 23%;
  max-width: 256px;
  display: flex;
  flex-direction: column;
  align-items: start;
}

/* 第一个图标 */
.icon-item1 {
  position: relative;
  width: 64px;
  height: 64px;
  background: url(../../assets/index-icon-1.png) no-repeat center;
  background-size: 56px 56px;
  margin-bottom: 16px;
}

.icon-item1_active {
  transform: rotate(360deg);
  transition: 5s transform cubic-bezier(0, 0, 0, 1);
}

/* 第二个图标 */
.icon-item2 {
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 4px solid #0052d9;
  overflow: hidden;
  margin-bottom: 28px;
}

.icon-item2-1 {
  position: absolute;
  top: 4px;
  left: -5px;
  width: 163px;
  height: 215px;
  background: url(../../assets/icon-item2-bgc.png) no-repeat center;
  background-size: 163px 215px;
  transform: translate(0, 0);
  transition: 5s transform cubic-bezier(0, 0, 0, 1);
}

.icon-item2_active1 {
  transform: translate(-78px, -134px);
}

.icon-item2_active2 {
  transform: translate(0, 0);
}

/* 第三个图标 */
.icon-item3 {
  position: relative;
  width: 64px;
  height: 64px;
  background: url(../../assets/icon-item3.png) no-repeat center;
  background-size: 56px 56px;
  margin-bottom: 16px;
}

.icon-item3-1 {
  position: absolute;
  top: 23px;
  left: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 4px solid #ff671f;
  transform-origin: left;
}

.icon-item3-2 {
  opacity: 0;
  scale: 0;
  position: absolute;
  top: 10px;
  left: 30px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 4px solid #ff671f;
  transform-origin: top;
}

.icon-item3-3 {
  opacity: 0;
  scale: 0;
  position: absolute;
  bottom: 10px;
  right: 15px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 4px solid #ff671f;
  transform-origin: 80% 100%;
}

.icon-item3_activein {
  opacity: 1;
  scale: 1;
  transition: 2s all cubic-bezier(0, 0, 0, 1);
}

.icon-item3_activeout {
  opacity: 0;
  scale: 0;
  transition: 1s all cubic-bezier(0, 0, 0, 1);
}

/* 第四个图标 */
.icon-item4 {
  position: relative;
  width: 64px;
  height: 64px;
  background: url(../../assets/icon-item3.png) no-repeat center;
  background-size: 56px 56px;
  margin-bottom: 16px;
}

.icon-item4::after {
  content: '';
  display: block;
  width: 64px;
  height: 37px;
  position: absolute;
  top: 13px;
  left: 0;
  background: url(../../assets/icon-item4-bgc.png) no-repeat;
  background-size: 52px 37px;
  background-position: 6px center;
}

.icon-item4-1 {
  opacity: 0;
  width: 24px;
  height: 24px;
  position: absolute;
  background: url(../../assets/icon-item4-c1.png) no-repeat;
  border-radius: 50%;
  background-size: 100% 100%;
  transform-origin: center;
  transform: translate(55px, -15px);
}

.icon-item4-2 {
  width: 24px;
  height: 24px;
  position: absolute;
  top: 5px;
  left: 35px;
  background: url(../../assets/icon-item4-c1.png) no-repeat;
  border-radius: 50%;
  background-size: 100% 100%;
  transform-origin: center;
}

.icon-item4-1_activein {
  opacity: 1;
  transform: translate(35px, 4px);
  transition: 2.5s all cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-item4-2_activeout {
  opacity: 0;
  scale: 0.2;
  transform: translate(-130px, 125px);
  transition: 2.5s all cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-item4_rotate::after {
  transform: rotate(360deg);
  transition: 5s transform cubic-bezier(0.4, 0, 0.2, 1);
}

.info-title {
  font-size: 22px;
  line-height: 32px;
  color: #323232;
  margin-bottom: 16px;
  font-weight: 600;
}

.info-line {
  height: 4px;
  width: 100%;
  background-color: #79C000;
  margin-bottom: 16px;
}

.info-text {
  font-size: 14px;
  color: #666;
  line-height: 24px;
}

/* 社团活动板块 */
.life:nth-child(1) {
  margin-top: 5vh;
}

.life {
  height: 35vh;
  padding-bottom: 0;
}

.life-title {
  position: absolute;
  top: 15%;
  left: 5%;
  color: #fff;
  font-size: 28px;
  line-height: 44px;
  z-index: 2;
  font-family: 'ancientFont';
}

.life-text {
  width: 100%;
  height: 100%;
  opacity: 0;
  position: absolute;
  top: 100%;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 10%;
  color: #fff;
  font-size: 14px;
  line-height: 24px;
  transition: 0.5s all ease-in-out;
  background: linear-gradient(to top, black, #666);
  z-index: 1;
}

/* 从底向上进入 */
.life-text-in {
  opacity: 1;
  top: 0%;
}

.life-text-out {
  opacity: 0;
  top: 100%;
}

/* 第一个life */
.life-item1 {
  position: relative;
  width: 100%;
  height: 100%;
  background: url('https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/login_bgc.jpg') no-repeat center;
  background-size: 100% 100%;
  overflow: hidden;
}

.life-item1::after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

/* 第二个life */
.life-item2 {
  position: relative;
  width: 100%;
  height: 100%;
  background: url('https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/main_pic1.jpg') no-repeat center;
  background-size: 100% 100%;
  overflow: hidden;
}

.life-item2::after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(4, 142, 173, 0.6);
}

/* 第三个life */
.life-item3 {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.life-item3::after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(6, 143, 134, 0.6);
}

.life-item3-bgc-1 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/main_pic2.jpg') no-repeat center;
  background-size: 100% 100%;
  transition: 1s all;
}

.life-item3-bgc-2 {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/main_pic2.jpg') no-repeat center;
  background-size: 100% 100%;
  transition: 1s all;
}

.life-item3-bgc-3 {
  position: absolute;
  top: 200%;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/main_pic1.jpg') no-repeat center;
  background-size: 100% 100%;
  transition: 1s all;
}

/* 第四个life */
.life-item4 {
  position: relative;
  width: 100%;
  height: 100%;
  background: url('https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/main_pic3.jpg') no-repeat center;
  background-size: 100% 100%;
  overflow: hidden;
}

.life-item4::after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(121, 192, 0, 0.4);
}

/* 第五个life */
.life-item5 {
  position: relative;
  width: 100%;
  height: 100%;
  background: url('https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/main_pic2.jpg') no-repeat center;
  background-size: 100% 100%;
  overflow: hidden;
}

.life-item5::after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(245, 126, 126, 0.4);
}

/* 第六个life */
.life-item6 {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  overflow: hidden;
}

.life-item6::after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(128, 8, 158, 0.35);
}

.life-item6-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.life-item6-btn {
  margin-top: 10vh;
  margin-left: 28vh;
}

.space {
  height: 10vh;
}

/* 移动端适配 */
.mobile-video-container {
  height: 30vh;
}

.mobile-content-text {
  flex-direction: column;
  align-items: start;
  gap: 24px;
}

.mobile-info-box {
  width: 100%;
}

.mobile-life {
  display: flex;
  flex-direction: column;
  height: 50vh;
}
</style>
