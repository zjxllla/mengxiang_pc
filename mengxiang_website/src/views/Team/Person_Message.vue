<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import { useGlobalStore } from '../../stores';
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import BackBtn from '@/components/BackBtn.vue';
import type { User } from '../../Types/user'
import axios from '@/axios'

const drawer_data = ref({})
const drawer = ref(false)

const globalStore = useGlobalStore();
const isMobile = ref(globalStore.isMobile);
const drop_menu = ref(isMobile.value ? '筛选' : '筛选信息');
const avatar_boy = 'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/default_avatar_boy.png'
const avatar_gril = 'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/default_avatar_girl.png'
const waterfallSettings = ref({
  gap: 30,
  useObserve: true,
  useLazyload: true,
  breakpoints: {
    1800: { rowPerView: 5 },
    1200: { rowPerView: 4 },
    800: { rowPerView: 2 },
    500: { rowPerView: 1 },
  },
  bgc: 'transparent',
});
const members = ref<User[]>([])
const freshmanMembers = ref<User[]>([
])
onBeforeMount(async () => {
  // 获取用户信息
  const res = await axios.get('/user/all')
  if (res.data.status === 1) {
    members.value = res.data.message
    freshmanMembers.value = res.data.message
    console.log(members.value)
  }
})
const back = () => {
  globalStore.setBackto_enum(true)
  window.history.back()
}
const click = (event: Event) => {
  const label = (event.target as HTMLLabelElement).textContent?.trim();
  if (label === '全部') {
    drop_menu.value = label;
    freshmanMembers.value = members.value
    return
  }
  if (label) {
    drop_menu.value = label;
    freshmanMembers.value = members.value.filter(member => member.grade === label);
  }
}

const copy = async (num: number, event: MouseEvent) => {
  event.stopPropagation();
  const tel = freshmanMembers.value[num].tel;

  try {
    // 方法1：优先使用现代API
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(tel);
    }
    // 方法2：降级方案（兼容移动端）
    else {
      const textarea = document.createElement('textarea');
      textarea.value = tel;
      textarea.style.position = 'fixed';  // 防止页面滚动
      document.body.appendChild(textarea);
      textarea.select();

      // 兼容iOS
      if (navigator.userAgent.match(/ipad|iphone/i)) {
        const range = document.createRange();
        range.selectNodeContents(textarea);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        textarea.setSelectionRange(0, 999999);
      }

      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    ElMessage({
      message: `已复制电话号码：${tel}`,
      type: 'success',
      duration: 2000
    });
  } catch (err) {
    console.error('复制失败:', err);
    ElMessage({
      message: '复制失败，请手动长按号码复制',
      type: 'error',
      duration: 2000
    });
  }
}

const expand = (num: number) => {
  drawer.value = true
  drawer_data.value = freshmanMembers.value[num]
}
</script>

<template>
  <div class="back" :class="{ Mobile_back: isMobile }">
    <BackBtn @click="back"></BackBtn>
  </div>
  <div class="drop_menu">
    <el-dropdown>
      <span class="el-dropdown-link">
        {{ drop_menu }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="click($event)" divided>20级</el-dropdown-item>
          <el-dropdown-item @click="click($event)" divided>21级</el-dropdown-item>
          <el-dropdown-item @click="click($event)" divided>22级</el-dropdown-item>
          <el-dropdown-item @click="click($event)" divided>23级</el-dropdown-item>
          <el-dropdown-item @click="click($event)" divided>24级</el-dropdown-item>
          <el-dropdown-item @click="click($event)" divided>25级</el-dropdown-item>
          <el-dropdown-item @click="click($event)" divided>全部</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <div class="bgc"></div>

  <div class="waterfall_container">
    <div class="title">成员信息</div>
    <Waterfall :list="freshmanMembers" :breakpoints="waterfallSettings.breakpoints"
      :background-color="waterfallSettings.bgc" :gutter="waterfallSettings.gap">
      <template #default="{ item, index }">
        <div :class="{ 'card': !isMobile }" class="card_all" @click="expand(index)">
          <div class="avatar">
            <img :src="item.avatar ? item.avatar : item.gender === '男' ? avatar_boy : avatar_gril" class="pic">
          </div>
          <div class="info">
            <h2><i class="iconfont icon-mingziname" style="font-size: 30px; margin-right: 10px;color: skyblue;"></i> {{
              item.name }}
            </h2>
            <p><i class="iconfont icon-xingbie" style="color: chocolate; margin-right: 10px"></i> {{ item.gender }}</p>
            <p><i class="iconfont icon-nianji" style="margin-right: 10px"></i> {{ item.grade }}</p>
            <p class="tel-info"><i class="iconfont icon-lianxi" style="color: gray;margin-right: 10px"></i> {{ item.tel
              }} <span class="copy-hint" @click="copy(index, $event)">(复制)</span></p>
            <p><i class="iconfont icon-a-01" style="color: blue;margin-right: 6px"></i> {{ item.motto }}</p>
          </div>
        </div>
      </template>
    </Waterfall>
  </div>

  <el-drawer v-model="drawer" :with-header="false" size="28%" v-if="!isMobile">
    <div class="drawer_card">
      <div class="avatar">
        <img
          :src="(drawer_data as any).avatar ? (drawer_data as any).avatar : (drawer_data as any).gender === '男' ? avatar_boy : avatar_gril"
          alt="" class="drawer_img">
      </div>
      <div class="drawer_content">
        <h2 class="drawer_name">
          <i class="iconfont icon-mingziname" style="font-size: 5vw; margin-right: 10px;color: skyblue;"></i>
          {{ (drawer_data as any).name }}
        </h2>
        <div class="drawer_gender">
          <p>性别</p>
          <p style="margin-left:3.5vw;margin-top: 1vh"> {{ (drawer_data as any).gender }}</p>
        </div>
        <div class="drawer_grade">
          <p>年级</p>
          <p style="margin-left:3.5vw;margin-top: 1vh"> {{ (drawer_data as any).grade }}</p>
        </div>
        <div class="drawer_tel">
          <p>联系</p>
          <p style="margin-left:3.5vw;margin-top: 1vh">{{ (drawer_data as any).tel }}</p>
        </div>
        <div class="drawer_motto">
          <i class="iconfont icon-a-01" style="color: blue;margin-right: 6px;font-size: 3vw"></i>
          <p style="margin-left:2.5vw;margin-top: 1vh;"> {{ (drawer_data as any).motto }}</p>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped>
/* 背景 */
.bgc {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: url('https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/PersonMessage_bgc.png') no-repeat center;
  background-size: cover;
}

/* 返回 */
.back {
  position: fixed;
  top: 4vh;
  left: 1vw;
  z-index: 1;
}



/* 卡片内容 */
.title {
  position: relative;
  top: 0vh;
  text-align: center;
  font-size: 40px;
  font-weight: bold;
  color: #fff
}

.drop_menu {
  position: fixed;
  top: 7vh;
  right: 1vw;
  z-index: 1;
}

:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
}

.el-dropdown {
  color: #fff;
  font-weight: 700;
  font-size: 20px
}

.el-dropdown-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.waterfall_container {
  margin-left: 7vw;
  margin-right: 7vw;
  padding-top: 5vh;
}

.card_all {
  display: flex;
  perspective: 500px;
  transform-style: preserve-3d;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease-in-out;
}

@media (hover:hover) and (pointer:fine) {
  .card:hover {
    transform: scale(1.15);
  }
}

@media (hover:none) and (pointer:coarse) {
  .card:hover {
    perspective: none;
    transform-style: flat;
  }
}

.card:hover {
  transform: scale(1.15);
}

.avatar {
  width: 100%;
  position: relative;
}

.pic {
  width: 100%;
}

.info {
  padding: 10px
}

.tel-info {
  position: relative;
}

.copy-hint {
  font-size: 13px;
  color: #409EFF;
  margin-left: 5px;
  opacity: 0.8;
  cursor: pointer;
}

/* 抽屉 */
.drawer_img {
  width: 100%;
  max-height: 50vh;
  object-fit: cover;
}

.drawer_name {
  font-size: 4vw;
}

.drawer_content {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
}

.drawer_gender,
.drawer_tel,
.drawer_grade {
  display: flex;
  align-items: center;
  font-size: 2vw;
}

.drawer_motto {
  display: flex;
  align-items: center;
  font-size: 1.5vw;
}

/* 移动端样式调整 */
.Mobile_back {
  top: 5vh;
  left: 0;
}

.Mobile_back_img {
  width: 11vw !important;
}
</style>
