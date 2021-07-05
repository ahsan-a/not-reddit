import { User } from '@/typings';
import { reactive } from 'vue';
import firebase from '@/firebase';

interface authState {
	isLoggedIn: boolean;
	user?: User;
}
const state: authState = reactive({
	isLoggedIn: false,
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
			state.user = undefined;
			state.isLoggedIn = false;
		}
	},
};

export default {
	state,
	actions,
	mutations,
};
