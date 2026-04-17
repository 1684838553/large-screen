import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/global.scss'
import { initAutoFit } from './utils/autoFit'

const app = createApp(App)
app.mount('#app')

initAutoFit()
