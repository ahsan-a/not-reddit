import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';
import 'highlight.js/styles/nord.css';

//@ts-ignore
import Markdown from 'vue3-markdown-it';

import VueCustomTooltip from '@adamdehaven/vue-custom-tooltip';

import './firebase';
import './auth';

createApp(App)
	.use(router)
	.use(Markdown)
	.use(VueCustomTooltip, {
		color: '#E5E9F0',
		background: '#434C5E',
		name: 'tip',
		borderRadius: 10,
	})
	.mount('#app');
