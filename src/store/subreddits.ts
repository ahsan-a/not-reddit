import db from '@/db';
import { reactive } from 'vue';
import firebase from '../firebase';
import { Subreddit } from '@/typings';

interface State {
	subreddits: Subreddit[];
	snapshot?: () => void;
}
const state: State = reactive({
	subreddits: [],
});

interface CreateSubreddit {
	name: string;
	description: string;
	user_id: string;
	image?: string;
	id_token?: string;
}
const actions = {
	async submitNewSubreddit(subreddit: CreateSubreddit): Promise<void> {
		subreddit.id_token = (await firebase.auth().currentUser?.getIdToken()) || '';
		const data = await fetch(`${process.env.VUE_APP_backend}subreddit/createSubreddit`, {
			method: 'POST',
			body: JSON.stringify(subreddit),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.catch((e) => alert(e));

		if (data.success) alert('Subreddits have to be approved by a human moderator. Contact ahsan#4403 if you want a higher chance of approval.');
		else alert(`Server Error: ${data.error}`);
	},
	async bindSubreddits(): Promise<void> {
		if (state.snapshot) return;
		state.snapshot = db
			.collection('subreddits')
			.where('approved', '==', true)
			.orderBy('created_at')
			.onSnapshot((data) => {
				state.subreddits = [];
				for (const doc of data.docs) {
					state.subreddits.push(doc.data() as Subreddit);
				}
			});
	},

	async getSubreddit(id?: string, name?: string): Promise<Subreddit | null> {
		if (id) {
			const subreddit = state.subreddits.find((x) => x.id === id);
			if (subreddit) return subreddit;

			const dbSubreddit = await db
				.collection('subreddits')
				.doc(id)
				.get();

			if (!dbSubreddit.exists) return null;
			return dbSubreddit.data() as Subreddit;
		} else if (name) {
			const subreddit = state.subreddits.find((x) => x.name === name);
			if (subreddit) return subreddit;

			const dbSubreddit = await db
				.collection('subreddits')
				.where('name', '==', name)
				.get();

			if (dbSubreddit.empty) return null;
			return dbSubreddit.docs[0].data() as Subreddit;
		}

		return null;
	},
};

export default { state, actions };
