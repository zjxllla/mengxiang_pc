import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { blog } from '@/Types/article'
export const useBlogStore = defineStore(
  'blog',
  () => {
    const blog = ref<blog>()
    const isLove = ref<boolean>(false)
    const setBlog = (data: blog) => {
      blog.value = data
    }
    const setLove = (data: boolean) => {
      isLove.value = data
    }
    return {
      blog,
      isLove,
      setBlog,
      setLove,
    }
  },
  { persist: true },
)
