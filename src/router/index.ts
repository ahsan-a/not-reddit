import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Home',
		component: () => import('@/views/Home.vue'),
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/views/Login.vue'),
	},
	{
		path: '/subreddits',
		name: 'Subreddits',
		component: () => import('@/views/Subreddits.vue'),
	},
	{
		path: '/r/:name',
		name: 'Subreddit',
		component: () => import('@/views/Subreddit.vue'),
	},
	{
		path: '/r/:subreddit/:id',
		name: 'Post',
		component: () => import('@/views/Post.vue'),
	},

	{
		path: '/:catchAll(.*)',
		name: '404',
		component: () => import('@/views/404.vue'),
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
