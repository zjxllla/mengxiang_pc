import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore('user', () => {
  const user_account = ref('')
  const get_account = () => {
    return user_account.value
  }
  const set_account = (value: string) => {
    user_account.value = value
  }
  return {
    user_account,
    get_account,
    set_account,
  }
})
