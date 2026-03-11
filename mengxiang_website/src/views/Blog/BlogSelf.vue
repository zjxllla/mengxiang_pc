<script setup lang="ts">
import CodeBgc from '@/components/CodeBgc.vue';
import { useRoute } from 'vue-router'
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import Myaxios from '@/axios'
import { ElMessage } from 'element-plus';
import type { blog } from '@/Types/article'

const route = useRoute()
const account = route.params.id
const blogList = ref<[string, blog[]][]>([])
const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' })

onBeforeMount(() => {
  get_list()
})
const get_list = async () => {
  if (!account) {
    ElMessage.error('请在地址上携带账号参数')
  }
  const res = await Myaxios.post(`/blog/${account}`)
  if (res.data.status === 1) {
    worker.postMessage(res.data.message)
    worker.onmessage = (e) => {
      blogList.value = [...e.data]
      console.log('主2：', blogList.value[0][1][1].title.charCodeAt(0))
    }
  } else {
    console.log(res.data)
  }
}

onBeforeUnmount(() => {
  worker.terminate()
})

</script>

<template>
  <CodeBgc></CodeBgc>
  <div class="container">
    <header class="header">
      <i class="iconfont icon-shouye3 icon"></i>
    </header>
    <main class="main">
      <section class="list-container">
        <div class="list" v-for="(item, index) in blogList" :key="index">
          <div class="list-year">{{ item[0] }}</div>
          <div class="list-item" v-for="(blog) in item[1]" :key="blog.id">
            <div class="list-item-img" :style="{ background: blog.colorBgc }">{{ blog.title.slice(0, 4) }}</div>
            <div div class="list-item-text">
              <div class="item-title"> {{ blog.title }}</div>
              <div class="item-cate">
                <span v-for="(cate) in blog.cate" :key="cate">{{ cate }}</span>
              </div>
            </div>
            <div class="list-item-num">{{ blog.number }}</div>
          </div>
        </div>
      </section>
      <aside class="aside"></aside>
    </main>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  overflow: scroll;
}

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
  min-height: calc(100vh - 90px);
  background: rgba(50, 50, 50, 0.65);
  border-radius: 10px;
  padding: 20px 15px;
  z-index: 1;
}

.list-year {
  font-size: 1rem;
  font-weight: 500;
  color: white;
  margin: 0 0 15px 5px;
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
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: black;
  font-weight: 700;
  width: 150px;
  height: 80px;
  border-radius: 10px;
}

.list-item-text {
  flex: 1;
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
  font-size: 1.5rem;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-cate {
  display: flex;
  gap: 10px;
  font-size: 0.8rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* #endregion */

/* 侧边栏 */
.aside {
  position: sticky;
  top: 75px;
  width: 25%;
  height: 200px;
  background: rgba(50, 50, 50, 0.65);
  border-radius: 10px;
}
</style>
