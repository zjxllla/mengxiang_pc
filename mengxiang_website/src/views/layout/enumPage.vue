<script setup lang="ts">

</script>

<template>
  <div class="menu_bgc">
    <el-row>
      <el-col :span="10" class="aside"></el-col>
      <el-col :span="14" class="enum_text">
        <div>成员信息</div>
        <div>加入我们</div>
        <div>梦翔树洞</div>
        <div>博客</div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.menu_bgc {
  position: relative;
  width: 100%;
  height: 100vh;
  background: url('../../assets/enum_pic1.jpg') no-repeat center;
  background-size: cover;
}

.aside,
.enum_text {
  height: 100vh;
}
</style>