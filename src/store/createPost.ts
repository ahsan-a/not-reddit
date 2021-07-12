import firebase from '../firebase';
// import db from '@/db';
import { reactive } from 'vue';
import DOMPurify from 'dompurify';
// import store from '.';

const state = reactive({
	newPost: {
		subreddit: 'r/General',
		title: '',
		content: '',
	},
	fullscreen: false,
});
interface CreatePost {
	title: string;
	content: string;
	subreddit_id: string;
	user_id: string;
	id_token?: string;
}

const actions = {
	async createPost(post: Partial<CreatePost>): Promise<boolean> {
		post.id_token = (await firebase.auth().currentUser?.getIdToken()) || '';
		const data = await fetch(`${process.env.VUE_APP_backend}post/createPost`, {
			method: 'POST',
			body: JSON.stringify(post),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.catch((e) => alert(e));

		if (!data.success) alert(`Server Error: ${data.error}`);
		return Boolean(data.success);
	},

	purify: (text: string): string => DOMPurify.sanitize(text),
};

export default {
	state,
	actions,
};
