<script setup lang="ts">
import { ref, onMounted } from 'vue'

const containerRef = ref<HTMLElement | null>(null)
const last_scroll = ref<number>(0)
onMounted(() => {
  const container = containerRef.value
  if (container) {
    container.addEventListener('scroll', () => {
      const scrollPosition = container.scrollTop
      const part1Height = document.getElementById('part1')?.offsetHeight || 0
      const part2Height = document.getElementById('part2')?.offsetHeight || 0

      if (scrollPosition > part1Height / 10 && scrollPosition < (part1Height + part2Height) / 2 && scrollPosition > last_scroll.value) {
        container.scrollTo({ top: part1Height, behavior: 'smooth' })
        last_scroll.value = scrollPosition
        console.log('一切二', last_scroll.value)
      } else if (scrollPosition < 9.9 * (part1Height / 10) && scrollPosition < last_scroll.value) {
        container.scrollTo({ top: 0, behavior: 'smooth' })
        last_scroll.value = scrollPosition
        console.log('二切一', last_scroll.value)
      } else if (scrollPosition > part1Height + part2Height / 10 && scrollPosition < part1Height + part2Height && scrollPosition > last_scroll.value) {
        container.scrollTo({ top: part1Height + part2Height, behavior: 'smooth' })
        last_scroll.value = scrollPosition
        console.log('二切三', last_scroll.value)
      } else if (scrollPosition < part1Height + 9.9 * (part2Height / 10) && scrollPosition < last_scroll.value) {
        container.scrollTo({ top: part1Height, behavior: 'smooth' })
        last_scroll.value = scrollPosition
        console.log('三切二', last_scroll.value)
      }
    })
  }
})
</script>

<template>
  <div class="container">
    <img src="../../assets/icon.png" alt="菜单" title="菜单" class="enum">
    <div class="enum_text">点我，前往菜单!</div>
    <el-row>
      <el-col :span="24">
        <div ref="containerRef" style="height: 100vh; overflow-y: auto;"> <!-- 确保容器可以垂直滚动 -->
          <div id="part1" style="height:100vh;" v-slidein> <!-- 确保每个部分的高度不超过视口 -->
            <div class="title_bgc">
              <h1 class="title">梦翔工作室</h1>
            </div>
          </div>
          <div id="part2" style="height:100vh;" v-slidein> <!-- 确保每个部分的高度不超过视口 -->
            <div class="about_us">
              <div class="context">
                <div class="section_title">关于我们</div>
                <div class="line"></div>
                <div class="content">
                  梦翔工作室成立于2007年，至今已经历了13年的成长。社团一直秉承“自强不息”的理念，不断提高，努力创新。梦翔社团自成立以来，紧跟软件发展方向，及时转变学习方向，让走出去的学生都能很快找到适合的就业岗位。梦翔社团有博学强识的带队老师，有认真负责的学长学姐，在这里你可以体会到家一般的温馨和睦。社团还拥有严格的管理制度，毕竟无规矩不成方圆，有制度的约束才可以让我们更好的成长；社团紧跟市场的要求技术，确立了人工智能，前端，小程序，嵌入式等系统学习研究的发展方向，现已成为web应用方向主力社团之一。梦翔人自强不息，先后承接并完成项目三十余项，并在各种比赛中赢得了诸多荣誉。我们的脚步从未停息...
                </div>
              </div>
            </div>
          </div>
          <div id="part3" style="height:100vh;" v-slidein> <!-- 确保每个部分的高度不超过视口 -->
            <div class="award">
              <div class="context">
                <div class="section_title">奖项展示</div>
                <div class="line"></div>
                <div class="content" style="display: flex; justify-content: center; align-items: center; height: 100%;">
                  <el-carousel :interval="4000" type="card" height="60vh" class="pictures">
                    <el-carousel-item v-for="item in 6" :key="item">
                      <h3 text="3xl" justify="center">{{ item }}</h3>
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" style="position: fixed; right: 20px; top: 50%; transform: translateY(-50%); z-index: 1000;">
        <el-anchor :container="containerRef" direction="vertical" type="default" :offset="0"
          style="background: transparent; padding: 0; border-radius: 0;">
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
  width: 140px;
  top: 65px;
  right: 55px;
  border: 1px solid white;
  border-radius: 10px 0 12px 10px;
  color: black;
  background-color: white;
  text-align: center;
}
.hide {
  opacity: 0;
}
.block {
  display: block;
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

.about_us::before {
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
}
</style>
