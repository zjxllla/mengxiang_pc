<script setup lang="ts">
import { ref } from 'vue';
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import { useGlobalStore } from '../../stores';

const globalStore = useGlobalStore();
const avatar_boy = new URL('@/assets/default_avatar_boy.png', import.meta.url).href;
const avatar_gril = new URL('@/assets/default_avatar_girl.png', import.meta.url).href;
const waterfallSettings = ref({
  gap: 20,
  useObserve: true,
  useLazyload: true,
  breakpoints: {
    1800: { rowPerView: 5 },
    1200: { rowPerView: 4 },
    800: { rowPerView: 2 },
    500: { rowPerView: 1 },
  },
  bgc: '#232323',
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
    avatar: 'https://dummyimage.com/1000x1000?text=1742897448813',
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
    avatar: 'https://dummyimage.com/1000x1000?text=1742897448814',
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

// // 模拟大二成员数据
// const sophomoreMembers = ref([
//   {
//     id: 1,
//     name: '李康康',
//     position: '负责人',
//     direction: '人工智能',
//     qq: '2128393718',
//     avatar: '/src/assets/Avatar.png',
//     motto: '故事还长，都先别慌'
//   },
//   {
//     id: 1,
//     name: '李康康',
//     position: '负责人',
//     direction: '人工智能',
//     qq: '2128393718',
//     avatar: '/src/assets/Avatar.png',
//     motto: '故事还长，都先别慌'
//   },
//   {
//     id: 1,
//     name: '李康康',
//     position: '负责人',
//     direction: '人工智能',
//     qq: '2128393718',
//     avatar: '/src/assets/Avatar.png',
//     motto: '故事还长，都先别慌'
//   },
//   {
//     id: 1,
//     name: '李康康',
//     position: '负责人',
//     direction: '人工智能',
//     qq: '2128393718',
//     avatar: '/src/assets/Avatar.png',
//     motto: '故事还长，都先别慌'
//   },
//   {
//     id: 1,
//     name: '李康康',
//     position: '负责人',
//     direction: '人工智能',
//     qq: '2128393718',
//     avatar: '/src/assets/Avatar.png',
//     motto: '故事还长，都先别慌'
//   },
//   {
//     id: 1,
//     name: '李康康',
//     position: '负责人',
//     direction: '人工智能',
//     qq: '2128393718',
//     avatar: '/src/assets/Avatar.png',
//     motto: '故事还长，都先别慌'
//   },
// ]);

// // 模拟大三成员数据
// const juniormoreMembers = ref([
//   {
//     id: 1,
//     name: '侯俊宇',
//     position: '负责人',
//     direction: '人工智能',
//     qq: '2128393718',
//     avatar: '/src/assets/Avatar.png',
//     motto: '故事还长，都先别慌'
//   },
//   {
//     id: 1,
//     name: '侯俊宇',
//     position: '负责人',
//     direction: '人工智能',
//     qq: '2128393718',
//     avatar: '/src/assets/Avatar.png',
//     motto: '故事还长，都先别慌'
//   },
//   {
//     id: 1,
//     name: '侯俊宇',
//     position: '负责人',
//     direction: '人工智能',
//     qq: '2128393718',
//     avatar: '/src/assets/Avatar.png',
//     motto: '故事还长，都先别慌'
//   },
//   {
//     id: 1,
//     name: '侯俊宇',
//     position: '负责人',
//     direction: '人工智能',
//     qq: '2128393718',
//     avatar: '/src/assets/Avatar.png',
//     motto: '故事还长，都先别慌'
//   },
//   {
//     id: 1,
//     name: '侯俊宇',
//     position: '负责人',
//     direction: '人工智能',
//     qq: '2128393718',
//     avatar: '/src/assets/Avatar.png',
//     motto: '故事还长，都先别慌'
//   },
//   {
//     id: 1,
//     name: '侯俊宇',
//     position: '负责人',
//     direction: '人工智能',
//     qq: '2128393718',
//     avatar: '/src/assets/Avatar.png',
//     motto: '故事还长，都先别慌'
//   },
// ]);
const back = () => {
  globalStore.setBackto_enum(true)
  window.history.back();
}
</script>

<template>
  <div class="back">
    <img src="../../assets/back.png" style="width: 5vw;" @click="back">
  </div>
  <div class="waterfall_container">
    <Waterfall :list="freshmanMembers" :breakpoints="waterfallSettings.breakpoints"
      :background-color="waterfallSettings.bgc" :gutter="waterfallSettings.gap">
      <template #default="{ item }">
        <div class="card">
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
            <p><i class="iconfont icon-lianxi" style="color: gray;margin-right: 10px"></i> {{ item.tel }}</p>
            <p><i class="iconfont icon-a-01" style="color: blue;margin-right: 10px"></i> {{ item.motto }}</p>
          </div>
        </div>
      </template>
    </Waterfall>
  </div>

</template>

<style scoped>
.back {
  position: fixed;
  top: 1vh;
  left: 1vw;
  z-index: 1;
}

.waterfall_container {
  margin-left: 7vw;
  margin-right: 7vw;
}

.card {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
}

.avatar {
  width: 100%;
  position: relative;
  padding-top: 100%;
}

.pic {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.info {
  padding: 10px
}
</style>
