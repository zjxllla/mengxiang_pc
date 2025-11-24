<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue'
import type { blog } from '../../Types/article'
import axios from '../../axios'
import { useBlogStore, useUserStore } from '../../stores'
import { ElMessage } from 'element-plus'

const blog_lists = ref<blog[]>([])
const user_store = useUserStore()
const blog_store = useBlogStore()
const avatar_boy = 'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/default_avatar_boy.png'
const avatar_gril = 'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/default_avatar_girl.png'

onBeforeMount(() => {
  get_data()
})

onMounted(() => {
})
const reverse = (index: number) => {
  document.querySelectorAll('.blog-list-item')[index].classList.toggle('active')
}
const get_data = async () => {
  const res = await axios.post('/blog/mine', { account: user_store.get_account() })
  if (res.data.status === 1) {
    blog_lists.value = res.data.message
    if (blog_lists.value.length > 0) {
      const res2 = await axios.get('/user/info', { params: { account: user_store.get_account() } })
      if (res2.data.status === 1) {
        blog_lists.value.forEach(item => {
          item.name = res2.data.message.nickname || res2.data.message.name
          item.avatar = res2.data.message.avatar ? res2.data.message.avatar : res2.data.message.gender === '男' ? avatar_boy : avatar_gril
        })
      }
    }
  }
}
const to_detail = async (index: number) => {
  blog_store.setBlog(blog_lists.value[index])
  ElMessage.warning('即将跳转')
  setTimeout(() => {
    window.location.href = '/blog/detail'
  }, 1000)
}

const delete_blog = async (id: number) => {
  const res = await axios.post('/blog/delete', { id: id })
  if (res.data.status === 1) {
    ElMessage.success('删除成功')
    get_data()
  } else {
    ElMessage.error(res.data.message)
  }
}



</script>

<template>
  <div class="container">
    <div class="blog-lists">
      <div class="blog-list-item" v-for="(item, index) in blog_lists" :key="index">
        <div class="item-front" :style="{ '--hue': `${Math.random() * 360}deg` }">
          <div class="front-info">
            <h4 class="front-title">标题：<span>{{ item.title }}</span></h4>
            <div class="front-time"><span>时间：</span>{{ item.time }}</div>
          </div>
          <div class="front-btns">
            <button class="front-btn" @click="reverse(index)">
              <div class="reverse">
                <i class="iconfont icon-chuizhifanzhuan-fanzhuanjinru"></i>
              </div>
            </button>
            <button class="front-btn" @click="to_detail(index)">
              <i class="iconfont icon-chakan1"></i>
            </button>
            <button class="front-btn" @click="delete_blog(item.id)">
              <i class="iconfont icon-shanchu"></i>
            </button>
          </div>
        </div>
        <div class="item-back" :style="{ '--hue': `${Math.random() * 360}deg` }">
          <div class="back-text">
            {{ item.introduction }}
          </div>
          <div class="back-btn" @click="reverse(index)">
            <div class="reverse">
              <i class="iconfont icon-chuizhifanzhuan-fanzhuanjinru"></i>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 4vh 2vw;
}

.blog-lists {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 10px;
  background: linear-gradient(to right, #ff4747, orange, #ff4747);
  background-size: 200% 100%;
  animation: background-move 3s linear infinite;
  padding: 10px;
  overflow-y: auto;
}

@keyframes background-move {
  0% {
    background-position: 100%;
  }

  100% {
    background-position: -100%;
  }
}

.blog-list-item {
  flex-shrink: 0;
  position: relative;
  width: 100%;
  height: 100px;
  perspective: 1000px;
  background-color: white;
  border-radius: 10px;
  margin-bottom: 10px;
  will-change: transform;
  transform-style: preserve-3d;
  transition: all 0.5s ease-in-out;
}

.blog-list-item.active {
  transform: rotateY(180deg);
}

.item-front,
.item-back {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: inherit;
  backface-visibility: hidden;
  padding: 0 20px;
}

.item-front {
  background-color: white;
  color: black;
  --hue: 20deg;
}

.item-front::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 10px;
  border-radius: 20px 0 0 20px;
  background-color: tomato;
  filter: hue-rotate(var(--hue));
}

.front-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  height: 70%;
  width: 70%;
}

.front-title {
  width: 100%;
  display: flex;
  font-size: 20px;
  white-space: nowrap;
}

.front-title span {
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  background: tomato;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  filter: hue-rotate(var(--hue));
}

.front-time {
  width: 100%;
  display: flex;
  white-space: nowrap;
  align-items: center;
}

.front-time span {
  font-size: 20px;
  font-weight: 700;
}

button {
  border: none;
  background-color: unset;
}

.front-btns {
  width: 20%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  align-content: center;
  gap: 5px;
  flex-wrap: wrap;
}

.front-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
}

.reverse {
  transition: all 0.3s;
}

.front-btn:nth-child(1) {
  background: skyblue;
  color: white;
}

.front-btn:nth-child(1):hover {
  background: blue;
}

.front-btn:nth-child(1):hover .reverse {
  transform: rotateY(180deg);
}

.front-btn:nth-child(2) {
  background: #eeee00;
  color: black;
}

.front-btn:nth-child(2):hover {
  background: #ffa600;
}

.front-btn:nth-child(3) {
  background: #f78774;
  color: #ffffffad;
}

.front-btn:nth-child(3):hover {
  background: red;
  color: white;
}

.front-btn:nth-child(1) .iconfont::before {
  transform: rotate(90deg);
}

.front-btn .iconfont {
  font-size: 20px;
}

.item-back {
  background-color: #383838;
  color: white;
  transform: rotateY(180deg);
  --hue: 180deg;
  padding: 0 0 0 20px;
}

.item-back::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 10px;
  border-radius: 20px 0 0 20px;
  background-color: #ffed89;
  filter: hue-rotate(var(--hue));
}

.back-text {
  width: 100%;
  height: 100%;
  display: -webkit-box;
  line-clamp: 4;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 17px;
  background-color: #ffed89;
  filter: hue-rotate(var(--hue));
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.back-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #ffed89;
  filter: hue-rotate(var(--hue));
  border-radius: 0 10px 10px 0;
  cursor: pointer;
  padding: 0 5px;
}

.back-btn:hover .reverse {
  transform: rotateY(180deg);
}

.back-btn .iconfont {
  font-size: 20px;
  color: black;
}

@media screen and (max-width: 768px) {
  .container {
    max-height: 79vh;
  }

  .container {
    padding: 5px;
  }

  .blog-list-item {
    height: 70px;
  }

  .front-title {
    font-size: 14px;
  }

  .front-time,
  .front-time span {
    font-size: 14px;
  }

  .font-btns {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .front-btn {
    width: 20px;
    height: 20px;
  }

  .front-btn .iconfont {
    font-size: 14px;
  }

  .back-text {
    font-size: 12px;
  }

  .front-btns {
    width: 30%;
  }
}
</style>
