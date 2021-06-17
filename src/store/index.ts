import { reactive } from 'vue';

import auth from './auth';
import subreddits from './subreddits';
import subreddit from './subreddit';
import users from './users';

const store = reactive({
	auth,
	subreddits,
	subreddit,
	users,
});

export default store;
