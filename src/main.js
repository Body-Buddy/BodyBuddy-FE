import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store'
import './styles/index.css'
import '@fortawesome/fontawesome-free/css/all.css'
import tokenManager from './utils/tokenManager'

tokenManager.loadAccessToken()
tokenManager.loadRefreshToken()

createApp(App).use(router).use(store).mount('#app')
