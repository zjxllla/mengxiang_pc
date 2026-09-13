import { createApp } from 'vue'
import pinia from './stores/index'
import App from './App.vue'
import router from './router'
import './style/main.css'
import './assets/iconfonts/iconfont.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
