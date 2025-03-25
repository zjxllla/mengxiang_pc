import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useGlobalStore = defineStore(
  'global',
  () => {
    const backto_enum = ref(false)
    const getBackto_enum = () => {
      return backto_enum.value
    }
    const setBackto_enum = (value: boolean) => {
      backto_enum.value = value
    }
    return {
      backto_enum,
      getBackto_enum,
      setBackto_enum,
    }
  },
  { persist: true },
)
