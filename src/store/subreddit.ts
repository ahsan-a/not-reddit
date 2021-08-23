import { firestore, firebase } from '@/db';
import { reactive } from 'vue';
import router from '@/router';
import { Post, Subreddit } from '@/typings';
import store from '.';

const posts = firestore.collection('posts');
interface State {
	subreddit: Partial<Subreddit>;
	posts: Post[];
	postSnapshot?: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;
	allPosts: Post[];
	scrollNotif: boolean;
	homePosts: Post[];
	menu: 'home' | 'options' | 'create' | null;
	subredditLoaded: boolean;
}

const state: State = reactive({
	subreddit: {},
	posts: [],
	allPosts: [],
	scrollNotif: false,
	homePosts: [],
	menu: null,
	subredditLoaded: false,
});

let globalListener: (() => void) | undefined;

const activeSubListener: {
	id?: string;
	listener?: () => void;
} = {};

let caching = false;

const actions = {
	async bindPosts(name: string, id?: boolean): Promise<any> {
		store.subreddit.state.subredditLoaded = false;
		if (!id) {
			let subInSubreddits = store.subreddits.state.subreddits.find((x) => x.name.toLowerCase() === name.toLowerCase());
			if (!subInSubreddits) {
				const subreddit = await firestore
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
				const subreddit = await firestore
					.collection('subreddits')
					.doc(name)
					.get();

				if (!subreddit.exists) return router.push({ path: '/404' });
				subInSubreddits = subreddit.data() as Subreddit;
			}
			state.subreddit = subInSubreddits;
		}

		store.subreddit.state.subredditLoaded = true;

		if (activeSubListener?.id !== state.subreddit.id) activeSubListener.listener?.();
		else if (activeSubListener.id === state.subreddit.id) return;

		state.posts = [];
		activeSubListener.listener = posts
			.orderBy('created_at', 'desc')
			.where('subreddit_id', '==', state.subreddit.id)
			.onSnapshot(async (serverPosts) => {
				const postsToUpdate: Post[] = [];
				for (let i = 0; i < serverPosts.docs.length; i++) {
					const post = serverPosts.docs[i].data() as Post;
					post.content = store.createPost.actions.purify(post.content);

					const user = await store.users.actions.getUser(post.user_id);
					if (user) post.user = user;
					else post.deletedUser = true;

					postsToUpdate.push(post);
				}
				state.posts = postsToUpdate;
			});
	},

	async bindAllPosts(): Promise<void> {
		if (globalListener) return;

		let firstLoad = true;
		globalListener = posts.orderBy('created_at', 'desc').onSnapshot(async (serverPosts) => {
			state.postSnapshot = serverPosts;
			const scrollNeeded = state.postSnapshot.docs.length < serverPosts.docs.length;

			// initial 8 post caching, 4 post loading
			const postsToUpdate: Post[] = [];
			for (let i = 0; i <= Math.max(Math.min(5, serverPosts.docs.length - 1), state.homePosts.length); i++) {
				const post = serverPosts.docs[i].data() as Post;
				store.createPost.actions.purify(post.content);

				postsToUpdate.push(post as Post);
			}
			state.allPosts = postsToUpdate;
			state.homePosts = postsToUpdate.slice(0, Math.max(5, state.homePosts.length));

			if (firstLoad) {
				document.addEventListener('scroll', actions.homeScrollCheck);
				firstLoad = false;
			} else if (scrollNeeded && window.innerWidth / 4 < window.scrollY) {
				state.scrollNotif = true;
			}
		});
	},

	async homeScrollCheck(): Promise<any> {
		if (!(Math.abs(window.innerHeight - (document.getElementById('sB')?.getBoundingClientRect().bottom ?? 0)) <= 1000)) return;
		if (router.currentRoute.value.name !== 'Home') return;
		if (!state.postSnapshot) return;
		if (state.homePosts.length >= state.postSnapshot?.docs.length) return;

		// by the first call, there should be 4 cached posts and 2 rendered posts. the difference should always be 2 unless there are no posts left
		// here, we assign the cached posts to our rendered posts...
		state.homePosts = state.allPosts.slice(0, Math.min(state.allPosts.length - 1));

		// ...and then proceed to canche more posts.
		const newPosts: Post[] = [];

		// removes possibility of simultaneous caching, which may render duplicate posts.
		if (!caching) {
			caching = true;
			for (let i = state.allPosts.length; i < Math.min(state.allPosts.length + 3, state.postSnapshot.docs.length); i++) {
				const post = state.postSnapshot?.docs[i].data() as Post;
				store.createPost.actions.purify(post.content);

				const user = await store.users.actions.getUser(post.user_id);
				if (!user) post.deletedUser = true;
				else post.user = user;

				newPosts.push(post as Post);
			}
			state.allPosts.push(...newPosts);
			caching = false;
		}
	},

	async getPost(id: string): Promise<Post | null> {
		let post = state.allPosts.find((x) => x.id === id) ?? state.posts.find((x) => x.id === id);
		if (post) return post;

		const dbPost = await firestore
			.collection('posts')
			.doc(id)
			.get();
		if (!dbPost.exists) return null;

		post = dbPost.data() as Post;

		const user = await store.users.actions.getUser(post.user_id);
		if (!user) post.deletedUser = true;
		else post.user = user;

		return post;
	},
};

export default {
	state,
	actions,
};
