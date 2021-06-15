import { reactive } from 'vue';

import auth from './auth';
import subreddits from './subreddits';
import subreddit from './subreddit';

const store = reactive({
	auth,
	subreddits,
	subreddit,
});

export default store;
