import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';

import './firebase';
import './auth';

createApp(App)
	.use(router)
	.mount('#app');
