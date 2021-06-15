import firebase from '../firebase';
import db from '@/db';
import { reactive } from 'vue';
import router from '@/router';
import { Post, Subreddit } from '@/typings';
import DOMPurify from 'dompurify';

const posts = db.collection('posts');

interface stateType {
	subreddit: Partial<Subreddit>;
	posts: Post[];
}
const state: stateType = reactive({
	subreddit: {},
	posts: Array(),
});

const actions = {
	async createPost(post: Partial<Post>) {
		const result = posts.doc();
		post.id = result.id;
		post.subreddit_id = state.subreddit.id;
		post.user_id = firebase.auth().currentUser?.uid;
		post.created_at = firebase.firestore.FieldValue.serverTimestamp();
		post.updated_at = firebase.firestore.FieldValue.serverTimestamp();
		if (post.content) post.content = DOMPurify.sanitize(post.content);
		await posts.doc(post.id).set(post);
	},

	async bindSubreddits(name: string): Promise<any> {
		let subreddit: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData> | Subreddit = await db
			.collection('subreddits')
			.where('name', '==', name)
			.get();

		if (subreddit.empty) return router.push({ path: '/404' });
		subreddit = subreddit.docs[0].data() as Subreddit;
		if (subreddit.id === state.subreddit.id) return;
		state.subreddit = subreddit;

		state.posts = [];
		const serverPosts = await posts
			.orderBy('created_at', 'desc')
			.where('subreddit_id', '==', state.subreddit.id)
			.get();
		for (let i = 0; i < serverPosts.docs.length; i++) {
			const post = serverPosts.docs[i].data();
			if (post.content) post.content = DOMPurify.sanitize(post.content);
			post.user = {};
			const user = await db
				.collection('users')
				.doc(post.user_id)
				.get();

			if (!user.exists) {
				post.user.name = 'Deleted User';
			} else {
				post.user = user.data();
			}

			state.posts.push(post as Post);
		}
	},
};

export default {
	state,
	actions,
};
