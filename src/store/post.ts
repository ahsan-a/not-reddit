import { reactive } from 'vue';
// import firebase from '@/firebase';
import db from '@/db';
import store from '.';
import { Post, User, Comment } from '@/typings';
import router from '@/router';
import firebase from '@/firebase';

interface CreateComment {
	content: string;
	parent_id: string | null;
	post_id: string;
	subreddit_id: string;
	user_id: string;
	id_token?: string;
}
interface State {
	currentPost: Partial<Post>;
}
const state: State = reactive({
	currentPost: {},
});

let commentsSnapshot: () => void;

const actions = {
	async getPost(id: string, bindComments?: boolean, setTitle?: boolean): Promise<any> {
		let post = store.subreddit.state.allPosts.find((x) => x.id === id) || store.subreddit.state.posts.find((x) => x.id === id);

		if (!post) {
			const dbPost = await db
				.collection('posts')
				.doc(id)
				.get();
			if (!dbPost.exists) return router.push({ path: '/404' });
			post = dbPost.data() as Post;

			post.user = store.users.state.users.find((x) => x.id === post?.user_id);

			if (!post.user) {
				const dbUser = await db
					.collection('users')
					.doc(post.user_id)
					.get();

				if (!dbUser.exists) {
					post.deletedUser = true;
				} else {
					post.user = dbUser.data() as User;
					store.users.state.users.push(dbUser.data() as User);
				}
			}
		}
		state.currentPost = post;
		if (setTitle) document.title = `${state.currentPost.title} | (not) reddit`;
		if (bindComments) this.bindComments(id);
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
	async bindComments(post_id: string): Promise<any> {
		commentsSnapshot?.();
		commentsSnapshot = db
			.collection('comments')
			.where('post_id', '==', post_id)
			.orderBy('created_at', 'desc')
			.onSnapshot(async (dbComments) => {
				const allComments = dbComments.docs.map((comment) => comment.data() as Comment);

				const comments: Comment[] = allComments.filter((comment) => !comment.parent_id);

				for (let comment of comments) {
					comment.comments = [];
					comment = await this.getCommentChild(comment, allComments);
				}

				state.currentPost.comments = comments;
			});
	},

	async getCommentChild(comment: Comment, allComments: Comment[]): Promise<any> {
		const user = await store.users.actions.getUser(comment.user_id);
		if (!user) comment.deletedUser = true;
		else comment.user = user;

		const comments = allComments.filter((x) => x.parent_id === comment.id);
		if (!comments.length) return comment;

		for (const subcomment of comments) {
			subcomment.comments = [];
			comment.comments?.push(await this.getCommentChild(subcomment, allComments));
		}

		return comment;
	},
	async createComment(comment: CreateComment): Promise<boolean> {
		comment.id_token = (await firebase.auth().currentUser?.getIdToken()) || '';
		const data = await fetch(`${process.env.VUE_APP_backend}comment/createComment`, {
			method: 'POST',
			body: JSON.stringify(comment),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.catch((e) => alert(e));

		if (!data.success) alert(`Server Error: ${data.error}`);
		return Boolean(data.success);
	},
	async deleteComment(id: string): Promise<void> {
		const data = await db
			.collection('comments')
			.where('parent_id', '==', id)
			.get();

		if (!data.empty) {
			for (const comment of data.docs) {
				await this.deleteComment(await comment.data().id);
			}
		} else {
			await db
				.collection('comments')
				.doc(id)
				.delete();
		}

		db.collection('comments')
			.doc(id)
			.delete();
	},
};

export default {
	state,
	actions,
};
