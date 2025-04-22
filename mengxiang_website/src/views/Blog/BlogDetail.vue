<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onBeforeMount, onUnmounted } from 'vue'
import { useBlogStore,useGlobalStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import axios from '../../axios'
import type { Comment } from '../../Types/article'
import BackBtn from '@/components/BackBtn.vue'

const globalStore = useGlobalStore()
const userStore = useUserStore()
const blogStore = useBlogStore()
const bgcTimer = ref(0)
const deg1 = ref(90)
const deg2 = ref(180)
const deg3 = ref(270)
const Love = ref(false)
const blog = blogStore.blog
const scroll_top = ref(false)
const comment = ref('')
const comment_list = ref<Comment[]>([])
const avatar_boy = 'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/default_avatar_boy.png'
const avatar_gril = 'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/default_avatar_girl.png'
const isMobile = globalStore.isMobile

onBeforeMount(() => {
  get_comments()
  Love.value = blogStore?.isLove
})
onMounted(() => {
  // 背景动画
  setTimeout(() => {
    bgcAnimation()
  }, 0)
  bgcTimer.value = setInterval(() => {
    bgcAnimation()
  }, 5000)
})
onBeforeUnmount(() => {
  clearInterval(bgcTimer.value)
})
const bgcAnimation = () => {
  deg1.value = Math.floor(Math.random() * 360)
  deg2.value = Math.floor(Math.random() * 360)
  deg3.value = Math.floor(Math.random() * 360)
}
const isLove = async () => {
  Love.value = !Love.value
  if (Love.value) {
    const res = await axios.post('/blog/like', { account: blog?.account, title: blog?.title, like: 1 })
    if (res.data.status === 1) {
      ElMessage.success(res.data.message)
    } else {
      ElMessage.error(res.data.message)
    }
  } else {
    const res = await axios.post('/blog/like', { account: blog?.account, title: blog?.title, like: -1 })
    if (res.data.status === 1) {
      ElMessage.warning('取消点赞')
    } else {
      ElMessage.error('取消失败')
    }
  }
}
// 发布评论
const submit_comment = async () => {
  if (comment.value === '') {
    ElMessage.warning('评论内容不能为空')
    return
  }
  const res = await axios.post('/blog/comment', {
    id: blog?.id,
    content: comment.value,
    account: userStore.get_account()
  })
  if (res.data.status === 1) {
    ElMessage.success('评论成功')
    comment.value = ''
    get_comments()
  } else {
    ElMessage.error('评论失败')
  }
}
// 获取评论
const get_comments = async () => {
  const res = await axios.post('/blog/get_comment', { id: blog?.id, })
  if (res.data.status === 1) {
    comment_list.value = res.data.message
    comment_detail(comment_list.value)
  }
}
// 获取评论用户信息
const comment_detail = (comment_list: Comment[]) => {
  comment_list.forEach(async (item: Comment) => {
    const res = await axios.get('/user/info', { params: { account: item.account } })
    if (res.data.status === 1) {
      item.avatar = res.data.message.avatar ? res.data.message.avatar : res.data.message.gender === '男' ? avatar_boy : avatar_gril
      item.name = res.data.message.name
    }
  })
  console.log(comment_list)
}
const back = () => {
  window.history.back()
}
const handleScroll = () => {
  const scrollContainer = document.querySelector('.bgc')
  if (!scrollContainer) return
  const scrollPosition = scrollContainer.scrollTop
  const windowHeight = window.innerHeight
  scroll_top.value = scrollPosition >= (windowHeight * 0.5)
}
onMounted(() => {
  const scrollContainer = document.querySelector('.bgc')
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', handleScroll)
  }
})
onUnmounted(() => {
  const scrollContainer = document.querySelector('.bgc')
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', handleScroll)
  }
})
const scroll_to_top = () => {
  const scrollContainer = document.querySelector('.bgc')
  if (scrollContainer) {
    scrollContainer.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}
</script>

<template>
  <div class="bgc"
    :style="{ '--gradient-deg1': `${deg1}deg`, '--gradient-deg2': `${deg2}deg`, '--gradient-deg3': `${deg3}deg`, }">
    <div class="back" :style="{ 'margin-left': isMobile ? '0' : '2vw' }">
      <BackBtn @click="back"></BackBtn>
    </div>
    <div class="scroll-top" v-if="scroll_top" @click="scroll_to_top">
      <i class="iconfont icon-topDouble" style="color: black;font-weight: 900;cursor: pointer;"></i>
    </div>
    <el-row>
      <el-col :span="isMobile ? 1 : 2"></el-col>
      <el-col :span="isMobile ? 22 : 20" class="article">
        <div class="article-title">
          <div class="card-title-name">{{ blog?.title }}</div>
          <div class="card-title-love" @click="isLove"><i class="iconfont icon-dianzan-aixinshixin"
              :style="{ color: Love ? 'red' : '#8c8c8f' }" style="font-size: 2rem;"></i></div>
        </div>
        <div class="article-info">
          <div class="article-info-avatar">
            <img :src="blog?.avatar" style="width: 100%;height: 100%;object-fit: cover;border-radius: 50%;">
          </div>
          <div class="article-user-info">
            <div class="article-user-name">{{ blog?.name }}</div>
            <div class="article-user-icons">
              <i class="iconfont icon-rili" style="margin-right: 0.5vw;"></i>2025-04-02
              <i class="iconfont icon-wenjianjia" style="margin-right: 0.5vw;margin-left: 1.5vw;"></i>{{ blog?.cate }}
            </div>
          </div>
        </div>
        <div class="article-content" v-html="blog?.content">
        </div>
        <div class="article-bottom">
          <div class="title"><span>标题：</span>{{ blog?.time }}</div>
          <div class="author"><span>作者：</span>{{ blog?.name }}</div>
          <div class="publish"><span>创建于：</span>{{ blog?.time }}</div>
          <div class="declare"><span>版权声明：</span>{{ isMobile ? '版权所有©梦翔，禁止转载' : '版权所有©梦翔工作室，禁止转载' }}</div>
        </div>
        <div class="article-comment">
          <div class="article-comment-title">评论</div>
          <textarea class="article-comment-area" placeholder="在这里书写你的评论......" v-model="comment"></textarea>
          <div class="article-comment-btn">
            <el-button round type="primary" class="article-comment-submit" @click="submit_comment">评论</el-button>
          </div>

          <div class="article-comment-content">
            <div class="comment" v-for="(item, index) in comment_list" :key="index">
              <div class="comment-top">
                <div class="comment-top-avatar">
                  <img :src="item.avatar" style="width: 100%;height: 100%;object-fit: cover;border-radius: 50%;">
                </div>
                <div class="comment-top-name">{{ item.name }}</div>
                <div class="comment-top-time">{{ item.time }}</div>
              </div>
              <div class="comment-body">
                {{ item.content }}
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="isMobile ? 1 : 2"></el-col>
    </el-row>
  </div>
</template>

<style scoped>
/* #region */
/* 注册自定义属性为可动画属性 */
@property --gradient-deg1 {
  syntax: '<angle>';
  inherits: false;
  initial-value: 90deg;
}

@property --gradient-deg2 {
  syntax: '<angle>';
  inherits: false;
  initial-value: 180deg;
}

@property --gradient-deg3 {
  syntax: '<angle>';
  inherits: false;
  initial-value: 270deg;
}

.bgc {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  background:
    linear-gradient(var(--gradient-deg1, 90deg), rgb(245, 152, 168), rgba(255, 255, 255, 0.548) 70%),
    linear-gradient(var(--gradient-deg2, 180deg), rgba(141, 245, 141, 0.8), rgba(255, 255, 255, 0.459) 70%),
    linear-gradient(var(--gradient-deg3, 270deg), rgba(130, 130, 235, 0.8), rgba(255, 255, 255, 0.5) 70%);
  transition: --gradient-deg1 5s linear, --gradient-deg2 5s linear, --gradient-deg3 5s linear;
  overflow: auto;
}

.scroll-top {
  position: fixed;
  bottom: 5vh;
  right: 3vw;
  width: 3vw;
  height: 3vw;
  border-radius: 20%;
  text-align: center;
  line-height: 3vw;
  background-color: #d3d8dd;
  transition: all 0.5s;
  z-index: 1;
  cursor: pointer;
}

.scroll-top:hover {
  transform: scale(1.2);
}

.back {
  z-index: 1;
}

.article {
  width: 100%;
  min-height: 50vh;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 20px;
  margin-top: 2vh;
  margin-bottom: 5vh;
}

.article-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 2rem;
  font-weight: 700;
  color: #000000;
}

.article-info {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  margin-top: 5vh;
  margin-bottom: 5vh;
}

.article-info-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 1vw;
}

.article-user-info {
  display: flex;
  height: 60px;
  width: calc(100% - 90px);
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
}

.article-user-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #373d3f;
}

.article-user-icons {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  color: #6a777a;
  font-size: 0.9rem;
}

.article-content {
  width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.article-bottom {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2vh;
  margin-top: 5vh;
  padding: 1rem;
  border-radius: 20px;
  background: #f7f7f7;
  color: #373d45;
}

.article-bottom span {
  font-weight: 700;
}

/* #endregion */
.article-comment {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin-top: 5vh;
}

.article-comment-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #373d45;
}

.article-comment-area {
  width: 100%;
  min-height: 20vh;
  background: #f7f7f7;
  border-radius: 20px;
  margin-top: 3vh;
  resize: none;
  border: none;
  padding: 1vw;
  font-size: 16px;
}

.article-comment-btn {
  width: 100%;
  display: flex;
  justify-content: end;
}

.article-comment-submit {
  width: 30%;
  padding: 1.2rem;
  margin-top: 2vh;
}

.article-comment-content {
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin-top: 5vh;
  gap: 4vh;
}

.comment {
  width: 100%;
  min-height: 15vh;
  border: 1.5px solid #bbdfff;
  border-radius: 20px;
  padding: 1rem;
}

.comment-top {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 0.8vw;
}

.comment-top-avatar {
  width: 2.5rem;
  height: 2.5rem;
}

.comment-top-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #373d45;
}

.comment-top-time {
  font-size: 0.9rem;
  color: #6a777a;
}

.comment-body {
  display: block;
  width: 100%;
  margin-top: 3vh;
  padding-top: 3vh;
  font-size: 0.875rem;
  color: #282c30;
  border-top: 1px solid #bbdfff;
}
</style>
