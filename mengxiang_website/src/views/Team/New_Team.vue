<script setup lang="ts">
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
  life_text.classList.add('life-text-in')
}
const life_item1_out = (index: number) => {
  const life_text = document.querySelectorAll('.life-text')[index] as HTMLElement
  life_text.classList.remove('life-text-in')
  life_text.classList.add('life-text-out')
  setTimeout(() => {
    life_text.classList.remove('life-text-out')
  }, 500);
}
</script>

<template>
  <div class="new_team">
    <el-row>
      <el-col :span="24" class="vedio_container">
        <video
          src="http://vodpub6.v.news.cn/yqfbzx-original/20230818/20230818bd5de7446029436cb41e0ff2c37e1c54_606f38a617a746988c4bb396538066dd.mp4"
          width="100%" height="100%" muted loop autoplay class="video"></video>
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
      <el-col :span="22" class="content_text">
        <!-- 1 -->
        <div class="info_box">
          <div class="icon-item1" @mouseenter="icon_item_rotate"></div>
          <div class="info-title">用行动关心你的成长</div>
          <div class="info-line"></div>
          <div class="info-text">
            这里有着富有挑战和影响力的工作内容，完备的职业培训和晋升体系，以及灵活的内部转岗机制，引领你发现更多可能。
          </div>
        </div>
        <!-- 2 -->
        <div class="info_box">
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
        <div class="info_box">
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
        <div class="info_box">
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
    <el-row class="life">
      <el-col :span="2"></el-col>
      <el-col :span="14" class="life-item1" @mouseenter="life_item1_in(0)" @mouseleave="life_item1_out(0)">
        <div class="life-title">人才有活水,组织有活力</div>
        <div class="life-text">
          腾讯的活水文化，可以让你在多个舞台挥洒激情、获得持续成长。腾讯多元的业务布局会给你提供丰富的发展机会，
          所有工作机会都会对内部员工开放，只要工作满一年就可以自由申请内部转岗，
          每年都有1000+的腾讯员工通过活水机制找到更适合自己的工作岗位。
        </div>
      </el-col>
      <el-col :span="6" class="life-item2" @mouseenter="life_item1_in(1)" @mouseleave="life_item1_out(1)">
        <div class="life-title">梦翔公社</div>
        <div class="life-text" style="background: linear-gradient(to top,#0052d9,#00a9ce); padding-top: 25%">
          鹅民公社是腾讯弹性福利平台，你可以在公社自选健康、学习成长和鹅厂特色类福利，
          还可以向鹅民公社推荐你想要的福利，公社满足员工不同的个性化福利需求，
          从此和千人一面的“福利”说拜拜。
        </div>
      </el-col>
      <el-col :span="2"></el-col>
    </el-row>
  </div>
</template>

<style scoped>
@font-face {
  font-family: 'tencentFontW3';
  src: url(../../assets/font/南构无恙行书.ttf);
}

@font-face {
  font-family: 'ancientFont';
  src: url(../../assets/font/墨趣古风体.ttf);
}

.new_team {
  /* min-height: 100vh; */
  width: 100vw;
  background-color: #f7f7f7;
}

.vedio_container {
  height: 65vh;
  width: 100vw;
}

.video {
  object-fit: cover;
}

.title {
  margin-top: 10vh;
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
  margin-top: 5vh;
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
.life {
  margin-top: 5vh;
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
  opacity: 1;
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
  background: url(../../assets/login_bgc.jpg) no-repeat center;
  background-size: 100% 100%;
  transform-origin: bottom;
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
  background: url(../../assets/main_pic1.jpg) no-repeat center;
  background-size: 100% 100%;
  transform-origin: bottom;
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
  background-color: rgba(0, 169, 206, 0.5);
}
</style>
