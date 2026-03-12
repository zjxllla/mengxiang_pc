<script setup lang="ts">
import StarBgc from '@/components/StarBgc.vue'
import { useRoute } from 'vue-router'
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import Myaxios from '@/axios'
import { ElMessage } from 'element-plus';
import type { blog } from '@/Types/article'
import type { User } from '@/Types/user'
import { useBlogStore, useUserStore, useGlobalStore } from '../../stores'

const route = useRoute()
const account = route.params.id
const blogList = ref<[string, blog[]][]>([])
const user = ref<User>()
const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' })
const cateList = ref<string[]>([])
const blogStore = useBlogStore()
const userStore = useUserStore()
const globalStore = useGlobalStore()
const isMobile = judgeMobile()

onBeforeMount(() => {
  getArticle()
  console.log(isMobile)
})
const getArticle = async () => {
  if (!account) {
    ElMessage.error('请在地址上携带账号参数')
  }
  const res = await Myaxios.post(`/blog/${account}`)
  if (res.data.status === 1) {
    user.value = res.data.message[1][0]
    console.log(user.value)
    worker.postMessage(res.data.message[0])
    worker.onmessage = (e) => {
      blogList.value = [...e.data.listMap]
      cateList.value = e.data.cates
    }
  } else {
    console.log(res.data.message)
    if (!user.value) {
      ElMessage.error('请输入正确的账号')
      setTimeout(() => {
        goHome()
      }, 500)
    }
  }
}

onBeforeUnmount(() => {
  worker.terminate()
})

// 返回首页
const goHome = () => {
  window.location.href = '/blog'
}

//  点击前往详情页
const goDetail = async (blog: blog) => {
  const isLove = await judgeLoved(blog.id)
  blogStore.setLove(isLove!)
  window.location.href = `/blog/detail?id=${blog.id}`
}

// 判断是否点赞
const judgeLoved = async (id: number) => {
  if (!userStore.get_account()) return
  const { data } = await Myaxios.post(`/blog/like/${id}`, { account: '123456' })
  return data.message.like === 1
}

// 移动端判断
function judgeMobile() {
  const userAgent = navigator.userAgent || navigator.vendor
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  globalStore.isMobile = isMobile
  // 正则表达式匹配常见的移动设备关键字
  return isMobile;
}


</script>

<template>
  <StarBgc :num="isMobile ? 35 : 120"></StarBgc>
  <div class="container">
    <header class="header">
      <i class="iconfont icon-shouye3 icon" @click="goHome"></i>
      <div class="head-text" v-if="!isMobile">欢迎来到 <span>{{ user?.nickname ? user?.nickname : user?.name }}</span> 的个人博客
      </div>
      <div class="head-text" v-else><span>{{ user?.nickname ? user?.nickname : user?.name }}</span></div>
      <i class="iconfont icon-shouye3 icon" style="visibility: hidden;"></i>
    </header>
    <main class="main">
      <section class="list-container" v-if="blogList.length" :class="isMobile ? 'mobile-list-container' : ''">
        <div class="list" v-for="(item, index) in blogList" :key="index">
          <div class="list-year">{{ item[0] }}</div>
          <div class="list-item" v-for="blog in item[1]" :key="blog.id" :class="isMobile ? 'mobile-list-item' : ''">
            <div class="list-item-img" :style="{ background: blog.colorBgc }" @click="goDetail(blog)"
              :class="isMobile ? 'mobile-item-img' : ''">
              <i class="iconfont item-icon" :class="blog.icon"></i>
            </div>
            <div div class="list-item-text" :class="isMobile ? 'mobile-item-text' : ''">
              <div class="item-title" @click="goDetail(blog)" :style="{ fontSize: isMobile ? '1.2rem' : '1.5rem' }">
                {{ blog.title }}</div>
              <div class="item-cate">
                <span v-for="(cate) in blog.cate" :key="cate">{{ cate }}</span>
              </div>
            </div>
            <div class="list-item-num" :style="{ fontSize: isMobile ? '2rem' : '2.5rem' }">{{ blog.number }}</div>
          </div>
        </div>
      </section>
      <aside class="aside" v-if="!isMobile || blogList.length === 0" :style="{ width: isMobile ? '60%' : '25%' }">
        <div class="has-cate" v-if="cateList.length">
          <span class="aside-cate" v-for="(cate, index) in cateList" :key="index">{{ cate }}</span>
        </div>
        <div class="no-cate" v-else>
          <div class="no-cate-text">暂无文章</div>
        </div>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  overflow: scroll;
}

/* 头部 */
/* #region */
.header {
  position: sticky;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  width: 100%;
  height: 60px;
  background: #161618;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  z-index: 2;
}

.header .icon {
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.head-text {
  font-size: 1.5rem;
  color: white;
  font-weight: 700;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.head-text span {
  font-style: italic;
  margin: 0 10px;
  color: transparent;
  background-image: linear-gradient(90deg,
      #ff6a00,
      #ffd500,
      #00d4ff,
      #ff6a00,
      /* 开头 */
      #ffd500,
      #00d4ff,
      #ff6a00
      /* 再重复一轮，形成长带子 */
    );
  background-clip: text;
  background-size: 200% 100%;
  animation: textAnimation 3s linear infinite;
}

@keyframes textAnimation {
  from {
    background-position: 0% 50%;
  }

  to {
    background-position: 200% 50%;
  }
}

/* #endregion */

.main {
  display: flex;
  justify-content: center;
  align-items: start;
  width: 100%;
  min-height: calc(100vh - 60px);
  padding: 15px 0;
  gap: 3vw;
}

/* 列表 */
/* #region */
.list-container {
  width: 65%;
  min-height: 50vh;
  background: rgba(50, 50, 50, 0.65);
  border-radius: 10px;
  padding: 20px 15px;
  z-index: 1;
}

.list-year {
  font-size: 1rem;
  font-weight: 500;
  color: white;
  margin: 0 0 10px 5px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
}

.list-item {
  display: flex;
  width: 100%;
  height: 80px;
  border-radius: 10px;
  gap: 1vw;
  margin-bottom: 20px;
  opacity: 0.8;
}

.list-item-img {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  color: black;
  font-weight: 700;
  width: 150px;
  height: 80px;
  border-radius: 10px;
  cursor: pointer;
}

.list-item-img:hover .item-icon {
  transform: scale(1.2);
}

.item-icon {
  font-size: 2.5rem;
  color: white;
  mix-blend-mode: difference;
  transition: all 0.3s ease-in-out;
}

.list-item-text {
  flex: 1;
  width: calc(100% - 40vw);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  height: 100%;
  padding: 5px 0;
  color: white;
}

.list-item-num {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 50px;
  height: 100%;
  font-size: 2.5rem;
  font-style: italic;
  color: white;
  padding: 10px;
}

.item-title {
  width: 100%;
  font-size: 1.5rem;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.item-title:hover {
  color: #ffc550;
}

.item-cate {
  width: 100%;
  display: flex;
  gap: 10px;
  font-size: 0.8rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-cate span::before {
  content: '#';
  margin-right: 2px;
  color: #7fecff;
}

/* #endregion */

/* 侧边栏 */
.aside {
  position: sticky;
  top: 75px;
  width: 25%;
  background: rgba(50, 50, 50, 0.65);
  border-radius: 10px;
  padding: 20px;
  color: #dfdfdf;
}

.has-cate {
  display: flex;
  justify-content: start;
  align-items: start;
  flex-wrap: wrap;
  gap: 10px;
}

.aside-cate {
  height: 30px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* mobile 样式 */
.mobile-list-container {
  width: 98%;
}

.mobile-item-img {
  width: 20vw;
  height: 10vh;
  margin-right: 3vw;
}

.mobile-item-text {
  height: 10vh;
}

.mobile-list-item {
  margin-bottom: 10px;
}
</style>
