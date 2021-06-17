import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';
import 'highlight.js/styles/nord.css';

//@ts-ignore
import Markdown from 'vue3-markdown-it';

import './firebase';
import './auth';

createApp(App)
	.use(router)
	.use(Markdown)
	.mount('#app');
