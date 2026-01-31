import axios from 'axios'
import { useGlobalStore } from '../stores'
const globalStore = useGlobalStore()
const instance = axios.create({
  baseURL: 'http://101.201.170.43:8080',
  // baseURL: 'http://localhost:8080',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: globalStore.token || '',
  },
})
export default instance
export const baseURL = 'http://101.201.170.43:8080'
