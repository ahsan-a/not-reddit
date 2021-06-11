import { reactive } from 'vue';

import auth from './auth';
import subreddits from './subreddits';

const store = reactive({
	auth,
	subreddits,
});

export default store;
