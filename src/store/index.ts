import { reactive } from 'vue';

import auth from './auth';
import subreddits from './subreddits';
import subreddit from './subreddit';
import users from './users';
import post from './post';
import createPost from './createPost';

const store = reactive({
	auth,
	subreddits,
	subreddit,
	users,
	post,
	createPost,
});

export default store;
