import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import bmiLocales from './i18n/bmiLocales'
import router from './router/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  messages: bmiLocales,
})

const app = createApp(App)
app.use(i18n)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
