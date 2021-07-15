import { reactive } from 'vue';
import { firestore } from '@/db';
import router from '@/router';
import store from '.';
import firebase from '@/firebase';

import { Subreddit } from '@/typings';
const state: { subreddits: Subreddit[] } = reactive({
	subreddits: [],
});

let listener: () => void;

const actions = {
	async bindSubreddits(): Promise<void> {
		listener?.();
		listener = firestore
			.collection('subreddits')
			.where('approved', '==', false)
			.orderBy('created_at', 'desc')
			.onSnapshot(async (data) => {
				if (router.currentRoute.value.name !== 'Admin') return listener();
				state.subreddits = [];
				for (const doc of data.docs) {
					const subreddit = doc.data() as Subreddit;
					subreddit.user = (await store.users.actions.getUser(subreddit.user_id)) ?? undefined;
					state.subreddits.push(subreddit);
				}
			});
	},
	async denySubreddit(id: string): Promise<void> {
		const res = await fetch(`${process.env.VUE_APP_backend}subreddit/admin/deny`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id, user_id: store.auth.state.user?.id || '', id_token: (await firebase.auth().currentUser?.getIdToken()) || '' }),
		})
			.then((res) => res.json())
			.catch((e) => alert(e));
		if (res.success === false) alert(res.error);
	},
	async approveSubreddit(id: string): Promise<void> {
		const res = await fetch(`${process.env.VUE_APP_backend}subreddit/admin/approve`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id, user_id: store.auth.state.user?.id || '', id_token: (await firebase.auth().currentUser?.getIdToken()) || '' }),
		})
			.then((res) => res.json())
			.catch((e) => alert(e));

		if (res.success === false) alert(res.error);
	},
};

export default {
	state,
	actions,
};
