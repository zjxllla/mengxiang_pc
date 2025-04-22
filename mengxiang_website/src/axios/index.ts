import axios from 'axios'
const instance = axios.create({
  baseURL: 'http://8.140.27.245:8080',
  timeout: 5000,
})
export default instance
