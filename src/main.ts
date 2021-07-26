import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'windi.css';
import 'highlight.js/styles/nord.css';

import VueCustomTooltip from '@adamdehaven/vue-custom-tooltip';

import './firebase';
import './auth';

createApp(App)
	.use(router)
	.use(VueCustomTooltip, {
		color: '#E5E9F0',
		background: '#434C5E',
		name: 'tip',
		borderRadius: 10,
	})
	.mount('#app');
