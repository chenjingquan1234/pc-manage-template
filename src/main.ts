import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
const app = createApp(App);

import router from '@/router';
app.use(router);

// 全局组件
import appComponents from '@/components/global/index';
app.use(appComponents);



app.mount('#app')
