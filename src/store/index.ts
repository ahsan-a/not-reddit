import { reactive } from 'vue';

import auth from './auth';
import subreddits from './subreddits';
import subreddit from './subreddit';
import users from './users';
import post from './post';
import createPost from './createPost';
import admin from './admin';
import user from './user';

const store = reactive({
	auth,
	subreddits,
	subreddit,
	users,
	post,
	createPost,
	admin,
	user,
});

export default store;
