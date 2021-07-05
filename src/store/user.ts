import { reactive } from 'vue';
import { User, Post, Comment } from '@/typings';
import db from '@/db';
import router from '@/router';
import store from '@/store';

interface State {
	currentUser: User | null;
	posts: Post[];
	comments: Comment[];
	noPosts?: boolean;
	noComments?: boolean;
}
const state: State = reactive({
	currentUser: null,
	posts: [],
	comments: [],
});

interface Listeners {
	posts?: () => void;
	comments?: () => void;
}

const listeners: Listeners = {};

const actions = {
	async bindSubmissions(id: string): Promise<any> {
		state.posts = [];
		state.comments = [];
		// state.currentUser = null

		listeners.posts?.();

		listeners.posts = db
			.collection('posts')
			.where('user_id', '==', id)
			.orderBy('created_at', 'desc')
			.onSnapshot(async (data) => {
				if (router.currentRoute.value.name !== 'User') return listeners.posts?.();
				if (data.empty) return (state.noPosts = true);
				const postsToUpdate: Post[] = [];

				for (const doc of data.docs) {
					const post = doc.data() as Post;

					const user = await store.users.actions.getUser(post.user_id);
					if (user) post.user = user;
					else post.deletedUser = true;

					postsToUpdate.push(post);
				}

				store.user.state.posts = postsToUpdate;
			});

		listeners.comments?.();
		listeners.comments = db
			.collection('comments')
			.where('user_id', '==', id)
			.orderBy('created_at', 'desc')
			.onSnapshot(async (data) => {
				if (data.empty) return (state.noComments = true);

				const commentsToUpdate: Comment[] = [];

				for (const doc of data.docs) {
					const comment = doc.data() as Comment;

					const user = await store.users.actions.getUser(comment.user_id);
					if (user) comment.user = user;
					else comment.deletedUser = true;

					const post = await store.subreddit.actions.getPost(comment.post_id);
					if (post) comment.post = post;
					else continue;

					const subreddit = await store.subreddits.actions.getSubreddit((id = post.subreddit_id));
					if (subreddit) comment.subreddit = subreddit;
					else continue;

					commentsToUpdate.push(comment);
				}

				store.user.state.comments = commentsToUpdate;
			});
	},

	async updateProfile(profile: User): Promise<void> {
		const dbUser = await db
			.collection('users')
			.doc(profile.id)
			.get();
		if (!dbUser.exists) return;

		await db
			.collection('users')
			.doc(profile.id)
			.set(profile)
			.then(() => alert('Updated user.'))
			.catch(() => alert('An error occurred.'));
	},
};

export default { state, actions };
