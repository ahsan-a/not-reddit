import firebase from './firebase';
import store from './store';
import db from '@/db';
import { User } from '@/typings';

interface currentUser extends Omit<User, 'createdAt' | 'lastLoggedIn'> {
	createdAt?: firebase.firestore.FieldValue;
	lastLoggedIn?: firebase.firestore.FieldValue;
}

firebase.auth().onAuthStateChanged(async (user) => {
	if (user) {
		let currentUser: currentUser = {};
		const doc = await db
			.collection('users')
			.doc(user.uid)
			.get();

		if (!doc.exists) {
			// new user
			currentUser = {
				id: user.uid,
				email: user.email,
				name: user.displayName || 'New User',
				image: user.photoURL || 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg',
				admin: false,
				verified: user.emailVerified,
				createdAt: firebase.firestore.FieldValue.serverTimestamp(),
				lastLoggedIn: firebase.firestore.FieldValue.serverTimestamp(),
			};
			await db
				.collection('users')
				.doc(user.uid)
				.set(currentUser);
		} else {
			currentUser = doc.data();
			currentUser.lastLoggedIn = firebase.firestore.FieldValue.serverTimestamp();
			currentUser.verified = user.emailVerified;
			await db
				.collection('users')
				.doc(user.uid)
				.set(currentUser);
		}
		store.auth.mutations.setUser(currentUser);
	} else {
		store.auth.mutations.setUser(null);
	}
});
