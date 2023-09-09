import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import "./index.css";
import '@fortawesome/fontawesome-free/css/all.css'
import tokenManager from './tokenManager';

tokenManager.loadAccessToken()
tokenManager.loadRefreshToken()

createApp(App).use(router).mount('#app');
