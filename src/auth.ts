import firebase from './firebase';
import store from './store';
import { firestore } from '@/db';

firebase.auth().onAuthStateChanged(async (user) => {
	if (user) {
		let currentUser: any = {};
		const doc = await firestore
			.collection('users')
			.doc(user.uid)
			.get();

		if (!doc.exists) {
			// new user
			currentUser = {
				id: user.uid,
				name: user.displayName || 'New User',
				image: user.photoURL || 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg',
				admin: false,
				createdAt: firebase.firestore.FieldValue.serverTimestamp(),
				lastLoggedIn: firebase.firestore.FieldValue.serverTimestamp(),
				about: '',
			};
			await firestore
				.collection('users')
				.doc(user.uid)
				.set(currentUser);
		} else {
			currentUser = doc.data();
			currentUser.lastLoggedIn = firebase.firestore.FieldValue.serverTimestamp();

			await firestore
				.collection('users')
				.doc(user.uid)
				.set(currentUser);
		}
		store.auth.mutations.setUser(currentUser);
		store.notifications.actions.bindNotifications(currentUser.id);
	} else {
		store.auth.mutations.setUser(null);
	}
});
