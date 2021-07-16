import firebase from '@/firebase';
import { rtdb } from '@/db';
import { reactive, watch, WatchStopHandle } from 'vue';
import { Notification } from '@/typings';
import store from '.';
import router from '@/router';

const state: { notifications: Notification[]; newNotifs: boolean } = reactive({
	notifications: [],
	newNotifs: false,
});

let listener: undefined | ((a: firebase.database.DataSnapshot | null, b?: string | null | undefined) => any);

// for dynamic notif unread-ing
let notifWatcher: WatchStopHandle | undefined;
let previousRoute: string;

const actions = {
	async bindNotifications(user_id: string): Promise<void> {
		if (listener) return;
		listener = rtdb
			.ref(`/notifications/${user_id}`)
			.orderByChild('created_at')
			.on('value', async (snapshot) => {
				const data = await snapshot.val();

				const notifs: Notification[] = [];

				for (const index in data) {
					const notif = data[index] as Notification;

					if (notif.type !== 'interaction') continue;
					const user = await store.users.actions.getUser(notif.sent_by || '');

					if (!user) {
						notif.deletedSender = true;
						continue;
					}

					notif.sender = user;
					notifs.push(notif);
				}
				state.notifications = notifs;

				if (state.notifications.some((x) => x.unread)) state.newNotifs = true;
				else state.newNotifs = false;

				// dynamic notif unreading

				if (notifWatcher) return;

				async function notifReadHandler() {
					if (previousRoute === 'Notifications') await actions.readNotifications();
					previousRoute = router.currentRoute.value.name as string;
				}
				notifReadHandler();

				notifWatcher = watch(router.currentRoute, notifReadHandler);
			});
	},
	async deleteNotification(id: string): Promise<void> {
		const data = await fetch(`${process.env.VUE_APP_backend}notification/deleteNotification`, {
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

		if (!data?.success) alert(`Server Error: ${data?.error}`);
	},

	async readNotifications(): Promise<void> {
		const data = await fetch(`${process.env.VUE_APP_backend}notification/readNotifications`, {
			method: 'post',
			body: JSON.stringify({
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

		if (!data?.success) alert(`Server Error: ${data?.error}`);
	},
};

export default {
	state,
	actions,
};
