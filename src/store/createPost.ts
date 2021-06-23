import firebase from '../firebase';
import db from '@/db';
import { reactive, Ref } from 'vue';
import { CreatePost } from '@/typings';
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

const actions = {
	async createPost(post: Partial<CreatePost>): Promise<void> {
		const result = db.collection('posts').doc();
		post.id = result.id;
		post.created_at = firebase.firestore.FieldValue.serverTimestamp();
		post.updated_at = firebase.firestore.FieldValue.serverTimestamp();
		await db
			.collection('posts')
			.doc(post.id)
			.set(post);
	},

	purifyWithPatch: function(text: string): string {
		return DOMPurify.sanitize(text).replace(/&gt;/g, '>');
	},
};

export default {
	state,
	actions,
};
