<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import axios from "@/axios"
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useUserStore } from "@/stores"
import { useGlobalStore } from "@/stores"
import LoginDetail from "@/components/LoginDetail.vue"
import BackBtn from '@/components/BackBtn.vue';

const form = ref()
const regist_success = ref(false)
const globalStore = useGlobalStore()
const userstore = useUserStore()
const isRegister = ref(true)
const shapesVisible = ref(true)
const formModel = ref({
  username: '',
  password: '',
  Invitation: ''
})
const isMobile = ref(true)
isMobile.value = globalStore.isMobile
// 注册规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名必须是5-10位的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    }
  ],
  Invitation: [
    { required: true, message: '请输入邀请码', trigger: 'blur' }
  ]
}
const reset = () => {
  formModel.value.username = ''
  formModel.value.password = ''
}
onMounted(() => {
  // 初始化shape元素动画
  showShapes()
})

// 显示shape元素的函数
const showShapes = () => {
  shapesVisible.value = true
}

// 隐藏shape元素的函数
const hideShapes = () => {
  shapesVisible.value = false
}

const to_register = () => {
  // 先隐藏shape元素
  hideShapes()
  // 切换到注册表单
  isRegister.value = true
  // 等表单切换动画完成后再显示shape元素
  setTimeout(() => {
    showShapes()
  }, 600) // 与shape动画时长一致
}

// 从注册页面返回登录页面
const to_login = () => {
  // 先隐藏shape元素
  hideShapes()
  // 切换到登录表单
  isRegister.value = false
  // 等表单切换动画完成后再显示shape元素
  setTimeout(() => {
    showShapes()
  }, 600) // 与shape动画时长一致
}

// 注册
const register = async () => {
  try {
    // 先进行表单验证
    await (form.value as FormInstance).validate()

    if (!formModel.value.Invitation) {
      ElMessage.error('请输入邀请码')
      return
    } else if (formModel.value.Invitation !== 'mengxiang666') {
      ElMessage.error('邀请码错误')
      return
    }
    // 验证通过后执行注册请求
    const res = await axios.post('/register', {
      account: formModel.value.username,
      password: formModel.value.password
    })

    if (res.data.status === 0) {
      ElMessage.error(res.data.message)
    } else {
      userstore.set_account(formModel.value.username)
      ElMessage.success(res.data.message)
      regist_success.value = true
    }
    reset()
  } catch (error) {
    console.log(error)
  }
}

// 登录
const login = async () => {
  try {
    // 先进行表单验证
    await (form.value as FormInstance).validate()
    // 验证通过后执行注册请求
    const res = await axios.post('/login', {
      account: formModel.value.username,
      password: formModel.value.password
    })

    if (res.data.status === 0) {
      ElMessage.error(res.data.message)
    } else {
      userstore.set_account(formModel.value.username)
      ElMessage.success(res.data.message)
    }
    reset()
  } catch (error) {
    console.log(error)
  }

}

// 返回
const back = () => {
  window.history.back()
}
</script>

<template>
  <div class="back" :class="{ 'Mobile_back': isMobile }">
    <BackBtn @click="back"></BackBtn>
  </div>
  <div class="mask" v-if="regist_success"></div>
  <div class="bgc"></div>
  <!-- 登录页面 -->
  <div class="login_interface">
    <transition name="shape-transition">
      <div class="shape" v-if="shapesVisible && !isMobile" key="shape1"></div>
    </transition>
    <transition name="shape-transition">
      <div class="shape" v-if="shapesVisible && !isMobile" key="shape2"></div>
    </transition>
    <!-- 表单切换动画 -->
    <transition name="form-fade" mode="out-in">
      <!-- 注册 -->
      <el-form :model="formModel" :rules="rules" ref="form" :size="isMobile ? 'default' : 'large'" autocomplete="off"
        v-if="isRegister" class="form" key="register">
        <el-form-item>
          <div class='title'>
            <h1>注册</h1>
          </div>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="formModel.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formModel.password" :prefix-icon="Lock" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="Invitation">
          <el-input v-model="formModel.Invitation" :prefix-icon="Lock" placeholder="请输入邀请码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="register_button" type="primary" auto-insert-space @click="register">注册</el-button>
          <el-button class="reset_button" type="primary" auto-insert-space @click="reset">重置</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="to_login">
            ← 登录
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登录 -->
      <el-form ref="form" :model="formModel" :rules="rules" :size="isMobile ? 'default' : 'large'" autocomplete="off"
        v-else class="form" key="login">
        <el-form-item>
          <div class='title'>
            <h1>登录</h1>
          </div>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="formModel!.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
            v-model="formModel!.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="register_button" type="primary" auto-insert-space @click="login">登录</el-button>
          <el-button class="reset_button" type="primary" auto-insert-space @click="reset"> 重置</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="to_register">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </transition>
  </div>

  <!-- 详细信息 -->
  <LoginDetail class="loginDetail" v-if="regist_success"></LoginDetail>
</template>

<style scoped>
.back {
  position: fixed;
  top: 4vh;
  left: 1vw;
  z-index: 1;
}

.Mobile_back {
  top: 5vh;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
}

.bgc {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: url('https://darling-1352300125.cos.ap-beijing.myqcloud.com/mengxiang/picture/login_bgc.jpg') no-repeat center;
  background-size: cover;
}

.login_interface {
  position: absolute;
  width: 20%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .login_interface {
    width: 85%;
  }
}

.login_interface .shape {
  height: 10vw;
  width: 10vw;
  position: absolute;
  border-radius: 50%;
  /* 移除内联动画，完全依赖Vue的transition组件 */
}

/* 移动端适配shape元素 */
@media screen and (max-width: 768px) {
  .login_interface .shape {
    height: 20vw;
    width: 20vw;
  }
}

.shape:nth-child(1) {
  background: linear-gradient(#1845ad, #23a2f6);
  left: -25%;
  top: -15%;
}

.shape:nth-child(2) {
  background: linear-gradient(to right, #ff512f, #f09819);
  right: -25%;
  bottom: -15%;
}

/* 移动端适配shape元素位置 */
@media screen and (max-width: 768px) {
  .shape:nth-child(1) {
    left: -15%;
    top: -10%;
  }

  .shape:nth-child(2) {
    right: -15%;
    bottom: -10%;
  }
}


.form {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.13);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
  padding: 50px 35px;
}

/* 移动端适配表单样式 */
@media screen and (max-width: 768px) {
  .form {
    padding: 30px 20px;
  }
}

:deep(.el-input .el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.13);
}

:deep(.el-input .el-input__inner) {
  color: white;
}

:deep(.el-input .el-input__prefix) {
  color: rgba(255, 255, 255, 0.5);
}

:deep(.el-input .el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.5);
}

.title {
  margin: 0 auto;
  color: #fff;
  margin-bottom: 3vh;
}

.register_button {
  width: 30%;
  background-color: rgba(64, 158, 255, 0.6)
}

.register_button:hover {
  background-color: rgba(64, 158, 255, 1)
}

.reset_button {
  width: 30%;
  margin-left: 40%;
  background-color: rgba(245, 126, 36, 0.6);
}

.reset_button:hover {
  background-color: rgba(245, 126, 36, 1);
}

/* 移动端适配按钮样式 */
@media screen and (max-width: 768px) {
  .register_button {
    width: 45%;
  }

  .reset_button {
    width: 45%;
    margin-left: 10%;
  }
}

.flex {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.loginDetail {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

/* 表单切换动画 */
.form-fade-enter-active,
.form-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.form-fade-enter-from,
.form-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.form-fade-enter-to,
.form-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* 移除旧的Shape动画关键帧 */

/* Shape过渡动画 - 优化后 */
.shape-transition-enter-active,
.shape-transition-leave-active {
  transition: opacity 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.shape-transition-enter-from,
.shape-transition-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.shape-transition-enter-to,
.shape-transition-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}
</style>
