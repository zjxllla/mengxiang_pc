<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ArrowDown, ArrowRight, Close, Menu } from '@element-plus/icons-vue'
import LoadingScreen from '../../components/LoadingScreen.vue'
import Myaxios, { baseURL } from '../../axios'
import webDirectionImage from '../../assets/main_box2.png'
import aiDirectionImage from '../../assets/main_box3.png'
import embeddedDirectionImage from '../../assets/main_box1.png'

const showLoading = ref(true)
const showMenu = ref(false)
const showDialog = ref(false)
const dialogImageUrl = ref('')
const activeDirection = ref(0)
const currentYear = new Date().getFullYear()
const foundingYears = currentYear - 2007
const startTime = Math.floor(Date.now() / 1000)

const awards = [
  'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/award_pic1_compressed.png',
  'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/award_pic2_compressed.jpg',
  'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/award_pic3_compressed.jpg',
  'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/award_pic4_compressed.png',
  'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/award_pic5_compressed.png',
  'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/award_pic6_compressed.jpg',
  'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/award_pic7_compressed.png',
  'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/award_pic8_compressed.png',
  'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/award_pic9_compressed.jpg',
]

const navItems = [
  { label: '首页', target: 'home' },
  { label: '关于我们', target: 'about' },
  { label: '成果与优势', target: 'achievements' },
]

const directions = [
  {
    index: '01',
    title: 'Web 与产品',
    description: '从界面设计到完整应用，学习把想法做成真正可用的产品。',
    detail: '视觉设计 · 前端开发 · 服务端 · 产品协作',
    image: webDirectionImage,
  },
  {
    index: '02',
    title: '人工智能',
    description: '探索数据、算法与智能应用，在真实课题中理解技术边界。',
    detail: '机器学习 · 数据分析 · 智能应用 · 算法实践',
    image: aiDirectionImage,
  },
  {
    index: '03',
    title: '嵌入式创新',
    description: '连接软件与硬件，用代码驱动设备，把创意带进现实世界。',
    detail: '单片机 · 物联网 · 硬件开发 · 创新实践',
    image: embeddedDirectionImage,
  },
]

const selectedDirection = computed(() => directions[activeDirection.value])

const strengths = [
  { value: '2007', label: '成立至今' },
  { value: '30+', label: '实践项目' },
  { value: '4', label: '技术方向' },
  { value: '∞', label: '成长可能' },
]

const scrollToSection = (target: string) => {
  showMenu.value = false
  document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
}

const previewAward = (src: string) => {
  dialogImageUrl.value = src
  showDialog.value = true
}

const finishLoading = () => {
  showLoading.value = false
}

const reportVisit = () => {
  const payload = JSON.stringify({
    time: Math.floor(Date.now() / 1000) - startTime,
    startTime,
  })
  navigator.sendBeacon(`${baseURL}/visit/set`, new Blob([payload], { type: 'application/json; charset=UTF-8' }))
}

onMounted(() => {
  Myaxios.get('/ip/get').catch((error) => console.error('Failed to get IP:', error))
  window.addEventListener('beforeunload', reportVisit)
  window.setTimeout(finishLoading, 700)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', reportVisit)
})
</script>

<template>
  <main class="home-page">
    <header class="site-header">
      <button class="brand" type="button" aria-label="返回首页" @click="scrollToSection('home')">
        <img class="brand__logo"
          src="https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/icon.png"
          alt="梦翔工作室标志">
        <span class="brand__name">梦翔工作室</span>
        <span class="brand__tag">MX STUDIO</span>
      </button>

      <nav class="desktop-nav" aria-label="主导航">
        <button v-for="item in navItems" :key="item.target" type="button" @click="scrollToSection(item.target)">
          {{ item.label }}
        </button>
        <RouterLink class="desktop-nav__join" to="/team/new">
          加入我们
          <el-icon><ArrowRight /></el-icon>
        </RouterLink>
      </nav>

      <button class="menu-button" type="button" aria-label="打开导航" @click="showMenu = true">
        <el-icon><Menu /></el-icon>
      </button>
    </header>

    <Transition name="menu-fade">
      <div v-if="showMenu" class="mobile-menu">
        <div class="mobile-menu__top">
          <span>MX STUDIO</span>
          <button type="button" aria-label="关闭导航" @click="showMenu = false">
            <el-icon><Close /></el-icon>
          </button>
        </div>
        <nav aria-label="移动端导航">
          <button v-for="(item, index) in navItems" :key="item.target" type="button"
            @click="scrollToSection(item.target)">
            <span>0{{ index + 1 }}</span>{{ item.label }}
          </button>
          <RouterLink to="/team/message">成员信息</RouterLink>
          <RouterLink to="/resource">梦翔树洞</RouterLink>
          <RouterLink to="/blog">梦翔博客</RouterLink>
          <RouterLink class="mobile-menu__join" to="/team/new">加入我们</RouterLink>
        </nav>
      </div>
    </Transition>

    <section id="home" class="hero">
      <div class="hero__frame" aria-hidden="true"></div>
      <div class="hero__emblem" aria-hidden="true">
        <span class="hero__orbit hero__orbit--outer"></span>
        <span class="hero__orbit hero__orbit--inner"></span>
        <img src="https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/icon.png" alt="">
        <strong>MX</strong>
      </div>
      <div class="hero__ticker" aria-hidden="true">
        <span>CODE · DESIGN · CREATE · GROW · CODE · DESIGN · CREATE · GROW</span>
      </div>

      <div class="hero__content">
        <p class="hero__eyebrow"><span></span>DREAM · CREATE · GROW</p>
        <h1>梦翔工作室</h1>
        <p class="hero__lead">一群年轻的创造者，在代码、设计与实践里，把热爱变成真正发生的事。</p>
        <div class="hero__actions">
          <RouterLink class="primary-action" to="/team/new">
            加入梦翔
            <el-icon><ArrowRight /></el-icon>
          </RouterLink>
          <button class="secondary-action" type="button" @click="scrollToSection('about')">了解我们</button>
        </div>
      </div>

      <div class="hero__meta">
        <span>EST. 2007</span>
        <span>LEARN BY BUILDING</span>
      </div>
      <button class="scroll-cue" type="button" aria-label="向下浏览" @click="scrollToSection('about')">
        <span>SCROLL TO EXPLORE</span>
        <el-icon><ArrowDown /></el-icon>
      </button>
    </section>

    <section id="about" class="about-section section-band">
      <div class="section-shell">
        <div class="section-heading">
          <div>
            <span class="section-heading__index">01 / ABOUT</span>
            <h2>不只学习技术，<br>更一起创造作品。</h2>
          </div>
          <p>
            梦翔工作室成立于 2007 年，是一个面向学生的学习实践型社团。我们以项目为课堂，
            在协作中积累经验，在持续探索中找到自己的方向。
          </p>
        </div>

        <div class="about-layout">
          <div class="about-visual">
            <Transition name="direction-image" mode="out-in">
              <img :key="selectedDirection.index" :src="selectedDirection.image"
                :alt="`${selectedDirection.title}方向插画`" loading="lazy">
            </Transition>
            <div class="about-visual__detail">
              <span>当前方向</span>
              <strong>{{ selectedDirection.title }}</strong>
              <p>{{ selectedDirection.detail }}</p>
            </div>
            <div class="about-visual__stamp">
              <strong>{{ foundingYears }}</strong>
              <span>年持续成长</span>
            </div>
          </div>
          <div class="direction-list">
            <button v-for="(direction, index) in directions" :key="direction.index" class="direction-item"
              :class="{ 'direction-item--active': activeDirection === index }" type="button"
              :aria-pressed="activeDirection === index" @click="activeDirection = index">
              <span>{{ direction.index }}</span>
              <div>
                <h3>{{ direction.title }}</h3>
                <p>{{ direction.description }}</p>
              </div>
              <el-icon><ArrowRight /></el-icon>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section id="achievements" class="achievements-section section-band">
      <div class="section-shell">
        <div class="section-heading section-heading--light">
          <div>
            <span class="section-heading__index">02 / ACHIEVEMENTS</span>
            <h2>每一次实践，<br>都有成果留下。</h2>
          </div>
          <p>竞赛、项目和团队成长共同构成了梦翔的故事。这里记录的不只是奖项，也是一次次突破舒适区的证明。</p>
        </div>

        <div class="stats-row">
          <div v-for="item in strengths" :key="item.label" class="stat-item">
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </div>
        </div>

        <div class="award-stage">
          <div class="award-stage__label">
            <span>SELECTED HONORS</span>
            <strong>部分荣誉</strong>
            <p>点击图片查看完整奖项</p>
          </div>
          <el-carousel class="award-carousel" height="min(50vw, 440px)" indicator-position="outside" :interval="4500">
            <el-carousel-item v-for="(award, index) in awards" :key="award">
              <button class="award-slide" type="button" @click="previewAward(award)">
                <img :src="award" :alt="`梦翔工作室奖项 ${index + 1}`" loading="lazy">
              </button>
            </el-carousel-item>
          </el-carousel>
        </div>

        <div class="quick-links">
          <RouterLink to="/team/message">
            <span>认识团队</span><strong>成员信息</strong><el-icon><ArrowRight /></el-icon>
          </RouterLink>
          <RouterLink to="/blog">
            <span>分享与沉淀</span><strong>梦翔博客</strong><el-icon><ArrowRight /></el-icon>
          </RouterLink>
          <RouterLink to="/resource">
            <span>交流与倾听</span><strong>梦翔树洞</strong><el-icon><ArrowRight /></el-icon>
          </RouterLink>
        </div>
      </div>
    </section>

    <div id="join" class="final-page">
      <section class="join-section">
        <div class="join-section__mark">MX</div>
        <div class="section-shell join-section__content">
          <span>MAKE SOMETHING REAL</span>
          <h2>下一件值得骄傲的作品，<br>从这里开始。</h2>
          <RouterLink class="primary-action primary-action--dark" to="/team/new">
            加入梦翔工作室
            <el-icon><ArrowRight /></el-icon>
          </RouterLink>
        </div>
      </section>

      <footer class="site-footer">
        <div class="site-footer__brand">
          <img src="https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/icon.png" alt="">
          <div><strong>梦翔工作室</strong><span>MX STUDIO · EST. 2007</span></div>
        </div>
        <div class="site-footer__links">
          <RouterLink to="/team/message">成员</RouterLink>
          <RouterLink to="/blog">博客</RouterLink>
          <RouterLink to="/resource">树洞</RouterLink>
          <a href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&group_code=1055107073" target="_blank"
            rel="noreferrer">联系我们</a>
        </div>
        <div class="site-footer__legal">
          <span>© {{ currentYear }} 梦翔工作室</span>
          <span>浙ICP备2025172341号</span>
          <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41010402003147" target="_blank"
            rel="noreferrer">
            <img src="../../assets/police.png" alt="">豫公网安备41010402003147号
          </a>
        </div>
      </footer>
    </div>

    <el-dialog v-model="showDialog" class="award-dialog" width="min(92vw, 820px)" align-center>
      <img class="award-dialog__image" :src="dialogImageUrl" alt="奖项大图">
    </el-dialog>

    <LoadingScreen v-if="showLoading" class="loading-screen" />
  </main>
</template>

<style scoped>
.home-page {
  --ink: #111416;
  --paper: #f2f1ec;
  --signal: #d7ff43;
  --coral: #ff654d;
  --line: rgba(17, 20, 22, 0.16);
  min-height: 100vh;
  color: var(--ink);
  background: var(--paper);
  font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
  letter-spacing: 0;
}

button,
a {
  font: inherit;
}

.site-header {
  position: absolute;
  inset: 0 0 auto;
  z-index: 20;
  height: 92px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(24px, 5vw, 76px);
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.22);
}

.brand {
  display: grid;
  grid-template-columns: 42px auto;
  grid-template-rows: 1fr 1fr;
  column-gap: 12px;
  align-items: center;
  padding: 0;
  color: inherit;
  background: none;
  border: 0;
  cursor: pointer;
  text-align: left;
}

.brand__logo {
  grid-row: 1 / 3;
  width: 42px;
  height: 42px;
  object-fit: contain;
}

.brand__name {
  align-self: end;
  font-weight: 700;
  font-size: 16px;
}

.brand__tag {
  align-self: start;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.62);
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: clamp(24px, 3vw, 48px);
}

.desktop-nav button,
.desktop-nav a {
  color: #fff;
  background: none;
  border: 0;
  cursor: pointer;
  font-size: 14px;
}

.desktop-nav button {
  position: relative;
  padding: 12px 0;
}

.desktop-nav button::after {
  content: "";
  position: absolute;
  left: 0;
  right: 100%;
  bottom: 4px;
  height: 2px;
  background: var(--signal);
  transition: right 0.25s ease;
}

.desktop-nav button:hover::after {
  right: 0;
}

.desktop-nav .desktop-nav__join {
  height: 44px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0 18px;
  color: var(--ink);
  background: var(--signal);
  font-weight: 700;
}

.menu-button {
  display: none;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.35);
  cursor: pointer;
  font-size: 22px;
}

.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  overflow: hidden;
  color: #fff;
  background: #12181b;
}

.hero__frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero__frame {
  inset: 116px clamp(24px, 5vw, 76px) 72px;
  width: auto;
  height: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: none;
}

.hero__emblem {
  position: absolute;
  right: clamp(70px, 10vw, 170px);
  top: 50%;
  width: clamp(300px, 36vw, 540px);
  aspect-ratio: 1;
  transform: translateY(-48%);
  display: grid;
  place-items: center;
}

.hero__emblem img {
  position: relative;
  z-index: 2;
  width: 34%;
  height: 34%;
  object-fit: contain;
  filter: drop-shadow(0 24px 38px rgba(0, 0, 0, 0.45));
  animation: emblem-float 4s ease-in-out infinite;
}

.hero__emblem strong {
  position: absolute;
  right: -5%;
  bottom: 8%;
  color: rgba(215, 255, 67, 0.12);
  font-size: clamp(100px, 14vw, 210px);
  line-height: 1;
  font-weight: 900;
}

.hero__orbit {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.18);
  animation: orbit-rotate 18s linear infinite;
}

.hero__orbit::before,
.hero__orbit::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--signal);
}

.hero__orbit::before {
  top: -5px;
  left: 20%;
}

.hero__orbit::after {
  right: -5px;
  bottom: 24%;
  background: var(--coral);
}

.hero__orbit--outer {
  inset: 0;
}

.hero__orbit--inner {
  inset: 17%;
  animation-direction: reverse;
  animation-duration: 12s;
}

.hero__ticker {
  position: absolute;
  right: 0;
  bottom: 104px;
  width: 48%;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.1);
  font-size: 13px;
  white-space: nowrap;
}

.hero__ticker span {
  display: inline-block;
  animation: ticker-move 14s linear infinite;
}

.hero__content {
  position: relative;
  z-index: 2;
  width: min(1120px, calc(100% - 48px));
  margin: 76px auto 0;
}

.hero__eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
  color: var(--signal);
  font-size: 12px;
  font-weight: 700;
}

.hero__eyebrow span {
  width: 32px;
  height: 2px;
  background: currentColor;
}

.hero h1 {
  max-width: 900px;
  margin: 0;
  font-size: clamp(64px, 10vw, 144px);
  line-height: 0.96;
  font-weight: 900;
  letter-spacing: 0;
  text-wrap: balance;
}

.hero__lead {
  max-width: 620px;
  margin: 28px 0 34px;
  font-size: clamp(17px, 1.6vw, 22px);
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.78);
}

.hero__actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.primary-action,
.secondary-action {
  min-height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 0 24px;
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.2s ease, background 0.2s ease;
}

.primary-action {
  color: var(--ink);
  background: var(--signal);
}

.secondary-action {
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.42);
}

.primary-action:hover,
.secondary-action:hover {
  transform: translateY(-2px);
}

.hero__meta {
  position: absolute;
  z-index: 2;
  left: clamp(24px, 5vw, 76px);
  bottom: 28px;
  display: flex;
  gap: 28px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.55);
}

.scroll-cue {
  position: absolute;
  z-index: 2;
  right: clamp(24px, 5vw, 76px);
  bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0;
  color: rgba(255, 255, 255, 0.72);
  background: none;
  border: 0;
  font-size: 10px;
  cursor: pointer;
}

.scroll-cue .el-icon {
  width: 34px;
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.36);
  animation: cue-bounce 1.8s ease-in-out infinite;
}

.section-band {
  min-height: 100svh;
  padding: clamp(72px, 9vh, 110px) 0;
}

.section-shell {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
}

.section-heading {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.75fr);
  gap: clamp(40px, 8vw, 110px);
  align-items: end;
  margin-bottom: clamp(54px, 7vw, 96px);
}

.section-heading__index {
  display: block;
  margin-bottom: 20px;
  color: #687073;
  font-size: 11px;
  font-weight: 700;
}

.section-heading h2 {
  margin: 0;
  font-size: clamp(38px, 5vw, 68px);
  line-height: 1.15;
  font-weight: 800;
}

.section-heading > p {
  margin: 0;
  color: #555d60;
  font-size: 16px;
  line-height: 1.9;
}

.about-layout {
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
  gap: clamp(36px, 6vw, 88px);
  align-items: stretch;
}

.about-visual {
  position: relative;
  min-height: 470px;
  overflow: hidden;
  background: #d9d9d3;
}

.about-visual > img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: clamp(48px, 6vw, 90px);
}

.about-visual__detail {
  position: absolute;
  left: 24px;
  bottom: 24px;
  max-width: calc(100% - 196px);
  display: flex;
  flex-direction: column;
}

.about-visual__detail span {
  color: #7d8587;
  font-size: 10px;
}

.about-visual__detail strong {
  margin-top: 5px;
  font-size: 19px;
}

.about-visual__detail p {
  margin: 6px 0 0;
  color: #646b6d;
  font-size: 11px;
  line-height: 1.6;
}

.about-visual__stamp {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 148px;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--ink);
  background: var(--signal);
}

.about-visual__stamp strong {
  font-size: 50px;
  line-height: 1;
}

.about-visual__stamp span {
  margin-top: 8px;
  font-size: 12px;
}

.direction-list {
  border-top: 1px solid var(--line);
}

.direction-item {
  min-height: 142px;
  width: 100%;
  display: grid;
  grid-template-columns: 42px 1fr 32px;
  gap: 20px;
  align-items: center;
  padding: 0;
  color: inherit;
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
  text-align: left;
  transition: padding 0.25s ease, background 0.25s ease;
}

.direction-item:hover {
  padding: 0 18px;
  background: #e7e7df;
}

.direction-item--active {
  padding: 0 18px;
  background: #e4e6dc;
}

.direction-item > span {
  color: #899093;
  font-size: 11px;
}

.direction-item h3 {
  margin: 0 0 8px;
  font-size: 22px;
}

.direction-item p {
  margin: 0;
  color: #606769;
  line-height: 1.7;
}

.direction-item .el-icon {
  font-size: 20px;
  transition: transform 0.25s ease;
}

.direction-item--active .el-icon {
  transform: rotate(90deg);
}

.direction-image-enter-active,
.direction-image-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.direction-image-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.direction-image-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.achievements-section {
  color: #fff;
  background: #14191b;
}

.section-heading--light .section-heading__index {
  color: var(--signal);
}

.section-heading--light > p {
  color: #9ca3a5;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  margin-bottom: clamp(64px, 8vw, 110px);
}

.stat-item {
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px clamp(16px, 3vw, 40px);
  border-right: 1px solid rgba(255, 255, 255, 0.18);
}

.stat-item:last-child {
  border-right: 0;
}

.stat-item strong {
  color: var(--signal);
  font-size: clamp(38px, 5vw, 64px);
  line-height: 1;
}

.stat-item span {
  margin-top: 12px;
  color: #9ca3a5;
  font-size: 13px;
}

.award-stage {
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr);
  gap: clamp(32px, 6vw, 80px);
  align-items: center;
}

.award-stage__label {
  align-self: start;
  padding-top: 28px;
}

.award-stage__label span {
  display: block;
  color: var(--coral);
  font-size: 10px;
  font-weight: 700;
}

.award-stage__label strong {
  display: block;
  margin-top: 12px;
  font-size: 25px;
}

.award-stage__label p {
  margin: 12px 0 0;
  color: #788083;
  font-size: 12px;
}

.award-carousel {
  min-width: 0;
}

.award-slide {
  width: 100%;
  height: 100%;
  padding: 0;
  background: #fff;
  border: 0;
  cursor: zoom-in;
}

.award-slide img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

:deep(.award-carousel .el-carousel__button) {
  width: 22px;
  height: 3px;
  background: var(--signal);
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 88px;
  border-top: 1px solid rgba(255, 255, 255, 0.18);
}

.quick-links a {
  min-height: 150px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 28px;
  color: #fff;
  border-right: 1px solid rgba(255, 255, 255, 0.18);
  transition: color 0.25s ease, background 0.25s ease;
}

.quick-links a:last-child {
  border-right: 0;
}

.quick-links a:hover {
  color: var(--ink);
  background: var(--signal);
}

.quick-links span {
  color: #899093;
  font-size: 11px;
}

.quick-links strong {
  margin-top: 10px;
  font-size: 22px;
}

.quick-links .el-icon {
  position: absolute;
  right: 28px;
  bottom: 30px;
}

.final-page {
  min-height: 100svh;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  background: var(--signal);
}

.join-section {
  position: relative;
  min-height: 0;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: var(--signal);
}

.join-section__mark {
  position: absolute;
  right: -24px;
  bottom: -110px;
  color: rgba(17, 20, 22, 0.08);
  font-size: 440px;
  line-height: 1;
  font-weight: 900;
  pointer-events: none;
}

.join-section__content {
  position: relative;
  z-index: 1;
}

.join-section__content > span {
  font-size: 11px;
  font-weight: 700;
}

.join-section h2 {
  max-width: 820px;
  margin: 20px 0 42px;
  font-size: clamp(44px, 6vw, 78px);
  line-height: 1.12;
}

.primary-action--dark {
  color: #fff;
  background: var(--ink);
}

.site-footer {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 40px;
  align-items: center;
  padding: 48px clamp(24px, 5vw, 76px);
  color: #fff;
  background: #0c0f10;
}

.site-footer__brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.site-footer__brand img {
  width: 42px;
  height: 42px;
  object-fit: contain;
}

.site-footer__brand div {
  display: flex;
  flex-direction: column;
}

.site-footer__brand span,
.site-footer__legal {
  color: #747b7e;
  font-size: 10px;
}

.site-footer__links {
  display: flex;
  gap: 26px;
}

.site-footer__links a,
.site-footer__legal a {
  color: #c2c7c8;
  font-size: 12px;
}

.site-footer__legal {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.site-footer__legal a {
  display: flex;
  align-items: center;
}

.site-footer__legal img {
  width: 14px;
  height: 14px;
  margin-right: 5px;
}

.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: none;
  padding: 24px;
  color: #fff;
  background: #101516;
}

.mobile-menu__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--signal);
  font-size: 12px;
  font-weight: 700;
}

.mobile-menu__top button {
  width: 44px;
  height: 44px;
  color: #fff;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.25);
  font-size: 22px;
}

.mobile-menu nav {
  display: flex;
  flex-direction: column;
  margin-top: 44px;
}

.mobile-menu nav button,
.mobile-menu nav a {
  min-height: 62px;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0;
  color: #fff;
  background: none;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  font-size: 22px;
  text-align: left;
}

.mobile-menu nav button span {
  color: #697174;
  font-size: 10px;
}

.mobile-menu nav .mobile-menu__join {
  justify-content: center;
  margin-top: 24px;
  color: var(--ink);
  background: var(--signal);
  border: 0;
  font-size: 16px;
  font-weight: 700;
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.25s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}

.award-dialog__image {
  width: 100%;
  max-height: 76vh;
  display: block;
  object-fit: contain;
}

.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 200;
}

@keyframes cue-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

@keyframes orbit-rotate {
  to { transform: rotate(360deg); }
}

@keyframes emblem-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

@keyframes ticker-move {
  from { transform: translateX(0); }
  to { transform: translateX(-40%); }
}

@media (max-width: 900px) {
  .site-header { height: 76px; }
  .desktop-nav { display: none; }
  .menu-button, .mobile-menu { display: flex; }
  .mobile-menu { flex-direction: column; }
  .section-heading, .about-layout { grid-template-columns: 1fr; }
  .section-heading { align-items: start; }
  .section-heading > p { max-width: 640px; }
  .about-visual { min-height: 400px; }
  .award-stage { grid-template-columns: 1fr; }
  .award-stage__label { padding-top: 0; }
  .site-footer { grid-template-columns: 1fr 1fr; }
  .site-footer__legal {
    grid-column: 1 / -1;
    align-items: flex-start;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }
}

@media (max-width: 600px) {
  .site-header { padding: 0 18px; }
  .brand__tag { display: none; }
  .brand { grid-template-rows: 1fr; }
  .brand__logo { grid-row: 1; width: 36px; height: 36px; }
  .hero { min-height: 100svh; }
  .hero__frame { inset: 94px 18px 62px; }
  .hero__emblem { right: -82px; top: 27%; width: 260px; opacity: 0.52; }
  .hero__emblem strong { right: 10%; bottom: -2%; }
  .hero__ticker { display: none; }
  .hero__content { width: calc(100% - 36px); margin-top: 42px; }
  .hero h1 { max-width: 340px; font-size: 62px; line-height: 1.02; }
  .hero__lead { max-width: 340px; margin: 22px 0 28px; font-size: 16px; line-height: 1.7; }
  .hero__actions { flex-direction: column; align-items: stretch; max-width: 240px; }
  .primary-action, .secondary-action { width: 100%; min-width: 0; padding: 0 16px; }
  .hero__meta { display: none; }
  .scroll-cue { left: 18px; right: auto; bottom: max(18px, env(safe-area-inset-bottom)); }
  .section-band { padding: 76px 0; }
  .section-shell { width: calc(100% - 36px); }
  .section-heading { gap: 26px; margin-bottom: 44px; }
  .section-heading h2 { font-size: 38px; }
  .section-heading > p { font-size: 14px; line-height: 1.85; }
  .about-visual { min-height: 310px; }
  .about-visual__stamp { width: 112px; }
  .about-visual__stamp strong { font-size: 38px; }
  .direction-item { min-height: 126px; grid-template-columns: 30px 1fr 20px; gap: 12px; }
  .direction-item:hover { padding: 0; background: transparent; }
  .direction-item--active { padding: 0 10px; background: #e4e6dc; }
  .direction-item h3 { font-size: 19px; }
  .direction-item p { font-size: 13px; }
  .stats-row { grid-template-columns: 1fr 1fr; margin-bottom: 64px; }
  .stat-item { min-height: 118px; border-bottom: 1px solid rgba(255, 255, 255, 0.18); }
  .stat-item:nth-child(2) { border-right: 0; }
  .stat-item:nth-child(n + 3) { border-bottom: 0; }
  .award-carousel { margin: 0 -18px; }
  .quick-links { grid-template-columns: 1fr; margin-top: 66px; }
  .quick-links a { min-height: 112px; padding: 22px 0; border-right: 0; border-bottom: 1px solid rgba(255, 255, 255, 0.18); }
  .quick-links a:hover { padding-left: 16px; }
  .join-section { min-height: 500px; }
  .join-section__mark { right: -10px; bottom: -42px; font-size: 190px; }
  .join-section h2 { margin-bottom: 34px; font-size: 42px; }
  .join-section .primary-action { width: fit-content; padding: 0 22px; }
  .site-footer { grid-template-columns: 1fr; gap: 30px; padding: 42px 18px; }
  .site-footer__links { flex-wrap: wrap; }
  .site-footer__legal { grid-column: auto; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
