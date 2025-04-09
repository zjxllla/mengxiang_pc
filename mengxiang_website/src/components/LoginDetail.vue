<script setup lang="ts">
import { ref } from 'vue';
import axios from "@/axios"
import { useUserStore } from "@/stores"
import { useGlobalStore } from "@/stores"
import { ElMessage } from 'element-plus'

const userstore = useUserStore()
const globalStore = useGlobalStore()
const isMobile = ref(false)
isMobile.value = globalStore.isMobile
const gender = ref('0');
const name = ref('');
const grade = ref('');
const tel = ref('');
const motto = ref('');
const grades = ['22级', '23级', '24级', '25级']

const submit = async (event: Event) => {
  event.preventDefault();
  const res = await axios.post('/improve/info', {
    account: userstore.get_account(),
    name: name.value,
    gender: gender.value,
    grade: grade.value,
    tel: tel.value,
    motto: motto.value,
  })
  if (res.data.status === 0) {
    ElMessage.error(res.data.message)
  } else {
    ElMessage.success(res.data.message)
  }
}

const radio = () => {
  document.querySelector('.gender_title')?.classList.add('change_color');
}
</script>

<template>
  <form class="form">
    <p class="title"> 完善信息 </p>
    <p class="message">完善个人信息，让我们更好了解你！ </p>
    <div class="flex">
      <label>
        <input :required="true" type="text" class="input" v-model="name">
        <span>姓名</span>
      </label>

      <label>
        <el-select v-model="grade" placeholder="年级" size="large" style="width: 8vw;height: 100%;">
          <el-option v-for="(item, index) in grades" :key="index" :value="item" style="height: 100%;" />
        </el-select>
      </label>
    </div>

    <label>
      <input :required="true" type="tel" class="input" v-model="tel">
      <span>联系电话</span>
    </label>

    <label>
      <span style="color:#808080; padding-left: 0.5vw; margin-right: 5vw;" class="gender_title">性别</span>
      <el-radio-group v-model="gender">
        <el-radio value="1" :size="isMobile ? 'default' : 'large'" style="margin-right: 5vw;"
          @click="radio">男</el-radio>
        <el-radio value="2" :size="isMobile ? 'default' : 'large'" @click="radio">女</el-radio>
      </el-radio-group>
    </label>
    <label>
      <input :required="true" type="text" class="input" v-model="motto">
      <span>签名</span>
    </label>
    <button class="submit" @click="submit">提交信息</button>
  </form>
</template>
<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 25vw;
  max-height: 80vh;
  background-color: #fff !important;
  padding: 20px;
  border-radius: 20px;
  position: relative;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .form {
    max-width: 85vw;
    padding: 15px;
    gap: 8px;
  }
}

.title {
  font-size: 28px;
  color: royalblue;
  font-weight: 600;
  letter-spacing: -1px;
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 30px;
}

/* 移动端适配标题 */
@media screen and (max-width: 768px) {
  .title {
    font-size: 24px;
    padding-left: 25px;
  }
}

.title::before,
.title::after {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  border-radius: 50%;
  left: 0px;
  background-color: royalblue;
}

.title::before {
  width: 18px;
  height: 18px;
  background-color: royalblue;
}

.title::after {
  width: 18px;
  height: 18px;
  animation: pulse 1s linear infinite;
}

.message,
.signin {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

.signin {
  text-align: center;
}

.signin a {
  color: royalblue;
}

.signin a:hover {
  text-decoration: underline royalblue;
}

.flex {
  display: flex;
  width: 100%;
  gap: 6px;
}

/* 移动端适配flex布局 */
@media screen and (max-width: 768px) {
  .flex {
    flex-direction: column;
    gap: 10px;
  }
}

.form label {
  position: relative;
}

.form label .input {
  width: 100%;
  padding: 10px 10px 20px 10px;
  outline: 0;
  border: 1px solid rgba(105, 105, 105, 0.397);
  border-radius: 10px;
}

/* 移动端适配输入框 */
@media screen and (max-width: 768px) {
  .form label .input {
    padding: 8px 8px 18px 8px;
  }
}

.form label .input+span {
  position: absolute;
  left: 10px;
  top: 15px;
  color: grey;
  font-size: 0.9em;
  cursor: text;
  transition: 0.3s ease;
}

.form label .input:placeholder-shown+span {
  top: 15px;
  font-size: 0.9em;
}

.form label .input:focus+span,
.form label .input:valid+span {
  top: 30px;
  font-size: 0.7em;
  font-weight: 600;
}

.form label .input:valid+span {
  color: green;
}

.submit {
  border: none;
  outline: none;
  background-color: royalblue;
  padding: 10px;
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  transform: .3s ease;
  margin-top: 10px;
}

/* 移动端适配提交按钮 */
@media screen and (max-width: 768px) {
  .submit {
    padding: 8px;
    font-size: 14px;
  }
}

.submit:hover {
  background-color: rgb(56, 90, 194);
}

.change_color {
  color: #008000 !important;
  font-weight: 700;
}

@keyframes pulse {
  from {
    transform: scale(0.9);
    opacity: 1;
  }

  to {
    transform: scale(1.8);
    opacity: 0;
  }
}

::v-deep .el-select--large .el-select__wrapper {
  min-height: 47px;
  border: 1px solid rgba(105, 105, 105, 0.397);
  border-radius: 10px;
}

::v-deep .el-select .is-transparent {
  color: #808080 !important;
}

::v-deep.el-select__placeholder {
  color: black !important;
}
</style>
