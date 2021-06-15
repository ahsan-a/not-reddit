import { reactive } from 'vue';
import firebase from '@/firebase';

export interface User {
	admin?: boolean;
	createdAt?: firebase.firestore.Timestamp;
	id?: string;
	image?: string;
	lastLoggedIn?: firebase.firestore.Timestamp;
	name?: string;
	verified?: boolean;
}
interface authState {
	isLoggedIn: boolean;
	user: User;
}
const state: authState = reactive({
	isLoggedIn: false,
	user: {},
});

const actions = {
	async loginPrompt(provider: firebase.auth.AuthProvider): Promise<boolean | firebase.auth.AuthError> {
		try {
			await firebase.auth().signInWithPopup(provider);
			return true;
		} catch (e) {
			return e;
		}
	},
};

const mutations = {
	setUser(user: User | null): void {
		if (user) {
			state.user = user;
			state.isLoggedIn = true;
		} else {
			state.user = {};
			state.isLoggedIn = false;
		}
	},
};

export default {
	state,
	actions,
	mutations,
};
