<script setup lang="ts">
import { Moon, Sunny } from '@element-plus/icons-vue';
import { ref, onBeforeMount, onMounted } from 'vue';
import axios from 'axios';
import BackBtn from '@/components/BackBtn.vue';
import { useGlobalStore } from '../../stores'


const globalStore = useGlobalStore();
const observer = ref<IntersectionObserver | null>(null)
const isDark = ref(false);
const top_text = ref('')
const isDark_animation = ref(false)
const isAnimating_sun = ref(false);  // 新增动画状态
const isAnimating_dark = ref(false);  // 新增动画状态
const praise_num = ref(0)
const is_praise = ref(false)
const is_commment = ref(false)
const visible_list = ref<string[]>([])
const drawer = ref(false);

onBeforeMount(async () => {
  // 获取一言
  const res = await axios.get('https://v1.hitokoto.cn/')
  top_text.value = res.data.hitokoto + '------《' + res.data.from + '》'
})

onMounted(() => {
  // 虚拟列表的实现
  observer.value = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLElement;
        visible_list.value.push(target.id)
        console.log(visible_list.value);
      } else {
        const target = entry.target as HTMLElement;
        visible_list.value = visible_list.value.filter(item => item !== target.id)
        console.log(visible_list.value);
      }
    })
  }, { threshold: 0, rootMargin: '0px' })
  document.querySelectorAll('.main-card').forEach((item) => {
    observer.value?.observe(item)
  })
})

const to_black = () => {
  isAnimating_sun.value = true;  // 开始动画
  isDark_animation.value = true
  document.querySelector('.body')?.classList.remove('bgc_w');
  document.querySelector('.body')?.classList.add('bgc_b');
  setTimeout(() => {
    isDark.value = true;
    document.querySelector('.body')?.classList.remove('bgc_bw');
    document.querySelector('.body')?.classList.add('bgc_bb');
    isAnimating_sun.value = false;  // 动画结束
  }, 1000);
}
const to_white = () => {
  isAnimating_dark.value = true;
  isDark_animation.value = false
  document.querySelector('.body')?.classList.remove('bgc_b');
  document.querySelector('.body')?.classList.add('bgc_w');
  setTimeout(() => {
    isDark.value = false;
    document.querySelector('.body')?.classList.remove('bgc_bb');
    document.querySelector('.body')?.classList.add('bgc_bw');
    isAnimating_dark.value = false;
  }, 1000);
}
const onPraise = (praise: boolean) => {
  if (praise) {
    is_praise.value = false
    praise_num.value--
  } else {
    is_praise.value = true
    praise_num.value++
  }
}

const onOrginal = () => {
  drawer.value = true
}
const back = () => {
  globalStore.setBackto_enum(true)
  window.history.back()
}
</script>

<template>
  <div class="bgc_w body">
    <!-- 顶部 -->
    <el-row class="top">
      <el-col :span="1"></el-col>
      <el-col :span="22" class="top-content">
        <div class="top-icon">
          <img src="../../assets/icon.png" alt="" style="width: 4vw;margin-right: 1vw;" />
          <div>梦翔树洞</div>
        </div>
        <div class="top-saying">
          <div style="margin-right: 1vw;">
            <div class="blue-circle1"></div>
            <div class="blue-circle2"></div>
            <div class="blue-circle3"></div>
            <div class="blue-circle2"></div>
            <div class="blue-circle1"></div>
          </div>
          <div class="top-text">{{ top_text }}</div>
          <div>
            <div class="yellow-circle1"></div>
            <div class="yellow-circle2"></div>
            <div class="yellow-circle3"></div>
            <div class="yellow-circle2"></div>
            <div class="yellow-circle1"></div>
          </div>
        </div>
        <div class="to-black change">
          <div class="top-sun" v-if="!isDark" @click="to_black" :class="{ 'top-sun-animation': isAnimating_sun }">
            <Sunny style="width: 2vw;color: red;margin: 1vh;transition:all 1.5s ;"
              :style="{ opacity: !isDark_animation ? 1 : 0 }" />
          </div>
          <div class="top-dark" v-if="isDark" @click="to_white" :class="{ 'top-dark-animation': isAnimating_dark }">
            <Moon style="width: 2vw;color: black;margin: 1vh; transition: all 1.5s;"
              :style="{ opacity: isDark_animation ? 1 : 0 }" />
          </div>
          <BackBtn @click="back" :color="isDark_animation ? 'yellow' : 'black'"></BackBtn>
        </div>
      </el-col>
      <el-col :span="1"></el-col>
    </el-row>
    <!-- 主题内容 -->
    <el-row class="main">
      <el-col :span="2"></el-col>
      <el-col :span="16" class="cards">
        <div class="main-card" id="0" :style="{ background: isDark_animation ? '#374151' : '#fff' }">
          <div class="card-top">
            <div class="card-avatar"> <img src="../../assets/main_pic1.jpg" alt="" class="card-avatar-img"> </div>
            <div class="card-top-aside">
              <div class="top-name">匿名</div>
              <div class="top-time" :style="{ color: isDark_animation ? '#ccd0db' : '#4b5563' }">20小时前</div>
            </div>
          </div>
          <div class="card-body">
            <div class="body-link" @click="drawer = true"><a href="#"
                :style="{ color: isDark_animation ? '#b4c6fa' : '#0866fe' }">@我此刻说一大堆也不知道要表达什么</a></div>
            <div class="body-text" :style="{ color: isDark_animation ? '#d1d5db' : '#203656' }">
              树洞君，今天都在讨论跨年！是啊，又一年过去了，一到年底负能量爆棚啦！25岁啦，年纪不小了！可是回头分析一看，工作上：工资那么少，专业技能掌握的也不是太熟练，竟然面临着辞职的风险。爱情上：今年谈了两段感情
              ，都是异地恋，第一个离开的很是坚决，第二个断断续续的联系，人真的不能太好吗？一心一意的对待，给人的感觉是盲目，所有离开的人，都在离开前给我发那么一张好人卡，我听够了你很好，但我觉得我们不合适这句话。家庭上：爸爸妈妈年纪越来越大了，可我还支撑不了这个家，我现在还是没办法让他们过上不用上班的日子，家里的压力也那么大。回头看看2015，我到底又做了些什么？难道我就那么笨吗？学不会这社会的游戏，获得不了一些好的结果吗？
            </div>
          </div>
          <div class="card-bottom">
            <div class="bottom-icons">
              <div class="praise" v-if="!is_praise" @click="onPraise(false)">
                <i class="iconfont icon-dianzan"></i> 点赞
              </div>
              <div class="praise" v-if="is_praise" @click="onPraise(true)">
                <i class="iconfont icon-dianzan" style="font-weight: 700;transition: all 1.5s;"
                  :style="{ color: isDark_animation ? 'skyblue' : 'blue' }"></i> {{ praise_num }}
              </div>
              <div class="original-text" @click="onOrginal">
                <i class="iconfont icon-yuanwenlianjie" style="font-size: 12px;font-weight: 200;"></i> &nbsp;原文
              </div>
              <div class="comment" @click="is_commment = !is_commment">
                <i class="iconfont icon-pinglun" style="font-weight: 600;"></i> 评论
              </div>
            </div>
            <transition name="fade">
              <div class="comment-place" v-if="is_commment">
                <textarea type="text" style="min-height: 20vh;width: 100%;" class="comment-textarea"
                  placeholder="你的评论可以一针见血!"></textarea>
                <div class="comment-buttons">
                  <el-button round type="danger" style="width: 10vw;" @click="is_commment = false">取消</el-button>
                  <el-button round type="primary" style="width: 10vw;">提交</el-button>
                </div>
              </div>
            </transition>
          </div>
        </div>
        <!-- <div class="main-card" id="1"></div>
        <div class="main-card" id="2"></div>
        <div class="main-card" id="3"></div>
        <div class="main-card" id="4"></div>
        <div class="main-card" id="5"></div>
        <div class="main-card" id="6"></div>
        <div class="main-card" id="7"></div> -->
      </el-col>
      <el-col :span="6" class="main-aside">
        <div class="aside-card1" :style="{ background: isDark_animation ? '#374151' : '#fff' }">
          <div class="aside-card1-top">
            <div class="card1-avatar" :style="{ 'border-color': isDark_animation ? '#374151' : '#fff' }"></div>
          </div>
          <div class="aside-card1-bottom">
            <div class="card1-bottom-name" :style="{ color: isDark_animation ? '#d1d5db' : '#203656' }">匿名</div>
            <div class="card1-bottom-text" :style="{ color: isDark_animation ? '#d1d5db' : '#203656' }">
              这是放用户座右铭的地方测试文本测试文本测试文本测试文本</div>
          </div>
        </div>
        <div class="aside-card2" :style="{ background: isDark_animation ? '#374151' : '#fff' }">
          <div class="aside-card2-top">
            <div class="aside-card-title" :style="{ background: isDark_animation ? '#374151' : '#fff' }">公告栏</div>
            <div class="spots">
              <div class="spot-1"></div>
              <div class="spot-2"></div>
              <div class="spot-3"></div>
            </div>
          </div>
          <div class="aside-card2-bottom" :style="{ background: isDark_animation ? '#374151' : '#fff' }">
            免责声明：本站所展示内容为网友投稿发布，如有侵权等违规信息，请联系客服进行删除处理！
          </div>
        </div>
      </el-col>
      <el-col :span="2"></el-col>
    </el-row>

    <!-- 原文抽屉 -->
    <el-drawer v-model="drawer" :with-header="false" :style="{ background: isDark_animation ? '#1f2937' : '#ebf0f6' }"
      size="40%">
      <div class="drawer">
        <div class="drawer-top">
          <div class="drawer-top-avatar">
            <img src="../../assets/main_pic1.jpg" alt=""
              style="width: 100%;height: 100%;object-fit: fill; border-radius: 15%;">
          </div>
          <div class="drawer-top-name">匿名</div>
          <div class="drawer-top-time" :style="{ color: isDark_animation ? '#ccd0db' : '#4b5563' }">20小时前</div>
          <div class="drawer-top-love" @click="onPraise(is_praise)">
            <i class="iconfont icon-dianzan-aixinshixin" style="font-size: 30px;"
              :style="{ color: is_praise ? 'red' : 'gray' }"></i>
          </div>
        </div>
        <div class="drawer-body">
          <div class="drawer-body-title" :style="{ color: isDark_animation ? '#b4c6fa' : '#0866fe' }">@我此刻说一大堆也不知道要表达什么
          </div>
          <div class="drawer-body-text">
            树洞君，今天都在讨论跨年！是啊，又一年过去了，一到年底负能量爆棚啦！25岁啦，年纪不小了！可是回头分析一看，工作上：工资那么少，专业技能掌握的也不是太熟练，竟然面临着辞职的风险。爱情上：今年谈了两段感情
            ，都是异地恋，第一个离开的很是坚决，第二个断断续续的联系，人真的不能太好吗？一心一意的对待，给人的感觉是盲目，所有离开的人，都在离开前给我发那么一张好人卡，我听够了你很好，但我觉得我们不合适这句话。家庭上：爸爸妈妈年纪越来越大了，可我还支撑不了这个家，我现在还是没办法让他们过上不用上班的日子，家里的压力也那么大。回头看看2015，我到底又做了些什么？难道我就那么笨吗？学不会这社会的游戏，获得不了一些好的结果吗？
          </div>
        </div>
        <div class="drawer-send-comment">
          <div class="drawer-send-comment-title">发表评论</div>
          <div class="comment-place">
            <textarea type="text" style="min-height: 20vh;width: 100%;" class="comment-textarea"
              placeholder="这里书写你的评论"></textarea>
            <div class="comment-buttons" style="justify-content: center;">
              <el-button round type="primary" style="width: 20vw;">提交</el-button>
            </div>
          </div>
        </div>

        <div class="drawer-bottom">
          <div class="drawer-bottom-title">评论列表</div>
          <div class="drawer-comment-card">
            <div class="drawer-comment-avatar">
              <img src="../../assets/main_pic2.jpg" alt=""
                style="width: 100%;height: 100%;object-fit: fill; border-radius: 50% 50% 10% 50%;">
            </div>
            <div class="drawer-comment-context" :style="{ background: isDark_animation ? '#374151' : '#fff' }">
              <div class="drawer-context-title">
                <div class="drawer-context-name">张三</div>
                <div class="drawer-context-time" :style="{ color: isDark_animation ? '#ccd0db' : '#4b5563' }">1小时前</div>
              </div>
              <div class="drawer-context-text">
                每一步成长都值得肯定！你已经在接纳自我和踏实行动的路上。大脑需要重启期，每天专注一个小目标（比如学习15分钟），积累就是力量。焦虑的反面是具体——把‘想做的事’拆解成‘今天能做的事’，你会发现自己比想象中更强大。慢慢来，但别停下，你值得被自己温柔以待
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped>
/* #region */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-in-out;
  overflow: hidden;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.fade-enter-to,
.fade-leave-from {
  max-height: 30vh;
  opacity: 1;
}

.body {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: color 0.5s ease;
  background-color: #ebf0f6;
  overflow-y: auto;
}

.bgc_bw {
  background-color: #ebf0f6;
}

.bgc_w {
  color: #203656;
}

.bgc_bb {
  background-color: #1f2937;
}

.bgc_b {
  color: #d1d5c1;
}

.top-content {
  display: flex;
  justify-content: space-between;
  margin-top: 5vh;
}

.top-icon {
  display: flex;
  align-items: center;
  font-size: 2vw;
  font-weight: 700;
  color: #29a66a;
}

.top-saying {
  display: flex;
  align-items: center;
}

.blue-circle1 {
  height: 5px;
  width: 5px;
  background: linear-gradient(to right, #6f88ff 0, #657be5 100%);
  margin-left: 10px;
}

.blue-circle2 {
  height: 5px;
  width: 5px;
  background: linear-gradient(to right, #6f88ff 0, #657be5 100%);
  margin-left: 5px;
}

.blue-circle3 {
  height: 5px;
  width: 5px;
  background: linear-gradient(to right, #6f88ff 0, #657be5 100%);
  margin-left: 0px;
}

.yellow-circle1 {
  height: 5px;
  width: 5px;
  background-color: #e5b065;
  margin-left: 0px;
}

.yellow-circle2 {
  height: 5px;
  width: 5px;
  background-color: #e5b065;
  margin-left: 5px;
}

.yellow-circle3 {
  height: 5px;
  width: 5px;
  background-color: #e5b065;
  margin-left: 10px;
}

.to-black {
  display: flex;
  gap: 1vw;
  justify-items: center;
  align-items: center;
  width: 8vw;
}

.top-sun,
.top-dark {
  position: relative;
  width: 3vw;
  height: 3vw;
  background-color: #d3d8dd;
  border-radius: 50%;
}

.top-sun::before {
  position: absolute;
  content: '';
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #1f2937;
  z-index: -1;
}

.top-sun-animation::before {
  position: absolute;
  top: 0;
  left: 0;
  content: '';
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #1f2937;
  transform: scale(99);
  transition: transform 2s ease;
}

.top-dark::before {
  position: absolute;
  content: '';
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #ebf0f6;
  z-index: -1;
}

.top-dark-animation::before {
  position: absolute;
  content: '';
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #ebf0f6;
  transform: scale(99);
  transition: transform 2s ease;
}

.cards {
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 4vh;
}

.main {
  margin-top: 8vh;
}

.main-card {
  width: 90%;
  min-height: 30vh;
  border-radius: 20px;
  box-shadow: 3px 3px 10px #9a96aa3b;
  transition: all 1.5s, height 0.5s ease;
  padding-top: 3vh;
  padding-left: 2vw;
  padding-right: 2vw;
  padding-bottom: 3vh;
  overflow: hidden;
}

.card-top {
  display: flex;
  flex-direction: row;
}

.card-top-aside {
  margin-left: 10px;
}

.card-avatar {
  width: 50px;
  height: 50px;
}

.card-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 10%;
}

.top-name {
  left: calc(60px + 2vw);
  font-size: 15px;
  font-weight: 500;
}

.top-time {
  margin-top: 10px;
  font-size: 12px;
  color: #4b5563;
}

.body-link {
  font-size: 16px;
  margin-top: 10px;
}

.card-bottom {
  transition: all 1.5s ease;
}

.body-text {
  position: relative;
  margin-top: 5px;
  font-size: 16px;
  line-height: 180%;
  letter-spacing: 0;
  color: #203656;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 5;
  -webkit-line-clamp: 5;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: calc(1.8em * 5);
}

.bottom-icons {
  display: flex;
  flex-direction: row;
  justify-content: start;
  margin-top: 10px;
  font-size: 14px;
  gap: 2vw;
  color: #5f8dee;
  padding-top: 1vh;
  padding-bottom: 2vh;
}

.praise,
.original-text,
.comment {
  cursor: pointer;
}

.comment-place {
  width: 100%;
  border-radius: 10px;
  transition: all 0.5s ease;
}

.comment-textarea {
  width: 100%;
  height: 20vh;
  background-color: #d3d8dd;
  border-radius: 10px;
  border: none;
  resize: none;
  padding-left: 1vw;
  padding-top: 1vh;
  padding-right: 1vw;
  font-size: 15px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.comment-buttons {
  display: flex;
  flex-direction: row;
  justify-content: end;
  margin-top: 2vh;
  gap: 2vw;
}

/* 侧边栏 */
.main-aside {
  display: flex;
  flex-direction: column;
  gap: 4vh;
}

.aside-card1 {
  position: sticky;
  top: 0;
  width: 80%;
  height: 40vh;
  border-radius: 20px;
  transition: all 1.5s;
  z-index: 1;
}

.aside-card1-top {
  width: 100%;
  height: 40%;
  background: url('../../assets/login_bgc.jpg');
  background-size: 100% 100%;
  border-radius: 20px 20px 0 0;
}

.card1-avatar {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  aspect-ratio: 1/1;
  background-size: 100% 100%;
  border-radius: 50%;
  background-color: #d3d8dd;
  background: url('../../assets/main_pic1.jpg') no-repeat center;
  background-size: 100% 100%;
  border: 5px solid #fff;
  transition: all 1.5s;
}

.card1-bottom-name {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
}

.card1-bottom-text {
  position: absolute;
  top: 84%;
  left: 10%;
  width: 80%;
  line-height: 130%;
  transform: translateY(-50%);
  text-align: center;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: calc(1.3em * 2);
}

.aside-card2 {
  position: sticky;
  top: 44vh;
  width: 80%;
  min-height: 30vh;
  border-radius: 20px;
  transition: all 1.5s;
}

.aside-card2-top {
  width: 100%;
  height: 20%;
  border-radius: 20px 20px 0 0;
  border-bottom: 1px solid #d3d8dd;
}

.aside-card-title {
  position: absolute;
  top: 1vh;
  left: 1.2vw;
  font-size: 18px;
  font-weight: 600;
  transition: all 1.5s;
}

.spot-1 {
  position: absolute;
  top: 1.7vh;
  width: 15px;
  height: 15px;
  background-color: #fc625d;
  border-radius: 50%;
  right: 6vw;
}

.spot-2 {
  position: absolute;
  top: 1.7vh;
  width: 15px;
  height: 15px;
  background-color: #fdbc40;
  border-radius: 50%;
  right: 4vw;
}

.spot-3 {
  position: absolute;
  top: 1.7vh;
  width: 15px;
  height: 15px;
  background-color: #35cd4b;
  border-radius: 50%;
  right: 2vw;
}

.aside-card2-bottom {
  padding-top: 2vh;
  padding-left: 1.2vw;
  padding-right: 1.2vw;
  font-size: 14px;
  line-height: 130%;
  letter-spacing: 0;
  transition: all 1.5s;
}

/* #endregion */
.drawer-top {
  position: relative;
  width: 100%;
}

.drawer-top-avatar {
  width: 70px;
  height: 70px;
}

.drawer-top-name {
  position: absolute;
  top: 5px;
  left: 80px;
}

.drawer-top-time {
  position: absolute;
  font-size: 14px;
  color: #4b5563;
  top: 50px;
  left: 80px;
}

.drawer-top-love {
  position: absolute;
  top: 20px;
  right: 2vw;
}

.drawer-body-title {
  width: 100%;
  margin-top: 4vh;
  padding-bottom: 3vh;
  margin-bottom: 3vh;
  border-bottom: 1px solid #dddddd;
}

.drawer-body-text {
  font-size: 16px;
  line-height: 1.8;
}

.drawer-send-comment {
  padding-top: 5vh;
}

.drawer-send-comment-title {
  font-weight: 700;
  margin-bottom: 3vh;
  padding-top: 2vh;
  border-top: 1px solid #dddddd;
}

.drawer-bottom {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 4vh;
  padding-top: 3vh;
  border-top: 1px solid #dddddd;
}

.drawer-bottom-title {
  margin-bottom: 3vh;
  font-weight: 700;
}

.drawer-comment-card {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: start;
  gap: 2vw;
  width: 100%;
  min-height: 15vh;
  padding-top: 2vh;
  padding-bottom: 2vh;
}

.drawer-comment-avatar {
  position: absolute;
  width: 10%;
  left: 0.3vw;
  aspect-ratio: 1/1;
  border-radius: 50%;
}

.drawer-comment-context {
  width: 87%;
  margin-left: 13%;
  background-color: pink;
  border-radius: 10px;
  padding: 3px;
}

.drawer-context-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 1vh;
  padding-left: 0.5vw;
  padding-right: 0.5vw;
  padding-bottom: 1vh;
  border-bottom: 1px solid #dddddd;
}

.drawer-context-name {
  font-size: 15px;
}

.drawer-context-time {
  font-size: 12px;
  color: #4b5563;
}

.drawer-context-text {
  padding-left: 0.5vw;
  padding-right: 0.5vw;
  margin-top: 1vh;
  font-size: 14px;
  line-height: 1.5;
  color: #999;
  padding-bottom: 1vh;
}
</style>
