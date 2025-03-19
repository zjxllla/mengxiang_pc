<script setup lang="ts">

</script>

<template>
  <div class="container">
    <div class="title_bgc">
      <h1 class="title">梦翔工作室</h1>
    </div>
    <div class="about_us">
      <div class="about_us_title">关于我们</div>
      <div class="line"></div>
      <div class="content">这是介绍内容这是介绍内容这是介绍内容这是介绍内容这是介绍内容这是介绍内容这是介绍内容这是介绍内容这是介绍内容这是介绍内容这是介绍内容这是介绍内容这是介绍内容这是介绍内容这是介绍内容
      </div>
    </div>
    <div>其他1</div>
    <div>其他1</div>
    <div>其他1</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
    <div>其他</div>
  </div>
</template>

<style scoped>
.container {
  color: white;
}

.title_bgc {
  position: relative;
  width: 100%;
  height: 681px;
  font-size: 80px;
  font-weight: bold;
  color: #000;
  background: url('../../assets/main_pic1.jpg') no-repeat center;
  background-size: cover;
}

.title_bgc::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 0;
}

.title {
  position: relative;
  text-align: center;
  top: 30%;
  z-index: 1;
  color: white;
}

.about_us_title {
  text-align: center;
  margin-top: 50px;
  font-size: 30px;
  font-weight: 700;
}

.line {
  width: 90px;
  border: 2px solid skyblue;
  margin: 20px auto;
}

.content {
  width: 60%;
  margin: 0 auto;
  margin-top: 50px;
  font-size: 21px;
}
</style>
