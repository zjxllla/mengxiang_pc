import axios from 'axios'
const instance = axios.create({
  // baseURL: 'http://101.201.170.43:8080',
  baseURL: 'http://localhost:8080',
  timeout: 5000,
})
export default instance
export const baseURL = 'http://101.201.170.43:8080'
