import { reactive } from 'vue';
import firebase from '@/firebase';

const state = reactive({
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
	setUser(user: firebase.auth.UserMetadata | null) {
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
