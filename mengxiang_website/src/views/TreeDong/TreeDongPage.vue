<script setup lang="ts">
import { Moon, Sunny } from '@element-plus/icons-vue';
import { ref, onBeforeMount, watch, nextTick, onUnmounted, onMounted } from 'vue';
import axios from 'axios';
import BackBtn from '@/components/BackBtn.vue';
import { useGlobalStore } from '../../stores'
import { ElMessageBox } from 'element-plus'
import TextEdit from '@/components/TextEdit.vue';
import Myaxios from '../../axios';
import { ElMessage } from 'element-plus'
import type { article } from '../../Types/article'

const avatar_boy = 'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/default_avatar_boy.png'
const avatar_gril = 'https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/default_avatar_girl.png'
const globalStore = useGlobalStore();
const observer = ref<IntersectionObserver | null>(null)
const isDark = ref(false);
const top_text = ref('')
const isDark_animation = ref(false)
const isAnimating_sun = ref(false);  // 新增动画状态
const isAnimating_dark = ref(false);  // 新增动画状态
const is_praise = ref<boolean[]>([])
const is_commment = ref<boolean[]>([])
const avatarLoading = ref(true) // 添加头像加载状态
const user = ref('')
const article_title = ref('')
const comment_text = ref('')
const isLogin = ref(false)
const isMobile = globalStore.isMobile
const user_info = ref({
  account: '',
  name: '',
  gender: '',
  grade: '',
  tel: '',
  motto: '',
  avatar: ''
})
const article_list = ref<article[]>([])
const original_article = ref({
  id: 1,
  account: '',
  avatar: '',
  title: '',
  content: '',
  like_num: 0,
  time: '',
  image: '',
  name: ''
})
const comment_list = ref<article[]>([])
const original_article_index = ref(0)
const visible_index = ref<string[]>(['0', '1', '2'])
const visible_list = ref<article[]>([])
const drawer = ref(false);
const drawer_new = ref(false)
const new_article = ref('')
const scroll_top = ref(false)

onBeforeMount(async () => {
  // 获取一言
  const res1 = await axios.get('https://v1.hitokoto.cn/')
  top_text.value = res1.data.hitokoto + '------《' + res1.data.from + '》'
  // 自动登录
  if (globalStore.token !== '') {
    const res2 = await Myaxios.post('/auto_login', {}, { headers: { 'Content-Type': 'application/json', 'Authorization': globalStore.token } })
    if (res2.data.status === 1) {
      user.value = res2.data.message.account
      const res3 = await Myaxios.get('/user/info', { params: { account: user.value } })
      if (res3.data.status === 1) {
        user_info.value = res3.data.message
        user_info.value.avatar = user_info.value.avatar ? user_info.value.avatar : user_info.value.gender === '男' ? avatar_boy : avatar_gril
        user_info.value.motto = user_info.value.motto ? user_info.value.motto : '这个人很懒，什么都没留下'
        user_info.value.tel = user_info.value.tel ? user_info.value.tel : '未填写'
        isLogin.value = true
        // 预加载头像
        preloadAvatar()
      }
    } else {
      isLogin.value = false
    }
  } else {
    isLogin.value = false
  }
  // 获取文章列表
  await getArticleList()
  dealTime(article_list.value as unknown as article[])
})
watch(article_list, (newValue) => {
  is_commment.value = []
  newValue.forEach(() => {
    is_commment.value.push(false)
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
const onPraise = (praise: boolean, index: number) => {
  if (praise) {
    article_list.value[index].like_num--
    is_praise.value[index] = false
  } else {
    article_list.value[index].like_num++
    is_praise.value[index] = true
  }
}
const onOrginal = (index: number, id: number) => {
  drawer.value = true
  original_article.value = article_list.value[index]
  original_article_index.value = index
  getComment(id)
}
const back = () => {
  globalStore.setBackto_enum(true)
  window.history.back()
}
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('你确定要关闭发布窗口吗?', { confirmButtonText: '确认', cancelButtonText: '再想想' })
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
const SubmitArticle = async () => {
  if (!new_article.value) return
  // 创建临时DOM元素解析HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = new_article.value

  // 提取所有图片
  const images = tempDiv.querySelectorAll('img')
  const imageUrls = Array.from(images).map(img => img.src)

  // 提取带格式的HTML内容（不含图片）
  images.forEach(img => img.remove())
  const htmlContent = tempDiv.innerHTML

  const res = await Myaxios.post('/hole/publish', {
    account: user_info.value.account,
    title: article_title.value,
    content: htmlContent,
    image: imageUrls
  })
  if (res.data.status === 1) {
    ElMessage.success(res.data.message)
    drawer_new.value = false
    new_article.value = ''
    article_title.value = ''
    await getArticleList()
    dealTime(article_list.value as unknown as article[])
  } else {
    ElMessage.error(res.data.message)
  }
}
// 预加载头像图片
const preloadAvatar = () => {
  if (user_info.value.avatar) {
    const img = new Image()
    img.onload = () => {
      avatarLoading.value = false
    }
    img.onerror = () => {
      avatarLoading.value = false
    }
    img.src = user_info.value.avatar
  } else {
    avatarLoading.value = false
  }
}
// 获取文章列表
const getArticleList = async () => {
  const res = await Myaxios.get('/hole/get')
  if (res.data.status === 1) {
    article_list.value = res.data.message
    // 等待数据设置完成
    await nextTick()
    visible_list.value = article_list.value.slice(0, 3)
    // 等待 DOM 更新
    await nextTick()
    initObserver()
    article_list.value.forEach(async (item) => {
      is_praise.value.push(false)
      const account = item.account
      const res = await Myaxios.get('/user/info', { params: { account: account } })
      if (res.data.status === 1) {
        item.avatar = res.data.message.avatar ? res.data.message.avatar : res.data.message.gender === '男' ? avatar_boy : avatar_gril
        item.name = res.data.message.name
      }
    })
  }
}
// 处理时间
const dealTime = (article_list: article[]) => {
  article_list.forEach((item) => {
    const send = Number(item.time)
    const now = Math.floor(+new Date() / 1000)
    const sub = now - send
    if (sub < 60 * 60 * 24) {
      (item as { time: string }).time = '1天内'
    } else if (sub > 60 * 60 * 24 && sub < 60 * 60 * 24 * 7) {
      (item as { time: string }).time = Math.floor(sub / (60 * 60 * 24)) + '天前'
    } else if (sub > 60 * 60 * 24 * 7 && sub < 60 * 60 * 24 * 30) {
      (item as { time: string }).time = Math.floor(sub / (60 * 60 * 24 * 7)) + '周前'
    } else if (sub > 60 * 60 * 24 * 30 && sub < 60 * 60 * 24 * 365) {
      (item as { time: string }).time = Math.floor(sub / (60 * 60 * 24 * 30)) + '月前'
    } else if (sub > 60 * 60 * 24 * 365) {
      (item as { time: string }).time = Math.floor(sub / (60 * 60 * 24 * 365)) + '年前'
    }
  })
}
// 获取文章评论
const getComment = async (id: number) => {
  const res = await Myaxios.get('/hole/get_comment', { params: { id: id } })
  if (res.data.status === 1) {
    comment_list.value = res.data.message
    comment_list.value.forEach(async (item) => {
      const account = item.account
      const res1 = await Myaxios.get('/user/info', { params: { account: account } })
      if (res1.data.status === 1) {
        item.avatar = res1.data.message.avatar ? res1.data.message.avatar : res1.data.message.gender === '男' ? avatar_boy : avatar_gril
        item.name = res1.data.message.name
      }
    })
    dealTime(comment_list.value as unknown as article[])
    console.log(comment_list.value);
  } else {
    comment_list.value = []
  }
}
// 发送评论
const submit_comment = async (id: number) => {
  if (!comment_text.value) {
    ElMessage.warning('评论内容不能为空')
    return
  } else {
    const res = await Myaxios.post('/hole/comment', {
      id: id,
      account: user_info.value.account,
      content: comment_text.value
    })
    if (res.data.status === 1) {
      ElMessage.success(res.data.message)
      comment_text.value = ''
      getComment(id)
    } else {
      ElMessage.error(res.data.message)
    }
  }
}
// 获取出现在视口的元素
const initObserver = () => {
  const num = article_list.value.length
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
      getVisibleList()
    })
  }, {
    threshold: 0,
    rootMargin: '100px'
  })
  const cards = document.querySelectorAll('.main-card')
  cards.forEach(item => {
    observer.value?.observe(item)
  })
}
// 根据出现在视口的元素下标获取元素
const getVisibleList = () => {
  visible_list.value = []
  if (visible_index.value.length > article_list.value.length) {
    visible_list.value = article_list.value
  } else {
    visible_index.value.forEach((item) => {
      visible_list.value.push(article_list.value[Number(item)])
    })
  }
  visible_list.value.reverse()
  nextTick(() => {
    const newCards = document.querySelectorAll('.main-card:not([data-observed])')
    newCards.forEach(card => {
      observer.value?.observe(card)
      card.setAttribute('data-observed', 'true')
    })
  })
}
// 滚动到顶部
const handleScroll = () => {
  const scrollContainer = document.querySelector('.body')
  if (!scrollContainer) return
  const scrollPosition = scrollContainer.scrollTop
  const windowHeight = window.innerHeight
  scroll_top.value = scrollPosition >= (windowHeight * 0.8)
}
onMounted(() => {
  const scrollContainer = document.querySelector('.body')
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', handleScroll)
  }
})
onUnmounted(() => {
  const scrollContainer = document.querySelector('.body')
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', handleScroll)
  }
})
const scroll_to_top = () => {
  const scrollContainer = document.querySelector('.body')
  if (scrollContainer) {
    scrollContainer.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}
// 跳转登录页
const ToLogin = () => {
  window.location.href = '/login'
}
</script>

<template>
  <div class="bgc_w body">
    <!-- 滑至顶部按钮 -->
    <div class="scroll-top" v-if="scroll_top" @click="scroll_to_top" :class="{ 'mobile-scroll-top': isMobile }">
      <i class="iconfont icon-topDouble" style="color: black;font-weight: 900;cursor: pointer;"></i>
    </div>
    <!-- 顶部 -->
    <el-row class="top">
      <el-col :span="1"></el-col>
      <el-col :span="22" class="top-content">
        <div class="top-icon">
          <img src="../../assets/icon.png" alt="" style="width: 4vw;margin-right: 1vw;"
            :class="{ 'mobile-top-icon-img': isMobile }" />
          <div :style="{ fontSize: isMobile ? '30px' : '2vw' }">梦翔树洞</div>
        </div>
        <div class="top-saying" v-if="!isMobile">
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
        <div class="to-black change" :class="{ 'mobile-change': isMobile }">
          <div class="top-sun" v-if="!isDark" @click="to_black"
            :class="{ 'top-sun-animation': isAnimating_sun, 'mobile-top-icon': isMobile }">
            <Sunny style="color: red;transition:all 1.5s ;"
              :style="{ opacity: !isDark_animation ? 1 : 0, width: isMobile ? '8vw' : '2vw', margin: isMobile ? '1vw' : '0.5vw' }" />
          </div>
          <div class="top-dark" v-if="isDark" @click="to_white"
            :class="{ 'top-dark-animation': isAnimating_dark, 'mobile-top-icon': isMobile }">
            <Moon style="color: black;margin: 1vw; transition: all 1.5s;"
              :style="{ opacity: isDark_animation ? 1 : 0, width: isMobile ? '8vw' : '2vw', margin: isMobile ? '1vw' : '0.5vw' }" />
          </div>
          <BackBtn @click="back" :color="isDark_animation ? 'yellow' : 'black'"></BackBtn>
        </div>
      </el-col>
      <el-col :span="1"></el-col>
    </el-row>
    <!-- 主题内容 -->
    <el-row class="main">
      <el-col :span="isMobile ? 1 : 2"></el-col>
      <el-col :span="isMobile ? 22 : 16" class="cards">
        <div class="main-buttons">
          <el-button round style="width: 30%;padding:3vh;transition: all 1.5s;"
            :type="isDark_animation ? 'warning' : 'success'" @click="drawer_new = true">投稿树洞</el-button>
        </div>
        <div class="main-card" :style="{ background: isDark_animation ? '#374151' : '#fff' }"
          v-for="(item, index) in visible_list" :key="item.id" :id="String(index)"
          :class="{ 'mobile-main-card': isMobile }">
          <div class="card-top">
            <div class="card-avatar"> <img :src="item.avatar" alt="" class="card-avatar-img"> </div>
            <div class="card-top-aside">
              <div class="top-name">{{ item.name }}</div>
              <div class="top-time" :style="{ color: isDark_animation ? '#ccd0db' : '#4b5563' }">{{ item.time }}</div>
            </div>
          </div>
          <div class="card-body">
            <div class="body-link" @click="onOrginal(index, item.id)">
              <span href="#" :style="{ color: isDark_animation ? '#b4c6fa' : '#0866fe' }">@{{ item.title }}</span>
            </div>
            <div class="body-text" :style="{ color: isDark_animation ? '#d1d5db' : '#203656' }" v-html="item.content">
            </div>
            <div class="body-img" v-if="item.image">
              <img :src="item.image" alt="" style="width: 30%;">
            </div>

          </div>
          <div class="card-bottom">
            <div class="bottom-icons">
              <div class="praise" v-if="!is_praise[index]" @click="onPraise(false, index)">
                <i class="iconfont icon-dianzan"></i> 点赞
              </div>
              <div class="praise" v-if="is_praise[index]" @click="onPraise(true, index)">
                <i class="iconfont icon-dianzan" style="font-weight: 700;transition: all 1.5s;"
                  :style="{ color: isDark_animation ? 'skyblue' : 'blue' }"></i> {{ item.like_num }}
              </div>
              <div class="original-text" @click="onOrginal(index, item.id)">
                <i class="iconfont icon-yuanwenlianjie" style="font-size: 12px;font-weight: 200;"></i> &nbsp;原文
              </div>
              <div class="comment" @click="is_commment[index] = !is_commment[index]">
                <i class="iconfont icon-pinglun" style="font-weight: 600;"></i> 评论
              </div>
            </div>
            <transition name="fade">
              <div class="comment-place" v-if="is_commment[index]">
                <textarea type="text" style="min-height: 20vh;width: 100%;" class="comment-textarea"
                  placeholder="你的评论可以一针见血!" v-model="comment_text"></textarea>
                <div class="comment-buttons">
                  <el-button round type="danger" style="width: 10vw;" @click="is_commment[index] = false">取消</el-button>
                  <el-button round type="primary" style="width: 10vw;" @click="submit_comment(item.id)">提交</el-button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="main-aside" v-if="!isMobile">
        <div class="aside-card1" :style="{ background: isDark_animation ? '#374151' : '#fff' }">
          <div class="aside-card1-top" v-if="isLogin">
            <div class="card1-avatar" :style="{ 'border-color': isDark_animation ? '#374151' : '#fff' }">
              <!-- 加载动画 -->
              <div v-if="avatarLoading" class="avatar-loading">
                <div class="avatar-loading-spinner"></div>
              </div>
              <!-- 头像图片 -->
              <div class="avatar-image"
                :style="{ 'background-image': `url(${user_info.avatar})`, 'opacity': avatarLoading ? 0 : 1 }"
                v-show="!avatarLoading"></div>
            </div>
          </div>
          <div class="aside-card1-top" v-else>
            <div class="card1-avatar card1-avatar-login" @click="ToLogin"
              :style="{ 'border-color': isDark_animation ? '#374151' : '#fff' }">
              <div :style="{ color: isDark_animation ? '#ccd0db' : '#4b5563' }">点击登录</div>
            </div>
          </div>
          <div class="aside-card1-bottom" v-if="isLogin">
            <div class="card1-bottom-name" :style="{ color: isDark_animation ? '#d1d5db' : '#203656' }">{{
              user_info.name
              }}</div>
            <div class="card1-bottom-text" :style="{ color: isDark_animation ? '#d1d5db' : '#203656' }">
              {{ user_info.motto }}</div>
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
      <el-col :span="isMobile ? 1 : 2"></el-col>
    </el-row>

    <!-- 原文抽屉 -->
    <el-drawer v-model="drawer" :with-header="false" :style="{ background: isDark_animation ? '#1f2937' : '#ebf0f6' }"
      :size="isMobile ? '80%' : '40%'" :direction="isMobile ? 'btt' : 'rtl'">
      <div class="drawer">
        <div class="drawer-top">
          <div class="drawer-top-avatar">
            <img :src="original_article.avatar" alt=""
              style="width: 100%;height: 100%;object-fit: fill; border-radius: 15%;">
          </div>
          <div class="drawer-top-name">{{ original_article.name }}</div>
          <div class="drawer-top-time" :style="{ color: isDark_animation ? '#ccd0db' : '#4b5563' }">
            {{ original_article.time }}</div>
          <div class="drawer-top-love" @click="onPraise(is_praise[original_article_index], original_article_index)">
            <i class="iconfont icon-dianzan-aixinshixin" style="font-size: 30px;"
              :style="{ color: is_praise[original_article_index] ? 'red' : 'gray' }"></i>
          </div>
        </div>
        <div class="drawer-body">
          <div class="drawer-body-title" :style="{ color: isDark_animation ? '#b4c6fa' : '#0866fe' }">
            @{{ original_article.title }}
          </div>
          <div class="drawer-body-text" v-html="original_article.content"></div>
          <div class="body-img" v-if="original_article.image">
            <img :src="original_article.image" alt="" style="width: 70%;">
          </div>
        </div>
        <div class="drawer-send-comment">
          <div class="drawer-send-comment-title">发表评论</div>
          <div class="comment-place">
            <textarea type="text" style="min-height: 20vh;width: 100%;" class="comment-textarea" placeholder="这里书写你的评论"
              v-model="comment_text"></textarea>
            <div class="comment-buttons" style="justify-content: center;">
              <el-button round type="primary" style="width: 20vw;"
                @click="submit_comment(original_article.id)">提交</el-button>
            </div>
          </div>
        </div>
        <div class="drawer-bottom">
          <div class="drawer-bottom-title">评论列表</div>
          <div class="drawer-comment-card" v-for="(item, index) in comment_list" :key='index'>
            <div class="drawer-comment-avatar">
              <img :src="item.avatar"
                style="width: 100%;height: 100%;object-fit: fill; border-radius: 50% 50% 50% 50%;">
            </div>
            <div class="drawer-comment-context" :style="{ background: isDark_animation ? '#374151' : '#fff' }">
              <div class="drawer-context-title">
                <div class="drawer-context-name">{{ item.name }}</div>
                <div class="drawer-context-time" :style="{ color: isDark_animation ? '#ccd0db' : '#4b5563' }">{{
                  item.time }}</div>
              </div>
              <div class="drawer-context-text">{{ item.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- 发表抽屉 -->
    <el-drawer v-model="drawer_new" :with-header="false"
      :style="{ background: isDark_animation ? '#1f2937' : '#ebf0f6' }" :before-close="handleClose"
      :size="isMobile ? '93%' : '45%'" :direction="isMobile ? 'btt' : 'rtl'">
      <div class="drawer-new">
        <div class="drawer-new-title">
          <div>发表文章</div>
          <input type="text" placeholder="书写标题" class="drawer-new-title-right" v-model="article_title">
        </div>
        <TextEdit class="drawer-new-text" height="73vh" v-model="new_article"></TextEdit>
        <div class="drawer-new-buttons">
          <el-button class="drawer-new-btn" round type="danger" @click="drawer_new = false">取消投稿</el-button>
          <el-button class="drawer-new-btn" round type="primary" @click="SubmitArticle">确认发布</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped>
/* #region */
.scroll-top {
  position: fixed;
  bottom: 5vh;
  right: 5vw;
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

.top {
  height: 13vh;
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
  margin-bottom: 4vh;
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
  cursor: pointer;
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
  top: 100%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  aspect-ratio: 1/1;
  background-size: 100% 100%;
  border-radius: 50%;
  background-color: #d3d8dd;
  border: 5px solid #fff;
  transition: all 1.5s;
  overflow: hidden;
  position: relative;
}

.card1-avatar-login {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, #374151, #fff);
  cursor: pointer;
}

.card1-avatar>div {
  text-align: center;
  width: 100%;
  font-size: 20px;
  font-weight: 900;
}

.avatar-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  transition: opacity 0.5s ease;
}

.avatar-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(211, 216, 221, 0.5);
}

.avatar-loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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

/* #endregion */
.drawer-new-title {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 20px;
  padding-bottom: 3vh;
  margin-bottom: 3vh;
  padding-top: 2vh;
  border-bottom: 2px solid #dddddd;
}

.drawer-new-title-right {
  width: 70%;
  background-color: #d3d8dd;
  border-radius: 20px;
  font-size: 15px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  padding: 5px;
  padding-left: 15px;
  border: none;
}

.drawer-new-text {
  width: 100%;
  height: 70vh;
  background-color: #d3d8dd;
  border-radius: 10px;
  font-size: 15px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.drawer-new-buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 5vw;
  margin-top: 2vh;
}

.drawer-new-btn {
  width: 40%;
  padding: 20px;
}

/* #endregion */
/* 移动端适配 */
.mobile-top-icon-img {
  width: 15vw !important;
}

.mobile-change {
  width: 25vw;
}

.mobile-top-icon {
  width: 10vw;
  height: 10vw;
}

.mobile-scroll-top {
  right: 2vw;
  width: 9vw;
  height: 10vw;
  line-height: 10vw;
  opacity: 0.5;
}

.mobile-main-card {
  width: 100%;
}
</style>
