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
		component: () => import('@/views/Subreddit/Subreddit.vue'),
	},
	{
		path: '/options/r/:name',
		name: 'Subreddit Options',
		component: () => import('@/views/Subreddit/Options.vue'),
	},
	{
		path: '/create/:r?/:name?',
		name: 'Create Post',
		component: () => import('@/views/CreatePost.vue'),
	},
	{
		path: '/r/:subreddit/:id/:comment?',
		name: 'Post',
		component: () => import('@/views/Post.vue'),
	},
	{
		path: '/u/:id/:page?',
		name: 'User',
		component: () => import('@/views/User.vue'),
	},
	{
		path: '/not-admin',
		name: 'Admin',
		component: () => import('@/views/Admin.vue'),
	},
	{
		path: '/notifications',
		name: 'Notifications',
		component: () => import('@/views/Notifications.vue'),
	},
	{
		path: '/about',
		name: 'About',
		component: () => import('@/views/about/Index.vue'),
	},
	{
		path: '/about/privacy',
		name: 'Privacy Policy',
		component: () => import('@/views/about/Privacy.vue'),
	},
	{
		path: '/about/guidelines',
		name: 'Guidelines',
		component: () => import('@/views/about/Guidelines.vue'),
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
