import db from '@/db';
import { reactive } from 'vue';
import firebase from '../firebase';
import { Subreddit } from '@/typings';

const state = reactive({
	subreddits: Array(),
});
const actions = {
	async submitNewSubreddit(subreddit: Partial<Subreddit>): Promise<void> {
		const result = db.collection('subreddits').doc();
		subreddit.id = result.id;
		subreddit.created_at = firebase.firestore.FieldValue.serverTimestamp();

		subreddit.approved = false;
		await db
			.collection('subreddits')
			.doc(subreddit.id)
			.set(subreddit);

		alert('Subreddits have to be approved by a human moderator. Contact ahsan#4403 if you want a higher chance of approval.');
	},
	async bindSubreddits(): Promise<void> {
		db.collection('subreddits')
			.where('approved', '==', true)
			.orderBy('created_at')
			.onSnapshot((data) => {
				state.subreddits = [];
				for (const doc of data.docs) {
					state.subreddits.push(doc.data());
				}
			});
	},
};

export default { state, actions };
