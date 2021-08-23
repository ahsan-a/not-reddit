import { reactive } from 'vue';
import { User, Post, Comment } from '@/typings';
import { firestore } from '@/db';
import router from '@/router';
import store from '@/store';
import firebase from '@/firebase';

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

		listeners.posts = firestore
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
		listeners.comments = firestore
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

					const subreddit = await store.subreddits.actions.getSubreddit({id: post.subreddit_id});
					if (subreddit) comment.subreddit = subreddit;
					else continue;

					commentsToUpdate.push(comment);
				}

				store.user.state.comments = commentsToUpdate;
			});
	},

	async updateProfile(profile: { name: string; image: string; about: string; admin: boolean; id: string }): Promise<boolean | void> {
		const body: { [index: string]: any } = {
			name: profile.name,
			image: profile.image,
			admin: profile.admin,
			about: profile.about,
			user_id: store.auth.state.user?.id || '',
			id_token: (await firebase.auth().currentUser?.getIdToken()) || '',
		};

		if (store.auth.state.user?.admin) body.target_id = profile.id;

		const res = await fetch(`${process.env.VUE_APP_backend}user/update`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})
			.then((res) => res.json())
			.catch((e) => alert(e));

		if (!res.success) return alert(res.error);

		state.currentUser = await store.users.actions.getUser(profile.id, true);

		return true;
	},
};

export default { state, actions };
