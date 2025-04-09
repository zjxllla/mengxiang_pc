<script setup lang="ts">
import { ref } from 'vue';
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import { useGlobalStore } from '../../stores';
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import BackBtn from '@/components/BackBtn.vue';

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
// 模拟大一成员数据
const freshmanMembers = ref([
  {
    id: 1,
    name: '邓昕蕊',
    grade: '大一',
    direction: '人工智能',
    gender: '女',
    tel: '18139870857',
    school: '福建工业大学',
    motto: '世间即使多可怕，总留下你依然让我值得牵挂。'
  },
  {
    id: 2,
    name: '张禹辰',
    grade: '大一',
    direction: '人工智能',
    tel: '17854992863',
    school: '陕西师范大学',
    gender: '男',
    motto: '把自己当傻瓜，不懂就问，你会学的更多。'
  },
  {
    id: 3,
    name: '侯天昊',
    grade: '大一',
    direction: '人工智能',
    tel: '18729243046',
    school: '宁夏建筑大学',
    avatar: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.Al9kr3lhiR0k6LEchmE_1gHaE8?w=245&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    motto: '世间即使多可怕，总留下你依然让我值得牵挂。'
  },
  {
    id: 4,
    name: '林磊',
    grade: '大一',
    direction: '人工智能',
    tel: '18352741347',
    school: '陕西化工大学',
    avatar: 'https://dummyimage.com/1000x1000?text=1742897448814',
    motto: '把自己当傻瓜，不懂就问，你会学的更多。'
  },
  {
    id: 5,
    name: '姜若萌',
    grade: '大一',
    direction: '人工智能',
    tel: '13486221248',
    school: '广东师范大学',
    avatar: 'https://dummyimage.com/1000x1000?text=1742897448814',
    motto: '在你孤单的时候有人陪伴你，在你失落的时候有人帮助你。幸福就是无论你走到天涯海角，总会有人牵挂你！'
  },
  {
    id: 6,
    name: '贺桂英',
    grade: '大一',
    direction: '人工智能',
    tel: '15120460859',
    school: '海南服装学院',
    avatar: 'https://dummyimage.com/1000x1000?text=1742897448814',
    motto: '把自己当傻瓜，不懂就问，你会学的更多。'
  },
  {
    id: 7,
    name: '雷熙涵',
    grade: '大一',
    direction: '人工智能',
    tel: '19951246387',
    school: '甘肃化工大学',
    avatar: 'https://dummyimage.com/1000x1000?text=1742897448814',
    motto: '把自己当傻瓜，不懂就问，你会学的更多。'
  },
  {
    id: 8,
    name: '于杰',
    grade: '大一',
    direction: '人工智能',
    tel: '19617038778',
    school: '贵州大学',
    avatar: 'https://dummyimage.com/1000x1000?text=1742897448814',
    motto: '在你孤单的时候有人陪伴你，在你失落的时候有人帮助你。幸福就是无论你走到天涯海角，总会有人牵挂你！'
  },
  {
    id: 9,
    name: '卢佳毅',
    grade: '大一',
    direction: '人工智能',
    tel: '14988108827',
    school: '辽宁理工大学',
    avatar: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.P8VPK1U9xVLCP9LfDuAVngHaEK?w=324&h=182&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    motto: '世间即使多可怕，总留下你依然让我值得牵挂。'
  },
  {
    id: 10,
    name: '叶雨涵',
    grade: '大一',
    direction: '人工智能',
    tel: '15686769877',
    school: '海南工商大学',
    avatar: 'https://dummyimage.com/1000x1000?text=1742897448814',
    motto: '把自己当傻瓜，不懂就问，你会学的更多。'
  },
  {
    id: 11,
    name: '周淑华',
    grade: '大一',
    direction: '人工智能',
    tel: '19779669664',
    school: '青海医科大学',
    avatar: 'https://dummyimage.com/1000x1000?text=1742897448814',
    motto: '世间即使多可怕，总留下你依然让我值得牵挂。'
  },
  {
    id: 12,
    name: '阎凌晶',
    grade: '大一',
    direction: '人工智能',
    tel: '15540050064',
    school: '江苏农业大学',
    avatar: 'https://dummyimage.com/1000x1000?text=1742897448814',
    motto: '把自己当傻瓜，不懂就问，你会学的更多。'
  },
  {
    id: 13,
    name: '熊嘉乐',
    grade: '大一',
    direction: '人工智能',
    tel: '19842151068',
    school: '海南交通大学',
    avatar: 'https://dummyimage.com/1000x1000?text=1742897448814',
    motto: '在你孤单的时候有人陪伴你，在你失落的时候有人帮助你。幸福就是无论你走到天涯海角，总会有人牵挂你！'
  },
  {
    id: 14,
    name: '邱昕蕊',
    grade: '大一',
    direction: '人工智能',
    tel: '19947663286',
    school: '宁夏科技大学',
    avatar: 'https://dummyimage.com/1000x1000?text=1742897448814',
    motto: '世间即使多可怕，总留下你依然让我值得牵挂。'
  },
  {
    id: 15,
    name: '傅萌',
    grade: '大一',
    direction: '人工智能',
    tel: '14791159939',
    school: '西藏科技大学',
    avatar: 'https://dummyimage.com/1000x1000?text=1742897448814',
    motto: '在你孤单的时候有人陪伴你，在你失落的时候有人帮助你。幸福就是无论你走到天涯海角，总会有人牵挂你！'
  },
  {
    id: 16,
    name: '何建政',
    grade: '大一',
    direction: '人工智能',
    tel: '13963529855',
    school: '重庆建筑大学',
    avatar: 'https://dummyimage.com/1000x1000?text=1742897448814',
    motto: '把自己当傻瓜，不懂就问，你会学的更多。'
  },
  {
    id: 17,
    name: '夏晨茜',
    grade: '大一',
    direction: '人工智能',
    tel: '13852037364',
    school: '重庆工业大学',
    avatar: 'https://dummyimage.com/1000x1000?text=1742897448814',
    motto: '世间即使多可怕，总留下你依然让我值得牵挂。'
  },
  {
    id: 18,
    name: '孔伟',
    grade: '大一',
    direction: '人工智能',
    tel: '15876688252',
    school: '黑龙江交通大学',
    avatar: 'https://dummyimage.com/1000x1000?text=1742897448814',
    motto: '在你孤单的时候有人陪伴你，在你失落的时候有人帮助你。幸福就是无论你走到天涯海角，总会有人牵挂你！'
  },
  {
    id: 19,
    name: '林清妍',
    grade: '大一',
    direction: '人工智能',
    tel: '15127742708',
    school: '青海理工大学',
    avatar: 'https://dummyimage.com/1000x1000?text=1742897448814',
    motto: '世间即使多可怕，总留下你依然让我值得牵挂。'
  },
]);

const back = () => {
  globalStore.setBackto_enum(true)
  window.history.back()
}

const click = (event: Event) => {
  const label = (event.target as HTMLLabelElement).textContent?.trim();
  if (label) {
    drop_menu.value = label;
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
          <el-dropdown-item @click="click($event)" divided>22级</el-dropdown-item>
          <el-dropdown-item @click="click($event)" divided>23级</el-dropdown-item>
          <el-dropdown-item @click="click($event)" divided>24级</el-dropdown-item>
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
            <LazyImg :url="item.avatar ? item.avatar : item.gender === '男' ? avatar_boy : avatar_gril" class="pic">
            </LazyImg>
          </div>
          <div class="info">
            <h2><i class="iconfont icon-mingziname" style="font-size: 30px; margin-right: 10px;color: skyblue;"></i> {{
              item.name }}
            </h2>
            <p><i class="iconfont icon-xingbie" style="color: chocolate; margin-right: 10px"></i> {{ item.grade }}</p>
            <p><i class="iconfont icon-nianji" style="margin-right: 10px"></i> {{ item.school }}</p>
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
          <p style="margin-left:3.5vw;margin-top: 1vh"> {{ (drawer_data as any).grade }}</p>
        </div>
        <div class="drawer_grade">
          <p>年级</p>
          <p style="margin-left:3.5vw;margin-top: 1vh"> {{ (drawer_data as any).school }}</p>
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
