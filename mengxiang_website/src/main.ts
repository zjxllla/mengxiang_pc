import { createApp } from 'vue'
import pinia from './stores/index'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import vSlidein from './Instruction/vSlidein'

const app = createApp(App)

app.directive('slidein', vSlidein)
app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
