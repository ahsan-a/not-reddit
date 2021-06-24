import db from '@/db';
import { reactive, Ref } from 'vue';
import router from '@/router';
import { Post, Subreddit } from '@/typings';
import store from '.';

const posts = db.collection('posts');
interface stateType {
	subreddit: Partial<Subreddit>;
	posts: Post[];
	allPosts: Post[];
	scrollNotif: boolean;
}

const state: stateType = reactive({
	subreddit: {},
	posts: [],
	allPosts: [],
	scrollNotif: false,
});

let globalListener: () => void | undefined;

const activeSubListener: {
	id?: string;
	listener?: () => void;
} = {};

const actions = {
	async bindPosts(name: string, id?: boolean): Promise<any> {
		if (!id) {
			let subInSubreddits = store.subreddits.state.subreddits.find((x) => x.name.toLowerCase() === name.toLowerCase());
			if (!subInSubreddits) {
				const subreddit = await db
					.collection('subreddits')
					.where('name_lowercase', '==', name.toLowerCase())
					.get();

				if (subreddit.empty) return router.push({ path: '/404' });
				subInSubreddits = subreddit.docs[0].data() as Subreddit;
			}
			state.subreddit = subInSubreddits;
		} else {
			let subInSubreddits = store.subreddits.state.subreddits.find((x) => x.id === name);
			if (!subInSubreddits) {
				const subreddit = await db
					.collection('subreddits')
					.doc(name)
					.get();

				if (!subreddit.exists) return router.push({ path: '/404' });
				subInSubreddits = subreddit.data() as Subreddit;
			}
			state.subreddit = subInSubreddits;
		}

		if (activeSubListener?.id !== state.subreddit.id) activeSubListener.listener?.();
		else if (activeSubListener.id === state.subreddit.id) return;

		globalListener?.();

		state.posts = [];
		let firstLoad = true;
		activeSubListener.listener = posts
			.orderBy('created_at', 'desc')
			.where('subreddit_id', '==', state.subreddit.id)
			.onSnapshot(async (serverPosts) => {
				const postsToUpdate: Post[] = [];
				for (let i = 0; i < serverPosts.docs.length; i++) {
					const post = serverPosts.docs[i].data();
					if (post.content) post.content = store.createPost.actions.purifyWithPatch(post.content);

					const user = await store.users.actions.getUser(post.user_id);
					if (user) post.user = user;
					else post.deletedUser = true;

					postsToUpdate.push(post as Post);
				}

				if (firstLoad) firstLoad = false;
				else if (postsToUpdate.length > state.posts.length && window.innerWidth / 4 < window.scrollY) state.scrollNotif = true;

				state.posts = postsToUpdate;
			});
	},

	async bindAllPosts(): Promise<void> {
		if (state.subreddit?.id) {
			state.subreddit = {};
			state.posts = [];
		}
		if (activeSubListener.listener) activeSubListener.listener();
		let firstLoad = true;
		globalListener = posts.orderBy('created_at', 'desc').onSnapshot(async (serverPosts) => {
			if (router.currentRoute.value.fullPath !== '/') return globalListener?.();

			const postsToUpdate: Post[] = [];
			for (let i = 0; i < serverPosts.docs.length; i++) {
				const post = serverPosts.docs[i].data();
				post.user = {};
				if (post.content) post.content = store.createPost.actions.purifyWithPatch(post.content);

				const user = await store.users.actions.getUser(post.user_id);
				if (!user) post.deletedUser = true;
				else post.user = user;

				postsToUpdate.push(post as Post);
			}
			state.allPosts = postsToUpdate;
			state.posts = state.allPosts.slice(0, state.posts.length - 1);

			if (firstLoad) {
				state.posts = state.allPosts.slice(0, 5);
				document.addEventListener('scroll', actions.homeScrollCheck);
				firstLoad = false;
			} else if (postsToUpdate.length > state.posts.length && window.innerWidth / 4 < window.scrollY) {
				state.scrollNotif = true;
			}
		});
	},

	async homeScrollCheck(): Promise<any> {
		if (!(Math.abs(window.innerHeight - (document.getElementById('sB')?.getBoundingClientRect().bottom ?? 0)) <= 1000)) return;
		if (router.currentRoute.value.fullPath !== '/') return document.removeEventListener('scroll', actions.homeScrollCheck);

		state.posts = state.allPosts.slice(0, state.posts.length + 4);
	},
};

export default {
	state,
	actions,
};
