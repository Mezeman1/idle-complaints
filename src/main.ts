import '@/assets/base.postcss'
import { createHead } from '@unhead/vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

const head = createHead()
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(head)
app.mount('#app')
