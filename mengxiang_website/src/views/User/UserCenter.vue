<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useGlobalStore } from '../../stores'
import axios from '../../axios'
const user_info = ref({
  name: '',
  account: '',
  gender: '',
  motto: '',
  grade: '',
  tel: '',
  nickname: ''
})
const globalStore = useGlobalStore()
const avatar = ref('')
onBeforeMount(async () => {
  //  自动登录
  if (globalStore.token) {
    const res = await axios.post('/auto_login', {}, { headers: { 'Content-Type': 'application/json', 'Authorization': globalStore.token } })
    if (res.data.status === 1) {
      user_info.value.account = res.data.message.account
      getUserInfo()
    } else {
      globalStore.token = ''
      ElMessage.warning('当前token已过期请重新登录')
    }
  }
})
const getUserInfo = async () => {
  const res = await axios.get('/user/info', { params: { account: user_info.value.account } })
  if (res.data.status === 1) {
    user_info.value = res.data.message
    avatar.value = res.data.message.avatar
  }
}

// 图片上传成功
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleAvatarSuccess = async (res: any) => {
  avatar.value = res.data[0].url
  const res1 = await axios.post('/alter/avatar', { account: user_info.value.account, avatar: avatar.value })
  console.log(res1)
  if (res1.data.status === 1) {
    ElMessage.success('修改头像成功')
  } else {
    ElMessage.error('修改头像失败')
  }
}
// 上传图片前
const beforeAvatarUpload = (file: { type: string | string[] }) => {
  const isImage = file.type.includes('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false // 阻止上传
  }
  return true
}
// 退出登录
const logout = () => {
  globalStore.token = ''
  window.location.href = '/'
}
// 保存
const save = async () => {
  if (user_info.value.nickname.length > 15) {
    ElMessage.error('昵称最长为15个字符')
    return
  }
  const res = await axios.post('/alter/info', {
    account: user_info.value.account,
    name: user_info.value.name, gender: user_info.value.gender,
    grade: user_info.value.grade, motto: user_info.value.motto,
    tel: user_info.value.tel, nickname: user_info.value.nickname
  })
  if (res.data.status === 1) {
    ElMessage.success('保存信息成功')
  } else {
    ElMessage.error('保存信息失败')
  }
}
</script>

<template>
  <div class="user-center">
    <div class="top">
      <div class="top-avatar">
        <el-upload class="avatar-uploader" action="http://8.140.27.245:8080/wang/image" :show-file-list="false"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="avatar" :src="avatar" />
          <el-icon v-else>
            <Plus />
          </el-icon>
        </el-upload>
      </div>
      <div class="top-message">
        <div class="message-name">
          <div class="message-title">姓名：</div>
          <div class="message-text">{{ user_info.name }}</div>
        </div>
        <div class="message-motto">
          <div class="message-title">账号：</div>
          <div class="message-text">{{ user_info.account }}</div>
        </div>
      </div>
      <div class="top-right">
        <el-button type="success" round @click="save">保存修改</el-button>
        <el-button type="danger" round @click="logout">退出登录</el-button>
      </div>
    </div>

    <div class="main">
      <div class="main-item">
        <div class="main-item-title" style="color: #64b035;">昵称：</div>
        <input class="main-item-text" :placeholder="user_info.nickname || '请设置你的昵称'" v-model="user_info.nickname" />
      </div>
      <div class="main-item">
        <div class="main-item-title" style="color: #64b035;">个性签名：</div>
        <textarea class="main-item-textarea" :placeholder="user_info.motto || '请设置你的个性签名'"
          v-model="user_info.motto"></textarea>
      </div>
      <div class="main-item">
        <div class="main-item-title">性别：</div>
        <div class="main-item-text">
          <i class="iconfont icon-xingbie-nan" style="color: blue;" v-if="user_info.gender === '男'"></i>
          <i class="iconfont icon-xingbie-nv" style="color: pink;" v-else></i>
        </div>
      </div>
      <div class="main-item">
        <div class="main-item-title">年级：</div>
        <div class="main-item-text">20{{ user_info.grade }}</div>
      </div>
      <div class="main-item">
        <div class="main-item-title">手机号：</div>
        <div class="main-item-text">{{ user_info.tel }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  padding: 4vh 2vw;
}

/* 顶部 */
/* #region */
.top {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 20px;
  width: 100%;
  height: 30%;
  border-radius: 20px;
  background-color: #fff;
  padding: 0 2vw;
}

.top-avatar {
  position: relative;
  height: 80%;
  aspect-ratio: 1;
  background: #3d3d3d;
  border-radius: 20px;
}

.avatar-uploader {
  width: 100%;
  height: 100%;
}

/* 使用深度选择器来修改 Element Plus 组件的内部样式 */
:deep(.el-upload) {
  width: 100% !important;
  height: 100% !important;
  color: white;
  font-size: 20px;
  /* 添加其他你需要的样式 */
  border: none !important;
  background: transparent !important;
  cursor: pointer !important;
}

/* 或者使用更具体的选择器 */
.avatar-uploader :deep(.el-upload) {
  width: 100% !important;
  height: 100% !important;
  color: white;
  font-size: 20px;
  border: none !important;
  background: transparent !important;
  cursor: pointer !important;
}

.top-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 20px;
}

.top-avatar-none {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  color: white;
  font-weight: 700;
  font-size: 18px;
}

.top-message {
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.message-name {
  display: flex;
  font-size: 18px;
}

.message-motto {
  display: flex;
  font-size: 16px;
}

.message-title {
  min-width: 70px;
  font-weight: 700;
  color: #026383;
}

.message-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-right {
  height: 70%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin-left: auto;
}

.top-right .el-button {
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* #endregion */

/* 主体 */
/* #region */
.main {
  width: 100%;
  height: 65%;
  background: white;
  border-radius: 20px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.main::-webkit-scrollbar {
  display: none;
}

.main-item {
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 0 25px;
  width: 100%;
  min-height: 50px;
  border-bottom: 1px solid #3d3d3d;
}

.main-item-title {
  min-width: 100px;
  font-size: 16px;
  font-weight: 600;
  color: #026383;
}

.main-item-text {
  font-size: 16px;
  color: #3d3d3d;
}

.main-item input {
  width: 100%;
  height: 50px;
  border: none;
}

input:focus {
  outline: none;
}

.main-item-textarea {
  width: 100%;
  min-height: 30px;
  border: none;
  resize: none;
  font-size: 16px;
  color: #3d3d3d;
  padding-top: 15px;
  font-family: "Helvetica Neue",
    Helvetica,
    "PingFang SC",
    "Hiragino Sans GB",
    "Microsoft YaHei",
    "微软雅黑",
    Arial,
    sans-serif;
}

textarea:focus {
  outline: none;
}

/* #endregion */

/* 手机端样式 */
@media screen and (max-width: 768px) {
  .user-center {
    gap: 10px;
  }

  .top {
    flex-wrap: wrap;
    height: auto;
    padding: 5px;
    gap: 10px;
  }

  .top-avatar {
    width: 100px;
    height: 100px;
  }

  .top-right {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    gap: 20px;
    align-items: center;
  }

  .message-title {
    width: unset;
    min-width: 0;
    font-size: 14px;
  }

  .message-text {
    font-size: 14px;
  }

  .main-item {
    padding: 0 10px;
  }

  .main-item-title {
    min-width: 80px;
  }
}
</style>
