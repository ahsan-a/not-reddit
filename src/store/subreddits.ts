import db from '@/db';
import { reactive } from 'vue';
import firebase from '../firebase';

interface subreddit {
	approved: boolean;
	created_at: firebase.firestore.FieldValue;
	description: string;
	id: string;
	name: string;
	user_id: string;
}

const state = reactive({
	subreddits: Array(),
});
const actions = {
	async submitNewSubreddit(subreddit: subreddit): Promise<void> {
		const result = db.collection('subreddits').doc();
		subreddit.id = result.id;
		subreddit.created_at = firebase.firestore.FieldValue.serverTimestamp();

		subreddit.approved = false;

		alert('Subreddits have to  be approved by a human moderator. This may take a couple of days depending on how dead the project is.');

		await db
			.collection('subreddits')
			.doc(subreddit.id)
			.set(subreddit);
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
