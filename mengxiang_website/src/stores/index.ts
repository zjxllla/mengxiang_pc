import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia().use(persist)
export default pinia
export * from './modules/global'
export * from './modules/user'
export * from './modules/blog'
