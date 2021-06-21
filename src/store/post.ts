import { reactive } from 'vue';
import firebase from '@/firebase';
import db from '@/db';
import store from '.';
import { Post } from '@/typings';
import router from '@/router';

interface State {
	currentPost: Partial<Post>;
}
const state: State = reactive({
	currentPost: {},
});

const actions = {
	async getPost(id: string): Promise<any> {
		let post = store.subreddit.state.posts.find((x) => x.id === id);
		if (!post) {
			const dbPost = await db
				.collection('posts')
				.doc(id)
				.get();
			if (!dbPost.exists) return router.push({ path: '/404' });
			post = dbPost.data() as Post;
		}
		state.currentPost = post;
	},
	async deletePost(id: string): Promise<any> {
		await db
			.collection('posts')
			.doc(id)
			.delete();

		const comments = await db
			.collection('comments')
			.where('post_id', '==', id)
			.get();

		for (const comment of comments.docs) comment.ref.delete();
	},
};

export default {
	state,
	actions,
};
