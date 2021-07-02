import { reactive } from 'vue';
import db from '@/db';
import router from '@/router';
import store from '.';

import { Subreddit } from '@/typings';
const state: { subreddits: Subreddit[] } = reactive({
	subreddits: [],
});

let listener: () => void;

const actions = {
	async bindSubreddits(): Promise<void> {
		listener?.();
		listener = db
			.collection('subreddits')
			.where('approved', '==', false)
			.orderBy('created_at', 'desc')
			.onSnapshot(async (data) => {
				if (router.currentRoute.value.fullPath !== '/admin') return listener();
				state.subreddits = [];
				for (const doc of data.docs) {
					const subreddit = doc.data() as Subreddit;
					subreddit.user = (await store.users.actions.getUser(subreddit.user_id)) ?? undefined;
					state.subreddits.push(subreddit);
				}
			});
	},
	async denySubreddit(id: string): Promise<void> {
		db.collection('subreddits')
			.doc(id)
			.delete();
	},
	async approveSubreddit(id: string): Promise<void> {
		db.collection('subreddits')
			.doc(id)
			.update({ approved: true });
	},
};

export default {
	state,
	actions,
};
