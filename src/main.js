import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)  // 只创建一个 Vue 实例
app.use(router)  // 挂载 Vue Router
app.mount('#app')  // 挂载应用