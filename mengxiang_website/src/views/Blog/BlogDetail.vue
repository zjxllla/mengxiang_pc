<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onBeforeMount, onUnmounted } from 'vue'
import { useBlogStore, useGlobalStore, useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { baseURL } from '../../axios'
import axios from '../../axios'
import type { Comment, blog } from '../../Types/article'
import BackBtn from '@/components/BackBtn.vue'
import { useRoute } from 'vue-router'

const globalStore = useGlobalStore()
const userStore = useUserStore()
const blogStore = useBlogStore()
const route = useRoute()
const bgcTimer = ref(0)
const deg1 = ref(90)
const deg2 = ref(180)
const deg3 = ref(270)
const Love = ref(false)
const blog = ref(blogStore.blog)
const scroll_top = ref(false)
const comment = ref('')
const comment_list = ref<Comment[]>([])
const avatar_boy = 'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/default_avatar_boy.png'
const avatar_gril = 'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/default_avatar_girl.png'
const isMobile = globalStore.isMobile
const start_time = ref(0)
const end_time = ref(0)
const stay_time = ref(0)
const need_file = ref(false)

onBeforeMount(async () => {
  const type = route.query.type as string
  let id = route.query.id as string || ''
  // 获取特定参数
  if (type === 'ask' || id) {
    let blog_message = {} as blog
    if (type === 'ask') id = '10'
    const res = await axios.get('/blog/get_by_id', { params: { id } })
    if (res.data.status === 1) {
      blog_message = res.data.message
      const res1 = await axios.get('/user/info', { params: { account: res.data.message.account } })
      if (res1.data.status === 1) {
        console.log(res1.data.message)
        blog_message.avatar = res1.data.message.avatar ? res1.data.message.avatar : res1.data.message.gender === '男' ? avatar_boy : avatar_gril
        blog_message.name = res1.data.message.nickname || res1.data.message.name
        blogStore.setBlog(blog_message)
        blog.value = blog_message
      }
    }
  }
  get_comments()
  Love.value = blogStore?.isLove || false
  if (blog.value?.id === 10) {
    need_file.value = true
  } else {
    need_file.value = false
  }
})
onMounted(async () => {
  // 更新网站访问量
  axios.get('/ip/get').catch(err => console.error('Failed to get IP:', err))
  start_time.value = Math.floor(+new Date() / 1000)
  // 背景动画
  setTimeout(() => {
    bgcAnimation()
  }, 0)
  bgcTimer.value = window.setInterval(() => {
    bgcAnimation()
  }, 5000)

  window.addEventListener('beforeunload', () => {
    end_time.value = Math.floor(+new Date() / 1000)
    stay_time.value = end_time.value - start_time.value
    // 上传访问量
    const analyticsData = {
      time: stay_time.value,
      startTime: start_time.value
    };
    const blob = new Blob([JSON.stringify(analyticsData)], {
      type: 'application/json; charset=UTF-8'
    });
    navigator.sendBeacon(`${baseURL}/visit/set`, blob);
  })
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
    const res = await axios.post('/blog/like', { account: blog.value?.account, title: blog.value?.title, like: 1, target_id: blog.value?.id })
    if (res.data.status === 1) {
      ElMessage.success(res.data.message)
    } else {
      ElMessage.error(res.data.message)
    }
  } else {
    const res = await axios.post('/blog/like', { account: blog.value?.account, title: blog.value?.title, like: -1, target_id: blog.value?.id })
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
    id: blog.value?.id,
    content: comment.value,
    account: userStore.get_account()
  })
  if (res.data.status === 1) {
    ElMessage.success('评论成功')
    comment.value = ''
    get_comments()
  } else {
    ElMessage.error('请先登录')
    setTimeout(() => {
      window.location.href = '/login'
    }, 1000)
  }
}
// 获取评论
const get_comments = async () => {
  const res = await axios.post('/blog/get_comment', { id: blog.value?.id, })
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
      item.name = res.data.message.nickname || res.data.message.name
    }
  })
  console.log(comment_list)
}
const back = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    window.location.href = '/'
  }
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

// 下载文件
const download_file = () => {
  window.open('http://101.201.170.43:8888/down/ux12kGEtkPWo.xlsx', '_blank')
}

// 前往个人博客
const goSelfBlog = () => {
  window.location.href = `/blog/${blog.value?.account}`
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
          <div class="article-info-avatar" @click="goSelfBlog">
            <img :src="blog?.avatar" style="width: 100%;height: 100%;object-fit: cover;border-radius: 50%;"
              loading="lazy">
          </div>
          <div class="article-user-info">
            <div class="article-user-name">{{ blog?.name }}</div>
            <div class="article-user-icons">
              <i class="iconfont icon-rili" style="margin-right: 0.5vw;"></i>{{ blog?.time }}
              <i class="iconfont icon-wenjianjia" style="margin-right: 0.5vw;margin-left: 1.5vw;"></i>{{ blog?.cate }}
            </div>
          </div>
        </div>
        <div class="article-content" v-html="blog?.content">
        </div>
        <!-- 文件展示 -->
        <div class="article-file" v-if="need_file">
          <div class="article-file-icon">
            <i class="iconfont icon-format-xlsx"></i>
            <div class="article-file-name">
              新生答疑 <span style="font-size: 10px;">.xlsx</span>
            </div>
          </div>
          <button class="article-file-download" @click="download_file">
            <i class="iconfont icon-xiazai"></i>
            点击下载
          </button>
        </div>
        <div class="article-bottom">
          <div class="title"><span>标题：</span>{{ blog?.title }}</div>
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
                  <img :src="item.avatar" style="width: 100%;height: 100%;object-fit: cover;border-radius: 50%;"
                    loading="lazy">
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
  cursor: pointer;
  transition: all 0.2s;
}

.article-info-avatar:hover {
  border: 5px solid rgba(0, 0, 0, 0.3);
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

.article-file {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  min-height: 100px;
  height: 10vh;
  max-height: 120px;
  aspect-ratio: 2.5;
  background: linear-gradient(90deg, #2b6bff, #7e9fec, #2b6bff);
  background-size: 200%;
  border-radius: 10px;
  margin-top: 20px;
  padding: 10px;
  animation: back_move 4s linear infinite;
}

@keyframes back_move {
  from {
    background-position: 0px center;
  }

  to {
    background-position: 1000px center;
  }
}

.article-file-icon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  height: 100%;
  aspect-ratio: 1.8;
  background: #c1d3ff;
  border-radius: 10px;
}

.article-file-icon i {
  font-size: 35px;
}

.article-file-name {
  font-size: 15px;
  color: black;
  font-weight: 700;
}

.article-file-download {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  margin-left: 10px;
  background: #c1d3ff;
  border-radius: 10px;
  font-size: 14px;
  gap: 8px;
  transition: all .3s;
  cursor: pointer;
  border: none;
}

.article-file-download i {
  font-size: 25px;
}

.article-file-download:hover {
  background: rgba(255, 255, 255, 1);
  color: #2b6bff;
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
