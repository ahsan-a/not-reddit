import { reactive } from 'vue';
import { User } from '@/typings';

interface State {
	users: User[];
}
const state: State = reactive({
	users: [],
});

export default { state };
