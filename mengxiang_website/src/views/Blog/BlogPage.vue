<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onBeforeMount, watch, nextTick } from 'vue'
import { ArrowRightBold } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import TextEdit from '@/components/TextEdit.vue'
import { useGlobalStore, useBlogStore, useUserStore } from '../../stores'
import axios from '../../axios'
import type { blog } from '../../Types/article'

const userStore = useUserStore()
const globalStore = useGlobalStore()
const blogStore = useBlogStore()
const bgcTimer = ref(0)
const blog_num = ref(0)
const cate_num = ref(0)
const deg1 = ref(90)
const deg2 = ref(180)
const deg3 = ref(270)
const Love = ref<boolean[]>([])
const isLogin = ref(false)
const drawer_new = ref(false)
const new_blog = ref('')
const new_blog_info = ref({ title: '', cate: '', introduction: '' })
const avatar_boy = 'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/default_avatar_boy.png'
const avatar_gril = 'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/default_avatar_girl.png'
const user_info = ref({
  account: '',
  name: '',
  gender: '',
  grade: '',
  tel: '',
  motto: '',
  avatar: ''
})
const user = ref('')
const blog_list = ref<blog[]>([])
const visible_index = ref<string[]>(['0', '1', '2'])
const visible_list = ref<blog[]>([])
const observer = ref<IntersectionObserver | null>(null)

onBeforeMount(async () => {
  // 自动登录
  if (globalStore.token !== '') {
    const res2 = await axios.post('/auto_login', {}, { headers: { 'Content-Type': 'application/json', 'Authorization': globalStore.token } })
    if (res2.data.status === 1) {
      user.value = res2.data.message.account
      await get_number()
      const res3 = await axios.get('/user/info', { params: { account: user.value } })
      if (res3.data.status === 1) {
        user_info.value = res3.data.message
        user_info.value.avatar = user_info.value.avatar ? user_info.value.avatar : user_info.value.gender === '男' ? avatar_boy : avatar_gril
        user_info.value.motto = user_info.value.motto ? user_info.value.motto : '这个人很懒，什么都没留下'
        user_info.value.tel = user_info.value.tel ? user_info.value.tel : '未填写'
        isLogin.value = true
      }
    } else {
      isLogin.value = false
    }
  } else {
    isLogin.value = false
  }
  // 获取博客文章
  get_blog()
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
watch(blog_list, async (newValue) => {
  Love.value = []
  newValue.forEach(() => {
    Love.value.push(false)
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
const isLove = async (index: number) => {
  Love.value[index] = !Love.value[index]
  if(Love.value[index]) {
    const res = await axios.post('/blog/like', { account: user_info.value.account,title: blog_list.value[index].title,like:1})
    if(res.data.status === 1) {
      ElMessage.success(res.data.message)
    } else {
      ElMessage.error(res.data.message)
    }
  }else{
    const res = await axios.post('/blog/like', { account: user_info.value.account,title: blog_list.value[index].title,like:-1})
    if(res.data.status === 1) {
      ElMessage.warning('取消点赞')
    } else {
      ElMessage.error('取消失败')
    }
  }
}
const ToLogin = () => {
  window.location.href = '/login'
}
const DetailArticle = (index: number) => {
  console.log(blog_list)
  blogStore.setBlog(blog_list.value[index])
  blogStore.setLove(Love.value[index])
  userStore.set_account(user_info.value.account)
  window.location.href = '/blog/detail'
}
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('你确定要取消发布博客吗?', { confirmButtonText: '确认', cancelButtonText: '再想想' })
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
const new_edit = () => {
  drawer_new.value = true
}
const cancel_blog = () => {
  drawer_new.value = false
}
const get_blog = async () => {
  const res1 = await axios.get('/blog/get')
  if (res1.data.status === 1) {
    blog_list.value = res1.data.message
    blog_list.value = blog_list.value.reverse()
    await nextTick()
    visible_list.value = blog_list.value.slice(0, 3)
    await nextTick()
    initObserver()
    blog_list.value.forEach(async (item) => {
      const res2 = await axios.get('/user/info', { params: { account: item.account } })
      if (res2.data.status === 1) {
        item.name = res2.data.message.name
        item.avatar = res2.data.message.avatar ? res2.data.message.avatar : res2.data.message.gender === '男' ? avatar_boy : avatar_gril
      }
    })
    console.log(blog_list.value)
  }
}
const submit_blog = async () => {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = new_blog.value
  // 处理所有图片
  const images = tempDiv.querySelectorAll('img')
  images.forEach(img => {
    img.style.maxWidth = '80%'
    img.style.display = 'block'
    img.style.margin = '0 auto'
  })
  // 处理code标签
  const codeElements = tempDiv.querySelectorAll('code')
  codeElements.forEach(code => {
    code.style.marginTop = '1vh'
    code.style.marginBottom = '2vh'
    code.style.display = 'block'
    code.style.width = '100%'
    code.style.backgroundColor = '#eee'
    code.style.padding = '0.8rem'
    code.style.fontFamily = '"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif'
    code.style.color = 'inherit'
    code.style.borderRadius = '10px'
  })
  // 获取处理后的HTML
  const processedHtml = tempDiv.innerHTML
  console.log(processedHtml)

  const res = await axios.post('/blog/publish', {
    title: new_blog_info.value.title,
    cate: new_blog_info.value.cate,
    introduction: new_blog_info.value.introduction,
    content: processedHtml,
    account: user_info.value.account
  })
  if (res.data.status === 1) {
    ElMessage.success(res.data.message)
    drawer_new.value = false
    new_blog.value = ''
    new_blog_info.value = { title: '', cate: '', introduction: '' }
    get_blog()
    get_number()
  } else {
    ElMessage.error(res.data.message)
  }
}
// 获取发布数量与类别数量
const get_number = async () => {
  const res4 = await axios.post('/blog/get_count', { account: user.value })
  if (res4.data.status === 1) {
    const cates = ref<string[]>([])
    blog_num.value = res4.data.message.length
    res4.data.message.forEach((item: blog) => {
      cates.value.push(item.cate)
    })
    cates.value = [...new Set(cates.value)]
    cate_num.value = cates.value.length
  }
}
const initObserver = () => {
  const num = blog_list.value.length
  observer.value = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const target = entry.target as HTMLElement
      if (entry.isIntersecting) {
        if (Number(target.id) < num - 1 && Number(target.id) > 0) {
          visible_index.value = [...new Set([...visible_index.value, target.id, String(Number(target.id) + 1), String(Number(target.id) - 1)])]
        } else if (Number(target.id) === 0) {
          visible_index.value = [...new Set([...visible_index.value, target.id, String(Number(target.id) + 1)])]
        } else if (Number(target.id) === num - 1) {
          visible_index.value = [...new Set([...visible_index.value, target.id, String(Number(target.id) - 1)])]
        } else {
          visible_index.value = [...new Set([...visible_index.value, target.id])]
        }
      }
      console.log(visible_index.value)
      getVisibleList()
    })
  }, {
    threshold: 0.1,
    rootMargin: '500px'
  })
  const cards = document.querySelectorAll('.card')
  cards.forEach(item => {
    observer.value?.observe(item)
  })
}
// 根据出现在视口的元素下标获取元素
const getVisibleList = () => {
  visible_list.value = []
  if (visible_index.value.length > blog_list.value.length) {
    visible_list.value = blog_list.value
  } else {
    visible_index.value.forEach((item) => {
      visible_list.value.push(blog_list.value[Number(item)])
    })
  }
  nextTick(() => {
    const newCards = document.querySelectorAll('.card:not([data-observed])')
    newCards.forEach(card => {
      observer.value?.observe(card)
      card.setAttribute('data-observed', 'true')
    })
  })
}
</script>

<template>
  <div class="bgc"
    :style="{ '--gradient-deg1': `${deg1}deg`, '--gradient-deg2': `${deg2}deg`, '--gradient-deg3': `${deg3}deg`, }">

    <!-- top顶部 -->
    <el-row class="top">
      <div class="top-title">
        <img src="../../assets/icon.png" alt="" style="width: 3.5vw;margin-right: 1vw;" />
        <div>梦翔博客</div>
      </div>
      <div class="top-user-info" v-if="isLogin">
        <div class="top-name"><i class="iconfont icon-mingzi" style="margin-right: 0.5vw;"></i>{{ user_info.name }}
        </div>
        <div class="top-submit" @click="new_edit"><i class="iconfont icon-fabu1" style="margin-right: 0.5vw;"></i>发布
        </div>
      </div>
      <div class="top-login" @click="ToLogin" v-else>
        <i class="iconfont icon-denglu" style="margin-right: 0.5vw;"></i>登录
      </div>
    </el-row>
    <!-- main主体 -->
    <el-row class="main">
      <el-col :span="1"></el-col>
      <el-col :span="18" class="cards">
        <div class="card" v-for="(item, index) in visible_list" :key="item.id" :id="String(index)">
          <div class="card-title">
            <div class="card-title-name" @click="DetailArticle(index)">{{ item.title }}</div>
            <div class="card-title-love" @click="isLove(index)"><i class="iconfont icon-dianzan-aixinshixin"
                :style="{ color: Love[index] ? 'red' : '#8c8c8f' }"></i></div>
          </div>
          <div class="card-content">{{ item.introduction }}</div>
          <div class="card-bottom">
            <div class="card-icons">
              <i class="iconfont icon-rili" style="margin-right: 0.5vw;"></i>{{ item.time }}
              <i class="iconfont icon-wenjianjia" style="margin-right: 0.5vw;margin-left: 1.5vw;"></i>{{ item.cate }}
            </div>
            <div class="card-original" @click="DetailArticle(index)">阅读原文
              <ArrowRightBold style="height: 14px;" />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="aside-cards">
        <div class="aside-card1">
          <div class=aside-card1-avatar v-if="isLogin">
            <img :src='user_info.avatar' alt="" style="height: 15vh;border-radius: 20px;" />
          </div>
          <div class="aside-card1-avatar" v-else>
            <el-button round type="primary" style="padding: 1.5rem;font-size: 1.1rem;" @click="ToLogin">登录</el-button>
          </div>
          <div class="aside-card1-detail">
            <div class="aside-card1-article"><span>{{ isLogin ? blog_num : '未登录' }}</span>文章</div>
            <div class="aside-card1-cate"><span>{{ isLogin ? cate_num : '未登录' }}</span>类别</div>
          </div>
        </div>
      </el-col>
      <el-col :span="1"></el-col>
    </el-row>
    <!-- 发布抽屉 -->
    <el-drawer v-model='drawer_new' :with-header="false" style="background-color: #f8eef0;" :before-close="handleClose"
      size="50%">
      <div class="blog-new">
        <div class="blog-new-title">
          <div class="blog-new-title-name">发表博客</div>
          <input type="text" placeholder="博客标题" class="blog-new-title-right1" v-model="new_blog_info.title">
          <input type="text" placeholder="博客类别（如：编程技术，前端......）" class="blog-new-title-right2"
            v-model="new_blog_info.cate">
        </div>
        <div class="blog-new-content">
          <textarea class="blog-new-content-introduce" placeholder="博客内容简介(可选)"
            v-model="new_blog_info.introduction"></textarea>
          <TextEdit height="63vh" v-model="new_blog" :background-color="'white'" :IsTreeHole="false"></TextEdit>
        </div>
        <div class="blog-new-btns">
          <el-button class="btn" round type="danger" @click="cancel_blog">取消</el-button>
          <el-button class="btn" round type="success" @click="submit_blog">发布</el-button>
        </div>
      </div>
    </el-drawer>
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

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 10vh;
  position: sticky;
  top: 0;
  z-index: 2;
  background: linear-gradient(to right, #f598a8, #8df58d, #8282eb);
  padding-left: calc(100vw/24);
  padding-right: calc(100vw/24);
}

.top-title {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}

.top-user-info {
  display: flex;
  gap: 2vw;
  color: #fff;
}

.top-login {
  color: #fff;
}

.top-login:hover {
  color: #0505f3;
  cursor: pointer;
  font-weight: 700;
}

.top-submit {
  cursor: pointer;
}

.top-submit:hover {
  color: #0505f3;
}

.main {
  position: relative;
  min-height: 85vh;
  margin-top: 5vh;
}

.cards {
  width: 100%;
  display: flex;
  justify-content: start;
  flex-direction: column;
  gap: 5vh;
}

.card {
  width: 90%;
  background-color: #fef7fa;
  opacity: 0.8;
  border-radius: 20px;
  transition: all 0.5s;
  padding-top: 3vh;
  padding-left: 2vw;
  padding-right: 2vw;
  padding-bottom: 3vh;
}

.card:hover {
  box-shadow: #545e61 6px 6px 10px;
}

.card-title {
  display: flex;
  align-self: center;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 700;
  color: #000;
  padding-bottom: 3vh;
}

.card-title-name:hover {
  color: #4646f3;
  cursor: pointer;
}

.card-title-love {
  width: 2rem;
  height: 2rem;
  text-align: center;
  line-height: 1.8rem;
  color: #75787b;
  border-radius: 50%;
  background-color: #ebf0f6;
  cursor: pointer;
}

.card-content {
  font-size: 16px;
  color: #373d3f;
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding-top: 3vh;
  color: #5c6669;
}

.card-original {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.card-original:hover {
  color: #4646f3;
}

.aside-card1 {
  position: sticky;
  top: 15vh;
  width: 100%;
  min-height: 30vh;
  background-color: #fef7fa;
  opacity: 0.8;
  border-radius: 20px;
  padding-top: 3vh;
  padding-left: 2vw;
  padding-right: 2vw;
  padding-bottom: 3vh;
  background: #fef7fa;
  opacity: 0.9;
  transition: all 1.5s;
}

.aside-card1-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-height: 20vh;
  margin: 0 auto;
}

.aside-card1-detail {
  margin-top: 8vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.aside-card1-detail span {
  font-size: 20px;
  font-weight: 700;
  color: #000;
}

.aside-card1-article,
.aside-card1-cate {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 14px;
  color: #5c6669;
}

/* #endregion */
.blog-new-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.blog-new-title-name {
  font-size: 1.5rem;
  font-weight: 700;
}

.blog-new-title-right1,
.blog-new-title-right2 {
  background-color: #fff;
  width: 40%;
  padding-left: 1rem;
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
}

.blog-new-content {
  margin-top: 3vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3vh;
}

.blog-new-content-introduce {
  border: none;
  resize: none;
  height: 15vh;
  background-color: #fff;
  border-radius: 20px;
  padding: 1rem;
  font-size: 1rem;
}

.blog-new-btns {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 2vh;
}

.btn {
  width: 48%;
  padding: 1.1rem;
}
</style>
