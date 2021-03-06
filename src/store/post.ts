import { reactive } from 'vue';
// import firebase from '@/firebase';
import { firestore } from '@/db';
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
		state.currentPost = {};
		let post = await store.subreddit.actions.getPost(id);

		if (!post) {
			const dbPost = await firestore
				.collection('posts')
				.doc(id)
				.get();
			if (!dbPost.exists) return router.push({ path: '/404' });
			post = dbPost.data() as Post;

			post.user = store.users.state.users.find((x) => x.id === post?.user_id);

			if (!post.user) {
				const dbUser = await firestore
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
	async bindComments(post_id: string): Promise<any> {
		commentsSnapshot?.();
		commentsSnapshot = firestore
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
		if (!comment.deleted) {
			const user = await store.users.actions.getUser(comment.user_id);
			if (!user) comment.deletedUser = true;
			else comment.user = user;
		}

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
			.catch((e) => {
				alert(e);
				return false;
			});

		if (!data?.success) alert(`Server Error: ${data.error}`);
		return Boolean(data?.success);
	},
	async deleteComment(id: string): Promise<any> {
		const data = await fetch(`${process.env.VUE_APP_backend}comment/deleteComment`, {
			method: 'post',
			body: JSON.stringify({
				id,
				id_token: (await firebase.auth().currentUser?.getIdToken()) || '',
				user_id: store.auth.state.user?.id,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.catch((e) => {
				console.log(e);
			});

		if (!data?.success) alert(`Server Error: ${data.error}`);
		return Boolean(data.success);
	},
	async deletePost(id: string): Promise<any> {
		const data = await fetch(`${process.env.VUE_APP_backend}post/deletePost`, {
			method: 'post',
			body: JSON.stringify({
				id,
				id_token: (await firebase.auth().currentUser?.getIdToken()) || '',
				user_id: store.auth.state.user?.id,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.catch((e) => {
				console.log(e);
			});

		if (!data?.success) alert(`Server Error: ${data.error}`);
	},
};

export default {
	state,
	actions,
};
