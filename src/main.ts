import { createApp } from 'vue'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import DemoApp from './DemoApp.vue'

const app = createApp(DemoApp)

app.use(ElementPlus)
app.mount('#app')
