<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from "vue";
import axios from '../../axios/index'
import type { article } from '../../Types/article'
import { useUserStore } from '../../stores/index'
import { ElMessage } from 'element-plus'

const lists_ref = ref<null | HTMLDivElement>(null);
const progress_ref = ref<null | HTMLDivElement>(null);
const list_data = ref<article[]>([])
const user_store = useUserStore()
let timer: number = 0
onBeforeMount(() => {
  get_list()
})
onMounted(() => {
  // clientHeight 可视高度  scrollHeight 总的元素高度  scrollTop 滚动高度
  // console.log(lists.value!.clientHeight, lists.value!.scrollHeight, lists.value!.scrollTop)
  setTimeout(() => {
    const precent = ((lists_ref.value!.scrollTop + lists_ref.value!.clientHeight) / lists_ref.value!.scrollHeight * 100).toFixed(2) + '%'
    progress_ref.value!.style.setProperty('--progress', precent)
  }, 1000);
  lists_ref.value?.addEventListener('scroll', onScroll)
})
const onScroll = () => {
  if (timer) {
    clearTimeout(timer)
  }
  if (!lists_ref.value) return
  const precent = ((lists_ref.value!.scrollTop + lists_ref.value!.clientHeight) / lists_ref.value!.scrollHeight * 100).toFixed(2) + '%'
  console.log(precent)
  timer = window.setTimeout(() => {
    progress_ref.value!.style.setProperty('--progress', precent)
  }, 100);
}

const get_list = async () => {
  const res = await axios.post('/hole/mine', { account: user_store.get_account() })
  if (res.data.status === 1) {
    list_data.value = res.data.message
    console.log(list_data.value)
  }
}
const delete_article = async (id: number) => {
  const res = await axios.post('/hole/delete', { id: id })
  if (res.data.status === 1) {
    ElMessage.success('删除成功')
    if (list_data.value.length === 1) {
      list_data.value = []
    } else {
      get_list()
    }
  } else {
    ElMessage.error('删除失败')
  }
}
</script>

<template>
  <div class="tree-container">
    <div class="progress-bar" ref="progress_ref"></div>
    <div class="tree-lists" ref="lists_ref">
      <div class="tree-list-item" v-for="(item) in list_data" :key="item.id">
        <div class="list-item-left">
          <img :src="item.image" alt="图片" v-if="item.image" />
          <text :style="{ filter: `hue-rotate(${Math.random() * 360}deg)` }" v-else> {{ item.title.substring(0,
            Math.floor(Math.random() * 3 + 1)) }} </text>
        </div>
        <div class="list-item-right">
          <div class="right-title"><span>标题：</span>
            <div class="right-title-text">{{ item.title }}</div>
          </div>
          <div class="right-content" v-html="item.content"></div>
        </div>
        <div class="list-item-btns">
          <div class="delete-icon" @click="delete_article(item.id)">
            <i class="iconfont icon-shanchu"></i>
          </div>
        </div>
      </div>
      <div class="tree-list-empty" v-if="list_data.length === 0">当前空空如也~~</div>
    </div>
  </div>
</template>

<style scoped>
.tree-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  padding: 4vh 2vw;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 5px;
  border-radius: 5px;
  background: #dddddd;
  --progress: 0;
}

.progress-bar::before {
  content: '';
  position: absolute;
  width: var(--progress);
  height: 100%;
  border-radius: 5px;
  background: linear-gradient(to right, red, red 50%, white 60%, red 70%);
  background-size: 200% 100%;
  animation: background-move 3s linear infinite;
  transition: all 0.5s ease-in-out;
}

.tree-lists {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #08EDF3, #6CFABF, #CAFC85, #08EDF3);
  background-size: 200% 100%;
  border-radius: 20px;
  animation: background-move 3.5s linear infinite;
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

.tree-list-item {
  position: relative;
  flex-shrink: 0;
  width: 100%;
  height: 120px;
  background: white;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  user-select: none;
}

.list-item-left {
  height: 100%;
  aspect-ratio: 1/1;
  background: #f1f1f1;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-content: center;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.list-item-left img {
  width: 100%;
  height: 100%;
  border-radius: 20px;
}

.list-item-left text {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 900;
  color: black;
  background: orange;
  border-radius: 20px;
}

.list-item-right {
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  background: rgb(221, 221, 221);
  border-radius: 20px;
  margin-left: 20px;
  padding: 10px;
  padding-right: 65px;
}

.right-title {
  display: flex;
  width: 100%;
  font-weight: 600;
  background: linear-gradient(to right, black, gray, black);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
  color: transparent;
  background-size: 200% 100%;
  animation: background-move 2s linear infinite;
}

.right-title-text {
  text-overflow: ellipsis;
  overflow: hidden;
}

.right-title span {
  display: block;
  font-weight: 900;
}

.right-content {
  font-size: 14px;
  color: #3c3c3c;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  line-height: 1.5;
  -webkit-box-orient: vertical;
  word-break: break-all;
  overflow: hidden;
}

.tree-list-empty {
  font-weight: 600;
  font-size: 20px;
  background: linear-gradient(to right, black, gray, black);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
  color: transparent;
  background-size: 200% 100%;
  animation: background-move 2s linear infinite;
}

.list-item-btns {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete-icon {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  background: white;
  color: red;
  font-size: 20px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
}

.delete-icon .iconfont {
  font-size: 20px;
}

.delete-icon:hover {
  background: red;
  color: white;
}

@media screen and (max-width: 768px) {
  .tree-container {
    height: 79vh;
    padding: 0;
    padding-top: 10px;
  }

  .tree-lists {
    padding: 4px;
    padding-top: 10px;
    gap: 8px;
  }

  .tree-list-item {
    min-height: 0;
    height: 80px;
  }

  .list-item-right {
    margin-left: 10px;
    font-size: 12px;
    padding-right: 40px;
  }

  .right-content {
    font-size: 10px;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .list-item-btns {
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
  }

  .delete-icon {
    width: 30px;
    height: 30px;
  }

  .delete-icon .iconfont {
    font-size: 15px;
  }
}
</style>
