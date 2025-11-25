import { createApp } from 'vue'
import './style.css'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes.js'
import naive from 'naive-ui'

const head = createHead()

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)

app.use(naive)
app.use(head)
app.use(router)

app.mount('#app')

