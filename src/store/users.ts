import { reactive } from 'vue';
import { User } from '@/typings';
import db from '@/db';
import firebase from '@/firebase';

interface State {
	users: User[];
}
const state: State = reactive({
	users: [],
});

const actions = {
	async getUser(id: string): Promise<User | null> {
		const user = state.users.find((x) => x.id === id);

		if (user) return user;

		const dbUser = await db
			.collection('users')
			.doc(id)
			.get();

		if (!dbUser.exists) return null;
		else {
			state.users.push(dbUser.data() as User);
			return dbUser.data() as User;
		}
	},
};

export default { state, actions };
