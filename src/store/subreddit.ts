import firebase from '../firebase';
import db from '@/db';
import { reactive } from 'vue';
import router from '@/router';
import { Post, CreatePost, Subreddit, User } from '@/typings';
import DOMPurify from 'dompurify';
import store from '.';

const posts = db.collection('posts');

interface stateType {
	subreddit: Partial<Subreddit>;
	posts: Post[];
}
const state: stateType = reactive({
	subreddit: {},
	posts: Array(),
});

function fixPurify(text: string) {
	return text.replace(/&gt;/g, '>').replace(/&lt;/g, '>');
}

const actions = {
	async createPost(post: Partial<CreatePost>): Promise<void> {
		const result = posts.doc();
		post.id = result.id;
		post.subreddit_id = state.subreddit.id;
		post.user_id = firebase.auth().currentUser?.uid;
		post.created_at = firebase.firestore.FieldValue.serverTimestamp();
		post.updated_at = firebase.firestore.FieldValue.serverTimestamp();
		if (post.content) post.content = fixPurify(DOMPurify.sanitize(post.content));
		await posts.doc(post.id).set(post);
	},

	async bindSubreddits(name: string): Promise<any> {
		const subInSubreddits = store.subreddits.state.subreddits.find((x) => x.name === name);
		if (subInSubreddits) {
			state.subreddit = subInSubreddits;
		} else {
			let subreddit: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData> | Subreddit = await db
				.collection('subreddits')
				.where('name', '==', name)
				.get();

			if (subreddit.empty) return router.push({ path: '/404' });
			subreddit = subreddit.docs[0].data() as Subreddit;
			state.subreddit = subreddit;
		}

		state.posts = [];
		const serverPosts = await posts
			.orderBy('created_at', 'desc')
			.where('subreddit_id', '==', state.subreddit.id)
			.get();

		const postsToUpdate: Post[] = [];
		for (let i = 0; i < serverPosts.docs.length; i++) {
			const post = serverPosts.docs[i].data();
			if (post.content) post.content = fixPurify(DOMPurify.sanitize(post.content));

			const potentialUser = store.users.state.users.find((x) => x.id === post.user_id);
			if (potentialUser) {
				post.user = potentialUser;
			} else {
				post.user = {};
				const user = await db
					.collection('users')
					.doc(post.user_id)
					.get();

				if (!user.exists) {
					post.user.name = '[deleted]';
				} else {
					post.user = user.data();
					store.users.state.users.push(user.data() as User);
				}
			}

			postsToUpdate.push(post as Post);
		}

		state.posts = postsToUpdate;
	},
};

export default {
	state,
	actions,
};
